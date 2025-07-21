import { useAuth } from "../../../hooks";
import CommentForm from "../CommentForm";
import CommentList from "../CommentList";

type TCommentSection = {
  postId: string;
  isCommentClicked?: boolean;
  onCommentToggle?: (value: boolean) => void;
};

const CommentSection: React.FC<TCommentSection> = ({
  postId,
  isCommentClicked,
  onCommentToggle,
}) => {
  const user = useAuth();
  return (
    <div className="comment-section flex flex-col gap-8">
      <div className="add-comment">
        <CommentForm
          img={user?.img}
          postId={postId}
          isClick={isCommentClicked}
          onToggle={onCommentToggle}
        />
      </div>
      <div>
        <CommentList postId={postId} />
      </div>
    </div>
  );
};

export default CommentSection;
