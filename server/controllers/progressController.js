const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');

const getProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user._id })
      .populate('courseId')
      .populate('completedLessons')
      .populate('lastVisitedLesson');

    return res.json(progress);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch course progress.', error: error.message });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { courseId, completedLessons, lastVisitedLesson } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required.' });
    }

    const totalLessons = await Lesson.countDocuments({ courseId });
    const uniqueLessons = Array.isArray(completedLessons) ? [...new Set(completedLessons)] : [];

    const progress = await Progress.findOneAndUpdate(
      { userId: req.user._id, courseId },
      {
        userId: req.user._id,
        courseId,
        completedLessons: uniqueLessons,
        lastVisitedLesson: lastVisitedLesson || uniqueLessons[uniqueLessons.length - 1] || null,
        percentage: totalLessons ? Math.min(100, Math.round((uniqueLessons.length / totalLessons) * 100)) : 0,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json(progress);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update progress.', error: error.message });
  }
};

module.exports = { getProgress, updateProgress };
