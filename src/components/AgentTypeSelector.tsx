import type { AgentType } from "../types";

interface AgentTypeSelectorProps {
  value: AgentType;
  onChange: (value: AgentType) => void;
}

const OPTIONS: Array<{ value: AgentType; title: string; description: string }> = [
  {
    value: "aiko",
    title: "Aiko / Main Agent",
    description: "One-off or repeatable natural-language commands you run in the moment.",
  },
  {
    value: "expert",
    title: "Expert Agent",
    description: "Persistent, goal-based agents triggered by workflow events.",
  },
];

export function AgentTypeSelector({ value, onChange }: AgentTypeSelectorProps) {
  return (
    <fieldset className="agent-selector" aria-label="Choose agent type">
      <legend className="section-title">What are you writing a prompt for?</legend>
      <div className="agent-options" role="radiogroup" aria-label="Agent type">
        {OPTIONS.map((option) => {
          const inputId = `agent-type-${option.value}`;
          const isSelected = value === option.value;

          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={`agent-option${isSelected ? " is-selected" : ""}`}
            >
              <input
                id={inputId}
                type="radio"
                name="agent-type"
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
              />
              <span className="agent-option-content">
                <span className="agent-option-title">{option.title}</span>
                <span className="agent-option-description">{option.description}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
