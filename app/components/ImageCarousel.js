'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import Image from 'next/image'
import './CardSlider.css' // Make sure this file exists

export default function ImageCarousel({ images, title }) {
  return (
    <div className="w-full px-4">
      {title && <h2 className="text-xl font-semibold mb-4" style={{ textTransform: 'none' }}>{title}</h2>}

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={4}
        slidesPerView={3.5}
        breakpoints={{
          768: {
            slidesPerView: 3.9,
          },
          0: {
            slidesPerView: 1.2,
          },
        }}
      >
        {images.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="bg-white shadow-md rounded-lg overflow-hidden"
              style={{ width: '400px', height: '300px' }}
            >
              <Image
                src={url}
                alt={`Card ${index + 1}`}
                width={360}
                height={300}
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, 420px"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
