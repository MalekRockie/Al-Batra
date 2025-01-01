"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import RoomTypeSelection from './components/RoomTypeSelection';
import CustomDateRangePicker from './components/CustomDateRangePicker';
import homeStyle from '../../scss/Home.module.scss';
import {useLocale, useTranslations} from 'next-intl';
import CustomerLocaleSwitcher from '../../components/customerLocaleSwitcher.tsx'
import EmblaCarousel from './components/EmblaCarousel.jsx';
import '../../scss/embla.module.scss';


export default function Home() {

  const from = new Date();
  const to = new Date();
  to.setDate(from.getDate() + 1);
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const [selectedRooms, setSelectedRooms] = useState([{ adults: 1, children: 0, roomType: null, package: null },]);
  const [selectedDates, setSelectedDates] = useState([from, to]);
  const [isBookingVisible, setIsBookingVisible] = useState(false);
  const [isScrolledToMax, setIsScrolledToMax] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [lang, setLang] = useState();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clickedOutsideNavBar, setClickedOutsideNavBar] = useState(false);
  const [currentStep, setCurrentStep] = useState('dateSelection');
  const [isMobile, setIsMobile] = useState(false);

  //Major stlying classes
  const navClass = locale === "ar" ? homeStyle['nav-ar'] : homeStyle.nav;
  const navLogoTitleClass = locale === "ar" ? homeStyle['logoTitleNav-ar'] : homeStyle.logoTitleNav;
  const titleNavClass = locale === "ar" ? homeStyle['titleNav-ar'] : homeStyle.titleNav; 
  const titleClass = locale === "ar" ? homeStyle['title-ar'] : homeStyle.title; 
  const logoClass = locale === "ar" ? homeStyle['logo-ar'] : homeStyle.logo; 
  const headerClass = locale === "ar" ? homeStyle['header-ar'] : homeStyle.header;
  const langSwitcherClass = locale === "ar" ? homeStyle['langSwitcherContainer-ar'] : homeStyle.langSwitcherContainer;
  const bookingTitle = locale === "ar" ? homeStyle['bookingTitle-ar'] : homeStyle.bookingTitle;
  const hotelDetailsText = locale === "ar" ? homeStyle['hotelDetailsText-ar'] : homeStyle.hotelDetailsText;
  const closeIconClass = locale === "ar" ? homeStyle['close-icon-ar'] : homeStyle['close-icon'];
//.hamburger
const hamburgerClass = locale === "ar" ? homeStyle['hamburger-ar'] : homeStyle['hamburger'];


  // const langSwitcher = LocaleSwitcher();

  const OPTIONS = { loop: true};
  const SLIDE_COUNT = 8;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
  const containerRef = useRef(null);


  const handleDateRangeChange = (dates) => {
    setSelectedDates(dates);
  };

  const handleSearch = () => {
    console.log("Selected Dates: ", selectedDates);
    // console.log("Room: ", selectedRooms);
      if(selectedRooms[0].adults == null)
        {
          const defaultRoom = { adults: 1, children: 0, roomType: null, package: null, roomPrice: 0.0, package_Price: 0.0};
          const updatedRooms = [[]]; 
          updatedRooms[0] = defaultRoom; 
          setSelectedRooms(updatedRooms);
          console.log(updatedRooms);
        }
    if (selectedDates[0] && selectedDates[1] && selectedRooms.length > 0) {

      console.log(selectedRooms);
      const pathname = `/${locale}/RoomSearch`;
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
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Mobile if width <= 768px
        };
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        if(selectedRooms[0].adults == null)
        {
          const defaultRoom = { adults: 1, children: 0, roomType: null, package: null, roomPrice: 0.0, package_Price: 0.0};
          const updatedRooms = [[]]; 
          updatedRooms[0] = defaultRoom; 
          setSelectedRooms(updatedRooms);
        }

        // window.addEventListener('scroll', handleScroll);
        // const header = document.querySelector(`.${headerClass}`);
        // header.addEventListener('mouseover', handleMouseOver);
        // header.addEventListener('mouseout', handleMouseOut);

        // return () => {
        //     window.removeEventListener('scroll', handleScroll);
        //     header.removeEventListener('mouseover', handleMouseOver);
        //     header.removeEventListener('mouseout', handleMouseOut);
        // };
    }, []);

  useEffect(() => {
        // console.log('isScrolledToMax:', isScrolledToMax);
        // console.log('isMouseOver:', isMouseOver);
    }, [isScrolledToMax, isMouseOver, selectedRooms]);

  useEffect (() => 
    {
      document.addEventListener("mousedown", handleClickOutSideNavBar);
      return () => {
        document.removeEventListener("mousedown", handleClickOutSideNavBar);
      };
    }, []);

  const toggleMenu = () => {
    // setIsMenuOpen(!isMenuOpen);
    setIsMenuOpen((prevState) => !prevState);
  }

  const handleClickOutSideNavBar = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsMenuOpen(false); // Close the menu
    }
  };
    
  //This is for the mobile phone version
  const handleContinue = () => {
        setCurrentStep('roomSelection'); // Move to room selection on continue
    };
  const handleBack = () => {
          setCurrentStep('dateSelection'); // Go back to date selection
      };


  return (
    <div className={homeStyle.pageContainer}>
      {/* <div className={homeStyle.uConstruction}>
        <p>
          Website still Under construction!
        </p>
      </div> */}
      
      <div className={homeStyle.container}>

          <title>Al Batra Hotel</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="Experience the finest luxury at our hotel" />
          <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Playfair+Display:wght@400;700&display=swap" rel="homeStyleheet" />

        {/* Hamburger Icon */}

        <header className={`${headerClass} ${isMenuOpen ? homeStyle.active : ''}${isScrolledToMax && !isMouseOver ? homeStyle.gradient : homeStyle.solid}`}>

          <div className={hamburgerClass} onClick={toggleMenu}>
            <div className={homeStyle.lines}></div>
            <div className={homeStyle.lines}></div>
            <div className={homeStyle.lines}></div>
          </div>

          <div
          ref={containerRef}
          className={`${navLogoTitleClass} ${isMenuOpen ? homeStyle.active : ''}`}>

            
            <div className={closeIconClass} onClick={toggleMenu}>
                <div className={homeStyle.line1}></div>
                <div className={homeStyle.line2}></div>
            </div>

            <img src="logo.png" alt="Al-Batra Hotel Logo" className={logoClass} />
            {/* Hamburger Icon */}

            <div className={titleNavClass}>
              <h1 className={titleClass}>{t('HomePage.title')}</h1>

              {/* Navigation Links */}
              <nav className={`${navClass}`}>
                <Link href={`/${locale}`}>{t('NavigationBar.Home')}</Link>
                <a href="">{t('NavigationBar.Rooms')}</a>
                <a href="">{t('NavigationBar.Dinning')}</a>
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


        <div className={`${homeStyle.bookingBar} ${isBookingVisible ? homeStyle.visible : homeStyle.hidden} ${isMobile && currentStep === 'dateSelection' ? homeStyle.dateActive : ''} 
        ${isMobile && currentStep === 'roomSelection' ? homeStyle.roomActive : ''}`}>
                {/* Render differently based on screen size */}
                {isMobile && currentStep === 'dateSelection' && (
                    <div className={homeStyle.bookingContainer}>
                        <div className={homeStyle.datePickerContainer}>
                            <div className={homeStyle.bookingTitle}>SELECT YOUR DATES</div>
                            <div onClick={(e) => {toggleBookingSection();}} className={homeStyle.CloseWindow}>X</div>
                            <CustomDateRangePicker
                              selectedDates={selectedDates}
                              setSelectedDates={setSelectedDates}
                            />
                        </div>
                        <button className={homeStyle.continueButton} onClick={handleContinue}>
                            {t("NavigationBar.Continue")}
                        </button>
                    </div>
                )}
                {isMobile && currentStep === 'roomSelection' && (
                    <div className={homeStyle.bookingContainer}>
                        <div className={homeStyle.roomTypeContainer}>
                            <div className={homeStyle.bookingTitle}>Select Room Type</div>
                            <div onClick={(e) => {toggleBookingSection();}} className={homeStyle.CloseWindow}>X</div>
                            <RoomTypeSelection
                              selectedRooms={selectedRooms}
                              setSelectedRooms={setSelectedRooms}
                            />
                        </div>
                        <div className={homeStyle.buttonsForBookBar}>
                          <button className={homeStyle.BookingButton} onClick={handleBack}>
                              ← {t("NavigationBar.Back")}
                          </button>
                          <button onClick={handleSearch} className={homeStyle.BookingButton}>{t("NavigationBar.Search")}</button>
                        </div>
                    </div>
                )}
                {!isMobile && (
                    <div className={homeStyle.bookingContainer}>
                        {/* Default desktop layout */}
                        <div className={homeStyle.datePickerContainer}>
                            <div className={bookingTitle}>{t("NavigationBar.Dates")}</div>
                            <CustomDateRangePicker
                              selectedDates={selectedDates}
                              setSelectedDates={setSelectedDates}
                            />
                        </div>
                        <div className={homeStyle.roomTypeContainer}>
                            <div className={bookingTitle}>{t("NavigationBar.RoomSize")}</div>
                            <RoomTypeSelection
                              selectedRooms={selectedRooms}
                              setSelectedRooms={setSelectedRooms}
                            />
                        </div>
                        <button onClick={handleSearch} className={homeStyle.searchButton}>{t("NavigationBar.Search")}</button>
                    </div>
                )}
        </div>

        {/* <main> */}
        <div className={homeStyle.main}>
          <div className={homeStyle.hotelDetailsContainer}>
            <section className={homeStyle.hotelDetails}>
              <div className={hotelDetailsText}>
                <h2 className={homeStyle.hotelDetailsSmall}>{t("address.Title")}</h2>
                <h1 className={homeStyle.hotelDetailsLarge}>{t("address.City")}</h1>
                <p className={homeStyle.hotelDetailsSmall}>
                  {t("address.Street")}
                </p>
                <div className={homeStyle.contactInfoHeader}>
                  <p>info@albatrahotel.net</p>
                  <p>+218 21-3345509</p>
                </div>
              </div>
            </section>
          </div>
          
          {isMobile && (<div>
            <button className={homeStyle.CheckRatesButton} onClick={(e) => {
                  toggleBookingSection();
                  e.preventDefault();
                }}>
                            {t("NavigationBar.CheckButton")}
            </button>
          </div>)}

            {isMobile && (
                <div className={homeStyle.hotelDetailsMobile}>
                  <p className={homeStyle.hotelDetailsSmall}>
                    {t("address.Street")}
                  </p>
                  <div className={homeStyle.contactInfoHeader}>
                    <p>info@albatrahotel.net</p>
                    <a href="tel:+218213345509">+218 21-3345509</a>
                  </div>
                </div>
            )}

          <div className={homeStyle.descImg}>
            <img src="logo.png" alt="Al-Batra Hotel Logo" className={homeStyle.descImg}/>
          </div>
          
          <div className={homeStyle.descSection}>
            <div className={homeStyle.descTitle}>
              {t('MainDescription.title')}
            </div>
            <div className={homeStyle.description}>
              {t('MainDescription.description')}
            </div>
          </div>
          {/* <Carousel /> */}

          <div className={homeStyle.carouselContainer}>
            <EmblaCarousel slides={SLIDES} options={OPTIONS} />
          </div>

          <section id="rooms" className={homeStyle.section}>
            {/* <div className={homeStyle.descTitle}>Our Rooms</div> */}
            {/* <div className={homeStyle.rooms}>
              <div className={homeStyle.roomContainer}>
                <div className={homeStyle.roomTextContainer}>
                  <div className={homeStyle.descTitle2}>Deluxe Room</div>
                  <p>Spacious and elegantly designed.</p>
                  <p>Experience the epitome of luxury in our Deluxe Rooms. Spacious and elegantly designed, each detail is meticulously crafted to provide unparalleled comfort and sophistication. Indulge in plush bedding, state-of-the-art amenities, and breathtaking views, creating an unforgettable retreat that embodies refined elegance.</p>
                </div>
                <div className={homeStyle.roomImageContainer}>
                  <img src="room1.jpg" alt="Deluxe Room" className={homeStyle.roomImage} />
                </div>
              </div>
            </div> */}
            {/* <div className={homeStyle.rooms}>
              <div className={homeStyle.roomContainer}>
                <div className={homeStyle.roomImageContainer}>
                  <img src="/room2.jpg" alt="Suite" className={homeStyle.roomImage} />
                </div>
                <div className={homeStyle.roomTextContainer}>
                  <h4>Suite</h4>
                  <p>Luxury and comfort with stunning views.</p>
                </div>
              </div>
            </div> */}
          </section>

          <section id="dining" className={homeStyle.sectionDinner}>
            {/* <div className={homeStyle.descTitle}>Dining</div> */}
            <div className={homeStyle.dining}>
              <div className={homeStyle.restaurant}>
                <img src="dining1.jpg" alt="Restaurant" />
                <div className={homeStyle.diningDesc1}>
                  <div className={homeStyle.descTitle2}>{t("mainCards.RestruantTitle")}</div>
                  {t("mainCards.RestruantDesc")}
                </div>
              </div>
            </div>
            
            <div className={homeStyle.dining}>
              <div className={homeStyle.restaurant}>
                <img src="dining2.jpg" alt="Cafe" />
                <div className={homeStyle.diningDesc2}>
                  <div className={homeStyle.descTitle2}>{t("mainCards.CafeTitle")}</div>
                    {t("mainCards.CafeDesc")}
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className={homeStyle.footer}>
          <div className={homeStyle.footerNav}>
            <div className={homeStyle.footerNavCol}>
              <a href="#home">{t("footer.Home")}</a>
              <a href="#rooms">{t("footer.Rooms")}</a>
              <a href="#booking">{t("footer.Booking")}</a>
            </div>
            <div className={homeStyle.footerNavCol}>
              <a href="#contactUs">{t("footer.contactUs")}</a>
              <a href="#about">{t("footer.About")}</a>
            </div>
            <div className={homeStyle.footerNavCol}>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
                <img src="TikTokLogo.png" alt="TikTok" className={homeStyle.socialIcon}/>
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <img src="FacebookLogo.png" alt="Facebook" className={homeStyle.socialIcon}/>
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <img src="X_Logo.png" alt="Twitter" className={homeStyle.socialIcon}/>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="InstagramLogo.png" alt="Instagram" className={homeStyle.socialIcon}/>
              </a>
            </div>
          </div>
          <p>{t("footer.copyRight")}</p>
        </footer>
      </div>
    </div>
  );
}
