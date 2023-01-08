import Card from "components/layout/Card";

const PostLoadingSkeleton = () => {
  return (
    <Card
      isFlexRow
      addStyles="animate-pulse background-blur gap-8 mb-2 w-full border-[0.25px] border-zinc-200/40 bg-gradient-to-br from-zinc-50/5 to-zinc-50/10 shadow"
    >
      {/* Avatar  */}
      <div className="h-20 w-20 rounded-full bg-gray-400"></div>
      {/* Title */}
      <div className="flex-1 space-y-6 py-1">
        {/* Flair */}
        <div className="flex gap-2">
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
    </Card>
  );
};

export default PostLoadingSkeleton;
