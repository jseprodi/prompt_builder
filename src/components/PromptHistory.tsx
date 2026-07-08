import type { AgentType, PromptHistoryEntry } from "../types";

interface PromptHistoryProps {
  entries: PromptHistoryEntry[];
  onLoad: (entry: PromptHistoryEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function agentLabel(agentType: AgentType): string {
  return agentType === "aiko" ? "Aiko" : "Expert Agent";
}

export function PromptHistory({ entries, onLoad, onRemove, onClear }: PromptHistoryProps) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <section className="history-panel" aria-labelledby="history-heading">
      <div className="history-header">
        <h2 id="history-heading" className="section-title">
          Recent prompts
        </h2>
        <button type="button" className="btn btn-text" onClick={onClear}>
          Clear all
        </button>
      </div>
      <p className="history-note">
        Saved locally in your browser only — not shared or synced across devices.
      </p>
      <ul className="history-list">
        {entries.map((entry) => (
          <li key={entry.id} className="history-item">
            <div className="history-item-meta">
              <span className="history-badge">{agentLabel(entry.agentType)}</span>
              <time dateTime={entry.createdAt}>{formatDate(entry.createdAt)}</time>
            </div>
            <p className="history-label">{entry.label}</p>
            <div className="history-actions">
              <button type="button" className="btn btn-secondary btn-small" onClick={() => onLoad(entry)}>
                Load
              </button>
              <button
                type="button"
                className="btn btn-text btn-small"
                onClick={() => onRemove(entry.id)}
                aria-label={`Remove prompt from ${formatDate(entry.createdAt)}`}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
