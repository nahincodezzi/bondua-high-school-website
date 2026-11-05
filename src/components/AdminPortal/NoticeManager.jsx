import React, { useState, useRef } from 'react';
import { useSchool } from '../../context/useSchool';
import { getDhakaDateString, formatBanglaDate, toBanglaNumerals } from '../../utils/dateFormatter';
import { 
  Bell, 
  Trash2, 
  CheckCircle,
  Paperclip,
  FileText,
  X,
  Upload,
  Edit2,
  Calendar,
  Save
} from 'lucide-react';

export default function NoticeManager() {
  const { notices, addNotice, updateNotice, deleteNotice } = useSchool();

  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [category, setCategory] = useState('academic');
  const [publishDate, setPublishDate] = useState(getDhakaDateString());
  const [contentBn, setContentBn] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [fileAttachment, setFileAttachment] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [success, setSuccess] = useState('');

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

  const startEdit = (notice) => {
    setEditingNoticeId(notice.id);
    setTitleBn(notice.titleBn || '');
    setTitleEn(notice.titleEn || '');
    setCategory(notice.category || 'academic');
    setPublishDate(notice.date || notice.publishDate || getDhakaDateString());
    setContentBn(notice.contentBn || '');
    setIsUrgent(Boolean(notice.isUrgent));
    setFileAttachment(notice.fileUrl || '');
    setFileName(notice.fileName || '');
    setUploadStatus(notice.fileName ? 'বিদ্যমান ফাইল সংযুক্ত' : '');
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingNoticeId(null);
    setTitleBn('');
    setTitleEn('');
    setCategory('academic');
    setPublishDate(getDhakaDateString());
    setContentBn('');
    setIsUrgent(false);
    setFileAttachment('');
    setFileName('');
    setUploadStatus('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titleBn.trim() || !contentBn.trim()) return;

    if (editingNoticeId) {
      // Edit existing notice (A11)
      if (updateNotice) {
        updateNotice(editingNoticeId, {
          titleBn,
          titleEn: titleEn || titleBn,
          category,
          date: publishDate,
          publishDate: publishDate,
          contentBn,
          contentEn: contentBn,
          isUrgent,
          fileUrl: fileAttachment || '#',
          fileName: fileName || ''
        });
      }
      setSuccess('নোটিশটি সফলভাবে হালনাগাদ (Edit) করা হয়েছে!');
    } else {
      // Add new notice
      addNotice({
        titleBn,
        titleEn: titleEn || titleBn,
        category,
        date: publishDate,
        publishDate: publishDate,
        contentBn,
        contentEn: contentBn,
        isUrgent,
        fileUrl: fileAttachment || '#',
        fileName: fileName || ''
      });
      setSuccess('নতুন নোটিশটি সফলভাবে নোটিশ বোর্ডে প্রকাশিত হয়েছে!');
    }

    cancelEdit();
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-bangla text-[#1F2937]">
          নোটিশ বোর্ড ও ফাইল আপলোড ব্যবস্থাপনা (Notice Publisher)
        </h2>
        <p className="text-xs text-[#4B5563] font-bangla">
          বিদ্যালয়ের পাবলিক নোটিশ বোর্ডে নতুন নোটিশ, সার্কুলার ও পিডিএফ/ছবি ফাইল সরাসরি প্রকাশ বা সম্পাদনা করুন
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Publish/Edit Form */}
        <div className="lg:col-span-5 card-base bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
            <h3 className="font-bold font-bangla text-[#1F2937] text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#166534]" />
              <span>{editingNoticeId ? 'নোটিশ সম্পাদনা করুন' : 'নতুন নোটিশ প্রকাশ ও ফাইল আপলোড'}</span>
            </h3>
            {editingNoticeId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-xs font-semibold text-[#DC2626] hover:underline cursor-pointer"
              >
                বাতিল করুন
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-bangla">
            <div>
              <label className="block font-bold text-slate-700 mb-1">নোটিশের শিরোনাম (বাংলায়) *</label>
              <input
                type="text"
                required
                value={titleBn}
                onChange={(e) => setTitleBn(e.target.value)}
                placeholder="যেমন: ২০২৭ সালের এসএসসি নির্বাচনী পরীক্ষার সময়সূচি প্রকাশ..."
                className="w-full rounded-lg border border-[#D1D5DB] p-2.5 bg-[#F7F9F8] text-[#1F2937] focus:ring-2 focus:ring-[#166534] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">নোটিশের শিরোনাম (ইংরেজিতে)</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Notice title in English"
                className="w-full rounded-lg border border-[#D1D5DB] p-2.5 bg-[#F7F9F8] text-[#1F2937] focus:ring-2 focus:ring-[#166534] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">বিভাগ (Category)</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-[#D1D5DB] p-2.5 bg-[#F7F9F8] text-[#1F2937] focus:ring-2 focus:ring-[#166534] focus:outline-none"
                >
                  <option value="academic">অ্যাকাডেমিক (Academic)</option>
                  <option value="exam">পরীক্ষা ও ফলাফল (Examinations)</option>
                  <option value="admission">ভর্তি সংক্রান্ত (Admission)</option>
                  <option value="event">অনুষ্ঠান ও ছুটি (Events & Holidays)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">প্রকাশের তারিখ *</label>
                <input
                  type="date"
                  required
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full rounded-lg border border-[#D1D5DB] p-2.5 bg-[#F7F9F8] text-[#1F2937] focus:ring-2 focus:ring-[#166534] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">নোটিশের বিস্তারিত বিবরণ *</label>
              <textarea
                required
                rows="4"
                value={contentBn}
                onChange={(e) => setContentBn(e.target.value)}
                placeholder="নোটিশের পূর্ণাঙ্গ বিবরণ ও নির্দেশনাবলী লিখুন..."
                className="w-full rounded-lg border border-[#D1D5DB] p-2.5 bg-[#F7F9F8] text-[#1F2937] focus:ring-2 focus:ring-[#166534] focus:outline-none leading-relaxed"
              ></textarea>
            </div>

            {/* Document / Photo File Attachment Upload */}
            <div className="p-3 bg-[#F7F9F8] rounded-xl border border-dashed border-[#D1D5DB] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-[#166534]" />
                  <span>অফিসিয়াল ডকুমেন্ট / ফাইল আপলোড (ঐচ্ছিক)</span>
                </span>
                {fileName && (
                  <button
                    type="button"
                    onClick={removeAttachment}
                    className="text-[#DC2626] hover:underline text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
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
                <div className="flex items-center gap-2 p-2 bg-[#DCFCE7] border border-emerald-300 rounded-lg text-[#14532D]">
                  <FileText className="w-4 h-4 text-[#166534] shrink-0" />
                  <span className="font-mono text-[11px] truncate">{fileName}</span>
                  <span className="text-[10px] font-bold text-[#166534] ml-auto shrink-0">সংযুক্ত</span>
                </div>
              ) : (
                <label
                  htmlFor="notice-file-upload"
                  className="cursor-pointer flex items-center justify-center gap-2 p-2.5 bg-white hover:bg-slate-50 border border-[#D1D5DB] rounded-lg text-slate-700 font-semibold transition"
                >
                  <Upload className="w-4 h-4 text-[#166534]" />
                  <span>পিডিএফ বা ছবি নির্বাচন করুন</span>
                </label>
              )}

              {uploadStatus && (
                <p className="text-[10px] text-[#166534] font-medium">{uploadStatus}</p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="urgent-check"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="rounded border-[#D1D5DB] text-[#DC2626] focus:ring-red-500"
              />
              <label htmlFor="urgent-check" className="font-semibold text-[#DC2626] cursor-pointer">
                জরুরি নোটিশ হিসেবে চিহ্নিত করুন (ব্রেকিং টিকারে প্রদর্শিত হবে)
              </label>
            </div>

            {success && (
              <div className="p-3 bg-[#DCFCE7] text-[#14532D] rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-300">
                <CheckCircle className="w-4 h-4 text-[#166534]" />
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full btn-primary py-2.5 rounded-lg text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {editingNoticeId ? <Save className="w-4 h-4 text-white" /> : <Bell className="w-4 h-4 text-white" />}
              <span>{editingNoticeId ? 'পরিবর্তন সংরক্ষণ করুন' : 'নোটিশ প্রকাশ করুন'}</span>
            </button>
          </form>
        </div>

        {/* Existing Notices List with Edit and Delete options (A11) */}
        <div className="lg:col-span-7 card-base bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3 font-bangla">
          <h3 className="font-bold text-[#1F2937] text-sm pb-2 border-b border-[#E5E7EB] flex justify-between items-center">
            <span>বর্তমানে প্রকাশিত নোটিশসমূহ ({lang === 'bn' ? toBanglaNumerals(notices.length) : notices.length} টি)</span>
          </h3>

          <div className="space-y-3 max-h-[560px] overflow-y-auto">
            {notices.map((n) => (
              <div
                key={n.id}
                className="p-3.5 bg-[#F7F9F8] rounded-xl border border-[#E5E7EB] text-xs space-y-2 flex items-start justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {n.isUrgent && (
                      <span className="badge-danger text-[10px] px-1.5 py-0.5 rounded">
                        জরুরি
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-mono text-[#166534] text-[11px] font-semibold">
                      <Calendar className="w-3 h-3 text-[#166534]" />
                      <span>{formatBanglaDate(n.date || n.publishDate, 'bn')}</span>
                    </span>
                    <span className="badge-neutral text-[10px] px-1.5 py-0.5 rounded capitalize">
                      {n.category}
                    </span>
                    {n.fileUrl && n.fileUrl !== '#' && (
                      <span className="bg-[#DCFCE7] text-[#14532D] text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
                        <Paperclip className="w-2.5 h-2.5 text-[#166534]" />
                        <span>ফাইল সংযুক্ত</span>
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-[#1F2937] mt-1 text-sm">{n.titleBn}</h4>
                  <p className="text-[#4B5563] line-clamp-2 mt-0.5 leading-relaxed">{n.contentBn}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0 pt-1">
                  {/* Edit Notice Button (A11) */}
                  <button
                    onClick={() => startEdit(n)}
                    className="p-2 text-[#166534] hover:bg-[#DCFCE7] rounded-lg transition cursor-pointer"
                    title="নোটিশ সম্পাদনা করুন"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete Notice Button */}
                  <button
                    onClick={() => {
                      if (confirm(`আপনি কি "${n.titleBn}" নোটিশটি মুছে ফেলতে চান?`)) {
                        deleteNotice(n.id);
                      }
                    }}
                    className="p-2 text-[#DC2626] hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
