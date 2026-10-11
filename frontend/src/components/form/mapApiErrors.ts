import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { ApiError } from '../../api/client'

/**
 * Apply JSON API validation Errors to react-hook-form field state (#351).
 * Falls back to a root form error when only Message is present.
 */
export function mapApiErrorsToForm<TFieldValues extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<TFieldValues>
): string | undefined {
    if (!(error instanceof ApiError)) {
        const message =
            error instanceof Error ? error.message : 'Something went wrong'
        setError('root', { type: 'server', message })
        return message
    }

    const fieldErrors = error.body.Errors
    if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        for (const [field, message] of Object.entries(fieldErrors)) {
            setError(field as Path<TFieldValues>, {
                type: 'server',
                message,
            })
        }
        return error.body.Message ?? Object.values(fieldErrors)[0]
    }

    const message = error.body.Message ?? error.message
    setError('root', { type: 'server', message })
    return message
}
