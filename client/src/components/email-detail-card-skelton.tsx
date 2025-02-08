export default function EmailDetailCardSkelton({
  itemNumber = 8,
}: {
  itemNumber?: number;
}) {
  return (
    <div className="flex flex-col gap-2 h-[calc(100vh-92px)] mt-[40px] p-2 overflow-y-auto">
      {[...Array(itemNumber)].map((_, index) => (
        <div
          key={index}
          className="bg-white py-4 px-6 m-4 border shadow-md rounded-lg animate-pulse"
        >
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="flex justify-between pb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-40 mb-1"></div>
                <div className="h-3 bg-gray-300 rounded w-24"></div>
              </div>
            </div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </div>
      ))}
    </div>
  );
}
