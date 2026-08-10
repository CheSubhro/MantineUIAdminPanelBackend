
import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import HttpStatus from "../utils/HttpStatus.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateTokens } from "../utils/generateToken.js";

// Register Handler
export const register = asyncHandler(async (req, res) => {
    const { name, username, email, password } = req.body;

    // Check if user already exists by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        throw new ApiError(
            HttpStatus.BAD_REQUEST || 400,
            "User with this email or username already exists."
        );
    }

    // Password hashing is handled by the pre-save hook in User model
    const newUser = await User.create({
        name,
        username,
        email,
        password,
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res
        .status(HttpStatus.CREATED || 201)
        .json(
            new ApiResponse(
                HttpStatus.CREATED || 201,
                userResponse,
                "Registration successful. Please login with your credentials."
            )
        );
});

// Login Handler (Supports identifier as either username or email)
export const login = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body; // identifier can be username or email

    if (!identifier || !password) {
        throw new ApiError(
            HttpStatus.BAD_REQUEST || 400,
            "Please provide username/email and password."
        );
    }

    // Find user by username or email
    const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
        throw new ApiError(
            HttpStatus.UNAUTHORIZED || 401,
            "Invalid username/email or password."
        );
    }

    // Check password match
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new ApiError(
            HttpStatus.UNAUTHORIZED || 401,
            "Invalid username/email or password."
        );
    }

    // Generate Access & Refresh Tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    const userResponse = user.toObject();
    delete userResponse.password;

    return res
        .status(HttpStatus.OK || 200)
        .json(
            new ApiResponse(
                HttpStatus.OK || 200,
                { user: userResponse, accessToken, refreshToken },
                "Login successful."
            )
        );
});

// Get Current User Profile
export const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
        throw new ApiError(HttpStatus.NOT_FOUND || 404, "User not found.");
    }

    return res
        .status(HttpStatus.OK || 200)
        .json(
            new ApiResponse(
                HttpStatus.OK || 200,
                user,
                "Profile fetched successfully."
            )
        );
});

// Update Profile Handler
export const updateProfile = asyncHandler(async (req, res) => {
    const updateData = { ...req.body };

    // Prevent direct role update through user profile update if needed
    delete updateData.role;
    delete updateData.status;

    if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
        new: true,
        runValidators: true,
    }).select("-password");

    if (!updatedUser) {
        throw new ApiError(HttpStatus.NOT_FOUND || 404, "User not found.");
    }

    return res
        .status(HttpStatus.OK || 200)
        .json(
            new ApiResponse(
                HttpStatus.OK || 200,
                updatedUser,
                "Profile updated successfully."
            )
        );
});

// Delete Account Handler
export const deleteAccount = asyncHandler(async (req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.user.id);

    if (!deletedUser) {
        throw new ApiError(HttpStatus.NOT_FOUND || 404, "User not found.");
    }

    return res
        .status(HttpStatus.OK || 200)
        .json(
            new ApiResponse(
                HttpStatus.OK || 200,
                null,
                "Account deleted successfully."
            )
        );
});

// Logout Handler (Client-side handles token removal; server can clear cookies if used)
export const logout = asyncHandler(async (req, res) => {
    return res
        .status(HttpStatus.OK || 200)
        .json(
            new ApiResponse(
                HttpStatus.OK || 200,
                null,
                "Logged out successfully."
            )
        );
});