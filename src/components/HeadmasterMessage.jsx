import React from 'react';
import { useSchool } from '../context/useSchool';
import { Quote, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { createEducatorAvatar } from '../utils/avatarGenerator';

export default function HeadmasterMessage() {
  const { lang, schoolInfo, teachers, setActiveTab } = useSchool();
  const fallbackHeadmaster = teachers?.find(t => t.id === 'tea-01' || t.designationBn?.includes('প্রধান শিক্ষক')) || teachers?.[0];
  const photoUrl = schoolInfo.headmasterImage || fallbackHeadmaster?.image;
  const headmasterAvatar = createEducatorAvatar({
    initials: 'BDHS',
    role: 'headmaster',
    designation: 'Acting Headmaster',
    gender: 'male'
  });

  return (
    <section className="py-12 sm:py-16 text-[#1F2937] relative z-10 font-bangla">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-10 lg:p-12 border border-[#E5E7EB] shadow-xs relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Headmaster Card (Photo + Portrait Frame) */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative w-64 sm:w-72 h-80 sm:h-92 rounded-2xl overflow-hidden shadow-xs bg-[#F7F9F8] border-2 border-[#E5E7EB]">
                <img
                  src={photoUrl || headmasterAvatar}
                  onError={(e) => { e.currentTarget.src = headmasterAvatar; }}
                  alt={schoolInfo.headmasterNameEn}
                  className="w-full h-full object-cover object-top transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
                
                {/* Overlay Name on Card */}
                <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                  <span className="badge-warning text-[10px] px-2 py-0.5 rounded-full uppercase inline-block">
                    {lang === 'bn' ? schoolInfo.headmasterDesignationBn : schoolInfo.headmasterDesignationEn}
                  </span>
                  <h3 className="text-xl font-bold font-bangla mt-1.5 text-white drop-shadow-xs">
                    {lang === 'bn' ? schoolInfo.headmasterNameBn : schoolInfo.headmasterNameEn}
                  </h3>
                  <p className="text-xs text-white/80 font-bangla">
                    {lang === 'bn' ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়' : 'Bandua Daulatpur High School'}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#14532D] bg-[#DCFCE7] px-4 py-1.5 rounded-full border border-emerald-300 shadow-xs">
                <Award className="w-4 h-4 text-[#166534]" />
                <span>{lang === 'bn' ? `${schoolInfo.headmasterDesignationBn} • বি.এ (ইংরেজি)` : `${schoolInfo.headmasterDesignationEn} • B.A. (English)`}</span>
              </div>
            </div>

            {/* Headmaster's Statement & School Vision */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-[#14532D] font-bold text-xs uppercase tracking-wider font-bangla bg-[#DCFCE7] px-3 py-1 rounded-full border border-emerald-300">
                  <Quote className="w-3.5 h-3.5 text-[#166534]" />
                  <span>{lang === 'bn' ? `${schoolInfo.headmasterDesignationBn}-এর বাণী` : `${schoolInfo.headmasterDesignationEn}'s Message`}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-bangla text-[#1F2937] leading-tight">
                  {lang === 'bn' 
                    ? 'নৈতিক শিক্ষা ও আধুনিক প্রযুক্তির সমন্বয়ে ভবিষ্যৎ বিনির্মাণ'
                    : 'Building Future Through Moral Education & Modern Technology'}
                </h2>
                <p className="text-sm sm:text-base text-[#4B5563]">
                  {lang === 'bn' ? 'সুশিক্ষাই জাতির মেরুদণ্ড, আর জ্ঞানভিত্তিক আলোকিত প্রজন্মই আমাদের লক্ষ্য।' : 'Quality education is the backbone of the nation.'}
                </p>
              </div>

              <div className="relative pl-4 border-l-4 border-[#166534] py-1">
                <p className="text-[#1F2937] font-bangla text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {lang === 'bn' ? schoolInfo.headmasterMessageBn : schoolInfo.headmasterMessageEn}
                </p>
              </div>

              {/* Core Commitments List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#1F2937] font-bangla bg-[#F7F9F8] px-3.5 py-2.5 rounded-xl border border-[#E5E7EB]">
                  <CheckCircle className="w-4 h-4 text-[#166534] shrink-0" />
                  <span>{lang === 'bn' ? 'অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষক মণ্ডলী' : 'Experienced & dedicated teachers'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#1F2937] font-bangla bg-[#F7F9F8] px-3.5 py-2.5 rounded-xl border border-[#E5E7EB]">
                  <CheckCircle className="w-4 h-4 text-[#166534] shrink-0" />
                  <span>{lang === 'bn' ? 'শেখ রাসেল ডিজিটাল কম্পিউটার ল্যাব' : 'Modern ICT Computer Lab'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#1F2937] font-bangla bg-[#F7F9F8] px-3.5 py-2.5 rounded-xl border border-[#E5E7EB]">
                  <CheckCircle className="w-4 h-4 text-[#166534] shrink-0" />
                  <span>{lang === 'bn' ? 'সুসজ্জিত বিজ্ঞানাগার ও সমৃদ্ধ লাইব্রেরি' : 'Well-equipped Science Labs & Library'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#1F2937] font-bangla bg-[#F7F9F8] px-3.5 py-2.5 rounded-xl border border-[#E5E7EB]">
                  <CheckCircle className="w-4 h-4 text-[#166534] shrink-0" />
                  <span>{lang === 'bn' ? 'শৃঙ্খলামূলক পরিবেশ ও নিরাপত্তা' : 'Disciplined & secure campus'}</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setActiveTab('about')}
                  className="btn-primary inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-5 py-2.5 font-bangla cursor-pointer shadow-xs"
                >
                  <span>{lang === 'bn' ? 'বিদ্যালয়ের পূর্ণাঙ্গ ইতিহাস জানুন' : 'Learn School History'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('faculty')}
                  className="btn-secondary inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-2.5 font-bangla cursor-pointer shadow-xs"
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
