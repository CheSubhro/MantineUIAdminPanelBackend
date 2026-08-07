
import Post from "../models/post.model.js";
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
} from "../config/cloudinary.js";

// Get All Posts (Search, Status, & Category Filter)
export const getAllPosts = async (req, res) => {
    try {
        const { search, status, category } = req.query;
        let query = {};

        // Search Query Handling
        if (search) {
            const searchRegex = new RegExp(search, "i");
            query.$or = [
                { title: searchRegex },
                { slug: searchRegex },
                { author: searchRegex },
                { category: searchRegex },
            ];
        }

        // Status Filter Handling
        if (status && status !== "All") {
            query.status = status;
        }

        // Category Filter Handling
        if (category && category !== "All") {
            query.category = category;
        }

        const posts = await Post.find(query).sort({ updatedAt: -1 });
        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create New Post (Image Upload)
export const createPost = async (req, res) => {
    try {
        const {
            title,
            slug,
            excerpt,
            content,
            category,
            author,
            status,
            publishDate,
        } = req.body;

        let imageUrl = "";
        if (req.file) {
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
            if (cloudinaryResponse) {
                imageUrl = cloudinaryResponse.secure_url;
            }
        }

        const currentDate = new Date().toISOString().split("T")[0];

        const newPost = await Post.create({
            title,
            slug,
            excerpt,
            content,
            category: category || "Technology",
            author: author || "Subhro Mondal",
            status: status || "Published",
            publishDate: publishDate || currentDate,
            image: imageUrl,
            updatedAt: currentDate,
        });

        res.status(201).json({
            success: true,
            message: "New blog post added successfully.",
            data: newPost,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Slug must be unique. This slug already exists.",
            });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update Post
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;

       const existingPost = await Post.findById(id);
        if (!existingPost) {
            return res
                .status(404)
                .json({ success: false, message: "Blog post not found." });
        }

        let updateData = {
            ...req.body,
            updatedAt: new Date().toISOString().split("T")[0],
        };

        if (req.file) {
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
            if (cloudinaryResponse) {
                if (existingPost.image) {
                    await deleteFromCloudinary(existingPost.image);
                }
                updateData.image = cloudinaryResponse.secure_url;
            }
        }

        const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: "Blog post details updated successfully.",
            data: updatedPost,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete Single Post
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res
                .status(404)
                .json({ success: false, message: "Blog post not found." });
        }

        if (deletedPost.image) {
            await deleteFromCloudinary(deletedPost.image);
        }

        res.status(200).json({
            success: true,
            message: "Blog post has been removed successfully.",
            data: { id },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Bulk Delete Posts (Cloudinary Image Delete)
export const bulkDeletePosts = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No post IDs provided for bulk deletion.",
            });
        }

        const postsToDelete = await Post.find({ _id: { $in: ids } });

        const result = await Post.deleteMany({ _id: { $in: ids } });

        for (const post of postsToDelete) {
            if (post.image) {
                await deleteFromCloudinary(post.image);
            }
        }

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} blog posts have been removed successfully.`,
            data: { deletedIds: ids },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};