import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api, ShiftDto } from '../services/api';
import { useToast } from '../components/Toast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatMediumDate, formatLongDate, getTodayString } from '../utils/dateHelpers';
import './Home.css';
import '../styles/shared.css';

export const HomePage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [shifts, setShifts] = useState<ShiftDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!user) return;
      setLoading(true);
      const res = await api.getShifts({ employee_id: user.id });
      if (!cancelled) {
        if (res.success && res.data) {
          setShifts(res.data);
        } else {
          showToast(res.message || 'Failed to load shifts');
        }
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [user, showToast]);

  // Get shifts for selected date or all shifts
  const displayShifts = useMemo(() => {
    if (!selectedDate) return shifts;
    return shifts.filter((shift) => shift.shift_date === selectedDate);
  }, [shifts, selectedDate]);

  // Get dates with shifts for calendar highlighting
  const shiftDates = useMemo(() => {
    return new Set(shifts.map((s) => s.shift_date));
  }, [shifts]);

  return (
    <div className="home-workspace">
      <aside className="shifts-card">
        <h2>
          Shifts
          <span className="who">
            for {user?.first_name} {user?.last_name}
          </span>
        </h2>
        {loading && (
          <div className="shift-list-empty">
            <LoadingSpinner size="small" />
          </div>
        )}

        {selectedDate && (
          <div className="active-filter">
            <span>
              Showing shifts for <strong>{formatLongDate(selectedDate)}</strong>
            </span>
            <button className="link-btn" onClick={() => setSelectedDate(null)}>
              Clear
            </button>
          </div>
        )}

        <ul className="shift-list">
          {displayShifts.length === 0 && !loading ? (
            <li className="shift-list-empty">No shifts scheduled</li>
          ) : (
            displayShifts.map((shift) => (
              <li key={shift.id} className="shift-item">
                <div className="shift-date">{formatMediumDate(shift.shift_date)}</div>
                <div className="shift-time">
                  {shift.start_time} – {shift.end_time}
                </div>
                {shift.notes && <div className="shift-note">{shift.notes}</div>}
              </li>
            ))
          )}
        </ul>
      </aside>

      <div className="calendar-container">
        <MiniCalendar
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          shiftDates={shiftDates}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>
    </div>
  );
};

interface MiniCalendarProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  shiftDates: Set<string>;
  selectedDate: string | null;
  onDateSelect: (date: string | null) => void;
}

const MiniCalendar = ({
  currentMonth,
  onMonthChange,
  shiftDates,
  selectedDate,
  onDateSelect,
}: MiniCalendarProps) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthName = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayStr = getTodayString();

  const prevMonth = () => {
    onMonthChange(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    onMonthChange(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onDateSelect(selectedDate === dateStr ? null : dateStr);
  };

  const days = [];
  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = dateStr === todayStr;
    const hasShift = shiftDates.has(dateStr);
    const isSelected = dateStr === selectedDate;

    let className = 'calendar-day';
    if (isSelected) className += ' selected';
    else if (isToday) className += ' today';
    else if (hasShift) className += ' has-shift';

    days.push(
      <div key={day} className={className} onClick={() => handleDayClick(day)}>
        {day}
      </div>,
    );
  }

  return (
    <div className="mini-calendar">
      <div className="calendar-header">
        <h3>{monthName}</h3>
        <div className="calendar-nav">
          <button onClick={prevMonth} aria-label="Previous month">
            ‹
          </button>
          <button onClick={nextMonth} aria-label="Next month">
            ›
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="calendar-day-label">
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
};
