import { z } from 'zod'
import {
    emailAddress,
    equalToField,
    equalToFieldMessage,
    requiredString,
} from './rules'

/**
 * Example schemas mirroring ApiBodyValidator chains (#351).
 * Prefer co-locating schemas with pages; these cover common auth shapes for #352.
 */

export const loginSchema = z.object({
    email: emailAddress('email'),
    password: requiredString('password'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const passwordPairSchema = z
    .object({
        password: requiredString('password'),
        passwordRepeat: requiredString('passwordRepeat'),
    })
    .refine(equalToField('passwordRepeat', 'password'), {
        path: ['passwordRepeat'],
        error: equalToFieldMessage('passwordRepeat', 'password'),
    })

export type PasswordPairFormValues = z.infer<typeof passwordPairSchema>

export const addNoteSchema = z.object({
    text: requiredString('text'),
})

export type AddNoteFormValues = z.infer<typeof addNoteSchema>
