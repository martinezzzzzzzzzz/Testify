const pool = require('../config/db');

exports.createQuestion = async (req, res) => {
  const { exam_id, question_text, type, options, correct_answer } = req.body;
  const user = req.session.user;

  console.log("=== BODY COMPLETO ===");
  console.log(req.body);

  if (!user || user.role !== 'profesor') {
    return res.status(403).json({ error: 'No autorizado' });
  }

  let fixedOptions = null;

  if (options !== undefined && options !== null) {
    if (Array.isArray(options)) {
      fixedOptions = JSON.stringify(options);
    } else if (typeof options === 'string') {
      // Por si llega como string separado por comas
      fixedOptions = JSON.stringify(
        options.split(',').map(opt => opt.trim())
      );
    } else {
      console.log("⚠️ Opciones llegó en un formato no esperado:", options);
      fixedOptions = null;
    }
  }

  console.log("✅ fixedOptions para insertar:", fixedOptions);

  try {
    const [result] = await pool.query(
      `INSERT INTO questions (exam_id, question_text, type, options, correct_answer)
       VALUES (?, ?, ?, ?, ?)`,
      [
        exam_id,
        question_text,
        type || null,
        fixedOptions,
        correct_answer
      ]
    );

    res.json({
      success: true,
      insertedId: result.insertId
    });
  } catch (error) {
    console.error('Error al crear pregunta:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getQuestionsByExam = async (req, res) => {
  const { exam_id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT id, exam_id, question_text, type, options, correct_answer
       FROM questions
       WHERE exam_id = ?`,
      [exam_id]
    );

    const formattedRows = rows.map(row => {
      let parsedOptions = null;

      if (row.options) {
        try {
          if (typeof row.options === 'string') {
            // intentamos parsear como JSON si es string
            parsedOptions = JSON.parse(row.options);
          } else {
            // si ya viene como objeto o array
            parsedOptions = row.options;
          }
        } catch (err) {
          console.error("❌ Error parseando options:", err.message);
          // si no es JSON válido, probamos a convertirlo en array separada por comas
          if (typeof row.options === 'string') {
            parsedOptions = row.options.split(',').map(opt => opt.trim());
          } else {
            parsedOptions = null;
          }
        }
      }

      return {
        ...row,
        options: parsedOptions
      };
    });

    res.json(formattedRows);
  } catch (error) {
    console.error('Error al obtener preguntas:', error);
    res.status(500).json({ error: error.message });
  }
};