import React from 'react';
import { useSchool } from '../context/useSchool';
import { Quote, Award, CheckCircle, ArrowRight } from 'lucide-react';

export default function HeadmasterMessage() {
  const { lang, schoolInfo, setActiveTab } = useSchool();

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Headmaster Card (Photo + Badge) */}
          <div className="lg:col-span-5 flex flex-col items-center text-center">
            <div className="relative group">
              {/* Outer decorative ring */}
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-600 to-amber-500 rounded-3xl blur-sm opacity-50 group-hover:opacity-80 transition duration-500"></div>
              
              <div className="relative w-64 sm:w-72 h-80 sm:h-92 rounded-2xl overflow-hidden shadow-2xl bg-slate-100 border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=700&auto=format&fit=crop&q=80"
                  alt={schoolInfo.headmasterNameEn}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent"></div>
                
                {/* Overlay Name on Card */}
                <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {lang === 'bn' ? schoolInfo.headmasterDesignationBn : schoolInfo.headmasterDesignationEn}
                  </span>
                  <h3 className="text-lg font-bold font-bangla mt-1 text-white">
                    {lang === 'bn' ? schoolInfo.headmasterNameBn : schoolInfo.headmasterNameEn}
                  </h3>
                  <p className="text-xs text-emerald-200">
                    {lang === 'bn' ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়' : 'Bandua Daulatpur High School'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-3 py-1.5 rounded-full border border-emerald-200">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'bn' ? 'এম.এ (ইংরেজি), বি.এড • প্রধান শিক্ষক' : 'M.A (English), B.Ed • Headmaster'}</span>
            </div>
          </div>

          {/* Headmaster's Statement & School Vision */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider font-bangla">
                <Quote className="w-4 h-4 text-amber-500" />
                <span>{lang === 'bn' ? 'প্রধান শিক্ষকের বাণী' : "Headmaster's Message"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-bangla text-slate-900 leading-tight">
                {lang === 'bn' 
                  ? 'নৈতিক শিক্ষা ও আধুনিক প্রযুক্তির সমন্বয়ে ভবিষ্যৎ বিনির্মাণ'
                  : 'Building Future Through Moral Education & Modern Technology'}
              </h2>
            </div>

            <div className="relative pl-4 border-l-4 border-emerald-600 py-1">
              <p className="text-slate-700 font-bangla text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {lang === 'bn' ? schoolInfo.headmasterMessageBn : schoolInfo.headmasterMessageEn}
              </p>
            </div>

            {/* Core Commitments List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700 font-bangla">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{lang === 'bn' ? 'অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষক মণ্ডলী' : 'Experienced & dedicated teachers'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700 font-bangla">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{lang === 'bn' ? 'শেখ রাসেল ডিজিটাল কম্পিউটার ল্যাব' : 'Modern ICT Computer Lab'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700 font-bangla">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{lang === 'bn' ? 'সুসজ্জিত বিজ্ঞানাগার ও সমৃদ্ধ লাইব্রেরি' : 'Well-equipped Science Labs & Library'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700 font-bangla">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{lang === 'bn' ? 'শৃঙ্খলামূলক পরিবেশ ও নিরাপত্তা' : 'Disciplined & secure campus'}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActiveTab('about')}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg border border-emerald-200 transition font-bangla"
              >
                <span>{lang === 'bn' ? 'বিদ্যালয়ের পূর্ণাঙ্গ ইতিহাস জানুন' : 'Learn School History'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('faculty')}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 px-3 py-2 transition font-bangla"
              >
                <span>{lang === 'bn' ? 'শিক্ষকমণ্ডলীর তালিকা' : 'View Faculty List'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
