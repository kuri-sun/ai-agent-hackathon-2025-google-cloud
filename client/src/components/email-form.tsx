import { t } from "i18next";
import React from "react";
import { FiX } from "react-icons/fi";

export default function EmailForm({
  replyEmailForm,
  isClose = true,
  onSubjectChange,
  onTextChange,
  primaryButtonText,
  isPrimaryDisabled = false,
  onClickPrimaryButton,
  secondaryButtonText = undefined,
  isSecondaryDisabled = false,
  onClickSecondaryButton = undefined,
}: {
  replyEmailForm: {
    from: string;
    to: string;
    subject: string;
    text: string;
    threadId: string;
  };
  isClose?: boolean;
  onSubjectChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  primaryButtonText: string;
  isPrimaryDisabled?: boolean;
  onClickPrimaryButton: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  secondaryButtonText?: string | undefined;
  isSecondaryDisabled?: boolean;
  onClickSecondaryButton?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}) {
  const [isShow, setIsShow] = React.useState(true);

  const onClose = () => {
    setIsShow(false);
  };

  if (!isShow) return null;

  return (
    <div className="flex flex-col border mx-4 mb-4 rounded-lg drop-shadow-lg p-4">
      <form className="flex flex-col gap-4">
        {/* TODO: To: field can be specified by the user */}
        {/* <input
          type="text"
          placeholder="To"
          className="flex grow py-1 px-2 border"
          defaultValue={replyEmailForm.from}
        /> */}
        <div className="flex flex-row gap-4 justify-between">
          <input
            type="text"
            placeholder={t("Email subject")}
            className="flex grow bg-transparent py-1 px-2 border"
            defaultValue={replyEmailForm.subject}
            onChange={onSubjectChange}
          />
          {isClose && (
            <button
              onClick={onClose}
              className="hover:bg-black/60 p-2 rounded-lg"
            >
              <FiX />
            </button>
          )}
        </div>
        <textarea
          placeholder={t("Your message here")}
          className="py-1 px-2 h-40 bg-transparent focus:outline-none"
          autoFocus
          defaultValue={replyEmailForm.text}
          onChange={onTextChange}
        />
        <div className="flex justify-start gap-2">
          <button
            className="bg-blue-500 text-white text-sm inline-flex flex-row items-center gap-2 py-2 px-3 rounded-xl 
             disabled:bg-blue-300 disabled:cursor-not-allowed"
            onClick={onClickPrimaryButton}
            disabled={isPrimaryDisabled}
          >
            <span>{primaryButtonText}</span>
          </button>

          {secondaryButtonText && (
            <button
              className="border border-blue-500 text-blue-500 text-sm inline-flex flex-row items-center gap-2 py-2 px-3 rounded-xl 
               disabled:border-blue-300 disabled:text-blue-300 disabled:cursor-not-allowed"
              onClick={onClickSecondaryButton}
              disabled={isSecondaryDisabled}
            >
              <span>{secondaryButtonText}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
