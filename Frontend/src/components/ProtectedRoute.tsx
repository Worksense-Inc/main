import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import './ProtectedRoute.css';

interface ProtectedRouteProps {
  children: ReactNode;
  role?: 'manager' | 'employee';
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        <LoadingSpinner text="Authenticating..." />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/home" replace />;
  return <>{children}</>;
};
