import express, { Router } from "express";
import {
  createComment,
  deleteComment,
  getCommentCount,
  getCommentReplies,
  getPostComments,
  toggleCommentLike,
  updateComment,
} from "../controllers/commentController.js";
import protect from "../middlewares/auth.js";

export const commentRoutes: Router = express.Router();

commentRoutes.get("/post/:postId", getPostComments);
commentRoutes.get("/replies/:commentId", getCommentReplies);
commentRoutes.get("/count/:postId", getCommentCount);

commentRoutes.post("/", protect, createComment);
commentRoutes.put("/:commentId", protect, updateComment);
commentRoutes.delete("/:commentId", protect, deleteComment);
commentRoutes.patch("/:commentId/like", protect, toggleCommentLike);
