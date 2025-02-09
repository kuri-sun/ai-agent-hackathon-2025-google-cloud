import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { Axios } from "../axios";
import { BeatLoader } from "../components/beat-loader";
import { useTranslation } from "react-i18next";

const GoogleCallbackPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code") || "";

  React.useEffect(() => {
    const redirect = async () => {
      try {
        const res = await Axios.post<
          ApiResponse<{ accessToken: string; refreshToken: string }>
        >(`/auth/google/callback`, {
          code: code,
        });

        // Redirect to the landing page
        const { accessToken, refreshToken } = res.data.data;
        if (accessToken) {
          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Redirecting Failed: ", error);
        // navigate("/login");
      }
    };

    if (code) {
      redirect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <BeatLoader text={t("Redirecting...")} />;
};

export default GoogleCallbackPage;
