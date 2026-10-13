import { Link, useLocation, useNavigate } from 'react-router'
import { FormField, FormPage, useApiForm } from '../../components/form'
import { useAuth } from '../../auth/useAuth'
import { loginSchema } from '../../validation'
import { AuthFormLayout } from './AuthFormLayout'

export function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const from =
        (location.state as { from?: { pathname?: string } } | null)?.from
            ?.pathname ?? '/dashboard'

    const { form, submit, isSubmitting, formError } = useApiForm({
        schema: loginSchema,
        defaultValues: { email: '', password: '' },
        onSubmit: async ({ email, password }) => {
            await login(email, password)
        },
        onSuccess: () => {
            navigate(from, { replace: true })
        },
    })

    return (
        <AuthFormLayout>
            <FormPage
                title="Login"
                onSubmit={submit}
                formError={formError}
                submitLabel="Login"
                isSubmitting={isSubmitting}
                actions={
                    <>
                        <Link
                            to="/auth/password-reset/request"
                            className="text-secondary"
                        >
                            Forgot Password?
                        </Link>
                        <Link
                            to="/auth/verification-token/request"
                            className="text-secondary"
                        >
                            Didn&apos;t receive invite?
                        </Link>
                    </>
                }
            >
                <FormField
                    control={form.control}
                    name="email"
                    label="Email"
                    type="email"
                />
                <FormField
                    control={form.control}
                    name="password"
                    label="Password"
                    type="password"
                />
            </FormPage>
        </AuthFormLayout>
    )
}
