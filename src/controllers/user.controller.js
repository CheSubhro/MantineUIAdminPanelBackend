
import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import HttpStatus from "../utils/HttpStatus.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Get All Users (with Search & Filter by name, email, or role)
export const getAllUsers = asyncHandler(async (req, res) => {
    const { search, role, status } = req.query;
    let query = {};

    if (search) {
        const searchRegex = new RegExp(search, "i");
        query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    if (role && role !== "All") {
        query.role = role;
    }

    if (status && status !== "All") {
        query.status = status;
    }

    const users = await User.find(query)
        .select("-password")
        .sort({ createdAt: -1 });

    return res
        .status(HttpStatus.OK || 200)
        .json(
            new ApiResponse(
                HttpStatus.OK || 200,
                users,
                "Users fetched successfully.",
                { count: users.length }
            )
        );
});

// Create User (Registration, password hashing, and input validation)
export const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, status } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(
            HttpStatus.BAD_REQUEST || 400,
            "Email is already in use."
        );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "User",
        status: status || "Active",
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res
        .status(HttpStatus.CREATED || 201)
        .json(
            new ApiResponse(
                HttpStatus.CREATED || 201,
                userResponse,
                "User created successfully."
            )
        );
});

// Update User Details (name, email, role, status, or password)
export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.password) {
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(
            updateData.password,
            saltRounds
        );
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
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
                "User updated successfully."
            )
        );
});

// Delete Single User by ID
export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
        throw new ApiError(HttpStatus.NOT_FOUND || 404, "User not found.");
    }

    return res
        .status(HttpStatus.OK || 200)
        .json(
            new ApiResponse(
                HttpStatus.OK || 200,
                null,
                "User deleted successfully."
            )
        );
});