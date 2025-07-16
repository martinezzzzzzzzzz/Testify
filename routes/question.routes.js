const express = require('express');
const router = express.Router();
const questionCtrl = require('../controllers/question.controller');

router.post('/', questionCtrl.createQuestion);
router.get('/:exam_id', questionCtrl.getQuestionsByExam);

module.exports = router;
