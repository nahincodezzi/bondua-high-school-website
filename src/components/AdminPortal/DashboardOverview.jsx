import React, { useState } from 'react';
import { useSchool } from '../../context/useSchool';
import { toBanglaNumerals } from '../../utils/dateFormatter';
import { 
  Users, 
  FileCheck, 
  DollarSign, 
  ChevronRight, 
  School, 
  Sparkles,
  UserPlus,
  Award,
  Bell,
  CheckCircle2,
  Clock,
  MessageSquare
} from 'lucide-react';

export default function DashboardOverview({ onNavigate }) {
  const { 
    lang, 
    students, 
    teachers, 
    admissions, 
    fees, 
    notices,
    contactMessages,
    authUser, 
    hasPermission,
    approveAdmissionAndCreateStudent
  } = useSchool();

  const [approvalMessage, setApprovalMessage] = useState('');

  const pendingAdmissions = admissions.filter(a => a.status === 'Pending');
  const totalFeeCollected = fees.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  // Time-based greeting with full 24-hour coverage including night case (A13)
  const [greeting] = useState(() => {
    const hour = typeof window !== 'undefined' ? new Date().getHours() : 10;
    if (hour >= 0 && hour < 5) return { bn: 'শুভ নিশীথ / রাত্রি', en: 'Good Night' };
    if (hour >= 5 && hour < 12) return { bn: 'শুভ সকাল', en: 'Good Morning' };
    if (hour >= 12 && hour < 16) return { bn: 'শুভ দুপুর', en: 'Good Afternoon' };
    if (hour >= 16 && hour < 19) return { bn: 'শুভ অপরাহ্ন', en: 'Good Afternoon' };
    return { bn: 'শুভ সন্ধ্যা', en: 'Good Evening' };
  });

  // KPIs using real data from context/database (A13 & N3/A2)
  const kpis = [
    {
      titleBn: 'মোট শিক্ষার্থী',
      titleEn: 'Total Students',
      value: lang === 'bn' ? toBanglaNumerals(students.length) : students.length,
      subtextBn: 'ডাটাবেজে নিবন্ধিত শিক্ষার্থী',
      icon: Users,
      action: 'students',
      perm: 'students'
    },
    {
      titleBn: 'শিক্ষক ও কর্মচারী',
      titleEn: 'Faculty Members',
      value: lang === 'bn' ? toBanglaNumerals(teachers.length) : teachers.length,
      subtextBn: 'নিয়মিত ও অভিজ্ঞ শিক্ষক-কর্মচারী',
      icon: School,
      action: 'teachers',
      perm: 'teachers'
    },
    {
      titleBn: 'অপেক্ষমাণ ভর্তি আবেদন',
      titleEn: 'Pending Admissions',
      value: hasPermission('admissions')
        ? (lang === 'bn' ? toBanglaNumerals(pendingAdmissions.length) : pendingAdmissions.length)
        : '🔒 সংরক্ষিত',
      subtextBn: hasPermission('admissions') ? '২০২৬ শিক্ষাবর্ষ' : 'ভর্তি কমিটির জন্য সংরক্ষিত',
      icon: FileCheck,
      action: 'admissions',
      perm: 'admissions'
    },
    {
      titleBn: 'মোট ফি আদায়',
      titleEn: 'Fee Collection',
      value: hasPermission('fees')
        ? (lang === 'bn' ? `৳${toBanglaNumerals(totalFeeCollected.toLocaleString())}` : `৳${totalFeeCollected.toLocaleString()}`)
        : '🔒 সংরক্ষিত',
      subtextBn: hasPermission('fees') ? 'সংরক্ষিত মানি রিসিট' : 'হিসাব বিভাগের জন্য সংরক্ষিত',
      icon: DollarSign,
      action: 'fees',
      perm: 'fees'
    }
  ];

  // Quick Action Shortcuts filtered strictly by user permissions (A2)
  const quickActions = [
    { id: 'students', labelBn: 'নতুন শিক্ষার্থী ভর্তি করুন', icon: UserPlus, perm: 'students' },
    { id: 'results', labelBn: 'পরীক্ষার মার্কস এন্ট্রি ও প্রকাশ', icon: Award, perm: 'results' },
    { id: 'fees', labelBn: 'ফি কালেকশন ও মানি রিসিট', icon: DollarSign, perm: 'fees' },
    { id: 'notices', labelBn: 'নোটিশ ও সার্কুলার তৈরি', icon: Bell, perm: 'notices' },
    { id: 'admissions', labelBn: 'ভর্তি আবেদন যাচাই', icon: FileCheck, perm: 'admissions' }
  ].filter(action => hasPermission(action.perm));

  const handleApprove = (app) => {
    if (!hasPermission('admissions')) {
      alert('অননুমোদিত: আপনার এই আবেদনটি অনুমোদন করার অনুমতি নেই।');
      return;
    }

    if (confirm(`আপনি কি "${app.studentNameBn || app.studentNameEn}"-এর আবেদন অনুমোদন করে স্বয়ংক্রিয়ভাবে শিক্ষার্থী রেকর্ড তৈরি করতে চান?`)) {
      const createdStudent = approveAdmissionAndCreateStudent(app);
      setApprovalMessage(`আবেদন সফলভাবে অনুমোদিত হয়েছে! ${createdStudent.nameBn}-কে শ্রেণি ${createdStudent.class}, রোল ${createdStudent.roll} বরাদ্দ করা হয়েছে।`);
      setTimeout(() => setApprovalMessage(''), 5000);
    }
  };

  return (
    <div className="space-y-6 text-ink font-sans">
      {/* Welcome Banner */}
      <div className="card-base p-6 sm:p-8 rounded-2xl shadow-xs border border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 bg-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-primary text-xs font-bold font-mono">SYSTEM DASHBOARD</span>
            <span className="bg-warning-soft text-warning border border-accent text-[10px] font-bold px-3 py-1 rounded-full font-bangla flex items-center gap-1">
              <Clock className="w-3 h-3 text-warning" />
              <span>{lang === 'bn' ? greeting.bn : greeting.en}</span>
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold font-bangla text-ink mt-1.5">
            {lang === 'bn' 
              ? `স্বাগতম, ${(authUser?.nameBn && !authUser.nameBn.includes('রবিউল')) ? authUser.nameBn : (authUser?.role === 'superadmin' ? 'প্রধান সিস্টেম অ্যাডমিনিস্ট্রেটর' : 'জনাব বাহার উদ্দিন ভূঁইয়া')} (${authUser?.designationBn || authUser?.designation || authUser?.role || 'প্রশাসক'})` 
              : `Welcome, ${(authUser?.nameEn && !authUser.nameEn.includes('Rabiul')) ? authUser.nameEn : (authUser?.role === 'superadmin' ? 'Super Administrator' : 'Mr. Bahar Uddin Bhuiyan')} (${authUser?.designationEn || authUser?.designation || authUser?.role || 'Administrator'})`
            }
          </h2>
          <p className="text-xs text-muted font-bangla mt-1">
            {lang === 'bn'
              ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় ডিজিটাল ম্যানেজমেন্ট সফটওয়্যারে আপনাকে স্বাগতম।'
              : 'Welcome to Bandua Daulatpur High School Digital Management ERP.'
            }
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2.5 w-full sm:w-auto">
          {hasPermission('admissions') && (
            <button
              onClick={() => onNavigate('admissions')}
              className="flex-1 sm:flex-initial btn-accent px-4 py-2.5 rounded-lg text-xs font-bangla shadow-xs text-center cursor-pointer font-bold"
            >
              ভর্তি আবেদন যাচাই ({lang === 'bn' ? toBanglaNumerals(pendingAdmissions.length) : pendingAdmissions.length})
            </button>
          )}
          {hasPermission('notices') && (
            <button
              onClick={() => onNavigate('notices')}
              className="flex-1 sm:flex-initial btn-secondary px-4 py-2.5 rounded-lg text-xs font-bangla transition text-center cursor-pointer"
            >
              নতুন নোটিশ দিন
            </button>
          )}
        </div>
      </div>

      {/* Success Alert Banner for Student Creation (A10) */}
      {approvalMessage && (
        <div className="p-4 bg-soft text-deep rounded-xl text-xs font-bold flex items-center gap-2 border border-soft-border">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
          <span>{approvalMessage}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          const isAllowed = hasPermission(kpi.perm);
          return (
            <div
              key={idx}
              onClick={() => isAllowed && onNavigate(kpi.action)}
              className={`card-base p-5 rounded-2xl border border-line shadow-xs transition flex flex-col justify-between bg-white ${
                isAllowed ? 'hover:shadow-md cursor-pointer hover:border-primary' : 'opacity-80 cursor-default'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-muted font-bangla">
                  {lang === 'bn' ? kpi.titleBn : kpi.titleEn}
                </span>
                <span className="p-2 rounded-xl bg-soft text-deep">
                  <Icon className="w-4 h-4 text-primary" />
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-ink font-mono">
                  {kpi.value}
                </span>
                <p className="text-[11px] text-muted font-bangla mt-1">{kpi.subtextBn}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Recent Admission Applications & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Online Admission Applications OR Academic Notices for Teachers (N3/A2) */}
        <div className="lg:col-span-8 card-base rounded-2xl p-6 border border-line shadow-xs space-y-4 bg-white">
          {hasPermission('admissions') ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-bangla text-ink flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-primary" />
                    <span>সাম্প্রতিক অনলাইন ভর্তি আবেদন সমূহ</span>
                  </h3>
                  <p className="text-[11px] text-muted font-bangla">ওয়েবসাইটের মাধ্যমে শিক্ষার্থীদের পাঠানো আবেদন</p>
                </div>
                <button
                  onClick={() => onNavigate('admissions')}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 font-bangla cursor-pointer"
                >
                  <span>সকল দেখুন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-line">
                <table className="w-full text-left text-xs font-bangla">
                  <thead className="bg-bg text-ink font-bold border-b border-line">
                    <tr>
                      <th className="py-3 px-3">ট্র্যাকিং আইডি</th>
                      <th className="py-3 px-3">শিক্ষার্থীর নাম</th>
                      <th className="py-3 px-3">শ্রেণি</th>
                      <th className="py-3 px-3">অভিভাবকের মোবাইল</th>
                      <th className="py-3 px-3 text-center">স্ট্যাটাস</th>
                      <th className="py-3 px-3 text-center">কার্যক্রম</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {admissions.slice(0, 5).map((app) => (
                      <tr key={app.id} className="hover:bg-bg transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-primary">{app.trackingId}</td>
                        <td className="py-3 px-3 font-semibold text-ink">{app.studentNameBn || app.studentNameEn}</td>
                        <td className="py-3 px-3 font-medium text-ink">
                          {lang === 'bn' ? `${toBanglaNumerals(app.applyingClass)} শ্রেণি` : `Class ${app.applyingClass}`}
                        </td>
                        <td className="py-3 px-3 font-mono text-muted">{app.guardianPhone}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            app.status === 'Approved' ? 'bg-soft text-deep border border-soft-border' : 'bg-warning-soft text-warning border border-accent'
                          }`}>
                            {app.status === 'Approved' ? 'অনুমোদিত' : 'অপেক্ষমাণ'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {app.status === 'Pending' ? (
                            <button
                              onClick={() => handleApprove(app)}
                              className="btn-accent px-2.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer shadow-xs"
                              title="অনুমোদন ও শিক্ষার্থী তৈরি করুন"
                            >
                              অনুমোদন ও ভর্তি
                            </button>
                          ) : (
                            <span className="text-[10px] text-success font-bold flex items-center justify-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3 text-success" />
                              <span>ভর্তি সম্পন্ন</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-line">
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-bangla text-ink flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" />
                    <span>সাম্প্রতিক নোটিশ ও সার্কুলার</span>
                  </h3>
                  <p className="text-[11px] text-muted font-bangla">শিক্ষক ও কর্মকর্তা ড্যাশবোর্ড আপডেট</p>
                </div>
                {hasPermission('notices') && (
                  <button
                    onClick={() => onNavigate('notices')}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 font-bangla cursor-pointer"
                  >
                    <span>সকল নোটিশ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="overflow-x-auto rounded-xl border border-line">
                <table className="w-full text-left text-xs font-bangla">
                  <thead className="bg-bg text-ink font-bold border-b border-line">
                    <tr>
                      <th className="py-3 px-3">শিরোনাম / বিষয়</th>
                      <th className="py-3 px-3">বিভাগ</th>
                      <th className="py-3 px-3">প্রকাশের তারিখ</th>
                      <th className="py-3 px-3 text-center">কার্যক্রম</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {(notices || []).slice(0, 5).map((n) => (
                      <tr key={n.id} className="hover:bg-bg transition-colors">
                        <td className="py-3 px-3 font-semibold text-ink">{n.titleBn || n.titleEn}</td>
                        <td className="py-3 px-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bg text-ink">
                            {n.category === 'exam' ? 'পরীক্ষা' : n.category === 'academic' ? 'একাডেমিক' : 'সাধারণ'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-muted">{n.date}</td>
                        <td className="py-3 px-3 text-center">
                          {hasPermission('notices') ? (
                            <button
                              onClick={() => onNavigate('notices')}
                              className="text-primary hover:underline font-bold text-xs"
                            >
                              সম্পাদনা
                            </button>
                          ) : (
                            <span className="text-muted">পর্যবেক্ষণ</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Visitor Messages Section (C4 Fix) */}
          <div className="pt-4 border-t border-line">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-sm font-bold font-bangla text-ink flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span>ওয়েবসাইট থেকে আসা বার্তা ও অনুসন্ধান (Visitor Messages)</span>
                </h3>
                <p className="text-[11px] text-muted font-bangla">
                  অভিভাবক ও দর্শনার্থীদের পাঠানো বার্তা ({contactMessages ? (lang === 'bn' ? toBanglaNumerals(contactMessages.length) : contactMessages.length) : 0}টি)
                </p>
              </div>
            </div>

            {(!contactMessages || contactMessages.length === 0) ? (
              <p className="text-xs text-muted text-center py-4 bg-bg rounded-xl border border-line">
                বর্তমানে কোনো নতুন বার্তা নেই।
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {contactMessages.slice(0, 5).map((msg) => (
                  <div key={msg.id} className="p-3 bg-bg rounded-xl border border-line text-xs font-bangla flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink">{msg.name}</span>
                      <span className="font-mono text-primary text-[11px] font-semibold">{msg.phone}</span>
                    </div>
                    {msg.subject && <span className="font-semibold text-deep text-[11px]">{msg.subject}</span>}
                    <p className="text-muted text-[11px] line-clamp-2">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick ERP Navigation Tiles (Filtered by RBAC - A2) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card-base rounded-2xl p-6 border border-line shadow-xs space-y-3 bg-white">
            <h3 className="text-sm font-bold font-bangla text-ink pb-2 border-b border-line flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>দ্রুত কার্যক্রম</span>
            </h3>

            <div className="space-y-2 text-xs font-bangla">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => onNavigate(action.id, action.id === 'students' ? { openAdd: true } : {})}
                    className="w-full p-3 bg-bg hover:bg-soft/40 hover:border-primary rounded-xl text-left font-semibold text-ink transition flex items-center justify-between border border-line shadow-2xs cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <span>{action.labelBn}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* School Contact Card */}
          <div className="card-base rounded-2xl p-5 text-xs space-y-2 border border-line shadow-xs bg-white">
            <span className="text-deep font-bold block">প্রাতিষ্ঠানিক হেল্পডেস্ক</span>
            <p className="text-muted font-bangla leading-relaxed">
              কারিগরি সহায়তা ও সার্ভার রক্ষণাবেক্ষণ সংক্রান্ত তথ্যের জন্য বিদ্যালয়ের আইসিটি ল্যাবে যোগাযোগ করুন।
            </p>
            <p className="font-mono text-primary font-bold">হটলাইন: +880 1819-204561</p>
          </div>
        </div>
      </div>
    </div>
  );
}
