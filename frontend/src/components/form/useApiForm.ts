import { zodResolver } from '@hookform/resolvers/zod'
import type { BaseSyntheticEvent } from 'react'
import {
    useForm,
    type DefaultValues,
    type FieldValues,
    type UseFormProps,
    type UseFormReturn,
} from 'react-hook-form'
import type { z } from 'zod'
import { mapApiErrorsToForm } from './mapApiErrors'

export interface UseApiFormOptions<
    TSchema extends z.ZodType<FieldValues>,
    TFieldValues extends FieldValues = z.infer<TSchema>,
> {
    schema: TSchema
    defaultValues?: DefaultValues<TFieldValues>
    /** Called with validated values; throw ApiError (or other) on failure. */
    onSubmit: (values: TFieldValues) => Promise<void>
    /** Runs after a successful submit. */
    onSuccess?: (values: TFieldValues) => void | Promise<void>
    /** Optional RHF config overrides (mode, etc.). */
    formProps?: Omit<
        UseFormProps<TFieldValues>,
        'resolver' | 'defaultValues'
    >
}

export interface UseApiFormResult<TFieldValues extends FieldValues> {
    form: UseFormReturn<TFieldValues>
    /** Bound submit handler for `<Form onSubmit={submit}>`. */
    submit: (event?: BaseSyntheticEvent) => Promise<void>
    /** True while the async submit callback is in flight. */
    isSubmitting: boolean
    /** Form-level / unmapped server message. */
    formError?: string
}

/**
 * react-hook-form + Zod + ApiError field mapping for JSON endpoints (#351).
 */
export function useApiForm<
    TSchema extends z.ZodType<FieldValues>,
    TFieldValues extends FieldValues = z.infer<TSchema> & FieldValues,
>({
    schema,
    defaultValues,
    onSubmit,
    onSuccess,
    formProps,
}: UseApiFormOptions<TSchema, TFieldValues>): UseApiFormResult<TFieldValues> {
    const form = useForm<TFieldValues>({
        ...formProps,
        // Zod schemas are validated at runtime; cast keeps RHF generics happy with Zod 4.
        resolver: zodResolver(schema as never),
        defaultValues,
    })

    const submit = form.handleSubmit(async (values) => {
        try {
            await onSubmit(values)
            await onSuccess?.(values)
        } catch (error) {
            mapApiErrorsToForm(error, form.setError)
        }
    })

    return {
        form,
        submit,
        isSubmitting: form.formState.isSubmitting,
        formError: form.formState.errors.root?.message,
    }
}
