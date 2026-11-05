import React, { useState } from 'react';
import { useSchool } from '../context/useSchool';
import { 
  LogIn, 
  X, 
  User, 
  Lock,
  Key,
  AlertCircle
} from 'lucide-react';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authenticate, login, lang } = useSchool();
  const [role, setRole] = useState('superadmin');
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const result = authenticate(username, password);
    if (!result.success) {
      setErrorMsg(result.message);
    }
  };

  const handlePresetSelect = (presetRole, presetUser, presetPass) => {
    setRole(presetRole);
    setUsername(presetUser);
    setPassword(presetPass);
    setErrorMsg('');
  };

  const handleInstantLogin = (presetRole, presetUser, presetPass) => {
    setErrorMsg('');
    const result = authenticate(presetUser, presetPass);
    if (!result.success) {
      // Fallback
      login(presetRole, presetUser);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="glass-card max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-in fade-in duration-200">
        {/* Top Header */}
        <div className="glass-capsule p-6 relative border-b border-white/10">
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-5 right-5 p-1.5 rounded-full glass-pill hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1 font-mono">
            <Key className="w-4 h-4 text-amber-400" />
            <span>{lang === 'bn' ? 'সফটওয়্যার লগইন ও এক্সেস কন্ট্রোল' : 'Secure Portal Access'}</span>
          </div>

          <h3 className="text-xl font-bold font-bangla text-white">
            {lang === 'bn' ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়' : 'Bondua Doulatpur High School'}
          </h3>
          <p className="text-xs text-amber-200/90 font-mono mt-0.5">
            EIIN: 106644 • Management ERP & CMS System
          </p>
        </div>

        {/* Role Presets Selector Tabs */}
        <div className="p-6 sm:p-7 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 glass-pill p-1.5 rounded-2xl border border-white/10 text-[11px] font-bold font-bangla">
            <button
              type="button"
              onClick={() => handlePresetSelect('superadmin', 'superadmin', 'admin123')}
              className={`py-2 px-1.5 rounded-xl transition text-center cursor-pointer ${
                role === 'superadmin' ? 'btn-gold shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              👑 সুপার অ্যাডমিন
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('headmaster', 'headmaster', 'headmaster123')}
              className={`py-2 px-1.5 rounded-xl transition text-center cursor-pointer ${
                role === 'headmaster' ? 'btn-gold shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              👨‍💼 প্রধান শিক্ষক
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('teacher', 'teacher', 'teacher123')}
              className={`py-2 px-1.5 rounded-xl transition text-center cursor-pointer ${
                role === 'teacher' ? 'btn-gold shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              👨‍🏫 সহকারী শিক্ষক
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('operator', 'office_assistant', 'office123')}
              className={`py-2 px-1.5 rounded-xl transition text-center cursor-pointer ${
                role === 'operator' ? 'btn-gold shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              🏢 অফিস সহকারী
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-3.5 glass-card border border-rose-500/30 text-rose-300 text-xs rounded-2xl flex items-center gap-2 font-bangla">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bangla">
            <div>
              <label className="block font-bold text-slate-200 mb-1.5">
                {lang === 'bn' ? 'ব্যবহারকারীর নাম / ইউজার আইডি (Username)' : 'Username / User ID'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-3 rounded-xl font-mono text-xs font-semibold text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1.5">
                {lang === 'bn' ? 'গোপন পাসওয়ার্ড (Password)' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-3 rounded-xl font-mono text-xs font-semibold text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-gold py-3.5 rounded-full text-xs font-bold transition shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <LogIn className="w-4 h-4 text-slate-950" />
              <span>{lang === 'bn' ? 'সফটওয়্যার ড্যাশবোর্ডে প্রবেশ করুন' : 'Sign In to Portal'}</span>
            </button>
          </form>

          {/* 1-Click Quick Demo Login Buttons */}
          <div className="pt-4 border-t border-white/10">
            <span className="text-[11px] font-bold text-slate-300 block mb-2.5 font-bangla">
              ⚡ তাৎক্ষণিক ১-ক্লিকে টেস্ট করতে নিচের যেকোনো বাটনে ক্লিক করুন:
            </span>
            <div className="grid grid-cols-2 gap-2.5 text-xs font-bangla">
              <button
                type="button"
                onClick={() => handleInstantLogin('superadmin', 'superadmin', 'admin123')}
                className="glass-card hover:border-amber-400/40 p-2.5 rounded-2xl text-left transition border border-white/10 cursor-pointer"
              >
                <div className="font-bold text-white flex items-center gap-1">
                  <span>👑 সুপার অ্যাডমিন</span>
                </div>
                <div className="text-[10px] text-amber-300 font-mono mt-0.5">ID: superadmin</div>
              </button>

              <button
                type="button"
                onClick={() => handleInstantLogin('headmaster', 'headmaster', 'headmaster123')}
                className="glass-card hover:border-amber-400/40 p-2.5 rounded-2xl text-left transition border border-white/10 cursor-pointer"
              >
                <div className="font-bold text-white">👨‍💼 প্রধান শিক্ষক</div>
                <div className="text-[10px] text-amber-300 font-mono mt-0.5">ID: headmaster</div>
              </button>

              <button
                type="button"
                onClick={() => handleInstantLogin('teacher', 'teacher', 'teacher123')}
                className="glass-card hover:border-amber-400/40 p-2.5 rounded-2xl text-left transition border border-white/10 cursor-pointer"
              >
                <div className="font-bold text-white">👨‍🏫 সহকারী শিক্ষক</div>
                <div className="text-[10px] text-amber-300 font-mono mt-0.5">ID: teacher</div>
              </button>

              <button
                type="button"
                onClick={() => handleInstantLogin('operator', 'office_assistant', 'office123')}
                className="glass-card hover:border-amber-400/40 p-2.5 rounded-2xl text-left transition border border-white/10 cursor-pointer"
              >
                <div className="font-bold text-white">🏢 অফিস সহকারী</div>
                <div className="text-[10px] text-amber-300 font-mono mt-0.5">ID: office_assistant</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
