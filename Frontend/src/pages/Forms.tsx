import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import './Forms.css';
import '../styles/shared.css';

interface ShiftChangeFormData {
  employee: string;
  existingShift: string;
  desiredDate: string;
  desiredStart: string;
  desiredEnd: string;
  notes: string;
}

interface TimeOffFormData {
  startDate: string;
  startTime: string;
  startAllDay: boolean;
  endDate: string;
  endTime: string;
  endAllDay: boolean;
  reason: string;
}

export const FormsPage = () => {
  return (
    <div className="forms-workspace">
      <ShiftChangeForm />
      <TimeOffForm />
    </div>
  );
};

const ShiftChangeForm = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [loadingShifts, setLoadingShifts] = useState(false);
  const [formData, setFormData] = useState<ShiftChangeFormData>({
    employee: '',
    existingShift: '',
    desiredDate: '',
    desiredStart: '',
    desiredEnd: '',
    notes: '',
  });
  const [userShifts, setUserShifts] = useState<Array<{ value: string; label: string }>>([]);

  // Load user name into form when auth user changes
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, employee: `${user.first_name} ${user.last_name}` }));
    }
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!user) return;
      setLoadingShifts(true);
      const res = await api.getShifts({ employee_id: user.id });
      if (cancelled) return;
      if (res.success && res.data) {
        const today = new Date();
        const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        const shifts = res.data
          .filter((shift) => {
            const shiftDate = new Date(shift.shift_date + 'T00:00:00');
            return shiftDate >= today && shiftDate <= in30Days;
          })
          .map((shift) => {
            const date = new Date(shift.shift_date + 'T00:00:00');
            const dateStr = date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });
            return {
              value: `${shift.id}|${shift.shift_date}|${shift.start_time}|${shift.end_time}`,
              label: `${dateStr} • ${shift.start_time}–${shift.end_time}${shift.notes ? ' • ' + shift.notes : ''}`,
            };
          });
        setUserShifts(shifts);
      } else {
        showToast(res.message || 'Failed to load shifts');
      }
      setLoadingShifts(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [user, showToast]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.existingShift) {
      showToast('Please select your current shift');
      return;
    }
    if (!formData.desiredDate || !formData.desiredStart || !formData.desiredEnd) {
      showToast('Please fill in all desired shift details');
      return;
    }
    // NOTE: This feature allows employees to request modifications to their assigned shifts.
    // Backend endpoint would need to be created to support this workflow.
    // Current shift swap functionality (picking up open shifts) is already implemented via /api/shift-swaps
    showToast(
      'Shift modification requests are not yet supported. Please contact your manager directly.',
    );
    handleClear();
  };

  const handleClear = () => {
    setFormData((prev) => ({
      ...prev,
      existingShift: '',
      desiredDate: '',
      desiredStart: '',
      desiredEnd: '',
      notes: '',
    }));
  };

  return (
    <div className="card form-card">
      <h2>
        Shift Change Request{' '}
        <span className="subtitle">· choose your current shift and the desired change</span>
      </h2>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="sc-employee">Employee</label>
          <input
            id="sc-employee"
            type="text"
            value={formData.employee}
            disabled
            className="input-disabled"
          />
          <div className="helper">Your upcoming shifts will be loaded below.</div>
        </div>

        <div className="form-field">
          <label htmlFor="sc-existing">Your Shift</label>
          <select
            id="sc-existing"
            value={formData.existingShift}
            onChange={(e) => setFormData({ ...formData, existingShift: e.target.value })}
          >
            <option value="">— Select one of your upcoming shifts —</option>
            {userShifts.map((shift) => (
              <option key={shift.value} value={shift.value}>
                {shift.label}
              </option>
            ))}
          </select>
          {loadingShifts && (
            <div className="helper">
              <LoadingSpinner size="small" />
            </div>
          )}
          {!loadingShifts && userShifts.length === 0 && (
            <div className="helper">No upcoming shifts found in the next 30 days.</div>
          )}
          {!loadingShifts && userShifts.length > 0 && (
            <div className="helper">Pick from your shifts in the next 30 days.</div>
          )}
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="sc-date">Desired Date</label>
            <input
              id="sc-date"
              type="date"
              value={formData.desiredDate}
              onChange={(e) => setFormData({ ...formData, desiredDate: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label htmlFor="sc-start">Desired Start</label>
            <input
              id="sc-start"
              type="time"
              value={formData.desiredStart}
              onChange={(e) => setFormData({ ...formData, desiredStart: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="sc-end">Desired End</label>
            <input
              id="sc-end"
              type="time"
              value={formData.desiredEnd}
              onChange={(e) => setFormData({ ...formData, desiredEnd: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label htmlFor="sc-notes">Notes (optional)</label>
            <input
              id="sc-notes"
              type="text"
              placeholder="Reason or details…"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={handleClear}>
            Clear
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

const TimeOffForm = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<TimeOffFormData>({
    startDate: '',
    startTime: '',
    startAllDay: false,
    endDate: '',
    endTime: '',
    endAllDay: false,
    reason: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('You must be logged in');
      return;
    }
    if (!formData.startDate) {
      showToast('Please select a start date');
      return;
    }
    if (!formData.startAllDay && !formData.startTime) {
      showToast('Select a start time or check All day');
      return;
    }
    const endDate = formData.endDate || formData.startDate;
    setSubmitting(true);
    const res = await api.createTimeOff({
      employee_id: user.id,
      start_date: formData.startDate,
      end_date: endDate,
      reason: formData.reason || undefined,
    });
    setSubmitting(false);
    if (res.success) {
      showToast('Time off request submitted');
      handleClear();
    } else {
      showToast(res.message || 'Failed to submit request');
    }
  };

  const handleClear = () => {
    setFormData({
      startDate: '',
      startTime: '',
      startAllDay: false,
      endDate: '',
      endTime: '',
      endAllDay: false,
      reason: '',
    });
  };

  return (
    <div className="card form-card">
      <h2>
        Time Off Request <span className="subtitle">· pick a start and (optional) end</span>
      </h2>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="to-start-date">Start Date</label>
            <input
              id="to-start-date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label htmlFor="to-start-time">Start Time</label>
            <input
              id="to-start-time"
              type="time"
              value={formData.startTime}
              disabled={formData.startAllDay}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            />
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={formData.startAllDay}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startAllDay: e.target.checked,
                    startTime: e.target.checked ? '' : formData.startTime,
                  })
                }
              />
              All day
            </label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="to-end-date">End Date</label>
            <input
              id="to-end-date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label htmlFor="to-end-time">End Time</label>
            <input
              id="to-end-time"
              type="time"
              value={formData.endTime}
              disabled={formData.endAllDay}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            />
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={formData.endAllDay}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endAllDay: e.target.checked,
                    endTime: e.target.checked ? '' : formData.endTime,
                  })
                }
              />
              All day
            </label>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="to-reason">Reason (optional)</label>
          <textarea
            id="to-reason"
            placeholder="Short reason for manager…"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={handleClear}>
            Clear
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};
