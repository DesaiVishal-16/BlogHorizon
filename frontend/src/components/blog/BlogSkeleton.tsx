const BlogSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      {/* Skeleton Blog Card - matching your BlogCard structure */}
      <div className="post-card relative w-full bg-[#1c1f26] flex flex-col justify-between gap-4 px-4 pt-4 pb-2 rounded-xl border border-gray-600 shadow-md">
        {/* Skeleton Profile Image (top left) */}
        <div className="w-8 h-8 rounded-full bg-gray-700"></div>

        {/* Skeleton Read Post Button (top right) */}
        <div className="absolute top-5 right-5 h-8 w-20 bg-gray-700 rounded-xl"></div>

        {/* Skeleton Title */}
        <div className="title min-h-[4.5rem]">
          <div className="h-6 bg-gray-700 rounded w-full"></div>
        </div>

        {/* Skeleton Content Info */}
        <div className="content-info flex flex-col justify-between gap-2">
          <div className="flex flex-col gap-2">
            {/* Skeleton Tags */}
            <div className="tags">
              <div className="h-6 bg-gray-700 rounded w-full"></div>
            </div>

            {/* Skeleton Date and Read Time */}
            <div className="flex items-center gap-2">
              <div className="h-3 bg-gray-700 rounded w-16"></div>
              <div className="w-1 h-1 rounded-full bg-gray-700"></div>
              <div className="h-3 bg-gray-700 rounded w-20"></div>
            </div>

            {/* Skeleton Thumbnail */}
            <div className="thumbanil-wrapper w-full h-40 overflow-hidden rounded-xl">
              <div className="w-full h-full bg-gray-700"></div>
            </div>
          </div>

          {/* Skeleton Post Actions (likes, comments) */}
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-700 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSkeleton;
