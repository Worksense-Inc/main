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
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <NavBar />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/forms"
              element={
                <ProtectedRoute>
                  <FormsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account-info"
              element={
                <ProtectedRoute>
                  <AccountInfoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/board"
              element={
                <ProtectedRoute role="manager">
                  <ManagerBoardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/calendar"
              element={
                <ProtectedRoute role="manager">
                  <ManagerCalendarPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </ToastProvider>
    </AuthProvider>
  );
}
