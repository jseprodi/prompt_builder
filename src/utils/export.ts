import type { AgentType } from "../types";

export function buildExportFilename(agentType: AgentType): string {
  const date = new Date().toISOString().slice(0, 10);
  const prefix = agentType === "aiko" ? "aiko" : "expert-agent";
  return `${prefix}-prompt-${date}.md`;
}

export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(content: string): Promise<void> {
  await navigator.clipboard.writeText(content);
}
