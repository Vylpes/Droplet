import { z } from 'zod'

/**
 * Zod field helpers mirroring server BodyValidator / ApiBodyValidator messages (#351).
 * Prefer these when building form schemas so client errors match the API.
 */

export function requiredString(field: string) {
    return z.string().min(1, `${field} is required`)
}

export function emailAddress(field: string) {
    return requiredString(field).pipe(
        z.email({ error: `${field} must be an email address` })
    )
}

export function minLength(field: string, length: number) {
    return requiredString(field).refine((value) => value.length >= length, {
        error: `${field} must be no less than ${length} characters long`,
    })
}

export function maxLength(field: string, length: number) {
    return z
        .string()
        .max(length, `${field} must be no more than ${length} characters long`)
}

export function numberField(field: string) {
    return z.coerce.number({ error: `${field} must be a number` })
}

export function booleanField(field: string) {
    return z.union([z.boolean(), z.literal('true'), z.literal('false')], {
        error: `${field} must be a boolean`,
    })
}

export function greaterThan(field: string, min: number) {
    return numberField(field).refine((value) => value > min, {
        error: `${field} must be greater than ${min}`,
    })
}

export function lessThan(field: string, max: number) {
    return numberField(field).refine((value) => value < max, {
        error: `${field} must be less than ${max}`,
    })
}

/** Object-level refine: `field` must equal `otherField` (EqualToField). */
export function equalToField<T extends Record<string, unknown>>(
    field: keyof T & string,
    otherField: keyof T & string
) {
    return (data: T) => data[field] === data[otherField]
}

export function equalToFieldMessage(field: string, otherField: string) {
    return `${field} must be equal to field ${otherField}`
}

/** Object-level refine: `field` must not equal `otherField` (NotEqualToField). */
export function notEqualToField<T extends Record<string, unknown>>(
    field: keyof T & string,
    otherField: keyof T & string
) {
    return (data: T) => data[field] !== data[otherField]
}

export function notEqualToFieldMessage(field: string, otherField: string) {
    return `${field} must not be equal to field ${otherField}`
}
