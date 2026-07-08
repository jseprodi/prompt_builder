import type { AikoFormData, AikoIntent } from "../types";
import { FormField } from "./FormField";

interface AikoFormProps {
  data: AikoFormData;
  onChange: (data: AikoFormData) => void;
  disabled?: boolean;
}

const INTENT_OPTIONS: Array<{ value: AikoIntent; label: string }> = [
  { value: "suggest", label: "Suggest changes for my review" },
  { value: "act", label: "Take action directly (within permissions)" },
];

export function AikoForm({ data, onChange, disabled }: AikoFormProps) {
  const update = (patch: Partial<AikoFormData>) => onChange({ ...data, ...patch });

  return (
    <section className="input-form" aria-labelledby="aiko-form-heading">
      <h2 id="aiko-form-heading" className="section-title">
        Describe your Aiko command
      </h2>

      <FormField
        id="aiko-action"
        label="Action"
        hint='Verb-first: "translate," "audit," "tag," "rewrite."'
        required
      >
        <input
          id="aiko-action"
          type="text"
          value={data.action}
          onChange={(e) => update({ action: e.target.value })}
          placeholder="e.g., Tag items with the correct taxonomy terms"
          disabled={disabled}
          aria-describedby="aiko-action-hint"
        />
      </FormField>

      <FormField
        id="aiko-scope"
        label="Content scope"
        hint="Which items, content types, taxonomy groups, collections, or date ranges apply?"
        required
      >
        <textarea
          id="aiko-scope"
          value={data.contentScope}
          onChange={(e) => update({ contentScope: e.target.value })}
          placeholder="e.g., All Blog Post items in the Default collection created in the last 30 days"
          rows={3}
          disabled={disabled}
          aria-describedby="aiko-scope-hint"
        />
      </FormField>

      <FormField
        id="aiko-intent"
        label="Intent"
        hint="Should Aiko propose changes for you to approve, or apply changes directly?"
        required
      >
        <select
          id="aiko-intent"
          value={data.intent}
          onChange={(e) => update({ intent: e.target.value as AikoIntent | "" })}
          disabled={disabled}
          aria-describedby="aiko-intent-hint"
        >
          <option value="">Select intent…</option>
          {INTENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        id="aiko-draft"
        label="Draft prompt (optional)"
        hint="Already have something written? Paste it here and we'll restructure it into the fields above."
      >
        <textarea
          id="aiko-draft"
          value={data.draft}
          onChange={(e) => update({ draft: e.target.value })}
          placeholder="Paste your rough prompt here…"
          rows={5}
          disabled={disabled}
          aria-describedby="aiko-draft-hint"
        />
      </FormField>
    </section>
  );
}
