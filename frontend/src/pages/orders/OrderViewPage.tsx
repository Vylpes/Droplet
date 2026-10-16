import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import type {
    ListingDto,
    NoteDto,
    OrderDto,
    PostagePolicyDto,
    SupplyDto,
    TrackingNumberDto,
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
    faPlusCircle,
    faPlusSquare,
    faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'
import { ordersApi } from '../../api/client'
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
import { formatDisplayDate } from '../../utils/dates'
import {
    ebayBuyerUrl,
    ebayListingUrl,
    ebayOrderUrl,
    trackingServiceName,
    trackingUrl,
} from '../../utils/externalLinks'
import {
    assignOrderListingSchema,
    assignOrderSupplySchema,
    assignTrackingSchema,
    confirmActionSchema,
    editOrderSchema,
    orderDiscountSchema,
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

const supplyHelper = createAppColumnHelper<SupplyDto>()
const supplyColumns = supplyHelper.columns([
    supplyHelper.accessor('Sku', { header: 'SKU' }),
    supplyHelper.accessor('Name', { header: 'Name' }),
    supplyHelper.accessor('BuyPrice', { header: 'Price' }),
    supplyHelper.display({
        id: 'actions',
        enableSorting: false,
        enableGlobalFilter: false,
        cell: ({ row }) => <ViewLink to={`/supplies/${row.original.Id}`} />,
    }),
])

const trackingHelper = createAppColumnHelper<TrackingNumberDto>()
const trackingColumns = trackingHelper.columns([
    trackingHelper.accessor('Number', {
        header: 'Number',
        cell: ({ row, getValue }) => {
            const number = getValue()
            const url = trackingUrl(row.original.Service, number)
            if (!url) return number
            return (
                <a href={url} target="_blank" rel="noreferrer">
                    {number}
                </a>
            )
        },
    }),
    trackingHelper.accessor('Service', {
        header: 'Service',
        cell: ({ getValue, row }) =>
            row.original.ServiceName || trackingServiceName(getValue()),
    }),
])

export function OrderViewPage() {
    const { Id = '' } = useParams()
    const { showInfo } = useAlerts()
    const [order, setOrder] = useState<OrderDto | null>(null)
    const [listings, setListings] = useState<ListingDto[]>([])
    const [supplies, setSupplies] = useState<SupplyDto[]>([])
    const [postagePolicies, setPostagePolicies] = useState<PostagePolicyDto[]>(
        []
    )
    const [notes, setNotes] = useState<NoteDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showEdit, setShowEdit] = useState(false)
    const [showPaid, setShowPaid] = useState(false)
    const [showDispatch, setShowDispatch] = useState(false)
    const [showDiscount, setShowDiscount] = useState(false)
    const [showAddListing, setShowAddListing] = useState(false)
    const [showAddSupply, setShowAddSupply] = useState(false)
    const [showAddTracking, setShowAddTracking] = useState(false)
    const [showNote, setShowNote] = useState(false)

    const load = useCallback(async () => {
        if (!Id) return
        setLoading(true)
        setError(null)
        try {
            const response = await ordersApi.get(Id)
            setOrder(response.Data?.Order ?? null)
            setListings(response.Data?.Listings ?? [])
            setSupplies(response.Data?.Supplies ?? [])
            setPostagePolicies(response.Data?.PostagePolicies ?? [])
            setNotes(response.Data?.Notes ?? [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load')
            setOrder(null)
            setListings([])
            setSupplies([])
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
        schema: editOrderSchema,
        defaultValues: {
            orderNumber: '',
            buyer: '',
            offerAccepted: 'false',
            postagePolicyId: '',
        },
        onSubmit: async (values) => {
            const response = await ordersApi.update(Id, {
                orderNumber: values.orderNumber,
                buyer: values.buyer,
                offerAccepted: values.offerAccepted,
                postagePolicyId: values.postagePolicyId ?? '',
            })
            showInfo(response.Message ?? 'Order updated')
        },
        onSuccess: async () => {
            setShowEdit(false)
            await load()
        },
    })

    const paidForm = useApiForm({
        schema: confirmActionSchema,
        defaultValues: {},
        onSubmit: async () => {
            const response = await ordersApi.paid(Id)
            showInfo(response.Message ?? 'Order marked as paid')
        },
        onSuccess: async () => {
            setShowPaid(false)
            await load()
        },
    })

    const dispatchForm = useApiForm({
        schema: confirmActionSchema,
        defaultValues: {},
        onSubmit: async () => {
            const response = await ordersApi.dispatch(Id)
            showInfo(response.Message ?? 'Order marked as dispatched')
        },
        onSuccess: async () => {
            setShowDispatch(false)
            await load()
        },
    })

    const discountForm = useApiForm({
        schema: orderDiscountSchema,
        defaultValues: { amount: 0 },
        onSubmit: async (values) => {
            const response = await ordersApi.discount(Id, values)
            showInfo(response.Message ?? 'Discount applied')
        },
        onSuccess: async () => {
            discountForm.form.reset({ amount: 0 })
            setShowDiscount(false)
            await load()
        },
    })

    const addListingForm = useApiForm({
        schema: assignOrderListingSchema,
        defaultValues: { listingId: '', amount: 1 },
        onSubmit: async (values) => {
            const response = await ordersApi.assignListing(Id, values)
            showInfo(response.Message ?? 'Listing assigned')
        },
        onSuccess: async () => {
            addListingForm.form.reset({ listingId: '', amount: 1 })
            setShowAddListing(false)
            await load()
        },
    })

    const addSupplyForm = useApiForm({
        schema: assignOrderSupplySchema,
        defaultValues: { supplyId: '', amount: 1 },
        onSubmit: async (values) => {
            const response = await ordersApi.assignSupply(Id, values)
            showInfo(response.Message ?? 'Supply assigned')
        },
        onSuccess: async () => {
            addSupplyForm.form.reset({ supplyId: '', amount: 1 })
            setShowAddSupply(false)
            await load()
        },
    })

    const addTrackingForm = useApiForm({
        schema: assignTrackingSchema,
        defaultValues: { number: '', service: 0 },
        onSubmit: async (values) => {
            const response = await ordersApi.assignTrackingNumber(Id, values)
            showInfo(response.Message ?? 'Tracking number assigned')
        },
        onSuccess: async () => {
            addTrackingForm.form.reset({ number: '', service: 0 })
            setShowAddTracking(false)
            await load()
        },
    })

    useEffect(() => {
        if (order && showEdit) {
            editForm.form.reset({
                orderNumber: order.OrderNumber,
                buyer: order.Buyer,
                offerAccepted: order.OfferAccepted ? 'true' : 'false',
                postagePolicyId: order.PostagePolicy?.Id ?? '',
            })
        }
    }, [order, showEdit, editForm.form])

    if (loading) {
        return <div className="page-loading">Loading…</div>
    }

    if (error || !order) {
        return <div className="alert alert-danger">{error ?? 'Not found'}</div>
    }

    const orderListings = order.Listings ?? []
    const orderSupplies = order.Supplies ?? []
    const trackingNumbers = order.TrackingNumbers ?? []

    return (
        <>
            <Link to="/orders/awaiting-payment" className="btn text-primary">
                <FontAwesomeIcon icon={faChevronCircleLeft} />
                <span className="ms-1">Back to List</span>
            </Link>

            <Row className="mt-3">
                <Col>
                    <h1>Order</h1>
                </Col>
                <Col>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end flex-wrap">
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
                            onClick={() => setShowAddTracking(true)}
                        >
                            <FontAwesomeIcon icon={faPlusSquare} />
                            <span className="ms-1">Add Tracking Number</span>
                        </button>
                        <button
                            type="button"
                            className="btn text-secondary"
                            onClick={() => setShowAddListing(true)}
                        >
                            <FontAwesomeIcon icon={faPlusSquare} />
                            <span className="ms-1">Add Listing</span>
                        </button>
                        <button
                            type="button"
                            className="btn text-secondary"
                            onClick={() => setShowAddSupply(true)}
                        >
                            <FontAwesomeIcon icon={faPlusSquare} />
                            <span className="ms-1">Add Supply</span>
                        </button>
                        <button
                            type="button"
                            className="btn text-secondary"
                            onClick={() => setShowPaid(true)}
                        >
                            <FontAwesomeIcon icon={faCalendar} />
                            <span className="ms-1">Mark as Paid</span>
                        </button>
                        <button
                            type="button"
                            className="btn text-secondary"
                            onClick={() => setShowDispatch(true)}
                        >
                            <FontAwesomeIcon icon={faPlusCircle} />
                            <span className="ms-1">Mark as Dispatched</span>
                        </button>
                        <button
                            type="button"
                            className="btn text-secondary"
                            onClick={() => setShowDiscount(true)}
                        >
                            <FontAwesomeIcon icon={faTimesCircle} />
                            <span className="ms-1">Discount</span>
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
                    <Card className="mb-3">
                        <Card.Header>Basic Details</Card.Header>
                        <Card.Body>
                            <DetailField label="Order Number">
                                <a
                                    href={ebayOrderUrl(order.OrderNumber)}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {order.OrderNumber}
                                </a>
                            </DetailField>
                            <DetailField label="Price">{order.Price}</DetailField>
                            <DetailField label="Offer Accepted">
                                {String(order.OfferAccepted)}
                            </DetailField>
                            <DetailField label="Buyer">
                                <a
                                    href={ebayBuyerUrl(order.Buyer)}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {order.Buyer}
                                </a>
                            </DetailField>
                            <DetailField label="Status">
                                {order.StatusName}
                            </DetailField>
                            <DetailField label="Dispatch By">
                                {formatDisplayDate(order.DispatchBy)}
                            </DetailField>
                            <DetailField label="Listings">
                                {orderListings.length}
                            </DetailField>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header>Postage Policy</Card.Header>
                        <Card.Body>
                            {order.PostagePolicy ? (
                                <>
                                    <DetailField label="Name">
                                        <Link
                                            to={`/postage-policies/${order.PostagePolicy.Id}`}
                                            target="_blank"
                                        >
                                            {order.PostagePolicy.Name}
                                        </Link>
                                    </DetailField>
                                    <DetailField label="Cost To Buyer">
                                        {order.PostagePolicy.CostToBuyer}
                                    </DetailField>
                                    <DetailField label="Actual Cost">
                                        {order.PostagePolicy.ActualCost}
                                    </DetailField>
                                </>
                            ) : (
                                <p className="mb-0 text-secondary">None</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card className="mb-3">
                        <Card.Header>Listings</Card.Header>
                        <Card.Body>
                            <DataTable
                                data={orderListings}
                                columns={listingColumns}
                                getRowId={(row) => row.Id}
                            />
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Header>Supplies</Card.Header>
                        <Card.Body>
                            <DataTable
                                data={orderSupplies}
                                columns={supplyColumns}
                                getRowId={(row) => row.Id}
                            />
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Header>Tracking Numbers</Card.Header>
                        <Card.Body>
                            <DataTable
                                data={trackingNumbers}
                                columns={trackingColumns}
                                getRowId={(row) => row.Id}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-3">
                <Col md={8}>
                    <NotesCard notes={notes} />
                </Col>
            </Row>

            <FormModal
                show={showEdit}
                title="Edit Order"
                onHide={() => setShowEdit(false)}
                onSubmit={editForm.submit}
                formError={editForm.formError}
                submitLabel="Update"
                isSubmitting={editForm.isSubmitting}
            >
                <FormField
                    control={editForm.form.control}
                    name="orderNumber"
                    label="Order Number"
                />
                <FormField
                    control={editForm.form.control}
                    name="buyer"
                    label="Buyer"
                />
                <FormField
                    control={editForm.form.control}
                    name="offerAccepted"
                    label="Offer Accepted"
                    as="select"
                >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                </FormField>
                <FormField
                    control={editForm.form.control}
                    name="postagePolicyId"
                    label="Postage Policy"
                    as="select"
                >
                    <option value="">- None -</option>
                    {postagePolicies.map((policy) => (
                        <option key={policy.Id} value={policy.Id}>
                            {policy.Name}
                        </option>
                    ))}
                </FormField>
            </FormModal>

            <FormModal
                show={showPaid}
                title="Mark As Paid"
                onHide={() => setShowPaid(false)}
                onSubmit={paidForm.submit}
                formError={paidForm.formError}
                submitLabel="Yes"
                isSubmitting={paidForm.isSubmitting}
            >
                <p className="mb-0">
                    Are you sure you want to mark this order as paid?
                </p>
            </FormModal>

            <FormModal
                show={showDispatch}
                title="Mark As Dispatched"
                onHide={() => setShowDispatch(false)}
                onSubmit={dispatchForm.submit}
                formError={dispatchForm.formError}
                submitLabel="Yes"
                isSubmitting={dispatchForm.isSubmitting}
            >
                <p className="mb-0">
                    Are you sure you want to mark this order as dispatched?
                </p>
            </FormModal>

            <FormModal
                show={showDiscount}
                title="Apply Discount"
                onHide={() => setShowDiscount(false)}
                onSubmit={discountForm.submit}
                formError={discountForm.formError}
                submitLabel="Apply"
                isSubmitting={discountForm.isSubmitting}
            >
                <FormField
                    control={discountForm.form.control}
                    name="amount"
                    label="Amount"
                    type="number"
                    step="0.01"
                />
            </FormModal>

            <FormModal
                show={showAddListing}
                title="Add Listing"
                onHide={() => setShowAddListing(false)}
                onSubmit={addListingForm.submit}
                formError={addListingForm.formError}
                submitLabel="Add"
                isSubmitting={addListingForm.isSubmitting}
            >
                <FormField
                    control={addListingForm.form.control}
                    name="listingId"
                    label="Listing"
                    as="select"
                >
                    <option value="">Select listing…</option>
                    {listings.map((listing) => (
                        <option key={listing.Id} value={listing.Id}>
                            {listing.ListingNumber} {listing.Name}
                        </option>
                    ))}
                </FormField>
                <FormField
                    control={addListingForm.form.control}
                    name="amount"
                    label="Amount"
                    type="number"
                    step="1"
                />
            </FormModal>

            <FormModal
                show={showAddSupply}
                title="Add Supply"
                onHide={() => setShowAddSupply(false)}
                onSubmit={addSupplyForm.submit}
                formError={addSupplyForm.formError}
                submitLabel="Add"
                isSubmitting={addSupplyForm.isSubmitting}
            >
                <FormField
                    control={addSupplyForm.form.control}
                    name="supplyId"
                    label="Supply"
                    as="select"
                >
                    <option value="">Select supply…</option>
                    {supplies.map((supply) => (
                        <option key={supply.Id} value={supply.Id}>
                            {supply.Sku} {supply.Name}
                        </option>
                    ))}
                </FormField>
                <FormField
                    control={addSupplyForm.form.control}
                    name="amount"
                    label="Amount"
                    type="number"
                    step="1"
                />
            </FormModal>

            <FormModal
                show={showAddTracking}
                title="Add Tracking Number"
                onHide={() => setShowAddTracking(false)}
                onSubmit={addTrackingForm.submit}
                formError={addTrackingForm.formError}
                submitLabel="Add"
                isSubmitting={addTrackingForm.isSubmitting}
            >
                <FormField
                    control={addTrackingForm.form.control}
                    name="number"
                    label="Number"
                />
                <FormField
                    control={addTrackingForm.form.control}
                    name="service"
                    label="Service"
                    as="select"
                >
                    <option value={0}>Royal Mail</option>
                    <option value={1}>Hermes</option>
                </FormField>
            </FormModal>

            <AddNoteModal
                show={showNote}
                onHide={() => setShowNote(false)}
                onSubmit={async (text) => {
                    const response = await ordersApi.addNote(Id, { text })
                    showInfo(response.Message ?? 'Note added')
                }}
                onSuccess={() => void load()}
            />
        </>
    )
}
