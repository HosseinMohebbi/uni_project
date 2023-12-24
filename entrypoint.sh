#!/bin/sh
./wait-for.sh
node /usr/local/bin/npx prisma migrate dev
node /usr/local/bin/npx prisma migrate deploy
node /usr/local/bin/npx prisma db seed
exec "$@"