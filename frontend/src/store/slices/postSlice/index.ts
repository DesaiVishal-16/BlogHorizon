import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../../api";
import { AxiosError } from "axios";

export type Post = {
  _id: string;
  title: string;
  content: string;
  contentImages?: Array<{
    id: number;
    url: string;
    publicId: string;
    alt: string;
    title?: string;
    width: number;
    height: number;
  }>;
  thumbnail: string;
  thumbnailPublicId?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  author: string;
  likes: number;
  likedBy: string[];
};

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  loadingMore: boolean;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
  loadingMore: false,
  hasMore: true,
  currentPage: 1,
  totalPages: 1,
};

export const fetchPosts = createAsyncThunk<
  { posts: Post[]; totalPages: number; currentPage: number; hasMore: boolean },
  void,
  { rejectValue: string }
>("posts/fetchposts", async (_, thunkAPI) => {
  try {
    const res = await api.get("posts?page=1&limit=6", {
      withCredentials: true,
    });

    const { posts, totalPages, currentPage, hasMore } = res.data;

    return { posts, totalPages, currentPage, hasMore };
  } catch (err: unknown) {
    const error = err as AxiosError;
    let errorMessage = "Failed to fetch posts";
    if (error.response?.data && typeof error.response.data === "object") {
      errorMessage = (error.response.data as any).message || errorMessage;
    }
    return thunkAPI.rejectWithValue(errorMessage);
  }
});
export const fetchMorePosts = createAsyncThunk<
  {
    posts: Post[];
    totalPages: number;
    currentPage: number;
    hasMore: boolean;
  },
  number,
  { rejectValue: string }
>("posts/fetchMorePosts", async (page, thunkAPI) => {
  try {
    const res = await api.get(`posts?page=${page}&limit=6`, {
      withCredentials: true,
    });
    const { posts, totalPages, currentPage, hasMore } = res.data;

    return { posts, totalPages, currentPage, hasMore };
  } catch (err: unknown) {
    const error = err as AxiosError;
    let errorMessage = "Failed to fetch more posts";
    if (error.response?.data && typeof error.response.data === "object") {
      errorMessage = (error.response.data as any).message || errorMessage;
    }
    return thunkAPI.rejectWithValue(errorMessage);
  }
});
export const updateLikePost = createAsyncThunk<
  Post,
  string,
  { rejectValue: string }
>("posts/updateLike", async (postId, thunkAPI) => {
  try {
    const state: any = thunkAPI.getState();
    const userId = state.auth.user?._id;

    if (!userId) {
      return thunkAPI.rejectWithValue("User not authenticated");
    }

    const res = await api.patch(
      `posts/${postId}/like`,
      { userId },
      { withCredentials: true }
    );

    return res.data.post;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Failed to like post"
    );
  }
});

interface CreatePostData {
  title: string;
  content: string;
  tags: string[];
  author: string;
  contentImages?: string[];
  thumbnail?: File | null;
}

export const createPost = createAsyncThunk<
  Post,
  CreatePostData,
  { rejectValue: string }
>("posts/createPost", async (postData, thunkAPI) => {
  try {
    if (postData.thumbnail && postData.thumbnail instanceof File) {
      const formData = new FormData();
      formData.append("thumbnail", postData.thumbnail);
      formData.append("title", postData.title);
      formData.append("content", postData.content);
      formData.append("author", postData.author);

      if (postData.tags && postData.tags.length > 0) {
        postData.tags.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
      }

      // Handle content images if present
      if (postData.contentImages && postData.contentImages.length > 0) {
        postData.contentImages.forEach((imageUrl, index) => {
          formData.append(`contentImages[${index}]`, imageUrl);
        });
      }

      const res = await api.post("posts/create-new-post", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.post;
    } else {
      // Send as JSON when no thumbnail file
      const jsonData = {
        title: postData.title,
        content: postData.content,
        tags: postData.tags,
        author: postData.author,
        contentImages: postData.contentImages || [],
      };

      const res = await api.post("posts/create-new-post", jsonData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data.post;
    }
  } catch (err: any) {
    console.error("Create post error:", err.response?.data || err.message);
    return thunkAPI.rejectWithValue(
      err.response?.data?.message ||
        err.response?.data?.errors?.join(", ") ||
        "Failed to create post"
    );
  }
});

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Add a reducer to clear errors if needed
    clearError: (state) => {
      state.error = null;
    },
    resetPosts: (state) => {
      state.posts = [];
      state.currentPage = 1;
      state.hasMore = true;
      state.error = null;
    },
    resetPagination: (state) => {
      state.currentPage = 1;
      state.hasMore = true;
      state.loadingMore = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch posts";
      })
      // fetchMorePosts
      .addCase(fetchMorePosts.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(fetchMorePosts.fulfilled, (state, action) => {
        state.loadingMore = false;
        if (action.payload.posts.length > 0) {
          state.posts = [...state.posts, ...action.payload.posts];
        }
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.hasMore = action.payload.hasMore;
        if (state.currentPage >= state.totalPages) {
          state.hasMore = false;
        }
      })
      .addCase(fetchMorePosts.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload || "Failed to fetch more posts";
      })
      // createPost
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;
        state.posts.unshift(action.payload); // Add new post to beginning of array
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create post";
      })
      // updateLikePost
      .addCase(
        updateLikePost.fulfilled,
        (state, action: PayloadAction<Post>) => {
          const updatedPost = action.payload;
          const index = state.posts.findIndex(
            (post) => post._id === updatedPost._id
          );
          if (index !== -1) {
            state.posts[index] = updatedPost;
          }
        }
      )
      .addCase(updateLikePost.rejected, (state, action) => {
        state.error = action.payload || "Failed to like post";
      });
  },
});

export const { clearError, resetPagination, resetPosts } = postSlice.actions;
export default postSlice.reducer;
