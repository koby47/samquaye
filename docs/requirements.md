# Software Developer Portfolio — System Requirements

## 1. Document Purpose

This document defines the functional, technical, security, operational, and deployment requirements for the Software Developer Portfolio.

It serves as the primary requirements baseline for the project. Implementation decisions should remain consistent with this document unless a requirement is deliberately changed and documented.

---

## 2. Project Overview

The system is a production-ready personal portfolio website for **Samuel Mensah Quaye**.

The portfolio will primarily position Samuel as a:

**Software Developer | Full-Stack Developer**

The system will showcase software development projects, technical skills, professional experience, and supporting expertise in cybersecurity, cloud technologies, DevOps, IT support, and administration.

The primary focus of the portfolio is **software development**.

Cybersecurity, cloud, DevOps, IT support, and administrative capabilities are supporting professional strengths and should not overshadow the software-development positioning.

---

## 3. Project Objectives

The system shall:

1. Present a professional software-development-focused personal brand.
2. Showcase completed and ongoing software projects.
3. Present projects as detailed technical case studies.
4. Allow projects to be managed dynamically.
5. Allow new projects to be added without modifying React source code.
6. Provide a secure administrative dashboard.
7. Provide a secure contact/enquiry mechanism.
8. Provide access to Samuel's CV.
9. Support media such as project screenshots and images.
10. Maintain separation between frontend, backend, database, and object storage.
11. Apply security controls throughout the architecture.
12. Support independent frontend and backend deployment.
13. Provide appropriate technical documentation.
14. Support future expansion without major architectural redesign.

---

# 4. Target Users

## 4.1 Public Visitors

Potential visitors include:

- Recruiters
- Hiring managers
- Engineering teams
- Prospective clients
- Collaborators
- Technology professionals
- Professional contacts

Public visitors do not require authentication.

---

## 4.2 Administrator

The administrator manages portfolio content through protected administrative functionality.

Initially, the system will have a single primary administrator.

The architecture should not unnecessarily prevent future role expansion.

There shall be **no public administrator registration system**.

---

# 5. Technology Stack

## 5.1 Frontend

The frontend shall use:

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- ESLint

The browser's native Fetch API may be used initially for HTTP communication unless another HTTP client provides a justified technical advantage.

---

## 5.2 Backend

The backend shall use:

- Node.js
- Express
- JavaScript ES Modules
- Versioned REST APIs

The API base path shall be:

```text
/api/v1
```

---

## 5.3 Database

The primary database shall be:

**MongoDB Atlas**

The backend shall use:

**Mongoose**

for schema definition, validation, querying, and data modelling.

---

## 5.4 Object Storage

Portfolio media shall use:

**Cloudflare R2**

R2 will be used for appropriate media assets such as:

- Project screenshots
- Project cover images
- Portfolio media
- Replaceable CV/document assets where appropriate

MongoDB shall store media metadata rather than binary media files.

---

## 5.5 Source Control

The project shall use:

- Git
- GitHub

The repository shall maintain clear separation between:

```text
client/
server/
docs/
.github/
```

---

# 6. Frontend Hosting

The production frontend shall be hosted through Cloudflare.

The exact Cloudflare deployment mechanism shall follow the currently supported and appropriate Cloudflare deployment model at implementation time.

A custom domain is not required during initial development.

The architecture must support adding a custom domain later.

---

# 7. Backend Hosting

The Express API shall remain independently deployable.

The backend shall not be tightly coupled to the frontend hosting provider.

This allows the backend to move between compatible Node.js hosting environments without requiring a frontend redesign.

---

# 8. Public Application Requirements

The public portfolio shall include the following primary areas.

## 8.1 Home

The home page shall provide:

- Developer identity
- Software-development positioning
- Concise professional introduction
- Featured projects
- Key technologies
- Appropriate calls to action
- Links to projects, contact information, and CV

---

## 8.2 Projects

The portfolio shall provide a project gallery.

Projects shall be retrieved dynamically from the backend API.

Projects must **not** be permanently hardcoded into React components.

The project gallery should eventually support appropriate filtering, categorization, or featured-project presentation.

---

## 8.3 Project Case Studies

Each project shall have a dedicated public page using a human-readable slug.

Example:

```text
/projects/sign-natural-academy
```

rather than exposing MongoDB identifiers in public URLs.

A project case study may contain:

- Project title
- Summary
- Problem/context
- Solution
- Responsibilities
- Technologies
- Features
- Architecture
- Challenges
- Security considerations
- Outcomes
- Screenshots/media
- Live project URL
- Repository URL where appropriate

---

## 8.4 About

The About section shall provide professional information relevant to Samuel's software-development career.

It may also present supporting experience in:

- Cybersecurity
- Cloud
- DevOps
- IT
- Business/administrative operations

Software development shall remain the primary narrative.

---

## 8.5 Skills

Skills should be organized into understandable technical categories.

Potential categories include:

### Frontend

- React
- JavaScript
- HTML
- CSS
- Tailwind CSS

### Backend

- Node.js
- Express
- REST APIs

### Database

- MongoDB
- Mongoose

### Development Tools

- Git
- GitHub
- Postman
- VS Code

### Cloud and Deployment

- Cloudflare
- AWS
- Relevant deployment platforms

### Security

Cybersecurity skills may be presented as supporting engineering strengths.

---

## 8.6 Contact

The portfolio shall provide a contact mechanism.

The contact system shall include:

- Server-side validation
- Abuse prevention
- Rate limiting
- Cloudflare Turnstile when implemented
- Safe handling of submitted content

---

## 8.7 CV

Visitors shall be able to access Samuel's current CV.

The final architecture should allow the CV to be replaced without requiring a frontend source-code modification.

---

# 9. Dynamic Project Management

Projects shall be managed through the backend/database.

The frontend shall consume project data through the API.

A new project should be publishable through the administrative system without requiring:

- Editing a React component
- Rebuilding project arrays
- Hardcoding project cards
- Adding project-specific frontend routes manually

---

# 10. Project Data Requirements

A project may include:

```text
title
slug
shortDescription
caseStudy/content
problem
solution
role
technologies
features
challenges
outcomes
coverImage
media
category
liveUrl
repositoryUrl
featured
status
displayOrder
publishedAt
createdAt
updatedAt
```

The final Mongoose schema will be documented in `database-design.md`.

---

# 11. Project Publication

Projects shall support publication state.

At minimum, the system should distinguish between content that is:

```text
draft
published
```

Additional states may be introduced only if they provide a clear requirement.

The backend shall enforce publication state.

Public clients must not be able to retrieve unpublished projects through public endpoints merely by knowing their IDs or slugs.

---

# 12. Categories

Projects shall support categorization.

Categories shall be dynamically manageable.

A category may contain:

- Name
- Slug
- Description
- Display order

---

# 13. Administrative Interface

The portfolio shall contain a protected administrative area.

The admin interface shall eventually provide:

- Dashboard overview
- Project management
- Category management
- Media management
- Contact enquiry management
- Portfolio settings
- CV management
- Authentication/logout

---

# 14. Admin Registration

The application shall **not provide public administrator registration**.

Administrator creation shall occur through a controlled bootstrap or administrative process.

There shall be no publicly accessible endpoint such as:

```text
POST /api/v1/auth/register
```

for creating administrators.

---

# 15. Authentication

Administrator authentication shall be implemented securely.

Requirements include:

- Argon2id password hashing
- Secure authentication state
- HTTP-only cookies for browser authentication
- Appropriate expiration
- Secure cookie settings in production
- Login rate limiting
- Server-side authentication verification
- Logout support
- Safe login error responses

The exact session/token implementation shall be finalized during the authentication phase.

---

# 16. Authorization

Authorization shall be enforced by the backend.

Frontend route protection is a usability mechanism and shall not be treated as a security control.

Protected operations must verify authorization before accessing or modifying resources.

---

# 17. CORS

The backend shall support multiple explicitly trusted frontend origins.

Trusted origins shall be supplied through environment configuration.

Baseline format:

```env
CLIENT_URLS=http://localhost:5173,https://production.example
```

Origins shall be compared against an explicit allowlist.

The production API shall not use unrestricted wildcard CORS with credentialed requests.

---

# 18. Security Requirements

The application shall address:

- Authentication
- Authorization
- Password security
- Session/token security
- CORS
- CSRF where applicable
- XSS
- NoSQL injection
- Security headers
- Rate limiting
- Request validation
- Request-size limits
- File-upload security
- Brute-force protection
- Secret management
- Dependency security
- Error handling
- Audit logging
- Abuse prevention

Detailed controls are documented in:

```text
docs/security.md
docs/threat-model.md
```

---

# 19. HTTP Security Headers

The Express backend shall use security headers.

Helmet is the selected baseline middleware.

The final Content Security Policy shall be configured according to the resources actually required by the application.

---

# 20. Rate Limiting

The backend shall provide baseline API rate limiting.

Additional stricter rate limits shall be considered for:

- Administrator login
- Contact submissions
- Media operations
- Other abuse-sensitive endpoints

A single global rate limit shall not be assumed to provide sufficient protection for every endpoint.

---

# 21. Request Validation

Untrusted input shall be validated before business logic executes.

Validation shall cover, where appropriate:

- Required fields
- Data types
- Length
- Allowed values
- URLs
- Email addresses
- Identifiers
- File metadata
- Unexpected fields

Client-side validation shall not replace server-side validation.

---

# 22. Request Size Limits

Normal JSON and URL-encoded requests shall have conservative size limits.

Large media uploads shall not rely on ordinary JSON request handling.

---

# 23. XSS Protection

The application shall:

- Use React's normal escaping behavior
- Avoid unnecessary raw HTML rendering
- Validate URLs and content
- Apply Content Security Policy
- Sanitize content if rich HTML is introduced

Unsafe HTML rendering must not be introduced without an explicit security design.

---

# 24. NoSQL Injection Protection

The backend shall not construct MongoDB queries directly from arbitrary request objects.

The application shall use:

- Explicit query construction
- Validation
- Mongoose schemas
- Allowed-field controls
- Rejection of unexpected MongoDB operators where applicable

---

# 25. CSRF

Because browser authentication is planned around cookies, CSRF shall be explicitly evaluated during authentication implementation.

Controls may include:

- Appropriate `SameSite` settings
- Origin validation
- CSRF tokens where required

The final control shall depend on the production frontend/API topology.

---

# 26. Media Management

The administrative system shall allow authorized media management.

Media operations shall support:

- Upload
- Metadata
- Association with projects
- Appropriate deletion
- Alt text
- Safe file handling

---

# 27. File Upload Security

Uploads shall be validated for:

- Authentication
- Authorization
- File size
- Permitted media type
- File metadata
- Storage key
- Resource association

The backend shall not trust only:

- Filename extensions
- Browser-supplied MIME types
- Original filenames

---

# 28. Cloudflare R2

Cloudflare R2 shall store portfolio media.

R2 secret credentials shall never be exposed to the React frontend.

The preferred architecture should avoid routing large media payloads unnecessarily through the Express server where secure direct upload authorization is appropriate.

The final R2 workflow shall be documented when implemented.

---

# 29. Contact Enquiries

Contact enquiries may be stored for administrative review.

The system shall provide appropriate status management, such as:

```text
new
read
replied
archived
```

The final database design shall define the exact values.

---

# 30. Cloudflare Turnstile

Cloudflare Turnstile is planned for the public contact workflow.

The frontend may use a public/site key.

The Turnstile secret key shall remain server-side.

Verification shall occur through the backend.

---

# 31. Portfolio Settings

The administrative system should eventually allow selected portfolio-wide settings to be updated without source-code changes.

Potential settings include:

- Professional headline
- Short biography
- Contact information
- Social links
- CV
- Availability
- SEO defaults

---

# 32. Audit Logging

Security-relevant administrative actions shall be auditable.

Potential events include:

- Login events
- Project creation
- Project updates
- Project deletion
- Publication changes
- Media deletion
- Settings changes
- CV replacement

Audit logs must not contain:

- Plaintext passwords
- Authentication secrets
- R2 secret keys
- Session/token values
- Unnecessary sensitive request payloads

---

# 33. Error Handling

The backend shall provide centralized error handling.

Development environments may expose useful diagnostic information.

Production responses shall not expose:

- Stack traces
- Database internals
- Filesystem paths
- Credentials
- Secrets
- Sensitive infrastructure details

---

# 34. API Requirements

The API shall use versioned routes.

Base path:

```text
/api/v1
```

Examples:

```text
/api/v1/health
/api/v1/projects
/api/v1/auth
```

The complete API design is maintained in:

```text
docs/api.md
```

---

# 35. API Response Design

API responses should remain predictable.

Typical successful response:

```json
{
  "success": true,
  "data": {}
}
```

Typical error response:

```json
{
  "success": false,
  "message": "Request could not be completed"
}
```

Sensitive implementation information must not be included.

---

# 36. Performance

The application shall aim for:

- Fast initial load
- Optimized production bundles
- Responsive layouts
- Optimized images
- Lazy loading where useful
- CDN/edge delivery
- Appropriate caching
- Efficient database queries
- Appropriate indexes
- Minimal unnecessary network requests

---

# 37. Accessibility

The public interface should follow modern accessibility practices.

This includes:

- Semantic HTML
- Keyboard-accessible controls
- Appropriate labels
- Alternative text
- Sufficient contrast
- Visible focus states
- Logical heading hierarchy
- Accessible navigation

---

# 38. SEO

The public portfolio shall support:

- Descriptive page titles
- Metadata
- Human-readable URLs
- Project slugs
- Open Graph metadata
- Sitemap
- Robots configuration
- Canonical URLs where required
- Structured data where useful

---

# 39. Responsive Design

The interface shall support:

- Mobile
- Tablet
- Desktop

The portfolio shall not be designed solely for desktop displays.

---

# 40. Logging

Operational logs shall provide sufficient information for diagnosis without exposing secrets.

Production logging should distinguish between:

- Application errors
- Security events
- Administrative audit events

---

# 41. Git and Repository Requirements

The repository shall maintain:

```text
client/
server/
docs/
.github/
```

Secrets and generated artifacts shall be excluded appropriately using `.gitignore`.

The project shall use GitHub as its remote source repository.

---

# 42. Branching

Baseline branch strategy:

```text
main
develop
feature/*
fix/*
security/*
docs/*
```

`main` represents production-ready code.

`develop` represents active integration work.

---

# 43. Environment Configuration

Environment-specific configuration shall not be hardcoded.

Frontend example:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Backend example:

```env
NODE_ENV=development
PORT=5000
CLIENT_URLS=http://localhost:5173
```

Secret values shall remain outside Git.

---

# 44. CI/CD

A later implementation phase shall introduce CI/CD.

The intended quality flow is:

```text
Install dependencies
        ↓
Lint
        ↓
Automated tests
        ↓
Production build
        ↓
Security checks
        ↓
Deployment eligibility
```

Deployment must not bypass required quality checks once the pipeline is established.

---

# 45. Testing

The project shall eventually include:

- Linting
- Unit testing where appropriate
- API integration testing
- Authentication testing
- Authorization testing
- Security-focused testing
- Frontend testing where valuable
- Production build verification
- Deployment smoke testing

Detailed testing requirements are maintained in:

```text
docs/testing.md
```

---

# 46. Documentation

The repository shall maintain:

```text
docs/
├── requirements.md
├── architecture.md
├── database-design.md
├── api.md
├── security.md
├── threat-model.md
├── cloudflare-deployment.md
├── local-development.md
├── production-deployment.md
├── testing.md
└── troubleshooting.md
```

The root repository shall also contain:

```text
README.md
```

Documentation must evolve with the implementation.

---

# 47. Current Implementation Status

## Completed

The following foundation work has been completed:

- Git repository initialization
- GitHub repository connection
- `main` and `develop` workflow
- Root project structure
- Client/server separation
- Documentation directory
- Environment templates
- Secret exclusion through `.gitignore`
- React/Vite initialization
- Tailwind CSS integration
- ESLint integration
- Frontend environment configuration foundation
- Initial Express backend foundation

---

## In Progress

Backend architecture refactoring is currently in progress.

This includes separation of:

```text
config/
routes/
middlewares/
controllers/
services/
models/
validators/
```

and separation of:

```text
app.js
server.js
```

---

## Approved but Not Yet Implemented

The following have been architecturally approved but are not yet complete:

- MongoDB Atlas integration
- Mongoose models
- Argon2id authentication
- Secure admin cookies
- Admin authorization
- Project CRUD
- Categories
- Publication workflow
- R2 integration
- Media management
- Contact enquiries
- Turnstile
- Portfolio settings
- Audit logging
- Full public frontend
- Admin dashboard
- Automated backend tests
- CI/CD
- Cloudflare production deployment
- Production monitoring

---

# 48. Implementation Principle

The project shall be implemented incrementally.

Each major phase should:

1. Define the architecture.
2. Implement the feature.
3. Validate functionality.
4. Validate security.
5. Test expected failure conditions.
6. Update documentation.
7. Commit a controlled milestone.

Features should not be treated as complete merely because the happy path works.

---

# 49. Requirements Change Management

When an architectural or functional requirement changes:

1. The reason should be understood.
2. Security implications should be reviewed.
3. Relevant documentation should be updated.
4. Implementation should be aligned with the updated requirement.
5. Obsolete documentation should not remain as if it were current.

This document remains the primary requirements baseline for the Software Developer Portfolio.