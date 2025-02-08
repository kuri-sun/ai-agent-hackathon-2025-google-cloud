import { useNavigate } from "react-router-dom";
import React from "react";
import { Axios } from "../axios";
import geminiLogo from "../assets/gemini-logo.png";
import { twMerge } from "tailwind-merge";
import { setUILanguage } from "../utils/i18n";
import { useTranslation } from "react-i18next";
import loginImage from "../assets/login-page.jpg";
import GoogleHackathonImportantNote from "../components/google-hackathon-important-note";

const LoginPage = () => {
  const { t } = useTranslation();
  const naivgate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const login = async () => {
        try {
          const res = await Axios.get(`/users/validate`);
          if (res.status === 200) {
            naivgate("/");
          }
        } catch (err) {
          console.error(err);
        }
      };

      login();
    }
  }, [naivgate]);

  const onSignIn = async () => {
    try {
      const res = await Axios.get<ApiResponse<{ authorizationUrl: string }>>(
        `/auth/google/login`
      );

      window.location.href = res.data.data.authorizationUrl;
    } catch (err) {
      console.error(err);
    }
  };

  const onToggleLanguageClick = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUILanguage(e.target.value);
  };

  return (
    <div className="h-screen">
      <div
        className={twMerge(
          "fixed top-0 flex z-[50] w-full transition-all duration-1000 border-b"
        )}
      >
        <div
          className={twMerge(
            "relative text-lg flex flex-row gap-4 items-center justify-center sm:justify-between w-full rounded-lg bg-white text-black dark:text-white dark:bg-neutral-800 h-[52px] px-4"
          )}
        >
          {/* Company Logo */}
          <div />
          {/* User Profile */}
          <div className="relative flex flex-row gap-6">
            <select
              className="p-2 rounded-lg border"
              name="language select"
              onChange={onToggleLanguageClick}
              defaultValue={document.documentElement.lang}
            >
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center justify-between h-full py-12">
        <div />
        <div className="flex flex-row items-center justify-center gap-14">
          {/* image */}
          <img src={loginImage} alt="" className="w-2/4" />
          {/* Login */}
          <div className="w-1/4 flex flex-col items-start gap-6">
            <div className="flex flex-col items-start gap-8">
              <h1 className="text-6xl text-neutral-700 font-bold">Co-Email</h1>
              <h3 className="text-base text-neutral-400 font-light">
                {t(
                  "Co Email is a mail review tool that analyzes context, enabling confident email delivery."
                )}
              </h3>
            </div>
            {/* FIXME: Remove this after the Oauth App Verification is done. */}
            <GoogleHackathonImportantNote />
            <button
              className="inline-flex flex-row items-center gap-4 border-2 border-blue-600 text-blue-600 text-xl pl-10 pr-8 py-4 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 transition-colors duration-300"
              onClick={onSignIn}
            >
              <span>{t("Sign in with Google")}</span>
              <img src="./google-logo.png" alt="google-logo" className="h-6" />
            </button>
          </div>
        </div>

        <footer className="text-gray-400 text-sm flex flex-col gap-4 items-center">
          <div className="flex flex-row gap-1 items-baseline">
            <span className="font-light text-sm">powered with</span>
            <img src={geminiLogo} alt="gemini-logo" className="h-[20px]" />
          </div>
          <div className="flex flex-row gap-4">
            <a href="" className="underline text-blue-500">
              {t("Terms and Conditions")}
            </a>
            <a href="" className="underline text-blue-500">
              {t("Privacy Policy")}
            </a>
          </div>
          <p>© 2025 Haruki Kuriwada</p>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
