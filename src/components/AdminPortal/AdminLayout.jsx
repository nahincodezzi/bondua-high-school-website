import React, { useState } from 'react';
import { useSchool } from '../../context/useSchool';
import { 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  Award, 
  Bell, 
  DollarSign, 
  Settings, 
  LogOut, 
  Globe, 
  Menu, 
  School, 
  ShieldCheck, 
  ChevronRight,
  Sliders,
  Key,
  ShieldAlert
} from 'lucide-react';
import DashboardOverview from './DashboardOverview';
import StudentManager from './StudentManager';
import AdmissionManager from './AdmissionManager';
import ResultManager from './ResultManager';
import NoticeManager from './NoticeManager';
import FeeManager from './FeeManager';
import SchoolSettings from './SchoolSettings';
import CmsContentManager from './CmsContentManager';
import TeacherManager from './TeacherManager';
import UserManager from './UserManager';

export default function AdminLayout() {
  const { authUser, logout, setActiveTab, lang, toggleLanguage, schoolInfo, hasPermission } = useSchool();
  const [activeModule, setActiveModule] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mod = params.get('module');
      if (mod) return mod;
    }
    return 'overview';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'overview', labelBn: 'ড্যাশবোর্ড ওভারভিউ', labelEn: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'users', labelBn: 'ইউজার ও এক্সেস কন্ট্রোল', labelEn: 'User & Access Control', icon: Key, badge: 'SUPER', superadminOnly: true },
    { id: 'cms', labelBn: 'কনটেন্ট ও গ্যালারি (CMS)', labelEn: 'Content & Gallery CMS', icon: Sliders, badge: 'CMS' },
    { id: 'teachers', labelBn: 'শিক্ষক পরিষদ (Faculty CMS)', labelEn: 'Faculty Directory CMS', icon: School },
    { id: 'students', labelBn: 'শিক্ষার্থী ব্যবস্থাপনা', labelEn: 'Student Management', icon: Users },
    { id: 'admissions', labelBn: 'ভর্তি আবেদন যাচাই', labelEn: 'Admission Review', icon: FileCheck },
    { id: 'results', labelBn: 'ফলাফল ও গ্রেড প্রদান', labelEn: 'Result & Marks Entry', icon: Award },
    { id: 'notices', labelBn: 'নোটিশ ও বিজ্ঞপ্তি প্রকাশ', labelEn: 'Notice Publisher', icon: Bell },
    { id: 'fees', labelBn: 'ফি ও হিসাব সংরক্ষণ', labelEn: 'Fee Collection & Accounts', icon: DollarSign },
    { id: 'settings', labelBn: 'প্রতিষ্ঠান সেটিংস', labelEn: 'School Settings', icon: Settings },
  ];

  // RBAC: Filter modules based on logged-in user permissions
  const accessibleMenuItems = menuItems.filter(item => {
    if (item.id === 'overview') return true;
    if (item.superadminOnly) return authUser?.role === 'superadmin';
    return hasPermission(item.id);
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col no-print">
      {/* Admin Top Header */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900 sticky top-0 z-30">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-emerald-900 text-white hover:bg-emerald-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              {/* Official Institutional Crest in CMS */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white p-0.5 shadow-md ring-2 ring-amber-400 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="46" fill="#064e3b" stroke="#f59e0b" strokeWidth="4"/>
                  <circle cx="50" cy="50" r="39" fill="#ffffff" stroke="#064e3b" strokeWidth="1"/>
                  <circle cx="50" cy="40" r="11" fill="#f59e0b"/>
                  <path d="M 30 58 Q 50 52 50 64 Q 50 52 70 58 L 70 66 Q 50 60 50 72 Q 50 60 30 66 Z" fill="#064e3b"/>
                  <path d="M 50 64 L 50 72" stroke="#ffffff" strokeWidth="1.5"/>
                  <polygon points="50,14 52,18 56,18 53,21 54,25 50,22 46,25 47,21 44,18 48,18" fill="#f59e0b"/>
                  <text x="50" y="80" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#064e3b">ESTD 1990</text>
                  <text x="50" y="87" textAnchor="middle" fontSize="5" fontWeight="600" fill="#64748b">EIIN: 106644</text>
                </svg>
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold font-bangla text-white leading-tight">
                  {lang === 'bn' ? schoolInfo.nameBn : schoolInfo.nameEn}
                </h1>
                <p className="text-[10px] text-amber-300 font-mono">
                  CMS & ERP Management Software • EIIN: {schoolInfo.eiin}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher in Admin Header */}
            <button
              onClick={toggleLanguage}
              className="bg-emerald-900/90 hover:bg-emerald-800 text-emerald-100 px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-emerald-800"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* User Profile Badge */}
            <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border text-[11px] sm:text-xs font-bangla ${
              authUser?.role === 'superadmin' 
                ? 'bg-purple-900/90 border-purple-500 shadow-xs' 
                : 'bg-emerald-900/80 border-emerald-800'
            }`}>
              {authUser?.role === 'superadmin' ? (
                <Key className="w-4 h-4 text-amber-300" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              )}
              <div>
                <span className="font-bold text-white block truncate max-w-[90px] sm:max-w-none">{lang === 'bn' ? (authUser?.nameBn || authUser?.name || 'অ্যাডমিন') : (authUser?.nameEn || authUser?.name || 'Admin')}</span>
                <span className="text-[10px] text-amber-300 font-mono capitalize">
                  {authUser?.role === 'superadmin' ? '👑 SUPER ADMIN' : (authUser?.designationBn || authUser?.role || 'Principal')}
                </span>
              </div>
            </div>

            {/* Back to Public Web */}
            <button
              onClick={() => setActiveTab('home')}
              className="bg-emerald-800 hover:bg-emerald-700 text-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 font-bangla"
            >
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'bn' ? 'মূল ওয়েবসাইট' : 'Public Website'}</span>
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="bg-rose-700 hover:bg-rose-600 text-white p-2 rounded-lg text-xs font-bold transition"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-200 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col justify-between shadow-xl lg:shadow-none border-r border-slate-800 pt-16 lg:pt-0`}
        >
          <div className="p-4 space-y-1 overflow-y-auto">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 py-2 font-bangla">
              {lang === 'bn' ? 'ম্যানেজমেন্ট ও সিএমএস মেনু' : 'CMS & ERP MODULES'}
            </div>

            {accessibleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              const isSuperItem = item.id === 'users';

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold font-bangla transition ${
                    isActive
                      ? isSuperItem 
                        ? 'bg-purple-900 text-white font-bold shadow' 
                        : 'bg-emerald-800 text-white font-bold shadow'
                      : isSuperItem 
                        ? 'text-purple-300 hover:bg-purple-950 hover:text-white' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : isSuperItem ? 'text-purple-400' : 'text-slate-400'}`} />
                    <span>{lang === 'bn' ? item.labelBn : item.labelEn}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                      isSuperItem ? 'bg-amber-400 text-purple-950' : 'bg-amber-400 text-emerald-950'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && !item.badge && <ChevronRight className="w-3.5 h-3.5 text-amber-300" />}
                </button>
              );
            })}
          </div>

          {/* Bottom Sidebar Info */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 font-mono">
            <div className="flex justify-between items-center text-[10px]">
              <span>CMS System Status:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Bondua Doulatpur High School</p>
          </div>
        </aside>

        {/* Sidebar Overlay on Mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          ></div>
        )}

        {/* Active Module Content Canvas */}
                {/* Active Module Content Canvas */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
            {/* Personalized Welcome Card for Logged In User */}
            <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-3.5 sm:p-4 rounded-2xl shadow-sm border border-emerald-700/60 flex flex-wrap items-center justify-between gap-3 text-xs font-bangla">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0 shadow text-sm font-sans">
                  {authUser?.nameBn ? authUser.nameBn.charAt(0) : 'অ'}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-bold text-white text-xs sm:text-sm">
                      {lang === 'bn' 
                        ? `স্বাগতম, ${authUser?.nameBn || authUser?.name || 'ব্যবহারকারী'}` 
                        : `Welcome, ${authUser?.nameEn || authUser?.name || 'User'}`
                      }
                    </span>
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.2 rounded-full font-mono">
                      {authUser?.role === 'superadmin' ? '👑 SUPER ADMIN' : (authUser?.designationBn || authUser?.role || 'Staff')}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-200 mt-0.5">
                    {lang === 'bn' 
                      ? 'ডিজিটাল ম্যানেজমেন্ট ও সিএমএস পোর্টালে আপনার সেশন সফলভাবে সক্রিয় হয়েছে।' 
                      : 'You are authenticated with full access to authorized modules.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-emerald-300 font-mono ml-auto sm:ml-0">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Session</span>
              </div>
            </div>
            {activeModule === 'overview' && <DashboardOverview onNavigate={setActiveModule} />}
            {activeModule === 'users' && (
              authUser?.role === 'superadmin' ? (
                <UserManager />
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-rose-200 text-center max-w-lg mx-auto font-bangla space-y-3">
                  <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">অননুমোদিত অ্যাক্সেস (Unauthorized Access)</h3>
                  <p className="text-xs text-slate-600">
                    এই মডিউলে প্রবেশের অধিকার শুধুমাত্র প্রধান সিস্টেম অ্যাডমিনের (Super Admin) রয়েছে।
                  </p>
                  <button
                    onClick={() => setActiveModule('overview')}
                    className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    ড্যাশবোর্ড ওভারভিউতে ফিরে যান
                  </button>
                </div>
              )
            )}
            {activeModule === 'cms' && <CmsContentManager />}
            {activeModule === 'teachers' && <TeacherManager />}
            {activeModule === 'students' && <StudentManager />}
            {activeModule === 'admissions' && <AdmissionManager />}
            {activeModule === 'results' && <ResultManager />}
            {activeModule === 'notices' && <NoticeManager />}
            {activeModule === 'fees' && <FeeManager />}
            {activeModule === 'settings' && <SchoolSettings />}
          </div>
        </main>
      </div>
    </div>
  );
}
