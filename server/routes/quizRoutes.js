const express = require('express');
const { getQuizByLesson, createQuiz, submitQuiz } = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:lessonId', getQuizByLesson);
router.post('/', protect, authorize('admin'), createQuiz);
router.post('/submit', protect, submitQuiz);

module.exports = router;
