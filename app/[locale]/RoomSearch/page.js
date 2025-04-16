"use client";

import { useState, useEffect, useRef } from 'react';
import CustomDateRangePicker from '../components/CustomDateRangePicker';
import RoomTypeSelection from '../components/RoomTypeSelection';
import homeStyle from '../../../scss/Home.module.scss';
import styles from '../../../scss/Home.module.scss';
import RoomSearchModule from '../../../scss/RoomSearch.module.scss';
import { useRouter } from 'next/navigation';
import {useLocale, useTranslations} from 'next-intl';
import Link from 'next/link';
import CustomerLocaleSwitcher from '../../../components/customerLocaleSwitcher.tsx'
import LoadingSpinner from '../components/LoadingSpinner';
import { roomService } from '../../../services/api/roomService';
import {packageService} from '../../../services/api/packageService';



const RoomSearch = () => {
  const router = useRouter();
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const CurrentBill = 0;
  const t = useTranslations();
  const locale = useLocale();

  //Testing Here
  const [history, setHistory] = useState([[]]);
  const [tempSelectedRooms, setTempSelectedRooms] = useState([]);
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
  const bookingTitleClass = locale === "ar" ? RoomSearchModule['bookingTitle-ar'] : RoomSearchModule.bookingTitle;
  const selectedRoomContainerClass = locale === "ar" ? RoomSearchModule['selectedRoomContainer-ar'] : RoomSearchModule.selectedRoomContainer;
  const unSelectedRoomContainerClass = locale === "ar" ? RoomSearchModule['unSelectedRoomContainer-ar'] : RoomSearchModule.unSelectedRoomContainer;
  const RoomsRequestedBoldFontClass = locale === "ar" ? RoomSearchModule['RoomsRequestedBoldFont-ar'] : RoomSearchModule.RoomsRequestedBoldFont;
  
  const RoomsRequestedNonBoldFontClass = locale === "ar" ? RoomSearchModule['RoomsRequestedNonBoldFont-ar'] : RoomSearchModule.RoomsRequestedNonBoldFont;
  const RoomsRequestedClass = locale === "ar" ? RoomSearchModule['RoomsRequested-ar'] : RoomSearchModule.RoomsRequested;
  const closeIconClass = locale === "ar" ? homeStyle['close-icon-ar'] : homeStyle['close-icon'];
  const hamburgerClass = locale === "ar" ? homeStyle['hamburger-ar'] : homeStyle['hamburger'];
  const bookingTitle = locale === "ar" ? homeStyle['bookingTitle-ar'] : homeStyle.bookingTitle;
  const headerClass = locale === "ar" ? homeStyle['header-ar'] : homeStyle.header;
  const navLogoTitleClass = locale === "ar" ? homeStyle['logoTitleNav-ar'] : homeStyle.logoTitleNav;
  const logoClass = locale === "ar" ? homeStyle['logo-ar'] : homeStyle.logo; 
  const titleNavClass = locale === "ar" ? homeStyle['titleNav-ar'] : homeStyle.titleNav; 
  const titleClass = locale === "ar" ? homeStyle['title-ar'] : homeStyle.title; 
  const navClass = locale === "ar" ? homeStyle['nav-ar'] : homeStyle.nav;
  const langSwitcherClass = locale === "ar" ? homeStyle['langSwitcherContainer-ar'] : homeStyle.langSwitcherContainer;
  const Container2Class = locale === "ar" ? RoomSearchModule['Container2-ar'] : RoomSearchModule.Container2;
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

  useEffect(()=>
    {
      window.scrollTo(0, 0);
      let totalAdultsCalc = 0;
      let totalChildrenCalc = 0;
      for (const rooms of selectedRooms)
        {
          totalAdultsCalc += rooms.adults;
          totalChildrenCalc += rooms.children;
        }
        setTotalAdults(totalAdultsCalc);
        setTotalChildren(totalChildrenCalc);
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

  // Recalculate total cost whenever selectedRooms changes
  useEffect(() => {
    // Calculate the total cost when selectedRooms changes
    if (selectedRooms == null) return;
    if(selectedRooms != null)
      {
        const totalCost = selectedRooms.reduce((acc, room) => {
        const roomPrice = room.roomPrice || 0.0; // Default to 0 if roomPrice is null/undefined
        const package_Price = room.package_Price || 0.0; // Default to 0 if Package price is null/undefined
        const nights = calculateNights(selectedDates[0], selectedDates[1]);
        return acc + (roomPrice + package_Price) *nights;
      }, 0.0);
  
      // update the total cost state
      setTotalCostEstimate(totalCost);
      }

  }, [selectedRooms, selectedDates]); 

  useEffect(() => {
    // Get query parameters from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const selectedRoomsParams = searchParams.get('rooms');
    const selectedDatesParams = searchParams.get('selectedDatesToGo');

    const defaultRoom = { adults: 1, children: 0, roomType: null, package: null, roomPrice: 0.0, package_Price: 0.0 };

    // Update selectedRooms state
    setSelectedRooms(prevState => {
      if (!prevState || prevState.length === 0) {
        if (selectedRoomsParams) {
          try {
            // Parse selectedRoomsParams if available
            const parsedRooms = JSON.parse(selectedRoomsParams);
            setTempSelectedRooms(parsedRooms); // Update temporary state
            return parsedRooms; // Return the parsed rooms
          } catch (e) {
            // Log error and use default room if parsing fails
            console.error('Error parsing selectedRooms:', e);
          }
        }

        // If no valid selectedRoomsParams, fallback to default room
        const updatedRooms = [defaultRoom]; // Always initialize with the default room
        return updatedRooms; 
      }
      return prevState;
    });

    // Update selectedDates state
    setSelectedDates(prevState => {
      if (selectedDatesParams) {
        try {
          const parsedDates = JSON.parse(selectedDatesParams);
          const dateObjects = parsedDates.map(date => new Date(date)); // Convert strings to Date objects
          return dateObjects; // Set state with Date objects
        } catch (e) {
          console.error('Error parsing selectedDates:', e);
        }
      }
      return prevState;
    });

    // Check if selectedDates are set before making API calls
    if (selectedDates[0] && selectedDates[1]) {
      const checkIn = selectedDates[0].toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const checkOut = selectedDates[1].toISOString().split('T')[0]; // Format as YYYY-MM-DD

      // Fetch room types and available packages based on selected dates
      fetchRoomTypes(checkIn, checkOut);
      fetchAvailablePackages();
    }
  }, []); // Empty dependency array, runs once on mount

  //handles selecting the room before prompting the used to select the package for each room
  const handleSelectRoomType = (roomIndex, roomTypePicked, room_Price) => {
    setSelectedRooms(prevSelectedRooms => {
      const updatedRooms = [...prevSelectedRooms];
      updatedRooms[roomIndex] = {
        ...updatedRooms[roomIndex],
        roomType: roomTypePicked, // Set the selected package type
        roomPrice: room_Price
      };
      setPackageSelection(false);
      return updatedRooms;
    });
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

  //Handles selecting the package for each selected room once that room is selected
  const handleSelectpackage = (package_type, packagePrice) => 
  {
    const updatedRooms = [...selectedRooms];
    updatedRooms[activeSelectedRoomIndex] = 
    {
      ...updatedRooms[activeSelectedRoomIndex],
      package: package_type,
      package_Price: packagePrice
    };
    setSelectedRooms(updatedRooms);
    setPackageSelection(true);

    if(activeSelectedRoomIndex === selectedRooms.length - 1)
      {
        // setTotalCostEstimate(0);
        setRoomSelectionComplete(true);
        setIsRoomTrackerBarOpen(true);
      }else {
        setSelectedActiveRoomIndex(activeSelectedRoomIndex + 1);
        window.scrollTo(0, 0);
        setActiveRoomIndex(null);
      }
  }

  const handleProceedingToNextPage = () =>
    {
      const selectedRoomsString = JSON.stringify(selectedRooms);
      const roomTypeStrings = JSON.stringify(roomType);
      const params = new URLSearchParams({
        selectedRooms: selectedRoomsString,
        roomType: roomTypeStrings,
          checkInDate: selectedDates[0].toISOString().split('T')[0],
          checkOutDate: selectedDates[1].toISOString().split('T')[0],
          totalCostEstimate
        });
        router.push(`./CustomerDetails?${params.toString()}`);
  }

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

  const fetchRoomTypes = async (checkInDate, checkOutDate) => {
    try {

      setIsLoading(true);
      const data = await roomService.getAvailableRoomTypes(checkInDate, checkOutDate);
      setRoomType(data);
    } catch (error) {
      console.error('Error fetching room types:', error);
    } finally 
    {
      setIsLoading(false);
    }
  };

  const fetchAvailablePackages = async() => {
    try 
    {
      setIsLoading(true);
      const data = await packageService.getAvailablePackages();
      setAvailablePackages(data);
    }
    catch(error)
    {
      console.error('Error fetching available package plans: ', error);
    }
    finally
    {
      setIsLoading(false);
    }
  };

  const handleChangeSelectedRoom = (roomToChangeIndex) => 
    {
      setRoomSelectionComplete(false);
      setPackageSelection(true);
      setIsRoomTrackerBarOpen(false);
      window.scrollTo(0, 0);
      const changedRooms = selectedRooms.map((room, index) => 
        {
          if (index > roomToChangeIndex)
          {
            return { ...room, roomType: null, package: null, roomPrice: null, package_Price: null};
          }
          return room;
        });
      setSelectedActiveRoomIndex(roomToChangeIndex);
      selectedRooms[roomToChangeIndex].roomType = null;
      selectedRooms[roomToChangeIndex].package = null;
      selectedRooms[roomToChangeIndex].roomPrice = 0.0;
      selectedRooms[roomToChangeIndex].package_Price = 0.0;
      setSelectedRooms(changedRooms);
    }

  const handleEditRoomPackage = (roomToChangeIndex) => 
    {
      setRoomSelectionComplete(false);
      setPackageSelection(false);
      setIsRoomTrackerBarOpen(false);
      window.scrollTo(0, 0);
      const changedRooms = selectedRooms.map((room, index) => 
        {
          if (index > roomToChangeIndex)
          {
            return { ...room, roomType: null, package: null, roomPrice: null, package_Price: null};
          }
          return room;
        });
      setSelectedActiveRoomIndex(roomToChangeIndex);
      selectedRooms[roomToChangeIndex].package = null;
      // selectedRooms[roomToChangeIndex].package_Price = 0;
      setSelectedRooms(changedRooms);
    }

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
      fetchRoomTypes(checkIn, checkOut);
    } else {
      alert('Please select a check-in/check-out date and room size!');
    }
  };

  const getRoomTypeName = (roomTypeID) => {
    const roomTypes = roomType.find((type) => type.roomTypeID === roomTypeID)

    if (roomType){
      return locale === "ar" ? roomTypes.typeName_ar : roomTypes.typeName_en;
    }

    return "Unknown Room Type"
  }

  const getPackageNameByID = (package_ID) => {
    const pkgID = AvailablePackages.find((type) => type.package_ID === package_ID);

    if (AvailablePackages){
      return locale === "ar" ? pkgID.package_Type_ar : pkgID.package_Type_en;
    }

    return "Package not found";
  }

  //This is to traverse between different states in the mobile version of the booking bar
  const handleContinue = () => {
        setCurrentStep('roomSelection'); // Move to room selection on continue
    };

  const handleBack = () => {
          setCurrentStep('dateSelection'); // Go back to date selection
      };

  //This only caluculates the duration of the stay
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

  const toggleBookingSection = () => {
    setIsDialogOpen(false);
    setIsBookingVisible(!isBookingVisible);
  };

  const toggleOptions = (index, room) => {
    setActiveRoomIndex(activeRoomIndex === index ? null : index, room);
  };


  return (
    <div className={RoomSearchModule.main}>
      
      
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

          {isMobile &&(
            <div className={RoomSearchModule.titeInNavBar}>CHOOSE YOUR ROOM</div>
          )}

          <div
          ref={containerRef}
          className={`${navLogoTitleClass} ${isMenuOpen ? homeStyle.active : ''}`}>

            
            <div className={closeIconClass} onClick={toggleMenu}>
                <div className={homeStyle.line1}></div>
                <div className={homeStyle.line2}></div>
            </div>

            <img src="../../logo.png" alt="Al-Batra Hotel Logo" className={logoClass} />
            {/* Hamburger Icon */}

            <div className={titleNavClass}>
              <h1 className={titleClass}>{t('HomePage.title')}</h1>

              {/* Navigation Links */}
              <nav className={`${navClass}`}>
                <img src="../../logo.jpg" className={homeStyle.logoMobileNav} alt="Al-Batra Hotel Logo"/>
                <div className={titleMobileClass}>{t('HomePage.title')}</div>
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
          </div>

      </header>

      {/* page content */}
      <div className={RoomSearchModule.main}>

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
                        <button onClick={handleUpdateSearch} className={homeStyle.BookingButton}>{t("NavigationBar.updateSearch")}</button>
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
                      <button onClick={handleUpdateSearch} className={homeStyle.searchButton}>{t("NavigationBar.updateSearch")}</button>
                  </div>
              )}
      </div>

      {/* Dialog for alerting user that they're about to reset their room selection */}
      {isDialogOpen && (
        <div className={RoomSearchModule.nonFocusShader }>
          <div ref={dialogRef} className={RoomSearchModule.dialog }>
            <div onClick={CloseDialog} className={RoomSearchModule.closeSelectedRoomBar}>X</div>
            <img className={RoomSearchModule.alertIcon} src="../alertIcon.png" />
            <div className={RoomSearchModule.dialogText }>
              To modify your room selection, your choices will be reset, and you will return to choosing your Room 1.
            </div>
            <div className={RoomSearchModule.dialogButtonContainer}>
              <button className={RoomSearchModule.dialogButton} onClick={(e) => {
                  toggleBookingSection();
                  e.preventDefault();
                }}>SELECT NEW ROOM</button>
              <button onClick={CloseDialog} className={RoomSearchModule.dialogButton}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* This is a shadow effect that only appears beneath the navbar when it is open. */}
      {isMenuOpen && (
        <div className={RoomSearchModule.nonFocusShader }></div>
      )}

      {/* This is the room selection bar for mobile users that allows them to know what they've selected */}
      {isMobile &&(
        <div className={RoomSearchModule.selectedRoomBar}>
          <div>
            <div>ROOM {activeSelectedRoomIndex+1}</div>
            <div>CHOOSE YOUR ROOM TYPE</div>
            <div>CHOOSE YOUR PACKAGE</div>
          </div>
          <button onClick={openDialog} className={RoomSearchModule.editButton}>
            EDIT
          </button>
        </div>
      )}

      {/* Selected Room */}
      <div className={`${RoomSearchModule.Container3} ${isRoomTrackerBarOpen ? RoomSearchModule.active : ''}`}>


        {!isLoading && selectedRooms.length > 0 && (
          <div>
              <hr className={RoomSearchModule.line} />
              {/* Mobile version */}
              {isMobile && (
                <div>
                  {/* <div onClick={toggleRoomTrackerBar} className={RoomSearchModule.closeSelectedRoomBar}>X</div> */}
                  {isRoomTrackerBarOpen && (
                    <div className={RoomsRequestedClass}>
                    <div className={RoomSearchModule.reservataionSummaryContainer}>
                      <div>
                        {selectedRooms.length} ROOM{selectedRooms.length > 1 ? 'S' : ''} - {totalAdults} ADULT{totalAdults !== 1 ? 'S' : ''}, {totalChildren} CHILD{totalChildren > 1 ? 'REN' : ''}
                      </div>
                      <div>
                        {selectedDates[0].toISOString().split('T')[0]} - {selectedDates[1].toISOString().split('T')[0]}
                      </div>
                    </div>
                    {
                      selectedRooms.map((rooms, index) => {
                        return (
                          
                          <div 
                          key={rooms.id || index}
                          className={index === activeSelectedRoomIndex ? selectedRoomContainerClass : unSelectedRoomContainerClass}>
                              
                              <div className={RoomsRequestedBoldFontClass}>
                              {t("RoomSelection.Room")} {index + 1} | {rooms.adults == 1 && `${rooms.adults} ${t("RoomSelection.Adult")}`} 
                              {rooms.adults > 1 && `${rooms.adults} ${t("RoomSelection.Adults")}`}
                              {rooms.children == 1 && ` | ${rooms.children} ${t("RoomSelection.Child")}`} 
                              {rooms.children > 1 && ` | ${rooms.children} ${t("RoomSelection.Children")}`}
                              <br/>
                              {rooms.roomType == null && index == activeSelectedRoomIndex && `${t("RoomSelection.ChooseRoom")}`}

                            <div className={RoomsRequestedNonBoldFontClass}>
                              {rooms.roomType == null && index != activeSelectedRoomIndex && `${t("RoomSelection.ChooseRoom")}`}
                              {rooms.roomType != null && (
                                <div>
                                {getRoomTypeName(rooms.roomType, locale)}<span> | </span>
                                <a className={RoomSearchModule.underlinedClick} onClick={() => handleChangeSelectedRoom(index)}>{t("RoomSelection.Edit")}</a>
                                </div>
                              )}
                              </div>
                            </div>

                              <div className={RoomsRequestedBoldFontClass}>
                                {rooms.package == null && !PackageSelection && index === activeSelectedRoomIndex && (<div>{t("RoomSelection.ChoosePackage")}</div>)}
                              </div>

                              
                              <div className={RoomsRequestedNonBoldFontClass}>
                                {rooms.package == null && PackageSelection && (<div>{t("RoomSelection.ChoosePackage")}</div>)}
                                {rooms.package == null && index != activeSelectedRoomIndex && !PackageSelection && (<div>{t("RoomSelection.ChoosePackage")}</div>)}
                                {rooms.package != null &&  (
                                  <div>{getPackageNameByID(rooms.package, locale)}<span> | </span>
                                  <a className={RoomSearchModule.underlinedClick} onClick={() => handleEditRoomPackage(index)}>{t("RoomSelection.Edit")}</a>
                                
                                </div>
                              )} 
                              <br/>
                              </div>
                          </div>
                        )
                        })
                    }

                    </div>
                  )}
                </div>
              )}

              {/* Desktop version */}
              {!isMobile && (
                <div className={RoomsRequestedClass}>
                {
                  selectedRooms.map((rooms, index) => {
                    return (
                      
                      <div 
                      key={rooms.id || index}
                      className={index === activeSelectedRoomIndex ? selectedRoomContainerClass : unSelectedRoomContainerClass}>

                          
                          <div className={RoomsRequestedBoldFontClass}>
                          {t("RoomSelection.Room")} {index + 1} | {rooms.adults == 1 && `${rooms.adults} ${t("RoomSelection.Adult")}`} 
                          {rooms.adults > 1 && `${rooms.adults} ${t("RoomSelection.Adults")}`}
                          {rooms.children == 1 && ` | ${rooms.children} ${t("RoomSelection.Child")}`} 
                          {rooms.children > 1 && ` | ${rooms.children} ${t("RoomSelection.Children")}`}
                          <br/>
                          {rooms.roomType == null && index == activeSelectedRoomIndex && `${t("RoomSelection.ChooseRoom")}`}


                        <div className={RoomsRequestedNonBoldFontClass}>
                          {rooms.roomType == null && index != activeSelectedRoomIndex && `${t("RoomSelection.ChooseRoom")}`}
                          {rooms.roomType != null && (
                            <div>
                            {getRoomTypeName(rooms.roomType, locale)}<span> | </span>
                            <a className={RoomSearchModule.underlinedClick} onClick={() => handleChangeSelectedRoom(index)}>{t("RoomSelection.Edit")}</a>
                            </div>
                          )}
                          </div>
                        </div>



                          <div className={RoomsRequestedBoldFontClass}>
                            {rooms.package == null && !PackageSelection && index === activeSelectedRoomIndex && (<div>{t("RoomSelection.ChoosePackage")}</div>)}
                          </div>

                          
                          <div className={RoomsRequestedNonBoldFontClass}>
                            {rooms.package == null && PackageSelection && (<div>{t("RoomSelection.ChoosePackage")}</div>)}
                            {rooms.package == null && index != activeSelectedRoomIndex && !PackageSelection && (<div>{t("RoomSelection.ChoosePackage")}</div>)}
                            {rooms.package != null &&  (
                              <div>{getPackageNameByID(rooms.package, locale)}<span> | </span>
                              <a className={RoomSearchModule.underlinedClick} onClick={() => handleEditRoomPackage(index)}>{t("RoomSelection.Edit")}</a>
                            
                            </div>
                          )} 
                          <br/>
                          </div>
                      </div>
                    )
                    })
                }

                </div>
              )}

              <hr className={RoomSearchModule.line2} />
          </div>

        )}
      </div>

      {/* Rooms Section */}
      {!isLoading && roomType.length > 0 && (
        <div className={RoomSearchModule.Container1}>
          <div className={Container2Class}>{t("RoomSearch.OurAccommodations")}</div>
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
        <div className={RoomSearchModule.RoomsLists}>
        {/* ^ Room List ^ */}

          {roomType.length > 0 ? (
            roomType.map((room, index) => (
              <div key={index}>

                {PackageSelection == true && room.maxCapacity >= selectedRooms[activeSelectedRoomIndex].adults + selectedRooms[activeSelectedRoomIndex].children && (
                  <div className={RoomSearchModule.RoomContainer}>
                    <div className={RoomSearchModule.roomImageContainer}>
                      <img
                        src={`../Gallery/room${index+1}.jpg`}
                        alt={room.typeName}
                        className={RoomSearchModule.roomImage}
                      />
                    </div>
                    <div className={RoomSearchModule.RoomCardContainerRightside}>
                      <div className={RoomSearchModule.RoomTitleAndDesc}>

                        {room[`typeName_${locale}`]}
                        <div className={RoomSearchModule.RoomDescription}>
                          {room[`description_${locale}`]}
                          <div className={RoomSearchModule.viewMoreDetails} onClick={()=> {toggleOptions(index, room)}}>
                            View More details
                          </div>
                        </div>

                      </div>
                      <div className={RoomSearchModule.reserveButtonContainer}>
                        {isRoomSelectionComplete != true && (
                        <div>
                          <div className={RoomSearchModule.optionPricingDesc}>
                            <div>from</div>
                            <div className={RoomSearchModule.optionPricing}> ${room.minRate}</div>
                            <div> a night</div>
                          </div>
                          <button
                            className={RoomSearchModule.reserveButton}
                            onClick={() => handleSelectRoomType(activeSelectedRoomIndex, room.roomTypeID, room.minRate)}
                            // [`typeName_${locale}`]
                          >
                            {t("RoomSelection.SELECTROOM")}
                          </button>
                        </div>
                        )}
                      </div>

                    </div>
                  </div>
                )
                }


                {activeRoomIndex === index && (
                  <div
                    className={`${RoomSearchModule.optionsContainer} ${
                      activeRoomIndex === index ? RoomSearchModule.visible : ''
                    }`}
                  >
                    <div className={RoomSearchModule.option}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className={RoomSearchModule.optionTitle}>
                          <div className={RoomSearchModule.LeftSide}>
                            <div className={RoomSearchModule.OptionElement}>
                              <img className={RoomSearchModule.OptionIcon} src="../bed_icon.png" />
                                {room.bedConfiguration_en}
                            </div>
                            <div className={RoomSearchModule.OptionElement}>
                              <img className={RoomSearchModule.OptionIcon} src="../occupants.png" />
                              {room.occupancy_en}
                            </div>
                            <div className={RoomSearchModule.OptionElement}>
                              <img className={RoomSearchModule.OptionIcon} src="../wifi_icon.png" />
                              High internet speed wifi
                            </div>
                          </div>
                          <div className={RoomSearchModule.RightSide}>

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
            <div className={RoomSearchModule.noAvailability}>No rooms available for the selected dates.</div>
          )}
        </div>
        )}
        {AvailablePackages.map((pkg, index) => (
          <div key={index}>
            {PackageSelection == false && (
              <div className={RoomSearchModule.RoomsLists}>
                <div className={RoomSearchModule.PkgContainer}>
                    <div className={RoomSearchModule.roomImageContainer}>
                      <img
                              src={`../room3.jpg`}
                              className={RoomSearchModule.roomImage}
                            />
                    </div>
                    <div className={RoomSearchModule.RoomCardContainerRightside}>

                      
                        <div className={RoomSearchModule.RoomTitleAndDesc}>
                          <div className={RoomSearchModule.packageTitle}>
                            <div>
                              {pkg[`package_Type_${locale}`]}
                            </div>
                            <div className={RoomSearchModule.PackageDescriptionEN}>
                              <div>
                                {pkg.package_desc_EN}
                              </div>
                            </div>
                          </div>
                        </div>
                      

                      <div className={RoomSearchModule.RoomCardContainerRightsideRightHalf}>
                        <div className={RoomSearchModule.PackageCost}>
                          <div className={RoomSearchModule.packageCostlabel}>Plan cost</div>  ${(pkg.package_Price + selectedRooms[activeSelectedRoomIndex].roomPrice).toFixed(2)}
                        </div>
                        <div className={RoomSearchModule.selectPackageButtonContainer}>
                        <button 
                        className={RoomSearchModule.reserveButton}
                        onClick={()=> handleSelectpackage(pkg.package_ID, pkg.package_Price)}
                        >
                          {t("RoomSelection.SELECTPACKAGE")}
                        </button>
                        </div>
                      </div>



                    </div>
                  </div>
                </div>
              )}
          </div>
        ))}
        {/* Proceed to the next page box */}
        <div className={`${RoomSearchModule.proceedBox} ${isRoomSelectionComplete ? RoomSearchModule.visible : RoomSearchModule.hidden}`}>
          <div className={RoomSearchModule.proceedInfoContainer}>
              <div className={RoomSearchModule.proceedBoxDescCost}>
                <div className={RoomSearchModule.proceedBoxDesc}>
                  Estimate cost
                </div>
                ${totalCostEstimate.toFixed(2)}
              </div>
              <div className={RoomSearchModule.proceedBoxButtonContainer}>
                <button className={RoomSearchModule.proceedBoxButton} onClick={()=>((handleProceedingToNextPage()))}>
                    Continue
                </button>
              </div>
          </div>

        </div>
      </div>

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

export default RoomSearch;