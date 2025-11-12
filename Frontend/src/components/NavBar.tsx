import { Link, NavLink } from 'react-router-dom';
import './nav.css';

const getNavLinkClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '');

export const NavBar = () => {
  return (
    <nav className="ws-nav">
      <div className="ws-nav__inner">
        <Link to="/" className="ws-brand">
          WorkSense
        </Link>
        <div className="ws-nav__links">
          <NavLink to="/login" className={getNavLinkClass}>
            Login
          </NavLink>
          <NavLink to="/home" className={getNavLinkClass}>
            Home
          </NavLink>
          <NavLink to="/forms" className={getNavLinkClass}>
            Forms
          </NavLink>
          <NavLink to="/account-info" className={getNavLinkClass}>
            Account
          </NavLink>
          <NavLink to="/manager/board" className={getNavLinkClass}>
            Manager Board
          </NavLink>
          <NavLink to="/manager/calendar" className={getNavLinkClass}>
            Calendar
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
