import type { AgentType } from "../types";

interface AgentTypeSelectorProps {
  value: AgentType;
  onChange: (value: AgentType) => void;
}

const OPTIONS: Array<{ value: AgentType; label: string }> = [
  { value: "aiko", label: "Aiko / Main Agent" },
  { value: "expert", label: "Expert Agent" },
];

export function AgentTypeSelector({ value, onChange }: AgentTypeSelectorProps) {
  return (
    <fieldset className="stack" aria-label="Choose agent type" style={{ border: "none", margin: 0, padding: 0 }}>
      <legend className="subheading">Prompt for</legend>
      <div className="agent-options" role="radiogroup" aria-label="Agent type">
        {OPTIONS.map((option) => {
          const inputId = `agent-type-${option.value}`;

          return (
            <label key={option.value} className="radio" htmlFor={inputId}>
              <input
                id={inputId}
                type="radio"
                name="agent-type"
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
              />
              <span className="radio-button" />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
