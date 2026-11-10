import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSchool } from '../context/useSchool';
import { getSchoolLogo } from '../utils/branding';
import { toEnglishNumerals } from '../utils/dateFormatter';
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

  const classScheduleDataEn = [
    { period: '1st (10:00 - 10:45)', sun: 'Bangla 1st', mon: 'Mathematics', tue: 'Science', wed: 'Bangladesh & Global Studies', thu: 'ICT' },
    { period: '2nd (10:45 - 11:30)', sun: 'Bangla 2nd', mon: 'Physics / Accounting', tue: 'Higher Math', wed: 'Chemistry', thu: 'Biology' },
    { period: '3rd (11:30 - 12:15)', sun: 'Science', mon: 'Religion & Moral Ed.', tue: 'English 1st', wed: 'Bangla 1st', thu: 'Physical Education' },
    { period: 'Tiffin (12:15 - 01:00)', sun: 'Prayer & Break', mon: 'Prayer & Break', tue: 'Prayer & Break', wed: 'Prayer & Break', thu: 'Prayer & Break' },
    { period: '4th (01:00 - 01:45)', sun: 'Chemistry / Economics', mon: 'Biology / Business', tue: 'General Math', wed: 'English 2nd', thu: 'ICT Lab' },
    { period: '5th (01:45 - 02:30)', sun: 'History', mon: 'English 1st', tue: 'Biology', wed: 'Science', thu: 'Debate & Club' }
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

  const examScheduleDataEn = [
    { date: '10 Nov 2026', day: 'Sunday', subject: 'Bangla 1st Paper (101)', time: '10:00 AM - 01:00 PM', room: 'Room 101 - 106' },
    { date: '12 Nov 2026', day: 'Tuesday', subject: 'Bangla 2nd Paper (102)', time: '10:00 AM - 01:00 PM', room: 'Room 101 - 106' },
    { date: '15 Nov 2026', day: 'Sunday', subject: 'English 1st Paper (107)', time: '10:00 AM - 01:00 PM', room: 'Room 101 - 106' },
    { date: '17 Nov 2026', day: 'Tuesday', subject: 'English 2nd Paper (108)', time: '10:00 AM - 01:00 PM', room: 'Room 101 - 106' },
    { date: '19 Nov 2026', day: 'Thursday', subject: 'Mathematics (109)', time: '10:00 AM - 01:00 PM', room: 'Room 101 - 106' },
    { date: '22 Nov 2026', day: 'Sunday', subject: 'Physics / Accounting / Civics', time: '10:00 AM - 01:00 PM', room: 'Room 202 - 205' },
    { date: '24 Nov 2026', day: 'Tuesday', subject: 'Chemistry / Finance / History', time: '10:00 AM - 01:00 PM', room: 'Room 202 - 205' },
    { date: '26 Nov 2026', day: 'Thursday', subject: 'Biology / Business Ent. / Geography', time: '10:00 AM - 01:00 PM', room: 'Room 202 - 205' }
  ];

  // 3. NCTB Curriculum & Syllabus data (Senior QA H7 fix)
  const syllabusData = [
    { class: '৬ষ্ঠ শ্রেণি', subject: 'সকল আবশ্যিক বিষয়', syllabus: 'NCTB প্রণীত নতুন শিক্ষাক্রম পাঠ্যপুস্তক ও ধারাবাহিক মূল্যায়ন রূপরেখা', marks: '১০০%' },
    { class: '৭ম শ্রেণি', subject: 'সকল আবশ্যিক বিষয়', syllabus: 'অভিজ্ঞতাভিত্তিক শিখন ও সামষ্টিক মূল্যায়ন নির্দেশিকা', marks: '১০০%' },
    { class: '৮ম শ্রেণি', subject: 'সকল আবশ্যিক বিষয়', syllabus: 'পাঠ্যবই ও বিষয়ভিত্তিক শিখন অগ্রগতি মূল্যায়ন ছক', marks: '১০০%' },
    { class: '৯ম শ্রেণি', subject: 'বিজ্ঞান, ব্যবসায় ও মানবিক', syllabus: 'শাখাভিত্তিক NCTB পাঠ্যসূচি ও অর্ধবার্ষিক/বার্ষিক সিলেবাস ২০২৬', marks: '১০০%' },
    { class: '১০ম শ্রেণি', subject: 'এসএসসি পরীক্ষা ২০২৬', syllabus: 'কুমিল্লা শিক্ষা বোর্ড ও NCTB অনুমোদিত সম্পূর্ণ সংক্ষিপ্ত পাঠ্যসূচি', marks: '১০০%' }
  ];

  const syllabusDataEn = [
    { class: 'Class VI', subject: 'All Compulsory Subjects', syllabus: 'NCTB new curriculum textbooks & continuous assessment framework', marks: '100%' },
    { class: 'Class VII', subject: 'All Compulsory Subjects', syllabus: 'Experiential learning & summative evaluation guidelines', marks: '100%' },
    { class: 'Class VIII', subject: 'All Compulsory Subjects', syllabus: 'Core textbooks & subject-wise learning progress evaluation', marks: '100%' },
    { class: 'Class IX', subject: 'Science, Business & Humanities', syllabus: 'Group-wise NCTB curriculum & Half-Yearly/Annual Syllabus 2026', marks: '100%' },
    { class: 'Class X', subject: 'SSC Examination 2026', syllabus: 'Complete short syllabus approved by Comilla Board & NCTB', marks: '100%' }
  ];

  const activeClassSchedule = lang === 'bn' ? classScheduleData : classScheduleDataEn;
  const activeExamSchedule = lang === 'bn' ? examScheduleData : examScheduleDataEn;
  const activeSyllabusData = lang === 'bn' ? syllabusData : syllabusDataEn;

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

    const title = lang === 'bn' ? item.titleBn : (item.titleEn || item.titleBn);
    const effective = lang === 'bn' ? item.effectiveDate : toEnglishNumerals(item.effectiveDate);
    const isExam = item.id === 'rt-02' || item.titleBn?.includes('পরীক্ষা');
    const isSyllabus = item.id === 'rt-03' || item.titleBn?.includes('NCTB');
    const schoolLogoUrl = getSchoolLogo(schoolInfo);
    const schoolTitle = lang === 'bn' ? schoolInfo.nameBn : (schoolInfo.nameEn || schoolInfo.nameBn);
    const schoolAddr = lang === 'bn' ? schoolInfo.addressBn : (schoolInfo.addressEn || schoolInfo.addressBn);
    const schoolEiin = lang === 'bn' ? schoolInfo.eiin : toEnglishNumerals(schoolInfo.eiin);
    const hmName = lang === 'bn' ? schoolInfo.headmasterNameBn : (schoolInfo.headmasterNameEn || schoolInfo.headmasterNameBn);
    const hmDesig = lang === 'bn'
      ? schoolInfo.headmasterDesignationBn
      : ((schoolInfo.headmasterDesignationEn || 'Acting Headmaster').replace(/\s*\(Head Master,\s*In Charge\)/gi, '').trim());

    let tableHtml = '';
    if (isExam) {
      tableHtml = `
        <thead>
          <tr>
            <th>${lang === 'bn' ? 'তারিখ' : 'Date'}</th>
            <th>${lang === 'bn' ? 'বার' : 'Day'}</th>
            <th>${lang === 'bn' ? 'বিষয়ের নাম ও কোড' : 'Subject & Code'}</th>
            <th>${lang === 'bn' ? 'পরীক্ষার সময়' : 'Exam Time'}</th>
            <th>${lang === 'bn' ? 'আসন কক্ষ' : 'Room'}</th>
          </tr>
        </thead>
        <tbody>
          ${activeExamSchedule.map(row => `
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
            <th>${lang === 'bn' ? 'শ্রেণি' : 'Class'}</th>
            <th>${lang === 'bn' ? 'বিভাগ / শাখা' : 'Group / Track'}</th>
            <th>${lang === 'bn' ? 'পাঠ্যসূচি ও সিলেবাস বিবরণী' : 'Curriculum & Syllabus Details'}</th>
            <th>${lang === 'bn' ? 'মূল্যায়ন মান' : 'Evaluation'}</th>
          </tr>
        </thead>
        <tbody>
          ${activeSyllabusData.map(row => `
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
            <th>${lang === 'bn' ? 'পিরিয়ড / সময়' : 'Period / Time'}</th>
            <th>${lang === 'bn' ? 'রবিবার' : 'Sunday'}</th>
            <th>${lang === 'bn' ? 'সোমবার' : 'Monday'}</th>
            <th>${lang === 'bn' ? 'মঙ্গলবার' : 'Tuesday'}</th>
            <th>${lang === 'bn' ? 'বুধবার' : 'Wednesday'}</th>
            <th>${lang === 'bn' ? 'বৃহস্পতিবার' : 'Thursday'}</th>
          </tr>
        </thead>
        <tbody>
          ${activeClassSchedule.map(row => `
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
        <title>${title} - ${schoolTitle}</title>
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
          ${schoolLogoUrl ? `<div style="display:flex;justify-content:center;margin-bottom:8px;"><img src="${schoolLogoUrl}" alt="School Logo" style="width:48px;height:48px;object-fit:contain;border-radius:50%;border:1px solid #cbd5e1;padding:2px;" /></div>` : ''}
          <h1>${schoolTitle}</h1>
          <p>${schoolAddr} • EIIN: ${schoolEiin}</p>
        </div>
        <div class="title">${title} (${effective})</div>
        <table>
          ${tableHtml}
        </table>
        <div class="footer">
          <div><p>${lang === 'bn' ? 'প্রস্তুতকারক: রুটিন কমিটি' : 'Prepared by: Routine Committee'}</p></div>
          <div style="text-align: right;"><p><strong>${hmName}</strong><br/>${hmDesig}</p></div>
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
            {lang === 'bn' ? activeRoutineModal.titleBn : (activeRoutineModal.titleEn || activeRoutineModal.titleBn)}
          </h3>
          <p className="text-xs text-primary font-mono mb-4 font-bold mt-1">
            {lang === 'bn'
              ? `কার্যকরী তারিখ: ${activeRoutineModal.effectiveDate}`
              : `Effective Date: ${toEnglishNumerals(activeRoutineModal.effectiveDate)}`}
          </p>

          <div className="overflow-y-auto flex-1 border border-line rounded-xl mb-5">
            {isExam ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-deep text-white font-bold">
                  <tr>
                    <th className="p-2.5">{lang === 'bn' ? 'তারিখ ও বার' : 'Date & Day'}</th>
                    <th className="p-2.5">{lang === 'bn' ? 'বিষয়ের নাম' : 'Subject Name'}</th>
                    <th className="p-2.5">{lang === 'bn' ? 'সময়' : 'Time'}</th>
                    <th className="p-2.5">{lang === 'bn' ? 'কক্ষ' : 'Room'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {activeExamSchedule.map((row, idx) => (
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
                    <th className="p-2.5">{lang === 'bn' ? 'শ্রেণি' : 'Class'}</th>
                    <th className="p-2.5">{lang === 'bn' ? 'শাখা / বিভাগ' : 'Group / Track'}</th>
                    <th className="p-2.5">{lang === 'bn' ? 'পাঠ্যসূচি বিবরণ' : 'Syllabus Details'}</th>
                    <th className="p-2.5 text-center">{lang === 'bn' ? 'মূল্যায়ন মান' : 'Weightage'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {activeSyllabusData.map((row, idx) => (
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
                      <th className="p-2">{lang === 'bn' ? 'পিরিয়ড' : 'Period'}</th>
                      <th className="p-2">{lang === 'bn' ? 'রবিবার' : 'Sunday'}</th>
                      <th className="p-2">{lang === 'bn' ? 'সোমবার' : 'Monday'}</th>
                      <th className="p-2">{lang === 'bn' ? 'মঙ্গলবার' : 'Tuesday'}</th>
                      <th className="p-2">{lang === 'bn' ? 'বুধবার' : 'Wednesday'}</th>
                      <th className="p-2">{lang === 'bn' ? 'বৃহস্পতিবার' : 'Thursday'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {activeClassSchedule.map((row, idx) => (
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
                  {lang === 'bn' ? `কার্যকরী তারিখ: ${item.effectiveDate}` : `Effective: ${toEnglishNumerals(item.effectiveDate)}`}
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
                  <th className="py-3 px-3">{lang === 'bn' ? 'পিরিয়ড / সময়' : 'Period / Time'}</th>
                  <th className="py-3 px-3">{lang === 'bn' ? 'রবিবার' : 'Sunday'}</th>
                  <th className="py-3 px-3">{lang === 'bn' ? 'সোমবার' : 'Monday'}</th>
                  <th className="py-3 px-3">{lang === 'bn' ? 'মঙ্গলবার' : 'Tuesday'}</th>
                  <th className="py-3 px-3">{lang === 'bn' ? 'বুধবার' : 'Wednesday'}</th>
                  <th className="py-3 px-3">{lang === 'bn' ? 'বৃহস্পতিবার' : 'Thursday'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {activeClassSchedule.map((row, idx) => (
                  <tr key={idx} className="hover:bg-bg transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-primary whitespace-nowrap">{row.period}</td>
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
