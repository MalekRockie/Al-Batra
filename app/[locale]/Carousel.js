import React, { useEffect, useRef } from 'react';
import carouselStyles from '../../scss/Carousel.module.scss';
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '../../src/i18n/routing';

const Carousel = () => {
  const trackRef = useRef(null);
  const dragStart = useRef(0);
  const dragEnd = useRef(0);
  const threshold = 150;
  const slideWidth = 800;
  const locale = useLocale();
  const t = useTranslations();
  const captionCards = locale === "ar" ? carouselStyles['caption-ar'] : carouselStyles.caption;

  const dragPos = () => dragEnd.current - dragStart.current;

  const shiftSlide = (direction) => {
    const track = trackRef.current;
    if (track.classList.contains(carouselStyles.transition)) return;
    dragEnd.current = dragStart.current;
    track.classList.add(carouselStyles.transition);
    track.style.transform = `translateX(${direction * slideWidth}px)`;

    setTimeout(() => {
      if (direction === 1) {
        track.insertBefore(track.lastElementChild, track.firstElementChild);
      } else if (direction === -1) {
        track.appendChild(track.firstElementChild);
      }
      track.classList.remove(carouselStyles.transition);
      track.style.transform = 'translateX(0px)';
    }, 700);
  };

  useEffect(() => {
    const track = trackRef.current;

    const handleMouseDown = (e) => {
      if (track.classList.contains(carouselStyles.transition)) return;
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
    <div className={carouselStyles.wrap}>
      <button className={carouselStyles.prevButton} onClick={scrollPrev}>&#9664;</button>
      <div className={carouselStyles.window}>
        <div id="carousel" className={carouselStyles.carouselTrack} ref={trackRef}>
          <div className={carouselStyles.slide} id="b1">
            <img src="hotel1.jpg" alt="Slide 1" className={carouselStyles.image} />
            <div className={captionCards}>
              <div className={carouselStyles.title}>{t('Gallery.BusinessCenter')}</div>
              <div className={carouselStyles.cardDesc}>{t('Gallery.BusinessDesc')}</div>
            </div>
          </div>
          <div className={carouselStyles.slide} id="b2">
            <img src="room2.jpg" alt="Slide 2" className={carouselStyles.image} />
            <div className={captionCards}>
              <div className={carouselStyles.title}>{t('Gallery.LobbyLounge')}</div>
              <div className={carouselStyles.cardDesc}>{t('Gallery.LobbyDesc')}</div>
            </div>
          </div>
          <div className={carouselStyles.slide} id="b3">
            <img src="hero.jpg" alt="Slide 3" className={carouselStyles.image} />
            <div className={captionCards}>
              <div className={carouselStyles.title}>{t('Gallery.Welcome')}</div>
              <div className={carouselStyles.cardDesc}>{t('Gallery.WelcomeDesc')}</div>
            </div>
          </div>
          <div className={carouselStyles.slide} id="b4">
            <img src="room1.jpg" alt="Slide 4" className={carouselStyles.image} />
            <div className={captionCards}>
              <div className={carouselStyles.title}>{t('Gallery.DeluxeRooms')}</div>
              <div className={carouselStyles.cardDesc}>{t('Gallery.DeluxeDesc')}</div>
            </div>
          </div>
          <div className={carouselStyles.slide} id="b5">
            <img src="room3.jpg" alt="Slide 5" className={carouselStyles.image} />
            <div className={captionCards}>
              <div className={carouselStyles.title}>{t('Gallery.ExecutiveSuites')}</div>
              <div className={carouselStyles.cardDesc}>{t('Gallery.ExecutiveDesc')}</div>
            </div>
          </div>
        </div>
      </div>
      <button className={carouselStyles.nextButton} onClick={scrollNext}>&#9654;</button>
    </div>
  );
};

export default Carousel;
