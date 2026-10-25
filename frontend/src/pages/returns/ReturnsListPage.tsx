import { useCallback, useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import type { OrderDto, ReturnDto } from '@droplet/shared'
import { returnsApi } from '../../api/client'
import { useAlerts } from '../../alerts/useAlerts'
import { FormField, FormModal, useApiForm } from '../../components/form'
import { RETURN_STATUS_TABS } from '../../components/returnStatus'
import { StatusTabList } from '../../components/StatusTabList'
import {
    DataTable,
    ViewLink,
    createAppColumnHelper,
} from '../../components/table'
import { formatDisplayDate } from '../../utils/dates'
import { ebayOrderUrl, ebayReturnUrl } from '../../utils/externalLinks'
import { newReturnSchema } from '../../validation'

const VALID_STATUSES = new Set(RETURN_STATUS_TABS.map((t) => t.slug))

const helper = createAppColumnHelper<ReturnDto>()

function buildColumns(status: string) {
    const showReturnBy = [
        'started',
        'received',
        'expired',
        'refunded',
        'closed',
    ].includes(status)
    const showRefundAmount = status === 'refunded'
    const returnByHeader =
        status === 'refunded' || status === 'closed' ? 'Refunded' : 'Return By'

    return helper.columns([
        helper.accessor('ReturnNumber', {
            header: 'Return Number',
            cell: ({ getValue }) => {
                const number = getValue()
                return (
                    <a
                        href={ebayReturnUrl(number)}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {number}
                    </a>
                )
            },
        }),
        helper.accessor('RMA', { header: 'RMA' }),
        helper.accessor((row) => row.Order?.OrderNumber ?? '', {
            id: 'orderNumber',
            header: 'Order Number',
            cell: ({ getValue }) => {
                const number = getValue()
                if (!number) return ''
                return (
                    <a
                        href={ebayOrderUrl(number)}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {number}
                    </a>
                )
            },
        }),
        ...(showReturnBy
            ? [
                  helper.accessor('ReturnBy', {
                      header: returnByHeader,
                      cell: ({ getValue }) =>
                          formatDisplayDate(getValue()),
                  }),
              ]
            : []),
        ...(showRefundAmount
            ? [helper.accessor('RefundAmount', { header: 'Refund Amount' })]
            : []),
        helper.display({
            id: 'actions',
            enableSorting: false,
            enableGlobalFilter: false,
            cell: ({ row }) => (
                <ViewLink to={`/returns/view/${row.original.Id}`} />
            ),
        }),
    ])
}

export function ReturnsListPage() {
    const { status = 'opened' } = useParams()
    const navigate = useNavigate()
    const { showInfo } = useAlerts()
    const [returns, setReturns] = useState<ReturnDto[]>([])
    const [orders, setOrders] = useState<OrderDto[]>([])
    const [loading, setLoading] = useState(true)
    const [showNew, setShowNew] = useState(false)

    const columns = buildColumns(status)

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const response = await returnsApi.list(status)
            setReturns(response.Data?.Returns ?? [])
            setOrders(response.Data?.Orders ?? [])
        } catch {
            setReturns([])
            setOrders([])
        } finally {
            setLoading(false)
        }
    }, [status])

    useEffect(() => {
        void load()
    }, [load])

    const { form, submit, isSubmitting, formError } = useApiForm({
        schema: newReturnSchema,
        defaultValues: {
            returnNumber: '',
            orderId: '',
            trackingService: 0,
            trackingNumber: '',
        },
        onSubmit: async (values) => {
            const response = await returnsApi.create({
                returnNumber: values.returnNumber,
                orderId: values.orderId,
                trackingService: values.trackingService,
                trackingNumber: values.trackingNumber,
            })
            showInfo(response.Message ?? 'Return created')
            if (response.Data?.Id) {
                navigate(`/returns/view/${response.Data.Id}`)
            }
        },
        onSuccess: async () => {
            form.reset({
                returnNumber: '',
                orderId: '',
                trackingService: 0,
                trackingNumber: '',
            })
            setShowNew(false)
            await load()
        },
    })

    if (!VALID_STATUSES.has(status)) {
        return <Navigate to="/returns/opened" replace />
    }

    return (
        <>
            <StatusTabList
                title="Returns"
                basePath="/returns"
                activeStatus={status}
                tabs={RETURN_STATUS_TABS}
                onNew={() => setShowNew(true)}
            >
                {loading ? (
                    <div className="page-loading">Loading…</div>
                ) : (
                    <DataTable
                        data={returns}
                        columns={columns}
                        getRowId={(row) => row.Id}
                    />
                )}
            </StatusTabList>

            <FormModal
                show={showNew}
                title="New Return"
                onHide={() => setShowNew(false)}
                onSubmit={submit}
                formError={formError}
                submitLabel="Create"
                isSubmitting={isSubmitting}
            >
                <FormField
                    control={form.control}
                    name="returnNumber"
                    label="Return Number"
                />
                <FormField
                    control={form.control}
                    name="orderId"
                    label="Order"
                    as="select"
                >
                    <option value="">Select order…</option>
                    {orders.map((order) => (
                        <option key={order.Id} value={order.Id}>
                            {order.OrderNumber} {order.Buyer}
                        </option>
                    ))}
                </FormField>
                <FormField
                    control={form.control}
                    name="trackingService"
                    label="Postal Service"
                    as="select"
                >
                    <option value={0}>Royal Mail</option>
                    <option value={1}>Hermes</option>
                </FormField>
                <FormField
                    control={form.control}
                    name="trackingNumber"
                    label="Tracking Number"
                />
            </FormModal>
        </>
    )
}
