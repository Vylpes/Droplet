import { useCallback, useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import type { SupplyPurchaseDto } from '@droplet/shared'
import { supplyPurchasesApi } from '../../api/client'
import { useAlerts } from '../../alerts/useAlerts'
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
import { StatusTabList } from '../../components/StatusTabList'
import { PURCHASE_STATUS_TABS } from '../../components/purchaseStatus'
import { purchaseFormSchema } from '../../validation'

const VALID_STATUSES = new Set(PURCHASE_STATUS_TABS.map((t) => t.slug))

const helper = createAppColumnHelper<SupplyPurchaseDto>()
const columns = helper.columns([
    helper.accessor('Description', { header: 'Description' }),
    helper.accessor('Price', { header: 'Price' }),
    helper.accessor((row) => row.Supplies?.length ?? 0, {
        id: 'supplies',
        header: 'Items',
    }),
    helper.display({
        id: 'actions',
        enableSorting: false,
        enableGlobalFilter: false,
        cell: ({ row }) => (
            <ViewLink to={`/supply-purchases/view/${row.original.Id}`} />
        ),
    }),
])

export function SupplyPurchasesListPage() {
    const { status = 'ordered' } = useParams()
    const navigate = useNavigate()
    const { showInfo } = useAlerts()
    const [purchases, setPurchases] = useState<SupplyPurchaseDto[]>([])
    const [loading, setLoading] = useState(true)
    const [showNew, setShowNew] = useState(false)

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const response = await supplyPurchasesApi.list(status)
            setPurchases(response.Data ?? [])
        } catch {
            setPurchases([])
        } finally {
            setLoading(false)
        }
    }, [status])

    useEffect(() => {
        void load()
    }, [load])

    const { form, submit, isSubmitting, formError } = useApiForm({
        schema: purchaseFormSchema,
        defaultValues: { description: '', price: 0 },
        onSubmit: async (values) => {
            const response = await supplyPurchasesApi.create({
                description: values.description,
                price: values.price,
            })
            showInfo(response.Message ?? 'Purchase created')
            if (response.Data?.Id) {
                navigate(`/supply-purchases/view/${response.Data.Id}`)
            }
        },
        onSuccess: async () => {
            form.reset({ description: '', price: 0 })
            setShowNew(false)
            await load()
        },
    })

    if (!VALID_STATUSES.has(status)) {
        return <Navigate to="/supply-purchases/ordered" replace />
    }

    return (
        <>
            <StatusTabList
                title="Supply Purchases"
                basePath="/supply-purchases"
                activeStatus={status}
                tabs={PURCHASE_STATUS_TABS}
                onNew={() => setShowNew(true)}
            >
                {loading ? (
                    <div className="page-loading">Loading…</div>
                ) : (
                    <DataTable
                        data={purchases}
                        columns={columns}
                        getRowId={(row) => row.Id}
                    />
                )}
            </StatusTabList>

            <FormModal
                show={showNew}
                title="New Purchase"
                onHide={() => setShowNew(false)}
                onSubmit={submit}
                formError={formError}
                submitLabel="Create"
                isSubmitting={isSubmitting}
            >
                <FormField
                    control={form.control}
                    name="description"
                    label="Description"
                />
                <FormField
                    control={form.control}
                    name="price"
                    label="Price"
                    type="number"
                    step="0.01"
                />
            </FormModal>
        </>
    )
}
