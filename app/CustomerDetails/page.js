"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomDateRangePicker from '../CustomDateRangePicker';
import { Box } from '@mui/material';
import Link from 'next/link';
import CustomerDetailsModule from '../../scss/CustomerDetails.module.scss';
import countriesData from '../../public/countries_codes.JSON';
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'




const CustomerDetails = () => {
  const router = useRouter();
  const [roomType, setRoomType] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [isBookingVisible, setIsBookingVisible] = useState(true);
  const [isScrolledToMax, setIsScrolledToMax] = useState(false);
  const [phone, setPhone] = useState('');
  const [reservationID, setReservationID] = useState('');
  const [isReservationSuccessful, setIsReservationSuccessful] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedDialCode, setSelectedDialCode] = useState('');



  const [formData, setFormData] = useState({
  customer: {
    first_name: '',
    last_name: '',
    email_address: '',
    confirmEmailAddress: '',
    phone_number: '6782947183',
    date_of_Birth: "1978-10-08",
    nationality: ''
  },
  reservations: [
    {
      reservation: {
        checkInDate: '2024-12-23',
        checkOutDate: '2024-12-25',
        status: 'Pending',
        payment_Status: 'Pending',
        special_Requests: ''
      },
      roomTypeID: 'DDR'
    }
  ]
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

    console.log("CheckInDate: ", checkInDateParam);
  }, []);



const toggleBookingSection = () => {
    setIsBookingVisible(!isBookingVisible);
  };

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

    setFormErrors(errors);

    // Stop submission if there are errors
    if (Object.keys(errors).length > 0) {
      alert("Please fill in all required fields correctly.");
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
      if (data && data.reservationID)
        {
          setReservationID(data.reservationID);
          setIsReservationSuccessful(true);
          console.log('Customer info:', formData);
        }

    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };
{/* Submission ends here */}




  const allowedCountries = countriesData.countries.map(country => country.code.toLowerCase());





  return (
  <div className={CustomerDetailsModule.page}>
      {isReservationSuccessful ? (
        <div>
          <Box className={CustomerDetailsModule.bookingContainer}>
              <img src="logo.png" alt="Al-Batra Hotel Logo" className={CustomerDetailsModule.logo} />
          </Box>
        <div className={CustomerDetailsModule.successMessage}>
          <div className={CustomerDetailsModule.ThankContainer}>
          <p>Thank you!</p>
            <div className={CustomerDetailsModule.ThankDetails}>
                <p>Your reservation has been confirmed.<br/> We look forward to your stay! Please check your emails for more details</p>
              <p>Your reservation ID is:<br/></p>
              <div className={CustomerDetailsModule.ResID}>{reservationID} </div>
            </div>
          </div>

          <div className={CustomerDetailsModule.ReservationSection}>
            <div className={CustomerDetailsModule.ReservationSectionTitle}>
              Reservation Details:
            </div>
            <div className={CustomerDetailsModule.ReservationSectionBox}>
              <div>
                <div>
                  Room(s): 
                   
                </div>
                <img src={`room1.jpg`} className={CustomerDetailsModule.img}/>{roomType} <br/> <br/> 
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
                </div>
            </div>
          </div>
        </div>
        </div>
      ) : (
        <div className={CustomerDetailsModule.main}>

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
                    name="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={`${CustomerDetailsModule.inputBox} ${formErrors.first_name ? CustomerDetailsModule.inputError : ''}`}
                  />
                </div>

                <div className={CustomerDetailsModule.Individual_InputBox}>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={`${CustomerDetailsModule.inputBox} ${formErrors.last_name ? CustomerDetailsModule.inputError : ''}`}
                  />
                </div>

                <div className={CustomerDetailsModule.Individual_InputBox}>

                  
                    {/* Dropdown for selecting country code */}
                  <PhoneInput
                    country={'ly'} // Set the initial country code (e.g., 'us' for United States)
                    value={formData.phone_number}
                    inputStyle={{width:"100%", borderRadius:"0", height:"2.44rem", border: "0.5px"}}
                    inputProps={{
                      name: 'phone',
                      required: true,
                      autoFocus: true
                    }}
                    onChange={phone => setPhone(phone)} // Handle the change event
                    onlyCountries={allowedCountries}
                  />


                </div>

                <div className={CustomerDetailsModule.Individual_InputBox}>
                  <input
                    type="email"
                    required  
                    name="email_address"
                    value={formData.email_address}
                    onChange={handleInputChange}
                    className={`${CustomerDetailsModule.inputBox} ${formErrors.email_address ? CustomerDetailsModule.inputError : ''}`}
                  />
                </div>

                <div className={CustomerDetailsModule.Individual_InputBox}>
                  <input
                    type="email"
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
    </div>
    )}
  </div>
  );
};

export default CustomerDetails;
