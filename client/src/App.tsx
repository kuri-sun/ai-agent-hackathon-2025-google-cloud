import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./routes/not-found";
import IndexPage from "./routes/_index";
import Layout from "./routes/layout/layout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
