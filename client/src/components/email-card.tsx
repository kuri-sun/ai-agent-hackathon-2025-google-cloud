import React from "react";
import { formatDate } from "../utils/format";
import { useTranslation } from "react-i18next";

export default function EmailCard({
  from,
  date,
  subject,
  text,
}: {
  from: string;
  date: string;
  subject: string;
  text: string;
}) {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex justify-between">
        {/* From */}
        <div className="text-start">
          <p className="text-sm font-light">{from}</p>
        </div>
        {/* Date */}
        <p className="text-xs text-gray-500">{t(formatDate(date))}</p>
      </div>
      {/* Subject */}
      <h3 className="text-sm text-start font-semibold mt-2">{subject}</h3>
      {/* Body */}
      <p className="text-xs text-start text-gray-600 mt-1 line-clamp-5">
        {text}
      </p>
    </>
  );
}
