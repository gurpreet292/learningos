import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const lessonCount = course.lessons?.length || 0;
  const quizCount = course.lessons?.filter((lesson) => lesson.isQuiz).length || 0;

  return (
    <Link className="path-card catalog-card" to={`/courses/${course._id}`}>
      <div className="path-card__image-wrap">
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80'}
          alt={course.title}
          loading="lazy"
        />
        <span className="path-card__category">{course.category}</span>
        <span className="path-card__index">{String(lessonCount).padStart(2, '0')}</span>
      </div>

      <div className="path-card__body">
        <div>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
        </div>
        <div className="path-card__meta">
          <span>{lessonCount} lessons · {quizCount} quizzes</span>
          <span className="path-card__arrow" aria-hidden="true">↗</span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
