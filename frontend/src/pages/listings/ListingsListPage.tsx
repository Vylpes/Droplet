import { useCallback, useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import type { ItemDto, ListingDto } from '@droplet/shared'
import { listingsApi } from '../../api/client'
import { useAlerts } from '../../alerts/useAlerts'
import { FormField, FormModal, useApiForm } from '../../components/form'
import { LISTING_STATUS_TABS } from '../../components/listingStatus'
import { StatusTabList } from '../../components/StatusTabList'
import {
    DataTable,
    ViewLink,
    createAppColumnHelper,
} from '../../components/table'
import { formatDisplayDate } from '../../utils/dates'
import { ebayListingUrl } from '../../utils/externalLinks'
import { newListingSchema } from '../../validation'

const VALID_STATUSES = new Set(LISTING_STATUS_TABS.map((t) => t.slug))

const helper = createAppColumnHelper<ListingDto>()
const columns = helper.columns([
    helper.accessor('ListingNumber', {
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
    helper.accessor('Name', { header: 'Name' }),
    helper.accessor('Price', { header: 'Price' }),
    helper.accessor('EndDate', {
        header: 'End Date',
        cell: ({ getValue }) => formatDisplayDate(getValue()),
    }),
    helper.display({
        id: 'actions',
        enableSorting: false,
        enableGlobalFilter: false,
        cell: ({ row }) => (
            <ViewLink to={`/listings/view/${row.original.Id}`} />
        ),
    }),
])

export function ListingsListPage() {
    const { status = 'active' } = useParams()
    const navigate = useNavigate()
    const { showInfo } = useAlerts()
    const [listings, setListings] = useState<ListingDto[]>([])
    const [items, setItems] = useState<ItemDto[]>([])
    const [loading, setLoading] = useState(true)
    const [showNew, setShowNew] = useState(false)

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const response = await listingsApi.list(status)
            setListings(response.Data?.Listings ?? [])
            setItems(response.Data?.Items ?? [])
        } catch {
            setListings([])
            setItems([])
        } finally {
            setLoading(false)
        }
    }, [status])

    useEffect(() => {
        void load()
    }, [load])

    const { form, submit, isSubmitting, formError } = useApiForm({
        schema: newListingSchema,
        defaultValues: {
            listingNumber: '',
            name: '',
            itemId: '',
            price: 0,
            endDate: '',
            quantity: 1,
        },
        onSubmit: async (values) => {
            const response = await listingsApi.create({
                listingNumber: values.listingNumber,
                name: values.name,
                itemId: values.itemId,
                price: values.price,
                endDate: values.endDate,
                quantity: values.quantity,
            })
            showInfo(response.Message ?? 'Listing created')
            if (response.Data?.Id) {
                navigate(`/listings/view/${response.Data.Id}`)
            }
        },
        onSuccess: async () => {
            form.reset({
                listingNumber: '',
                name: '',
                itemId: '',
                price: 0,
                endDate: '',
                quantity: 1,
            })
            setShowNew(false)
            await load()
        },
    })

    if (!VALID_STATUSES.has(status)) {
        return <Navigate to="/listings/active" replace />
    }

    return (
        <>
            <StatusTabList
                title="Listings"
                basePath="/listings"
                activeStatus={status}
                tabs={LISTING_STATUS_TABS}
                onNew={() => setShowNew(true)}
            >
                {loading ? (
                    <div className="page-loading">Loading…</div>
                ) : (
                    <DataTable
                        data={listings}
                        columns={columns}
                        getRowId={(row) => row.Id}
                    />
                )}
            </StatusTabList>

            <FormModal
                show={showNew}
                title="New Listing"
                onHide={() => setShowNew(false)}
                onSubmit={submit}
                formError={formError}
                submitLabel="Create"
                isSubmitting={isSubmitting}
            >
                <FormField
                    control={form.control}
                    name="listingNumber"
                    label="Listing Number"
                />
                <FormField control={form.control} name="name" label="Name" />
                <FormField
                    control={form.control}
                    name="itemId"
                    label="Item"
                    as="select"
                >
                    <option value="">Select item…</option>
                    {items.map((item) => (
                        <option key={item.Id} value={item.Id}>
                            {item.Sku} {item.Name} ({item.UnlistedQuantity}{' '}
                            Unlisted)
                        </option>
                    ))}
                </FormField>
                <FormField
                    control={form.control}
                    name="price"
                    label="Price"
                    type="number"
                    step="0.01"
                />
                <FormField
                    control={form.control}
                    name="endDate"
                    label="End Date"
                    type="date"
                />
                <FormField
                    control={form.control}
                    name="quantity"
                    label="Quantity"
                    type="number"
                    step="1"
                    min={0}
                />
            </FormModal>
        </>
    )
}
