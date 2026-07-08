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

function copyWithExecCommand(content: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = content;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, content.length);

  let success = false;
  try {
    success = document.execCommand("copy");
  } catch {
    success = false;
  }

  document.body.removeChild(textarea);
  return success;
}

export async function copyToClipboard(content: string): Promise<void> {
  // Prefer execCommand first — it must run synchronously during the click
  // handler, which matters inside Kontent.ai's embedded iframe.
  if (copyWithExecCommand(content)) {
    return;
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(content);
    return;
  }

  throw new Error("Copy failed");
}
