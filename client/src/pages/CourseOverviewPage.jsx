import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import api from '../services/api';
import './CourseOverviewPage.css';

const CourseOverviewPage = () => {
  const { courseId } = useParams();
  const [courseResult, setCourseResult] = useState({ courseId: null, status: 'loading', course: null });

  useEffect(() => {
    let isCurrent = true;

    api.get(`/courses/${courseId}`)
      .then(({ data }) => {
        if (isCurrent) setCourseResult({ courseId, status: 'success', course: data });
      })
      .catch(() => {
        if (isCurrent) setCourseResult({ courseId, status: 'error', course: null });
      });

    return () => {
      isCurrent = false;
    };
  }, [courseId]);

  const isLoading = courseResult.courseId !== courseId;
  const hasError = !isLoading && courseResult.status === 'error';
  const course = !isLoading && courseResult.status === 'success' ? courseResult.course : null;

  return (
    <div className="learning-site course-overview-page">
      <SiteHeader />

      <main className="course-overview-content">
        <Link className="course-back-link" to="/courses">← All courses</Link>

        {isLoading ? (
          <p className="course-overview-message" role="status">Loading course…</p>
        ) : hasError || !course ? (
          <div className="course-overview-message" role="alert">
            <h1>Course unavailable</h1>
            <p>This course could not be loaded. It may have been removed, or the connection may be interrupted.</p>
            <Link className="button button--coral" to="/courses">Return to courses</Link>
          </div>
        ) : (
          <>
            <section className="course-overview-hero" aria-labelledby="course-title">
              <div className="course-overview-media">
                <img src={course.thumbnail} alt={`${course.title} course`} />
                <span>{course.category}</span>
              </div>
              <div className="course-overview-copy">
                <p className="eyebrow">Learning path / {course.category}</p>
                <h1 id="course-title">{course.title}</h1>
                <p>{course.description}</p>
                <div className="course-overview-meta">
                  <span><strong>{course.lessons?.length || 0}</strong> guided lessons</span>
                  <span><strong>{course.lessons?.filter((lesson) => lesson.isQuiz).length || 0}</strong> quizzes</span>
                </div>
                {course.lessons?.[0] && (
                  <Link className="button button--coral" to={`/lessons/${course.lessons[0]._id}`}>
                    Start learning <span aria-hidden="true">↗</span>
                  </Link>
                )}
              </div>
            </section>

            <section className="course-lessons" aria-labelledby="lessons-title">
              <div className="course-lessons-heading">
                <div>
                  <p className="eyebrow">Your course outline</p>
                  <h2 id="lessons-title">What you’ll work through</h2>
                </div>
                <span>{course.lessons?.length || 0} lessons</span>
              </div>
              <div className="course-lesson-list">
                {course.lessons?.map((lesson, index) => (
                  <Link className="course-lesson-row" key={lesson._id} to={`/lessons/${lesson._id}`}>
                    <span className="course-lesson-row__number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="course-lesson-row__title">{lesson.title}</span>
                    <span className={lesson.isQuiz ? 'course-lesson-row__type course-lesson-row__type--quiz' : 'course-lesson-row__type'}>
                      {lesson.isQuiz ? 'Quiz' : 'Lesson'}
                    </span>
                    <span className="course-lesson-row__arrow" aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="site-footer course-overview-footer">
        <Link className="site-brand" to="/">
          <span className="site-brand__mark">L</span>
          <span>LearningOS</span>
        </Link>
        <p>Learn the fundamentals. Build with confidence.</p>
        <div><Link to="/courses">Courses</Link><Link to="/login">Log in</Link></div>
      </footer>
    </div>
  );
};

export default CourseOverviewPage;