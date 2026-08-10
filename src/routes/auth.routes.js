
import { Router } from "express";
import {
    register,
    login,
    getProfile,
    updateProfile,
    deleteAccount,
    logout,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ==================== Public Routes ====================
router.post("/register", register);
router.post("/login", login);

// ==================== Private / Protected Routes ====================
// (Protected with verifyJWT middleware)
router.get("/profile", verifyJWT, getProfile);
router.put("/update", verifyJWT, updateProfile); // Alternatively, you can use PATCH
router.delete("/delete", verifyJWT, deleteAccount);
router.post("/logout", verifyJWT, logout);

export default router;