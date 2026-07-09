import { BUILT_IN_PRESETS } from "../../data/builtInPresets";
import type { AgentType, AikoFormData, ExpertAgentFormData } from "../../types";
import type {
  AikoPresetFields,
  AppConfigWithTemplates,
  ExpertPresetFields,
  PromptPreset,
} from "../../types/presets";

const EMPTY_AIKO: AikoFormData = {
  action: "",
  contentScope: "",
  intent: "",
  draft: "",
};

const EMPTY_EXPERT: ExpertAgentFormData = {
  goal: "",
  trigger: "",
  guardrails: "",
  escalation: "",
  draft: "",
};

function isAgentType(value: unknown): value is AgentType {
  return value === "aiko" || value === "expert";
}

function isAikoIntent(value: unknown): value is AikoPresetFields["intent"] {
  return value === "suggest" || value === "act";
}

function parseStringArray(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) {
    return undefined;
  }

  const values = raw
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean);

  return values.length > 0 ? values : undefined;
}

function parseAikoFields(raw: unknown): AikoPresetFields | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const fields = raw as Record<string, unknown>;
  const action = typeof fields.action === "string" ? fields.action.trim() : "";
  const contentScope = typeof fields.contentScope === "string" ? fields.contentScope.trim() : "";
  const intent = isAikoIntent(fields.intent) ? fields.intent : "suggest";
  const draft = typeof fields.draft === "string" ? fields.draft : undefined;

  if (!action && !contentScope && !draft) {
    return null;
  }

  return { action, contentScope, intent, draft };
}

function parseExpertFields(raw: unknown): ExpertPresetFields | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const fields = raw as Record<string, unknown>;
  const goal = typeof fields.goal === "string" ? fields.goal.trim() : "";
  const trigger = typeof fields.trigger === "string" ? fields.trigger.trim() : "";
  const guardrails = typeof fields.guardrails === "string" ? fields.guardrails.trim() : "";
  const escalation = typeof fields.escalation === "string" ? fields.escalation.trim() : "";
  const draft = typeof fields.draft === "string" ? fields.draft : undefined;

  if (!goal && !trigger && !guardrails && !escalation && !draft) {
    return null;
  }

  return { goal, trigger, guardrails, escalation, draft };
}

function parseConfigPreset(raw: unknown, index: number): PromptPreset | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const entry = raw as Record<string, unknown>;
  const agentType = entry.agentType;
  if (!isAgentType(agentType)) {
    return null;
  }

  const label = typeof entry.label === "string" ? entry.label.trim() : "";
  if (!label) {
    return null;
  }

  const id =
    typeof entry.id === "string" && entry.id.trim()
      ? entry.id.trim()
      : `config-${agentType}-${index}`;
  const description =
    typeof entry.description === "string" ? entry.description.trim() : "Custom template from environment config.";

  const aikoFields = agentType === "aiko" ? parseAikoFields(entry.aiko ?? entry.fields) : null;
  const expertFields = agentType === "expert" ? parseExpertFields(entry.expert ?? entry.fields) : null;

  if (agentType === "aiko" && !aikoFields) {
    return null;
  }
  if (agentType === "expert" && !expertFields) {
    return null;
  }

  return {
    id,
    label,
    description,
    agentType,
    source: "config",
    contentTypes: parseStringArray(entry.contentTypes),
    contentTypeIds: parseStringArray(entry.contentTypeIds),
    useCases: parseStringArray(entry.useCases),
    aiko: aikoFields ?? undefined,
    expert: expertFields ?? undefined,
  };
}

export function getPresets(appConfig: unknown): PromptPreset[] {
  const config = (appConfig ?? {}) as AppConfigWithTemplates;
  const configPresets = Array.isArray(config.templates)
    ? config.templates
        .map((entry, index) => parseConfigPreset(entry, index))
        .filter((preset): preset is PromptPreset => preset !== null)
    : [];

  const builtInIds = new Set(BUILT_IN_PRESETS.map((preset) => preset.id));
  const uniqueConfigPresets = configPresets.filter((preset) => !builtInIds.has(preset.id));

  return [...BUILT_IN_PRESETS, ...uniqueConfigPresets];
}

export function getPresetsForAgent(presets: PromptPreset[], agentType: AgentType): PromptPreset[] {
  return presets.filter((preset) => preset.agentType === agentType);
}

export function applyPreset(preset: PromptPreset): {
  aiko: AikoFormData;
  expert: ExpertAgentFormData;
} {
  if (preset.agentType === "aiko" && preset.aiko) {
    return {
      aiko: {
        action: preset.aiko.action,
        contentScope: preset.aiko.contentScope,
        intent: preset.aiko.intent,
        draft: preset.aiko.draft ?? "",
      },
      expert: { ...EMPTY_EXPERT },
    };
  }

  if (preset.agentType === "expert" && preset.expert) {
    return {
      aiko: { ...EMPTY_AIKO },
      expert: {
        goal: preset.expert.goal,
        trigger: preset.expert.trigger,
        guardrails: preset.expert.guardrails,
        escalation: preset.expert.escalation,
        draft: preset.expert.draft ?? "",
      },
    };
  }

  return { aiko: { ...EMPTY_AIKO }, expert: { ...EMPTY_EXPERT } };
}

export function createEmptyFormData(agentType: AgentType): AikoFormData | ExpertAgentFormData {
  return agentType === "aiko" ? { ...EMPTY_AIKO } : { ...EMPTY_EXPERT };
}
