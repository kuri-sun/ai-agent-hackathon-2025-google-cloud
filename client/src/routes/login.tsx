import { useNavigate } from "react-router-dom";
import React from "react";
import { Axios } from "../axios";
import geminiLogo from "../assets/gemini-logo.png";

const LoginPage = () => {
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
    <div className="h-screen">
      <div className="flex flex-col items-center justify-center justify-between h-full py-12">
        <header></header>

        <div className="flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-8">
            <h1 className="text-6xl font-bold">Co-Email</h1>
            <h3 className="text-xl text-gray-400 font-semibold">
              - AI Agent Hackathon 2025 with Google Cloud -
            </h3>
          </div>
          <button
            className="inline-flex flex-row items-center gap-4 border-2 border-blue-600 text-blue-600 text-xl pl-6 pr-4 py-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 transition-colors duration-300"
            onClick={onSignIn}
          >
            <span>Sign in with Google</span>
            <img src="./google-logo.png" alt="google-logo" className="h-6" />
          </button>
        </div>

        <footer className="text-gray-400 text-sm flex flex-col gap-4 items-center">
          <div className="flex flex-row gap-1 items-baseline">
            <span className="font-light text-sm">powered with</span>
            <img src={geminiLogo} alt="gemini-logo" className="h-[20px]" />
          </div>
          <div className="flex flex-row gap-4">
            <a href="" className="underline text-blue-500">
              Terms and Conditions
            </a>
            <a href="" className="underline text-blue-500">
              Privacy Policy
            </a>
          </div>
          <p>© 2025 Haruki Kuriwada</p>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
