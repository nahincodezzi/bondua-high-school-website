import React from 'react';
import { useSchool } from '../context/useSchool';
import { 
  Sparkles, 
  Shirt, 
  Users 
} from 'lucide-react';

export default function UniformSection() {
  const { lang, uniformInfo, setActiveTab } = useSchool();

  return (
    <section className="py-12 sm:py-16 text-slate-800 relative z-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-900 text-xs font-bold px-4 py-1.5 rounded-full mb-3 font-bangla border border-emerald-200 shadow-xs">
            <Shirt className="w-3.5 h-3.5 text-emerald-700" />
            <span>{lang === 'bn' ? 'শৃঙ্খলা ও নির্ধারিত স্কুল পোশাক' : 'School Dress Code & Discipline'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-bangla text-slate-900 leading-tight">
            {lang === 'bn' ? 'ছাত্র ও ছাত্রীদের নির্ধারিত স্কুল ইউনিফর্ম' : 'Official Student Uniform Code'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-bangla mt-2 max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়ের সকল শিক্ষার্থীর জন্য সুশৃঙ্খল ও নির্ধারিত পোশাক পরিধান করা বাধ্যতামূলক।'
              : 'Prescribed uniform policy to ensure equality, dignity, and disciplined learning environment for all secondary students.'}
          </p>
        </div>

        {/* Two Main Uniform Cards: Boys & Girls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* BOYS UNIFORM CARD */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] shadow-xs hover:border-[#166534] transition-all duration-200 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Card Title & Icon */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#DCFCE7] text-[#166534] flex items-center justify-center font-bold shadow-xs">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider font-mono">BOYS DRESS CODE</span>
                    <h3 className="text-xl sm:text-2xl font-bold font-bangla text-[#1F2937]">
                      {lang === 'bn' ? 'ছাত্রদের স্কুল পোশাক' : "Boys' School Uniform"}
                    </h3>
                  </div>
                </div>

                {/* Color Swatch Badge: Neutral */}
                <div className="flex items-center gap-1.5 bg-[#F3F4F6] px-3 py-1.5 rounded-full border border-[#D1D5DB] shadow-xs">
                  <span className="w-3.5 h-3.5 rounded-full bg-white border border-[#D1D5DB]" title="White Shirt"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-800 border border-slate-900" title="Blue Pant"></span>
                  <span className="text-xs font-bold text-[#374151] font-bangla ml-1">{lang === 'bn' ? 'সাদা ও নীল' : 'White & Blue'}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 font-bangla text-xs sm:text-sm">
                <div className="flex items-start gap-3 bg-[#F7F9F8] p-3.5 rounded-xl border border-[#E5E7EB]">
                  <div className="w-6 h-6 rounded-md bg-[#F3F4F6] text-[#166534] border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    {lang === 'bn' ? '১' : '1'}
                  </div>
                  <div>
                    <span className="font-bold text-[#1F2937] block text-sm">{lang === 'bn' ? 'শার্ট (Shirt):' : 'Shirt:'}</span>
                    <span className="text-[#1F2937] font-semibold text-xs sm:text-sm">{lang === 'bn' ? uniformInfo.boys.shirtBn : (uniformInfo.boys.shirtEn || uniformInfo.boys.shirtBn)}</span>
                    <p className="text-xs text-[#4B5563] mt-0.5">{lang === 'bn' ? 'কলারযুক্ত পরিপাটি ধবধবে সাদা হাফ অথবা ফুল হাতা শার্ট।' : 'Neat, crisp white half or full-sleeve collared shirt.'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#F7F9F8] p-3.5 rounded-xl border border-[#E5E7EB]">
                  <div className="w-6 h-6 rounded-md bg-[#F3F4F6] text-[#166534] border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    {lang === 'bn' ? '২' : '2'}
                  </div>
                  <div>
                    <span className="font-bold text-[#1F2937] block text-sm">{lang === 'bn' ? 'প্যান্ট (Pants):' : 'Pants:'}</span>
                    <span className="text-[#1F2937] font-semibold text-xs sm:text-sm">{lang === 'bn' ? uniformInfo.boys.pantBn : (uniformInfo.boys.pantEn || uniformInfo.boys.pantBn)}</span>
                    <p className="text-xs text-[#4B5563] mt-0.5">{lang === 'bn' ? 'ফরমাল কাটিংয়ের নেভি ব্লু / গাঢ় নীল রঙের ফুল প্যান্ট।' : 'Formal tailored navy blue full trousers.'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#F7F9F8] p-3.5 rounded-xl border border-[#E5E7EB]">
                  <div className="w-6 h-6 rounded-md bg-[#F3F4F6] text-[#166534] border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    {lang === 'bn' ? '৩' : '3'}
                  </div>
                  <div>
                    <span className="font-bold text-[#1F2937] block text-sm">{lang === 'bn' ? 'জুতা ও মোজা (Footwear):' : 'Footwear & Socks:'}</span>
                    <span className="text-[#1F2937] font-medium">{lang === 'bn' ? uniformInfo.boys.shoesBn : (uniformInfo.boys.shoesEn || uniformInfo.boys.shoesBn)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#F7F9F8] p-3.5 rounded-xl border border-[#E5E7EB]">
                  <div className="w-6 h-6 rounded-md bg-[#F3F4F6] text-[#166534] border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    {lang === 'bn' ? '৪' : '4'}
                  </div>
                  <div>
                    <span className="font-bold text-[#1F2937] block text-sm">{lang === 'bn' ? 'ব্যাজ ও বেল্ট (Accessories):' : 'Badge & Belt:'}</span>
                    <span className="text-[#1F2937] font-medium">
                      {lang === 'bn' 
                        ? `${uniformInfo.boys.badgeBn} এবং ${uniformInfo.boys.beltBn}` 
                        : `${uniformInfo.boys.badgeEn || uniformInfo.boys.badgeBn} and ${uniformInfo.boys.beltEn || uniformInfo.boys.beltBn}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#4B5563] font-semibold font-bangla">
              <span>{lang === 'bn' ? 'প্রতিদিন নির্ধারিত পোশাক পরা আবশ্যক' : 'Mandatory to wear prescribed uniform daily'}</span>
              <span className="badge-neutral text-[11px]">{lang === 'bn' ? 'ছাত্রদের পোশাক কোড' : 'Boys Dress Code'}</span>
            </div>
          </div>

          {/* GIRLS UNIFORM CARD */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E7EB] shadow-xs hover:border-[#166534] transition-all duration-200 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Card Title & Icon */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#DCFCE7] text-[#166534] flex items-center justify-center font-bold shadow-xs">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider font-mono">GIRLS DRESS CODE</span>
                    <h3 className="text-xl sm:text-2xl font-bold font-bangla text-[#1F2937]">
                      {lang === 'bn' ? 'ছাত্রীদের স্কুল পোশাক' : "Girls' School Uniform"}
                    </h3>
                  </div>
                </div>

                {/* Color Swatch Badge: Neutral */}
                <div className="flex items-center gap-1.5 bg-[#F3F4F6] px-3 py-1.5 rounded-full border border-[#D1D5DB] shadow-xs">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-700 border border-red-800" title="Red Dress"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-white border border-[#D1D5DB]" title="White Salwar"></span>
                  <span className="text-xs font-bold text-[#374151] font-bangla ml-1">{lang === 'bn' ? 'লাল ও সাদা' : 'Red & White'}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 font-bangla text-xs sm:text-sm">
                <div className="flex items-start gap-3 bg-[#F7F9F8] p-3.5 rounded-xl border border-[#E5E7EB]">
                  <div className="w-6 h-6 rounded-md bg-[#F3F4F6] text-[#166534] border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    {lang === 'bn' ? '১' : '1'}
                  </div>
                  <div>
                    <span className="font-bold text-[#1F2937] block text-sm">{lang === 'bn' ? 'পোশাক / কামিজ (Dress):' : 'Dress / Kamiz:'}</span>
                    <span className="text-[#1F2937] font-semibold text-xs sm:text-sm">{lang === 'bn' ? uniformInfo.girls.dressBn : (uniformInfo.girls.dressEn || uniformInfo.girls.dressBn)}</span>
                    <p className="text-xs text-[#4B5563] mt-0.5">{lang === 'bn' ? 'নির্ধারিত শেডের মার্জিত ও পরিপাটি লাল ফ্রক অথবা কামিজ।' : 'Prescribed shade modest and neat red frock or kamiz.'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#F7F9F8] p-3.5 rounded-xl border border-[#E5E7EB]">
                  <div className="w-6 h-6 rounded-md bg-[#F3F4F6] text-[#166534] border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    {lang === 'bn' ? '২' : '2'}
                  </div>
                  <div>
                    <span className="font-bold text-[#1F2937] block text-sm">{lang === 'bn' ? 'পায়জামা ও ওড়না (Salwar & Scarf):' : 'Salwar & Scarf:'}</span>
                    <span className="text-[#1F2937] font-medium">
                      {lang === 'bn' 
                        ? `${uniformInfo.girls.salwarBn} এবং ${uniformInfo.girls.ornaBn}` 
                        : `${uniformInfo.girls.salwarEn || uniformInfo.girls.salwarBn} and ${uniformInfo.girls.ornaEn || uniformInfo.girls.ornaBn}`}
                    </span>
                    <p className="text-xs text-[#4B5563] mt-0.5">{lang === 'bn' ? 'ধবধবে সাদা রঙের সালোয়ার এবং পরিচ্ছন্ন সাদা ওড়না/স্কার্ফ।' : 'Clean white salwar/pajama and white scarf.'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#F7F9F8] p-3.5 rounded-xl border border-[#E5E7EB]">
                  <div className="w-6 h-6 rounded-md bg-[#F3F4F6] text-[#166534] border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    {lang === 'bn' ? '৩' : '3'}
                  </div>
                  <div>
                    <span className="font-bold text-[#1F2937] block text-sm">{lang === 'bn' ? 'চুলের ফিতা (Hair Ribbon):' : 'Hair Ribbon:'}</span>
                    <span className="text-[#1F2937] font-medium">{lang === 'bn' ? uniformInfo.girls.hairBn : (uniformInfo.girls.hairEn || uniformInfo.girls.hairBn)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#F7F9F8] p-3.5 rounded-xl border border-[#E5E7EB]">
                  <div className="w-6 h-6 rounded-md bg-[#F3F4F6] text-[#166534] border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    {lang === 'bn' ? '৪' : '4'}
                  </div>
                  <div>
                    <span className="font-bold text-[#1F2937] block text-sm">{lang === 'bn' ? 'জুতা ও প্রাতিষ্ঠানিক ব্যাজ:' : 'Shoes & Institutional Badge:'}</span>
                    <span className="text-[#1F2937] font-medium">
                      {lang === 'bn' 
                        ? `${uniformInfo.girls.shoesBn} ও ${uniformInfo.girls.badgeBn}` 
                        : `${uniformInfo.girls.shoesEn || uniformInfo.girls.shoesBn} & ${uniformInfo.girls.badgeEn || uniformInfo.girls.badgeBn}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#4B5563] font-semibold font-bangla">
              <span>{lang === 'bn' ? 'শালীনতা ও পরিচ্ছন্নতা বজায় রাখা আবশ্যিক' : 'Modesty and cleanliness must be maintained'}</span>
              <span className="badge-neutral text-[11px]">{lang === 'bn' ? 'ছাত্রীদের পোশাক কোড' : 'Girls Dress Code'}</span>
            </div>
          </div>
        </div>

        {/* Winter Uniform & Rules Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-[#E5E7EB]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center font-bangla">
            <div className="md:col-span-8 space-y-2">
              <div className="inline-flex items-center gap-2 text-[#14532D] font-bold text-xs bg-[#DCFCE7] px-3 py-1 rounded-full border border-emerald-300">
                <Sparkles className="w-4 h-4 text-[#166534]" />
                <span>{lang === 'bn' ? 'শীতকালীন ইউনিফর্ম ও শৃঙ্খলামূলক নীতিমালা' : 'Winter Uniform & Disciplinary Guidelines'}</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-[#1F2937]">
                {lang === 'bn' ? uniformInfo.winterBn : uniformInfo.winterEn}
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed whitespace-pre-line">
                {lang === 'bn' ? uniformInfo.guidelinesBn : uniformInfo.guidelinesEn}
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col gap-3">
              <button
                onClick={() => setActiveTab('admission')}
                className="btn-accent font-bold py-3 px-5 text-xs text-center cursor-pointer shadow-xs"
              >
                {lang === 'bn' ? 'ভর্তি আবেদন নির্দেশিকা দেখুন' : 'View Admission Guidelines'}
              </button>
              <button
                onClick={() => setActiveTab('notices')}
                className="btn-secondary font-semibold py-3 px-5 text-xs text-center cursor-pointer shadow-xs"
              >
                {lang === 'bn' ? 'পোশাক সংক্রান্ত নোটিশ দেখুন' : 'View Dress Code Circulars'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
