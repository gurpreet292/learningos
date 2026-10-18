const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    const formattedCourses = await Promise.all(
      courses.map(async (course) => {
        const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 });
        return { ...course.toObject(), lessons };
      })
    );

    return res.json(formattedCourses);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch courses.', error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 });
    return res.json({ ...course.toObject(), lessons });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch course.', error: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description, and category are required.' });
    }

    const course = await Course.create({
      title,
      description,
      thumbnail: thumbnail || '',
      category,
    });

    return res.status(201).json(course);
  } catch (error) {
    return res.status(500).json({ message: 'Course creation failed.', error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(updatedCourse);
  } catch (error) {
    return res.status(500).json({ message: 'Course update failed.', error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const lessons = await Lesson.find({ courseId: course._id });
    const lessonIds = lessons.map((lesson) => lesson._id);

    await Lesson.deleteMany({ courseId: course._id });
    await Progress.deleteMany({ courseId: course._id });
    await course.deleteOne();

    return res.json({ message: 'Course deleted successfully.', deletedLessonIds: lessonIds });
  } catch (error) {
    return res.status(500).json({ message: 'Course deletion failed.', error: error.message });
  }
};

module.exports = { getCourses, getCourseById, createCourse, updateCourse, deleteCourse };
