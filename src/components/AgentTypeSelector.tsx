import type { AgentType } from "../types";

interface AgentTypeSelectorProps {
  value: AgentType;
  onChange: (value: AgentType) => void;
}

const OPTIONS: Array<{ value: AgentType; label: string }> = [
  { value: "aiko", label: "Aiko" },
  { value: "expert", label: "Expert Agent" },
];

export function AgentTypeSelector({ value, onChange }: AgentTypeSelectorProps) {
  return (
    <fieldset className="agent-selector" aria-label="Choose agent type">
      <legend className="section-title">Prompt for</legend>
      <div className="agent-tabs" role="radiogroup" aria-label="Agent type">
        {OPTIONS.map((option) => {
          const inputId = `agent-type-${option.value}`;
          const isSelected = value === option.value;

          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={`agent-tab${isSelected ? " is-selected" : ""}`}
            >
              <input
                id={inputId}
                type="radio"
                name="agent-type"
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
