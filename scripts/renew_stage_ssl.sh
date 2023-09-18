#! /bin/bash

export PATH="/home/vypes/.yarn/bin:$PATH"
export PATH="/home/vylpes/.nodeuse/bin/:$PATH"

cp /etc/letsencrypt/live/droplet-stage.vylpes.xyz/privkey.pem /home/vylpes/apps/droplet/droplet_stage/ssl/server.key
cp /etc/letsencrypt/live/droplet-stage.vylpes.xyz/fullchain.pem /home/vylpes/apps/droplet/droplet_stage/ssl/server.crt

chown vylpes:vylpes /home/vylpes/apps/droplet/droplet_stage/ssl/server.key
chown vylpes:vylpes /home/vylpes/apps/droplet/droplet_stage/ssl/server.crt

pm2 restart droplet_stage