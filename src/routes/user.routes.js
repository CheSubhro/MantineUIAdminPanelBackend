
// import { upload } from "../middlewares/multer.middleware.js";

import express from "express";
import {
    getAllUsers,
    updateUser,
    deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// Get all users & Create a new user
router.route("/")
    .get(getAllUsers)

// Update a user & Delete a user by ID
router.route("/:id")
    .put(updateUser)
    .patch(updateUser)
    .delete(deleteUser);

export default router;
