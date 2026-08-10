
User Management Module - Backend Checklist
[ ] Database Model Creation (src/models/User.model.js)

Define Mongoose schema including fields: name, email, password (hashed with bcrypt), role (enum: ['Admin', 'Manager', 'User'], etc.), and status (enum: ['Active', 'Inactive']).

Set up unique constraints and indexing on the email field.

[ ] Controller Logic (src/controllers/user.controller.js)

getAllUsers: Retrieve all users with search query support (filtering by name, email, or role).

createUser: Handle new user registration/addition, password hashing, and input validation.

updateUser: Update existing user details (name, email, role, status, or password).

deleteUser: Single user deletion by ID.

[ ] API Routes Configuration (src/routes/user.routes.js)

Set up /api/users endpoints (GET, POST, PUT/PATCH, DELETE) and connect them securely with the user controller methods.

Apply authentication and role-based access control (RBAC) middleware (e.g., admin-only access for user creation/deletion).

[ ] Automated Tests & Bruno API Collection

Tests (src/tests/user.test.js): Write unit and integration tests using Jest and Supertest covering all user CRUD endpoints.

Bruno API Collection (bruno-collections/users/*.bru): Prepare collection files for the user management API endpoints.