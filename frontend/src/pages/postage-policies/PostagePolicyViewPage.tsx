import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import type { ListingDto, PostagePolicyDto } from '@droplet/shared'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArchive,
    faChevronCircleLeft,
    faEdit,
} from '@fortawesome/free-solid-svg-icons'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { postagePoliciesApi } from '../../api/client'
import { useAlerts } from '../../alerts/useAlerts'
import { DetailField } from '../../components/DetailField'
import {
    FormField,
    FormModal,
    useApiForm,
} from '../../components/form'
import {
    DataTable,
    ViewLink,
    createAppColumnHelper,
} from '../../components/table'
import { formatDisplayDate } from '../../utils/dates'
import { ebayListingUrl } from '../../utils/externalLinks'
import {
    confirmActionSchema,
    postagePolicyFormSchema,
} from '../../validation'

const listingHelper = createAppColumnHelper<ListingDto>()
const listingColumns = listingHelper.columns([
    listingHelper.accessor('ListingNumber', {
        header: 'Listing Number',
        cell: ({ getValue }) => {
            const number = getValue()
            return (
                <a href={ebayListingUrl(number)} target="_blank" rel="noreferrer">
                    {number}
                </a>
            )
        },
    }),
    listingHelper.accessor('Name', { header: 'Name' }),
    listingHelper.accessor('Price', { header: 'Price' }),
    listingHelper.accessor('EndDate', {
        header: 'End Date',
        cell: ({ getValue }) => formatDisplayDate(getValue()),
    }),
    listingHelper.display({
        id: 'actions',
        enableSorting: false,
        enableGlobalFilter: false,
        cell: ({ row }) => (
            <ViewLink to={`/listings/view/${row.original.Id}`} />
        ),
    }),
])

export function PostagePolicyViewPage() {
    const { id = '' } = useParams()
    const navigate = useNavigate()
    const { showInfo } = useAlerts()
    const [policy, setPolicy] = useState<PostagePolicyDto | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showEdit, setShowEdit] = useState(false)
    const [showArchive, setShowArchive] = useState(false)

    const load = useCallback(async () => {
        if (!id) return
        setLoading(true)
        setError(null)
        try {
            const response = await postagePoliciesApi.get(id)
            setPolicy(response.Data ?? null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load')
            setPolicy(null)
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        void load()
    }, [load])

    const editForm = useApiForm({
        schema: postagePolicyFormSchema,
        defaultValues: { name: '', costToBuyer: 0, actualCost: 0 },
        onSubmit: async (values) => {
            const response = await postagePoliciesApi.update(id, {
                name: values.name,
                costToBuyer: values.costToBuyer,
                actualCost: values.actualCost,
            })
            showInfo(response.Message ?? 'Postage policy updated')
        },
        onSuccess: async () => {
            setShowEdit(false)
            await load()
        },
    })

    const archiveForm = useApiForm({
        schema: confirmActionSchema,
        defaultValues: {},
        onSubmit: async () => {
            const response = await postagePoliciesApi.archive(id)
            showInfo(response.Message ?? 'Postage policy archived')
            navigate('/postage-policies')
        },
        onSuccess: async () => {
            setShowArchive(false)
        },
    })

    useEffect(() => {
        if (policy && showEdit) {
            editForm.form.reset({
                name: policy.Name,
                costToBuyer: policy.CostToBuyer,
                actualCost: policy.ActualCost,
            })
        }
    }, [policy, showEdit, editForm.form])

    if (loading) {
        return <div className="page-loading">Loading…</div>
    }

    if (error || !policy) {
        return <div className="alert alert-danger">{error ?? 'Not found'}</div>
    }

    return (
        <>
            <Link to="/postage-policies" className="btn text-primary">
                <FontAwesomeIcon icon={faChevronCircleLeft} />
                <span className="ms-1">Back to List</span>
            </Link>

            <Row className="mt-3">
                <Col>
                    <h1>{policy.Name}</h1>
                </Col>
                <Col>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button
                            type="button"
                            className="btn text-secondary"
                            onClick={() => setShowArchive(true)}
                        >
                            <FontAwesomeIcon icon={faArchive} />
                            <span className="ms-1">Archive</span>
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
                            <DetailField label="Cost To Buyer">
                                {policy.CostToBuyer}
                            </DetailField>
                            <DetailField label="Actual Cost">
                                {policy.ActualCost}
                            </DetailField>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card>
                        <Card.Header>Listings</Card.Header>
                        <Card.Body>
                            <DataTable
                                data={policy.Listings ?? []}
                                columns={listingColumns}
                                getRowId={(row) => row.Id}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <FormModal
                show={showEdit}
                title="Edit Postage Policy"
                onHide={() => setShowEdit(false)}
                onSubmit={editForm.submit}
                formError={editForm.formError}
                submitLabel="Update"
                isSubmitting={editForm.isSubmitting}
            >
                <FormField
                    control={editForm.form.control}
                    name="name"
                    label="Name"
                />
                <FormField
                    control={editForm.form.control}
                    name="costToBuyer"
                    label="Cost To Buyer"
                    type="number"
                    step="0.01"
                />
                <FormField
                    control={editForm.form.control}
                    name="actualCost"
                    label="Actual Cost"
                    type="number"
                    step="0.01"
                />
            </FormModal>

            <FormModal
                show={showArchive}
                title="Archive Postage Policy"
                onHide={() => setShowArchive(false)}
                onSubmit={archiveForm.submit}
                formError={archiveForm.formError}
                submitLabel="Update"
                isSubmitting={archiveForm.isSubmitting}
            >
                <p className="mb-0">
                    Are you sure you want to archive this postage policy?
                </p>
            </FormModal>
        </>
    )
}
