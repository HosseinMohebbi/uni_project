#!/bin/sh
./wait-for.sh
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
exec "$@"