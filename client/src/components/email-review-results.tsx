import { BiMessageDots } from "react-icons/bi";
// import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import React from "react";
import { ReviewResult } from "../models/review-result";
import { t } from "i18next";

export default function EmailReviewResults({
  reviewResult,
}: {
  reviewResult: ReviewResult;
}) {
  // const [isOpenReview, setIsOpenReview] = React.useState(true);

  return (
    <div
      // onClick={onClickCodeReviewBox}
      className="flex flex-col px-6 py-4 border rounded-xl mt-4 mx-4 "
    >
      <div className="w-full flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2 font-light">
          <span>{t("Reviews from Co-Email")}</span>
          <BiMessageDots size={18} />
        </div>
        {/* <div onClick={onClickCodeReviewBox}>
          {isOpenReview ? (
            <BsChevronDown size={20} />
          ) : (
            <BsChevronUp size={20} />
          )}
        </div> */}
      </div>
      <div
        className={twMerge(
          "flex flex-col gap-2 mt-6"
          // isOpenReview ? "mt-6" : "hidden"
        )}
      >
        {reviewResult
          ? reviewResult.reviews.map((review, index) => (
              <div
                key={index}
                className="w-full flex text-start items-center gap-2 text-sm py-2 px-3 border-2 border-red-500 rounded-lg"
              >
                {/* <CgDanger size={20} className="text-red-500" /> */}
                <span className="font-semibold">{review.comment}</span>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
