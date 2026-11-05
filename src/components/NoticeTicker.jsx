import React, { useState, useEffect } from 'react';
import { useSchool } from '../context/useSchool';
import { ChevronRight } from 'lucide-react';

export default function NoticeTicker() {
  const { lang, notices, setActiveTab, activeTab } = useSchool();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Take latest 5 notices
  const latestNotices = notices.slice(0, 5);

  useEffect(() => {
    if (latestNotices.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % latestNotices.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [latestNotices.length]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentNotice = latestNotices[currentIdx] || latestNotices[0];

  // If scrolled or on subpages where user is reading specific content, do not float over headings
  const shouldShow = activeTab === 'home' && !isScrolled;

  return (
    <div 
      className={`fixed top-18 sm:top-20 left-0 right-0 z-40 px-3 sm:px-6 pointer-events-none no-print transition-all duration-300 ${
        shouldShow 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-6 pointer-events-none'
      }`}
    >
      <div className="max-w-fit mx-auto pointer-events-auto">
        {/* Floating Frosted Notice Pill */}
        <div 
          onClick={() => setActiveTab('notices')}
          className="glass-capsule rounded-full px-3.5 sm:px-5 py-1 sm:py-1.5 text-xs text-white shadow-xl flex items-center gap-2 sm:gap-2.5 font-bangla cursor-pointer hover:border-amber-400/50 transition-all duration-300 group border border-white/20"
          title="Click to view all notices"
        >
          {/* Pulsing Red Dot & Urgent Tag */}
          <span className="inline-flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-white font-bold tracking-wide text-[11px] sm:text-xs drop-shadow-xs">
              {lang === 'bn' ? 'জরুরি বিজ্ঞপ্তি' : 'Notice'}
            </span>
          </span>

          <span className="text-white/40 font-mono text-[10px]">||</span>

          {/* Notice Title Preview */}
          {currentNotice && (
            <span className="text-emerald-100/90 group-hover:text-amber-300 font-medium transition-colors text-[11px] sm:text-xs max-w-[180px] sm:max-w-xs md:max-w-md truncate">
              {lang === 'bn' ? currentNotice.titleBn : currentNotice.titleEn}
            </span>
          )}

          <span className="text-white/40 font-mono text-[10px] hidden min-[400px]:inline">||</span>

          {/* View All Link Button */}
          <span className="text-amber-400 group-hover:text-amber-300 font-bold text-[11px] sm:text-xs flex items-center gap-0.5 shrink-0 whitespace-nowrap">
            <span>{lang === 'bn' ? 'সকল নোটিশ' : 'View All'}</span>
            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
