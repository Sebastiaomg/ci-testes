import { RuleResult } from '../types.js';

export function summarize(results: RuleResult[]) {
  return {
    errors: results.filter((r) => r.severity === 'fail'),
    warnings: results.filter((r) => r.severity === 'warn'),
  };
}
