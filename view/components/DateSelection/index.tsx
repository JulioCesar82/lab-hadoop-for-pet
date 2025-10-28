import React from 'react';
import './styles.css';

interface DateSelectionProps {
  onSelect: (date: Date, time: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

const AVAILABLE_TIMES = [
  '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00',
  '16:00', '17:00'
];

export const DateSelection: React.FC<DateSelectionProps> = ({
  onSelect,
  selectedDate,
  selectedTime
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (selectedTime) {
      onSelect(date, selectedTime);
    }
  };

  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      onSelect(selectedDate, time);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected = selectedDate && 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateSelect(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="date-selection">
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={handlePrevMonth}>&lt;</button>
          <h3>
            {currentMonth.toLocaleDateString('pt-BR', {
              month: 'long',
              year: 'numeric'
            })}
          </h3>
          <button onClick={handleNextMonth}>&gt;</button>
        </div>

        <div className="calendar-weekdays">
          <div>Dom</div>
          <div>Seg</div>
          <div>Ter</div>
          <div>Qua</div>
          <div>Qui</div>
          <div>Sex</div>
          <div>Sáb</div>
        </div>

        <div className="calendar-days">
          {renderCalendar()}
        </div>
      </div>

      <div className="time-selection">
        <h4>Horários Disponíveis</h4>
        <div className="time-slots">
          {AVAILABLE_TIMES.map(time => (
            <button
              key={time}
              className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
              onClick={() => handleTimeSelect(time)}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};