import React, { useEffect, useRef } from 'react';
import styles from '../scss/Carousel.module.scss'; // Update the path if necessary

const Carousel = () => {
  const trackRef = useRef(null);
  const dragStart = useRef(0);
  const dragEnd = useRef(0);
  const threshold = 150;
  const slideWidth = 800;

  const dragPos = () => dragEnd.current - dragStart.current;

  const shiftSlide = (direction) => {
    const track = trackRef.current;
    if (track.classList.contains(styles.transition)) return;
    dragEnd.current = dragStart.current;
    track.classList.add(styles.transition);
    track.style.transform = `translateX(${direction * slideWidth}px)`;

    setTimeout(() => {
      if (direction === 1) {
        track.insertBefore(track.lastElementChild, track.firstElementChild);
      } else if (direction === -1) {
        track.appendChild(track.firstElementChild);
      }
      track.classList.remove(styles.transition);
      track.style.transform = 'translateX(0px)';
    }, 700);
  };

  useEffect(() => {
    const track = trackRef.current;

    const handleMouseDown = (e) => {
      if (track.classList.contains(styles.transition)) return;
      dragStart.current = e.pageX;
      track.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
      dragEnd.current = e.pageX;
      track.style.transform = `translateX(${dragPos()}px)`;
    };

    const handleMouseUp = () => {
      track.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      if (dragPos() > threshold) {
        shiftSlide(1);
      } else if (dragPos() < -threshold) {
        shiftSlide(-1);
      } else {
        shiftSlide(0);
      }
    };

    track.addEventListener('mousedown', handleMouseDown);

    return () => {
      track.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const scrollNext = () => {
    shiftSlide(-1);
  };

  const scrollPrev = () => {
    shiftSlide(1);
  };

  return (
    <div className={styles.wrap}>
      <button className={styles.prevButton} onClick={scrollPrev}>&#9664;</button>
      <div className={styles.window}>
        <div id="carousel" className={styles.carouselTrack} ref={trackRef}>
          <div className={styles.slide} id="b1">
            <img src="hero.jpg" alt="Slide 1" className={styles.image} />
            <div className={styles.caption}>
              <div className={styles.title}>Welcome to Al Batra Hotel</div>
              <div className={styles.cardDesc}>Experience luxury and comfort in the heart of Libya.</div>
            </div>
          </div>
          <div className={styles.slide} id="b2">
            <img src="hotel1.jpg" alt="Slide 2" className={styles.image} />
            <div className={styles.caption}>
              <div className={styles.title}>Business Center</div>
              <div className={styles.cardDesc}>Fully equipped with modern amenities for your business needs.</div>
            </div>
          </div>
          <div className={styles.slide} id="b3">
            <img src="room2.jpg" alt="Slide 3" className={styles.image} />
            <div className={styles.caption}>
              <div className={styles.title}>Lobby Lounge</div>
              <div className={styles.cardDesc}>Our rooms offer a perfect blend of comfort and style.</div>
            </div>
          </div>
          <div className={styles.slide} id="b4">
            <img src="room1.jpg" alt="Slide 4" className={styles.image} />
            <div className={styles.caption}>
              <div className={styles.title}>Deluxe Rooms</div>
              <div className={styles.cardDesc}>Our rooms offer a perfect blend of comfort and style.</div>
            </div>
          </div>
          <div className={styles.slide} id="b5">
            <img src="room3.jpg" alt="Slide 5" className={styles.image} />
            <div className={styles.caption}>
              <div className={styles.title}>Executive Suites</div>
              <div className={styles.cardDesc}>Spacious and luxurious, ideal for business and leisure.</div>
            </div>
          </div>
        </div>
      </div>
      <button className={styles.nextButton} onClick={scrollNext}>&#9654;</button>
    </div>
  );
};

export default Carousel;
