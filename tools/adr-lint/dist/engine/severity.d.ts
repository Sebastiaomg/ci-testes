import { RuleResult } from '../types.js';
export declare function summarize(results: RuleResult[]): {
    errors: RuleResult[];
    warnings: RuleResult[];
};
