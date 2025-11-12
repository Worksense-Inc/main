import { FormEvent } from 'react';
import logoUrl from '../assets/WorkSense_logo_compressed_under_1MB.jpg';
import '../styles/login.css';

export const LoginPage = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Authentication will be implemented when backend is ready
  };

  return (
    <section className="login-shell" aria-label="Login">
      <div className="login-card" aria-label="Login form">
        <img src={logoUrl} alt="WorkSense logo" className="logo" width={200} height={60} />
        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtext">Sign in to continue to your dashboard</p>
        <form className="login-form" onSubmit={handleSubmit} autoComplete="on">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="Enter your email" required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="forgot-password">
              Forgot password?
            </button>
          </div>
          <button type="submit">Log in</button>
          <p className="signup-prompt">
            Don&apos;t have an account?{' '}
            <button type="button" className="signup-link">
              Create one
            </button>
          </p>
        </form>
      </div>
    </section>
  );
};
