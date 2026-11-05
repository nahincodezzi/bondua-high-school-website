import React, { useState } from 'react';
import SchoolLogo from '../common/SchoolLogo';
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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col no-print relative overflow-x-hidden font-sans admin-portal">
      {/* Ambient Mesh Lighting for Admin CMS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[600px] h-[500px] bg-emerald-600/5 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-10 right-1/4 w-[600px] h-[500px] bg-amber-500/5 blur-[140px] rounded-full"></div>
      </div>

      {/* Admin Top Header - Floating Glass Capsule */}
      <header className="sticky top-0 z-30 px-3 sm:px-6 pt-3 pb-2">
        <div className="glass-capsule rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between border border-white/15 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl glass-pill text-white hover:bg-white/15 cursor-pointer"
            >
              <Menu className="w-5 h-5 text-amber-300" />
            </button>

            <div className="flex items-center gap-3">
              {/* Official Institutional Crest in CMS */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white p-0.5 shadow-md ring-2 ring-amber-400 shrink-0">
                <SchoolLogo logo={schoolInfo.logo} />
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
              className="glass-pill hover:bg-white/15 text-slate-200 px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 border border-white/15 cursor-pointer"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* User Profile Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bangla shadow-md ${
              authUser?.role === 'superadmin' 
                ? 'glass-card border-purple-400/40 text-purple-200' 
                : 'glass-card border-amber-400/30 text-amber-200'
            }`}>
              {authUser?.role === 'superadmin' ? (
                <Key className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              )}
              <div>
                <span className="font-bold text-white block truncate max-w-[80px] sm:max-w-none">{lang === 'bn' ? (authUser?.nameBn || authUser?.name || 'অ্যাডমিন') : (authUser?.nameEn || authUser?.name || 'Admin')}</span>
                <span className="text-[9px] text-amber-300 font-mono capitalize">
                  {authUser?.role === 'superadmin' ? '👑 SUPER ADMIN' : (authUser?.designationBn || authUser?.role || 'Principal')}
                </span>
              </div>
            </div>

            {/* Back to Public Web */}
            <button
              onClick={() => setActiveTab('home')}
              className="btn-gold px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 font-bangla cursor-pointer shadow-md"
            >
              <Globe className="w-3.5 h-3.5 text-slate-950" />
              <span>{lang === 'bn' ? 'মূল ওয়েবসাইট' : 'Public Website'}</span>
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="glass-pill hover:bg-rose-600 text-white p-2 rounded-full text-xs font-bold transition border border-rose-500/30 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white/95 text-slate-700 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col justify-between shadow-xl lg:shadow-none border-r border-slate-200 pt-20 lg:pt-0 backdrop-blur-md`}
        >
          <div className="p-4 space-y-1.5 overflow-y-auto">
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider px-3 py-2 font-mono">
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
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-semibold font-bangla transition cursor-pointer ${
                    isActive
                      ? isSuperItem 
                        ? 'bg-purple-900 text-white font-bold shadow-md' 
                        : 'btn-gold shadow-md font-bold'
                      : isSuperItem 
                        ? 'text-purple-700 hover:bg-purple-50' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : isSuperItem ? 'text-purple-600' : 'text-emerald-700'}`} />
                    <span>{lang === 'bn' ? item.labelBn : item.labelEn}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono ${
                      isSuperItem ? 'bg-amber-400 text-purple-950' : 'bg-slate-900 text-amber-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && !item.badge && <ChevronRight className="w-3.5 h-3.5 text-slate-950" />}
                </button>
              );
            })}
          </div>

          {/* Bottom Sidebar Info */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 font-mono">
            <div className="flex justify-between items-center text-[10px]">
              <span>CMS System Status:</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Bondua Doulatpur High School</p>
          </div>
        </aside>

        {/* Sidebar Overlay on Mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
          ></div>
        )}

        {/* Active Module Content Canvas */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
            {/* Personalized Welcome Card for Logged In User */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs font-bangla">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full btn-gold font-extrabold flex items-center justify-center shrink-0 shadow-xs text-sm font-sans text-slate-950">
                  {authUser?.nameBn ? authUser.nameBn.charAt(0) : 'অ'}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {lang === 'bn' 
                        ? `স্বাগতম, ${authUser?.nameBn || authUser?.name || 'ব্যবহারকারী'}` 
                        : `Welcome, ${authUser?.nameEn || authUser?.name || 'User'}`
                      }
                    </span>
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono">
                      {authUser?.role === 'superadmin' ? '👑 SUPER ADMIN' : (authUser?.designationBn || authUser?.role || 'Staff')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {lang === 'bn' 
                      ? 'ডিজিটাল ম্যানেজমেন্ট ও সিএমএস পোর্টালে আপনার সেশন সফলভাবে সক্রিয় হয়েছে।' 
                      : 'You are authenticated with full access to authorized modules.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-emerald-800 font-mono ml-auto sm:ml-0 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-bold">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Session</span>
              </div>
            </div>

            {activeModule === 'overview' && <DashboardOverview onNavigate={setActiveModule} />}
            {activeModule === 'users' && (
              authUser?.role === 'superadmin' ? (
                <UserManager />
              ) : (
                <div className="bg-white p-8 rounded-3xl border border-rose-200 text-center max-w-lg mx-auto font-bangla space-y-3 shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">অননুমোদিত অ্যাক্সেস (Unauthorized Access)</h3>
                  <p className="text-xs text-slate-600">
                    এই মডিউলে প্রবেশের অধিকার শুধুমাত্র প্রধান সিস্টেম অ্যাডমিনের (Super Admin) রয়েছে।
                  </p>
                  <button
                    onClick={() => setActiveModule('overview')}
                    className="btn-gold px-5 py-2 rounded-full text-xs font-bold cursor-pointer"
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
