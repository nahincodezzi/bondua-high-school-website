import React, { useState, useEffect } from 'react';
import { useSchool } from '../context/useSchool';
import { 
  ChevronLeft, 
  ChevronRight, 
  GraduationCap, 
  FileText, 
  Sparkles, 
  Share2,
  Shirt,
  Pause,
  Play
} from 'lucide-react';

export default function HeroSlider() {
  const { lang, setActiveTab, schoolInfo, heroSlides } = useSchool();
  const slides = heroSlides && heroSlides.length > 0 ? heroSlides : [];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide effect with pause on hover/focus and reduced motion awareness (L3)
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div 
      className="relative bg-ink text-white overflow-hidden shadow-xl no-print"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsPaused(false);
        }
      }}
    >
      {/* Background Slides */}
      <div className="relative min-h-[640px] sm:min-h-[620px] md:min-h-[680px] w-full">
        {slides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id || idx}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image with Flat Dark Green Overlay */}
              <img
                src={slide.image}
                alt={slide.titleEn || slide.titleBn}
                loading={idx === 0 ? "eager" : "lazy"}
                className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-7000 ease-out"
              />
              <div className="absolute inset-0 bg-deep/65"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

              {/* Slide Content with safe responsive padding (M1) */}
              <div className="absolute inset-0 flex items-center pt-24 sm:pt-28 md:pt-32">
                <div className="max-w-7xl mx-auto px-6 sm:px-14 md:px-20 w-full">
                  <div className="max-w-2xl space-y-4">
                    {/* Tag Pill & Location Indicator */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-1.5 bg-soft text-deep px-3.5 py-1 text-xs sm:text-sm font-bold shadow-xs rounded-full font-bangla border border-soft-border">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>{lang === 'bn' ? slide.tagBn : slide.tagEn}</span>
                      </div>

                      <span className="bg-black/30 text-white/90 text-xs font-semibold px-3 py-1 rounded-full font-bangla hidden sm:inline-flex border border-white/20">
                        {lang === 'bn' ? (schoolInfo.roadBn || 'ফেনী-পরশুরাম রোড সংলগ্ন') : (schoolInfo.roadEn || 'Situated along Feni-Parshuram Road')}
                      </span>
                    </div>

                    {/* Main Title */}
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-bangla leading-tight text-white drop-shadow-md">
                      {lang === 'bn' ? slide.titleBn : slide.titleEn}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-lg text-muted font-bangla leading-relaxed max-w-xl drop-shadow-xs">
                      {lang === 'bn' ? slide.subtitleBn : slide.subtitleEn}
                    </p>

                    {/* Quick Uniform Callout Tag */}
                    <div className="inline-flex items-center gap-2 bg-black/30 border border-white/20 px-4 py-1.5 rounded-full text-xs text-soft font-bangla">
                      <Shirt className="w-4 h-4 text-accent shrink-0" />
                      <span>
                        {lang === 'bn' 
                          ? 'নির্ধারিত স্কুল পোশাক: ছাত্র—সাদা শার্ট ও নীল প্যান্ট | ছাত্রী—লাল ড্রেস'
                          : 'Dress Code: Boys (White Shirt & Blue Pant), Girls (Red Dress)'}
                      </span>
                    </div>

                    {/* Call to Actions - Exactly 1 Amber Button, Secondary Outline (H6: 2027 session) */}
                    <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                      <button
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => setActiveTab('admission')}
                        className="btn-accent px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-base flex items-center gap-1.5 sm:gap-2 font-bangla shadow-md cursor-pointer rounded-lg"
                      >
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-ink" />
                        <span>{lang === 'bn' ? 'অনলাইন ভর্তি আবেদন ২০২৭' : 'Apply for Admission'}</span>
                      </button>

                      <button
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => setActiveTab('results')}
                        className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-xs sm:text-base border border-white/40 shadow-sm transition flex items-center gap-1.5 sm:gap-2 font-bangla cursor-pointer"
                      >
                        <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        <span>{lang === 'bn' ? 'ফলাফল অনুসন্ধান' : 'Check Results'}</span>
                      </button>

                      <button
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => setActiveTab('uniform')}
                        className="text-white hover:text-primary px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 sm:gap-2 font-bangla cursor-pointer"
                      >
                        <Shirt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>{lang === 'bn' ? 'পোশাক নীতিমালা' : 'Dress Code'}</span>
                      </button>

                      <a
                        tabIndex={isActive ? 0 : -1}
                        href={schoolInfo.facebookGroupUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/80 hover:text-white px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 sm:gap-2"
                        title="Join Facebook Group"
                        aria-label="ফেসবুক গ্রুপে যান"
                      >
                        <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80" />
                        <span className="hidden sm:inline">{lang === 'bn' ? 'ফেসবুক গ্রুপ' : 'Facebook'}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prev / Next Arrows - Visible on tablet/desktop, hidden on small phones to prevent covering text (M1) */}
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white items-center justify-center backdrop-blur-sm transition border border-white/20 cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white items-center justify-center backdrop-blur-sm transition border border-white/20 cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators & Pause/Play Control (L3) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentSlide ? 'w-6 h-2 bg-accent' : 'w-2 h-2 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setIsPaused(!isPaused)}
          className="text-white/80 hover:text-white p-1 rounded-full cursor-pointer transition"
          aria-label={isPaused ? 'Resume slider' : 'Pause slider'}
          title={isPaused ? 'Resume slider' : 'Pause slider'}
        >
          {isPaused ? <Play className="w-3 h-3 text-accent" /> : <Pause className="w-3 h-3 text-white" />}
        </button>
      </div>

      {/* Stat Bar Bottom Ribbon: Flat Solid Dark Green, Consistent Numerals */}
      <div className="relative z-20 bg-deep border-t border-primary py-4 px-4 sm:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="border-r border-primary last:border-none px-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'bn' ? '১৯৯০' : '1990'}
            </p>
            <p className="text-xs sm:text-sm text-primary font-bangla mt-0.5">
              {lang === 'bn' ? 'স্থাপিত শিক্ষাবর্ষ (স্বীকৃতি: ১৯৯৪)' : 'Established Year'}
            </p>
          </div>
          <div className="border-r border-primary last:border-none px-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'bn' ? '৮৫০+' : '850+'}
            </p>
            <p className="text-xs sm:text-sm text-primary font-bangla mt-0.5">
              {lang === 'bn' ? 'বর্তমান শিক্ষার্থী' : 'Enrolled Students'}
            </p>
          </div>
          <div className="border-r border-primary last:border-none px-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'bn' ? '৯৮.৫%' : '98.5%'}
            </p>
            <p className="text-xs sm:text-sm text-primary font-bangla mt-0.5">
              {lang === 'bn' ? 'এসএসসি পাশের হার' : 'SSC Board Pass Rate'}
            </p>
          </div>
          <div className="px-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'bn' ? '৩টি বিভাগ' : '3 Groups'}
            </p>
            <p className="text-xs sm:text-sm text-primary font-bangla mt-0.5">
              {lang === 'bn' ? 'বিজ্ঞান, ব্যবসায় ও মানবিক' : 'Science, Business & Humanities'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
