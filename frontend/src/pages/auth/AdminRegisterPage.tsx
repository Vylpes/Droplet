import { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import { useNavigate } from 'react-router'
import { authApi } from '../../api/client'
import { useAlerts } from '../../alerts/useAlerts'
import { FormField, FormPage, useApiForm } from '../../components/form'
import { adminRegisterSchema } from '../../validation'
import { AuthFormLayout } from './AuthFormLayout'

type Availability = 'loading' | 'available' | 'unavailable'

export function AdminRegisterPage() {
    const navigate = useNavigate()
    const { showInfo } = useAlerts()
    const [availability, setAvailability] = useState<Availability>('loading')

    useEffect(() => {
        let cancelled = false

        ;(async () => {
            try {
                await authApi.checkAdminRegister()
                if (!cancelled) {
                    setAvailability('available')
                }
            } catch {
                if (!cancelled) {
                    setAvailability('unavailable')
                }
            }
        })()

        return () => {
            cancelled = true
        }
    }, [])

    const { form, submit, isSubmitting, formError } = useApiForm({
        schema: adminRegisterSchema,
        defaultValues: {
            username: '',
            email: '',
            password: '',
            passwordRepeat: '',
        },
        onSubmit: async (values) => {
            await authApi.adminRegister(
                values.username,
                values.email,
                values.password,
                values.passwordRepeat
            )
        },
        onSuccess: () => {
            showInfo('Successfully registered admin user. Please log in.')
            navigate('/auth/login', { replace: true })
        },
    })

    if (availability === 'loading') {
        return <div className="page-loading">Loading…</div>
    }

    if (availability === 'unavailable') {
        return (
            <AuthFormLayout>
                <Alert variant="danger">
                    Admin registration is not available.
                </Alert>
            </AuthFormLayout>
        )
    }

    return (
        <AuthFormLayout>
            <FormPage
                title="Register Admin"
                onSubmit={submit}
                formError={formError}
                submitLabel="Register"
                isSubmitting={isSubmitting}
            >
                <FormField
                    control={form.control}
                    name="username"
                    label="Username"
                />
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
