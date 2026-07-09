import type { RefinementChange } from "../../types";
import type { RuleCategory } from "../../types/refinement";
import { getRefinementRule, RULE_CATEGORY_ORDER } from "./ruleRegistry";

export interface GroupedRefinementChanges {
  readonly category: RuleCategory;
  readonly changes: ReadonlyArray<RefinementChange>;
}

export function groupChangesByCategory(
  changes: ReadonlyArray<RefinementChange>,
): GroupedRefinementChanges[] {
  const buckets = new Map<RuleCategory, RefinementChange[]>();

  for (const change of changes) {
    const category = getRefinementRule(change.ruleId).category;
    const existing = buckets.get(category) ?? [];
    existing.push(change);
    buckets.set(category, existing);
  }

  return RULE_CATEGORY_ORDER.flatMap((category) => {
    const categoryChanges = buckets.get(category);
    if (!categoryChanges || categoryChanges.length === 0) {
      return [];
    }

    return [{ category, changes: categoryChanges }];
  });
}
