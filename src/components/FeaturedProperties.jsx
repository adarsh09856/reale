import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bed, Bath, Maximize2, MapPin, ChevronLeft, ChevronRight, Heart, Calculator } from 'lucide-react';

export const FeaturedProperties = () => {
  const { properties, openDetail, favorites, toggleFavorite, formatCurrency } = useApp();
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / (clientWidth * 0.8));
      setActiveIndex(Math.min(index, properties.length - 1));
    }
  };

  return (
    <section id="properties-section" className="py-12 sm:py-16 px-4 sm:px-8 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[#9e1b27] text-base font-serif">❖</span>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
              Featured Properties
            </h2>
          </div>

          <button 
            onClick={() => openDetail(properties[0], 'property')}
            className="text-xs sm:text-sm font-bold text-[#9e1b27] hover:text-[#80131d] flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>View All Properties</span>
            <span>&gt;</span>
          </button>
        </div>

        {/* Carousel Container with Controls */}
        <div className="relative group">
          
          {/* Desktop Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl border border-stone-200 text-slate-700 hover:text-[#9e1b27] items-center justify-center z-10 transition-all cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Previous property"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Cards Track (Touch Swipeable & Responsive) */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth no-scrollbar snap-x snap-mandatory"
          >
            {properties.map((prop, idx) => {
              const isFav = favorites.includes(prop.id);

              return (
                <div
                  key={prop.id}
                  onClick={() => openDetail(prop, 'property')}
                  className="w-[280px] sm:w-[310px] lg:w-[325px] flex-shrink-0 snap-start glass-card rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-amber-400/80 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden group/card"
                >
                  {/* Image & Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                    <img
                      src={prop.image}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover/card:scale-108 transition-transform duration-700"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                      {prop.badges.map((b, bIdx) => (
                        <span
                          key={bIdx}
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-sm ${b.color}`}
                        >
                          {b.text}
                        </span>
                      ))}
                    </div>

                    {/* Wishlist Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(prop.id, prop.title);
                      }}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-600 hover:text-red-500 shadow-sm hover:scale-110 active:scale-95 transition-all"
                      aria-label="Save to favorites"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate mb-1">
                        {prop.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-2.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#9e1b27] flex-shrink-0" />
                        <span className="truncate">{prop.location}</span>
                      </div>

                      {/* Price */}
                      <div className="font-extrabold text-base sm:text-lg text-[#9e1b27]">
                        {formatCurrency(prop.priceNu, prop.priceDisplay.includes('/month') ? '/mo' : prop.priceDisplay.includes('/decimal') ? '/dec' : '')}
                      </div>
                    </div>

                    {/* Specs Row */}
                    <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                      {prop.beds > 0 ? (
                        <>
                          <div className="flex items-center gap-1">
                            <Bed className="w-3.5 h-3.5 text-slate-400" />
                            <span>{prop.beds} Beds</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="w-3.5 h-3.5 text-slate-400" />
                            <span>{prop.baths} Baths</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{prop.area}</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-slate-500 font-medium">
                          {prop.unitDetail || prop.area}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl border border-stone-200 text-slate-700 hover:text-[#9e1b27] items-center justify-center z-10 transition-all cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Next property"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Pagination Indicator Dots */}
        <div className="flex sm:hidden justify-center items-center gap-1.5 mt-4">
          {properties.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === i ? 'w-5 bg-[#9e1b27]' : 'w-1.5 bg-stone-300'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
