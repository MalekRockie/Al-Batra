import React, { useState, useRef, useEffect } from 'react';
import styles from '../../../scss/RoomTypeSelection.module.scss';
import {useLocale, useTranslations} from 'next-intl';

const RoomTypeSelection = ({ selectedRooms, setSelectedRooms }) => {
  const rooms = selectedRooms || [];
// const [selectedRoomType, setSelectedRoomType] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const isMobileRef = useRef(isMobile);


  const popupRef = useRef(null);
  const inputBoxRef = useRef(null);
  const locale = useLocale();
  const t = useTranslations();




  const guestsContainerClass = locale === "ar" ? styles['guestsContainer-ar'] : styles.guestsContainer;
  const roomSelectedLabelClass = locale === "ar" ? styles['roomSelectedLabel-ar'] : styles.roomSelectedLabel;
  const removeRoomButtonClass = locale === "ar" ? styles['removeRoomButton-ar'] : styles.removeRoomButton;

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setIsMobile(isMobile);
      if(isMobile)
      {
      setIsOpen(isMobileRef.current);
      }
    };
  
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleRoomUpdate = (newRooms) => {
    setSelectedRooms(newRooms);
    if (onRoomTypeChange)
      {
        onRoomTypeChange(newRooms);
      }
  };

  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]); // Add isMobile as a dependency

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        inputBoxRef.current &&
        !inputBoxRef.current.contains(event.target) &&
        !isMobileRef.current 
      ) {
        setIsOpen(false);
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);




    
    
    const addRoom = () => {
      const newRooms = [...rooms, { adults: 1, children: 0, roomType: null, package: null, roomPrice: 0, package_Price: 0 }];
      setSelectedRooms(newRooms);
    };
    
    const removeRoom = (index) => {
      if (rooms.length > 1) {
        const updatedRooms = rooms.filter((_, roomIndex) => roomIndex !== index);
        setSelectedRooms(updatedRooms);
        // onRoomTypeChange(updatedRooms);
      }
    };

    const handleAdultChange = (index, value) => {
        const newRooms = [...rooms];
        newRooms[index].adults = Math.max(1, Math.min(value, 3 - newRooms[index].children));
        setSelectedRooms(newRooms);
    };

    const handleChildChange = (index, value) => {
        const newRooms = [...rooms];
        newRooms[index].children = Math.max(0, Math.min(value, 3 - newRooms[index].adults));
        setSelectedRooms(newRooms);
    };

    const toggleRoomSelectionMenu = () => 
      {
        if(!isMobile)
         { setIsOpen(!isOpen);}
      }
  

  return (
    <div className={styles.roomTypeSelection}>
      <div ref={inputBoxRef} className={styles.roomTypeInput} onClick={toggleRoomSelectionMenu}>

      {`${selectedRooms?.length || 0} ${selectedRooms?.length > 1 ? t("RoomSelection.Rooms") : t("RoomSelection.Room")}`}
      </div>
      {isOpen && (
        <div ref={popupRef} className={styles.roomTypePopup}>
          {rooms.map((room, index) => (
            <div key={index} className={styles.roomContainer}>
              {rooms.length > 1 && (
                <button
                  className={removeRoomButtonClass}
                  onClick={() => removeRoom(index)}
                >
                  &times;
                </button>
              )}
              <div className={roomSelectedLabelClass}>{t('RoomSelection.Room')} {index + 1}</div>
              <div className={guestsContainerClass}>
                <div>
                  <span>{t("RoomSelection.Adults")} (18+):</span>
                  <button
                    className={styles.adjustButton}
                    onClick={() => handleAdultChange(index, room.adults - 1)}
                    disabled={room.adults <= 1}
                  >
                    -
                  </button>
                  <span>{room.adults}</span>
                  <button
                    className={styles.adjustButton}
                    onClick={() => handleAdultChange(index, room.adults + 1)}
                    disabled={room.adults + room.children >= 3}
                  >
                    +
                  </button>
                </div>
                <div>
                  <span>{t("RoomSelection.Children")}:</span>
                  <button
                    className={styles.adjustButton}
                    onClick={() => handleChildChange(index, room.children - 1)}
                    disabled={room.children <= 0}
                  >
                    -
                  </button>
                  <span>{room.children}</span>
                  <button
                    className={styles.adjustButton}
                    onClick={() => handleChildChange(index, room.children + 1)}
                    disabled={room.adults + room.children >= 3}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
          {rooms.length < 4 && (
            <button className={styles.Button} onClick={addRoom}>
              {t("RoomSelection.AddRoom")}
            </button>
          )}

            {/* <button className={styles.Button} onClick={() => setIsOpen(false)}>
                {t("RoomSelection.Update")}
            </button> */}
        </div>
      )}
    </div>
  );
};

export default RoomTypeSelection;
