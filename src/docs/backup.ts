/** Whether replacing the editor should snapshot the previous buffer. */
export function shouldBackup(prev: string, next: string, lastDoc?: { code: string }): boolean {
  if (prev.trim() === "") return false;
  if (prev === next) return false;
  if (lastDoc && lastDoc.code === prev) return false;
  return true;
}
