export type RuleCategory =
  | "Input"
  | "Action"
  | "Scope"
  | "Intent"
  | "Goal"
  | "Trigger"
  | "Guardrails"
  | "Fallback"
  | "Constraints"
  | "Agent fit";

export type RefinementRuleId =
  | "FORM_INPUT_REQUIRED"
  | "AIKO_ACTION_REQUIRED"
  | "AIKO_ACTION_STRUCTURED"
  | "AIKO_ACTION_INFERRED"
  | "AIKO_SCOPE_REQUIRED"
  | "AIKO_SCOPE_SPECIFICITY"
  | "AIKO_SCOPE_EXPLICIT"
  | "AIKO_SCOPE_INFERRED"
  | "AIKO_INTENT_CLARITY"
  | "AIKO_INTENT_CLARIFIED"
  | "AIKO_INTENT_DEFAULTED"
  | "AIKO_HUMAN_APPROVAL"
  | "AIKO_CREATIVE_TASK_FIT"
  | "EXPERT_GOAL_REQUIRED"
  | "EXPERT_GOAL_FOCUS"
  | "EXPERT_GOAL_STRUCTURED"
  | "EXPERT_GOAL_INFERRED"
  | "EXPERT_GOAL_JARGON"
  | "EXPERT_GOAL_ITEM_SPECIFIC"
  | "EXPERT_TRIGGER_REQUIRED"
  | "EXPERT_TRIGGER_DEFINED"
  | "EXPERT_TRIGGER_INFERRED"
  | "EXPERT_GUARDRAILS_REQUIRED"
  | "EXPERT_GUARDRAILS_DOCUMENTED"
  | "EXPERT_GUARDRAILS_DEFAULTED"
  | "EXPERT_ESCALATION_REQUIRED"
  | "EXPERT_ESCALATION_DEFINED"
  | "EXPERT_ESCALATION_DEFAULTED"
  | "EXPERT_HUMAN_OVERSIGHT";

export type RefinementChangeKind = "added" | "inferred" | "flagged";

export interface RefinementRuleDefinition {
  readonly id: RefinementRuleId;
  readonly name: string;
  readonly explanation: string;
  readonly category: RuleCategory;
  readonly docUrl?: string;
}
