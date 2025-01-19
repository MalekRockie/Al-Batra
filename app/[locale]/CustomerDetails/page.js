"use client";
import { useState, useEffect } from 'react';
import '../../globals.css';  
import { Box } from '@mui/material';
import CustomerDetailsModule from '../../../scss/CustomerDetails.module.scss';
import RoomSearchModule from '../../../scss/RoomSearch.module.scss';
import countriesData from '../../../public/countries_codes.JSON';
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import {useLocale, useTranslations} from 'next-intl';




{/*spinner animation for when data is still loading*/}
const LoadingSpinner = () => (
  <div className={RoomSearchModule.spinnerContainer}>
    <div className={RoomSearchModule.spinner}></div> 
    <p>{t("CustomerPage.LoadingRoomTypes")}</p>
  </div>
);

const CustomerDetails = () => {
  const [selectedRooms, setSelectedRooms] = useState([[]]);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [phone, setPhone] = useState('');
  const [reservationID, setReservationID] = useState('');
  const [isReservationSuccessful, setIsReservationSuccessful] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedDialCode, setSelectedDialCode] = useState('');
  const [totalCostEstimate, setTotalCostEstimate]= useState(0.00);
  const [roomType, setRoomType] = useState([[]]);
  const [roomTypeNames, setRoomTypeNames] = useState([]);

  // const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  // const pathname = usePathname();

  //Styling classes
  const dividerClass = locale === "ar" ? CustomerDetailsModule['divider-ar'] : CustomerDetailsModule.divider;
  const InfoInputContainerClass = locale === "ar" ? CustomerDetailsModule['InfoInputContainer-ar'] : CustomerDetailsModule.InfoInputContainer;
  const rightClass = locale === "ar" ? CustomerDetailsModule['right-ar'] : CustomerDetailsModule.right;
  // const inputBoxClass = locale === "ar" ? CustomerDetailsModule['inputBox-ar'] : CustomerDetailsModule.inputBox;
  const AcceptedCardClass = locale === "ar" ? CustomerDetailsModule['AcceptedCardLabel-ar'] : CustomerDetailsModule.AcceptedCardLabel;
  const LabelTextClass = locale === "ar" ? CustomerDetailsModule['LabelText-ar'] : CustomerDetailsModule.LabelText;
  const desc2Class = locale === "ar" ? CustomerDetailsModule['desc2-ar'] : CustomerDetailsModule.desc2;
  const priceTextClass = locale === "ar" ? CustomerDetailsModule['priceText-ar'] : CustomerDetailsModule.priceText;
  const ReservationSectionBoxtClass = locale === "ar" ? CustomerDetailsModule['ReservationSectionBox-ar'] : CustomerDetailsModule.ReservationSectionBox;
  const ReservationSectionTitletClass = locale === "ar" ? CustomerDetailsModule['ReservationSectionTitle-ar'] : CustomerDetailsModule.ReservationSectionTitle;
//ReservationSectionTitle
  const ReservationSectionTitleClass = locale === "ar" ? CustomerDetailsModule['ReservationSectionTitle-ar'] : CustomerDetailsModule.ReservationSectionTitle;
  const inputBoxClass = locale === "ar" ? CustomerDetailsModule["inputBox-ar"] : CustomerDetailsModule.inputBox;
  const footerNavClass = locale === "ar" ? CustomerDetailsModule["footerNav-ar"] : CustomerDetailsModule.footerNav;
  const footerNavColClass = locale == "ar" ? CustomerDetailsModule["footerNavCol-ar"] : CustomerDetailsModule.footerNavCol;


  const [formData, setFormData] = useState({
  customer: {
    first_name: '',
    last_name: '',
    email_address: '',
    confirmEmailAddress: '',
    phone_number: '6782947183',
    date_of_Birth: "1900-01-01",
    nationality: ''
  },
  reservations: []
  });


  const [formErrors, setFormErrors] = useState({
    first_name: false,
    last_name: false,
    phone_number: false,
    email_address: false,
    confirmEmailAddress: false,
    nationality: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        [name]: value,
      },
    }));
        setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: value.trim() === '' || (name === 'confirmEmailAddress' && value !== formData.customer.email_address),
      }));
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

  // Use URLSearchParams to extract the query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const selectedRoomsParams = searchParams.get('selectedRooms');
    const checkInDateParam = searchParams.get('checkInDate');
    const checkOutDateParam = searchParams.get('checkOutDate');
    const totalCost = searchParams.get('totalCostEstimate');
    const roomTypeParams = searchParams.get('roomType');

    setSelectedRooms(selectedRoomsParams || '');
    setCheckInDate(checkInDateParam || '');
    setCheckOutDate(checkOutDateParam || '');
    setRoomType(roomTypeParams || '');

    if (selectedRoomsParams) {
      try {
        setSelectedRooms(JSON.parse(selectedRoomsParams)); // Parse the JSON string back to array
      } catch (e) {
        // console.error('Error parsing selectedRooms:', e);
        setSelectedRooms([]); // Default to an empty array if parsing fails
      }
    }
    if (roomTypeParams) {
      try {
        setRoomType(JSON.parse(roomTypeParams));
      } catch (e) {
        setRoomType([]); 
      }
    }

    // Set the other state values directly
    setCheckInDate(checkInDateParam || '');
    setCheckOutDate(checkOutDateParam || '');
    setTotalCostEstimate(totalCost || '');
  }, []);

  useEffect(() => {
    console.log('Selected Rooms:', selectedRooms); // Logs array of selected rooms
    console.log('roomType:', roomType);
    // console.log('Check-In Date:', checkInDate);
    // console.log('Check-Out Date:', checkOutDate);
    // console.log('Total Cost Estimate:', totalCostEstimate);

  const reservations = selectedRooms.map((roomData, index) => ({
      reservation: {
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        Package_ID: null,
        status: 'Pending',
        payment_Status: 'Pending',
        special_Requests: ''
      },
      roomTypeID: roomData.roomType, // You can customize this if needed
      selectedRoomData: roomData // Assign room data to each reservation
    }));

    // Update formData with dynamically generated reservations
    setFormData((prevFormData) => ({
      ...prevFormData,
      reservations: reservations
    }));

  }, [selectedRooms, checkInDate, checkOutDate, totalCostEstimate]);

 const getRoomTypeName = async (roomTypeID) => {
    const room = roomType.find(r => r.roomTypeID === roomTypeID);
    return room ? room[`typeName_${locale}`] : 'Unknown Room Type';
  };

    useEffect(() => {
    const fetchRoomTypes = async () => {
      // Create an array of promises to fetch all room types for selected rooms
      const roomNames = await Promise.all(
        selectedRooms.map(room => getRoomTypeName(room.roomType))
      );
      setRoomTypeNames(roomNames);
      console.log('Room Names:', roomTypeNames);
    };

    fetchRoomTypes();
  }, [selectedRooms]);


  useEffect(() =>
  {
  // console.log("Countries 1:", allowedCountries[1]);
  },[]);

{/* Submission starts here */}
  const handleSubmit = async (event) => {
    event.preventDefault();

    let errors = {};

    if (!formData.customer.first_name) errors.first_name = true;
    if (!formData.customer.last_name) errors.last_name = true;
    if (!formData.customer.phone_number) errors.phone_number = true;
    if (!formData.customer.email_address) errors.email_address = true;
    if (!formData.customer.confirmEmailAddress || formData.customer.confirmEmailAddress !== formData.customer.email_address) {
      errors.confirmEmailAddress = true;
    }
    if (!formData.customer.nationality) errors.nationality = true;


    // Stop submission if there are errors
    if (Object.keys(errors).length > 0) {
      console.log('Customer info:', formData);
      alert(t("CustomerPage.IncompleteDataAlert"));
      return;
    }

    
    // Submit form data to API if there are no errors
    try {
      const response = await fetch("http://localhost:8080/reservation/createReservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();


      if (data && data.referenceCode)
        {
          setReservationID(data.referenceCode);
          setIsReservationSuccessful(true);
          // console.log('Customer info:', formData);
          // console.log('reference code: ', data.referenceCode);
        }
        else
        {
          // console.error("No reference code found in the response", data);
        }

    } catch (error) {
      // console.error("Error creating customer:", error);
    }
  };
{/* Submission ends here */}




const allowedCountries = countriesData.countries.map(country => ({
  code: country.code.toLowerCase(),
  name: country.name,  // Assuming the country name is in the 'name' property
  image: country.image  // Assuming the image URL is in the 'image' property
}));

const allowedCountriesNumbers = countriesData.countries.map(country => country.code.toLowerCase());



  return (

    
  <div>
    <div>
      <title>{t("CustomerPage.PaymentPageTitle")}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="description" content="Experience the finest luxury at our hotel" />
      <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Playfair+Display:wght@400;700&display=swap" rel="homeStyleheet" />
    </div>
      {isReservationSuccessful ? (
        <div>
          <Box className={CustomerDetailsModule.bookingContainer}>
              <img src="../logo.png" alt="Al-Batra Hotel Logo" className={CustomerDetailsModule.logo} />
          </Box>
          <div className={CustomerDetailsModule.successMessage}>
            <div className={CustomerDetailsModule.ThankContainer}>
            <p>{t("paymentSuccessfull.thankYou")}</p>
              <div className={CustomerDetailsModule.ThankDetails}>
                  <p>{t("paymentSuccessfull.reservationConfirmed")}<br/>{t("paymentSuccessfull.lookForward")}</p>
                <p>{t("paymentSuccessfull.reservationId")}<br/></p>
                <div className={CustomerDetailsModule.ResID}>{reservationID} </div>
              </div>
            </div>

                <div className={CustomerDetailsModule.ReservationSection}>
                  <div className={ReservationSectionTitleClass}>
                    {t("paymentSuccessfull.reservationDetails")}
                  </div>

                  
                  {/* Reservation card */}
                  {selectedRooms.map((room, index) => {
                    
                    return(
                    <div 
                    key={room.id || index}
                    className={ReservationSectionBoxtClass}>
                      <div>
                        <div>
                          Room: {roomTypeNames[rooms.roomType] || 'Loading...'}
                        </div>
                        <img src={`../room1.jpg`} className={CustomerDetailsModule.img}/> <br/> <br/> 
                      </div>
                        <div>
                          <div className={CustomerDetailsModule.ReservationSectionBoxTitle}>
                            Check In Date:
                          </div>
                          <div>
                            {checkInDate}
                          </div>
                        </div>
                        <div className={CustomerDetailsModule.ReservationSectionBoxTitle}>
                          Check In Date: <br/> {checkOutDate}
                        </div>
                        <div className={CustomerDetailsModule.ReservationSectionBoxTitle}>
                          Nights: <br/> 5
                           {/* {calculateNights(CheckInDate, CheckOutDate)} */}
                          {/* calculateNights(CheckInDate, CheckOutDate) */}
                        </div>
                    </div>
                  )
                  })}

                </div>


          </div>
        </div>
      ) : (
        <div className={CustomerDetailsModule.main}>

          {/* Booking Section */}

          {/* Header */}
          <header
            className={CustomerDetailsModule.bookingBar}
          >
            <div className={CustomerDetailsModule.logoTitleNav}>
              <a href="/">
                <img src="../logo.png" alt="Al-Batra Hotel Logo" className={CustomerDetailsModule.logo} />
              </a>
              <div className={RoomSearchModule.titleNav}>
                <nav className={RoomSearchModule.nav}>
                </nav>
              </div>
            </div>
          </header>

          <div className={dividerClass}>
            {/* Left Side */}
            <div className={CustomerDetailsModule.left}>
              <div className={CustomerDetailsModule.title}>
                {t("CustomerPage.YOUR RESERVATION")}
              </div>
              <div className={CustomerDetailsModule.desc1}>
              {selectedRooms.length} Room - 2 Adults, 1 Child
              <br/>
                {checkInDate} - {checkOutDate}
              <br/>

              </div>
            <div className={CustomerDetailsModule.horizantalLine}/>
              <div className={CustomerDetailsModule.leftContainer1}>

                        {selectedRooms.map((rooms, index) => {
                    return (
                      <div key={rooms.id || index}>
                        <div className={desc2Class}>
                          {roomTypeNames[index] || 'Loading...'}<br/> {t("CustomerPage.AverageRatePerNight")}
                        </div>
                        <div className={priceTextClass}>
                          ${Number(rooms.roomPrice).toFixed(2)}
                        </div>                    
                        {rooms.package_Price != 0 && 
                        ( <div>
                            <div className={desc2Class}>
                              Package:
                            </div>
                            <div className={priceTextClass}>
                              ${Number(rooms.package_Price).toFixed(2)}
                            </div>
                          </div>
                        )
                        }
                      </div>
                        )})}

              </div>
              <div className={CustomerDetailsModule.leftContainer2}>
                <div className={desc2Class}>
                  {t("CustomerPage.Estimated Total")}
                </div>
                <div className={priceTextClass}>
                  ${Number(totalCostEstimate)?.toFixed(2)}
                </div>
              </div>


            </div>  

            {/* Customer input Side */}
            <div className={rightClass}>

              <div className={CustomerDetailsModule.title}>
                {t("CustomerPage.BOOKING INFORMATION")}
              </div>

              <div className={CustomerDetailsModule.CustomerInformation}>
                <input
                  name="first_name"
                  type="first_name"
                  onChange={handleInputChange}
                  value={formData.first_name}
                  className={inputBoxClass}
                  placeholder={t("CustomerPage.First Name")}
                />
                <input
                  name="last_name"
                  type="last_name"
                  onChange={handleInputChange}
                  value={formData.last_name}
                  className={inputBoxClass}
                  placeholder={t("CustomerPage.Last Name")}
                />
                <input
                  name="email_address"
                  type="email"
                  onChange={handleInputChange}
                  value={formData.email_address}
                  className={inputBoxClass}
                  placeholder={t("CustomerPage.Email Address")}
                />
                <input
                  name="confirmEmailAddress"
                  type="email"
                  value={formData.confirmEmailAddress}
                  onChange={handleInputChange}
                  className={inputBoxClass}
                  placeholder={t("CustomerPage.Confirm Email Address")}
                />
                <PhoneInput
                    country="ly" // Set the initial country code
                    value={formData.phone_number}
                    inputStyle={{
                      width: "100%",
                      height: "4rem",
                      backgroundColor: "rgb(241, 241, 255)",
                      borderRadius: "0",
                      border: "0.5px solid #ccc", // Match other inputs
                      paddingTop: "15px",
                      paddingLeft: "45px",
                      fontSize: "13px",
                      color: "#000000",
                      textAlign: "left",
                    }}
                    inputProps={{
                      name: "phone",
                      required: true,
                      autoFocus: true,
                    }}
                    onChange={(phone) => setPhone(phone)} // Handle the change event
                    onlyCountries={allowedCountriesNumbers}
                  />

                  <select
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      className={`${inputBoxClass} ${formErrors.nationality ? CustomerDetailsModule.inputError : ''}`}
                      required
                    >
                      <option value="">{t("CustomerPage.Select Nationality")}</option>
                      {/* Default option */}
                      {allowedCountries.map((country) => (
                        <option key={country.code} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
              </div>

              <div className={CustomerDetailsModule.PaymentInformation}>
                <input
                  type="text"
                  className={inputBoxClass}
                  placeholder={t("PaymentPage.Card Number")}
                />
                <input
                  type="text"
                  className={inputBoxClass}
                  placeholder={t("PaymentPage.Name on Card")}
                />
                <div className={CustomerDetailsModule.expirationContainer}>
                  <select
                    name="expirationMonth"
                    className={inputBoxClass}
                    required
                  >
                    <option value="">{t("PaymentPage.Month")}</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1 < 10 ? `0${i + 1}` : i + 1}
                      </option>
                    ))}
                  </select>
                  <select
                    name="expirationYear"
                    className={inputBoxClass}
                    required
                  >
                    <option value="">{t("PaymentPage.Year")}</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                  <input
                    type="text"
                    className={inputBoxClass}
                    placeholder={t("PaymentPage.CVV")}
                  />
                </div>
              </div>


                <button className={CustomerDetailsModule.searchButton} onClick={handleSubmit}>
                  {t("CustomerPage.BOOK")}
                </button>
            </div>
          </div>


      </div>
    )}

    <footer className={CustomerDetailsModule.footer}>
      <div className={footerNavClass}>
        <div className={footerNavColClass}>
          <a href="#home">{t("footer.Home")}</a>
          <a href="#rooms">{t("footer.Rooms")}</a>
          <a href="#booking">{t("footer.Booking")}</a>
        </div>
        <div className={footerNavColClass}>
          <a href="#contactUs">{t("footer.contactUs")}</a>
          <a href="#about">{t("footer.About")}</a>
        </div>
        <div className={CustomerDetailsModule.footerNavCol}>
          <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
            <img src="TikTokLogo.png" alt="TikTok" className={CustomerDetailsModule.socialIcon}/>
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="FacebookLogo.png" alt="Facebook" className={CustomerDetailsModule.socialIcon}/>
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <img src="X_Logo.png" alt="Twitter" className={CustomerDetailsModule.socialIcon}/>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="InstagramLogo.png" alt="Instagram" className={CustomerDetailsModule.socialIcon}/>
          </a>
        </div>
      </div>
      <p>{t("footer.copyRight")}</p>
    </footer>
  </div>
  );
};

export default CustomerDetails;
