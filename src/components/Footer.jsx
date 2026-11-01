import React from 'react';
import SchoolLogo from './common/SchoolLogo';
import { useSchool } from '../context/useSchool';
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
    <footer className="bg-emerald-950 text-white border-t-4 border-amber-500 no-print">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Col 1: School Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white p-1 ring-2 ring-amber-400">
                <SchoolLogo logo={schoolInfo.logo} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-bangla text-white leading-tight">
                  {lang === 'bn' ? schoolInfo.nameBn : schoolInfo.nameEn}
                </h3>
                <p className="text-xs text-amber-300 font-mono">
                  EIIN: {schoolInfo.eiin} • MPO: {schoolInfo.mpoCode}
                </p>
              </div>
            </div>

            <p className="text-xs text-emerald-200/90 font-bangla leading-relaxed">
              {lang === 'bn'
                ? '১৯৯০ সাল থেকে ফেনী জেলার ফুলগাজী উপজেলার প্রত্যন্ত অঞ্চলে আদর্শ ও নৈতিকতাসম্পন্ন সুনাগরিক গড়ে তুলতে প্রতিশ্রুতিবদ্ধ এক ঐতিহ্যবাহী বিদ্যাপীঠ।'
                : 'A dedicated secondary educational seat in Anandapur, Fulgazi, Feni inspiring young generations with knowledge and moral values since 1990.'}
            </p>

            <div className="pt-2">
              <a
                href={schoolInfo.facebookGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'অফিসিয়াল ফেসবুক গ্রুপে যুক্ত হোন' : 'Join Official Facebook Group'}</span>
                <ExternalLink className="w-3 h-3 text-blue-200" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-bangla">
              {lang === 'bn' ? 'প্রয়োজনীয় লিংক' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-xs font-bangla text-emerald-100/80">
              <li>
                <button onClick={() => handleNav('admission')} className="hover:text-amber-300 transition text-left">
                  {lang === 'bn' ? 'অনলাইন ভর্তি ২০২৬' : 'Online Admission'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('results')} className="hover:text-amber-300 transition text-left">
                  {lang === 'bn' ? 'অনলাইন ফলাফল ও মার্কশিট' : 'Check Results'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('notices')} className="hover:text-amber-300 transition text-left">
                  {lang === 'bn' ? 'নোটিশ ও বিজ্ঞপ্তি' : 'Notice Board'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faculty')} className="hover:text-amber-300 transition text-left">
                  {lang === 'bn' ? 'শিক্ষকমণ্ডলীর তালিকা' : 'Faculty Roster'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('routines')} className="hover:text-amber-300 transition text-left">
                  {lang === 'bn' ? 'ক্লাস ও পরীক্ষার রুটিন' : 'Class Routines'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gallery')} className="hover:text-amber-300 transition text-left">
                  {lang === 'bn' ? 'ফটো ও ভিডিও গ্যালারি' : 'Photo Gallery'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Educational Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-bangla">
              {lang === 'bn' ? 'সরকারি গুরুত্বপূর্ণ লিংক' : 'Govt. Education Portals'}
            </h4>
            <ul className="space-y-2 text-xs font-bangla text-emerald-100/80">
              <li>
                <a href="https://moedu.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'bn' ? 'শিক্ষা মন্ত্রণালয় (MoEdu)' : 'Ministry of Education (MoEdu)'}</span>
                </a>
              </li>
              <li>
                <a href="https://comillaboard.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'bn' ? 'মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা' : 'BISE, Comilla Education Board'}</span>
                </a>
              </li>
              <li>
                <a href="https://dshe.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'bn' ? 'মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর (DSHE)' : 'Directorate of Secondary & Higher Education (DSHE)'}</span>
                </a>
              </li>
              <li>
                <a href="https://nctb.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'bn' ? 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB)' : 'National Curriculum & Textbook Board (NCTB)'}</span>
                </a>
              </li>
              <li>
                <a href="https://teachers.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'bn' ? 'শিক্ষক বাতায়ন (Teachers Portal)' : 'Teachers Portal (Shikkhok Batayon)'}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="lg:col-span-3 space-y-3 text-xs text-emerald-100/90 font-bangla">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
              {lang === 'bn' ? 'যোগাযোগের ঠিকানা' : 'School Address'}
            </h4>
            <p className="leading-relaxed">
              {lang === 'bn' ? schoolInfo.addressBn : (schoolInfo.addressEn || 'Along Feni-Parshuram Road, Bandua Daulatpur, Anandapur Union, Fulgazi, Feni, Bangladesh')}
            </p>
            <p className="font-mono text-emerald-300">
              {lang === 'bn' ? `ফোন: ${schoolInfo.phone}` : `Phone: ${schoolInfo.phone}`}
            </p>
            <p className="font-mono text-emerald-300">
              {lang === 'bn' ? `ইমেইল: ${schoolInfo.email}` : `Email: ${schoolInfo.email}`}
            </p>

            <div className="pt-2">
              {authUser ? (
                <button
                  onClick={() => handleNav('admin')}
                  className="bg-emerald-800 hover:bg-emerald-700 text-amber-300 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'ম্যানেজমেন্ট ড্যাশবোর্ড' : 'Management ERP'}</span>
                </button>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-emerald-900 hover:bg-emerald-800 text-amber-400 border border-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'অ্যাডমিন / শিক্ষক পোর্টাল লগইন' : 'Staff Portal Login'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="bg-emerald-950/90 border-t border-emerald-900 py-4 px-4 sm:px-8 text-xs text-emerald-300/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left font-bangla">
          <p>
            {lang === 'bn' 
              ? `© ${CURRENT_YEAR} ${schoolInfo.nameBn} (EIIN: ${schoolInfo.eiin})। সর্বস্বত্ব সংরক্ষিত।`
              : `© ${CURRENT_YEAR} ${schoolInfo.nameEn} (EIIN: ${schoolInfo.eiin}). All rights reserved.`}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400">
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
