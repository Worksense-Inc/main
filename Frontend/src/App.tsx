import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/Login';
import { HomePage } from './pages/Home';
import { FormsPage } from './pages/Forms';
import { AccountInfoPage } from './pages/AccountInfo';
import { ManagerBoardPage } from './pages/ManagerBoard';
import { ManagerCalendarPage } from './pages/ManagerCalendar';
import { NotFoundPage } from './pages/NotFound';
import { NavBar } from './components/NavBar';
import { ToastProvider } from './components/Toast';

export default function App() {
  return (
    <ToastProvider>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <NavBar />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/forms" element={<FormsPage />} />
          <Route path="/account-info" element={<AccountInfoPage />} />
          <Route path="/manager/board" element={<ManagerBoardPage />} />
          <Route path="/manager/calendar" element={<ManagerCalendarPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </ToastProvider>
  );
}
