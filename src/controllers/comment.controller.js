
import Comment from "../models/Comment.model.js";
import sendEmail from "../utils/Email.js";

// Get All Comments (with Search & Status Filter)
export const getAllComments = async (req, res) => {
    try {
        const { search, status } = req.query;
        let query = {};

        if (search) {
            const searchRegex = new RegExp(search, "i");
            query.$or = [
                { author: searchRegex },
                { content: searchRegex },
                { postTitle: searchRegex },
            ];
        }

        if (status && status !== "All") {
            query.status = status;
        }

        const comments = await Comment.find(query).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create New Comment
export const createComment = async (req, res) => {
    try {
        const { author, email, content, postId, postTitle } = req.body;

        const newComment = await Comment.create({
            author,
            email,
            content,
            postId,
            postTitle,
            status: "pending", 
            updatedAt: new Date().toISOString().split("T")[0],
        });

        res.status(201).json({
            success: true,
            message: "Comment submitted and awaiting approval.",
            data: newComment,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update Comment Status (Approve/Spam)
export const updateCommentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["approved", "pending", "spam"].includes(status)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid status value." });
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { status, updatedAt: new Date().toISOString().split("T")[0] },
            { new: true }
        );

        if (!updatedComment) {
            return res
                .status(404)
                .json({ success: false, message: "Comment not found." });
        }

        res.status(200).json({
            success: true,
            message: `Comment status updated to ${status}.`,
            data: updatedComment,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete Single Comment
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedComment = await Comment.findByIdAndDelete(id);

        if (!deletedComment) {
            return res
                .status(404)
                .json({ success: false, message: "Comment not found." });
        }

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Bulk Delete Comments
export const bulkDeleteComments = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "No comment IDs provided." });
        }

        const result = await Comment.deleteMany({ _id: { $in: ids } });

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} comments deleted successfully.`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Send Reply to Comment & Email Notification
export const sendReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { replyContent } = req.body;

        if (!replyContent) {
            return res.status(400).json({ success: false, message: "Reply content is required." });
        }

        // কমেন্ট খুঁজে বের করুন যাতে ইউজারের ইমেইল পাওয়া যায়
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found." });
        }

        // রিপ্লাই যুক্ত করুন
        comment.replies.push({ replyContent });
        await comment.save();

        // কমেন্টকারীকে ইমেইল নোটিফিকেশন পাঠান
        try {
            const subject = `New reply on your comment regarding "${comment.postTitle || 'our post'}"`;
            const body = `Hi ${comment.author},\n\nAdmin has replied to your comment:\n\n"${replyContent}"\n\nThank you for engaging with us!`;
            
            await sendEmail(comment.email, subject, body);
        } catch (emailError) {
            console.error("Email sending failed:", emailError.message);
        }

        res.status(200).json({
            success: true,
            message: "Reply sent and notification email dispatched successfully.",
            data: comment,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};