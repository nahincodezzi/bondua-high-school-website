import React, { useState } from 'react';
import { useSchool } from '../context/useSchool';
import { 
  Share2, 
  ExternalLink, 
  UploadCloud, 
  CheckCircle, 
  Plus, 
  Sparkles
} from 'lucide-react';

export default function FacebookMediaHub() {
  const { lang, schoolInfo, gallery, addGalleryItem, setActiveTab } = useSchool();

  const [imageUrl, setImageUrl] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [category, setCategory] = useState('campus');
  const [description, setDescription] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Quick preset sample images from alumni events
  const samplePresets = [
    {
      titleBn: "বিদ্যালয় প্রাঙ্গণে ২০২৫ ব্যাচের পুনর্মিলনী ও আড্ডা",
      titleEn: "Batch 2025 Reunion at Campus Ground",
      category: "cultural",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80",
      description: "প্রাক্তন শিক্ষার্থীদের মিলনমেলা ও স্মৃতিচারণ।"
    },
    {
      titleBn: "আন্তঃশ্রেণি ফুটবল টুর্নামেন্ট ফাইনাল ম্যাচ",
      titleEn: "Inter-Class Football Tournament Final",
      category: "sports",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80",
      description: "দশম শ্রেণি বনাম নবম শ্রেণির মধ্যকার রোমাঞ্চকর ফাইনাল।"
    },
    {
      titleBn: "জাতীয় বিজ্ঞান মেলায় শিক্ষার্থীদের উদ্ভাবনী প্রজেক্ট",
      titleEn: "Students Innovation at National Science Fair",
      category: "academic",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
      description: "সৌরশক্তি চালিত রোবট ও স্মার্ট ভিলেজ মডেল প্রদর্শন।"
    }
  ];

  const handleImportSubmit = (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    addGalleryItem({
      titleBn: titleBn || 'ফেসবুক গ্রুপ থেকে সংগৃহীত ছবি',
      titleEn: titleEn || 'Photo from Facebook Community',
      category,
      image: imageUrl.trim(),
      description: description || 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়ের অফিশিয়াল ফেসবুক গ্রুপ হতে সংযুক্ত।',
      facebookGroupOrigin: true
    });

    setSuccessMsg(true);
    setImageUrl('');
    setTitleBn('');
    setTitleEn('');
    setDescription('');

    setTimeout(() => {
      setSuccessMsg(false);
    }, 4000);
  };

  const handleLoadPreset = (preset) => {
    setImageUrl(preset.image);
    setTitleBn(preset.titleBn);
    setTitleEn(preset.titleEn);
    setCategory(preset.category);
    setDescription(preset.description);
  };

  // Group photos
  const facebookGroupPhotos = gallery.filter(item => item.facebookGroupOrigin);

  return (
    <section className="py-12 bg-slate-50 min-h-[750px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Hero Banner for Facebook Group */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl mb-10 border border-blue-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-600/80 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                <Share2 className="w-3.5 h-3.5" />
                <span>Group ID: {schoolInfo.facebookGroupId}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold font-bangla text-white leading-tight">
                {lang === 'bn' 
                  ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় ফেসবুক গ্রুপ ও মিডিয়া হাব' 
                  : 'Official Facebook Group & Media Sync Hub'}
              </h2>

              <p className="text-blue-100 text-sm sm:text-base font-bangla max-w-2xl leading-relaxed">
                {lang === 'bn'
                  ? 'আমাদের অফিশিয়াল ফেসবুক গ্রুপে বিদ্যালয়ের দৈনন্দিন ছবি, ভিডিও, প্রাক্তন শিক্ষার্থীদের স্মৃতিচারণ, ব্যাচ পুনর্মিলনী ও বিভিন্ন উৎসবের ছবি নিয়মিত শেয়ার করা হয়। নিচের লিংকে ক্লিক করে সরাসরি গ্রুপে যুক্ত হোন।'
                  : 'Connect with alumni, teachers, and current students on our official Facebook community group. Browse or share event memories directly.'}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={schoolInfo.facebookGroupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-lg flex items-center gap-2 transition transform hover:-translate-y-0.5"
                >
                  <Share2 className="w-4 h-4 text-blue-200" />
                  <span>{lang === 'bn' ? 'ফেসবুক গ্রুপে সরাসরি প্রবেশ করুন' : 'Open Facebook Group (New Tab)'}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={() => setActiveTab('gallery')}
                  className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-600 font-semibold px-4 py-3 rounded-xl text-xs sm:text-sm transition font-bangla"
                >
                  {lang === 'bn' ? 'সম্পূর্ণ গ্যালারি দেখুন' : 'View Full Gallery'}
                </button>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'bn' ? 'কমিউনিটি নির্দেশিকা' : 'Community Features'}</span>
              </div>
              <ul className="space-y-2 text-blue-100 font-bangla">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{lang === 'bn' ? 'বর্তমান ও প্রাক্তন শিক্ষার্থীদের সার্বক্ষণিক সংযুক্তি' : 'Active alumni & students hub'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{lang === 'bn' ? 'বার্ষিক ক্রীড়া ও সাংস্কৃতিক অনুষ্ঠানের শত শত স্মৃতি' : 'Hundreds of sports & cultural photos'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{lang === 'bn' ? 'এসএসসি ফলাফল উদযাপন ও ব্যাচ আড্ডা' : 'SSC result celebration memories'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Media Importer / Sync Box */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-10">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 font-bangla">
            <UploadCloud className="w-4 h-4 text-emerald-700" />
            <span>{lang === 'bn' ? 'ফেসবুক গ্রুপ থেকে ছবি যোগ করুন' : 'Import Media from Facebook'}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-bangla text-slate-900 mb-2">
            {lang === 'bn' 
              ? 'গ্রুপের যেকোনো ছবির লিংক দিয়ে তাৎক্ষণিক ওয়েবসাইটে যুক্ত করুন' 
              : 'Add Any Photo URL to the School Website'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 font-bangla mb-6">
            {lang === 'bn'
              ? 'ফেসবুক গ্রুপ থেকে যেকোনো ছবির ইমেজ লিংক কপি করে নিচের বক্সে পেস্ট করুন। সাথে সাথে তা ওয়েবসাইটের ফটো গ্যালারিতে সংরক্ষিত হয়ে যাবে।'
              : 'Paste an image URL from the Facebook group or select a sample preset below to see it live.'}
          </p>

          {/* Quick Preset Buttons */}
          <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 block mb-2 font-bangla">
              {lang === 'bn' ? '⚡ দ্রুত যুক্ত করার জন্য প্রস্তুতকৃত নমুনা ছবিসমূহ:' : '⚡ Quick Sample Presets:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadPreset(preset)}
                  className="bg-white hover:bg-emerald-50 text-emerald-950 border border-slate-200 hover:border-emerald-500 px-3 py-1.5 rounded-lg text-xs font-semibold font-bangla transition shadow-2xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'bn' ? preset.titleBn : preset.titleEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleImportSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bangla">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'ছবির ওয়েব লিংক (Image URL) *' : 'Image URL *'}
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'ছবির শিরোনাম (বাংলায়)' : 'Title (Bangla)'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'bn' ? 'যেমন: বার্ষিক পুরস্কার বিতরণী অনুষ্ঠান' : 'e.g. Annual Prize Giving'}
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'ছবির শিরোনাম (ইংরেজিতে)' : 'Title (English)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Annual Prize Giving Ceremony"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'অ্যালবাম বিভাগ' : 'Category'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="campus">ক্যাম্পাস ও প্রাঙ্গণ (Campus)</option>
                  <option value="academic">বিজ্ঞান ও কম্পিউটার ল্যাব (Academic)</option>
                  <option value="sports">বার্ষিক ক্রীড়া প্রতিযোগিতা (Sports)</option>
                  <option value="cultural">সাংস্কৃতিক ও জাতীয় দিবস (Cultural)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'সংক্ষিপ্ত বিবরণ' : 'Description'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'bn' ? 'ছবির বর্ণনা লিখুন...' : 'Short description...'}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'bn' ? 'ছবিটি সফলভাবে গ্যালারিতে যুক্ত হয়েছে!' : 'Photo successfully added to school gallery!'}</span>
              </div>
            )}

            <button
              type="submit"
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition shadow flex items-center gap-2 font-bangla"
            >
              <UploadCloud className="w-4 h-4 text-amber-300" />
              <span>{lang === 'bn' ? 'গ্যালারিতে প্রকাশ করুন' : 'Publish to Gallery'}</span>
            </button>
          </form>
        </div>

        {/* Existing Facebook Group Media Showcase */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold font-bangla text-slate-900 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-600" />
              <span>{lang === 'bn' ? 'গ্রুপ থেকে সংগৃহীত সাম্প্রতিক ছবিসমূহ' : 'Synced Photos from Group'}</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Total {facebookGroupPhotos.length} Items
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {facebookGroupPhotos.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-md transition flex flex-col"
              >
                <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.titleEn}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Share2 className="w-2.5 h-2.5" />
                    <span>FB Media</span>
                  </span>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h4 className="text-xs font-bold font-bangla text-slate-800 line-clamp-1">
                    {lang === 'bn' ? item.titleBn : item.titleEn}
                  </h4>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{item.date}</span>
                    <span className="text-emerald-700 capitalize font-medium">{item.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
