import React, { useState } from 'react';
import { useSchool } from '../../context/useSchool';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Key, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  HelpCircle,
  Sliders,
  DollarSign,
  Award,
  Bell,
  School,
  FileCheck,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

export default function UserManager() {
  const { 
    systemUsers, 
    addUser, 
    updateUser, 
    deleteUser, 
    toggleUserStatus, 
    authUser, 
    lang, 
    SYSTEM_MODULES, 
    ROLE_DEFINITIONS 
  } = useSchool();

  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'guide'
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [resetModalUser, setResetModalUser] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

  // Form State
  const initialFormState = {
    username: '',
    password: '',
    nameBn: '',
    nameEn: '',
    role: 'teacher',
    designationBn: 'সহকারী শিক্ষক',
    designationEn: 'Assistant Teacher',
    email: '',
    phone: '',
    status: 'active',
    permissions: ROLE_DEFINITIONS.teacher?.defaultPermissions || ['results', 'notices']
  };

  const [formData, setFormData] = useState(initialFormState);

  // Module Icon Map
  const getModuleIcon = (id) => {
    switch (id) {
      case 'cms': return Sliders;
      case 'teachers': return School;
      case 'students': return Users;
      case 'admissions': return FileCheck;
      case 'results': return Award;
      case 'notices': return Bell;
      case 'fees': return DollarSign;
      case 'settings': return Settings;
      default: return ShieldCheck;
    }
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData(initialFormState);
    setShowModal(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: user.password,
      nameBn: user.nameBn,
      nameEn: user.nameEn || '',
      role: user.role,
      designationBn: user.designationBn,
      designationEn: user.designationEn || '',
      email: user.email || '',
      phone: user.phone || '',
      status: user.status || 'active',
      permissions: user.permissions || []
    });
    setShowModal(true);
  };

  const handleRoleChange = (selectedRole) => {
    const roleDef = ROLE_DEFINITIONS[selectedRole];
    setFormData(prev => ({
      ...prev,
      role: selectedRole,
      designationBn: roleDef?.nameBn?.split('(')[0]?.trim() || prev.designationBn,
      permissions: roleDef?.defaultPermissions ? [...roleDef.defaultPermissions] : prev.permissions
    }));
  };

  const handlePermissionToggle = (modId) => {
    setFormData(prev => {
      const exists = prev.permissions.includes(modId);
      const updated = exists 
        ? prev.permissions.filter(p => p !== modId)
        : [...prev.permissions, modId];
      return { ...prev, permissions: updated };
    });
  };

  const handleSelectAllPermissions = () => {
    const allModIds = SYSTEM_MODULES.map(m => m.id);
    setFormData(prev => ({ ...prev, permissions: allModIds }));
  };

  const handleClearPermissions = () => {
    setFormData(prev => ({ ...prev, permissions: [] }));
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPasswordInput || newPasswordInput.length < 8) {
      alert('পাসওয়ার্ড অবশ্যই কমপক্ষে ৮ অক্ষরের হতে হবে!');
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(newPasswordInput)) {
      alert('পাসওয়ার্ডে অন্তত একটি ইংরেজি বর্ণ (letter) ও একটি সংখ্যা (number) থাকতে হবে!');
      return;
    }
    await updateUser(resetModalUser.id, { password: newPasswordInput });
    setResetSuccessMsg(`"${resetModalUser.nameBn}" এর পাসওয়ার্ড সফলভাবে রিসেট করা হয়েছে!`);
    setTimeout(() => {
      setResetSuccessMsg('');
      setResetModalUser(null);
      setNewPasswordInput('');
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password || !formData.nameBn.trim()) {
      alert('অনুগ্রহ করে নাম, ইউজারনেম এবং পাসওয়ার্ড পূরণ করুন!');
      return;
    }

    // Minimum 8 characters with letters & numbers (N4 / A7)
    if (formData.password.length < 8) {
      alert('নিরাপত্তার স্বার্থে পাসওয়ার্ড অবশ্যই কমপক্ষে ৮ অক্ষরের হতে হবে!');
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      alert('পাসওয়ার্ডে অবশ্যই অন্তত একটি ইংরেজি বর্ণ (letter) ও একটি সংখ্যা (number) থাকতে হবে!');
      return;
    }

    // Check duplicate username if adding new
    if (!editingUser) {
      const exists = systemUsers.some(u => u.username.toLowerCase() === formData.username.trim().toLowerCase());
      if (exists) {
        alert('এই ইউজারনেমটি ইতিমধ্যে বিদ্যমান! অনুগ্রহ করে অন্য ইউজারনেম নির্বাচন করুন।');
        return;
      }
      await addUser(formData);
      alert(`"${formData.nameBn}" এর জন্য নতুন অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!`);
    } else {
      await updateUser({
        ...editingUser,
        ...formData
      });
      alert(`"${formData.nameBn}" এর তথ্য ও পারমিশন সফলভাবে আপডেট করা হয়েছে!`);
    }

    setShowModal(false);
  };

  // Filtered Users List
  const filteredUsers = systemUsers.filter(u => {
    const matchSearch = 
      u.nameBn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.designationBn?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="bg-white p-6 rounded-2xl border border-line shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 font-bangla">
        <div>
          <div className="inline-flex items-center gap-2 bg-soft text-deep text-xs font-bold px-3 py-1 rounded-full mb-1 border border-soft-border">
            <Key className="w-3.5 h-3.5 text-primary" />
            <span>সুপার অ্যাডমিন এক্সেস কন্ট্রোল (RBAC)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-ink">
            {lang === 'bn' ? 'ইউজার ও এক্সেস পারমিশন ব্যবস্থাপনা' : 'User Accounts & Access Control'}
          </h2>
          <p className="text-xs text-muted mt-1">
            অন্যান্য সকল রোল (প্রধান শিক্ষক, সহকারী শিক্ষক, হিসাবরক্ষক, অপারেটর)-এর অ্যাকাউন্ট তৈরি করুন এবং কার কী অ্যাক্সেস থাকবে তা নির্ধারণ করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Tab Switcher */}
          <div className="flex bg-bg p-1 rounded-xl text-xs font-bold border border-line">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'list' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-ink'
              }`}
            >
              অ্যাকাউন্ট তালিকা ({systemUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                activeTab === 'guide' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-ink'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>কার কী অ্যাক্সেস গাইড</span>
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="btn-primary px-4 py-2 text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>নতুন অ্যাকাউন্ট তৈরি করুন</span>
          </button>
        </div>
      </div>

      {/* TAB 1: USERS LIST */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-line flex flex-col sm:flex-row gap-3 items-center justify-between font-bangla text-xs shadow-xs">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="নাম, পদবী বা ইউজারনেম দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-lg border border-line focus:ring-2 focus:ring-primary focus:outline-none bg-bg text-ink"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-muted font-semibold shrink-0">রোল ফিল্টার:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full sm:w-auto bg-bg border border-line rounded-lg px-3 py-1.5 font-medium text-ink focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="all">সকল রোল ({systemUsers.length})</option>
                {Object.keys(ROLE_DEFINITIONS).map(key => (
                  <option key={key} value={key}>{ROLE_DEFINITIONS[key].nameBn}</option>
                ))}
              </select>
            </div>
          </div>

          {/* User Cards Grid: 3 cols desktop, 2 cols tablet, 1 col mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => {
              const roleDef = ROLE_DEFINITIONS[user.role] || ROLE_DEFINITIONS.teacher;
              const isCurrentUser = authUser?.id === user.id || authUser?.username === user.username;
              const isSuper = user.role === 'superadmin';

              return (
                <div
                  key={user.id}
                  className={`bg-white rounded-xl border border-line hover:border-primary transition-all duration-200 shadow-xs flex flex-col justify-between p-5 ${
                    user.status === 'inactive' ? 'opacity-70 bg-bg' : ''
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs shrink-0 bg-primary">
                          {isSuper ? <Key className="w-5 h-5 text-accent" /> : <Users className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="badge-neutral text-[10px]">
                              {roleDef.nameBn.split('(')[0]}
                            </span>
                            {isSuper && (
                              <span className="badge-warning text-[10px]">
                                SUPER
                              </span>
                            )}
                            {user.status === 'inactive' ? (
                              <span className="badge-status-inactive text-[10px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-danger"></span>
                                <span>নিষ্ক্রিয়</span>
                              </span>
                            ) : (
                              <span className="badge-status-active text-[10px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                                <span>সক্রিয়</span>
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold font-bangla text-ink mt-1 line-clamp-1">
                            {user.nameBn}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Metadata Details: 2-column label/value grid */}
                    <div className="bg-bg p-3 rounded-xl border border-line space-y-2 text-xs font-bangla">
                      <div className="grid grid-cols-12 gap-1 items-center">
                        <span className="col-span-5 text-muted text-xs">পদবী:</span>
                        <span className="col-span-7 font-semibold text-ink text-sm truncate">{user.designationBn}</span>
                      </div>
                      <div className="grid grid-cols-12 gap-1 items-center">
                        <span className="col-span-5 text-muted text-xs">ইউজার আইডি:</span>
                        <span className="col-span-7 font-mono font-medium text-ink bg-bg border border-line px-2 py-0.5 rounded text-xs inline-block w-fit">{user.username}</span>
                      </div>
                      <div className="grid grid-cols-12 gap-1 items-center">
                        <span className="col-span-5 text-muted text-xs">পাসওয়ার্ড:</span>
                        <div className="col-span-7 flex items-center gap-2">
                          <span className="font-mono text-muted bg-white px-2 py-0.5 rounded border border-line text-xs inline-block tracking-widest">••••••••</span>
                          <button
                            type="button"
                            onClick={() => {
                              setResetModalUser(user);
                              setNewPasswordInput('');
                            }}
                            className="text-[11px] font-bold text-primary hover:text-deep underline font-bangla cursor-pointer"
                          >
                            রিসেট করুন
                          </button>
                        </div>
                      </div>
                      {user.phone && (
                        <div className="grid grid-cols-12 gap-1 items-center">
                          <span className="col-span-5 text-muted text-xs">ফোন:</span>
                          <span className="col-span-7 font-mono text-ink text-xs">{user.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Permitted Modules: 14px chips with subtle green icons */}
                    <div>
                      <div className="text-xs font-bold text-muted font-bangla mb-1.5 flex items-center justify-between">
                        <span>অনুমোদিত অ্যাক্সেস ({user.permissions?.length || 0}):</span>
                        {isSuper && <span className="text-[10px] text-primary font-bold">সকল মডিউল</span>}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {user.permissions && user.permissions.length > 0 ? (
                          user.permissions.map(permId => {
                            const mod = SYSTEM_MODULES.find(m => m.id === permId);
                            const IconComponent = getModuleIcon(permId);
                            return (
                              <span
                                key={permId}
                                className="inline-flex items-center gap-1.5 bg-bg text-ink border border-line px-2.5 py-1 rounded-md text-xs font-medium font-bangla"
                              >
                                <IconComponent className="w-3.5 h-3.5 text-primary shrink-0" />
                                <span>{mod ? mod.labelBn.split('(')[0] : permId}</span>
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-xs text-danger italic font-bangla">কোনো মডিউল অ্যাক্সেস নেই</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 border-t border-line flex items-center justify-between text-xs font-bangla">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      disabled={isCurrentUser}
                      className={`btn-danger px-2.5 py-1 text-xs cursor-pointer ${
                        isCurrentUser ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                      title={isCurrentUser ? 'নিজের অ্যাকাউন্ট নিষ্ক্রিয় করা যাবে না' : (user.status === 'active' ? 'অ্যাকাউন্ট নিষ্ক্রিয় করুন' : 'অ্যাকাউন্ট সক্রিয় করুন')}
                    >
                      {user.status === 'active' ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-1.5 text-primary bg-soft hover:bg-soft rounded-lg transition cursor-pointer"
                        title="সম্পাদনা ও পারমিশন পরিবর্তন"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (isCurrentUser) {
                            alert('আপনি নিজের সুপার অ্যাডমিন অ্যাকাউন্ট মুছে ফেলতে পারবেন না!');
                            return;
                          }
                          if (confirm(`আপনি কি "${user.nameBn}" এর অ্যাকাউন্টটি স্থায়ীভাবে মুছে ফেলতে চান?`)) {
                            deleteUser(user.id);
                          }
                        }}
                        disabled={isCurrentUser}
                        className={`p-1.5 text-danger bg-danger-soft hover:bg-danger-soft rounded-lg transition cursor-pointer ${
                          isCurrentUser ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                        title={isCurrentUser ? 'নিজের অ্যাকাউন্ট মুছে ফেলা যাবে না' : 'অ্যাকাউন্ট স্থায়ীভাবে মুছুন'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ROLE & PERMISSION MATRIX / ACCESS GUIDE */}
      {activeTab === 'guide' && (
        <div className="space-y-6 font-bangla">
          {/* Guide Header Banner */}
          <div className="bg-deep text-white p-6 sm:p-8 rounded-2xl shadow-xs border border-primary">
            <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>কার কী অ্যাক্সেস থাকবে তার নির্দেশিকা (RBAC Guide)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              সিস্টেম রোলভিত্তিক দায়িত্ব ও অ্যাক্সেস পলিসি
            </h3>
            <p className="text-xs sm:text-sm text-soft mt-1 max-w-3xl leading-relaxed">
              সুপার অ্যাডমিন প্রতিটি অ্যাকাউন্টের জন্য নির্দিষ্ট মডিউলের অ্যাক্সেস নিয়ন্ত্রণ করতে পারেন। নিচে কোন রোলের কী কী অনুমতি থাকা বাঞ্ছনীয় তার একটি প্রমিত চার্ট দেওয়া হলো:
            </p>
          </div>

          {/* Detailed Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(ROLE_DEFINITIONS).map(roleKey => {
              const r = ROLE_DEFINITIONS[roleKey];
              return (
                <div key={roleKey} className="bg-white p-5 rounded-xl border border-line shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-line">
                    <span className="badge-neutral text-xs font-bold">
                      {r.nameBn}
                    </span>
                    <span className="font-mono text-xs text-muted font-semibold">{r.id}</span>
                  </div>

                  <p className="text-xs text-ink leading-relaxed">
                    {r.descriptionBn}
                  </p>

                  <div className="pt-2">
                    <span className="text-xs font-bold text-ink block mb-1.5">অনুমোদিত ডিফল্ট মডিউলসমূহ:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {r.defaultPermissions.map(pId => {
                        const m = SYSTEM_MODULES.find(mod => mod.id === pId);
                        return (
                          <span 
                            key={pId}
                            className="bg-bg text-ink border border-line px-2 py-0.5 rounded text-xs font-medium"
                          >
                            ✓ {m ? m.labelBn.split('(')[0] : pId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Access Matrix Table */}
          <div className="bg-white rounded-xl border border-line overflow-hidden shadow-xs">
            <div className="p-4 bg-bg border-b border-line flex items-center justify-between">
              <h4 className="text-sm font-bold text-ink">
                সকল রোল ও মডিউলের বিস্তারিত এক্সেস ম্যাট্রিক্স (Visual Matrix)
              </h4>
              <span className="text-xs text-muted">✓ = অ্যাক্সেস আছে | ✕ = অ্যাক্সেস নেই</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-deep text-white font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">সফটওয়্যার মডিউল</th>
                    <th className="py-3 px-3 text-center">সুপার অ্যাডমিন</th>
                    <th className="py-3 px-3 text-center">প্রধান শিক্ষক</th>
                    <th className="py-3 px-3 text-center">সহকারী প্রধান</th>
                    <th className="py-3 px-3 text-center">শিক্ষক</th>
                    <th className="py-3 px-3 text-center">হিসাবরক্ষক</th>
                    <th className="py-3 px-3 text-center">অপারেটর</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {SYSTEM_MODULES.map(mod => (
                    <tr key={mod.id} className="hover:bg-bg">
                      <td className="py-2.5 px-4 font-semibold text-ink">
                        <div>
                          <span>{mod.labelBn}</span>
                          <span className="text-[10px] text-muted block font-normal">{mod.descBn}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="w-5 h-5 rounded-full bg-soft text-success font-bold inline-flex items-center justify-center text-xs">✓</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {ROLE_DEFINITIONS.headmaster.defaultPermissions.includes(mod.id) ? (
                          <span className="w-5 h-5 rounded-full bg-soft text-success font-bold inline-flex items-center justify-center text-xs">✓</span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-bg text-muted font-bold inline-flex items-center justify-center text-xs">✕</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {ROLE_DEFINITIONS.asst_headmaster.defaultPermissions.includes(mod.id) ? (
                          <span className="w-5 h-5 rounded-full bg-soft text-success font-bold inline-flex items-center justify-center text-xs">✓</span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-bg text-muted font-bold inline-flex items-center justify-center text-xs">✕</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {ROLE_DEFINITIONS.teacher.defaultPermissions.includes(mod.id) ? (
                          <span className="w-5 h-5 rounded-full bg-soft text-success font-bold inline-flex items-center justify-center text-xs">✓</span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-bg text-muted font-bold inline-flex items-center justify-center text-xs">✕</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {ROLE_DEFINITIONS.accountant.defaultPermissions.includes(mod.id) ? (
                          <span className="w-5 h-5 rounded-full bg-soft text-success font-bold inline-flex items-center justify-center text-xs">✓</span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-bg text-muted font-bold inline-flex items-center justify-center text-xs">✕</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {ROLE_DEFINITIONS.operator.defaultPermissions.includes(mod.id) ? (
                          <span className="w-5 h-5 rounded-full bg-soft text-success font-bold inline-flex items-center justify-center text-xs">✓</span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-bg text-muted font-bold inline-flex items-center justify-center text-xs">✕</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT USER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl border border-line my-8 font-bangla text-xs">
            {/* Modal Header */}
            <div className="bg-deep text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-accent" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingUser ? 'ব্যবহারকারীর তথ্য ও পারমিশন পরিবর্তন' : 'নতুন ব্যবহারকারী অ্যাকাউন্ট তৈরি করুন'}
                  </h3>
                  <p className="text-xs text-soft">
                    ইউজার তথ্য এবং মডিউলভিত্তিক এক্সেস পারমিশন নির্ধারণ করুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-ink mb-1">
                    পূর্ণ নাম (বাংলা): <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: জনাব বাহার উদ্দিন ভূঁইয়া"
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    className="w-full rounded-lg border border-line p-2.5 focus:ring-2 focus:ring-primary focus:outline-none bg-bg text-ink"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">
                    ব্যবহারকারীর পদবী:
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: সহকারী প্রধান শিক্ষক / সহকারী শিক্ষক"
                    value={formData.designationBn}
                    onChange={(e) => setFormData({ ...formData, designationBn: e.target.value })}
                    className="w-full rounded-lg border border-line p-2.5 focus:ring-2 focus:ring-primary focus:outline-none bg-bg text-ink"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">
                    ইউজার আইডি / ইউজারনেম: <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: asst_headmaster"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    className="w-full rounded-lg border border-line p-2.5 focus:ring-2 focus:ring-primary focus:outline-none font-mono bg-bg text-ink"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">
                    পাসওয়ার্ড: <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showUserPassword ? 'text' : 'password'}
                      required
                      placeholder="কমপক্ষে ৮ অক্ষরের শক্তিশালী পাসওয়ার্ড"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full rounded-lg border border-line p-2.5 pr-10 focus:ring-2 focus:ring-primary focus:outline-none font-mono bg-bg text-ink"
                    />
                    <button
                      type="button"
                      onClick={() => setShowUserPassword(!showUserPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
                      title={showUserPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                    >
                      {showUserPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-muted mt-1">পাসওয়ার্ডে অন্তত ৮টি অক্ষর রাখুন।</p>
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">
                    ভূমিকা (Role নির্বাচন): <span className="text-danger">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full rounded-lg border border-line p-2.5 focus:ring-2 focus:ring-primary focus:outline-none font-semibold bg-bg text-ink"
                  >
                    {Object.keys(ROLE_DEFINITIONS).map(key => (
                      <option key={key} value={key}>{ROLE_DEFINITIONS[key].nameBn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">
                    অ্যাকাউন্ট স্ট্যাটাস:
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-lg border border-line p-2.5 focus:ring-2 focus:ring-primary focus:outline-none font-semibold bg-bg text-ink"
                  >
                    <option value="active">সক্রিয় (Active - লগইন করতে পারবে)</option>
                    <option value="inactive">নিষ্ক্রিয় (Inactive - লগইন সাময়িক বন্ধ)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">
                    মোবাইল নম্বর:
                  </label>
                  <input
                    type="text"
                    placeholder="+880 1819-XXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-line p-2.5 focus:ring-2 focus:ring-primary focus:outline-none font-mono bg-bg text-ink"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">
                    ইমেইল ঠিকানা:
                  </label>
                  <input
                    type="email"
                    placeholder="user@bdhs.edu.bd"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-line p-2.5 focus:ring-2 focus:ring-primary focus:outline-none font-mono bg-bg text-ink"
                  />
                </div>
              </div>

              {/* PERMISSION SELECTION SECTION */}
              <div className="pt-3 border-t border-line">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-ink">
                      মডিউলভিত্তিক এক্সেস পারমিশন নির্ধারণ (Select Permissions)
                    </h4>
                    <p className="text-xs text-muted">
                      এই ব্যবহারকারী ড্যাশবোর্ডে যে যে মডিউল দেখতে ও সম্পাদনা করতে পারবে তা টিক দিন
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllPermissions}
                      className="text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                      সব নির্বাচন করুন
                    </button>
                    <span className="text-line">|</span>
                    <button
                      type="button"
                      onClick={handleClearPermissions}
                      className="text-xs font-bold text-muted hover:underline cursor-pointer"
                    >
                      সব মুছুন
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SYSTEM_MODULES.map((mod) => {
                    const isChecked = formData.permissions.includes(mod.id);
                    const IconComponent = getModuleIcon(mod.id);
                    const isSuperOnly = mod.superadminOnly && formData.role !== 'superadmin';

                    return (
                      <label
                        key={mod.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer select-none ${
                          isChecked 
                            ? 'bg-soft/50 border-soft-border' 
                            : 'bg-white border-line hover:bg-bg'
                        } ${isSuperOnly ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="checkbox"
                          disabled={isSuperOnly}
                          checked={isChecked}
                          onChange={() => handlePermissionToggle(mod.id)}
                          className="mt-0.5 rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 font-bold text-ink">
                            <IconComponent className="w-3.5 h-3.5 text-primary" />
                            <span>{mod.labelBn}</span>
                            {mod.superadminOnly && (
                              <span className="badge-warning text-[9px] px-1.5 py-0 font-mono">
                                Super Only
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-muted mt-0.5 leading-snug">
                            {mod.descBn}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-line flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary px-4 py-2 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="btn-primary px-6 py-2.5 flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingUser ? 'তথ্য ও পারমিশন সংরক্ষণ করুন' : 'অ্যাকাউন্ট তৈরি নিশ্চিত করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal (N1 & N4) */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-line p-6 space-y-4 font-bangla">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-bold text-ink text-base flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                <span>পাসওয়ার্ড রিসেট: {resetModalUser.nameBn}</span>
              </h3>
              <button 
                onClick={() => setResetModalUser(null)} 
                className="text-muted hover:text-ink p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {resetSuccessMsg ? (
              <div className="p-4 bg-soft text-primary rounded-xl text-xs font-bold border border-soft-border">
                {resetSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <p className="text-xs text-muted">
                  ইউজারনেম: <strong className="font-mono text-ink">{resetModalUser.username}</strong>
                </p>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">
                    নতুন পাসওয়ার্ড লিখুন *
                  </label>
                  <input
                    type="password"
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="কমপক্ষে ৮ অক্ষর (বর্ণ ও সংখ্যা)"
                    className="w-full rounded-lg border border-line p-2.5 text-xs focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-[11px] text-muted mt-1">
                    পাসওয়ার্ডে অন্তত একটি ইংরেজি বর্ণ (letter) ও একটি সংখ্যা (number) থাকতে হবে।
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setResetModalUser(null)}
                    className="btn-secondary px-4 py-2 text-xs cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="btn-primary px-5 py-2 text-xs font-bold cursor-pointer"
                  >
                    পাসওয়ার্ড সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
