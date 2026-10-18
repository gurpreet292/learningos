import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import CourseCard from '../components/CourseCard';
import api from '../services/api';
import './CoursesPage.css';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    api.get('/courses')
      .then(({ data }) => {
        if (isCurrent) setCourses(data);
      })
      .catch(() => {
        if (isCurrent) setHasError(true);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [retry]);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return courses;

    return courses.filter((course) => (
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query)
    ));
  }, [courses, search]);

  const totalLessons = courses.reduce((sum, course) => sum + (course.lessons?.length || 0), 0);
  const totalQuizzes = courses.reduce(
    (sum, course) => sum + (course.lessons?.filter((lesson) => lesson.isQuiz).length || 0),
    0
  );

  return (
    <div className="learning-site catalog-page">
      <SiteHeader />

      <main className="catalog-content">
        <section className="catalog-heading" aria-labelledby="catalog-title">
          <div>
            <p className="eyebrow">The course library</p>
            <h1 id="catalog-title">Choose a skill.<br />Make it yours.</h1>
            <p>Focused courses for the building blocks of the web. Preview a path, find your starting point, and keep learning at your pace.</p>
          </div>

          <label className="catalog-search">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by topic or skill"
              aria-label="Search courses by topic or skill"
            />
          </label>
        </section>

        <div className="catalog-stats" aria-label="Course library totals">
          <div><strong>{isLoading ? '—' : courses.length}</strong><span>learning paths</span></div>
          <div><strong>{isLoading ? '—' : totalLessons}</strong><span>guided lessons</span></div>
          <div><strong>{isLoading ? '—' : totalQuizzes}</strong><span>course quizzes</span></div>
        </div>

        {hasError ? (
          <div className="catalog-error" role="alert">
            <p>We could not load the course library. Check your connection and try again.</p>
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setHasError(false);
                setRetry((value) => value + 1);
              }}
            >
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <p className="catalog-empty" role="status">Loading courses…</p>
        ) : filteredCourses.length ? (
          <div className="catalog-grid">
            {filteredCourses.map((course) => <CourseCard key={course._id} course={course} />)}
          </div>
        ) : (
          <div className="catalog-empty" role="status">
            {courses.length ? 'No courses match that search. Try a different topic.' : 'No courses are available yet.'}
          </div>
        )}
      </main>

      <footer className="site-footer catalog-footer">
        <Link className="site-brand" to="/">
          <span className="site-brand__mark">L</span>
          <span>LearningOS</span>
        </Link>
        <p>Learn the fundamentals. Build with confidence.</p>
        <div><Link to="/">Home</Link><Link to="/login">Log in</Link></div>
      </footer>
    </div>
  );
};

export default CoursesPage;
