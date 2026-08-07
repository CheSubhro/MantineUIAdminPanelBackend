
import Page from "../models/Page.model.js";

// All Page Fecth
export const getAllPages = async (req, res) => {
    try {
        const { search, status } = req.query;
        let query = {};

        // Search Query Handeling 
        if (search) {
            const searchRegex = new RegExp(search, "i");
            query.$or = [
                { title: searchRegex },
                { slug: searchRegex },
                { author: searchRegex },
            ];
        }

        // Status Filter Handeling
        if (status && status !== "All") {
            query.status = status;
        }

        const pages = await Page.find(query).sort({ updatedAt: -1 });
        res.status(200).json({
            success: true,
            count: pages.length,
            data: pages,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// New Page Create
export const createPage = async (req, res) => {
    try {
        const { title, slug, author, status, excerpt, content } = req.body;

        const currentDate = new Date().toISOString().split("T")[0];

        const newPage = await Page.create({
            title,
            slug,
            author: author || "Subhro Mondal",
            status: status || "Published",
            excerpt,
            content,
            updatedAt: currentDate,
        });

        res.status(201).json({
            success: true,
            message: "New website page added successfully.",
            data: newPage,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Slug must be unique. This slug already exists.",
                });
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

// Page Update
export const updatePage = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updatedAt: new Date().toISOString().split("T")[0],
        };

        const updatedPage = await Page.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedPage) {
            return res
                .status(404)
                .json({ success: false, message: "Page not found." });
        }

        res.status(200).json({
            success: true,
            message: "Website page details updated successfully.",
            data: updatedPage,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Single Page Delete
export const deletePage = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPage = await Page.findByIdAndDelete(id);

        if (!deletedPage) {
            return res
                .status(404)
                .json({ success: false, message: "Page not found." });
        }

        res.status(200).json({
            success: true,
            message: "Website page has been removed successfully.",
            data: { id },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// (Bulk Delete)
export const bulkDeletePages = async (req, res) => {
    try {
        const { ids } = req.body; // Expecting an array of IDs: { ids: ['id1', 'id2'] }

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "No page IDs provided for bulk deletion.",
                });
        }

        const result = await Page.deleteMany({ _id: { $in: ids } });

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} website pages have been removed successfully.`,
            data: { deletedIds: ids },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};