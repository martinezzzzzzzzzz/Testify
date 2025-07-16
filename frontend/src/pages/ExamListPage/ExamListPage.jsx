import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ExamListPage.css";

function ExamListPage() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/exams", {
          withCredentials: true,
        });
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchExams();
  }, []);

  const handleViewExam = (id) => {
    navigate(`/exams/${id}`);
  };

  return (
    <div className="exam-list">
      <h2>Listado de Exámenes</h2>

      {exams.length === 0 && <p>No hay exámenes disponibles.</p>}

      {exams.map((exam) => (
        <div key={exam.id} className="exam-item">
          <h3>{exam.title}</h3>
          <p>{exam.description}</p>
          <button onClick={() => handleViewExam(exam.id)}>
            Ver Examen
          </button>
        </div>
      ))}
    </div>
  );
}

export default ExamListPage;
