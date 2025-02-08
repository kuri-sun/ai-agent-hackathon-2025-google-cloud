import React, { useEffect } from "react";
import { DraftEmail } from "../models/email";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";
import EmailListSkelton from "../components/email-list-skelton";
import EmailCard from "../components/email-card";
import { BiRevision } from "react-icons/bi";
import { Axios } from "../axios";

export default function ReviewsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [drafts, setDrafts] = React.useState<DraftEmail[]>([]);

  const refreshDrafts = async () => {
    try {
      setLoading(true);
      const res = await Axios.get<
        ApiResponse<{
          drafts: DraftEmail[];
        }>
      >("/emails/drafts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "x-refresh-token": localStorage.getItem("refreshToken"),
        },
      });

      setDrafts(res.data.data.drafts);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

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
      <div className="fixed h-[40px] w-full flex flex-row items-center justify-start px-4 border-b">
        <button
          className="hover:bg-gray-100 dark:hover:bg-black/60 p-2 rounded-lg"
          onClick={refreshDrafts}
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
                  "rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-black/60 cursor-pointer border-2 ",
                  "focus:border-blue-300 focus:bg-blue-100"
                )}
                onClick={() => onSelectDraftEmail(draft)}
              >
                <EmailCard
                  from={draft.from.text}
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
