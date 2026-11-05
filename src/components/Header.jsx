import React, { useState, useRef, useEffect } from 'react';
import SchoolLogo from './common/SchoolLogo';
import { useSchool } from '../context/useSchool';
import { 
  Globe, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  ShieldCheck, 
  ChevronRight
} from 'lucide-react';

export default function Header() {
  const { lang, toggleLanguage, activeTab, setActiveTab, schoolInfo, authUser, logout, setAuthModalOpen } = useSchool();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navContainerRef = useRef(null);

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

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none no-print">
      <div className="max-w-[1240px] mx-auto pointer-events-auto">
        {/* Floating Glass Capsule Navbar */}
        <nav 
          ref={navContainerRef}
          className="glass-capsule rounded-full px-3.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 shadow-2xl transition-all duration-300"
        >
          {/* Left Brand Identity: Circular Emblem + 2-Line Name */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-full p-1 ring-2 ring-amber-400 shrink-0 shadow-md transition-transform duration-300 group-hover:scale-105">
              <SchoolLogo logo={schoolInfo.logo} />
            </div>

            <div className="hidden min-[420px]:block">
              <h1 className="text-white font-bold font-bangla text-xs sm:text-sm md:text-base leading-tight tracking-wide drop-shadow-sm group-hover:text-amber-300 transition-colors whitespace-nowrap">
                {lang === 'bn' ? schoolInfo.nameBn : schoolInfo.nameEn}
              </h1>
              <p className="text-amber-300/90 font-medium text-[9px] sm:text-[11px] font-sans tracking-wide">
                {schoolInfo.nameEn || 'Bondua Doulatpur High School'}
              </p>
            </div>
          </div>

          {/* Center: 7 Dual-Line Navigation Items (Bangla on Top, English below) */}
          <ul className="hidden lg:flex items-center gap-1.5 xl:gap-3 flex-nowrap">
            {navItems.map((item) => {
              const active = isItemActive(item);
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const isDropdownOpen = activeDropdown === item.id;

              return (
                <li 
                  key={item.id} 
                  className="relative"
                  onMouseEnter={() => hasChildren && setActiveDropdown(item.id)}
                  onMouseLeave={() => hasChildren && setActiveDropdown(null)}
                >
                  <button
                    onClick={() => handleNavClick(item.directTab)}
                    className={`px-2.5 xl:px-3 py-1 rounded-xl transition-all duration-200 flex flex-col items-center justify-center text-center group cursor-pointer ${
                      active ? 'text-amber-400' : 'text-white/85 hover:text-white'
                    }`}
                  >
                    {/* Top Bangla Label */}
                    <span className="font-bangla text-xs xl:text-sm font-bold tracking-wide leading-tight">
                      {item.labelBn}
                    </span>
                    {/* Bottom English Subtitle */}
                    <span className={`text-[9px] xl:text-[10px] font-sans tracking-wide transition-opacity ${
                      active ? 'text-amber-300 font-semibold' : 'text-white/60 group-hover:text-white/90'
                    }`}>
                      {item.labelEn}
                    </span>
                    {/* Active State Indicator Dot */}
                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs mx-auto mt-0.5 animate-in fade-in zoom-in duration-200"></span>
                    )}
                  </button>

                  {/* Frosted Glass Dropdown Menu */}
                  {hasChildren && isDropdownOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="glass-capsule rounded-2xl p-1.5 min-w-[210px] space-y-1 shadow-2xl border border-white/20">
                        {item.children.map((child) => {
                          const isChildActive = activeTab === child.id;
                          return (
                            <button
                              key={child.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavClick(child.id);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between font-bangla cursor-pointer ${
                                isChildActive
                                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                                  : 'text-white/90 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              <span>{lang === 'bn' ? child.labelBn : child.labelEn}</span>
                              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Right Action Icons & Golden Pill Login Button */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Primary Action Button: Golden Capsule Pill */}
            {authUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleNavClick('admin')}
                  className="btn-gold px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  title="Open CMS Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
                </button>
                <button
                  onClick={logout}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5 text-white/80" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="btn-gold px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 active:scale-95 cursor-pointer"
                title="School Portal Login"
              >
                <span>{lang === 'bn' ? 'পোর্টাল লগইন' : 'Portal Login'}</span>
              </button>
            )}

            {/* Language Switcher - Glass Circle Button */}
            <button
              onClick={toggleLanguage}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
              title="Toggle Bengali / English"
            >
              <Globe className="w-4 h-4 text-white" />
            </button>

            {/* Notice Bell Indicator - Glass Circle Button */}
            <button
              onClick={() => handleNavClick('notices')}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition active:scale-95 cursor-pointer relative"
              title="Notice Board"
            >
              <Bell className="w-4 h-4 text-white" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-950"></span>
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer - Frosted Glass Card */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-capsule rounded-3xl p-4 mt-2 max-h-[80vh] overflow-y-auto space-y-3 shadow-2xl border border-white/20 animate-in slide-in-from-top-2 duration-200 pointer-events-auto">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-white/10">
              <button
                onClick={() => handleNavClick('admission')}
                className="btn-gold py-2 px-3 text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>{lang === 'bn' ? 'অনলাইন ভর্তি' : 'Admission'}</span>
              </button>
              <button
                onClick={() => handleNavClick('results')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white py-2 px-3 rounded-full text-xs font-bold text-center flex items-center justify-center gap-1.5"
              >
                <span>{lang === 'bn' ? 'ফলাফল' : 'Results'}</span>
              </button>
            </div>

            {/* Nav Links */}
            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map((item) => {
                const active = isItemActive(item);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.directTab)}
                    className={`px-3 py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-between font-bangla border ${
                      active
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow'
                        : 'bg-white/5 border-white/10 text-white/90 hover:bg-white/15'
                    }`}
                  >
                    <span>{lang === 'bn' ? item.labelBn : item.labelEn}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                );
              })}
            </div>

            {/* Sub-items for mobile */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap gap-1.5 text-[11px] font-bangla">
              <button onClick={() => handleNavClick('faculty')} className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-white/80">
                👨‍🏫 {lang === 'bn' ? 'শিক্ষক ও কর্মচারী' : 'Faculty'}
              </button>
              <button onClick={() => handleNavClick('uniform')} className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-white/80">
                👕 {lang === 'bn' ? 'পোশাক ও ইউনিফর্ম' : 'Dress Code'}
              </button>
              <button onClick={() => handleNavClick('routines')} className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-white/80">
                📅 {lang === 'bn' ? 'রুটিন ও সিলেবাস' : 'Routines'}
              </button>
              <button onClick={() => handleNavClick('gallery')} className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-white/80">
                📸 {lang === 'bn' ? 'ফটো গ্যালারি' : 'Gallery'}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
