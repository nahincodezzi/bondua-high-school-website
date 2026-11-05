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
    <section className="py-14 text-white relative z-10 font-sans min-h-[750px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header Hero Banner for Facebook Group */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-2xl mb-10 border border-blue-400/30 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 glass-pill text-blue-300 text-xs font-bold px-4 py-1.5 rounded-full border border-blue-400/30">
                <Share2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Group ID: {schoolInfo.facebookGroupId}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold font-bangla text-white leading-tight drop-shadow-md">
                {lang === 'bn' 
                  ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় ফেসবুক গ্রুপ ও মিডিয়া হাব' 
                  : 'Official Facebook Group & Media Sync Hub'}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base font-bangla max-w-2xl leading-relaxed">
                {lang === 'bn'
                  ? 'আমাদের ফেসবুক কমিউনিটি গ্রুপে প্রাক্তন ও বর্তমান শিক্ষার্থীদের তোলা প্রাঙ্গণ, ক্রীড়া, সাংস্কৃতিক উৎসব ও ক্লাস রুটিনের আকর্ষণীয় ছবিগুলো এখানে যুক্ত করুন।'
                  : 'Connect with alumni & students. Import community photos into the institutional portal gallery.'}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={schoolInfo.facebookGroupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold font-bold px-5 py-2.5 rounded-full text-xs transition flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <span>{lang === 'bn' ? 'অফিসিয়াল ফেসবুক গ্রুপ ভিজিট করুন' : 'Visit Official Facebook Group'}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={() => setActiveTab('gallery')}
                  className="glass-pill hover:bg-white/15 text-white font-bold px-4 py-2.5 rounded-full text-xs transition border border-white/15 cursor-pointer"
                >
                  {lang === 'bn' ? 'মূল গ্যালারি দেখুন' : 'View Full Gallery'}
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 glass-card p-6 rounded-2xl border border-white/10 text-center space-y-3">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block font-mono">
                COMMUNITY STATS
              </span>
              <div className="text-3xl font-extrabold font-mono text-white">
                {facebookGroupPhotos.length + 42} <span className="text-sm font-normal text-slate-300">Photos</span>
              </div>
              <p className="text-xs text-slate-300 font-bangla">
                বিদ্যালয় পরিবারের শিক্ষার্থীদের শেয়ারকৃত স্মৃতিমালা
              </p>
            </div>
          </div>
        </div>

        {/* Import Media Form */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl backdrop-blur-xl mb-12">
          <div className="max-w-2xl mb-6">
            <div className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold font-mono mb-1">
              <UploadCloud className="w-4 h-4 text-amber-400" />
              <span>COMMUNITY MEDIA IMPORTER</span>
            </div>
            <h3 className="text-xl font-bold font-bangla text-white">
              ফেসবুক গ্রুপ থেকে যেকোনো ছবি ওয়েবসাইটে যুক্ত করুন
            </h3>
            <p className="text-xs text-slate-300 font-bangla mt-1">
              ফেসবুকে পোস্ট করা ছবির লিংক বা যেকোনো ইমেজ ইউআরএল (Image URL) দিয়ে মুহূর্তেই ওয়েবসাইট গ্যালারিতে যোগ করুন।
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="mb-6">
            <span className="text-xs font-bold text-slate-300 block mb-2 font-bangla flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>অথবা নিচের নমুনা অ্যালবাম থেকে এক ক্লিকে লোড করুন:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadPreset(preset)}
                  className="glass-pill hover:bg-white/15 text-slate-200 hover:text-white px-3 py-1.5 rounded-full text-xs font-bangla transition border border-white/10 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-amber-400" />
                  <span>{preset.titleBn}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleImportSubmit} className="space-y-4 text-xs font-bangla">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-200 mb-1.5">
                  ছবির ডিরেক্ট লিংক (Image URL) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... or FB photo URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="glass-input w-full rounded-xl p-3 text-white placeholder-slate-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1.5">
                  ক্যাটাগরি নির্বাচন করুন
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="glass-input w-full rounded-xl p-3 text-white bg-slate-900"
                >
                  <option value="campus" className="bg-slate-900 text-white">ক্যাম্পাস ও প্রাঙ্গণ (Campus)</option>
                  <option value="sports" className="bg-slate-900 text-white">ক্রীড়া ও খেলাধুলা (Sports)</option>
                  <option value="cultural" className="bg-slate-900 text-white">সাংস্কৃতিক ও জাতীয় দিবস (Events)</option>
                  <option value="academic" className="bg-slate-900 text-white">ক্লাস ও বিজ্ঞানাগার (Academic)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-200 mb-1.5">
                  ছবির শিরোনাম (বাংলায়)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: আন্তঃশ্রেণি বিজ্ঞান অলিম্পিয়াড ২০২৬"
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  className="glass-input w-full rounded-xl p-3 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1.5">
                  ছবির শিরোনাম (ইংরেজিতে)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Science Olympiad 2026"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="glass-input w-full rounded-xl p-3 text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1.5">
                সংক্ষিপ্ত বিবরণ
              </label>
              <textarea
                rows="2"
                placeholder="ছবি সম্পর্কে বিস্তারিত তথ্য..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass-input w-full rounded-xl p-3 text-white placeholder-slate-500"
              ></textarea>
            </div>

            {successMsg && (
              <div className="p-3.5 glass-pill text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-400/30">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ছবিটি সফলভাবে প্রধান ওয়েবসাইট গ্যালারিতে যুক্ত করা হয়েছে!</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-gold py-3 px-8 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-slate-950" />
              <span>গ্যালারিতে যুক্ত করুন (Import Photo)</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
