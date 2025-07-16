const express = require('express');
const router = express.Router();
const examController = require('../controllers/exam.controller');

// Obtener todos los exámenes
router.get('/', examController.getAllExams);

// Guardar respuestas del estudiante
router.post('/:exam_id/submit', examController.submitExam);

// Obtener respuestas de un examen (solo para profesor)
router.get('/:exam_id/answers', examController.getExamAnswers);

module.exports = router;
