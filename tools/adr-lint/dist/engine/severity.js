export function summarize(results) {
    return {
        errors: results.filter((r) => r.severity === 'fail'),
        warnings: results.filter((r) => r.severity === 'warn'),
    };
}
