import React, { useState } from 'react';
import { useSchool } from '../context/useSchool';
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
      notice.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.contentBn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePrintNotice = () => {
    window.print();
  };

  return (
    <section className="py-12 sm:py-16 text-slate-800 font-bangla relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100/80 text-emerald-900 text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-xs border border-emerald-200">
            <Bell className="w-3.5 h-3.5 text-emerald-700" />
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
        <div className="glass-card rounded-2xl p-3 sm:p-4 border border-slate-200 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-bangla transition-all active:scale-95 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'btn-gold shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {lang === 'bn' ? cat.labelBn : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'bn' ? 'নোটিশ খুঁজুন...' : 'Search notices...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Notices Table / Cards List */}
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-200 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4 w-28">{lang === 'bn' ? 'প্রকাশের তারিখ' : 'Date'}</th>
                  <th className="py-3.5 px-4">{lang === 'bn' ? 'বিজ্ঞপ্তির শিরোনাম' : 'Notice Title'}</th>
                  <th className="py-3.5 px-4 w-28 text-center">{lang === 'bn' ? 'বিভাগ' : 'Category'}</th>
                  <th className="py-3.5 px-4 w-32 text-center">{lang === 'bn' ? 'কার্যক্রম' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNotices.length > 0 ? (
                  filteredNotices.map((notice, index) => (
                    <tr 
                      key={notice.id} 
                      className="hover:bg-slate-50 transition-colors cursor-pointer text-slate-800"
                      onClick={() => setActiveNoticeModal(notice)}
                    >
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400 text-xs">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{notice.publishDate}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          {notice.isUrgent && (
                            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 animate-pulse">
                              {lang === 'bn' ? 'জরুরি' : 'Urgent'}
                            </span>
                          )}
                          <span className="hover:text-emerald-800 transition line-clamp-1">
                            {lang === 'bn' ? notice.titleBn : notice.titleEn}
                          </span>
                          {notice.fileUrl && notice.fileUrl !== '#' && (
                            <span className="text-emerald-700 shrink-0 inline-flex items-center gap-0.5" title="ফাইল সংযুক্ত">
                              <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 capitalize">
                          {notice.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setActiveNoticeModal(notice)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 p-1.5 px-3 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95 border border-emerald-200"
                            title="View Notice Details"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-700" />
                            <span className="hidden sm:inline">{lang === 'bn' ? 'দেখুন' : 'View'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-500 font-bangla">
                      {lang === 'bn' ? 'কোনো নোটিশ পাওয়া যায়নি।' : 'No notices found matching your criteria.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Official Notice Modal / Lightbox */}
        {activeNoticeModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              {/* Modal Top Header */}
              <div className="bg-emerald-950 text-white p-6 relative shrink-0">
                <button
                  onClick={() => setActiveNoticeModal(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1 font-mono">
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'bn' ? 'প্রাতিষ্ঠানিক অফিসিয়াল নোটিশ' : 'Official Institutional Notice'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-bangla text-white leading-tight">
                  {lang === 'bn' ? activeNoticeModal.titleBn : activeNoticeModal.titleEn}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200 mt-2 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-300" />
                    <span>প্রকাশিত: {activeNoticeModal.publishDate}</span>
                  </span>
                  <span className="bg-emerald-900 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider border border-emerald-800">
                    বিভাগ: {activeNoticeModal.category}
                  </span>
                </div>
              </div>

              {/* Modal Content Body */}
              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 font-bangla text-slate-800 text-sm leading-relaxed whitespace-pre-line bg-slate-50">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <p>{lang === 'bn' ? activeNoticeModal.contentBn : (activeNoticeModal.contentEn || activeNoticeModal.contentBn)}</p>
                </div>

                {/* Attached File Preview if available */}
                {activeNoticeModal.fileUrl && activeNoticeModal.fileUrl !== '#' && (
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-mono">
                      সংযুক্ত ফাইল (Attached Document):
                    </span>
                    {activeNoticeModal.fileUrl.startsWith('data:image/') || activeNoticeModal.fileUrl.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-96 flex items-center justify-center">
                        <img 
                          src={activeNoticeModal.fileUrl} 
                          alt="Notice Attachment" 
                          className="max-h-96 w-auto object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-5 h-5 text-emerald-700" />
                          <span className="font-mono text-xs text-slate-700 truncate max-w-xs">{activeNoticeModal.fileName || 'Notice_Attachment.pdf'}</span>
                        </div>
                        <a
                          href={activeNoticeModal.fileUrl}
                          download={activeNoticeModal.fileName || 'notice_file.pdf'}
                          className="btn-gold px-3 py-1.5 text-xs font-bold flex items-center gap-1 shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>ডাউনলোড</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Institute Sign-off */}
                <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-end">
                  <div>
                    <p className="font-bold text-slate-800">{schoolInfo.nameBn}</p>
                    <p>ফুলগাজী, ফেনী • EIIN: {schoolInfo.eiin}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800 font-serif italic text-sm">{schoolInfo.headmasterNameBn}</p>
                    <p>{schoolInfo.headmasterDesignationBn}</p>
                  </div>
                </div>
              </div>

              {/* Modal Action Buttons Footer */}
              <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
                <button
                  onClick={handlePrintNotice}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>প্রিন্ট করুন</span>
                </button>
                <button
                  onClick={() => setActiveNoticeModal(null)}
                  className="px-6 py-2 btn-gold text-xs font-bold shadow-sm cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
