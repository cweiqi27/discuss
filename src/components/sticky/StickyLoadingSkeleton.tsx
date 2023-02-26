const StickyLoadingSkeleton = () => {
  return (
    <div className="h-32 w-full animate-pulse rounded bg-gradient-to-r from-zinc-50/5 to-zinc-50/10 p-4">
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

export default StickyLoadingSkeleton;
