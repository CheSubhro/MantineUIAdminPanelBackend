
// import { asyncHandler } from '../utils/AsyncHandler.js'
// import { ApiError } from '../utils/ApiError.js'
// import HttpStatus from '../utils/HttpStatus.js'
// import { ApiResponse } from '../utils/ApiResponse.js'
// import { uploadOnCloudinary }  from '../utils/Cloudinary.js'
// import { lowercase } from '../utils/StringUtils.js'


import User from "../models/User.model.js";
import bcrypt from "bcrypt";

// Get All Users (with Search & Filter by name, email, or role)
export const getAllUsers = async (req, res) => {
    try {
        const { search, role, status } = req.query;
        let query = {};

        if (search) {
            const searchRegex = new RegExp(search, "i");
            query.$or = [
                { name: searchRegex },
                { email: searchRegex },
            ];
        }

        if (role && role !== "All") {
            query.role = role;
        }

        if (status && status !== "All") {
            query.status = status;
        }

        const users = await User.find(query).select("-password").sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create User (Registration, password hashing, and input validation)
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role, status } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email is already in use." });
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

        res.status(201).json({
            success: true,
            message: "User created successfully.",
            data: userResponse,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update User Details (name, email, role, status, or password)
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        if (updateData.password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(updateData.password, saltRounds);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully.",
            data: updatedUser,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete Single User by ID
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};






