import { Request, Response } from "express";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import mongoose from "mongoose";

export const createComment = async (req: Request, res: Response) => {
  try {
    const { content, postId, parentCommentId } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    if (!content?.trim()) {
      return res.status(400).json({ error: "Comment content is required" });
    }
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    let parentComment = null;
    if (parentCommentId) {
      parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ error: "Parented comment not found" });
      }
    }
    const comment = new Comment({
      content: content.trim(),
      author: userId,
      post: postId,
      parentComment: parentCommentId || null,
    });
    await comment.save();
    if (parentComment) {
      parentComment.replies.push(comment._id);
      await parentComment.save();
    }
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });
    await comment.populate("author", "username email avatar");
    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPostComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({
      post: postId,
      parentComment: null,
      isDeleted: false,
    })
      .populate("author", "username email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalComments = await Comment.countDocuments({
      post: postId,
      parentComment: null,
      isDeleted: false,
    });
    const totalPages = Math.ceil(totalComments / limit);
    res.json({
      comments,
      pagination: {
        currentPage: page,
        totalPages,
        totalComments,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

export const getCommentReplies = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    const replies = await Comment.find({
      parentComment: commentId,
      isDeleted: false,
    })
      .populate("author", "username email avatar")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalReplies = await Comment.countDocuments({
      parentComment: commentId,
      isDeleted: false,
    });
    const totalPages = Math.ceil(totalReplies / limit);
    res.json({
      replies,
      pagination: {
        currentPage: page,
        totalPages,
        totalReplies,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    console.error("Error fetching replies:", err);
    res.status(500).json({ error: "Failed to fetch replies" });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    if (!content?.trim()) {
      return res.status(400).json({ error: "Comment content is required" });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.author.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to edit this comment" });
    }
    comment.content = content.trim();
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();
    await comment.populate("author", "username email avatar");

    res.json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (err) {
    console.error("Error upadating comment", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.author.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this comment" });
    }
    comment.isDeleted = true;
    comment.content = "[This comment has been deleted]";
    await comment.save();

    await Post.findByIdAndUpdate(comment.post, { $inc: { commentCount: -1 } });
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Internal  server error" });
  }
};

export const toggleCommentLike = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const hasLiked = comment.likedBy.includes(userObjectId);

    if (hasLiked) {
      comment.likedBy = comment.likedBy.filter(
        (id) => !id.equals(userObjectId)
      );
      comment.likes = Math.max(0, comment.likes - 1);
    } else {
      comment.likedBy.push(userObjectId);
      comment.likes += 1;
    }
    await comment.save();
    res.json({
      message: hasLiked ? "Comment unliked" : "Comment liked",
      likes: comment.likes,
      likedBy: comment.likedBy,
      hasLiked: !hasLiked,
    });
  } catch (err) {
    console.error("Error toggling comment likes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCommentCount = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const count = await Comment.countDocuments({
      post: postId,
      isDeleted: false,
    });
    res.json({ commentCount: count });
  } catch (err) {
    console.error("Error getting comment count:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
