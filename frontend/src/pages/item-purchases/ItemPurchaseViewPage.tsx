import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import type { ItemDto, ItemPurchaseDto, NoteDto } from '@droplet/shared'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChevronCircleLeft,
    faComment,
    faEdit,
    faPlusSquare,
} from '@fortawesome/free-solid-svg-icons'
import { itemPurchasesApi, itemsApi } from '../../api/client'
import { useAlerts } from '../../alerts/useAlerts'
import { AddNoteModal } from '../../components/AddNoteModal'
import { DetailField } from '../../components/DetailField'
import { NotesCard } from '../../components/NotesCard'
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
import { suggestedPurchaseStatus } from '../../components/purchaseStatus'
import {
    newItemSchema,
    purchaseFormSchema,
    purchaseStatusSchema,
} from '../../validation'

const itemHelper = createAppColumnHelper<ItemDto>()
const itemColumns = itemHelper.columns([
    itemHelper.accessor('Name', { header: 'Name' }),
    itemHelper.accessor('Sku', { header: 'SKU' }),
    itemHelper.accessor(
        (row) =>
            row.UnlistedQuantity +
            row.ListedQuantity +
            row.SoldQuantity +
            row.RejectedQuantity,
        { id: 'quantity', header: 'Quantity' }
    ),
    itemHelper.accessor('StatusName', { header: 'Status' }),
    itemHelper.accessor('BuyPrice', { header: 'Buy Price' }),
    itemHelper.display({
        id: 'actions',
        enableSorting: false,
        enableGlobalFilter: false,
        cell: ({ row }) => <ViewLink to={`/items/${row.original.Id}`} />,
    }),
])

export function ItemPurchaseViewPage() {
    const { Id = '' } = useParams()
    const { showInfo } = useAlerts()
    const [purchase, setPurchase] = useState<ItemPurchaseDto | null>(null)
    const [notes, setNotes] = useState<NoteDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showEdit, setShowEdit] = useState(false)
    const [showStatus, setShowStatus] = useState(false)
    const [showNewItem, setShowNewItem] = useState(false)
    const [showNote, setShowNote] = useState(false)

    const load = useCallback(async () => {
        if (!Id) return
        setLoading(true)
        setError(null)
        try {
            const response = await itemPurchasesApi.get(Id)
            setPurchase(response.Data?.Purchase ?? null)
            setNotes(response.Data?.Notes ?? [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load')
            setPurchase(null)
            setNotes([])
        } finally {
            setLoading(false)
        }
    }, [Id])

    useEffect(() => {
        void load()
    }, [load])

    const editForm = useApiForm({
        schema: purchaseFormSchema,
        defaultValues: { description: '', price: 0 },
        onSubmit: async (values) => {
            const response = await itemPurchasesApi.update(Id, values)
            showInfo(response.Message ?? 'Purchase updated')
        },
        onSuccess: async () => {
            setShowEdit(false)
            await load()
        },
    })

    const statusForm = useApiForm({
        schema: purchaseStatusSchema,
        defaultValues: { status: 0 },
        onSubmit: async (values) => {
            const response = await itemPurchasesApi.updateStatus(Id, {
                status: values.status,
            })
            showInfo(response.Message ?? 'Status updated')
        },
        onSuccess: async () => {
            setShowStatus(false)
            await load()
        },
    })

    const newItemForm = useApiForm({
        schema: newItemSchema,
        defaultValues: { name: '', quantity: 1 },
        onSubmit: async (values) => {
            const response = await itemsApi.create({
                name: values.name,
                quantity: values.quantity,
                purchaseId: Id,
            })
            showInfo(response.Message ?? 'Item created')
        },
        onSuccess: async () => {
            newItemForm.form.reset({ name: '', quantity: 1 })
            setShowNewItem(false)
            await load()
        },
    })

    useEffect(() => {
        if (purchase && showEdit) {
            editForm.form.reset({
                description: purchase.Description,
                price: purchase.Price,
            })
        }
    }, [purchase, showEdit, editForm.form])

    useEffect(() => {
        if (purchase && showStatus) {
            statusForm.form.reset({
                status: suggestedPurchaseStatus(purchase.Status),
            })
        }
    }, [purchase, showStatus, statusForm.form])

    if (loading) {
        return <div className="page-loading">Loading…</div>
    }

    if (error || !purchase) {
        return <div className="alert alert-danger">{error ?? 'Not found'}</div>
    }

    const items = purchase.Items ?? []

    return (
        <>
            <Link to="/item-purchases/ordered" className="btn text-primary">
                <FontAwesomeIcon icon={faChevronCircleLeft} />
                <span className="ms-1">Back to List</span>
            </Link>

            <Row className="mt-3">
                <Col>
                    <h1>{purchase.Description}</h1>
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
                            onClick={() => setShowStatus(true)}
                        >
                            <FontAwesomeIcon icon={faEdit} />
                            <span className="ms-1">Update Status</span>
                        </button>
                        <button
                            type="button"
                            className="btn text-secondary"
                            onClick={() => setShowNewItem(true)}
                        >
                            <FontAwesomeIcon icon={faPlusSquare} />
                            <span className="ms-1">Add Item</span>
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
                            <DetailField label="Description">
                                {purchase.Description}
                            </DetailField>
                            <DetailField label="Status">
                                {purchase.StatusName}
                            </DetailField>
                            <DetailField label="Price">
                                {purchase.Price}
                            </DetailField>
                            <DetailField label="Items">
                                {items.length}
                            </DetailField>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card>
                        <Card.Header>Items</Card.Header>
                        <Card.Body>
                            <DataTable
                                data={items}
                                columns={itemColumns}
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
                title="Edit Purchase"
                onHide={() => setShowEdit(false)}
                onSubmit={editForm.submit}
                formError={editForm.formError}
                submitLabel="Update"
                isSubmitting={editForm.isSubmitting}
            >
                <FormField
                    control={editForm.form.control}
                    name="description"
                    label="Name"
                />
                <FormField
                    control={editForm.form.control}
                    name="price"
                    label="Price"
                    type="number"
                    step="0.01"
                />
            </FormModal>

            <FormModal
                show={showStatus}
                title="Update Status"
                onHide={() => setShowStatus(false)}
                onSubmit={statusForm.submit}
                formError={statusForm.formError}
                submitLabel="Create"
                isSubmitting={statusForm.isSubmitting}
            >
                <FormField
                    control={statusForm.form.control}
                    name="status"
                    label="Status"
                    as="select"
                >
                    <option value={0}>Ordered</option>
                    <option value={1}>Received</option>
                    <option value={2}>Inventoried</option>
                    <option value={3}>Complete</option>
                    <option value={4}>Rejected</option>
                </FormField>
            </FormModal>

            <FormModal
                show={showNewItem}
                title="New Item"
                onHide={() => setShowNewItem(false)}
                onSubmit={newItemForm.submit}
                formError={newItemForm.formError}
                submitLabel="Create"
                isSubmitting={newItemForm.isSubmitting}
            >
                <FormField
                    control={newItemForm.form.control}
                    name="name"
                    label="Name"
                />
                <FormField
                    control={newItemForm.form.control}
                    name="quantity"
                    label="Quantity"
                    type="number"
                    step="1"
                />
            </FormModal>

            <AddNoteModal
                show={showNote}
                onHide={() => setShowNote(false)}
                onSubmit={async (text) => {
                    const response = await itemPurchasesApi.addNote(Id, {
                        text,
                    })
                    showInfo(response.Message ?? 'Note added')
                }}
                onSuccess={() => void load()}
            />
        </>
    )
}
