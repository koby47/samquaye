# Portfolio System Architecture

## Architecture Style

The portfolio uses a decoupled frontend/backend architecture.

The React frontend communicates with the Express backend through a versioned
REST API.

## High-Level Architecture

Visitor / Administrator
        |
        v
Cloudflare Edge
        |
        v
React + Vite Frontend
        |
        | HTTPS
        v
REST API /api/v1
        |
        v
Node.js + Express
        |
        +----------------+
        |                |
        v                v
MongoDB Atlas      Cloudflare R2

## Frontend

Technology:

- React
- Vite
- Tailwind CSS
- React Router

Deployment:

Cloudflare Workers with Static Assets.

The frontend must not contain backend secrets.

## Backend

Technology:

- Node.js
- Express.js

Responsibilities:

- API routing
- Authentication
- Authorization
- Validation
- Business logic
- Database access
- Media authorization
- Contact processing
- Audit logging

## Database

MongoDB Atlas provides persistent application data.

Mongoose provides application-level schemas and database access.

## Media

Cloudflare R2 stores:

- Project thumbnails
- Project screenshots
- CV files
- Other portfolio media

MongoDB stores media metadata rather than image binary data.

## API

API base path:

/api/v1

The frontend depends on the API contract rather than the backend hosting
provider.

This allows the backend to migrate to another hosting provider without
redesigning the frontend.

## Trust Boundaries

### Public Boundary

Cloudflare and the React frontend.

### Application Boundary

Node.js / Express API.

### Data Boundary

MongoDB Atlas and Cloudflare R2.

Administrative operations require backend authentication and authorization.