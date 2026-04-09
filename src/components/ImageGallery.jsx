import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import { HiOutlineX, HiOutlineZoomIn } from 'react-icons/hi';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80';

export default function ImageGallery({ images = [] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const imgs = images.length > 0 ? images : [PLACEHOLDER];

  const openLightbox = (i) => { setActiveIndex(i); setLightboxOpen(true); };

  return (
    <>
      {/* Main Gallery Grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-96 rounded-2xl overflow-hidden">
        {/* Hero image */}
        <div
          className="col-span-2 row-span-2 relative cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <img src={imgs[0]} alt="Property" className="w-full h-full object-cover group-hover:brightness-90 transition-all" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <HiOutlineZoomIn className="text-white text-4xl drop-shadow-lg" />
          </div>
        </div>
        {/* Thumbs */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative cursor-pointer group overflow-hidden"
            onClick={() => openLightbox(i)}
          >
            {imgs[i] ? (
              <>
                <img src={imgs[i]} alt={`View ${i + 1}`} className="w-full h-full object-cover group-hover:brightness-90 transition-all group-hover:scale-105 duration-300" />
                {i === 3 && imgs.length > 5 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">+{imgs.length - 5}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <span className="text-slate-600 text-sm">No image</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-amber-400 transition-colors p-2"
            id="close-lightbox-btn"
            onClick={() => setLightboxOpen(false)}
          >
            <HiOutlineX className="text-3xl" />
          </button>
          <div className="w-full max-w-4xl px-4" onClick={(e) => e.stopPropagation()}>
            <Swiper
              modules={[Navigation, Pagination, Zoom]}
              navigation
              pagination={{ clickable: true }}
              zoom
              initialSlide={activeIndex}
              className="rounded-xl overflow-hidden"
            >
              {imgs.map((src, i) => (
                <SwiperSlide key={i}>
                  <div className="swiper-zoom-container">
                    <img src={src} alt={`Slide ${i + 1}`} className="max-h-[80vh] w-full object-contain" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
}
