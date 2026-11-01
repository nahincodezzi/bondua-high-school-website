import React, { useState } from 'react';
import { useSchool } from '../../context/useSchool';
import { 
  Save, 
  CheckCircle, 
  Shirt, 
  Sliders, 
  MapPin
} from 'lucide-react';

export default function CmsContentManager() {
  const { 
    uniformInfo, 
    setUniformInfo, 
    heroSlides, 
    setHeroSlides, 
    schoolInfo, 
    setSchoolInfo 
  } = useSchool();

  const [activeTab, setActiveTab] = useState('uniform'); // 'uniform', 'slides', 'general'
  const [uniformForm, setUniformForm] = useState(JSON.parse(JSON.stringify(uniformInfo)));
  const [slidesForm, setSlidesForm] = useState(JSON.parse(JSON.stringify(heroSlides)));
  const [infoForm, setInfoForm] = useState(JSON.parse(JSON.stringify(schoolInfo)));
  const [savedMessage, setSavedMessage] = useState(false);

  const handleUniformSave = (e) => {
    e.preventDefault();
    setUniformInfo(uniformForm);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleSlidesSave = (e) => {
    e.preventDefault();
    setHeroSlides(slidesForm);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleInfoSave = (e) => {
    e.preventDefault();
    setSchoolInfo(infoForm);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleSlideChange = (index, field, value) => {
    const updated = [...slidesForm];
    updated[index] = { ...updated[index], [field]: value };
    setSlidesForm(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 font-mono">
          <Sliders className="w-4 h-4 text-emerald-700" />
          <span>CONTENT MANAGEMENT SYSTEM (CMS)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-bangla text-slate-900">
          ওয়েবসাইট কনটেন্ট ম্যানেজমেন্ট (CMS Editor)
        </h2>
        <p className="text-xs text-slate-500 font-bangla">
          স্কুল ড্রেস কোড, ব্যানার স্লাইডার, অবস্থান ও যোগাযোগ তথ্য সরাসরি সম্পাদনা করুন
        </p>
      </div>

      {/* CMS Sub-tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 font-bangla text-xs">
        <button
          onClick={() => setActiveTab('uniform')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
            activeTab === 'uniform'
              ? 'bg-emerald-800 text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Shirt className="w-4 h-4" />
          <span>ইউনিফর্ম ও পোশাক কোড (Dress Code CMS)</span>
        </button>

        <button
          onClick={() => setActiveTab('slides')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
            activeTab === 'slides'
              ? 'bg-emerald-800 text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>হোমপেজ ব্যানার স্লাইডার (Hero Slider CMS)</span>
        </button>

        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
            activeTab === 'general'
              ? 'bg-emerald-800 text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>রোড ও প্রতিষ্ঠান পরিচিতি (Location & Identity)</span>
        </button>
      </div>

      {savedMessage && (
        <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200 font-bangla">
          <CheckCircle className="w-4 h-4 text-emerald-700" />
          <span>পরিবর্তনসমূহ সফলভাবে সংরক্ষিত হয়েছে এবং ওয়েবসাইটে তৎক্ষণাৎ হালনাগাদ করা হয়েছে!</span>
        </div>
      )}

      {/* 1. DRESS CODE & UNIFORM CMS */}
      {activeTab === 'uniform' && (
        <form onSubmit={handleUniformSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6 font-bangla text-xs">
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                পোশাক ও ইউনিফর্ম নীতিমালা কনটেন্ট
              </h3>
              <p className="text-[11px] text-slate-500">
                ছাত্রদের সাদা শার্ট ও নীল প্যান্ট এবং ছাত্রীদের লাল ড্রেস সংক্রান্ত তথ্য
              </p>
            </div>
            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Live Synchronized
            </span>
          </div>

          {/* Boys Uniform Config */}
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-3">
            <span className="font-bold text-blue-900 text-sm block">
              👔 ছাত্রদের পোশাক (Boys Uniform)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">শার্টের বিবরণ</label>
                <input
                  type="text"
                  value={uniformForm.boys.shirtBn}
                  onChange={(e) => setUniformForm({
                    ...uniformForm,
                    boys: { ...uniformForm.boys, shirtBn: e.target.value }
                  })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">প্যান্টের বিবরণ</label>
                <input
                  type="text"
                  value={uniformForm.boys.pantBn}
                  onChange={(e) => setUniformForm({
                    ...uniformForm,
                    boys: { ...uniformForm.boys, pantBn: e.target.value }
                  })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">জুতা ও মোজা</label>
                <input
                  type="text"
                  value={uniformForm.boys.shoesBn}
                  onChange={(e) => setUniformForm({
                    ...uniformForm,
                    boys: { ...uniformForm.boys, shoesBn: e.target.value }
                  })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ব্যাজ ও বেল্ট</label>
                <input
                  type="text"
                  value={uniformForm.boys.badgeBn}
                  onChange={(e) => setUniformForm({
                    ...uniformForm,
                    boys: { ...uniformForm.boys, badgeBn: e.target.value }
                  })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Girls Uniform Config */}
          <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200 space-y-3">
            <span className="font-bold text-rose-900 text-sm block">
              👗 ছাত্রীদের পোশাক (Girls Uniform)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">পোশাক / কামিজের বিবরণ</label>
                <input
                  type="text"
                  value={uniformForm.girls.dressBn}
                  onChange={(e) => setUniformForm({
                    ...uniformForm,
                    girls: { ...uniformForm.girls, dressBn: e.target.value }
                  })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">পায়জামা ও সালোয়ার</label>
                <input
                  type="text"
                  value={uniformForm.girls.salwarBn}
                  onChange={(e) => setUniformForm({
                    ...uniformForm,
                    girls: { ...uniformForm.girls, salwarBn: e.target.value }
                  })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ওড়না / স্কার্ফ</label>
                <input
                  type="text"
                  value={uniformForm.girls.ornaBn}
                  onChange={(e) => setUniformForm({
                    ...uniformForm,
                    girls: { ...uniformForm.girls, ornaBn: e.target.value }
                  })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">চুলের ফিতা ও জুতা</label>
                <input
                  type="text"
                  value={uniformForm.girls.hairBn}
                  onChange={(e) => setUniformForm({
                    ...uniformForm,
                    girls: { ...uniformForm.girls, hairBn: e.target.value }
                  })}
                  className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Winter & Guidelines */}
          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">শীতকালীন ইউনিফর্ম সংক্রান্ত ঘোষণা</label>
              <input
                type="text"
                value={uniformForm.winterBn}
                onChange={(e) => setUniformForm({ ...uniformForm, winterBn: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ইউনিফর্ম পরিধানের শৃঙ্খলামূলক নিয়মাবলী</label>
              <textarea
                rows="3"
                value={uniformForm.guidelinesBn}
                onChange={(e) => setUniformForm({ ...uniformForm, guidelinesBn: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 bg-white leading-relaxed"
              ></textarea>
            </div>
          </div>

          <div className="pt-3 border-t flex justify-end">
            <button
              type="submit"
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition shadow flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>ইউনিফর্ম নীতিমালা সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      )}

      {/* 2. HERO SLIDER CMS */}
      {activeTab === 'slides' && (
        <form onSubmit={handleSlidesSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6 font-bangla text-xs">
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                হোমপেজ ব্যানার স্লাইডার কনটেন্ট
              </h3>
              <p className="text-[11px] text-slate-500">
                মূল ওয়েবসাইটের ৩টি মূল ব্যানার স্লাইডারের শিরোনাম, ছবি ও বিবরণ পরিবর্তন করুন
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {slidesForm.map((slide, idx) => (
              <div key={slide.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-bold text-emerald-950 text-sm block">
                  স্লাইড #{idx + 1}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ট্যাগ / ক্যাটাগরি পিল</label>
                    <input
                      type="text"
                      value={slide.tagBn}
                      onChange={(e) => handleSlideChange(idx, 'tagBn', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ব্যাকগ্রাউন্ড ছবির লিংক (Image URL)</label>
                    <input
                      type="url"
                      value={slide.image}
                      onChange={(e) => handleSlideChange(idx, 'image', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2.5 bg-white font-mono text-[11px]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">প্রধান শিরোনাম (Title)</label>
                    <input
                      type="text"
                      value={slide.titleBn}
                      onChange={(e) => handleSlideChange(idx, 'titleBn', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2.5 bg-white font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">উপশিরোনাম ও বিবরণ (Subtitle)</label>
                    <textarea
                      rows="2"
                      value={slide.subtitleBn}
                      onChange={(e) => handleSlideChange(idx, 'subtitleBn', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t flex justify-end">
            <button
              type="submit"
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition shadow flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>স্লাইডার সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. LOCATION & CONTACT CMS */}
      {activeTab === 'general' && (
        <form onSubmit={handleInfoSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6 font-bangla text-xs">
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                রোড, অবস্থান ও প্রাতিষ্ঠানিক যোগাযোগ তথ্য
              </h3>
              <p className="text-[11px] text-slate-500">
                ফেনী-পরশুরাম রোড সংলগ্ন ঠিকানা ও অফিশিয়াল ইমেইল
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">অফিশিয়াল ইমেইল *</label>
              <input
                type="email"
                required
                value={infoForm.email}
                onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 font-mono text-emerald-800 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">প্রধান রোড / মহাসড়ক অবস্থান</label>
              <input
                type="text"
                value={infoForm.roadBn}
                onChange={(e) => setInfoForm({ ...infoForm, roadBn: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">পূর্ণাঙ্গ প্রাতিষ্ঠানিক ঠিকানা</label>
              <input
                type="text"
                value={infoForm.addressBn}
                onChange={(e) => setInfoForm({ ...infoForm, addressBn: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">হটলাইন / মোবাইল নম্বর</label>
              <input
                type="text"
                value={infoForm.phone}
                onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">বিকল্প মোবাইল নম্বর</label>
              <input
                type="text"
                value={infoForm.phoneAlt}
                onChange={(e) => setInfoForm({ ...infoForm, phoneAlt: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t flex justify-end">
            <button
              type="submit"
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition shadow flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>যোগাযোগ তথ্য সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
