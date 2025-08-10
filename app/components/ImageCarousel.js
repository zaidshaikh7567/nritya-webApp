'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { useCallback, useState, useEffect } from 'react'
import './CardSlider.css' // Make sure this file exists
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md'

export default function ImageCarousel({ images, title }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      slidesToScroll: 1,
      containScroll: 'trimSnaps',
      dragFree: true,
      loop: true, // Enable infinite loop
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  )

  const [loadedImages, setLoadedImages] = useState(new Set())

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const handleImageLoad = useCallback((index) => {
    setLoadedImages(prev => new Set([...prev, index]))
  }, [])

  // Preload next few images when carousel moves
  useEffect(() => {
    if (!emblaApi) return

    const handleSelect = () => {
      const currentIndex = emblaApi.selectedScrollSnap()
      // Preload current and next 2 images
      const imagesToLoad = [currentIndex, currentIndex + 1, currentIndex + 2]
      imagesToLoad.forEach(index => {
        if (index < images.length && !loadedImages.has(index)) {
          const img = new window.Image()
          img.src = images[index]
          img.onload = () => handleImageLoad(index)
        }
      })
    }

    emblaApi.on('select', handleSelect)
    return () => emblaApi.off('select', handleSelect)
  }, [emblaApi, images, loadedImages, handleImageLoad])

  return (
    <div className="w-full px-4">
      {title && <h2 className="text-xl font-semibold mb-4" style={{ textTransform: 'none' }}>{title}</h2>}

      <div className="carousel-wrapper" style={{ position: 'relative' }}>
        <div className="embla overflow-hidden relative" ref={emblaRef}>
          <div className="embla__container flex">
            {images.map((url, index) => {
              const isPriority = index < 2
              return (
                <div key={index} className="embla__slide">
                  <div className="bg-white shadow-md rounded-lg overflow-hidden aspect-video">
                    <Image
                      src={url}
                      alt={`Card ${index + 1}`}
                      width={400}
                      height={225}
                      className="object-cover w-full h-full rounded-md "
                      sizes="(max-width: 768px) 80vw, (max-width: 1024px) 40vw, 30vw"
                      {...(isPriority ? { priority: true } : { loading: 'lazy' })}
                      onLoad={() => handleImageLoad(index)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        {/* Navigation Arrows - moved outside .embla */}
        <button
          className="scroll-button left"
          onClick={scrollPrev}
          aria-label="Previous slide"
          type="button"
        >
          <MdArrowBackIosNew />
        </button>
        <button
          className="scroll-button right"
          onClick={scrollNext}
          aria-label="Next slide"
          type="button"
        >
          <MdArrowForwardIos />
        </button>
      </div>
    </div>
  )
}
