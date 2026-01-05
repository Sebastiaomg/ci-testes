import { immutableAccepted } from '../rules/v1/immutable-accepted.js';
import { requiredSections } from '../rules/v1/required-sections.js';

export const rulesetV1 = [immutableAccepted, requiredSections];
