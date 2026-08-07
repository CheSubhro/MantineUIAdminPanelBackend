
import Post from "../models/post.model.js";
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
} from "../utils/Cloudinary.js";

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
        let imagePublicId = "";

        if (req.file) {
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
            if (cloudinaryResponse) {
                imageUrl = cloudinaryResponse.secure_url;
                imagePublicId = cloudinaryResponse.public_id;
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
            imagePublicId: imagePublicId,
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
            return res.status(404).json({
                success: false,
                message: "Blog post not found.",
            });
        }

        const updateData = {
            updatedAt: new Date().toISOString().split("T")[0],
        };

        // Update text fields
        if (req.body.title !== undefined) {
            updateData.title = req.body.title;
        }

        if (req.body.slug !== undefined) {
            updateData.slug = req.body.slug;
        }

        if (req.body.excerpt !== undefined) {
            updateData.excerpt = req.body.excerpt;
        }

        if (req.body.content !== undefined) {
            updateData.content = req.body.content;
        }

        if (req.body.category !== undefined) {
            updateData.category = req.body.category;
        }

        if (req.body.author !== undefined) {
            updateData.author = req.body.author;
        }

        if (req.body.status !== undefined) {
            updateData.status = req.body.status;
        }

        if (req.body.publishDate !== undefined) {
            updateData.publishDate = req.body.publishDate;
        }

        // ==============================
        // NEW IMAGE
        // ==============================

        if (req.file) {
            console.log("New image received:", req.file);

            // Upload new image first
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

            if (!cloudinaryResponse) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to upload new image.",
                });
            }

            console.log("New Cloudinary image:", cloudinaryResponse.public_id);

            // Delete OLD image
            if (existingPost.imagePublicId) {
                console.log("Deleting old image:", existingPost.imagePublicId);

                await deleteFromCloudinary(existingPost.imagePublicId);
            }

            // Save NEW image
            updateData.image = cloudinaryResponse.secure_url;
            updateData.imagePublicId = cloudinaryResponse.public_id;
        }

        const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        return res.status(200).json({
            success: true,
            message: "Blog post details updated successfully.",
            data: updatedPost,
        });
    } catch (error) {
        console.error("Update post error:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Slug must be unique.",
            });
        }

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete Single Post
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found.",
            });
        }

        // Delete Cloudinary image
        if (deletedPost.imagePublicId) {
            await deleteFromCloudinary(deletedPost.imagePublicId);
        }

        return res.status(200).json({
            success: true,
            message: "Blog post has been removed successfully.",
            data: { id },
        });
    } catch (error) {
        console.error("Delete post error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
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
        const postsToDelete = await Post.find({
            _id: { $in: ids },
        });
        const result = await Post.deleteMany({
            _id: { $in: ids },
        });
        // Delete images from Cloudinary
        for (const post of postsToDelete) {
            if (post.imagePublicId) {
                await deleteFromCloudinary(post.imagePublicId);
            }
        }

        return res.status(200).json({
            success: true,
            message: `${result.deletedCount} blog posts have been removed successfully.`,
            data: {
                deletedIds: ids,
            },
        });
    } catch (error) {
        console.error("Bulk delete error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};