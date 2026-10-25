import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import type {
    ItemDto,
    ListingDto,
    NoteDto,
    PostagePolicyDto,
} from '@droplet/shared'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCalendar,
    faChevronCircleLeft,
    faComment,
    faEdit,
    faPlusSquare,
    faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'
import { listingsApi } from '../../api/client'
import { useAlerts } from '../../alerts/useAlerts'
import { AddNoteModal } from '../../components/AddNoteModal'
import { DetailField } from '../../components/DetailField'
import { NotesCard } from '../../components/NotesCard'
import { FormField, FormModal, useApiForm } from '../../components/form'
import {
    DataTable,
    ViewLink,
    createAppColumnHelper,
} from '../../components/table'
import { formatDisplayDate, toDateInputValue } from '../../utils/dates'
import { ebayListingUrl } from '../../utils/externalLinks'
import {
    assignListingItemSchema,
    assignPostagePolicySchema,
    confirmActionSchema,
    editListingSchema,
    renewListingSchema,
} from '../../validation'

const itemHelper = createAppColumnHelper<ItemDto>()
const itemColumns = itemHelper.columns([
    itemHelper.accessor('Name', { header: 'Name' }),
    itemHelper.accessor('Sku', { header: 'SKU' }),
    itemHelper.accessor('StatusName', { header: 'Status' }),
    itemHelper.accessor('BuyPrice', { header: 'Buy Price' }),
    itemHelper.display({
        id: 'actions',
        enableSorting: false,
        enableGlobalFilter: false,
        cell: ({ row }) => <ViewLink to={`/items/${row.original.Id}`} />,
    }),
])

export function ListingViewPage() {
    const { Id = '' } = useParams()
    const { showInfo } = useAlerts()
    const [listing, setListing] = useState<ListingDto | null>(null)
    const [items, setItems] = useState<ItemDto[]>([])
    const [postagePolicies, setPostagePolicies] = useState<PostagePolicyDto[]>(
        []
    )
    const [notes, setNotes] = useState<NoteDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showEdit, setShowEdit] = useState(false)
    const [showEnd, setShowEnd] = useState(false)
    const [showRenew, setShowRenew] = useState(false)
    const [showAddItem, setShowAddItem] = useState(false)
    const [showAddPolicy, setShowAddPolicy] = useState(false)
    const [showNote, setShowNote] = useState(false)

    const load = useCallback(async () => {
        if (!Id) return
        setLoading(true)
        setError(null)
        try {
            const response = await listingsApi.get(Id)
            setListing(response.Data?.Listing ?? null)
            setItems(response.Data?.Items ?? [])
            setPostagePolicies(response.Data?.PostagePolicies ?? [])
            setNotes(response.Data?.Notes ?? [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load')
            setListing(null)
            setItems([])
            setPostagePolicies([])
            setNotes([])
        } finally {
            setLoading(false)
        }
    }, [Id])

    useEffect(() => {
        void load()
    }, [load])

    const editForm = useApiForm({
        schema: editListingSchema,
        defaultValues: {
            name: '',
            listingNumber: '',
            price: 0,
            quantity: 0,
        },
        onSubmit: async (values) => {
            const response = await listingsApi.update(Id, values)
            showInfo(response.Message ?? 'Listing updated')
        },
        onSuccess: async () => {
            setShowEdit(false)
            await load()
        },
    })

    const endForm = useApiForm({
        schema: confirmActionSchema,
        defaultValues: {},
        onSubmit: async () => {
            const response = await listingsApi.end(Id)
            showInfo(response.Message ?? 'Listing ended')
        },
        onSuccess: async () => {
            setShowEnd(false)
            await load()
        },
    })

    const renewForm = useApiForm({
        schema: renewListingSchema,
        defaultValues: { endDate: '' },
        onSubmit: async (values) => {
            const response = await listingsApi.renew(Id, values)
            showInfo(response.Message ?? 'Listing renewed')
        },
        onSuccess: async () => {
            setShowRenew(false)
            await load()
        },
    })

    const addItemForm = useApiForm({
        schema: assignListingItemSchema,
        defaultValues: { itemId: '' },
        onSubmit: async (values) => {
            const response = await listingsApi.assignItem(Id, values)
            showInfo(response.Message ?? 'Item assigned')
        },
        onSuccess: async () => {
            addItemForm.form.reset({ itemId: '' })
            setShowAddItem(false)
            await load()
        },
    })

    const addPolicyForm = useApiForm({
        schema: assignPostagePolicySchema,
        defaultValues: { policyId: '' },
        onSubmit: async (values) => {
            const response = await listingsApi.assignPostagePolicy(Id, values)
            showInfo(response.Message ?? 'Postage policy assigned')
        },
        onSuccess: async () => {
            addPolicyForm.form.reset({ policyId: '' })
            setShowAddPolicy(false)
            await load()
        },
    })

    useEffect(() => {
        if (listing && showEdit) {
            editForm.form.reset({
                name: listing.Name,
                listingNumber: listing.ListingNumber,
                price: listing.Price,
                quantity: listing.Quantity,
            })
        }
    }, [listing, showEdit, editForm.form])

    useEffect(() => {
        if (listing && showRenew) {
            renewForm.form.reset({
                endDate: toDateInputValue(listing.EndDate),
            })
        }
    }, [listing, showRenew, renewForm.form])

    if (loading) {
        return <div className="page-loading">Loading…</div>
    }

    if (error || !listing) {
        return <div className="alert alert-danger">{error ?? 'Not found'}</div>
    }

    const listingItems = listing.Items ?? []

    return (
        <>
            <Link to="/listings/active" className="btn text-primary">
                <FontAwesomeIcon icon={faChevronCircleLeft} />
                <span className="ms-1">Back to List</span>
            </Link>

            <Row className="mt-3">
                <Col>
                    <h1>{listing.Name}</h1>
                </Col>
                <Col>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button
                            type="button"
                            className="btn text-secondary"
                            onClick={() => setShowNote(true)}
                        >
                            <FontAwesomeIcon icon={faComment} />
                            <span className="ms-1">Add Note</span>
                        </button>
                        <button
                            type="button"
                            className="btn text-secondary"
                            onClick={() => setShowAddPolicy(true)}
                        >
                            <FontAwesomeIcon icon={faPlusSquare} />
                            <span className="ms-1">Add Postage Policy</span>
                        </button>
                        <button
                            type="button"
                            className="btn text-secondary"
                            onClick={() => setShowAddItem(true)}
                        >
                            <FontAwesomeIcon icon={faPlusSquare} />
                            <span className="ms-1">Add Item</span>
                        </button>
                        <button
                            type="button"
                            className="btn text-secondary"
                            onClick={() => setShowRenew(true)}
                        >
                            <FontAwesomeIcon icon={faCalendar} />
                            <span className="ms-1">Renew</span>
                        </button>
                        <button
                            type="button"
                            className="btn text-secondary"
                            onClick={() => setShowEnd(true)}
                        >
                            <FontAwesomeIcon icon={faTimesCircle} />
                            <span className="ms-1">End</span>
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
                            <DetailField label="Listing Number">
                                <a
                                    href={ebayListingUrl(listing.ListingNumber)}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {listing.ListingNumber}
                                </a>
                            </DetailField>
                            <DetailField label="Price">{listing.Price}</DetailField>
                            <DetailField label="Status">
                                {listing.StatusName}
                            </DetailField>
                            <DetailField label="Quantity">
                                {listing.Quantity}
                            </DetailField>
                            <DetailField label="End Date">
                                {formatDisplayDate(listing.EndDate)}
                            </DetailField>
                            <DetailField label="Relisted Times">
                                {listing.RelistedTimes}
                            </DetailField>
                            <DetailField label="Items">
                                {listingItems.length}
                            </DetailField>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card>
                        <Card.Header>Items</Card.Header>
                        <Card.Body>
                            <DataTable
                                data={listingItems}
                                columns={itemColumns}
                                getRowId={(row) => row.Id}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-3">
                <Col md={4}>
                    <Card>
                        <Card.Header>Postage Policy</Card.Header>
                        <Card.Body>
                            {listing.PostagePolicy ? (
                                <>
                                    <DetailField label="Name">
                                        <Link
                                            to={`/postage-policies/${listing.PostagePolicy.Id}`}
                                            target="_blank"
                                        >
                                            {listing.PostagePolicy.Name}
                                        </Link>
                                    </DetailField>
                                    <DetailField label="Cost To Buyer">
                                        {listing.PostagePolicy.CostToBuyer}
                                    </DetailField>
                                    <DetailField label="Actual Cost">
                                        {listing.PostagePolicy.ActualCost}
                                    </DetailField>
                                </>
                            ) : (
                                <p className="mb-0 text-secondary">None</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <NotesCard notes={notes} />
                </Col>
            </Row>

            <FormModal
                show={showEdit}
                title="Edit Listing"
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
                    name="listingNumber"
                    label="Listing Number"
                />
                <FormField
                    control={editForm.form.control}
                    name="price"
                    label="Price"
                    type="number"
                    step="0.01"
                />
                <FormField
                    control={editForm.form.control}
                    name="quantity"
                    label="Quantity"
                    type="number"
                    step="1"
                    min={0}
                />
            </FormModal>

            <FormModal
                show={showEnd}
                title="End Listing"
                onHide={() => setShowEnd(false)}
                onSubmit={endForm.submit}
                formError={endForm.formError}
                submitLabel="Yes"
                isSubmitting={endForm.isSubmitting}
            >
                <p className="mb-0">
                    Are you sure you want to end this listing?
                </p>
            </FormModal>

            <FormModal
                show={showRenew}
                title="Renew Listing"
                onHide={() => setShowRenew(false)}
                onSubmit={renewForm.submit}
                formError={renewForm.formError}
                submitLabel="Renew"
                isSubmitting={renewForm.isSubmitting}
            >
                <FormField
                    control={renewForm.form.control}
                    name="endDate"
                    label="End Date"
                    type="date"
                />
            </FormModal>

            <FormModal
                show={showAddItem}
                title="Add Item"
                onHide={() => setShowAddItem(false)}
                onSubmit={addItemForm.submit}
                formError={addItemForm.formError}
                submitLabel="Create"
                isSubmitting={addItemForm.isSubmitting}
            >
                <FormField
                    control={addItemForm.form.control}
                    name="itemId"
                    label="Item"
                    as="select"
                >
                    <option value="">Select item…</option>
                    {items.map((item) => (
                        <option key={item.Id} value={item.Id}>
                            {item.Sku} {item.Name}
                        </option>
                    ))}
                </FormField>
            </FormModal>

            <FormModal
                show={showAddPolicy}
                title="Add Postage Policy"
                onHide={() => setShowAddPolicy(false)}
                onSubmit={addPolicyForm.submit}
                formError={addPolicyForm.formError}
                submitLabel="Create"
                isSubmitting={addPolicyForm.isSubmitting}
            >
                <FormField
                    control={addPolicyForm.form.control}
                    name="policyId"
                    label="Postage Policy"
                    as="select"
                >
                    <option value="">Select policy…</option>
                    {postagePolicies.map((policy) => (
                        <option key={policy.Id} value={policy.Id}>
                            {policy.Name}
                        </option>
                    ))}
                </FormField>
            </FormModal>

            <AddNoteModal
                show={showNote}
                onHide={() => setShowNote(false)}
                onSubmit={async (text) => {
                    const response = await listingsApi.addNote(Id, { text })
                    showInfo(response.Message ?? 'Note added')
                }}
                onSuccess={() => void load()}
            />
        </>
    )
}
