const CommentLoadingSkeleton = () => {
  return (
    <div
      className="background-blur h-24 animate-pulse grid-flow-col grid-cols-[auto_1fr] 
    gap-8 p-4 shadow sm:grid"
    >
      {/* Top row */}
      <div className="flex justify-between">
        {/* Avatar */}
        <div className="h-9 w-9 rounded-full bg-gray-400" />
      </div>
      {/* Content */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 h-4 rounded bg-white/10"></div>
          <div className="col-span-1 h-4 rounded bg-white/10"></div>
        </div>
        <div className="h-4 rounded bg-white/10"></div>
      </div>
    </div>
  );
};

export default CommentLoadingSkeleton;
