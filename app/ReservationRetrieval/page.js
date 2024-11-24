"use client";

import { useEffect, useState } from "react";
import Head from 'next/head';
import { Box } from '@mui/material';
import Link from 'next/link';
import styles from '../../scss/Home.module.scss';
import CustomDateRangePicker from "../CustomDateRangePicker";
import RoomTypeSelection from "../RoomTypeSelection";
import ReservationRetrievalModule from '../../scss/ReservationRetrieval.module.scss'



const ReservationRetrieval = () => {


const from = new Date();
const to = new Date();
to.setDate(from.getDate() + 1);

const [isScrolledToMax, setIsScrolledToMax] = useState(false);
const [isBookingVisible, setIsBookingVisible] = useState(true);
const [selectedDates, setSelectedDates] = useState([from, to]);
const [selectedRooms, setSelectedRooms] = useState([[]]);
const [customerLastName, setCustomerLastName] = useState('');
const [referenceCode, setReferenceCode] = useState('');
const [reservationData , setReservationData] = useState([[]]);
const [noResults, setNoResults] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);


const handleDateRangeChange = (dates) => {
    setSelectedDates(dates);
};

const toggleBookingSection = () => {
    setIsBookingVisible(!isBookingVisible);
};

const handleSearch = () => {
    console.log("Selected Dates: ", selectedDates);
    console.log("Room: ", selectedRooms);
    if (selectedDates[0] && selectedDates[1] && selectedRooms.length > 0) {

        const pathname = '/RoomSearch';
        const checkIn = selectedDates[0]?.toISOString();
        const checkOut = selectedDates[1]?.toISOString();
        const rooms = JSON.stringify(selectedRooms);

        console.log({ checkIn, checkOut, rooms });

        // Manually construct the URL with query parameters
        const searchParams = new URLSearchParams({
        checkIn,
        checkOut,
        rooms
        }).toString();

        router.push(`${pathname}?${searchParams}`);

    } else {
        alert("Please select a check-in/check-out date and room size!");
    }
};

const HandleReservationLookUp = async () => 
    {
        setIsLoading(true);
        if (!customerLastName || !referenceCode) {
            setError("Please enter both last name and reference code.");
            console.log("error");
            return;
        }
        try
        {
            
                const response = await fetch(
                    `http://localhost:8080/reservation/getReservationByNameAndRef/${encodeURIComponent(referenceCode)}/${encodeURIComponent(customerLastName)}`, 
                    {
                    method: "GET",
                            headers: {
                    "Content-Type": "application/json",
                    }
                }
            );
            if (response.ok)
                {
                    const data = await response.json();
                    setReservationData(data);
                    console.log(data);
                }
        }
        catch (error) {
            setError('Error fetching reservation: ' + error.message);
        } finally
        {
            setIsLoading(false)
        }
    }


return (
    <div>
        <Head>
            <title>Al Batra Hotel</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name="description" content="Experience the finest luxury at our hotel" />
            <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
        </Head>

        <header className={`${styles.header} ${isScrolledToMax && !isMouseOver ? styles.gradient : styles.solid}`}>
        <div className={styles.logoTitleNav}>
            <img src="logo.png" alt="Al-Batra Hotel Logo" className={styles.logo} />
            <div className={styles.titleNav}>
            <h1 className={styles.title}>AL-BATRA HOTEL</h1>
            <nav className={styles.nav}>
                <Link href="/">HOME</Link>
                <a href="">ROOMS</a>
                <a href="">DINING</a>
                <a href="">AMENITIES</a>
                <a href="" onClick={(e) => {
                toggleBookingSection();
                e.preventDefault();
                }}>BOOKING</a>
            </nav>
            </div>
        </div>
        </header>

        <div className={`${styles.bookingBar} ${isBookingVisible ? styles.visible : styles.hidden}`}>
          <section id="booking" className={styles.bookingSection}>
            <Box className={styles.bookingContainer}>
              <div className={styles.datePickerContainer}>
                <div className={styles.bookingTitle}>CHECK IN - CHECK OUT</div>
                <CustomDateRangePicker onDateRangeChange={handleDateRangeChange} />
              </div>
              <div className={styles.roomTypeContainer}>
                <div className={styles.bookingTitle}>ROOM SIZE</div>
                <RoomTypeSelection onRoomTypeChange={setSelectedRooms}/>
              </div>
              <button className={styles.searchButton} onClick={handleSearch}>
                CHECK RATES
              </button>
            </Box>
          </section>
        </div>

        <div className={ReservationRetrievalModule.PageContainer}>
            Retrieve My Reservation
            <div className={ReservationRetrievalModule.PageContainerThinnerLabel}>
                BY CONFIRMATION NUMBER
            </div>
        </div>
        <div className={ReservationRetrievalModule.SearchContainer}>
            {noResults && (
            <div className={ReservationRetrievalModule.NoResultsContainer}>
                No booking found with your provided details
            </div>
            )}
            <div className={ReservationRetrievalModule.InputSections}>
                <div className={ReservationRetrievalModule.InputSectionsInner}>
                    Last Name *
                    <input 
                    onChange={(e) => setCustomerLastName(e.target.value)}
                    className={ReservationRetrievalModule.inputBox}/>
                </div>
                <div 
                onChange={(e) => setReferenceCode(e.target.value)}
                className={ReservationRetrievalModule.InputSectionsInner}>
                    Reference Code *
                    <input className={ReservationRetrievalModule.inputBox}/>
                </div>
            </div>
            <div className={ReservationRetrievalModule.ButtonContainer}>
                <button className={ReservationRetrievalModule.button} onClick={HandleReservationLookUp}>
                    CONTINUE
                </button>
            </div>
        </div>
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
                <img src="TikTokLogo.png" alt="TikTok" className={styles.socialIcon}/>
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <img src="FacebookLogo.png" alt="Facebook" className={styles.socialIcon}/>
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <img src="X_Logo.png" alt="Twitter" className={styles.socialIcon}/>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="InstagramLogo.png" alt="Instagram" className={styles.socialIcon}/>
              </a>
            </div>
          </div>
          <p>&copy; 2024 Al-Batra Hotel. All rights reserved.</p>
        </footer>
    </div>
);
};

export default ReservationRetrieval;