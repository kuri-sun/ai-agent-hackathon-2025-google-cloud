import { useContext, createContext, useState } from "react";
import { ReactNode } from "react";
import { Axios } from "../axios";
import { DraftEmail, Email } from "../models/email";

const EmailContext = createContext<{
  loading: boolean;
  emails: Email[];
  drafts: DraftEmail[];
  refreshEmails: (isManual?: boolean) => void;
  refreshDrafts: (isManual?: boolean) => void;
  clearEmails: () => void;
  clearDrafts: () => void;
}>({
  loading: true,
  emails: [],
  drafts: [],
  refreshEmails: () => {},
  refreshDrafts: () => {},
  clearEmails: () => {},
  clearDrafts: () => {},
});

const EmailProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState<Email[]>([]);
  const [drafts, setDrafts] = useState<DraftEmail[]>([]);

  const refreshEmails = async (isManual: boolean = false) => {
    // if (isEmailsLoaded && !isManual) return;
    try {
      setLoading(true);
      const res = await Axios.get<
        ApiResponse<{
          messages: Email[];
        }>
      >("/emails", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "x-refresh-token": localStorage.getItem("refreshToken"),
        },
      });
      setEmails(res.data.data.messages);

      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshDrafts = async (isManual: boolean = false) => {
    // if (isDraftsLoaded && !isManual) return;
    try {
      setLoading(true);
      const res = await Axios.get<
        ApiResponse<{
          drafts: DraftEmail[];
        }>
      >("/emails/drafts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setDrafts(res.data.data.drafts);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const clearEmails = () => {
    setEmails([]);
  };

  const clearDrafts = () => {
    setDrafts([]);
  };

  return (
    <EmailContext.Provider
      value={{
        loading,
        emails,
        drafts,
        refreshEmails,
        refreshDrafts,
        clearEmails,
        clearDrafts,
      }}
    >
      {children}
    </EmailContext.Provider>
  );
};

export default EmailProvider;

export const useEmail = () => {
  return useContext(EmailContext);
};
