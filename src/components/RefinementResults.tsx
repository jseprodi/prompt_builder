import type { RefinementChange } from "../types";
import { FormField } from "./FormField";
import { groupChangesByCategory } from "../services/refinement/groupChanges";
import {
  CHANGE_KIND_LABELS,
  getRefinementRule,
} from "../services/refinement/ruleRegistry";

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

const KIND_STATUS_LABEL: Record<RefinementChange["kind"], string> = {
  added: "OK",
  inferred: "~",
  flagged: "!",
};

function ChangeItem({ change }: { readonly change: RefinementChange }) {
  const rule = getRefinementRule(change.ruleId);

  return (
    <li className="change-item">
      <span
        className={STATUS_CLASS[change.status]}
        title={CHANGE_KIND_LABELS[change.kind]}
        aria-label={CHANGE_KIND_LABELS[change.kind]}
      >
        {KIND_STATUS_LABEL[change.kind]}
      </span>
      <div className="change-body">
        <div className="change-header">
          <span className="change-kind">{CHANGE_KIND_LABELS[change.kind]}</span>
          <span className="change-rule-name">{rule.name}</span>
        </div>
        <p className="change-explanation">{rule.explanation}</p>
        <p className="change-detail">{change.message}</p>
        {rule.docUrl ? (
          <a className="change-doc-link" href={rule.docUrl} target="_blank" rel="noreferrer">
            Learn more in Kontent.ai docs
          </a>
        ) : null}
      </div>
    </li>
  );
}

export function RefinementResults({
  changes,
  refinedPrompt,
  onPromptChange,
}: RefinementResultsProps) {
  const groupedChanges = groupChangesByCategory(changes);

  return (
    <section className="section section-compact stack" aria-labelledby="results-heading">
      <h2 id="results-heading" className="subheading">
        Refined prompt
      </h2>

      {groupedChanges.length > 0 ? (
        <div aria-labelledby="changes-heading">
          <h3 id="changes-heading" className="subheading">
            What changed
          </h3>
          <div className="changes-groups">
            {groupedChanges.map((group) => (
              <section
                key={group.category}
                className="changes-group"
                aria-labelledby={`changes-${group.category}`}
              >
                <h4 id={`changes-${group.category}`} className="changes-group-heading">
                  {group.category}
                </h4>
                <ul className="changes-list">
                  {group.changes.map((change) => (
                    <ChangeItem key={`${change.ruleId}-${change.message}`} change={change} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
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
