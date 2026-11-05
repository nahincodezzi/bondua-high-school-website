import React, { useState } from 'react';
import SchoolLogo from './common/SchoolLogo';
import { useSchool } from '../context/useSchool';
import { 
  Bell, 
  Search, 
  Calendar, 
  Eye, 
  X, 
  Printer, 
  FileText,
  Download,
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
    { id: 'exam', labelBn: 'পরীক্ষা ও ফলাফল', labelEn: 'Examinations' },
    { id: 'academic', labelBn: 'অ্যাকাডেমিক', labelEn: 'Academic' },
    { id: 'event', labelBn: 'অনুষ্ঠান ও ছুটি', labelEn: 'Events & Holidays' },
  ];

  const filteredNotices = notices.filter(n => {
    const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
    const title = (lang === 'bn' ? n.titleBn : n.titleEn).toLowerCase();
    const matchesSearch = title.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePrintNotice = () => {
    window.print();
  };

  return (
    <section className="py-16 text-white font-bangla relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 glass-pill text-amber-300 text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-md">
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'bn' ? 'অফিসিয়াল বিজ্ঞপ্তি' : 'Official Notice Board'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-bangla text-white drop-shadow-md">
            {lang === 'bn' ? 'বিদ্যালয়ের সাম্প্রতিক নোটিশ ও নির্দেশিকা' : 'Latest School Notices & Circulars'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-bangla mt-1.5 max-w-xl mx-auto">
            {lang === 'bn' 
              ? 'ভর্তি, পরীক্ষা, ফলাফল ও ক্লাস রুটিন সম্পর্কিত সকল প্রাতিষ্ঠানিক ঘোষণা'
              : 'Keep up with official announcements regarding admissions, exams, results & holidays.'}
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="glass-card rounded-2xl p-3 sm:p-4 border border-white/15 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl shadow-xl">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-bangla transition-all active:scale-95 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'btn-gold shadow-md'
                    : 'glass-pill text-slate-200 hover:text-white hover:border-amber-400/40'
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
              className="w-full pl-9 pr-4 py-2 rounded-full glass-input text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Notices Table / Cards List */}
        <div className="glass-card rounded-3xl overflow-hidden border border-white/15 shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="glass-capsule text-amber-300 font-bold text-xs uppercase tracking-wider border-b border-white/15">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4 w-28">{lang === 'bn' ? 'প্রকাশের তারিখ' : 'Date'}</th>
                  <th className="py-3.5 px-4">{lang === 'bn' ? 'বিজ্ঞপ্তির শিরোনাম' : 'Notice Title'}</th>
                  <th className="py-3.5 px-4 w-28 text-center">{lang === 'bn' ? 'বিভাগ' : 'Category'}</th>
                  <th className="py-3.5 px-4 w-32 text-center">{lang === 'bn' ? 'কার্যক্রম' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredNotices.length > 0 ? (
                  filteredNotices.map((notice, index) => (
                    <tr 
                      key={notice.id} 
                      className="hover:bg-white/10 transition-colors cursor-pointer text-slate-200"
                      onClick={() => setActiveNoticeModal(notice)}
                    >
                      <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-xs">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-emerald-300 whitespace-nowrap">
                        <span className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          {notice.date}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bangla">
                        <div className="flex items-center gap-2">
                          {notice.isUrgent && (
                            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-xs">
                              {lang === 'bn' ? 'জরুরি' : 'Urgent'}
                            </span>
                          )}
                          <span className="font-semibold text-white group-hover:text-amber-300 transition-colors">
                            {lang === 'bn' ? notice.titleBn : notice.titleEn}
                          </span>
                          {notice.fileUrl && notice.fileUrl !== '#' && (
                            <span className="text-amber-400 shrink-0 inline-flex items-center gap-0.5" title="ফাইল সংযুক্ত">
                              <Paperclip className="w-3.5 h-3.5 text-amber-400" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="glass-pill text-emerald-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30 capitalize">
                          {notice.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setActiveNoticeModal(notice)}
                            className="glass-pill hover:bg-amber-400 hover:text-slate-950 text-white p-1.5 px-3 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                            title="View Notice Details"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-400" />
                            <span className="hidden sm:inline">{lang === 'bn' ? 'দেখুন' : 'View'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400 font-bangla">
                      {lang === 'bn' ? 'কোনো নোটিশ পাওয়া যায়নি।' : 'No notices found matching your criteria.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notice Preview Modal */}
        {activeNoticeModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in duration-200">
              {/* Modal Top Control Bar */}
              <div className="bg-emerald-950 text-white px-5 py-3 flex items-center justify-between no-print">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'bn' ? 'প্রাতিষ্ঠানিক বিজ্ঞপ্তি পত্র' : 'Official Notice Document'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintNotice}
                    className="p-1.5 hover:bg-emerald-800 text-emerald-200 hover:text-white rounded transition flex items-center gap-1 text-xs"
                    title="Print Notice"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
                  </button>
                  <button
                    onClick={() => setActiveNoticeModal(null)}
                    className="p-1.5 hover:bg-rose-700 text-white rounded transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Notice Paper Content */}
              <div className="p-6 sm:p-8 space-y-6 bg-white" id="printable-notice">
                {/* Official Letterhead */}
                <div className="text-center border-b-2 border-emerald-900 pb-4">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white p-0.5 shadow ring-1 ring-emerald-800">
                    <SchoolLogo logo={schoolInfo.logo} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-bangla text-emerald-950">
                    {lang === 'bn' ? schoolInfo.nameBn : schoolInfo.nameEn}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {lang === 'bn' ? schoolInfo.nameEn : schoolInfo.nameBn}
                  </p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    EIIN: {schoolInfo.eiin} • MPO Code: {schoolInfo.mpoCode} • Anandapur, Fulgazi, Feni
                  </p>
                </div>

                {/* Date & Ref */}
                <div className="flex justify-between items-center text-xs text-slate-600 border-b border-slate-200 pb-2">
                  <span>স্মারক নং: ব দৌ উ বি/বিজ্ঞপ্তি/২০২৬/{activeNoticeModal.id}</span>
                  <span className="font-mono">তারিখ: {activeNoticeModal.date}</span>
                </div>

                {/* Notice Title */}
                <div className="text-center py-2">
                  <span className="inline-block bg-slate-100 text-slate-800 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2">
                    {lang === 'bn' ? 'বিজ্ঞপ্তি' : 'CIRCULAR'}
                  </span>
                  <h4 className="text-lg sm:text-xl font-bold font-bangla text-slate-900">
                    {lang === 'bn' ? activeNoticeModal.titleBn : activeNoticeModal.titleEn}
                  </h4>
                </div>

                {/* Body Content */}
                <div className="text-sm font-bangla text-slate-700 leading-relaxed min-h-[140px] whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  {lang === 'bn' ? activeNoticeModal.contentBn : activeNoticeModal.contentEn}
                </div>

                {/* Attached Document File Download if available */}
                {activeNoticeModal.fileUrl && activeNoticeModal.fileUrl !== '#' && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center justify-between no-print">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-800" />
                      <div>
                        <p className="font-bold text-emerald-950 text-xs font-bangla">সংযুক্ত অফিসিয়াল বিজ্ঞপ্তি / ডকুমেন্ট ফাইল</p>
                        <p className="text-[10px] text-emerald-700 font-mono">{activeNoticeModal.fileName || 'Notice-Document'}</p>
                      </div>
                    </div>
                    <a
                      href={activeNoticeModal.fileUrl}
                      download={activeNoticeModal.fileName || `Notice-${activeNoticeModal.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'ডকুমেন্ট দেখুন / ডাউনলোড' : 'View / Download'}</span>
                    </a>
                  </div>
                )}

                {/* Headmaster Signature & Seal */}
                <div className="pt-6 flex justify-between items-end text-xs">
                  <div className="text-slate-500">
                    <p>অনুলিপি অবগতির জন্য প্রেরিত:</p>
                    <p>১. নোটিশ বোর্ড, বিদ্যালয় প্রাঙ্গণ</p>
                    <p>২. অফিশিয়াল ওয়েবসাইট ও ডিজিটাল আর্কাইভ</p>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="w-28 border-b border-slate-700 mx-auto">
                      <span className="font-serif italic text-emerald-800 text-sm font-bold">Bahar U.</span>
                    </div>
                    <p className="font-bold text-slate-800 font-bangla">{schoolInfo.headmasterNameBn}</p>
                    <p className="text-slate-600">{schoolInfo.headmasterDesignationBn}</p>
                    <p className="text-slate-500 text-[10px]">বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2 no-print">
                <button
                  onClick={() => setActiveNoticeModal(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition"
                >
                  {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                </button>
                <button
                  onClick={handlePrintNotice}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'প্রিন্ট / ডাউনলোড করুন' : 'Print / Download'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
