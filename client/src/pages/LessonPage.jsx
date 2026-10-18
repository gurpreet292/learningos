import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';

const LessonPage = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [progress, setProgress] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submission, setSubmission] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const lessonResponse = await api.get(`/lessons/${lessonId}`);
        const lessonData = lessonResponse.data;
        const [courseResponse, progressResponse] = await Promise.all([
          api.get(`/courses/${lessonData.courseId}`),
          api.get('/progress'),
        ]);

        setLesson(lessonData);
        setCourse(courseResponse.data);
        setProgress(progressResponse.data);

        if (lessonData.isQuiz) {
          const quizResponse = await api.get(`/quizzes/${lessonId}`);
          setQuiz(quizResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch lesson data:', error);
      }
    };

    fetchLessonData();
  }, [lessonId]);

  const currentProgress = useMemo(() => {
    if (!lesson || !course) return null;

    return progress.find((item) => String(item.courseId?._id ?? item.courseId) === String(course._id)) || null;
  }, [course, lesson, progress]);

  const completedLessonIds = useMemo(() => {
    const ids = currentProgress?.completedLessons?.map((item) => String(item?._id ?? item)) || [];
    return new Set(ids);
  }, [currentProgress]);

  const isCompleted = lesson ? completedLessonIds.has(String(lesson._id)) : false;

  const currentIndex = course?.lessons?.findIndex((item) => String(item._id) === String(lessonId)) ?? -1;
  const nextLesson = course?.lessons?.[currentIndex + 1] || null;

  const handleMarkComplete = async () => {
    if (!lesson || !course) return;

    setIsSaving(true);

    const ids = new Set(completedLessonIds);
    ids.add(String(lesson._id));

    try {
      const response = await api.post('/progress', {
        courseId: course._id,
        completedLessons: Array.from(ids),
        lastVisitedLesson: lesson._id,
      });

      setProgress((prev) => {
        const next = [...prev];
        const existingIndex = next.findIndex((item) => String(item.courseId?._id ?? item.courseId) === String(course._id));

        if (existingIndex >= 0) {
          next[existingIndex] = response.data;
        } else {
          next.push(response.data);
        }

        return next;
      });
    } catch (error) {
      console.error('Failed to save lesson progress:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleQuizSubmit = async () => {
    if (!lesson || !course) return;

    try {
      const response = await api.post('/quizzes/submit', {
        lessonId: lesson._id,
        courseId: course._id,
        answers,
      });

      setSubmission(response.data);
      if (response.data.passed) {
        await handleMarkComplete();
      }
    } catch (error) {
      console.error('Quiz submission failed:', error);
    }
  };

  if (!lesson || !course) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">Loading lesson...</div>;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(167,243,208,0.45),_transparent_18%),radial-gradient(circle_at_right,_rgba(196,181,253,0.22),_transparent_24%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-6 text-slate-800">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link to={`/courses/${course._id}`} className="text-sm text-sky-700 hover:text-slate-900">
            ← Back to course
          </Link>

          <button
            onClick={handleMarkComplete}
            disabled={isSaving || isCompleted}
            className="rounded-full bg-gradient-to-r from-sky-200 via-violet-200 to-rose-200 px-4 py-2 text-sm font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isCompleted ? 'Completed' : isSaving ? 'Saving...' : 'Mark as completed'}
          </button>
        </div>

        <article className="rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-2xl shadow-slate-200/50">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs uppercase tracking-[0.22em] text-sky-600">
              {course.category}
            </span>
            <span className="rounded-full border border-white/70 bg-slate-50 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500">
              Lesson {currentIndex + 1}
            </span>
          </div>

          <h1 className="text-4xl font-black text-slate-900">{lesson.title}</h1>
          <p className="mt-4 max-w-4xl text-lg text-slate-600">{lesson.content}</p>

          <div className="mt-8 rounded-[24px] border border-white/70 bg-slate-50 p-5">
            <h2 className="text-xl font-bold text-slate-900">Why it matters</h2>
            <p className="mt-3 text-slate-600">{lesson.explanation || 'This lesson introduces a key concept in web development and helps you understand how it fits into the bigger picture.'}</p>
          </div>

          <div className="mt-8 rounded-[24px] border border-white/70 bg-slate-50 p-5">
            <h2 className="text-xl font-bold text-slate-900">Code example</h2>
            <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-900 p-4 text-sm text-sky-100">
              <code>{lesson.codeExample || 'const learning = "OS";\nconsole.log(learning);'}</code>
            </pre>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[24px] border border-white/70 bg-slate-50 p-5">
              <h2 className="text-xl font-bold text-slate-900">Try it yourself</h2>
              <p className="mt-3 whitespace-pre-wrap text-slate-600">{lesson.tryItYourself || 'Open your editor and write a short snippet based on the example.'}</p>
            </div>

            <div className="rounded-[24px] border border-white/70 bg-slate-50 p-5">
              <h2 className="text-xl font-bold text-slate-900">Practice task</h2>
              <p className="mt-3 whitespace-pre-wrap text-slate-600">{lesson.practiceTask || 'Apply the concept in a small practical challenge.'}</p>
            </div>
          </div>

          {lesson.isQuiz ? (
            <div className="mt-8 rounded-[24px] border border-sky-200 bg-sky-50 p-5">
              <h2 className="text-2xl font-bold text-slate-900">Quiz challenge</h2>

              <div className="mt-5 space-y-5">
                {quiz.map((question, index) => (
                  <div key={question._id} className="rounded-2xl border border-white/70 bg-white p-4">
                    <p className="font-medium text-slate-900">
                      {index + 1}. {question.question}
                    </p>
                    <div className="mt-3 grid gap-2">
                      {question.options.map((option) => (
                        <label key={option} className="flex items-center gap-3 rounded-xl border border-white/70 p-3 text-sm text-slate-600">
                          <input
                            type="radio"
                            name={question._id}
                            value={option}
                            checked={answers[question._id] === option}
                            onChange={() => handleAnswerChange(question._id, option)}
                            className="h-4 w-4 accent-sky-400"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleQuizSubmit}
                className="mt-6 rounded-full bg-gradient-to-r from-sky-200 via-violet-200 to-rose-200 px-5 py-3 font-semibold text-slate-800"
              >
                Submit quiz
              </button>

              {submission && (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
                  Your score: <span className="font-bold">{submission.score}%</span> ({submission.correctAnswers}/{submission.total})
                </div>
              )}
            </div>
          ) : null}
        </article>

        {nextLesson && (
          <div className="mt-6 flex justify-end">
            <Link
              to={`/lessons/${nextLesson._id}`}
              className="rounded-full border border-white/70 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-sky-200 hover:text-slate-900"
            >
              Next lesson →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPage;
