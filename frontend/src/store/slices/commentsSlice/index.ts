import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../../api";
import {
  ApiError,
  CommentState,
  CommentType,
  GetCommentsResponse,
  GetRepliesResponse,
  CreateCommentResponse,
  UpdateCommentResponse,
  LikeCommentResponse,
  CreateCommentData,
  UpdateCommentData,
} from "./types";
import { RootState } from "../..";

export const initialState: CommentState = {
  comments: {},
  replies: {},
  commentCounts: {},
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: {},
  deleteLoading: {},
  likeLoading: {},
  pagination: {},
  repliesPagination: {},
};

// Async thunks with proper typing
export const fetchPostComments = createAsyncThunk<
  { postId: string; data: GetCommentsResponse },
  { postId: string; page?: number },
  { rejectValue: string }
>(
  "comments/fetchPostComments",
  async ({ postId, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.get<GetCommentsResponse>(
        `/comments/post/${postId}?page=${page}`
      );
      return { postId, data: response.data };
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch comments"
      );
    }
  }
);

export const fetchCommentReplies = createAsyncThunk<
  { commentId: string; data: GetRepliesResponse },
  { commentId: string; page?: number },
  { rejectValue: string }
>(
  "comments/fetchCommentReplies",
  async ({ commentId, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.get<GetRepliesResponse>(
        `/comments/replies/${commentId}?page=${page}`
      );
      return { commentId, data: response.data };
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch replies"
      );
    }
  }
);

export const fetchCommentCount = createAsyncThunk<
  { postId: string; count: number },
  string,
  { rejectValue: string }
>("comments/fetchCommentCount", async (postId, { rejectWithValue }) => {
  try {
    const response = await api.get<{ commentCount: number }>(
      `/comments/count/${postId}`
    );
    return { postId, count: response.data.commentCount };
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch comment count"
    );
  }
});

export const loadMoreComments = createAsyncThunk<
  { postId: string; data: GetCommentsResponse },
  { postId: string; page: number },
  { rejectValue: string }
>(
  "comments/loadMoreComments",
  async ({ postId, page }, { rejectWithValue }) => {
    try {
      const response = await api.get<GetCommentsResponse>(
        `/comments/post/${postId}?page=${page}`
      );
      return { postId, data: response.data };
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.message || "Failed to load more comments"
      );
    }
  }
);

export const loadMoreReplies = createAsyncThunk<
  { commentId: string; data: GetRepliesResponse },
  { commentId: string; page: number },
  { rejectValue: string }
>(
  "comments/loadMoreReplies",
  async ({ commentId, page }, { rejectWithValue }) => {
    try {
      const response = await api.get<GetRepliesResponse>(
        `/comments/replies/${commentId}?page=${page}`
      );
      return { commentId, data: response.data };
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.message || "Failed to load more replies"
      );
    }
  }
);

// Helper function to find comment location
const findCommentLocation = (
  state: CommentState,
  commentId: string
): { type: "comment" | "reply"; postId?: string; parentId?: string } | null => {
  // Check in comments
  for (const [postId, comments] of Object.entries(state.comments)) {
    if (comments.some((comment) => comment._id === commentId)) {
      return { type: "comment", postId };
    }
  }

  // Check in replies
  for (const [parentId, replies] of Object.entries(state.replies)) {
    if (replies.some((reply) => reply._id === commentId)) {
      return { type: "reply", parentId };
    }
  }

  return null;
};

export const createComment = createAsyncThunk<
  { comment: CommentType; postId: string; parentCommentId?: string },
  { content: string; postId: string; parentCommentId?: string },
  { rejectValue: string; state: { comments: CommentState } }
>(
  "comments/createComment",
  async (
    { content, postId, parentCommentId },
    { rejectWithValue, getState }
  ) => {
    try {
      const payload: CreateCommentData = {
        content,
        postId: postId,
        parentCommentId: parentCommentId || null,
      };

      if (parentCommentId) {
        const state = getState();
        const location = findCommentLocation(state.comments, parentCommentId);
        if (!location) {
          return rejectWithValue("Parent comment not found");
        }
      }

      const response = await api.post<CreateCommentResponse>(
        "/comments",
        payload
      );
      return {
        comment: response.data.comment,
        postId,
        parentCommentId: parentCommentId || undefined,
      };
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create comment"
      );
    }
  }
);

export const updateComment = createAsyncThunk<
  CommentType,
  { commentId: string; content: string },
  { rejectValue: string }
>(
  "comments/updateComment",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const payload: UpdateCommentData = { content };
      const response = await api.put<UpdateCommentResponse>(
        `/comments/${commentId}`,
        payload
      );
      return response.data.comment;
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update comment"
      );
    }
  }
);

export const deleteComment = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("comments/deleteComment", async (commentId, { rejectWithValue }) => {
  try {
    await api.delete(`/comments/${commentId}`);
    return commentId;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to delete comment"
    );
  }
});

export const toggleCommentLike = createAsyncThunk<
  { commentId: string; likes: number; likedBy: string[] },
  string,
  { rejectValue: string }
>("comments/toggleCommentLike", async (commentId, { rejectWithValue }) => {
  try {
    const response = await api.patch<LikeCommentResponse>(
      `/comments/${commentId}/like`,
      {},
      { withCredentials: true }
    );
    return {
      commentId,
      likes: response.data.likes,
      likedBy: response.data.likedBy,
    };
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.message || error.message || "Failed to toggle like"
    );
  }
});

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments: (state, action: PayloadAction<string>) => {
      delete state.comments[action.payload];
      delete state.pagination[action.payload];
    },
    clearReplies: (state, action: PayloadAction<string>) => {
      delete state.replies[action.payload];
      delete state.repliesPagination[action.payload];
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch post comments
      .addCase(fetchPostComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostComments.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, data } = action.payload;

        state.comments[postId] = data.comments || [];
        state.pagination[postId] = data.pagination;
      })
      .addCase(fetchPostComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!;
      })

      // Fetch comment replies
      .addCase(fetchCommentReplies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentReplies.fulfilled, (state, action) => {
        state.loading = false;
        const { commentId, data } = action.payload;

        state.replies[commentId] = data.replies || [];
        state.repliesPagination[commentId] = data.pagination;
      })
      .addCase(fetchCommentReplies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!;
      })

      // Fetch comment count
      .addCase(fetchCommentCount.fulfilled, (state, action) => {
        const { postId, count } = action.payload;
        state.commentCounts[postId] = count;
      })

      // Load more comments
      .addCase(loadMoreComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMoreComments.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, data } = action.payload;

        if (state.comments[postId]) {
          state.comments[postId].push(...(data.comments || []));
        } else {
          state.comments[postId] = data.comments || [];
        }
        state.pagination[postId] = data.pagination;
      })
      .addCase(loadMoreComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!;
      })

      // Load more replies
      .addCase(loadMoreReplies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMoreReplies.fulfilled, (state, action) => {
        state.loading = false;
        const { commentId, data } = action.payload;

        if (state.replies[commentId]) {
          state.replies[commentId].push(...(data.replies || []));
        } else {
          state.replies[commentId] = data.replies || [];
        }
        state.repliesPagination[commentId] = data.pagination;
      })
      .addCase(loadMoreReplies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload!;
      })

      // Create comment
      .addCase(createComment.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.createLoading = false;
        const { comment, postId, parentCommentId } = action.payload;

        if (parentCommentId) {
          // Add to replies
          if (!state.replies[parentCommentId]) {
            state.replies[parentCommentId] = [];
          }
          state.replies[parentCommentId].unshift(comment);

          // Update parent comment's replies array
          Object.values(state.comments).forEach((postComments) => {
            const parentComment = postComments.find(
              (c) => c._id === parentCommentId
            );
            if (parentComment && !parentComment.replies.includes(comment._id)) {
              parentComment.replies.push(comment._id);
            }
          });
        } else {
          // Add to comments
          if (!state.comments[postId]) {
            state.comments[postId] = [];
          }
          state.comments[postId].unshift(comment);
        }

        // Update comment count
        state.commentCounts[postId] = (state.commentCounts[postId] || 0) + 1;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload!;
      })

      // Update comment
      .addCase(updateComment.pending, (state, action) => {
        state.updateLoading[action.meta.arg.commentId] = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        delete state.updateLoading[updatedComment._id];

        // Update in comments
        Object.values(state.comments).forEach((postComments) => {
          const index = postComments.findIndex(
            (c) => c._id === updatedComment._id
          );
          if (index !== -1) {
            postComments[index] = updatedComment;
          }
        });

        // Update in replies
        Object.values(state.replies).forEach((commentReplies) => {
          const index = commentReplies.findIndex(
            (r) => r._id === updatedComment._id
          );
          if (index !== -1) {
            commentReplies[index] = updatedComment;
          }
        });
      })
      .addCase(updateComment.rejected, (state, action) => {
        delete state.updateLoading[action.meta.arg.commentId];
        state.error = action.payload!;
      })

      // Delete comment
      .addCase(deleteComment.pending, (state, action) => {
        state.deleteLoading[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const commentId = action.payload;
        delete state.deleteLoading[commentId];

        // Remove from comments
        Object.keys(state.comments).forEach((postId) => {
          const originalLength = state.comments[postId].length;
          state.comments[postId] = state.comments[postId].filter(
            (c) => c._id !== commentId
          );

          // Update comment count if comment was removed
          if (state.comments[postId].length < originalLength) {
            state.commentCounts[postId] = Math.max(
              0,
              (state.commentCounts[postId] || 0) - 1
            );
          }
        });

        // Remove from replies
        Object.keys(state.replies).forEach((parentCommentId) => {
          state.replies[parentCommentId] = state.replies[
            parentCommentId
          ].filter((r) => r._id !== commentId);
        });

        // Remove from parent comment's replies array
        Object.values(state.comments).forEach((postComments) => {
          postComments.forEach((comment) => {
            comment.replies = comment.replies.filter(
              (replyId) => replyId !== commentId
            );
          });
        });
      })
      .addCase(deleteComment.rejected, (state, action) => {
        delete state.deleteLoading[action.meta.arg];
        state.error = action.payload!;
      })

      // Toggle comment like
      .addCase(toggleCommentLike.pending, (state, action) => {
        state.likeLoading[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const { commentId, likes, likedBy } = action.payload;

        // ✅ Update in top-level comments
        for (const postComments of Object.values(state.comments)) {
          const comment = postComments.find((c) => c._id === commentId);
          if (comment) {
            comment.likes = likes;
            comment.likedBy = likedBy;
          }
        }

        // ✅ FIX: Update in replies
        for (const replies of Object.values(state.replies)) {
          const reply = replies.find((r) => r._id === commentId);
          if (reply) {
            reply.likes = likes;
            reply.likedBy = likedBy;
          }
        }
      })
      .addCase(toggleCommentLike.rejected, (state, action) => {
        delete state.likeLoading[action.meta.arg];
        state.error = action.payload!;
      });
  },
});

export const { clearComments, clearReplies, clearError } = commentSlice.actions;

// Create constant empty arrays to avoid new references
const EMPTY_COMMENTS_ARRAY: CommentType[] = [];
const EMPTY_REPLIES_ARRAY: CommentType[] = [];

// Fixed selectors with stable default values
export const selectPostComments = createSelector(
  [
    (state: { comments: CommentState }) => state.comments.comments,
    (_: unknown, postId: string) => postId,
  ],
  (comments, postId) => comments[postId] || EMPTY_COMMENTS_ARRAY
);

export const selectCommentReplies = createSelector(
  [
    (state: { comments: CommentState }) => state.comments.replies,
    (_: { comments: CommentState }, commentId: string) => commentId,
  ],
  (replies, commentId) => replies[commentId] || EMPTY_REPLIES_ARRAY
);

export const selectCommentCount = createSelector(
  [
    (state: { comments: CommentState }) => state.comments.commentCounts,
    (_: { comments: CommentState }, postId: string | undefined) => postId,
  ],
  (commentCounts, postId) => {
    if (!postId) return 0;
    return commentCounts[postId] || 0;
  }
);

export const selectCommentsPagination = createSelector(
  [
    (state: { comments: CommentState }) => state.comments.pagination,
    (_: { comments: CommentState }, postId: string) => postId,
  ],
  (pagination, postId) => pagination[postId] || null
);

export const selectRepliesPagination = createSelector(
  [
    (state: { comments: CommentState }) => state.comments.repliesPagination,
    (_: { comments: CommentState }, commentId: string) => commentId,
  ],
  (repliesPagination, commentId) => repliesPagination[commentId] || null
);

// Simple selectors
export const selectCommentsLoading = (state: { comments: CommentState }) =>
  state.comments.loading;

export const selectCreateCommentLoading = (state: { comments: CommentState }) =>
  state.comments.createLoading;

export const selectUpdateCommentLoading = (
  state: { comments: CommentState },
  commentId: string
) => state.comments.updateLoading[commentId] || false;

export const selectDeleteCommentLoading = (
  state: { comments: CommentState },
  commentId: string
) => state.comments.deleteLoading[commentId] || false;

export const selectLikeCommentLoading = (
  state: { comments: CommentState },
  commentId: string
) => state.comments.likeLoading[commentId] || false;

export const selectCommentsError = (state: { comments: CommentState }) =>
  state.comments.error;

export const selectHasMoreComments = createSelector(
  [selectCommentsPagination],
  (pagination) => pagination?.hasNextPage || false
);

export const selectHasMoreReplies = createSelector(
  [selectRepliesPagination],
  (pagination) => pagination?.hasNextPage || false
);

export const selectCurrentCommentsPage = createSelector(
  [selectCommentsPagination],
  (pagination) => pagination?.currentPage || 1
);

export const selectCurrentRepliesPage = createSelector(
  [selectRepliesPagination],
  (pagination) => pagination?.currentPage || 1
);
export const selectCommentById = createSelector(
  [
    (state: { comments: CommentState }) => state.comments.comments,
    (_: any, commentId: string) => commentId,
  ],
  (comments, commentId) => {
    for (const postComments of Object.values(comments)) {
      const found = postComments.find((c) => c._id === commentId);
      if (found) return found;
    }
    return null;
  }
);

export const makeSelectPostComments = () =>
  createSelector(
    [
      (state: RootState) => state.comments.comments,
      (_: RootState, postId: string) => postId,
    ],
    (commentsMap, postId) => commentsMap[postId] || []
  );

export const makeSelectCommentReplies = () =>
  createSelector(
    [
      (state: RootState) => state.comments.replies,
      (_: RootState, parentId: string) => parentId,
    ],
    (replies, parentId) => replies[parentId] || EMPTY_REPLIES_ARRAY
  );

export default commentSlice.reducer;
