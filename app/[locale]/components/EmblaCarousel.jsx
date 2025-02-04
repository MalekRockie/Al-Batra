import React, { useCallback } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import style from '../../../scss/embla.module.scss'
import { PrevButton, NextButton, usePrevNextButtons } from './EmblaCarouselArrowButtons'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

const EmblaCarousel = (props) => {
  const { slides, options, style: customStyle } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()])
  const locale = useLocale()
  const t = useTranslations()

  const captionCards = locale === "ar" ? style['caption-ar'] : style.caption

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
    <section 
      className={style.embla}
      style={customStyle} // Pass custom CSS variables here
    >
      <div className={style.embla__viewport} ref={emblaRef}>
        <div className={style.embla__container}>
          {slides.map((slide, index) => (
            <div className={style.embla__slide} key={index}>
              <div className={style.embla__slide__number}>
                <img 
                  src={slide.imageSrc} 
                  alt={slide.altText} 
                  className={style.image}
                />
                <div className={captionCards}>
                  <div className={style.title}>{t(slide.titleKey)}</div>
                  <div className={style.cardDesc}>{t(slide.descKey)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={style.embla__controls}>
        <div className={style.embla__buttons}>
          {/* Uncomment to use arrows */}
          {/* <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} /> */}
          {/* <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} /> */}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel