# Software Developer Portfolio — System Requirements

## Purpose

Build a production-ready software developer portfolio focused primarily on
full-stack and web development.

The portfolio will showcase:

- Software development projects
- Full-stack development capabilities
- Frontend development capabilities
- Technical skills
- Development experience
- Project architecture and engineering decisions
- Professional experience
- Education and certifications
- Supporting cybersecurity and cloud knowledge

## Primary Professional Identity

Software Developer / Full-Stack Developer

Cybersecurity, cloud, DevOps, administration, and business operations are
supporting competencies rather than the primary focus of the portfolio.

## Core Architecture

Frontend:
- React
- Vite
- Tailwind CSS
- React Router

Backend:
- Node.js
- Express.js

Database:
- MongoDB Atlas
- Mongoose

Media:
- Cloudflare R2

Frontend Deployment:
- Cloudflare Workers with Static Assets

Version Control:
- Git
- GitHub

## Core Functional Requirements

The application must provide:

1. Public homepage
2. Dynamic project gallery
3. Individual project case-study pages
4. About page
5. Skills section
6. Contact system
7. CV access
8. Secure administrator authentication
9. Administrator dashboard
10. Project management
11. Category management
12. Media management
13. Contact enquiry management
14. Portfolio settings
15. Audit logging

## Dynamic Project Requirement

Projects must not be hard-coded into React.

Projects will be stored in MongoDB and retrieved through the REST API.

The administrator must be able to create, edit, publish, unpublish, feature,
reorder, and delete projects through the administration interface.

## Security Requirements

The application must implement:

- Authentication
- Authorization
- Secure password hashing
- Secure session/token handling
- CORS controls
- Content Security Policy
- Security headers
- Rate limiting
- Input validation
- XSS protection
- CSRF protection where applicable
- NoSQL injection protection
- File upload validation
- Bot protection
- Brute-force protection
- Secret management
- Dependency vulnerability management
- Secure error handling
- Application logging
- Administrative audit logging

Secrets must never be committed to Git or exposed through the frontend bundle.