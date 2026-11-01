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
    <section className="py-12 bg-slate-50 min-h-[700px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'পাঠ্যক্রম ও শিক্ষাদান' : 'Curriculum & Academic Structure'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-bangla text-slate-900">
            {lang === 'bn' ? 'অ্যাকাডেমিক পাঠ্যক্রম ও গ্রুপ পরিচিতি' : 'Academic Disciplines & Disciplines Offered'}
          </h2>
          <p className="text-sm text-slate-600 font-bangla mt-1">
            {lang === 'bn'
              ? 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) অনুমোদিত আধুনিক শিক্ষাদান পদ্ধতি'
              : 'Affiliated with the Comilla Board following the national standard secondary curriculum.'}
          </p>
        </div>

        {/* Classes Overview 6 to 10 */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 mb-12">
          <h3 className="text-lg font-bold font-bangla text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>{lang === 'bn' ? 'শ্রেণিভিত্তিক শিক্ষা কাঠামো (৬ষ্ঠ - ১০ম)' : 'Class Structure (VI - X)'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {['৬ষ্ঠ শ্রেণি (Class VI)', '৭ম শ্রেণি (Class VII)', '৮ম শ্রেণি (Class VIII)', '৯ম শ্রেণি (Class IX)', '১০ম শ্রেণি (Class X)'].map((cls, idx) => (
              <div key={idx} className="bg-slate-50 hover:bg-emerald-50/50 p-4 rounded-xl border border-slate-200 transition text-center">
                <span className="w-8 h-8 rounded-full bg-emerald-800 text-white font-mono font-bold text-xs flex items-center justify-center mx-auto mb-2">
                  {idx + 6}
                </span>
                <h4 className="text-xs sm:text-sm font-bold font-bangla text-slate-800">{cls}</h4>
                <p className="text-[11px] text-slate-500 mt-1 font-bangla">
                  {idx >= 3 ? 'বিজ্ঞান / মানবিক / ব্যবসায় শিক্ষা' : 'সাধারণ সমন্বিত পাঠ্যক্রম'}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-bangla font-semibold">
              <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{lang === 'bn' ? 'বিদ্যালয় সময়সূচি: প্রতিদিন সকাল ৯:৩০ মি. হতে বিকাল ৪:০০ টা পর্যন্ত (শুক্রবার ও শনিবার ছুটি)' : 'School Hours: Daily 9:30 AM to 4:00 PM (Friday & Saturday Closed)'}</span>
            </div>
            <button
              onClick={() => setActiveTab('routines')}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg font-bangla transition shrink-0"
            >
              {lang === 'bn' ? 'ক্লাস রুটিন দেখুন' : 'View Class Routines'}
            </button>
          </div>
        </div>

        {/* Group Tab Switcher (Science, Commerce, Arts) */}
        <div className="mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
              {groups.map((grp) => {
                const IconComponent = grp.icon;
                const isActive = activeGroupTab === grp.id;
                return (
                  <button
                    key={grp.id}
                    onClick={() => setActiveGroupTab(grp.id)}
                    className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 font-bangla ${
                      isActive
                        ? 'bg-emerald-800 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                    <span>{lang === 'bn' ? grp.titleBn : grp.titleEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Group Details Card */}
          {groups.filter(g => g.id === activeGroupTab).map(grp => (
            <div key={grp.id} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 animate-in fade-in duration-300">
              <div className="max-w-3xl">
                <h3 className="text-xl sm:text-2xl font-bold font-bangla text-emerald-950 mb-2">
                  {lang === 'bn' ? grp.titleBn : grp.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-bangla leading-relaxed mb-6">
                  {grp.descriptionBn}
                </p>

                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  {lang === 'bn' ? 'অন্তর্ভুক্ত আবশ্যিক ও ঐচ্ছিক বিষয়সমূহ:' : 'Core & Elective Subjects:'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {grp.subjectsBn.map((subj, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs font-bangla text-slate-800">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
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
            <h3 className="text-xl sm:text-2xl font-bold font-bangla text-slate-900">
              {lang === 'bn' ? 'আমাদের অত্যাধুনিক সুবিধাসমূহ' : 'School Infrastructure & Campus Facilities'}
            </h3>
            <p className="text-xs text-slate-500 font-bangla mt-1">
              শিক্ষার্থীদের মানসম্মত শিক্ষার জন্য রয়েছে প্রয়োজনীয় আধুনিক পরিকাঠামো।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((fac, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-lg transition group">
                <div className="h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={fac.image}
                    alt={fac.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-4 space-y-1.5">
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
