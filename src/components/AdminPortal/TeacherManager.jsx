import React, { useState } from 'react';
import { useSchool } from '../../context/useSchool';
import { 
  Plus, 
  Trash2, 
  Edit, 
  X 
} from 'lucide-react';

export default function TeacherManager() {
  const { teachers, addTeacher, updateTeacher, deleteTeacher } = useSchool();
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [formData, setFormData] = useState({
    nameBn: '',
    nameEn: '',
    designationBn: 'সহকারী শিক্ষক',
    designationEn: 'Assistant Teacher',
    subjectBn: '',
    subjectEn: '',
    qualification: '',
    phone: '',
    email: '',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80'
  });

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData({
      nameBn: '',
      nameEn: '',
      designationBn: 'সহকারী শিক্ষক',
      designationEn: 'Assistant Teacher',
      subjectBn: '',
      subjectEn: '',
      qualification: '',
      phone: '',
      email: '',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTeacher(t);
    setFormData({ ...t });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nameBn) return;

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, formData);
    } else {
      addTeacher(formData);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-bangla">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            শিক্ষক ও কর্মচারী পরিষদ ব্যবস্থাপনা (Faculty CMS)
          </h2>
          <p className="text-xs text-slate-500">
            শিক্ষকমণ্ডলীর তথ্য সংযোজন, পদবী, বিষয় ও যোগাযোগের তথ্য হালনাগাদ
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition shadow"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>নতুন শিক্ষক যোগ করুন</span>
        </button>
      </div>

      {/* Teachers Roster Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <img
                src={t.image}
                alt={t.nameEn}
                className="w-14 h-14 rounded-xl object-cover object-top border border-slate-200 shrink-0"
              />
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bangla">
                  {t.designationBn}
                </span>
                <h4 className="text-sm font-bold font-bangla text-slate-900 line-clamp-1">
                  {t.nameBn}
                </h4>
                <p className="text-xs text-emerald-700 font-semibold font-bangla">
                  {t.subjectBn}
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  {t.qualification}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
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
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4 font-bangla text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingTeacher ? 'শিক্ষকের তথ্য সম্পাদনা করুন' : 'নতুন শিক্ষক সংযোজন ফরম'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">শিক্ষকের নাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">শিক্ষকের নাম (ইংরেজি) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">পদবী (বাংলা)</label>
                  <input
                    type="text"
                    value={formData.designationBn}
                    onChange={(e) => setFormData({ ...formData, designationBn: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">পাঠদানের বিষয় (বাংলা)</label>
                  <input
                    type="text"
                    value={formData.subjectBn}
                    onChange={(e) => setFormData({ ...formData, subjectBn: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">শিক্ষাগত যোগ্যতা</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="যেমন: M.A, B.Ed"
                    className="w-full rounded-lg border border-slate-300 p-2"
                  />
                </div>
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
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ছবির লিংক (Image URL)</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 text-white font-bold rounded-lg shadow"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
