import type {
  AgentType,
  AikoFormData,
  AikoIntent,
  ChangeStatus,
  ClientValidationIssue,
  ExpertAgentFormData,
  RefinementChange,
  RefinementChangeKind,
  RefinementResult,
} from "../../types";
import type { RefinementRuleId } from "../../types/refinement";
import { validateInput } from "./validate";

function makeChange(
  ruleId: RefinementRuleId,
  kind: RefinementChangeKind,
  status: ChangeStatus,
  message: string,
): RefinementChange {
  return { ruleId, kind, status, message };
}

function issueToChange(issue: ClientValidationIssue): RefinementChange {
  return makeChange(issue.ruleId, "flagged", issue.severity, issue.message);
}

const CREATIVE_TASK_PATTERNS = [
  /\bwrite\s+(a|an)\s+/i,
  /\bone[- ]off\b/i,
  /\bunique\b/i,
  /\bcreative\b/i,
  /\bpoem\b/i,
  /\bstory\b/i,
  /\bbrainstorm\b/i,
];

const TECHNICAL_JARGON_PATTERNS = [
  /\bapi\b/i,
  /\bendpoint\b/i,
  /\bwebhook\b/i,
  /\bsql\b/i,
  /\bjson\b/i,
  /\bcall\s+the\b/i,
];

const ITEM_SPECIFIC_PATTERNS = [
  /\b\d{4}-\d{2}-\d{2}\b/,
  /\bitem\s+id\b/i,
  /\bcontent\s+item\s+["']/i,
];

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

function firstSentence(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^(.+?[.!?])(\s|$)/);
  return (match?.[1] ?? trimmed.split("\n")[0] ?? trimmed).trim();
}

function intentLabel(intent: AikoIntent): string {
  return intent === "act"
    ? "Apply permitted changes directly, staying within existing permissions and workflow rules."
    : "Suggest changes for my review — do not apply edits without approval.";
}

function inferIntentFromDraft(draft: string): AikoIntent | "" {
  const lower = draft.toLowerCase();
  if (/\b(suggest|propose|recommend|review|draft)\b/.test(lower)) {
    return "suggest";
  }
  if (/\b(apply|update|change|set|tag|translate|directly)\b/.test(lower)) {
    return "act";
  }
  return "";
}

function looksLikeCreativeTask(text: string): boolean {
  return CREATIVE_TASK_PATTERNS.some((pattern) => pattern.test(text));
}

function hasTechnicalJargon(text: string): boolean {
  return TECHNICAL_JARGON_PATTERNS.some((pattern) => pattern.test(text));
}

function hasItemSpecificDetails(text: string): boolean {
  return ITEM_SPECIFIC_PATTERNS.some((pattern) => pattern.test(text));
}

function resolveAikoFields(data: AikoFormData): {
  action: string;
  contentScope: string;
  intent: AikoIntent;
  usedDraft: boolean;
  defaultedIntent: boolean;
} {
  const draft = data.draft.trim();
  const usedDraft = !isBlank(draft);

  let action = data.action.trim();
  let contentScope = data.contentScope.trim();
  let intent: AikoIntent | "" = data.intent;
  let defaultedIntent = false;

  if (isBlank(action) && usedDraft) {
    action = firstSentence(draft);
  }

  if (isBlank(contentScope) && usedDraft) {
    const scopeMatch = draft.match(
      /(?:for|on|across)\s+(.+?)(?:\.|$)/i,
    );
    contentScope = scopeMatch?.[1]?.trim() ?? "";
  }

  if (intent === "" && usedDraft) {
    intent = inferIntentFromDraft(draft);
  }

  if (intent === "") {
    intent = "suggest";
    defaultedIntent = true;
  }

  return {
    action: action || "Complete the requested task",
    contentScope: contentScope || "Specify content types, collections, or item filters",
    intent,
    usedDraft,
    defaultedIntent,
  };
}

function resolveExpertFields(data: ExpertAgentFormData): {
  goal: string;
  trigger: string;
  guardrails: string;
  escalation: string;
  usedDraft: boolean;
} {
  const draft = data.draft.trim();
  const usedDraft = !isBlank(draft);

  let goal = data.goal.trim();
  let trigger = data.trigger.trim();
  let guardrails = data.guardrails.trim();
  let escalation = data.escalation.trim();

  if (isBlank(goal) && usedDraft) {
    goal = firstSentence(draft);
  }

  if (isBlank(trigger) && usedDraft) {
    const triggerMatch = draft.match(/(?:when|trigger(?:ed)?|on)\s+(.+?)(?:\.|$)/i);
    trigger = triggerMatch?.[1]?.trim() ?? "";
  }

  if (isBlank(guardrails) && usedDraft) {
    const guardrailMatch = draft.match(/(?:do not|must not|never|only)\s+(.+?)(?:\.|$)/i);
    guardrails = guardrailMatch?.[1]?.trim() ?? "";
  }

  if (isBlank(escalation) && usedDraft) {
    const fallbackMatch = draft.match(/(?:escalat|fallback|if unsure|when uncertain)\s+(.+?)(?:\.|$)/i);
    escalation = fallbackMatch?.[1]?.trim() ?? "";
  }

  return {
    goal: goal || "Define the agent's primary purpose",
    trigger: trigger || "Specify the workflow step or event that activates this agent",
    guardrails:
      guardrails ||
      "Operate within existing permissions; do not publish content or change workflow steps without approval",
    escalation:
      escalation ||
      "Add a comment for the content owner and take no automated action when data is missing or ambiguous",
    usedDraft,
  };
}

function buildAikoPrompt(fields: ReturnType<typeof resolveAikoFields>): string {
  const sections = [
    "## Action",
    fields.action,
    "",
    "## Content scope",
    fields.contentScope,
    "",
    "## Intent",
    intentLabel(fields.intent),
    "",
    "## Constraints",
    "- Operate within existing permissions and workflow approvals.",
    "- Do not publish content or bypass human sign-off.",
    fields.intent === "suggest"
      ? "- Present proposed changes for review rather than applying them silently."
      : "- Apply only changes the current user is permitted to make.",
    "",
    "## Expected output",
    "Summarize what you did or found, list any items that need attention, and flag anything you could not complete.",
  ];

  return sections.join("\n");
}

function buildExpertPrompt(fields: ReturnType<typeof resolveExpertFields>): string {
  const sections = [
    "## Persona",
    "You are a content operations assistant working within Kontent.ai, focused on quality and compliance.",
    "",
    "## Goal",
    fields.goal.endsWith(".") ? fields.goal : `${fields.goal}.`,
    "",
    "## Trigger",
    fields.trigger,
    "",
    "## Guardrails",
    fields.guardrails,
    "",
    "## Expected behavior",
    "Evaluate matching content against the goal, document findings clearly, and respect all guardrails.",
    "",
    "## Fallback",
    fields.escalation,
    "",
    "## Human oversight",
    "All changes remain subject to normal workflow and approval. Never publish content without human sign-off.",
  ];

  return sections.join("\n");
}

function buildAikoChanges(
  data: AikoFormData,
  fields: ReturnType<typeof resolveAikoFields>,
  issues: ReturnType<typeof validateInput>,
): RefinementChange[] {
  const changes: RefinementChange[] = issues.map(issueToChange);

  if (!isBlank(data.action)) {
    changes.push(
      makeChange(
        "AIKO_ACTION_STRUCTURED",
        "added",
        "success",
        "Structured action into a clear verb-first statement.",
      ),
    );
  } else if (fields.usedDraft) {
    changes.push(
      makeChange(
        "AIKO_ACTION_INFERRED",
        "inferred",
        "warning",
        "Action inferred from draft — confirm the wording is correct.",
      ),
    );
  }

  if (!isBlank(data.contentScope)) {
    changes.push(
      makeChange(
        "AIKO_SCOPE_EXPLICIT",
        "added",
        "success",
        "Added explicit content scope.",
      ),
    );
  } else if (fields.usedDraft) {
    changes.push(
      makeChange(
        "AIKO_SCOPE_INFERRED",
        "inferred",
        "warning",
        "Content scope could not be fully parsed from draft — review and tighten scope language.",
      ),
    );
  }

  if (data.intent !== "") {
    changes.push(
      makeChange(
        "AIKO_INTENT_CLARIFIED",
        "added",
        "success",
        `Clarified intent: ${data.intent === "suggest" ? "suggest, don't act" : "take permitted action"}.`,
      ),
    );
  } else if (fields.defaultedIntent) {
    changes.push(
      makeChange(
        "AIKO_INTENT_DEFAULTED",
        "inferred",
        "warning",
        "Intent was ambiguous — defaulted to 'suggest, don't act'; confirm this is correct.",
      ),
    );
  }

  changes.push(
    makeChange(
      "AIKO_HUMAN_APPROVAL",
      "added",
      "success",
      "Added workflow constraints reinforcing human approval.",
    ),
  );

  const sourceText = [data.action, data.contentScope, data.draft].filter(Boolean).join(" ");
  if (looksLikeCreativeTask(sourceText)) {
    changes.push(
      makeChange(
        "AIKO_CREATIVE_TASK_FIT",
        "flagged",
        "info",
        "This looks like a one-off creative task — Aiko works best for repetitive, pattern-based work across multiple items.",
      ),
    );
  }

  return changes;
}

function buildExpertChanges(
  data: ExpertAgentFormData,
  fields: ReturnType<typeof resolveExpertFields>,
  issues: ReturnType<typeof validateInput>,
): RefinementChange[] {
  const changes: RefinementChange[] = issues.map(issueToChange);

  if (!isBlank(data.goal)) {
    changes.push(
      makeChange(
        "EXPERT_GOAL_STRUCTURED",
        "added",
        "success",
        "Focused goal into a single-purpose statement.",
      ),
    );
  } else if (fields.usedDraft) {
    changes.push(
      makeChange(
        "EXPERT_GOAL_INFERRED",
        "inferred",
        "warning",
        "Goal inferred from draft — confirm it describes one job only.",
      ),
    );
  }

  if (!isBlank(data.trigger)) {
    changes.push(
      makeChange(
        "EXPERT_TRIGGER_DEFINED",
        "added",
        "success",
        "Defined the workflow trigger.",
      ),
    );
  } else if (fields.usedDraft) {
    changes.push(
      makeChange(
        "EXPERT_TRIGGER_INFERRED",
        "flagged",
        "warning",
        "Trigger not found in draft — add the workflow event that activates this agent.",
      ),
    );
  }

  if (!isBlank(data.guardrails)) {
    changes.push(
      makeChange(
        "EXPERT_GUARDRAILS_DOCUMENTED",
        "added",
        "success",
        "Documented scope and guardrails.",
      ),
    );
  } else {
    changes.push(
      makeChange(
        "EXPERT_GUARDRAILS_DEFAULTED",
        "flagged",
        "warning",
        "Applied default guardrails — customize permission boundaries as needed.",
      ),
    );
  }

  if (!isBlank(data.escalation)) {
    changes.push(
      makeChange(
        "EXPERT_ESCALATION_DEFINED",
        "added",
        "success",
        "Defined fallback behavior for ambiguous cases.",
      ),
    );
  } else {
    changes.push(
      makeChange(
        "EXPERT_ESCALATION_DEFAULTED",
        "flagged",
        "warning",
        "Applied default fallback — specify what happens when the agent is unsure.",
      ),
    );
  }

  changes.push(
    makeChange(
      "EXPERT_HUMAN_OVERSIGHT",
      "added",
      "success",
      "Added human-in-the-loop reminder about approvals and publishing.",
    ),
  );

  if (hasTechnicalJargon(data.goal || data.draft)) {
    changes.push(
      makeChange(
        "EXPERT_GOAL_JARGON",
        "flagged",
        "info",
        "Goal contains technical language — consider describing outcomes instead of implementation.",
      ),
    );
  }

  if (hasItemSpecificDetails(data.goal)) {
    changes.push(
      makeChange(
        "EXPERT_GOAL_ITEM_SPECIFIC",
        "flagged",
        "warning",
        "Goal may include item-specific details — move dates, names, or IDs to trigger conditions or knowledge sources.",
      ),
    );
  }

  return changes;
}

export function refinePrompt(
  agentType: AgentType,
  data: AikoFormData | ExpertAgentFormData,
): RefinementResult {
  const issues = validateInput(agentType, data);

  if (agentType === "aiko") {
    const aikoData = data as AikoFormData;
    const fields = resolveAikoFields(aikoData);
    return {
      refinedPrompt: buildAikoPrompt(fields),
      changes: buildAikoChanges(aikoData, fields, issues),
    };
  }

  const expertData = data as ExpertAgentFormData;
  const fields = resolveExpertFields(expertData);
  return {
    refinedPrompt: buildExpertPrompt(fields),
    changes: buildExpertChanges(expertData, fields, issues),
  };
}
