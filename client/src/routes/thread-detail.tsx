import React from "react";
import { Email, EmailPayload, Thread } from "../models/email";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import EmailForm from "../components/email-form";
import EmailDetailCard from "../components/email-detail-card";
import { Axios } from "../axios";
import EmailDetailCardSkelton from "../components/email-detail-card-skelton";
import { BeatLoader } from "../components/beat-loader";
import { useTranslation } from "react-i18next";

export default function ThreadDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { threadId } = useParams();

  const emailViewRef = React.useRef<HTMLDivElement>(null);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [processingEmail, setProcessingEmail] = React.useState<boolean>(false);
  const [selectedThread, setSelectedThread] = React.useState<Thread | null>(
    null
  );
  const [replyEmailForm, setReplyEmailForm] =
    React.useState<EmailPayload | null>(null);

  React.useEffect(() => {
    const fetchThread = async () => {
      try {
        setLoading(true);
        const threadRes = await Axios.get<ApiResponse<Thread>>(
          `/emails/threads/${threadId}`
        );
        const thread = threadRes.data.data;
        setSelectedThread(thread);
        const latestReply = thread.messages[0];

        // set the form data
        const updatedReferences = latestReply?.references
          ? [...latestReply?.references, latestReply?.messageId]
          : [latestReply?.messageId || ""];
        setReplyEmailForm({
          from: latestReply?.to.text || "", // to is from the selected email
          to: latestReply?.from.text || "", // from is from the selected email
          subject: `Re: ${latestReply?.subject}`,
          text: "",
          inReplyTo: latestReply?.messageId || "",
          references: updatedReferences,
          threadId: latestReply?.threadId || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (threadId) fetchThread();
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

  const onClickGoBack = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    navigate(-1);
  };

  const onSubmitReview = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      setProcessingEmail(true);
      await Axios.post<ApiResponse<{ id: string; threadId: string }>>(
        `/emails/drafts`,
        { ...replyEmailForm }
      );

      setProcessingEmail(false);
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
      setProcessingEmail(true);
      await Axios.post<ApiResponse<{ id: string; threadId: string }>>(
        `/emails/send`,
        { ...replyEmailForm }
      );

      setProcessingEmail(false);
      navigate(`/`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {processingEmail ? <BeatLoader text={t("Processing...")} /> : null}
      <div className="flex flex-col w-5/6 ml-auto">
        {/* Header  */}
        <div className="fixed h-[40px] w-full flex flex-row items-center justify-start px-4 border-b">
          <button
            className="hover:bg-gray-100 dark:bg-gray-600 p-2 rounded-lg"
            onClick={onClickGoBack}
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
                {/* Thread of emails */}
                {selectedThread
                  ? selectedThread.messages.map((email) => (
                      <EmailDetailCard key={email.id} email={email} />
                    ))
                  : null}
                {/* Reply Form */}
                {replyEmailForm && (
                  <EmailForm
                    replyEmailForm={replyEmailForm}
                    onSubjectChange={onSubjectChange}
                    onTextChange={onTextChange}
                    primaryButtonText={t("Review this Email")}
                    secondaryButtonText={t("Send")}
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
    </>
  );
}
