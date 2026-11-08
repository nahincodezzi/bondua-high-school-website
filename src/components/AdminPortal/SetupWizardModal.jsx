import React, { useState, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  School, 
  Upload, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';

export default function SetupWizardModal({ isOpen, onClose, onApply }) {
  const [formData, setFormData] = useState(() => ({
    nameBn: '',
    nameEn: '',
    shortName: '',
    eiin: '',
    mpoCode: '',
    established: '2026',
    addressBn: '',
    addressEn: '',
    phone: '',
    email: '',
    defaultTheme: 'emerald',
    schoolLogo: null,
    logo: null,
  }));

  const [confirmStep, setConfirmStep] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setFormData(prev => ({ ...prev, schoolLogo: dataUrl, logo: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!confirmStep) {
      setConfirmStep(true);
      return;
    }
    onApply(formData);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />

      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-line shadow-2xl relative max-h-[90vh] flex flex-col font-bangla">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-sm">
              <School className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-ink flex items-center gap-1.5">
                <span>নতুন বিদ্যালয় সেটআপ উইজার্ড</span>
                <span className="text-[10px] bg-soft text-primary font-bold px-2 py-0.5 rounded-full border border-soft-border">White-Label</span>
              </h3>
              <p className="text-xs text-muted">
                যেকোনো নতুন শিক্ষাপ্রতিষ্ঠানের তথ্য দিয়ে মুহূর্তেই এই সিস্টেমটি চালু করুন।
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-bg text-muted hover:text-ink cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmStep ? (
          <div className="py-6 space-y-4">
            <div className="p-4 bg-warning-soft border border-accent/40 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-warning shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-ink">আপনি কি নতুন বিদ্যালয়ের তথ্যে রূপান্তর নিশ্চিত করছেন?</p>
                <p className="text-muted leading-relaxed">
                  বর্তমান স্কুলের নাম, ইআইআইএন, লোগো এবং মৌলিক সেটিংস পরিবর্তন হয়ে <strong>"{formData.nameBn || formData.nameEn}"</strong> হিসেবে প্রতিস্থাপিত হবে।
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => setConfirmStep(false)}
                className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                ফিরে যান
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>হ্যাঁ, কনফিগারেশন প্রয়োগ করুন</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 space-y-5 py-4 pr-1 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-ink mb-1">বিদ্যালয়ের নাম (বাংলায়) *</label>
                <input
                  type="text"
                  required
                  name="nameBn"
                  placeholder="যেমন: আনন্দপুর আদর্শ উচ্চ বিদ্যালয়"
                  value={formData.nameBn}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-line p-2.5 bg-bg focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">School Name (English) *</label>
                <input
                  type="text"
                  required
                  name="nameEn"
                  placeholder="e.g. Anandapur Ideal High School"
                  value={formData.nameEn}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-line p-2.5 bg-bg focus:bg-white font-sans"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">সংক্ষিপ্ত নাম (Short Name / Code) *</label>
                <input
                  type="text"
                  required
                  name="shortName"
                  placeholder="e.g. AIHS"
                  value={formData.shortName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-line p-2.5 bg-bg focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">EIIN নম্বর *</label>
                <input
                  type="text"
                  required
                  name="eiin"
                  placeholder="e.g. 106000"
                  value={formData.eiin}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-line p-2.5 bg-bg focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">প্রতিষ্ঠা সাল</label>
                <input
                  type="number"
                  name="established"
                  value={formData.established}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-line p-2.5 bg-bg focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">ডিফল্ট কালার থিম</label>
                <select
                  name="defaultTheme"
                  value={formData.defaultTheme}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-line p-2.5 bg-bg focus:bg-white"
                >
                  <option value="emerald">এমারেল্ড গ্রিন (Emerald Prestige)</option>
                  <option value="indigo">রয়্যাল ইন্ডিগো (Royal Indigo & Amber)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-ink mb-1">ঠিকানা (বাংলায়)</label>
                <input
                  type="text"
                  name="addressBn"
                  placeholder="উপজেলা, জেলা, বাংলাদেশ"
                  value={formData.addressBn}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-line p-2.5 bg-bg focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-ink mb-1">Address (English)</label>
                <input
                  type="text"
                  name="addressEn"
                  placeholder="Upazila, District, Bangladesh"
                  value={formData.addressEn}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-line p-2.5 bg-bg focus:bg-white font-sans"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">মোবাইল / হটলাইন</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+880 1800-000000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-line p-2.5 bg-bg focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">ইমেইল ঠিকানা</label>
                <input
                  type="email"
                  name="email"
                  placeholder="school@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-line p-2.5 bg-bg focus:bg-white font-mono"
                />
              </div>

              {/* Logo Upload Slot */}
              <div className="sm:col-span-2 p-3 bg-bg rounded-2xl border border-line flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white p-1 ring-2 ring-primary flex items-center justify-center overflow-hidden shrink-0">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <School className="w-6 h-6 text-muted" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-ink block text-xs">প্রতিষ্ঠানের লোগো (ঐচ্ছিক)</span>
                    <span className="text-[11px] text-muted">একটি লোগো দিলে তা স্বয়ংক্রিয়ভাবে উভয় থিমে ব্যবহৃত হবে</span>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{formData.logo ? 'পরিবর্তন করুন' : 'ছবি নির্বাচন'}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-line">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span>পরবর্তী ধাপ</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
