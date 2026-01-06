import type { ADR, DecisionType } from '../types.js';
export declare function detectDecisionTypes(adr: ADR): DecisionType[];
export declare function detectSingleDecisionType(adr: ADR): DecisionType | null;
