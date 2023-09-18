#! /bin/bash

export PATH="$HOME/.yarn/bin:$PATH"
export PATH="$HOME/.nodeuse/bin/:$PATH"

cd ~/apps/droplet/droplet_prod \
&& git checkout main \
&& git fetch \
&& git pull \
&& docker compose down \
&& (pm2 stop droplet_prod || true) \
&& (pm2 delete droplet_prod || true) \
&& node ./scripts/generate_secret > secret.txt \
&& cp .prod.env .env \
&& yarn clean \
&& yarn install --frozen-lockfile \
&& yarn build \
&& docker compose up -d \
&& echo "Sleeping for 10 seconds to let database load..." \
&& sleep 10 \
&& yarn run db:up \
&& NODE_ENV=production pm2 start --name droplet_prod dist/index.js
