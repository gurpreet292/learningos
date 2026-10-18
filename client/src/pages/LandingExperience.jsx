import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import api from '../services/api';
import './LandingExperience.css';

const features = [
  {
    number: '01',
    title: 'Learn in sequence',
    description: 'Move from core concepts to practical work with lessons arranged into clear learning paths.',
  },
  {
    number: '02',
    title: 'Practice as you go',
    description: 'Try examples, complete small tasks, and check your understanding with course quizzes.',
  },
  {
    number: '03',
    title: 'See your progress',
    description: 'Keep completed lessons and course progress together in one learner dashboard.',
  },
];

const LandingExperience = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    api.get('/courses')
      .then(({ data }) => {
        if (isCurrent) setCourses(data);
      })
      .catch(() => {
        if (isCurrent) setCourses([]);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const lessonCount = courses.reduce((total, course) => total + (course.lessons?.length || 0), 0);
  const quizCount = courses.reduce(
    (total, course) => total + (course.lessons?.filter((lesson) => lesson.isQuiz).length || 0),
    0
  );

  return (
    <div className="learning-site">
      <SiteHeader />

      <main>
        <section className="learning-hero" aria-labelledby="hero-title">
          <img
            className="learning-hero__image"
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2400&q=88"
            alt="A developer working at a laptop with code on screen"
            fetchPriority="high"
          />
          <div className="learning-hero__shade" aria-hidden="true" />

          <div className="learning-hero__content">
            <p className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> A practical place to learn the web</p>
            <h1 id="hero-title">Learn the web.<br />Build what comes next.</h1>
            <p className="learning-hero__copy">
              Start with HTML, CSS, and JavaScript. Work through focused lessons, practice the ideas, and keep your progress moving.
            </p>
            <div className="learning-hero__actions">
              <Link className="button button--coral" to="/courses">Explore learning paths <span aria-hidden="true">↗</span></Link>
              <Link className="button button--quiet" to="/register">Create your account</Link>
            </div>
            <div className="learning-hero__topics" aria-label="Course topics">
              <span>HTML</span><span>CSS</span><span>JavaScript</span>
            </div>
          </div>

          <a className="learning-hero__scroll" href="#paths">
            <span className="learning-hero__scroll-line" />
            Scroll to explore
          </a>
        </section>

        <section className="learning-overview" aria-label="LearningOS course totals">
          <p>Make your next hour of learning count.</p>
          <div className="learning-overview__stats">
            <div><strong>{isLoading ? '—' : courses.length}</strong><span>learning paths</span></div>
            <div><strong>{isLoading ? '—' : lessonCount}</strong><span>guided lessons</span></div>
            <div><strong>{isLoading ? '—' : quizCount}</strong><span>course quizzes</span></div>
          </div>
        </section>

        <section className="path-section" id="paths" aria-labelledby="paths-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The course library</p>
              <h2 id="paths-title">A good place to start.<br />A clear way forward.</h2>
            </div>
            <Link className="text-link" to="/courses">Browse every course <span aria-hidden="true">↗</span></Link>
          </div>

          {isLoading ? (
            <p className="path-message" role="status">Loading learning paths…</p>
          ) : courses.length ? (
            <div className="path-grid">
              {courses.slice(0, 3).map((course, index) => (
                <Link className={`path-card path-card--${index + 1}`} key={course._id} to={`/courses/${course._id}`}>
                  <div className="path-card__image-wrap">
                    <img src={course.thumbnail} alt="" loading="lazy" />
                    <span className="path-card__category">{course.category}</span>
                    <span className="path-card__index">0{index + 1}</span>
                  </div>
                  <div className="path-card__body">
                    <div>
                      <h3>{course.title}</h3>
                      <p>{course.description}</p>
                    </div>
                    <div className="path-card__meta">
                      <span>{course.lessons?.length || 0} lessons</span>
                      <span className="path-card__arrow" aria-hidden="true">↗</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="path-message">Course paths are temporarily unavailable. Please try again shortly.</p>
          )}
        </section>

        <section className="approach-section" id="approach" aria-labelledby="approach-title">
          <div className="approach-section__intro">
            <p className="eyebrow">A better learning rhythm</p>
            <h2 id="approach-title">Small steps.<br />Useful skills.</h2>
            <p>Build a steady foundation, then use it to make things that work on the web.</p>
          </div>
          <div className="approach-list">
            {features.map((feature) => (
              <article className="approach-item" key={feature.number}>
                <span className="approach-item__number">{feature.number}</span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
                <span className="approach-item__plus" aria-hidden="true">+</span>
              </article>
            ))}
          </div>
        </section>

        <section className="join-band">
          <div>
            <p className="eyebrow eyebrow--light">Your next project starts here</p>
            <h2>Bring an idea.<br />Leave with a skill.</h2>
          </div>
          <Link className="button button--lime" to="/register">Start learning <span aria-hidden="true">↗</span></Link>
        </section>
      </main>

      <footer className="site-footer">
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

export default LandingExperience;