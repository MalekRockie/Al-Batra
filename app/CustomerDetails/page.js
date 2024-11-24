"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CustomDateRangePicker from '../CustomDateRangePicker';
import { Box } from '@mui/material';
import Link from 'next/link';
import CustomerDetailsModule from '../../scss/CustomerDetails.module.scss';
import RoomSearchModule from '../../scss/RoomSearch.module.scss';
import countriesData from '../../public/countries_codes.JSON';
import PhoneInput from "react-phone-input-2";
import Select from 'react-select';
import 'react-phone-input-2/lib/style.css'


const LoadingSpinner = () => (
  <div className={RoomSearchModule.spinnerContainer}>
    <div className={RoomSearchModule.spinner}></div> {/* Add spinner CSS */}
    <p>Loading room types...</p>
  </div>
);

const CustomerDetails = () => {
  const router = useRouter();
  const [selectedRooms, setSelectedRooms] = useState([[]]);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [isBookingVisible, setIsBookingVisible] = useState(true);
  const [isScrolledToMax, setIsScrolledToMax] = useState(false);
  const [phone, setPhone] = useState('');
  const [reservationID, setReservationID] = useState('');
  const [isReservationSuccessful, setIsReservationSuccessful] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedDialCode, setSelectedDialCode] = useState('');
  const [totalCostEstimate, setTotalCostEstimate]= useState(0.00);



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
  reservations: [
    {
      reservation: {
        checkInDate: "2025-10-10",
        checkOutDate: "2025-11-11",
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
    const selectedRoomsParams = searchParams.get('selectedRooms');
    const checkInDateParam = searchParams.get('checkInDate');
    const checkOutDateParam = searchParams.get('checkOutDate');
    const totalCost = searchParams.get('totalCostEstimate');

    setSelectedRooms(selectedRoomsParams || '');
    setCheckInDate(checkInDateParam || '');
    setCheckOutDate(checkOutDateParam || '');

    if (selectedRoomsParams) {
      try {
        setSelectedRooms(JSON.parse(selectedRoomsParams)); // Parse the JSON string back to array
      } catch (e) {
        console.error('Error parsing selectedRooms:', e);
        setSelectedRooms([]); // Default to an empty array if parsing fails
      }
    }

    // Set the other state values directly
    setCheckInDate(checkInDateParam || '');
    setCheckOutDate(checkOutDateParam || '');
    setTotalCostEstimate(totalCost || '');
  }, []);

useEffect(() => {
    console.log('Selected Rooms:', selectedRooms); // Logs array of selected rooms
    console.log('Check-In Date:', checkInDate);
    console.log('Check-Out Date:', checkOutDate);
    console.log('Total Cost Estimate:', totalCostEstimate);
  }, [selectedRooms, checkInDate, checkOutDate, totalCostEstimate]);

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

useEffect(() =>
{
console.log("Countries 1:", allowedCountries[1]);
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


      if (data && data.referenceCode)
        {
          setReservationID(data.referenceCode);
          setIsReservationSuccessful(true);
          console.log('Customer info:', formData);
          console.log('reference code: ', data.referenceCode);
        }
        else
        {
          console.error("No reference code found in the response", data);
        }

    } catch (error) {
      console.error("Error creating customer:", error);
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
                <img src={`room1.jpg`} className={CustomerDetailsModule.img}/> <br/> <br/> 
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

                {/* Header */}
        <header
          className={CustomerDetailsModule.bookingBar}
        >
          <div className={CustomerDetailsModule.logoTitleNav}>
            <a href="/">
              <img src="logo.png" alt="Al-Batra Hotel Logo" className={CustomerDetailsModule.logo} />
            </a>
            <div className={RoomSearchModule.titleNav}>
              <nav className={RoomSearchModule.nav}>
              </nav>
            </div>
          </div>
        </header>

      <div className={CustomerDetailsModule.divider}>

        {/* Left Side */}
        <div className={CustomerDetailsModule.left}>
          <div className={CustomerDetailsModule.title}>
            YOUR RESERVATION
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
                  <div>
                    <div className={CustomerDetailsModule.desc2}>
                      {rooms.roomType}<br/> Average rate per night:
                    </div>
                    <div className={CustomerDetailsModule.priceText}>
                      ${Number(rooms.roomPrice).toFixed(2)}
                    </div>                    
                    {rooms.package_Price != 0 && 
                    ( <div>
                        <div className={CustomerDetailsModule.desc2}>
                          Package:
                        </div>
                        <div className={CustomerDetailsModule.priceText}>
                          ${Number(rooms.package_Price).toFixed(2)}
                        </div>
                      </div>
                    )
                    }
                  </div>
                    )})}

          </div>
          <div className={CustomerDetailsModule.leftContainer2}>
            <div className={CustomerDetailsModule.desc2}>
              Estimated Total:
            </div>
            <div className={CustomerDetailsModule.priceText}>
              ${Number(totalCostEstimate)?.toFixed(2)}
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
                    autoComplete='first_name'
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
                    onlyCountries={allowedCountriesNumbers}
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
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className={`${CustomerDetailsModule.inputBox} ${formErrors.nationality ? CustomerDetailsModule.inputError : ''}`}
                  required
                >
                  <option value="">Select Nationality</option>  {/* Default option */}
                  {allowedCountries.map((country) => (
                    <option key={country.code} value={country.name}>
                      <img src={country.image}/> {country.name}
                    </option>
                  ))}
                </select>

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
                  autoComplete='numberOnCard'
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
