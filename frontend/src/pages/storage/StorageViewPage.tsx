import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import type { ItemDto, StorageDto } from '@droplet/shared'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChevronCircleLeft,
    faPlusSquare,
} from '@fortawesome/free-solid-svg-icons'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { storageApi } from '../../api/client'
import { useAlerts } from '../../alerts/useAlerts'
import { FormField, FormModal, useApiForm } from '../../components/form'
import {
    DataTable,
    ViewLink,
    createAppColumnHelper,
} from '../../components/table'
import { assignStorageItemSchema } from '../../validation'

const itemHelper = createAppColumnHelper<ItemDto>()
const itemColumns = itemHelper.columns([
    itemHelper.accessor('Sku', { header: 'SKU' }),
    itemHelper.accessor('Name', { header: 'Name' }),
    itemHelper.display({
        id: 'actions',
        enableSorting: false,
        enableGlobalFilter: false,
        cell: ({ row }) => <ViewLink to={`/items/${row.original.Id}`} />,
    }),
])

export function StorageViewPage() {
    const { Id = '' } = useParams()
    const { showInfo } = useAlerts()
    const [storage, setStorage] = useState<StorageDto | null>(null)
    const [unassignedItems, setUnassignedItems] = useState<ItemDto[]>([])
    const [bins, setBins] = useState<StorageDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showAddItem, setShowAddItem] = useState(false)

    const load = useCallback(async () => {
        if (!Id) return
        setLoading(true)
        setError(null)
        try {
            const response = await storageApi.get(Id)
            setStorage(response.Data?.Storage ?? null)
            setUnassignedItems(response.Data?.Items ?? [])
            setBins(response.Data?.Storages ?? [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load')
            setStorage(null)
            setUnassignedItems([])
            setBins([])
        } finally {
            setLoading(false)
        }
    }, [Id])

    useEffect(() => {
        void load()
    }, [load])

    const items = useMemo(() => storage?.Items ?? [], [storage])

    const { form, submit, isSubmitting, formError } = useApiForm({
        schema: assignStorageItemSchema,
        defaultValues: { itemId: '' },
        onSubmit: async (values) => {
            const response = await storageApi.assignItem(Id, {
                itemId: values.itemId,
            })
            showInfo(response.Message ?? 'Item assigned')
        },
        onSuccess: async () => {
            form.reset({ itemId: '' })
            setShowAddItem(false)
            await load()
        },
    })

    if (loading) {
        return <div className="page-loading">Loading…</div>
    }

    if (error || !storage) {
        return <div className="alert alert-danger">{error ?? 'Not found'}</div>
    }

    const backId = storage.ParentId ?? storage.Parent?.Id

    return (
        <>
            {backId ? (
                <Link
                    to={`/storage/list/bin/${backId}`}
                    className="btn text-primary"
                >
                    <FontAwesomeIcon icon={faChevronCircleLeft} />
                    <span className="ms-1">Back to List</span>
                </Link>
            ) : null}

            <Row className="mt-3">
                <Col>
                    <h1>{storage.Name}</h1>
                </Col>
                <Col>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button
                            type="button"
                            className="btn text-secondary"
                            onClick={() => setShowAddItem(true)}
                        >
                            <FontAwesomeIcon icon={faPlusSquare} />
                            <span className="ms-1">Add Item</span>
                        </button>
                    </div>
                </Col>
            </Row>

            <Row className="mt-3">
                <Col>
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

            <FormModal
                show={showAddItem}
                title="Add Item"
                onHide={() => setShowAddItem(false)}
                onSubmit={submit}
                formError={formError}
                submitLabel="Add"
                isSubmitting={isSubmitting}
            >
                <FormField
                    control={form.control}
                    name="itemId"
                    label="Item"
                    as="select"
                >
                    <option value="">Select item…</option>
                    <optgroup label="No Storage Set">
                        {unassignedItems.map((item) => (
                            <option key={item.Id} value={item.Id}>
                                {item.Sku} {item.Name}
                            </option>
                        ))}
                    </optgroup>
                    {bins.map((bin) => (
                        <optgroup key={bin.Id} label={bin.Name}>
                            {(bin.Items ?? []).map((item) => (
                                <option key={item.Id} value={item.Id}>
                                    {item.Sku} {item.Name}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </FormField>
            </FormModal>
        </>
    )
}
