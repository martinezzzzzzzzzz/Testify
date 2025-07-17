import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import ExamListPage from "./pages/ExamListPage/ExamListPage.jsx";
import ExamDetailPage from "./pages/ExamDetailPage/ExamDetailPage.jsx";
import AnswerReviewPage from "./pages/AnswerReviewPage/AnswerReviewPage.jsx";
import ExamCreatePage from './pages/ExamCreatePage/ExamCreatePage';
import Layout from "./components/Layout/Layout.jsx";
import './assets/global.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/exams"
          element={
            <Layout>
              <ExamListPage />
            </Layout>
          }
        />
        <Route
          path="/exams/new"
          element={
            <Layout>
              <ExamCreatePage />
            </Layout>
          }
        />
        <Route
          path="/exams/:examId"
          element={
            <Layout>
              <ExamDetailPage />
            </Layout>
          }
        />
        <Route
          path="/exams/:examId/answers"
          element={
            <Layout>
              <AnswerReviewPage />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
