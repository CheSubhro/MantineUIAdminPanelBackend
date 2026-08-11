
import express from "express";
import {
    getAllUsers,
    updateUser,
    deleteUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Get all users
router.route("/").get(getAllUsers);

// Update a user (with image upload support) & Delete a user by ID
router
    .route("/:id")
    .put(
        upload.fields([
            { name: "avatar", maxCount: 1 },
            { name: "coverImage", maxCount: 1 },
        ]),
        updateUser
    )
    .patch(
        upload.fields([
            { name: "avatar", maxCount: 1 },
            { name: "coverImage", maxCount: 1 },
        ]),
        updateUser
    )
    .delete(deleteUser);

export default router;