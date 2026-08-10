
import express from "express";
import {
    getAllComments,
    createComment,
    updateCommentStatus,
    deleteComment,
    bulkDeleteComments,
    sendReply,
} from "../controllers/comment.controller.js";

const router = express.Router();

// Get all comments & Create a new comment (Public / Frontend submission)
router.route("/").get(getAllComments).post(createComment);

// Bulk delete comments (Admin route)
router.route("/bulk").delete(bulkDeleteComments);

// Update comment status (Approve/Spam), Reply, & Delete single comment (Admin routes)
router
    .route("/:id")
    .patch(updateCommentStatus) 
    .post(sendReply)           
    .delete(deleteComment);    

export default router;