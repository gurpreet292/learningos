import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

const initialCourseForm = {
  title: '',
  description: '',
  category: 'HTML',
  thumbnail: '',
};

const initialLessonForm = {
  courseId: '',
  title: '',
  content: '',
  explanation: '',
  codeExample: '',
  tryItYourself: '',
  practiceTask: '',
  order: 1,
};

const AdminPage = () => {
  const [courses, setCourses] = useState([]);
  const [courseForm, setCourseForm] = useState(initialCourseForm);
  const [lessonForm, setLessonForm] = useState(initialLessonForm);
  const [message, setMessage] = useState('');

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
      if (response.data[0] && !lessonForm.courseId) {
        setLessonForm((prev) => ({ ...prev, courseId: response.data[0]._id }));
      }
    } catch (error) {
      console.error('Failed to fetch courses for admin:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCourseChange = (event) => {
    const { name, value } = event.target;
    setCourseForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLessonChange = (event) => {
    const { name, value } = event.target;
    setLessonForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCourse = async (event) => {
    event.preventDefault();

    try {
      await api.post('/courses', courseForm);
      setMessage('Course created successfully.');
      setCourseForm(initialCourseForm);
      fetchCourses();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to create course.');
    }
  };

  const handleCreateLesson = async (event) => {
    event.preventDefault();

    try {
      await api.post('/lessons', {
        ...lessonForm,
        order: Number(lessonForm.order),
      });
      setMessage('Lesson created successfully.');
      setLessonForm((prev) => ({ ...prev, title: '', content: '', explanation: '', codeExample: '', tryItYourself: '', practiceTask: '', order: Number(prev.order) + 1 }));
      fetchCourses();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to create lesson.');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await api.delete(`/courses/${courseId}`);
      setMessage('Course deleted.');
      fetchCourses();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to delete course.');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.45),_transparent_18%),radial-gradient(circle_at_right,_rgba(226,232,240,0.55),_transparent_24%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-6 text-slate-800">
      <div className="mx-auto flex max-w-7xl gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          <div className="rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-200/50">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin panel</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Course management</h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-600">
              Manage the learning catalog from one place. Create new courses, add lesson content, and keep the platform ready for learners.
            </p>
          </div>

          {message && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              {message}
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-2">
            <form onSubmit={handleCreateCourse} className="space-y-4 rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-200/40">
              <h2 className="text-xl font-bold text-slate-900">Create course</h2>

              <input name="title" value={courseForm.title} onChange={handleCourseChange} placeholder="Course title" className="w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-slate-700 placeholder:text-slate-400" required />
              <textarea name="description" value={courseForm.description} onChange={handleCourseChange} placeholder="Course description" className="min-h-[120px] w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-slate-700 placeholder:text-slate-400" required />
              <input name="category" value={courseForm.category} onChange={handleCourseChange} placeholder="Category" className="w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-slate-700 placeholder:text-slate-400" required />
              <input name="thumbnail" value={courseForm.thumbnail} onChange={handleCourseChange} placeholder="Thumbnail URL" className="w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-slate-700 placeholder:text-slate-400" />

              <button type="submit" className="rounded-full bg-gradient-to-r from-slate-200 via-blue-100 to-slate-100 px-5 py-3 font-semibold text-slate-800">
                Save course
              </button>
            </form>

            <form onSubmit={handleCreateLesson} className="space-y-4 rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-200/40">
              <h2 className="text-xl font-bold text-slate-900">Add lesson</h2>

              <select name="courseId" value={lessonForm.courseId} onChange={handleLessonChange} className="w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-slate-700" required>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>{course.title}</option>
                ))}
              </select>

              <input name="title" value={lessonForm.title} onChange={handleLessonChange} placeholder="Lesson title" className="w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-slate-700 placeholder:text-slate-400" required />
              <textarea name="content" value={lessonForm.content} onChange={handleLessonChange} placeholder="Main lesson content" className="min-h-[120px] w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-slate-700 placeholder:text-slate-400" required />
              <textarea name="explanation" value={lessonForm.explanation} onChange={handleLessonChange} placeholder="Explanation" className="min-h-[80px] w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-slate-700 placeholder:text-slate-400" />
              <textarea name="codeExample" value={lessonForm.codeExample} onChange={handleLessonChange} placeholder="Code example" className="min-h-[120px] w-full rounded-2xl border border-white/80 bg-white px-4 py-3 font-mono text-slate-700 placeholder:text-slate-400" />
              <textarea name="tryItYourself" value={lessonForm.tryItYourself} onChange={handleLessonChange} placeholder="Try it yourself" className="min-h-[80px] w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-slate-700 placeholder:text-slate-400" />
              <textarea name="practiceTask" value={lessonForm.practiceTask} onChange={handleLessonChange} placeholder="Practice task" className="min-h-[80px] w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-slate-700 placeholder:text-slate-400" />
              <input name="order" type="number" value={lessonForm.order} onChange={handleLessonChange} placeholder="Order" className="w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-slate-700 placeholder:text-slate-400" />

              <button type="submit" className="rounded-full bg-gradient-to-r from-slate-200 via-blue-100 to-slate-100 px-5 py-3 font-semibold text-slate-800">
                Save lesson
              </button>
            </form>
          </div>

          <div className="rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-200/40">
            <h2 className="text-xl font-bold text-slate-900">Course overview</h2>

            <div className="mt-5 space-y-4">
              {courses.length ? (
                courses.map((course) => (
                  <div key={course._id} className="flex flex-col gap-3 rounded-2xl border border-white/70 bg-white p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
                      <p className="text-sm text-slate-600">{course.lessons?.length || 0} lessons</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/70 bg-slate-50 p-5 text-center">
                  <h3 className="text-lg font-semibold text-slate-900">No courses yet</h3>
                  <p className="mt-2 text-sm text-slate-600">Create the first course to populate the learning library.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
