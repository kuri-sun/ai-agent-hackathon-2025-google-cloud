import React from "react";
import { useTranslation } from "react-i18next";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

interface PaginationProps {
  currentPage: number;
  isNextDisabled: boolean;
  onPageChange: (page: number) => Promise<void>;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  isNextDisabled,
  onPageChange,
  className,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);

  const onNext = async () => {
    if (!isNextDisabled) {
      setLoading(true);
      await onPageChange(currentPage + 1);
      setLoading(false);
    }
  };

  const onPrev = async () => {
    if (currentPage > 1) {
      setLoading(true);
      await onPageChange(currentPage - 1);
      setLoading(false);
    }
  };

  return (
    <div className={twMerge("flex items-center space-x-2", className)}>
      {/* Prev */}
      <button
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onPrev}
        disabled={currentPage === 1 || loading}
      >
        <BsChevronLeft />
      </button>
      <div>
        {t("Page")} {currentPage}
      </div>
      {/* Next */}
      <button
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onNext}
        disabled={isNextDisabled || loading}
      >
        <BsChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
