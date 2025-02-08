import React from "react";
import { FiX } from "react-icons/fi";

export default function EmailForm({
  replyEmailForm,
  isClose = true,
  onSubjectChange,
  onTextChange,
  primaryButtonText,
  onClickPrimaryButton,
  secondaryButtonText = undefined,
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
  onClickPrimaryButton: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  secondaryButtonText?: string | undefined;
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
    <div className="flex flex-col border mx-4 mb-4 bg-white rounded-lg drop-shadow-lg p-4">
      <form className="flex flex-col gap-4">
        {/* <input
                      type="text"
                      placeholder="To"
                      className="py-1 px-2"
                      defaultValue={replyEmailForm.from}
                    /> */}
        <div className="flex flex-row gap-4 justify-between">
          <input
            type="text"
            placeholder="Subject"
            className="flex grow py-1 px-2 border"
            defaultValue={replyEmailForm.subject}
            onChange={onSubjectChange}
          />
          {isClose && (
            <button
              onClick={onClose}
              className="hover:bg-gray-100 p-2 rounded-lg"
            >
              <FiX />
            </button>
          )}
        </div>
        <textarea
          placeholder="Message"
          className="py-1 px-2 h-40 focus:outline-none"
          autoFocus
          defaultValue={replyEmailForm.text}
          onChange={onTextChange}
        />
        <div className="flex justify-start gap-2">
          <button
            className="bg-blue-500 inline-flex flex-row text-white text-sm items-center gap-2 py-2 px-3 rounded-xl"
            onClick={onClickPrimaryButton}
          >
            <span>{primaryButtonText}</span>
          </button>
          {secondaryButtonText && (
            <button
              className="border border-blue-500 inline-flex flex-row text-blue-500 text-sm items-center gap-2 py-2 px-3 rounded-xl"
              onClick={onClickSecondaryButton}
            >
              <span>{secondaryButtonText}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
