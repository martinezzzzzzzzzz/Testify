import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ExamListPage.css";

function ExamListPage() {
  const [exams, setExams] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/exams", { withCredentials: true })
      .then((response) => setExams(response.data))
      .catch((error) => console.error("Error cargando exámenes:", error));
  }, []);

  console.log("USER:", user);

  return (
    <>
    
      <div className="exam-list-container">
        <h2 className="exam-list-title">Lista de Exámenes</h2>

        {user?.role === "profesor" && (
  <div className="add-exam-container">
    <a href="/exams/new" className="add-exam-button">
      ➕ Añadir Examen
    </a>
  </div>
)}

        {exams.length > 0 ? (
          <div className="exam-cards">
            {exams.map((exam) => (
              <div key={exam.id} className="exam-card">
                <h3>{exam.title}</h3>
                <p>{exam.description || "Sin descripción"}</p>
                <a href={`/exams/${exam.id}`} className="exam-link">
                  Ver examen →
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-exams-text">No hay exámenes disponibles.</p>
        )}
      </div>
    </>
  );
}

export default ExamListPage;
