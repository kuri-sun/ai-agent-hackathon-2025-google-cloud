import React, { useEffect } from "react";
import { Thread } from "../models/email";
import { useNavigate } from "react-router-dom";
import EmailListSkelton from "../components/email-list-skelton";
import EmailCard from "../components/email-card";
import { twMerge } from "tailwind-merge";
import { BiRevision } from "react-icons/bi";
import { Axios } from "../axios";
import Pagination from "../components/pagination";

const MAX_ITEMS_PER_PAGE = 10;

export default function IndexPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [threads, setThreads] = React.useState<Thread[]>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  // FIXME: This pagination logic was intended to comform to for Gmail API
  const [pageMap, setPageMap] = React.useState<
    Record<number, string | undefined | null>
  >({
    1: null,
  });

  const refreshThreads = async (page: number = 1) => {
    try {
      setLoading(true);

      const pageToken = pageMap[page];
      const res = await Axios.get<
        ApiResponse<{
          threads: Thread[];
          nextPageToken: string;
        }>
      >(
        pageToken
          ? `/emails/threads?page=${pageToken}&max=${MAX_ITEMS_PER_PAGE}`
          : `/emails/threads?max=${MAX_ITEMS_PER_PAGE}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "x-refresh-token": localStorage.getItem("refreshToken"),
          },
        }
      );
      setThreads(res.data.data.threads);
      setPageMap({ ...pageMap, [page + 1]: res.data.data.nextPageToken });
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const onPageChange = async (page: number) => {
    await refreshThreads(page);
    setCurrentPage(page);
  };

  const onSelectThread = (threadId: string) => {
    navigate(`/inbox/${threadId}`);
  };

  // Fetch a list of emails
  useEffect(() => {
    refreshThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col w-5/6 ml-auto">
      {/* Header */}
      <div className="fixed h-[40px] w-5/6 flex flex-row items-center justify-between px-4 border-b">
        <button
          className="hover:bg-gray-100 dark:hover:bg-black/60 p-2 rounded-lg"
          onClick={() => refreshThreads(currentPage)}
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
            {threads.map((thread) => (
              <button
                key={thread.id}
                className={twMerge(
                  "rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-black/60 cursor-pointer border-2 focus:border-blue-300 focus:bg-blue-100"
                )}
                onClick={() => onSelectThread(thread.id)}
              >
                {thread.messages[0] ? (
                  <EmailCard
                    from={thread.messages[0].from.text}
                    date={thread.messages[0].date}
                    subject={thread.messages[0].subject}
                    text={thread.messages[0].snippet}
                  />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
