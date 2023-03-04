const PostLoadingSkeleton = () => {
  return (
    <div
      className="background-blur h-52 animate-pulse grid-flow-col grid-cols-[auto_1fr] gap-8 rounded-md border-[0.25px] 
      border-zinc-200/40 bg-gradient-to-br from-zinc-50/5 to-zinc-50/10 p-4 shadow sm:grid sm:w-[36rem]"
    >
      {/* Top row  */}
      <div className="flex items-center gap-2 sm:items-start">
        {/* Avatar */}
        <div className="h-12 w-12 rounded-full bg-gray-400" />
        {/* Flairs */}
        <div className="flex gap-2 sm:hidden">
          <div className="rounded-full bg-white/10 px-4 py-2" />
          <div className="rounded-full bg-white/10 px-4 py-2" />
        </div>
      </div>
      {/* Bottom row */}
      <div className="space-y-6 py-1">
        {/* Title */}
        <div className="hidden gap-2 sm:flex">
          <div className="rounded-full bg-white/10 px-4 py-2" />
          <div className="rounded-full bg-white/10 px-4 py-2" />
        </div>
        <div className="h-4 rounded bg-white/10"></div>
        {/* Description */}
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 h-4 rounded bg-white/10"></div>
            <div className="col-span-1 h-4 rounded bg-white/10"></div>
          </div>
          <div className="h-4 rounded bg-white/10"></div>
        </div>
      </div>
    </div>
  );
};

export default PostLoadingSkeleton;
