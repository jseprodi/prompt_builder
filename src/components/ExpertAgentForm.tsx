import type { ExpertAgentFormData } from "../types";
import { FormField } from "./FormField";

interface ExpertAgentFormProps {
  data: ExpertAgentFormData;
  onChange: (data: ExpertAgentFormData) => void;
  disabled?: boolean;
}

export function ExpertAgentForm({ data, onChange, disabled }: ExpertAgentFormProps) {
  const update = (patch: Partial<ExpertAgentFormData>) => onChange({ ...data, ...patch });

  return (
    <section className="input-form" aria-labelledby="expert-form-heading">
      <h2 id="expert-form-heading" className="section-title">
        Configure your Expert Agent
      </h2>

      <FormField
        id="expert-goal"
        label="Goal"
        hint="One short sentence about the agent's purpose. No dates, names, or item-specific details."
        required
      >
        <input
          id="expert-goal"
          type="text"
          value={data.goal}
          onChange={(e) => update({ goal: e.target.value })}
          placeholder="e.g., Flag content missing alt text before it reaches Ready to publish"
          disabled={disabled}
          aria-describedby="expert-goal-hint"
        />
      </FormField>

      <FormField
        id="expert-trigger"
        label="Trigger"
        hint="The workflow event or state that activates this agent."
        required
      >
        <input
          id="expert-trigger"
          type="text"
          value={data.trigger}
          onChange={(e) => update({ trigger: e.target.value })}
          placeholder="e.g., When an item moves to Review step"
          disabled={disabled}
          aria-describedby="expert-trigger-hint"
        />
      </FormField>

      <FormField
        id="expert-guardrails"
        label="Scope and guardrails"
        hint="What the agent must not touch or exceed — permissions, content types, approval requirements."
        required
      >
        <textarea
          id="expert-guardrails"
          value={data.guardrails}
          onChange={(e) => update({ guardrails: e.target.value })}
          placeholder="e.g., Only review Image elements on Article content types; never publish or change workflow step"
          rows={3}
          disabled={disabled}
          aria-describedby="expert-guardrails-hint"
        />
      </FormField>

      <FormField
        id="expert-escalation"
        label="Escalation and fallback"
        hint="What happens when the agent is unsure or data is missing."
        required
      >
        <textarea
          id="expert-escalation"
          value={data.escalation}
          onChange={(e) => update({ escalation: e.target.value })}
          placeholder="e.g., Add a comment tagging the item owner and do not change content"
          rows={3}
          disabled={disabled}
          aria-describedby="expert-escalation-hint"
        />
      </FormField>

      <FormField
        id="expert-draft"
        label="Draft prompt (optional)"
        hint="Paste an existing draft and we'll restructure it into the fields above."
      >
        <textarea
          id="expert-draft"
          value={data.draft}
          onChange={(e) => update({ draft: e.target.value })}
          placeholder="Paste your rough prompt here…"
          rows={5}
          disabled={disabled}
          aria-describedby="expert-draft-hint"
        />
      </FormField>
    </section>
  );
}
