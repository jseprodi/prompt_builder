import type { RefinementRuleDefinition, RefinementRuleId, RuleCategory } from "../../types/refinement";

export type { RefinementRuleId, RuleCategory } from "../../types/refinement";

export const RULE_CATEGORY_ORDER: readonly RuleCategory[] = [
  "Input",
  "Action",
  "Scope",
  "Intent",
  "Goal",
  "Trigger",
  "Guardrails",
  "Fallback",
  "Constraints",
  "Agent fit",
];

const WRITE_CLEAR_PROMPTS_URL = "https://kontent.ai/learn/set-up/ai-prompting/write-clear-prompts";
const WHEN_TO_USE_AIKO_URL = "https://kontent.ai/learn/set-up/ai-prompting/when-to-use-aiko";
const QUALITY_BOOSTERS_URL = "https://kontent.ai/learn/set-up/ai-prompting/quality-boosters";
const EXPERT_AGENTS_URL = "https://kontent.ai/learn/docs/innovation-lab/expert-agents";

export const REFINEMENT_RULES: Record<RefinementRuleId, RefinementRuleDefinition> = {
  FORM_INPUT_REQUIRED: {
    id: "FORM_INPUT_REQUIRED",
    name: "Provide input to refine",
    explanation:
      "Refinement needs either structured fields or a draft prompt to work from — empty forms produce generic output with little value.",
    category: "Input",
  },
  AIKO_ACTION_REQUIRED: {
    id: "AIKO_ACTION_REQUIRED",
    name: "State a verb-first action",
    explanation:
      "Aiko needs a concrete operation to perform; vague requests force the agent to guess what you want done.",
    category: "Action",
    docUrl: WRITE_CLEAR_PROMPTS_URL,
  },
  AIKO_ACTION_STRUCTURED: {
    id: "AIKO_ACTION_STRUCTURED",
    name: "Action is verb-first and explicit",
    explanation:
      "Starting with a specific action verb tells Aiko exactly what operation to run, reducing misinterpretation on bulk tasks.",
    category: "Action",
    docUrl: WRITE_CLEAR_PROMPTS_URL,
  },
  AIKO_ACTION_INFERRED: {
    id: "AIKO_ACTION_INFERRED",
    name: "Action inferred from draft",
    explanation:
      "Draft parsing may miss nuance — confirming the action prevents Aiko from executing the wrong operation across many items.",
    category: "Action",
    docUrl: WRITE_CLEAR_PROMPTS_URL,
  },
  AIKO_SCOPE_REQUIRED: {
    id: "AIKO_SCOPE_REQUIRED",
    name: "Define content scope",
    explanation:
      "Without a clear scope, Aiko may touch too many or too few items, especially in bulk operations where mistakes multiply.",
    category: "Scope",
    docUrl: WRITE_CLEAR_PROMPTS_URL,
  },
  AIKO_SCOPE_SPECIFICITY: {
    id: "AIKO_SCOPE_SPECIFICITY",
    name: "Use specific scope language",
    explanation:
      "Named content types, collections, taxonomies, or date ranges keep bulk operations predictable and auditable.",
    category: "Scope",
    docUrl: WRITE_CLEAR_PROMPTS_URL,
  },
  AIKO_SCOPE_EXPLICIT: {
    id: "AIKO_SCOPE_EXPLICIT",
    name: "Content scope is explicit",
    explanation:
      "Pinning scope to Kontent.ai terminology (content types, collections, workflow steps) prevents accidental cross-project impact.",
    category: "Scope",
    docUrl: WRITE_CLEAR_PROMPTS_URL,
  },
  AIKO_SCOPE_INFERRED: {
    id: "AIKO_SCOPE_INFERRED",
    name: "Content scope inferred from draft",
    explanation:
      "Heuristic scope parsing often leaves gaps — tightening scope language avoids silent omissions in large batches.",
    category: "Scope",
    docUrl: WRITE_CLEAR_PROMPTS_URL,
  },
  AIKO_INTENT_CLARITY: {
    id: "AIKO_INTENT_CLARITY",
    name: "Declare suggest vs. act intent",
    explanation:
      "Stating whether Aiko should propose changes or apply them directly is your safety mechanism before bulk edits go live.",
    category: "Intent",
    docUrl: WRITE_CLEAR_PROMPTS_URL,
  },
  AIKO_INTENT_CLARIFIED: {
    id: "AIKO_INTENT_CLARIFIED",
    name: "Intent is explicit",
    explanation:
      "Clear intent ensures Aiko either waits for your approval or acts within permissions — critical for high-risk operations.",
    category: "Intent",
    docUrl: WRITE_CLEAR_PROMPTS_URL,
  },
  AIKO_INTENT_DEFAULTED: {
    id: "AIKO_INTENT_DEFAULTED",
    name: "Intent defaulted to suggest",
    explanation:
      "When intent is unclear, suggesting first is safer — you can always follow up with a direct-action prompt after review.",
    category: "Intent",
    docUrl: WRITE_CLEAR_PROMPTS_URL,
  },
  AIKO_HUMAN_APPROVAL: {
    id: "AIKO_HUMAN_APPROVAL",
    name: "Reinforce human approval",
    explanation:
      "Workflow gates and permission boundaries keep AI-assisted changes subject to the same review process as manual edits.",
    category: "Constraints",
    docUrl: WHEN_TO_USE_AIKO_URL,
  },
  AIKO_CREATIVE_TASK_FIT: {
    id: "AIKO_CREATIVE_TASK_FIT",
    name: "Match task to Aiko's strengths",
    explanation:
      "Aiko excels at repetitive, pattern-based work across many items — one-off creative tasks are better handled manually or with a different tool.",
    category: "Agent fit",
    docUrl: WHEN_TO_USE_AIKO_URL,
  },
  EXPERT_GOAL_REQUIRED: {
    id: "EXPERT_GOAL_REQUIRED",
    name: "State a focused goal",
    explanation:
      "Expert agents run without follow-up questions — a single clear goal tells the agent its primary job on every activation.",
    category: "Goal",
    docUrl: EXPERT_AGENTS_URL,
  },
  EXPERT_GOAL_FOCUS: {
    id: "EXPERT_GOAL_FOCUS",
    name: "One goal per agent",
    explanation:
      "Bundling multiple objectives makes agent behavior unpredictable; focused agents are easier to test, monitor, and troubleshoot.",
    category: "Goal",
    docUrl: EXPERT_AGENTS_URL,
  },
  EXPERT_GOAL_STRUCTURED: {
    id: "EXPERT_GOAL_STRUCTURED",
    name: "Goal is single-purpose",
    explanation:
      "A short, focused goal keeps the agent aligned with one repeatable outcome across every automated run.",
    category: "Goal",
    docUrl: EXPERT_AGENTS_URL,
  },
  EXPERT_GOAL_INFERRED: {
    id: "EXPERT_GOAL_INFERRED",
    name: "Goal inferred from draft",
    explanation:
      "Draft parsing may capture multiple ideas — confirm the goal describes exactly one job before deploying the agent.",
    category: "Goal",
    docUrl: EXPERT_AGENTS_URL,
  },
  EXPERT_GOAL_JARGON: {
    id: "EXPERT_GOAL_JARGON",
    name: "Describe outcomes, not mechanics",
    explanation:
      "Goals framed as business outcomes (e.g. 'ensure metadata is complete') work better than implementation details the agent cannot act on directly.",
    category: "Goal",
    docUrl: QUALITY_BOOSTERS_URL,
  },
  EXPERT_GOAL_ITEM_SPECIFIC: {
    id: "EXPERT_GOAL_ITEM_SPECIFIC",
    name: "Keep item specifics out of the goal",
    explanation:
      "Dates, names, and IDs belong in trigger filters or knowledge sources — the goal should describe the repeatable rule, not one item.",
    category: "Goal",
    docUrl: EXPERT_AGENTS_URL,
  },
  EXPERT_TRIGGER_REQUIRED: {
    id: "EXPERT_TRIGGER_REQUIRED",
    name: "Define a workflow trigger",
    explanation:
      "Expert agents activate on specific content events — without a trigger, the agent has no reliable signal for when to run.",
    category: "Trigger",
    docUrl: EXPERT_AGENTS_URL,
  },
  EXPERT_TRIGGER_DEFINED: {
    id: "EXPERT_TRIGGER_DEFINED",
    name: "Trigger targets a specific event",
    explanation:
      "Tying activation to a workflow step or content change ensures the agent runs at the right moment in your editorial process.",
    category: "Trigger",
    docUrl: EXPERT_AGENTS_URL,
  },
  EXPERT_TRIGGER_INFERRED: {
    id: "EXPERT_TRIGGER_INFERRED",
    name: "Trigger missing from draft",
    explanation:
      "Automation filters handle when the agent runs in Kontent.ai — the prompt should still document that event so instructions stay self-contained.",
    category: "Trigger",
    docUrl: EXPERT_AGENTS_URL,
  },
  EXPERT_GUARDRAILS_REQUIRED: {
    id: "EXPERT_GUARDRAILS_REQUIRED",
    name: "Define guardrails",
    explanation:
      "Guardrails bound what the agent may read, edit, or publish — essential because expert agents cannot ask for clarification mid-run.",
    category: "Guardrails",
    docUrl: EXPERT_AGENTS_URL,
  },
  EXPERT_GUARDRAILS_DOCUMENTED: {
    id: "EXPERT_GUARDRAILS_DOCUMENTED",
    name: "Guardrails document permission boundaries",
    explanation:
      "Explicit limits on publishing, workflow changes, and element scope prevent automated runs from exceeding intended authority.",
    category: "Guardrails",
    docUrl: EXPERT_AGENTS_URL,
  },
  EXPERT_GUARDRAILS_DEFAULTED: {
    id: "EXPERT_GUARDRAILS_DEFAULTED",
    name: "Default guardrails applied",
    explanation:
      "Generic guardrails are a starting point — customize them to match your project's permissions and compliance requirements.",
    category: "Guardrails",
    docUrl: EXPERT_AGENTS_URL,
  },
  EXPERT_ESCALATION_REQUIRED: {
    id: "EXPERT_ESCALATION_REQUIRED",
    name: "Define fallback behavior",
    explanation:
      "Expert agents must handle missing or ambiguous data without human input — a fallback path prevents silent failures or wrong guesses.",
    category: "Fallback",
    docUrl: EXPERT_AGENTS_URL,
  },
  EXPERT_ESCALATION_DEFINED: {
    id: "EXPERT_ESCALATION_DEFINED",
    name: "Fallback behavior is defined",
    explanation:
      "Clear escalation (comment, skip, no action) keeps the agent predictable when it cannot complete the goal confidently.",
    category: "Fallback",
    docUrl: EXPERT_AGENTS_URL,
  },
  EXPERT_ESCALATION_DEFAULTED: {
    id: "EXPERT_ESCALATION_DEFAULTED",
    name: "Default fallback applied",
    explanation:
      "A generic 'add a comment and stop' fallback is safe but may not match your team's workflow — tailor it to your review process.",
    category: "Fallback",
    docUrl: EXPERT_AGENTS_URL,
  },
  EXPERT_HUMAN_OVERSIGHT: {
    id: "EXPERT_HUMAN_OVERSIGHT",
    name: "Reinforce human oversight",
    explanation:
      "Automated agents still operate within workflow approvals — reminding the agent preserves accountability in version history and audit logs.",
    category: "Constraints",
    docUrl: EXPERT_AGENTS_URL,
  },
};

export function getRefinementRule(ruleId: RefinementRuleId): RefinementRuleDefinition {
  return REFINEMENT_RULES[ruleId];
}

export const CHANGE_KIND_LABELS = {
  added: "Added",
  inferred: "Inferred from draft",
  flagged: "Flagged for review",
} as const;
