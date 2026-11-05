import React, { useState, useRef, useEffect } from 'react';
import SchoolLogo from './common/SchoolLogo';
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
  Mail,
  ChevronDown,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export default function Header() {
  const { lang, toggleLanguage, activeTab, setActiveTab, schoolInfo, authUser, logout, setAuthModalOpen } = useSchool();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState(null);
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

  const menuGroups = [
    {
      id: 'home',
      labelBn: 'হোম',
      labelEn: 'Home',
      directTab: 'home',
    },
    {
      id: 'about',
      labelBn: 'পরিচিতি',
      labelEn: 'About School',
      directTab: 'about',
      children: [
        { id: 'about', labelBn: 'পরিচিতি ও ইতিহাস', labelEn: 'About & History', descBn: 'বিদ্যালয়ের পটভূমি ও তথ্য' },
        { id: 'faculty', labelBn: 'শিক্ষক ও কর্মচারী', labelEn: 'Faculty & Staff', descBn: 'শিক্ষকমণ্ডলী ও স্টাফ তালিকা' },
        { id: 'uniform', labelBn: 'পোশাক ও ইউনিফর্ম', labelEn: 'Uniform & Dress Code', descBn: 'নির্ধারিত স্কুল ড্রেস কোড' },
      ]
    },
    {
      id: 'academics',
      labelBn: 'একাডেমিক',
      labelEn: 'Academics',
      directTab: 'academics',
      children: [
        { id: 'academics', labelBn: 'একাডেমিক কার্যক্রম', labelEn: 'Academic Programs', descBn: 'শাখা, বিষয় ও সুবিধা' },
        { id: 'routines', labelBn: 'রুটিন ও সিলেবাস', labelEn: 'Routines & Syllabus', descBn: 'ক্লাস ও পরীক্ষার সময়সূচি' },
      ]
    },
    {
      id: 'notices',
      labelBn: 'নোটিশ বোর্ড',
      labelEn: 'Notice Board',
      directTab: 'notices',
    },
    {
      id: 'media',
      labelBn: 'গ্যালারি ও মিডিয়া',
      labelEn: 'Media & Gallery',
      directTab: 'gallery',
      children: [
        { id: 'gallery', labelBn: 'ফটো গ্যালারি', labelEn: 'Photo Gallery', descBn: 'অনুষ্ঠান ও ক্যাম্পাসের ছবি' },
        { id: 'facebookHub', labelBn: 'ফেসবুক মিডিয়া হাব', labelEn: 'Facebook Media Hub', descBn: 'অফিসিয়াল গ্রুপের আপডেট' },
      ]
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

  const isGroupActive = (group) => {
    if (group.children) {
      return group.children.some((child) => child.id === activeTab);
    }
    return activeTab === group.directTab;
  };

  const toggleMobileGroup = (groupId) => {
    setMobileExpandedGroup((prev) => (prev === groupId ? null : groupId));
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md border-b border-emerald-900/10 no-print">
      {/* Top Info Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 sm:px-8 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Left Metadata */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 font-medium">
            <span className="flex items-center gap-1 bg-emerald-800/90 px-2.5 py-1 rounded-md text-amber-400 font-semibold tracking-wide border border-emerald-700/60">
              EIIN: {schoolInfo.eiin}
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-emerald-200">
              <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{lang === 'bn' ? 'কুমিল্লা শিক্ষাবোর্ড (স্থাপিত ১৯৯০, স্বীকৃতি ১৯৯৪)' : 'Comilla Board (Estd. 1990, Recog. 1994)'}</span>
            </span>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-emerald-200">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{lang === 'bn' ? `${schoolInfo.roadBn || 'ফেনী-পরশুরাম রোড সংলগ্ন'} • আনন্দপুর, ফুলগাজী, ফেনী` : `${schoolInfo.roadEn || 'Along Feni-Parshuram Road'} • Anandapur, Fulgazi, Feni`}</span>
            </span>
          </div>

          {/* Right Action Bar (Boxed Buttons with Unified Gold Tone) */}
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
            <a 
              href={`mailto:${schoolInfo.email}`} 
              className="hidden xl:flex items-center gap-1.5 text-emerald-200 hover:text-amber-300 transition-colors font-mono"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{schoolInfo.email}</span>
            </a>

            <a 
              href={`tel:${schoolInfo.phone}`} 
              className="hidden sm:flex items-center gap-1.5 text-emerald-200 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono">{schoolInfo.phone}</span>
            </a>

            {/* Language Switcher - Clean Box Shape */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 bg-emerald-800/90 hover:bg-emerald-700 text-emerald-100 hover:text-amber-300 px-2.5 py-1 rounded-lg border border-emerald-700 transition-all font-semibold text-xs active:scale-95 cursor-pointer shadow-xs"
              title="Toggle Bengali / English"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Auth / CMS Dashboard Button - Unified Brand Gold Button */}
            {authUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleNavClick('admin')}
                  className="bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold px-3 py-1 rounded-lg text-xs transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  title="Open CMS Management Workspace"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-950" />
                  <span>{lang === 'bn' ? 'সিএমএস ড্যাশবোর্ড' : 'CMS Portal'}</span>
                </button>
                <button
                  onClick={logout}
                  className="text-emerald-300 hover:text-white hover:bg-emerald-800/80 p-1 rounded-lg transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-emerald-950 px-3 py-1 rounded-lg font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                title="School Portal Login"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-950" />
                <span>{lang === 'bn' ? 'পোর্টাল লগইন' : 'Portal Login'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Brand Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white py-3 sm:py-3.5 px-4 sm:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 sm:gap-4 cursor-pointer group"
          >
            {/* School Crest Emblem */}
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-white rounded-full p-1 shadow-lg ring-2 ring-amber-400 group-hover:scale-105 transition-transform duration-300">
              <SchoolLogo logo={schoolInfo.logo} />
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
          <div className="hidden xl:flex items-center gap-3.5">
            <div className="bg-emerald-800/60 border border-emerald-700/60 rounded-xl p-2.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
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
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition shadow cursor-pointer active:scale-95"
              title="Official Facebook Group"
            >
              <Share2 className="w-4 h-4 text-blue-200" />
              <span>{lang === 'bn' ? 'অফিসিয়াল ফেসবুক গ্রুপ' : 'Official FB Group'}</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-emerald-800 text-white hover:bg-emerald-700 focus:outline-none transition active:scale-95 border border-emerald-700"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Main Desktop Navigation Bar - Redesigned as a Sleek Box-Shaped Nav Island */}
      <nav className="bg-emerald-900 text-white hidden lg:block border-t border-emerald-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2">
          {/* Box-Shaped Inner Navigation Track */}
          <div 
            ref={navContainerRef}
            className="bg-emerald-950/75 border border-emerald-700/60 rounded-xl px-2 py-1.5 shadow-inner flex items-center justify-between gap-3"
          >
            {/* Left: Box-Shaped Menu Item Buttons */}
            <ul className="flex items-center gap-1.5 flex-nowrap">
              {menuGroups.map((group) => {
                const active = isGroupActive(group);
                const hasChildren = Boolean(group.children && group.children.length > 0);
                const isDropdownOpen = activeDropdown === group.id;

                return (
                  <li 
                    key={group.id} 
                    className="relative"
                    onMouseEnter={() => hasChildren && setActiveDropdown(group.id)}
                    onMouseLeave={() => hasChildren && setActiveDropdown(null)}
                  >
                    <button
                      onClick={() => {
                        if (group.directTab) {
                          handleNavClick(group.directTab);
                        }
                      }}
                      className={`px-3 xl:px-3.5 py-2 rounded-lg text-xs xl:text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 font-bangla select-none cursor-pointer border ${
                        active
                          ? 'bg-emerald-800 text-amber-300 border-amber-400/50 shadow-xs font-bold'
                          : 'border-transparent text-emerald-100 hover:text-white hover:bg-emerald-850 hover:border-emerald-700/60'
                      }`}
                    >
                      <span>{lang === 'bn' ? group.labelBn : group.labelEn}</span>
                      {hasChildren && (
                        <ChevronDown 
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isDropdownOpen ? 'rotate-180 text-amber-400' : 'text-emerald-400'
                          }`} 
                        />
                      )}
                    </button>

                    {/* Boxed Dropdown Menu Flyout */}
                    {hasChildren && isDropdownOpen && (
                      <div className="absolute top-full left-0 pt-2 z-50">
                        <div className="bg-emerald-950/98 backdrop-blur-md border border-emerald-700/80 rounded-xl shadow-2xl p-1.5 min-w-[230px] space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                          {group.children.map((child) => {
                            const isChildActive = activeTab === child.id;
                            return (
                              <button
                                key={child.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleNavClick(child.id);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between group cursor-pointer ${
                                  isChildActive
                                    ? 'bg-emerald-800/90 text-amber-300 font-bold shadow-xs'
                                    : 'text-emerald-100 hover:text-white hover:bg-emerald-850'
                                }`}
                              >
                                <div>
                                  <div className="font-bangla">{lang === 'bn' ? child.labelBn : child.labelEn}</div>
                                  {child.descBn && (
                                    <div className="text-[10px] text-emerald-400/80 font-normal font-bangla mt-0.5">
                                      {child.descBn}
                                    </div>
                                  )}
                                </div>
                                <ChevronRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${
                                  isChildActive ? 'text-amber-400' : 'text-emerald-500'
                                }`} />
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

            {/* Right: Boxed CTA Buttons with Unified Gold Tone */}
            <div className="flex items-center gap-2 pl-3 border-l border-emerald-800/80 shrink-0">
              {/* Online Admission - Brand Gold Box Button */}
              <button
                onClick={() => handleNavClick('admission')}
                className={`bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold px-3.5 xl:px-4 py-2 rounded-lg text-xs xl:text-sm shadow-sm transition-all flex items-center gap-1.5 font-bangla active:scale-95 cursor-pointer shrink-0 ${
                  activeTab === 'admission' ? 'ring-2 ring-amber-300 shadow-md' : ''
                }`}
                title="Apply Online for Admission"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-950" />
                <span>{lang === 'bn' ? 'ভর্তি আবেদন' : 'Apply Online'}</span>
              </button>

              {/* Result Search - Emerald Box Button with Gold Accent */}
              <button
                onClick={() => handleNavClick('results')}
                className={`bg-emerald-900/90 hover:bg-emerald-850 text-emerald-100 hover:text-white border border-emerald-700/80 hover:border-amber-400/60 px-3 xl:px-3.5 py-2 rounded-lg text-xs xl:text-sm font-semibold transition-all flex items-center gap-1.5 font-bangla shadow-xs active:scale-95 cursor-pointer shrink-0 ${
                  activeTab === 'results' ? 'bg-emerald-800 text-amber-300 border-amber-400/60 font-bold' : ''
                }`}
                title="Search Examination Results"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'bn' ? 'ফলাফল' : 'Results'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer - Clean Boxed Layout */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-emerald-950 text-white border-t border-emerald-800 px-4 py-4 space-y-3 shadow-2xl animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto">
          {/* Mobile Top Fast Action CTAs */}
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-emerald-800/80">
            <button
              onClick={() => handleNavClick('admission')}
              className="bg-amber-400 hover:bg-amber-500 text-emerald-950 py-2.5 px-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-950" />
              <span>{lang === 'bn' ? 'ভর্তি আবেদন' : 'Apply Online'}</span>
            </button>
            <button
              onClick={() => handleNavClick('results')}
              className="bg-emerald-900 hover:bg-emerald-850 border border-emerald-700 text-white py-2.5 px-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'bn' ? 'ফলাফল অনুসন্ধান' : 'Find Result'}</span>
            </button>
          </div>

          {/* Grouped Box Navigation List */}
          <div className="space-y-1.5">
            {menuGroups.map((group) => {
              const active = isGroupActive(group);
              const hasChildren = Boolean(group.children && group.children.length > 0);
              const isExpanded = mobileExpandedGroup === group.id;

              if (!hasChildren) {
                return (
                  <button
                    key={group.id}
                    onClick={() => handleNavClick(group.directTab)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between font-bangla border ${
                      active
                        ? 'bg-amber-400 text-emerald-950 font-bold border-amber-300 shadow-sm'
                        : 'bg-emerald-900/60 border-emerald-800/80 text-emerald-100 hover:bg-emerald-800'
                    }`}
                  >
                    <span>{lang === 'bn' ? group.labelBn : group.labelEn}</span>
                    <ChevronRight className={`w-4 h-4 ${active ? 'text-emerald-950' : 'text-emerald-400'}`} />
                  </button>
                );
              }

              return (
                <div key={group.id} className="bg-emerald-900/40 rounded-xl border border-emerald-800/80 overflow-hidden">
                  <div
                    onClick={() => toggleMobileGroup(group.id)}
                    className={`px-3.5 py-2.5 text-sm font-semibold flex items-center justify-between cursor-pointer font-bangla ${
                      active ? 'text-amber-400 font-bold bg-emerald-900/80' : 'text-emerald-100'
                    }`}
                  >
                    <span>{lang === 'bn' ? group.labelBn : group.labelEn}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-amber-400' : 'text-emerald-400'}`} />
                  </div>

                  {isExpanded && (
                    <div className="bg-emerald-950/80 px-2 py-1.5 space-y-1 border-t border-emerald-800/60">
                      {group.children.map((child) => {
                        const isChildActive = activeTab === child.id;
                        return (
                          <button
                            key={child.id}
                            onClick={() => handleNavClick(child.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between font-bangla transition ${
                              isChildActive
                                ? 'bg-amber-400 text-emerald-950 font-bold shadow-xs'
                                : 'text-emerald-200 hover:bg-emerald-900/80'
                            }`}
                          >
                            <span>{lang === 'bn' ? child.labelBn : child.labelEn}</span>
                            <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Social & Portal Options */}
          <div className="pt-2 border-t border-emerald-800/80 space-y-2">
            <a
              href={schoolInfo.facebookGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 transition"
            >
              <Share2 className="w-4 h-4" />
              <span>{lang === 'bn' ? 'অফিসিয়াল ফেসবুক গ্রুপে যুক্ত হোন' : 'Join Our Facebook Group'}</span>
            </a>

            {authUser ? (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full bg-amber-400 hover:bg-amber-500 text-emerald-950 py-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 transition shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-950" />
                <span>{lang === 'bn' ? 'সিএমএস ম্যানেজমেন্ট ড্যাশবোর্ড' : 'CMS Management Portal'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="w-full bg-emerald-800 border border-emerald-700 hover:bg-emerald-700 text-emerald-100 py-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 transition"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>{lang === 'bn' ? 'বিদ্যালয় পোর্টাল লগইন' : 'School Portal Login'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
