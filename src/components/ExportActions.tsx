import { useState } from "react";
import type { AgentType } from "../types";
import { buildExportFilename, copyToClipboard, downloadMarkdown } from "../utils/export";

interface ExportActionsProps {
  agentType: AgentType;
  content: string;
  disabled?: boolean;
}

export function ExportActions({ agentType, content, disabled }: ExportActionsProps) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const disabledClass = disabled ? "disabled" : "";

  const handleCopy = async () => {
    try {
      await copyToClipboard(content);
      setCopyStatus("Copied to clipboard");
      setTimeout(() => setCopyStatus(null), 2500);
    } catch {
      setCopyStatus("Copy failed — try downloading instead");
      setTimeout(() => setCopyStatus(null), 3000);
    }
  };

  const handleDownload = () => {
    downloadMarkdown(content, buildExportFilename(agentType));
  };

  return (
    <div className="row" aria-label="Export options" style={{ flex: 1 }}>
      <button
        type="button"
        className={`button secondary no-caps ${disabledClass}`}
        onClick={() => void handleCopy()}
        disabled={disabled}
      >
        Copy
      </button>
      <button
        type="button"
        className={`button green no-caps ${disabledClass}`}
        onClick={handleDownload}
        disabled={disabled}
      >
        Export .md
      </button>
      {copyStatus ? (
        <p className="copy-status" role="status" aria-live="polite">
          {copyStatus}
        </p>
      ) : null}
    </div>
  );
}
