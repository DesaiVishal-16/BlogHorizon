import { Request, Response } from "express";
import Post from "../models/Post";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../utils/cloudinary";
import { processMarkdownImages } from "../utils/processMarkdownImages";

type ContentImage = {
  id: number;
  url: string;
  publicId: string;
  alt: string;
  title?: string;
  width: number;
  height: number;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fetchListOfPost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    
    const skip = (page - 1) * limit;
    
    const totalPosts = await Post.countDocuments();
    
    const totalPages = Math.ceil(totalPosts / limit);
    
    const postList = await Post.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)              // Skip posts from previous pages
      .limit(limit)            // Limit to specified number of posts
      .lean();                 // Keep your lean() for better performance
    
    if (!postList || postList.length === 0) {
      return res.status(404).json({ 
        message: "No Post Found!",
        currentPage: page,
        totalPages: 0,
        totalPosts: 0,
        hasMore: false
      });
    }
    
    const hasMore = page < totalPages;
    
    return res.status(200).json({ 
      success: true, 
      posts: postList,
      currentPage: page,
      totalPages: totalPages,
      totalPosts: totalPosts,
      hasMore: hasMore,
      postsPerPage: limit
    });
    
  } catch (err) {
    console.error('Error fetching posts:', err);
    return res.status(500).json({ 
      message: "Internal Server Error",
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};;

const createAPost = async (req: Request, res: Response): Promise<Response> => {
  const { title, content, author } = req.body;
  let tags: string[] = [];

  try {
    if (typeof req.body.tags === "string") {
        tags = JSON.parse(req.body.tags);
     } else if (Array.isArray(req.body.tags)) {
        tags = req.body.tags;
     } else {
        tags = [];
     }
  } catch {
    return res.status(400).json({ success: false, message: "Invalid tags format" });
   }
  const thumbnail = req.file?.path || null;
  const thumbnailPublicId = req.file?.filename || null;

  if (!title || !content || !author) {
    if (thumbnailPublicId) await cloudinary.uploader.destroy(thumbnailPublicId);
    return res.status(400).json({ success: false, message: "Title, Content and Author are required" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await processMarkdownImages(content);
    const processedContent = result.processedContent;
    const uploadedImages = result.uploadedImages;

    const newlyCreatedPost = new Post({
      title,
      content: processedContent,
      tags,
      author,
      thumbnail,
      thumbnailPublicId,
      contentImages: uploadedImages,
    });

    await newlyCreatedPost.save({ session });
    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      post: newlyCreatedPost,
      uploadedImages: {
        thumbnail: thumbnailPublicId ? { url: thumbnail, publicId: thumbnailPublicId } : null,
        contentImages: uploadedImages,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    if (thumbnailPublicId) await cloudinary.uploader.destroy(thumbnailPublicId);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err });
  } finally {
    session.endSession();
  }
};

const updateAPost = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: "Post ID is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid Post ID format" });
  }

  const { title, content, tags, author, likes } = req.body;
  let thumbnail = req.body.thumbnail;
  let thumbnailPublicId = req.body.thumbnailPublicId;

  if (req.file) {
    thumbnail = req.file.path;
    thumbnailPublicId = req.file.filename;
  }

  if (!title || !content || !author) {
    if (req.file) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (err) {
        console.error("Error deleting file from Cloudinary", err);
      }
    }
    return res.status(400).json({ success: false, message: "Title, Content and Author are required" });
  }

  try {
    const existingPost = await Post.findById(id);
    if (!existingPost) {
      if (req.file) {
        try {
          await cloudinary.uploader.destroy(req.file.filename);
        } catch (err) {
          console.error("Error deleting file from Cloudinary", err);
        }
      }
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const updateData: any = { title, content, tags, author, thumbnail, thumbnailPublicId };
    if (likes !== undefined) updateData.likes = likes;

    const updatedPost = await Post.findByIdAndUpdate(id, updateData, { new: true });

    if (
      updatedPost &&
      req.file &&
      existingPost.thumbnailPublicId &&
      existingPost.thumbnailPublicId !== thumbnailPublicId
    ) {
      try {
        await cloudinary.uploader.destroy(existingPost.thumbnailPublicId);
      } catch (err) {
        console.error("Error deleting old thumbnail from Cloudinary", err);
      }
    }

    return res.status(200).json({ success: true, post: updatedPost });
  } catch (err) {
    if (req.file) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (cleanupErr) {
        console.log("Error deleting file from Cloudinary", cleanupErr);
      }
    }

    return res.status(500).json({ success: false, message: "Unable to update. Please try again!" });
  }
};

const deleteAPost = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: "Post Id is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid Post Id format" });
  }

  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ success: false, message: "Post Not found" });
    }

    if (deletedPost.thumbnailPublicId) {
      try {
        await cloudinary.uploader.destroy(deletedPost.thumbnailPublicId);
      } catch (err) {
        console.error("Error deleting thumbnail from Cloudinary", err);
      }
    }

    return res.status(200).json({ success: true, message: "Successfully deleted", post: deletedPost });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Unable to delete. Please try again!" });
  }
};

const likeAPost = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid Post ID or User ID" });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const alreadyLiked = post.likedBy.includes(userId);

    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter(uid => uid.toString() !== userId);
      post.likes = Math.max(0, post.likes - 1); 
    } else {
      post.likedBy.push(userId);
      post.likes += 1;
    }

    await post.save();
    return res.status(200).json({
      success: true,
      message: alreadyLiked ? "Post unliked" : "Post liked",
      post,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error liking post", error: err });
  }
};

export { fetchListOfPost, createAPost, updateAPost, deleteAPost, likeAPost };

