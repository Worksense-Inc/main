import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './nav.css';

const getNavLinkClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '');

export const NavBar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="ws-nav">
      <div className="ws-nav__inner">
        <Link to="/" className="ws-brand">
          WorkSense
        </Link>
        <div className="ws-nav__links">
          {!user ? (
            <NavLink to="/login" className={getNavLinkClass}>
              Login
            </NavLink>
          ) : (
            <>
              <NavLink to="/home" className={getNavLinkClass}>
                Home
              </NavLink>
              <NavLink to="/forms" className={getNavLinkClass}>
                Forms
              </NavLink>
              <NavLink to="/account-info" className={getNavLinkClass}>
                Account
              </NavLink>
              {user.role === 'manager' && (
                <>
                  <NavLink to="/manager/board" className={getNavLinkClass}>
                    Manager Board
                  </NavLink>
                  <NavLink to="/manager/calendar" className={getNavLinkClass}>
                    Calendar
                  </NavLink>
                </>
              )}
              <button onClick={handleLogout} className="ws-nav__logout">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
