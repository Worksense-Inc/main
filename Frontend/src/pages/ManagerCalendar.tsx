import { useState, useMemo } from 'react';
import { demoShifts, demoUser } from '../data/mockData';
import './ManagerCalendar.css';
import '../styles/shared.css';

const ALL_EMPLOYEES = '__all__';

export const ManagerCalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  const [selectedEmployee, setSelectedEmployee] = useState<string>(ALL_EMPLOYEES);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get unique employees
  const employees = useMemo(() => {
    const uniqueEmployees = Array.from(new Set(demoShifts.map((s) => s.employee))).sort();
    return uniqueEmployees;
  }, []);

  // Get shifts for calendar highlighting (filtered by employee)
  const shiftDates = useMemo(() => {
    const filtered =
      selectedEmployee === ALL_EMPLOYEES
        ? demoShifts
        : demoShifts.filter((s) => s.employee.toLowerCase() === selectedEmployee.toLowerCase());
    return new Set(filtered.map((shift) => shift.date));
  }, [selectedEmployee]);

  // Get shifts for display (filtered by date and employee)
  const displayShifts = useMemo(() => {
    return demoShifts.filter((shift) => {
      const matchesDate = shift.date === selectedDate;
      const matchesEmployee =
        selectedEmployee === ALL_EMPLOYEES ||
        shift.employee.toLowerCase() === selectedEmployee.toLowerCase();
      return matchesDate && matchesEmployee;
    });
  }, [selectedDate, selectedEmployee]);

  return (
    <div className="manager-calendar-workspace">
      <header className="manager-calendar-header">
        <h1>Manager Calendar</h1>
        <p className="welcome">Welcome, {demoUser.name}!</p>
      </header>

      <div className="manager-calendar-grid">
        <div className="card calendar-card">
          <h2>Shift Calendar</h2>
          <MiniCalendar
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            shiftDates={shiftDates}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        <div className="card shifts-card">
          <h2>Shifts</h2>

          <div className="shift-filters">
            <div className="filter-field">
              <label htmlFor="selected-day">Selected day:</label>
              <input
                id="selected-day"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="filter-field">
              <label htmlFor="employee-filter">Employee:</label>
              <select
                id="employee-filter"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value={ALL_EMPLOYEES}>All employees</option>
                {employees.map((emp) => (
                  <option key={emp} value={emp}>
                    {emp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {displayShifts.length === 0 ? (
            <div className="shift-empty">No shifts match these filters.</div>
          ) : (
            <ul className="manager-shift-list">
              {displayShifts.map((shift) => (
                <li key={shift.id} className="manager-shift-item">
                  <div className="shift-info">
                    <div className="shift-time">
                      {shift.start}–{shift.end}
                    </div>
                    <div className="shift-employee">· {shift.employee}</div>
                    {shift.note && <div className="shift-note">— {shift.note}</div>}
                  </div>
                  <div className="shift-date">{shift.date}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

interface MiniCalendarProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  shiftDates: Set<string>;
  selectedDate: string;
  onDateSelect: (date: string) => void;
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

  const handleDayClick = (dateStr: string) => {
    onDateSelect(dateStr);
  };

  const days = [];

  // Previous month's trailing days
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    days.push(
      <div key={`prev-${day}`} className="calendar-day mini-cal__cell--out">
        {day}
      </div>,
    );
  }

  // Current month's days
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
      <div key={day} className={className} onClick={() => handleDayClick(dateStr)}>
        {day}
        {hasShift && !isSelected && <span className="mini-cal__dot" />}
      </div>,
    );
  }

  // Next month's leading days
  const remainingCells = 42 - days.length;
  for (let day = 1; day <= remainingCells; day++) {
    days.push(
      <div key={`next-${day}`} className="calendar-day mini-cal__cell--out">
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
