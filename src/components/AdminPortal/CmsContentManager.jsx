import React, { useState, useRef } from 'react';
import { useSchool } from '../../context/useSchool';
import { extractVideoMeta } from '../../utils/mediaStorage';
import { 
  Save, 
  CheckCircle, 
  Shirt, 
  Sliders, 
  MapPin,
  Image as ImageIcon,
  Video,
  Plus,
  Trash2,
  Upload,
  X,
  ExternalLink,
  Film
} from 'lucide-react';

export default function CmsContentManager() {
  const { 
    uniformInfo, 
    setUniformInfo, 
    heroSlides, 
    setHeroSlides, 
    schoolInfo, 
    setSchoolInfo,
    gallery,
    addGalleryItem,
    deleteGalleryItem,
    videos,
    addVideoItem,
    deleteVideoItem
  } = useSchool();

  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery', 'uniform', 'slides', 'general'
  const [uniformForm, setUniformForm] = useState(JSON.parse(JSON.stringify(uniformInfo)));
  const [slidesForm, setSlidesForm] = useState(JSON.parse(JSON.stringify(heroSlides)));
  const [infoForm, setInfoForm] = useState(JSON.parse(JSON.stringify(schoolInfo)));
  const [savedMessage, setSavedMessage] = useState(false);

  // Gallery Photo Upload States
  const [photoTitleBn, setPhotoTitleBn] = useState('');
  const [photoTitleEn, setPhotoTitleEn] = useState('');
  const [photoCategory, setPhotoCategory] = useState('campus');
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [photoUploadStatus, setPhotoUploadStatus] = useState('');
  const photoInputRef = useRef(null);

  // Gallery Video Upload States (Supports both YouTube link & Direct Video File Upload)
  const [videoSourceType, setVideoSourceType] = useState('link'); // 'link' or 'file'
  const [videoTitleBn, setVideoTitleBn] = useState('');
  const [videoTitleEn, setVideoTitleEn] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState('05:30');
  const [uploadedVideoFile, setUploadedVideoFile] = useState(null);
  const [uploadedVideoPreviewUrl, setUploadedVideoPreviewUrl] = useState('');
  const [uploadedVideoThumbnail, setUploadedVideoThumbnail] = useState('');
  const [videoProcessing, setVideoProcessing] = useState(false);
  const [videoUploadStatus, setVideoUploadStatus] = useState('');
  const videoFileInputRef = useRef(null);

  // Slide Image Upload Ref
  const slideFileRef = useRef(null);
  const [activeSlideUploadIndex, setActiveSlideUploadIndex] = useState(null);

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

  // Slide Image file upload
  const triggerSlideUpload = (index) => {
    setActiveSlideUploadIndex(index);
    if (slideFileRef.current) {
      slideFileRef.current.click();
    }
  };

  const handleSlideImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || activeSlideUploadIndex === null) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('ছবির আকার সর্বোচ্চ ১৫ মেগাবাইট (15 MB) হতে পারবে।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_W = 1920;
        const MAX_H = 1080;
        let w = img.width;
        let h = img.height;
        if (w > MAX_W || h > MAX_H) {
          if (w / h > MAX_W / MAX_H) {
            h = Math.round((h * MAX_W) / w);
            w = MAX_W;
          } else {
            w = Math.round((w * MAX_H) / h);
            h = MAX_H;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.88);
        handleSlideChange(activeSlideUploadIndex, 'image', compressed);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Gallery Photo File Upload
  const handlePhotoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('ছবির আকার সর্বোচ্চ ১৫ মেগাবাইট (15 MB) হতে পারবে।');
      return;
    }

    setPhotoUploadStatus('প্রসেসিং হচ্ছে...');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_W = 1920;
        const MAX_H = 1080;
        let w = img.width;
        let h = img.height;
        if (w > MAX_W || h > MAX_H) {
          if (w / h > MAX_W / MAX_H) {
            h = Math.round((h * MAX_W) / w);
            w = MAX_W;
          } else {
            w = Math.round((w * MAX_H) / h);
            h = MAX_H;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.85);
        setPhotoDataUrl(compressed);
        setPhotoUploadStatus('ছবি প্রস্তুত হয়েছে');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhotoSubmit = (e) => {
    e.preventDefault();
    if (!photoTitleBn || !photoDataUrl) {
      alert('অনুগ্রহ করে ছবির শিরোনাম লিখুন এবং একটি ছবি আপলোড করুন।');
      return;
    }

    addGalleryItem({
      titleBn: photoTitleBn,
      titleEn: photoTitleEn || photoTitleBn,
      category: photoCategory,
      image: photoDataUrl,
      captionBn: photoTitleBn,
      captionEn: photoTitleEn || photoTitleBn
    });

    setPhotoTitleBn('');
    setPhotoTitleEn('');
    setPhotoDataUrl('');
    setPhotoUploadStatus('');
    if (photoInputRef.current) photoInputRef.current.value = '';
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  // Gallery Video File Upload & Metadata Auto-Detection
  const handleVideoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert('ভিডিওর সর্বোচ্চ আকার ১০০ মেগাবাইট (100 MB) হতে পারবে।');
      return;
    }

    setVideoProcessing(true);
    setVideoUploadStatus('ভিডিও প্রসেসিং ও থাম্বনেইল তৈরি হচ্ছে...');
    try {
      const previewUrl = URL.createObjectURL(file);
      setUploadedVideoFile(file);
      setUploadedVideoPreviewUrl(previewUrl);

      const meta = await extractVideoMeta(file);
      if (meta.thumbnail) {
        setUploadedVideoThumbnail(meta.thumbnail);
      }
      if (meta.durationStr && meta.durationStr !== '00:00') {
        setVideoDuration(meta.durationStr);
      }
      setVideoUploadStatus(`ভিডিও লোড হয়েছে (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
    } catch (err) {
      console.warn('Failed to extract video meta:', err);
      setVideoUploadStatus('ভিডিও লোড সম্পন্ন হয়েছে');
    } finally {
      setVideoProcessing(false);
    }
  };

  // Gallery Video Submit (Supports YouTube Embed & Direct Uploaded MP4/WebM Video Files)
  const handleAddVideoSubmit = async (e) => {
    e.preventDefault();
    if (!videoTitleBn.trim()) {
      alert('অনুগ্রহ করে ভিডিওর শিরোনাম বাংলায় লিখুন।');
      return;
    }

    if (videoSourceType === 'link') {
      if (!videoUrl.trim()) {
        alert('ভিডিওর YouTube লিংক প্রদান করুন।');
        return;
      }

      let finalEmbedUrl = videoUrl.trim();
      let thumbnail = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80';
      let vidId = '';

      if (finalEmbedUrl.includes('watch?v=')) {
        vidId = finalEmbedUrl.split('watch?v=')[1]?.split('&')[0];
      } else if (finalEmbedUrl.includes('youtu.be/')) {
        vidId = finalEmbedUrl.split('youtu.be/')[1]?.split('?')[0];
      } else if (finalEmbedUrl.includes('youtube.com/shorts/')) {
        vidId = finalEmbedUrl.split('youtube.com/shorts/')[1]?.split('?')[0];
      } else if (finalEmbedUrl.includes('youtube.com/embed/')) {
        vidId = finalEmbedUrl.split('youtube.com/embed/')[1]?.split('?')[0];
      }

      if (vidId) {
        finalEmbedUrl = `https://www.youtube.com/embed/${vidId}`;
        thumbnail = `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`;
      }

      await addVideoItem({
        titleBn: videoTitleBn,
        titleEn: videoTitleEn || videoTitleBn,
        videoUrl: finalEmbedUrl,
        duration: videoDuration || '05:30',
        thumbnail: thumbnail,
        source: 'YouTube'
      });
    } else {
      // Direct File Upload
      if (!uploadedVideoFile && !uploadedVideoPreviewUrl) {
        alert('অনুগ্রহ করে মোবাইল বা কম্পিউটার থেকে একটি ভিডিও ফাইল (MP4/WebM) নির্বাচন করুন।');
        return;
      }

      await addVideoItem({
        titleBn: videoTitleBn,
        titleEn: videoTitleEn || videoTitleBn,
        videoUrl: uploadedVideoPreviewUrl,
        videoFile: uploadedVideoFile,
        duration: videoDuration || '03:15',
        thumbnail: uploadedVideoThumbnail || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
        source: 'Uploaded Video'
      });
    }

    setVideoTitleBn('');
    setVideoTitleEn('');
    setVideoUrl('');
    setUploadedVideoFile(null);
    setUploadedVideoPreviewUrl('');
    setUploadedVideoThumbnail('');
    setVideoUploadStatus('');
    if (videoFileInputRef.current) videoFileInputRef.current.value = '';
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Hidden Slide Image Upload Input */}
      <input
        type="file"
        ref={slideFileRef}
        accept="image/*"
        onChange={handleSlideImageFile}
        className="hidden"
      />

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 font-mono">
          <Sliders className="w-4 h-4 text-emerald-700" />
          <span>CONTENT MANAGEMENT SYSTEM (CMS)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-bangla text-slate-900">
          ওয়েবসাইট কনটেন্ট ও মিডিয়া আপলোড (CMS Editor)
        </h2>
        <p className="text-xs text-slate-500 font-bangla">
          ফটো গ্যালারি, ভিডিও, স্কুল ড্রেস কোড, হোমপেজ ব্যানার স্লাইডার ও অবস্থান তথ্য সরাসরি পরিচালনা করুন
        </p>
      </div>

      {/* CMS Sub-tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 font-bangla text-xs">
        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 ${
            activeTab === 'gallery'
              ? 'bg-emerald-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-amber-300" />
          <span>ফটো ও ভিডিও গ্যালারি আপলোড (Gallery CMS)</span>
        </button>

        <button
          onClick={() => setActiveTab('slides')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 ${
            activeTab === 'slides'
              ? 'bg-emerald-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4 text-amber-300" />
          <span>হোমপেজ ব্যানার স্লাইডার (Hero Slider CMS)</span>
        </button>

        <button
          onClick={() => setActiveTab('uniform')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 ${
            activeTab === 'uniform'
              ? 'bg-emerald-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Shirt className="w-4 h-4 text-amber-300" />
          <span>ইউনিফর্ম ও পোশাক কোড (Dress Code CMS)</span>
        </button>

        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 ${
            activeTab === 'general'
              ? 'bg-emerald-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4 text-amber-300" />
          <span>রোড ও প্রতিষ্ঠান পরিচিতি (Location & Identity)</span>
        </button>
      </div>

      {savedMessage && (
        <div className="p-3.5 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200 font-bangla border border-emerald-200 shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>পরিবর্তনসমূহ সফলভাবে সংরক্ষিত হয়েছে এবং ওয়েবসাইটে তৎক্ষণাৎ লাইভ হালনাগাদ করা হয়েছে!</span>
        </div>
      )}

      {/* 1. PHOTO & VIDEO GALLERY CMS */}
      {activeTab === 'gallery' && (
        <div className="space-y-8 font-bangla">
          {/* Top Form: Upload New Photo */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b">
                <Upload className="w-4 h-4 text-emerald-800" />
                <span>নতুন ফটো গ্যালারিতে আপলোড করুন</span>
              </h3>

              <form onSubmit={handleAddPhotoSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ছবির শিরোনাম (বাংলায়) *</label>
                  <input
                    type="text"
                    required
                    value={photoTitleBn}
                    onChange={(e) => setPhotoTitleBn(e.target.value)}
                    placeholder="যেমন: বার্ষিক ক্রীড়া প্রতিযোগিতা ২০২৬ বা কম্পিউটার ল্যাব"
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ছবির শিরোনাম (ইংরেজিতে)</label>
                  <input
                    type="text"
                    value={photoTitleEn}
                    onChange={(e) => setPhotoTitleEn(e.target.value)}
                    placeholder="Photo title in English"
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি / বিভাগ</label>
                  <select
                    value={photoCategory}
                    onChange={(e) => setPhotoCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                  >
                    <option value="campus">ক্যাম্পাস ও প্রাঙ্গণ (Campus Life)</option>
                    <option value="academic">বিজ্ঞান ও কম্পিউটার ল্যাব (Academic & Labs)</option>
                    <option value="sports">বার্ষিক ক্রীড়া প্রতিযোগিতা (Sports Meet)</option>
                    <option value="cultural">সাংস্কৃতিক ও জাতীয় দিবস (Cultural & Events)</option>
                  </select>
                </div>

                {/* Photo File Picker with Preview */}
                <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
                  <span className="font-bold text-slate-700 block">মোবাইল / কম্পিউটার থেকে ছবি নির্বাচন করুন *</span>
                  
                  <input
                    type="file"
                    ref={photoInputRef}
                    accept="image/*"
                    onChange={handlePhotoFileChange}
                    className="hidden"
                    id="gallery-photo-file"
                  />

                  {photoDataUrl ? (
                    <div className="space-y-2">
                      <div className="relative h-40 w-full rounded-lg overflow-hidden border border-slate-300 bg-slate-900">
                        <img src={photoDataUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => { setPhotoDataUrl(''); if (photoInputRef.current) photoInputRef.current.value = ''; }}
                          className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-full shadow hover:bg-rose-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-bold">{photoUploadStatus || 'ছবি সফলভাবে লোড হয়েছে'}</p>
                    </div>
                  ) : (
                    <label
                      htmlFor="gallery-photo-file"
                      className="cursor-pointer flex flex-col items-center justify-center p-6 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition"
                    >
                      <ImageIcon className="w-8 h-8 text-emerald-800 mb-1" />
                      <span className="font-bold text-slate-800">ছবি আপলোড করতে ক্লিক করুন</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">গ্যালারি বা ক্যামেরা থেকে JPG, PNG ছবি (স্বয়ংক্রিয় কম্প্রেস হবে)</span>
                    </label>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>গ্যালারিতে ছবি যোগ করুন</span>
                </button>
              </form>
            </div>

            {/* Video Embed Form (Supports YouTube Link AND Direct Video Upload) */}
            <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Video className="w-4 h-4 text-emerald-800" />
                  <span>নতুন ভিডিও যুক্ত করুন</span>
                </h3>

                {/* Video Mode Switcher */}
                <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setVideoSourceType('link')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      videoSourceType === 'link'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    YouTube লিংক
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoSourceType('file')}
                    className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                      videoSourceType === 'file'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-3 h-3 text-amber-300" />
                    <span>ভিডিও আপলোড</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddVideoSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ভিডিওর শিরোনাম (বাংলায়) *</label>
                  <input
                    type="text"
                    required
                    value={videoTitleBn}
                    onChange={(e) => setVideoTitleBn(e.target.value)}
                    placeholder="যেমন: বার্ষিক পুরস্কার বিতরণী ও সাংস্কৃতিক অনুষ্ঠান"
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ভিডিওর শিরোনাম (ইংরেজিতে)</label>
                  <input
                    type="text"
                    value={videoTitleEn}
                    onChange={(e) => setVideoTitleEn(e.target.value)}
                    placeholder="Video title in English"
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {videoSourceType === 'link' ? (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ইউটিউব ভিডিওর লিংক (YouTube Link) *</label>
                    <input
                      type="url"
                      required
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... বা Shorts লিংক"
                      className="w-full rounded-lg border border-slate-300 p-2.5 font-mono text-[11px]"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      ইউটিউবের সাধারণ লিংক অথবা শেয়ার লিংক পেস্ট করলেই সিস্টেম স্বয়ংক্রিয়ভাবে প্লেয়ারে রূপান্তর করবে।
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
                    <span className="font-bold text-slate-700 block">মোবাইল / কম্পিউটার থেকে ভিডিও ফাইল নির্বাচন করুন *</span>
                    
                    <input
                      type="file"
                      ref={videoFileInputRef}
                      accept="video/mp4,video/webm,video/ogg,video/quicktime"
                      onChange={handleVideoFileChange}
                      className="hidden"
                      id="cms-video-file-input"
                    />

                    {uploadedVideoPreviewUrl ? (
                      <div className="space-y-2">
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-300 shadow-xs">
                          <video
                            src={uploadedVideoPreviewUrl}
                            controls
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedVideoFile(null);
                              setUploadedVideoPreviewUrl('');
                              setUploadedVideoThumbnail('');
                              setVideoUploadStatus('');
                              if (videoFileInputRef.current) videoFileInputRef.current.value = '';
                            }}
                            className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-full shadow hover:bg-rose-700 cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{videoUploadStatus || 'ভিডিও সফলভাবে লোড হয়েছে'}</span>
                          </span>
                          {uploadedVideoThumbnail && (
                            <span className="text-slate-500 text-[10px]">স্বয়ংক্রিয় থাম্বনেইল তৈরি সম্পন্ন</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="cms-video-file-input"
                        className="cursor-pointer flex flex-col items-center justify-center p-6 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition"
                      >
                        <Film className="w-8 h-8 text-emerald-800 mb-1" />
                        <span className="font-bold text-slate-800">
                          {videoProcessing ? 'প্রসেসিং হচ্ছে...' : 'ভিডিও ফাইল আপলোড করতে ক্লিক করুন'}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">MP4, WebM বা OGG ভিডিও ফরম্যাট (সর্বোচ্চ 100 MB)</span>
                      </label>
                    )}
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ভিডিওর ব্যপ্তিকাল (Duration)</label>
                  <input
                    type="text"
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    placeholder="যেমন: 05:30"
                    className="w-full rounded-lg border border-slate-300 p-2.5 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">ফাইল আপলোড করলে ব্যপ্তিকাল স্বয়ংক্রিয়ভাবে নির্ধারিত হবে</p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={videoProcessing}
                    className="w-full bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs transition shadow flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-amber-300" />
                    <span>ভিডিওটি গ্যালারিতে প্রকাশ করুন</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Manage Existing Photos */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 pb-2 border-b flex justify-between items-center">
              <span>বর্তমানে প্রদর্শিত ফটো গ্যালারি ({gallery.length} টি ছবি)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div key={item.id} className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col justify-between">
                  <div className="relative h-36 w-full overflow-hidden bg-slate-200">
                    <img src={item.image} alt={item.titleBn} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <span className="absolute top-2 left-2 bg-emerald-950/80 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-full capitalize">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-2.5 flex items-center justify-between gap-1">
                    <p className="font-bold text-slate-800 text-xs truncate flex-1" title={item.titleBn}>
                      {item.titleBn}
                    </p>
                    <button
                      onClick={() => {
                        if (confirm('আপনি কি এই ছবিটি গ্যালারি থেকে মুছে ফেলতে চান?')) {
                          deleteGalleryItem(item.id);
                        }
                      }}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded transition shrink-0"
                      title="Delete Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manage Existing Videos */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 pb-2 border-b flex justify-between items-center">
              <span>বর্তমানে প্রদর্শিত ভিডিও গ্যালারি ({videos.length} টি ভিডিও)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((vid) => (
                <div key={vid.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-3">
                    {vid.thumbnail && (
                      <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-300">
                        <img src={vid.thumbnail} alt={vid.titleBn} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 right-0 bg-black/80 text-white text-[8px] font-mono px-1">
                          {vid.duration}
                        </span>
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                          vid.source === 'Uploaded Video' || vid.videoUrl?.startsWith('blob:') || vid.videoUrl?.startsWith('data:')
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {vid.source === 'Uploaded Video' ? 'Direct Upload' : 'YouTube'}
                        </span>
                        {vid.videoUrl?.startsWith('http') && (
                          <a href={vid.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline flex items-center gap-1 text-[11px] font-mono">
                            <span>লিংক</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{vid.titleBn}</h4>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('আপনি কি এই ভিডিওটি মুছে ফেলতে চান?')) {
                        deleteVideoItem(vid.id);
                      }
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition shrink-0 cursor-pointer"
                    title="Delete Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. DRESS CODE & UNIFORM CMS */}
      {activeTab === 'uniform' && (
        <form onSubmit={handleUniformSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6 font-bangla text-xs">
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                বিদ্যালয়ের অফিসিয়াল ইউনিফর্ম ও ড্রেস কোড নীতিমালা
              </h3>
              <p className="text-[11px] text-slate-500">
                ছাত্র এবং ছাত্রীদের নির্ধারিত স্কুল পোশাকের নির্দেশনা ও রঙের বিবরণ
              </p>
            </div>
          </div>

          {/* Boys Uniform Grid */}
          <div className="p-4 sm:p-5 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-4">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <Shirt className="w-4 h-4" />
              <span>ছাত্রদের পোশাক নীতিমালা (Boys Dress Code)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* Girls Uniform Grid */}
          <div className="p-4 sm:p-5 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
              <Shirt className="w-4 h-4" />
              <span>ছাত্রীদের পোশাক নীতিমালা (Girls Dress Code)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* 3. HERO SLIDER CMS WITH PHOTO UPLOAD */}
      {activeTab === 'slides' && (
        <form onSubmit={handleSlidesSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6 font-bangla text-xs">
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                হোমপেজ ব্যানার স্লাইডার কনটেন্ট ও ছবি পরিবর্তন
              </h3>
              <p className="text-[11px] text-slate-500">
                মূল ওয়েবসাইটের ৩টি মূল ব্যানার স্লাইডারের ছবি সরাসরি আপলোড করুন বা লিংক প্রদান করুন
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
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700">ব্যাকগ্রাউন্ড ছবি</label>
                      <button
                        type="button"
                        onClick={() => triggerSlideUpload(idx)}
                        className="text-emerald-800 hover:text-emerald-950 font-bold text-[11px] flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded transition"
                      >
                        <Upload className="w-3 h-3" />
                        <span>ডিভাইস থেকে ছবি আপলোড</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={slide.image}
                      onChange={(e) => handleSlideChange(idx, 'image', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2.5 bg-white font-mono text-[11px]"
                      placeholder="Image URL or uploaded image"
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
                    <label className="block font-bold text-slate-700 mb-1">উপ-শিরোনাম / বিবরণ (Subtitle)</label>
                    <input
                      type="text"
                      value={slide.subtitleBn}
                      onChange={(e) => handleSlideChange(idx, 'subtitleBn', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                    />
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

      {/* 4. LOCATION & CONTACT CMS */}
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
