"use client";

import { useState, useEffect } from 'react';
import CustomDateRangePicker from '../CustomDateRangePicker';
import RoomTypeSelection from '../RoomTypeSelection';
import { Box } from '@mui/material';
import Link from 'next/link';
import styles from '../../scss/Home.module.scss';
import RoomSearchModule from '../../scss/RoomSearch.module.scss';
import { useRouter } from 'next/navigation';
import { FALSE } from 'sass';


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
  const [isLoading, setIsLoading] = useState(false);

  const [PackageSelection, setPackageSelection] = useState(true);

  //handles selecting the room before prompting the used to select the package for each room
const handleSelectRoomType = (roomIndex, roomTypePicked) => {
  setSelectedRooms(prevSelectedRooms => {
    const updatedRooms = [...prevSelectedRooms];
    updatedRooms[roomIndex] = {
      ...updatedRooms[roomIndex],
      roomType: roomTypePicked, // Set the selected package type
    };
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
const handleSelectpackage = (package_type) => 
  {
    selectedRooms[activeSelectedRoomIndex].package = package_type;
    setPackageSelection(true);
    console.log("Package selected: ", package_type);
    console.log("for room: ", activeSelectedRoomIndex);
    
    if(activeSelectedRoomIndex === selectedRooms.length - 1)
      {
        const params = new URLSearchParams({
          selectedRooms,
          checkInDate: selectedDates[0].toISOString().split('T')[0],
          checkOutDate: selectedDates[1].toISOString().split('T')[0],
        });
        router.push(`./CustomerDetails?${params.toString()}`);
      }else {
        setSelectedActiveRoomIndex(activeSelectedRoomIndex + 1);
        window.scrollTo(0, 0);
        setActiveRoomIndex(null);
      }
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
      console.log("Fetched available Package plans: ", data);
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
      setPackageSelection(true);
      const changedRooms = selectedRooms.map((room, index) => 
        {
          if (index > roomToChangeIndex)
          {
            return { ...room, roomType: null, package: null};
          }
          return room;
        });
      setSelectedActiveRoomIndex(roomToChangeIndex);
      selectedRooms[roomToChangeIndex].roomType = null;
      selectedRooms[roomToChangeIndex].package = null;
      setSelectedRooms(changedRooms);
    }

  const handleEditRoomPackage = (roomToChangeIndex) => 
    {
      setPackageSelection(false);
      const changedRooms = selectedRooms.map((room, index) => 
        {
          if (index > roomToChangeIndex)
          {
            return { ...room, roomType: null, package: null};
          }
          return room;
        });
      setSelectedActiveRoomIndex(roomToChangeIndex);
      selectedRooms[roomToChangeIndex].package = null;
      setSelectedRooms(changedRooms);
    }

  const handleUpdateSearch = () => {

    setPackageSelection(true);
    setSelectedActiveRoomIndex(0);
    setSelectedRooms(JSON.parse(JSON.stringify(tempSelectedRooms)));
    tempSelectedRooms.forEach((room, index) => {
    console.log(`Room ${index + 1}:`, room);  // Logs each room in the array
  });

    if (selectedDates[0] && selectedDates[1]) {
      const checkIn = selectedDates[0].toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const checkOut = selectedDates[1].toISOString().split('T')[0]; // Format as YYYY-MM-DD


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

// RoomSearch Component
// useEffect(() => {
//   console.log('Updated Selected Rooms:', selectedRooms);
// }, [selectedRooms]);


  useEffect(() => {
    
    const defaultRoom = { adults: 1, children: 0, roomType: null, package: null};
    const roomPackage = { roomType: '', package: ''};
    // If `selectedRooms` is empty or not yet set, use the default values
    if (selectedRooms.length === 0) {
      // console.log('Default Room:', defaultRoom);
      selectedRooms[0] = defaultRoom
    } 
    // else {
    //   // Otherwise, log the selected rooms and their details
    //   selectedRooms.forEach((room, index) => {
    //     console.log(`Room ${index + 1}:`, room);
    //   });
    // }
    // console.log('Rooms: ', selectedRooms[1]);

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
              <RoomTypeSelection onRoomTypeChange={handleRoomSelectedChange}/>
            </div>
            <button className={styles.searchButton} onClick={handleUpdateSearch}>
              UPDATE SEARCH
            </button>
          </Box>
        </section>
      </div>

      {/* Selected Room */}
      {selectedRooms.length >= 0 && (
          <div className={RoomSearchModule.Container3}>
            <hr className={RoomSearchModule.line} />
            <div className={RoomSearchModule.RoomsRequested}>

            {
              selectedRooms.map((rooms, index) => {
                return (
                  <div className={index == activeSelectedRoomIndex && RoomSearchModule.selectedRoomContainer}>
                    <div className={index != activeSelectedRoomIndex && RoomSearchModule.unSelectedRoomContainer}>

                      
                      <div className={RoomSearchModule.RoomsRequestedBoldFont}>
                      Room {index + 1} | {rooms.adults == 1 && `${rooms.adults} Adult`} 
                      {rooms.adults > 1 && `${rooms.adults} Adults`}
                      {rooms.children == 1 && ` | ${rooms.children} Child`} 
                      {rooms.children > 1 && ` | ${rooms.children} Children`}
                      <br/>
                      {rooms.roomType == null && index == activeSelectedRoomIndex && `CHOOSE ROOM`}


                    <div className={RoomSearchModule.RoomsRequestedNonBoldFont}>
                      {rooms.roomType == null && index != activeSelectedRoomIndex && `CHOOSE ROOM`}
                      {rooms.roomType != null && (
                        <div>
                        {rooms.roomType}<span> | </span>
                        <a className={RoomSearchModule.underlinedClick} onClick={() => handleChangeSelectedRoom(index)}>Edit</a>
                        </div>
                      )}
                      </div>
                    </div>



                      <div className={RoomSearchModule.RoomsRequestedBoldFont}>
                        {rooms.package == null && !PackageSelection && index === activeSelectedRoomIndex && (<div>CHOOSE PACKAGE</div>)}
                      </div>

                      
                      <div className={RoomSearchModule.RoomsRequestedNonBoldFont}>
                        {rooms.package == null && PackageSelection && (<div>CHOOSE PACKAGE</div>)}
                        {rooms.package == null && index != activeSelectedRoomIndex && !PackageSelection && (<div>CHOOSE PACKAGE</div>)}
                        {rooms.package != null &&  (
                          <div>{rooms.package}<span> | </span>
                          <a className={RoomSearchModule.underlinedClick} onClick={() => handleEditRoomPackage(index)}>Edit</a>
                        
                        </div>
                      )} 
                      <br/>
                      </div>

                    </div>
                  </div>
                )
                })
            }

            </div>
            <hr className={RoomSearchModule.line2} />
          </div>
      )}



      {/* Rooms Section */}
      <div className={RoomSearchModule.Container1}>
        <div className={RoomSearchModule.Container2}>OUR ACCOMMODATIONS</div>
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

                {PackageSelection == true && (
                  <div className={RoomSearchModule.RoomContainer}>
                    <div className={RoomSearchModule.roomImageContainer}>
                      <img
                        src={`room1.jpg`}
                        alt={room.typeName}
                        className={RoomSearchModule.roomImage}
                      />
                    </div>
                    <div className={RoomSearchModule.RoomCardContainerRightside}>
                      <div className={RoomSearchModule.RoomTitleAndDesc}>

                        {room.typeName}
                        <div className={RoomSearchModule.RoomDescription}>
                          {room.roomDesc}
                          <div className={RoomSearchModule.viewMoreDetails} onClick={()=> {toggleOptions(index)}}>
                            View More details
                          </div>
                        </div>

                      </div>
                      <div className={RoomSearchModule.reserveButtonContainer}>
                        <button
                          className={RoomSearchModule.reserveButton}
                          onClick={() => handleSelectRoomType(activeSelectedRoomIndex, room.typeName)}
                        >
                          SELECT ROOM
                        </button>
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
                        <div className={RoomSearchModule.optionTitle}>Bed & Breakfast Package</div>
                        <div className={RoomSearchModule.optionPricingDesc}>
                          <div>Avg Price per Night:</div>
                          <div className={RoomSearchModule.optionPricing}> ${room.minRate} per night</div>
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
                              src={`room3.jpg`}
                              className={RoomSearchModule.roomImage}
                            />
                    </div>
                    <div className={RoomSearchModule.RoomCardContainerRightside}>
                      <div className={RoomSearchModule.RoomTitleAndDesc}>
                        <div className={RoomSearchModule.packageTitle}>
                          {pkg.package_Type}
                          <div className={RoomSearchModule.PackageDescriptionEN}>
                            {pkg.package_desc_EN}
                          </div>
                        </div>
                      </div>
                      <div className={RoomSearchModule.reserveButtonContainer}>
                      <button 
                      className={RoomSearchModule.reserveButton}
                      onClick={()=> handleSelectpackage(pkg.package_Type)}
                      >
                        SELECT PACKAGE
                      </button>
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