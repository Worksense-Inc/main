import { useState, useMemo } from 'react';
import { demoShifts, demoUser } from '../data/mockData';
import './Home.css';
import '../styles/shared.css';

export const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Filter shifts for current user
  const userShifts = useMemo(() => {
    return demoShifts.filter(
      (shift) => shift.employee.toLowerCase() === demoUser.name.toLowerCase(),
    );
  }, []);

  // Get shifts for selected date or all shifts
  const displayShifts = useMemo(() => {
    if (!selectedDate) return userShifts;
    return userShifts.filter((shift) => shift.date === selectedDate);
  }, [userShifts, selectedDate]);

  // Get dates with shifts for calendar highlighting
  const shiftDates = useMemo(() => {
    return new Set(userShifts.map((shift) => shift.date));
  }, [userShifts]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateLong = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="home-workspace">
      <aside className="shifts-card">
        <h2>
          Shifts<span className="who">for {demoUser.name}</span>
        </h2>

        {selectedDate && (
          <div className="active-filter">
            <span>
              Showing shifts for <strong>{formatDateLong(selectedDate)}</strong>
            </span>
            <button className="link-btn" onClick={() => setSelectedDate(null)}>
              Clear
            </button>
          </div>
        )}

        <ul className="shift-list">
          {displayShifts.length === 0 ? (
            <li className="shift-list-empty">No shifts scheduled</li>
          ) : (
            displayShifts.map((shift) => (
              <li key={shift.id} className="shift-item">
                <div className="shift-date">{formatDate(shift.date)}</div>
                <div className="shift-time">
                  {shift.start} – {shift.end}
                </div>
                {shift.note && <div className="shift-note">{shift.note}</div>}
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

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

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
