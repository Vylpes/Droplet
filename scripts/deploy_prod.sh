#! /bin/bash

export PATH="$HOME/.yarn/bin:$PATH"
export PATH="$HOME/.nvm/versions/node/v16.17.0/bin/:$PATH"

cd ~/apps/droplet/droplet_prod \
&& git checkout main \
&& git fetch \
&& git pull \
&& docker-compose --file docker-compose.prod.yml down \
&& (pm2 stop droplet_prod || true) \
&& (pm2 delete droplet_prod || true) \
&& node ./scripts/generate_secret > secret.txt \
&& cp .prod.env .env \
&& cp ormconfig.prod.json ormconfig.json \
&& yarn install --frozen-lockfile \
&& yarn build \
&& docker-compose --file docker-compose.prod.yml up -d \
&& echo "Sleeping for 10 seconds to let database load..." \
&& sleep 10 \
&& yarn run db:up \
&& NODE_ENV=production pm2 start --name droplet_prod dist/index.js