import React, { useEffect } from "react";
import { DraftEmail } from "../models/email";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";
import EmailListSkelton from "../components/email-list-skelton";
import EmailCard from "../components/email-card";
import { useEmail } from "../context/email-provider";
import { BiRevision } from "react-icons/bi";

export default function ReviewsPage() {
  const navigate = useNavigate();
  const { loading, drafts, refreshDrafts } = useEmail();

  // Fetch a list of drafts
  useEffect(() => {
    refreshDrafts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectDraftEmail = (draft: DraftEmail) => {
    navigate(`/reviews/${draft.draftId}`);
  };

  return (
    <div className="flex flex-col w-5/6 ml-auto">
      {/* Header */}
      <div className="fixed h-[40px] w-full bg-gray-50 flex flex-row items-center justify-start px-4 border-b">
        <button
          className="hover:bg-gray-100 p-2 rounded-lg"
          onClick={() => refreshDrafts(true)}
        >
          <BiRevision size={20} />
        </button>
      </div>
      {loading ? (
        <EmailListSkelton />
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 h-[calc(100vh-92px)] mt-[40px] p-2 overflow-y-auto">
            {drafts.map((draft, index) => (
              <button
                key={index}
                className={twMerge(
                  "bg-white rounded-lg p-4 hover:bg-gray-100 cursor-pointer border-2 ",
                  "focus:border-blue-300 focus:bg-blue-100"
                )}
                onClick={() => onSelectDraftEmail(draft)}
              >
                <EmailCard
                  from={draft.from.text}
                  to={draft.to.text}
                  date={draft.date}
                  subject={draft.subject}
                  text={draft.text}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
