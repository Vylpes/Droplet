import { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import { useNavigate, useSearchParams } from 'react-router'
import { ApiError, authApi } from '../../api/client'
import { useAlerts } from '../../alerts/useAlerts'
import { FormField, FormPage, useApiForm } from '../../components/form'
import { passwordPairSchema } from '../../validation'
import { AuthFormLayout } from './AuthFormLayout'

type TokenState = 'loading' | 'valid' | 'invalid'

export function ResetPasswordPage() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token') ?? ''
    const navigate = useNavigate()
    const { showInfo } = useAlerts()
    const [tokenState, setTokenState] = useState<TokenState>(
        token ? 'loading' : 'invalid'
    )
    const [tokenError, setTokenError] = useState(
        token ? '' : 'A password reset token is required.'
    )

    useEffect(() => {
        if (!token) {
            return
        }

        let cancelled = false

        ;(async () => {
            try {
                await authApi.validateResetToken(token)
                if (!cancelled) {
                    setTokenState('valid')
                }
            } catch (error) {
                if (!cancelled) {
                    setTokenState('invalid')
                    setTokenError(
                        error instanceof ApiError
                            ? error.message
                            : 'Invalid or expired password reset token'
                    )
                }
            }
        })()

        return () => {
            cancelled = true
        }
    }, [token])

    const { form, submit, isSubmitting, formError } = useApiForm({
        schema: passwordPairSchema,
        defaultValues: { password: '', passwordRepeat: '' },
        onSubmit: async ({ password, passwordRepeat }) => {
            const response = await authApi.resetPassword(
                token,
                password,
                passwordRepeat
            )
            showInfo(
                response.Message ??
                    'Your password has been reset, please now login'
            )
        },
        onSuccess: () => {
            navigate('/auth/login', { replace: true })
        },
    })

    if (tokenState === 'loading') {
        return <div className="page-loading">Loading…</div>
    }

    if (tokenState === 'invalid') {
        return (
            <AuthFormLayout>
                <Alert variant="danger">{tokenError}</Alert>
            </AuthFormLayout>
        )
    }

    return (
        <AuthFormLayout>
            <FormPage
                title="Reset"
                onSubmit={submit}
                formError={formError}
                submitLabel="Create Password"
                isSubmitting={isSubmitting}
            >
                <FormField
                    control={form.control}
                    name="password"
                    label="Password"
                    type="password"
                />
                <FormField
                    control={form.control}
                    name="passwordRepeat"
                    label="Repeat Password"
                    type="password"
                />
            </FormPage>
        </AuthFormLayout>
    )
}
