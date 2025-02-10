import { useNavigate } from "react-router-dom";
import React from "react";
import { Axios } from "../axios";
import geminiLogo from "../assets/gemini-logo.png";
import { twMerge } from "tailwind-merge";
import { setUILanguage } from "../utils/i18n";
import { useTranslation } from "react-i18next";
import loginImage from "../assets/login-page.jpg";
import GoogleHackathonImportantNote from "../components/google-hackathon-important-note";
import Header from "../components/header";

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

  return (
    <main className="h-screen dark:bg-neutral-800 text-gray-600 dark:text-neutral-100">
      <Header isAuth={false} />

      <div className="flex flex-col items-center justify-center justify-between h-full py-12">
        <div />
        <div className="flex flex-row items-center justify-center gap-14">
          {/* image */}
          <img src={loginImage} alt="" className="w-2/5" />
          {/* Login */}
          <div className="w-1/5 flex flex-col items-start gap-6">
            <div className="flex flex-col items-start gap-8">
              <h1 className="text-6xl text-neutral-700 dark:text-neutral-100 font-bold">
                Co-Email
              </h1>
              <h3 className="text-base text-neutral-400 font-light">
                {t(
                  "Co Email is a mail review tool that analyzes context, enabling confident email delivery."
                )}
              </h3>
            </div>
            {/* FIXME: Remove this after the Oauth App Verification is done. */}
            <GoogleHackathonImportantNote />
            <button
              className="inline-flex dark:text-neutral-200 dark:hover:bg-white/20 flex-row items-center gap-4 border-2 border-blue-600 dark:border-neutral-200 text-blue-600 text-xl pl-10 pr-8 py-4 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 transition-colors duration-300"
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
    </main>
  );
};

export default LoginPage;
