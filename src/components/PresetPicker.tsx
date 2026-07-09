import type { AgentType } from "../types";
import type { ProjectContentType } from "../types/contentModel";
import type { PromptPreset } from "../types/presets";
import { rankPresetsForProject } from "../services/presets/matchPresets";

interface PresetPickerProps {
  agentType: AgentType;
  presets: PromptPreset[];
  projectContentTypes: ReadonlyArray<ProjectContentType>;
  selectedPresetId: string;
  onSelect: (presetId: string) => void;
}

function formatPresetLabel(preset: PromptPreset): string {
  const customSuffix = preset.source === "config" ? " (custom)" : "";
  return `${preset.label}${customSuffix}`;
}

export function PresetPicker({
  agentType,
  presets,
  projectContentTypes,
  selectedPresetId,
  onSelect,
}: PresetPickerProps) {
  const rankedPresets = rankPresetsForProject(presets, agentType, projectContentTypes);
  const matchedPresets = rankedPresets.filter((entry) => entry.matchesProject);
  const otherPresets = rankedPresets.filter((entry) => !entry.matchesProject);
  const selectedEntry = rankedPresets.find((entry) => entry.preset.id === selectedPresetId);
  const selectedPreset = selectedEntry?.preset;
  const hasProjectMatches = matchedPresets.length > 0;

  if (rankedPresets.length === 0) {
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
          {hasProjectMatches ? (
            <optgroup label="Matches your content model">
              {matchedPresets.map(({ preset }) => (
                <option key={preset.id} value={preset.id}>
                  {formatPresetLabel(preset)}
                </option>
              ))}
            </optgroup>
          ) : null}
          {otherPresets.length > 0 ? (
            <optgroup label={hasProjectMatches ? "Other templates" : "Templates"}>
              {otherPresets.map(({ preset }) => (
                <option key={preset.id} value={preset.id}>
                  {formatPresetLabel(preset)}
                </option>
              ))}
            </optgroup>
          ) : null}
        </select>
      </label>

      {selectedPreset ? (
        <div className="preset-description-row">
          {selectedEntry?.matchesProject ? (
            <span className="status ocean preset-match-badge">Matches your project</span>
          ) : null}
          <p className="muted" id="preset-description">
            {selectedPreset.description}
          </p>
        </div>
      ) : (
        <p className="muted" id="preset-description">
          Pick a template to pre-fill the form, then customize placeholders like [Content type] before
          refining.
          {hasProjectMatches
            ? " Templates marked as matching your project are listed first."
            : null}
        </p>
      )}
    </section>
  );
}
