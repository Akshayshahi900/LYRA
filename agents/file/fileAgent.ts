import {
  readFile,
  writeFile,
  listDirectory,
  deleteFile,
  searchFiles,
} from "./fileTools";
import { askLLM } from "../../orchestrator/src/llm";
export async function fileAgent(action: string, payload: any) {
  switch (action) {
    case "read_file":
      return await readFile(payload.path);

    case "write_file":
      return await writeFile(payload.path, payload.content);

    case "list_directory":
      return await listDirectory(payload.path);

    case "delete_file":
      return await deleteFile(payload.path);

    case "search_files":
      return await searchFiles(payload.path, payload.query);

    default:
      return "Unknown file action";
  }
}
export async function summarizeFile(content: string) {
  const prompt = `
  Summarize this file concisely.
  ${content}
  `;

  const summary = await askLLM(prompt);

  return summary;
}
