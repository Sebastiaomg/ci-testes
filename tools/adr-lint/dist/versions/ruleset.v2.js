import { immutableAcceptedV2 } from '../rules/v2/immutable-accepted.js';
import { supersedesRequired } from '../rules/v2/supersedes-required.js';
import { riskSection } from '../rules/v2/risk-section.js';
export const rulesetV2 = [immutableAcceptedV2, supersedesRequired, riskSection];
