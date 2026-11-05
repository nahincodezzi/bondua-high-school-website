import React, { useState } from 'react';
import { useSchool } from '../context/useSchool';
import { 
  BookOpen, 
  FlaskConical, 
  Briefcase, 
  Palette, 
  Monitor, 
  Library, 
  Trophy, 
  Clock, 
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function AcademicPrograms() {
  const { lang, setActiveTab } = useSchool();
  const [activeGroupTab, setActiveGroupTab] = useState('science');

  const groups = [
    {
      id: 'science',
      titleBn: 'বিজ্ঞান বিভাগ (Science)',
      titleEn: 'Science Discipline',
      icon: FlaskConical,
      color: 'emerald',
      subjectsBn: [
        'পদার্থবিজ্ঞান (Physics)',
        'রসায়ন (Chemistry)',
        'জীববিজ্ঞান (Biology)',
        'উচ্চতর গণিত (Higher Mathematics)',
        'বাংলা ও ইংরেজি (Bangla & English)',
        'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)',
        'বাংলাদেশ ও বিশ্বপরিচয় (BGS)',
        'ধর্ম ও নৈতিক শিক্ষা (Religion)'
      ],
      descriptionBn: 'বিজ্ঞান বিভাগের শিক্ষার্থীদের জন্য রয়েছে অত্যাধুনিক ল্যাবরেটরি সুবিধা ও নিয়মিত ব্যবহারিক ক্লাসের সুব্যবস্থা।'
    },
    {
      id: 'business',
      titleBn: 'ব্যবসায় শিক্ষা (Business Studies)',
      titleEn: 'Business Studies Discipline',
      icon: Briefcase,
      color: 'amber',
      subjectsBn: [
        'হিসাববিজ্ঞান (Accounting)',
        'ব্যবসায় উদ্যোগ (Entrepreneurship)',
        'ফিন্যান্স ও ব্যাংকিং (Finance & Banking)',
        'সাধারণ গণিত (General Mathematics)',
        'বাংলা ও ইংরেজি (Bangla & English)',
        'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)',
        'সাধারণ বিজ্ঞান (General Science)',
        'ধর্ম ও নৈতিক শিক্ষা (Religion)'
      ],
      descriptionBn: 'ভবিষ্যতের দক্ষ হিসাববিদ, ব্যাংকার ও সফল উদ্যোক্তা তৈরির লক্ষ্যে বাস্তবমুখী ব্যবসায় শিক্ষা পাঠদান।'
    },
    {
      id: 'humanities',
      titleBn: 'মানবিক বিভাগ (Humanities)',
      titleEn: 'Humanities Discipline',
      icon: Palette,
      color: 'blue',
      subjectsBn: [
        'ইতিহাস ও সামাজিক বিজ্ঞান (History)',
        'ভূগোল ও পরিবেশ (Geography)',
        'পৌরনীতি ও নাগরিকতা (Civics)',
        'অর্থনীতি / কৃষি শিক্ষা (Economics / Agriculture)',
        'বাংলা ও ইংরেজি (Bangla & English)',
        'তথ্য ও যোগাযোগ প্রযুক্তি (ICT)',
        'সাধারণ গণিত ও বিজ্ঞান (Math & Science)',
        'ধর্ম ও নৈতিক শিক্ষা (Religion)'
      ],
      descriptionBn: 'ইতিহাস, সংস্কৃতি, সামাজিক বিজ্ঞান ও মানবিক মূল্যবোধ বিকাশের মাধ্যমে দায়িত্বশীল নাগরিক গঠন।'
    }
  ];

  const facilities = [
    {
      titleBn: 'শেখ রাসেল ডিজিটাল ল্যাব',
      titleEn: 'Sheikh Russel ICT Lab',
      descBn: 'উচ্চগতির ইন্টারনেট সুবিধাসহ আধুনিক কম্পিউটার ল্যাব যেখানে শিক্ষার্থীরা কোডিং ও আইসিটি দক্ষতা অর্জন করে।',
      icon: Monitor,
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80'
    },
    {
      titleBn: 'আধুনিক বিজ্ঞান গবেষণাগার',
      titleEn: 'Equipped Science Lab',
      descBn: 'পদার্থ, রসায়ন ও জীববিজ্ঞানের সকল প্রয়োজনীয় রাসায়নিক উপাদান ও মাইক্রোস্কোপ সমৃদ্ধ ল্যাবরেটরি।',
      icon: FlaskConical,
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80'
    },
    {
      titleBn: 'সমৃদ্ধ বিদ্যালয় পাঠাগার',
      titleEn: 'School Central Library',
      descBn: 'হাজারো শিক্ষণীয় বই, পত্র-পত্রিকা, এনসাইক্লোপিডিয়া ও গল্প উপন্যাসে সমৃদ্ধ শান্ত পাঠাগার।',
      icon: Library,
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80'
    },
    {
      titleBn: 'সুবিশাল খেলার মাঠ ও ক্রীড়া',
      titleEn: 'Spacious Sports Ground',
      descBn: 'ফুটবল, ক্রিকেট, ভলিবল ও বার্ষিক অ্যাথলেটিকস চর্চার জন্য মনোরম সবুজ খেলার মাঠ।',
      icon: Trophy,
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <section className="py-12 sm:py-16 text-slate-800 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100/80 text-emerald-900 text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-xs border border-emerald-200">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>{lang === 'bn' ? 'পাঠ্যক্রম ও শিক্ষাদান' : 'Curriculum & Academic Structure'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-bangla text-slate-900 leading-tight">
            {lang === 'bn' ? 'অ্যাকাডেমিক পাঠ্যক্রম ও গ্রুপ পরিচিতি' : 'Academic Disciplines & Disciplines Offered'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-bangla mt-2">
            {lang === 'bn'
              ? 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) অনুমোদিত আধুনিক শিক্ষাদান পদ্ধতি'
              : 'Affiliated with the Comilla Board following the national standard secondary curriculum.'}
          </p>
        </div>

        {/* Classes Overview 6 to 10 */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/90 mb-10 shadow-md">
          <h3 className="text-lg font-bold font-bangla text-slate-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>{lang === 'bn' ? 'শ্রেণিভিত্তিক শিক্ষা কাঠামো (৬ষ্ঠ - ১০ম)' : 'Class Structure (VI - X)'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {['৬ষ্ঠ শ্রেণি (Class VI)', '৭ম শ্রেণি (Class VII)', '৮ম শ্রেণি (Class VIII)', '৯ম শ্রেণি (Class IX)', '১০ম শ্রেণি (Class X)'].map((cls, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 hover:bg-emerald-50/60 p-4 rounded-2xl border border-slate-200 text-center transition group hover:shadow-xs"
              >
                <span className="w-9 h-9 rounded-full bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  {lang === 'bn' ? ['৬', '৭', '৮', '৯', '১০'][idx] : (idx + 6)}
                </span>
                <h4 className="text-xs sm:text-sm font-bold font-bangla text-slate-900 group-hover:text-emerald-900 transition">{cls}</h4>
                <p className="text-[11px] text-slate-500 mt-1 font-bangla">
                  {idx >= 3 ? 'বিজ্ঞান / মানবিক / ব্যবসায় শিক্ষা' : 'সাধারণ সমন্বিত পাঠ্যক্রম'}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-950 font-bangla font-semibold">
              <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{lang === 'bn' ? 'বিদ্যালয় সময়সূচি: প্রতিদিন সকাল ৯:৩০ মি. হতে বিকাল ৪:০০ টা পর্যন্ত (শুক্রবার ও শনিবার ছুটি)' : 'School Hours: Daily 9:30 AM to 4:00 PM (Friday & Saturday Closed)'}</span>
            </div>
            <button
              onClick={() => setActiveTab('routines')}
              className="btn-gold font-bold px-4 py-2 rounded-full font-bangla shrink-0 cursor-pointer text-xs shadow-sm"
            >
              {lang === 'bn' ? 'ক্লাস রুটিন দেখুন' : 'View Class Routines'}
            </button>
          </div>
        </div>

        {/* Group Tab Switcher (Science, Commerce, Arts) */}
        <div className="mb-10">
          <div className="flex justify-center mb-6">
            <div className="glass-pill p-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-1 sm:gap-2">
              {groups.map((grp) => {
                const IconComponent = grp.icon;
                const isActive = activeGroupTab === grp.id;
                return (
                  <button
                    key={grp.id}
                    onClick={() => setActiveGroupTab(grp.id)}
                    className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition flex items-center gap-2 font-bangla cursor-pointer ${
                      isActive
                        ? 'btn-gold shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-emerald-700'}`} />
                    <span>{lang === 'bn' ? grp.titleBn : grp.titleEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Group Details Card */}
          {groups.filter(g => g.id === activeGroupTab).map(grp => (
            <div key={grp.id} className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E5E7EB] shadow-xs animate-in fade-in duration-300">
              <div className="w-full">
                <h3 className="text-xl sm:text-2xl font-extrabold font-bangla text-[#1F2937] mb-2 flex items-center gap-2.5">
                  <span className="text-[#F59E0B]">❖</span>
                  <span>{lang === 'bn' ? grp.titleBn : grp.titleEn}</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#4B5563] font-bangla leading-relaxed mb-6">
                  {grp.descriptionBn}
                </p>

                <h4 className="text-sm font-bold text-[#1F2937] mb-3 font-bangla">
                  {lang === 'bn' ? 'অন্তর্ভুক্ত আবশ্যিক ও ঐচ্ছিক বিষয়সমূহ:' : 'Core & Elective Subjects:'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {grp.subjectsBn.map((subj, i) => (
                    <div key={i} className="flex items-center gap-2.5 bg-[#F7F9F8] p-3 rounded-xl border border-[#E5E7EB] text-xs font-bangla text-[#1F2937]">
                      <CheckCircle className="w-4 h-4 text-[#166534] shrink-0" />
                      <span className="font-medium">{subj}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* School Facilities Grid */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl sm:text-3xl font-extrabold font-bangla text-slate-900">
              {lang === 'bn' ? 'আমাদের অত্যাধুনিক সুবিধাসমূহ' : 'School Infrastructure & Campus Facilities'}
            </h3>
            <p className="text-xs text-slate-500 font-bangla mt-1">
              শিক্ষার্থীদের মানসম্মত শিক্ষার জন্য রয়েছে প্রয়োজনীয় আধুনিক পরিকাঠামো।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((fac, idx) => (
              <div key={idx} className="glass-card glass-card-hover rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm transition group">
                <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={fac.image}
                    alt={fac.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <h4 className="text-sm font-bold font-bangla text-slate-900 group-hover:text-emerald-800 transition">
                    {fac.titleBn}
                  </h4>
                  <p className="text-xs text-slate-600 font-bangla leading-relaxed line-clamp-3">
                    {fac.descBn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
