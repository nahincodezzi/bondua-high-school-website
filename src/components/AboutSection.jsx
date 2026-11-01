import React from 'react';
import { useSchool } from '../context/useSchool';
import { 
  Target, 
  Eye, 
  History, 
  CheckCircle2, 
  Compass
} from 'lucide-react';

export default function AboutSection() {
  const { lang, schoolInfo, setActiveTab } = useSchool();

  return (
    <section className="py-12 bg-white min-h-[700px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <History className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'আমাদের ইতিহাস ও ঐতিহ্য' : 'Heritage & History'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-bangla text-slate-900">
            {lang === 'bn' ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় পরিচিতি' : 'About Bandua Daulatpur High School'}
          </h2>
          <p className="text-sm text-slate-600 font-bangla mt-1">
            {lang === 'bn' 
              ? '১৯৯০ সাল থেকে ফেনী জেলার ফুলগাজীতে গুণগত শিক্ষার আলোকবর্তিকা'
              : 'Serving with dedication in Anandapur, Fulgazi, Feni since January 1, 1990.'}
          </p>
        </div>

        {/* Story & Background */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-7 space-y-4 text-slate-700 font-bangla leading-relaxed text-sm sm:text-base">
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-950">
              {lang === 'bn' 
                ? 'একটি আদর্শ শিক্ষাপ্রতিষ্ঠানের সৃষ্টি ও অভিযাত্রা'
                : 'Origins and Noble Journey'}
            </h3>

            <p>
              {lang === 'bn' 
                ? 'ফেনী জেলার ফুলগাজী উপজেলার ঐতিহ্যবাহী আনন্দপুর ইউনিয়নের বন্দুয়া দৌলতপুর গ্রামে ১৯৯০ সালের ১ জানুয়ারি বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় প্রতিষ্ঠিত হয়। এলাকার শিক্ষানুরাগী, সমাজসেবক ও গুণীজনদের নিরলস প্রচেষ্টায় অবহেলিত গ্রামীণ জনপদে শিক্ষার আলো প্রজ্বলন করাই ছিল এই প্রতিষ্ঠানের মূল লক্ষ্য।'
                : 'Bandua Daulatpur High School was established on January 1, 1990, in the scenic village of Bandua Daulatpur under Anandapur Union, Fulgazi Upazila, Feni District.'}
            </p>

            <p>
              {lang === 'bn'
                ? 'কুমিল্লা শিক্ষাবোর্ডের আওতাধীন এবং শিক্ষা মন্ত্রণালয় কর্তৃক ১৯৯৪ সালে পূর্ণাঙ্গ স্বীকৃতি লাভ করে প্রতিষ্ঠানটি (EIIN: ১০৬৬৪৪, MPO: ৯০৫১৭১৩০১)। প্রতিষ্ঠার পর থেকে অদ্যাবধি এসএসসি পরীক্ষায় শতভাগ সাফল্য ও উপজেলার শীর্ষস্থানীয় ফলাফলের সুনাম অক্ষুণ্ন রেখেছে বিদ্যালয়টি।'
                : 'Formally recognized under the Comilla Education Board in 1994 (EIIN: 106644, MPO Code: 905171301), the school consistently secures outstanding success in secondary school certificate examinations.'}
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-emerald-900">
              <div className="flex items-center gap-2 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{lang === 'bn' ? 'প্রতিষ্ঠাকাল: ১ জানুয়ারি, ১৯৯০' : 'Founded: January 1, 1990'}</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{lang === 'bn' ? 'EIIN কোড: ১০৬৬৪৪' : 'EIIN Code: 106644'}</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{lang === 'bn' ? 'এমপিও কোড: ৯০৫১৭১৩০১' : 'MPO Code: 905171301'}</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{lang === 'bn' ? 'শিক্ষা বোর্ড: কুমিল্লা শিক্ষাবোর্ড' : 'Education Board: Comilla Board'}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80"
                alt="School Campus"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-amber-400 font-bold text-xs uppercase">Campus View</span>
                  <h4 className="text-lg font-bold font-bangla">
                    {lang === 'bn' ? 'মনোরম সবুজ ক্যাম্পাস ও সুবিশাল খেলার মাঠ' : 'Lush Green Campus & Spacious Playground'}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-emerald-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-bangla text-amber-300">
              {lang === 'bn' ? 'আমাদের লক্ষ্য (Mission)' : 'Our Mission'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 font-bangla leading-relaxed">
              {lang === 'bn'
                ? 'মানসম্মত শিক্ষা, নৈতিক মূল্যবোধ ও ডিজিটাল প্রযুক্তির সমন্বয়ে প্রতিটি শিক্ষার্থীকে আধুনিক বিজ্ঞানমনস্ক, দেশপ্রেমিক ও দক্ষ মানবসম্পদ হিসেবে গড়ে তোলা।'
                : 'To deliver quality secondary education emphasizing moral character, scientific literacy, and 21st-century technological proficiency.'}
            </p>
          </div>

          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-bangla text-emerald-400">
              {lang === 'bn' ? 'আমাদের রূপকল্প (Vision)' : 'Our Vision'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-bangla leading-relaxed">
              {lang === 'bn'
                ? 'একটি বৈষম্যহীন, প্রযুক্তি-নির্ভর ও আদর্শ শিক্ষাঙ্গন হিসেবে ফুলগাজী তথা বৃহত্তর নোয়াখালী-কুমিল্লা অঞ্চলের শ্রেষ্ঠ মডেল বিদ্যালয়ে রূপান্তরিত হওয়া।'
                : 'To emerge as a beacon of academic brilliance and ethical leadership in the greater Feni and Chittagong division.'}
            </p>
          </div>

          <div className="bg-amber-500 text-slate-950 p-6 sm:p-8 rounded-2xl shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-bangla text-slate-950">
              {lang === 'bn' ? 'মূল আদর্শ (Core Values)' : 'Core Values'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-900 font-bangla leading-relaxed font-medium">
              {lang === 'bn'
                ? 'শৃঙ্খলা, সততা, সহমর্মিতা, বিজ্ঞানচেতনা এবং মাতৃভূমির সার্বিক উন্নয়নে অবদান রাখার চিরন্তন ব্রত।'
                : 'Discipline, integrity, empathy, inquiry-based learning, and selfless service to the nation.'}
            </p>
          </div>
        </div>

        {/* Chairman & Committee Info */}
        <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                {lang === 'bn' ? schoolInfo.chairmanDesignationBn : schoolInfo.chairmanDesignationEn}
              </span>
              <h3 className="text-xl font-bold font-bangla text-slate-900">
                {lang === 'bn' ? schoolInfo.chairmanNameBn : schoolInfo.chairmanNameEn}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-bangla mt-2 leading-relaxed">
                {lang === 'bn' ? schoolInfo.chairmanMessageBn : schoolInfo.chairmanMessageEn}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setActiveTab('faculty')}
                className="flex-1 bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs font-bangla transition text-center shadow"
              >
                শিক্ষক ও কর্মচারীদের তালিকা দেখুন
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className="flex-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold py-3 px-4 rounded-xl text-xs font-bangla transition text-center"
              >
                যোগাযোগের তথ্য ও ঠিকানা
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
