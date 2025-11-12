import { Link } from 'react-router-dom';
import './NotFound.css';
import '../styles/shared.css';

export const NotFoundPage = () => {
  return (
    <section className="not-found">
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/home" className="btn btn-primary">
        Go to Home
      </Link>
    </section>
  );
};
