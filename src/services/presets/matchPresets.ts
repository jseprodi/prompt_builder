import type { AgentType } from "../../types";
import type { ProjectContentType } from "../../types/contentModel";
import type { PromptPreset } from "../../types/presets";

export interface RankedPreset {
  readonly preset: PromptPreset;
  readonly matchesProject: boolean;
}

function normalizeToken(value: string): string {
  return value.trim().toLowerCase();
}

function presetDeclaresContentModel(preset: PromptPreset): boolean {
  return (preset.contentTypes?.length ?? 0) > 0 || (preset.contentTypeIds?.length ?? 0) > 0;
}

export function presetMatchesProject(
  preset: PromptPreset,
  projectContentTypes: ReadonlyArray<ProjectContentType>,
): boolean {
  if (!presetDeclaresContentModel(preset) || projectContentTypes.length === 0) {
    return false;
  }

  const projectCodenames = new Set(
    projectContentTypes.map((contentType) => normalizeToken(contentType.codename)),
  );
  const projectIds = new Set(projectContentTypes.map((contentType) => normalizeToken(contentType.id)));

  for (const codename of preset.contentTypes ?? []) {
    if (projectCodenames.has(normalizeToken(codename))) {
      return true;
    }
  }

  for (const id of preset.contentTypeIds ?? []) {
    if (projectIds.has(normalizeToken(id))) {
      return true;
    }
  }

  return false;
}

export function rankPresetsForProject(
  presets: ReadonlyArray<PromptPreset>,
  agentType: AgentType,
  projectContentTypes: ReadonlyArray<ProjectContentType>,
): RankedPreset[] {
  const forAgent = presets.filter((preset) => preset.agentType === agentType);

  const ranked = forAgent.map((preset, index) => ({
    preset,
    matchesProject: presetMatchesProject(preset, projectContentTypes),
    index,
  }));

  ranked.sort((left, right) => {
    if (left.matchesProject !== right.matchesProject) {
      return left.matchesProject ? -1 : 1;
    }

    return left.preset.label.localeCompare(right.preset.label) || left.index - right.index;
  });

  return ranked.map(({ preset, matchesProject }) => ({ preset, matchesProject }));
}
