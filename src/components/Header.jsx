import React, { useState, useRef, useEffect } from 'react';
import SchoolLogo from './common/SchoolLogo';
import { useSchool } from '../context/useSchool';
import { 
  Globe, 
  Palette, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  ShieldCheck, 
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export default function Header() {
  const { lang, toggleLanguage, theme, toggleTheme, activeTab, setActiveTab, schoolInfo, authUser, logout, setAuthModalOpen } = useSchool();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFocusedInside, setIsFocusedInside] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState(null);
  const [hasUnreadNotice, setHasUnreadNotice] = useState(true);

  const navContainerRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  // Passive, throttled scroll listener for performance
  useEffect(() => {
    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, (currentScrollY / docHeight) * 100)) : 0;
      setScrollProgress(progress);

      // State A vs State B threshold at 20px
      const scrolled = currentScrollY >= 20;
      setIsScrolled(scrolled);

      // Smart hide / show:
      // Scrolling down past 300px slides navbar up out of view
      // Scrolling up any amount slides navbar back in immediately
      const scrollingDown = currentScrollY > lastScrollYRef.current + 4;
      const scrollingUp = currentScrollY < lastScrollYRef.current - 2;

      if (currentScrollY > 300 && scrollingDown && !mobileMenuOpen) {
        setIsNavHidden(true);
      } else if (scrollingUp || currentScrollY <= 20) {
        setIsNavHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
      tickingRef.current = false;
    };

    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(updateScroll);
        tickingRef.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation: Escape key closes menus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    {
      id: 'home',
      labelBn: 'হোম',
      labelEn: 'Home',
      directTab: 'home',
    },
    {
      id: 'about',
      labelBn: 'পরিচিতি',
      labelEn: 'About',
      directTab: 'about',
      children: [
        { id: 'about', labelBn: 'পরিচিতি ও ইতিহাস', labelEn: 'About & History' },
        { id: 'faculty', labelBn: 'শিক্ষক ও কর্মচারী', labelEn: 'Faculty & Staff' },
        { id: 'uniform', labelBn: 'পোশাক ও ইউনিফর্ম', labelEn: 'Dress Code & Uniform' },
        { id: 'gallery', labelBn: 'ফটো গ্যালারি', labelEn: 'Photo Gallery' },
      ]
    },
    {
      id: 'notices',
      labelBn: 'নোটিশ',
      labelEn: 'Notices',
      directTab: 'notices',
    },
    {
      id: 'academics',
      labelBn: 'একাডেমিক',
      labelEn: 'Academic',
      directTab: 'academics',
      children: [
        { id: 'academics', labelBn: 'একাডেমিক কার্যক্রম', labelEn: 'Academic Programs' },
        { id: 'routines', labelBn: 'রুটিন ও সিলেবাস', labelEn: 'Routines & Syllabus' },
        { id: 'facebookHub', labelBn: 'ফেসবুক মিডিয়া হাব', labelEn: 'Facebook Media Hub' },
      ]
    },
    {
      id: 'admission',
      labelBn: 'ভর্তি',
      labelEn: 'Admission',
      directTab: 'admission',
    },
    {
      id: 'results',
      labelBn: 'ফলাফল',
      labelEn: 'Results',
      directTab: 'results',
    },
    {
      id: 'contact',
      labelBn: 'যোগাযোগ',
      labelEn: 'Contact',
      directTab: 'contact',
    },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isItemActive = (item) => {
    if (item.children) {
      return item.children.some((child) => child.id === activeTab) || activeTab === item.directTab;
    }
    return activeTab === item.directTab;
  };

  const toggleMobileSection = (id) => {
    setMobileExpandedSection(prev => prev === id ? null : id);
  };

  const shouldHideNavbar = isNavHidden && !isFocusedInside && !mobileMenuOpen;

  return (
    <>
      {/* FLOATING GLASS CAPSULE NAVBAR */}
      <header
        ref={navContainerRef}
        data-scrolled={isScrolled ? "true" : "false"}
        data-hidden={shouldHideNavbar ? "true" : "false"}
        onFocus={() => setIsFocusedInside(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsFocusedInside(false);
          }
        }}
        className={`fixed left-1/2 z-50 no-print rounded-full overflow-hidden floating-glass-pill ${
          shouldHideNavbar 
            ? '-translate-x-1/2 -translate-y-[135%]' 
            : '-translate-x-1/2 translate-y-0'
        } ${
          isScrolled
            ? 'top-[10px] w-[calc(100%-1.5rem)] max-w-[1260px] h-[58px] bg-deep/90 backdrop-blur-[14px] backdrop-saturate-[140%] border border-white/[0.14] shadow-[0_12px_32px_rgba(0,0,0,0.18)] floating-glass-scrolled'
            : 'top-[16px] w-[calc(100%-2rem)] max-w-[1360px] h-[72px] bg-deep border border-white/[0.12] shadow-lg'
        }`}
      >
        <nav className="w-full h-full px-3 sm:px-5 xl:px-6 flex items-center justify-between gap-2 sm:gap-3 xl:gap-4 select-none">
          {/* LEFT BRAND IDENTITY: CIRCULAR EMBLEM + NAME (Never truncate on desktop) */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 min-w-max"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNavClick('home')}
            aria-label="হোমপেজে ফিরে যান"
          >
            <div 
              className={`bg-white rounded-full p-1 ring-2 ring-accent shrink-0 shadow-md transition-all duration-300 group-hover:scale-105 ${
                isScrolled ? 'w-9 h-9 scale-[0.88]' : 'w-11 h-11 scale-100'
              }`}
            >
              <SchoolLogo logo={schoolInfo.logo} />
            </div>

            <div className="hidden sm:block shrink-0 transition-all duration-300">
              <h1 className={`text-white font-bold font-bangla whitespace-nowrap leading-tight tracking-normal transition-all duration-300 group-hover:text-accent ${
                isScrolled ? 'text-xs sm:text-sm' : 'text-xs sm:text-base'
              }`}>
                {lang === 'bn' ? schoolInfo.nameBn : (schoolInfo.nameEn || 'Bandua Daulatpur High School')}
              </h1>
              <p className={`text-white/90 font-sans tracking-wide whitespace-nowrap transition-all duration-300 overflow-hidden ${
                isScrolled 
                  ? 'opacity-0 max-h-0 -translate-y-1' 
                  : 'opacity-100 max-h-4 text-[10px] sm:text-[11px] mt-0.5 translate-y-0'
              }`}>
                {schoolInfo.nameEn || 'Bandua Daulatpur High School'}
              </p>
            </div>
          </div>

          {/* CENTER: DESKTOP NAVIGATION ITEMS */}
          <ul className="hidden lg:flex items-center gap-0.5 xl:gap-2 flex-nowrap h-full">
            {navItems.map((item) => {
              const active = isItemActive(item);
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const isDropdownOpen = activeDropdown === item.id;

              return (
                <li 
                  key={item.id} 
                  className="relative h-full flex items-center"
                  onMouseEnter={() => hasChildren && setActiveDropdown(item.id)}
                  onMouseLeave={() => hasChildren && setActiveDropdown(null)}
                >
                  <a
                    href={`#${item.directTab}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.directTab);
                    }}
                    aria-label={lang === 'bn' ? item.labelBn : item.labelEn}
                    className={`px-2.5 xl:px-4 py-1.5 xl:py-2 rounded-full transition-all duration-200 flex items-center justify-center text-center cursor-pointer focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
                      active 
                        ? 'bg-white/[0.14] text-white shadow-xs font-bold' 
                        : 'text-white/90 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <span className="font-bangla font-semibold text-xs xl:text-sm leading-none flex items-center gap-1 xl:gap-1.5">
                      <span>{lang === 'bn' ? item.labelBn : item.labelEn}</span>
                      {active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-xs"></span>
                      )}
                    </span>
                  </a>

                  {/* Dropdown Menu for Subpages */}
                  {hasChildren && isDropdownOpen && (
                    <div className="absolute top-[85%] left-1/2 -translate-x-1/2 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="bg-deep/95 backdrop-blur-md rounded-2xl p-1.5 min-w-[210px] space-y-1 shadow-2xl border border-white/15">
                        {item.children.map((child) => {
                          const isChildActive = activeTab === child.id;
                          return (
                            <a
                              key={child.id}
                              href={`#${child.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleNavClick(child.id);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between font-bangla cursor-pointer focus-visible:outline-2 focus-visible:outline-accent ${
                                isChildActive
                                  ? 'bg-white/[0.15] text-white font-bold shadow-xs'
                                  : 'text-white hover:text-accent hover:bg-white/[0.08]'
                              }`}
                            >
                              <span>{lang === 'bn' ? child.labelBn : child.labelEn}</span>
                              {isChildActive ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 opacity-90" />
                              )}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-1 sm:gap-2 xl:gap-2.5 shrink-0">
            {/* Primary Action Button: "পোর্টাল লগইন" in Amber */}
            {authUser ? (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`bg-accent hover:bg-accent-hover text-accent-ink font-bold rounded-full transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-xs hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
                    isScrolled 
                      ? 'px-3 sm:px-3.5 xl:px-4 py-1.5 text-xs' 
                      : 'px-3 sm:px-4 xl:px-5 py-1.5 xl:py-2 text-xs sm:text-sm'
                  }`}
                  title="Open CMS Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-accent-ink" />
                  <span>{lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
                </button>
                <button
                  onClick={logout}
                  className={`rounded-full bg-white/10 hover:bg-danger-soft hover:text-danger border border-white/15 text-white/90 flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 focus-visible:outline-2 focus-visible:outline-accent ${
                    isScrolled ? 'w-8.5 h-8.5 xl:w-9 xl:h-9' : 'w-8.5 h-8.5 sm:w-9 sm:h-9 xl:w-10 xl:h-10'
                  }`}
                  title="লগআউট (Logout)"
                  aria-label="লগআউট"
                >
                  <LogOut className="w-3.5 h-3.5 text-white/80" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className={`bg-accent hover:bg-accent-hover text-accent-ink font-bold rounded-full transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-xs hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
                  isScrolled 
                    ? 'px-3 sm:px-3.5 xl:px-4 py-1.5 text-xs' 
                    : 'px-3 sm:px-4 xl:px-5 py-1.5 xl:py-2 text-xs sm:text-sm'
                }`}
                title="School Portal Login"
              >
                <span>{lang === 'bn' ? 'পোর্টাল লগইন' : 'Portal Login'}</span>
              </button>
            )}

            {/* Language Switcher - Round Icon Button */}
            <button
              onClick={toggleLanguage}
              className={`rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
                isScrolled ? 'w-8.5 h-8.5 xl:w-9 xl:h-9' : 'w-8.5 h-8.5 sm:w-9 sm:h-9 xl:w-10 xl:h-10'
              }`}
              title="ভাষা পরিবর্তন (Toggle Language)"
              aria-label="ভাষা পরিবর্তন (Toggle Language)"
            >
              <Globe className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-white" />
            </button>

            {/* Theme Toggle Button - Round Icon Button with Palette & Preview Dot */}
            <button
              onClick={toggleTheme}
              className={`rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all duration-300 cursor-pointer relative active:scale-95 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
                isScrolled ? 'w-8.5 h-8.5 xl:w-9 xl:h-9' : 'w-8.5 h-8.5 sm:w-9 sm:h-9 xl:w-10 xl:h-10'
              }`}
              title={
                theme === 'emerald'
                  ? (lang === 'bn' ? 'ইন্ডিগো থিম' : 'Switch to Indigo theme')
                  : (lang === 'bn' ? 'এমেরাল্ড থিম' : 'Switch to Emerald theme')
              }
              aria-label="রঙের থিম পরিবর্তন করুন"
            >
              <Palette className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-white" />
              <span
                className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-1 ring-white/60 ${
                  theme === 'emerald' ? 'bg-[#FACC15]' : 'bg-[#E8B931]'
                }`}
                aria-hidden="true"
              />
            </button>

            {/* Notice Bell Indicator - Round Icon Button */}
            <button
              onClick={() => {
                setHasUnreadNotice(false);
                handleNavClick('notices');
              }}
              className={`rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all duration-300 cursor-pointer relative active:scale-95 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
                isScrolled ? 'w-8.5 h-8.5 xl:w-9 xl:h-9' : 'w-8.5 h-8.5 sm:w-9 sm:h-9 xl:w-10 xl:h-10'
              }`}
              title="নোটিফিকেশন (Notification)"
              aria-label="নোটিফিকেশন (Notification)"
            >
              <Bell className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-white" />
              {hasUnreadNotice && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-deep"></span>
              )}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 ${
                isScrolled ? 'w-8.5 h-8.5' : 'w-9 h-9 sm:w-10 sm:h-10'
              }`}
              aria-label="মেনু খুলুন / বন্ধ করুন"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* THIN 2.5px AMBER SCROLL PROGRESS LINE (CLIPPED BY PILL RADIUS) */}
        <div 
          className="absolute bottom-0 left-0 h-[2.5px] bg-accent rounded-full pointer-events-none transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </header>

      {/* MOBILE SLIDE-IN DRAWER FROM RIGHT */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop Fade */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 no-print"
            aria-hidden="true"
          />

          {/* Full-Height Right Drawer */}
          <aside 
            className="fixed top-0 right-0 bottom-0 w-[290px] sm:w-[320px] bg-deep z-50 shadow-2xl border-l border-white/15 p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 no-print"
            role="dialog"
            aria-modal="true"
            aria-label="মোবাইল নেভিগেশন মেনু"
          >
            <div>
              {/* Drawer Top Header with Close Button */}
              <div className="flex items-center justify-between pb-4 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-white rounded-full p-1 ring-2 ring-accent">
                    <SchoolLogo logo={schoolInfo.logo} />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xs font-bangla leading-tight">
                      {lang === 'bn' ? schoolInfo.nameBn : schoolInfo.nameEn}
                    </h2>
                    <p className="text-white/90 text-[10px] font-mono">
                      EIIN: {schoolInfo.eiin || '106644'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                  aria-label="মেনু বন্ধ করুন"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Drawer Theme Toggle Row */}
              <div className="mt-3 flex items-center justify-between p-2.5 rounded-xl bg-white/10 border border-white/15 font-bangla">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-accent" />
                  <span className="text-white text-xs font-semibold">
                    {lang === 'bn' ? 'রঙের থিম' : 'Color Theme'}
                  </span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-3 py-1 rounded-lg bg-accent text-accent-ink text-xs font-bold transition active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title={
                    theme === 'emerald'
                      ? (lang === 'bn' ? 'ইন্ডিগো থিম' : 'Switch to Indigo theme')
                      : (lang === 'bn' ? 'এমেরাল্ড থিম' : 'Switch to Emerald theme')
                  }
                  aria-label="রঙের থিম পরিবর্তন করুন"
                >
                  <span>
                    {theme === 'emerald'
                      ? (lang === 'bn' ? 'ইন্ডিগো' : 'Indigo')
                      : (lang === 'bn' ? 'এমেরাল্ড' : 'Emerald')}
                  </span>
                </button>
              </div>

              {/* Navigation Links List */}
              <nav className="mt-5 space-y-1.5 font-bangla">
                {navItems.map((item) => {
                  const active = isItemActive(item);
                  const hasChildren = Boolean(item.children && item.children.length > 0);
                  const isExpanded = mobileExpandedSection === item.id;

                  return (
                    <div key={item.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <a
                          href={`#${item.directTab}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(item.directTab);
                          }}
                          className={`flex-1 text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-between ${
                            active 
                              ? 'bg-white/[0.14] text-white shadow-xs' 
                              : 'text-white hover:text-accent hover:bg-white/[0.08]'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {active && <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>}
                            <span>{lang === 'bn' ? item.labelBn : item.labelEn}</span>
                          </span>
                        </a>

                        {hasChildren && (
                          <button
                            onClick={() => toggleMobileSection(item.id)}
                            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white/70 hover:text-white transition cursor-pointer"
                            aria-expanded={isExpanded}
                            aria-label={isExpanded ? (lang === 'bn' ? 'সাব-মেনু বন্ধ করুন' : 'Close sub-menu') : (lang === 'bn' ? 'সাব-মেনু খুলুন' : 'Open sub-menu')}>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-accent' : ''}`} />
                          </button>
                        )}
                      </div>

                      {/* Mobile Sub-items */}
                      {hasChildren && isExpanded && (
                        <div className="pl-6 space-y-1 py-1 border-l-2 border-white/15 ml-3 animate-in fade-in duration-200">
                          {item.children.map((child) => {
                            const isChildActive = activeTab === child.id;
                            return (
                              <a
                                key={child.id}
                                href={`#${child.id}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleNavClick(child.id);
                                }}
                                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                                  isChildActive 
                                    ? 'bg-white/[0.12] text-white font-bold' 
                                    : 'text-white hover:text-accent hover:bg-white/[0.06]'
                                }`}
                              >
                                <span>{lang === 'bn' ? child.labelBn : child.labelEn}</span>
                                {isChildActive && <span className="w-1 h-1 rounded-full bg-accent"></span>}
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-4 border-t border-white/15 space-y-3 font-bangla">
              {authUser ? (
                <div className="space-y-2">
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="w-full bg-accent hover:bg-accent-hover text-accent-ink font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'ড্যাশবোর্ড প্রবেশ করুন' : 'Open Dashboard'}</span>
                  </button>
                  <button
                    onClick={logout}
                    className="w-full bg-white/10 hover:bg-danger-soft text-white hover:text-danger font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'লগআউট' : 'Logout'}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full bg-accent hover:bg-accent-hover text-accent-ink font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>{lang === 'bn' ? 'পোর্টাল লগইন' : 'Portal Login'}</span>
                </button>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
}