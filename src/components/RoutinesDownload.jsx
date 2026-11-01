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
  const { lang, routines, schoolInfo } = useSchool();
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
    <section className="py-12 bg-slate-50 min-h-[700px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 no-print">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'একাডেমিক সময়সূচি' : 'Academic Schedule & Routines'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-bangla text-slate-900">
            {lang === 'bn' ? 'ক্লাস রুটিন, পরীক্ষার সময়সূচি ও পাঠ্যসূচি' : 'Class Routines & Examination Schedules'}
          </h2>
          <p className="text-sm text-slate-600 font-bangla mt-1">
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
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {item.type} • {item.fileSize}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold font-bangla text-slate-900 mb-2">
                  {lang === 'bn' ? item.titleBn : item.titleEn}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {lang === 'bn' ? `কার্যকরী তারিখ: ${item.effectiveDate}` : `Effective: ${item.effectiveDate}`}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setActiveRoutineModal(item)}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-xs font-bangla transition flex items-center justify-center gap-1.5 shadow"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'অনলাইনে দেখুন' : 'View Online'}</span>
                </button>
                <button
                  onClick={() => alert('ডাউনলোড শুরু হয়েছে...')}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs transition"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Weekly Class Routine Table (Interactive & Print-Friendly) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm" id="weekly-routine">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block font-bangla">
                {lang === 'bn' ? 'সাপ্তাহিক ক্লাস রুটিন ২০২৬ (নমুনা: দশম শ্রেণি)' : 'Weekly Routine 2026 (Class 10)'}
              </span>
              <h3 className="text-xl font-bold font-bangla text-slate-900">
                {lang === 'bn' ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় - ক্লাস সময়সূচি' : 'Bandua Daulatpur High School - Class Schedule'}
              </h3>
            </div>

            <button
              onClick={handlePrint}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition shadow no-print"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>{lang === 'bn' ? 'রুটিন প্রিন্ট করুন' : 'Print Routine'}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-950 text-white uppercase text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-3 w-36">Period / Time</th>
                  <th className="py-3 px-3">Saturday</th>
                  <th className="py-3 px-3">Sunday</th>
                  <th className="py-3 px-3">Monday</th>
                  <th className="py-3 px-3">Tuesday</th>
                  <th className="py-3 px-3">Wednesday</th>
                  <th className="py-3 px-3">Thursday</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {scheduleData.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className={row.period.includes('Tiffin') ? 'bg-amber-50/80 font-bold text-amber-900' : 'hover:bg-slate-50'}
                  >
                    <td className="py-3 px-3 font-mono font-bold text-slate-700 bg-slate-50">{row.period}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{row.sat}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{row.sun}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{row.mon}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{row.tue}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{row.wed}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{row.thu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>বি.দ্র. প্রতি শুক্রবার ও সরকারি ছুটির দিনগুলোতে বিদ্যালয়ের পাঠদান বন্ধ থাকে।</span>
            <span className="font-mono">EIIN: {schoolInfo.eiin}</span>
          </div>
        </div>

        {/* Routine Preview Modal */}
        {activeRoutineModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h4 className="font-bold font-bangla text-slate-900 text-sm">
                  {lang === 'bn' ? activeRoutineModal.titleBn : activeRoutineModal.titleEn}
                </h4>
                <button
                  onClick={() => setActiveRoutineModal(null)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl text-xs text-emerald-900 font-bangla space-y-2">
                <p><strong>ফাইল ফরম্যাট:</strong> {activeRoutineModal.type} (সাইজ: {activeRoutineModal.fileSize})</p>
                <p><strong>কার্যকরী তারিখ:</strong> {activeRoutineModal.effectiveDate}</p>
                <p>বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় কার্যালয় কর্তৃক অনুমোদিত ও স্বাক্ষরিত নথি।</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setActiveRoutineModal(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  বন্ধ করুন
                </button>
                <button
                  onClick={() => {
                    alert('ডাউনলোড সম্পন্ন হয়েছে!');
                    setActiveRoutineModal(null);
                  }}
                  className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ডাউনলোড করুন</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
