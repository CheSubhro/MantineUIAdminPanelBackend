
import express from "express";
import {
    getDashboardMetrics,
    getTrafficOverTime,
    getTrafficSources,
    getPopularPosts,
    getTopCategories,
    getActiveAuthors,
    getRecentActivity,
} from "../controllers/analytics.controller.js";

const router = express.Router();

// Dashboard Metrics Endpoint
router.route("/metrics").get(getDashboardMetrics);

// Traffic Over Time Endpoint
router.route("/traffic").get(getTrafficOverTime);

// Traffic Sources Endpoint
router.route("/sources").get(getTrafficSources);

// Popular Posts Endpoint
router.route("/popular-posts").get(getPopularPosts);

// Top Categories Endpoint
router.route("/categories").get(getTopCategories);

// Active Authors Endpoint
router.route("/authors").get(getActiveAuthors);

// Recent Activity Endpoint
router.route("/activity").get(getRecentActivity);

export default router;