import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSchool } from '../context/useSchool';
import { 
  Calendar, 
  Download, 
  FileText, 
  Eye, 
  X, 
  Printer
} from 'lucide-react';

export default function RoutinesDownload() {
  const { lang, routines, schoolInfo } = useSchool();
  const [activeRoutineModal, setActiveRoutineModal] = useState(null);

  // Close modal on Escape
  useEffect(() => {
    if (!activeRoutineModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveRoutineModal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeRoutineModal]);

  // Lock body scroll
  useEffect(() => {
    if (activeRoutineModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeRoutineModal]);

  // Weekly class schedule data
  const scheduleData = [
    { period: '১ম (১০:০০ - ১০:৪৫)', sat: 'বাংলা ১ম', sun: 'ইংরেজি ১ম', mon: 'গণিত', tue: 'বিজ্ঞান', wed: 'বাংলাদেশ ও বিশ্বপরিচয়', thu: 'তথ্য ও প্রযুক্তি' },
    { period: '২য় (১০:৪৫ - ১১:৩০)', sat: 'ইংরেজি ২য়', sun: 'বাংলা ২য়', mon: 'পদার্থবিজ্ঞান/হিসাব', tue: 'উচ্চতর গণিত', wed: 'রসায়ন', thu: 'জীববিজ্ঞান' },
    { period: '৩য় (১১:৩০ - ১২:১৫)', sat: 'গণিত', sun: 'বিজ্ঞান', mon: 'ধর্ম ও নৈতিক শিক্ষা', tue: 'ইংরেজি ১ম', wed: 'বাংলা ১ম', thu: 'শারীরিক শিক্ষা' },
    { period: 'টিফিন (১২:১৫ - ০১:০০)', sat: 'নামাজ ও বিরতি', sun: 'নামাজ ও বিরতি', mon: 'নামাজ ও বিরতি', tue: 'নামাজ ও বিরতি', wed: 'নামাজ ও বিরতি', thu: 'নামাজ ও বিরতি' },
    { period: '৪র্থ (০১:০০ - ০১:৪৫)', sat: 'পদার্থ/হিসাব', sun: 'রসায়ন/অর্থনীতি', mon: 'জীববিজ্ঞান/ব্যবসায়', tue: 'সাধারণ গণিত', wed: 'ইংরেজি ২য়', thu: 'আইসিটি ল্যাব' },
    { period: '৫ম (০১:৪৫ - ০২:৩০)', sat: 'উচ্চতর গণিত', sun: 'ইতিহাস', mon: 'ইংরেজি ১ম', tue: 'জীববিজ্ঞান', wed: 'বিজ্ঞান', thu: 'ডিবেট ও ক্লাব' }
  ];

  const handlePrint = () => {
    window.print();
  };

  // Real download/print generator without fake alerts (H3)
  const handleDownloadRoutine = (item) => {
    // Generate formatted printable schedule window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const title = lang === 'bn' ? item.titleBn : item.titleEn;
    const effective = item.effectiveDate;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title} - ${schoolInfo.nameBn}</title>
        <style>
          body { font-family: 'Hind Siliguri', sans-serif; padding: 40px; color: #1F2937; }
          .header { text-align: center; border-bottom: 2px solid #14532D; padding-bottom: 15px; margin-bottom: 20px; }
          h1 { color: #14532D; margin: 0 0 5px 0; font-size: 24px; }
          .subtitle { color: #4B5563; font-size: 13px; margin: 0; }
          .badge { display: inline-block; background: #DCFCE7; color: #14532D; font-weight: bold; padding: 4px 12px; border-radius: 9999px; font-size: 12px; margin-top: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
          th, td { border: 1px solid #D1D5DB; padding: 10px; text-align: left; }
          th { background-color: #14532D; color: white; }
          tr:nth-child(even) { background-color: #F7F9F8; }
          .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${schoolInfo.nameBn}</h1>
          <p class="subtitle">${schoolInfo.addressBn} • EIIN: ${schoolInfo.eiin}</p>
          <div class="badge">${title}</div>
          <p style="font-size: 12px; margin-top: 5px; color: #4B5563;">কার্যকরী তারিখ: ${effective}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>পিরিয়ড / সময়</th>
              <th>শনিবার</th>
              <th>রবিবার</th>
              <th>সোমবার</th>
              <th>মঙ্গলবার</th>
              <th>বুধবার</th>
              <th>বৃহস্পতিবার</th>
            </tr>
          </thead>
          <tbody>
            ${scheduleData.map(row => `
              <tr>
                <td><strong>${row.period}</strong></td>
                <td>${row.sat}</td>
                <td>${row.sun}</td>
                <td>${row.mon}</td>
                <td>${row.tue}</td>
                <td>${row.wed}</td>
                <td>${row.thu}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <div><p>প্রস্তুতকারক: রুটিন কমিটি</p></div>
          <div style="text-align: right;"><p><strong>${schoolInfo.headmasterNameBn}</strong><br/>${schoolInfo.headmasterDesignationBn}</p></div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const modalElement = activeRoutineModal ? (
    <div 
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="routine-modal-title"
    >
      <div 
        className="fixed inset-0 -z-10" 
        onClick={() => setActiveRoutineModal(null)} 
        aria-hidden="true" 
      />

      <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E5E7EB] shadow-2xl relative">
        <button
          onClick={() => setActiveRoutineModal(null)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 id="routine-modal-title" className="text-lg font-bold font-bangla text-slate-900 mb-2">
          {lang === 'bn' ? activeRoutineModal.titleBn : activeRoutineModal.titleEn}
        </h3>
        <p className="text-xs text-[#166534] font-mono mb-4 font-bold">
          কার্যকরী তারিখ: {activeRoutineModal.effectiveDate}
        </p>

        <div className="bg-[#F7F9F8] p-6 rounded-xl text-center border border-[#E5E7EB] mb-6">
          <FileText className="w-12 h-12 text-[#166534] mx-auto mb-2" />
          <p className="text-xs text-slate-700 font-bangla font-semibold">
            {lang === 'bn' ? 'অফিসিয়াল একাডেমিক রুটিন সিডিউল' : 'Official Academic Routine Schedule'}
          </p>
          <p className="text-[11px] text-[#4B5563] mt-1 font-bangla">
            {lang === 'bn' ? 'সরাসরি প্রিন্ট বা ডাউনলোড করে সংগ্রহ করুন।' : 'Print or save direct schedule copy.'}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setActiveRoutineModal(null)}
            className="flex-1 bg-[#F3F4F6] hover:bg-[#E5E7EB] py-2.5 rounded-lg text-xs text-slate-700 border border-[#D1D5DB] cursor-pointer font-bold"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
          <button
            onClick={() => {
              handleDownloadRoutine(activeRoutineModal);
              setActiveRoutineModal(null);
            }}
            className="flex-1 btn-accent py-2.5 rounded-lg text-xs font-bold cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-[#1F2937]" />
            <span>{lang === 'bn' ? 'প্রিন্ট / সেভ করুন' : 'Print / Save'}</span>
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <section className="py-12 sm:py-16 text-slate-800 relative z-10 font-sans min-h-[700px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 no-print">
          <div className="inline-flex items-center gap-1.5 bg-[#DCFCE7] text-[#14532D] text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-xs border border-emerald-300">
            <Calendar className="w-3.5 h-3.5 text-[#166534]" />
            <span>{lang === 'bn' ? 'একাডেমিক সময়সূচি' : 'Academic Schedule & Routines'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-bangla text-slate-900 leading-tight">
            {lang === 'bn' ? 'ক্লাস রুটিন, পরীক্ষার সময়সূচি ও পাঠ্যসূচি' : 'Class Routines & Examination Schedules'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-bangla mt-2">
            {lang === 'bn'
              ? 'ষষ্ঠ থেকে দশম শ্রেণির সাপ্তাহিক ক্লাস রুটিন এবং বার্ষিক পরীক্ষার সময়সূচি ডাউনলোড করুন'
              : 'Official weekly routines and exam calendars for all classes.'}
          </p>
        </div>

        {/* Downloadable Files Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 no-print">
          {routines.map((item) => (
            <div
              key={item.id}
              className="card-base rounded-2xl p-6 border border-[#E5E7EB] shadow-xs transition flex flex-col justify-between bg-white"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-11 h-11 rounded-xl bg-[#DCFCE7] text-[#14532D] flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5 text-[#166534]" />
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600 bg-[#F3F4F6] px-3 py-1 rounded-full border border-[#E5E7EB]">
                    {item.type} • {item.fileSize}
                  </span>
                </div>

                <h3 className="text-base font-bold font-bangla text-slate-900 mb-2 line-clamp-2">
                  {lang === 'bn' ? item.titleBn : item.titleEn}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {lang === 'bn' ? `কার্যকরী তারিখ: ${item.effectiveDate}` : `Effective: ${item.effectiveDate}`}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex items-center gap-2.5">
                <button
                  onClick={() => setActiveRoutineModal(item)}
                  className="flex-1 btn-accent py-2.5 px-4 rounded-lg text-xs font-bold font-bangla transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Eye className="w-4 h-4 text-[#1F2937]" />
                  <span>{lang === 'bn' ? 'অনলাইনে দেখুন' : 'View Online'}</span>
                </button>
                <button
                  onClick={() => handleDownloadRoutine(item)}
                  className="p-2.5 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-slate-700 rounded-lg text-xs transition border border-[#D1D5DB] cursor-pointer"
                  title={lang === 'bn' ? 'রুটিন প্রিন্ট / ডাউনলোড করুন' : 'Print / Download Routine'}
                  aria-label="PDF ডাউনলোড"
                >
                  <Download className="w-4 h-4 text-[#166534]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Weekly Class Routine Table */}
        <div className="card-base rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] shadow-xs bg-white" id="weekly-routine">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E5E7EB]">
            <div>
              <span className="text-xs font-bold text-[#166534] uppercase tracking-wider block font-bangla">
                {lang === 'bn' ? 'সাপ্তাহিক ক্লাস রুটিন ২০২৭ (নমুনা: দশম শ্রেণি)' : 'Weekly Routine 2027 (Class 10)'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-bangla text-slate-900 mt-1">
                {lang === 'bn' ? 'বিজ্ঞান ও মানবিক শাখা সময়সূচি' : 'Science & Humanities Routine'}
              </h3>
            </div>

            <button
              onClick={handlePrint}
              className="btn-accent px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs no-print"
            >
              <Printer className="w-4 h-4 text-[#1F2937]" />
              <span>{lang === 'bn' ? 'রুটিন প্রিন্ট করুন' : 'Print Schedule'}</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#E5E7EB]">
            <table className="w-full text-left text-xs font-bangla">
              <thead className="bg-[#14532D] text-white border-b border-[#166534] font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-3">পিরিয়ড / সময়</th>
                  <th className="py-3 px-3">শনিবার</th>
                  <th className="py-3 px-3">রবিবার</th>
                  <th className="py-3 px-3">সোমবার</th>
                  <th className="py-3 px-3">মঙ্গলবার</th>
                  <th className="py-3 px-3">বুধবার</th>
                  <th className="py-3 px-3">বৃহস্পতিবার</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {scheduleData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F7F9F8] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#166534]">{row.period}</td>
                    <td className="py-3 px-3 text-slate-700">{row.sat}</td>
                    <td className="py-3 px-3 text-slate-700">{row.sun}</td>
                    <td className="py-3 px-3 text-slate-700">{row.mon}</td>
                    <td className="py-3 px-3 text-slate-700">{row.tue}</td>
                    <td className="py-3 px-3 text-slate-700">{row.wed}</td>
                    <td className="py-3 px-3 text-slate-700">{row.thu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal rendered with createPortal (M6) */}
        {typeof document !== 'undefined' && modalElement && createPortal(modalElement, document.body)}
      </div>
    </section>
  );
}
