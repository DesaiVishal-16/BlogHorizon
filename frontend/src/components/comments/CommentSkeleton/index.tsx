

const CommentSkeleton = () => {

    return (
        <div className="space-y-4">
          {
            Array(3).fill(0).map((_,i)=>(
              <div key={i} className="animate-pulse p-4 border border-gray-500 rounded-md bg-gray-800 rounded-xl">
                <div className="h-4 w-1/3 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 w-full bg-gray-700 rounded"></div>
              </div>
            ))
          }
        </div>
    )
};

export default CommentSkeleton;