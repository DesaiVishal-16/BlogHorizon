import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchPostComments,
  loadMoreComments,
  selectCommentsPagination,
  selectPostComments,
} from "../../../store/slices/commentsSlice";
import CommentItem from "../CommentItem";
import CommentSkeleton from "../CommentSkeleton";
import { UseInfiniteScroll } from "../../../hooks";

type TCommentList = {
  postId: string;
};

const CommentList: React.FC<TCommentList> = ({ postId }) => {
  const comments =
    useAppSelector((state) => selectPostComments(state, postId)) || [];

  const validComments = comments.filter((comment) => comment && comment._id);

  const loading = useAppSelector((state) => state.comments.loading);
  const dispatch = useAppDispatch();
  const pagination = useAppSelector((state) =>
    selectCommentsPagination(state, postId)
  );

  useEffect(() => {
    dispatch(fetchPostComments({ postId: postId, page: 1 }));
  }, [dispatch, postId]);

  const handleLoadMore = useCallback(() => {
    if (pagination && pagination.hasNextPage && !loading) {
      dispatch(
        loadMoreComments({
          postId,
          page: pagination.currentPage + 1,
        })
      );
    }
  }, [dispatch, postId, pagination, loading]);

  const { lastElementRef } = UseInfiniteScroll({
    loading,
    hasMore: pagination?.hasNextPage || false,
    onLoadMore: handleLoadMore,
    threshold: 200,
  });

  if (loading && validComments.length === 0) return <CommentSkeleton />;

  if (!validComments.length && !loading)
    return (
      <div className="text-center py-8 text-gray-500">
        No comments yet. Be the first to comment!
      </div>
    );

  return (
    <section className="comments-list flex flex-col gap-4">
      {validComments.length > 0 &&
        validComments.map((comment, index) => {
          if (!comment || !comment._id) {
            console.warn("Invalid comment at index:", index);
            return null;
          }

          const isLastComment = index === validComments.length - 1;

          if (isLastComment) {
            return (
              <div key={comment._id} ref={lastElementRef}>
                <CommentItem comment={comment} postId={postId} />
              </div>
            );
          }

          return (
            <div key={comment._id}>
              <CommentItem comment={comment} postId={postId} />
            </div>
          );
        })}

      {!pagination?.hasNextPage && validComments.length > 0 && (
        <div className="text-center py-4 text-gray-400 text-sm">
          You've reached the end of comments
        </div>
      )}
    </section>
  );
};

export default CommentList;
