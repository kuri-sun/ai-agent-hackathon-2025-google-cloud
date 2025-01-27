import { mockEmails } from "../mock/data";
import React, { useEffect } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Email } from "../models/email";
import { formatDate } from "../utils/format";
import { on } from "events";
import { twMerge } from "tailwind-merge";

// import { useLocation } from "react-router-dom";

export default function IndexPage() {
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const q = queryParams.get("q") || "";

  const [emails, setEmails] = React.useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = React.useState<Email | null>(null);
  const [generatedTemplate, setGeneratedTemplate] =
    React.useState<Email | null>(null);

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

  const onSelectEmail = (email: Email) => {
    setSelectedEmail(email);
  };

  const onClickReply = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    // TODO: Generate reply template
    setGeneratedTemplate({
      from: selectedEmail?.from || "",
      subject: `Re: ${selectedEmail?.subject}`,
      body: `Hi ${selectedEmail?.from},\n\n`,
      timestamp: Date.now(),
    });
  };

  const onSubmitEmail = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    // TODO: Implement reply functionality
  };

  return (
    <div className="p-4">
      <div className="flex flex-row gap-4">
        {/* Email Drawer View */}
        <div className="flex flex-col w-1/5">
          <h1 className="text-2xl h-8 items-center font-bold mb-4">Inbox</h1>
          <div className="flex flex-col gap-4 h-[calc(100vh-134px)] overflow-y-auto">
            {emails.map((email, index) => (
              <button
                key={index}
                className={twMerge(
                  "bg-white rounded-lg p-4 hover:bg-gray-100 cursor-pointer border-2 ",
                  selectedEmail?.subject === email.subject
                    ? "border-blue-300 bg-blue-100"
                    : ""
                )}
                onClick={() => onSelectEmail(email)}
              >
                <div className="flex justify-between">
                  <div className="flex items-center">
                    {/* TODO: Replace with actual avatar component */}
                    <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
                    <div className="text-start">
                      <p className="text-sm font-semibold">{email.from}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(email.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-sm text-start font-semibold mt-2">
                  {email.subject}
                </h3>
                <p className="text-xs text-start text-gray-600 mt-1 line-clamp-5">
                  {email.body}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Email Focused View */}
        <div className="w-4/5 h-[calc(100vh-96px)] flex flex-col gap-4">
          {/* Selected Email */}
          <div className="flex flex-col overflow-y-auto gap-4">
            {selectedEmail ? (
              <div className="bg-white rounded-lg shadow-md py-4 px-6">
                <h3 className="text-2xl font-semibold py-4">
                  {selectedEmail.subject}
                </h3>

                <div className="flex justify-between pb-8">
                  <div className="flex items-center">
                    {/* TODO: Replace with actual avatar component */}
                    <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
                    <div>
                      <p className="text-sm font-semibold">
                        {selectedEmail.from}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(selectedEmail.timestamp)}
                      </p>
                    </div>
                  </div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    onClick={(e) => onClickReply(e)}
                  >
                    Generate A Reply
                  </button>
                </div>

                <div
                  className="whitespace-pre-wrap p-4"
                  dangerouslySetInnerHTML={{
                    __html: selectedEmail.sanitized || selectedEmail.body,
                  }}
                />
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center text-gray-500 text-center">
                Select an email to view its content.
              </div>
            )}
          </div>
          {/* Email Compose */}
          {generatedTemplate ? (
            <div className="overflow-y-auto bg-white rounded-lg shadow-md p-4">
              <form className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="To"
                  className="py-1 px-2"
                  defaultValue={generatedTemplate.from}
                />
                <input
                  type="text"
                  placeholder="Subject"
                  className="py-1 px-2 border"
                  defaultValue={generatedTemplate.subject}
                />
                <textarea
                  placeholder="Message"
                  className="py-1 px-2 h-40 border"
                  defaultValue={generatedTemplate.body}
                />
                <button
                  className="bg-blue-500 text-white py-1 px-2"
                  onClick={(e) => onSubmitEmail(e)}
                >
                  Send
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
