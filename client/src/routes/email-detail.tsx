import React from "react";
import { Email, EmailPayload } from "../models/email";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import EmailForm from "../components/email-form";
import EmailDetailCard from "../components/email-detail-card";
import { Axios } from "../axios";
import EmailDetailCardSkelton from "../components/email-detail-card-skelton";

export default function EmailDetailPage() {
  const navigate = useNavigate();
  const { emailId } = useParams();

  const emailViewRef = React.useRef<HTMLDivElement>(null);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedEmail, setSelectedEmail] = React.useState<Email | null>(null);
  const [replyEmailForm, setReplyEmailForm] =
    React.useState<EmailPayload | null>(null);

  React.useEffect(() => {
    const fetchEmail = async () => {
      try {
        setLoading(true);
        const res = await Axios.get<ApiResponse<Email>>(`/emails/${emailId}`);
        const email = res.data.data;
        setSelectedEmail(email);

        // set the form data
        const updatedReferences = email?.references
          ? [...email?.references, email?.messageId]
          : [email?.messageId || ""];
        setReplyEmailForm({
          from: email?.to.text || "", // to is from the selected email
          to: email?.from.text || "", // from is from the selected email
          subject: `Re: ${email?.subject}`,
          text: "",
          inReplyTo: email?.messageId || "",
          references: updatedReferences,
          threadId: email?.threadId || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (emailId) fetchEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickReply = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    // auto scroll to the bottom
    if (emailViewRef.current) {
      emailViewRef.current.scrollIntoView({ behavior: "smooth" });
      emailViewRef.current.scrollTo({
        top: emailViewRef.current.scrollHeight,
        behavior: "smooth", // Or 'auto' for instant scroll
      });
    }
  };

  const onSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (replyEmailForm) {
      setReplyEmailForm({
        ...replyEmailForm,
        subject: e.target.value,
      });
    }
  };
  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (replyEmailForm) {
      setReplyEmailForm({
        ...replyEmailForm,
        text: e.target.value,
      });
    }
  };

  const onSubmitReview = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      await Axios.post<ApiResponse<{ id: string; threadId: string }>>(
        `/emails/drafts`,
        { ...replyEmailForm }
      );
      alert("Email was Reviewed!");

      navigate(`/reviews`);
    } catch (err) {
      console.error(err);
    }
  };

  const onSendEmail = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      await Axios.post<ApiResponse<{ id: string; threadId: string }>>(
        `/emails/send`,
        { ...replyEmailForm }
      );
      alert("Email sent!");

      navigate(`/`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col w-5/6 ml-auto">
      {/* Header  */}
      <div className="fixed h-[40px] w-full bg-gray-50 flex flex-row items-center justify-start px-4 border-b">
        <button
          className="hover:bg-gray-100 p-2 rounded-lg"
          onClick={() => navigate("/")}
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
          {!loading ? (
            <>
              {selectedEmail && (
                <EmailDetailCard
                  email={selectedEmail}
                  onClickReply={onClickReply}
                />
              )}
              {replyEmailForm && (
                <EmailForm
                  replyEmailForm={replyEmailForm}
                  onSubjectChange={onSubjectChange}
                  onTextChange={onTextChange}
                  primaryButtonText="Review Email"
                  secondaryButtonText="Send Email"
                  onClickPrimaryButton={onSubmitReview}
                  onClickSecondaryButton={onSendEmail}
                />
              )}
            </>
          ) : (
            <EmailDetailCardSkelton itemNumber={1} />
          )}
        </div>
      </div>
    </div>
  );
}
