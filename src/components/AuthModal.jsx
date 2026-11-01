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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in duration-200">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 text-white p-6 relative">
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Key className="w-4 h-4" />
            <span>{lang === 'bn' ? 'সফটওয়্যার লগইন ও এক্সেস কন্ট্রোল' : 'Secure Portal Access'}</span>
          </div>

          <h3 className="text-xl font-bold font-bangla text-white">
            {lang === 'bn' ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়' : 'Bondua Doulatpur High School'}
          </h3>
          <p className="text-xs text-purple-200 font-mono mt-0.5">
            EIIN: 106644 • Management ERP & CMS System
          </p>
        </div>

        {/* Role Presets Selector Tabs */}
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-xl mb-5 text-[11px] font-bold font-bangla">
            <button
              type="button"
              onClick={() => handlePresetSelect('superadmin', 'superadmin', 'admin123')}
              className={`py-2 px-1.5 rounded-lg transition text-center ${
                role === 'superadmin' ? 'bg-purple-900 text-white shadow font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👑 সুপার অ্যাডমিন
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('headmaster', 'headmaster', 'headmaster123')}
              className={`py-2 px-1.5 rounded-lg transition text-center ${
                role === 'headmaster' ? 'bg-emerald-900 text-white shadow font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👨‍💼 ভারপ্রাপ্ত প্রধান শিক্ষক
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('teacher', 'teacher', 'teacher123')}
              className={`py-2 px-1.5 rounded-lg transition text-center ${
                role === 'teacher' ? 'bg-teal-900 text-white shadow font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👨‍🏫 সহকারী শিক্ষক
            </button>
            <button
              type="button"
              onClick={() => handlePresetSelect('operator', 'office_assistant', 'office123')}
              className={`py-2 px-1.5 rounded-lg transition text-center ${
                role === 'operator' ? 'bg-amber-800 text-white shadow font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏢 অফিস সহকারী
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-bangla">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bangla">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'ব্যবহারকারীর নাম / ইউজার আইডি (Username)' : 'Username / User ID'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 font-mono text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'bn' ? 'গোপন পাসওয়ার্ড (Password)' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 font-mono text-xs font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-950 hover:bg-purple-900 text-white font-bold py-3 rounded-xl text-xs transition shadow flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 text-amber-300" />
              <span>{lang === 'bn' ? 'সফটওয়্যার ড্যাশবোর্ডে প্রবেশ করুন' : 'Sign In to Portal'}</span>
            </button>
          </form>

          {/* 1-Click Quick Demo Login Buttons */}
          <div className="mt-5 pt-4 border-t border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 block mb-2 font-bangla">
              ⚡ তাৎক্ষণিক ১-ক্লিকে টেস্ট করতে নিচের যেকোনো বাটনে ক্লিক করুন:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-bangla">
              <button
                type="button"
                onClick={() => handleInstantLogin('superadmin', 'superadmin', 'admin123')}
                className="bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-950 p-2 rounded-xl text-left transition"
              >
                <div className="font-bold flex items-center gap-1">
                  <span>👑 সুপার অ্যাডমিন</span>
                </div>
                <div className="text-[10px] text-purple-700 font-mono">ID: superadmin (All Access)</div>
              </button>

              <button
                type="button"
                onClick={() => handleInstantLogin('headmaster', 'headmaster', 'headmaster123')}
                className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 p-2 rounded-xl text-left transition"
              >
                <div className="font-bold">👨‍💼 ভারপ্রাপ্ত প্রধান শিক্ষক</div>
                <div className="text-[10px] text-emerald-700 font-mono">ID: headmaster (জনাব বাহার উদ্দিন)</div>
              </button>

              <button
                type="button"
                onClick={() => handleInstantLogin('teacher', 'teacher', 'teacher123')}
                className="bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-950 p-2 rounded-xl text-left transition"
              >
                <div className="font-bold">👨‍🏫 সহকারী শিক্ষক</div>
                <div className="text-[10px] text-teal-700 font-mono">ID: teacher (জনাব জাহাঙ্গীর আলম)</div>
              </button>

              <button
                type="button"
                onClick={() => handleInstantLogin('operator', 'office_assistant', 'office123')}
                className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 p-2 rounded-xl text-left transition"
              >
                <div className="font-bold">🏢 অফিস সহকারী</div>
                <div className="text-[10px] text-amber-700 font-mono">ID: office_assistant (নুরুল কবির)</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
