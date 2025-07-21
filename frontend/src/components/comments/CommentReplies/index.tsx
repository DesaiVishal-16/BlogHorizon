import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchCommentReplies,
  loadMoreReplies,
  selectCommentsLoading,
  selectCommentsError,
  selectRepliesPagination,
  selectCommentReplies,
} from "../../../store/slices/commentsSlice";
import CommentItem from "../CommentItem";
import { UseInfiniteScroll } from "../../../hooks";

interface CommentRepliesProps {
  postId: string;
  parentCommentId: string;
  showReplies?: boolean;
  depth?: number;
}

const CommentReplies: React.FC<CommentRepliesProps> = ({
  postId,
  parentCommentId,
  showReplies = false,
  depth = 0,
}) => {
  const dispatch = useAppDispatch();

  const replies = useAppSelector((state) =>
    selectCommentReplies(state, parentCommentId)
  );
  const loading = useAppSelector(selectCommentsLoading);
  const error = useAppSelector(selectCommentsError);
  const pagination = useAppSelector((state) =>
    selectRepliesPagination(state, parentCommentId)
  );

  // Fetch replies when showReplies becomes true
  useEffect(() => {
    if (showReplies && parentCommentId && replies.length === 0 && !loading) {
      dispatch(fetchCommentReplies({ commentId: parentCommentId, page: 1 }));
    }
  }, [showReplies, dispatch, parentCommentId, replies.length, loading]);

  // Pagination: load more replies
  const handleLoadMore = useCallback(() => {
    if (pagination?.hasNextPage && !loading) {
      dispatch(
        loadMoreReplies({
          commentId: parentCommentId,
          page: pagination.currentPage + 1,
        })
      );
    }
  }, [dispatch, parentCommentId, pagination, loading]);

  const { lastElementRef } = UseInfiniteScroll({
    loading,
    hasMore: pagination?.hasNextPage || false,
    onLoadMore: handleLoadMore,
    threshold: 100,
  });

  // If replies should not show at all
  if (!showReplies) return null;

  // Loading initial fetch
  if (loading && replies.length === 0) {
    return (
      <div className="text-gray-400 text-sm py-2 pl-4">Loading replies...</div>
    );
  }

  // Error case
  if (error) {
    return (
      <div className="text-red-400 text-sm py-2 pl-4">
        Error loading replies: {error}
      </div>
    );
  }

  //  No replies yet
  if (!loading && replies.length === 0) {
    return (
      <div className="text-gray-400 text-sm py-2 pl-4">
        No replies yet for this comment
      </div>
    );
  }

  // Render replies if available
  return (
    <div className="replies-container mt-4 space-y-3">
      {replies.map((reply, index) => {
        const isLast = index === replies.length - 1;

        return (
          <div
            key={reply._id}
            ref={isLast ? lastElementRef : null}
            className="reply-item"
          >
            <CommentItem
              comment={reply}
              postId={postId}
              isReply={true}
              depth={depth}
            />
          </div>
        );
      })}

      {/*  Show loading at bottom while more replies load */}
      {loading && replies.length > 0 && (
        <div className="text-gray-400 text-sm py-2 pl-4">
          Loading more replies...
        </div>
      )}

      {/* End of replies */}
      {!pagination?.hasNextPage && replies.length > 0 && (
        <div className="text-gray-500 text-xs py-2 pl-4">End of replies</div>
      )}

      {/*  Pagination Info */}
      {pagination && pagination.totalPages > 1 && (
        <div
          className="pagination-info text-xs text-gray-500 pl-4 py-1"
          style={{ marginLeft: "20px", marginTop: "10px" }}
        >
          Page {pagination.currentPage} of {pagination.totalPages}
        </div>
      )}
    </div>
  );
};

export default CommentReplies;
