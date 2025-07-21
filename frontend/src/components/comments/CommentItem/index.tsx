import { formatDistanceToNow } from "date-fns";
import defaultProfileImg from "../../../assets/user-profile-img.jpg";
import CommentActions from "../CommentActions";
import { CommentType } from "../../../store/slices/commentsSlice/types";
import CommentReplies from "../CommentReplies";
import { useAppSelector } from "../../../store/hooks";
import { selectRepliesPagination } from "../../../store/slices/commentsSlice";
import { PrimaryButton } from "../../Buttons";
import { useState } from "react";
import { Icons } from "../../icons";
import CommentForm from "../CommentForm";
import { useAuth } from "../../../hooks";

type TCommentItem = {
  postId: string;
  comment: CommentType;
  isReply?: boolean;
  depth?: number;
};

const CommentItem: React.FC<TCommentItem> = ({
  postId,
  comment,
  isReply = false,
  depth = 0,
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false); // ✅ new state
  const user = useAuth();

  const pagination = useAppSelector((state) =>
    selectRepliesPagination(state, comment._id)
  );

  const repliesCount = pagination?.totalReplies || comment.replies?.length || 0;

  if (!comment || (!isReply && comment.parentComment !== null)) return null;

  const dateStr = new Date(comment.createdAt);
  const timeAgo = formatDistanceToNow(dateStr, { addSuffix: true });

  const handleLoadReplies = () => setShowReplies(true);
  const toggleReplyForm = () => setShowReplyForm((prev) => !prev);

  const getIndentationClass = (depth: number) => {
    if (depth === 0) return "";
    const indentValue = Math.min(depth * 4, 16);
    return `ml-${indentValue}`;
  };
  const indentationClass = getIndentationClass(depth);

  return (
    <article
      className={`comment-item ${indentationClass} flex flex-col gap-2 border border-gray-500 bg-gray-900 hover:bg-gray-800 px-4 py-4 rounded-xl`}
    >
      <header className="comment-header flex items-center gap-4">
        <a href="#" className="w-10">
          <img
            src={comment.author?.avatar || defaultProfileImg}
            className="object-cover rounded-xl w-10 h-10"
            alt={`${comment.author?.username || "User"}'s profile picture`}
          />
        </a>
        <div className="name-email flex items-center gap-2">
          <span className="commentor-name text-lg font-medium">
            <a href="#">{comment.author?.username}</a>
          </span>
          <span className="commentor-email text-gray-400 text-sm">
            <a href="#">@{comment.author?.email?.split("@")[0]}</a>
          </span>
        </div>
        <div className="time flex items-center gap-4 text-gray-400 text-xs">
          <span className="w-1 h-1 rounded-full bg-gray-500" />
          <time title={comment.createdAt}>{timeAgo}</time>
        </div>
      </header>

      <div className="flex flex-col gap-4">
        <div className="comment pl-2">
          <p className="comment-text text-lg font-semibold">
            {comment.content}
          </p>
        </div>

        {/* ✅ Pass toggleReplyForm to CommentActions */}
        <CommentActions
          commentId={comment._id}
          likes={comment.likes}
          likedBy={comment.likedBy}
          commenCount={repliesCount}
          onReplyClick={toggleReplyForm}
        />
      </div>

      {/* ✅ Reply Form */}
      {showReplyForm && (
        <div className="ml-8 mt-2">
          <CommentForm
            img={user?.img}
            postId={postId}
            parentCommentId={comment._id}
            isClick={true}
            onToggle={setShowReplyForm}
          />
        </div>
      )}

      {/* Load replies button */}
      {repliesCount > 0 && !showReplies && (
        <div className="ml-5">
          <PrimaryButton
            icon={
              <Icons.DropDownLine className="text-4xl absolute left-[-18px] top-0" />
            }
            className="relative bg-transparent hover:bg-transparent text-sm !text-blue-500"
            name={`${repliesCount} ${repliesCount === 1 ? "reply" : "replies"}`}
            onClick={handleLoadReplies}
          />
        </div>
      )}

      {/* Replies container */}
      {showReplies && (
        <div className="replies-container text-white">
          <CommentReplies
            parentCommentId={comment._id}
            postId={postId}
            showReplies={showReplies}
            depth={depth + 1}
          />
        </div>
      )}
    </article>
  );
};

export default CommentItem;
