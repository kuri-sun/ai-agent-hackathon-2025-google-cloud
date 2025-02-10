import React, { useEffect } from "react";
import { Email } from "../models/email";
import { useNavigate } from "react-router-dom";
import EmailListSkelton from "../components/email-list-skelton";
import EmailCard from "../components/email-card";
import { twMerge } from "tailwind-merge";
import { BiRevision } from "react-icons/bi";
import { Axios } from "../axios";
import Pagination from "../components/pagination";

export default function IndexPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [emails, setEmails] = React.useState<Email[]>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [pageMap, setPageMap] = React.useState<
    Record<number, string | undefined | null>
  >({
    1: null,
  });

  const refreshEmails = async (page: number = 1) => {
    try {
      setLoading(true);

      const pageToken = pageMap[page];
      const res = await Axios.get<
        ApiResponse<{
          messages: Email[];
          nextPageToken: string;
        }>
      >(pageToken ? `/emails?page=${pageToken}` : "/emails", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "x-refresh-token": localStorage.getItem("refreshToken"),
        },
      });
      setEmails(res.data.data.messages);
      setPageMap({ ...pageMap, [page + 1]: res.data.data.nextPageToken });
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const onPageChange = async (page: number) => {
    await refreshEmails(page);
    setCurrentPage(page);
  };

  const onSelectEmail = (email: Email) => {
    navigate(`/inbox/${email.id}`);
  };

  // Fetch a list of emails
  useEffect(() => {
    refreshEmails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col w-5/6 ml-auto">
      {/* Header */}
      <div className="fixed h-[40px] w-5/6 flex flex-row items-center justify-between px-4 border-b">
        <button
          className="hover:bg-gray-100 dark:hover:bg-black/60 p-2 rounded-lg"
          onClick={() => refreshEmails(currentPage)}
        >
          <BiRevision size={20} />
        </button>
        <Pagination
          currentPage={currentPage}
          isNextDisabled={!pageMap[currentPage + 1]}
          onPageChange={onPageChange}
        />
      </div>
      {loading ? (
        <EmailListSkelton />
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 h-[calc(100vh-92px)] mt-[40px] p-2  overflow-y-auto">
            {emails.map((email) => (
              <button
                key={email.id}
                className={twMerge(
                  "rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-black/60 cursor-pointer border-2 focus:border-blue-300 focus:bg-blue-100"
                )}
                onClick={() => onSelectEmail(email)}
              >
                <EmailCard
                  from={email.from.text}
                  date={email.date}
                  subject={email.subject}
                  text={email.text}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
