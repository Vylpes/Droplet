# Droplet frontend

React + Vite SPA for Droplet (see #336 / #344 / #347 / #349 / #350).

## What's here

- Vite + React scaffold
- JSON API client with cookie sessions (`credentials: 'include'`)
- App shell: React Router, auth-aware layout/navbar, alerts, route guards (#347)
- Styling: Bootstrap 5 + React Bootstrap + Font Awesome via npm (#349)
- Tables: TanStack Table (`@tanstack/react-table`) via shared `DataTable` (#350)

Domain page UIs: auth/account (#352), dashboard (#353), inventory (#354). Sales/ops (#355–#356) and Express SPA fallback (#358) still open.

## Inventory (#354)

List + detail pages for item/supply purchases and item/supply detail:

- `pages/item-purchases/**`, `pages/items/**`, `pages/supply-purchases/**`, `pages/supplies/**`
- Status tabs share `components/StatusTabList.tsx` (one list page per domain instead of five Pug clones)
- Modals use `FormModal` + `useApiForm`; nested tables use `DataTable`

## Styling

- `bootstrap` CSS imported in `src/main.tsx`
- UI primitives from `react-bootstrap` (Navbar, Alert, Card, Button, Container, …)
- Icons from `@fortawesome/react-fontawesome` + `@fortawesome/free-solid-svg-icons`
- App overrides / ported `public/css/style.css` rules live in `src/index.css` and `src/App.css`

Vendored copies under `public/lib/` remain for Pug SSR until #358.

## Tables (#350)

List/view tables use TanStack Table instead of jQuery DataTables:

- Shared hook + features: `src/components/table/tableHook.ts` (sort, global search, pagination)
- UI wrapper: `src/components/table/DataTable.tsx` (Bootstrap table + length menu + search + pager)
- Column helper: `createAppColumnHelper()` from `src/components/table`
- Common “View” action cell: `ViewLink`

Example:

```tsx
import { DataTable, ViewLink, createAppColumnHelper } from '../components/table'

type Order = { Id: string; OrderNumber: string; Buyer: string }

const helper = createAppColumnHelper<Order>()
const columns = helper.columns([
    helper.accessor('OrderNumber', { header: 'Order Number' }),
    helper.accessor('Buyer', { header: 'Buyer' }),
    helper.display({
        id: 'actions',
        enableSorting: false,
        enableGlobalFilter: false,
        cell: ({ row }) => <ViewLink to={`/orders/view/${row.original.Id}`} />,
    }),
])

export function OrdersTable({ orders }: { orders: Order[] }) {
    return <DataTable data={orders} columns={columns} />
}
```

This replaces the former `public/js/**` `$('#…').DataTable()` enhancers. React does not load jQuery or DataTables; those stay vendored for Pug until #358.

## Scripts

From the repo root:

- `yarn dev:frontend` — Vite HMR dev server (proxies `/api` to Express)
- `yarn build:frontend` — production build to `frontend/dist`

Express serves built assets from `frontend/dist` (without SPA fallback yet; that lands in #358).

## Local setup

`yarn install` at the repo root installs this workspace. Then run Express and `yarn dev:frontend`.
