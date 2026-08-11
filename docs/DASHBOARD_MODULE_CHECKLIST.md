
Dashboard Module - Frontend & Hook Checklist
[x] Dashboard State Management Hook (src/hooks/useDashboard.js)

Implement local state initialization for dashboard statistics and metrics (metrics, totalViews, uniqueVisitors, totalPosts, totalUsers).

Set up mock data states for trafficSources, recentPosts, recentUsers, recentActivity, categoriesData, and topPosts.

Integrate time range filtering state (timeRange, setTimeRange) utilizing utility validator function (validateTimeRange).

Implement asynchronous simulation using useEffect and setTimeout to dynamically update metrics based on selected time ranges (7days, 30days, 3months, year) with loading states (loading).

[ ] Dashboard Database & Analytics Aggregation Model (src/models/Dashboard.model.js)

Set up database queries/aggregation pipelines to dynamically calculate total views, unique visitors, post counts, and user stats from MongoDB collections.

Implement error handling and caching strategies for high-frequency dashboard analytics requests.

[ ] Dashboard Controller Logic (src/controllers/dashboard.controller.js)

getDashboardMetrics: Fetch real-time aggregated metrics, traffic insights, recent posts, recent users, and activity logs from the database based on query parameters (e.g., timeRange).

[ ] Dashboard API Routes Configuration (src/routes/dashboard.routes.js)

Set up endpoints: GET /api/dashboard/metrics and GET /api/dashboard/activity.

Protect private dashboard endpoints using the authentication middleware (verifyJWT).

[ ] Automated Tests & Bruno API Collection

Unit Tests (tests/unit/dashboard.controller.test.js): Write unit tests using Jest covering metrics calculation and activity log fetching.

Integration Tests (tests/integration/dashboard.routes.test.js): Write integration tests using Jest and Supertest for dashboard analytics API endpoints.

Bruno API Collection (bruno-collections/dashboard/*.bru): Prepare collection files for dashboard requests.