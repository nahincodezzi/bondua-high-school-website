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
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full mb-3 font-bangla">
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
          <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/40 rounded-3xl p-6 sm:p-8 border-2 border-blue-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
            {/* Top Color Accent Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-indigo-900"></div>

            <div className="space-y-6">
              {/* Card Title & Icon */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 pb-4 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-bold shadow-md">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider font-mono">BOYS DRESS CODE</span>
                    <h3 className="text-xl sm:text-2xl font-bold font-bangla text-slate-900">
                      {lang === 'bn' ? 'ছাত্রদের স্কুল পোশাক' : "Boys' School Uniform"}
                    </h3>
                  </div>
                </div>

                {/* Color Swatch Badge */}
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-blue-200 shadow-xs">
                  <span className="w-4 h-4 rounded-full bg-white border-2 border-slate-400 shadow-xs" title="White Shirt"></span>
                  <span className="w-4 h-4 rounded-full bg-blue-900 border border-blue-950 shadow-xs" title="Blue Pant"></span>
                  <span className="text-[11px] font-bold text-slate-700 font-bangla ml-1">{lang === 'bn' ? 'সাদা ও নীল' : 'White & Blue'}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 font-bangla text-xs sm:text-sm">
                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ১
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">শার্ট (Shirt):</span>
                    <span className="text-blue-950 font-semibold text-xs sm:text-sm">{uniformInfo.boys.shirtBn}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">কলারযুক্ত পরিপাটি ধবধবে সাদা হাফ অথবা ফুল হাতা শার্ট।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ২
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">প্যান্ট (Pants):</span>
                    <span className="text-blue-950 font-semibold text-xs sm:text-sm">{uniformInfo.boys.pantBn}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">ফরমাল কাটিংয়ের নেভি ব্লু / গাঢ় নীল রঙের ফুল প্যান্ট।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ৩
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">জুতা ও মোজা (Footwear):</span>
                    <span className="text-slate-800 font-medium">{uniformInfo.boys.shoesBn}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ৪
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">ব্যাজ ও বেল্ট (Accessories):</span>
                    <span className="text-slate-800 font-medium">{uniformInfo.boys.badgeBn} এবং {uniformInfo.boys.beltBn}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-blue-100 flex items-center justify-between text-xs text-blue-900 font-semibold font-bangla">
              <span>{lang === 'bn' ? 'প্রতিদিন নির্ধারিত পোশাক পরা আবশ্যক' : 'Mandatory to wear prescribed uniform daily'}</span>
              <span className="bg-blue-100 px-2.5 py-0.5 rounded-full text-[11px]">{lang === 'bn' ? 'ছাত্রদের পোশাক কোড' : 'Boys Dress Code'}</span>
            </div>
          </div>

          {/* GIRLS UNIFORM CARD */}
          <div className="relative bg-gradient-to-br from-slate-50 via-white to-rose-50/40 rounded-3xl p-6 sm:p-8 border-2 border-rose-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
            {/* Top Color Accent Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-600 to-red-700"></div>

            <div className="space-y-6">
              {/* Card Title & Icon */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 pb-4 border-b border-rose-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider font-mono">GIRLS DRESS CODE</span>
                    <h3 className="text-xl sm:text-2xl font-bold font-bangla text-slate-900">
                      {lang === 'bn' ? 'ছাত্রীদের স্কুল পোশাক' : "Girls' School Uniform"}
                    </h3>
                  </div>
                </div>

                {/* Color Swatch Badge */}
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-rose-200 shadow-xs">
                  <span className="w-4 h-4 rounded-full bg-rose-600 border border-rose-700 shadow-xs" title="Red Dress"></span>
                  <span className="w-4 h-4 rounded-full bg-white border-2 border-slate-400 shadow-xs" title="White Salwar"></span>
                  <span className="text-[11px] font-bold text-slate-700 font-bangla ml-1">{lang === 'bn' ? 'লাল ও সাদা' : 'Red & White'}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 font-bangla text-xs sm:text-sm">
                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-rose-100 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ১
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">পোশাক / কামিজ (Dress):</span>
                    <span className="text-rose-900 font-bold text-xs sm:text-sm">{uniformInfo.girls.dressBn}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">নির্ধারিত শেডের মার্জিত ও পরিপাটি লাল ফ্রক অথবা কামিজ।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-rose-100 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ২
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">পায়জামা ও ওড়না (Salwar & Scarf):</span>
                    <span className="text-slate-800 font-semibold">{uniformInfo.girls.salwarBn} এবং {uniformInfo.girls.ornaBn}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">ধবধবে সাদা রঙের সালোয়ার এবং পরিচ্ছন্ন সাদা ওড়না/স্কার্ফ।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-rose-100 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ৩
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">চুলের ফিতা (Hair Ribbon):</span>
                    <span className="text-slate-800 font-medium">{uniformInfo.girls.hairBn}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-rose-100 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ৪
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">জুতা ও প্রাতিষ্ঠানিক ব্যাজ:</span>
                    <span className="text-slate-800 font-medium">{uniformInfo.girls.shoesBn} ও {uniformInfo.girls.badgeBn}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-rose-100 flex items-center justify-between text-xs text-rose-900 font-semibold font-bangla">
              <span>{lang === 'bn' ? 'শালীনতা ও পরিচ্ছন্নতা বজায় রাখা আবশ্যিক' : 'Modesty and cleanliness must be maintained'}</span>
              <span className="bg-rose-100 px-2.5 py-0.5 rounded-full text-[11px]">{lang === 'bn' ? 'ছাত্রীদের পোশাক কোড' : 'Girls Dress Code'}</span>
            </div>
          </div>
        </div>

        {/* Winter Uniform & Rules Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center font-bangla">
            <div className="md:col-span-8 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'bn' ? 'শীতকালীন ইউনিফর্ম ও শৃঙ্খলামূলক নীতিমালা' : 'Winter Uniform & Disciplinary Guidelines'}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {lang === 'bn' ? uniformInfo.winterBn : uniformInfo.winterEn}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {lang === 'bn' ? uniformInfo.guidelinesBn : uniformInfo.guidelinesEn}
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('admission')}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs transition shadow text-center"
              >
                {lang === 'bn' ? 'ভর্তি আবেদন নির্দেশিকা দেখুন' : 'View Admission Guidelines'}
              </button>
              <button
                onClick={() => setActiveTab('notices')}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl text-xs transition text-center border border-slate-700"
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
