import React, { useState } from 'react';
import { useSchool } from '../context/useSchool';
import { 
  Phone, 
  MapPin, 
  Globe, 
  LogIn, 
  LogOut, 
  Menu, 
  X, 
  Award, 
  BookOpen, 
  UserCheck, 
  FileText, 
  Share2,
  ShieldCheck,
  Mail
} from 'lucide-react';

export default function Header() {
  const { lang, toggleLanguage, activeTab, setActiveTab, schoolInfo, authUser, logout, setAuthModalOpen } = useSchool();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', labelBn: 'হোম', labelEn: 'Home' },
    { id: 'about', labelBn: 'পরিচিতি ও ইতিহাস', labelEn: 'About School' },
    { id: 'uniform', labelBn: 'পোশাক ও ইউনিফর্ম', labelEn: 'Dress Code', badge: 'ড্রেস কোড', badgeEn: 'Uniform' },
    { id: 'notices', labelBn: 'নোটিশ বোর্ড', labelEn: 'Notice Board' },
    { id: 'academics', labelBn: 'একাডেমিক', labelEn: 'Academics' },
    { id: 'faculty', labelBn: 'শিক্ষক ও কর্মচারী', labelEn: 'Faculty & Staff' },
    { id: 'admission', labelBn: 'অনলাইন ভর্তি', labelEn: 'Online Admission', highlight: true },
    { id: 'results', labelBn: 'অনলাইন ফলাফল', labelEn: 'Results', highlight: true },
    { id: 'gallery', labelBn: 'ফটো গ্যালারি', labelEn: 'Gallery' },
    { id: 'facebookHub', labelBn: 'ফেসবুক মিডিয়া হাব', labelEn: 'FB Media Hub' },
    { id: 'routines', labelBn: 'রুটিন ও সিলেবাস', labelEn: 'Routines' },
    { id: 'contact', labelBn: 'যোগাযোগ', labelEn: 'Contact' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md border-b border-emerald-900/10 no-print">
      {/* Top Info Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 sm:px-8 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left Metadata */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 font-medium">
            <span className="flex items-center gap-1 bg-emerald-800/80 px-2 py-0.5 rounded text-amber-300 font-semibold tracking-wide">
              EIIN: {schoolInfo.eiin}
            </span>
            <span className="hidden md:inline-flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              {lang === 'bn' ? 'কুমিল্লা শিক্ষাবোর্ড (স্থাপিত ১৯৯০, স্বীকৃতি ১৯৯৪)' : 'Comilla Board (Estd. 1990, Recog. 1994)'}
            </span>
            <span className="hidden lg:inline-flex items-center gap-1 text-emerald-200">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'bn' ? `${schoolInfo.roadBn || 'ফেনী-পরশুরাম রোড সংলগ্ন'} • আনন্দপুর, ফুলগাজী, ফেনী` : `${schoolInfo.roadEn || 'Along Feni-Parshuram Road'} • Anandapur, Fulgazi, Feni`}</span>
            </span>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <a 
              href={`mailto:${schoolInfo.email}`} 
              className="hidden xl:flex items-center gap-1 text-emerald-200 hover:text-amber-300 transition-colors font-mono"
            >
              <Mail className="w-3 h-3 text-amber-400" />
              <span>{schoolInfo.email}</span>
            </a>

            <a 
              href={`tel:${schoolInfo.phone}`} 
              className="hidden sm:flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span className="font-mono">{schoolInfo.phone}</span>
            </a>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-700 text-amber-300 px-2.5 py-0.5 rounded-full border border-emerald-700 transition font-semibold text-xs"
              title="Toggle Bengali / English"
            >
              <Globe className="w-3 h-3" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Auth Button */}
            {authUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('admin')}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-3 py-0.5 rounded text-xs transition flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>{lang === 'bn' ? 'সিএমএস ড্যাশবোর্ড' : 'CMS Portal'}</span>
                </button>
                <button
                  onClick={logout}
                  className="text-emerald-300 hover:text-white transition p-1"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-2.5 py-0.5 rounded font-bold text-xs shadow-sm transition"
              >
                <LogIn className="w-3 h-3" />
                <span>{lang === 'bn' ? 'পোর্টাল লগইন' : 'Portal Login'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Brand Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white py-3.5 px-4 sm:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 sm:gap-4 cursor-pointer group"
          >
            {/* School Crest Emblem */}
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-white rounded-full p-1 shadow-lg ring-2 ring-amber-400/80 group-hover:scale-105 transition-transform duration-300">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="46" fill="#064e3b" stroke="#f59e0b" strokeWidth="4"/>
                <circle cx="50" cy="50" r="39" fill="#ffffff" stroke="#064e3b" strokeWidth="1"/>
                <circle cx="50" cy="40" r="11" fill="#f59e0b"/>
                <path d="M 30 58 Q 50 52 50 64 Q 50 52 70 58 L 70 66 Q 50 60 50 72 Q 50 60 30 66 Z" fill="#064e3b"/>
                <path d="M 50 64 L 50 72" stroke="#ffffff" strokeWidth="1.5"/>
                <path d="M 50 28 L 53 37 L 47 37 Z" fill="#d97706"/>
                <polygon points="50,14 52,18 56,18 53,21 54,25 50,22 46,25 47,21 44,18 48,18" fill="#f59e0b"/>
                <text x="50" y="80" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#064e3b">ESTD 1990</text>
                <text x="50" y="87" textAnchor="middle" fontSize="5" fontWeight="600" fill="#64748b">EIIN: 106644</text>
              </svg>
            </div>

            {/* School Typography */}
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400/20 text-amber-300 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded border border-amber-400/30">
                  {lang === 'bn' ? 'সরকারি স্বীকৃতিপ্রাপ্ত' : 'Govt. Recognized'}
                </span>
                <span className="text-emerald-300 text-xs font-mono hidden sm:inline">MPO: {schoolInfo.mpoCode}</span>
                <span className="text-amber-300 text-xs font-mono hidden md:inline">EIIN: {schoolInfo.eiin}</span>
              </div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold font-bangla tracking-wide text-white drop-shadow-sm leading-tight mt-0.5">
                {lang === 'bn' ? schoolInfo.nameBn : schoolInfo.nameEn}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200 font-medium">
                {lang === 'bn' 
                  ? `${schoolInfo.nameEn || 'Bandua Daulatpur High School'} • ${schoolInfo.roadBn || 'ফেনী-পরশুরাম রোড সংলগ্ন'}, আনন্দপুর, ফুলগাজী, ফেনী` 
                  : `${schoolInfo.nameEn || 'Bandua Daulatpur High School'} • ${schoolInfo.roadEn || 'Along Feni-Parshuram Road'}, Anandapur, Fulgazi, Feni`}
              </p>
            </div>
          </div>

          {/* Quick Badges on Desktop */}
          <div className="hidden xl:flex items-center gap-4">
            <div className="bg-emerald-800/60 border border-emerald-700/60 rounded-lg p-2.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-emerald-300 font-semibold">{lang === 'bn' ? 'আদর্শ ও লক্ষ্য' : 'School Motto'}</p>
                <p className="text-xs font-bold text-amber-300 font-bangla">{lang === 'bn' ? schoolInfo.mottoBn : schoolInfo.mottoEn}</p>
              </div>
            </div>

            <a
              href={schoolInfo.facebookGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-2 transition shadow"
              title="Official Facebook Group"
            >
              <Share2 className="w-4 h-4 text-blue-200" />
              <span>{lang === 'bn' ? 'অফিসিয়াল ফেসবুক গ্রুপ' : 'Official FB Group'}</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-emerald-800 text-white hover:bg-emerald-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Main Desktop Navigation Bar */}
      <nav className="bg-emerald-800 text-white hidden lg:block border-t border-emerald-700/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <ul className="flex items-center flex-wrap">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <li key={item.id} className="relative">
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-2.5 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 border-b-2 font-bangla ${
                      isActive
                        ? 'border-amber-400 bg-emerald-900 text-amber-300 shadow-inner'
                        : 'border-transparent text-emerald-100 hover:text-white hover:bg-emerald-700/80'
                    } ${item.highlight ? 'text-amber-300' : ''}`}
                  >
                    {lang === 'bn' ? item.labelBn : item.labelEn}
                    {item.badge && (
                      <span className="bg-amber-400 text-emerald-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                        {lang === 'bn' ? item.badge : (item.badgeEn || item.badge)}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Quick Result & Admission Action Buttons */}
          <div className="flex items-center gap-2 py-1">
            <button
              onClick={() => handleNavClick('admission')}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-3 py-1.5 rounded-md text-xs shadow-sm transition flex items-center gap-1 font-bangla"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'ভর্তি আবেদন' : 'Apply Online'}</span>
            </button>
            <button
              onClick={() => handleNavClick('results')}
              className="bg-emerald-900 hover:bg-emerald-950 text-emerald-200 hover:text-amber-300 border border-emerald-600 px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1 font-bangla"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'bn' ? 'ফলাফল' : 'Results'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-emerald-900 text-white border-t border-emerald-800 px-4 py-4 space-y-1 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-between font-bangla ${
                    isActive
                      ? 'bg-amber-400 text-emerald-950 font-bold shadow'
                      : 'text-emerald-100 hover:bg-emerald-800'
                  }`}
                >
                  <span>{lang === 'bn' ? item.labelBn : item.labelEn}</span>
                  {item.badge && (
                    <span className="bg-amber-400 text-emerald-950 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {lang === 'bn' ? item.badge : (item.badgeEn || item.badge)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-emerald-800/80 flex flex-col gap-2">
            <a
              href={schoolInfo.facebookGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>{lang === 'bn' ? 'আমাদের ফেসবুক গ্রুপে যুক্ত হোন' : 'Join Our Facebook Group'}</span>
            </a>

            <div className="flex gap-2">
              <button
                onClick={() => handleNavClick('admission')}
                className="flex-1 bg-amber-400 hover:bg-amber-300 text-emerald-950 py-2 rounded-lg text-xs font-bold text-center"
              >
                {lang === 'bn' ? 'ভর্তি আবেদন' : 'Apply Online'}
              </button>
              <button
                onClick={() => handleNavClick('results')}
                className="flex-1 bg-emerald-800 border border-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold text-center"
              >
                {lang === 'bn' ? 'ফলাফল অনুসন্ধান' : 'Find Result'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
