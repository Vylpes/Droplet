import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import type { UserDto } from '@droplet/shared'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChevronCircleLeft,
    faEdit,
} from '@fortawesome/free-solid-svg-icons'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { settingsApi } from '../../api/client'
import { useAlerts } from '../../alerts/useAlerts'
import { useAuth } from '../../auth/useAuth'
import { DetailField } from '../../components/DetailField'
import { FormField, FormModal, useApiForm } from '../../components/form'
import { editUserSchema } from '../../validation'

export function UserViewPage() {
    const { id = '' } = useParams()
    const { user: currentUser } = useAuth()
    const { showInfo, showError } = useAlerts()
    const [user, setUser] = useState<UserDto | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showEdit, setShowEdit] = useState(false)
    const [toggling, setToggling] = useState(false)

    const load = useCallback(async () => {
        if (!id) return
        setLoading(true)
        setError(null)
        try {
            const response = await settingsApi.getUser(id)
            setUser(response.Data ?? null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load')
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        void load()
    }, [load])

    const editForm = useApiForm({
        schema: editUserSchema,
        defaultValues: {
            username: '',
            email: '',
            admin: 'false',
            active: 'true',
        },
        onSubmit: async (values) => {
            const response = await settingsApi.updateUser(id, {
                username: values.username,
                email: values.email,
                admin: values.admin,
                active: values.active,
            })
            showInfo(response.Message ?? 'User updated')
        },
        onSuccess: async () => {
            setShowEdit(false)
            await load()
        },
    })

    useEffect(() => {
        if (user && showEdit) {
            editForm.form.reset({
                username: user.Username,
                email: user.Email,
                admin: user.Admin ? 'true' : 'false',
                active: user.Active ? 'true' : 'false',
            })
        }
    }, [user, showEdit, editForm.form])

    const handleToggleActive = async () => {
        if (!user) return
        setToggling(true)
        try {
            const response = await settingsApi.toggleUserActive(user.Id)
            showInfo(response.Message ?? 'User active status toggled')
            await load()
        } catch (err) {
            showError(
                err instanceof Error
                    ? err.message
                    : 'Failed to toggle active status'
            )
        } finally {
            setToggling(false)
        }
    }

    if (loading) {
        return <div className="page-loading">Loading…</div>
    }

    if (error || !user) {
        return <div className="alert alert-danger">{error ?? 'Not found'}</div>
    }

    const isSelf = currentUser?.Id === user.Id

    return (
        <>
            <Link to="/settings/users" className="btn text-primary">
                <FontAwesomeIcon icon={faChevronCircleLeft} />
                <span className="ms-1">Back to List</span>
            </Link>

            <Row className="mt-3">
                <Col>
                    <h1>{user.Username}</h1>
                </Col>
                <Col>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button
                            type="button"
                            className="btn text-secondary"
                            onClick={() => void handleToggleActive()}
                            disabled={isSelf || toggling}
                        >
                            <FontAwesomeIcon icon={faEdit} />
                            <span className="ms-1">
                                {user.Active ? 'Deactivate' : 'Activate'}
                            </span>
                        </button>
                        <button
                            type="button"
                            className="btn text-primary"
                            onClick={() => setShowEdit(true)}
                        >
                            <FontAwesomeIcon icon={faEdit} />
                            <span className="ms-1">Edit</span>
                        </button>
                    </div>
                </Col>
            </Row>

            <Row className="mt-3">
                <Col md={4}>
                    <Card>
                        <Card.Header>Basic Details</Card.Header>
                        <Card.Body>
                            <DetailField label="Username">
                                {user.Username}
                            </DetailField>
                            <DetailField label="Email">{user.Email}</DetailField>
                            <DetailField label="Verified">
                                {String(user.Verified)}
                            </DetailField>
                            <DetailField label="Admin">
                                {String(user.Admin)}
                            </DetailField>
                            <DetailField label="Active">
                                {String(user.Active)}
                            </DetailField>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <FormModal
                show={showEdit}
                title="Edit User"
                onHide={() => setShowEdit(false)}
                onSubmit={editForm.submit}
                formError={editForm.formError}
                submitLabel="Update"
                isSubmitting={editForm.isSubmitting}
            >
                <FormField
                    control={editForm.form.control}
                    name="username"
                    label="Username"
                />
                <FormField
                    control={editForm.form.control}
                    name="email"
                    label="Email"
                    type="email"
                />
                <FormField
                    control={editForm.form.control}
                    name="admin"
                    label="Admin"
                    as="select"
                >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                </FormField>
                <FormField
                    control={editForm.form.control}
                    name="active"
                    label="Active"
                    as="select"
                >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                </FormField>
            </FormModal>
        </>
    )
}
