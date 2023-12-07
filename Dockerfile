# Build Stage
FROM node:18.18.2-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install

RUN npm install prisma @prisma/client

ADD . /app

RUN npx prisma generate

RUN npm run build

# Production Stage
FROM node:18.18.2-alpine as development

WORKDIR /app

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY --from=build /app /app

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
