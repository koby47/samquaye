# Software Developer Portfolio

Production-ready software developer portfolio built using the MERN stack and
Cloudflare infrastructure.

## Primary Purpose

This portfolio showcases software development projects, technical capabilities,
engineering decisions, and professional experience.

## Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Media

- Cloudflare R2

### Infrastructure

- Cloudflare
- GitHub

## Architecture

The application uses a decoupled architecture:

Cloudflare
    ↓
React/Vite
    ↓
REST API
    ↓
Node.js/Express
    ↓
MongoDB Atlas

Media assets are stored separately in Cloudflare R2.

## Repository Structure

client/     React frontend

server/     Express backend

docs/       Technical documentation

.github/    CI/CD workflows

## Documentation

Technical documentation is maintained in the `/docs` directory.

## Development Status

Currently under active development.

## Security

Secrets and credentials must never be committed to the repository.

Use `.env.example` files to document required environment variables without
including real credentials.