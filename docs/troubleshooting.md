# Software Developer Portfolio — Troubleshooting Guide

## 1. Document Purpose

This document provides a systematic troubleshooting guide for the Software Developer Portfolio.

It covers common problems involving:

- Development environment
- Node.js and npm
- React/Vite
- Tailwind CSS
- Environment variables
- Express
- Ports
- API routing
- CORS
- MongoDB Atlas
- Mongoose
- Authentication
- Cookies
- CSRF
- Rate limiting
- Cloudflare R2
- Cloudflare Turnstile
- Cloudflare frontend deployment
- Git/GitHub
- CI/CD
- Production deployment
- Security configuration

Some sections describe functionality that is planned but not yet implemented.

---

# 2. Troubleshooting Principle

Do not immediately modify code when something fails.

Use:

```text
Observe
   ↓
Reproduce
   ↓
Identify affected layer
   ↓
Inspect error
   ↓
Test smallest component
   ↓
Determine root cause
   ↓
Apply focused fix
   ↓
Retest
```

Avoid changing multiple unrelated components simultaneously.

---

# 3. Identify the Layer

Before debugging, determine whether the problem is primarily:

```text
Browser
Frontend
Network
CORS
Backend
Authentication
Database
R2
Turnstile
Cloudflare
Deployment
Git
```

This significantly reduces the search space.

---

# 4. Check Current Git State

Before making troubleshooting changes:

```powershell
git status
```

This shows whether existing uncommitted changes may be contributing to the problem.

For detailed changes:

```powershell
git diff
```

Do not discard changes until they are understood.

---

# 5. Check Node.js Version

Run:

```powershell
node --version
```

Project requirement:

```text
Node.js >= 22
```

If an incompatible version is being used, dependency or runtime behavior may differ.

---

# 6. Check npm Version

Run:

```powershell
npm --version
```

If `npm` is unavailable while Node.js is installed, review the Node.js installation.

---

# 7. `node` Is Not Recognized

Example:

```text
'node' is not recognized as an internal or external command
```

Possible causes:

- Node.js not installed
- PATH not updated
- Terminal opened before Node installation

Check:

```powershell
where.exe node
```

If necessary, reinstall Node.js and restart the terminal.

---

# 8. `npm` Is Not Recognized

Run:

```powershell
where.exe npm
```

If unavailable, verify the Node.js installation and system PATH.

---

# 9. Dependency Installation Failure

If:

```powershell
npm install
```

fails:

1. Read the first meaningful error.
2. Confirm Node version.
3. Confirm network connectivity.
4. Confirm `package.json` is valid.
5. Review package compatibility.
6. Avoid immediately deleting lockfiles.

---

# 10. Clean Dependency Reinstallation

If `node_modules` appears corrupted:

```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

Do not delete:

```text
package-lock.json
```

as the first troubleshooting action.

---

# 11. Why Keep `package-lock.json`

The lockfile provides deterministic dependency resolution.

Deleting it can unexpectedly upgrade dependency versions and introduce unrelated problems.

Only regenerate it deliberately.

---

# 12. Wrong Working Directory

Many npm errors occur because commands are executed from the wrong directory.

Check:

```powershell
Get-Location
```

For frontend commands:

```text
software-developer-portfolio/client
```

For backend commands:

```text
software-developer-portfolio/server
```

Root scripts may also be executed from:

```text
software-developer-portfolio
```

where defined.

---

# 13. Frontend Will Not Start

From:

```text
client/
```

run:

```powershell
npm run dev
```

If it fails:

1. Read terminal error.
2. Verify dependencies.
3. Verify `package.json`.
4. Verify `vite.config.js`.
5. Verify environment configuration.
6. Verify Node version.

---

# 14. Vite Shows Blank Page

Check:

1. Browser developer console.
2. Vite terminal.
3. `src/main.jsx`.
4. `src/App.jsx`.
5. Import paths.
6. Runtime environment errors.

A JavaScript exception during startup can produce a blank application.

---

# 15. Browser Console

Open browser developer tools and inspect:

```text
Console
```

Look for:

- JavaScript errors
- Failed imports
- Undefined environment variables
- React errors
- CORS errors
- Network failures

The first error is often more useful than later cascading errors.

---

# 16. Browser Network Panel

Use:

```text
Developer Tools → Network
```

Inspect:

- Request URL
- HTTP method
- Status
- Request headers
- Response headers
- Response body
- Cookies
- CORS behavior

This is essential when frontend/API communication fails.

---

# 17. Tailwind Styles Not Working

Verify:

```text
client/src/index.css
```

contains:

```css
@import "tailwindcss";
```

Verify:

```text
client/vite.config.js
```

includes the Tailwind Vite plugin.

Then restart:

```powershell
npm run dev
```

---

# 18. Tailwind Works Partially

If some classes work and others do not:

1. Check spelling.
2. Check generated class names.
3. Avoid constructing unsupported dynamic class names.
4. Check CSS precedence.
5. Inspect the element in browser developer tools.

---

# 19. Vite Environment Variable Missing

If:

```text
VITE_API_BASE_URL is not configured.
```

check:

```text
client/.env
```

Expected local value:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Restart Vite after modifying `.env`.

---

# 20. Vite Environment Changes Not Updating

Stop:

```text
Ctrl+C
```

then restart:

```powershell
npm run dev
```

Environment values are loaded when the development process starts.

---

# 21. Secret Accidentally Added to `VITE_*`

Assume any value exposed through the frontend build may have become public.

If a real secret was used:

1. Remove it.
2. Rotate the credential.
3. Check Git history.
4. Check deployed builds.
5. Replace with server-side configuration.

Simply deleting the line does not make an exposed credential safe again.

---

# 22. Frontend Cannot Reach API

Check frontend:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Then verify backend directly:

```powershell
curl.exe -i http://localhost:5000/api/v1/health
```

If health fails, troubleshoot the backend before the frontend.

---

# 23. Frontend API URL Contains Duplicate `/api/v1`

Incorrect combination may produce:

```text
/api/v1/api/v1/projects
```

Choose one consistent pattern.

Current design:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Frontend services should append:

```text
/projects
```

rather than:

```text
/api/v1/projects
```

again.

---

# 24. Frontend Route Returns 404 During Development

Verify React Router configuration.

If navigation inside the application works but direct URL entry fails only after production deployment, the problem is likely the hosting SPA fallback rather than React itself.

---

# 25. Frontend Lint Failure

Run:

```powershell
npm run lint
```

Read the specific:

- File
- Line
- Rule

Fix the cause rather than globally disabling the ESLint rule unless the rule is genuinely inappropriate.

---

# 26. Frontend Build Failure

Run:

```powershell
npm run build
```

Typical causes:

- Invalid imports
- Missing environment configuration
- Syntax errors
- Case-sensitive path mismatch
- Package incompatibility

Production builds may expose issues not seen during development.

---

# 27. Backend Will Not Start

From:

```text
server/
```

run:

```powershell
npm run dev
```

Check:

- Terminal error
- Environment variables
- Import paths
- Port conflicts
- Node version
- Package installation

---

# 28. `nodemon` Not Found

Run:

```powershell
npm install
```

inside:

```text
server/
```

Nodemon is a development dependency.

If missing from `package.json`:

```powershell
npm install -D nodemon
```

---

# 29. Backend Starts Then Immediately Stops

Read the startup error.

Likely causes include:

```text
Missing environment variable
Invalid configuration
Database connection failure
Import error
Port conflict
```

Do not hide startup failures with generic catch blocks.

---

# 30. Environment Variable Missing

Example:

```text
Missing required environment variable: CLIENT_URLS
```

Check:

```text
server/.env
```

Expected:

```env
CLIENT_URLS=http://localhost:5173
```

---

# 31. `.env` Exists but Variables Are Missing

Possible cause:

Environment validation executes before dotenv initialization.

Centralized environment configuration should load:

```javascript
import 'dotenv/config'
```

before accessing:

```javascript
process.env
```

This is especially important with ES module import evaluation.

---

# 32. Environment Variable Typo

These are different:

```text
CLIENT_URL
CLIENT_URLS
```

The approved architecture uses:

```text
CLIENT_URLS
```

because multiple trusted frontend origins are supported.

---

# 33. Environment Variable Contains Extra Spaces

Example:

```env
CLIENT_URLS=http://localhost:5173, https://example.com
```

The parser should trim configured origins.

If troubleshooting CORS, inspect the actual parsed origin list.

---

# 34. `.env` Accidentally Tracked by Git

Check:

```powershell
git status
```

and:

```powershell
git check-ignore server/.env
```

If already tracked, `.gitignore` alone does not remove it from Git history.

Stop and review whether secrets were exposed.

Rotate exposed credentials when necessary.

---

# 35. Backend Port Already in Use

Error may resemble:

```text
EADDRINUSE
```

for:

```text
5000
```

Check:

```powershell
netstat -ano | findstr :5000
```

Identify process:

```powershell
tasklist | findstr <PID>
```

Terminate it only if safe.

---

# 36. Stop a Known Windows Process

If the PID is confirmed to be an unwanted development process:

```powershell
taskkill /PID <PID> /F
```

Do not terminate unknown system processes blindly.

---

# 37. Vite Port Changed

Vite may choose:

```text
5174
```

if:

```text
5173
```

is unavailable.

If so, backend CORS may still allow only:

```text
http://localhost:5173
```

Update development:

```env
CLIENT_URLS=http://localhost:5174
```

or resolve the port conflict.

---

# 38. Health Endpoint Does Not Work

Test:

```powershell
curl.exe -i http://localhost:5000/api/v1/health
```

If connection is refused:

```text
Backend is not listening.
```

If 404:

```text
Routing configuration may be wrong.
```

If 500:

```text
Application middleware/configuration may be failing.
```

---

# 39. Health Endpoint Expected Response

Expected:

```json
{
  "success": true,
  "message": "Portfolio API is running"
}
```

with:

```text
HTTP 200
```

---

# 40. Unknown API Route Does Not Return 404

Test:

```powershell
curl.exe -i http://localhost:5000/api/v1/test
```

Expected:

```json
{
  "success": false,
  "message": "Route not found"
}
```

Ensure the 404 middleware executes after application routes.

---

# 41. Error Handler Not Running

Express error middleware must have four parameters:

```javascript
function errorHandler(err, req, res, next) {
  // ...
}
```

It must also be registered after routes and relevant middleware.

---

# 42. CORS Error

Browser message may indicate:

```text
blocked by CORS policy
```

Check:

1. Actual frontend origin.
2. `CLIENT_URLS`.
3. Backend restart.
4. Request credentials.
5. Response headers.
6. Whether backend itself is failing.

---

# 43. Test Trusted CORS Origin

Run:

```powershell
curl.exe -i `
  -H "Origin: http://localhost:5173" `
  http://localhost:5000/api/v1/health
```

Inspect:

```text
Access-Control-Allow-Origin
```

---

# 44. Test Untrusted CORS Origin

Run:

```powershell
curl.exe -i `
  -H "Origin: https://malicious.example" `
  http://localhost:5000/api/v1/health
```

The origin must not receive trusted credentialed browser access.

---

# 45. Do Not Fix CORS With `*`

Do not change credentialed CORS to:

```text
*
```

simply because the browser reports an error.

Find the actual trusted frontend origin.

---

# 46. CORS Works in curl but Not Browser

Inspect whether the browser sends:

```text
OPTIONS
```

preflight.

Check:

- Allowed methods
- Allowed headers
- Credentials
- Exact origin
- Cookie configuration

---

# 47. CORS Error May Hide Backend Error

A failed backend response may appear to the browser as a CORS problem if appropriate CORS headers are missing from the error path.

Check backend terminal logs and call the API directly.

---

# 48. Request Body Too Large

If Express rejects a request because of:

```text
100kb
```

body limit, determine whether:

- Request is unexpectedly large
- Endpoint legitimately requires a larger JSON payload

Do not globally increase the limit merely to support media uploads.

Media should use the R2 upload architecture.

---

# 49. JSON Parse Error

Malformed JSON should return a controlled client error.

Check the actual request payload in the browser/network/API client.

Valid JSON requires:

```json
{
  "title": "Example"
}
```

not JavaScript object syntax.

---

# 50. API Returns HTML Instead of JSON

Possible causes:

- Wrong hostname
- Frontend server receiving API request
- Hosting fallback intercepting route
- Proxy misconfiguration

Inspect:

```text
Request URL
Content-Type
Response body
```

---

# 51. API Returns 401

`401 Unauthorized` normally means:

```text
Authentication is missing or invalid.
```

Check:

- Login state
- Cookie
- Cookie expiration
- `credentials` setting
- Authentication middleware

---

# 52. API Returns 403

`403 Forbidden` normally means:

```text
Identity known/request understood,
but operation not permitted.
```

Possible causes:

- Authorization failure
- CORS rejection
- CSRF protection
- Account disabled

Inspect the controlled response and backend logs.

---

# 53. API Returns 404

Possible causes:

- Incorrect route
- Incorrect API version
- Invalid identifier
- Resource does not exist
- Draft resource intentionally hidden

For public draft projects, 404 may be intentional.

---

# 54. API Returns 409

`409 Conflict` may indicate:

- Duplicate project slug
- Duplicate category
- Resource state conflict

Check whether the request conflicts with a unique index or business rule.

---

# 55. API Returns 429

`429 Too Many Requests` indicates a rate limit was reached.

Determine which limiter applies:

```text
General API
Login
Contact
Media
```

Do not simply disable the limiter during troubleshooting.

---

# 56. API Returns 500

Check backend logs.

Potential causes:

- Programming error
- Database failure
- R2 failure
- Unexpected data
- Missing environment configuration

Production responses intentionally hide internal details.

---

# 57. MongoDB Connection Fails

When MongoDB integration is implemented, check:

```text
MONGODB_URI
Atlas database user
Password
Network access
Database hostname
Internet connection
```

---

# 58. MongoDB Authentication Failed

Possible causes:

- Incorrect username
- Incorrect password
- Wrong connection string
- Password not URL-encoded
- Incorrect database permissions

Do not print the complete production URI while troubleshooting.

---

# 59. MongoDB Password Special Characters

Connection strings may require special characters in credentials to be URL-encoded.

Prefer obtaining/copying the connection format recommended by Atlas and handling credentials carefully.

---

# 60. MongoDB Network Error

Check Atlas:

```text
Network Access
```

Confirm the backend's current network is allowed.

For local development, a changed public IP may require updating Atlas network access.

---

# 61. Do Not Default to `0.0.0.0/0`

Allowing all IP addresses may make troubleshooting easier but increases exposure.

Use the narrowest practical network configuration, especially in production.

---

# 62. Mongoose Model Error

Common causes:

- Wrong schema field type
- Required field missing
- Invalid ObjectId
- Duplicate unique value
- Enum violation

Translate expected database errors into controlled API responses.

---

# 63. Mongoose CastError

Example:

```text
Cast to ObjectId failed
```

Validate identifiers before database operations.

Malformed IDs should normally become a controlled:

```text
400
```

rather than an internal server error.

---

# 64. MongoDB Duplicate Key Error

Raw error may resemble:

```text
E11000 duplicate key
```

Likely cause:

```text
Duplicate slug
Duplicate unique email
Duplicate category
```

Translate into an application response such as:

```text
409 Conflict
```

where appropriate.

---

# 65. MongoDB Works Locally but Not Production

Check:

- Production `MONGODB_URI`
- Production Atlas network access
- Backend environment secrets
- DNS/network connectivity
- Backend logs

Do not assume local Atlas access rules apply to the production backend.

---

# 66. Backend Starts Before MongoDB Connects

Target production sequence is:

```text
Connect database
      ↓
Start HTTP server
```

If the API starts first, health checks may report availability while required infrastructure is unavailable.

---

# 67. Admin Login Fails

Once authentication is implemented, check:

1. Administrator exists.
2. Administrator is active.
3. Email normalization.
4. Password verification.
5. Argon2id hash.
6. Authentication configuration.
7. Rate limiter.

Do not log plaintext passwords.

---

# 68. Admin Account Does Not Exist

There is no public registration route.

Use the approved administrator bootstrap process.

Do not temporarily add public registration just to create an administrator.

---

# 69. Password Appears in Database

This is a critical implementation problem.

Database should store:

```text
passwordHash
```

using Argon2id.

If plaintext passwords were stored:

1. Stop using affected credentials.
2. Correct implementation.
3. Replace affected credentials.
4. Review logs/backups as appropriate.

---

# 70. Login Works but Cookie Missing

Inspect:

```text
Browser → Developer Tools → Network
```

Check the login response:

```text
Set-Cookie
```

Then inspect browser cookie storage.

Possible causes:

- Cookie attributes
- CORS credentials
- Cross-site restrictions
- HTTP/HTTPS mismatch

---

# 71. Frontend Must Send Credentials

For cookie-authenticated cross-origin requests, frontend requests may require:

```javascript
credentials: 'include'
```

depending on the API client and topology.

Without it, authentication cookies may not be sent.

---

# 72. Cookie Works Locally but Not Production

Review:

```text
Secure
SameSite
Domain
Path
HTTPS
Frontend/API relationship
```

Production cookie behavior must be tested using actual production hostnames.

---

# 73. `Secure` Cookie Missing Locally

A production-secure cookie may not behave over local plain HTTP.

Development and production cookie configuration may differ deliberately.

Do not weaken production cookie settings to solve a local HTTP limitation.

---

# 74. Cookie Not Sent Cross-Site

Check:

- `SameSite`
- `Secure`
- Browser restrictions
- CORS
- `credentials: include`
- Actual site relationship

Do not assume two different domains are same-site merely because both belong to the project.

---

# 75. Logout Does Not Work

Verify:

- Cookie name matches login cookie
- Clear-cookie attributes match original cookie
- Path matches
- Domain matches where used
- Server authentication state invalidated if applicable

A cookie may fail to clear when deletion attributes differ from creation attributes.

---

# 76. `/auth/me` Returns 401 After Login

Check whether the cookie was:

1. Created
2. Stored
3. Sent with `/auth/me`
4. Accepted by backend

Use the network panel to trace each step.

---

# 77. Admin Page Accessible Without Login

Determine whether:

```text
Frontend route is visible
```

or:

```text
Protected API data is accessible
```

The second is the security boundary.

Backend administrative APIs must reject unauthenticated requests regardless of frontend routing.

---

# 78. Draft Project Appears Publicly

This is a high-priority security/integrity issue.

Check public project query.

It must explicitly enforce:

```text
status = published
```

Do not rely on frontend filtering.

---

# 79. Draft Slug Returns Project

Public project-by-slug service must query using both:

```text
slug
status = published
```

or equivalent backend logic.

A draft should not be exposed merely because its slug is known.

---

# 80. Mass Assignment Problem

If a client can modify fields such as:

```text
createdBy
passwordHash
role
uploadedBy
```

the update implementation is too permissive.

Use explicit field allowlists and validated DTOs.

---

# 81. NoSQL Injection Suspicion

If object input reaches MongoDB queries unexpectedly:

```json
{
  "email": {
    "$ne": null
  }
}
```

the validator is not strict enough.

Require the expected primitive type before constructing database queries.

---

# 82. Contact Form Does Not Submit

Check:

1. Browser console.
2. Network request.
3. API URL.
4. Validation response.
5. Turnstile.
6. Rate limiter.
7. Backend logs.
8. Database connection.

---

# 83. Contact Form Returns 400

Inspect the validation response.

Possible causes:

- Missing name
- Invalid email
- Message too short
- Message too long
- Missing Turnstile token

Do not bypass validation without understanding the requirement.

---

# 84. Contact Form Returns 429

Contact-specific rate limiting may have triggered.

Check:

- Number of requests
- IP/proxy detection
- Production proxy configuration

Do not disable spam controls as the default fix.

---

# 85. Contact Message Contains HTML

Treat contact content as untrusted.

Admin dashboard should render:

```text
<script>alert(1)</script>
```

as text.

If it executes, stop and fix rendering before production use.

---

# 86. Turnstile Widget Does Not Load

Check:

- Site key
- Allowed hostname
- Frontend integration
- Browser console
- Content Security Policy
- Network blockers

---

# 87. Turnstile Verification Fails

Check backend:

```text
TURNSTILE_SECRET_KEY
```

Then inspect:

- Token present
- Token freshness
- Siteverify response
- Network access

Do not log the secret.

---

# 88. Turnstile Token Rejected After Delay

Turnstile tokens are temporary.

Obtain a fresh token rather than reusing an old token.

---

# 89. Turnstile Works in Frontend but API Accepts Missing Token

This is a security bug.

Turnstile enforcement must occur server-side.

The API should reject protected submissions without valid verification.

---

# 90. R2 Upload Fails

Once implemented, inspect:

- Admin authentication
- Upload authorization request
- Presigned URL
- R2 CORS
- Object key
- Content type
- Expiration
- File size

---

# 91. R2 Returns 403

Possible causes:

```text
Invalid credentials
Insufficient permissions
Expired presigned URL
Incorrect signature
Wrong object/bucket
CORS-related browser restriction
```

Inspect both browser response and backend logs.

---

# 92. R2 Upload Works in API Tool but Not Browser

Likely areas:

```text
R2 CORS
Browser preflight
Request headers
Presigned URL header mismatch
```

A successful non-browser request does not prove browser CORS is correct.

---

# 93. R2 CORS Problem

Verify bucket CORS includes the actual trusted frontend origin.

Check required:

```text
Methods
Headers
Origins
```

Avoid broad configuration merely to eliminate an error.

---

# 94. R2 Presigned URL Expired

Request a new upload authorization.

Do not increase expiration excessively as the first solution.

Short-lived authorization is intentional.

---

# 95. R2 Upload Says Signature Mismatch

Possible causes:

- Request method differs from signed method
- Signed headers differ
- Content type differs
- URL expired
- Object key changed

The browser request must match what was authorized.

---

# 96. R2 Object Uploaded but Missing From Admin Dashboard

Check:

```text
R2 upload succeeded
       ↓
Confirmation API succeeded?
       ↓
MediaAsset stored in MongoDB?
```

R2 object storage and MongoDB metadata are separate operations.

---

# 97. MongoDB Media Record Exists but R2 Object Missing

This represents inconsistent state.

Possible causes:

- Upload failure
- Manual R2 deletion
- Confirmation logic bug

The media service should detect and handle such inconsistencies.

---

# 98. Cannot Delete Media

Check whether the media is referenced by:

```text
Project
CV
Settings
```

Reference protection may intentionally reject deletion.

Remove/reassign references first when appropriate.

---

# 99. Image Upload Works but Image Does Not Display

Check:

- Object exists
- Delivery URL
- Public-read architecture
- MIME type
- CORS where relevant
- Browser network status
- CSP

---

# 100. Wrong Image Cached

If an object was replaced using the same URL, Cloudflare/browser caching may still serve an older version.

Prefer versioned/unique object keys when replacing media.

---

# 101. CV Download Fails

Check:

- Settings CV reference
- MediaAsset exists
- R2 object exists
- Public delivery URL
- MIME type
- Access policy

---

# 102. Cloudflare Frontend Deployment Fails

Check:

1. Production build succeeds locally.
2. Cloudflare configuration.
3. Build output path.
4. Deployment authentication.
5. Account/project configuration.
6. Current Cloudflare deployment documentation.

Do not assume old Wrangler examples remain correct indefinitely.

---

# 103. Cloudflare Deployment Authentication Failure

Check:

- API token exists
- Token has required permissions
- Correct account
- Token has not expired/revoked
- CI secret correctly configured

Do not print the token.

---

# 104. Cloudflare Site Loads but Assets 404

Check:

- Build output directory
- Worker static-assets configuration
- Generated asset paths
- Vite base configuration if customized

Inspect the browser network panel.

---

# 105. Cloudflare Root Works but Nested Route 404s

Example:

```text
/                         works
/projects/example         fails
```

This usually indicates SPA fallback/routing configuration.

Cloudflare must serve the SPA entry for appropriate client-side routes.

---

# 106. React Navigation Works but Browser Refresh Fails

This is another sign of missing SPA fallback.

Client-side navigation never reaches the server for route resolution, while browser refresh does.

---

# 107. Cloudflare Frontend Cannot Reach Backend

Check:

```text
VITE_API_BASE_URL
Backend hostname
HTTPS
CORS
Backend availability
```

Test the backend independently.

---

# 108. Production CORS Failure After Domain Change

When moving to a custom domain, update:

```env
CLIENT_URLS=
```

to include the new exact frontend origin.

Restart/redeploy backend after changing environment configuration.

---

# 109. Production Works on Temporary Domain but Not Custom Domain

Check:

```text
DNS
HTTPS
CORS
Turnstile hostname
Cookie policy
Canonical configuration
```

A domain change affects more than DNS.

---

# 110. DNS Does Not Resolve

Check:

- Domain nameservers
- Cloudflare DNS records
- Record hostname
- DNS propagation
- Typographical errors

Use DNS diagnostic tools where appropriate.

---

# 111. HTTPS Certificate Problem

Check:

- DNS points to intended service
- Domain is correctly attached
- Cloudflare SSL/TLS configuration
- Certificate provisioning status

Do not bypass browser certificate warnings for production administration.

---

# 112. Production API Shows Mixed-Content Error

Frontend is likely HTTPS while API URL is HTTP.

Change production:

```env
VITE_API_BASE_URL=https://...
```

and rebuild/redeploy frontend.

---

# 113. Production Cookie Not Set

Check:

```text
HTTPS
Secure
SameSite
Domain
CORS
credentials
```

Use the browser's network and cookie panels rather than guessing.

---

# 114. All Users Hit the Same Rate Limit

Likely cause:

Incorrect proxy/IP configuration.

Check:

```text
trust proxy
X-Forwarded-For
hosting proxy architecture
```

The application may be treating the proxy IP as every client's IP.

---

# 115. Rate Limit Easily Bypassed by Header

If manually changing:

```text
X-Forwarded-For
```

changes client identity unexpectedly, proxy trust may be too permissive.

Review Express `trust proxy`.

---

# 116. Production Shows Development Error Details

Check:

```env
NODE_ENV=production
```

and centralized error middleware.

Do not expose stack traces publicly.

---

# 117. Production Health Works but Application Endpoints Fail

Health may only verify process liveness.

Check:

```text
MongoDB
Authentication
R2
External services
```

A future readiness endpoint may provide better infrastructure status without exposing sensitive details.

---

# 118. Production Build Uses Wrong API URL

Remember:

```text
VITE_*
```

values are generally embedded at frontend build time.

Changing the environment after the build may not alter an already-built bundle.

Rebuild/redeploy with the correct production value.

---

# 119. Old Frontend Appears After Deployment

Possible causes:

- Browser cache
- Cloudflare cache
- Deployment did not update
- Wrong deployment environment/domain

Check deployment version and network responses before clearing caches indiscriminately.

---

# 120. API Changed but Frontend Still Uses Old Contract

Compare:

```text
docs/api.md
```

with:

- Backend response
- Frontend service
- Deployed versions

Frontend and backend may be on incompatible releases.

---

# 121. Git Push Fails

Check:

```powershell
git remote -v
```

Confirm repository URL and authentication.

Then:

```powershell
git status
```

and:

```powershell
git branch
```

---

# 122. `Repository not found`

Possible causes:

- Incorrect repository URL
- Wrong GitHub account
- Repository does not exist
- Missing access permission

Verify:

```powershell
git remote -v
```

Do not repeatedly retry incorrect credentials.

---

# 123. Wrong GitHub Account

If authentication is associated with another GitHub account, correct the Git authentication/account configuration before pushing.

Confirm repository ownership and access.

---

# 124. Wrong Branch

Check:

```powershell
git branch
```

Expected routine development branch:

```text
develop
```

Production-ready integration eventually moves through:

```text
main
```

according to the Git workflow.

---

# 125. Push Rejected Because Remote Has Changes

Do not force-push immediately.

Inspect:

```powershell
git fetch
git status
```

and compare history.

Integrate remote changes safely.

---

# 126. Merge Conflict

Git marks conflict sections.

Resolve deliberately by comparing both versions.

After resolution:

```powershell
git add <resolved-files>
```

then complete the merge/rebase process.

Do not blindly select one entire side when both contain needed changes.

---

# 127. Accidentally Modified Many Files

Run:

```powershell
git status
git diff
```

Possible causes:

- Formatter
- Line-ending changes
- Dependency changes
- Generated files

Do not commit the changes until their cause is understood.

---

# 128. Secret Accidentally Committed

Treat the credential as exposed.

Immediate response:

```text
Revoke/rotate secret
      ↓
Remove from current source
      ↓
Assess Git history
      ↓
Review where repository was pushed
      ↓
Replace with environment secret
```

Deleting the current file alone is insufficient.

---

# 129. CI Fails but Local Works

Compare:

```text
Node version
Environment variables
Operating system behavior
Case sensitivity
Install command
Build command
```

CI commonly exposes filename-case mistakes hidden on Windows.

---

# 130. Import Works on Windows but Fails in Linux CI

Example:

```javascript
import ProjectCard from './projectcard.jsx'
```

while file is:

```text
ProjectCard.jsx
```

Windows filesystems are often case-insensitive.

Linux production/CI environments are commonly case-sensitive.

Match filename case exactly.

---

# 131. CI Cannot Access Secret

Check:

- Secret name
- Workflow environment
- Repository/environment permissions
- Pull-request restrictions

Do not replace missing CI secrets by hardcoding credentials.

---

# 132. CI Deployment Permission Denied

Review:

- GitHub workflow permissions
- Cloudflare token permissions
- Backend deployment token
- Environment approval rules

Apply least privilege rather than broad administrator access.

---

# 133. Dependency Vulnerability Report

Run:

```powershell
npm audit
```

Assess:

```text
Severity
Affected dependency
Runtime exposure
Available fix
Breaking changes
```

Do not blindly use:

```powershell
npm audit fix --force
```

without reviewing dependency changes.

---

# 134. npm Cache Issue

npm's cache stores downloaded package data used to speed future installations.

Inspect:

```powershell
npm cache verify
```

Clearing the cache should not be the first response to ordinary application errors.

---

# 135. Clear npm Cache Only When Justified

If cache corruption is genuinely suspected:

```powershell
npm cache clean --force
```

Then reinstall dependencies.

This is a troubleshooting measure, not routine maintenance.

---

# 136. Browser Shows Stale JavaScript

Check:

- Hard refresh
- DevTools Network cache behavior
- Cloudflare cache
- Correct deployment version

Avoid assuming the new source was actually deployed.

---

# 137. CSP Blocks Resource

Browser console may report:

```text
Refused to load...
because it violates Content Security Policy
```

Identify the required resource.

Update CSP narrowly if the resource is legitimate.

Do not replace CSP with an unrestricted policy.

---

# 138. Turnstile Blocked by CSP

CSP must allow the Cloudflare resources required by the actual Turnstile integration.

Verify against current Cloudflare guidance when implementing production CSP.

---

# 139. R2 Media Blocked by CSP

Add only the actual trusted media origin to the appropriate CSP directive.

Do not permit arbitrary remote media unnecessarily.

---

# 140. Security Header Conflict

If headers are configured at multiple layers:

```text
Cloudflare
Worker
Express
```

they may conflict.

Inspect the final browser-visible response headers.

The effective response is more important than assumptions about individual configuration files.

---

# 141. Admin API Response Cached

Sensitive responses should not be publicly cached.

Inspect:

```text
Cache-Control
Cloudflare cache status
```

Administrative/authentication responses may require:

```text
no-store
```

or equivalent appropriate behavior.

---

# 142. Draft Project Cached Publicly

Treat this as a security incident.

Actions:

1. Remove public access.
2. Purge relevant cache where necessary.
3. Fix backend publication enforcement.
4. Verify all draft routes.
5. Add regression test.

---

# 143. Project Slug Conflict

If a project cannot be created because the slug already exists:

- Choose another slug
- Or deliberately update the existing project

Do not remove the unique index merely to permit duplicates.

---

# 144. Project URL Rejected

Check URL protocol.

Allowed external project URLs should normally use:

```text
https://
```

and possibly controlled `http://` only where explicitly permitted.

Reject:

```text
javascript:
data:
```

for ordinary external project links.

---

# 145. Project Cannot Be Published

Check required publication fields.

Possible missing data:

```text
Title
Slug
Description
Case study
Category
Cover media
```

depending on final publication rules.

Publication is a business operation, not merely a status-field edit.

---

# 146. Project Published but Missing Publicly

Check:

1. Database `status`.
2. Public query.
3. Slug.
4. API response.
5. Frontend filters.
6. Cache.

Start with the public API before debugging the React UI.

---

# 147. Project Appears in API but Not Frontend

Inspect browser network response.

If API returns the project, check:

```text
Frontend service
State handling
Filtering
Rendering
React key
Component errors
```

---

# 148. Image Exists but Project Does Not Render It

Check:

```text
MediaAsset reference
Derived media URL
R2 object
alt text
frontend field mapping
```

---

# 149. Admin Update Succeeds but Page Shows Old Data

If the application intentionally avoids optimistic updates, ensure it refetches authoritative server state after mutation.

Check:

```text
Mutation succeeds
      ↓
Refetch
      ↓
UI receives new server data
```

---

# 150. Audit Log Missing

Check whether the administrative service successfully emitted the expected audit event.

Audit logging should normally be implemented at a layer that cannot easily be bypassed by alternate controllers.

---

# 151. Audit Log Contains Secret

Stop logging that field.

Review whether sensitive values were written to:

- Production logs
- Database audit records
- External monitoring

Rotate exposed credentials where necessary.

---

# 152. High Number of 500 Errors

Investigate:

```text
Common endpoint
Common stack trace
Database state
Recent deployment
External service failures
```

Do not merely restart repeatedly without determining the underlying failure.

---

# 153. High Number of 401 Errors

Possible causes:

- Expired sessions
- Cookie deployment issue
- Frontend stopped sending credentials
- Authentication secret changed
- Automated attack traffic

Correlate with deployment changes and audit/security logs.

---

# 154. High Number of 403 Errors

Potential causes:

- Authorization bug
- CORS configuration
- CSRF failure
- Disabled account
- Attack traffic

Identify which middleware generated the response.

---

# 155. High Number of 429 Errors

Potential causes:

- Bot activity
- Legitimate traffic exceeding thresholds
- Incorrect proxy IP detection
- Too-low rate limit

Check client IP behavior before increasing thresholds.

---

# 156. High Contact Spam Despite Turnstile

Turnstile is one control.

Review:

```text
Turnstile verification
Contact rate limit
Validation
Traffic patterns
Repeated content
```

Additional abuse controls may be introduced based on observed behavior.

---

# 157. Site Suddenly Unavailable

Check in this order:

```text
DNS
   ↓
Cloudflare frontend
   ↓
Backend health
   ↓
Database
   ↓
External services
```

This helps identify the failing layer quickly.

---

# 158. Frontend Available but Projects Missing

Test public API directly.

If API fails:

```text
Backend/database issue
```

If API works:

```text
Frontend integration issue
```

---

# 159. Frontend and API Work but Images Missing

Focus on:

```text
R2
Media delivery hostname
Object existence
CSP
Cache
```

rather than MongoDB application logic alone.

---

# 160. Backend Health Fails

Inspect backend host:

- Process state
- Deployment logs
- Environment
- Startup error
- MongoDB connectivity

If necessary, roll back to the last known-good release.

---

# 161. Database Unavailable

Avoid destructive emergency changes.

Check:

- Atlas service status
- Network access
- Credentials
- Backend network
- Connection logs

The application should fail safely.

---

# 162. R2 Unavailable

Public pages should ideally degrade as gracefully as practical.

Do not corrupt MongoDB metadata merely because a temporary storage request fails.

---

# 163. Rollback Required

If a new deployment introduces a severe regression:

```text
Stop rollout
    ↓
Restore previous known-good version
    ↓
Verify health
    ↓
Verify critical functionality
    ↓
Investigate failed release
```

Do not debug a severe outage indefinitely while a safe rollback exists.

---

# 164. Rollback Does Not Fix Problem

The issue may involve:

```text
Database changes
Environment changes
DNS
R2
External provider
```

rather than application code.

Compare infrastructure changes made during the deployment.

---

# 165. Troubleshooting Security Rule

Never solve a functional problem by permanently disabling:

```text
Authentication
Authorization
Validation
CORS restrictions
CSRF protection
Rate limiting
Security headers
TLS
```

Security controls may be temporarily isolated during local diagnosis only when the effect is understood and the unsafe change cannot reach production.

---

# 166. Troubleshooting Data Rule

Before destructive database operations:

1. Confirm environment.
2. Confirm database.
3. Confirm collection.
4. Confirm query.
5. Consider backup/recovery.

Never assume a terminal is connected to development data.

---

# 167. Troubleshooting Production Rule

Do not make undocumented direct production changes.

Fixes should flow through:

```text
Source
   ↓
Git
   ↓
Test
   ↓
Deploy
```

whenever operationally possible.

---

# 168. Information to Collect Before Asking for Help

For frontend issues:

```text
Exact error
Browser console
Network request
Relevant component
Relevant service
Environment variable names without secrets
Recent changes
```

For backend issues:

```text
Exact terminal error
HTTP method
Route
Status code
Response body
Relevant controller/service
Relevant middleware
Recent changes
```

For deployment issues:

```text
Deployment stage
Build output
Runtime logs
Environment names
Hostname
HTTP status
Recent infrastructure change
```

---

# 169. Do Not Share Secrets During Troubleshooting

Before sharing logs or screenshots, remove:

```text
Passwords
MongoDB URI
R2 secret
Session/authentication secret
Turnstile secret
Cloudflare API token
GitHub token
Authentication cookies
```

---

# 170. Useful Development Commands

Repository:

```powershell
git status
git diff
git branch
git remote -v
```

Frontend:

```powershell
cd client
npm install
npm run dev
npm run lint
npm run build
```

Backend:

```powershell
cd server
npm install
npm run dev
```

API:

```powershell
curl.exe -i http://localhost:5000/api/v1/health
```

Ports:

```powershell
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

---

# 171. Diagnostic Order — Frontend Problem

Use:

```text
Browser console
      ↓
Browser network
      ↓
Frontend environment
      ↓
Frontend service
      ↓
API
```

Do not begin by changing backend code when the frontend never sent a request.

---

# 172. Diagnostic Order — API Problem

Use:

```text
HTTP request
      ↓
Route
      ↓
Middleware
      ↓
Validator
      ↓
Controller
      ↓
Service
      ↓
Database/external service
```

This follows the application architecture.

---

# 173. Diagnostic Order — Authentication Problem

Use:

```text
Login request
      ↓
Credentials validated
      ↓
Authentication state issued
      ↓
Cookie stored
      ↓
Cookie sent
      ↓
Backend verifies
      ↓
Authorization succeeds
```

Determine exactly where the chain breaks.

---

# 174. Diagnostic Order — Media Problem

Use:

```text
Admin authenticated
      ↓
Upload authorization
      ↓
Presigned URL
      ↓
R2 upload
      ↓
Upload confirmation
      ↓
MongoDB MediaAsset
      ↓
Project reference
      ↓
Public delivery
```

---

# 175. Diagnostic Order — Contact Problem

Use:

```text
Form validation
      ↓
Turnstile token
      ↓
API request
      ↓
Rate limiter
      ↓
Server validation
      ↓
Turnstile Siteverify
      ↓
MongoDB save
      ↓
Response
```

---

# 176. Diagnostic Order — Production Outage

Use:

```text
DNS
  ↓
Cloudflare
  ↓
Frontend
  ↓
API health
  ↓
MongoDB
  ↓
R2/External services
```

---

# 177. When to Add a Regression Test

When a defect affects:

```text
Authentication
Authorization
Draft protection
Validation
Database integrity
Media integrity
Contact security
API contract
```

add an automated regression test where practical.

A fixed bug without a regression test may return later.

---

# 178. When to Update Documentation

Update documentation when troubleshooting reveals that:

- Architecture differs from docs
- Environment configuration changed
- Deployment behavior changed
- New recurring problem exists
- Security assumption was incorrect
- New operational procedure is required

---

# 179. Current Troubleshooting Status

At the time this baseline is written, troubleshooting can directly cover:

```text
Node/npm
React/Vite
Tailwind
Frontend environment
Express startup
Backend environment
Health endpoint
404 handling
CORS
Ports
Git
```

The following sections document planned systems and become operational when those systems are implemented:

```text
MongoDB/Mongoose
Authentication
Authorization
CSRF
R2
Turnstile
CI/CD
Production deployment
Monitoring
```

---

# 180. Troubleshooting Completion Principle

A troubleshooting session should end with more than:

```text
It works now.
```

Where practical, determine:

```text
What failed?
Why did it fail?
What fixed it?
Could it happen again?
Should a test prevent recurrence?
Should documentation change?
```

This turns individual fixes into improvements to the overall system.

---

# 181. Related Documentation

Troubleshooting must remain aligned with:

```text
docs/requirements.md
docs/architecture.md
docs/database-design.md
docs/api.md
docs/security.md
docs/threat-model.md
docs/local-development.md
docs/testing.md
docs/cloudflare-deployment.md
docs/production-deployment.md
```

When implementation or deployment changes, this troubleshooting guide should be updated to reflect the real system.+