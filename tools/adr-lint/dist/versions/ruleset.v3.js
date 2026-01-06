import { immutableAcceptedV2 } from '../rules/v2/immutable-accepted.js';
import { supersedesRequired } from '../rules/v2/supersedes-required.js';
import { singleDecisionType } from '../rules/v2/single-decision-type.js';
import { governanceRuleChecks } from '../rules/v3/governance-rule.js';
import { architecturalPatternChecks } from '../rules/v3/architectural-pattern.js';
import { dslInfrastructureChecks } from '../rules/v3/dsl-infrastructure.js';
export const rulesetV3 = [
    immutableAcceptedV2,
    singleDecisionType,
    supersedesRequired,
    governanceRuleChecks,
    architecturalPatternChecks,
    dslInfrastructureChecks,
];
