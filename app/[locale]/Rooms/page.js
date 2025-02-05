"use client";

import { useState, useEffect, useRef } from 'react';
import CustomDateRangePicker from '../components/CustomDateRangePicker';
import RoomTypeSelection from '../components/RoomTypeSelection';
import homeStyle from '../../../scss/Home.module.scss';
import styles from '../../../scss/Home.module.scss';
import RoomsModule from '../../../scss/Rooms.module.scss';
import { useRouter } from 'next/navigation';
import {useLocale, useTranslations} from 'next-intl';
import Link from 'next/link';
import LoadingSpinner from '../components/LoadingSpinner';



const Rooms = () => {
  const router = useRouter();
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const CurrentBill = 0;
  const t = useTranslations();
  const locale = useLocale();

  //Testing Here
  const [history, setHistory] = useState([[]]);
  const [tempSelectedRooms, setTempSelectedRooms] = useState([{ adults: 1, children: 0, roomType: null, package: null },]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [totalAdults, setTotalAdults] = useState();
  const [totalChildren, setTotalChildren] = useState();
  const [isBookingVisible, setIsBookingVisible] = useState(false);
  const [isScrolledToMax, setIsScrolledToMax] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [selectedDates, setSelectedDates] = useState([today, tomorrow]);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [roomType, setRoomType] = useState([]); 
  const [AvailablePackages, setAvailablePackages] = useState([]);
  const [activeRoomIndex, setActiveRoomIndex] = useState(null); 
  const [activeSelectedRoomIndex, setSelectedActiveRoomIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [PackageSelection, setPackageSelection] = useState(true);
  const [totalCostEstimate, setTotalCostEstimate] = useState(0);
  const [currentStep, setCurrentStep] = useState('dateSelection');
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRoomTrackerBarOpen, setIsRoomTrackerBarOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const containerRef = useRef(null);
  const dialogRef = useRef(null);


  //should be true only when the used is about to proceed to the next page
  const [isRoomSelectionComplete, setRoomSelectionComplete] = useState(false);
  const closeIconClass = locale === "ar" ? homeStyle['close-icon-ar'] : homeStyle['close-icon'];
  const hamburgerClass = locale === "ar" ? homeStyle['hamburger-ar'] : homeStyle['hamburger'];
  const bookingTitle = locale === "ar" ? homeStyle['bookingTitle-ar'] : homeStyle.bookingTitle;
  const headerClass = locale === "ar" ? homeStyle['header-ar'] : homeStyle.header;
  const navLogoTitleClass = locale === "ar" ? homeStyle['logoTitleNav-ar'] : homeStyle.logoTitleNav;
  const logoClass = locale === "ar" ? homeStyle['logo-ar'] : homeStyle.logo; 
  const titleNavClass = locale === "ar" ? homeStyle['titleNav-ar'] : homeStyle.titleNav; 
  const titleClass = locale === "ar" ? homeStyle['title-ar'] : homeStyle.title; 
  const navClass = locale === "ar" ? homeStyle['nav-ar'] : homeStyle.nav;
  const Container2Class = locale === "ar" ? RoomsModule['Container2-ar'] : RoomsModule.Container2;
  const titleMobileClass = locale === "ar" ? homeStyle['titleMobile-ar'] : homeStyle['titleMobile'];

  useEffect (() => 
    {
      document.addEventListener("mousedown", handleClickOutSideNavBar);
      return () => {
        document.removeEventListener("mousedown", handleClickOutSideNavBar);
      };
  }, []);

  useEffect (() => 
    {
      document.addEventListener("mousedown", handleClickOutSideDialog);
      return () => {
        document.removeEventListener("mousedown", handleClickOutSideDialog);
      };
  }, []);

  useEffect(()=> {
    fetchRoomTypes();
  },[]);

  useEffect(()=>
    {
      window.scrollTo(0, 0);
      let totalAdultsCalc = 0;
      let totalChildrenCalc = 0;
      for (const rooms of selectedRooms)
        {
          // console.log(rooms.adults);
          totalAdultsCalc += rooms.adults;
          totalChildrenCalc += rooms.children;
        }
        setTotalAdults(totalAdultsCalc);
        setTotalChildren(totalChildrenCalc);
        // console.log("Total Adults here is: ", totalAdults);
        // console.log("Total children here is: ", totalChildren);
    }, [selectedRooms, totalAdults, totalChildren])

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
      setIsScrolledToMax(scrollPosition === 0);
    }

    
    function handleMouseOver() {
      setIsMouseOver(true);
    }

    function handleMouseOut() {
      setIsMouseOver(false);
    }

  }, []);

  const handleUpdateSearch = () => {

    if(isMobile){
          setIsBookingVisible(false);
    }
    window.scrollTo(0, 0);
    setRoomSelectionComplete(false);
    setPackageSelection(true);
    setSelectedActiveRoomIndex(0);
    setSelectedRooms(JSON.parse(JSON.stringify(tempSelectedRooms)));

    if (selectedDates[0] && selectedDates[1]) {
      const checkIn = selectedDates[0].toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const checkOut = selectedDates[1].toISOString().split('T')[0]; // Format as YYYY-MM-DD


      // Fetch room types from the API with selected dates
      fetchRoomTypes();
    } else {
      alert('Please select a check-in/check-out date and room size!');
    }
  };

  const handleClickOutSideNavBar = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsMenuOpen(false); // Close the menu
    }
  };

  const handleClickOutSideDialog = (event) => {
    if (dialogRef.current && !dialogRef.current.contains(event.target)) {
      setIsDialogOpen(false);
    }
  };


  const toggleMenu = () => {
    // setIsMenuOpen(!isMenuOpen);
    setIsMenuOpen((prevState) => !prevState);
  }

  const openDialog = () => 
  {
    setIsDialogOpen(true);
  }

  const CloseDialog = () => 
  {
    setIsDialogOpen(false);
  }

  const fetchRoomTypes = async () => {
    try {
      console.log("Trying");
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8080/room/getAllRoomTypes`
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


  //This is to traverse between different states in the mobile version of the booking bar
  const handleContinue = () => {
        setCurrentStep('roomSelection'); // Move to room selection on continue
    };

  const handleBack = () => {
          setCurrentStep('dateSelection'); // Go back to date selection
      };


  const toggleBookingSection = () => {
    setIsDialogOpen(false);
    setIsBookingVisible(!isBookingVisible);
  };

  const toggleOptions = (index, room) => {
    setActiveRoomIndex(activeRoomIndex === index ? null : index, room);
  };


  return (
    <div className={RoomsModule.body}>
      
      
      <title>{t('HomePage.roomSearchTitle')}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="description" content="Experience the finest luxury at our hotel" />
      <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Playfair+Display:wght@400;700&display=swap" rel="homeStyleheet" />


      {/* Header */}
      <header className={`${headerClass} ${isMenuOpen ? homeStyle.active : ''}${isScrolledToMax && !isMouseOver ? homeStyle.gradient : homeStyle.solid}`}>

        <div className={hamburgerClass} onClick={toggleMenu}>
          <div className={homeStyle.lines}></div>
          <div className={homeStyle.lines}></div>
          <div className={homeStyle.lines}></div>
        </div>
        <img src="../../logo.png" alt="Al-Batra Hotel Logo" className={logoClass} />

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
              <img src= "../../logo.png" className={homeStyle.logoMobileNav} alt="Al-Batra Hotel Logo"/>
              <div className={titleMobileClass}>{t('HomePage.title')}</div>
              <Link href={`/${locale}`}>{t('NavigationBar.Home')}</Link>
              <a href={`/${locale}/Rooms`}>{t('NavigationBar.Rooms')}</a>
              <a href="">{t('NavigationBar.Dinning')}</a>
              <a href="" onClick={(e) => {
                toggleBookingSection();
                e.preventDefault();
              }}>{t('NavigationBar.Booking')}</a>
              <a href={`/${locale}/ReservationRetrieval`}>{t('NavigationBar.MyReservation')}</a>
            </nav>
          </div>
        </div>

      </header>

      {/* page content */}
      <div className={RoomsModule.main}>
      


      {/* Booking Section */}
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
                            selectedRooms={tempSelectedRooms}
                            setSelectedRooms={setTempSelectedRooms}
                          />
                      </div>
                      <div className={homeStyle.buttonsForBookBar}>
                        <button className={homeStyle.BookingButton} onClick={handleBack}>
                            ← {t("NavigationBar.Back")}
                        </button>
                        <button onClick={handleUpdateSearch} className={homeStyle.BookingButton}>{t("NavigationBar.Search")}</button>
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
                            selectedRooms={tempSelectedRooms}
                            setSelectedRooms={setTempSelectedRooms}
                          />
                      </div>
                      <button onClick={handleUpdateSearch} className={homeStyle.searchButton}>{t("NavigationBar.Search")}</button>
                  </div>
              )}
      </div>


      {/* This is a shadow effect that only appears beneath the navbar when it is open. */}
      {isMenuOpen && (
        <div className={RoomsModule.nonFocusShader }></div>
      )}
      {!isLoading && (
        <div>
          <div className={RoomsModule.Bgg}>
            <div className={RoomsModule.pageTitle}>
              Our rooms
            </div>
          </div>
          <div className={RoomsModule.Container1}>
            <div className={Container2Class}>Situated on Ahmed Shawky Street in central Tripoli, Al Batra Hotel occupies a modern high-rise building with floor-to-ceiling windows offering sweeping views of Libya’s bustling capital 311. The hotel is 700 meters from Tripoli’s historic Old Town, placing guests within walking distance of landmarks like Al-Majidya Mosque, Green Square, and Tripoli’s Red Castle (Assai al-Hamra) 34. Mitiga International Airport is a 10km drive away, with the hotel providing a complimentary airport shuttle upon request </div>
          </div>
          <div className={RoomsModule.line}></div>
        </div>
      )}
      {/* Loading spinner */}
      {isLoading ? (
        <LoadingSpinner
          imageSrc="../../logo.jpg"
          imageSize={80}
          spinnerSize={140}
          borderSize={4}
          animationSpeed="1s"
          />
      ) : (
        <div className={RoomsModule.RoomsLists}>
        {/* ^ Room List ^ */}

          {roomType.length > 0 ? (
            roomType.map((room, index) => (
              <div key={index}>

                
                  <div className={RoomsModule.RoomContainer}>
                    <div className={RoomsModule.roomImageContainer}>
                      <img
                        src={`../Gallery/room${index+1}.jpg`}
                        alt={room.typeName}
                        className={RoomsModule.roomImage}
                      />
                    </div>
                    <div className={RoomsModule.RoomCardContainerRightside}>
                      <div className={RoomsModule.RoomTitleAndDesc}>
                        {room[`typeName_${locale}`]}
                        <div className={RoomsModule.RoomDescription}>
                            <div className={RoomsModule.OptionElement}>
                                <img className={RoomsModule.OptionIcon} src="../bed_icon.png" />
                                  {room.bedConfiguration_en}
                              </div>
                              <div className={RoomsModule.OptionElement}>
                                <img className={RoomsModule.OptionIcon} src="../occupants.png" />
                                {room.occupancy_en}
                              </div>
                              <div className={RoomsModule.OptionElement}>
                                <img className={RoomsModule.OptionIcon} src="../wifi_icon.png" />
                                High internet speed wifi
                            </div>
                          <div className={RoomsModule.viewMoreDetails} onClick={()=> {toggleOptions(index, room)}}>
                            View More details
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                
                {activeRoomIndex === index && (
                  <div
                    className={`${RoomsModule.optionsContainer} ${
                      activeRoomIndex === index ? RoomsModule.visible : ''
                    }`}
                  >
                    <div className={RoomsModule.option}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className={RoomsModule.optionTitle}>
                          <div className={RoomsModule.LeftSide}>
                            <div className={RoomsModule.OptionElement}>
                              <img className={RoomsModule.OptionIcon} src="../bed_icon.png" />
                                {room.bedConfiguration_en}
                            </div>
                            <div className={RoomsModule.OptionElement}>
                              <img className={RoomsModule.OptionIcon} src="../occupants.png" />
                              {room.occupancy_en}
                            </div>
                            <div className={RoomsModule.OptionElement}>
                              <img className={RoomsModule.OptionIcon} src="../wifi_icon.png" />
                              High internet speed wifi
                            </div>
                          </div>
                          <div className={RoomsModule.RightSide}>

                          </div>
                          {/* Our rooms offer comfort and convenience with modern décor, plush bedding, flat-screen TV, Wi-Fi, and spacious work desk. Private bathrooms feature rainfall showers and premium toiletries for a relaxing stay. */}
                          
                          </div>
                      </div>
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
        {AvailablePackages.map((pkg, index) => (
          <div key={index}>
            {PackageSelection == false && (
              <div className={RoomsModule.RoomsLists}>
                <div className={RoomsModule.PkgContainer}>
                    <div className={RoomsModule.roomImageContainer}>
                      <img
                              src={`../room3.jpg`}
                              className={RoomsModule.roomImage}
                            />
                    </div>
                    <div className={RoomsModule.RoomCardContainerRightside}>

                      
                        <div className={RoomsModule.RoomTitleAndDesc}>
                          <div className={RoomsModule.packageTitle}>
                            <div>
                              {pkg[`package_Type_${locale}`]}
                            </div>
                            <div className={RoomsModule.PackageDescriptionEN}>
                              <div>
                                {pkg.package_desc_EN}
                              </div>
                            </div>
                          </div>
                        </div>
                      

                      <div className={RoomsModule.RoomCardContainerRightsideRightHalf}>
                        <div className={RoomsModule.PackageCost}>
                        </div>
                        <div className={RoomsModule.selectPackageButtonContainer}>
                        </div>
                      </div>



                    </div>
                  </div>
                </div>
              )}
          </div>
        ))}
        {/* Proceed to the next page box */}
      </div>

      <div className={RoomsModule.footerContainer}>
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
                  <img src="../TikTokLogo.png" alt="TikTok" className={styles.socialIcon} />
                </a>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  <img src="../FacebookLogo.png" alt="Facebook" className={styles.socialIcon} />
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                  <img src="../X_Logo.png" alt="Twitter" className={styles.socialIcon} />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <img src="../InstagramLogo.png" alt="Instagram" className={styles.socialIcon} />
                </a>
              </div>
            </div>
            <p>&copy; 2024 Al-Batra Hotel. All rights reserved.</p>
          </footer>
      </div>

    </div>
  );
};

export default Rooms;