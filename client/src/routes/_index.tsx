import React, { useEffect } from "react";
import { Email } from "../models/email";
import { useNavigate } from "react-router-dom";
import EmailListSkelton from "../components/email-list-skelton";
import EmailCard from "../components/email-card";
import { twMerge } from "tailwind-merge";
import { useEmail } from "../context/email-provider";
import { BiRevision } from "react-icons/bi";

export default function IndexPage() {
  const navigate = useNavigate();
  const { loading, emails, refreshEmails } = useEmail();

  // Fetch a list of emails
  useEffect(() => {
    refreshEmails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectEmail = (email: Email) => {
    navigate(`/inbox/${email.id}`);
  };

  return (
    <div className="flex flex-col w-5/6 ml-auto">
      {/* Header */}
      <div className="fixed h-[40px] w-full bg-gray-50 flex flex-row items-center justify-start px-4 border-b">
        <button
          className="hover:bg-gray-100 p-2 rounded-lg"
          onClick={() => refreshEmails(true)}
        >
          <BiRevision size={20} />
        </button>
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
                  "bg-white rounded-lg p-4 hover:bg-gray-100 cursor-pointer border-2 ",
                  "focus:border-blue-300 focus:bg-blue-100"
                )}
                onClick={() => onSelectEmail(email)}
              >
                <EmailCard
                  from={email.from.text}
                  to={email.to.text}
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
