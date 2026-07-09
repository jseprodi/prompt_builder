import type {
  AgentType,
  AikoFormData,
  ChangeStatus,
  ClientValidationIssue,
  ExpertAgentFormData,
} from "../../types";
import type { RefinementRuleId } from "../../types/refinement";

const VAGUE_SCOPE_PATTERNS = [
  /\bsome\b/i,
  /\brecent\b/i,
  /\ba few\b/i,
  /\bvarious\b/i,
  /\betc\.?\b/i,
  /\bstuff\b/i,
  /\bthings\b/i,
];

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

function isVagueScope(scope: string): boolean {
  return VAGUE_SCOPE_PATTERNS.some((pattern) => pattern.test(scope));
}

function issue(
  ruleId: RefinementRuleId,
  field: string,
  message: string,
  severity: ChangeStatus,
): ClientValidationIssue {
  return { ruleId, field, message, severity };
}

export function validateAikoInput(data: AikoFormData): ClientValidationIssue[] {
  const issues: ClientValidationIssue[] = [];
  const hasDraft = !isBlank(data.draft);
  const hasStructuredInput =
    !isBlank(data.action) || !isBlank(data.contentScope) || data.intent !== "";

  if (!hasDraft && !hasStructuredInput) {
    issues.push(
      issue(
        "FORM_INPUT_REQUIRED",
        "form",
        "Provide structured fields or paste a draft prompt to refine.",
        "warning",
      ),
    );
  }

  if (!hasDraft || !isBlank(data.action)) {
    if (isBlank(data.action)) {
      issues.push(
        issue(
          "AIKO_ACTION_REQUIRED",
          "action",
          "Action is missing — state what should happen (verb-first).",
          "warning",
        ),
      );
    }
  }

  if (!hasDraft || !isBlank(data.contentScope)) {
    if (isBlank(data.contentScope)) {
      issues.push(
        issue(
          "AIKO_SCOPE_REQUIRED",
          "contentScope",
          "Content scope is missing — specify which items or types apply.",
          "warning",
        ),
      );
    } else if (isVagueScope(data.contentScope)) {
      issues.push(
        issue(
          "AIKO_SCOPE_SPECIFICITY",
          "contentScope",
          "Content scope looks vague — prefer named content types, taxonomies, or date ranges.",
          "info",
        ),
      );
    }
  }

  if (!hasDraft || data.intent !== "") {
    if (data.intent === "") {
      issues.push(
        issue(
          "AIKO_INTENT_CLARITY",
          "intent",
          "Intent is ambiguous — clarify whether Aiko should suggest or take direct action.",
          "warning",
        ),
      );
    }
  }

  return issues;
}

export function validateExpertInput(data: ExpertAgentFormData): ClientValidationIssue[] {
  const issues: ClientValidationIssue[] = [];
  const hasDraft = !isBlank(data.draft);
  const hasStructuredInput =
    !isBlank(data.goal) ||
    !isBlank(data.trigger) ||
    !isBlank(data.guardrails) ||
    !isBlank(data.escalation);

  if (!hasDraft && !hasStructuredInput) {
    issues.push(
      issue(
        "FORM_INPUT_REQUIRED",
        "form",
        "Provide structured fields or paste a draft prompt to refine.",
        "warning",
      ),
    );
  }

  if (!hasDraft || !isBlank(data.goal)) {
    if (isBlank(data.goal)) {
      issues.push(
        issue(
          "EXPERT_GOAL_REQUIRED",
          "goal",
          "Goal is missing — describe the agent's purpose in one short sentence.",
          "warning",
        ),
      );
    } else if (data.goal.split(/[.!?]/).filter((s) => s.trim()).length > 2) {
      issues.push(
        issue(
          "EXPERT_GOAL_FOCUS",
          "goal",
          "Goal may bundle multiple objectives — consider one goal per agent.",
          "info",
        ),
      );
    }
  }

  if (!hasDraft || !isBlank(data.trigger)) {
    if (isBlank(data.trigger)) {
      issues.push(
        issue(
          "EXPERT_TRIGGER_REQUIRED",
          "trigger",
          "Trigger is missing — specify the workflow event that activates the agent.",
          "warning",
        ),
      );
    }
  }

  if (!hasDraft || !isBlank(data.guardrails)) {
    if (isBlank(data.guardrails)) {
      issues.push(
        issue(
          "EXPERT_GUARDRAILS_REQUIRED",
          "guardrails",
          "Guardrails are missing — define what the agent must not touch or exceed.",
          "warning",
        ),
      );
    }
  }

  if (!hasDraft || !isBlank(data.escalation)) {
    if (isBlank(data.escalation)) {
      issues.push(
        issue(
          "EXPERT_ESCALATION_REQUIRED",
          "escalation",
          "Fallback is missing — describe what happens when data is missing or ambiguous.",
          "warning",
        ),
      );
    }
  }

  return issues;
}

export function validateInput(
  agentType: AgentType,
  data: AikoFormData | ExpertAgentFormData,
): ClientValidationIssue[] {
  return agentType === "aiko"
    ? validateAikoInput(data as AikoFormData)
    : validateExpertInput(data as ExpertAgentFormData);
}
