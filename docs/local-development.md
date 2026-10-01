# Software Developer Portfolio — Local Development Guide

## 1. Document Purpose

This document explains how to configure, run, test, and maintain the Software Developer Portfolio in a local development environment.

It covers:

- Prerequisites
- Repository setup
- Node.js version
- Project structure
- Dependency installation
- Environment configuration
- Frontend development
- Backend development
- CORS configuration
- MongoDB configuration
- Cloudflare R2 configuration
- Git workflow
- Linting
- Testing
- Build validation
- Security precautions
- Common development checks

Some infrastructure described here is planned and has not yet been implemented.

---

# 2. Supported Development Environment

The project is developed primarily using:

```text
Windows
PowerShell
Visual Studio Code
Node.js
npm
Git
```

The application architecture itself should remain portable to other compatible development environments.

---

# 3. Required Software

Install the following before working on the project:

```text
Node.js
npm
Git
Visual Studio Code or another editor
Modern web browser
```

Future phases also require access to:

```text
MongoDB Atlas
Cloudflare
GitHub
```

---

# 4. Node.js Version

The project baseline is:

```text
Node.js >= 22
```

The repository contains:

```text
.nvmrc
```

with:

```text
22
```

The root `package.json` and backend package configuration should also declare the supported Node.js version.

---

# 5. Check Node.js

From PowerShell:

```powershell
node --version
```

Expected:

```text
v22.x.x
```

or another compatible version satisfying:

```text
>=22
```

Check npm:

```powershell
npm --version
```

---

# 6. Check Git

Run:

```powershell
git --version
```

Expected output resembles:

```text
git version 2.x.x
```

---

# 7. Repository Structure

The project uses a single repository containing both frontend and backend applications.

```text
software-developer-portfolio/
│
├── client/
├── server/
├── docs/
├── .github/
│   └── workflows/
│
├── .editorconfig
├── .gitignore
├── .nvmrc
├── package.json
└── README.md
```

---

# 8. Clone Repository

Once the repository is hosted on GitHub, a fresh development environment can obtain it with:

```powershell
git clone <repository-url>
```

Then:

```powershell
cd software-developer-portfolio
```

Do not include private credentials in repository URLs stored in documentation.

---

# 9. Git Branches

The primary long-lived branches are:

```text
main
develop
```

## `main`

Represents production-ready code.

## `develop`

Primary integration/development branch.

Routine development should generally occur from `develop` or short-lived branches created from it.

---

# 10. Verify Current Branch

Run:

```powershell
git branch
```

or:

```powershell
git status
```

For current development work, the expected branch is generally:

```text
develop
```

---

# 11. Creating the Develop Branch

If starting from a repository that contains only `main`:

```powershell
git checkout -b develop
```

Then:

```powershell
git push -u origin develop
```

This only needs to be performed once when establishing the branch.

---

# 12. Future Feature Branches

As the project grows, focused work may use branches such as:

```text
feature/project-api
feature/admin-auth
feature/r2-media
feature/contact-form
```

Example:

```powershell
git checkout develop
git pull
git checkout -b feature/admin-auth
```

Feature branches should remain reasonably focused.

---

# 13. Root Package Configuration

The root `package.json` coordinates common development commands.

Current baseline scripts include:

```json
{
  "scripts": {
    "client": "npm --prefix client run dev",
    "server": "npm --prefix server run dev"
  }
}
```

This allows development commands to be started from the repository root.

---

# 14. Root Client Command

From:

```text
software-developer-portfolio/
```

run:

```powershell
npm run client
```

This starts the Vite development server.

---

# 15. Root Server Command

From:

```text
software-developer-portfolio/
```

run:

```powershell
npm run server
```

This starts the Express development server.

---

# 16. Separate Terminals

During normal full-stack development, use separate terminal sessions.

Example:

### Terminal 1

```powershell
npm run client
```

### Terminal 2

```powershell
npm run server
```

This allows frontend and backend output to remain independently visible.

---

# 17. Frontend Directory

Frontend source code lives in:

```text
client/
```

Current architecture:

```text
client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── config/
│   ├── features/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── package.json
└── vite.config.js
```

---

# 18. Install Frontend Dependencies

From the repository root:

```powershell
cd client
npm install
```

Then return to the root if required:

```powershell
cd ..
```

A fresh clone requires dependency installation because:

```text
node_modules/
```

is not committed to Git.

---

# 19. Frontend Development Server

From:

```text
client/
```

run:

```powershell
npm run dev
```

The development server normally becomes available at:

```text
http://localhost:5173
```

The actual port should be confirmed from Vite terminal output.

---

# 20. Frontend Technology Baseline

The frontend currently uses:

```text
React
Vite
JavaScript
Tailwind CSS
React Router
ESLint
```

Tailwind is integrated through the Vite plugin.

---

# 21. Frontend Environment File

Local frontend configuration belongs in:

```text
client/.env
```

Current development value:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

The repository-safe example belongs in:

```text
client/.env.example
```

---

# 22. Frontend Environment Security

Vite environment variables beginning with:

```text
VITE_
```

are available to browser-delivered code.

Therefore:

```text
VITE_* = PUBLIC CONFIGURATION
```

Never place secrets such as:

```text
MongoDB credentials
R2 secret keys
Authentication secrets
Turnstile secret keys
Deployment credentials
```

inside frontend environment variables.

---

# 23. Frontend Environment Access

Frontend environment configuration is centralized in:

```text
client/src/config/env.js
```

Current design:

```javascript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL is not configured.')
}

export const env = Object.freeze({
  apiBaseUrl,
})
```

Application components should prefer centralized configuration rather than repeatedly accessing `import.meta.env`.

---

# 24. Restart After Environment Changes

When changing Vite environment variables:

```text
client/.env
```

restart the Vite development server.

Vite environment changes should not be assumed to update reliably inside an already running process.

---

# 25. Frontend Linting

From:

```text
client/
```

run:

```powershell
npm run lint
```

Linting should pass before frontend changes are considered complete.

---

# 26. Frontend Production Build

Before deployment or after major frontend changes:

```powershell
npm run build
```

Expected build output is normally:

```text
client/dist/
```

The build directory is ignored by Git.

---

# 27. Frontend Build Validation

A successful development server does not guarantee a successful production build.

Therefore, before deployment:

```powershell
npm run lint
npm run build
```

Both should pass.

---

# 28. Backend Directory

Backend source code lives in:

```text
server/
```

Target structure:

```text
server/
│
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── utils/
├── validators/
│
├── .env
├── .env.example
├── app.js
├── package.json
└── server.js
```

---

# 29. Backend Dependencies

Current backend foundation uses:

```text
express
dotenv
cors
helmet
express-rate-limit
cookie-parser
```

Development dependency:

```text
nodemon
```

Additional packages will be introduced only when their implementation phase begins.

For example:

```text
mongoose
argon2
```

are planned but should not be treated as implemented until installed and integrated.

---

# 30. Install Backend Dependencies

From the repository root:

```powershell
cd server
npm install
```

Then:

```powershell
cd ..
```

---

# 31. Backend Development Command

From:

```text
server/
```

run:

```powershell
npm run dev
```

Current script:

```json
{
  "dev": "nodemon server.js"
}
```

---

# 32. Backend Production Command

The backend production entry command is:

```powershell
npm start
```

which executes:

```text
node server.js
```

---

# 33. Backend Entry Point

The backend entry point is:

```text
server/server.js
```

The project intentionally uses:

```text
server/server.js
```

rather than:

```text
server/src/app.js
```

as the process entry location.

---

# 34. `app.js` and `server.js`

The backend separates Express configuration from process startup.

```text
app.js
```

is responsible for:

- Express initialization
- Middleware
- Routes
- 404 handling
- Error handling

```text
server.js
```

is responsible for:

- Startup
- Infrastructure initialization
- HTTP listener
- Future graceful shutdown behavior

---

# 35. Backend Environment File

Local backend configuration belongs in:

```text
server/.env
```

Planned baseline:

```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=

# Authentication
SESSION_SECRET=

# CORS
CLIENT_URLS=http://localhost:5173

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=

# Cloudflare Turnstile
TURNSTILE_SECRET_KEY=
```

Values should only be populated when their corresponding feature is implemented.

---

# 36. Backend Environment Example

The repository may contain:

```text
server/.env.example
```

with:

```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=

# Authentication
SESSION_SECRET=

# CORS
CLIENT_URLS=http://localhost:5173,https://your-production-domain.com

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=

# Cloudflare Turnstile
TURNSTILE_SECRET_KEY=
```

This file documents required variable names without containing real secrets.

---

# 37. `.env` Security

Never commit:

```text
server/.env
client/.env
```

The root `.gitignore` protects environment files.

Before committing configuration changes, verify:

```powershell
git status
```

If necessary:

```powershell
git check-ignore server/.env
```

and:

```powershell
git check-ignore client/.env
```

---

# 38. Environment Loading

Environment loading should be centralized.

The backend configuration layer should ensure environment variables are available before they are validated.

The preferred design is for the environment configuration module to load environment configuration itself.

Conceptually:

```javascript
import 'dotenv/config'
```

belongs at the beginning of the centralized environment configuration path.

This avoids accidental dependence on import ordering elsewhere in the application.

---

# 39. Environment Validation

Required environment variables should fail early.

Example:

```text
Missing required environment variable: CLIENT_URLS
```

is preferable to allowing the application to start with an invalid security configuration.

However, environment variables for features that have not yet been implemented should not be made mandatory prematurely.

For example, `MONGODB_URI` should become required when MongoDB integration is enabled.

---

# 40. Local Ports

Current development baseline:

```text
Frontend: 5173
Backend: 5000
```

Therefore:

```text
http://localhost:5173
```

communicates with:

```text
http://localhost:5000/api/v1
```

---

# 41. Local CORS Configuration

Backend:

```env
CLIENT_URLS=http://localhost:5173
```

Frontend:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

These values must correspond.

---

# 42. Multiple CORS Origins

When multiple trusted frontend origins are required:

```env
CLIENT_URLS=http://localhost:5173,https://portfolio.example.com
```

Origins are comma-separated.

Do not add spaces unless the parser trims them safely.

The current design trims values.

---

# 43. CORS Security

Do not solve CORS problems by changing the backend to:

```text
*
```

when credentialed authentication is involved.

Instead, identify the real frontend origin and add it explicitly when trusted.

---

# 44. CORS Testing

With the backend running:

```powershell
curl.exe -i `
  -H "Origin: http://localhost:5173" `
  http://localhost:5000/api/v1/health
```

The response should include appropriate CORS headers for the trusted origin.

---

# 45. Blocked CORS Origin Test

Test an untrusted browser origin:

```powershell
curl.exe -i `
  -H "Origin: https://malicious.example" `
  http://localhost:5000/api/v1/health
```

The backend should not grant that origin credentialed browser access.

Exact response behavior depends on the final CORS error handling implementation.

---

# 46. Backend Health Check

With the backend running, open:

```text
http://localhost:5000/api/v1/health
```

Expected:

```json
{
  "success": true,
  "message": "Portfolio API is running"
}
```

---

# 47. Health Check with PowerShell

Use:

```powershell
curl.exe http://localhost:5000/api/v1/health
```

or:

```powershell
Invoke-RestMethod http://localhost:5000/api/v1/health
```

---

# 48. 404 Test

Request:

```text
http://localhost:5000/api/v1/test
```

Expected:

```json
{
  "success": false,
  "message": "Route not found"
}
```

with:

```text
404
```

status.

---

# 49. Testing HTTP Status with `curl.exe`

Run:

```powershell
curl.exe -i http://localhost:5000/api/v1/test
```

The `-i` option includes response headers and status information.

---

# 50. PowerShell `curl`

On Windows PowerShell environments, `curl` may behave differently depending on shell configuration.

When exact cURL behavior is required, prefer:

```powershell
curl.exe
```

This explicitly invokes the cURL executable.

---

# 51. MongoDB Local Development

MongoDB Atlas is the selected database.

A local MongoDB server is not required by the approved architecture.

The development backend will connect to Atlas using:

```env
MONGODB_URI=
```

MongoDB integration has not yet been implemented at the current documentation stage.

---

# 52. Planned MongoDB Setup

When database implementation begins:

1. Create/configure MongoDB Atlas project.
2. Create application database.
3. Create dedicated application user.
4. Use strong credentials.
5. Configure network access.
6. Add development IP access.
7. Obtain connection URI.
8. Store URI in `server/.env`.
9. Install Mongoose.
10. Implement `config/db.js`.
11. Test connection.
12. Add graceful failure behavior.

---

# 53. MongoDB Development Security

Do not:

```text
Commit MONGODB_URI
Paste credentials into frontend code
Expose Atlas credentials in screenshots
Use an unnecessarily privileged database user
```

Network access should remain as restricted as practical.

---

# 54. Planned Mongoose Installation

When the database phase begins:

```powershell
cd server
npm install mongoose
```

Do not install dependencies significantly ahead of their implementation unless there is a concrete reason.

---

# 55. Planned Database Startup

Target startup:

```text
Load environment
      ↓
Validate environment
      ↓
Connect MongoDB
      ↓
Start HTTP server
```

If MongoDB is required and connection fails, the backend should not falsely report itself ready.

---

# 56. Cloudflare R2 Local Development

R2 integration is planned but not yet implemented.

Future server variables include:

```env
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

Permanent R2 credentials belong only in:

```text
server/.env
```

or secure deployment secret storage.

---

# 57. R2 Browser Security

Never put:

```text
R2_SECRET_ACCESS_KEY
```

inside:

```text
client/.env
```

The planned browser upload architecture uses temporary authorization rather than permanent R2 credentials.

---

# 58. Turnstile Local Development

Cloudflare Turnstile will be introduced during contact implementation.

The secret belongs in:

```env
TURNSTILE_SECRET_KEY=
```

on the backend.

Frontend configuration may eventually contain a public Turnstile site key.

The public site key and secret key must not be confused.

---

# 59. Administrator Authentication Development

Authentication is not yet implemented.

When introduced, development will include:

```text
Admin bootstrap
Argon2id
Login
Secure cookie
Authentication middleware
Authorization middleware
Logout
/me
CSRF evaluation
Login rate limiting
Audit events
```

---

# 60. Authentication Development Testing

Authentication testing should use the API directly in addition to the frontend.

Do not rely solely on:

```text
The login page works
```

Tests must also verify protected API behavior.

---

# 61. Git Status

Before each commit:

```powershell
git status
```

Review:

- Modified files
- New files
- Deleted files
- Unexpected environment files
- Build artifacts

Do not commit blindly using large staging commands without reviewing the changes.

---

# 62. Git Diff

Before committing:

```powershell
git diff
```

After staging:

```powershell
git diff --staged
```

This helps detect:

- Accidental secrets
- Debug code
- Unintended changes
- Large unrelated modifications

---

# 63. Staging Changes

After reviewing:

```powershell
git add <files>
```

or when appropriate:

```powershell
git add .
```

`git add .` should be used only after reviewing the working tree.

---

# 64. Commit Messages

Use concise descriptive commit messages.

Examples:

```text
chore: initialize portfolio project structure
chore: complete development environment setup
docs: establish portfolio technical documentation baseline
feat: add MongoDB connection
feat: add admin authentication
feat: add project management API
fix: enforce published project access
```

---

# 65. Push Development Work

When working on `develop`:

```powershell
git push
```

If upstream has not yet been configured:

```powershell
git push -u origin develop
```

---

# 66. Pull Before Major Work

When multiple environments or contributors may modify the repository:

```powershell
git pull
```

before starting significant work.

Review incoming changes before resolving conflicts.

---

# 67. `.gitignore`

The repository ignores items such as:

```text
node_modules/
.env
.env.*
client/dist/
server/dist/
coverage/
logs/
*.log
.wrangler/
.dev.vars
.vscode/
.idea/
```

while allowing safe example environment files.

---

# 68. Dependency Directories

Do not commit:

```text
node_modules/
```

Dependencies are reproduced from:

```text
package.json
package-lock.json
```

using:

```powershell
npm install
```

or appropriate clean-install commands in CI.

---

# 69. Lockfiles

Commit:

```text
package-lock.json
```

for both application packages where generated.

Lockfiles improve reproducibility and dependency visibility.

---

# 70. Adding Dependencies

Before adding a dependency, determine:

1. What requirement does it solve?
2. Can existing platform functionality solve it?
3. Is the package maintained?
4. Does it introduce security concerns?
5. Is it needed in production or development only?

---

# 71. Production Dependency

Install runtime dependencies with:

```powershell
npm install <package>
```

Example:

```powershell
npm install mongoose
```

---

# 72. Development Dependency

Install tooling with:

```powershell
npm install -D <package>
```

Example:

```powershell
npm install -D nodemon
```

---

# 73. Dependency Audit

Periodically run:

```powershell
npm audit
```

inside:

```text
client/
```

and:

```text
server/
```

Do not automatically apply breaking dependency upgrades without reviewing their impact.

---

# 74. Editor Configuration

The root:

```text
.editorconfig
```

defines baseline formatting behavior.

Current configuration:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

Editors with EditorConfig support should respect this automatically.

---

# 75. Line Endings

The project standard is:

```text
LF
```

even when development occurs on Windows.

This reduces unnecessary cross-platform Git differences.

---

# 76. Frontend Code Organization

Frontend code should be organized by responsibility.

Reusable UI:

```text
components/
```

Feature-specific logic:

```text
features/
```

Page-level components:

```text
pages/
```

API communication:

```text
services/
```

Environment configuration:

```text
config/
```

General utilities:

```text
utils/
```

---

# 77. Backend Code Organization

Backend code follows:

```text
routes
   ↓
validators/middleware
   ↓
controllers
   ↓
services
   ↓
models/infrastructure
```

Do not place all application logic inside:

```text
server.js
```

---

# 78. Backend Refactoring Rule

As functionality grows, keep:

```text
server.js
```

small.

Its responsibility is application startup.

Keep:

```text
app.js
```

focused on Express application configuration.

Business logic belongs elsewhere.

---

# 79. API Versioning During Development

All application API routes belong under:

```text
/api/v1
```

Do not create unrelated routes outside the versioned API without a clear reason.

---

# 80. Development Error Behavior

Development mode may provide more detailed errors than production.

Set:

```env
NODE_ENV=development
```

locally.

Detailed development errors must still avoid exposing secrets.

---

# 81. Production Simulation

Before deployment, it may be useful to test:

```env
NODE_ENV=production
```

locally or in a staging environment.

Verify that:

- Errors are generic
- Cookies behave appropriately
- Builds succeed
- Environment configuration is complete

Do not overwrite local secrets unnecessarily while testing.

---

# 82. Testing Strategy

Detailed testing requirements are maintained in:

```text
docs/testing.md
```

At minimum, development should include:

```text
Lint
Build
Unit tests where applicable
Integration tests
Security failure tests
Manual smoke tests
```

as those capabilities are implemented.

---

# 83. Current Manual Backend Tests

Current foundation can be tested using:

```powershell
npm run dev
```

then:

```powershell
curl.exe -i http://localhost:5000/api/v1/health
```

and:

```powershell
curl.exe -i http://localhost:5000/api/v1/test
```

---

# 84. Current Manual Frontend Tests

Run:

```powershell
npm run dev
```

inside:

```text
client/
```

Verify:

- Application loads
- Tailwind styling works
- Browser console contains no unexpected errors

Then run:

```powershell
npm run lint
```

---

# 85. Future Automated Tests

Backend tests will eventually verify:

```text
Health endpoint
Validation
Authentication
Authorization
Projects
Categories
Media
Contact
Settings
Publication restrictions
Security failure paths
```

Frontend tests will be added where they provide meaningful value.

---

# 86. Security During Local Development

Local development must still follow security rules.

Do not:

```text
Disable validation for convenience
Commit secrets
Expose production credentials
Disable authentication permanently
Use wildcard credentialed CORS
Log passwords
Put backend secrets in Vite variables
```

---

# 87. Debugging

Temporary debugging statements should not expose sensitive values.

Unsafe:

```javascript
console.log(process.env)
```

Unsafe:

```javascript
console.log(req.body)
```

inside authentication routes where passwords may be present.

Prefer targeted logging.

---

# 88. Debug Code Cleanup

Before committing, remove temporary:

```text
console.log
debug endpoints
temporary credentials
temporary CORS exceptions
test secrets
```

unless they are deliberately part of the implementation.

---

# 89. Development Database Data

Development/test data should not be confused with production content.

When automated tests are introduced, they should use a dedicated test database.

Never point destructive automated tests at production MongoDB.

---

# 90. Development Admin Account

The development administrator should use credentials appropriate for development.

Do not publish those credentials in:

```text
README.md
docs/
GitHub issues
source files
```

Bootstrap instructions may describe how to create an administrator without exposing the actual password.

---

# 91. Port Already in Use

If the backend reports that port:

```text
5000
```

is already in use, identify the process rather than randomly changing application architecture.

On Windows:

```powershell
netstat -ano | findstr :5000
```

The final number is the process ID.

Inspect it:

```powershell
tasklist | findstr <PID>
```

Terminate only if you know the process is safe to stop.

---

# 92. Vite Port Already in Use

If:

```text
5173
```

is occupied, Vite may select another port.

If this happens, update:

```env
CLIENT_URLS=
```

to include the actual trusted development origin.

Do not assume the frontend is always running on `5173`.

---

# 93. CORS Error During Development

If the browser reports a CORS problem:

1. Confirm frontend URL.
2. Confirm backend URL.
3. Check `CLIENT_URLS`.
4. Restart backend after environment changes.
5. Test `/health`.
6. Test with `curl.exe` and an `Origin` header.
7. Inspect backend error output.

Do not immediately disable CORS.

---

# 94. Missing Environment Variable

If startup reports:

```text
Missing required environment variable
```

check:

```text
server/.env
```

and confirm:

- Correct filename
- Correct variable name
- Correct working directory
- Environment loader executes before validation

---

# 95. Environment Import Ordering

If variables exist in `.env` but validation reports them missing, inspect environment loading.

The centralized configuration should load:

```javascript
import 'dotenv/config'
```

before reading `process.env`.

This prevents ESM import-order assumptions from causing configuration failures.

---

# 96. Backend Not Restarting

Nodemon should restart when server files change.

If it does not:

1. Stop the process with `Ctrl+C`.
2. Run:

```powershell
npm run dev
```

again.

Do not run multiple accidental backend instances.

---

# 97. Frontend Not Updating

If Vite does not reflect a change:

1. Check browser console.
2. Check terminal errors.
3. Save the file.
4. Refresh.
5. Restart Vite if configuration/environment files changed.

---

# 98. Clean Dependency Reinstall

If dependency installation becomes corrupted, first preserve:

```text
package.json
package-lock.json
```

Then, if justified, remove `node_modules` and reinstall.

PowerShell example inside the affected application:

```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

Deleting the lockfile should not be the first troubleshooting step.

---

# 99. Do Not Delete Lockfiles Casually

`package-lock.json` provides reproducible dependency resolution.

Only regenerate it when there is a clear dependency-management reason.

---

# 100. Build Artifacts

Generated frontend build output:

```text
client/dist/
```

should not be manually edited.

Modify source files and rebuild instead.

---

# 101. Documentation During Development

When implementation changes architecture or behavior, update the corresponding documentation.

Examples:

```text
New endpoint
    → api.md

New collection
    → database-design.md

New security control
    → security.md

New threat
    → threat-model.md

Deployment change
    → deployment documentation
```

---

# 102. Phase Development Workflow

The project follows an incremental workflow:

```text
Select phase
    ↓
Review requirements
    ↓
Implement small change
    ↓
Run functional checks
    ↓
Run security checks
    ↓
Review diff
    ↓
Update documentation
    ↓
Commit
```

---

# 103. Avoid Large Unverified Changes

Implementation should favor:

```text
Small change
    ↓
Test
    ↓
Confirm
    ↓
Continue
```

rather than implementing multiple major subsystems before testing.

This makes debugging and security review easier.

---

# 104. Current Development Status

At the time this document baseline is established:

## Repository

Completed:

```text
Git repository
main branch
develop branch
client/
server/
docs/
.github/workflows/
```

## Frontend

Foundation established:

```text
React
Vite
Tailwind CSS
ESLint
Environment configuration
Initial directory structure
```

Frontend feature implementation is intentionally paused while the backend foundation is completed.

## Backend

Foundation established or being refactored:

```text
Express
Helmet
CORS
cookie-parser
express-rate-limit
Request parsing
Health endpoint
404 handling
Central error handling
Environment configuration
app.js/server.js separation
```

## Not Yet Implemented

```text
MongoDB/Mongoose
Data models
Authentication
Authorization
Project API
Category API
R2 media
Contact API
Turnstile
Portfolio settings
Audit logging
Automated backend tests
CI/CD
Production deployment
```

---

# 105. Immediate Development Sequence

After the documentation baseline is complete, implementation resumes approximately in this order:

```text
1. Verify/refine Express foundation
2. MongoDB Atlas connection
3. Mongoose models
4. Admin authentication
5. Authorization/security middleware
6. Project/category APIs
7. R2 media
8. Contact/Turnstile
9. Settings/audit
10. Backend automated tests
11. Resume frontend
12. Admin frontend
13. CI/CD
14. Deployment
15. Production hardening
```

The sequence may be adjusted when dependencies between features justify it.

---

# 106. Fresh Environment Setup Checklist

For a fresh development machine:

```text
[ ] Install Git
[ ] Install Node.js >= 22
[ ] Clone repository
[ ] Checkout develop
[ ] Install client dependencies
[ ] Install server dependencies
[ ] Create client/.env from client/.env.example
[ ] Create server/.env from server/.env.example
[ ] Add required development configuration
[ ] Start backend
[ ] Verify /api/v1/health
[ ] Start frontend
[ ] Verify frontend loads
[ ] Run frontend lint
[ ] Confirm .env files are ignored
```

MongoDB/R2 steps become required once those integrations are implemented.

---

# 107. Daily Development Checklist

Before work:

```text
[ ] Confirm correct repository
[ ] Confirm correct branch
[ ] Pull relevant changes
[ ] Confirm environment
```

During work:

```text
[ ] Make focused changes
[ ] Check terminal errors
[ ] Test affected functionality
[ ] Test failure cases
```

Before commit:

```text
[ ] Run git status
[ ] Review git diff
[ ] Run relevant lint/tests
[ ] Run build when appropriate
[ ] Remove debug code
[ ] Check for secrets
[ ] Update documentation
[ ] Commit with descriptive message
```

---

# 108. Security Checklist for Local Development

Before pushing changes:

```text
[ ] No .env files staged
[ ] No credentials in source
[ ] No credentials in documentation
[ ] No passwords in logs
[ ] No backend secrets in VITE_ variables
[ ] No temporary wildcard CORS
[ ] No authentication bypass left enabled
[ ] No sensitive debug output
[ ] No production credentials used unnecessarily
```

---

# 109. Related Documentation

Local development should remain aligned with:

```text
docs/requirements.md
docs/architecture.md
docs/database-design.md
docs/api.md
docs/security.md
docs/threat-model.md
docs/testing.md
docs/cloudflare-deployment.md
docs/production-deployment.md
docs/troubleshooting.md
```

When local setup changes, this document should be updated so a fresh development environment can reproduce the project reliably.