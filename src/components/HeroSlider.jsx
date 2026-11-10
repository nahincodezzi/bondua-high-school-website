import React, { useState, useEffect } from 'react';
import { useSchool } from '../context/useSchool';
import { toEnglishNumerals, toBanglaNumerals } from '../utils/dateFormatter';
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
  const slides = heroSlides && heroSlides.length > 0 ? heroSlides.filter(s => s.active !== false) : [];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const heroConfig = schoolInfo?.hero || {};
  const statsList = Array.isArray(schoolInfo?.stats) && schoolInfo.stats.length > 0 ? schoolInfo.stats : [
    { id: '1', valueBn: '১৯৯০', valueEn: '1990', labelBn: 'স্থাপিত শিক্ষাবর্ষ', labelEn: 'Established Year' },
    { id: '2', valueBn: '৮৫০+', valueEn: '850+', labelBn: 'বর্তমান শিক্ষার্থী', labelEn: 'Enrolled Students' },
    { id: '3', valueBn: '৯৮.৫%', valueEn: '98.5%', labelBn: 'এসএসসি পাসের হার', labelEn: 'SSC Board Pass Rate' },
    { id: '4', valueBn: '৩টি বিভাগ', valueEn: '3 Groups', labelBn: 'বিজ্ঞান, ব্যবসায় ও মানবিক', labelEn: 'Science, Business & Humanities' },
  ];

  const rawAdmYear = schoolInfo?.admissionYear || (lang === 'bn' ? '২০২৭' : '2027');
  const admYear = lang === 'bn' ? toBanglaNumerals(rawAdmYear) : toEnglishNumerals(rawAdmYear);

  // Auto-slide effect with pause on hover/focus and reduced motion awareness (L3)
  useEffect(() => {
    if (slides.length <= 1 || isPaused || heroConfig.autoplay === false) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const intervalSec = Number(heroConfig.interval) || 6;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, intervalSec * 1000);
    return () => clearInterval(timer);
  }, [slides.length, isPaused, heroConfig.autoplay, heroConfig.interval]);

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
                        <span>{lang === 'bn' ? slide.tagBn : (slide.tagEn || slide.tagBn)}</span>
                      </div>

                      {heroConfig.locationBadge?.visible !== false && (heroConfig.locationBadge?.textBn || schoolInfo.roadBn) && (
                        <span className="bg-black/30 text-white/90 text-xs font-semibold px-3 py-1 rounded-full font-bangla hidden sm:inline-flex border border-white/20">
                          {lang === 'bn' 
                            ? (heroConfig.locationBadge?.textBn || schoolInfo.roadBn || '') 
                            : (heroConfig.locationBadge?.textEn || schoolInfo.roadEn || heroConfig.locationBadge?.textBn || '')}
                        </span>
                      )}
                    </div>

                    {/* Main Title */}
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-bangla leading-tight text-white drop-shadow-md">
                      {lang === 'bn' ? slide.titleBn : (slide.titleEn || slide.titleBn)}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-lg text-white font-medium font-bangla leading-relaxed max-w-xl drop-shadow-md">
                      {lang === 'bn' ? slide.subtitleBn : (slide.subtitleEn || slide.subtitleBn)}
                    </p>

                    {/* Info Pill */}
                    {heroConfig.infoPill?.visible !== false && (heroConfig.infoPill?.textBn || heroConfig.infoPill?.textEn) && (
                      <div className="inline-flex items-center gap-2 bg-black/30 border border-white/20 px-4 py-1.5 rounded-full text-xs text-white font-medium font-bangla">
                        <Shirt className="w-4 h-4 text-accent shrink-0" />
                        <span>
                          {lang === 'bn' 
                            ? (heroConfig.infoPill?.textBn || '') 
                            : (heroConfig.infoPill?.textEn || heroConfig.infoPill?.textBn || '')}
                        </span>
                      </div>
                    )}

                    {/* Call to Actions - CMS-Driven Dynamic Buttons */}
                    <div className="pt-2 space-y-3">
                      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                        {heroConfig.primaryBtn?.visible !== false && (
                          <button
                            tabIndex={isActive ? 0 : -1}
                            onClick={() => {
                              const tgt = (heroConfig.primaryBtn?.target || '#admission').replace('#', '');
                              setActiveTab(tgt);
                            }}
                            className="bg-accent hover:bg-accent-hover text-accent-ink font-bold border border-transparent px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm leading-6 inline-flex items-center justify-center gap-2 font-bangla shadow-md transition cursor-pointer whitespace-nowrap"
                          >
                            <FileText className="w-4 h-4 shrink-0 text-accent-ink" />
                            <span>
                              {(lang === 'bn' 
                                ? (heroConfig.primaryBtn?.labelBn || 'অনলাইন ভর্তি আবেদন {year}') 
                                : (heroConfig.primaryBtn?.labelEn || 'Apply for Admission {year}')
                              ).replace('{year}', admYear)}
                            </span>
                          </button>
                        )}

                        {heroConfig.secondaryBtn?.visible !== false && (
                          <button
                            tabIndex={isActive ? 0 : -1}
                            onClick={() => {
                              const tgt = (heroConfig.secondaryBtn?.target || '#results').replace('#', '');
                              setActiveTab(tgt);
                            }}
                            className="bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/40 hover:border-white/60 px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm leading-6 inline-flex items-center justify-center gap-2 font-bangla shadow-sm backdrop-blur-xs transition cursor-pointer whitespace-nowrap"
                          >
                            <GraduationCap className="w-4 h-4 shrink-0 text-white" />
                            <span>
                              {lang === 'bn' 
                                ? (heroConfig.secondaryBtn?.labelBn || 'ফলাফল অনুসন্ধান') 
                                : (heroConfig.secondaryBtn?.labelEn || 'Check Results')}
                            </span>
                          </button>
                        )}

                        {heroConfig.tertiaryBtn?.visible !== false && (
                          <button
                            tabIndex={isActive ? 0 : -1}
                            onClick={() => {
                              const tgt = (heroConfig.tertiaryBtn?.target || '#uniform').replace('#', '');
                              setActiveTab(tgt);
                            }}
                            className="bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/40 hover:border-white/60 px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm leading-6 inline-flex items-center justify-center gap-2 font-bangla shadow-sm backdrop-blur-xs transition cursor-pointer whitespace-nowrap"
                          >
                            <Shirt className="w-4 h-4 shrink-0 text-white" />
                            <span>
                              {lang === 'bn' 
                                ? (heroConfig.tertiaryBtn?.labelBn || 'পোশাক নীতিমালা') 
                                : (heroConfig.tertiaryBtn?.labelEn || 'Dress Code')}
                            </span>
                          </button>
                        )}
                      </div>

                      {heroConfig.socialBtn?.visible !== false && (schoolInfo.facebookGroupUrl || heroConfig.socialBtn?.url) && (
                        <div>
                          <a
                            tabIndex={isActive ? 0 : -1}
                            href={heroConfig.socialBtn?.url || schoolInfo.facebookGroupUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/90 hover:text-accent hover:underline underline-offset-4 text-xs sm:text-sm font-semibold transition inline-flex items-center gap-1.5 font-bangla whitespace-nowrap"
                            title="Join Community"
                            aria-label={lang === 'bn' ? 'অফিসিয়াল ফেসবুক গ্রুপে যান' : 'Visit Official Facebook Group'}
                          >
                            <Share2 className="w-4 h-4 shrink-0" />
                            <span>
                              {lang === 'bn' 
                                ? (heroConfig.socialBtn?.labelBn || 'অফিসিয়াল ফেসবুক গ্রুপ') 
                                : (heroConfig.socialBtn?.labelEn || 'Official Facebook Group')}
                            </span>
                          </a>
                        </div>
                      )}
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

      {/* Stat Bar Bottom Ribbon: CMS-Managed Dynamic Statistics */}
      <div className="relative z-20 bg-deep border-t border-white/10 py-4 px-4 sm:px-8 shadow-xs">
        <div className={`max-w-7xl mx-auto grid grid-cols-2 ${statsList.length >= 4 ? 'sm:grid-cols-4' : statsList.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4 text-center`}>
          {statsList.map((stat, sIdx) => (
            <div key={stat.id || sIdx} className="border-r border-white/15 last:border-none px-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                {lang === 'bn' ? stat.valueBn : toEnglishNumerals(stat.valueEn || stat.valueBn)}
              </p>
              <p className="text-xs sm:text-sm text-soft font-medium font-bangla mt-0.5">
                {lang === 'bn' ? stat.labelBn : toEnglishNumerals(stat.labelEn || stat.labelBn)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
