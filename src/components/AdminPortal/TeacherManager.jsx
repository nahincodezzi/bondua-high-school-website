import React, { useState, useRef } from 'react';
import { useSchool } from '../../context/useSchool';
import { createEducatorAvatar } from '../../utils/avatarGenerator';
import { 
  Plus, 
  Trash2, 
  Edit, 
  X,
  Search,
  Award,
  Briefcase,
  Upload,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export default function TeacherManager() {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useSchool();
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const defaultFormState = {
    nameBn: '',
    nameEn: '',
    designationBn: 'সহকারী শিক্ষক',
    designationEn: 'Assistant Teacher',
    subjectBn: '',
    subjectEn: '',
    qualification: '',
    category: 'faculty',
    phone: '',
    email: '',
    image: createEducatorAvatar({ initials: 'BD', role: 'faculty', designation: 'Assistant Teacher' })
  };

  const [formData, setFormData] = useState(defaultFormState);

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData(defaultFormState);
    setUploadStatus('');
    setShowModal(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTeacher(t);
    setFormData({
      ...t,
      category: t.category || (t.designationEn === 'Office Assistant' || t.designationBn?.includes('অফিস সহকারী') || t.designationEn?.includes('Peon') || t.designationEn?.includes('Guard') || t.designationEn?.includes('Aya') ? 'staff' : 'faculty')
    });
    setUploadStatus('');
    setShowModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('ছবির আকার সর্বোচ্চ ৫ মেগাবাইট (5MB) হতে পারবে।');
      return;
    }

    setUploadStatus('প্রসেসিং হচ্ছে...');
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target.result;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 720;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);

        setFormData(prev => ({
          ...prev,
          image: optimizedDataUrl
        }));
        setUploadStatus('ছবি সফলভাবে আপলোড হয়েছে!');
        setTimeout(() => setUploadStatus(''), 3000);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleResetAvatar = () => {
    const initials = (formData.nameEn || formData.nameBn || 'BD')
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    const avatar = createEducatorAvatar({
      initials: initials || 'BD',
      role: formData.category === 'staff' ? 'staff' : (formData.designationEn?.includes('Headmaster') ? 'headmaster' : 'faculty'),
      designation: formData.designationEn || 'Faculty Member',
      gender: formData.designationBn?.includes('আয়া') || formData.nameBn?.includes('আক্তার') || formData.nameBn?.includes('ছিদ্দিকা') || formData.nameBn?.includes('হাজেরা') ? 'female' : 'male'
    });
    setFormData(prev => ({
      ...prev,
      image: avatar
    }));
    setUploadStatus('অফিসিয়াল অবতারে রূপান্তর করা হয়েছে');
    setTimeout(() => setUploadStatus(''), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nameBn) return;

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, formData);
    } else {
      addTeacher({
        ...formData,
        id: `tea-${Date.now()}`
      });
    }
    setShowModal(false);
  };

  const filteredTeachers = teachers.filter(t => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      t.nameBn?.toLowerCase().includes(q) ||
      t.nameEn?.toLowerCase().includes(q) ||
      t.designationBn?.toLowerCase().includes(q) ||
      t.subjectBn?.toLowerCase().includes(q);

    const isStaff = 
      t.category === 'staff' || 
      t.designationEn === 'Office Assistant' || 
      t.designationBn?.includes('অফিস সহকারী') || 
      t.designationEn?.includes('Peon') || 
      t.designationEn?.includes('Guard') || 
      t.designationEn?.includes('Aya');

    const matchesCategory = 
      activeCategory === 'all' ||
      (activeCategory === 'staff' && isStaff) ||
      (activeCategory === 'faculty' && !isStaff);

    return matchesSearch && matchesCategory;
  });

  const staffCount = teachers.filter(t => 
    t.category === 'staff' || 
    t.designationEn === 'Office Assistant' || 
    t.designationBn?.includes('অফিস সহকারী') || 
    t.designationEn?.includes('Peon') || 
    t.designationEn?.includes('Guard') || 
    t.designationEn?.includes('Aya')
  ).length;

  const facultyCount = teachers.length - staffCount;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-bangla">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            শিক্ষক ও কর্মচারী পরিষদ ব্যবস্থাপনা (Faculty CMS)
          </h2>
          <p className="text-xs text-slate-500">
            শিক্ষক ও কর্মকর্তা-কর্মচারীদের তথ্য সংযোজন, পদবী, বিষয় ও যোগাযোগের তথ্য হালনাগাদ
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition shadow"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>নতুন শিক্ষক / কর্মচারী যোগ করুন</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 font-bangla text-xs">
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeCategory === 'all' ? 'bg-emerald-900 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            সকল ({teachers.length})
          </button>
          <button
            onClick={() => setActiveCategory('faculty')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
              activeCategory === 'faculty' ? 'bg-emerald-900 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>শিক্ষক পরিষদ ({facultyCount})</span>
          </button>
          <button
            onClick={() => setActiveCategory('staff')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
              activeCategory === 'staff' ? 'bg-emerald-900 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>কর্মচারীবৃন্দ ({staffCount})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="নাম, পদবী বা বিষয় দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Teachers Roster Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((t, index) => {
          const isHead = t.designationEn?.includes('Headmaster') && !t.designationEn?.includes('Assistant');
          const isStaff = t.category === 'staff' || t.designationEn?.includes('Peon') || t.designationEn?.includes('Guard') || t.designationEn?.includes('Aya');

          return (
            <div
              key={t.id}
              className={`bg-white rounded-2xl p-4 border transition flex flex-col justify-between shadow-2xs hover:shadow-md ${
                isHead ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <img
                    src={t.image}
                    alt={t.nameEn}
                    className="w-16 h-16 rounded-xl object-cover object-top border border-slate-200"
                    onError={(e) => {
                      e.currentTarget.src = createEducatorAvatar({
                        initials: (t.nameEn || t.nameBn || 'BD').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
                        role: isHead ? 'headmaster' : isStaff ? 'staff' : 'faculty',
                        designation: t.designationEn || 'Faculty Member'
                      });
                    }}
                  />
                  <span className="absolute -top-1.5 -left-1.5 bg-black/70 text-white text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                    #{index + 1}
                  </span>
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-bangla inline-block ${
                    isHead 
                      ? 'bg-amber-400 text-slate-950 font-extrabold' 
                      : isStaff 
                        ? 'bg-slate-100 text-slate-700' 
                        : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {t.designationBn}
                  </span>
                  <h4 className="text-sm font-bold font-bangla text-slate-900 truncate">
                    {t.nameBn}
                  </h4>
                  <p className="text-xs text-emerald-700 font-semibold font-bangla truncate">
                    {t.subjectBn}
                  </p>
                  <p className="text-[11px] text-slate-500 font-bangla truncate">
                    {t.qualification}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bangla">
                <span className="font-mono text-slate-500 text-[11px]">{t.phone}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    title="Edit Teacher"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`আপনি কি "${t.nameBn}" এর তথ্য মুছে ফেলতে চান?`)) {
                        deleteTeacher(t.id);
                      }
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Teacher"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4 font-bangla text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingTeacher ? 'শিক্ষক / কর্মচারীর তথ্য সম্পাদনা' : 'নতুন শিক্ষক / কর্মচারী সংযোজন ফরম'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">নাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: জনাব বাহার উদ্দিন ভূঁইয়া"
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">নাম (ইংরেজি) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. Bahar Uddin Bhuiyan"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 font-semibold"
                  >
                    <option value="faculty">শিক্ষক পরিষদ (Faculty)</option>
                    <option value="staff">কর্মচারী পরিষদ (Staff)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">পদবী (বাংলা)</label>
                  <input
                    type="text"
                    placeholder="ভারপ্রাপ্ত প্রধান শিক্ষক / সহকারী শিক্ষক"
                    value={formData.designationBn}
                    onChange={(e) => setFormData({ ...formData, designationBn: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">বিষয় / দায়িত্ব (বাংলা)</label>
                  <input
                    type="text"
                    placeholder="যেমন: ইংরেজি / গণিত / বিজ্ঞান"
                    value={formData.subjectBn}
                    onChange={(e) => setFormData({ ...formData, subjectBn: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">শিক্ষাগত যোগ্যতা</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="যেমন: বি.এ, বি.এড / এম.এসসি"
                    className="w-full rounded-lg border border-slate-300 p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+880 18XXXXXXXX"
                    className="w-full rounded-lg border border-slate-300 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ইমেইল ঠিকানা</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="teacher@bdhs.edu.bd"
                    className="w-full rounded-lg border border-slate-300 p-2 font-mono"
                  />
                </div>
              </div>

              {/* Teacher Photo File Upload & Avatar Preview */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800 text-xs">
                    শিক্ষক / কর্মচারীর ছবি (Profile Photo)
                  </label>
                  {uploadStatus && (
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 animate-pulse">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {uploadStatus}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden border-2 border-emerald-600 bg-slate-200 shrink-0 shadow-sm">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      className="hidden"
                      onChange={handleImageUpload}
                    />

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-300" />
                        <span>ছবি আপলোড করুন (Upload File)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetAvatar}
                        className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 transition"
                        title="অফিসিয়াল অবতারে রূপান্তর করুন"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                        <span>অফিসিয়াল অবতার</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      কম্পিউটার বা মোবাইল থেকে সরাসরি JPG / PNG ছবি নির্বাচন করুন। স্বয়ংক্রিয়ভাবে অপ্টিমাইজ হয়ে যাবে।
                    </p>
                  </div>
                </div>

                <div>
                  <details className="text-[11px] text-slate-600">
                    <summary className="cursor-pointer font-semibold text-emerald-800 hover:underline">
                      অথবা অনলাইন ছবির লিঙ্ক (URL) ব্যবহার করুন
                    </summary>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full mt-1.5 rounded-lg border border-slate-300 p-2 font-mono text-[11px] bg-white"
                    />
                  </details>
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold transition shadow"
                >
                  {editingTeacher ? 'হালনাগাদ সংরক্ষণ করুন' : 'যোগ নিশ্চিত করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
