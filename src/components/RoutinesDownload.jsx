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

  // 1. Weekly class schedule data (Sunday - Thursday, Friday & Saturday weekly holiday)
  const classScheduleData = [
    { period: '১ম (১০:০০ - ১০:৪৫)', sun: 'বাংলা ১ম', mon: 'গণিত', tue: 'বিজ্ঞান', wed: 'বাংলাদেশ ও বিশ্বপরিচয়', thu: 'তথ্য ও প্রযুক্তি' },
    { period: '২য় (১০:৪৫ - ১১:৩০)', sun: 'বাংলা ২য়', mon: 'পদার্থবিজ্ঞান/হিসাব', tue: 'উচ্চতর গণিত', wed: 'রসায়ন', thu: 'জীববিজ্ঞান' },
    { period: '৩য় (১১:৩০ - ১২:১৫)', sun: 'বিজ্ঞান', mon: 'ধর্ম ও নৈতিক শিক্ষা', tue: 'ইংরেজি ১ম', wed: 'বাংলা ১ম', thu: 'শারীরিক শিক্ষা' },
    { period: 'টিফিন (১২:১৫ - ০১:০০)', sun: 'নামাজ ও বিরতি', mon: 'নামাজ ও বিরতি', tue: 'নামাজ ও বিরতি', wed: 'নামাজ ও বিরতি', thu: 'নামাজ ও বিরতি' },
    { period: '৪র্থ (০১:০০ - ০১:৪৫)', sun: 'রসায়ন/অর্থনীতি', mon: 'জীববিজ্ঞান/ব্যবসায়', tue: 'সাধারণ গণিত', wed: 'ইংরেজি ২য়', thu: 'আইসিটি ল্যাব' },
    { period: '৫ম (০১:৪৫ - ০২:৩০)', sun: 'ইতিহাস', mon: 'ইংরেজি ১ম', tue: 'জীববিজ্ঞান', wed: 'বিজ্ঞান', thu: 'ডিবেট ও ক্লাব' }
  ];

  // 2. Exam schedule data (Senior QA H7 fix)
  const examScheduleData = [
    { date: '১০ নভেম্বর ২০২৬', day: 'রবিবার', subject: 'বাংলা ১ম পত্র (১০১)', time: 'সকাল ১০:০০ - দুপুর ০১:০০', room: 'কক্ষ ১০১ - ১০৬' },
    { date: '১২ নভেম্বর ২০২৬', day: 'মঙ্গলবার', subject: 'বাংলা ২য় পত্র (১০২)', time: 'সকাল ১০:০০ - দুপুর ০১:০০', room: 'কক্ষ ১০১ - ১০৬' },
    { date: '১৫ নভেম্বর ২০২৬', day: 'রবিবার', subject: 'ইংরেজি ১ম পত্র (১০৭)', time: 'সকাল ১০:০০ - দুপুর ০১:০০', room: 'কক্ষ ১০১ - ১০৬' },
    { date: '১৭ নভেম্বর ২০২৬', day: 'মঙ্গলবার', subject: 'ইংরেজি ২য় পত্র (১০৮)', time: 'সকাল ১০:০০ - দুপুর ০১:০০', room: 'কক্ষ ১০১ - ১০৬' },
    { date: '১৯ নভেম্বর ২০২৬', day: 'বৃহস্পতিবার', subject: 'গণিত (১০৯)', time: 'সকাল ১০:০০ - দুপুর ০১:০০', room: 'কক্ষ ১০১ - ১০৬' },
    { date: '২২ নভেম্বর ২০২৬', day: 'রবিবার', subject: 'পদার্থবিজ্ঞান / হিসাববিজ্ঞান / পৌরনীতি', time: 'সকাল ১০:০০ - দুপুর ০১:০০', room: 'কক্ষ ২০২ - ২০৫' },
    { date: '২৪ নভেম্বর ২০২৬', day: 'মঙ্গলবার', subject: 'রসায়ন / ফিন্যান্স / ইতিহাস', time: 'সকাল ১০:০০ - দুপুর ০১:০০', room: 'কক্ষ ২০২ - ২০৫' },
    { date: '২৬ নভেম্বর ২০২৬', day: 'বৃহস্পতিবার', subject: 'জীববিজ্ঞান / ব্যবসায় উদ্যোগ / ভূগোল', time: 'সকাল ১০:০০ - দুপুর ০১:০০', room: 'কক্ষ ২০২ - ২০৫' }
  ];

  // 3. NCTB Curriculum & Syllabus data (Senior QA H7 fix)
  const syllabusData = [
    { class: '৬ষ্ঠ শ্রেণি', subject: 'সকল আবশ্যিক বিষয়', syllabus: 'NCTB প্রণীত নতুন শিক্ষাক্রম পাঠ্যপুস্তক ও ধারাবাহিক মূল্যায়ন রূপরেখা', marks: '১০০%' },
    { class: '৭ম শ্রেণি', subject: 'সকল আবশ্যিক বিষয়', syllabus: 'অভিজ্ঞতাভিত্তিক শিখন ও সামষ্টিক মূল্যায়ন নির্দেশিকা', marks: '১০০%' },
    { class: '৮ম শ্রেণি', subject: 'সকল আবশ্যিক বিষয়', syllabus: 'পাঠ্যবই ও বিষয়ভিত্তিক শিখন অগ্রগতি মূল্যায়ন ছক', marks: '১০০%' },
    { class: '৯ম শ্রেণি', subject: 'বিজ্ঞান, ব্যবসায় ও মানবিক', syllabus: 'শাখাভিত্তিক NCTB পাঠ্যসূচি ও অর্ধবার্ষিক/বার্ষিক সিলেবাস ২০২৬', marks: '১০০%' },
    { class: '১০ম শ্রেণি', subject: 'এসএসসি পরীক্ষা ২০২৬', syllabus: 'কুমিল্লা শিক্ষা বোর্ড ও NCTB অনুমোদিত সম্পূর্ণ সংক্ষিপ্ত পাঠ্যসূচি', marks: '১০০%' }
  ];

  const handlePrint = () => {
    window.print();
  };

  // Real download/print generator with authentic distinct content per card (H7)
  const handleDownloadRoutine = (item) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const title = lang === 'bn' ? item.titleBn : item.titleEn;
    const effective = item.effectiveDate;
    const isExam = item.id === 'rt-02' || item.titleBn?.includes('পরীক্ষা');
    const isSyllabus = item.id === 'rt-03' || item.titleBn?.includes('NCTB');

    let tableHtml = '';
    if (isExam) {
      tableHtml = `
        <thead>
          <tr>
            <th>তারিখ</th>
            <th>বার</th>
            <th>বিষয়ের নাম ও কোড</th>
            <th>পরীক্ষার সময়</th>
            <th>আসন কক্ষ</th>
          </tr>
        </thead>
        <tbody>
          ${examScheduleData.map(row => `
            <tr>
              <td><strong>${row.date}</strong></td>
              <td>${row.day}</td>
              <td>${row.subject}</td>
              <td>${row.time}</td>
              <td>${row.room}</td>
            </tr>
          `).join('')}
        </tbody>
      `;
    } else if (isSyllabus) {
      tableHtml = `
        <thead>
          <tr>
            <th>শ্রেণি</th>
            <th>বিভাগ / শাখা</th>
            <th>পাঠ্যসূচি ও সিলেবাস বিবরণী</th>
            <th>মূল্যায়ন মান</th>
          </tr>
        </thead>
        <tbody>
          ${syllabusData.map(row => `
            <tr>
              <td><strong>${row.class}</strong></td>
              <td>${row.subject}</td>
              <td>${row.syllabus}</td>
              <td>${row.marks}</td>
            </tr>
          `).join('')}
        </tbody>
      `;
    } else {
      tableHtml = `
        <thead>
          <tr>
            <th>পিরিয়ড / সময়</th>
            <th>রবিবার</th>
            <th>সোমবার</th>
            <th>মঙ্গলবার</th>
            <th>বুধবার</th>
            <th>বৃহস্পতিবার</th>
          </tr>
        </thead>
        <tbody>
          ${classScheduleData.map(row => `
            <tr>
              <td><strong>${row.period}</strong></td>
              <td>${row.sun}</td>
              <td>${row.mon}</td>
              <td>${row.tue}</td>
              <td>${row.wed}</td>
              <td>${row.thu}</td>
            </tr>
          `).join('')}
        </tbody>
      `;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title} - ${schoolInfo.nameBn}</title>
        <style>
          @page { size: A4 portrait; margin: 10mm; }
          body { font-family: 'Noto Sans Bengali', sans-serif; padding: 20px; color: #1e293b; }
          .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 22px; color: #047857; }
          .header p { margin: 4px 0 0; font-size: 13px; color: #64748b; }
          .title { text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 10px; font-size: 12px; text-align: left; }
          th { background: #f1f5f9; font-weight: bold; }
          .footer { display: flex; justify-content: space-between; margin-top: 40px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${schoolInfo.nameBn}</h1>
          <p>${schoolInfo.addressBn} • EIIN: ${schoolInfo.eiin}</p>
        </div>
        <div class="title">${title} (${effective})</div>
        <table>
          ${tableHtml}
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

  const modalElement = activeRoutineModal ? (() => {
    const isExam = activeRoutineModal.id === 'rt-02' || activeRoutineModal.titleBn?.includes('পরীক্ষা');
    const isSyllabus = activeRoutineModal.id === 'rt-03' || activeRoutineModal.titleBn?.includes('NCTB');

    return (
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

        <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-line shadow-2xl relative max-h-[90vh] flex flex-col font-bangla">
          <button
            onClick={() => setActiveRoutineModal(null)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-bg text-muted hover:text-ink cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 id="routine-modal-title" className="text-lg font-bold text-ink pr-8 leading-tight">
            {lang === 'bn' ? activeRoutineModal.titleBn : activeRoutineModal.titleEn}
          </h3>
          <p className="text-xs text-primary font-mono mb-4 font-bold mt-1">
            কার্যকরী তারিখ: {activeRoutineModal.effectiveDate}
          </p>

          <div className="overflow-y-auto flex-1 border border-line rounded-xl mb-5">
            {isExam ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-deep text-white font-bold">
                  <tr>
                    <th className="p-2.5">তারিখ ও বার</th>
                    <th className="p-2.5">বিষয়ের নাম</th>
                    <th className="p-2.5">সময়</th>
                    <th className="p-2.5">কক্ষ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {examScheduleData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-bg">
                      <td className="p-2.5 font-bold text-ink">{row.date} ({row.day})</td>
                      <td className="p-2.5 text-primary font-semibold">{row.subject}</td>
                      <td className="p-2.5 text-muted">{row.time}</td>
                      <td className="p-2.5 font-mono">{row.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : isSyllabus ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-deep text-white font-bold">
                  <tr>
                    <th className="p-2.5">শ্রেণি</th>
                    <th className="p-2.5">শাখা / বিভাগ</th>
                    <th className="p-2.5">পাঠ্যসূচি বিবরণ</th>
                    <th className="p-2.5 text-center">মূল্যায়ন মান</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {syllabusData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-bg">
                      <td className="p-2.5 font-bold text-ink">{row.class}</td>
                      <td className="p-2.5 text-primary font-semibold">{row.subject}</td>
                      <td className="p-2.5 text-muted">{row.syllabus}</td>
                      <td className="p-2.5 text-center font-bold text-ink">{row.marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-deep text-white font-bold">
                    <tr>
                      <th className="p-2">পিরিয়ড</th>
                      <th className="p-2">রবিবার</th>
                      <th className="p-2">সোমবার</th>
                      <th className="p-2">মঙ্গলবার</th>
                      <th className="p-2">বুধবার</th>
                      <th className="p-2">বৃহস্পতিবার</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {classScheduleData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-bg">
                        <td className="p-2 font-bold text-ink whitespace-nowrap">{row.period}</td>
                        <td className="p-2">{row.sun}</td>
                        <td className="p-2">{row.mon}</td>
                        <td className="p-2">{row.tue}</td>
                        <td className="p-2">{row.wed}</td>
                        <td className="p-2">{row.thu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex gap-3 no-print">
            <button
              onClick={() => setActiveRoutineModal(null)}
              className="flex-1 bg-bg hover:bg-soft py-2.5 rounded-lg text-xs text-ink border border-line cursor-pointer font-bold"
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
              <Printer className="w-4 h-4 text-ink" />
              <span>{lang === 'bn' ? 'প্রিন্ট / সেভ করুন' : 'Print / Save'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  })() : null;

  return (
    <section className="py-12 sm:py-16 text-ink relative z-10 font-sans min-h-[700px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 no-print">
          <div className="inline-flex items-center gap-1.5 bg-soft text-deep text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-xs border border-soft-border">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>{lang === 'bn' ? 'একাডেমিক সময়সূচি' : 'Academic Schedule & Routines'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-bangla text-ink leading-tight">
            {lang === 'bn' ? 'ক্লাস রুটিন, পরীক্ষার সময়সূচি ও পাঠ্যসূচি' : 'Class Routines & Examination Schedules'}
          </h2>
          <p className="text-xs sm:text-sm text-muted font-bangla mt-2">
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
              className="card-base rounded-2xl p-6 border border-line shadow-xs transition flex flex-col justify-between bg-white"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-11 h-11 rounded-xl bg-soft text-deep flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5 text-primary" />
                  </span>
                  <span className="text-xs font-mono font-bold text-muted bg-bg px-3 py-1 rounded-full border border-line">
                    {item.type} • {item.fileSize}
                  </span>
                </div>

                <h3 className="text-base font-bold font-bangla text-ink mb-2 line-clamp-2">
                  {lang === 'bn' ? item.titleBn : item.titleEn}
                </h3>
                <p className="text-xs text-muted font-mono">
                  {lang === 'bn' ? `কার্যকরী তারিখ: ${item.effectiveDate}` : `Effective: ${item.effectiveDate}`}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-line flex items-center gap-2.5">
                <button
                  onClick={() => setActiveRoutineModal(item)}
                  className="flex-1 btn-accent py-2.5 px-4 rounded-lg text-xs font-bold font-bangla transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Eye className="w-4 h-4 text-ink" />
                  <span>{lang === 'bn' ? 'অনলাইনে দেখুন' : 'View Online'}</span>
                </button>
                <button
                  onClick={() => handleDownloadRoutine(item)}
                  className="p-2.5 bg-bg hover:bg-soft text-ink rounded-lg text-xs transition border border-line cursor-pointer"
                  title={lang === 'bn' ? 'রুটিন প্রিন্ট / ডাউনলোড করুন' : 'Print / Download Routine'}
                  aria-label="PDF ডাউনলোড"
                >
                  <Download className="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Weekly Class Routine Table */}
        <div className="card-base rounded-2xl p-6 sm:p-8 border border-line shadow-xs bg-white" id="weekly-routine">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-line">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider block font-bangla">
                {lang === 'bn' ? 'সাপ্তাহিক ক্লাস রুটিন ২০২৬ (নমুনা: দশম শ্রেণি)' : 'Weekly Routine 2026 (Class 10)'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-bangla text-ink mt-1">
                {lang === 'bn' ? 'বিজ্ঞান ও মানবিক শাখা সময়সূচি' : 'Science & Humanities Routine'}
              </h3>
            </div>

            <button
              onClick={handlePrint}
              className="btn-accent px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs no-print"
            >
              <Printer className="w-4 h-4 text-ink" />
              <span>{lang === 'bn' ? 'রুটিন প্রিন্ট করুন' : 'Print Schedule'}</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-left text-xs font-bangla">
              <thead className="bg-deep text-white border-b border-primary font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-3">পিরিয়ড / সময়</th>
                  <th className="py-3 px-3">রবিবার</th>
                  <th className="py-3 px-3">সোমবার</th>
                  <th className="py-3 px-3">মঙ্গলবার</th>
                  <th className="py-3 px-3">বুধবার</th>
                  <th className="py-3 px-3">বৃহস্পতিবার</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {scheduleData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-bg transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-primary">{row.period}</td>
                    <td className="py-3 px-3 text-ink">{row.sun}</td>
                    <td className="py-3 px-3 text-ink">{row.mon}</td>
                    <td className="py-3 px-3 text-ink">{row.tue}</td>
                    <td className="py-3 px-3 text-ink">{row.wed}</td>
                    <td className="py-3 px-3 text-ink">{row.thu}</td>
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
