import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import ExamListPage from "./pages/ExamListPage/ExamListPage.jsx";
import ExamDetailPage from "./pages/ExamDetailPage/ExamDetailPage.jsx";
import AnswerReviewPage from "./pages/AnswerReviewPage/AnswerReviewPage.jsx";

// Estilos globales (si decides usarlos)
import './assets/global.css';

function App() {
  return (
    <BrowserRouter>
      {/* Puedes envolver esto en un Layout general si usas Navbar, etc. */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/exams" element={<ExamListPage />} />
        <Route path="/exams/:examId" element={<ExamDetailPage />} />
        <Route path="/exams/:examId/answers" element={<AnswerReviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;