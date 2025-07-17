import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ExamListPage.css";

function ExamListPage() {
  const [exams, setExams] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/exams", { withCredentials: true })
      .then((response) => setExams(response.data))
      .catch((error) => console.error("Error cargando exámenes:", error));
  }, []);

  const toggleMenu = (id) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  const handleEdit = (id) => {
    window.location.href = `/exams/edit/${id}`;
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este examen?")) {
      axios
        .delete(`http://localhost:3001/api/exams/${id}`, { withCredentials: true })
        .then(() => {
          setExams(exams.filter((exam) => exam.id !== id));
        })
        .catch((err) => console.error("Error eliminando examen:", err));
    }
  };

  return (
    <div className="exam-list-page">
      <div className="exam-list-header">
        <h2 className="exam-list-title">📝 Lista de Exámenes</h2>
        {user?.role === "profesor" && (
          <a href="/exams/new" className="add-exam-button">
            ➕ Crear nuevo examen
          </a>
        )}
      </div>

      {exams.length > 0 ? (
        <div className="exam-cards">
          {exams.map((exam) => (
            <div key={exam.id} className="exam-card">
              <div className="exam-card-top">
                <h3 className="exam-card-title">{exam.title}</h3>
                {user?.role === "profesor" && (
                  <div className="exam-options">
                    <button
                      className="dots-button"
                      onClick={() => toggleMenu(exam.id)}
                    >
                      ⋮
                    </button>
                    {menuOpenId === exam.id && (
                      <div className="dropdown-menu">
                        <button onClick={() => handleEdit(exam.id)}>Editar</button>
                        <button onClick={() => handleDelete(exam.id)}>Eliminar</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="exam-card-description">
                {exam.description || "Sin descripción disponible."}
              </p>
              <a href={`/exams/${exam.id}`} className="exam-link">
                Ver examen →
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-exams-text">Aún no hay exámenes disponibles.</p>
      )}
    </div>
  );
}

export default ExamListPage;
