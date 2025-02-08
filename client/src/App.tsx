import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./routes/not-found";
import IndexPage from "./routes/_index";
import Layout from "./routes/layout/_layout";
import LoginPage from "./routes/login";
import GoogleCallbackPage from "./routes/google-callback";
import EmailDetailPage from "./routes/email-detail";
import ReviewsPage from "./routes/reviews";
import ReviewDetailPage from "./routes/review-detail";
import AuthProvider from "./context/auth-provider";
import "./i18/config";
import { setUILanguage } from "./utils/i18n";

function App() {
  React.useEffect(() => {
    const lang = localStorage.getItem("lang");
    setUILanguage(lang);
  }, []);

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/google/callback" element={<GoogleCallbackPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<IndexPage />} />
              <Route path="/inbox/:emailId" element={<EmailDetailPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/reviews/:draftId" element={<ReviewDetailPage />} />
              {/* <Route path="/reviews/:reviewId" element={<ReviewDetailPage />} /> */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
