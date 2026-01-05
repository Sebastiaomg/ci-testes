export function runRules(rules, ctx) {
    return rules.flatMap((rule) => rule(ctx));
}
