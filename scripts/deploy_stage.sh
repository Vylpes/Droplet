#! /bin/bash

export PATH="$HOME/.yarn/bin:$PATH"
export PATH="$HOME/.nodeuse/bin/:$PATH"

cd ~/apps/droplet/droplet_stage \
&& git checkout develop \
&& git fetch \
&& git pull \
&& docker compose --file docker-compose.stage.yml down \
&& (pm2 stop droplet_stage || true) \
&& (pm2 delete droplet_stage || true) \
&& node ./scripts/generate_secret > secret.txt \
&& cp .stage.env .env \
&& yarn clean \
&& yarn install --frozen-lockfile \
&& yarn build \
&& docker compose --file docker-compose.stage.yml up -d \
&& echo "Sleeping for 10 seconds to let database load..." \
&& sleep 10 \
&& yarn run db:up \
&& NODE_ENV=production pm2 start --name droplet_stage dist/index.js
