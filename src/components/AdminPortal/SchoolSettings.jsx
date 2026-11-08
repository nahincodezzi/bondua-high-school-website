import React, { useState, useRef } from 'react';
import { useSchool } from '../../context/useSchool';
import { getSchoolLogo, DEFAULT_SCHOOL_LOGO } from '../../utils/branding';
import { initialSchoolInfo } from '../../data/initialData';
import SetupWizardModal from './SetupWizardModal';
import { 
  Save, 
  CheckCircle, 
  School, 
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  UserCheck
} from 'lucide-react';

export default function SchoolSettings() {
  const { schoolInfo, setSchoolInfo, updateSchoolSettings, resetToDefaults, resetToBlankTemplate, authUser } = useSchool();
  const [formData, setFormData] = useState(() => {
    const info = { ...schoolInfo };
    const currentLogo = getSchoolLogo(info);
    info.schoolLogo = currentLogo;
    info.logo = currentLogo;
    info.logos = {
      emerald: { onDark: currentLogo, onLight: currentLogo },
      indigo: { onDark: currentLogo, onLight: currentLogo },
    };
    return info;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [logoUploadStatus, setLogoUploadStatus] = useState('');
  const [campusUploadStatus, setCampusUploadStatus] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [resetError, setResetError] = useState('');
  const campusInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const [prevSchoolInfo, setPrevSchoolInfo] = useState(schoolInfo);
  if (schoolInfo !== prevSchoolInfo) {
    setPrevSchoolInfo(schoolInfo);
    const currentLogo = getSchoolLogo(schoolInfo);
    setFormData(prev => ({
      ...schoolInfo,
      ...prev,
      schoolLogo: prev.schoolLogo || currentLogo,
      logo: prev.schoolLogo || currentLogo,
      logos: {
        emerald: { onDark: prev.schoolLogo || currentLogo, onLight: prev.schoolLogo || currentLogo },
        indigo: { onDark: prev.schoolLogo || currentLogo, onLight: prev.schoolLogo || currentLogo },
      },
    }));
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Single School Logo Upload Handler
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLogoUploadStatus('ত্রুটি: শুধুমাত্র ছবি (PNG, JPG, WebP, SVG) ফাইল আপলোড করা যাবে।');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setLogoUploadStatus('ত্রুটি: লোগো ফাইলের আকার সর্বোচ্চ ৫ মেগাবাইট (5 MB) হতে পারবে।');
      return;
    }

    setLogoUploadStatus('লোগো প্রস্তুত ও অপ্টিমাইজ করা হচ্ছে...');
    const reader = new FileReader();

    reader.onload = (event) => {
      if (file.type === 'image/svg+xml') {
        const svgDataUrl = event.target.result;
        applySingleLogo(svgDataUrl);
        return;
      }

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 512;
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

        const outputDataUrl = canvas.toDataURL('image/png', 0.92);
        applySingleLogo(outputDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const applySingleLogo = (dataUrl) => {
    const mirroredLogos = {
      emerald: { onDark: dataUrl, onLight: dataUrl },
      indigo: { onDark: dataUrl, onLight: dataUrl },
    };
    setFormData(prev => ({
      ...prev,
      schoolLogo: dataUrl,
      logo: dataUrl,
      logos: mirroredLogos,
    }));
    setLogoUploadStatus('লোগো সফলভাবে যুক্ত হয়েছে (পরিবর্তন স্থায়ী করতে নিচে সংরক্ষণ করুন)');
  };

  const handleResetDefaultLogo = () => {
    const defaultLogo = DEFAULT_SCHOOL_LOGO;
    const mirroredLogos = {
      emerald: { onDark: defaultLogo, onLight: defaultLogo },
      indigo: { onDark: defaultLogo, onLight: defaultLogo },
    };
    setFormData(prev => ({
      ...prev,
      schoolLogo: defaultLogo,
      logo: defaultLogo,
      logos: mirroredLogos,
    }));
    setLogoUploadStatus('ডিফল্ট প্রাতিষ্ঠানিক লোগো পুনরুদ্ধার করা হয়েছে');
  };

  // Handle Campus Photo Upload
  const handleCampusFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setCampusUploadStatus('ত্রুটি: ক্যাম্পাস ছবির আকার সর্বোচ্চ ১০ মেগাবাইট হতে পারবে।');
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
    if (updateSchoolSettings) {
      updateSchoolSettings(formData);
    } else {
      setSchoolInfo(formData);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-bangla text-ink">
            প্রতিষ্ঠান তথ্য, থিম লোগো ও সফটওয়্যার সেটিংস (School Settings)
          </h2>
          <p className="text-xs text-muted font-bangla mt-0.5">
            বিদ্যালয়ের নাম, থিম-ভিত্তিক লোগো, রূপকল্প, বাৎসরিক তথ্য ও কন্টাক্ট ইনফরমেশন CMS থেকে সরাসরি পরিচালনা করুন।
          </p>
        </div>

        {authUser?.role === 'superadmin' && (
          <button
            type="button"
            onClick={() => setShowWizardModal(true)}
            className="btn-accent px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4 text-ink" />
            <span>নতুন বিদ্যালয় সেটআপ উইজার্ড</span>
          </button>
        )}
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-line shadow-2xs space-y-6">
        <form onSubmit={handleSubmit} className="space-y-8 text-xs font-bangla">

          {/* Section 1: Single Centralized School Logo */}
          <div className="bg-bg p-5 sm:p-6 rounded-2xl border border-line space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
              <div>
                <h3 className="font-bold text-ink text-sm flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  <span>১. সার্বজনীন প্রাতিষ্ঠানিক লোগো (Single Centralized School Logo)</span>
                </h3>
                <p className="text-[11px] text-muted mt-0.5">
                  একটি লোগোই সমগ্র ওয়েবসাইটের হেডার, ফুটার, ব্রাউজার ট্যাব (ফেভিকন) এবং সকল প্রকার প্রিন্ট ডকুমেন্টে (মার্কশিট, রসিদ, প্রবেশপত্র, আইডি কার্ড, নোটিশ) স্বয়ংক্রিয়ভাবে ব্যবহৃত হবে। থিম পরিবর্তনে লোগো অপরিবর্তিত থাকবে।
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept=".png, .jpg, .jpeg, .webp, .svg"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="btn-accent px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>নতুন লোগো আপলোড করুন</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetDefaultLogo}
                  className="bg-line hover:bg-soft text-ink font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition cursor-pointer"
                  title="ডিফল্ট লোগোতে ফিরুন"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ডিফল্ট লোগো</span>
                </button>
              </div>
            </div>

            {/* Logo Preview Cards: Dark Context & Light / Print Context */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dark Context (Navbar & Dark Footer) */}
              <div className="p-4 bg-[#0B3D2E] rounded-xl text-white flex items-center justify-between gap-4 border border-white/10 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-16 h-16 rounded-full bg-white p-1 ring-2 ring-accent flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                    <img 
                      src={getSchoolLogo(formData)} 
                      alt="School Logo Dark Preview" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs block text-white">ডার্ক সারফেস প্রিভিউ (Dark Preview)</span>
                    <span className="text-[10px] text-white/80 block mt-0.5">ওয়েবসাইট হেডার, মোবাইল ড্রয়ার ও ফুটারে প্রদর্শন</span>
                    <span className="inline-block bg-white/20 text-accent text-[9px] font-mono px-2 py-0.5 rounded mt-1.5">
                      ✓ সক্রিয় প্রাতিষ্ঠানিক লোগো
                    </span>
                  </div>
                </div>
              </div>

              {/* Light Context (Print Documents, Marksheets, Receipts, Admit Cards, ID Cards) */}
              <div className="p-4 bg-white border border-line rounded-xl flex items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-16 h-16 rounded-full bg-white p-1 ring-2 ring-primary shadow-xs flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                    <img 
                      src={getSchoolLogo(formData)} 
                      alt="School Logo Light Preview" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs block text-ink">লাইট ও প্রিন্ট প্রিভিউ (Print & Light Preview)</span>
                    <span className="text-[10px] text-muted block mt-0.5">মার্কশিট, রসিদ, প্রবেশপত্র, আইডি কার্ড ও নোটিশ প্যাড</span>
                    <span className="inline-block bg-primary/10 text-primary text-[9px] font-mono px-2 py-0.5 rounded mt-1.5">
                      ✓ সর্বত্র একই লোগো সিঙ্ক হবে
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {logoUploadStatus && (
              <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                logoUploadStatus.startsWith('ত্রুটি') 
                  ? 'bg-danger-soft text-danger border border-danger-soft' 
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {logoUploadStatus.startsWith('ত্রুটি') ? (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                ) : (
                  <CheckCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{logoUploadStatus}</span>
              </div>
            )}
          </div>

          {/* Section 2: Basic Institutional Details & White-Label Fields */}
          <div>
            <h3 className="font-bold text-ink text-sm pb-2 border-b mb-4 flex items-center gap-2">
              <School className="w-4 h-4 text-primary" />
              <span>২. মৌলিক পরিচিতি, কোড ও শিরোনামসমূহ</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-ink mb-1">বিদ্যালয়ের নাম (বাংলায়) *</label>
                <input
                  type="text"
                  required
                  name="nameBn"
                  value={formData.nameBn || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">School Name (English) *</label>
                <input
                  type="text"
                  required
                  name="nameEn"
                  value={formData.nameEn || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 font-sans"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">সংক্ষিপ্ত নাম (Short Name / Prefix)</label>
                <input
                  type="text"
                  name="shortName"
                  value={formData.shortName || 'BDHS'}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">হেডার সাব-টাইটেল (বাংলায় - ঐচ্ছিক)</label>
                <input
                  type="text"
                  name="headerSubtitleBn"
                  placeholder="ফাঁকা রাখলে ইংরেজি নাম প্রদর্শিত হবে"
                  value={formData.headerSubtitleBn || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Header Subtitle (English - Optional)</label>
                <input
                  type="text"
                  name="headerSubtitleEn"
                  placeholder="Leave empty to use Bangla name"
                  value={formData.headerSubtitleEn || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 font-sans"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">ডিফল্ট সাইট থিম (Default Theme)</label>
                <select
                  name="defaultTheme"
                  value={formData.defaultTheme || 'emerald'}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 font-semibold"
                >
                  <option value="emerald">এমারেল্ড গ্রিন (Emerald Prestige)</option>
                  <option value="indigo">রয়্যাল ইন্ডিগো (Royal Indigo & Amber)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">ভর্তি শিক্ষাবর্ষ (Admission Year)</label>
                <input
                  type="text"
                  name="admissionYear"
                  value={formData.admissionYear || '২০২৭'}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">বর্তমান একাডেমিক শিক্ষাবর্ষ (Academic Year)</label>
                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear || '2026'}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">EIIN নম্বর *</label>
                <input
                  type="text"
                  required
                  name="eiin"
                  value={formData.eiin || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">এমপিও কোড (MPO Code)</label>
                <input
                  type="text"
                  name="mpoCode"
                  value={formData.mpoCode || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">বিদ্যালয় কোড (School Code)</label>
                <input
                  type="text"
                  name="schoolCode"
                  value={formData.schoolCode || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">শিক্ষা বোর্ড (Education Board)</label>
                <input
                  type="text"
                  name="boardBn"
                  value={formData.boardBn || 'কুমিল্লা শিক্ষাবোর্ড'}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">প্রতিষ্ঠাকাল ও স্বীকৃতি</label>
                <input
                  type="text"
                  name="foundationDate"
                  value={formData.foundationDate || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Foundation Date (English)</label>
                <input
                  type="text"
                  name="foundationDateEn"
                  value={formData.foundationDateEn || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 font-sans"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">মূল বাণী / আদর্শ (বাংলায়)</label>
                <input
                  type="text"
                  name="mottoBn"
                  value={formData.mottoBn || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Institutional Motto (English)</label>
                <input
                  type="text"
                  name="mottoEn"
                  value={formData.mottoEn || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 font-sans"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Location and Contacts */}
          <div>
            <h3 className="font-bold text-ink text-sm pb-2 border-b mb-4 flex items-center gap-2">
              <School className="w-4 h-4 text-primary" />
              <span>৩. ভৌগোলিক অবস্থান ও যোগাযোগের তথ্য</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-bold text-ink mb-1">পূর্ণাঙ্গ ঠিকানা (বাংলায়) *</label>
                <input
                  type="text"
                  required
                  name="addressBn"
                  value={formData.addressBn || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-ink mb-1">Full Address (English) *</label>
                <input
                  type="text"
                  required
                  name="addressEn"
                  value={formData.addressEn || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 font-sans"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">হটলাইন / প্রধান ফোন নম্বর *</label>
                <input
                  type="text"
                  required
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">বিকল্প ফোন নম্বর (অফিস)</label>
                <input
                  type="text"
                  name="phoneAlt"
                  value={formData.phoneAlt || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">অফিশিয়াল ইমেইল *</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">ফেসবুক গ্রুপ / পেজ লিংক</label>
                <input
                  type="url"
                  name="facebookGroupUrl"
                  value={formData.facebookGroupUrl || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-ink mb-1">ফুটার পরিচিতি বক্তব্য (Footer About - বাংলা)</label>
                <textarea
                  rows={2}
                  name="footerAboutBn"
                  value={formData.footerAboutBn || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 leading-relaxed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-ink mb-1">Footer About Text (English)</label>
                <textarea
                  rows={2}
                  name="footerAboutEn"
                  value={formData.footerAboutEn || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 leading-relaxed font-sans"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Campus Photo */}
          <div className="bg-bg p-5 rounded-2xl border border-line space-y-4">
            <h3 className="font-bold text-ink text-sm pb-2 border-b flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                <span>৪. বিদ্যালয় ক্যাম্পাসের মূল ছবি (Homepage & About Campus Photo)</span>
              </span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-40 h-24 rounded-xl bg-white border border-line overflow-hidden shadow-xs shrink-0">
                <img
                  src={formData.campusImage || initialSchoolInfo.campusImage}
                  alt="Campus Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 flex-1 text-center sm:text-left">
                <p className="font-bold text-ink text-xs">হোমপেজ ও পরিচিতি সেকশনের প্রধান ক্যাম্পাস ফটো</p>
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
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>নতুন ক্যাম্পাস ছবি আপলোড করুন</span>
                </button>
                {campusUploadStatus && (
                  <p className="text-[11px] text-primary font-bold">{campusUploadStatus}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Statements (Headmaster & Chairman) */}
          <div className="space-y-6">
            <h3 className="font-bold text-ink text-sm pb-2 border-b flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-primary" />
              <span>৫. প্রধান শিক্ষক ও সভাপতি মহোদয়ের বাণী</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-ink mb-1">প্রধান শিক্ষকের নাম (বাংলায়)</label>
                <input
                  type="text"
                  name="headmasterNameBn"
                  value={formData.headmasterNameBn || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Headmaster Name (English)</label>
                <input
                  type="text"
                  name="headmasterNameEn"
                  value={formData.headmasterNameEn || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 font-sans"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-ink mb-1">প্রধান শিক্ষকের বাণী (বাংলায়)</label>
                <textarea
                  rows={4}
                  name="headmasterMessageBn"
                  value={formData.headmasterMessageBn || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 leading-relaxed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-ink mb-1">Headmaster's Message (English)</label>
                <textarea
                  rows={4}
                  name="headmasterMessageEn"
                  value={formData.headmasterMessageEn || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-line p-2.5 leading-relaxed font-sans"
                />
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {savedSuccess && (
            <div className="p-4 bg-soft text-deep rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm border border-soft-border">
              <CheckCircle className="w-5 h-5 text-primary shrink-0" />
              <span>প্রতিষ্ঠান সেটিংস, লোগো ও রূপকল্প সফলভাবে সংরক্ষিত হয়েছে! ওয়েবসাইটের সর্বত্র তা কার্যকর হয়েছে।</span>
            </div>
          )}

          {/* Form Actions & Danger Zone */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
            {authUser?.role === 'superadmin' ? (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowWizardModal(true)}
                  className="text-primary hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>নতুন স্কুল উইজার্ড (Use as Blank Template)</span>
                </button>
                <span className="text-muted">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setResetConfirmText('');
                    setResetError('');
                    setShowResetModal(true);
                  }}
                  className="text-danger hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-danger" />
                  <span>ফ্যাক্টরি রিসেট</span>
                </button>
              </div>
            ) : (
              <div className="text-xs text-muted">
                * সেটিংস পরিবর্তন শুধুমাত্র অনুমোদিত কর্মকর্তা করতে পারবেন।
              </div>
            )}

            <button
              type="submit"
              className="w-full sm:w-auto btn-primary py-3.5 px-8 rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-white" />
              <span>পরিবর্তন সংরক্ষণ ও ওয়েবসাইটে প্রকাশ করুন</span>
            </button>
          </div>
        </form>

        {/* SuperAdmin Factory Reset Security Modal */}
        {showResetModal && (
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-danger-soft shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-danger">
                <div className="w-10 h-10 rounded-full bg-danger-soft flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-danger" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">ফ্যাক্টরি রিসেট নিশ্চিতকরণ</h3>
                  <p className="text-xs text-muted">এটি আপনার সকল কাস্টম তথ্য চিরতরে মুছে দেবে</p>
                </div>
              </div>

              <div className="bg-warning-soft p-3 rounded-lg border border-accent text-xs text-warning leading-relaxed">
                সতর্কতা: ফ্যাক্টরি রিসেট সম্পন্ন হলে সকল শিক্ষার্থী, ফলাফল, ভর্তি আবেদন এবং সেটিংস ডিফল্ট অবস্থায় ফিরে যাবে।
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">
                  নিশ্চিত করতে নিচে ইংরেজিতে <strong>RESET</strong> লিখুন:
                </label>
                <input
                  type="text"
                  value={resetConfirmText}
                  onChange={(e) => {
                    const val = e.target.value;
                    setResetConfirmText(val);
                    if (val && val.trim().toUpperCase() !== 'RESET') {
                      setResetError('সঠিকভাবে বড় হাতের অক্ষরে "RESET" লিখুন।');
                    } else {
                      setResetError('');
                    }
                  }}
                  placeholder="RESET"
                  className="w-full rounded-lg border border-line p-2.5 font-mono text-xs font-bold text-ink bg-bg uppercase"
                />
                {resetError && (
                  <p className="text-danger text-xs mt-1 font-semibold">{resetError}</p>
                )}
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 bg-bg hover:bg-soft text-ink py-2 rounded-lg text-xs font-bold transition border border-line cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="button"
                  disabled={resetConfirmText.trim() !== 'RESET'}
                  onClick={() => {
                    if (resetConfirmText.trim() !== 'RESET') {
                      setResetError('দয়া করে সঠিকভাবে "RESET" লিখুন।');
                      return;
                    }
                    const success = resetToDefaults('RESET');
                    if (success) {
                      setShowResetModal(false);
                    }
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                    resetConfirmText.trim() === 'RESET' 
                      ? 'btn-danger cursor-pointer' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  রিসেট সম্পন্ন করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Setup Wizard Modal for new-school onboarding */}
        <SetupWizardModal
          isOpen={showWizardModal}
          onClose={() => setShowWizardModal(false)}
          onApply={(wizardData) => {
            if (resetToBlankTemplate) {
              resetToBlankTemplate(wizardData);
              setSavedSuccess(true);
              setTimeout(() => setSavedSuccess(false), 3500);
            }
          }}
        />
      </div>
    </div>
  );
}
