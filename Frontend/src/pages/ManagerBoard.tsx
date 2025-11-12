import { useState, useEffect } from 'react';
import { api, ShiftSwapDto, TimeOffDto, UserDto } from '../services/api';
import { useToast } from '../components/Toast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { getUserNameById } from '../utils/userHelpers';
import { formatShortDate } from '../utils/dateHelpers';
import './Manager.css';
import '../styles/shared.css';

export const ManagerBoardPage = () => {
  const { showToast } = useToast();
  const [swapRequests, setSwapRequests] = useState<ShiftSwapDto[]>([]);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffDto[]>([]);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const [swapsRes, timeOffRes, usersRes] = await Promise.all([
        api.getShiftSwaps({ status: 'pending' }),
        api.getTimeOff({ status: 'pending' }),
        api.getUsers(),
      ]);
      if (cancelled) return;

      if (swapsRes.success && swapsRes.data) setSwapRequests(swapsRes.data);
      else showToast(swapsRes.message || 'Failed to load shift swaps');

      if (timeOffRes.success && timeOffRes.data) setTimeOffRequests(timeOffRes.data);
      else showToast(timeOffRes.message || 'Failed to load time off requests');

      if (usersRes.success && usersRes.data) setUsers(usersRes.data);

      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const handleSwapDecision = async (id: string, approved: boolean) => {
    const status = approved ? 'approved' : 'denied';
    const res = await api.approveShiftSwap(id, status);
    if (res.success) {
      setSwapRequests((prev) => prev.filter((r) => r.id !== id));
      showToast(approved ? 'Shift swap approved' : 'Shift swap denied');
    } else {
      showToast(res.message || 'Failed to update shift swap');
    }
  };

  const handleDayOffDecision = async (id: string, approved: boolean) => {
    const status = approved ? 'approved' : 'denied';
    const res = await api.updateTimeOffStatus(id, status);
    if (res.success) {
      setTimeOffRequests((prev) => prev.filter((r) => r.id !== id));
      showToast(approved ? 'Time off approved' : 'Time off denied');
    } else {
      showToast(res.message || 'Failed to update time off request');
    }
  };

  return (
    <div className="manager-workspace">
      <h1 className="page-title">Manager Dashboard</h1>

      {loading && (
        <div className="card">
          <LoadingSpinner text="Loading requests..." />
        </div>
      )}

      <div className="manager-grid">
        <div className="card manager-card">
          <h2>
            Shift Swaps <span className="subtitle">· pending approvals</span>
          </h2>

          {swapRequests.length === 0 ? (
            <div className="empty-state">No pending shift swap requests</div>
          ) : (
            <div className="req-list">
              {swapRequests.map((request) => (
                <div key={request.id} className="req-card">
                  <div className="req-title">
                    {getUserNameById(request.requesting_employee_id, users)} requesting shift{' '}
                    {request.shift_id.slice(0, 8)}
                  </div>
                  <div className="req-meta">
                    Created: {formatShortDate(request.created_at.split('T')[0])}
                  </div>
                  <div className="req-actions">
                    <button
                      className="btn btn-approve"
                      onClick={() => handleSwapDecision(request.id, true)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-deny"
                      onClick={() => handleSwapDecision(request.id, false)}
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card manager-card">
          <h2>
            Day Off Requests <span className="subtitle">· pending approvals</span>
          </h2>

          {timeOffRequests.length === 0 ? (
            <div className="empty-state">No pending time off requests</div>
          ) : (
            <div className="req-list">
              {timeOffRequests.map((request) => (
                <div key={request.id} className="req-card">
                  <div className="req-title">{getUserNameById(request.employee_id, users)}</div>
                  <div className="req-meta">
                    {formatShortDate(request.start_date)} – {formatShortDate(request.end_date)}
                    {request.reason && ` · ${request.reason}`}
                  </div>
                  <div className="req-actions">
                    <button
                      className="btn btn-approve"
                      onClick={() => handleDayOffDecision(request.id, true)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-deny"
                      onClick={() => handleDayOffDecision(request.id, false)}
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
