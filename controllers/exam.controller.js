const pool = require('../config/db');

// ✅ Nuevo endpoint para traer todos los exámenes
exports.getAllExams = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, description FROM exams`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener exámenes:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Ya existente: Enviar respuestas
exports.submitExam = async (req, res) => {
  const { exam_id } = req.params;
  const user = req.session.user;

  if (!user || user.role !== 'estudiante') {
    return res.status(403).json({ error: 'No autorizado' });
  }

  const { answers } = req.body;

  try {
    for (const ans of answers) {
      await pool.query(
        `INSERT INTO exam_answers (exam_id, user_id, question_id, answer)
         VALUES (?, ?, ?, ?)`,
        [exam_id, user.id, ans.question_id, ans.answer]
      );
    }

    res.json({ success: true, message: 'Examen respondido correctamente.' });
  } catch (error) {
    console.error('Error al guardar respuestas:', error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Ya existente: Obtener respuestas de un examen
exports.getExamAnswers = async (req, res) => {
  const { exam_id } = req.params;
  const user = req.session.user;

  if (!user || user.role !== 'profesor') {
    return res.status(403).json({ error: 'No autorizado' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT 
          ea.id,
          ea.exam_id,
          ea.user_id,
          u.name AS student_name,
          ea.question_id,
          q.question_text,
          ea.answer,
          ea.created_at
       FROM exam_answers ea
       JOIN users u ON ea.user_id = u.id
       JOIN questions q ON ea.question_id = q.id
       WHERE ea.exam_id = ?`,
      [exam_id]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener respuestas del examen:', error);
    res.status(500).json({ error: error.message });
  }
};
