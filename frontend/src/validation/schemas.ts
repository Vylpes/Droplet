import { z } from 'zod'
import {
    emailAddress,
    equalToField,
    minLength,
    numberField,
    requiredString,
} from './rules'

/**
 * Auth / account form schemas (#352).
 * Prefer co-locating page-specific extras with pages when needed.
 */

export const loginSchema = z.object({
    email: emailAddress('email'),
    password: requiredString('password'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const emailOnlySchema = z.object({
    email: emailAddress('email'),
})

export type EmailOnlyFormValues = z.infer<typeof emailOnlySchema>

/** Verify / password-reset: API requires min 8 chars. */
export const passwordPairSchema = z
    .object({
        password: minLength('password', 8),
        passwordRepeat: requiredString('passwordRepeat'),
    })
    .refine(equalToField('passwordRepeat', 'password'), {
        path: ['passwordRepeat'],
        error: 'Passwords must match',
    })

export type PasswordPairFormValues = z.infer<typeof passwordPairSchema>

export const adminRegisterSchema = z
    .object({
        username: requiredString('username'),
        email: emailAddress('email'),
        password: requiredString('password'),
        passwordRepeat: requiredString('passwordRepeat'),
    })
    .refine(equalToField('passwordRepeat', 'password'), {
        path: ['passwordRepeat'],
        error: 'Passwords do not match',
    })

export type AdminRegisterFormValues = z.infer<typeof adminRegisterSchema>

export const accountSettingsSchema = z
    .object({
        email: emailAddress('email'),
        username: requiredString('username'),
        newPassword: z.string().optional().default(''),
        passwordConfirm: z.string().optional().default(''),
        currentPassword: requiredString('currentPassword'),
    })
    .refine(
        (data) =>
            !data.newPassword || data.newPassword === data.passwordConfirm,
        {
            path: ['passwordConfirm'],
            error: 'Passwords must match',
        }
    )

export type AccountSettingsFormValues = z.infer<typeof accountSettingsSchema>

export const addNoteSchema = z.object({
    text: requiredString('text'),
})

export type AddNoteFormValues = z.infer<typeof addNoteSchema>

export const purchaseFormSchema = z.object({
    description: requiredString('description'),
    price: numberField('price'),
})

export type PurchaseFormValues = z.infer<typeof purchaseFormSchema>

export const purchaseStatusSchema = z.object({
    status: numberField('status'),
})

export type PurchaseStatusFormValues = z.infer<typeof purchaseStatusSchema>

export const newItemSchema = z.object({
    name: requiredString('name'),
    quantity: numberField('quantity'),
})

export type NewItemFormValues = z.infer<typeof newItemSchema>

export const editItemSchema = z.object({
    name: requiredString('name'),
})

export type EditItemFormValues = z.infer<typeof editItemSchema>

export const itemQuantitySchema = z.object({
    unlisted: numberField('unlisted'),
    listed: numberField('listed'),
    sold: numberField('sold'),
    rejected: numberField('rejected'),
})

export type ItemQuantityFormValues = z.infer<typeof itemQuantitySchema>

export const newSupplySchema = z.object({
    name: requiredString('name'),
    sku: requiredString('sku'),
    quantity: numberField('quantity'),
})

export type NewSupplyFormValues = z.infer<typeof newSupplySchema>

export const editSupplySchema = z.object({
    name: requiredString('name'),
    sku: requiredString('sku'),
})

export type EditSupplyFormValues = z.infer<typeof editSupplySchema>

export const supplyQuantitySchema = z.object({
    unused: numberField('unused'),
    used: numberField('used'),
})

export type SupplyQuantityFormValues = z.infer<typeof supplyQuantitySchema>