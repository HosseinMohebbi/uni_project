<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Uni Project Backend Nestjs

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Prisma**: A modern database toolkit for TypeScript and Node.js that enables type-safe database access.
- **PostgreSQL**: An open-source relational database management system.
- **Swagger**: An API documentation tool that helps in describing, producing, consuming, and visualizing RESTful web services.
- **Docker Compose**: A tool for defining and running multi-container Docker applications.
- **PgAdmin**: A feature-rich open-source PostgreSQL administration and management tool.
- **Minio**: Minio is an open-source object storage server that allows users to build their private cloud storage infrastructure. It is designed for high-performance, scalability, and ease of deployment, providing a compatible alternative to cloud-based object storage services with the flexibility to run on commodity hardware.


## Introduction

This project is developed using NestJS, Prisma, and PostgreSQL. It also utilizes Swagger for API documentation and Docker Compose for running PgAdmin.

***

## PgAdmin
<img src="https://tu-graz-library.github.io/docs-repository/services/images/pgadmin-login.png?raw=true" alt="pgAdmin image example">

To access PgAdmin, use http://localhost:5555/. Login credentials for PgAdmin are available in the docker-compose.yml file.
***
## API Documentation

<img src="https://addons.mozilla.org/user-media/previews/full/192/192679.png?modified=1622132852" alt="swagger image example">

To view and test the API, use Swagger UI at http://localhost:3000/api.
***
## Minio Console In Browser

<img src="https://min.io/resources/img/home/features/interfaces.png" alt="minio image example">

For view console, use minio console browser at http://localhost:9000.
***
## Known Issues
There are currently no known issues.
***
## commands
#### Build and Start Docker Containers

```bash
docker-compose up --build
```

#### Start Docker

```bash
docker-compose up 
```

#### Stop Docker
keyboard shortcut stop => ctrl + c

```bash
docker-compose down 
```

