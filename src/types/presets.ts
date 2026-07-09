import type { AgentType, AikoIntent } from "../types";

export interface AikoPresetFields {
  action: string;
  contentScope: string;
  intent: AikoIntent;
  draft?: string;
}

export interface ExpertPresetFields {
  goal: string;
  trigger: string;
  guardrails: string;
  escalation: string;
  draft?: string;
}

export interface PromptPreset {
  id: string;
  label: string;
  description: string;
  agentType: AgentType;
  source: "built-in" | "config";
  /** Content type codenames this template targets (e.g. "article", "blog_post"). */
  contentTypes?: string[];
  /** Optional content type UUIDs for explicit matching. */
  contentTypeIds?: string[];
  /** Optional descriptive tags for admins; not used for project matching. */
  useCases?: string[];
  aiko?: AikoPresetFields;
  expert?: ExpertPresetFields;
}

export interface AppConfigWithTemplates {
  templates?: unknown;
}
