const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');

const getQuizByLesson = async (req, res) => {
  try {
    const questions = await Quiz.find({ lessonId: req.params.lessonId }).sort({ createdAt: 1 });
    return res.json(questions);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch quiz.', error: error.message });
  }
};

const createQuiz = async (req, res) => {
  try {
    const { lessonId, question, options, answer } = req.body;

    if (!lessonId || !question || !options || !answer) {
      return res.status(400).json({ message: 'Lesson ID, question, options, and answer are required.' });
    }

    const quizQuestion = await Quiz.create({
      lessonId,
      question,
      options,
      answer,
    });

    return res.status(201).json(quizQuestion);
  } catch (error) {
    return res.status(500).json({ message: 'Quiz creation failed.', error: error.message });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { lessonId, answers, courseId } = req.body;

    const questions = await Quiz.find({ lessonId });
    if (!questions.length) {
      return res.status(404).json({ message: 'No quiz questions found for this lesson.' });
    }

    let correctAnswers = 0;

    questions.forEach((question) => {
      const selectedAnswer = answers[question._id.toString()];
      if (selectedAnswer && selectedAnswer === question.answer) {
        correctAnswers += 1;
      }
    });

    const total = questions.length;
    const score = Number(((correctAnswers / total) * 100).toFixed(2));

    if (req.user && courseId) {
      await Progress.findOneAndUpdate(
        { userId: req.user._id, courseId },
        {
          $push: {
            quizScores: {
              lessonId,
              score,
              total,
              attemptedAt: new Date(),
            },
          },
        },
        { upsert: true, new: true }
      );
    }

    return res.json({
      score,
      correctAnswers,
      total,
      passed: score >= 70,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Quiz submission failed.', error: error.message });
  }
};

module.exports = { getQuizByLesson, createQuiz, submitQuiz };
