import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import type { PostagePolicyDto } from '@droplet/shared'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { postagePoliciesApi } from '../../api/client'
import { useAlerts } from '../../alerts/useAlerts'
import { FormField, FormModal, useApiForm } from '../../components/form'
import {
    DataTable,
    ViewLink,
    createAppColumnHelper,
} from '../../components/table'
import { postagePolicyFormSchema } from '../../validation'

const helper = createAppColumnHelper<PostagePolicyDto>()
const columns = helper.columns([
    helper.accessor('Name', { header: 'Name' }),
    helper.accessor('CostToBuyer', { header: 'Cost To Buyer' }),
    helper.accessor('ActualCost', { header: 'Actual Cost' }),
    helper.accessor((row) => row.Listings?.length ?? 0, {
        id: 'listings',
        header: 'Listings',
    }),
    helper.display({
        id: 'actions',
        enableSorting: false,
        enableGlobalFilter: false,
        cell: ({ row }) => (
            <ViewLink to={`/postage-policies/${row.original.Id}`} />
        ),
    }),
])

export function PostagePoliciesListPage() {
    const navigate = useNavigate()
    const { showInfo } = useAlerts()
    const [policies, setPolicies] = useState<PostagePolicyDto[]>([])
    const [loading, setLoading] = useState(true)
    const [showNew, setShowNew] = useState(false)

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const response = await postagePoliciesApi.list()
            setPolicies(response.Data ?? [])
        } catch {
            setPolicies([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        void load()
    }, [load])

    const { form, submit, isSubmitting, formError } = useApiForm({
        schema: postagePolicyFormSchema,
        defaultValues: { name: '', costToBuyer: 0, actualCost: 0 },
        onSubmit: async (values) => {
            const response = await postagePoliciesApi.create({
                name: values.name,
                costToBuyer: values.costToBuyer,
                actualCost: values.actualCost,
            })
            showInfo(response.Message ?? 'Postage policy created')
            if (response.Data?.Id) {
                navigate(`/postage-policies/${response.Data.Id}`)
            }
        },
        onSuccess: async () => {
            form.reset({ name: '', costToBuyer: 0, actualCost: 0 })
            setShowNew(false)
            await load()
        },
    })

    return (
        <>
            <Row>
                <Col>
                    <h1>Postage Policies</h1>
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

            {loading ? (
                <div className="page-loading">Loading…</div>
            ) : (
                <DataTable
                    data={policies}
                    columns={columns}
                    getRowId={(row) => row.Id}
                />
            )}

            <FormModal
                show={showNew}
                title="New Postage Policy"
                onHide={() => setShowNew(false)}
                onSubmit={submit}
                formError={formError}
                submitLabel="Create"
                isSubmitting={isSubmitting}
            >
                <FormField control={form.control} name="name" label="Name" />
                <FormField
                    control={form.control}
                    name="costToBuyer"
                    label="Cost To Buyer"
                    type="number"
                    step="0.01"
                />
                <FormField
                    control={form.control}
                    name="actualCost"
                    label="Actual Cost"
                    type="number"
                    step="0.01"
                />
            </FormModal>
        </>
    )
}
