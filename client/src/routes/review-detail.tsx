import React, { useEffect } from "react";
import { DraftEmail, DraftPayload, Email } from "../models/email";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BiMessageDots } from "react-icons/bi";
import EmailForm from "../components/email-form";
import EmailReviewResults from "../components/email-review-results";
import EmailDetailCard from "../components/email-detail-card";
import { Axios } from "../axios";
import EmailDetailCardSkelton from "../components/email-detail-card-skelton";
import { t } from "i18next";

export default function ReviewDetailPage() {
  const navigate = useNavigate();
  const { draftId } = useParams();

  const emailViewRef = React.useRef<HTMLDivElement>(null);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedDraft, setSelectedDraft] = React.useState<DraftEmail | null>(
    null
  );
  const [threadEmails, setThreadEmails] = React.useState<Email[]>([]);
  const [replyEmailForm, setReplyEmailForm] =
    React.useState<DraftPayload | null>(null);

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        // Fetch the draft email
        const draftRes = await Axios.get<ApiResponse<DraftEmail>>(
          `/emails/drafts/${draftId}`
        );
        const draft = draftRes.data.data;
        setSelectedDraft(draft);

        // Fetch the thread emails
        let onlyEmails: Email[] = [];
        if (draftRes.data.data.threadId) {
          const threadEmailsRes = await Axios.get<ApiResponse<Email[]>>(
            `/emails/threads/${draftRes.data.data.threadId}`
          );
          const emails = threadEmailsRes.data.data;
          onlyEmails = emails.filter(
            (email) => email.labelIds.includes("DRAFT") === false
          );

          setThreadEmails(onlyEmails);
        }

        // Update UI
        setReplyEmailForm({
          from: draft.from.text || "",
          to: draft?.to.text || "",
          subject: draft.subject ? `Re: ${draft.subject}` : "",
          text: draft.text,
          inReplyTo:
            onlyEmails.length > 0
              ? onlyEmails[onlyEmails.length - 1].messageId || ""
              : "",
          references:
            onlyEmails.length > 1
              ? [
                  ...(onlyEmails[onlyEmails.length - 1].references || []),
                  onlyEmails[onlyEmails.length - 1].messageId,
                ]
              : [],
          threadId: draft?.threadId || "",
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    if (draftId) {
      setLoading(true);
      fetchDraft();
    }
  }, [draftId]);

  // Scroll to the bottom of the email list
  useEffect(() => {
    if (!loading && emailViewRef.current) {
      emailViewRef.current.scrollIntoView({ behavior: "smooth" });
      emailViewRef.current.scrollTo({
        top: emailViewRef.current.scrollHeight,
        behavior: "smooth", // Or 'auto' for instant scroll
      });
    }
  }, [loading, emailViewRef]);

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

  // Update a draft
  const onReReview = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      const updated = await Axios.put<ApiResponse<DraftEmail>>(
        `/emails/drafts/${draftId}`,
        {
          ...replyEmailForm,
        }
      );

      // TODO: show the "updated" popup or sth
      if (selectedDraft) {
        setSelectedDraft({
          ...selectedDraft,
          reviewResult: updated.data.data.reviewResult,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onSendDraft = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      if (!selectedDraft) {
        console.error("No selected draft");
        return;
      }
      await Axios.post<ApiResponse<{ id: string; message: any }>>(
        `/emails/drafts/${draftId}/send`,
        {
          threadId: selectedDraft?.threadId,
        }
      );

      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col w-5/6 ml-auto">
      {/* Header  */}
      <div className="fixed h-[40px] w-5/6 bg-gray-50 flex flex-row items-center justify-between px-4 border-b">
        <button
          className="hover:bg-gray-100 p-2 rounded-lg"
          onClick={() => navigate(-1)}
        >
          <AiOutlineArrowLeft />
        </button>
        <button
          className="bg-blue-500 inline-flex flex-row text-white text-sm items-center gap-2 py-1 px-3 rounded"
          onClick={(e) => onReReview(e)}
        >
          <span>{t("Re-review")}</span>
          <BiMessageDots size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div
          ref={emailViewRef}
          className="flex flex-col justify-between h-[calc(100vh-92px)] mt-[40px] overflow-y-auto"
        >
          {/* Email View */}
          {!loading ? (
            <>
              {/* Thread of emails? */}
              {threadEmails.map((email) => (
                <EmailDetailCard key={email.id} email={email} />
              ))}
              <div>
                {/* Review Result */}
                {selectedDraft?.reviewResult && (
                  <EmailReviewResults
                    reviewResult={selectedDraft.reviewResult}
                  />
                )}
                {/* Reply Draft */}
                {replyEmailForm && (
                  <EmailForm
                    replyEmailForm={replyEmailForm}
                    onSubjectChange={onSubjectChange}
                    onTextChange={onTextChange}
                    isClose={false}
                    primaryButtonText={t("Send")}
                    onClickPrimaryButton={onSendDraft}
                  />
                )}
              </div>
            </>
          ) : (
            <EmailDetailCardSkelton />
          )}
        </div>
      </div>
    </div>
  );
}
