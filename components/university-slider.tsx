'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { UniversityCard } from '@/components/university-card'
import { Locale } from '@/lib/i18n'

type Props = {
  universities: any[]
  lang: Locale
  dict: any
}

export default function UniversitySlider({
  universities,
  lang,
  dict,
}: Props) {
  return (
    <div className="university-slider-wrapper">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { 
            slidesPerView: 1.5,
            spaceBetween: 20,
          },
          768: { 
            slidesPerView: 2,
            spaceBetween: 24,
          },
          1024: { 
            slidesPerView: 3,
            spaceBetween: 24,
          },
          1280: { 
            slidesPerView: 3,
            spaceBetween: 32,
          },
        }}
        watchSlidesProgress={true}
        className="university-swiper"
      >
        {universities.map((university) => (
          <SwiperSlide key={university.id} className="h-auto">
            <div className="h-full">
              <UniversityCard
                university={university}
                lang={lang}
                dict={dict}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .university-slider-wrapper {
          position: relative;
          width: 100%;
          padding: 0 0 48px;
        }

        .university-swiper {
          width: 100%;
          padding-bottom: 16px;
        }

        .university-swiper .swiper-slide {
          height: auto;
          display: flex;
          align-items: stretch;
        }

        .university-swiper .swiper-slide > div {
          width: 100%;
        }

        /* Navigation buttons styling */
        .university-swiper .swiper-button-next,
        .university-swiper .swiper-button-prev {
          color: #2563eb;
          background: white;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          transition: all 0.3s ease;
        }

        .university-swiper .swiper-button-next:hover,
        .university-swiper .swiper-button-prev:hover {
          background: #2563eb;
          color: white;
          transform: scale(1.1);
        }

        .university-swiper .swiper-button-next::after,
        .university-swiper .swiper-button-prev::after {
          font-size: 18px;
          font-weight: bold;
        }

        /* Pagination styling */
        .university-swiper .swiper-pagination {
          margin-top: 12px;
        }

        .university-swiper .swiper-pagination-bullet {
        margin-top: 12px;
          width: 10px;
          height: 10px;
          background: #d1d5db;
          opacity: 1;
          transition: all 0.3s ease;
        }

        .university-swiper .swiper-pagination-bullet-active {
          background: #2563eb;
          width: 24px;
          border-radius: 5px;
        }

        /* Ensure cards align at the top */
        .university-swiper .swiper-wrapper {
          align-items: stretch;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .university-swiper .swiper-button-next,
          .university-swiper .swiper-button-prev {
            width: 36px;
            height: 36px;
          }

          .university-swiper .swiper-button-next::after,
          .university-swiper .swiper-button-prev::after {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  )
}