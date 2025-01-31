import { mockEmails } from "../mock/data";
import React, { useEffect } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Email } from "../models/email";
import { formatDate } from "../utils/format";
import { BsReply, BsSend } from "react-icons/bs";
import { FiX } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BiMessageDots } from "react-icons/bi";

export default function EmailDetailPage() {
  const { emailId } = useParams();
  const navigate = useNavigate();

  const emailViewRef = React.useRef<HTMLDivElement>(null);

  const [selectedEmail, setSelectedEmail] = React.useState<Email | null>(null);
  const [generatedTemplate, setGeneratedTemplate] =
    React.useState<Email | null>(null);

  const getSafeHtml = async (email: Email) => {
    const body = email.body;
    const markdownHtml = await marked(body);
    const sanitizedHtml = DOMPurify.sanitize(markdownHtml);
    return { ...email, sanitized: sanitizedHtml };
  };

  useEffect(() => {
    // Fetch data from the API
    // fetch(`/api/posts?q=${q}`)
    //   .then((res) => res.json())
    //   .then((data) => setPosts(data));

    const fetchEmail = async () => {
      console.log("emailId", emailId);
      const email = await getSafeHtml(mockEmails[0]);

      // Simulate an API request
      setSelectedEmail(email);
    };

    fetchEmail();
  }, [emailId]);

  const onClickReply = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (emailViewRef.current) {
      emailViewRef.current.scrollIntoView({ behavior: "smooth" });
      emailViewRef.current.scrollTo({
        top: emailViewRef.current.scrollHeight,
        behavior: "smooth", // Or 'auto' for instant scroll
      });
    }

    // TODO: Generate reply template
    setGeneratedTemplate({
      from: selectedEmail?.from || "",
      subject: `Re: ${selectedEmail?.subject}`,
      body: "",
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
    <div className="flex flex-col w-5/6 ml-auto">
      {/* Header  */}
      <div className="fixed h-[40px] w-full bg-gray-50 flex flex-row items-center justify-start px-4 border-b">
        <button
          className="hover:bg-gray-100 p-2 rounded-lg"
          onClick={() => navigate(-1)}
        >
          <AiOutlineArrowLeft />
        </button>
      </div>
      {/* Selected Email */}
      <div className="flex flex-col gap-4">
        <div
          ref={emailViewRef}
          className="flex flex-col justify-between h-[calc(100vh-92px)] mt-[40px] overflow-y-auto"
        >
          {selectedEmail ? (
            <>
              <div className="bg-white py-4 px-6">
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
                    title="Reply"
                    className="hover:bg-gray-100 p-2 rounded-lg"
                    onClick={(e) => onClickReply(e)}
                  >
                    <BsReply size={24} />
                  </button>
                </div>

                <div
                  className="whitespace-pre-wrap p-4"
                  dangerouslySetInnerHTML={{
                    __html: selectedEmail.sanitized || selectedEmail.body,
                  }}
                />
              </div>
              {generatedTemplate ? (
                <div className="flex flex-col border m-4 bg-white rounded-lg drop-shadow-lg p-4">
                  <form className="flex flex-col gap-4">
                    {/* <input
                      type="text"
                      placeholder="To"
                      className="py-1 px-2"
                      defaultValue={generatedTemplate.from}
                    /> */}
                    <div className="flex flex-row gap-4 justify-between">
                      <input
                        type="text"
                        placeholder="Subject"
                        className="flex grow py-1 px-2 border"
                        defaultValue={generatedTemplate.subject}
                      />
                      <button
                        onClick={() => {
                          setGeneratedTemplate(null);
                        }}
                        className="hover:bg-gray-100 p-2 rounded-lg"
                      >
                        <FiX />
                      </button>
                    </div>
                    <textarea
                      placeholder="Message"
                      className="py-1 px-2 h-40 focus:outline-none"
                      autoFocus
                      defaultValue={generatedTemplate.body}
                    />
                    <div className="flex justify-start gap-2">
                      <button
                        className="bg-blue-500 inline-flex flex-row text-white text-sm items-center gap-2 py-2 px-3 rounded-xl"
                        onClick={(e) => onSubmitEmail(e)}
                      >
                        <span>Review before Send</span>
                        <BiMessageDots size={16} />
                      </button>
                      <button
                        className="border border-blue-500 inline-flex flex-row text-blue-500 text-sm items-center gap-2 py-2 px-3 rounded-xl"
                        onClick={(e) => onSubmitEmail(e)}
                      >
                        <span>Send</span>
                        <BsSend size={16} />
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
