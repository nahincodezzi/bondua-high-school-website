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
  Settings
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.nameBn) {
      alert('অনুগ্রহ করে নাম, ইউজারনেম এবং পাসওয়ার্ড পূরণ করুন!');
      return;
    }

    // Check duplicate username if adding new
    if (!editingUser) {
      const exists = systemUsers.some(u => u.username.toLowerCase() === formData.username.trim().toLowerCase());
      if (exists) {
        alert('এই ইউজারনেমটি ইতিমধ্যে বিদ্যমান! অনুগ্রহ করে অন্য ইউজারনেম নির্বাচন করুন।');
        return;
      }
      addUser(formData);
      alert(`"${formData.nameBn}" এর জন্য নতুন অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!`);
    } else {
      updateUser({
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
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 font-bangla">
        <div>
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-900 text-xs font-bold px-3 py-1 rounded-full mb-1">
            <Key className="w-3.5 h-3.5 text-purple-700" />
            <span>সুপার অ্যাডমিন এক্সেস কন্ট্রোল (RBAC)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {lang === 'bn' ? 'ইউজার ও এক্সেস পারমিশন ব্যবস্থাপনা' : 'User Accounts & Access Control'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            অন্যান্য সকল রোল (প্রধান শিক্ষক, সহকারী শিক্ষক, হিসাবরক্ষক, অপারেটর)-এর অ্যাকাউন্ট তৈরি করুন এবং কার কী অ্যাক্সেস থাকবে তা নির্ধারণ করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'list' ? 'bg-purple-900 text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              অ্যাকাউন্ট তালিকা ({systemUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                activeTab === 'guide' ? 'bg-purple-900 text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>কারে কী অ্যাক্সেস গাইড</span>
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="bg-purple-900 hover:bg-purple-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow"
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
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between font-bangla text-xs">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="নাম, পদবী বা ইউজারনেম দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500"
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

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-slate-500 font-semibold shrink-0">রোল ফিল্টার:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full sm:w-auto bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-medium"
              >
                <option value="all">সকল রোল ({systemUsers.length})</option>
                {Object.keys(ROLE_DEFINITIONS).map(key => (
                  <option key={key} value={key}>{ROLE_DEFINITIONS[key].nameBn}</option>
                ))}
              </select>
            </div>
          </div>

          {/* User Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => {
              const roleDef = ROLE_DEFINITIONS[user.role] || ROLE_DEFINITIONS.teacher;
              const isCurrentUser = authUser?.id === user.id || authUser?.username === user.username;
              const isSuper = user.role === 'superadmin';

              return (
                <div
                  key={user.id}
                  className={`bg-white rounded-2xl border-2 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between p-5 ${
                    user.status === 'inactive' ? 'border-slate-300 bg-slate-50/70 opacity-75' : isSuper ? 'border-purple-300 bg-gradient-to-br from-purple-50/20 via-white to-white' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs shrink-0 ${
                          isSuper ? 'bg-purple-900' : 'bg-emerald-800'
                        }`}>
                          {isSuper ? <Key className="w-5 h-5 text-amber-300" /> : <Users className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-bangla ${roleDef.badgeColor}`}>
                              {roleDef.nameBn.split('(')[0]}
                            </span>
                            {user.status === 'inactive' ? (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                                নিষ্ক্রিয়
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                সক্রিয়
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold font-bangla text-slate-900 mt-1 line-clamp-1">
                            {user.nameBn}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Metadata Details */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs font-bangla">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">পদবী:</span>
                        <span className="font-semibold text-slate-800">{user.designationBn}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">ইউজার আইডি:</span>
                        <span className="font-mono font-bold text-purple-950 bg-purple-100/70 px-1.5 py-0.5 rounded text-[11px]">{user.username}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">পাসওয়ার্ড:</span>
                        <span className="font-mono text-slate-600 bg-white px-1.5 py-0.2 rounded border text-[11px]">•••••••• ({user.password})</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">ফোন:</span>
                          <span className="font-mono text-slate-700">{user.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Permitted Modules Pills */}
                    <div>
                      <div className="text-[11px] font-bold text-slate-600 font-bangla mb-1.5 flex items-center justify-between">
                        <span>অনুমোদিত অ্যাক্সেস ({user.permissions?.length || 0}):</span>
                        {isSuper && <span className="text-[10px] text-purple-700 font-bold">সকল মডিউল</span>}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {user.permissions && user.permissions.length > 0 ? (
                          user.permissions.map(permId => {
                            const mod = SYSTEM_MODULES.find(m => m.id === permId);
                            const IconComponent = getModuleIcon(permId);
                            return (
                              <span
                                key={permId}
                                className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-semibold font-bangla"
                              >
                                <IconComponent className="w-2.5 h-2.5 text-purple-700" />
                                <span>{mod ? mod.labelBn.split('(')[0] : permId}</span>
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-[10px] text-rose-500 italic font-bangla">কোনো মডিউল অ্যাক্সেস নেই</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bangla">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      disabled={isCurrentUser}
                      className={`text-[11px] font-semibold transition px-2 py-1 rounded-lg ${
                        user.status === 'active' 
                          ? 'text-amber-800 hover:bg-amber-50' 
                          : 'text-emerald-800 hover:bg-emerald-50'
                      } ${isCurrentUser ? 'opacity-40 cursor-not-allowed' : ''}`}
                      title={isCurrentUser ? 'নিজের স্ট্যাটাস পরিবর্তন করা যাবে না' : ''}
                    >
                      {user.status === 'active' ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-1.5 text-purple-900 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
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
                        className={`p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition ${
                          isCurrentUser ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                        title={isCurrentUser ? 'নিজের অ্যাকাউন্ট মুছে ফেলা যাবে না' : 'অ্যাকাউন্ট মুছুন'}
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
          <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-md border border-purple-800">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>কার কী অ্যাক্সেস থাকবে তার নির্দেশিকা (RBAC Guide)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              সিস্টেম রোলভিত্তিক দায়িত্ব ও অ্যাক্সেস পলিসি
            </h3>
            <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-3xl leading-relaxed">
              সুপার অ্যাডমিন প্রতিটি অ্যাকাউন্টের জন্য নির্দিষ্ট মডিউলের অ্যাক্সেস নিয়ন্ত্রণ করতে পারেন। নিচে কোন রোলের কী কী অনুমতি থাকা বাঞ্ছনীয় তার একটি প্রমিত চার্ট দেওয়া হলো:
            </p>
          </div>

          {/* Detailed Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(ROLE_DEFINITIONS).map(roleKey => {
              const r = ROLE_DEFINITIONS[roleKey];
              return (
                <div key={roleKey} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${r.badgeColor}`}>
                      {r.nameBn}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 font-semibold">{r.id}</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {r.descriptionBn}
                  </p>

                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-900 block mb-1.5">অনুমোদিত ডিফল্ট মডিউলসমূহ:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {r.defaultPermissions.map(pId => {
                        const m = SYSTEM_MODULES.find(mod => mod.id === pId);
                        return (
                          <span 
                            key={pId}
                            className="bg-purple-50 text-purple-900 border border-purple-200 px-2 py-0.5 rounded text-[11px] font-semibold"
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
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">
                সকল রোল ও মডিউলের বিস্তারিত এক্সেস ম্যাট্রিক্স (Visual Matrix)
              </h4>
              <span className="text-[11px] text-slate-500">✓ = অ্যাক্সেস আছে | ✕ = অ্যাক্সেস নেই</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b">
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
                <tbody className="divide-y divide-slate-100">
                  {SYSTEM_MODULES.map(mod => (
                    <tr key={mod.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-4 font-semibold text-slate-800">
                        <div>
                          <span>{mod.labelBn}</span>
                          <span className="text-[10px] text-slate-400 block font-normal">{mod.descBn}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold inline-flex items-center justify-center text-xs">✓</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {ROLE_DEFINITIONS.headmaster.defaultPermissions.includes(mod.id) ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold inline-flex items-center justify-center text-xs">✓</span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 font-bold inline-flex items-center justify-center text-xs">✕</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {ROLE_DEFINITIONS.asst_headmaster.defaultPermissions.includes(mod.id) ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold inline-flex items-center justify-center text-xs">✓</span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 font-bold inline-flex items-center justify-center text-xs">✕</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {ROLE_DEFINITIONS.teacher.defaultPermissions.includes(mod.id) ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold inline-flex items-center justify-center text-xs">✓</span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 font-bold inline-flex items-center justify-center text-xs">✕</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {ROLE_DEFINITIONS.accountant.defaultPermissions.includes(mod.id) ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold inline-flex items-center justify-center text-xs">✓</span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 font-bold inline-flex items-center justify-center text-xs">✕</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {ROLE_DEFINITIONS.operator.defaultPermissions.includes(mod.id) ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold inline-flex items-center justify-center text-xs">✓</span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 font-bold inline-flex items-center justify-center text-xs">✕</span>
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
          <div className="bg-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 my-8 font-bangla text-xs">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-950 to-indigo-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingUser ? 'ব্যবহারকারীর তথ্য ও পারমিশন পরিবর্তন' : 'নতুন ব্যবহারকারী অ্যাকাউন্ট তৈরি করুন'}
                  </h3>
                  <p className="text-[11px] text-purple-200">
                    ইউজার তথ্য এবং মডিউলভিত্তিক এক্সেস পারমিশন নির্ধারণ করুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    পূর্ণ নাম (বাংলা): <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মো. রবিউল হক মজুমদার"
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ব্যবহারকারীর পদবী:
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: সহকারী প্রধান শিক্ষক / সহকারী শিক্ষক"
                    value={formData.designationBn}
                    onChange={(e) => setFormData({ ...formData, designationBn: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ইউজার আইডি / ইউজারনেম: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: asst_headmaster"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    পাসওয়ার্ড: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ভূমিকা (Role নির্বাচন): <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-purple-500 font-semibold bg-purple-50/50"
                  >
                    {Object.keys(ROLE_DEFINITIONS).map(key => (
                      <option key={key} value={key}>{ROLE_DEFINITIONS[key].nameBn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    অ্যাকাউন্ট স্ট্যাটাস:
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-purple-500 font-semibold"
                  >
                    <option value="active">সক্রিয় (Active - লগইন করতে পারবে)</option>
                    <option value="inactive">নিষ্ক্রিয় (Inactive - লগইন সাময়িক বন্ধ)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    মোবাইল নম্বর:
                  </label>
                  <input
                    type="text"
                    placeholder="+880 1819-XXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ইমেইল ঠিকানা:
                  </label>
                  <input
                    type="email"
                    placeholder="user@bdhs.edu.bd"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>
              </div>

              {/* PERMISSION SELECTION SECTION */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      মডিউলভিত্তিক এক্সেস পারমিশন নির্ধারণ (Select Permissions)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      এই ব্যবহারকারী ড্যাশবোর্ডে যে যে মডিউল দেখতে ও সম্পাদনা করতে পারবে তা টিক দিন
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllPermissions}
                      className="text-[11px] font-bold text-purple-700 hover:underline"
                    >
                      সব নির্বাচন করুন
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={handleClearPermissions}
                      className="text-[11px] font-bold text-slate-500 hover:underline"
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
                            ? 'bg-purple-50/60 border-purple-300' 
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        } ${isSuperOnly ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="checkbox"
                          disabled={isSuperOnly}
                          checked={isChecked}
                          onChange={() => handlePermissionToggle(mod.id)}
                          className="mt-0.5 rounded text-purple-900 focus:ring-purple-500 w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <IconComponent className="w-3.5 h-3.5 text-purple-700" />
                            <span>{mod.labelBn}</span>
                            {mod.superadminOnly && (
                              <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 rounded font-mono">
                                Super Only
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                            {mod.descBn}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-purple-900 hover:bg-purple-800 text-white px-6 py-2.5 rounded-xl font-bold transition shadow flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingUser ? 'তথ্য ও পারমিশন সংরক্ষণ করুন' : 'অ্যাকাউন্ট তৈরি নিশ্চিত করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
