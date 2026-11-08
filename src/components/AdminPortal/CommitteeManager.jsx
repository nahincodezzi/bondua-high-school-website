import React, { useState, useRef } from 'react';
import { useSchool } from '../../context/useSchool';
import { createEducatorAvatar } from '../../utils/avatarGenerator';
import { demoCommitteeSeed } from '../../data/initialData';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  Search, 
  Upload, 
  CheckCircle2, 
  Save, 
  UserCheck, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';

export default function CommitteeManager() {
  const { 
    schoolInfo, 
    updateSchoolSettings, 
    committee = [], 
    addCommitteeMember, 
    updateCommitteeMember, 
    deleteCommitteeMember
  } = useSchool();

  // 1. President Form State
  const [presidentForm, setPresidentForm] = useState({
    chairmanNameBn: schoolInfo.chairmanNameBn || '',
    chairmanNameEn: schoolInfo.chairmanNameEn || '',
    chairmanDesignationBn: schoolInfo.chairmanDesignationBn || 'সভাপতি, পরিচালনা পর্ষদ',
    chairmanDesignationEn: schoolInfo.chairmanDesignationEn || 'President, Managing Committee',
    chairmanPhone: schoolInfo.chairmanPhone || '',
    chairmanImage: schoolInfo.chairmanImage || '',
    chairmanMessageBn: schoolInfo.chairmanMessageBn || '',
    chairmanMessageEn: schoolInfo.chairmanMessageEn || ''
  });

  const [presidentSavedToast, setPresidentSavedToast] = useState(false);
  const [presidentUploadStatus, setPresidentUploadStatus] = useState('');
  const presidentPhotoInputRef = useRef(null);

  // 2. Committee Members State
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteConfirmMember, setDeleteConfirmMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [memberUploadStatus, setMemberUploadStatus] = useState('');
  const memberPhotoInputRef = useRef(null);

  const defaultMemberState = {
    nameBn: '',
    nameEn: '',
    designationBn: 'সদস্য',
    designationEn: 'Member',
    categoryBn: 'অভিভাবক সদস্য',
    categoryEn: 'Guardian Representative',
    phone: '',
    image: '',
    order: (committee.length || 0) + 1,
    status: 'active'
  };

  const [memberFormData, setMemberFormData] = useState(defaultMemberState);

  // --- President Handlers ---
  const handlePresidentSave = (e) => {
    e.preventDefault();
    if (updateSchoolSettings) {
      updateSchoolSettings({
        ...schoolInfo,
        ...presidentForm
      });
      setPresidentSavedToast(true);
      setTimeout(() => setPresidentSavedToast(false), 3000);
    }
  };

  const handlePresidentImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('ছবির আকার সর্বোচ্চ ৫ মেগাবাইট (5MB) হতে পারবে।');
      return;
    }

    setPresidentUploadStatus('প্রসেসিং হচ্ছে...');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_W = 600;
        const MAX_H = 720;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > MAX_W) {
            h = (h * MAX_W) / w;
            w = MAX_W;
          }
        } else {
          if (h > MAX_H) {
            w = (w * MAX_H) / h;
            h = MAX_H;
          }
        }
        canvas.width = Math.round(w);
        canvas.height = Math.round(h);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const optimized = canvas.toDataURL('image/jpeg', 0.88);
        setPresidentForm(prev => ({ ...prev, chairmanImage: optimized }));
        setPresidentUploadStatus('');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // --- Committee Members Handlers ---
  const handleOpenAddMember = () => {
    setEditingMember(null);
    setMemberFormData({
      ...defaultMemberState,
      order: (committee.length || 0) + 1
    });
    setMemberUploadStatus('');
    setShowMemberModal(true);
  };

  const handleOpenEditMember = (m) => {
    setEditingMember(m);
    setMemberFormData({
      ...defaultMemberState,
      ...m
    });
    setMemberUploadStatus('');
    setShowMemberModal(true);
  };

  const handleMemberImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('ছবির আকার সর্বোচ্চ ৫ মেগাবাইট (5MB) হতে পারবে।');
      return;
    }

    setMemberUploadStatus('প্রসেসিং হচ্ছে...');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_W = 500;
        const MAX_H = 600;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > MAX_W) {
            h = (h * MAX_W) / w;
            w = MAX_W;
          }
        } else {
          if (h > MAX_H) {
            w = (w * MAX_H) / h;
            h = MAX_H;
          }
        }
        canvas.width = Math.round(w);
        canvas.height = Math.round(h);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const optimized = canvas.toDataURL('image/jpeg', 0.88);
        setMemberFormData(prev => ({ ...prev, image: optimized }));
        setMemberUploadStatus('');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleMemberSubmit = (e) => {
    e.preventDefault();
    if (!memberFormData.nameBn.trim() || !memberFormData.designationBn.trim()) {
      return;
    }

    if (editingMember) {
      updateCommitteeMember(editingMember.id, memberFormData);
    } else {
      addCommitteeMember(memberFormData);
    }
    setShowMemberModal(false);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmMember) {
      deleteCommitteeMember(deleteConfirmMember.id);
      setDeleteConfirmMember(null);
    }
  };

  const handleLoadDemoCommittee = () => {
    if (demoCommitteeSeed && demoCommitteeSeed.length > 0) {
      demoCommitteeSeed.forEach(m => addCommitteeMember(m));
    }
  };

  // Filtered members
  const filteredMembers = committee.filter(m => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      m.nameBn?.toLowerCase().includes(q) ||
      m.nameEn?.toLowerCase().includes(q) ||
      m.designationBn?.toLowerCase().includes(q) ||
      m.categoryBn?.toLowerCase().includes(q)
    );
  }).sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  const activeCount = committee.filter(m => m.status !== 'inactive').length;

  return (
    <div className="space-y-8 font-bangla text-xs">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-line shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-ink flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-primary" />
              <span>পরিচালনা পর্ষদ ব্যবস্থাপনা (Managing Committee CMS)</span>
            </h2>
            <p className="text-muted text-[11px] mt-1">
              সভাপতি (President)-এর বাণী ও তথ্য সর্বদা প্রদর্শিত হবে। কমিটির অন্যান্য সদস্যদের তালিকা ঐচ্ছিক (সদস্য থাকলে প্রদর্শিত হবে, না থাকলে লুকানো থাকবে)।
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-soft text-deep font-bold px-3 py-1.5 rounded-lg text-xs font-mono">
              কমিটি সদস্য: {committee.length} (সক্রিয়: {activeCount})
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: PRESIDENT (সভাপতি) DETAILS & MESSAGE (ALWAYS ACTIVE) */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-primary/20 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase font-mono tracking-wider bg-soft text-deep px-2.5 py-0.5 rounded-full inline-block mb-1">
              প্রধান পদবী — সর্বদা দৃশ্যমান
            </span>
            <h3 className="text-base font-bold text-ink flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>১. সভাপতি মহোদয়ের পরিচিতি ও বাণী (President's Message & Identity)</span>
            </h3>
            <p className="text-muted text-[11px]">
              এই সেকশনটি মূল পরিচিতি (About) পেজে সর্বদা স্থায়ীভাবে প্রদর্শিত থাকে।
            </p>
          </div>

          <div className="flex items-center gap-2">
            {presidentSavedToast && (
              <span className="inline-flex items-center gap-1.5 text-primary text-xs font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>সফলভাবে সংরক্ষিত!</span>
              </span>
            )}
            <button
              type="button"
              onClick={handlePresidentSave}
              className="bg-primary hover:bg-primary text-white font-bold py-2.5 px-6 rounded-xl text-xs transition shadow flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-accent" />
              <span>সভাপতির তথ্য সংরক্ষণ করুন</span>
            </button>
          </div>
        </div>

        <form onSubmit={handlePresidentSave} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Photo Column */}
          <div className="md:col-span-3 flex flex-col items-center text-center space-y-3 bg-bg p-4 rounded-xl border border-line">
            <div className="w-28 h-36 rounded-xl overflow-hidden border border-line bg-white shadow-xs relative">
              <img
                src={presidentForm.chairmanImage || createEducatorAvatar({ initials: 'PR', role: 'chairman', designation: 'President' })}
                alt="President Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="file"
              ref={presidentPhotoInputRef}
              onChange={handlePresidentImageUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="w-full space-y-1.5">
              <button
                type="button"
                onClick={() => presidentPhotoInputRef.current?.click()}
                className="w-full bg-soft hover:bg-soft text-primary font-bold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>ছবি আপলোড</span>
              </button>
              {presidentForm.chairmanImage && (
                <button
                  type="button"
                  onClick={() => setPresidentForm(prev => ({ ...prev, chairmanImage: '' }))}
                  className="w-full text-red-500 hover:text-red-700 text-[10px] font-semibold py-1"
                >
                  ছবি মুছে ফেলুন
                </button>
              )}
              {presidentUploadStatus && <p className="text-primary text-[10px]">{presidentUploadStatus}</p>}
            </div>
          </div>

          {/* Form Fields */}
          <div className="md:col-span-9 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-ink mb-1">সভাপতির নাম (বাংলা) *</label>
                <input
                  type="text"
                  required
                  value={presidentForm.chairmanNameBn}
                  onChange={(e) => setPresidentForm({ ...presidentForm, chairmanNameBn: e.target.value })}
                  placeholder="যেমন: আলহাজ্ব মো. মজিবুর রহমান"
                  className="w-full rounded-lg border border-line p-2.5 bg-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">President Name (English) *</label>
                <input
                  type="text"
                  required
                  value={presidentForm.chairmanNameEn}
                  onChange={(e) => setPresidentForm({ ...presidentForm, chairmanNameEn: e.target.value })}
                  placeholder="e.g. Alhaj Md. Mozibur Rahman"
                  className="w-full rounded-lg border border-line p-2.5 bg-white font-sans font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">পদবী (বাংলা)</label>
                <input
                  type="text"
                  value={presidentForm.chairmanDesignationBn}
                  onChange={(e) => setPresidentForm({ ...presidentForm, chairmanDesignationBn: e.target.value })}
                  className="w-full rounded-lg border border-line p-2.5 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">Designation (English)</label>
                <input
                  type="text"
                  value={presidentForm.chairmanDesignationEn}
                  onChange={(e) => setPresidentForm({ ...presidentForm, chairmanDesignationEn: e.target.value })}
                  className="w-full rounded-lg border border-line p-2.5 bg-white font-sans"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-ink mb-1">মোবাইল নম্বর (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={presidentForm.chairmanPhone}
                  onChange={(e) => setPresidentForm({ ...presidentForm, chairmanPhone: e.target.value })}
                  placeholder="যেমন: 018XXXXXXXX"
                  className="w-full rounded-lg border border-line p-2.5 bg-white font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-ink mb-1">সভাপতির বাণী (বাংলা) *</label>
                <textarea
                  rows={4}
                  required
                  value={presidentForm.chairmanMessageBn}
                  onChange={(e) => setPresidentForm({ ...presidentForm, chairmanMessageBn: e.target.value })}
                  placeholder="বিদ্যালয়ের পরিচালনা ও শিক্ষার্থীদের উদ্দেশ্যে সভাপতির দিকনির্দেশনামূলক বক্তব্য..."
                  className="w-full rounded-lg border border-line p-2.5 bg-white leading-relaxed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-ink mb-1">President's Message (English)</label>
                <textarea
                  rows={4}
                  value={presidentForm.chairmanMessageEn}
                  onChange={(e) => setPresidentForm({ ...presidentForm, chairmanMessageEn: e.target.value })}
                  placeholder="President's message in English..."
                  className="w-full rounded-lg border border-line p-2.5 bg-white font-sans leading-relaxed"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* SECTION 2: MANAGING COMMITTEE MEMBERS LIST (OPTIONAL & CONDITIONAL) */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-line shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
          <div>
            <span className="text-[10px] font-bold text-muted uppercase font-mono tracking-wider bg-bg px-2.5 py-0.5 rounded-full inline-block mb-1">
              ঐচ্ছিক তালিকা — সদস্য থাকলে About পেজে গ্রিড হিসেবে দেখাবে
            </span>
            <h3 className="text-base font-bold text-ink flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>২. পরিচালনা কমিটির সদস্যবৃন্দ (Committee Members List)</span>
            </h3>
            <p className="text-muted text-[11px]">
              সহ-সভাপতি, সদস্য-সচিব, শিক্ষক প্রতিনিধি, অভিভাবক সদস্য ও দাতা সদস্যবৃন্দ যোগ বা সম্পাদনা করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {committee.length === 0 && (
              <button
                type="button"
                onClick={handleLoadDemoCommittee}
                className="bg-bg hover:bg-soft text-muted hover:text-primary font-bold py-2.5 px-4 rounded-xl text-xs transition border border-line cursor-pointer"
              >
                ডেমো সদস্য যোগ করুন (Demo Seed)
              </button>
            )}
            <button
              type="button"
              onClick={handleOpenAddMember}
              className="bg-primary hover:bg-primary text-white font-bold py-2.5 px-5 rounded-xl text-xs transition shadow flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-accent" />
              <span>নতুন সদস্য যোগ করুন</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="সদস্যের নাম বা পদবী লিখে খুঁজুন..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-line bg-bg focus:bg-white text-xs"
            />
          </div>
        </div>

        {/* Members Table */}
        {filteredMembers.length > 0 ? (
          <div className="overflow-x-auto border border-line rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg border-b border-line text-ink font-bold">
                <tr>
                  <th className="p-3 w-12 text-center">ক্রম</th>
                  <th className="p-3">সদস্যের তথ্য</th>
                  <th className="p-3">পদবী (Designation)</th>
                  <th className="p-3">ক্যাটাগরি</th>
                  <th className="p-3">যোগাযোগ</th>
                  <th className="p-3 text-center">স্ট্যাটাস</th>
                  <th className="p-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-bg/50 transition">
                    <td className="p-3 text-center font-mono font-bold text-muted">
                      {member.order || '-'}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-line bg-bg shrink-0">
                          <img
                            src={member.image || createEducatorAvatar({ initials: (member.nameEn || 'CM').slice(0, 2), role: 'committee' })}
                            alt={member.nameEn || member.nameBn}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-ink">{member.nameBn}</div>
                          <div className="text-[11px] text-muted font-sans">{member.nameEn}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-deep">
                      {member.designationBn}
                      <div className="text-[10px] text-muted font-sans">{member.designationEn}</div>
                    </td>
                    <td className="p-3">
                      <span className="bg-soft text-deep text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                        {member.categoryBn || member.categoryEn || 'সদস্য'}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-muted text-[11px]">
                      {member.phone || '—'}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => updateCommitteeMember(member.id, { status: member.status === 'active' ? 'inactive' : 'active' })}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                          member.status !== 'inactive'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-500 border border-slate-300'
                        }`}
                        title="স্ট্যাটাস টগল করুন"
                      >
                        {member.status !== 'inactive' ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয়'}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditMember(member)}
                          className="p-1.5 text-primary hover:bg-soft rounded-lg transition cursor-pointer"
                          title="সম্পাদনা করুন"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmMember(member)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-line rounded-2xl space-y-2">
            <Users className="w-10 h-10 text-muted mx-auto opacity-40" />
            <h4 className="font-bold text-ink text-sm">কোনো কমিটি সদস্য তালিকাভুক্ত নেই</h4>
            <p className="text-muted text-[11px] max-w-sm mx-auto">
              সদস্য তালিকা খালি থাকলে পরিচিতি (About) পেজে শুধুমাত্র সভাপতি মহোদয়ের কার্ডটি সুন্দরভাবে প্রদর্শিত থাকবে।
            </p>
          </div>
        )}
      </div>

      {/* ADD / EDIT MEMBER MODAL */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-2xl shadow-2xl border border-line p-6 space-y-4 font-bangla">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-bold text-ink text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span>{editingMember ? 'কমিটি সদস্য সম্পাদনা' : 'নতুন কমিটি সদস্য যুক্তকরণ'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowMemberModal(false)}
                className="text-muted hover:text-ink p-1 rounded-lg hover:bg-bg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMemberSubmit} className="space-y-4 text-xs">
              {/* Photo Upload & Preview */}
              <div className="flex items-center gap-4 bg-bg p-3 rounded-xl border border-line">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-line bg-white shrink-0">
                  <img
                    src={memberFormData.image || createEducatorAvatar({ initials: (memberFormData.nameEn || 'CM').slice(0, 2), role: 'committee' })}
                    alt="Member Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <input
                    type="file"
                    ref={memberPhotoInputRef}
                    onChange={handleMemberImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => memberPhotoInputRef.current?.click()}
                    className="bg-white hover:bg-bg text-primary font-bold py-1.5 px-3 rounded-lg border border-line text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>ছবি আপলোড (বাধ্যতামূলক নয়)</span>
                  </button>
                  {memberFormData.image && (
                    <button
                      type="button"
                      onClick={() => setMemberFormData({ ...memberFormData, image: '' })}
                      className="text-red-500 hover:text-red-700 text-[10px] block"
                    >
                      ছবি মুছে ফেলুন
                    </button>
                  )}
                  {memberUploadStatus && <p className="text-primary text-[10px]">{memberUploadStatus}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">সদস্যের নাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={memberFormData.nameBn}
                    onChange={(e) => setMemberFormData({ ...memberFormData, nameBn: e.target.value })}
                    placeholder="যেমন: জনাব আবুল কাশেম"
                    className="w-full rounded-lg border border-line p-2.5 bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Member Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={memberFormData.nameEn}
                    onChange={(e) => setMemberFormData({ ...memberFormData, nameEn: e.target.value })}
                    placeholder="e.g. Mr. Abul Kashem"
                    className="w-full rounded-lg border border-line p-2.5 bg-white font-sans font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">পদবী (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={memberFormData.designationBn}
                    onChange={(e) => setMemberFormData({ ...memberFormData, designationBn: e.target.value })}
                    placeholder="যেমন: সহ-সভাপতি / সদস্য-সচিব / অভিভাবক সদস্য"
                    className="w-full rounded-lg border border-line p-2.5 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Designation (English) *</label>
                  <input
                    type="text"
                    required
                    value={memberFormData.designationEn}
                    onChange={(e) => setMemberFormData({ ...memberFormData, designationEn: e.target.value })}
                    placeholder="e.g. Vice President / Member Secretary"
                    className="w-full rounded-lg border border-line p-2.5 bg-white font-sans"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">ক্যাটাগরি / শ্রেণীবিভাগ (বাংলা)</label>
                  <input
                    type="text"
                    value={memberFormData.categoryBn}
                    onChange={(e) => setMemberFormData({ ...memberFormData, categoryBn: e.target.value })}
                    placeholder="যেমন: শিক্ষক প্রতিনিধি / অভিভাবক সদস্য"
                    className="w-full rounded-lg border border-line p-2.5 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Category (English)</label>
                  <input
                    type="text"
                    value={memberFormData.categoryEn}
                    onChange={(e) => setMemberFormData({ ...memberFormData, categoryEn: e.target.value })}
                    placeholder="e.g. Teacher Representative"
                    className="w-full rounded-lg border border-line p-2.5 bg-white font-sans"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">মোবাইল নম্বর (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={memberFormData.phone}
                    onChange={(e) => setMemberFormData({ ...memberFormData, phone: e.target.value })}
                    placeholder="018XXXXXXXX"
                    className="w-full rounded-lg border border-line p-2.5 bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">প্রদর্শনের ক্রম (Sort Order)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={memberFormData.order}
                    onChange={(e) => setMemberFormData({ ...memberFormData, order: Number(e.target.value) })}
                    className="w-full rounded-lg border border-line p-2.5 bg-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-ink">
                    <input
                      type="checkbox"
                      checked={memberFormData.status !== 'inactive'}
                      onChange={(e) => setMemberFormData({ ...memberFormData, status: e.target.checked ? 'active' : 'inactive' })}
                      className="w-4 h-4 accent-primary rounded"
                    />
                    <span>পাবলিক ওয়েবসাইটে এই সদস্যের প্রোফাইল সক্রিয় (Active) রাখুন</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-muted hover:bg-bg border border-line cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary text-white shadow-xs cursor-pointer"
                >
                  {editingMember ? 'পরিবর্তন সংরক্ষণ করুন' : 'সদস্য যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM IN-APP MODAL (Zero window.confirm) */}
      {deleteConfirmMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl shadow-2xl border border-line p-6 space-y-4 font-bangla">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-base text-ink">সদস্য মুছে ফেলার নিশ্চিতকরণ</h3>
            </div>
            <p className="text-muted text-xs leading-relaxed">
              আপনি কি নিশ্চিত যে <strong className="text-ink">"{deleteConfirmMember.nameBn}"</strong> ({deleteConfirmMember.designationBn})-কে কমিটি থেকে মুছে ফেলতে চান?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => setDeleteConfirmMember(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-muted hover:bg-bg border border-line cursor-pointer"
              >
                না, ফিরে যান
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs cursor-pointer"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
