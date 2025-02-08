export default function EmailListSkelton({
  itemNumber = 8,
}: {
  itemNumber?: number;
}) {
  return (
    <div className="flex flex-col gap-2 h-[calc(100vh-92px)] mt-[40px] p-2 overflow-y-auto">
      {[...Array(itemNumber)].map((_, index) => (
        <div
          key={index}
          className="bg-gray-200 animate-pulse rounded-lg p-4 border-2"
        >
          <div className="flex justify-between">
            {/* Skeleton for From */}
            <div className="w-32 h-4 bg-gray-300 rounded"></div>
            {/* Skeleton for Date */}
            <div className="w-16 h-4 bg-gray-300 rounded"></div>
          </div>
          {/* Skeleton for Subject */}
          <div className="w-48 h-5 bg-gray-300 rounded mt-2"></div>
          {/* Skeleton for Body */}
          <div className="w-full h-12 bg-gray-300 rounded mt-1"></div>
        </div>
      ))}
    </div>
  );
}
