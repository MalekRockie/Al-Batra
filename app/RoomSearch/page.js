"use client";

import { useState, useEffect } from 'react';
import CustomDateRangePicker from '../CustomDateRangePicker';
import RoomTypeSelection from '../RoomTypeSelection';
import { Box } from '@mui/material';
import Link from 'next/link';
import styles from '../../scss/Home.module.scss';
import RoomSearchModule from '../../scss/RoomSearch.module.scss';
import { useRouter } from 'next/navigation';

const RoomSearch = () => {
  const router = useRouter();

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [isBookingVisible, setIsBookingVisible] = useState(true);
  const [isScrolledToMax, setIsScrolledToMax] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [selectedDates, setSelectedDates] = useState([today, tomorrow]);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [roomType, setRoomType] = useState([{ adults: 1, children: 0 }]);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false); // Added state for options visibility

  const handleDateRangeChange = (dates) => {
    setSelectedDates(dates);
    console.log('Selected Dates:', dates);
  };

  const handleRoomTypeChange = (roomType) => {
    setSelectedRoomType(roomType);
    console.log('Selected Room Type:', roomType);
  };

  const handleUpdateSearch = () => {
    console.log('Selected Dates: ', selectedDates);
    console.log('Room Types length: ', roomType.length);
    if (selectedDates[0] && selectedDates[1] && roomType.length > 0) {
      const pathname = '/RoomSearch';
      const checkIn = selectedDates[0]?.toISOString();
      const checkOut = selectedDates[1]?.toISOString();
      const rooms = JSON.stringify(roomType);

      console.log({ checkIn, checkOut, rooms });

      // Manually construct the URL with query parameters
      const searchParams = new URLSearchParams({
        checkIn,
        checkOut,
        rooms,
      }).toString();

      router.push(`${pathname}?${searchParams}`);
    } else {
      alert('Please select a check-in/check-out date and room size!');
    }
  };

  const toggleBookingSection = () => {
    setIsBookingVisible(!isBookingVisible);
  };

  const toggleOptions = () => {
    console.log("Click");
    setIsOptionsVisible(!isOptionsVisible); // Toggle options visibility
  };

  useEffect(() => {
    function handleScroll() {
      const scrollPosition = window.scrollY;
      setIsScrolledToMax(scrollPosition === 0);
    }

    function handleMouseOver() {
      setIsMouseOver(true);
    }

    function handleMouseOut() {
      setIsMouseOver(false);
    }

    window.addEventListener('scroll', handleScroll);
    const header = document.querySelector(`.${styles.header}`);
    header.addEventListener('mouseover', handleMouseOver);
    header.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      header.removeEventListener('mouseover', handleMouseOver);
      header.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  useEffect(() => {}, [isScrolledToMax, isMouseOver]);

  return (
    <div>
      <header
        className={`${styles.header} ${
          isScrolledToMax && !isMouseOver ? styles.gradient : styles.solid
        }`}
      >
        <div className={styles.logoTitleNav}>
          <img src="logo.png" alt="Al-Batra Hotel Logo" className={styles.logo} />
          <div className={styles.titleNav}>
            <h1 className={styles.title}>AL-BATRA HOTEL</h1>
            <nav className={styles.nav}>
              <Link href="/">HOME</Link>
              <a href="#rooms">ROOMS</a>
              <a href="#dining">DINING</a>
              <a href="#amenities">AMENITIES</a>
              <a href="#booking" onClick={toggleBookingSection}>
                BOOKING
              </a>
            </nav>
          </div>
        </div>
      </header>
      <div
        className={`${styles.bookingBar} ${
          isBookingVisible ? styles.visible : styles.hidden
        }`}
      >
        <section id="booking" className={styles.bookingSection}>
          <Box className={styles.bookingContainer}>
            <div className={styles.datePickerContainer}>
              <div className={styles.bookingTitle}>CHECK IN - CHECK OUT</div>
              <CustomDateRangePicker onDateRangeChange={handleDateRangeChange} />
            </div>
            <div className={styles.roomTypeContainer}>
              <div className={styles.bookingTitle}>ROOM SIZE</div>
              <RoomTypeSelection />
            </div>
            <button className={styles.searchButton} onClick={handleUpdateSearch}>
              UPDATE SEARCH
            </button>
          </Box>
        </section>
      </div>

      <div className={RoomSearchModule.Container1}>
        <div className={RoomSearchModule.Container2}>OUR ACCOMMODATIONS</div>
        <hr className={RoomSearchModule.line} />
      </div>

      <div className={RoomSearchModule.RoomsLists}>
        <div className={RoomSearchModule.RoomContainer}>
          <div>
            <img
              src="room1.jpg"
              alt="Deluxe Room"
              className={RoomSearchModule.roomImage}
            />
          </div>

          <div className={RoomSearchModule.RoomTitle}>
            Deluxe Double Room
            <div className={RoomSearchModule.RoomDescription}>
              This luxurious double room offers a spacious king-size bed, elegant furnishings,
              and modern amenities. Perfect for couples or small families looking for a
              comfortable stay.
            </div>
            <button
              className={RoomSearchModule.reserveButton}
              onClick={toggleOptions}
            >
              Reserve Now
            </button>
          </div>

        </div>
      </div>
      <div id="optionsContainer" className={`${RoomSearchModule.optionsContainer} ${isOptionsVisible ? RoomSearchModule.visible : ''}`}>
        <div className={RoomSearchModule.option}>Breakfast Only</div>
        <div className={RoomSearchModule.option}>Lunch and Dinner as well</div>
    </div>
    </div>
  );
};

export default RoomSearch;
