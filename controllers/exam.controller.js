const pool = require('../config/db');

// ✅ Traer todos los exámenes
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

// ✅ Crear un nuevo examen con preguntas y opciones
exports.createExam = async (req, res) => {
  const user = req.session.user;

  if (!user || user.role !== 'profesor') {
    return res.status(403).json({ error: 'No autorizado' });
  }

  const { title, description, questions } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Insertar examen
    const [examResult] = await connection.query(
      `INSERT INTO exams (title, description) VALUES (?, ?)`,
      [title, description]
    );
    const examId = examResult.insertId;

    // Insertar preguntas si existen
    if (questions && Array.isArray(questions)) {
      for (const question of questions) {
        const [questionResult] = await connection.query(
          `INSERT INTO questions (exam_id, question_text, type, correct_answer)
           VALUES (?, ?, ?, ?)`,
          [
            examId,
            question.question_text,
            question.type,
            question.correct_answer || null,
          ]
        );

        const questionId = questionResult.insertId;

        // Insertar opciones si es multiple_choice
        if (
          question.type === 'multiple_choice' &&
          question.options &&
          Array.isArray(question.options)
        ) {
          for (const optionText of question.options) {
            await connection.query(
              `INSERT INTO options (question_id, option_text)
               VALUES (?, ?)`,
              [questionId, optionText]
            );
          }
        }
      }
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Examen y preguntas creados correctamente',
      examId,
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error creando examen:', error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

// ✅ Obtener respuestas de un examen
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

// ✅ Enviar respuestas a un examen
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

// 📄 Obtener el detalle de un examen específico (examen + preguntas + opciones)
exports.getExamDetail = async (req, res) => {
  const { exam_id } = req.params;

  try {
    const [examRows] = await pool.query(
      `SELECT id, title, description FROM exams WHERE id = ?`,
      [exam_id]
    );

    if (examRows.length === 0) {
      return res.status(404).json({ error: 'Examen no encontrado' });
    }

    const exam = examRows[0];

    const [questionRows] = await pool.query(
      `SELECT id, question_text, type, correct_answer
       FROM questions WHERE exam_id = ?`,
      [exam_id]
    );

    for (const question of questionRows) {
      if (question.type === 'multiple_choice') {
        const [optionRows] = await pool.query(
          `SELECT id, option_text FROM options WHERE question_id = ?`,
          [question.id]
        );
        question.options = optionRows;
      }
    }

    res.json({ ...exam, questions: questionRows });

  } catch (error) {
    console.error('Error al obtener detalle del examen:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// ✅ Obtener un examen por ID con preguntas y opciones
exports.getExamById = async (req, res) => {
  try {
    const examId = req.params.exam_id;

    // 1. Obtener los datos del examen
    const [examRows] = await pool.query('SELECT * FROM exams WHERE id = ?', [examId]);

    if (examRows.length === 0) {
      return res.status(404).json({ message: 'Examen no encontrado' });
    }

    const exam = examRows[0];

    // 2. Obtener preguntas del examen
    const [questions] = await pool.query(
      'SELECT id, question_text FROM questions WHERE exam_id = ?',
      [examId]
    );

    // 3. Para cada pregunta, obtener sus opciones
    for (const question of questions) {
      const [options] = await pool.query(
        'SELECT id, option_text FROM options WHERE question_id = ?',
        [question.id]
      );
      question.options = options;
    }

    // 4. Armar el resultado final
    const result = {
      ...exam,
      questions: questions,
    };

    res.json(result);

  } catch (error) {
    console.error('Error al obtener el examen por ID:', error);
    res.status(500).json({ error: error.message });
  }
};