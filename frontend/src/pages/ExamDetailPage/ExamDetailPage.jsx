import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ExamDetailPage.css';

function ExamDetailPage() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/exams/${examId}`, {
          withCredentials: true
        });
        setExam(response.data);
      } catch (err) {
        console.error('Error cargando el examen:', err);
        setError('No se pudo cargar el examen.');
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  if (loading) return <p>Cargando examen...</p>;
  if (error) return <p>{error}</p>;
  if (!exam) return <p>Examen no encontrado.</p>;

  return (
    <div className="exam-detail-container">
      <h2>{exam.title}</h2>
      <p>{exam.description}</p>

      <h3>Preguntas:</h3>
      {exam.questions.length === 0 && <p>No hay preguntas en este examen.</p>}

      {exam.questions.map((q, index) => (
        <div key={index} className="question-detail">
          <p><strong>{index + 1}. {q.question_text}</strong></p>
          <p><em>Tipo: {q.type === 'multiple_choice' ? 'Opción múltiple' : 'Texto'}</em></p>

          {q.type === 'multiple_choice' && (
            <ul>
              {q.options.map((opt, i) => (
                <li key={i}>{opt.option_text}</li>
              ))}
            </ul>
          )}

          <p><strong>Respuesta correcta:</strong> {q.correct_answer || 'N/A'}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default ExamDetailPage;
