import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import type { StorageDto } from '@droplet/shared'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faChevronCircleLeft,
    faPlusSquare,
} from '@fortawesome/free-solid-svg-icons'
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
import { newStorageSchema } from '../../validation'

const VALID_TYPES = new Set(['building', 'unit', 'bin'])

type StorageListType = 'building' | 'unit' | 'bin'

function childCountHeader(type: StorageListType) {
    if (type === 'building') return 'Units'
    if (type === 'unit') return 'Bins'
    return 'Items'
}

function childCount(row: StorageDto, type: StorageListType) {
    if (type === 'bin') return row.Items?.length ?? 0
    return row.Children?.length ?? 0
}

function viewPath(row: StorageDto, type: StorageListType) {
    if (type === 'building') return `/storage/list/unit/${row.Id}`
    if (type === 'unit') return `/storage/list/bin/${row.Id}`
    return `/storage/view/${row.Id}`
}

function backPath(type: StorageListType, parent?: StorageDto | null) {
    if (type === 'unit') return '/storage/list/building/all'
    if (type === 'bin' && parent?.ParentId) {
        return `/storage/list/unit/${parent.ParentId}`
    }
    return null
}

function createRedirectPath(
    type: StorageListType,
    created: StorageDto
): string {
    if (type === 'building') return `/storage/list/unit/${created.Id}`
    if (type === 'unit') return `/storage/list/bin/${created.Id}`
    return `/storage/view/${created.Id}`
}

function modalTitle(type: StorageListType) {
    if (type === 'building') return 'New Building'
    if (type === 'unit') return 'New Unit'
    return 'New Bin'
}

function pageTitle(type: StorageListType, parent?: StorageDto | null) {
    if (type === 'building') return 'Buildings'
    return parent?.Name ?? 'Storage'
}

export function StorageListPage() {
    const { type = 'building', id = 'all' } = useParams()
    const navigate = useNavigate()
    const { showInfo } = useAlerts()
    const [storages, setStorages] = useState<StorageDto[]>([])
    const [parent, setParent] = useState<StorageDto | null>(null)
    const [loading, setLoading] = useState(true)
    const [showNew, setShowNew] = useState(false)

    const listType = type as StorageListType

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const response = await storageApi.list(listType, id)
            setStorages(response.Data?.Storages ?? [])
            setParent(response.Data?.Storage ?? null)
        } catch {
            setStorages([])
            setParent(null)
        } finally {
            setLoading(false)
        }
    }, [listType, id])

    useEffect(() => {
        void load()
    }, [load])

    const columns = useMemo(() => {
        const helper = createAppColumnHelper<StorageDto>()
        return helper.columns([
            helper.accessor('SkuPrefix', { header: 'SKU Prefix' }),
            helper.accessor('Name', { header: 'Name' }),
            helper.accessor((row) => childCount(row, listType), {
                id: 'children',
                header: childCountHeader(listType),
            }),
            helper.display({
                id: 'actions',
                enableSorting: false,
                enableGlobalFilter: false,
                cell: ({ row }) => (
                    <ViewLink to={viewPath(row.original, listType)} />
                ),
            }),
        ])
    }, [listType])

    const { form, submit, isSubmitting, formError } = useApiForm({
        schema: newStorageSchema,
        defaultValues: { name: '', skuPrefix: '' },
        onSubmit: async (values) => {
            const response = await storageApi.create({
                type: listType,
                name: values.name,
                skuPrefix: values.skuPrefix,
                parentId: listType === 'building' ? undefined : id,
            })
            showInfo(response.Message ?? 'Storage created')
            if (response.Data) {
                navigate(createRedirectPath(listType, response.Data))
            }
        },
        onSuccess: async () => {
            form.reset({ name: '', skuPrefix: '' })
            setShowNew(false)
            await load()
        },
    })

    if (!VALID_TYPES.has(type)) {
        return <Navigate to="/storage/list/building/all" replace />
    }

    if (listType !== 'building' && !id) {
        return <Navigate to="/storage/list/building/all" replace />
    }

    const back = backPath(listType, parent)

    return (
        <>
            {back ? (
                <Link to={back} className="btn text-primary">
                    <FontAwesomeIcon icon={faChevronCircleLeft} />
                    <span className="ms-1">Back to List</span>
                </Link>
            ) : null}

            <Row className={back ? 'mt-3' : undefined}>
                <Col>
                    <h1>{pageTitle(listType, parent)}</h1>
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
                    data={storages}
                    columns={columns}
                    getRowId={(row) => row.Id}
                />
            )}

            <FormModal
                show={showNew}
                title={modalTitle(listType)}
                onHide={() => setShowNew(false)}
                onSubmit={submit}
                formError={formError}
                submitLabel="Create"
                isSubmitting={isSubmitting}
            >
                <FormField control={form.control} name="name" label="Name" />
                <FormField
                    control={form.control}
                    name="skuPrefix"
                    label="SKU Prefix"
                />
            </FormModal>
        </>
    )
}
