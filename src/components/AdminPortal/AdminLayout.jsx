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
import ErrorBoundary from '../common/ErrorBoundary';

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
    <div className="min-h-screen bg-[#F7F9F8] text-[#1F2937] flex flex-col no-print relative overflow-x-hidden font-sans admin-portal">
      {/* Admin Top Header - Dark Green Institutional Bar (P3) */}
      <header className="sticky top-0 z-30 bg-[#14532D] text-white border-b border-[#166534] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2">
          {/* Left Brand Area */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg text-white hover:bg-white/10 cursor-pointer shrink-0"
              aria-label="মেনু খুলুন"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Official Institutional Crest */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white p-0.5 shadow-xs ring-1 ring-white/20 shrink-0">
                <SchoolLogo logo={schoolInfo.logo} />
              </div>
              <div className="min-w-0">
                <h1 className="text-xs sm:text-base font-semibold font-bangla text-white leading-tight truncate">
                  {lang === 'bn' ? schoolInfo.nameBn : schoolInfo.nameEn}
                </h1>
                <p className="text-[10px] sm:text-[11px] text-emerald-200 hidden sm:block truncate">
                  CMS & ERP Management • EIIN: {schoolInfo.eiin}
                </p>
              </div>
            </div>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Language Switcher - Outline Button (hidden on < sm, available in mobile drawer) */}
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex bg-transparent hover:bg-white/10 text-white px-2.5 py-1.5 rounded-[8px] text-xs font-medium transition items-center gap-1.5 border border-white/30 cursor-pointer"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-200" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* User Profile Badge - High Contrast White Pill */}
            <div className="bg-white text-[#1F2937] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/20 text-xs font-bangla shadow-xs flex items-center gap-1.5 sm:gap-2">
              <div className="w-2 h-2 rounded-full bg-[#15803D] shrink-0"></div>
              <div className="min-w-0">
                <span className="font-semibold block truncate max-w-[70px] sm:max-w-[120px] text-[#1F2937]">
                  {lang === 'bn' ? (authUser?.nameBn || authUser?.name || 'অ্যাডমিন') : (authUser?.nameEn || authUser?.name || 'Admin')}
                </span>
                <span className="text-[10px] text-[#4B5563] hidden sm:block -mt-0.5 font-sans truncate">
                  {authUser?.role === 'superadmin' ? 'Super Admin' : (authUser?.designationBn || authUser?.role || 'Staff')}
                </span>
              </div>
            </div>

            {/* Back to Public Web - Amber CTA (hidden on < md, available in mobile drawer) */}
            <button
              onClick={() => setActiveTab('home')}
              className="hidden md:flex bg-[#F59E0B] hover:bg-[#D97706] text-[#1F2937] px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition items-center gap-1.5 font-bangla cursor-pointer shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-[#1F2937]" />
              <span>{lang === 'bn' ? 'মূল ওয়েবসাইট' : 'Public Website'}</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="bg-transparent hover:bg-[#DC2626] text-white p-1.5 sm:p-2 rounded-full text-xs transition border border-white/20 cursor-pointer shrink-0"
              title={lang === 'bn' ? 'লগআউট' : 'Logout'}
              aria-label="লগআউট"
            >
              <LogOut className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Sidebar (P10) */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white text-[#1F2937] transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col justify-between border-r border-[#E5E7EB] pt-16 lg:pt-0`}
        >
          <div className="p-3.5 space-y-1 overflow-y-auto">
            <div className="text-[11px] font-semibold text-[#166534] uppercase tracking-wider px-3 py-2 font-bangla">
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[8px] text-xs font-medium font-bangla transition cursor-pointer gap-2 ${
                    isActive
                      ? 'bg-[#DCFCE7] text-[#14532D] font-semibold'
                      : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#1F2937]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#166534]' : 'text-[#4B5563]'}`} />
                    <span className="truncate">{lang === 'bn' ? item.labelBn : item.labelEn}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                      isSuperItem 
                        ? 'bg-[#FEF3C7] text-[#B45309] font-bold' 
                        : 'bg-[#F3F4F6] border border-[#D1D5DB] text-[#374151] font-medium'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && !item.badge && <ChevronRight className="w-3.5 h-3.5 text-[#166534] shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Bottom Sidebar Info */}
          <div className="p-3.5 bg-[#F7F9F8] border-t border-[#E5E7EB] text-xs text-[#4B5563] space-y-2.5">
            {/* Quick Actions for Mobile in Sidebar */}
            <div className="lg:hidden space-y-1.5 pb-2.5 border-b border-[#E5E7EB]">
              <button
                onClick={() => { setActiveTab('home'); setSidebarOpen(false); }}
                className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-[#1F2937] px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Globe className="w-3.5 h-3.5 text-[#1F2937]" />
                <span>{lang === 'bn' ? 'মূল ওয়েবসাইট' : 'Public Website'}</span>
              </button>
              <div className="flex gap-1.5">
                <button
                  onClick={toggleLanguage}
                  className="flex-1 bg-white hover:bg-[#F3F4F6] border border-[#D1D5DB] text-[#1F2937] px-2 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Globe className="w-3 h-3 text-[#166534]" />
                  <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
                </button>
                <button
                  onClick={logout}
                  className="flex-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3 h-3 text-rose-700" />
                  <span>{lang === 'bn' ? 'লগআউট' : 'Logout'}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span>সফটওয়্যার স্ট্যাটাস:</span>
              <span className="text-[#15803D] font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#15803D]"></span> সক্রিয়
              </span>
            </div>
            <p className="text-[10px] text-[#4B5563] mt-0.5">বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়</p>
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#F7F9F8]">
          <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
            {/* Personalized Welcome Card for Logged In User (P12) */}
            <div className="bg-white p-4 sm:p-5 rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex flex-wrap items-center justify-between gap-4 text-xs font-bangla">
              <div className="flex items-center gap-3.5">
                {/* Avatar in soft green (P12) */}
                <div className="w-10 h-10 rounded-full bg-[#DCFCE7] text-[#14532D] font-bold flex items-center justify-center shrink-0 text-sm">
                  {authUser?.nameBn ? authUser.nameBn.charAt(0) : 'অ'}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-[#1F2937] text-sm">
                      {lang === 'bn' 
                        ? `স্বাগতম, ${authUser?.nameBn || authUser?.name || 'ব্যবহারকারী'}` 
                        : `Welcome, ${authUser?.nameEn || authUser?.name || 'User'}`
                      }
                    </span>
                    {/* Role Tag in soft green (P12) */}
                    <span className="bg-[#DCFCE7] text-[#14532D] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                      {authUser?.role === 'superadmin' ? 'সুপার অ্যাডমিন' : (authUser?.designationBn || authUser?.role || 'Staff')}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#4B5563] mt-0.5">
                    {lang === 'bn' 
                      ? 'ডিজিটাল ম্যানেজমেন্ট ও সিএমএস পোর্টালে আপনার সেশন সফলভাবে সক্রিয় রয়েছে।' 
                      : 'You are authenticated with full access to authorized modules.'}
                  </p>
                </div>
              </div>
              {/* Session Pill in success style with normal font (P12) */}
              <div className="flex items-center gap-2 text-xs text-[#14532D] bg-[#DCFCE7] px-3 py-1 rounded-full font-medium ml-auto sm:ml-0">
                <span className="w-2 h-2 rounded-full bg-[#15803D]"></span>
                <span>সক্রিয় সেশন (Active)</span>
              </div>
            </div>

            <ErrorBoundary key={activeModule} onReset={() => setActiveModule('overview')}>
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
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
