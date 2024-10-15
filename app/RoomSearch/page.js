"use client";

import { useState, useEffect } from 'react';
import CustomDateRangePicker from '../CustomDateRangePicker';
import RoomTypeSelection from '../RoomTypeSelection';
import { Box } from '@mui/material';
import Link from 'next/link';
import styles from '../../scss/Home.module.scss';
import RoomSearchModule from '../../scss/RoomSearch.module.scss';
import { useRouter } from 'next/navigation';


const LoadingSpinner = () => (
  <div className={RoomSearchModule.spinnerContainer}>
    <div className={RoomSearchModule.spinner}></div> {/* Add spinner CSS */}
    <p>Loading room types...</p>
  </div>
);



const RoomSearch = () => {
  const router = useRouter();
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const CurrentBill = 0;

  const [isBookingVisible, setIsBookingVisible] = useState(true);
  const [isScrolledToMax, setIsScrolledToMax] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [selectedDates, setSelectedDates] = useState([today, tomorrow]);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [roomType, setRoomType] = useState([]); // Initialize as empty array to hold fetched room types
  const [activeRoomIndex, setActiveRoomIndex] = useState(null); // Track which room's packages to show
  const [isLoading, setIsLoading] = useState(false); // Loading state for fetch

  const handleSelectPackage = (roomType, checkInDate, checkOutDate) => {
  const params = new URLSearchParams({
    roomType,
    checkInDate,
    checkOutDate,
  });
  router.push(`./CustomerDetails?${params.toString()}`);
};

  const handleDateRangeChange = (dates) => {
    setSelectedDates(dates);
    console.log('Selected Dates:', dates);
  };

  const handleRoomTypeChange = (roomType) => {
    setSelectedRoomType(roomType);
    console.log('Selected Room Type:', roomType);
  };

  const fetchRoomTypes = async (checkInDate, checkOutDate) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8080/room/availableRoomTypes?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
      );
      const data = await response.json();
      console.log('Fetched room types:', data);
      setRoomType(data); // Set the fetched room types in the state
    } catch (error) {
      console.error('Error fetching room types:', error);
    } finally 
    {
      setIsLoading(false);
    }
  };

  const handleUpdateSearch = () => {
    console.log('Selected Dates: ', selectedDates);
    console.log('Room Types length: ', roomType.length);
    if (selectedDates[0] && selectedDates[1]) {
      const checkIn = selectedDates[0].toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const checkOut = selectedDates[1].toISOString().split('T')[0]; // Format as YYYY-MM-DD

      console.log({ checkIn, checkOut });

      // Fetch room types from the API with selected dates
      fetchRoomTypes(checkIn, checkOut);
    } else {
      alert('Please select a check-in/check-out date and room size!');
    }
  };

  const toggleBookingSection = () => {
    setIsBookingVisible(!isBookingVisible);
  };

  const toggleOptions = (index) => {
    setActiveRoomIndex(activeRoomIndex === index ? null : index);
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

  useEffect(() => {
    if (selectedDates[0] && selectedDates[1]) {
      const checkIn = selectedDates[0].toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const checkOut = selectedDates[1].toISOString().split('T')[0]; // Format as YYYY-MM-DD

      console.log({ checkIn, checkOut });

      // Fetch room types from the API with selected dates
      fetchRoomTypes(checkIn, checkOut);
    } else {
      alert('Please select a check-in/check-out date and room size!');
    }
  }, [selectedDates]);

  return (
    <div className={RoomSearchModule.main}>
      {/* Header */}
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

      {/* Booking Section */}
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

      {/* Rooms Section */}
      <div className={RoomSearchModule.Container1}>
        <div className={RoomSearchModule.Container2}>OUR ACCOMMODATIONS</div>
        <hr className={RoomSearchModule.line} />
      </div>

      
      
      {/* Room List */}
      {/* Loading spinner */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className={RoomSearchModule.RoomsLists}>
          {roomType.length > 0 ? (
            roomType.map((room, index) => (
              <div key={index}>
                <div className={RoomSearchModule.RoomContainer}>
                  <div>
                    <img
                      src={`room1.jpg`}
                      alt={room.typeName}
                      className={RoomSearchModule.roomImage}
                    />
                  </div>
                  <div className={RoomSearchModule.RoomTitle}>
                    {room.typeName}
                    <div className={RoomSearchModule.RoomDescription}>
                      This room offers a comfortable stay with a minimum price of ${room.minRate}.
                    </div>
                  </div>
                  <button
                    className={RoomSearchModule.reserveButton}
                    onClick={() => toggleOptions(index)} // Pass index of the room
                  >
                    RESERVE NOW
                  </button>
                </div>
                {activeRoomIndex === index && (
                  <div
                    className={`${RoomSearchModule.optionsContainer} ${
                      activeRoomIndex === index ? RoomSearchModule.visible : ''
                    }`}
                  >
                    <div className={RoomSearchModule.option}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className={RoomSearchModule.optionTitle}>Bed & Breakfast Package</div>
                        <div className={RoomSearchModule.optionPricingDesc}>
                          <div>Avg Price per Night:</div>
                          <div className={RoomSearchModule.optionPricing}> ${room.minRate} per night</div>
                        </div>
                      </div>
                      <button className={RoomSearchModule.ReserveButton} onClick={() => handleSelectPackage(room.typeName, selectedDates[0].toISOString().split('T')[0], selectedDates[1].toISOString().split('T')[0])}>
                        SELECT PACKAGE
                      </button>
                    </div>
                    <div className={RoomSearchModule.option}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className={RoomSearchModule.optionTitle}>Full-Board Package (Includes All Meals)</div>
                        <div className={RoomSearchModule.optionPricingDesc}>
                          <div>Avg Price per Night:</div>
                          <div className={RoomSearchModule.optionPricing}> ${room.minRate} per night</div>
                        </div>
                      </div>
                      <button className={RoomSearchModule.ReserveButton} onClick={() => handleSelectPackage(room.typeName, selectedDates[0].toISOString().split('T')[0], selectedDates[1].toISOString().split('T')[0])}>
                        SELECT PACKAGE
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div>No rooms available for the selected dates.</div>
          )}
        </div>
      )}

      

      <div className={RoomSearchModule.footerContainer}>
        <footer className={styles.footer}>
          <div className={styles.footerNav}>
            <div className={styles.footerNavCol}>
              <a href="#home">Home</a>
              <a href="#rooms">Rooms</a>
              <a href="#booking">Booking</a>
            </div>
            <div className={styles.footerNavCol}>
              <a href="#contactUs">Contact Us</a>
              <a href="#about">About</a>
            </div>
            <div className={styles.footerNavCol}>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
                <img src="TikTokLogo.png" alt="TikTok" className={styles.socialIcon} />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <img src="FacebookLogo.png" alt="Facebook" className={styles.socialIcon} />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <img src="X_Logo.png" alt="Twitter" className={styles.socialIcon} />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="InstagramLogo.png" alt="Instagram" className={styles.socialIcon} />
              </a>
            </div>
          </div>
          <p>&copy; 2024 Al-Batra Hotel. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default RoomSearch;
