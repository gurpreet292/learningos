import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SiteHeader = () => {
  const { user } = useAuth();

  return (
    <header className="site-header">
      <Link className="site-brand" to="/" aria-label="LearningOS home">
        <span className="site-brand__mark">L</span>
        <span>LearningOS</span>
      </Link>

      <nav className="site-nav" aria-label="Main navigation">
        <Link to="/#paths">Learning paths</Link>
        <Link to="/#approach">Our approach</Link>
        <Link to="/courses">Courses</Link>
      </nav>

      <div className="site-actions">
        {user ? (
          <Link className="site-join" to="/dashboard">My dashboard <span aria-hidden="true">↗</span></Link>
        ) : (
          <>
            <Link className="site-login" to="/login">Log in</Link>
            <Link className="site-join" to="/register">Create account</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default SiteHeader;