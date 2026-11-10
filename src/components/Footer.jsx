import React from 'react';
import SchoolLogo from './common/SchoolLogo';
import { useSchool } from '../context/useSchool';
import { toEnglishNumerals } from '../utils/dateFormatter';
import { 
  Share2, 
  ExternalLink, 
  ShieldCheck
} from 'lucide-react';

const CURRENT_YEAR = 2026;

export default function Footer() {
  const { lang, schoolInfo, setActiveTab, setAuthModalOpen, authUser } = useSchool();

  const handleNav = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="glass-capsule text-white border-t border-white/15 no-print relative z-10 mt-16 rounded-t-[2.5rem] backdrop-blur-2xl">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Col 1: School Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white p-1 ring-2 ring-accent shrink-0">
                <SchoolLogo surface="dark" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-bangla text-white leading-tight">
                  {lang === 'bn' ? (schoolInfo.nameBn || 'বিদ্যালয়ের নাম') : (schoolInfo.nameEn || 'School Name')}
                </h3>
                <p className="text-xs text-accent font-mono">
                  EIIN: {lang === 'bn' ? schoolInfo.eiin : toEnglishNumerals(schoolInfo.eiin)} • MPO: {lang === 'bn' ? schoolInfo.mpoCode : toEnglishNumerals(schoolInfo.mpoCode)}
                </p>
              </div>
            </div>

            <p className="text-xs text-white/95 font-medium font-bangla leading-relaxed">
              {lang === 'bn'
                ? (schoolInfo.footerAboutBn || schoolInfo.visionBn || '')
                : (schoolInfo.footerAboutEn || schoolInfo.visionEn || '')}
            </p>

            <div className="pt-2">
              <a
                href={schoolInfo.facebookGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-full shadow-lg cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'অফিসিয়াল ফেসবুক গ্রুপে যুক্ত হোন' : 'Join Official Facebook Group'}</span>
                <ExternalLink className="w-3 h-3 text-ink" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-accent uppercase tracking-wider font-mono">
              {lang === 'bn' ? 'প্রয়োজনীয় লিংক' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-xs font-bangla text-white/95 font-medium">
              <li>
                <button onClick={() => handleNav('admission')} className="hover:text-accent transition text-left cursor-pointer">
                  {lang === 'bn' ? 'অনলাইন ভর্তি ২০২৬' : 'Online Admission'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('results')} className="hover:text-accent transition text-left cursor-pointer">
                  {lang === 'bn' ? 'অনলাইন ফলাফল ও মার্কশিট' : 'Check Results'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('notices')} className="hover:text-accent transition text-left cursor-pointer">
                  {lang === 'bn' ? 'নোটিশ ও বিজ্ঞপ্তি' : 'Notice Board'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faculty')} className="hover:text-accent transition text-left cursor-pointer">
                  {lang === 'bn' ? 'শিক্ষকমণ্ডলীর তালিকা' : 'Faculty Roster'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('routines')} className="hover:text-accent transition text-left cursor-pointer">
                  {lang === 'bn' ? 'ক্লাস ও পরীক্ষার রুটিন' : 'Class Routines'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gallery')} className="hover:text-accent transition text-left cursor-pointer">
                  {lang === 'bn' ? 'ফটো ও ভিডিও গ্যালারি' : 'Photo Gallery'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Educational Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-accent uppercase tracking-wider font-mono">
              {lang === 'bn' ? 'সরকারি গুরুত্বপূর্ণ লিংক' : 'Govt. Education Portals'}
            </h4>
            <ul className="space-y-2 text-xs font-bangla text-white/95 font-medium">
              <li>
                <a href="https://moedu.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 text-accent" />
                  <span>{lang === 'bn' ? 'শিক্ষা মন্ত্রণালয় (MoEdu)' : 'Ministry of Education (MoEdu)'}</span>
                </a>
              </li>
              <li>
                <a href="https://comillaboard.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 text-accent" />
                  <span>{lang === 'bn' ? 'মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা' : 'BISE, Comilla Education Board'}</span>
                </a>
              </li>
              <li>
                <a href="https://dshe.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 text-accent" />
                  <span>{lang === 'bn' ? 'মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর (DSHE)' : 'Directorate of Secondary & Higher Education (DSHE)'}</span>
                </a>
              </li>
              <li>
                <a href="https://nctb.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 text-accent" />
                  <span>{lang === 'bn' ? 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)' : 'National Curriculum & Textbook Board (NCTB)'}</span>
                </a>
              </li>
              <li>
                <a href="https://teachers.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 text-accent" />
                  <span>{lang === 'bn' ? 'শিক্ষক বাতায়ন (Teachers Portal)' : 'Teachers Portal (Shikkhok Batayon)'}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="lg:col-span-3 space-y-3 text-xs text-white/95 font-medium font-bangla">
            <h4 className="text-sm font-bold text-accent uppercase tracking-wider font-mono">
              {lang === 'bn' ? 'যোগাযোগের ঠিকানা' : 'School Address'}
            </h4>
            <p className="leading-relaxed">
              {lang === 'bn' ? schoolInfo.addressBn : (schoolInfo.addressEn || '')}
            </p>
            <p className="font-mono text-accent">
              {lang === 'bn' ? `ফোন: ${schoolInfo.phone}` : `Phone: ${toEnglishNumerals(schoolInfo.phone)}`}
            </p>
            <p className="font-mono text-accent">
              {lang === 'bn' ? `ইমেইল: ${schoolInfo.email}` : `Email: ${schoolInfo.email}`}
            </p>

            <div className="pt-2">
              {authUser ? (
                <button
                  onClick={() => handleNav('admin')}
                  className="btn-gold px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-ink" />
                  <span>{lang === 'bn' ? 'ম্যানেজমেন্ট ড্যাশবোর্ড' : 'Management ERP'}</span>
                </button>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="glass-pill hover:bg-white/15 text-accent px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 border border-accent/30 cursor-pointer shadow-md"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span>{lang === 'bn' ? 'অ্যাডমিন / শিক্ষক পোর্টাল লগইন' : 'Staff Portal Login'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="glass-capsule border-t border-white/10 py-4 px-4 sm:px-8 text-xs text-white/95 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left font-bangla">
          {/* Copyright Notice */}
          <p className="text-white/90 font-medium">
            {lang === 'bn' 
              ? `© ${CURRENT_YEAR} ${schoolInfo.nameBn} (EIIN: ${schoolInfo.eiin})। সর্বস্বত্ব সংরক্ষিত।`
              : `© ${CURRENT_YEAR} ${schoolInfo.nameEn} (EIIN: ${toEnglishNumerals(schoolInfo.eiin)}). All rights reserved.`}
          </p>

          {/* Developer Credit - Designed and Developed by Md Jaker Ullah Chowdhury Nahin */}
          <div className="font-sans text-xs text-white/95 font-medium flex items-center justify-center">
            <span>Designed and Developed by</span>
            <a
              href="https://mdjakerullahchowdhurynahin.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1.5 inline-flex items-center gap-1 font-bold text-accent hover:text-accent transition-colors group cursor-pointer"
              title="Visit Md Jaker Ullah Chowdhury Nahin's Portfolio"
            >
              <span className="border-b border-accent/50 group-hover:border-accent pb-0.5 transition-colors">
                Md Jaker Ullah Chowdhury Nahin
              </span>
              <ExternalLink className="w-3 h-3 text-accent group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </a>
          </div>

          {/* Institutional / Digital Bangladesh Note */}
          <div className="flex items-center gap-2 text-[11px] text-accent">
            <span>
              {lang === 'bn' 
                ? 'ডিজিটাল বাংলাদেশ বিনির্মাণে স্মার্ট স্কুলিং সফটওয়্যার' 
                : 'Smart School Management Software • Digital Bangladesh'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
