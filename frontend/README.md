# Droplet frontend

React + Vite SPA for Droplet (see #336 / #344 / #347 / #349).

## What's here

- Vite + React scaffold
- JSON API client with cookie sessions (`credentials: 'include'`)
- App shell: React Router, auth-aware layout/navbar, alerts, route guards (#347)
- Styling: Bootstrap 5 + React Bootstrap + Font Awesome via npm (#349)

Domain page UIs land in later stories (#352–#356). Express SPA fallback is #358.

## Styling

- `bootstrap` CSS imported in `src/main.tsx`
- UI primitives from `react-bootstrap` (Navbar, Alert, Card, Button, Container, …)
- Icons from `@fortawesome/react-fontawesome` + `@fortawesome/free-solid-svg-icons`
- App overrides / ported `public/css/style.css` rules live in `src/index.css` and `src/App.css`

Vendored copies under `public/lib/` remain for Pug SSR until #358.

## Scripts

From the repo root:

- `yarn dev:frontend` — Vite HMR dev server (proxies `/api` to Express)
- `yarn build:frontend` — production build to `frontend/dist`

Express serves built assets from `frontend/dist` (without SPA fallback yet; that lands in #358).

## Local setup

`yarn install` at the repo root installs this workspace. Then run Express and `yarn dev:frontend`.
