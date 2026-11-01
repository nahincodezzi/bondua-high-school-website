import React, { useState, useEffect } from 'react';
import { useSchool } from '../context/useSchool';
import { 
  ChevronLeft, 
  ChevronRight, 
  GraduationCap, 
  FileText, 
  Sparkles, 
  Share2,
  Shirt
} from 'lucide-react';

export default function HeroSlider() {
  const { lang, setActiveTab, schoolInfo, heroSlides } = useSchool();
  const slides = heroSlides && heroSlides.length > 0 ? heroSlides : [];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative bg-slate-900 text-white overflow-hidden shadow-xl no-print">
      {/* Background Slides */}
      <div className="relative h-[560px] sm:h-[550px] md:h-[600px] w-full">
        {slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Dark Gradient Overlay */}
            <img
              src={slide.image}
              alt={slide.titleEn || slide.titleBn}
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-7000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-slate-950/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30"></div>

            {/* Slide Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
                <div className="max-w-2xl space-y-4">
                  {/* Tag Pill & Location Indicator */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-md font-bangla">
                      <Sparkles className="w-4 h-4 text-emerald-900" />
                      <span>{lang === 'bn' ? slide.tagBn : slide.tagEn}</span>
                    </div>

                    <span className="bg-emerald-900/90 text-amber-300 border border-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full font-bangla hidden sm:inline-flex">
                      {lang === 'bn' ? (schoolInfo.roadBn || 'ফেনী-পরশুরাম রোড সংলগ্ন') : (schoolInfo.roadEn || 'Situated along Feni-Parshuram Road')}
                    </span>
                  </div>

                  {/* Main Title */}
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-bangla leading-tight text-white drop-shadow-md">
                    {lang === 'bn' ? slide.titleBn : slide.titleEn}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-sm sm:text-lg text-slate-200 font-bangla leading-relaxed max-w-xl">
                    {lang === 'bn' ? slide.subtitleBn : slide.subtitleEn}
                  </p>

                  {/* Quick Uniform Callout Tag */}
                  <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-emerald-500/50 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs text-emerald-100 font-bangla">
                    <Shirt className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      {lang === 'bn' 
                        ? 'নির্ধারিত স্কুল পোশাক: ছাত্র—সাদা শার্ট ও নীল প্যান্ট | ছাত্রী—লাল ড্রেস'
                        : 'Dress Code: Boys (White Shirt & Blue Pant), Girls (Red Dress)'}
                    </span>
                  </div>

                  {/* Call to Actions */}
                  <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => setActiveTab('admission')}
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-base shadow-lg hover:shadow-amber-400/20 transition transform hover:-translate-y-0.5 flex items-center gap-1.5 sm:gap-2 font-bangla"
                    >
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-950" />
                      <span>{lang === 'bn' ? 'অনলাইন ভর্তি আবেদন ২০২৬' : 'Apply for Admission'}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('results')}
                      className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-base border border-emerald-500 shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-1.5 sm:gap-2 font-bangla"
                    >
                      <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                      <span>{lang === 'bn' ? 'ফলাফল অনুসন্ধান' : 'Check Results'}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('uniform')}
                      className="bg-slate-800/80 hover:bg-slate-800 text-amber-300 border border-slate-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 sm:gap-2 font-bangla"
                    >
                      <Shirt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{lang === 'bn' ? 'পোশাক নীতিমালা' : 'Dress Code Policy'}</span>
                    </button>

                    <a
                      href={schoolInfo.facebookGroupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600/90 hover:bg-blue-600 text-white font-semibold px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm transition flex items-center gap-1.5 sm:gap-2"
                      title="Join Facebook Group"
                    >
                      <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-200" />
                      <span className="hidden sm:inline">{lang === 'bn' ? 'ফেসবুক গ্রুপ' : 'Facebook Group'}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition border border-white/20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition border border-white/20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === currentSlide ? 'w-8 h-2.5 bg-amber-400' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Stat Bar Bottom Ribbon */}
      <div className="relative z-20 bg-emerald-950/95 border-t border-emerald-800/80 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="border-r border-emerald-800/60 last:border-none px-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">1990</p>
            <p className="text-xs sm:text-sm text-emerald-200 font-bangla">
              {lang === 'bn' ? 'স্থাপিত: ১৯৯০ (স্বীকৃতি: ১৯৯৪)' : 'Estd. 1990 (Recog. 1994)'}
            </p>
          </div>
          <div className="border-r border-emerald-800/60 last:border-none px-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">850+</p>
            <p className="text-xs sm:text-sm text-emerald-200 font-bangla">
              {lang === 'bn' ? 'বর্তমান শিক্ষার্থী' : 'Enrolled Students'}
            </p>
          </div>
          <div className="border-r border-emerald-800/60 last:border-none px-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">106644</p>
            <p className="text-xs sm:text-sm text-emerald-200 font-bangla">
              {lang === 'bn' ? 'EIIN নম্বর (কুমিল্লা বোর্ড)' : 'EIIN Code (Comilla Board)'}
            </p>
          </div>
          <div className="px-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {lang === 'bn' ? '৩টি শাখা' : '3 Groups'}
            </p>
            <p className="text-xs sm:text-sm text-emerald-200 font-bangla">
              {lang === 'bn' ? 'বিজ্ঞান, ব্যবসায় ও মানবিক' : 'Science, Business & Humanities'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
