const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    lastVisitedLesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', default: null },
    percentage: { type: Number, default: 0 },
    quizScores: [{
      lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
      score: Number,
      total: Number,
      attemptedAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

const Progress = mongoose.models.Progress || mongoose.model('Progress', progressSchema);

module.exports = Progress;
