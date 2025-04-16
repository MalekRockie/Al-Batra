"use client";

import { useEffect, useState, useRef } from "react";
import Head from 'next/head';
import { Box } from '@mui/material';
import Link from 'next/link';
import styles from '../../../scss/Home.module.scss';
import CustomDateRangePicker from '../components/CustomDateRangePicker';
import RoomTypeSelection from '../components/RoomTypeSelection';
import ReservationRetrievalModule from '../../../scss/ReservationRetrieval.module.scss'
import CustomerLocaleSwitcher from '../../../components/customerLocaleSwitcher.tsx'

import {useLocale, useTranslations} from 'next-intl';



const ReservationRetrieval = () => {
const t = useTranslations();

const from = new Date();
const to = new Date();
to.setDate(from.getDate() + 1);
const locale = useLocale();
const [isScrolledToMax, setIsScrolledToMax] = useState(false);
const [isBookingVisible, setIsBookingVisible] = useState(false);
const [selectedDates, setSelectedDates] = useState([from, to]);
const [selectedRooms, setSelectedRooms] = useState([{ adults: 1, children: 0, roomType: null, package: null },]);
const [customerLastName, setCustomerLastName] = useState('');
const [referenceCode, setReferenceCode] = useState('');
const [reservationData , setReservationData] = useState(null);
const [noResults, setNoResults] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [isMenuOpen, setIsMenuOpen] = useState(false);
const containerRef = useRef(null);

  const navClass = locale === "ar" ? styles['nav-ar'] : styles.nav;
  const navLogoTitleClass = locale === "ar" ? styles['logoTitleNav-ar'] : styles.logoTitleNav;
  const titleNavClass = locale === "ar" ? styles['titleNav-ar'] : styles.titleNav; 
  const titleClass = locale === "ar" ? styles['title-ar'] : styles.title; 
  const logoClass = locale === "ar" ? styles['logo-ar'] : styles.logo; 
  const headerClass = locale === "ar" ? styles['header-ar'] : styles.header;
  const langSwitcherClass = locale === "ar" ? styles['langSwitcherContainer-ar'] : styles.langSwitcherContainer;
  const bookingTitle = locale === "ar" ? styles['bookingTitle-ar'] : styles.bookingTitle;
  const hotelDetailsText = locale === "ar" ? styles['hotelDetailsText-ar'] : styles.hotelDetailsText;
  const closeIconClass = locale === "ar" ? styles['close-icon-ar'] : styles['close-icon'];
//.hamburger
  const hamburgerClass = locale === "ar" ? styles['hamburger-ar'] : styles['hamburger'];
  const bookingTitleClass = locale === "ar" ? styles['bookingTitle-ar'] : bookingTitle['bookingTitle'];
  const titleMobileClass = locale === "ar" ? styles['titleMobile-ar'] : styles['titleMobile'];


const handleDateRangeChange = (dates) => {
    setSelectedDates(dates);
};

const toggleBookingSection = () => {
    setIsBookingVisible(!isBookingVisible);
};

    const toggleMenu = () => {
    // setIsMenuOpen(!isMenuOpen);
    setIsMenuOpen((prevState) => !prevState);
    }
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
        setReservationData(null);
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
                setNoResults(false);
                console.log(data);
            }
                else if (response.status === 404) {
                setNoResults(true);
                console.log("No results found for the given reference code and last name.");
            }
            // Handle other error responses (500, 400, etc.)
            else {
                setError(`Error fetching reservation: ${response.statusText}`);
                console.log(`Error: ${response.statusText}`);
            }
        }
        catch (error) {
            setError('Error fetching reservation: ' + error.message);
        } finally
        {
            setIsLoading(false)
        }
    }

const calculateNights = (checkInDate, checkOutDate) => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Calculate the difference in time (milliseconds)
    const timeDiff = checkOut - checkIn;

    // Convert the time difference from milliseconds to days
    const oneDay = 1000 * 60 * 60 * 24; // Number of milliseconds in one day
    const nights = timeDiff / oneDay;

    return isNaN(nights) ? "Invalid dates" : Math.floor(nights);
  };

return (
    <div>

        <Head>
            <title>Retrieve My Reservation - Al Batra Hotel</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name="description" content="Experience the finest luxury at our hotel" />
            <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
        </Head>

        {/* Nav bar */}
        <header className={`${headerClass} ${isMenuOpen ? styles.active : ''}${isScrolledToMax && !isMouseOver ? styles.gradient : styles.solid}`}>

            <div className={hamburgerClass} onClick={toggleMenu}>
                <div className={styles.lines}></div>
                <div className={styles.lines}></div>
                <div className={styles.lines}></div>
            </div>
            <img src="../logo.png" alt="Al-Batra Hotel Logo" className={logoClass} />

            <div
            ref={containerRef}
            className={`${navLogoTitleClass} ${isMenuOpen ? styles.active : ''}`}>

              
                <div className={closeIconClass} onClick={toggleMenu}>
                    <div className={styles.line1}></div>
                    <div className={styles.line2}></div>
                </div>

              {/* <img src="logo.png" alt="Al-Batra Hotel Logo" className={logoClass} /> */}
              {/* Hamburger Icon */}

              <div className={titleNavClass}>
              <h1 className={titleClass}>{t('HomePage.title')}</h1>

                {/* Navigation Links */}
                <nav className={`${navClass}`}>
                    <img src="../logo.png" className={styles.logoMobileNav} alt="Al-Batra Hotel Logo"/>
                    <div className={titleMobileClass}>{t('HomePage.title')}</div>
                    <Link href={`/${locale}`}>{t('NavigationBar.Home')}</Link>
                    <a href={`/${locale}/Rooms`}>{t('NavigationBar.Rooms')}</a>
                    <a href="" onClick={(e) => {
                    toggleBookingSection();
                    e.preventDefault();
                    }}>{t('NavigationBar.Booking')}</a>
                    <a href={`/${locale}/ReservationRetrieval`}>{t('NavigationBar.MyReservation')}</a>
                </nav>
                </div>
              {/* Language Switcher */}
                <div className={langSwitcherClass}>
                <CustomerLocaleSwitcher />
                </div>
            </div>

        </header>

        <div className={`${styles.bookingBar} ${isBookingVisible ? styles.visible : styles.hidden}`}>
        <section id="booking" className={styles.bookingSection}>
            <Box className={styles.bookingContainer}>
            <div className={styles.datePickerContainer}>
                <div className={styles.bookingTitle}>{t('BookingBar.checkInOut')}</div>
                <CustomDateRangePicker
                    selectedDates={selectedDates}
                    setSelectedDates={setSelectedDates}
                            />            </div>
            <div className={styles.roomTypeContainer}>
                <div className={styles.bookingTitle}>{t('BookingBar.roomSize')}</div>
                <RoomTypeSelection
                    selectedRooms={selectedRooms}
                    setSelectedRooms={setSelectedRooms}
                />
                </div>
            <button className={styles.searchButton} onClick={handleSearch}>
                {t('BookingBar.checkRates')}
            </button>
            </Box>
        </section>
        </div>

        <div className={ReservationRetrievalModule.PageContainer}>
            {t('ReservationRetrieval.pageTitle')}
            <div className={ReservationRetrievalModule.PageContainerThinnerLabel}>
                {t('ReservationRetrieval.byConfirmation')}
            </div>
        </div>
        {/* Search box */}
        {reservationData == null && (
            <div>
                <div className={ReservationRetrievalModule.SearchContainer}>
                    {noResults && (
                    <div className={ReservationRetrievalModule.NoResultsContainer}>
                        {t('ReservationRetrieval.noResults')}
                    </div>
                    )}
                    <div className={ReservationRetrievalModule.InputSections}>
                        <div className={ReservationRetrievalModule.InputSectionsInner}>
                            {t('ReservationRetrieval.lastName')}
                            <input 
                            name="lastname"
                            onChange={(e) => setCustomerLastName(e.target.value)}
                            className={ReservationRetrievalModule.inputBox}/>
                        </div>
                        <div 
                        name="referenceCode"
                        onChange={(e) => setReferenceCode(e.target.value)}
                        className={ReservationRetrievalModule.InputSectionsInner}>
                            {t('ReservationRetrieval.referenceCode')}
                            <input className={ReservationRetrievalModule.inputBox}/>
                        </div>
                    </div>
                    <div className={ReservationRetrievalModule.ButtonContainer}>
                        <button className={ReservationRetrievalModule.button} onClick={HandleReservationLookUp}>
                            {t('ReservationRetrieval.searchButton')}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {reservationData != null && reservationData.map((reservation, index) => {
            return (
                <div className={ReservationRetrievalModule.MyReservationContainer} key={index}>

                    <div className={ReservationRetrievalModule.MyReservationContainerLeftHalf}>
                        <img src='../room1.jpg' alt="Room" className={ReservationRetrievalModule.MyReservationContainerLeftHalfImg}/>
                    </div>

                    <div className={ReservationRetrievalModule.MyReservationContainerRightHalf}>
                        <div className={ReservationRetrievalModule.MyReservationContainerRightHalfMinorLabel}>
                            {t('ReservationRetrieval.nameOnReservation')}
                        </div>
                        <div className={ReservationRetrievalModule.MyReservationContainerRightHalfLabel}>
                            {/* Correcting the dynamic data rendering */}
                            {reservation.first_name} {reservation.last_name}
                        </div>
                        <div>
                            {t('ReservationRetrieval.roomType')}: {reservation.roomTypeName}
                        </div>
                        <div className={ReservationRetrievalModule.MyReservationContainerRightHalfDetails}>
                            <div>{reservation.adults} {t('ReservationRetrieval.adults')} | {reservation.children} {t('ReservationRetrieval.children')}</div>
                            <div>{t('ReservationRetrieval.nights')}: {calculateNights(reservation.CheckInDate, reservation.CheckOutDate)}</div> {/* Assuming you have 'nights' field */}
                        </div>
                        <div className={ReservationRetrievalModule.MyReservationContainerRightHalfDetails}>
                            {t('ReservationRetrieval.dates')}: {reservation.CheckInDate} - {reservation.CheckOutDate} {/* Assuming you have 'startDate' and 'endDate' */}
                        </div>
                    </div>
                </div>
            )
        })}



        
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
                <img src="../TikTokLogo.png" alt="TikTok" className={styles.socialIcon}/>
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <img src="../FacebookLogo.png" alt="Facebook" className={styles.socialIcon}/>
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <img src="../X_Logo.png" alt="Twitter" className={styles.socialIcon}/>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="../InstagramLogo.png" alt="Instagram" className={styles.socialIcon}/>
            </a>
            </div>
        </div>
        <p>&copy; 2024 Al-Batra Hotel. All rights reserved.</p>
        </footer>
    </div>
);
};

export default ReservationRetrieval;