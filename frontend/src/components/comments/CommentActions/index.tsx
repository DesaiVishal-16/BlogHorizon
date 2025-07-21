import { CommentAction, UpvoteAction } from "../../PostAction";

type TCommentActions = {
  commentId: string;
  likes: number;
  likedBy: string[];
  commenCount: number;
  onReplyClick?: () => void;
};

const CommentActions: React.FC<TCommentActions> = ({
  commentId,
  likes,
  likedBy,
  commenCount,
  onReplyClick,
}) => {
  return (
    <div className="comment-action flex items-cemter gap-4">
      <div className="flex">
        <UpvoteAction
          id={commentId}
          type="comment"
          likes={likes}
          likedBy={likedBy}
        />
      </div>
      <div className="flex">
        <CommentAction count={commenCount} onClick={onReplyClick} />
      </div>
      {likes > 0 && (
        <button className="comment-upvotes ml-auto cursor-pointer">
          {likes} upvotes
        </button>
      )}
    </div>
  );
};

export default CommentActions;
