import { readFile, writeFile, listDirectory, deleteFile, searchFiles } from "./fileTools";

export async function fileAgent(action: string, payload: any) {
  switch (action) {
    case "read_file":      return readFile(payload.path);
    case "write_file":     return writeFile(payload.path, payload.content);
    case "list_directory": return listDirectory(payload.path);
    case "delete_file":    return deleteFile(payload.path);
    case "search_files":   return searchFiles(payload.path, payload.query);
    default:               return { error: "Unknown file action" };
  }
}
