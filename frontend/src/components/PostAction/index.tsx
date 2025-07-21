import UpvoteAction from "./UpvoteAction";
import CommentAction from "./CommentAction";
import BookMarkAction from "./BookMarkAction";
import CopyLinkAction from "./CopyLinkAction";

export interface PostActionProps {
  postId: string;
  likes: number;
  likedBy: string[];
  currentUserId?: string;
  commentCount?: number;
  isShowText?: boolean;
  isShowCount?: boolean;
}

const PostAction = ({
  postId,
  likes,
  likedBy,
  commentCount = 0,
}: PostActionProps) => {
  return (
    <>
      <div className="upvotes flex items-center bg-[#272b34] rounded-xl">
        <UpvoteAction id={postId} type="post" likes={likes} likedBy={likedBy} />
      </div>
      <CommentAction count={commentCount} />
      <BookMarkAction />
      <CopyLinkAction />
    </>
  );
};
export { default as UpvoteAction } from "./UpvoteAction";
export { default as CommentAction } from "./CommentAction";
export { default as BookMarkAction } from "./BookMarkAction";
export { default as CopyLinkAction } from "./CopyLinkAction";
export default PostAction;
