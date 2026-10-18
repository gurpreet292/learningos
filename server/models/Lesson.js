const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    explanation: { type: String, default: '' },
    codeExample: { type: String, default: '' },
    tryItYourself: { type: String, default: '' },
    practiceTask: { type: String, default: '' },
    order: { type: Number, required: true },
    isQuiz: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
