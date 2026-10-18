const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');

const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    return res.json(lesson);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch lesson.', error: error.message });
  }
};

const createLesson = async (req, res) => {
  try {
    const { courseId, title, content, explanation, codeExample, tryItYourself, practiceTask, order } = req.body;

    if (!courseId || !title || !content || !order) {
      return res.status(400).json({ message: 'Course ID, title, content, and order are required.' });
    }

    const lesson = await Lesson.create({
      courseId,
      title,
      content,
      explanation: explanation || '',
      codeExample: codeExample || '',
      tryItYourself: tryItYourself || '',
      practiceTask: practiceTask || '',
      order,
    });

    return res.status(201).json(lesson);
  } catch (error) {
    return res.status(500).json({ message: 'Lesson creation failed.', error: error.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(updatedLesson);
  } catch (error) {
    return res.status(500).json({ message: 'Lesson update failed.', error: error.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    await Quiz.deleteMany({ lessonId: lesson._id });
    await lesson.deleteOne();

    return res.json({ message: 'Lesson deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Lesson deletion failed.', error: error.message });
  }
};

module.exports = { getLessonById, createLesson, updateLesson, deleteLesson };
