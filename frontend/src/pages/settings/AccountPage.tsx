import { useEffect, useState } from 'react'
import Nav from 'react-bootstrap/Nav'
import { Link } from 'react-router'
import { settingsApi } from '../../api/client'
import { useAlerts } from '../../alerts/useAlerts'
import { useAuth } from '../../auth/useAuth'
import { FormField, FormPage, useApiForm } from '../../components/form'
import { accountSettingsSchema } from '../../validation'

export function AccountPage() {
    const { user, refresh } = useAuth()
    const { showInfo } = useAlerts()
    const [ready, setReady] = useState(false)

    const { form, submit, isSubmitting, formError } = useApiForm({
        schema: accountSettingsSchema,
        defaultValues: {
            email: user?.Email ?? '',
            username: user?.Username ?? '',
            newPassword: '',
            passwordConfirm: '',
            currentPassword: '',
        },
        onSubmit: async (values) => {
            const response = await settingsApi.updateAccount({
                email: values.email,
                username: values.username,
                currentPassword: values.currentPassword,
                newPassword: values.newPassword || undefined,
                passwordConfirm: values.passwordConfirm || undefined,
            })
            await refresh()
            showInfo(response.Message ?? 'Account updated')
            form.reset({
                email: values.email,
                username: values.username,
                newPassword: '',
                passwordConfirm: '',
                currentPassword: '',
            })
        },
    })

    useEffect(() => {
        let cancelled = false

        ;(async () => {
            try {
                const response = await settingsApi.getAccount()
                if (!cancelled && response.Data) {
                    form.reset({
                        email: response.Data.Email,
                        username: response.Data.Username,
                        newPassword: '',
                        passwordConfirm: '',
                        currentPassword: '',
                    })
                }
            } catch {
                // Fall back to session user already in defaultValues
            } finally {
                if (!cancelled) {
                    setReady(true)
                }
            }
        })()

        return () => {
            cancelled = true
        }
    }, [form])

    if (!ready) {
        return <div className="page-loading">Loading…</div>
    }

    return (
        <>
            <h1 className="h3 mb-3">Settings</h1>
            <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                    <Nav.Link as={Link} to="/settings/account" active>
                        Account
                    </Nav.Link>
                </Nav.Item>
                {user?.Admin ? (
                    <Nav.Item>
                        <Nav.Link as={Link} to="/settings/users">
                            Users
                        </Nav.Link>
                    </Nav.Item>
                ) : null}
            </Nav>
            <FormPage
                onSubmit={submit}
                formError={formError}
                submitLabel="Save changes"
                isSubmitting={isSubmitting}
            >
                <FormField
                    control={form.control}
                    name="email"
                    label="Email"
                    type="email"
                />
                <FormField
                    control={form.control}
                    name="username"
                    label="Username"
                />
                <hr />
                <FormField
                    control={form.control}
                    name="newPassword"
                    label="New Password"
                    type="password"
                />
                <FormField
                    control={form.control}
                    name="passwordConfirm"
                    label="Confirm New Password"
                    type="password"
                />
                <hr />
                <FormField
                    control={form.control}
                    name="currentPassword"
                    label="Please confirm your current password to continue"
                    type="password"
                />
            </FormPage>
        </>
    )
}
