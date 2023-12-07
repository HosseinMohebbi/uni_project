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


## Introduction

This project is developed using NestJS, Prisma, and PostgreSQL. It also utilizes Swagger for API documentation and Docker Compose for running PgAdmin.


## PgAdmin
To access PgAdmin, use http://localhost:5555/. Login credentials for PgAdmin are available in the docker-compose.yml file.

## API Documentation

To view and test the API, use Swagger UI at http://localhost:3000/api.

## Known Issues
There are currently no known issues.

---

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

