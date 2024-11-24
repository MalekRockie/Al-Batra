"use client";

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { Box } from '@mui/material';
import Link from 'next/link';
import RoomTypeSelection from './RoomTypeSelection';
import CustomDateRangePicker from './CustomDateRangePicker';
import Carousel from './Carousel';
import styles from '../scss/Home.module.scss';
// import LanguageSwitch from '../components/LanguageSwitch';
// import { useTranslation } from 'react-i18next';

export default function Home() {

  const from = new Date();
  const to = new Date();
  to.setDate(from.getDate() + 1);

  const router = useRouter();
  // const {t} = useTranslation("common")
  const [selectedRooms, setSelectedRooms] = useState([[]]);
  const [selectedDates, setSelectedDates] = useState([from, to]);
  const [isBookingVisible, setIsBookingVisible] = useState(true);
  const [isScrolledToMax, setIsScrolledToMax] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleDateRangeChange = (dates) => {
    setSelectedDates(dates);
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



  const toggleBookingSection = () => {
    setIsBookingVisible(!isBookingVisible);
  };

   useEffect(() => {
        function handleScroll() {
            const scrollPosition = window.scrollY;
            // console.log('Scroll Position:', scrollPosition);
            setIsScrolledToMax(scrollPosition === 0);
        }

        function handleMouseOver() {
            // console.log('Mouse Over Header');
            setIsMouseOver(true);
        }

        function handleMouseOut() {
            // console.log('Mouse Out of Header');
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

    useEffect(() => {
        // console.log('isScrolledToMax:', isScrolledToMax);
        // console.log('isMouseOver:', isMouseOver);
    }, [isScrolledToMax, isMouseOver]);



    
  return (
    <div className={styles.pageContainer}>
      {/* <div className={styles.uConstruction}>
        <p>
          Website still Under construction!
        </p>
      </div> */}
      <div className={styles.container}>
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
                <a href="#rooms">ROOMS</a>
                <a href="#dining">DINING</a>
                <a href="#amenities">AMENITIES</a>
                <a href="#booking" onClick={(e) => {
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

        <main className={styles.main}>
          <section className={styles.hero}>
            <div className={styles.heroText}>
              <h2 className={styles.heroSmall}>AL-BATRA HOTEL</h2>
              <h1 className={styles.heroLarge}>TRIPOLI</h1>
              <p className={styles.heroSmall}>
                Ahmed Shawky St. - Tripoli, Libya
              </p>
              <div className={styles.contactInfoHeader}>
                <p>info@albatrahotel.net</p>
                <p>+218 21-3345509</p>
              </div>
            </div>
          </section>
          <div className={styles.descImg}>
            <img src="logo.png" alt="Al-Batra Hotel Logo" className={styles.descImg}/>
          </div>
          
          <div className={styles.descSection}>
            <div className={styles.descTitle}>
              ELEGANT LUXURY INFUSED WITH LIBYAN HOSPITALITY
            </div>
            <div className={styles.description}>
              Welcome to Al Batra Hotel, where Libyan heritage meets modern sophistication. Located in the heart of Tripoli, our hotel offers an unparalleled experience in a city rich with history and vibrant culture. Explore iconic landmarks like the Red Castle Museum and the ancient Roman arch of Marcus Aurelius, or stroll through the bustling markets and scenic Mediterranean coastlines. Start your day with a lavish breakfast at Al Batra Bistro, unwind at our luxurious spa, and end your evening with exquisite cuisine and refreshing drinks at our Rooftop Lounge, all while overlooking the picturesque cityscape of Tripoli.
            </div>
          </div>

          <Carousel />

          <section id="rooms" className={styles.section}>
            {/* <div className={styles.descTitle}>Our Rooms</div> */}
            <div className={styles.rooms}>
              <div className={styles.roomContainer}>
                <div className={styles.roomTextContainer}>
                  <div className={styles.descTitle2}>Deluxe Room</div>
                  <p>Spacious and elegantly designed.</p>
                  <p>Experience the epitome of luxury in our Deluxe Rooms. Spacious and elegantly designed, each detail is meticulously crafted to provide unparalleled comfort and sophistication. Indulge in plush bedding, state-of-the-art amenities, and breathtaking views, creating an unforgettable retreat that embodies refined elegance.</p>
                </div>
                <div className={styles.roomImageContainer}>
                  <img src="room1.jpg" alt="Deluxe Room" className={styles.roomImage} />
                </div>
              </div>
            </div>
            {/* <div className={styles.rooms}>
              <div className={styles.roomContainer}>
                <div className={styles.roomImageContainer}>
                  <img src="/room2.jpg" alt="Suite" className={styles.roomImage} />
                </div>
                <div className={styles.roomTextContainer}>
                  <h4>Suite</h4>
                  <p>Luxury and comfort with stunning views.</p>
                </div>
              </div>
            </div> */}
          </section>

          <section id="dining" className={styles.section}>
            {/* <div className={styles.descTitle}>Dining</div> */}
            <div className={styles.dining}>
              <div className={styles.restaurant}>
                <img src="dining1.jpg" alt="Restaurant" />
                <div className={styles.diningDesc1}>
                  <div className={styles.descTitle2}>Gourmet Restaurant</div>
                  <p>Indulge in culinary excellence at our Gourmet Restaurant, where each dish is a masterpiece crafted with precision and passion. From local delicacies to international flavors, savor an exquisite dining experience amidst an ambiance of refined elegance.</p>
                </div>
              </div>
            </div>
            <div className={styles.dining}>
              <div className={styles.restaurant}>
                <img src="dining2.jpg" alt="Cafe" />
                <div className={styles.diningDesc2}>
                  <div className={styles.descTitle2}>Luxury Cafe</div>
                  <p>Escape into a world of indulgence at our Luxury Cafe, where every sip of coffee and bite of pastry is a moment of pure bliss. Relax in elegant surroundings and savor the rich aroma of freshly brewed coffee and decadent pastries crafted by skilled artisans.</p>
                </div>
              </div>
            </div>
          </section>
        </main>

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
    </div>
  );
}
