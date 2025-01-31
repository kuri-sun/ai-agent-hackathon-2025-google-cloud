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

function App() {
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
              <Route path="/reviews/:emailId" element={<ReviewDetailPage />} />
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
