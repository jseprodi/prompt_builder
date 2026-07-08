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

function agentStatusClass(agentType: AgentType): string {
  return agentType === "aiko" ? "status blue" : "status purple";
}

function agentLabel(agentType: AgentType): string {
  return agentType === "aiko" ? "Aiko" : "Expert Agent";
}

export function PromptHistory({ entries, onLoad, onRemove, onClear }: PromptHistoryProps) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <section className="section section-compact" aria-labelledby="history-heading">
      <div className="row-spread">
        <h2 id="history-heading" className="subheading">
          Recent prompts
        </h2>
        <button type="button" className="button secondary no-caps" onClick={onClear}>
          Clear all
        </button>
      </div>
      <p className="muted">Saved locally in your browser only — not shared or synced.</p>
      <ul className="history-list">
        {entries.map((entry) => (
          <li key={entry.id} className="history-item">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className={agentStatusClass(entry.agentType)}>{agentLabel(entry.agentType)}</span>
              <time className="history-meta" dateTime={entry.createdAt}>
                {formatDate(entry.createdAt)}
              </time>
            </div>
            <p className="history-label">{entry.label}</p>
            <div className="row">
              <button
                type="button"
                className="button secondary no-caps"
                onClick={() => onLoad(entry)}
              >
                Load
              </button>
              <button
                type="button"
                className="button destructive no-caps"
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
