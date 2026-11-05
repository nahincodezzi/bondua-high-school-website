import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSchool } from '../context/useSchool';
import { formatBanglaDate, toBanglaNumerals } from '../utils/dateFormatter';
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
  const { lang, notices, schoolInfo } = useSchool();
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
  ];

  const filteredNotices = notices.filter((notice) => {
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    const matchesSearch = 
      (notice.titleBn && notice.titleBn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (notice.titleEn && notice.titleEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (notice.contentBn && notice.contentBn.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handlePrintNotice = () => {
    window.print();
  };

  const modalElement = activeNoticeModal ? (
    <div 
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-modal-title"
    >
      {/* Backdrop click to close */}
      <div 
        className="fixed inset-0 -z-10" 
        onClick={() => setActiveNoticeModal(null)} 
        aria-hidden="true" 
      />

      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden border border-[#E5E7EB] animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="bg-[#14532D] text-white p-6 relative shrink-0 border-b border-[#166534]">
          <button
            onClick={() => setActiveNoticeModal(null)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-[#F59E0B] text-xs font-bold uppercase tracking-wider mb-1 font-mono">
            <Bell className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{lang === 'bn' ? 'প্রাতিষ্ঠানিক অফিসিয়াল নোটিশ' : 'Official Institutional Notice'}</span>
          </div>
          <h3 id="notice-modal-title" className="text-xl sm:text-2xl font-bold font-bangla text-white leading-tight">
            {lang === 'bn' ? activeNoticeModal.titleBn : activeNoticeModal.titleEn}
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-100 mt-2 font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>
                {lang === 'bn' ? 'প্রকাশিত: ' : 'Published: '}
                {formatBanglaDate(activeNoticeModal.publishDate || activeNoticeModal.date, lang)}
              </span>
            </span>
            <span className="badge-neutral text-[11px] uppercase tracking-wider">
              {lang === 'bn' ? 'বিভাগ: ' : 'Category: '}{activeNoticeModal.category}
            </span>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 font-bangla text-[#1F2937] text-sm leading-relaxed whitespace-pre-line bg-[#F7F9F8]">
          <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-xs">
            <p>{lang === 'bn' ? activeNoticeModal.contentBn : (activeNoticeModal.contentEn || activeNoticeModal.contentBn)}</p>
          </div>

          {/* Attached File Preview if available */}
          {activeNoticeModal.fileUrl && activeNoticeModal.fileUrl !== '#' && (
            <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] space-y-3">
              <span className="text-xs font-bold text-[#4B5563] uppercase tracking-wider block font-mono">
                {lang === 'bn' ? 'সংযুক্ত ফাইল (Attached Document):' : 'Attached Document:'}
              </span>
              {activeNoticeModal.fileUrl.startsWith('data:image/') || activeNoticeModal.fileUrl.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                <div className="relative rounded-xl overflow-hidden border border-[#E5E7EB] bg-[#F7F9F8] max-h-96 flex items-center justify-center">
                  <img 
                    src={activeNoticeModal.fileUrl} 
                    alt="Notice Attachment" 
                    className="max-h-96 w-auto object-contain"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-[#DCFCE7]/60 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-5 h-5 text-[#166534]" />
                    <span className="font-mono text-xs text-[#1F2937] truncate max-w-xs">{activeNoticeModal.fileName || 'Notice_Attachment.pdf'}</span>
                  </div>
                  <a
                    href={activeNoticeModal.fileUrl}
                    download={activeNoticeModal.fileName || 'notice_file.pdf'}
                    className="btn-accent px-3 py-1.5 text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'ডাউনলোড' : 'Download'}</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Institute Sign-off */}
          <div className="pt-4 border-t border-[#E5E7EB] text-xs text-[#4B5563] flex justify-between items-end">
            <div>
              <p className="font-bold text-[#1F2937]">{lang === 'bn' ? schoolInfo.nameBn : (schoolInfo.nameEn || 'Bandua Daulatpur High School')}</p>
              <p>ফুলগাজী, ফেনী • EIIN: {schoolInfo.eiin}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#1F2937] font-serif italic text-sm">{schoolInfo.headmasterNameBn}</p>
              <p>{lang === 'bn' ? schoolInfo.headmasterDesignationBn : schoolInfo.headmasterDesignationEn}</p>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="p-4 bg-white border-t border-[#E5E7EB] flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={handlePrintNotice}
            className="px-4 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-[#D1D5DB]"
          >
            <Printer className="w-4 h-4" />
            <span>{lang === 'bn' ? 'প্রিন্ট করুন' : 'Print'}</span>
          </button>
          <button
            onClick={() => setActiveNoticeModal(null)}
            className="btn-secondary px-6 py-2 text-xs font-bold cursor-pointer"
          >
            {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <section className="py-12 sm:py-16 text-slate-800 font-bangla relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-[#DCFCE7] text-[#14532D] text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-xs border border-emerald-300">
            <Bell className="w-3.5 h-3.5 text-[#166534]" />
            <span>{lang === 'bn' ? 'অফিসিয়াল বিজ্ঞপ্তি' : 'Official Notice Board'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-bangla text-slate-900 leading-tight">
            {lang === 'bn' ? 'বিদ্যালয়ের সাম্প্রতিক নোটিশ ও নির্দেশিকা' : 'Latest School Notices & Circulars'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-bangla mt-1.5 max-w-xl mx-auto">
            {lang === 'bn' 
              ? 'ভর্তি, পরীক্ষা, ফলাফল ও ক্লাস রুটিন সম্পর্কিত সকল প্রাতিষ্ঠানিক ঘোষণা'
              : 'Keep up with official announcements regarding admissions, exams, results & holidays.'}
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-[#E5E7EB] mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-bangla transition-all active:scale-95 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#166534] text-white shadow-xs'
                    : 'bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB] border border-[#E5E7EB]'
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
            <Search className="w-4 h-4 text-[#4B5563] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="notice-search"
              name="noticeQuery"
              type="text"
              placeholder={lang === 'bn' ? 'নোটিশ খুঁজুন...' : 'Search notices...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#D1D5DB] bg-[#F7F9F8] text-[#1F2937] text-xs focus:ring-2 focus:ring-[#166534] focus:outline-none"
            />
          </div>
        </div>

        {/* Notices Container: Table on Desktop/Tablet (>= sm), Cards on Mobile (< sm) (M2) */}
        <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-xs">
          {/* Desktop & Tablet Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#14532D] text-white font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4 w-36">{lang === 'bn' ? 'প্রকাশের তারিখ' : 'Date'}</th>
                  <th className="py-3.5 px-4">{lang === 'bn' ? 'বিজ্ঞপ্তির শিরোনাম' : 'Notice Title'}</th>
                  <th className="py-3.5 px-4 w-28 text-center">{lang === 'bn' ? 'বিভাগ' : 'Category'}</th>
                  <th className="py-3.5 px-4 w-32 text-center">{lang === 'bn' ? 'কার্যক্রম' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredNotices.length > 0 ? (
                  filteredNotices.map((notice, index) => {
                    const formattedDate = formatBanglaDate(notice.publishDate || notice.date, lang);
                    return (
                      <tr 
                        key={notice.id} 
                        className="hover:bg-[#F7F9F8] transition-colors cursor-pointer text-[#1F2937]"
                        onClick={() => setActiveNoticeModal(notice)}
                      >
                        <td className="py-3.5 px-4 text-center font-mono text-[#4B5563] text-xs">
                          {lang === 'bn' ? toBanglaNumerals(index + 1) : index + 1}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-[#4B5563] whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#166534] shrink-0" />
                            <span>{formattedDate}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#1F2937]">
                          <div className="flex items-center gap-2">
                            {notice.isUrgent && (
                              <span className="badge-danger text-[10px] shrink-0">
                                {lang === 'bn' ? 'জরুরি' : 'Urgent'}
                              </span>
                            )}
                            <span className="hover:text-[#166534] transition line-clamp-1">
                              {lang === 'bn' ? notice.titleBn : notice.titleEn}
                            </span>
                            {notice.fileUrl && notice.fileUrl !== '#' && (
                              <span className="text-[#166534] shrink-0 inline-flex items-center gap-0.5" title="ফাইল সংযুক্ত">
                                <Paperclip className="w-3.5 h-3.5 text-[#166534]" />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="badge-neutral text-[11px] px-2.5 py-0.5 rounded-full capitalize">
                            {notice.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setActiveNoticeModal(notice)}
                              className="bg-[#DCFCE7] hover:bg-[#bbf7d0] text-[#14532D] p-1.5 px-3 rounded-md text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer active:scale-95 border border-emerald-300"
                              title="View Notice Details"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#166534]" />
                              <span>{lang === 'bn' ? 'দেখুন' : 'View'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-[#4B5563] font-bangla">
                      {lang === 'bn' ? 'কোনো নোটিশ পাওয়া যায়নি।' : 'No notices found matching your criteria.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards View (< sm) (M2) */}
          <div className="block sm:hidden divide-y divide-[#E5E7EB]">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => {
                const formattedDate = formatBanglaDate(notice.publishDate || notice.date, lang);
                return (
                  <div 
                    key={notice.id}
                    onClick={() => setActiveNoticeModal(notice)}
                    className="p-4 hover:bg-[#F7F9F8] transition-colors cursor-pointer space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs text-[#4B5563]">
                      <span className="flex items-center gap-1.5 text-[#166534] font-medium font-mono text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-[#166534] shrink-0" />
                        <span>{formattedDate}</span>
                      </span>
                      <span className="badge-neutral text-[10px] px-2 py-0.5 rounded-full capitalize">
                        {notice.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#1F2937] leading-snug line-clamp-2">
                      {notice.isUrgent && (
                        <span className="badge-danger text-[10px] mr-1.5 align-middle">
                          {lang === 'bn' ? 'জরুরি' : 'Urgent'}
                        </span>
                      )}
                      {lang === 'bn' ? notice.titleBn : notice.titleEn}
                    </h3>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1 text-xs text-[#4B5563]">
                        {notice.fileUrl && notice.fileUrl !== '#' && (
                          <span className="inline-flex items-center gap-1 text-[#166534] font-mono text-[10px]">
                            <Paperclip className="w-3.5 h-3.5 text-[#166534]" />
                            <span>PDF Attached</span>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveNoticeModal(notice);
                        }}
                        className="bg-[#DCFCE7] text-[#14532D] px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1 border border-emerald-300"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#166534]" />
                        <span>{lang === 'bn' ? 'বিস্তারিত' : 'Details'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-[#4B5563] font-bangla text-xs">
                {lang === 'bn' ? 'কোনো নোটিশ পাওয়া যায়নি।' : 'No notices found matching your criteria.'}
              </div>
            )}
          </div>
        </div>

        {/* Portal-Rendered Notice Details Modal (C7, M6) */}
        {typeof document !== 'undefined' && modalElement && createPortal(modalElement, document.body)}
      </div>
    </section>
  );
}
