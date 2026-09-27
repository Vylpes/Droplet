# Droplet frontend

React + Vite SPA scaffold for Droplet (see #336 / #344).

## Scripts

From the repo root:

- `yarn dev:frontend` — Vite HMR dev server
- `yarn build:frontend` — production build to `frontend/dist`

Express serves built assets from `frontend/dist` (without SPA fallback yet; that lands in #358).

## Local setup

`yarn install` at the repo root installs this workspace. Then run `yarn dev:frontend`.
