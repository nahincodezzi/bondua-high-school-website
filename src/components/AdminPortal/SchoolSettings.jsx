import React, { useState } from 'react';
import { useSchool } from '../../context/useSchool';
import { 
  Save, 
  CheckCircle, 
  School, 
  Share2, 
  AlertTriangle
} from 'lucide-react';

export default function SchoolSettings() {
  const { schoolInfo, setSchoolInfo, resetToDefaults } = useSchool();
  const [formData, setFormData] = useState({ ...schoolInfo });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSchoolInfo(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-bangla text-slate-900">
          প্রতিষ্ঠান তথ্য ও সফটওয়্যার সেটিংস (School Settings)
        </h2>
        <p className="text-xs text-slate-500 font-bangla">
          বিদ্যালয়ের পরিচিতি, ফোন নম্বর, ইমেইল, ফেসবুক গ্রুপ লিংক এবং প্রধান শিক্ষকের বাণী আপডেট করুন
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-bangla">
          {/* Basic Institutional Details */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b mb-4 flex items-center gap-2">
              <School className="w-4 h-4 text-emerald-700" />
              <span>১. মৌলিক তথ্য ও পরিচয়</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="block font-bold text-slate-700 mb-1">এমপিও কোড</label>
                <input
                  type="text"
                  name="mpoCode"
                  value={formData.mpoCode}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">ঠিকানা *</label>
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

          {/* Contact & Social Links */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b mb-4 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-700" />
              <span>২. যোগাযোগ ও ফেসবুক গ্রুপ লিংক</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">প্রাতিষ্ঠানিক মোবাইল নম্বর</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ইমেইল ঠিকানা</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
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

          {/* Headmaster Message */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b mb-4">
              ৩. প্রধান শিক্ষকের বাণী
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">প্রধান শিক্ষকের নাম</label>
                <input
                  type="text"
                  name="headmasterNameBn"
                  value={formData.headmasterNameBn}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">বাণী (বাংলা)</label>
                <textarea
                  rows="4"
                  name="headmasterMessageBn"
                  value={formData.headmasterMessageBn}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 p-2.5"
                ></textarea>
              </div>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>প্রতিষ্ঠান সেটিংস সফলভাবে আপডেট ও সংরক্ষিত হয়েছে!</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                if (confirm('আপনি কি সকল ডেটা মুছে ডিফল্ট সেটিংসে ফিরে যেতে নিশ্চিত?')) {
                  resetToDefaults();
                }
              }}
              className="text-rose-600 hover:text-rose-800 font-bold text-xs flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>সকল ডেটা রিসেট করুন (Reset to Defaults)</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl text-xs transition shadow flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>পরিবর্তন সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
