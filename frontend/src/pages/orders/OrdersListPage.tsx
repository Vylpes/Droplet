import { useCallback, useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import type { ListingDto, OrderDto, PostagePolicyDto } from '@droplet/shared'
import { ordersApi } from '../../api/client'
import { useAlerts } from '../../alerts/useAlerts'
import { FormField, FormModal, useApiForm } from '../../components/form'
import { ORDER_STATUS_TABS } from '../../components/orderStatus'
import { StatusTabList } from '../../components/StatusTabList'
import {
    DataTable,
    ViewLink,
    createAppColumnHelper,
} from '../../components/table'
import { formatDisplayDate } from '../../utils/dates'
import { ebayBuyerUrl, ebayOrderUrl } from '../../utils/externalLinks'
import { newOrderSchema } from '../../validation'

const VALID_STATUSES = new Set(ORDER_STATUS_TABS.map((t) => t.slug))

const helper = createAppColumnHelper<OrderDto>()

function buildColumns(includeDispatchBy: boolean) {
    return helper.columns([
        helper.accessor('OrderNumber', {
            header: 'Order Number',
            cell: ({ getValue }) => {
                const number = getValue()
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
        helper.accessor('Buyer', {
            header: 'Buyer',
            cell: ({ getValue }) => {
                const buyer = getValue()
                return (
                    <a
                        href={ebayBuyerUrl(buyer)}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {buyer}
                    </a>
                )
            },
        }),
        helper.accessor('Price', { header: 'Price' }),
        helper.accessor('OfferAccepted', {
            header: 'Offer Accepted',
            cell: ({ getValue }) => String(getValue()),
        }),
        ...(includeDispatchBy
            ? [
                  helper.accessor('DispatchBy', {
                      header: 'Dispatch By',
                      cell: ({ getValue }) =>
                          formatDisplayDate(getValue()),
                  }),
              ]
            : []),
        helper.display({
            id: 'actions',
            enableSorting: false,
            enableGlobalFilter: false,
            cell: ({ row }) => (
                <ViewLink to={`/orders/view/${row.original.Id}`} />
            ),
        }),
    ])
}

export function OrdersListPage() {
    const { status = 'awaiting-payment' } = useParams()
    const navigate = useNavigate()
    const { showInfo } = useAlerts()
    const [orders, setOrders] = useState<OrderDto[]>([])
    const [listings, setListings] = useState<ListingDto[]>([])
    const [postagePolicies, setPostagePolicies] = useState<PostagePolicyDto[]>(
        []
    )
    const [loading, setLoading] = useState(true)
    const [showNew, setShowNew] = useState(false)

    const columns = buildColumns(status === 'awaiting-dispatch')

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const response = await ordersApi.list(status)
            setOrders(response.Data?.Orders ?? [])
            setListings(response.Data?.Listings ?? [])
            setPostagePolicies(response.Data?.PostagePolicies ?? [])
        } catch {
            setOrders([])
            setListings([])
            setPostagePolicies([])
        } finally {
            setLoading(false)
        }
    }, [status])

    useEffect(() => {
        void load()
    }, [load])

    const { form, submit, isSubmitting, formError } = useApiForm({
        schema: newOrderSchema,
        defaultValues: {
            orderNumber: '',
            buyer: '',
            offerAccepted: 'false',
            listingId: '',
            postagePolicyId: 'INHERIT',
            amount: 1,
        },
        onSubmit: async (values) => {
            const response = await ordersApi.create({
                orderNumber: values.orderNumber,
                buyer: values.buyer,
                offerAccepted: values.offerAccepted === 'true',
                listingId: values.listingId,
                postagePolicyId: values.postagePolicyId,
                amount: values.amount,
            })
            showInfo(response.Message ?? 'Order created')
            if (response.Data?.Id) {
                navigate(`/orders/view/${response.Data.Id}`)
            }
        },
        onSuccess: async () => {
            form.reset({
                orderNumber: '',
                buyer: '',
                offerAccepted: 'false',
                listingId: '',
                postagePolicyId: 'INHERIT',
                amount: 1,
            })
            setShowNew(false)
            await load()
        },
    })

    if (!VALID_STATUSES.has(status)) {
        return <Navigate to="/orders/awaiting-payment" replace />
    }

    return (
        <>
            <StatusTabList
                title="Orders"
                basePath="/orders"
                activeStatus={status}
                tabs={ORDER_STATUS_TABS}
                onNew={() => setShowNew(true)}
            >
                {loading ? (
                    <div className="page-loading">Loading…</div>
                ) : (
                    <DataTable
                        data={orders}
                        columns={columns}
                        getRowId={(row) => row.Id}
                    />
                )}
            </StatusTabList>

            <FormModal
                show={showNew}
                title="New Order"
                onHide={() => setShowNew(false)}
                onSubmit={submit}
                formError={formError}
                submitLabel="Create"
                isSubmitting={isSubmitting}
            >
                <FormField
                    control={form.control}
                    name="orderNumber"
                    label="Order Number"
                />
                <FormField control={form.control} name="buyer" label="Buyer" />
                <FormField
                    control={form.control}
                    name="offerAccepted"
                    label="Offer Accepted"
                    as="select"
                >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                </FormField>
                <FormField
                    control={form.control}
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
                    control={form.control}
                    name="postagePolicyId"
                    label="Postage Policy"
                    as="select"
                >
                    <option value="INHERIT">(INHERIT)</option>
                    {postagePolicies.map((policy) => (
                        <option key={policy.Id} value={policy.Id}>
                            {policy.Name}
                        </option>
                    ))}
                </FormField>
                <FormField
                    control={form.control}
                    name="amount"
                    label="Amount"
                    type="number"
                    step="1"
                />
            </FormModal>
        </>
    )
}
