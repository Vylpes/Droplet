import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import type { NoteDto, SupplyDto } from '@droplet/shared'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChevronCircleLeft,
    faComment,
    faEdit,
} from '@fortawesome/free-solid-svg-icons'
import { suppliesApi } from '../../api/client'
import { useAlerts } from '../../alerts/useAlerts'
import { AddNoteModal } from '../../components/AddNoteModal'
import { DetailField } from '../../components/DetailField'
import { NotesCard } from '../../components/NotesCard'
import {
    FormField,
    FormModal,
    useApiForm,
} from '../../components/form'
import { editSupplySchema, supplyQuantitySchema } from '../../validation'

export function SupplyViewPage() {
    const { Id = '' } = useParams()
    const { showInfo } = useAlerts()
    const [supply, setSupply] = useState<SupplyDto | null>(null)
    const [notes, setNotes] = useState<NoteDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showEdit, setShowEdit] = useState(false)
    const [showQuantity, setShowQuantity] = useState(false)
    const [showNote, setShowNote] = useState(false)

    const load = useCallback(async () => {
        if (!Id) return
        setLoading(true)
        setError(null)
        try {
            const response = await suppliesApi.get(Id)
            setSupply(response.Data?.Supply ?? null)
            setNotes(response.Data?.Notes ?? [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load')
            setSupply(null)
            setNotes([])
        } finally {
            setLoading(false)
        }
    }, [Id])

    useEffect(() => {
        void load()
    }, [load])

    const editForm = useApiForm({
        schema: editSupplySchema,
        defaultValues: { name: '', sku: '' },
        onSubmit: async (values) => {
            const response = await suppliesApi.update(Id, values)
            showInfo(response.Message ?? 'Supply updated')
        },
        onSuccess: async () => {
            setShowEdit(false)
            await load()
        },
    })

    const quantityForm = useApiForm({
        schema: supplyQuantitySchema,
        defaultValues: { unused: 0, used: 0 },
        onSubmit: async (values) => {
            const response = await suppliesApi.updateQuantity(Id, values)
            showInfo(response.Message ?? 'Quantities updated')
        },
        onSuccess: async () => {
            setShowQuantity(false)
            await load()
        },
    })

    useEffect(() => {
        if (supply && showEdit) {
            editForm.form.reset({ name: supply.Name, sku: supply.Sku })
        }
    }, [supply, showEdit, editForm.form])

    useEffect(() => {
        if (supply && showQuantity) {
            quantityForm.form.reset({
                unused: supply.UnusedQuantity,
                used: supply.UsedQuantity,
            })
        }
    }, [supply, showQuantity, quantityForm.form])

    if (loading) {
        return <div className="page-loading">Loading…</div>
    }

    if (error || !supply) {
        return <div className="alert alert-danger">{error ?? 'Not found'}</div>
    }

    return (
        <>
            {supply.PurchaseId ? (
                <Link
                    to={`/supply-purchases/view/${supply.PurchaseId}`}
                    className="btn text-primary"
                >
                    <FontAwesomeIcon icon={faChevronCircleLeft} />
                    <span className="ms-1">Back to Purchase</span>
                </Link>
            ) : null}

            <Row className="mt-3">
                <Col>
                    <h1>{supply.Name}</h1>
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
                <Col>
                    <Card>
                        <Card.Header>Basic Details</Card.Header>
                        <Card.Body>
                            <DetailField label="SKU">{supply.Sku}</DetailField>
                            <DetailField label="Buy Price">
                                {supply.BuyPrice}
                            </DetailField>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Header>Quantity</Card.Header>
                        <Card.Body>
                            <DetailField label="Unused">
                                {supply.UnusedQuantity}
                            </DetailField>
                            <DetailField label="Used">
                                {supply.UsedQuantity}
                            </DetailField>
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
                title="Edit Supply"
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
                    name="sku"
                    label="Sku"
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
                    name="unused"
                    label="Unused"
                    type="number"
                    step="1"
                />
                <FormField
                    control={quantityForm.form.control}
                    name="used"
                    label="Used"
                    type="number"
                    step="1"
                />
            </FormModal>

            <AddNoteModal
                show={showNote}
                onHide={() => setShowNote(false)}
                onSubmit={async (text) => {
                    const response = await suppliesApi.addNote(Id, { text })
                    showInfo(response.Message ?? 'Note added')
                }}
                onSuccess={() => void load()}
            />
        </>
    )
}
