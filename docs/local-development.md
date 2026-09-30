# Local Development

## Requirements

- Node.js 22+
- npm
- Git
- VS Code or another modern code editor

## Repository

Clone the repository and enter the project directory.

## Branching

The repository uses:

- `main` for production-ready code
- `develop` for integration
- `feature/*` for feature development
- `fix/*` for bug fixes
- `security/*` for security-related changes
- `docs/*` for documentation changes

## Environment Variables

Never commit real `.env` files.

Use:

- `client/.env.example`
- `server/.env.example`

as templates.

## Frontend

The React/Vite frontend will live in:

`client/`

## Backend

The Node.js/Express API will live in:

`server/`

## Documentation

Architecture and engineering documentation is maintained under:

`docs/`