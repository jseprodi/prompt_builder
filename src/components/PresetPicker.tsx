import type { AgentType } from "../types";
import type { PromptPreset } from "../types/presets";

interface PresetPickerProps {
  agentType: AgentType;
  presets: PromptPreset[];
  selectedPresetId: string;
  onSelect: (presetId: string) => void;
}

export function PresetPicker({ agentType, presets, selectedPresetId, onSelect }: PresetPickerProps) {
  const availablePresets = presets.filter((preset) => preset.agentType === agentType);
  const selectedPreset = availablePresets.find((preset) => preset.id === selectedPresetId);

  if (availablePresets.length === 0) {
    return null;
  }

  return (
    <section className="section section-compact stack" aria-labelledby="preset-picker-heading">
      <div className="row-spread">
        <h2 id="preset-picker-heading" className="subheading">
          Start from a template
        </h2>
        {selectedPresetId ? (
          <button
            type="button"
            className="button secondary no-caps"
            onClick={() => onSelect("")}
          >
            Clear
          </button>
        ) : null}
      </div>

      <label className="field" htmlFor="preset-select">
        <span className="subheading" style={{ margin: 0 }}>
          Template
        </span>
        <select
          id="preset-select"
          className="input input-full"
          value={selectedPresetId}
          onChange={(e) => onSelect(e.target.value)}
        >
          <option value="">Custom — fill in the form yourself</option>
          {availablePresets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
              {preset.source === "config" ? " (custom)" : ""}
            </option>
          ))}
        </select>
      </label>

      {selectedPreset ? (
        <p className="muted" id="preset-description">
          {selectedPreset.description}
        </p>
      ) : (
        <p className="muted" id="preset-description">
          Pick a template to pre-fill the form, then customize placeholders like [Content type] before
          refining.
        </p>
      )}
    </section>
  );
}
