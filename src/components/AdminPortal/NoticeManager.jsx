import React, { useState, useRef } from 'react';
import { useSchool } from '../../context/useSchool';
import { 
  Bell, 
  Trash2, 
  CheckCircle,
  Paperclip,
  FileText,
  X,
  Upload
} from 'lucide-react';

export default function NoticeManager() {
  const { notices, addNotice, deleteNotice } = useSchool();

  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [category, setCategory] = useState('academic');
  const [contentBn, setContentBn] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [fileAttachment, setFileAttachment] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('ফাইলের আকার সর্বোচ্চ ৫ মেগাবাইট (5MB) হতে পারবে।');
      return;
    }

    setUploadStatus('প্রসেসিং হচ্ছে...');
    setFileName(file.name);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_W = 1200;
          const MAX_H = 1600;
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
          setFileAttachment(compressed);
          setUploadStatus('ছবি সফলভাবে সংযুক্ত হয়েছে');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      // PDF or Document
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileAttachment(event.target.result);
        setUploadStatus('পিডিএফ/ডকুমেন্ট সফলভাবে সংযুক্ত হয়েছে');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachment = () => {
    setFileAttachment('');
    setFileName('');
    setUploadStatus('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titleBn.trim() || !contentBn.trim()) return;

    addNotice({
      titleBn,
      titleEn: titleEn || titleBn,
      category,
      contentBn,
      contentEn: contentBn,
      isUrgent,
      fileUrl: fileAttachment || '#',
      fileName: fileName || ''
    });

    setSuccess(true);
    setTitleBn('');
    setTitleEn('');
    setContentBn('');
    setIsUrgent(false);
    setFileAttachment('');
    setFileName('');
    setUploadStatus('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-bangla text-slate-900">
          নোটিশ বোর্ড ও ফাইল আপলোড ব্যবস্থাপনা (Notice Publisher)
        </h2>
        <p className="text-xs text-slate-500 font-bangla">
          বিদ্যালয়ের পাবলিক নোটিশ বোর্ডে নতুন নোটিশ, সার্কুলার ও পিডিএফ/ছবি ফাইল সরাসরি আপলোড করুন
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Publish Form */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold font-bangla text-slate-900 text-sm pb-2 border-b flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-800" />
            <span>নতুন নোটিশ প্রকাশ ও ফাইল আপলোড</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-bangla">
            <div>
              <label className="block font-bold text-slate-700 mb-1">নোটিশের শিরোনাম (বাংলায়) *</label>
              <input
                type="text"
                required
                value={titleBn}
                onChange={(e) => setTitleBn(e.target.value)}
                placeholder="যেমন: বার্ষিক পরীক্ষার রুটিন বা ছুটির বিজ্ঞপ্তি..."
                className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">নোটিশের শিরোনাম (ইংরেজিতে)</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Notice title in English"
                className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">বিভাগ (Category)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 bg-white"
              >
                <option value="academic">অ্যাকাডেমিক (Academic)</option>
                <option value="exam">পরীক্ষা ও ফলাফল (Examinations)</option>
                <option value="admission">ভর্তি সংক্রান্ত (Admission)</option>
                <option value="event">অনুষ্ঠান ও ছুটি (Events & Holidays)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">নোটিশের বিস্তারিত বিবরণ *</label>
              <textarea
                required
                rows="4"
                value={contentBn}
                onChange={(e) => setContentBn(e.target.value)}
                placeholder="নোটিশের পূর্ণাঙ্গ বিবরণ ও নির্দেশনাবলী লিখুন..."
                className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
              ></textarea>
            </div>

            {/* Document / Photo File Attachment Upload */}
            <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-emerald-800" />
                  <span>অফিসিয়াল ডকুমেন্ট / ফাইল আপলোড (ঐচ্ছিক)</span>
                </span>
                {fileName && (
                  <button
                    type="button"
                    onClick={removeAttachment}
                    className="text-rose-600 hover:text-rose-700 text-[10px] font-bold flex items-center gap-0.5"
                  >
                    <X className="w-3 h-3" />
                    <span>মুছুন</span>
                  </button>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="notice-file-upload"
              />

              {fileName ? (
                <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900">
                  <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-mono text-[11px] truncate">{fileName}</span>
                  <span className="text-[10px] font-bold text-emerald-700 ml-auto shrink-0">যুক্ত হয়েছে</span>
                </div>
              ) : (
                <label
                  htmlFor="notice-file-upload"
                  className="cursor-pointer flex items-center justify-center gap-2 p-3 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-600 font-semibold transition"
                >
                  <Upload className="w-4 h-4 text-emerald-800" />
                  <span>মোবাইল বা পিসি থেকে পিডিএফ বা ছবি নির্বাচন করুন</span>
                </label>
              )}

              {uploadStatus && (
                <p className="text-[10px] text-emerald-700 font-medium">{uploadStatus}</p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="urgent-check"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <label htmlFor="urgent-check" className="font-semibold text-rose-700 cursor-pointer">
                জরুরি নোটিশ হিসেবে মার্ক করুন (ব্রেকিং টিকার স্ক্রলারে শো করবে)
              </label>
            </div>

            {success && (
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>নোটিশটি সফলভাবে নোটিশ বোর্ডে প্রকাশিত হয়েছে!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4 text-amber-300" />
              <span>নোটিশ প্রকাশ করুন</span>
            </button>
          </form>
        </div>

        {/* Existing Notices List */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 font-bangla">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b flex justify-between items-center">
            <span>বর্তমানে প্রকাশিত নোটিশসমূহ ({notices.length} টি)</span>
          </h3>

          <div className="space-y-3 max-h-[560px] overflow-y-auto">
            {notices.map((n) => (
              <div
                key={n.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 flex items-start justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {n.isUrgent && (
                      <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.2 rounded">
                        জরুরি
                      </span>
                    )}
                    <span className="font-mono text-slate-400 text-[11px]">{n.date}</span>
                    <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded capitalize">
                      {n.category}
                    </span>
                    {n.fileUrl && n.fileUrl !== '#' && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-1 font-mono">
                        <Paperclip className="w-2.5 h-2.5" />
                        <span>ফাইল সংযুক্ত</span>
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-900 mt-1">{n.titleBn}</h4>
                  <p className="text-slate-600 line-clamp-2 mt-0.5">{n.contentBn}</p>
                </div>

                <button
                  onClick={() => {
                    if (confirm('আপনি কি এই নোটিশটি মুছে ফেলতে চান?')) {
                      deleteNotice(n.id);
                    }
                  }}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg shrink-0 transition"
                  title="Delete Notice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
