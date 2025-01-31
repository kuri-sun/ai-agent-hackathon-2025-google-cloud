import { mockEmails } from "../mock/data";
import React, { useEffect } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Email } from "../models/email";
import { formatDate } from "../utils/format";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";
// import { BiRevision } from "react-icons/bi";

// import { useLocation } from "react-router-dom";

export default function ReviewsPage() {
  const navigate = useNavigate();
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const q = queryParams.get("q") || "";

  const [emails, setEmails] = React.useState<Email[]>([]);
  const getSafeHtml = async (mockEmails: Email[]) => {
    const emails = await Promise.all(
      mockEmails.map(async (email) => {
        const body = email.body;
        const markdownHtml = await marked(body);
        const sanitizedHtml = DOMPurify.sanitize(markdownHtml);
        return { ...email, sanitized: sanitizedHtml };
      })
    );
    return emails;
  };

  useEffect(() => {
    // Fetch data from the API
    // fetch(`/api/posts?q=${q}`)
    //   .then((res) => res.json())
    //   .then((data) => setPosts(data));

    const fetchEmails = async () => {
      const updated = await getSafeHtml(mockEmails);
      // Simulate an API request
      setEmails(updated);
    };

    fetchEmails();
  }, []);

  // Redirect to email detail page
  const onSelectEmail = (email: Email) => {
    navigate(`/reviews/${email.id}`);
  };

  return (
    <div className="flex flex-col w-5/6 ml-auto">
      {/* Header  */}
      <div className="fixed h-[40px] w-full bg-gray-50 flex flex-row items-center justify-start px-4 border-b">
        {/* <button className="hover:bg-gray-100 p-2 rounded-lg" onClick={() => {}}>
          <BiRevision size={20} />
        </button> */}
      </div>
      {/* Email List*/}
      <div className="flex flex-col">
        <div className="flex flex-col gap-2 h-[calc(100vh-92px)] mt-[40px] p-2 overflow-y-auto">
          {emails.map((email, index) => (
            <button
              key={index}
              className={twMerge(
                "bg-white rounded-lg p-4 hover:bg-gray-100 cursor-pointer border-2 ",
                "focus:border-blue-300 focus:bg-blue-100"
              )}
              onClick={() => onSelectEmail(email)}
            >
              <div className="flex justify-between">
                {/* From */}
                <div className="flex flex-row items-center gap-8 text-sm">
                  <div className="text-start">
                    <p className="font-light">{email.from}</p>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <div className="bg-red-500 text-white rounded-xl px-3">
                      <span>Check Necessity: High</span>
                    </div>
                    <div className="bg-red-500 text-white rounded-full px-1.5">
                      <span>3</span>
                    </div>
                  </div>
                </div>
                {/* Date */}
                <p className="text-xs text-gray-500">
                  {formatDate(email.timestamp)}
                </p>
              </div>
              {/* Subject */}
              <h3 className="text-sm text-start font-semibold mt-2">
                {email.subject}
              </h3>
              {/* Body */}
              <p className="text-xs text-start text-gray-600 mt-1 line-clamp-5">
                {email.body}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
