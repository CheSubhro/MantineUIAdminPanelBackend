
Authentication & Authorization Module - Backend Checklist
[x] Database Model Creation (src/models/User.model.js)

Define Mongoose schema including fields: username, email, password (hashed using bcrypt), name, and profile details.

Set up unique constraints and indexes for username and email.

Add a pre-save hook to automatically hash user passwords securely before storing them in MongoDB.

[x] Controller Logic (src/controllers/auth.controller.js)

register: Handle new user registration, check if username/email already exists, hash the password, and save the user.

login: Authenticate users using either their username or email along with the password, and generate a secure JWT (JSON Web Token).

getProfile: Fetch the currently authenticated user's profile details based on token verification.

updateProfile: Handle profile updates (name, email, password changes) for the logged-in user.

deleteAccount: Allow users to delete their account permanently.

logout: Handle logout logic (typically handled client-side by token removal, or server-side token blacklisting if applicable).

[x] Authentication Middleware (src/middlewares/auth.middleware.js)

Create a JWT verification middleware to protect private routes and extract user info (req.user).

[ ] API Routes Configuration (src/routes/auth.routes.js)

Set up endpoints: /api/auth/register, /api/auth/login, /api/auth/profile, /api/auth/update, and /api/auth/delete.

Connect the routes with the authentication controller and protect private routes with the auth middleware.

[ ] Automated Tests & Bruno API Collection

Tests (src/tests/auth.test.js): Write unit and integration tests using Jest and Supertest covering registration, login, profile updates, and token verification.

Bruno API Collection (bruno-collections/auth/*.bru): Prepare collection files for all authentication API requests.