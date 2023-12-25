# Build Stage
FROM node:18.18.2-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY prisma ./prisma/
COPY .env ./
COPY tsconfig.json ./

RUN npm install

RUN npm install prisma @prisma/client

COPY . .

RUN npm run build

# Production Stage
FROM node:18.18.2-alpine as development

WORKDIR /app

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY --from=build /app /app

COPY ./entrypoint.sh .
COPY ./wait-for.sh .

EXPOSE 3000

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT [ "./entrypoint.sh" ]

CMD [ "npm", "run", "start:prod" ]
