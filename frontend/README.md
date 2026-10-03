# Droplet frontend

React + Vite SPA for Droplet (see #336 / #344 / #347).

## What's here

- Vite + React scaffold
- JSON API client with cookie sessions (`credentials: 'include'`)
- App shell: React Router, auth-aware layout/navbar, alerts, route guards (#347)

Domain page UIs land in later stories (#352–#356). Bootstrap/FontAwesome via npm is #349. Express SPA fallback is #358.

## Scripts

From the repo root:

- `yarn dev:frontend` — Vite HMR dev server (proxies `/api` to Express)
- `yarn build:frontend` — production build to `frontend/dist`

Express serves built assets from `frontend/dist` (without SPA fallback yet; that lands in #358).

## Local setup

`yarn install` at the repo root installs this workspace. Then run Express and `yarn dev:frontend`.
