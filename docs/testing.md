# Software Developer Portfolio — Testing Strategy

## 1. Document Purpose

This document defines the testing strategy for the Software Developer Portfolio.

Testing is part of feature implementation rather than a separate activity performed only before deployment.

The strategy covers:

- Manual testing
- Unit testing
- Integration testing
- API testing
- Database testing
- Authentication testing
- Authorization testing
- Security testing
- Project and publication testing
- Media/R2 testing
- Contact and Turnstile testing
- Frontend testing
- End-to-end testing
- Build validation
- CI/CD quality gates
- Production smoke testing
- Regression testing

Some testing infrastructure described here is planned and has not yet been implemented.

---

# 2. Testing Objectives

Testing should provide confidence that:

1. Features behave as required.
2. Invalid input is rejected safely.
3. Unauthorized users cannot access protected resources.
4. Draft content cannot become public accidentally.
5. Database operations preserve data integrity.
6. Media operations preserve R2/database consistency.
7. Security controls work as intended.
8. Frontend behavior matches backend contracts.
9. Production builds succeed.
10. Deployment does not introduce obvious regressions.

---

# 3. Testing Principle

A feature is not considered complete merely because:

```text
The expected request works.
```

It must also be tested against:

```text
Invalid input
Missing input
Unexpected input
Unauthorized access
Forbidden access
Invalid state
Infrastructure failure
Boundary conditions
Security abuse
```

---

# 4. Testing Pyramid

The project should use several levels of testing.

```text
             /\
            /  \
           / E2E\
          /------\
         /Integration\
        /------------\
       /  Unit Tests  \
      /----------------\
```

The project should have:

- Many focused unit tests where valuable
- Strong API/integration coverage
- Fewer high-value end-to-end tests

For this portfolio, backend integration testing is especially important because security and data rules are enforced by the API.

---

# 5. Test Categories

The primary categories are:

```text
Unit
Integration
API
Security
Frontend
End-to-End
Build
Deployment Smoke
```

These categories may overlap.

---

# 6. Unit Testing

Unit tests verify isolated functions or modules.

Potential targets include:

- Slug generation
- Validation helpers
- URL validation
- Pagination parsing
- Safe field mapping
- Publication-state helpers
- Media object-key generation
- Utility functions

Unit tests should not unnecessarily involve external infrastructure.

---

# 7. Integration Testing

Integration tests verify several application layers working together.

Typical backend integration path:

```text
HTTP Request
     ↓
Express
     ↓
Middleware
     ↓
Validator
     ↓
Controller
     ↓
Service
     ↓
Mongoose
     ↓
Test Database
```

These tests are especially valuable for this project.

---

# 8. API Testing

API tests should verify:

- HTTP method
- Route
- Authentication
- Authorization
- Validation
- Response status
- Response shape
- Database side effects
- Failure behavior

API tests should interact with the Express application as a client would.

---

# 9. Testability Architecture

The backend separates:

```text
app.js
```

from:

```text
server.js
```

so automated tests can import the Express application without starting a permanent network listener.

Conceptually:

```javascript
import app from '../app.js'
```

This is one reason the `app.js`/`server.js` separation is part of the architecture.

---

# 10. Test Environment

Automated tests should use:

```env
NODE_ENV=test
```

Test configuration must remain separate from production configuration.

---

# 11. Test Database

Database integration tests shall use a dedicated test database.

Example naming:

```text
software_developer_portfolio_test
```

Automated tests must never point to the production database.

---

# 12. Database Isolation

Tests that modify database state must not depend on data left by previous tests.

Possible strategies include:

- Clear relevant test collections before each test group
- Create known fixtures
- Remove test records after tests

The final strategy will be selected when the testing framework and MongoDB integration are implemented.

---

# 13. Production Database Protection

Automated test startup should include safeguards against accidentally running destructive tests against production.

For example, test initialization should verify:

```text
NODE_ENV === test
```

and that the database URI/database name is explicitly intended for testing.

---

# 14. Test Data

Test data should be deterministic.

Avoid tests that depend on:

- Existing production projects
- Real contact enquiries
- Real administrator accounts
- Current production settings

Tests should create the data they require.

---

# 15. Sensitive Test Data

Tests must not contain real:

- Production passwords
- MongoDB credentials
- R2 secret keys
- Turnstile secrets
- Deployment tokens

Test credentials should be synthetic.

---

# 16. Health Endpoint Testing

Current endpoint:

```http
GET /api/v1/health
```

Test:

```text
Expected status: 200
```

Expected body:

```json
{
  "success": true,
  "message": "Portfolio API is running"
}
```

---

# 17. 404 Testing

Request an unknown route:

```http
GET /api/v1/does-not-exist
```

Expected:

```text
404 Not Found
```

Response:

```json
{
  "success": false,
  "message": "Route not found"
}
```

---

# 18. CORS Testing

Trusted origin:

```text
http://localhost:5173
```

should receive appropriate CORS permission during development.

Untrusted origin:

```text
https://malicious.example
```

should not receive credentialed browser access.

CORS tests should also verify multiple configured trusted origins when introduced.

---

# 19. Security Header Testing

Responses should be inspected for the intended security headers configured through Helmet and any explicit application policies.

Production testing should verify the real deployed headers rather than assuming local configuration behaves identically through every proxy/CDN layer.

---

# 20. Request Size Testing

Normal JSON endpoints should reject requests exceeding the configured body limit.

Current baseline:

```text
100 KB
```

Test cases should include:

```text
Below limit
At/near limit
Above limit
```

Exact boundary behavior depends on parser implementation.

---

# 21. Malformed JSON Testing

Malformed JSON should result in a controlled client error.

It must not:

- Crash the application
- Expose a stack trace in production
- Produce inconsistent server state

---

# 22. Validation Testing

Every write endpoint should test:

```text
Valid request
Missing required field
Wrong data type
Too-short value
Too-long value
Invalid enum
Unexpected field
Malformed identifier
Invalid URL
Invalid email
```

as applicable.

---

# 23. Unknown Field Testing

Sensitive administrative requests should be tested with unexpected fields.

Example:

```json
{
  "title": "Project",
  "isAdministrator": true,
  "passwordHash": "attacker-value"
}
```

Unexpected protected fields must not modify application state.

---

# 24. NoSQL Injection Testing

Test malicious object structures.

Example:

```json
{
  "email": {
    "$ne": null
  },
  "password": "test"
}
```

Expected behavior:

```text
Validation failure
```

The payload must never become an uncontrolled MongoDB authentication query.

---

# 25. Query Injection Testing

Potential malicious query:

```text
?status[$ne]=draft
```

should not allow MongoDB operators to alter application behavior.

Query parameters must be parsed through explicit validation.

---

# 26. Mass Assignment Testing

Example project update:

```json
{
  "title": "Updated Project",
  "createdBy": "ATTACKER_VALUE",
  "updatedBy": "ATTACKER_VALUE"
}
```

Only allowed fields should change.

Protected fields must remain controlled by the server.

---

# 27. ObjectId Testing

For endpoints accepting MongoDB identifiers, test:

```text
Valid ObjectId
Nonexistent valid ObjectId
Malformed ObjectId
Empty identifier
```

Malformed identifiers must not produce unhandled Mongoose errors.

---

# 28. Authentication Test Suite

Authentication tests should cover:

```text
Successful login
Incorrect password
Unknown email
Missing email
Missing password
Malformed email
Non-string email
Non-string password
Disabled administrator
Repeated login attempts
Authenticated /me
Unauthenticated /me
Logout
Post-logout protected request
```

---

# 29. Password Hashing Test

Administrator creation/bootstrap tests should verify that the database stores:

```text
Argon2id hash
```

rather than the plaintext password.

The test must not compare by exposing passwords in logs.

---

# 30. Password Verification Test

Test:

```text
Correct password → authentication succeeds
Incorrect password → authentication fails
```

The implementation should use Argon2 verification rather than manually comparing hash strings.

---

# 31. Authentication Enumeration Test

Test:

```text
Unknown email
```

and:

```text
Known email + wrong password
```

Responses should not unnecessarily reveal account existence.

---

# 32. Login Rate-Limit Testing

The login endpoint should be tested for repeated failed attempts.

Expected result after threshold:

```text
429 Too Many Requests
```

Exact thresholds will be defined during authentication implementation.

Tests should avoid depending unnecessarily on timing where possible.

---

# 33. Authentication Cookie Testing

Login tests should inspect authentication cookies.

Production-oriented tests should verify appropriate attributes:

```text
HttpOnly
Secure
SameSite
Path
Expiration
```

Some attributes may differ between development and production.

---

# 34. HttpOnly Testing

The authentication cookie should include:

```text
HttpOnly
```

This reduces exposure to frontend JavaScript.

---

# 35. Secure Cookie Testing

Production authentication cookies should include:

```text
Secure
```

Development behavior may differ because local HTTP is commonly used.

The environment-specific behavior must be explicitly tested.

---

# 36. Logout Testing

After successful login:

```text
POST /api/v1/auth/logout
```

should invalidate/clear the authentication state.

A subsequent protected request should fail unless the user authenticates again.

---

# 37. Authorization Testing

Every protected administrative endpoint should have at least:

```text
Unauthenticated request
Authenticated authorized request
```

If multiple roles are introduced:

```text
Authenticated unauthorized role
```

must also be tested.

---

# 38. Frontend Authorization Is Not a Test Substitute

Testing that an admin button is hidden does not prove backend authorization.

Tests must call protected API endpoints directly.

---

# 39. CSRF Testing

Once the final cookie/CSRF strategy is implemented, tests should verify:

- Legitimate state-changing request succeeds
- Invalid/missing CSRF protection fails where required
- Untrusted origin behavior
- Cookie behavior

Exact tests depend on the selected strategy.

---

# 40. Project Model Testing

Project model tests should cover:

- Required fields
- Slug uniqueness
- Status enum
- Defaults
- Arrays
- Category reference
- Media references
- Timestamps

---

# 41. Project Creation Testing

Planned endpoint:

```http
POST /api/v1/admin/projects
```

Test:

```text
Authorized valid creation
Unauthenticated creation
Invalid title
Invalid category
Invalid URL
Unexpected field
Duplicate slug
Invalid publication state
```

---

# 42. Project Retrieval Testing

Public:

```http
GET /api/v1/projects
GET /api/v1/projects/:slug
```

Admin:

```http
GET /api/v1/admin/projects
GET /api/v1/admin/projects/:id
```

Public and administrative behavior must be tested separately.

---

# 43. Draft Protection Testing

Create:

```text
Project A → published
Project B → draft
```

Public collection:

```http
GET /api/v1/projects
```

must return Project A but not Project B.

---

# 44. Draft Slug Testing

Request:

```http
GET /api/v1/projects/draft-project
```

Expected:

```text
404
```

or the deliberately selected non-disclosing response.

The response must not reveal:

```text
"This project exists but is a draft."
```

---

# 45. Publication Testing

Test transitions such as:

```text
draft → published
published → draft
```

Publication should verify required content.

Incomplete projects should not become public merely because the client sends:

```json
{
  "status": "published"
}
```

---

# 46. PublishedAt Testing

Tests should verify intended `publishedAt` behavior.

For example:

```text
Never published → null
First publication → date set
Normal edit → publication date not accidentally replaced
```

Final behavior will be confirmed during service implementation.

---

# 47. Project Update Testing

Test:

```text
Valid partial update
Empty update
Protected-field update
Invalid category
Invalid media ID
Invalid URL
Duplicate slug
Malformed project ID
Nonexistent project
```

---

# 48. Project Deletion Testing

Test:

```text
Authorized deletion
Unauthenticated deletion
Invalid ID
Nonexistent project
Project with associated media
```

Deleting a project must not automatically destroy shared media.

---

# 49. Project Sorting Testing

If sorting is exposed:

```text
Valid allowed sort
Invalid sort
Unexpected sort structure
```

Arbitrary MongoDB sorting must not be accepted.

---

# 50. Project Pagination Testing

Test:

```text
Default pagination
page=1
page > available pages
limit=1
maximum allowed limit
limit above maximum
negative page
zero page
non-numeric page
```

---

# 51. Category Testing

Category tests should cover:

```text
Creation
Retrieval
Update
Deletion
Unique slug
Invalid fields
Referenced category deletion
```

---

# 52. Referenced Category Deletion

Given:

```text
Project → Category A
```

attempting to delete Category A should follow the documented deletion policy.

The operation must not silently create invalid project references.

---

# 53. Media Metadata Testing

`MediaAsset` tests should verify:

- Required object key
- MIME type
- Size
- Metadata
- Uploaded-by reference
- Unique storage key where applicable

---

# 54. R2 Integration Testing

R2 tests should cover:

```text
Upload authorization
Successful upload
Metadata confirmation
Invalid upload
Unauthorized upload
Delete media
Referenced media
R2 failure
Database failure
```

---

# 55. R2 Credential Isolation Testing

Frontend bundles and API responses should be checked to ensure they do not expose:

```text
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
```

Permanent R2 secrets must never reach browser code.

---

# 56. Media Type Testing

Test allowed files such as the approved:

```text
image/webp
image/jpeg
image/png
```

where configured.

Test rejected types such as unsupported executables or arbitrary content.

The final allowlist will be established during implementation.

---

# 57. Media Size Testing

Test:

```text
Small valid file
Near maximum
Above maximum
```

Oversized media must be rejected before uncontrolled resource consumption.

---

# 58. Filename Testing

Test filenames containing:

```text
spaces
Unicode
very long names
../
..\
special characters
```

Original filenames must not control R2 object paths.

---

# 59. Media Reference Testing

Given:

```text
Project → MediaAsset
```

attempting to delete the referenced asset should fail safely unless the reference is first removed.

---

# 60. R2 Failure Testing

Simulate or handle cases such as:

```text
R2 unavailable
Invalid credentials
Upload failure
Delete failure
```

Database state must not falsely claim successful operations when infrastructure operations fail.

---

# 61. Contact Endpoint Testing

Planned:

```http
POST /api/v1/contact
```

Test:

```text
Valid submission
Missing name
Invalid email
Missing message
Oversized message
XSS payload
NoSQL-style payload
Missing Turnstile
Invalid Turnstile
Repeated submissions
```

---

# 62. Contact XSS Testing

Example message:

```html
<script>alert('xss')</script>
```

The system may store the string as content if permitted, but the admin frontend must render it safely as text.

No script should execute.

---

# 63. Contact Rate-Limit Testing

Repeated contact submissions should eventually trigger:

```text
429 Too Many Requests
```

according to the dedicated contact limiter.

---

# 64. Turnstile Testing

Tests should cover:

```text
Valid token
Missing token
Invalid token
Failed verification service
```

The backend must perform verification.

Frontend challenge completion alone is not sufficient.

---

# 65. Enquiry Administration Testing

Test:

```text
List enquiries
Retrieve enquiry
Change status
Invalid status
Delete/archive according to policy
Unauthenticated access
```

---

# 66. Portfolio Settings Testing

Test:

```text
Retrieve public settings
Retrieve admin settings
Update settings
Unauthorized update
Invalid social URL
Unexpected fields
CV reference
```

---

# 67. Public Settings Projection Testing

Public settings must not expose:

```text
updatedBy
internal metadata
administrative-only information
secret configuration
```

---

# 68. Audit Log Testing

Administrative actions should produce expected audit records.

Examples:

```text
Login success
Login failure
Project creation
Project update
Project publication
Project deletion
Media deletion
Settings update
```

---

# 69. Audit Secret Testing

Audit metadata must not contain:

```text
password
passwordHash
authentication cookie
session secret
R2 secret
MongoDB URI
Turnstile secret
```

---

# 70. Error Handler Testing

Test known and unknown errors.

Production behavior should return controlled responses.

Unexpected error:

```text
500
```

should not expose:

- Stack trace
- Filesystem path
- Database credentials
- Internal implementation details

---

# 71. Duplicate-Key Testing

Create a duplicate resource such as a project slug.

Raw:

```text
MongoServerError E11000
```

must not be returned to the client.

It should be translated into an appropriate application response such as:

```text
409 Conflict
```

---

# 72. Database Failure Testing

The application should be tested against database failure where practical.

Expected behavior:

- Request fails safely
- Error logged appropriately
- No secret exposure
- Application does not report false success

---

# 73. Startup Failure Testing

When MongoDB becomes required, test startup with:

```text
Invalid MONGODB_URI
Unavailable MongoDB
Missing MONGODB_URI
```

The application should fail clearly rather than start in a misleading ready state.

---

# 74. Graceful Shutdown Testing

Once implemented, verify behavior for:

```text
SIGINT
SIGTERM
```

Expected sequence:

```text
Stop accepting requests
      ↓
Close HTTP server
      ↓
Close MongoDB connection
      ↓
Exit
```

---

# 75. Frontend Testing Objectives

Frontend testing should verify:

- Correct rendering
- Navigation
- API integration
- Loading states
- Error states
- Empty states
- Responsive behavior
- Accessibility
- Admin authentication behavior
- Safe rendering of untrusted content

---

# 76. Frontend Lint Testing

Current baseline:

```powershell
npm run lint
```

inside:

```text
client/
```

Linting must pass before frontend implementation is considered stable.

---

# 77. Frontend Build Testing

Run:

```powershell
npm run build
```

A successful development server does not replace production-build testing.

---

# 78. Frontend Public Project Testing

Eventually verify:

```text
Published project cards render
Draft projects do not render
Project links use slug
Project detail loads
Missing project shows appropriate state
Images load
External links are safe
```

---

# 79. Frontend Empty-State Testing

The interface should remain usable when:

```text
No projects
No featured projects
No categories
No enquiries
No media
```

Administrative pages should provide useful empty states rather than crash.

---

# 80. Frontend API Failure Testing

Simulate:

```text
API unavailable
500 response
404 response
401 response
403 response
Network timeout/failure
```

The frontend should display controlled states.

---

# 81. Admin Authentication Frontend Testing

Test:

```text
Successful login
Failed login
Refresh while authenticated
Authentication expiration
Logout
Attempt to open admin page unauthenticated
```

The frontend should respond correctly while recognizing that backend authorization remains authoritative.

---

# 82. Safe Admin Rendering

Contact messages and other untrusted values must be tested with HTML/script-like content.

The admin dashboard must not execute submitted markup.

---

# 83. Responsive Testing

Public and administrative pages should be tested at representative widths for:

```text
Mobile
Tablet
Desktop
Large desktop
```

Exact device models are less important than ensuring layouts adapt correctly.

---

# 84. Browser Testing

At minimum, production functionality should be tested in current mainstream browsers relevant to expected users.

Primary development may use Chromium-based browsers, but browser-specific assumptions should be avoided.

---

# 85. Accessibility Testing

Testing should include:

- Keyboard navigation
- Visible focus
- Semantic headings
- Form labels
- Alternative image text
- Sufficient contrast
- Error identification
- Accessible interactive controls

Automated tools can help but do not replace manual accessibility checks.

---

# 86. SEO Testing

Public pages should eventually verify:

- Unique page titles
- Meta descriptions
- Canonical behavior where required
- Open Graph metadata where implemented
- Crawlable public routes
- Correct project slugs

Draft content must not become indexable through public endpoints.

---

# 87. Performance Testing

Performance checks should consider:

- JavaScript bundle size
- Image size
- API response time
- Database query efficiency
- Number of frontend requests
- Cache behavior

Performance optimization should be based on observed bottlenecks rather than speculation.

---

# 88. Image Performance Testing

Project images should be checked for:

- Appropriate dimensions
- Appropriate formats
- Lazy loading where useful
- Avoiding unnecessarily large transfers
- Correct R2/CDN delivery

---

# 89. End-to-End Testing

End-to-end tests should cover a small number of high-value user journeys.

Potential public journey:

```text
Open portfolio
     ↓
View projects
     ↓
Open case study
     ↓
View project links
     ↓
Submit contact form
```

Potential admin journey:

```text
Login
  ↓
Create draft project
  ↓
Upload/select media
  ↓
Publish
  ↓
Verify public project
  ↓
Edit
  ↓
Logout
```

---

# 90. E2E Scope

E2E testing should not duplicate every validation test.

Integration/API tests are better suited for exhaustive failure cases.

E2E should focus on critical complete workflows.

---

# 91. Manual Testing

Manual testing remains useful for:

- Visual design
- Responsive behavior
- Browser behavior
- Accessibility
- Admin usability
- Upload workflows
- Deployment verification

Manual testing should supplement automated coverage rather than replace it.

---

# 92. Manual API Testing

During implementation, API endpoints may be tested using:

```text
curl.exe
PowerShell Invoke-RestMethod
API client tools
Automated integration tests
```

Automated tests should become the primary regression mechanism once endpoints stabilize.

---

# 93. Current Health Test

Run backend:

```powershell
cd server
npm run dev
```

Then:

```powershell
curl.exe -i http://localhost:5000/api/v1/health
```

Expected:

```text
HTTP 200
```

and:

```json
{
  "success": true,
  "message": "Portfolio API is running"
}
```

---

# 94. Current 404 Test

Run:

```powershell
curl.exe -i http://localhost:5000/api/v1/test
```

Expected:

```text
HTTP 404
```

and:

```json
{
  "success": false,
  "message": "Route not found"
}
```

---

# 95. Current Trusted-Origin Test

Run:

```powershell
curl.exe -i `
  -H "Origin: http://localhost:5173" `
  http://localhost:5000/api/v1/health
```

Verify appropriate CORS headers.

---

# 96. Current Untrusted-Origin Test

Run:

```powershell
curl.exe -i `
  -H "Origin: https://malicious.example" `
  http://localhost:5000/api/v1/health
```

Verify the origin is not granted trusted credentialed browser access.

---

# 97. Regression Testing

Whenever a bug is fixed:

```text
Reproduce bug
     ↓
Create test where practical
     ↓
Apply fix
     ↓
Verify test passes
```

This reduces the chance that the same defect returns later.

---

# 98. Test Naming

Test names should describe observable behavior.

Prefer:

```text
returns 404 when a public project is still a draft
```

over:

```text
project test 3
```

Tests should communicate the requirement they protect.

---

# 99. Test Independence

Tests should not depend on execution order.

Unsafe:

```text
Test 2 requires Test 1 to create its data
```

Prefer each test or test suite to establish the state it requires.

---

# 100. Test Cleanup

Tests creating persistent data should clean up or use isolated/reset state.

Failed tests should not leave the test environment unpredictably contaminated.

---

# 101. External Service Testing

Tests involving external services such as:

```text
Cloudflare R2
Turnstile
```

should distinguish between:

- Unit/mock testing
- Integration testing
- Real environment verification

Automated test suites should not unnecessarily depend on production external services.

---

# 102. Mocking

Mocking is useful for testing failure conditions and isolating external systems.

However, excessive mocking can create tests that pass even when real integration is broken.

Important external integrations should also receive real integration verification in a controlled environment.

---

# 103. Test Coverage

Code coverage may be measured later.

Coverage percentage is not itself the primary objective.

A high percentage does not guarantee that critical security behavior is tested.

Priority should be given to:

```text
Authentication
Authorization
Publication
Validation
Database integrity
Media authorization
Contact abuse protection
Error handling
```

---

# 104. Security Regression Suite

A dedicated group of tests should protect important security properties.

Examples:

```text
No public admin registration
No unauthenticated admin API access
No draft disclosure
No passwordHash in responses
No NoSQL operator authentication bypass
No mass assignment
No unsupported upload
No referenced media deletion
No secret exposure in production errors
```

---

# 105. API Contract Regression

When frontend development resumes, backend changes should not unexpectedly alter:

- Field names
- Response structure
- Status codes
- Authentication behavior

API tests should protect the documented contract.

---

# 106. CI Testing

Future CI should automatically run relevant checks after repository changes.

Potential sequence:

```text
Checkout
   ↓
Install dependencies
   ↓
Lint
   ↓
Automated tests
   ↓
Security/dependency checks
   ↓
Production build
```

---

# 107. Backend CI Checks

Potential backend checks:

```text
Install dependencies
Run tests
Dependency audit
Static/lint checks when configured
```

The exact backend lint/test tooling will be selected during implementation.

---

# 108. Frontend CI Checks

Expected frontend checks include:

```powershell
npm run lint
npm run build
```

Automated frontend tests will be added when implemented.

---

# 109. Deployment Quality Gate

Production deployment should not proceed when critical checks fail.

Examples:

```text
Build failure
Authentication test failure
Authorization test failure
Draft-protection failure
Critical security regression
```

---

# 110. Dependency Audit in CI

Dependency auditing may be included in CI.

Findings should be assessed based on:

- Severity
- Exploitability
- Runtime exposure
- Dependency path

Automated dependency fixes should not introduce unreviewed breaking changes.

---

# 111. Pre-Commit Testing

Before committing a focused change:

```text
Run affected tests
Run lint where relevant
Review diff
```

Full suites may be reserved for larger checkpoints depending on execution time.

---

# 112. Pre-Push Testing

Before pushing significant changes:

```text
Relevant automated tests
Frontend lint
Frontend build where affected
Security checks for affected feature
```

should pass.

---

# 113. Pre-Deployment Testing

Before production deployment:

```text
[ ] Client lint passes
[ ] Client build passes
[ ] Backend tests pass
[ ] API integration tests pass
[ ] Authentication tests pass
[ ] Authorization tests pass
[ ] Security regression tests pass
[ ] Database configuration verified
[ ] R2 integration verified
[ ] Contact/Turnstile verified
[ ] Production environment validated
```

as applicable to the implemented feature set.

---

# 114. Production Smoke Testing

Immediately after deployment, perform a focused smoke test.

Public:

```text
[ ] Homepage loads
[ ] Projects load
[ ] Project detail loads
[ ] Images load
[ ] CV works
[ ] Contact works
```

Admin:

```text
[ ] Login works
[ ] Dashboard loads
[ ] Protected API works
[ ] Project management works
[ ] Logout works
```

Infrastructure:

```text
[ ] Health endpoint works
[ ] MongoDB connectivity works
[ ] R2 delivery works
[ ] HTTPS works
[ ] CORS works
```

---

# 115. Production Security Smoke Test

Verify:

```text
[ ] Draft project unavailable publicly
[ ] Admin API rejects unauthenticated request
[ ] Production errors do not expose stack traces
[ ] Cookies have intended production attributes
[ ] Untrusted CORS origin not allowed
[ ] Security headers present
```

---

# 116. Rollback Testing

Deployment documentation should eventually define how to return to a known-good release.

Rollback procedures are only useful if they are realistic and understood before an incident.

---

# 117. Test Failure Handling

When a test fails:

1. Do not immediately change the test.
2. Determine whether implementation or expectation is wrong.
3. Compare against requirements.
4. Check relevant documentation.
5. Fix the correct layer.
6. Run related regression tests.

Tests should not be weakened merely to make the suite green.

---

# 118. Flaky Tests

Tests that fail unpredictably reduce confidence.

Common causes include:

- Timing assumptions
- Shared state
- External network dependencies
- Uncontrolled dates
- Improper cleanup

Flaky tests should be fixed rather than routinely rerun until they pass.

---

# 119. Test Documentation

Complex security or integration tests should contain enough context to explain the requirement they protect.

Test code should remain maintainable rather than becoming an undocumented parallel application.

---

# 120. Phase Completion Criteria

A development phase is complete when applicable:

```text
[ ] Requirements implemented
[ ] Success path tested
[ ] Validation tested
[ ] Failure paths tested
[ ] Authentication tested
[ ] Authorization tested
[ ] Security abuse cases tested
[ ] Relevant lint passes
[ ] Relevant build passes
[ ] Documentation updated
[ ] No known critical regression remains
```

---

# 121. Database Phase Completion

MongoDB/Mongoose integration should not be considered complete until:

```text
[ ] Connection succeeds
[ ] Invalid connection fails safely
[ ] Test database isolated
[ ] Models validate correctly
[ ] Unique indexes verified
[ ] Database errors translated safely
[ ] Production secrets protected
```

---

# 122. Authentication Phase Completion

Authentication should not be considered complete until:

```text
[ ] Admin bootstrap works
[ ] Password stored using Argon2id
[ ] Correct login works
[ ] Wrong login fails
[ ] Enumeration minimized
[ ] Login rate limiting works
[ ] Cookie security verified
[ ] /me works
[ ] Logout works
[ ] Protected API rejects unauthenticated requests
[ ] CSRF strategy tested
[ ] Audit events verified
```

---

# 123. Project API Phase Completion

Project APIs should not be considered complete until:

```text
[ ] CRUD behavior works
[ ] Validation works
[ ] Authorization works
[ ] Slug uniqueness works
[ ] Draft protection works
[ ] Publication rules work
[ ] Pagination works
[ ] Filtering works
[ ] Sorting is controlled
[ ] Mass assignment blocked
[ ] Invalid ObjectIds handled
```

---

# 124. Media Phase Completion

R2/media functionality should not be considered complete until:

```text
[ ] Upload authorization protected
[ ] File size enforced
[ ] File type enforced
[ ] Object keys controlled
[ ] Metadata stored correctly
[ ] Unauthorized uploads fail
[ ] Referenced deletion fails safely
[ ] R2 failures handled
[ ] Permanent secrets absent from frontend
[ ] Audit events generated
```

---

# 125. Contact Phase Completion

Contact functionality should not be considered complete until:

```text
[ ] Valid submission works
[ ] Validation works
[ ] Rate limiting works
[ ] Turnstile works
[ ] Oversized input rejected
[ ] XSS payload rendered safely
[ ] Enquiries protected from public access
[ ] Admin status updates work
```

---

# 126. Frontend Phase Completion

Frontend features should not be considered complete until:

```text
[ ] Required UI works
[ ] Loading states work
[ ] Error states work
[ ] Empty states work
[ ] Responsive layout checked
[ ] Accessibility checked
[ ] API integration verified
[ ] Lint passes
[ ] Production build passes
```

---

# 127. Current Testing Status

## Currently Available

The current project foundation can manually verify:

```text
Backend startup
GET /api/v1/health
404 behavior
Trusted CORS origin
Untrusted CORS origin
Frontend startup
Tailwind integration
Frontend linting
Frontend production build
```

---

## Not Yet Implemented

The following testing infrastructure remains planned:

```text
Backend automated test framework
MongoDB test database
API integration suite
Authentication tests
Authorization tests
Project API tests
Category tests
R2 tests
Contact tests
Turnstile tests
Settings tests
Audit tests
Frontend automated tests
End-to-end tests
CI test pipeline
Production smoke-test automation
```

The exact testing libraries will be selected when automated testing implementation begins.

---

# 128. Testing Implementation Order

A practical implementation sequence is:

```text
1. Select backend test runner
2. Add Express integration testing
3. Automate health/404 tests
4. Add MongoDB test isolation
5. Add model tests
6. Add authentication tests
7. Add authorization tests
8. Add project/category API tests
9. Add security regression tests
10. Add media/R2 tests
11. Add contact/Turnstile tests
12. Add settings/audit tests
13. Add frontend tests where valuable
14. Add critical E2E journeys
15. Integrate tests into CI
```

---

# 129. Testing Philosophy

The project prioritizes tests that protect important behavior.

The highest-value areas are:

```text
Security boundaries
Authentication
Authorization
Publication state
Data integrity
Validation
External service boundaries
Critical user journeys
```

Tests should increase confidence in real behavior rather than exist solely to increase a coverage percentage.

---

# 130. Related Documentation

Testing must remain aligned with:

```text
docs/requirements.md
docs/architecture.md
docs/database-design.md
docs/api.md
docs/security.md
docs/threat-model.md
docs/local-development.md
docs/cloudflare-deployment.md
docs/production-deployment.md
docs/troubleshooting.md
```

When requirements, APIs, security controls, or infrastructure change, the relevant tests and this testing strategy should be reviewed.