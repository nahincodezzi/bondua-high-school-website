import React, { useState } from 'react';
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
  const { lang, routines } = useSchool();
  const [activeRoutineModal, setActiveRoutineModal] = useState(null);

  // Sample weekly class schedule table
  const scheduleData = [
    { period: '1st (10:00 - 10:45)', sat: 'Bangla 1st', sun: 'English 1st', mon: 'General Math', tue: 'General Science', wed: 'BGS', thu: 'ICT' },
    { period: '2nd (10:45 - 11:30)', sat: 'English 2nd', sun: 'Bangla 2nd', mon: 'Physics/Acc', tue: 'Higher Math', wed: 'Chemistry', thu: 'Biology' },
    { period: '3rd (11:30 - 12:15)', sat: 'General Math', sun: 'Science', mon: 'Religion', tue: 'English 1st', wed: 'Bangla 1st', thu: 'Sports/PE' },
    { period: 'Tiffin (12:15 - 01:00)', sat: 'Break / Prayer', sun: 'Break / Prayer', mon: 'Break / Prayer', tue: 'Break / Prayer', wed: 'Break / Prayer', thu: 'Break / Prayer' },
    { period: '4th (01:00 - 01:45)', sat: 'Physics/Acc', sun: 'Chemistry/Fin', mon: 'Biology/Bus', tue: 'General Math', wed: 'English 2nd', thu: 'ICT Lab' },
    { period: '5th (01:45 - 02:30)', sat: 'Higher Math', sun: 'BGS', mon: 'English 1st', tue: 'Biology', wed: 'General Science', thu: 'Debate/Club' }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="py-14 text-white relative z-10 font-sans min-h-[700px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 no-print">
          <div className="inline-flex items-center gap-1.5 glass-pill text-amber-300 text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-md border border-amber-400/20">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'bn' ? 'একাডেমিক সময়সূচি' : 'Academic Schedule & Routines'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-bangla text-white drop-shadow-md">
            {lang === 'bn' ? 'ক্লাস রুটিন, পরীক্ষার সময়সূচি ও পাঠ্যসূচি' : 'Class Routines & Examination Schedules'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-bangla mt-2">
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
              className="glass-card glass-card-hover rounded-3xl p-6 border border-white/15 shadow-xl transition flex flex-col justify-between backdrop-blur-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-11 h-11 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300 glass-pill px-3 py-1 rounded-full border border-white/10">
                    {item.type} • {item.fileSize}
                  </span>
                </div>

                <h3 className="text-base font-bold font-bangla text-white mb-2 line-clamp-2">
                  {lang === 'bn' ? item.titleBn : item.titleEn}
                </h3>
                <p className="text-xs text-slate-300 font-mono">
                  {lang === 'bn' ? `কার্যকরী তারিখ: ${item.effectiveDate}` : `Effective: ${item.effectiveDate}`}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2.5">
                <button
                  onClick={() => setActiveRoutineModal(item)}
                  className="flex-1 btn-gold py-2.5 px-4 rounded-full text-xs font-bold font-bangla transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Eye className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'bn' ? 'অনলাইনে দেখুন' : 'View Online'}</span>
                </button>
                <button
                  onClick={() => alert('ডাউনলোড শুরু হয়েছে...')}
                  className="p-2.5 glass-pill hover:bg-white/15 text-white rounded-full text-xs transition border border-white/15 cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Weekly Class Routine Table (Interactive & Print-Friendly) */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl backdrop-blur-xl" id="weekly-routine">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block font-bangla">
                {lang === 'bn' ? 'সাপ্তাহিক ক্লাস রুটিন ২০২৬ (নমুনা: দশম শ্রেণি)' : 'Weekly Routine 2026 (Class 10)'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-bangla text-white mt-1">
                {lang === 'bn' ? 'বিজ্ঞান ও মানবিক শাখা সময়সূচি' : 'Science & Humanities Routine'}
              </h3>
            </div>

            <button
              onClick={handlePrint}
              className="btn-gold px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md no-print"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>{lang === 'bn' ? 'রুটিন প্রিন্ট করুন' : 'Print Schedule'}</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs font-bangla">
              <thead className="bg-slate-950/80 text-amber-300 border-b border-white/10 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-3">পিরিয়ড / সময়</th>
                  <th className="py-3 px-3">রবিবার</th>
                  <th className="py-3 px-3">সোমবার</th>
                  <th className="py-3 px-3">মঙ্গলবার</th>
                  <th className="py-3 px-3">বুধবার</th>
                  <th className="py-3 px-3">বৃহস্পতিবার</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {scheduleData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-amber-300">{row.period}</td>
                    <td className="py-3 px-3 text-slate-200">{row.sun}</td>
                    <td className="py-3 px-3 text-slate-200">{row.mon}</td>
                    <td className="py-3 px-3 text-slate-200">{row.tue}</td>
                    <td className="py-3 px-3 text-slate-200">{row.wed}</td>
                    <td className="py-3 px-3 text-slate-200">{row.thu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Routine View */}
        {activeRoutineModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-card rounded-3xl max-w-lg w-full p-6 border border-white/20 shadow-2xl relative">
              <button
                onClick={() => setActiveRoutineModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold font-bangla text-white mb-2">
                {lang === 'bn' ? activeRoutineModal.titleBn : activeRoutineModal.titleEn}
              </h3>
              <p className="text-xs text-amber-300 font-mono mb-4">
                Effective: {activeRoutineModal.effectiveDate}
              </p>
              <div className="glass-pill p-8 rounded-2xl text-center border border-white/10 mb-6">
                <FileText className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                <p className="text-xs text-slate-300">পিডিএফ ডকুমেন্টটি সম্পূর্ণ আকারে প্রস্তুত রয়েছে।</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveRoutineModal(null)}
                  className="flex-1 glass-pill py-2.5 rounded-full text-xs text-white border border-white/10 cursor-pointer"
                >
                  বন্ধ করুন
                </button>
                <button
                  onClick={() => alert('ডাউনলোড শুরু হয়েছে...')}
                  className="flex-1 btn-gold py-2.5 rounded-full text-xs font-bold cursor-pointer"
                >
                  ডাউনলোড করুন
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
