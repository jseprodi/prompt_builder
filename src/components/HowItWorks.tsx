import { useId, useState } from "react";

export function HowItWorks() {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="how-it-works">
      <button
        type="button"
        className="collapse-trigger"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>How this works</span>
        <span className="collapse-icon" aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
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
                For one-off or repeatable commands you run in the moment — bulk tagging, auditing,
                translating, and similar pattern-based work across multiple items.
              </dd>
            </div>
            <div>
              <dt>Expert Agent</dt>
              <dd>
                For persistent agents configured with a goal and triggered by workflow events —
                e.g., flagging issues before content reaches a publish step.
              </dd>
            </div>
          </dl>
          <p className="how-footnote">
            Best-practice rules are built into the refinement engine and reflect Kontent.ai
            guidance for effective AI prompts. The tool structures your input — it does not run the
            agent for you.
          </p>
        </div>
      ) : null}
    </div>
  );
}
