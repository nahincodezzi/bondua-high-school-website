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
    <section className="py-12 bg-slate-50 min-h-[700px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'স্মৃতি ও কার্যক্রম' : 'Moments & Memories'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-bangla text-slate-900">
            {lang === 'bn' ? 'ফটো ও ভিডিও গ্যালারি' : 'Photo & Video Gallery'}
          </h2>
          <p className="text-sm text-slate-600 font-bangla mt-1">
            {lang === 'bn' 
              ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়ের মনোরম ক্যাম্পাস, সহশিক্ষা, ক্রীড়া ও সাংস্কৃতিক উৎসবের স্থিরচিত্র'
              : 'Glimpses of academic life, annual sports, cultural functions, and celebrations.'}
          </p>

          {/* Facebook Group Community Banner */}
          <div className="mt-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-md">
            <div className="flex items-center gap-2 font-bangla text-left">
              <Share2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                {lang === 'bn' 
                  ? 'বিদ্যালয়ের ফেসবুক গ্রুপে যুক্ত হয়ে আপনার কাছে থাকা ছবি ও ভিডিও শেয়ার করুন।' 
                  : 'Join our Facebook Community to share & browse alumni memories.'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={schoolInfo.facebookGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-blue-900 hover:bg-amber-400 hover:text-emerald-950 font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow"
              >
                <span>{lang === 'bn' ? 'ফেসবুক গ্রুপ দেখুন' : 'Visit Group'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setActiveTab('facebookHub')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg transition"
              >
                {lang === 'bn' ? 'মিডিয়া সিঙ্ক হাব' : 'Media Hub'}
              </button>
            </div>
          </div>
        </div>

        {/* Media Type Switcher (Photos vs Videos) */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1">
            <button
              onClick={() => setActiveTabType('photos')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 font-bangla ${
                activeTabType === 'photos'
                  ? 'bg-emerald-800 text-white shadow'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ছবি সমূহ (Photos)' : 'Photos'}</span>
              <span className="bg-emerald-700/60 px-1.5 py-0.2 rounded-full text-[10px]">{gallery.length}</span>
            </button>

            <button
              onClick={() => setActiveTabType('videos')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 font-bangla ${
                activeTabType === 'videos'
                  ? 'bg-emerald-800 text-white shadow'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Video className="w-4 h-4 text-amber-400" />
              <span>{lang === 'bn' ? 'ভিডিও সমূহ (Videos)' : 'Videos'}</span>
              <span className="bg-emerald-700/60 px-1.5 py-0.2 rounded-full text-[10px]">{videos.length}</span>
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
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-bangla transition ${
                    filterCategory === cat.id
                      ? 'bg-slate-900 text-amber-300 font-bold shadow'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
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
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 cursor-pointer flex flex-col"
                >
                  {/* Image Container with Zoom effect */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.titleEn}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 text-emerald-950 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>

                    {item.facebookGroupOrigin && (
                      <span className="absolute top-2.5 right-2.5 bg-blue-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1 shadow">
                        <Share2 className="w-2.5 h-2.5" />
                        <span>FB Group</span>
                      </span>
                    )}
                  </div>

                  {/* Caption & Date */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold font-bangla text-slate-800 group-hover:text-emerald-800 transition line-clamp-2">
                        {lang === 'bn' ? item.titleBn : item.titleEn}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-bangla mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {item.date}
                      </span>
                      <span className="capitalize text-emerald-700 font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIDEO VIEW */}
        {activeTabType === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition border border-slate-200 group"
              >
                <div 
                  onClick={() => setActiveVideoModal(vid)}
                  className="relative h-60 w-full overflow-hidden bg-slate-900 cursor-pointer"
                >
                  <img
                    src={vid.thumbnail}
                    alt={vid.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80 group-hover:opacity-95"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-rose-500 transition-all duration-300">
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-mono px-2 py-0.5 rounded font-bold">
                    {vid.duration}
                  </span>
                </div>

                <div className="p-4">
                  <h4 className="text-sm sm:text-base font-bold font-bangla text-slate-900 group-hover:text-emerald-800 transition">
                    {lang === 'bn' ? vid.titleBn : vid.titleEn}
                  </h4>
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={() => setActiveVideoModal(vid)}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 font-bangla"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'ভিডিও চালান' : 'Watch Video'}</span>
                    </button>
                    <a
                      href={schoolInfo.facebookGroupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>FB Group</span>
                    </a>
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
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveImageModal(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev / Next Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center transition border border-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center transition border border-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image */}
              <div className="max-h-[70vh] flex items-center justify-center bg-black">
                <img
                  src={activeImageModal.image}
                  alt={activeImageModal.titleEn}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>

              {/* Caption Bar */}
              <div className="p-4 bg-slate-900 text-white border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-bangla text-amber-300">
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
                    className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
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
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
            >
              <div className="bg-slate-800 px-4 py-3 flex items-center justify-between text-white">
                <h4 className="text-xs sm:text-sm font-bold font-bangla line-clamp-1">
                  {lang === 'bn' ? activeVideoModal.titleBn : activeVideoModal.titleEn}
                </h4>
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="p-1 hover:bg-rose-600 rounded transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-video w-full bg-black">
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
