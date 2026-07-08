import type {
  AgentType,
  AikoFormData,
  ClientValidationIssue,
  ExpertAgentFormData,
} from "../../types";

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

export function validateAikoInput(data: AikoFormData): ClientValidationIssue[] {
  const issues: ClientValidationIssue[] = [];
  const hasDraft = !isBlank(data.draft);
  const hasStructuredInput =
    !isBlank(data.action) || !isBlank(data.contentScope) || data.intent !== "";

  if (!hasDraft && !hasStructuredInput) {
    issues.push({
      field: "form",
      message: "Provide structured fields or paste a draft prompt to refine.",
      severity: "warning",
    });
  }

  if (!hasDraft || !isBlank(data.action)) {
    if (isBlank(data.action)) {
      issues.push({
        field: "action",
        message: "Action is missing — state what should happen (verb-first).",
        severity: "warning",
      });
    }
  }

  if (!hasDraft || !isBlank(data.contentScope)) {
    if (isBlank(data.contentScope)) {
      issues.push({
        field: "contentScope",
        message: "Content scope is missing — specify which items or types apply.",
        severity: "warning",
      });
    } else if (isVagueScope(data.contentScope)) {
      issues.push({
        field: "contentScope",
        message: "Content scope looks vague — prefer named content types, taxonomies, or date ranges.",
        severity: "info",
      });
    }
  }

  if (!hasDraft || data.intent !== "") {
    if (data.intent === "") {
      issues.push({
        field: "intent",
        message: "Intent is ambiguous — clarify whether Aiko should suggest or take direct action.",
        severity: "warning",
      });
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
    issues.push({
      field: "form",
      message: "Provide structured fields or paste a draft prompt to refine.",
      severity: "warning",
    });
  }

  if (!hasDraft || !isBlank(data.goal)) {
    if (isBlank(data.goal)) {
      issues.push({
        field: "goal",
        message: "Goal is missing — describe the agent's purpose in one short sentence.",
        severity: "warning",
      });
    } else if (data.goal.split(/[.!?]/).filter((s) => s.trim()).length > 2) {
      issues.push({
        field: "goal",
        message: "Goal may bundle multiple objectives — consider one goal per agent.",
        severity: "info",
      });
    }
  }

  if (!hasDraft || !isBlank(data.trigger)) {
    if (isBlank(data.trigger)) {
      issues.push({
        field: "trigger",
        message: "Trigger is missing — specify the workflow event that activates the agent.",
        severity: "warning",
      });
    }
  }

  if (!hasDraft || !isBlank(data.guardrails)) {
    if (isBlank(data.guardrails)) {
      issues.push({
        field: "guardrails",
        message: "Guardrails are missing — define what the agent must not touch or exceed.",
        severity: "warning",
      });
    }
  }

  if (!hasDraft || !isBlank(data.escalation)) {
    if (isBlank(data.escalation)) {
      issues.push({
        field: "escalation",
        message: "Fallback is missing — describe what happens when data is missing or ambiguous.",
        severity: "warning",
      });
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
