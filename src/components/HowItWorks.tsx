import { useId, useState } from "react";

export function HowItWorks() {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="section section-compact info blue">
      <button
        type="button"
        className="button secondary blue no-caps"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
        style={{ width: "100%" }}
      >
        {isOpen ? "Hide how this works" : "How this works"}
      </button>

      {isOpen ? (
        <div id={panelId} className="collapse-panel">
          <p>
            Prompt Builder helps you write better prompts for Kontent.ai&apos;s two AI surfaces.
            Pick a mode, fill in the guided fields (or paste a draft), and get a structured prompt
            that follows Kontent.ai best practices.
          </p>
          <dl className="how-list">
            <div>
              <dt>Aiko / Main Agent</dt>
              <dd>
                For one-off or repeatable commands — bulk tagging, auditing, translating, and
                similar pattern-based work across multiple items.
              </dd>
            </div>
            <div>
              <dt>Expert Agent</dt>
              <dd>
                For persistent agents configured with a goal and triggered by workflow events.
              </dd>
            </div>
          </dl>
          <p className="muted">
            Best-practice rules are built into the refinement engine. The tool structures your
            input — it does not run the agent for you.
          </p>
        </div>
      ) : null}
    </div>
  );
}
