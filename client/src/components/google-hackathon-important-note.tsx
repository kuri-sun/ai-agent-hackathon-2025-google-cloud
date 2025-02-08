import { useTranslation } from "react-i18next";

export default function GoogleHackathonImportantNote() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col text-xl font-bold border-2 border-red-600 p-4 rounded-md">
      <div className="w-fit flex-row border-2 border-red-600 text-red-600 text-sm font-bold p-1 rounded-md bg-red-50">
        {t("Important Note")}
      </div>
      <span className="py-2">
        {t("To the AI Agent Hackathon with Google Cloud team.")}
      </span>
      <span className="text-sm text-gray-500">
        {t(
          "This app is currently undergoing Google's OAuth App Verification process. Please log in using the test account below."
        )}
      </span>
      <div className="flex flex-col gap-2 pt-4">
        <span className="text-lg">Email: testuserrukis@gmail.com</span>
        <span className="text-lg">Pass: TestRuki,1212</span>
      </div>
    </div>
  );
}
