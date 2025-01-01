import React, { useState, useEffect, useRef } from 'react';
import {
  format, addDays, addMonths, subMonths, eachDayOfInterval,
  startOfMonth, endOfMonth, isSameDay, isWithinInterval,
  isBefore
} from 'date-fns';
import styles from  '../../../scss/CustomDateRangePicker.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import NextIntersectionObserver from './NextIntersectionObserver';

const CustomDateRangePicker = ({ selectedDates, setSelectedDates, onDateRangeChange }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const calendarRef = useRef(null);
  const calendarInputBoxRef = useRef(null);

  const calendar = [];
  const t = useTranslations();
  const locale = useLocale();

  const isRTL = locale === 'ar';
  
  const handleDateClick = (date) =>
    {
      const [start, end] = selectedDates;
      if(!start || (start && end)) 
        {
          setSelectedDates([date, null]);
        } 
        else if(isBefore(date, start))
        {
          setSelectedDates([date, start]);
        }
        else {
          setSelectedDates([start, date]);
        }

        const updatedDates = [start, date];
        if (onDateRangeChange){
          onDateRangeChange(updatedDates);
        }
    };



  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target) && calendarInputBoxRef.current && !calendarInputBoxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [calendarRef]);

  useEffect(() => {
      const handleResize = () => {
          setIsMobile(window.innerWidth <= 768); 
          setIsOpen(true);
      };
      handleResize(); // Initial check
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);


  const openCalenderBox = () => {
    setIsOpen(!isOpen);
  };

  const renderCalendars = () => {
    const monthsToRender = isMobile ? 10 : 2; // 5 months for mobile, 2 months otherwise
    const calendars = [];
    
    for (let i = 0; i < monthsToRender; i++) {
      const month = addMonths(currentMonth, i);
      calendars.push(<div key={i}>{renderCalendar(month)}</div>);
    }

    return calendars;
};

  const renderCalendar = (month) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });

    const weekdays = [
      t('Calender.sunday'), t('Calender.monday'), t('Calender.tuesday'),
      t('Calender.wednesday'), t('Calender.thursday'), t('Calender.friday'),
      t('Calender.saturday')
    ];

    // Reverse the weekdays for RTL layout
    const reversedWeekdays = isRTL ? weekdays.reverse() : weekdays;

    return (
      <div className={styles.calendar} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <div className={styles.monthHeader}>
          <span>{format(month, 'MMMM yyyy')}</span>
        </div>
        <div className={styles.weekDays}>
          {reversedWeekdays.map((day) => (
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
      {!isMobile && (
        <div ref={calendarInputBoxRef} className={styles.dateRangeInput} onClick={() => openCalenderBox()}>
          {`${format(selectedDates[0], 'MMM d, yyyy')} - ${selectedDates[1] ? format(selectedDates[1], 'MMM d, yyyy') : ''}`}
        </div>
      )
      }
      {isOpen && (
        <div className={styles.calenderPopUpContainer}>
          <div ref={calendarRef} className={styles.calendarPopup}>
            {!isMobile && (
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>{isRTL ? '>' : '<'}</button>
            )}
            {/* Reversing the buttons for RTL */}
            <div className={styles.calendarsContainer}>
              <NextIntersectionObserver
                classes={styles.calendarContainer}
                topIn={styles.fadeIn}
                topOut={styles.fadeOut}
                bottomIn={styles.slideUp}
                bottomOut={styles.slideDown}
              >
                {renderCalendars()}
              </NextIntersectionObserver>
            </div>
            {!isMobile && (
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>{isRTL ? '<' : '>'}</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDateRangePicker;
