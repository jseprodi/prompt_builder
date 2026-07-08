import type { RefinementChange } from "../types";

interface RefinementResultsProps {
  changes: RefinementChange[];
  refinedPrompt: string;
  onPromptChange: (value: string) => void;
}

const STATUS_ICON: Record<RefinementChange["status"], string> = {
  success: "✅",
  warning: "⚠️",
  info: "ℹ️",
};

export function RefinementResults({
  changes,
  refinedPrompt,
  onPromptChange,
}: RefinementResultsProps) {
  return (
    <section className="results-panel" aria-labelledby="results-heading">
      <h2 id="results-heading" className="section-title">
        Refined prompt
      </h2>

      {changes.length > 0 ? (
        <div className="changes-summary" aria-labelledby="changes-heading">
          <h3 id="changes-heading" className="subsection-title">
            What changed
          </h3>
          <ul className="changes-list">
            {changes.map((change, index) => (
              <li key={`${change.status}-${index}`} className={`change-item change-${change.status}`}>
                <span className="change-icon" aria-hidden="true">
                  {STATUS_ICON[change.status]}
                </span>
                <span>{change.message}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <FormFieldWrapper
        id="refined-prompt"
        label="Edit before export"
        hint="This is your starting point — adjust anything before copying or downloading."
      >
        <textarea
          id="refined-prompt"
          className="refined-output"
          value={refinedPrompt}
          onChange={(e) => onPromptChange(e.target.value)}
          rows={16}
          aria-describedby="refined-prompt-hint"
        />
      </FormFieldWrapper>
    </section>
  );
}

function FormFieldWrapper({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {hint ? <p className="field-hint" id={`${id}-hint`}>{hint}</p> : null}
      {children}
    </div>
  );
}
