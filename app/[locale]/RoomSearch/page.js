"use client";

import { useState, useEffect, useRef } from 'react';
import CustomDateRangePicker from '../components/CustomDateRangePicker';
import RoomTypeSelection from '../components/RoomTypeSelection';
import homeStyle from '../../../scss/Home.module.scss';
import { Box } from '@mui/material';
import styles from '../../../scss/Home.module.scss';
import RoomSearchModule from '../../../scss/RoomSearch.module.scss';
import { useRouter } from 'next/navigation';
import {useLocale, useTranslations} from 'next-intl';
import Link from 'next/link';
import CustomerLocaleSwitcher from '../../../components/customerLocaleSwitcher.tsx'



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
  const t = useTranslations();
  const locale = useLocale();

  //Testing Here
  const [tempSelectedRooms, setTempSelectedRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([])

  
  const [isBookingVisible, setIsBookingVisible] = useState(true);
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

  const containerRef = useRef(null);


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


  //handles selecting the room before prompting the used to select the package for each room
  const handleSelectRoomType = (roomIndex, roomTypePicked, room_Price) => {
    setSelectedRooms(prevSelectedRooms => {
      const updatedRooms = [...prevSelectedRooms];
      updatedRooms[roomIndex] = {
        ...updatedRooms[roomIndex],
        roomType: roomTypePicked, // Set the selected package type
        roomPrice: room_Price
      };
      // console.log("Room: ", roomIndex ,"Selected Room: ", selectedRooms[roomIndex]);
      setPackageSelection(false);
      return updatedRooms;
    });

    // If last room is configured, proceed to CustomerDetails
    // if (roomIndex === selectedRooms.length - 1) {
    //   console.log("Room Index: ", roomIndex);
    //   console.log("selectedRooms length: ", selectedRooms.length);
    //   const params = new URLSearchParams({
    //     roomType: selectedRooms[roomIndex].roomType,
    //     checkInDate: selectedDates[0].toISOString().split('T')[0],
    //     checkOutDate: selectedDates[1].toISOString().split('T')[0],
    //   });
    //   router.push(`./CustomerDetails?${params.toString()}`);
    // } else {
    //   // Move to the next room for selection
    //   setSelectedActiveRoomIndex(roomIndex + 1);
    //   //Move to the top of the screen
    //   window.scrollTo(0, 0);
    //   setActiveRoomIndex(null);
    // }
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
    
    updatedRooms.forEach((room, roomIndex) => 
    {
      console.log("Total cost: ", totalCostEstimate);
      console.log("Room: ", roomIndex, "'s price: ", room.roomPrice);
      console.log("Room: ", roomIndex, "'s Package price: ", room.package_Price, "and ", packagePrice);
    });
    if(activeSelectedRoomIndex === selectedRooms.length - 1)
      {
        // setTotalCostEstimate(0);
        setRoomSelectionComplete(true);
      }else {
        setSelectedActiveRoomIndex(activeSelectedRoomIndex + 1);
        window.scrollTo(0, 0);
        setActiveRoomIndex(null);
      }
  }

  const handleProceedingToNextPage = () =>
    {
      console.log(selectedRooms[0]);
      const selectedRoomsString = JSON.stringify(selectedRooms);
      const params = new URLSearchParams({
          selectedRooms: selectedRoomsString,
          checkInDate: selectedDates[0].toISOString().split('T')[0],
          checkOutDate: selectedDates[1].toISOString().split('T')[0],
          totalCostEstimate
        });
        router.push(`./CustomerDetails?${params.toString()}`);
  }

  const handleDateRangeChange = (dates) => {
    setSelectedDates(dates);
    console.log('Selected Dates:', dates);
  };


  //Handles change of selected rooms from the RoomTypeSelection
  const handleRoomSelectedChange = (newRooms) => {
    console.log("Room data received:", newRooms); // Debugging log
    setTempSelectedRooms(newRooms);
  };

    const toggleMenu = () => {
    // setIsMenuOpen(!isMenuOpen);
    setIsMenuOpen((prevState) => !prevState);
  }

  useEffect(() => {
          const handleResize = () => {
              setIsMobile(window.innerWidth <= 768); // Mobile if width <= 768px
          };
          handleResize(); // Initial check
          window.addEventListener('resize', handleResize);
          return () => window.removeEventListener('resize', handleResize);
      }, []);

  // const handleRoomTypeChange = (roomType) => {
  //   setSelectedRooms(roomType);
  //   console.log('Selected Room Type:', newRooms);
  // };

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

  const fetchAvailablePackages = async() => {
    try 
    {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8080/PackagePlan/GetAvailablePackages`
      );
      const data = await response.json();
      // console.log("Fetched available Package plans: ", data);
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

    window.scrollTo(0, 0);
    setRoomSelectionComplete(false);
    setPackageSelection(true);
    setSelectedActiveRoomIndex(0);
    setSelectedRooms(JSON.parse(JSON.stringify(tempSelectedRooms)));
  //   tempSelectedRooms.forEach((room, index) => {
  //   console.log(`Room ${index + 1}:`, room);  // Logs each room in the array
  // });

    if (selectedDates[0] && selectedDates[1]) {
      const checkIn = selectedDates[0].toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const checkOut = selectedDates[1].toISOString().split('T')[0]; // Format as YYYY-MM-DD


      // Fetch room types from the API with selected dates
      fetchRoomTypes(checkIn, checkOut);
    } else {
      alert('Please select a check-in/check-out date and room size!');
    }
  };

  //This is for the mobile phone version
  const handleContinue = () => {
        setCurrentStep('roomSelection'); // Move to room selection on continue
    };
  const handleBack = () => {
          setCurrentStep('dateSelection'); // Go back to date selection
      };


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

  }, []);

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

  }, [selectedRooms, selectedDates]); // Recalculate total cost whenever selectedRooms changes


  useEffect(() => {
  }, [isScrolledToMax, isMouseOver]);



  useEffect(() => {
      //Here we should set the selectedRooms if it was already passed by the used in a previous page that directed them here

      const searchParams = new URLSearchParams(window.location.search);
      const selectedRoomsParams = searchParams.get('rooms');
      const checkInDateParam = searchParams.get('checkIn');
      const checkOutDateParam = searchParams.get('checkOut');

      
      
      const defaultRoom = { adults: 1, children: 0, roomType: null, package: null, roomPrice: 0.0, package_Price: 0.0};
      // console.log("Default: ", defaultRoom);
      
      setSelectedRooms(prevState => {
        // Check if prevState is null or empty
        if (prevState == null || prevState.length === 0) {
          if (selectedRoomsParams) {
            try {
              // Try to parse the selectedRoomsParams if available
              const parsedRooms = JSON.parse(selectedRoomsParams);
              return parsedRooms; // Return the parsed rooms if successful
            } catch (e) {
              // If parsing fails, log the error and use the default room
              console.error('Error parsing selectedRooms:', e);
            }
          }

          // If no valid `selectedRoomsParams`, fallback to the default room
          console.log("Selected rooms are empty or null");
          console.log(selectedRoomsParams); // Log the param
          // console.log("default: ",defaultRoom); // Log the default room

          const updatedRooms = [...prevState];  // Make a copy of the previous state
          updatedRooms[0] = defaultRoom;       // Update the first element with the default room
          return updatedRooms;                 // Return the updated state
        }

        // If `selectedRooms` is not empty, return the current state
        return prevState;
      });

      if (selectedDates[0] && selectedDates[1]) {
        const checkIn = selectedDates[0].toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const checkOut = selectedDates[1].toISOString().split('T')[0]; // Format as YYYY-MM-DD

        // console.log({ checkIn, checkOut });

        // Fetch room types from the API with selected dates
        fetchRoomTypes(checkIn, checkOut);
        fetchAvailablePackages();
      } else {
        alert('Please select a check-in/check-out date and room size!');
      }
    }, [selectedRooms, selectedDates]);

  return (
    <div className={RoomSearchModule.main}>
      {/* Header */}
      {/* <header className={RoomSearchModule.header}>
          <title>{t("HomePage.roomSearchTitle")}</title>
          <meta name="description" content="Experience the finest luxury at our hotel" />
          <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
        <div className={RoomSearchModule.logoTitleNav}>
          <a href={`/${locale}`}>
            <img src='../logo.png' alt="Al-Batra Hotel Logo" className={RoomSearchModule.logo} />
          </a>
          <div className={RoomSearchModule.titleNav}>
            <nav className={RoomSearchModule.nav}>
            </nav>
          </div>
        </div>
      </header> */}
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

      {/* Booking Section */}
      {/* <div
        className={RoomSearchModule.bookingBar}
      >
        <section id="booking" className={RoomSearchModule.bookingSection}>
          <Box className={RoomSearchModule.bookingContainer}>
            <div className={RoomSearchModule.datePickerContainer}>
              <div className={bookingTitleClass}>{t("NavigationBar.Dates")}</div>
              <CustomDateRangePicker
                              selectedDates={selectedDates}
                              setSelectedDates={setSelectedDates}
                            />
            </div>
            <div className={styles.roomTypeContainer}>
              <div className={bookingTitleClass}>{t("NavigationBar.RoomSize")}</div>
              <RoomTypeSelection
                              selectedRooms={selectedRooms}
                              setSelectedRooms={setSelectedRooms}
                            />
            </div>
            <button className={styles.searchButton} onClick={handleUpdateSearch}>
              {t("NavigationBar.updateSearch")}
            </button>
          </Box>
        </section>
      </div> */}




      <div className={`${homeStyle.bookingBar} ${isMobile && currentStep === 'dateSelection' ? homeStyle.dateActive : ''} 
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
                          <button className={homeStyle.BookingButton}>{t("NavigationBar.Search")}</button>
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
                        <button onClick={handleUpdateSearch} className={homeStyle.searchButton}>{t("NavigationBar.Search")}</button>
                    </div>
                )}
      </div>







      {/* Selected Room */}
      {/* <div className={RoomSearchModule.Container3}>
        {!isLoading && selectedRooms.length > 0 && (
          <div>
              <hr className={RoomSearchModule.line} />
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
                          {rooms.roomType}<span> | </span>
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
                            <div>{rooms.package}<span> | </span>
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
              <hr className={RoomSearchModule.line2} />
          </div>

        )}
      </div> */}

      



      {/* Rooms Section */}
      {/* <div className={RoomSearchModule.Container1}>
        <div className={RoomSearchModule.Container2}>OUR ACCOMMODATIONS</div>
      </div> */}

      {/* Room List */}
      {/* Loading spinner */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (

        <div className={RoomSearchModule.RoomsLists}>


          {roomType.length > 0 ? (
            roomType.map((room, index) => (
              <div key={index}>

                {PackageSelection == true && (
                  <div className={RoomSearchModule.RoomContainer}>
                    <div className={RoomSearchModule.roomImageContainer}>
                      <img
                        src={'../room1.jpg'}
                        alt={room.typeName}
                        className={RoomSearchModule.roomImage}
                      />
                    </div>
                    <div className={RoomSearchModule.RoomCardContainerRightside}>
                      <div className={RoomSearchModule.RoomTitleAndDesc}>

                        {room.typeName}
                        <div className={RoomSearchModule.RoomDescription}>
                          {room.roomDesc} starting from ${room.minRate}
                          <div className={RoomSearchModule.viewMoreDetails} onClick={()=> {toggleOptions(index)}}>
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
                              2 Queen beds and 1 Twin bed
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
            <div>No rooms available for the selected dates.</div>
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

                      <div className={RoomSearchModule.RoomCardContainerLeftsideRightHalf}>
                        <div className={RoomSearchModule.RoomTitleAndDesc}>
                          <div className={RoomSearchModule.packageTitle}>
                            <div>
                              {pkg.package_Type}
                            </div>
                            <div className={RoomSearchModule.PackageDescriptionEN}>
                              <div>
                                {pkg.package_desc_EN}
                              </div>
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
                        onClick={()=> handleSelectpackage(pkg.package_Type, pkg.package_Price)}
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
  );
};

export default RoomSearch;