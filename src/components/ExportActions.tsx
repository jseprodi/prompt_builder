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
    <div className="export-actions" aria-label="Export options">
      <button type="button" className="btn btn-secondary" onClick={() => void handleCopy()} disabled={disabled}>
        Copy to clipboard
      </button>
      <button type="button" className="btn btn-primary" onClick={handleDownload} disabled={disabled}>
        Export as Markdown
      </button>
      {copyStatus ? (
        <p className="status-message" role="status" aria-live="polite">
          {copyStatus}
        </p>
      ) : null}
    </div>
  );
}
