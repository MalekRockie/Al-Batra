"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomDateRangePicker from '../CustomDateRangePicker';
import RoomTypeSelection from '../RoomTypeSelection';
import { Box } from '@mui/material';
import Link from 'next/link';
import CustomerDetailsModule from '../../scss/CustomerDetails.module.scss';
import styles from '../../scss/Home.module.scss';

const CustomerDetails = () => {
  const router = useRouter();
  const [roomType, setRoomType] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [isBookingVisible, setIsBookingVisible] = useState(true);
  const [isScrolledToMax, setIsScrolledToMax] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email_address: '',
    confirmEmailAddress: '',
    phone_number: '',
    date_of_Birth: "1978-10-08",
    nationality: '',
    checkInDate: '',
    checkOutDate: '',
    roomType: '',
    // expiryYear: ''
  });

  const [formErrors, setFormErrors] = useState({
    first_name: false,
    last_name: false,
    phone_number: false,
    email_address: false,
    confirmEmailAddress: false,
    nationality: false
  });

  // Use URLSearchParams to extract the query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const roomTypeParam = searchParams.get('roomType');
    const checkInDateParam = searchParams.get('checkInDate');
    const checkOutDateParam = searchParams.get('checkOutDate');

    setRoomType(roomTypeParam || '');
    setCheckInDate(checkInDateParam || '');
    setCheckOutDate(checkOutDateParam || '');
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleBookingSection = () => {
    setIsBookingVisible(!isBookingVisible);
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  let errors = {};

  if (!formData.first_name) errors.first_name = true;
  if (!formData.last_name) errors.last_name = true;
  if (!formData.phone_number) errors.phone_number = true;
  if (!formData.email_address) errors.email_address = true;
  if (!formData.confirmEmailAddress || formData.confirmEmailAddress !== formData.email_address) {
    errors.confirmEmailAddress = true;
  }
  if (!formData.nationality) errors.nationality = true;

  setFormErrors(errors);

  // // Stop submission if there are errors
  // if (Object.keys(errors).length > 0) {
  //   alert("Please fill in all required fields correctly.");
  //   return;
  // }

  
  console.log('Customer info:', formData);

  try {
    const response = await fetch("http://localhost:8080/api/customers/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData) // Using formData directly
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if the response has content before parsing as JSON
    const responseText = await response.text();
    if (responseText) {
      const data = JSON.parse(responseText);
      console.log("Customer created successfully:", data); // Handle the response
    } else {
      console.log("Customer created successfully, but no response data.");
    }
    
  } catch (error) {
    console.error("Error creating customer:", error);
  }
};



  return (

    <div className={CustomerDetailsModule.main}>
      {/* Header */}
      {/* <header
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
      </header> */}

      {/* Booking Section */}
      <div className={CustomerDetailsModule.bookingBar}>
          <Box className={CustomerDetailsModule.bookingContainer}>

              <img src="logo.png" alt="Al-Batra Hotel Logo" className={CustomerDetailsModule.logo} />
          </Box>
      </div>

      <div className={CustomerDetailsModule.divider}>

        {/* Left Side */}
        <div className={CustomerDetailsModule.left}>
          <div className={CustomerDetailsModule.title}>
            YOUR RESERVATION
          </div>
          <div className={CustomerDetailsModule.desc1}>
            2 Adults - 1 Child
          <br/>
            {checkInDate} - {checkOutDate}
          </div>
        <div className={CustomerDetailsModule.horizantalLine}/>
          <div className={CustomerDetailsModule.leftContainer1}>
            <div className={CustomerDetailsModule.desc2}>
              {roomType} <br/> Average rate per night:
            </div>
            <div className={CustomerDetailsModule.priceText}>
              $150.00
            </div>
            <div className={CustomerDetailsModule.desc2}>
              Lauch and Dinner:
            </div>
            <div className={CustomerDetailsModule.priceText}>
              $50.00
            </div>
          </div>
          <div className={CustomerDetailsModule.leftContainer2}>
            <div className={CustomerDetailsModule.desc2}>
              Estimated Total:
            </div>
            <div className={CustomerDetailsModule.priceText}>
              $200.00
            </div>
          </div>
        </div>  

        {/* Right Side */}
        <div className={CustomerDetailsModule.right}>

          <div className={CustomerDetailsModule.title}>
            BOOKING INFORMATION
          </div>

          <div className={CustomerDetailsModule.CustomerContainer1}>
            <div className={CustomerDetailsModule.CustomerContainerLabel}>
              YOUR INFORMATION
            </div>

            <div className={CustomerDetailsModule.InfoInputContainer}>

              {/* Left side of the box */}
              <div className={CustomerDetailsModule.InputContainer}>
                  <div className={CustomerDetailsModule.InputLabel}>
                    <div className={CustomerDetailsModule.LabelText}>
                      First Name*
                    </div>
                  </div>
                  <div className={CustomerDetailsModule.InputLabel}>
                    <div className={CustomerDetailsModule.LabelText}>
                      Last Name*
                    </div>
                  </div>
                  <div className={CustomerDetailsModule.InputLabel}>
                    <div className={CustomerDetailsModule.LabelText}>
                      Mobile Phone Number*
                    </div>
                  </div>
                  <div className={CustomerDetailsModule.InputLabel}>
                    <div className={CustomerDetailsModule.LabelText}>
                      Email Address*
                    </div>
                  </div>
                  <div className={CustomerDetailsModule.InputLabel}>
                    <div className={CustomerDetailsModule.LabelText}>
                      Confirm Email Address*
                    </div>
                  </div>
                  <div className={CustomerDetailsModule.InputLabel}>
                    <div className={CustomerDetailsModule.LabelText}>
                      Country/Region*
                    </div>
                  </div>
              </div>

              {/* input box side aka right side */}
              <div className={CustomerDetailsModule.inputBox}>
                <div className={CustomerDetailsModule.Individual_InputBox}>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={`${CustomerDetailsModule.inputBox} ${formErrors.first_name ? CustomerDetailsModule.inputError : ''}`}
                    required
                  />
                </div>

                <div className={CustomerDetailsModule.Individual_InputBox}>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={`${CustomerDetailsModule.inputBox} ${formErrors.last_name ? CustomerDetailsModule.inputError : ''}`}
                    required
                  />
                </div>

                <div className={CustomerDetailsModule.Individual_InputBox}>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className={`${CustomerDetailsModule.inputBox} ${formErrors.phone_number ? CustomerDetailsModule.inputError : ''}`}
                    required
                  />
                </div>

                <div className={CustomerDetailsModule.Individual_InputBox}>
                  <input
                    type="text"
                    name="email_address"
                    value={formData.email_address}
                    onChange={handleInputChange}
                    className={`${CustomerDetailsModule.inputBox} ${formErrors.email_address ? CustomerDetailsModule.inputError : ''}`}
                    required
                  />
                </div>

                <div className={CustomerDetailsModule.Individual_InputBox}>
                  <input
                    type="text"
                    name="confirmEmailAddress"
                    value={formData.confirmEmailAddress}
                    onChange={handleInputChange}
                    className={`${CustomerDetailsModule.inputBox} ${formErrors.confirmEmailAddress ? CustomerDetailsModule.inputError : ''}`}
                    required
                  />
                </div>

                <div className={CustomerDetailsModule.Individual_InputBox}>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className={`${CustomerDetailsModule.inputBox} ${formErrors.nationality ? CustomerDetailsModule.inputError : ''}`}
                    required
                  />
                </div>
              </div>

                

            </div>

            
          </div>


          <div className={CustomerDetailsModule.CustomerContainer2}>
            <div className={CustomerDetailsModule.CustomerContainerLabel}>
              CARD DETAILS
            </div>

            <div className={CustomerDetailsModule.InfoInputContainer}>

              {/* Left side of the box */}
              <div className={CustomerDetailsModule.InputContainer}>
                  <div className={CustomerDetailsModule.InputLabel}>
                    <div className={CustomerDetailsModule.LabelText}>
                      Name on card*
                    </div>
                  </div>
                  <div className={CustomerDetailsModule.InputLabel}>
                    <div className={CustomerDetailsModule.LabelText}>
                      Card number*
                    </div>
                  </div>
                  <div className={CustomerDetailsModule.InputLabel}>
                    <div className={CustomerDetailsModule.LabelText}>
                      Card expiry date*
                    </div>
                  </div>
              </div>

              {/* input box side aka right side */}
              <div className={CustomerDetailsModule.inputBox}>

                <div className={CustomerDetailsModule.Individual_InputBox}>
                  <input
                  type="text"
                  name="nameOnCard"
                  onChange={handleInputChange}
                  className={CustomerDetailsModule.inputBox}
                  required
                />
                </div>

                <div className={CustomerDetailsModule.Individual_InputBox}>
                  <input
                  type="text"
                  name="cardNumber"
                  onChange={handleInputChange}
                  className={CustomerDetailsModule.inputBox}
                  required
                />
                </div>
                
                <div className={CustomerDetailsModule.Individual_InputBox}>
                  <input
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={CustomerDetailsModule.inputBox}
                  required
                />
                </div>
              </div>
            </div>
          </div>

          <div className={CustomerDetailsModule.CustomerContainer3}>
            <div className={CustomerDetailsModule.LabelText}>
                Accepted cards: 
              </div>
          </div>

            <button className={CustomerDetailsModule.searchButton} onClick={handleSubmit}>
              BOOK
            </button>

        </div>
      </div>
      .
    </div>
  );
};

export default CustomerDetails;
