#!/bin/sh
./wait-for.sh

function echo_green {
  echo -e "\e[32m$1\e[0m"
}

echo_green "step 1 - migration deploy:"
npx prisma migrate deploy
sleep 5
echo_green "step 2 - generate:"
npx prisma generate
sleep 5
echo_green "step 3 - run seed:"
npx prisma db seed
exec "$@"