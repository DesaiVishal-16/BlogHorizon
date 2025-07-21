import { useAppDispatch } from "../../../store/hooks";
import { updateLikePost } from "../../../store/slices/postSlice";
import { toggleCommentLike } from "../../../store/slices/commentsSlice";
import { PrimaryButton } from "../../Buttons";
import { Icons } from "../../icons";
import TitleHover from "../../hover/TitleHover";
import { useAuth } from "../../../hooks";
import { useCallback, useMemo, useState } from "react";

type UpvoteTargetType = "post" | "comment";

interface UpvoteProps {
  id: string;
  type: UpvoteTargetType;
  likes: number;
  likedBy: string[];
  isShowCount?: boolean;
}

const UpvoteAction = ({
  id,
  type,
  likes,
  likedBy,
  isShowCount = true,
}: UpvoteProps) => {
  const currentUser = useAuth();
  const currentUserId = currentUser?._id;
  const dispatch = useAppDispatch();
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const liked = useMemo(() => {
    return !!currentUserId && likedBy.includes(currentUserId);
  }, [likedBy, currentUserId]);

  const handleLike = useCallback(async () => {
    if (!currentUserId || isLikeLoading) {
      console.warn("Must be logged in and not loading.");
      return;
    }

    setIsLikeLoading(true);

    try {
      if (type === "post") {
        await dispatch(updateLikePost(id)).unwrap();
      } else if (type === "comment") {
        await dispatch(toggleCommentLike(id)).unwrap();
      }
    } catch (err) {
      console.error("Like update failed:", err);
      alert("⚠ Failed to update vote. Try again.");
    } finally {
      setIsLikeLoading(false);
    }
  }, [type, id, currentUserId, isLikeLoading, dispatch]);

  return (
    <div className="flex items-center gap-2">
      <div
        onClick={handleLike}
        className={`flex items-center rounded-xl pr-2 hover:bg-emerald-800 group transition-colors px-1 py-1 ${
          liked ? "bg-emerald-800 text-green-500" : ""
        } ${
          isLikeLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <PrimaryButton
          disabled={isLikeLoading}
          icon={
            <Icons.UpVoteBefore
              className={`text-2xl transition-colors ${
                liked
                  ? "text-green-500"
                  : "text-gray-400 group-hover:text-green-500"
              }`}
            />
          }
          className="bg-transparent hover:bg-transparent"
        />
        {isShowCount && (
          <b
            className={`ml-1 transition-colors text-sm ${
              liked
                ? "text-green-500"
                : "text-gray-400 group-hover:text-green-500"
            }`}
          >
            {likes}
          </b>
        )}
        <TitleHover title={liked ? "Unlike" : "Upvote"} />
      </div>

      {/* Optional Downvote UI */}
      <div className="hover:bg-red-900 rounded-xl group relative">
        <PrimaryButton
          icon={
            <Icons.DownVoteBefore className="text-gray-500 text-2xl group-hover:text-red-500" />
          }
          className="bg-transparent hover:bg-transparent"
        />
        <TitleHover title="Downvote" />
      </div>
    </div>
  );
};

export default UpvoteAction;
