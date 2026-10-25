# Droplet frontend

React + Vite SPA for Droplet (see #336 / #344 / #347 / #349 / #350).

## What's here

- Vite + React scaffold
- JSON API client with cookie sessions (`credentials: 'include'`)
- App shell: React Router, auth-aware layout/navbar, alerts, route guards (#347)
- Styling: Bootstrap 5 + React Bootstrap + Font Awesome via npm (#349)
- Tables: TanStack Table (`@tanstack/react-table`) via shared `DataTable` (#350)

Domain page UIs: auth/account (#352), dashboard (#353), inventory (#354), sales (#355), ops/admin (#356). Express serves `frontend/dist` with SPA fallback (#358).

## Inventory (#354)

List + detail pages for item/supply purchases and item/supply detail:

- `pages/item-purchases/**`, `pages/items/**`, `pages/supply-purchases/**`, `pages/supplies/**`
- Status tabs share `components/StatusTabList.tsx` (one list page per domain instead of five Pug clones)
- Modals use `FormModal` + `useApiForm`; nested tables use `DataTable`

## Sales (#355)

List + detail pages for listings, orders, and returns:

- `pages/listings/**`, `pages/orders/**`, `pages/returns/**`
- API wrappers in `api/client.ts` (`listingsApi`, `ordersApi`, `returnsApi`)
- Status-tab lists, eBay/carrier external links, and workflow modals (paid/dispatch/refund/etc.) mirrored from Pug

## Styling

- `bootstrap` CSS imported in `src/main.tsx`
- UI primitives from `react-bootstrap` (Navbar, Alert, Card, Button, Container, …)
- Icons from `@fortawesome/react-fontawesome` + `@fortawesome/free-solid-svg-icons`
- App overrides / ported legacy stylesheet rules live in `src/index.css` and `src/App.css`

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

This replaces the former jQuery DataTables enhancers. React does not load jQuery or DataTables.

## Scripts

From the repo root:

- `yarn dev:frontend` — Vite HMR dev server (proxies `/api` to Express)
- `yarn build:frontend` — production build to `frontend/dist`
- `yarn test:frontend` — Vitest + React Testing Library (`vitest run`)

From `frontend/`:

- `yarn test` — single CI run
- `yarn test:watch` — watch mode

Express serves built assets from `frontend/dist` and falls back to `index.html` for client routes (#358). Deploy scripts run `yarn build`, which includes `yarn build:frontend`.

## Tests (#357)

Unit/component tests use **Vitest** + **React Testing Library** (jsdom). Co-locate specs next to source as `*.test.ts(x)`. Shared helpers live in `src/test/` (`setup.ts`, `render.tsx` with auth/alert/router providers).

Coverage focus:

- Shared UI: `DataTable`, forms (`useApiForm` / `FormField` / `FormModal`), alerts, route guards
- API client (`apiFetch` + representative wrappers)
- Domain smoke: login, item-purchase list/view
- Pure helpers: fees calculator, dates, external links, status tab slugs

`yarn test` at the repo root runs backend Jest then frontend Vitest. Forgejo workflows call `yarn test:backend` and `yarn test:frontend` explicitly after `yarn build`.

## Local setup

`yarn install` at the repo root installs this workspace. Then run Express and `yarn dev:frontend`.
