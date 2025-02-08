export const BeatLoader = ({ text }: { text: string }) => {
  return (
    <div className="absolute inset-0 z-[51] flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col gap-8 items-center bg-neutral-700 pt-20 pb-14 px-16 rounded-lg">
        <div className="flex space-x-2">
          <div className="w-5 h-5 bg-white rounded-full animate-bounce [animation-delay:-0.1s]"></div>
          <div className="w-5 h-5 bg-white rounded-full animate-bounce"></div>
          <div className="w-5 h-5 bg-white rounded-full animate-bounce [animation-delay:0.1s]"></div>
        </div>
        <p className="text-white font-bold text-lg">{text}</p>
      </div>
    </div>
  );
};
