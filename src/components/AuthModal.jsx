import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSchool } from '../context/useSchool';
import { 
  LogIn, 
  X, 
  User, 
  Lock,
  Key,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  GraduationCap,
  BookOpen,
  Building2
} from 'lucide-react';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authenticate, login, lang } = useSchool();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Close on Escape key press
  useEffect(() => {
    if (!authModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setAuthModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, setAuthModalOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (authModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [authModalOpen]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanUser = username.trim();
    const cleanPass = password.trim();
    if (!cleanUser) {
      setErrorMsg(lang === 'bn' ? 'ইউজারনেম পূরণ করা আবশ্যক।' : 'Username is required.');
      return;
    }
    if (!cleanPass) {
      setErrorMsg(lang === 'bn' ? 'পাসওয়ার্ড পূরণ করা আবশ্যক।' : 'Password is required.');
      return;
    }
    const result = await authenticate(cleanUser, cleanPass);
    if (result.success) {
      setAuthModalOpen(false);
      setActiveTab('admin');
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleDevLogin = async (presetRole, presetUser, presetPass) => {
    setErrorMsg('');
    const result = await authenticate(presetUser, presetPass);
    if (!result?.success) {
      login(presetRole, presetUser);
    }
    setAuthModalOpen(false);
    setActiveTab('admin');
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Backdrop click to close */}
      <div 
        className="fixed inset-0 -z-10" 
        onClick={() => setAuthModalOpen(false)} 
        aria-hidden="true" 
      />

      <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden border border-line animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-deep text-white p-6 relative border-b border-primary">
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider mb-1 font-mono">
            <Key className="w-4 h-4 text-accent" />
            <span>{lang === 'bn' ? 'সফটওয়্যার লগইন ও এক্সেস কন্ট্রোল' : 'Secure Portal Access'}</span>
          </div>

          <h3 id="auth-modal-title" className="text-xl font-bold font-bangla text-white">
            {lang === 'bn' ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়' : 'Bondua Daulatpur High School'}
          </h3>
          <p className="text-xs text-soft font-mono mt-0.5">
            EIIN: 106644 • Management ERP & CMS System
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-7 space-y-5 bg-white">
          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3.5 bg-danger-soft border border-danger-soft text-danger text-xs rounded-xl flex flex-col gap-1.5 font-bangla">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-danger" />
                <span className="font-medium">{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('bdhs_lockout');
                  setErrorMsg('');
                }}
                className="text-[11px] underline font-bold text-left cursor-pointer text-primary hover:text-ink mt-1"
              >
                🔄 ভুল প্রচেষ্টা রিসেট করতে এখানে চাপুন (Reset Attempts)
              </button>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bangla">
            <div>
              <label htmlFor="auth-username" className="block font-bold text-ink mb-1.5">
                {lang === 'bn' ? 'ব্যবহারকারীর নাম / ইউজার আইডি (Username)' : 'Username / User ID'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-primary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-username"
                  name="username"
                  type="text"
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={lang === 'bn' ? 'ইউজারনেম লিখুন (যেমন: superadmin)' : 'Enter username'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-line bg-bg text-ink font-mono text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-password" className="block font-bold text-ink mb-1.5">
                {lang === 'bn' ? 'গোপন পাসওয়ার্ড (Password)' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-primary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={lang === 'bn' ? 'পাসওয়ার্ড লিখুন' : 'Enter password'}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-line bg-bg text-ink font-mono text-xs font-semibold focus:ring-2 focus:ring-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-muted cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-accent py-3 rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <LogIn className="w-4 h-4 text-ink" />
              <span>{lang === 'bn' ? 'সফটওয়্যার ড্যাশবোর্ডে প্রবেশ করুন' : 'Sign In to Portal'}</span>
            </button>

            <p className="text-[10px] text-muted font-bangla text-center pt-1">
              💡 টিপস: ইউজারনেম ও পাসওয়ার্ড উভয়ই ছোট হাতের অক্ষরে (lowercase) লিখুন (যেমন: <code className="font-mono text-primary font-bold">superadmin</code> / <code className="font-mono text-primary font-bold">admin2026</code>)।
            </p>
          </form>

          {/* Development Environment Quick-Fill Helper (Only shown in DEV mode) */}
          {import.meta.env.DEV && (
            <div className="pt-4 border-t border-line">
              <span className="text-[11px] font-bold text-muted block mb-2 font-bangla">
                🛠️ ডেভেলপার টেস্টিং টুল (লোকাল ডেভ মোডে সক্রিয়):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bangla">
                <button
                  type="button"
                  onClick={() => handleDevLogin('superadmin', 'superadmin', 'admin2026')}
                  className="bg-bg hover:bg-soft/40 hover:border-primary p-2.5 rounded-xl text-left transition border border-line cursor-pointer"
                >
                  <div className="font-bold text-ink flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    <span>সুপার অ্যাডমিন</span>
                  </div>
                  <div className="text-[10px] text-primary font-mono mt-0.5">superadmin</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDevLogin('headmaster', 'headmaster', 'headmaster2026')}
                  className="bg-bg hover:bg-soft/40 hover:border-primary p-2.5 rounded-xl text-left transition border border-line cursor-pointer"
                >
                  <div className="font-bold text-ink flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-primary" />
                    <span>প্রধান শিক্ষক</span>
                  </div>
                  <div className="text-[10px] text-primary font-mono mt-0.5">headmaster</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDevLogin('asst_headmaster', 'asst_headmaster', 'assthead2026')}
                  className="bg-bg hover:bg-soft/40 hover:border-primary p-2.5 rounded-xl text-left transition border border-line cursor-pointer"
                >
                  <div className="font-bold text-ink flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-primary" />
                    <span>সহ প্রধান শিক্ষক</span>
                  </div>
                  <div className="text-[10px] text-primary font-mono mt-0.5">asst_headmaster</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDevLogin('teacher', 'teacher', 'teacher2026')}
                  className="bg-bg hover:bg-soft/40 hover:border-primary p-2.5 rounded-xl text-left transition border border-line cursor-pointer"
                >
                  <div className="font-bold text-ink flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-primary" />
                    <span>সহকারী শিক্ষক</span>
                  </div>
                  <div className="text-[10px] text-primary font-mono mt-0.5">teacher</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDevLogin('operator', 'office_assistant', 'office2026')}
                  className="bg-bg hover:bg-soft/40 hover:border-primary p-2.5 rounded-xl text-left transition border border-line cursor-pointer col-span-2 sm:col-span-1"
                >
                  <div className="font-bold text-ink flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    <span>অফিস সহকারী</span>
                  </div>
                  <div className="text-[10px] text-primary font-mono mt-0.5">office_assistant</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
