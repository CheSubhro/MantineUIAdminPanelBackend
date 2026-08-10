
import express from "express";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    bulkDeleteCategories,
} from "../controllers/category.controller.js";
import { upload } from "../middlewares/multer.middleware.js"; 

const router = express.Router();

// Get All Categories & Create New Category (with image upload)
router
    .route("/")
    .get(getAllCategories)
    .post(upload.single("image"), createCategory);

// Bulk Delete Categories (Note: Keep this before /:id to prevent routing collision)
router.route("/bulk").delete(bulkDeleteCategories);

// Update Category & Delete Single Category by ID
router
    .route("/:id")
    .put(upload.single("image"), updateCategory)
    .patch(upload.single("image"), updateCategory)
    .delete(deleteCategory);

export default router;