import React, { useCallback } from 'react'
import {useLocale, useTranslations} from 'next-intl';
import style from '../../../scss/embla.module.scss'

import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

const EmblaCarousel = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()])

  const locale = useLocale();
  const t = useTranslations();

 const captionCards = locale === "ar" ? style['caption-ar'] : style.caption;

  const onNavButtonClick = useCallback((emblaApi) => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay) return

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop

    resetOrStop()
  }, [])

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi, onNavButtonClick)

  return (
    <section className={style.embla}>
      <div className={style.embla__viewport} ref={emblaRef}>
        <div className={style.embla__container}>
          
            <div className={style.embla__slide}>
              <div className={style.embla__slide__number}>
                <img src="hotel1.jpg" alt="Slide 1"/>
                <div className={captionCards}>
                  <div className={style.title}>{t('Gallery.BusinessCenter')}</div>
                  <div className={style.cardDesc}>{t('Gallery.BusinessDesc')}</div>
                </div>
              </div>
            </div>
            <div className={style.embla__slide}>
              <div className={style.embla__slide__number}>
              <img src="room2.jpg" alt="Slide 2" className={style.image} />
                <div className={captionCards}>
                  <div className={style.title}>{t('Gallery.LobbyLounge')}</div>
                  <div className={style.cardDesc}>{t('Gallery.LobbyDesc')}</div>
                </div>
              </div>
            </div>            
            <div className={style.embla__slide}>
              <div className={style.embla__slide__number}>
              <img src="hero.jpg" alt="Slide 3" className={style.image} />
              <div className={captionCards}>
                <div className={style.title}>{t('Gallery.Welcome')}</div>
                <div className={style.cardDesc}>{t('Gallery.WelcomeDesc')}</div>
              </div>
              </div>
            </div>
            <div className={style.embla__slide}>
              <div className={style.embla__slide__number}>
              <img src="room3.jpg" alt="Slide 5" className={style.image} />
              <div className={captionCards}>
                <div className={style.title}>{t('Gallery.ExecutiveSuites')}</div>
                <div className={style.cardDesc}>{t('Gallery.ExecutiveDesc')}</div>
              </div>
              </div>
            </div>
            <div className={style.embla__slide}>
              <div className={style.embla__slide__number}>
                <img src="room1.jpg" alt="Slide 4" className={style.image} />
                <div className={captionCards}>
                  <div className={style.title}>{t('Gallery.DeluxeRooms')}</div>
                  <div className={style.cardDesc}>{t('Gallery.DeluxeDesc')}</div>
                </div>
              </div>
            </div>
        </div>
      </div>

      <div className={style.embla__controls}>
        <div className={style.embla__buttons}>
          {/* <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} /> */}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel
