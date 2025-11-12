import { useState, FormEvent } from 'react';
import { useToast } from '../components/Toast';
import './AccountInfo.css';
import '../styles/shared.css';

interface AccountFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  role: string;
}

interface NotificationSettings {
  emailOnShiftChange: boolean;
  dailyTextReminders: boolean;
}

export const AccountInfoPage = () => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState<AccountFormData>({
    firstName: 'Jorge',
    lastName: 'Gonzales',
    email: 'jorge@worksense.com',
    phone: '(555) 123-4567',
    location: 'Chicago, IL',
    timezone: 'America/Chicago (CST)',
    role: 'Manager',
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailOnShiftChange: true,
    dailyTextReminders: false,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    showToast('Account details saved!');
  };

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      firstName: 'Jorge',
      lastName: 'Gonzales',
      email: 'jorge@worksense.com',
      phone: '(555) 123-4567',
      location: 'Chicago, IL',
      timezone: 'America/Chicago (CST)',
      role: 'Manager',
    });
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
              <p className="role-info">{formData.role} • Central Team</p>
            </div>
            <button className="btn-change-photo" type="button">
              Change Photo
            </button>
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
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-row">
              <label htmlFor="location">Location / Timezone</label>
              <div className="field-split">
                <input
                  id="location"
                  type="text"
                  placeholder="Chicago, IL"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
                <select
                  id="tz"
                  aria-label="Timezone"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                >
                  <option>America/Chicago (CST)</option>
                  <option>America/New_York (EST)</option>
                  <option>America/Los_Angeles (PST)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <label htmlFor="role">Role</label>
              <input
                id="role"
                type="text"
                placeholder="Manager"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>

            <div className="form-actions">
              <button className="btn btn-cancel" type="button" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit">
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <section className="card notifications-card">
          <h3>Notification Preferences</h3>
          <p className="small">Manage how you receive updates about shifts and schedules.</p>

          <div className="switch-row">
            <label className="switch">
              <input
                type="checkbox"
                checked={notifications.emailOnShiftChange}
                onChange={(e) =>
                  setNotifications({ ...notifications, emailOnShiftChange: e.target.checked })
                }
              />
              <span className="slider"></span>
            </label>
            <span>Email me when shifts change</span>
          </div>

          <div className="switch-row">
            <label className="switch">
              <input
                type="checkbox"
                checked={notifications.dailyTextReminders}
                onChange={(e) =>
                  setNotifications({ ...notifications, dailyTextReminders: e.target.checked })
                }
              />
              <span className="slider"></span>
            </label>
            <span>Text me daily reminders</span>
          </div>
        </section>
      </div>

      <footer className="account-footer">
        <small>© 2025 WorkSense</small>
      </footer>
    </>
  );
};
