/**
 * Presence check for NotEmpty rules.
 * Unlike a falsy check, numeric 0 and boolean false count as present.
 */
export function isEmptyValue(value: unknown): boolean {
    if (value === undefined || value === null) {
        return true;
    }

    if (typeof value === "string" || Array.isArray(value)) {
        return value.length === 0;
    }

    return false;
}
