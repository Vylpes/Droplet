import { useNavigate } from 'react-router'
import { authApi } from '../../api/client'
import { useAlerts } from '../../alerts/useAlerts'
import { FormField, FormPage, useApiForm } from '../../components/form'
import { emailOnlySchema } from '../../validation'
import { AuthFormLayout } from './AuthFormLayout'

export function RequestVerificationTokenPage() {
    const navigate = useNavigate()
    const { showInfo } = useAlerts()

    const { form, submit, isSubmitting, formError } = useApiForm({
        schema: emailOnlySchema,
        defaultValues: { email: '' },
        onSubmit: async ({ email }) => {
            const response = await authApi.requestVerificationToken(email)
            showInfo(
                response.Message ??
                    'If this email is correct you should receive an email to verify your account.'
            )
        },
        onSuccess: () => {
            navigate('/auth/login', { replace: true })
        },
    })

    return (
        <AuthFormLayout>
            <FormPage
                title="Request a new verification token"
                onSubmit={submit}
                formError={formError}
                submitLabel="Request"
                isSubmitting={isSubmitting}
            >
                <FormField
                    control={form.control}
                    name="email"
                    label="Email"
                    type="email"
                />
            </FormPage>
        </AuthFormLayout>
    )
}
