import type { RefinementChange } from "../types";
import { FormField } from "./FormField";

interface RefinementResultsProps {
  changes: RefinementChange[];
  refinedPrompt: string;
  onPromptChange: (value: string) => void;
}

const STATUS_CLASS: Record<RefinementChange["status"], string> = {
  success: "status green",
  warning: "status orange",
  info: "status blue",
};

export function RefinementResults({
  changes,
  refinedPrompt,
  onPromptChange,
}: RefinementResultsProps) {
  return (
    <section className="section section-compact stack" aria-labelledby="results-heading">
      <h2 id="results-heading" className="subheading">
        Refined prompt
      </h2>

      {changes.length > 0 ? (
        <div aria-labelledby="changes-heading">
          <h3 id="changes-heading" className="subheading">
            What changed
          </h3>
          <ul className="changes-list">
            {changes.map((change, index) => (
              <li key={`${change.status}-${index}`} className="change-item">
                <span className={STATUS_CLASS[change.status]} aria-hidden="true">
                  {change.status === "success" ? "OK" : change.status === "warning" ? "!" : "i"}
                </span>
                <span>{change.message}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <FormField
        id="refined-prompt"
        label="Edit before export"
        hint="This is your starting point — adjust anything before copying or downloading."
      >
        <textarea
          id="refined-prompt"
          className="input input-full"
          value={refinedPrompt}
          onChange={(e) => onPromptChange(e.target.value)}
          rows={6}
          aria-describedby="refined-prompt-hint"
        />
      </FormField>
    </section>
  );
}
