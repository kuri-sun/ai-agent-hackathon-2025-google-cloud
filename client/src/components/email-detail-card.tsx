import { BsReply } from "react-icons/bs";
import { formatDate } from "../utils/format";
import { useTranslation } from "react-i18next";

export default function EmailDetailCard({
  email,
  onClickReply,
}: {
  email: {
    subject: string;
    from: {
      text: string;
    };
    date: string;
    text: string;
    html: string;
    textAsHtml: string;
  };
  onClickReply?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="py-4 px-6 m-4 border shadow-md rounded-lg">
      <h3 className="text-2xl font-semibold py-4">{email.subject}</h3>

      <div className="flex justify-between pb-8">
        <div className="flex items-center">
          {/* TODO: Replace with actual avatar component */}
          <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
          <div>
            <p className="text-sm font-semibold">{email.from.text}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-200">
              {t(formatDate(email.date))}
            </p>
          </div>
        </div>
        {onClickReply && (
          <button
            title="Reply"
            className="hover:bg-black/60 p-2 rounded-lg"
            onClick={onClickReply}
          >
            <BsReply size={24} />
          </button>
        )}
      </div>

      <div dangerouslySetInnerHTML={{ __html: email.html }}></div>
    </div>
  );
}
