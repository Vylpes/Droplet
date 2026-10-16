import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import type { NoteDto, ReturnDto, TrackingNumberDto } from '@droplet/shared'
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
} from '@fortawesome/free-solid-svg-icons'
import { returnsApi } from '../../api/client'
import { useAlerts } from '../../alerts/useAlerts'
import { AddNoteModal } from '../../components/AddNoteModal'
import { DetailField } from '../../components/DetailField'
import { NotesCard } from '../../components/NotesCard'
import { FormField, FormModal, useApiForm } from '../../components/form'
import { DataTable, createAppColumnHelper } from '../../components/table'
import { formatDisplayDate, toDateInputValue } from '../../utils/dates'
import {
    ebayReturnUrl,
    trackingServiceName,
    trackingUrl,
} from '../../utils/externalLinks'
import {
    confirmActionSchema,
    editReturnSchema,
    returnBySchema,
    returnRefundSchema,
} from '../../validation'

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

export function ReturnViewPage() {
    const { Id = '' } = useParams()
    const { showInfo } = useAlerts()
    const [ret, setRet] = useState<ReturnDto | null>(null)
    const [notes, setNotes] = useState<NoteDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showEdit, setShowEdit] = useState(false)
    const [showStarted, setShowStarted] = useState(false)
    const [showPosted, setShowPosted] = useState(false)
    const [showReceived, setShowReceived] = useState(false)
    const [showRefund, setShowRefund] = useState(false)
    const [showClose, setShowClose] = useState(false)
    const [showNote, setShowNote] = useState(false)

    const load = useCallback(async () => {
        if (!Id) return
        setLoading(true)
        setError(null)
        try {
            const response = await returnsApi.get(Id)
            setRet(response.Data?.Return ?? null)
            setNotes(response.Data?.Notes ?? [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load')
            setRet(null)
            setNotes([])
        } finally {
            setLoading(false)
        }
    }, [Id])

    useEffect(() => {
        void load()
    }, [load])

    const editForm = useApiForm({
        schema: editReturnSchema,
        defaultValues: { returnNumber: '', returnBy: '' },
        onSubmit: async (values) => {
            const response = await returnsApi.update(Id, values)
            showInfo(response.Message ?? 'Return updated')
        },
        onSuccess: async () => {
            setShowEdit(false)
            await load()
        },
    })

    const startedForm = useApiForm({
        schema: returnBySchema,
        defaultValues: { returnBy: '' },
        onSubmit: async (values) => {
            const response = await returnsApi.started(Id, values)
            showInfo(response.Message ?? 'Return started')
        },
        onSuccess: async () => {
            startedForm.form.reset({ returnBy: '' })
            setShowStarted(false)
            await load()
        },
    })

    const postedForm = useApiForm({
        schema: confirmActionSchema,
        defaultValues: {},
        onSubmit: async () => {
            const response = await returnsApi.posted(Id)
            showInfo(response.Message ?? 'Return marked as posted')
        },
        onSuccess: async () => {
            setShowPosted(false)
            await load()
        },
    })

    const receivedForm = useApiForm({
        schema: returnBySchema,
        defaultValues: { returnBy: '' },
        onSubmit: async (values) => {
            const response = await returnsApi.received(Id, values)
            showInfo(response.Message ?? 'Return marked as received')
        },
        onSuccess: async () => {
            receivedForm.form.reset({ returnBy: '' })
            setShowReceived(false)
            await load()
        },
    })

    const refundForm = useApiForm({
        schema: returnRefundSchema,
        defaultValues: { refundAmount: 0 },
        onSubmit: async (values) => {
            const response = await returnsApi.refund(Id, values)
            showInfo(response.Message ?? 'Return refunded')
        },
        onSuccess: async () => {
            refundForm.form.reset({ refundAmount: 0 })
            setShowRefund(false)
            await load()
        },
    })

    const closeForm = useApiForm({
        schema: confirmActionSchema,
        defaultValues: {},
        onSubmit: async () => {
            const response = await returnsApi.close(Id)
            showInfo(response.Message ?? 'Return closed')
        },
        onSuccess: async () => {
            setShowClose(false)
            await load()
        },
    })

    useEffect(() => {
        if (ret && showEdit) {
            editForm.form.reset({
                returnNumber: ret.ReturnNumber,
                returnBy: toDateInputValue(ret.ReturnBy),
            })
        }
    }, [ret, showEdit, editForm.form])

    if (loading) {
        return <div className="page-loading">Loading…</div>
    }

    if (error || !ret) {
        return <div className="alert alert-danger">{error ?? 'Not found'}</div>
    }

    const trackingNumbers = ret.TrackingNumbers ?? []

    return (
        <>
            <Link to="/returns/opened" className="btn text-primary">
                <FontAwesomeIcon icon={faChevronCircleLeft} />
                <span className="ms-1">Back to List</span>
            </Link>

            <Row className="mt-3">
                <Col>
                    <h1>Return</h1>
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
                            onClick={() => setShowStarted(true)}
                        >
                            <FontAwesomeIcon icon={faCalendar} />
                            <span className="ms-1">Mark as Started</span>
                        </button>
                        <button
                            type="button"
                            className="btn text-secondary"
                            onClick={() => setShowPosted(true)}
                        >
                            <FontAwesomeIcon icon={faPlusCircle} />
                            <span className="ms-1">Mark as Posted</span>
                        </button>
                        <button
                            type="button"
                            className="btn text-secondary"
                            onClick={() => setShowReceived(true)}
                        >
                            <FontAwesomeIcon icon={faCalendar} />
                            <span className="ms-1">Mark as Received</span>
                        </button>
                        <button
                            type="button"
                            className="btn text-secondary"
                            onClick={() => setShowRefund(true)}
                        >
                            <FontAwesomeIcon icon={faPlusCircle} />
                            <span className="ms-1">Refund</span>
                        </button>
                        <button
                            type="button"
                            className="btn text-secondary"
                            onClick={() => setShowClose(true)}
                        >
                            <FontAwesomeIcon icon={faPlusCircle} />
                            <span className="ms-1">Close</span>
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
                            <DetailField label="Return Number">
                                <a
                                    href={ebayReturnUrl(ret.ReturnNumber)}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {ret.ReturnNumber}
                                </a>
                            </DetailField>
                            <DetailField label="RMA">{ret.RMA}</DetailField>
                            <DetailField label="Return By">
                                {formatDisplayDate(ret.ReturnBy)}
                            </DetailField>
                            <DetailField label="Status">
                                {ret.StatusName}
                            </DetailField>
                            <DetailField label="Refund Amount">
                                {ret.RefundAmount}
                            </DetailField>
                            <DetailField label="Order">
                                {ret.Order ? (
                                    <Link
                                        to={`/orders/view/${ret.Order.Id}`}
                                        target="_blank"
                                    >
                                        {ret.Order.OrderNumber}
                                    </Link>
                                ) : (
                                    '—'
                                )}
                            </DetailField>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card>
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
                title="Edit Return"
                onHide={() => setShowEdit(false)}
                onSubmit={editForm.submit}
                formError={editForm.formError}
                submitLabel="Update"
                isSubmitting={editForm.isSubmitting}
            >
                <FormField
                    control={editForm.form.control}
                    name="returnNumber"
                    label="Return Number"
                />
                <FormField
                    control={editForm.form.control}
                    name="returnBy"
                    label="Return By"
                    type="date"
                />
            </FormModal>

            <FormModal
                show={showStarted}
                title="Mark As Started"
                onHide={() => setShowStarted(false)}
                onSubmit={startedForm.submit}
                formError={startedForm.formError}
                submitLabel="Submit"
                isSubmitting={startedForm.isSubmitting}
            >
                <FormField
                    control={startedForm.form.control}
                    name="returnBy"
                    label="Return By"
                    type="date"
                />
            </FormModal>

            <FormModal
                show={showPosted}
                title="Mark As Posted"
                onHide={() => setShowPosted(false)}
                onSubmit={postedForm.submit}
                formError={postedForm.formError}
                submitLabel="Yes"
                isSubmitting={postedForm.isSubmitting}
            >
                <p className="mb-0">
                    Are you sure you want to mark this return as posted?
                </p>
            </FormModal>

            <FormModal
                show={showReceived}
                title="Mark As Received"
                onHide={() => setShowReceived(false)}
                onSubmit={receivedForm.submit}
                formError={receivedForm.formError}
                submitLabel="Submit"
                isSubmitting={receivedForm.isSubmitting}
            >
                <FormField
                    control={receivedForm.form.control}
                    name="returnBy"
                    label="Return By"
                    type="date"
                />
            </FormModal>

            <FormModal
                show={showRefund}
                title="Refund"
                onHide={() => setShowRefund(false)}
                onSubmit={refundForm.submit}
                formError={refundForm.formError}
                submitLabel="Submit"
                isSubmitting={refundForm.isSubmitting}
            >
                <FormField
                    control={refundForm.form.control}
                    name="refundAmount"
                    label="Refund Amount"
                    type="number"
                    step="0.01"
                />
            </FormModal>

            <FormModal
                show={showClose}
                title="Close"
                onHide={() => setShowClose(false)}
                onSubmit={closeForm.submit}
                formError={closeForm.formError}
                submitLabel="Yes"
                isSubmitting={closeForm.isSubmitting}
            >
                <p className="mb-0">
                    Are you sure you want to mark this return as closed?
                </p>
            </FormModal>

            <AddNoteModal
                show={showNote}
                onHide={() => setShowNote(false)}
                onSubmit={async (text) => {
                    const response = await returnsApi.addNote(Id, { text })
                    showInfo(response.Message ?? 'Note added')
                }}
                onSuccess={() => void load()}
            />
        </>
    )
}
