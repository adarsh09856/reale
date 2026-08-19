import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Bed, Bath, Maximize2, MapPin, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

export const FeaturedProperties = () => {
  const { properties, openDetail, favorites, toggleFavorite } = useApp();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10 px-4 sm:px-8 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[#9e1b27] text-base font-serif">❖</span>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
              Featured Properties
            </h2>
          </div>

          <button 
            onClick={() => {}}
            className="text-xs sm:text-sm font-bold text-[#9e1b27] hover:text-[#80131d] flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>View All Properties</span>
            <span>&gt;</span>
          </button>
        </div>

        {/* Carousel Container with Controls */}
        <div className="relative group">
          
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg border border-stone-200 text-slate-700 hover:text-[#9e1b27] flex items-center justify-center z-10 transition-all cursor-pointer opacity-90 hover:opacity-100"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Cards Track */}
          <div
            ref={scrollRef}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {properties.map((prop) => {
              const isFav = favorites.includes(prop.id);

              return (
                <div
                  key={prop.id}
                  onClick={() => openDetail(prop, 'property')}
                  className="w-[260px] sm:w-[280px] flex-shrink-0 bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md hover:border-amber-400/80 transition-all cursor-pointer flex flex-col justify-between overflow-hidden group/card"
                >
                  {/* Image & Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                    <img
                      src={prop.image}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
                      {prop.badges.map((b, bIdx) => (
                        <span
                          key={bIdx}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-xs ${b.color}`}
                        >
                          {b.text}
                        </span>
                      ))}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(prop.id, prop.title);
                      }}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 backdrop-blur-md text-slate-600 hover:text-red-500 shadow-sm transition-all"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate mb-1">
                        {prop.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-2 truncate">
                        <MapPin className="w-3 h-3 text-[#9e1b27] flex-shrink-0" />
                        <span className="truncate">{prop.location}</span>
                      </div>

                      {/* Price */}
                      <div className="font-extrabold text-sm sm:text-base text-[#9e1b27]">
                        {prop.priceDisplay}
                      </div>
                    </div>

                    {/* Specs Row */}
                    <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
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
                        <div className="text-[11px] text-slate-500 font-medium">
                          {prop.unitDetail || prop.area}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg border border-stone-200 text-slate-700 hover:text-[#9e1b27] flex items-center justify-center z-10 transition-all cursor-pointer opacity-90 hover:opacity-100"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
};
