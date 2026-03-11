import httpx
from playwright.sync_api import sync_playwright
from playwright_stealth import stealth
from bs4 import BeautifulSoup
from urllib.parse import quote, unquote, parse_qs, urlparse
import time
import random


# -------------------------------
# LAYER 1 — DuckDuckGo Instant
# -------------------------------
def ddg_instant(query: str):

    try:
        r = httpx.get(
            "https://api.duckduckgo.com/",
            params={
                "q": query,
                "format": "json",
                "no_redirect": "1",
                "no_html": "1"
            },
            headers={"User-Agent": "LYRA"},
            timeout=8
        )

        data = r.json()

        return {
            "answer": data.get("Answer"),
            "abstract": data.get("AbstractText"),
            "source": data.get("AbstractURL"),
            "type": data.get("Type")
        }

    except Exception as e:
        return {"error": str(e)}


# -------------------------------
# LAYER 2 — DuckDuckGo HTML search
# -------------------------------
def ddg_search(query: str, max_results: int = 5):

    headers = {
        "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/122 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
    }

    try:
        r = httpx.post(
            "https://html.duckduckgo.com/html/",
            data={"q": query},
            headers=headers,
            timeout=10
        )

        soup = BeautifulSoup(r.text, "lxml")

        results = []

        for result in soup.select(".result__body")[:max_results]:

            title_tag = result.select_one(".result__title a")
            snippet_tag = result.select_one(".result__snippet")

            if not title_tag:
                continue

            href = title_tag.get("href")

            if not href:
                continue

            # unwrap ddg redirect
            if "uddg=" in href:

                real_url = unquote(
                    parse_qs(urlparse(href).query).get("uddg", [""])[0]
                )

            else:
                real_url = href
            if not real_url.startswith("http"):
              continue

            # remove ads
            if "duckduckgo.com/y.js" in real_url:
              continue

              # remove listing/category pages
              bad_patterns = [
                  "/live/",
                  "/tag/",
                  "/category/",
                  "/topics/"
              ]

            if any(p in real_url for p in bad_patterns):
                  continue
            results.append({
                "title": title_tag.get_text(strip=True),
                "url": real_url,
                "snippet": snippet_tag.get_text(strip=True) if snippet_tag else ""
            })

        return results

    except Exception as e:

        return [{"error": str(e)}]


# -------------------------------
# LAYER 3 — Page extraction
# -------------------------------
def extract_page(url: str, use_js=False):

    if not use_js:

        try:
            r = httpx.get(
                url,
                headers={
                    "User-Agent":
                    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/122 Safari/537.36"
                },
                timeout=10,
                follow_redirects=True
            )

            return clean_html(r.text)

        except Exception:
            return extract_page(url, use_js=True)

    try:

        with sync_playwright() as p:

            browser = p.chromium.launch(headless=True)

            page = browser.new_page()

            stealth(page)

            page.goto(url, wait_until="domcontentloaded", timeout=15000)

            time.sleep(random.uniform(1, 2))

            html = page.content()

            browser.close()

            return clean_html(html)

    except Exception as e:

        return f"[extract failed: {e}]"


# -------------------------------
# HTML Cleaner
# -------------------------------
def clean_html(html: str):

    soup = BeautifulSoup(html, "lxml")

    for tag in soup([
        "script", "style", "nav", "footer", "header",
        "aside", "form", "iframe", "noscript"
    ]):
        tag.decompose()

    for selector in [
        "article",
        "main",
        "[role='main']",
        ".content",
        ".article-body",
        ".post-content",
        "#content"
    ]:

        el = soup.select_one(selector)

        if el:
            return el.get_text(separator="\n", strip=True)[:4000]

    return soup.get_text(separator="\n", strip=True)[:4000]


# -------------------------------
# MAIN ENTRY
# -------------------------------
def web_search(query: str, deep=False):

    output = {
        "query": query,
        "instant": None,
        "results": [],
        "content": []
    }

    instant = ddg_instant(query)

    if instant.get("answer") or instant.get("abstract"):
        output["instant"] = instant

    results = ddg_search(query)

    output["results"] = results

    if deep and results:

        for r in results[:3]:

            url = r.get("url")

            if url and url.startswith("http"):

                content = extract_page(url)

                output["content"].append({
                    "url": url,
                    "text": content
                })

    return output
