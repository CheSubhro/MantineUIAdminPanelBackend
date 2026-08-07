
import express from "express";
import {
    getAllPosts,
    createPost,
    updatePost,
    deletePost,
    bulkDeletePosts,
} from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Get all posts & Create a new post 
router.route("/").get(getAllPosts).post(upload.single("image"), createPost);

// Bulk delete posts 
router.route("/bulk").delete(bulkDeletePosts);

// Update & Delete single post
router.route("/:id").put(upload.single("image"), updatePost).delete(deletePost);

export default router;