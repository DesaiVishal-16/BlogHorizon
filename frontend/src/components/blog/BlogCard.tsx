import { useEffect, useState } from "react";
import default_thumbnail from "../../assets/default_thumbnail.png";
import { PrimaryButton } from "../Buttons";
import { Icons } from "../icons";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import defaultProfileImg from "../../assets/user-profile-img.jpg";
import { useNavigate } from "react-router-dom";
import { useDate } from "../../utils";
import {
  fetchCommentCount,
  selectCommentCount,
} from "../../store/slices/commentsSlice";
import PostAction from "../PostAction";
import { User } from "../../store/slices/authSlice/types";
import { fetchUsers } from "../../store/slices/usersSlice";

interface BlogCardProps {
  thumbnail?: string;
  title: string;
  tags?: string[];
  uploaded_date: string;
  readTime: number;
  profileImg: string | undefined;
  author: User | undefined;
  postId: string;
  likes: number;
  likedBy: string[];
}

const BlogCard = ({
  thumbnail,
  title,
  uploaded_date,
  tags,
  readTime,
  profileImg,
  author,
  postId,
  likes = 0,
  likedBy = [],
}: BlogCardProps) => {
  const commentCount = useAppSelector((state) =>
    selectCommentCount(state, postId)
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { error: postError } = useAppSelector((state) => state.posts);
  const [imgLoaded, setImgLoaded] = useState(false);

  const authorName = author?.username || "";

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCommentCount(postId));
  }, [dispatch, postId]);

  const formattedDate = useDate({
    dateInput: uploaded_date,
    format: "Month DD",
  });
  const handleReadPost = () => {
    if (!author) return;
    sessionStorage.setItem("currentAuthor", JSON.stringify(author));
    sessionStorage.setItem("currentPostId", postId);
    navigate(`/profile/${authorName}/${postId}`, {
      state: { author, postId },
    });
  };

  return (
    <div
      className="post-card relative w-full h-full bg-[#1c1f26] flex flex-col justify-between gap-4 px-4 pt-4 pb-2 
      rounded-xl border border-gray-600 shadow-md cursor-pointer group/card hover:border hover:border-gray-500"
    >
      <div className="profile-img w-8 h-8 rounded-full relative overflow-hidden">
        {imgLoaded ? (
          <img
            src={defaultProfileImg}
            alt="fallback"
            className="w-full h-full object-cover rounded-full absolute top-0 left-0"
          />
        ) : (
          <img
            onLoad={() => setImgLoaded(true)}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 rounded-full 
            ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            src={profileImg || defaultProfileImg}
            alt="profile-img"
          />
        )}
      </div>

      <div className="read-post absolute top-5 right-5 hidden group-hover/card:flex transition-opacity duration-200">
        <PrimaryButton
          onClick={handleReadPost}
          name="Read post"
          className="text-sm bg-gray-100 !text-gray-900 !font-bold order-1 rounded-xl p-2 hover:bg-gray-400"
          icon={<Icons.ShareLink className="text-xl font-black order-2" />}
          iconPosition="right"
        />
      </div>

      <div className="title min-h-[4.5rem]">
        <h4 title={title} className="text-xl font-bold line-clamp-3">
          {title}
        </h4>
      </div>

      <div className="content-info flex flex-col justify-between gap-2">
        <div className="flex flex-col gap-2">
          <ul className="tags min-h-[2rem] flex items-center gap-2 overflow-hidden">
            {tags?.map((tag, i) => (
              <li
                key={i}
                className="bg-transparent border border-gray-600 px-2 text-gray-400 rounded-md text-sm"
              >
                #{tag}
              </li>
            ))}
          </ul>

          <p className="flex items-center gap-2">
            <span className="date-uploaded text-xs text-gray-300 pl-2">
              {formattedDate}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-xs text-gray-300">{readTime}m read time</span>
          </p>

          <div className="thumbanil-wrapper w-full h-40 overflow-hidden rounded-xl">
            <img
              className="thumbnail w-full h-full object-cover"
              src={
                thumbnail && thumbnail.trim() !== ""
                  ? thumbnail
                  : default_thumbnail
              }
              alt="thumbnail"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <PostAction
            postId={postId}
            likes={likes}
            likedBy={likedBy}
            commentCount={commentCount}
          />
        </div>
      </div>

      {postError && (
        <div className="text-red-400 text-xs mt-1">{postError}</div>
      )}
    </div>
  );
};

export default BlogCard;
