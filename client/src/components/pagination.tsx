import React from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

interface PaginationProps {
  currentPage: number;
  isNextDisabled: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  isNextDisabled,
  onPageChange,
  className,
}) => {
  const onNext = () => {
    if (!isNextDisabled) {
      onPageChange(currentPage + 1);
    }
  };

  const onPrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div className={twMerge("flex items-center space-x-2", className)}>
      {/* Prev */}
      <button
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onPrev}
        disabled={currentPage === 1}
      >
        <BsChevronLeft />
      </button>
      <div>Page {currentPage}</div>
      {/* Next */}
      <button
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onNext}
        disabled={isNextDisabled}
      >
        <BsChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
