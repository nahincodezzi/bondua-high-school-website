import React, { useState } from 'react';
import { useSchool } from '../context/useSchool';
import { 
  Image as ImageIcon, 
  Video, 
  Eye, 
  Download, 
  X, 
  Calendar, 
  Share2, 
  Play, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export default function Gallery() {
  const { lang, gallery, videos, schoolInfo, setActiveTab } = useSchool();
  const [activeTabType, setActiveTabType] = useState('photos'); // 'photos' or 'videos'
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeImageModal, setActiveImageModal] = useState(null);
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  const categories = [
    { id: 'all', labelBn: 'সকল ছবি', labelEn: 'All Photos' },
    { id: 'campus', labelBn: 'ক্যাম্পাস ও প্রাঙ্গণ', labelEn: 'Campus Life' },
    { id: 'academic', labelBn: 'বিজ্ঞান ও কম্পিউটার ল্যাব', labelEn: 'Academic & Labs' },
    { id: 'sports', labelBn: 'বার্ষিক ক্রীড়া প্রতিযোগিতা', labelEn: 'Sports Meet' },
    { id: 'cultural', labelBn: 'সাংস্কৃতিক ও জাতীয় দিবস', labelEn: 'Cultural & Events' }
  ];

  const filteredPhotos = gallery.filter(item => {
    return filterCategory === 'all' || item.category === filterCategory;
  });

  const openLightbox = (item, index) => {
    setActiveImageModal({ ...item, index });
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (!activeImageModal) return;
    const nextIdx = (activeImageModal.index + 1) % filteredPhotos.length;
    setActiveImageModal({ ...filteredPhotos[nextIdx], index: nextIdx });
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (!activeImageModal) return;
    const prevIdx = (activeImageModal.index - 1 + filteredPhotos.length) % filteredPhotos.length;
    setActiveImageModal({ ...filteredPhotos[prevIdx], index: prevIdx });
  };

  return (
    <section className="py-14 text-white relative z-10 font-sans min-h-[700px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 glass-pill text-amber-300 text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-md border border-amber-400/20">
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'bn' ? 'স্মৃতি ও কার্যক্রম' : 'Moments & Memories'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-bangla text-white drop-shadow-md">
            {lang === 'bn' ? 'ফটো ও ভিডিও গ্যালারি' : 'Photo & Video Gallery'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-bangla mt-2">
            {lang === 'bn' 
              ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়ের মনোরম ক্যাম্পাস, সহশিক্ষা, ক্রীড়া ও সাংস্কৃতিক উৎসবের স্থিরচিত্র'
              : 'Glimpses of academic life, annual sports, cultural functions, and celebrations.'}
          </p>

          {/* Facebook Group Community Banner */}
          <div className="mt-5 glass-card p-4 rounded-3xl border border-blue-400/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-2.5 font-bangla text-left">
              <Share2 className="w-5 h-5 text-amber-300 shrink-0" />
              <span className="text-slate-200">
                {lang === 'bn' 
                  ? 'বিদ্যালয়ের ফেসবুক গ্রুপে যুক্ত হয়ে আপনার কাছে থাকা ছবি ও ভিডিও শেয়ার করুন।' 
                  : 'Join our Facebook Community to share & browse alumni memories.'}
              </span>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href={schoolInfo.facebookGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold font-bold px-4 py-2 rounded-full transition flex items-center gap-1.5 shadow-md text-xs cursor-pointer"
              >
                <span>{lang === 'bn' ? 'ফেসবুক গ্রুপ দেখুন' : 'Visit Group'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setActiveTab('facebookHub')}
                className="glass-pill hover:bg-white/15 text-white font-bold px-4 py-2 rounded-full transition border border-white/15 text-xs cursor-pointer"
              >
                {lang === 'bn' ? 'মিডিয়া সিঙ্ক হাব' : 'Media Hub'}
              </button>
            </div>
          </div>
        </div>

        {/* Media Type Switcher (Photos vs Videos) */}
        <div className="flex justify-center mb-8">
          <div className="glass-capsule p-1.5 rounded-full border border-white/15 shadow-xl flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTabType('photos')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 font-bangla cursor-pointer ${
                activeTabType === 'photos'
                  ? 'btn-gold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ছবি সমূহ (Photos)' : 'Photos'}</span>
              <span className="bg-slate-950/40 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-bold">{gallery.length}</span>
            </button>

            <button
              onClick={() => setActiveTabType('videos')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 font-bangla cursor-pointer ${
                activeTabType === 'videos'
                  ? 'btn-gold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ভিডিও সমূহ (Videos)' : 'Videos'}</span>
              <span className="bg-slate-950/40 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-bold">{videos.length}</span>
            </button>
          </div>
        </div>

        {/* PHOTO VIEW */}
        {activeTabType === 'photos' && (
          <div>
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold font-bangla transition cursor-pointer ${
                    filterCategory === cat.id
                      ? 'btn-gold shadow-md'
                      : 'glass-pill text-slate-300 hover:text-white border border-white/10'
                  }`}
                >
                  {lang === 'bn' ? cat.labelBn : cat.labelEn}
                </button>
              ))}
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPhotos.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => openLightbox(item, idx)}
                  className="group glass-card glass-card-hover rounded-3xl overflow-hidden shadow-xl border border-white/15 cursor-pointer flex flex-col backdrop-blur-xl"
                >
                  {/* Image Container with Zoom effect */}
                  <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.image}
                      alt={item.titleEn}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full btn-gold flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Eye className="w-5 h-5 text-slate-950" />
                      </div>
                    </div>

                    {item.facebookGroupOrigin && (
                      <span className="absolute top-2.5 right-2.5 glass-pill text-blue-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-400/30 flex items-center gap-1 shadow">
                        <Share2 className="w-2.5 h-2.5 text-blue-400" />
                        <span>FB Group</span>
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-1 font-bangla">
                    <span className="text-[10px] font-mono text-amber-300 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>{item.date}</span>
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition line-clamp-1">
                      {lang === 'bn' ? item.titleBn : item.titleEn}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIDEO VIEW */}
        {activeTabType === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setActiveVideoModal(vid)}
                className="group glass-card glass-card-hover rounded-3xl overflow-hidden shadow-xl border border-white/15 cursor-pointer backdrop-blur-xl"
              >
                <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                  <img
                    src={vid.thumbnail}
                    alt={vid.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full btn-gold flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-slate-950 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-2 font-bangla">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition line-clamp-1">
                    {lang === 'bn' ? vid.titleBn : vid.titleEn}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="text-amber-300 font-mono">{vid.duration}</span>
                    <span className="glass-pill px-2.5 py-0.5 rounded-full border border-white/10 text-[11px] text-slate-300 font-sans">{vid.source}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Photo Lightbox Modal */}
        {activeImageModal && (
          <div 
            onClick={() => setActiveImageModal(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full glass-card rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveImageModal(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full glass-pill hover:bg-rose-600 text-white flex items-center justify-center transition border border-white/20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev / Next Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass-pill hover:bg-amber-400 hover:text-slate-950 text-white flex items-center justify-center transition border border-white/20 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass-pill hover:bg-amber-400 hover:text-slate-950 text-white flex items-center justify-center transition border border-white/20 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image */}
              <div className="max-h-[70vh] flex items-center justify-center bg-slate-950">
                <img
                  src={activeImageModal.image}
                  alt={activeImageModal.titleEn}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>

              {/* Caption Bar */}
              <div className="p-5 glass-capsule text-white border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold font-bangla text-amber-300">
                    {lang === 'bn' ? activeImageModal.titleBn : activeImageModal.titleEn}
                  </h3>
                  <p className="text-xs text-slate-300 font-bangla mt-0.5">
                    {activeImageModal.description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">{activeImageModal.date}</span>
                  <a
                    href={activeImageModal.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Player Modal */}
        {activeVideoModal && (
          <div 
            onClick={() => setActiveVideoModal(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full glass-card rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            >
              <div className="glass-capsule px-5 py-3.5 flex items-center justify-between text-white border-b border-white/15">
                <h4 className="text-xs sm:text-sm font-bold font-bangla line-clamp-1">
                  {lang === 'bn' ? activeVideoModal.titleBn : activeVideoModal.titleEn}
                </h4>
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="p-1.5 glass-pill hover:bg-rose-600 rounded-full transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-video w-full bg-slate-950">
                <iframe
                  src={activeVideoModal.videoUrl}
                  title="School Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
