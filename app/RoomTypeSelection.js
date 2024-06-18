import React, { useState, useRef, useEffect } from 'react';
import styles from '../scss/RoomTypeSelection.module.scss';

const RoomTypeSelection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rooms, setRooms] = useState([{ adults: 1, children: 0 }]);
  const popupRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  const addRoom = () => {
    setRooms([...rooms, { adults: 1, children: 0 }]);
  };

  const removeRoom = (index) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((_, roomIndex) => roomIndex !== index));
    }
  };

  const handleAdultChange = (index, value) => {
    const newRooms = [...rooms];
    newRooms[index].adults = Math.max(1, Math.min(value, 3 - newRooms[index].children));
    setRooms(newRooms);
  };

  const handleChildChange = (index, value) => {
    const newRooms = [...rooms];
    newRooms[index].children = Math.max(0, Math.min(value, 3 - newRooms[index].adults));
    setRooms(newRooms);
  };

  return (
    <div className={styles.roomTypeSelection}>
      <div className={styles.roomTypeInput} onClick={() => setIsOpen(!isOpen)}>
        {`${rooms.length} Room${rooms.length > 1 ? 's' : ''}`}
      </div>
      {isOpen && (
        <div ref={popupRef} className={styles.roomTypePopup}>
          {rooms.map((room, index) => (
            <div key={index} className={styles.roomContainer}>
              {rooms.length > 1 && (
                <button
                  className={styles.removeRoomButton}
                  onClick={() => removeRoom(index)}
                >
                  &times;
                </button>
              )}
              <h4>Room {index + 1}</h4>
              <div className={styles.guestsContainer}>
                <div>
                  <span>ADULTS (18+):</span>
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
                  <span>CHILDREN:</span>
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
          {rooms.length < 5 && (
            <button className={styles.Button} onClick={addRoom}>
              ADD ROOM
            </button>
          )}

            <button className={styles.Button} onClick={() => setIsOpen(false)}>
                UPDATE
            </button>
        </div>
      )}
    </div>
  );
};

export default RoomTypeSelection;
