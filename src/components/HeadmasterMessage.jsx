import React from 'react';
import { useSchool } from '../context/useSchool';
import { Quote, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { createEducatorAvatar } from '../utils/avatarGenerator';

export default function HeadmasterMessage() {
  const { lang, schoolInfo, setActiveTab } = useSchool();
  const headmasterAvatar = createEducatorAvatar({
    initials: 'BU',
    role: 'headmaster',
    designation: 'Acting Headmaster',
    gender: 'male'
  });

  return (
    <section className="py-14 text-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="glass-card rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/15 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Backlight Glow inside card */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 blur-[100px] pointer-events-none rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Headmaster Card (Photo + Badge) */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative group">
                {/* Outer decorative ring */}
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-400/40 via-emerald-500/40 to-amber-400/40 rounded-3xl blur-md opacity-60 group-hover:opacity-100 transition duration-500"></div>
                
                <div className="relative w-64 sm:w-72 h-80 sm:h-92 rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border-2 border-white/20">
                  <img
                    src={schoolInfo.headmasterImage || headmasterAvatar}
                    onError={(e) => { e.currentTarget.src = headmasterAvatar; }}
                    alt={schoolInfo.headmasterNameEn}
                    className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  
                  {/* Overlay Name on Card */}
                  <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                    <span className="btn-gold text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase inline-block shadow-sm">
                      {lang === 'bn' ? schoolInfo.headmasterDesignationBn : schoolInfo.headmasterDesignationEn}
                    </span>
                    <h3 className="text-lg font-bold font-bangla mt-1.5 text-white drop-shadow-md">
                      {lang === 'bn' ? schoolInfo.headmasterNameBn : schoolInfo.headmasterNameEn}
                    </h3>
                    <p className="text-xs text-amber-200/90 font-bangla">
                      {lang === 'bn' ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়' : 'Bandua Daulatpur High School'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-amber-300 glass-pill px-4 py-1.5 rounded-full border border-amber-400/30 shadow-md">
                <Award className="w-4 h-4 text-amber-400" />
                <span>{lang === 'bn' ? `${schoolInfo.headmasterDesignationBn} • বি.এ (ইংরেজি)` : `${schoolInfo.headmasterDesignationEn} • B.A. (English)`}</span>
              </div>
            </div>

            {/* Headmaster's Statement & School Vision */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider font-bangla glass-pill px-3 py-1 rounded-full border border-amber-400/20">
                  <Quote className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'bn' ? `${schoolInfo.headmasterDesignationBn}-এর বাণী` : `${schoolInfo.headmasterDesignationEn}'s Message`}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-bangla text-white leading-tight drop-shadow-sm">
                  {lang === 'bn' 
                    ? 'নৈতিক শিক্ষা ও আধুনিক প্রযুক্তির সমন্বয়ে ভবিষ্যৎ বিনির্মাণ'
                    : 'Building Future Through Moral Education & Modern Technology'}
                </h2>
              </div>

              <div className="relative pl-4 border-l-4 border-amber-400 py-1">
                <p className="text-slate-200 font-bangla text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {lang === 'bn' ? schoolInfo.headmasterMessageBn : schoolInfo.headmasterMessageEn}
                </p>
              </div>

              {/* Core Commitments List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-200 font-bangla glass-pill px-3 py-2 rounded-xl border border-white/10">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{lang === 'bn' ? 'অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষক মণ্ডলী' : 'Experienced & dedicated teachers'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-200 font-bangla glass-pill px-3 py-2 rounded-xl border border-white/10">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{lang === 'bn' ? 'শেখ রাসেল ডিজিটাল কম্পিউটার ল্যাব' : 'Modern ICT Computer Lab'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-200 font-bangla glass-pill px-3 py-2 rounded-xl border border-white/10">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{lang === 'bn' ? 'সুসজ্জিত বিজ্ঞানাগার ও সমৃদ্ধ লাইব্রেরি' : 'Well-equipped Science Labs & Library'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-200 font-bangla glass-pill px-3 py-2 rounded-xl border border-white/10">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{lang === 'bn' ? 'শৃঙ্খলামূলক পরিবেশ ও নিরাপত্তা' : 'Disciplined & secure campus'}</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setActiveTab('about')}
                  className="btn-gold inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full font-bangla cursor-pointer"
                >
                  <span>{lang === 'bn' ? 'বিদ্যালয়ের পূর্ণাঙ্গ ইতিহাস জানুন' : 'Learn School History'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('faculty')}
                  className="glass-pill hover:bg-white/15 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-200 hover:text-white px-4 py-2.5 rounded-full transition font-bangla border border-white/15 cursor-pointer"
                >
                  <span>{lang === 'bn' ? 'শিক্ষকমণ্ডলীর তালিকা' : 'View Faculty List'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
