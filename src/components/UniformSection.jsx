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
    <section className="py-14 text-white relative z-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 glass-pill text-amber-300 text-xs font-bold px-4 py-1.5 rounded-full mb-3 font-bangla border border-amber-400/20 shadow-md">
            <Shirt className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'bn' ? 'শৃঙ্খলা ও নির্ধারিত স্কুল পোশাক' : 'School Dress Code & Discipline'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-bangla text-white leading-tight drop-shadow-md">
            {lang === 'bn' ? 'ছাত্র ও ছাত্রীদের নির্ধারিত স্কুল ইউনিফর্ম' : 'Official Student Uniform Code'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-bangla mt-2 max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়ের সকল শিক্ষার্থীর জন্য সুশৃঙ্খল ও নির্ধারিত পোশাক পরিধান করা বাধ্যতামূলক।'
              : 'Prescribed uniform policy to ensure equality, dignity, and disciplined learning environment for all secondary students.'}
          </p>
        </div>

        {/* Two Main Uniform Cards: Boys & Girls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* BOYS UNIFORM CARD */}
          <div className="relative glass-card rounded-3xl p-6 sm:p-8 border border-blue-400/30 shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-hidden group">
            {/* Top Color Accent Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

            <div className="space-y-6">
              {/* Card Title & Icon */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/30 text-blue-300 border border-blue-400/30 flex items-center justify-center font-bold shadow-md">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider font-mono">BOYS DRESS CODE</span>
                    <h3 className="text-xl sm:text-2xl font-bold font-bangla text-white">
                      {lang === 'bn' ? 'ছাত্রদের স্কুল পোশাক' : "Boys' School Uniform"}
                    </h3>
                  </div>
                </div>

                {/* Color Swatch Badge */}
                <div className="flex items-center gap-1.5 glass-pill px-3 py-1.5 rounded-full border border-white/15 shadow-xs">
                  <span className="w-4 h-4 rounded-full bg-white border border-slate-300 shadow-xs" title="White Shirt"></span>
                  <span className="w-4 h-4 rounded-full bg-blue-600 border border-blue-400 shadow-xs" title="Blue Pant"></span>
                  <span className="text-[11px] font-bold text-slate-200 font-bangla ml-1">{lang === 'bn' ? 'সাদা ও নীল' : 'White & Blue'}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 font-bangla text-xs sm:text-sm">
                <div className="flex items-start gap-3 glass-pill p-3.5 rounded-2xl border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ১
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">শার্ট (Shirt):</span>
                    <span className="text-amber-300 font-semibold text-xs sm:text-sm">{uniformInfo.boys.shirtBn}</span>
                    <p className="text-[11px] text-slate-300 mt-0.5">কলারযুক্ত পরিপাটি ধবধবে সাদা হাফ অথবা ফুল হাতা শার্ট।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 glass-pill p-3.5 rounded-2xl border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ২
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">প্যান্ট (Pants):</span>
                    <span className="text-amber-300 font-semibold text-xs sm:text-sm">{uniformInfo.boys.pantBn}</span>
                    <p className="text-[11px] text-slate-300 mt-0.5">ফরমাল কাটিংয়ের নেভি ব্লু / গাঢ় নীল রঙের ফুল প্যান্ট।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 glass-pill p-3.5 rounded-2xl border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ৩
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">জুতা ও মোজা (Footwear):</span>
                    <span className="text-slate-200 font-medium">{uniformInfo.boys.shoesBn}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 glass-pill p-3.5 rounded-2xl border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ৪
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">ব্যাজ ও বেল্ট (Accessories):</span>
                    <span className="text-slate-200 font-medium">{uniformInfo.boys.badgeBn} এবং {uniformInfo.boys.beltBn}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-semibold font-bangla">
              <span>{lang === 'bn' ? 'প্রতিদিন নির্ধারিত পোশাক পরা আবশ্যক' : 'Mandatory to wear prescribed uniform daily'}</span>
              <span className="glass-pill px-3 py-1 rounded-full text-[11px] text-blue-300 border border-blue-400/30">{lang === 'bn' ? 'ছাত্রদের পোশাক কোড' : 'Boys Dress Code'}</span>
            </div>
          </div>

          {/* GIRLS UNIFORM CARD */}
          <div className="relative glass-card rounded-3xl p-6 sm:p-8 border border-rose-400/30 shadow-2xl backdrop-blur-xl flex flex-col justify-between overflow-hidden group">
            {/* Top Color Accent Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 to-red-500"></div>

            <div className="space-y-6">
              {/* Card Title & Icon */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600/30 text-rose-300 border border-rose-400/30 flex items-center justify-center font-bold shadow-md">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider font-mono">GIRLS DRESS CODE</span>
                    <h3 className="text-xl sm:text-2xl font-bold font-bangla text-white">
                      {lang === 'bn' ? 'ছাত্রীদের স্কুল পোশাক' : "Girls' School Uniform"}
                    </h3>
                  </div>
                </div>

                {/* Color Swatch Badge */}
                <div className="flex items-center gap-1.5 glass-pill px-3 py-1.5 rounded-full border border-white/15 shadow-xs">
                  <span className="w-4 h-4 rounded-full bg-rose-600 border border-rose-400 shadow-xs" title="Red Dress"></span>
                  <span className="w-4 h-4 rounded-full bg-white border border-slate-300 shadow-xs" title="White Salwar"></span>
                  <span className="text-[11px] font-bold text-slate-200 font-bangla ml-1">{lang === 'bn' ? 'লাল ও সাদা' : 'Red & White'}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 font-bangla text-xs sm:text-sm">
                <div className="flex items-start gap-3 glass-pill p-3.5 rounded-2xl border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ১
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">পোশাক / কামিজ (Dress):</span>
                    <span className="text-amber-300 font-bold text-xs sm:text-sm">{uniformInfo.girls.dressBn}</span>
                    <p className="text-[11px] text-slate-300 mt-0.5">নির্ধারিত শেডের মার্জিত ও পরিপাটি লাল ফ্রক অথবা কামিজ।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 glass-pill p-3.5 rounded-2xl border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ২
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">পায়জামা ও ওড়না (Salwar & Scarf):</span>
                    <span className="text-slate-200 font-semibold">{uniformInfo.girls.salwarBn} এবং {uniformInfo.girls.ornaBn}</span>
                    <p className="text-[11px] text-slate-300 mt-0.5">ধবধবে সাদা রঙের সালোয়ার এবং পরিচ্ছন্ন সাদা ওড়না/স্কার্ফ।</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 glass-pill p-3.5 rounded-2xl border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ৩
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">চুলের ফিতা (Hair Ribbon):</span>
                    <span className="text-slate-200 font-medium">{uniformInfo.girls.hairBn}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 glass-pill p-3.5 rounded-2xl border border-white/10">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-400/30 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ৪
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">জুতা ও প্রাতিষ্ঠানিক ব্যাজ:</span>
                    <span className="text-slate-200 font-medium">{uniformInfo.girls.shoesBn} ও {uniformInfo.girls.badgeBn}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-semibold font-bangla">
              <span>{lang === 'bn' ? 'শালীনতা ও পরিচ্ছন্নতা বজায় রাখা আবশ্যিক' : 'Modesty and cleanliness must be maintained'}</span>
              <span className="glass-pill px-3 py-1 rounded-full text-[11px] text-rose-300 border border-rose-400/30">{lang === 'bn' ? 'ছাত্রীদের পোশাক কোড' : 'Girls Dress Code'}</span>
            </div>
          </div>
        </div>

        {/* Winter Uniform & Rules Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/15 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center font-bangla">
            <div className="md:col-span-8 space-y-2">
              <div className="inline-flex items-center gap-2 text-amber-300 font-bold text-xs glass-pill px-3 py-1 rounded-full border border-amber-400/20">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{lang === 'bn' ? 'শীতকালীন ইউনিফর্ম ও শৃঙ্খলামূলক নীতিমালা' : 'Winter Uniform & Disciplinary Guidelines'}</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-white">
                {lang === 'bn' ? uniformInfo.winterBn : uniformInfo.winterEn}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {lang === 'bn' ? uniformInfo.guidelinesBn : uniformInfo.guidelinesEn}
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col gap-3">
              <button
                onClick={() => setActiveTab('admission')}
                className="btn-gold font-bold py-3 px-5 rounded-full text-xs transition text-center cursor-pointer"
              >
                {lang === 'bn' ? 'ভর্তি আবেদন নির্দেশিকা দেখুন' : 'View Admission Guidelines'}
              </button>
              <button
                onClick={() => setActiveTab('notices')}
                className="glass-pill hover:bg-white/15 text-white font-semibold py-3 px-5 rounded-full text-xs transition text-center border border-white/15 cursor-pointer"
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
