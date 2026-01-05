import { Rule, RuleContext, RuleResult } from '../types.js';

export function runRules(rules: Rule[], ctx: RuleContext): RuleResult[] {
  return rules.flatMap((rule) => rule(ctx));
}
