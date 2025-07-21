import express, { Router } from 'express';
import {createAPost,deleteAPost,fetchListOfPost,likeAPost,updateAPost} from '../controllers/postController';

import { validateBody } from '../middlewares/validate';
import { createPostSchema, updatedPostSchema } from '../validations/postValidation';
import { thumbnailImageUpload } from '../utils/upload';
import protect from '../middlewares/auth';

const postRoutes: Router = express.Router();

// Fetch all posts
postRoutes.get('/', fetchListOfPost);

// Create new post
postRoutes.post(
  '/create-new-post',
  thumbnailImageUpload.single('thumbnail'),
  protect,
  validateBody(createPostSchema),
  createAPost
);

// Update post
postRoutes.put(
  '/update-post/:id',
  thumbnailImageUpload.single('thumbnail'),
  protect,
  validateBody(updatedPostSchema),
  updateAPost
);

// Delete post
postRoutes.delete('/delete-post/:id', protect , deleteAPost);

// Like a post
postRoutes.patch('/:id/like', likeAPost);

export default postRoutes;
