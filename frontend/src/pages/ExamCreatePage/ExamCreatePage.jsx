import React, { useState } from 'react';
import axios from 'axios';
import './ExamCreatePage.css';

function ExamCreatePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: '',
        type: 'multiple_choice',
        correct_answer: '',
        options: []
      }
    ]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const addOption = (index) => {
    const updated = [...questions];
    updated[index].options.push('');
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        'http://localhost:3001/api/exams',
        { title, description, questions },
        { withCredentials: true }
      );
      alert('Examen creado correctamente');
      window.location.href = '/exams';
    } catch (error) {
      console.error('Error creando examen:', error);
      alert('Error al crear examen');
    }
  };

  return (
    <div className="exam-create-container">
      <h2>Crear Nuevo Examen</h2>
      <form onSubmit={handleSubmit}>
        <label>Título del Examen:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Descripción:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <h3>Preguntas</h3>
        {questions.map((q, i) => (
          <div key={i} className="question-block">
            <label>Texto de la pregunta:</label>
            <input
              type="text"
              value={q.question_text}
              onChange={(e) => updateQuestion(i, 'question_text', e.target.value)}
              required
            />

            <label>Tipo:</label>
            <select
              value={q.type}
              onChange={(e) => updateQuestion(i, 'type', e.target.value)}
            >
              <option value="multiple_choice">Opción múltiple</option>
              <option value="text">Texto</option>
            </select>

            <label>Respuesta correcta:</label>
            <input
              type="text"
              value={q.correct_answer || ''}
              onChange={(e) => updateQuestion(i, 'correct_answer', e.target.value)}
              disabled={q.type === 'text'}
            />

            {q.type === 'multiple_choice' && (
              <div className="options-section">
                <h4>Opciones</h4>
                {q.options.map((opt, oIndex) => (
                  <input
                    key={oIndex}
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(i, oIndex, e.target.value)}
                    required
                  />
                ))}
                <button
                  type="button"
                  onClick={() => addOption(i)}
                >
                  + Añadir Opción
                </button>
              </div>
            )}

            <hr />
          </div>
        ))}

        <button type="button" onClick={addQuestion}>
          ➕ Añadir Pregunta
        </button>

        <br /><br />

        <button type="submit">Guardar Examen</button>
      </form>
    </div>
  );
}

export default ExamCreatePage;
