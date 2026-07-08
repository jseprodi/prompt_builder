export type AgentType = "aiko" | "expert";

export type AikoIntent = "suggest" | "act";

export interface AikoFormData {
  action: string;
  contentScope: string;
  intent: AikoIntent | "";
  draft: string;
}

export interface ExpertAgentFormData {
  goal: string;
  trigger: string;
  guardrails: string;
  escalation: string;
  draft: string;
}

export type ChangeStatus = "success" | "warning" | "info";

export interface RefinementChange {
  status: ChangeStatus;
  message: string;
}

export interface RefinementResult {
  refinedPrompt: string;
  changes: RefinementChange[];
}

export interface PromptHistoryEntry {
  id: string;
  agentType: AgentType;
  refinedPrompt: string;
  createdAt: string;
  label: string;
}

export interface ClientValidationIssue {
  field: string;
  message: string;
  severity: ChangeStatus;
}
