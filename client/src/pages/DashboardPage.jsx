import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ label, value, tone }) => (
  <div className="rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-200/50 backdrop-blur-sm">
    <p className="text-sm text-slate-500">{label}</p>
    <p className={`mt-3 text-3xl font-black ${tone}`}>{value}</p>
  </div>
);

const learningToolkit = [
  {
    title: 'Progress tracking',
    description: 'Monitor the path from first lesson to completed course inside the dashboard.',
  },
  {
    title: 'Quizzes and scoring',
    description: 'Check understanding with quiz submissions and instant score feedback.',
  },
  {
    title: 'Certificates',
    description: 'Download a certificate once a course is finished and the completion target is met.',
  },
  {
    title: 'Course management',
    description: 'Browse, resume, and discover courses without losing your place in the flow.',
  },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResponse, progressResponse] = await Promise.all([
          api.get('/courses'),
          api.get('/progress'),
        ]);

        setCourses(coursesResponse.data);
        setProgress(progressResponse.data);
      } catch (error) {
        console.error('Dashboard data fetch failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalCompleted = useMemo(() => {
    return progress.reduce((sum, item) => sum + (item.completedLessons?.length || 0), 0);
  }, [progress]);

  const overallProgress = useMemo(() => {
    if (!progress.length) return 0;
    const sum = progress.reduce((total, item) => total + (item.percentage || 0), 0);
    return Math.round(sum / progress.length);
  }, [progress]);

  const continueCourse = useMemo(() => {
    return progress.find((item) => (item.percentage || 0) < 100) || progress[0] || null;
  }, [progress]);

  const handleDownloadCertificate = (course) => {
    const matchedProgress = progress.find((item) => String(item.courseId?._id ?? item.courseId) === String(course._id));
    if (!matchedProgress || (matchedProgress.percentage || 0) < 100) {
      return;
    }

    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>LearningOS Certificate</title>
          <style>
            body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #ecfeff, #fdf2f8); margin: 0; display: grid; place-items: center; min-height: 100vh; }
            .card { width: 920px; max-width: 90vw; background: white; border-radius: 28px; border: 12px solid #22d3ee; box-shadow: 0 28px 80px rgba(15, 23, 42, 0.18); padding: 40px; text-align: center; }
            .brand { letter-spacing: .3em; text-transform: uppercase; color: #0f172a; font-size: 14px; font-weight: 700; }
            h1 { font-size: 48px; color: #0f172a; margin: 18px 0; }
            .subtitle { color: #475569; font-size: 18px; }
            .name { margin-top: 26px; font-size: 36px; font-weight: 700; color: #111827; }
            .details { margin-top: 24px; font-size: 20px; color: #334155; }
            .seal { margin-top: 30px; font-size: 20px; color: #ec4899; font-weight: 700; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="brand">LearningOS</div>
            <h1>Certificate of Completion</h1>
            <p class="subtitle">This certifies that</p>
            <div class="name">${user?.name || 'Student'}</div>
            <p class="details">has successfully completed the <strong>${course.title}</strong> course on <strong>${date}</strong>.</p>
            <div class="seal">LearningOS • Web Development Fundamentals</div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `LearningOS-${course.title.replace(/\s+/g, '-').toLowerCase()}-certificate.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const courseCards = courses.slice(0, 3);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.45),_transparent_18%),radial-gradient(circle_at_right,_rgba(226,232,240,0.55),_transparent_24%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-6 text-slate-800">
      <div className="mx-auto flex max-w-7xl gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          <div className="rounded-[28px] border border-white/80 bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100 p-6 shadow-xl shadow-slate-200/50">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Student dashboard</p>
                <h1 className="mt-2 text-3xl font-black text-slate-900">Welcome back, {user?.name || 'Learner'}!</h1>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/85 px-4 py-3 text-sm text-slate-700">
                Learning streak: <span className="font-bold text-sky-700">12 days</span>
              </div>
            </div>
          </div>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Overall progress" value={`${overallProgress}%`} tone="text-sky-600" />
            <StatCard label="Completed lessons" value={String(totalCompleted)} tone="text-violet-600" />
            <StatCard label="Active courses" value={String(courses.length)} tone="text-rose-600" />
            <StatCard label="Certificates" value="1" tone="text-emerald-600" />
          </section>

          <section className="rounded-[28px] border border-white/80 bg-white/85 p-5 backdrop-blur-sm shadow-lg shadow-slate-200/40">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Your toolkit</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">Everything you can do from the dashboard</h2>
              </div>
              <p className="max-w-2xl text-sm text-slate-600">
                The dashboard is designed around the product features that actually work today, so learners can resume, review, and finish courses without friction.
              </p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {learningToolkit.map((item) => (
                <div key={item.title} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] border border-white/80 bg-white/85 p-5 backdrop-blur-sm shadow-lg shadow-slate-200/40">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Continue learning</h2>
                <Link to="/courses" className="text-sm font-medium text-sky-700 hover:text-slate-900">
                  View all
                </Link>
              </div>

              {continueCourse ? (
                <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Current course</p>
                  <h3 className="mt-3 text-2xl font-bold text-slate-900">{continueCourse.courseId?.title || 'Learning path'}</h3>
                  <p className="mt-3 text-sm text-slate-600">
                    {continueCourse.courseId?.description || 'Keep moving through your selected learning path.'}
                  </p>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-300 via-violet-300 to-rose-300"
                      style={{ width: `${continueCourse.percentage || 0}%` }}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                    <span>{continueCourse.percentage || 0}% complete</span>
                    <div className="flex gap-3">
                      <Link
                        to={continueCourse.courseId ? `/courses/${continueCourse.courseId._id}` : '/courses'}
                        className="rounded-full bg-gradient-to-r from-slate-200 via-blue-100 to-slate-100 px-4 py-2 font-semibold text-slate-800"
                      >
                        Resume
                      </Link>
                      {(continueCourse.percentage || 0) >= 100 && (
                        <button
                          type="button"
                          onClick={() => handleDownloadCertificate(continueCourse.courseId)}
                          className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 font-semibold text-emerald-700"
                        >
                          Certificate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-600">No active course yet. Choose your first lesson.</p>
              )}
            </div>

            <div className="rounded-[28px] border border-white/80 bg-white/85 p-5 backdrop-blur-sm shadow-lg shadow-slate-200/40">
              <h2 className="text-xl font-bold text-slate-900">Recent activity</h2>
              {courses.length ? (
                <div className="mt-5 space-y-4">
                  {courses.slice(0, 3).map((course) => (
                    <div key={course._id} className="rounded-2xl border border-white/80 bg-white p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-900">{course.title}</span>
                        <span className="text-xs text-slate-500">2h ago</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">Completed a lesson in {course.category}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  Start a course to begin building your activity history.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/80 bg-white/85 p-5 backdrop-blur-sm shadow-lg shadow-slate-200/40">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Recommended courses</h2>
            </div>

            {courseCards.length ? (
              <div className="grid gap-5 md:grid-cols-3">
                {courseCards.map((course) => {
                  const courseProgress = progress.find((item) => String(item.courseId?._id ?? item.courseId) === String(course._id));
                  const completed = courseProgress?.percentage || 0;

                  return (
                    <div key={course._id} className="rounded-[24px] border border-white/80 bg-white p-4 transition hover:border-slate-200">
                      <Link to={`/courses/${course._id}`}>
                        <div className="h-32 overflow-hidden rounded-2xl">
                          <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-slate-900">{course.title}</h3>
                        <p className="mt-2 text-sm text-slate-600">{course.description}</p>
                      </Link>

                      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                        <span>{completed}%</span>
                        {completed >= 100 && (
                          <button
                            type="button"
                            onClick={() => handleDownloadCertificate(course)}
                            className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                          >
                            Download cert
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[24px] border border-white/70 bg-slate-50 p-6 text-center">
                <h3 className="text-lg font-semibold text-slate-900">No recommendations yet</h3>
                <p className="mt-2 text-sm text-slate-600">Add your first course to unlock personalized suggestions.</p>
                <Link to="/courses" className="mt-4 inline-flex rounded-full bg-gradient-to-r from-slate-200 via-blue-100 to-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">
                  Browse courses
                </Link>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
