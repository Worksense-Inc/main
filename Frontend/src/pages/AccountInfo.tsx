import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { api } from '../services/api';
import './AccountInfo.css';
import '../styles/shared.css';

interface AccountFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const AccountInfoPage = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<AccountFormData>({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role === 'manager' ? 'Manager' : 'Employee',
      });
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setIsSubmitting(true);
    try {
      // Check if anything actually changed
      const hasChanges =
        formData.firstName !== user.first_name ||
        formData.lastName !== user.last_name ||
        formData.email !== user.email;

      if (!hasChanges) {
        showToast('No changes to save');
        setIsSubmitting(false);
        return;
      }

      const updates: { first_name?: string; last_name?: string; email?: string } = {};

      if (formData.firstName !== user.first_name) {
        updates.first_name = formData.firstName;
      }
      if (formData.lastName !== user.last_name) {
        updates.last_name = formData.lastName;
      }
      if (formData.email !== user.email) {
        updates.email = formData.email;
      }

      const response = await api.updateProfile(updates);

      if (response.success && response.data) {
        // Refresh user context
        await refreshUser();
        showToast('Profile updated successfully');
      } else {
        showToast(response.message || 'Failed to update profile');
      }
    } catch {
      showToast('Error updating profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original user values
    if (user) {
      setFormData({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role === 'manager' ? 'Manager' : 'Employee',
      });
    }
    showToast('Changes discarded');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <>
      <div className="account-shell">
        <header className="account-head">
          <h1>Account Details</h1>
          <p className="hint">Basic info used across scheduling and notifications.</p>
        </header>

        <div className="account-grid">
          <aside className="card profile-card">
            <div className="avatar" aria-hidden="true">
              {getInitials(formData.firstName, formData.lastName)}
            </div>
            <div className="profile-meta">
              <h2>
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="role-info">{formData.role}</p>
            </div>
          </aside>

          <form className="card account-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="first">First name</label>
              <input
                id="first"
                type="text"
                placeholder="Jamie"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>

            <div className="form-row">
              <label htmlFor="last">Last name</label>
              <input
                id="last"
                type="text"
                placeholder="Douglass"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>

            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="jamie@worksense.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-row">
              <label htmlFor="role">Role</label>
              <input
                id="role"
                type="text"
                value={formData.role}
                disabled
                className="input-disabled"
              />
              <div className="helper-text">Role is managed by administrators</div>
            </div>

            <div className="form-actions">
              <button
                className="btn btn-cancel"
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer className="account-footer">
        <small>© 2025 WorkSense</small>
      </footer>
    </>
  );
};
