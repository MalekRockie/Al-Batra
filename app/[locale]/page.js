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
import LoadingSpinner from './components/LoadingSpinner';
import useBookingReady from './hooks/useBookingReady';

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
  const [isLoading, setIsLoading] = useState(true);
  const isBookingReady = useBookingReady({ isMobile, currentStep });

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
  const bookingTitleClass = locale === "ar" ? homeStyle['bookingTitle-ar'] : bookingTitle['bookingTitle'];
  const titleMobileClass = locale === "ar" ? homeStyle['titleMobile-ar'] : homeStyle['titleMobile'];
  // const langSwitcher = LocaleSwitcher();

  const OPTIONS = { loop: true};
  const SLIDE_COUNT = 8;
  const SLIDES = [
    {
      imageSrc: 'hotel1.jpg',
      altText: 'Slide 1',
      titleKey: 'Gallery.BusinessCenter',
      descKey: 'Gallery.BusinessDesc'
    },
    {
      imageSrc: 'room2.jpg',
      altText: 'Slide 2',
      titleKey: 'Gallery.LobbyLounge',
      descKey: 'Gallery.LobbyDesc'
    },
    {
      imageSrc: 'hero.jpg',
      altText: 'Slide 3',
      titleKey: 'Gallery.Welcome',
      descKey: 'Gallery.WelcomeDesc'
    },
    {
      imageSrc: 'room3.jpg',
      altText: 'Slide 5',
      titleKey: 'Gallery.ExecutiveSuites',
      descKey: 'Gallery.ExecutiveDesc'
    },
    {
      imageSrc: 'room1.jpg',
      altText: 'Slide 4',
      titleKey: 'Gallery.DeluxeRooms',
      descKey: 'Gallery.DeluxeDesc'
    }
  ];
  const SLIDES2 = [
    {
      imageSrc: './Gallery/Food1.jpg',
      altText: 'Slide 1',
      titleKey: 'Gallery.BusinessCenter',
      descKey: 'Gallery.BusinessDesc'
    },
    {
      imageSrc: './Gallery/Food2.jpg',
      altText: 'Slide 2',
      titleKey: 'Gallery.LobbyLounge',
      descKey: 'Gallery.LobbyDesc'
    },
    {
      imageSrc: './Gallery/Food3.jpg',
      altText: 'Slide 3',
      titleKey: 'Gallery.Welcome',
      descKey: 'Gallery.WelcomeDesc'
    },
    {
      imageSrc: './Gallery/Food4.jpg',
      altText: 'Slide 5',
      titleKey: 'Gallery.ExecutiveSuites',
      descKey: 'Gallery.ExecutiveDesc'
    },
    {
      imageSrc: './Gallery/Food5.jpg',
      altText: 'Slide 4',
      titleKey: 'Gallery.DeluxeRooms',
      descKey: 'Gallery.DeluxeDesc'
    }
  ];
  const containerRef = useRef(null);


  useEffect(() => {
    if (isBookingReady) {
      // Add slight delay for smooth transition
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isBookingReady]);

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
      const selectedDatesToGo = JSON.stringify(selectedDates);
      const rooms = JSON.stringify(selectedRooms);

      console.log({ checkIn, checkOut, rooms });

      // Manually construct the URL with query parameters
      const searchParams = new URLSearchParams({
        checkIn,
        checkOut,
        selectedDatesToGo,
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
      const isMobile = window.innerWidth <= 768;
      setIsMobile(isMobile);
      // Set bookingVisible to true ONLY if NOT mobile
    };
  
    // Initial check on mount
    handleResize();
  
    // Update on window resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(()=>{
    if(!isMobile){
      setIsBookingVisible(false);
    }
  }, [])
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
    <div>
      {isLoading ? (
      <LoadingSpinner
      imageSrc="/logo.jpg"
      imageSize={80}
      spinnerSize={140}
      borderSize={4}
      animationSpeed="1s"
  />
      ) : (
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
            <img src="logo.png" alt="Al-Batra Hotel Logo" className={logoClass} />

            <div
            ref={containerRef}
            className={`${navLogoTitleClass} ${isMenuOpen ? homeStyle.active : ''}`}>

              
              <div className={closeIconClass} onClick={toggleMenu}>
                  <div className={homeStyle.line1}></div>
                  <div className={homeStyle.line2}></div>
              </div>

              {/* <img src="logo.png" alt="Al-Batra Hotel Logo" className={logoClass} /> */}
              {/* Hamburger Icon */}

              <div className={titleNavClass}>
              <h1 className={titleClass}>{t('HomePage.title')}</h1>

                {/* Navigation Links */}
                <nav className={`${navClass}`}>
                  <img src="logo.png" className={homeStyle.logoMobileNav} alt="Al-Batra Hotel Logo"/>
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

          {isMenuOpen && (
          <div className={homeStyle.nonFocusShader }></div>
        )}
          <div className={`${homeStyle.bookingBar} ${isBookingVisible ? homeStyle.visible : homeStyle.hidden} ${isMobile && currentStep === 'dateSelection' ? homeStyle.dateActive : ''} 
          ${isMobile && currentStep === 'roomSelection' ? homeStyle.roomActive : ''}`}>
                  {/* Render differently based on screen size */}
                  {isMobile && currentStep === 'dateSelection' && (
                      <div className={homeStyle.bookingContainer}>
                          <div className={homeStyle.datePickerContainer}>
                              <div className={bookingTitleClass}>{t("NavigationBar.SelectDates")}</div>
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
                              <div className={homeStyle.bookingTitle}>{t("NavigationBar.SelectRoomType")}</div>
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

            <section id="dining" className={homeStyle.sectionDinner}>
              {/* <div className={homeStyle.descTitle}>Dining</div> */}
              {/* <EmblaCarousel 
                slides={SLIDES2}
                options={OPTIONS}
                style={{
                  '--embla-height': '100vh',
                  '--slide-height': '100vh',
                  '--image-height': '80%',
                  '--slide-spacing': '1rem'
                }}
              /> */}
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
      </div>)}
    </div>
  );
}
