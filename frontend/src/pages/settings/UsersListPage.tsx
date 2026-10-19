import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import type { UserDto } from '@droplet/shared'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import { settingsApi } from '../../api/client'
import { useAlerts } from '../../alerts/useAlerts'
import { FormField, FormModal, useApiForm } from '../../components/form'
import {
    DataTable,
    ViewLink,
    createAppColumnHelper,
} from '../../components/table'
import { newUserSchema } from '../../validation'

const helper = createAppColumnHelper<UserDto>()
const columns = helper.columns([
    helper.accessor('Username', { header: 'Username' }),
    helper.accessor((row) => String(row.Verified), {
        id: 'verified',
        header: 'Verified',
    }),
    helper.accessor((row) => String(row.Admin), {
        id: 'admin',
        header: 'Admin',
    }),
    helper.accessor((row) => String(row.Active), {
        id: 'active',
        header: 'Active',
    }),
    helper.display({
        id: 'actions',
        enableSorting: false,
        enableGlobalFilter: false,
        cell: ({ row }) => (
            <ViewLink to={`/settings/users/${row.original.Id}`} />
        ),
    }),
])

export function UsersListPage() {
    const navigate = useNavigate()
    const { showInfo } = useAlerts()
    const [users, setUsers] = useState<UserDto[]>([])
    const [loading, setLoading] = useState(true)
    const [showNew, setShowNew] = useState(false)

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const response = await settingsApi.listUsers()
            setUsers(response.Data ?? [])
        } catch {
            setUsers([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        void load()
    }, [load])

    const { form, submit, isSubmitting, formError } = useApiForm({
        schema: newUserSchema,
        defaultValues: { username: '', email: '', admin: 'false' },
        onSubmit: async (values) => {
            const response = await settingsApi.createUser({
                username: values.username,
                email: values.email,
                admin: values.admin,
            })
            showInfo(response.Message ?? 'Successfully created user')
            if (response.Data?.Id) {
                navigate(`/settings/users/${response.Data.Id}`)
            }
        },
        onSuccess: async () => {
            form.reset({ username: '', email: '', admin: 'false' })
            setShowNew(false)
            await load()
        },
    })

    return (
        <>
            <Row>
                <Col>
                    <h1>Settings</h1>
                </Col>
                <Col>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button
                            type="button"
                            className="btn text-primary"
                            onClick={() => setShowNew(true)}
                        >
                            <FontAwesomeIcon icon={faPlusSquare} />
                            <span className="ms-1">New</span>
                        </button>
                    </div>
                </Col>
            </Row>

            <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                    <Nav.Link as={Link} to="/settings/account">
                        Account
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/settings/users" active>
                        Users
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {loading ? (
                <div className="page-loading">Loading…</div>
            ) : (
                <DataTable
                    data={users}
                    columns={columns}
                    getRowId={(row) => row.Id}
                />
            )}

            <FormModal
                show={showNew}
                title="New User"
                onHide={() => setShowNew(false)}
                onSubmit={submit}
                formError={formError}
                submitLabel="Create"
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
                    name="admin"
                    label="Admin"
                    as="select"
                >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                </FormField>
            </FormModal>
        </>
    )
}
