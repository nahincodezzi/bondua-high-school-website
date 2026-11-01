import React, { useState, useRef } from 'react';
import { useSchool } from '../../context/useSchool';
import SchoolLogo from '../common/SchoolLogo';
import { 
  Save, 
  CheckCircle, 
  School, 
  Share2, 
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Target,
  Eye,
  Compass,
  UserCheck,
  FileText
} from 'lucide-react';

export default function SchoolSettings() {
  const { schoolInfo, setSchoolInfo, resetToDefaults } = useSchool();
  const [formData, setFormData] = useState({ ...schoolInfo });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [logoUploadStatus, setLogoUploadStatus] = useState('');
  const [campusUploadStatus, setCampusUploadStatus] = useState('');
  const logoInputRef = useRef(null);
  const campusInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Logo Upload (PNG accepted up to 10MB with transparent alpha support)
  const handleLogoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Maximum 10MB limit check as requested
    const MAX_MB = 10;
    if (file.size > MAX_MB * 1024 * 1024) {
      alert(`লোগো ফাইলের আকার সর্বোচ্চ ${MAX_MB} মেগাবাইট (10 MB) হতে পারবে। আপনার ফাইলের আকার: ${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      return;
    }

    setLogoUploadStatus('লোগো অপ্টিমাইজ ও প্রসেস করা হচ্ছে...');
    const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);

    const reader = new FileReader();
    reader.onload = (event) => {
      // If SVG, save directly
      if (file.type === 'image/svg+xml') {
        setFormData(prev => ({ ...prev, logo: event.target.result }));
        setLogoUploadStatus(`SVG লোগো সফলভাবে লোড হয়েছে (${originalSizeMB} MB)`);
        return;
      }

      const img = new Image();
      img.onload = () => {
        // High quality canvas rendering maintaining alpha transparency
        const canvas = document.createElement('canvas');
        const MAX_DIM = 512; // 512x512 is ultra crisp for retina badges and preserves memory
        let w = img.width;
        let h = img.height;

        if (w > MAX_DIM || h > MAX_DIM) {
          if (w > h) {
            h = Math.round((h * MAX_DIM) / w);
            w = MAX_DIM;
          } else {
            w = Math.round((w * MAX_DIM) / h);
            h = MAX_DIM;
          }
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        // Keep transparent PNG format
        const outputDataUrl = canvas.toDataURL('image/png', 0.95);
        setFormData(prev => ({ ...prev, logo: outputDataUrl }));
        setLogoUploadStatus(`PNG লোগো প্রস্তুত (${originalSizeMB} MB থেকে অপ্টিমাইজড)`);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    if (confirm('আপনি কি ডিফল্ট অফিশিয়াল মনোগ্রামে ফিরে যেতে চান?')) {
      setFormData(prev => ({ ...prev, logo: null }));
      setLogoUploadStatus('');
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  // Handle Campus Photo Upload (High quality up to 10MB)
  const handleCampusFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('ক্যাম্পাস ছবির আকার সর্বোচ্চ ১০ মেগাবাইট হতে পারবে।');
      return;
    }

    setCampusUploadStatus('ছবি প্রস্তুত হচ্ছে...');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_W = 1600;
        const MAX_H = 1000;
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
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setFormData(prev => ({ ...prev, campusImage: dataUrl }));
        setCampusUploadStatus('ক্যাম্পাস ছবি আপলোড সম্পন্ন হয়েছে');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSchoolInfo(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-bangla text-slate-900">
          প্রতিষ্ঠান তথ্য, লোগো ও সফটওয়্যার সেটিংস (School Settings)
        </h2>
        <p className="text-xs text-slate-500 font-bangla mt-0.5">
          বিদ্যালয়ের প্রাতিষ্ঠানিক লোগো (PNG সর্বোচ্চ 10MB), রূপকল্প (Vision), লক্ষ্য (Mission), ফোন, ইমেইল, ফেসবুক গ্রুপ ও বাণীবহুল তথ্যসমূহ সরাসরি CMS থেকে আপডেট ও প্রকাশ করুন।
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <form onSubmit={handleSubmit} className="space-y-8 text-xs font-bangla">

          {/* Section 1: School Logo Upload (Max 10MB PNG) */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-700" />
                <span>১. প্রাতিষ্ঠানিক লোগো ও মনোগ্রাম (School Logo - PNG Accepted up to 10MB)</span>
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2.5 py-0.5 rounded-full">
                সর্বোচ্চ 10 MB
              </span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Logo Preview */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-2 shadow-md ring-4 ring-emerald-600/30 shrink-0 flex items-center justify-center overflow-hidden">
                <SchoolLogo logo={formData.logo} className="w-full h-full object-contain" />
              </div>

              {/* Upload Controls */}
              <div className="space-y-2 flex-1 text-center sm:text-left">
                <p className="font-bold text-slate-800 text-xs">
                  {formData.logo ? 'কাস্টম আপলোডকৃত লোগো সক্রিয় রয়েছে' : 'ডিফল্ট প্রাতিষ্ঠানিক মনোগ্রাম সক্রিয় রয়েছে'}
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  ট্রান্সপারেন্ট ব্যাকগ্রাউন্ডযুক্ত <strong>PNG</strong>, <strong>SVG</strong> অথবা <strong>JPG/WebP</strong> ফরম্যাটের লোগো আপলোড করতে পারবেন। ফাইল সাইজ সর্বোচ্চ <strong>১০ মেগাবাইট (10 MB)</strong> পর্যন্ত অনুমোদিত।
                </p>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept=".png, .jpg, .jpeg, .webp, .svg"
                    onChange={handleLogoFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="bg-emerald-900 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-300" />
                    <span>নতুন লোগো আপলোড করুন (Max 10MB)</span>
                  </button>

                  {formData.logo && (
                    <button
                      type="button"
                      onClick={handleResetLogo}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>ডিফল্ট মনোগ্রামে ফিরুন</span>
                    </button>
                  )}
                </div>

                {logoUploadStatus && (
                  <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 pt-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{logoUploadStatus}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Basic Institutional Details */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b mb-4 flex items-center gap-2">
              <School className="w-4 h-4 text-emerald-700" />
              <span>২. মৌলিক পরিচিতি ও কোডসমূহ</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">বিদ্যালয়ের নাম (বাংলায়) *</label>
                <input
                  type="text"
                  required
                  name="nameBn"
                  value={formData.nameBn}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">বিদ্যালয়ের নাম (ইংরেজিতে) *</label>
                <input
                  type="text"
                  required
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">EIIN নম্বর *</label>
                <input
                  type="text"
                  required
                  name="eiin"
                  value={formData.eiin}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">এমপিও কোড (MPO Code)</label>
                <input
                  type="text"
                  name="mpoCode"
                  value={formData.mpoCode}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">বিদ্যালয় কোড (School Code)</label>
                <input
                  type="text"
                  name="schoolCode"
                  value={formData.schoolCode || '4320'}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">শিক্ষা বোর্ড (Education Board)</label>
                <input
                  type="text"
                  name="boardBn"
                  value={formData.boardBn || 'কুমিল্লা শিক্ষাবোর্ড'}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">প্রতিষ্ঠাকাল ও স্বীকৃতি</label>
                <input
                  type="text"
                  name="foundationDate"
                  value={formData.foundationDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">রাস্তা / সড়ক পরিচিতি (বাংলা)</label>
                <input
                  type="text"
                  name="roadBn"
                  value={formData.roadBn || 'ফেনী-পরশুরাম রোড সংলগ্ন'}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">মূল প্রতিপাদ্য / স্লোগান (Motto)</label>
                <input
                  type="text"
                  name="mottoBn"
                  value={formData.mottoBn || 'জ্ঞানই আলো, শিক্ষাই শক্তি'}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block font-bold text-slate-700 mb-1">পূর্ণাঙ্গ প্রাতিষ্ঠানিক ঠিকানা *</label>
                <input
                  type="text"
                  required
                  name="addressBn"
                  value={formData.addressBn}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Vision, Mission & Core Values (Updated with Comilla Board Model Institution) */}
          <div className="bg-emerald-50/50 p-5 sm:p-6 rounded-2xl border border-emerald-100 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-emerald-200 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-800" />
                <span>৩. রূপকল্প (Vision), লক্ষ্য (Mission) ও মূল আদর্শ (Core Values)</span>
              </span>
              <span className="text-[10px] text-emerald-800 bg-emerald-200/80 font-bold px-2 py-0.5 rounded">
                কুমিল্লা বোর্ড আদর্শ মডেল বিদ্যালয়
              </span>
            </h3>

            <div className="space-y-4">
              {/* Vision */}
              <div>
                <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-700" />
                  <span>আমাদের রূপকল্প (Our Vision - বাংলা) *</span>
                </label>
                <textarea
                  rows="2"
                  required
                  name="visionBn"
                  value={formData.visionBn || 'একটি বৈষম্যহীন, আধুনিক প্রযুক্তি-নির্ভর ও আদর্শ বিদ্যাপীঠ হিসেবে কুমিল্লা শিক্ষা বোর্ডের অন্যতম শ্রেষ্ঠ ও মডেল বিদ্যালয়ে রূপান্তরিত হওয়া।'}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                  placeholder="কুমিল্লা বোর্ডের আওতায় শ্রেষ্ঠ মডেল প্রতিষ্ঠান হওয়ার রূপকল্প..."
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Our Vision (English)</label>
                <input
                  type="text"
                  name="visionEn"
                  value={formData.visionEn || 'To emerge as one of the premier model institutions under the Comilla Education Board, fostering discrimination-free, technology-driven, and holistic moral education.'}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 bg-white font-mono"
                />
              </div>

              {/* Mission */}
              <div>
                <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-700" />
                  <span>আমাদের লক্ষ্য (Our Mission - বাংলা) *</span>
                </label>
                <textarea
                  rows="2"
                  required
                  name="missionBn"
                  value={formData.missionBn || 'মানসম্মত শিক্ষা, নৈতিক মূল্যবোধ ও ডিজিটাল প্রযুক্তির সমন্বয়ে প্রতিটি শিক্ষার্থীকে আধুনিক বিজ্ঞানমনস্ক, দেশপ্রেমিক ও দক্ষ মানবসম্পদ হিসেবে গড়ে তোলা।'}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                ></textarea>
              </div>

              {/* Core Values */}
              <div>
                <label className="block font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-700" />
                  <span>মূল আদর্শ (Core Values - বাংলা)</span>
                </label>
                <input
                  type="text"
                  name="coreValuesBn"
                  value={formData.coreValuesBn || 'শৃঙ্খলা, সততা, সহমর্মিতা, বিজ্ঞানচেতনা এবং মাতৃভূমির সার্বিক উন্নয়নে অবদান রাখার চিরন্তন ব্রত।'}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Contact & Social Links */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b mb-4 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-700" />
              <span>৪. যোগাযোগ ও সোশ্যাল মিডিয়া হাব</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">প্রধান প্রাতিষ্ঠানিক মোবাইল</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">বিকল্প মোবাইল নম্বর</label>
                <input
                  type="text"
                  name="phoneAlt"
                  value={formData.phoneAlt || '+880 1712-893042'}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">অফিসিয়াল ইমেইল ঠিকানা</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 font-mono"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block font-bold text-slate-700 mb-1">অফিসিয়াল ফেসবুক গ্রুপ লিংক (Official FB Group)</label>
                <input
                  type="url"
                  name="facebookGroupUrl"
                  value={formData.facebookGroupUrl}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 font-mono text-blue-700"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Campus Photograph Upload */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-700" />
                <span>৫. ক্যাম্পাস পরিচিতি ছবি (Campus Header Photo)</span>
              </span>
              <span className="text-[10px] text-slate-500">About সেকশনে প্রদর্শিত</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-full sm:w-48 h-28 rounded-xl bg-slate-200 overflow-hidden shadow border border-slate-300 shrink-0">
                <img
                  src={formData.campusImage || "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80"}
                  alt="Campus Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 flex-1">
                <p className="font-bold text-slate-800 text-xs">
                  বিদ্যালয় ভবনের সুদৃশ্য ক্যাম্পাস ছবি আপলোড করুন
                </p>
                <p className="text-[11px] text-slate-500">
                  সর্বোচ্চ ১০ মেগাবাইট পর্যন্ত ছবি নির্বাচন করতে পারবেন। সিস্টেম স্বয়ংক্রিয়ভাবে হাই ডেফিনিশনে অপ্টিমাইজ করবে।
                </p>

                <div>
                  <input
                    ref={campusInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCampusFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => campusInputRef.current?.click()}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-300" />
                    <span>নতুন ক্যাম্পাস ছবি আপলোড</span>
                  </button>
                </div>

                {campusUploadStatus && (
                  <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 pt-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{campusUploadStatus}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 6: Leadership Messages */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b mb-4 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <span>৬. প্রধান শিক্ষক ও পরিচালনা পর্ষদ সভাপতির বাণী</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Headmaster */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs pb-1 border-b">
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  <span>ভারপ্রাপ্ত প্রধান শিক্ষকের পরিচিতি ও বাণী</span>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ভারপ্রাপ্ত প্রধান শিক্ষকের নাম *</label>
                  <input
                    type="text"
                    required
                    name="headmasterNameBn"
                    value={formData.headmasterNameBn}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">বাণী (বাংলায়)</label>
                  <textarea
                    rows="5"
                    name="headmasterMessageBn"
                    value={formData.headmasterMessageBn}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 p-2.5 bg-white leading-relaxed"
                  ></textarea>
                </div>
              </div>

              {/* Chairman */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs pb-1 border-b">
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  <span>পরিচালনা পর্ষদের সভাপতির পরিচিতি ও বাণী</span>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">সভাপতির নাম</label>
                  <input
                    type="text"
                    name="chairmanNameBn"
                    value={formData.chairmanNameBn || 'আলহাজ্ব মো. মজিবুর রহমান'}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">বাণী (বাংলায়)</label>
                  <textarea
                    rows="5"
                    name="chairmanMessageBn"
                    value={formData.chairmanMessageBn || ''}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 p-2.5 bg-white leading-relaxed"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-4 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm border border-emerald-300">
              <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>প্রতিষ্ঠান সেটিংস, লোগো ও রূপকল্প সফলভাবে আপডেট ও সংরক্ষিত হয়েছে! ওয়েবসাইটের সর্বত্র তা কার্যকর হয়েছে।</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                if (confirm('সতর্কতা: আপনি কি নিশ্চিত যে সকল কাস্টম ডেটা মুছে ডিফল্ট সেটিংসে ফিরে যেতে চান?')) {
                  resetToDefaults();
                }
              }}
              className="text-rose-600 hover:text-rose-800 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>সকল ডেটা ফ্যাক্টরি রিসেট করুন (Reset to Defaults)</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>পরিবর্তন সংরক্ষণ ও ওয়েবসাইটে প্রকাশ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
