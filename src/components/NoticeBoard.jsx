import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import SchoolLogo from './common/SchoolLogo';
import { useSchool } from '../context/useSchool';
import { formatBanglaDate, toBanglaNumerals } from '../utils/dateFormatter';
import { getSignatories } from '../utils/signatories';
import { 
  Bell, 
  Search, 
  Calendar, 
  Eye, 
  Download, 
  X, 
  Printer, 
  Paperclip
} from 'lucide-react';

export default function NoticeBoard() {
  const { lang, notices, schoolInfo, teachers, systemUsers } = useSchool();
  const signatories = getSignatories(schoolInfo, teachers, systemUsers);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNoticeModal, setActiveNoticeModal] = useState(null);

  // Close modal on Escape key press (M6)
  useEffect(() => {
    if (!activeNoticeModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveNoticeModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeNoticeModal]);

  // Lock body scroll when notice detail modal is open (M6)
  useEffect(() => {
    if (activeNoticeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeNoticeModal]);

  const categories = [
    { id: 'all', labelBn: 'সকল নোটিশ', labelEn: 'All Notices' },
    { id: 'admission', labelBn: 'ভর্তি সংক্রান্ত', labelEn: 'Admission' },
    { id: 'exam', labelBn: 'পরীক্ষা ও ফলাফল', labelEn: 'Exam & Result' },
    { id: 'academic', labelBn: 'অ্যাকাডেমিক', labelEn: 'Academic' },
    { id: 'event', labelBn: 'অনুষ্ঠান ও ছুটি', labelEn: 'Events & Holidays' },
    { id: 'sports', labelBn: 'খেলাধুলা ও সহপাঠ্য', labelEn: 'Sports & Co-curricular' },
  ];

  // Category translation helper for localized chips (L3)
  const getCategoryLabel = (cat, language) => {
    const map = {
      academic: { bn: 'একাডেমিক', en: 'Academic' },
      exam: { bn: 'পরীক্ষা', en: 'Exam' },
      admission: { bn: 'ভর্তি', en: 'Admission' },
      event: { bn: 'অনুষ্ঠান ও ছুটি', en: 'Events' },
      holiday: { bn: 'ছুটি', en: 'Holiday' },
      sports: { bn: 'খেলাধুলা ও সহপাঠ্য', en: 'Sports' },
      general: { bn: 'সাধারণ', en: 'General' }
    };
    const key = (cat || '').toLowerCase();
    if (map[key]) {
      return language === 'bn' ? map[key].bn : map[key].en;
    }
    return cat;
  };

  const filteredNotices = notices.filter((notice) => {
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    const matchesSearch = 
      (notice.titleBn && notice.titleBn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (notice.titleEn && notice.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (notice.contentBn && notice.contentBn.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handlePrintNotice = () => {
    document.body.classList.add('printing-modal');
    document.body.classList.add('printing-notice');
    const cleanup = () => {
      document.body.classList.remove('printing-modal');
      document.body.classList.remove('printing-notice');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    window.print();
    setTimeout(cleanup, 1200);
  };

  useEffect(() => {
    if (!activeNoticeModal) return;
    document.body.classList.add('printing-notice');
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handlePrintNotice();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('printing-notice');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeNoticeModal]);

  const modalElement = activeNoticeModal ? (
    <div 
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 print:static print:inset-auto print:p-0 print:m-0 print:bg-transparent print:backdrop-blur-none print:block print:w-full print:h-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-modal-title"
    >
      {/* Backdrop click to close */}
      <div 
        className="fixed inset-0 -z-10 no-print print:hidden" 
        onClick={() => setActiveNoticeModal(null)} 
        aria-hidden="true" 
      />

      <div className="bg-white max-w-3xl w-full rounded-2xl shadow-2xl overflow-hidden border border-line animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] print:max-w-full print:shadow-none print:border-none print:rounded-none print:m-0 print:max-h-none print:static" id="official-notice-modal">
        {/* Screen-Only Header */}
        <div className="bg-deep text-white p-6 relative shrink-0 border-b border-primary screen-only no-print print:hidden">
          <button
            onClick={() => setActiveNoticeModal(null)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer no-print print:hidden"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider mb-1 font-mono">
            <Bell className="w-3.5 h-3.5 text-accent" />
            <span>{lang === 'bn' ? 'প্রাতিষ্ঠানিক অফিসিয়াল নোটিশ' : 'Official Institutional Notice'}</span>
          </div>
          <h3 id="notice-modal-title" className="text-xl sm:text-2xl font-bold font-bangla text-white leading-tight">
            {lang === 'bn' ? activeNoticeModal.titleBn : activeNoticeModal.titleEn}
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/95 mt-2 font-mono font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-accent" />
              <span>
                {lang === 'bn' ? 'প্রকাশিত: ' : 'Published: '}
                {formatBanglaDate(activeNoticeModal.publishDate || activeNoticeModal.date, lang)}
              </span>
            </span>
            <span className="badge-neutral text-[11px] uppercase tracking-wider">
              {lang === 'bn' ? 'বিভাগ: ' : 'Category: '}{getCategoryLabel(activeNoticeModal.category, lang)}
            </span>
          </div>
        </div>

        {/* Official Printable Institutional Letterhead (Shown in Print) */}
        <div className="hidden print:block print-only-letterhead p-4 pb-2 border-b-2 border-slate-900 bg-white">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full border border-slate-300 p-0.5 shrink-0">
              <SchoolLogo logo={schoolInfo.logo} />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-extrabold text-slate-900 font-bangla leading-tight">
                {schoolInfo.nameBn}
              </h1>
              <p className="text-[10pt] text-slate-700 font-bangla">
                {schoolInfo.addressBn} • কুমিল্লা শিক্ষা বোর্ড
              </p>
              <p className="text-[8pt] text-slate-600 font-mono">
                EIIN: {schoolInfo.eiin} • MPO: {schoolInfo.mpoCode} • স্থাপিত: ১৯৯০
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center text-[8.5pt] font-mono border-t border-b border-slate-300 py-1 mt-2 font-semibold">
            <span>স্মারক নং: বদৌউবি/বিজ্ঞপ্তি/{toBanglaNumerals((activeNoticeModal.id || '1').replace(/\D/g, '') || '০১')}/২০২৬</span>
            <span>তারিখ: {formatBanglaDate(activeNoticeModal.publishDate || activeNoticeModal.date, lang)}</span>
          </div>
          <div className="mt-2 text-center">
            <span className="inline-block bg-slate-900 text-white text-[9pt] font-bold px-3 py-0.5 rounded font-bangla uppercase tracking-wider">
              প্রাতিষ্ঠানিক অফিসিয়াল বিজ্ঞপ্তি
            </span>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 space-y-5 overflow-y-auto flex-1 font-bangla text-ink text-sm leading-relaxed whitespace-pre-line bg-bg print:bg-white print:p-4 print:space-y-3 print:overflow-visible">
          {/* Subject Line */}
          <div className="p-3 bg-white rounded-xl border border-line shadow-xs print:border-none print:shadow-none print:p-0">
            <h2 className="text-base sm:text-lg font-extrabold font-bangla text-deep border-b border-line pb-2 print:text-base print:border-b-2 print:border-slate-800">
              বিষয়: {lang === 'bn' ? activeNoticeModal.titleBn : (activeNoticeModal.titleEn || activeNoticeModal.titleBn)}
            </h2>
            <div className="mt-3 text-ink leading-relaxed text-justify print:text-[10.5pt]">
              {lang === 'bn' ? activeNoticeModal.contentBn : (activeNoticeModal.contentEn || activeNoticeModal.contentBn)}
            </div>
          </div>

          {/* Attached File Preview if available */}
          {activeNoticeModal.fileUrl && activeNoticeModal.fileUrl !== '#' && (
            <div className="bg-white p-4 rounded-xl border border-line space-y-3 print:p-2 print:border-slate-300">
              <span className="text-xs font-bold text-muted uppercase tracking-wider block font-mono print:text-[8pt]">
                {lang === 'bn' ? 'সংযুক্ত ফাইল / বিজ্ঞপ্তির অংশ:' : 'Attached Document:'}
              </span>
              {activeNoticeModal.fileUrl.startsWith('data:image/') || activeNoticeModal.fileUrl.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                <div className="relative rounded-xl overflow-hidden border border-line bg-bg max-h-96 flex items-center justify-center print:max-h-72 print:border-none">
                  <img 
                    src={activeNoticeModal.fileUrl} 
                    alt="Notice Attachment" 
                    className="max-h-96 w-auto object-contain print:max-h-72"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-soft/60 rounded-xl border border-soft-border print:p-1.5">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-5 h-5 text-primary print:w-4 print:h-4" />
                    <span className="font-mono text-xs text-ink truncate max-w-xs print:text-[9pt]">{activeNoticeModal.fileName || 'Notice_Attachment.pdf'}</span>
                  </div>
                  <a
                    href={activeNoticeModal.fileUrl}
                    download={activeNoticeModal.fileName || 'notice_file.pdf'}
                    className="btn-accent px-3 py-1.5 text-xs font-bold flex items-center gap-1 shadow-xs no-print print:hidden"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'ডাউনলোড' : 'Download'}</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Official Sign-off & Seal */}
          <div className="pt-6 border-t border-line text-xs text-muted flex justify-between items-end print:pt-4 print:border-t-2 print:border-slate-800">
            {/* Distribution List (Left) */}
            <div className="text-[8pt] text-slate-600 font-bangla space-y-0.5 text-left max-w-xs">
              <p className="font-bold text-slate-800">অনুলিপি অবগতির জন্য ও কার্যার্থে প্রেরিত:</p>
              <p>১. সহকারী প্রধান শিক্ষক ও সকল শিক্ষক-কর্মচারী</p>
              <p>২. নোটিশ বোর্ড ও বিদ্যালয় অফিস নথি</p>
              <p>৩. বিদ্যালয় ওয়েবসাইট / অনলাইন নোটিশ বোর্ড</p>
            </div>

            {/* Institute Official Seal Stamp (Center) */}
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary text-primary flex flex-col items-center justify-center p-1 text-[7px] text-center font-bold">
              <span>BONDUA DAULATPUR</span>
              <span>HIGH SCHOOL</span>
              <span>SEAL</span>
            </div>

            {/* Dynamic Headmaster Signature & Designation (Right) */}
            <div className="text-center space-y-0.5 min-w-[140px]">
              <div className="w-32 border-b border-slate-400 mx-auto pb-0.5">
                <span className="font-serif italic text-primary font-bold text-base print:text-sm">
                  {signatories.headmaster.signature}
                </span>
              </div>
              <p className="font-bold text-ink font-bangla text-xs print:text-[9pt]">
                {signatories.headmaster.nameBn}
              </p>
              <p className="text-muted text-[10px] font-bangla print:text-[8pt]">
                {signatories.headmaster.designationBn}
              </p>
              <p className="text-muted text-[9px] print:text-[7.5pt]">
                {schoolInfo.nameBn}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons Footer - Hidden during print */}
        <div className="p-4 bg-white border-t border-line flex items-center justify-between gap-3 shrink-0 modal-footer no-print print:hidden">
          <button
            onClick={handlePrintNotice}
            className="px-4 py-2 bg-bg hover:bg-soft text-ink rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-line no-print print:hidden"
          >
            <Printer className="w-4 h-4" />
            <span>{lang === 'bn' ? 'প্রিন্ট করুন' : 'Print'}</span>
          </button>
          <button
            onClick={() => setActiveNoticeModal(null)}
            className="btn-secondary px-6 py-2 text-xs font-bold cursor-pointer no-print print:hidden"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <section className={`py-12 sm:py-16 text-ink font-bangla relative z-10 ${activeNoticeModal ? 'no-print' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-soft text-deep text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-xs border border-soft-border">
            <Bell className="w-3.5 h-3.5 text-primary" />
            <span>{lang === 'bn' ? 'অফিসিয়াল বিজ্ঞপ্তি' : 'Official Notice Board'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-bangla text-ink leading-tight">
            {lang === 'bn' ? 'বিদ্যালয়ের সাম্প্রতিক নোটিশ ও নির্দেশিকা' : 'Latest School Notices & Circulars'}
          </h2>
          <p className="text-xs sm:text-sm text-muted font-bangla mt-1.5 max-w-xl mx-auto">
            {lang === 'bn' 
              ? 'ভর্তি, পরীক্ষা, ফলাফল ও ক্লাস রুটিন সম্পর্কিত সকল প্রাতিষ্ঠানিক ঘোষণা'
              : 'Keep up with official announcements regarding admissions, exams, results & holidays.'}
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-line mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-bangla transition-all active:scale-95 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-bg text-ink hover:bg-soft border border-line'
                }`}
              >
                {lang === 'bn' ? cat.labelBn : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <label htmlFor="notice-search" className="sr-only">
              {lang === 'bn' ? 'নোটিশ খুঁজুন' : 'Search notices'}
            </label>
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="notice-search"
              name="noticeQuery"
              type="text"
              placeholder={lang === 'bn' ? 'নোটিশ খুঁজুন...' : 'Search notices...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-line bg-bg text-ink text-xs focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Notices Container: Table on Desktop/Tablet (>= sm), Cards on Mobile (< sm) (M2) */}
        <div className="bg-white rounded-2xl overflow-hidden border border-line shadow-xs">
          {/* Desktop & Tablet Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-deep text-white font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4 w-36">{lang === 'bn' ? 'প্রকাশের তারিখ' : 'Date'}</th>
                  <th className="py-3.5 px-4">{lang === 'bn' ? 'বিজ্ঞপ্তির শিরোনাম' : 'Notice Title'}</th>
                  <th className="py-3.5 px-4 w-28 text-center">{lang === 'bn' ? 'বিভাগ' : 'Category'}</th>
                  <th className="py-3.5 px-4 w-32 text-center">{lang === 'bn' ? 'কার্যক্রম' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredNotices.length > 0 ? (
                  filteredNotices.map((notice, index) => {
                    const formattedDate = formatBanglaDate(notice.publishDate || notice.date, lang);
                    return (
                      <tr 
                        key={notice.id} 
                        className="hover:bg-bg transition-colors cursor-pointer text-ink"
                        onClick={() => setActiveNoticeModal(notice)}
                      >
                        <td className="py-3.5 px-4 text-center font-mono text-muted text-xs">
                          {lang === 'bn' ? toBanglaNumerals(index + 1) : index + 1}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-muted whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>{formattedDate}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-ink">
                          <div className="flex items-center gap-2">
                            {notice.isUrgent && (
                              <span className="badge-danger text-[10px] shrink-0">
                                {lang === 'bn' ? 'জরুরি' : 'Urgent'}
                              </span>
                            )}
                            <span className="hover:text-primary transition line-clamp-1">
                              {lang === 'bn' ? notice.titleBn : (notice.titleEn || notice.titleBn)}
                            </span>
                            {notice.fileUrl && notice.fileUrl !== '#' && (
                              <span className="text-primary shrink-0 inline-flex items-center gap-0.5" title="ফাইল সংযুক্ত">
                                <Paperclip className="w-3.5 h-3.5 text-primary" />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="badge-neutral text-[11px] px-2.5 py-0.5 rounded-full">
                            {getCategoryLabel(notice.category, lang)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setActiveNoticeModal(notice)}
                              className="bg-soft hover:bg-soft text-deep p-1.5 px-3 rounded-md text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer active:scale-95 border border-soft-border"
                              title="View Notice Details"
                            >
                              <Eye className="w-3.5 h-3.5 text-primary" />
                              <span>{lang === 'bn' ? 'দেখুন' : 'View'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-muted font-bangla">
                      {lang === 'bn' ? 'কোনো নোটিশ পাওয়া যায়নি।' : 'No notices found matching your criteria.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards View (< sm) (M2) */}
          <div className="block sm:hidden divide-y divide-line">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => {
                const formattedDate = formatBanglaDate(notice.publishDate || notice.date, lang);
                return (
                  <div 
                    key={notice.id}
                    onClick={() => setActiveNoticeModal(notice)}
                    className="p-4 hover:bg-bg transition-colors cursor-pointer space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span className="flex items-center gap-1.5 text-primary font-medium font-mono text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{formattedDate}</span>
                      </span>
                      <span className="badge-neutral text-[10px] px-2 py-0.5 rounded-full">
                        {getCategoryLabel(notice.category, lang)}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-ink leading-snug line-clamp-2">
                      {notice.isUrgent && (
                        <span className="badge-danger text-[10px] mr-1.5 align-middle">
                          {lang === 'bn' ? 'জরুরি' : 'Urgent'}
                        </span>
                      )}
                      {lang === 'bn' ? notice.titleBn : notice.titleEn}
                    </h3>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1 text-xs text-muted">
                        {notice.fileUrl && notice.fileUrl !== '#' && (
                          <span className="inline-flex items-center gap-1 text-primary font-mono text-[10px]">
                            <Paperclip className="w-3.5 h-3.5 text-primary" />
                            <span>PDF Attached</span>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveNoticeModal(notice);
                        }}
                        className="bg-soft text-deep px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 border border-soft-border"
                      >
                        <Eye className="w-3.5 h-3.5 text-primary" />
                        <span>{lang === 'bn' ? 'বিস্তারিত' : 'Details'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-muted font-bangla text-xs">
                {lang === 'bn' ? 'কোনো নোটিশ পাওয়া যায়নি।' : 'No notices found matching your criteria.'}
              </div>
            )}
          </div>
        </div>

        {/* Portal-Rendered Notice Details Modal (C7, M6 - Direct to body for clean 1-page print) */}
        {typeof document !== 'undefined' && modalElement && createPortal(modalElement, document.body)}
      </div>
    </section>
  );
}
