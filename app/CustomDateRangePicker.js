import React, { useState, useEffect, useRef } from 'react';
import {
  format, addDays, addMonths, subMonths, eachDayOfInterval,
  startOfMonth, endOfMonth, isSameDay, isWithinInterval,
  isBefore
} from 'date-fns';
import styles from '../scss/CustomDateRangePicker.module.scss';

const CustomDateRangePicker = ({ onDateRangeChange }) => {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([today, tomorrow]);
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarRef]);

  const handleDateClick = (date) => {
    const [start, end] = selectedDates;

    if (!start || (start && end)) {
      setSelectedDates([date, null]);
    } else if (isBefore(date, start)) {
      setSelectedDates([date, start]);
    } else {
      setSelectedDates([start, date]);
    }

    if (onDateRangeChange) {
      onDateRangeChange(selectedDates);
    }
  };

  const renderCalendar = (month) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });

    return (
      <div className={styles.calendar}>
        <div className={styles.monthHeader}>
          <span>{format(month, 'MMMM yyyy')}</span>
        </div>
        <div className={styles.weekDays}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className={styles.weekDay}>{day}</div>
          ))}
        </div>
        <div className={styles.days}>
          {days.map((day) => (
            <div
              key={day}
              className={`${styles.day} ${isSameDay(day, new Date()) ? styles.today : ''} ${isWithinInterval(day, { start: selectedDates[0], end: selectedDates[1] }) ? styles.selected : ''} ${selectedDates[0] && selectedDates[1] && isWithinInterval(day, { start: selectedDates[0], end: selectedDates[1] }) ? styles.inRange : ''}`}
              onClick={() => handleDateClick(day)}
            >
              {format(day, 'd')}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dateRangePicker}>
      <div className={styles.dateRangeInput} onClick={() => setIsOpen(!isOpen)}>
        {`${format(selectedDates[0], 'MMM d, yyyy')} - ${selectedDates[1] ? format(selectedDates[1], 'MMM d, yyyy') : ''}`}
      </div>
      {isOpen && (
        <div ref={calendarRef} className={styles.calendarPopup}>
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>{"<"}</button>
          <div className={styles.calendarsContainer}>
            {renderCalendar(currentMonth)}
            {renderCalendar(addMonths(currentMonth, 1))}
          </div>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>{">"}</button>
        </div>
      )}
    </div>
  );
};

export default CustomDateRangePicker;
