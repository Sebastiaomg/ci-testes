import { detectDecisionTypes, detectSingleDecisionType } from '../../engine/detect-decision-type.js';
export const singleDecisionType = ({ adrs }) => adrs.flatMap((adr) => {
    const types = detectDecisionTypes(adr);
    const type = detectSingleDecisionType(adr);
    if (!type) {
        return [{
                severity: 'fail',
                message: types.length > 1
                    ? `${adr.id}: ADR define múltiplos decision_types (${types.join(', ')})`
                    : `${adr.id}: ADR não define decision_type`,
            }];
    }
    return [];
});
