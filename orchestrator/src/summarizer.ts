import { askLLM } from "./llm";

export async function summarizeSearch(query: string, data: any) {
  if (!data.content?.length) {
    return data.results;
  }
  const articles = data.content
    ?.slice(0, 3)
    .map((c: any) => c.text.slice(0, 800))
    .join("\n\n");

  const sources = data.results
    ?.map((r: any) => r.url)
    .slice(0, 3)
    .join("\n");
  const prompt = `
  You are LYRA, an AI research assistant.

  User query:
  ${query}

  Sources:
  ${sources}

  Using the following extrated articles and sources, summarize the key news in bullet points.

  Articles:
  ${articles}

  Return a short news summary and cite sources.
  `;

  const summary = await askLLM(prompt);

  return summary;
}
