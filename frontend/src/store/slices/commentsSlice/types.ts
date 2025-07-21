export type Author = {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
};

export type CommentType = {
  _id: string;
  content: string;
  author: Author;
  post: string;
  parentComment?: string | null;
  replies: string[];
  likes: number;
  likedBy: string[];
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  __v: number;
};

export type PopulatedCommentType = Omit<CommentType, "replies"> & {
  replies: CommentType[];
};

export type CommentsPagination = {
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
  totalComments: number;
  hasPrevPage: boolean;
};

export type RepliesPagination = {
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
  totalReplies: number;
  hasPrevPage: boolean;
};

export type CommentState = {
  comments: Record<string, CommentType[]>;
  replies: Record<string, CommentType[]>;
  commentCounts: Record<string, number>;
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  updateLoading: Record<string, boolean>;
  deleteLoading: Record<string, boolean>;
  likeLoading: Record<string, boolean>;
  pagination: Record<string, CommentsPagination>;
  repliesPagination: Record<string, RepliesPagination>;
};

export type ApiError = {
  response?: {
    data?: {
      message?: string;
      errors?: string[];
    };
    status?: number;
  };
  message?: string;
  name?: string;
};

export type CreateCommentData = {
  content: string;
  postId: string;
  parentCommentId?: string | null;
};

export type UpdateCommentData = {
  content: string;
};

export type CommentAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | {
      type: "SET_COMMENTS";
      payload: { postId: string; comments: CommentType[] };
    }
  | { type: "ADD_COMMENT"; payload: { postId: string; comment: CommentType } }
  | {
      type: "UPDATE_COMMENT";
      payload: { commentId: string; updates: Partial<CommentType> };
    }
  | { type: "DELETE_COMMENT"; payload: { commentId: string; postId: string } }
  | {
      type: "SET_REPLIES";
      payload: { commentId: string; replies: CommentType[] };
    }
  | { type: "ADD_REPLY"; payload: { commentId: string; reply: CommentType } }
  | {
      type: "UPDATE_PAGINATION";
      payload: { postId: string; pagination: CommentsPagination };
    }
  | {
      type: "UPDATE_REPLIES_PAGINATION";
      payload: { commentId: string; pagination: RepliesPagination };
    }
  | { type: "SET_CREATE_LOADING"; payload: boolean }
  | {
      type: "SET_UPDATE_LOADING";
      payload: { commentId: string; loading: boolean };
    }
  | {
      type: "SET_DELETE_LOADING";
      payload: { commentId: string; loading: boolean };
    }
  | {
      type: "SET_LIKE_LOADING";
      payload: { commentId: string; loading: boolean };
    }
  | {
      type: "TOGGLE_LIKE";
      payload: { commentId: string; userId: string; isLiked: boolean };
    };

export type GetCommentsResponse = {
  comments: CommentType[];
  pagination: CommentsPagination;
};

export type GetRepliesResponse = {
  replies: CommentType[];
  pagination: RepliesPagination;
};

export type CreateCommentResponse = {
  comment: CommentType;
  message: string;
};

export type UpdateCommentResponse = {
  comment: CommentType;
  message: string;
};

export type DeleteCommentResponse = {
  message: string;
};

export type LikeCommentResponse = {
  message: string;
  likes: number;
  likedBy: string[];
  hasLiked: boolean;
};
