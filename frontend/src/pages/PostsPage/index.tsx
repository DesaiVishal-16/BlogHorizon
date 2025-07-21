import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchMorePosts,
  fetchPosts,
  resetPagination,
} from "../../store/slices/postSlice";
import getReadMin from "../../utils/useExtraFnc/readPerMin";
import BlogCard from "../../components/blog/BlogCard";
import { fetchMe } from "../../store/slices/authSlice";
import BlogSkeleton from "../../components/blog/BlogSkeleton";

const Posts = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);
  const {
    posts,
    loading,
    error,
    loadingMore,
    currentPage,
    hasMore,
    totalPages,
  } = useAppSelector((state) => state.posts);

  const observeRef = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    dispatch(resetPagination());
    dispatch(fetchPosts());
    isInitialLoad.current = false;
  }, [dispatch]);

  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || loadingMore) {
        return;
      }

      if (observeRef.current) {
        observeRef.current.disconnect();
      }

      observeRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingMore) {
            dispatch(fetchMorePosts(currentPage + 1));
          }
        },
        {
          threshold: 0.1,
          rootMargin: "300px",
        }
      );

      if (node) {
        observeRef.current.observe(node);
      }

      lastPostElementRef.current = node;
    },
    [loading, loadingMore, hasMore, currentPage, totalPages, dispatch]
  );

  useEffect(() => {
    return () => {
      if (observeRef.current) {
        observeRef.current.disconnect();
      }
    };
  }, []);

  if (loading && posts.length === 0)
    return (
      <div className="grid grid-cols-3 gap-y-10 gap-x-8 mt-10">
        {[...Array(6)].map((_, i) => (
          <BlogSkeleton key={i} />
        ))}
      </div>
    );

  if (error && posts.length === 0)
    return (
      <div className="text-white py-28 px-40 text-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  return (
    <div className="text-white py-28 px-40">
      <div className="grid grid-cols-3 gap-y-10 gap-x-8 auto-rows-fr">
        {posts.length > 0 ? (
          posts.map((post, idx) => {
            const author = users.find((user) => user._id === post.author);
            const isLast = idx === posts.length - 1;

            return (
              <div
                key={`${post._id}-${idx}`} // Use unique key
                ref={isLast ? lastPostRef : null}
                className="h-full"
              >
                <BlogCard
                  title={post.title}
                  thumbnail={post.thumbnail}
                  uploaded_date={post.createdAt}
                  tags={post.tags}
                  readTime={getReadMin(post.content)}
                  profileImg={author?.img}
                  author={author}
                  postId={post?._id}
                  likes={post?.likes}
                  likedBy={post?.likedBy}
                />
              </div>
            );
          })
        ) : (
          <div className="col-span-3 text-center py-20">
            <div className="text-gray-400">No post found</div>
          </div>
        )}
      </div>

      {loadingMore && (
        <div className="grid grid-cols-3 gap-y-10 gap-x-8 mt-10">
          {[...Array(6)].map((_, i) => (
            <BlogSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-10 text-gray-400">
          No more posts to load
        </div>
      )}

      {error && posts.length > 0 && (
        <div className="text-center py-10 text-red-400">
          Error loading more posts: {error}
        </div>
      )}
    </div>
  );
};

export default Posts;
