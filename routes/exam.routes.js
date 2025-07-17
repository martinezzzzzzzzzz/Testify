const db = require('../config/db'); // Ajusta si la ruta es distinta
const express = require('express');
const router = express.Router();
const examController = require('../controllers/exam.controller');

router.post('/', examController.createExam);                 // Crear examen
router.get('/', examController.getAllExams);                 // Todos los exámenes
router.get('/:exam_id/answers', examController.getExamAnswers); // Respuestas
router.get('/:exam_id', examController.getExamById);         // Examen por ID
router.post('/:exam_id/submit', examController.submitExam);  // Enviar respuestas

module.exports = router;
