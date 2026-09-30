# Portfolio Security Architecture

## Security Principle

Security is part of the application architecture rather than a post-development
feature.

## Authentication

The portfolio will not provide public administrator registration.

Administrator accounts will be provisioned through a controlled process.

Passwords will be hashed using Argon2id.

## Authorization

All administrative API endpoints must perform server-side authorization.

Frontend route protection is a usability control and is not considered an
authorization boundary.

## Secrets

Secrets must only exist in approved server-side environment or secret stores.

Examples:

- MongoDB credentials
- Authentication secrets
- Cloudflare R2 credentials
- Turnstile secret key

Secrets must never be committed to GitHub.

## Browser Authentication

Authentication credentials should use secure HTTP-only cookies where
appropriate.

Security attributes include:

- HttpOnly
- Secure
- Appropriate SameSite policy

## API Security

The API will implement:

- Input validation
- CORS restrictions
- Rate limiting
- Security headers
- Error sanitization
- Authentication
- Authorization

## Upload Security

Media uploads will enforce:

- Administrator authentication
- File size restrictions
- MIME type validation
- Allowed file formats
- Randomized object names
- Controlled R2 authorization

Executable uploads will not be permitted.

## Contact Security

The contact system will use:

- Input validation
- Rate limiting
- Cloudflare Turnstile
- Server-side Turnstile verification
- Safe database handling

## Logging

Security events and administrative changes will be logged.

Sensitive information must not be written to application logs.