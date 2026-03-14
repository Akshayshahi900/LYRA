import fs from "fs/promises";
import path from "path";

export async function readFile(filePath: string) {
  const content = await fs.readFile(filePath, "utf-8");
  return content;
}

export async function writeFile(filePath: string, content: string) {
  await fs.writeFile(filePath, content, "utf-8");
  return "File written successfully";
}

export async function listDirectory(dirPath: string) {
  const files = await fs.readdir(dirPath);
  return files;
}

export async function deleteFile(filePath: string) {
  await fs.unlink(filePath);
  return "File deleted";
}

export async function searchFiles(dir: string, query: string) {
  const files = await fs.readdir(dir);
  return files.filter((file) => {
    file.toLowerCase().includes(query.toLowerCase());
  });
}
