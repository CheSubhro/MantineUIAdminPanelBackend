
Category Module Implementation Checklist
1. Database Model Layer (src/models/Category.model.js)
[ ] Define Mongoose Schema for Category.

[ ] name: String (Required, Trim, Unique)

[ ] slug: String (Required, Unique, Lowercase, Indexed)

[ ] description: String (Trim)

[ ] image: String (Image URL)

[ ] imagePublicId: String (Cloudinary Public ID for deletion management)

[ ] status: Enum ['Active', 'Inactive'] (Default: 'Active')

[ ] postCount: Number (Default: 0)

[ ] Enable timestamps: true (createdAt, updatedAt).

2. Controller Layer (src/controllers/category.controller.js)
[ ] Wrap controllers with asyncHandler.

[ ] getAllCategories:

[ ] Implement search support (name or slug).

[ ] Implement status filtering (Active, Inactive, All).

[ ] Sort by recent updates (updatedAt: -1).

[ ] createCategory:

[ ] Handle image upload via Cloudinary (uploadOnCloudinary).

[ ] Handle duplicate slug errors (MongoDB Error code 11000).

[ ] Set default post count to 0.

[ ] updateCategory:

[ ] Find existing category by ID.

[ ] Handle new image replacement (upload new, delete old from Cloudinary).

[ ] Support partial updates (runValidators: true).

[ ] deleteCategory:

[ ] Find and delete single category by ID.

[ ] Clean up associated Cloudinary image if exists.

[ ] bulkDeleteCategories:

[ ] Validate array of IDs.

[ ] Delete multiple documents using deleteMany.

[ ] Clean up images from Cloudinary in bulk.

3. API Routes Configuration (src/routes/category.routes.js)
[ ] Set up Express Router.

[ ] Configure endpoints:

[ ] GET /api/categories (Fetch all with filters)

[ ] POST /api/categories (Create category with image upload middleware)

[ ] PUT /api/categories/:id (Update category)

[ ] DELETE /api/categories/:id (Delete single category)

[ ] DELETE /api/categories/bulk (Bulk delete categories)

[ ] Secure routes with authentication and role-based access control (RBAC) middleware where applicable.

4. Testing & API Collections
[ ] Unit Tests (tests/unit/category.controller.test.js):

[ ] Test category creation success and error flows (mocking Model and Cloudinary).

[ ] Test status filters and fetch logic.

[ ] Integration Tests (tests/integration/category.routes.test.js):

[ ] Test HTTP endpoints using Supertest.

[ ] Bruno API Collection (bruno-collections/categories/*.bru):

[ ] Get All Categories

[ ] Create Category

[ ] Update Category

[ ] Delete Category