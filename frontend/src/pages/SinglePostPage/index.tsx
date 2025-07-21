import { useLocation, useParams } from "react-router-dom";
import UserDetailCard from "../../components/cards/UserDetailCard";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect, useState } from "react";
import { fetchPosts } from "../../store/slices/postSlice";
import { BlogContentReader } from "../../components";
import { useDate } from "../../utils";
import {
  BookMarkAction,
  CommentAction,
  CopyLinkAction,
  UpvoteAction,
} from "../../components/PostAction";
import { selectCommentCount } from "../../store/slices/commentsSlice";
import { CommentSection } from "../../components/comments";
import { User } from "../../store/slices/authSlice/types";
import { PrimaryButton } from "../../components/Buttons";

const SinglePostPage = () => {
  const { posts, loading, error } = useAppSelector((state) => state.posts);
  const [isCommentClick, setIsCommentClick] = useState<boolean>(false);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  const [author, setAuthor] = useState<User | null>(null);
  const dispatch = useAppDispatch();
  const { postId } = useParams();
  const location = useLocation();
  const state = location.state as {
    author?: User;
    postId?: string;
  };

  const actualPostId = state?.postId || postId;
  const post = posts.find((post) => post._id === actualPostId);

  const commentCount = useAppSelector((state) =>
    selectCommentCount(state, actualPostId)
  );

  useEffect(() => {
    if (posts.length === 0 && !loading) {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts.length, loading]);

  useEffect(() => {
    if (state?.author) {
      setAuthor(state.author);
      sessionStorage.setItem("currentAuthor", JSON.stringify(state.author));
      sessionStorage.setItem("currentPostId", actualPostId || "");
    } else if (actualPostId) {
      const storedAuthor = sessionStorage.getItem("currentAuthor");
      const storedPostId = sessionStorage.getItem("currentPostId");
      if (storedAuthor && storedPostId === actualPostId) {
        try {
          setAuthor(JSON.parse(storedAuthor));
        } catch (error) {
          console.error("Error parsing stored author:", error);
          sessionStorage.removeItem("currentAuthor");
          sessionStorage.removeItem("currentPostId");
        }
      }
    }
  }, [state?.author, actualPostId]);

  // Cleanup sessionStorage on unmount
  useEffect(() => {
    return () => {
      if (!state?.author) {
        sessionStorage.removeItem("currentAuthor");
        sessionStorage.removeItem("currentPostId");
      }
    };
  }, [state?.author]);

  // Loading states
  if (loading) {
    return (
      <div className="text-white flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading post...</div>
      </div>
    );
  }

  // Error states
  if (error) {
    return (
      <div className="text-white flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-white flex justify-center items-center min-h-screen">
        <div className="text-xl">Post not found</div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="text-white flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading author...</div>
      </div>
    );
  }

  const postCreatedDate = useDate({
    dateInput: post.createdAt,
    format: "Month DD",
  });

  const joinedAt = useDate({
    dateInput: author.createdAt,
    format: "Mon DD YYYY",
  });

  return (
    <div className="single-post-page text-white px-40 flex gap-6">
      <div className="post-detail flex flex-col gap-10 w-full border border-gray-600 px-10 pb-40">
        <div className="author-detail flex items-center pt-10">
          <UserDetailCard
            userName={author.username}
            userEmail={author.email}
            userImg={author.img}
            date={postCreatedDate}
            onLoaded={() => setImgLoaded(true)}
            imgLoaded={imgLoaded}
            className="w-18 h-18"
          />
        </div>

        <div className="content flex flex-col gap-10">
          <div className="title">
            <h1 className="text-4xl font-bold">{post.title}</h1>
          </div>

          {post.thumbnail && (
            <div className="thumbnail w-full">
              <img
                src={post.thumbnail}
                className="rounded-lg"
                alt="thumbnail"
                loading="lazy"
              />
            </div>
          )}

          <div className="article">
            <article className="py-20">
              <BlogContentReader content={post.content} post={post} />
            </article>
          </div>
        </div>

        <div className="comments flex flex-col gap-4">
          <div className="flex items-center gap-10 text-gray-400 font-semibold">
            <h4 className="upvotes count">{post.likes} Upvotes</h4>
            <h4>{commentCount} Comments</h4>
          </div>

          <div className="flex items-center justify-between border border-gray-700 rounded-xl p-2">
            <div className="post-actions flex border border-gray-500 rounded-xl bg-gray-800">
              <UpvoteAction
                id={post._id}
                type="post"
                likes={post.likes}
                likedBy={post.likedBy}
                isShowCount={false}
              />
            </div>
            <CommentAction
              onClick={() => setIsCommentClick(true)}
              isShowCount={false}
              name="Comment"
            />
            <BookMarkAction isShowText={true} />
            <CopyLinkAction isShowText={true} />
          </div>

          <div className="show-all-comments">
            <CommentSection
              postId={post._id}
              isCommentClicked={isCommentClick}
              onCommentToggle={setIsCommentClick}
            />
          </div>
        </div>
      </div>

      <div className="relative my-10 border border-gray-600 h-40 w-md px-4 py-2 rounded-2xl">
        <UserDetailCard
          userName={author.username}
          userEmail={author.email}
          userImg={author.img}
          date={`Joined ${joinedAt}`}
          onLoaded={() => setImgLoaded(true)}
          imgLoaded={imgLoaded}
          className="w-16 h-16"
        />
        <PrimaryButton
          name="Follow"
          className="bg-white !text-[18px] !text-gray-900 hover:bg-gray-400 !font-semibold rounded-xl !px-3
            !transition delay-150 duration-300 ease-in-out absolute right-5 top-5"
        />
      </div>
    </div>
  );
};

export default SinglePostPage;
