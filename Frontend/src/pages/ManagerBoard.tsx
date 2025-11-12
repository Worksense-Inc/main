import { useState } from 'react';
import { demoSwapRequests, demoDayOffRequests } from '../data/mockData';
import { ShiftSwapRequest, DayOffRequest } from '../types/data';
import { useToast } from '../components/Toast';
import './Manager.css';
import '../styles/shared.css';

export const ManagerBoardPage = () => {
  const { showToast } = useToast();
  const [swapRequests, setSwapRequests] = useState<ShiftSwapRequest[]>(demoSwapRequests);
  const [dayOffRequests, setDayOffRequests] = useState<DayOffRequest[]>(demoDayOffRequests);

  const handleSwapDecision = (id: string, approved: boolean) => {
    setSwapRequests((prev) => prev.filter((r) => r.id !== id));
    showToast(approved ? 'Shift swap approved' : 'Shift swap denied');
  };

  const handleDayOffDecision = (id: string, approved: boolean) => {
    setDayOffRequests((prev) => prev.filter((r) => r.id !== id));
    showToast(approved ? 'Time off approved' : 'Time off denied');
  };

  return (
    <div className="manager-workspace">
      <h1 className="page-title">Manager Dashboard</h1>

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
                    {request.from} – {request.fromYear} with {request.with} – {request.withYear}
                  </div>
                  <div className="req-meta">{request.note || ''}</div>
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

          {dayOffRequests.length === 0 ? (
            <div className="empty-state">No pending time off requests</div>
          ) : (
            <div className="req-list">
              {dayOffRequests.map((request) => (
                <div key={request.id} className="req-card">
                  <div className="req-title">
                    {request.employee} – {request.year}
                  </div>
                  <div className="req-meta">
                    {request.range}
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
