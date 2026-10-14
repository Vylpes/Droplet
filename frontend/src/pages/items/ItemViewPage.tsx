import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import type { ItemDto, NoteDto } from '@droplet/shared'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChevronCircleLeft,
    faComment,
    faEdit,
} from '@fortawesome/free-solid-svg-icons'
import { itemsApi } from '../../api/client'
import { useAlerts } from '../../alerts/useAlerts'
import { AddNoteModal } from '../../components/AddNoteModal'
import { DetailField } from '../../components/DetailField'
import { NotesCard } from '../../components/NotesCard'
import {
    FormField,
    FormModal,
    useApiForm,
} from '../../components/form'
import { editItemSchema, itemQuantitySchema } from '../../validation'

export function ItemViewPage() {
    const { itemId = '' } = useParams()
    const { showInfo } = useAlerts()
    const [item, setItem] = useState<ItemDto | null>(null)
    const [notes, setNotes] = useState<NoteDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showEdit, setShowEdit] = useState(false)
    const [showQuantity, setShowQuantity] = useState(false)
    const [showNote, setShowNote] = useState(false)

    const load = useCallback(async () => {
        if (!itemId) return
        setLoading(true)
        setError(null)
        try {
            const response = await itemsApi.get(itemId)
            setItem(response.Data?.Item ?? null)
            setNotes(response.Data?.Notes ?? [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load')
            setItem(null)
            setNotes([])
        } finally {
            setLoading(false)
        }
    }, [itemId])

    useEffect(() => {
        void load()
    }, [load])

    const editForm = useApiForm({
        schema: editItemSchema,
        defaultValues: { name: '' },
        onSubmit: async (values) => {
            const response = await itemsApi.update(itemId, values)
            showInfo(response.Message ?? 'Item updated')
        },
        onSuccess: async () => {
            setShowEdit(false)
            await load()
        },
    })

    const quantityForm = useApiForm({
        schema: itemQuantitySchema,
        defaultValues: {
            unlisted: 0,
            listed: 0,
            sold: 0,
            rejected: 0,
        },
        onSubmit: async (values) => {
            const response = await itemsApi.updateQuantity(itemId, values)
            showInfo(response.Message ?? 'Quantities updated')
        },
        onSuccess: async () => {
            setShowQuantity(false)
            await load()
        },
    })

    useEffect(() => {
        if (item && showEdit) {
            editForm.form.reset({ name: item.Name })
        }
    }, [item, showEdit, editForm.form])

    useEffect(() => {
        if (item && showQuantity) {
            quantityForm.form.reset({
                unlisted: item.UnlistedQuantity,
                listed: item.ListedQuantity,
                sold: item.SoldQuantity,
                rejected: item.RejectedQuantity,
            })
        }
    }, [item, showQuantity, quantityForm.form])

    if (loading) {
        return <div className="page-loading">Loading…</div>
    }

    if (error || !item) {
        return <div className="alert alert-danger">{error ?? 'Not found'}</div>
    }

    const storage = item.Storage
    const unit = storage?.Parent
    const building = unit?.Parent

    return (
        <>
            {item.PurchaseId ? (
                <Link
                    to={`/item-purchases/view/${item.PurchaseId}`}
                    className="btn text-primary"
                >
                    <FontAwesomeIcon icon={faChevronCircleLeft} />
                    <span className="ms-1">Back to Purchase</span>
                </Link>
            ) : null}

            <Row className="mt-3">
                <Col>
                    <h1>{item.Name}</h1>
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
                            onClick={() => setShowQuantity(true)}
                        >
                            <FontAwesomeIcon icon={faEdit} />
                            <span className="ms-1">Quantity</span>
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
                            <DetailField label="SKU">{item.Sku}</DetailField>
                            <DetailField label="Buy Price">
                                {item.BuyPrice}
                            </DetailField>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Header>Quantity</Card.Header>
                        <Card.Body>
                            <DetailField label="Unlisted">
                                {item.UnlistedQuantity}
                            </DetailField>
                            <DetailField label="Listed">
                                {item.ListedQuantity}
                            </DetailField>
                            <DetailField label="Sold">
                                {item.SoldQuantity}
                            </DetailField>
                            <DetailField label="Rejected">
                                {item.RejectedQuantity}
                            </DetailField>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Header>Storage</Card.Header>
                        <Card.Body>
                            {storage ? (
                                <>
                                    {building ? (
                                        <DetailField label="Building">
                                            <Link
                                                to={`/storage/list/unit/${building.Id}`}
                                            >
                                                {building.Name}
                                            </Link>
                                        </DetailField>
                                    ) : null}
                                    {unit ? (
                                        <DetailField label="Unit">
                                            <Link
                                                to={`/storage/list/bin/${unit.Id}`}
                                            >
                                                {unit.Name}
                                            </Link>
                                        </DetailField>
                                    ) : null}
                                    <DetailField label="Bin">
                                        <Link
                                            to={`/storage/view/${storage.Id}`}
                                        >
                                            {storage.Name}
                                        </Link>
                                    </DetailField>
                                </>
                            ) : (
                                <p className="text-muted mb-0">
                                    Not assigned
                                </p>
                            )}
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
                title="Edit Item"
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
            </FormModal>

            <FormModal
                show={showQuantity}
                title="Edit Quantity"
                onHide={() => setShowQuantity(false)}
                onSubmit={quantityForm.submit}
                formError={quantityForm.formError}
                submitLabel="Update"
                isSubmitting={quantityForm.isSubmitting}
            >
                <FormField
                    control={quantityForm.form.control}
                    name="unlisted"
                    label="Unlisted"
                    type="number"
                    step="1"
                />
                <FormField
                    control={quantityForm.form.control}
                    name="listed"
                    label="Listed"
                    type="number"
                    step="1"
                />
                <FormField
                    control={quantityForm.form.control}
                    name="sold"
                    label="Sold"
                    type="number"
                    step="1"
                />
                <FormField
                    control={quantityForm.form.control}
                    name="rejected"
                    label="Rejected"
                    type="number"
                    step="1"
                />
            </FormModal>

            <AddNoteModal
                show={showNote}
                onHide={() => setShowNote(false)}
                onSubmit={async (text) => {
                    const response = await itemsApi.addNote(itemId, { text })
                    showInfo(response.Message ?? 'Note added')
                }}
                onSuccess={() => void load()}
            />
        </>
    )
}
