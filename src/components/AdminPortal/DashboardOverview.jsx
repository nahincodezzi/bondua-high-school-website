import React, { useState } from 'react';
import { useSchool } from '../../context/useSchool';
import { toBanglaNumerals, toEnglishNumerals } from '../../utils/dateFormatter';
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
  MessageSquare,
  Phone,
  Mail,
  Trash2
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
    deleteContactMessage,
    authUser, 
    schoolInfo,
    hasPermission,
    approveAdmissionAndCreateStudent
  } = useSchool();

  const [approvalMessage, setApprovalMessage] = useState('');
  const sessionYearBn = toBanglaNumerals(schoolInfo?.academicYear || '2026');
  const sessionYearEn = toEnglishNumerals(schoolInfo?.academicYear || '2026');

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
      subtextEn: 'Enrolled students in database',
      icon: Users,
      action: 'students',
      perm: 'students'
    },
    {
      titleBn: 'শিক্ষক ও কর্মচারী',
      titleEn: 'Faculty Members',
      value: lang === 'bn' ? toBanglaNumerals(teachers.length) : teachers.length,
      subtextBn: 'নিয়মিত ও অভিজ্ঞ শিক্ষক-কর্মচারী',
      subtextEn: 'Active teaching & office staff',
      icon: School,
      action: 'teachers',
      perm: 'teachers'
    },
    {
      titleBn: 'অপেক্ষমাণ ভর্তি আবেদন',
      titleEn: 'Pending Admissions',
      value: hasPermission('admissions')
        ? (lang === 'bn' ? toBanglaNumerals(pendingAdmissions.length) : pendingAdmissions.length)
        : (lang === 'bn' ? '🔒 সংরক্ষিত' : '🔒 Restricted'),
      subtextBn: hasPermission('admissions') ? `${sessionYearBn} শিক্ষাবর্ষ` : 'ভর্তি কমিটির জন্য সংরক্ষিত',
      subtextEn: hasPermission('admissions') ? `Academic Session ${sessionYearEn}` : 'Restricted to Admission Committee',
      icon: FileCheck,
      action: 'admissions',
      perm: 'admissions'
    },
    {
      titleBn: 'মোট ফি আদায়',
      titleEn: 'Fee Collection',
      value: hasPermission('fees')
        ? (lang === 'bn' ? `৳${toBanglaNumerals(totalFeeCollected.toLocaleString())}` : `৳${totalFeeCollected.toLocaleString()}`)
        : (lang === 'bn' ? '🔒 সংরক্ষিত' : '🔒 Restricted'),
      subtextBn: hasPermission('fees') ? 'সংরক্ষিত মানি রিসিট' : 'হিসাব বিভাগের জন্য সংরক্ষিত',
      subtextEn: hasPermission('fees') ? 'Recorded official receipts' : 'Restricted to Accounts Office',
      icon: DollarSign,
      action: 'fees',
      perm: 'fees'
    }
  ];

  // Quick Action Shortcuts filtered strictly by user permissions (A2)
  const quickActions = [
    { id: 'students', labelBn: 'নতুন শিক্ষার্থী ভর্তি করুন', labelEn: 'Enroll New Student', icon: UserPlus, perm: 'students' },
    { id: 'results', labelBn: 'পরীক্ষার মার্কস এন্ট্রি ও প্রকাশ', labelEn: 'Enter & Publish Exam Marks', icon: Award, perm: 'results' },
    { id: 'fees', labelBn: 'ফি কালেকশন ও মানি রিসিট', labelEn: 'Fee Collection & Receipts', icon: DollarSign, perm: 'fees' },
    { id: 'notices', labelBn: 'নোটিশ ও সার্কুলার তৈরি', labelEn: 'Publish Notice & Circular', icon: Bell, perm: 'notices' },
    { id: 'admissions', labelBn: 'ভর্তি আবেদন যাচাই', labelEn: 'Review Admissions', icon: FileCheck, perm: 'admissions' }
  ].filter(action => hasPermission(action.perm));

  const handleApprove = (app) => {
    if (!hasPermission('admissions')) {
      alert(lang === 'bn' ? 'অননুমোদিত: আপনার এই আবেদনটি অনুমোদন করার অনুমতি নেই।' : 'Unauthorized: You do not have permission to approve this application.');
      return;
    }

    const applicantLabel = lang === 'bn' ? (app.studentNameBn || app.studentNameEn) : (app.studentNameEn || app.studentNameBn);
    const confirmPrompt = lang === 'bn'
      ? `আপনি কি "${applicantLabel}"-এর আবেদন অনুমোদন করে স্বয়ংক্রিয়ভাবে শিক্ষার্থী রেকর্ড তৈরি করতে চান?`
      : `Approve "${applicantLabel}" and automatically create a student record?`;

    if (confirm(confirmPrompt)) {
      const createdStudent = approveAdmissionAndCreateStudent(app);
      setApprovalMessage(
        lang === 'bn'
          ? `আবেদন সফলভাবে অনুমোদিত হয়েছে! ${createdStudent.nameBn}-কে শ্রেণি ${createdStudent.class}, রোল ${createdStudent.roll} বরাদ্দ করা হয়েছে।`
          : `Application approved! Assigned ${createdStudent.nameEn || createdStudent.nameBn} to Class ${createdStudent.class}, Roll ${createdStudent.roll}.`
      );
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
              : `Welcome, ${(authUser?.nameEn && !authUser.nameEn.includes('Rabiul')) ? authUser.nameEn : (authUser?.role === 'superadmin' ? 'Super Administrator' : 'Mr. Bahar Uddin Bhuiyan')} (${(authUser?.designationEn || authUser?.designation || authUser?.role || 'Administrator').replace(/\s*\(Head Master,\s*In Charge\)/gi, '').trim()})`
            }
          </h2>
          <p className="text-xs text-muted font-bangla mt-1">
            {lang === 'bn'
              ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় ডিজিটাল ম্যানেজমেন্ট সফটওয়্যারে আপনাকে স্বাগতম।'
              : 'Welcome to Bondua Daulatpur High School Digital Management ERP.'
            }
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2.5 w-full sm:w-auto">
          {hasPermission('admissions') && (
            <button
              onClick={() => onNavigate('admissions')}
              className="flex-1 sm:flex-initial btn-accent px-4 py-2.5 rounded-lg text-xs font-bangla shadow-xs text-center cursor-pointer font-bold whitespace-nowrap"
            >
              {lang === 'bn'
                ? `ভর্তি আবেদন যাচাই (${toBanglaNumerals(pendingAdmissions.length)})`
                : `Review Admissions (${pendingAdmissions.length})`}
            </button>
          )}
          {hasPermission('notices') && (
            <button
              onClick={() => onNavigate('notices')}
              className="flex-1 sm:flex-initial btn-secondary px-4 py-2.5 rounded-lg text-xs font-bangla transition text-center cursor-pointer whitespace-nowrap"
            >
              {lang === 'bn' ? 'নতুন নোটিশ দিন' : 'New Notice'}
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
                <p className="text-[11px] text-muted font-bangla mt-1">{lang === 'bn' ? kpi.subtextBn : kpi.subtextEn}</p>
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
                    <FileCheck className="w-4 h-4 text-primary shrink-0" />
                    <span>{lang === 'bn' ? 'সাম্প্রতিক অনলাইন ভর্তি আবেদন সমূহ' : 'Recent Online Admission Applications'}</span>
                  </h3>
                  <p className="text-[11px] text-muted font-bangla">
                    {lang === 'bn' ? 'ওয়েবসাইটের মাধ্যমে শিক্ষার্থীদের পাঠানো আবেদন' : 'Student applications submitted via the website'}
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('admissions')}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 font-bangla cursor-pointer whitespace-nowrap"
                >
                  <span>{lang === 'bn' ? 'সকল দেখুন' : 'View All'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-line">
                <table className="w-full text-left text-xs font-bangla">
                  <thead className="bg-bg text-ink font-bold border-b border-line">
                    <tr>
                      <th className="py-3 px-3">{lang === 'bn' ? 'ট্র্যাকিং আইডি' : 'Tracking ID'}</th>
                      <th className="py-3 px-3">{lang === 'bn' ? 'শিক্ষার্থীর নাম' : 'Applicant Name'}</th>
                      <th className="py-3 px-3">{lang === 'bn' ? 'শ্রেণি' : 'Class'}</th>
                      <th className="py-3 px-3">{lang === 'bn' ? 'অভিভাবকের মোবাইল' : 'Guardian Phone'}</th>
                      <th className="py-3 px-3 text-center">{lang === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                      <th className="py-3 px-3 text-center">{lang === 'bn' ? 'কার্যক্রম' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {admissions.slice(0, 5).map((app) => (
                      <tr key={app.id} className="hover:bg-bg transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-primary whitespace-nowrap">{app.trackingId}</td>
                        <td className="py-3 px-3 font-semibold text-ink">
                          {lang === 'bn' ? (app.studentNameBn || app.studentNameEn) : (app.studentNameEn || app.studentNameBn)}
                        </td>
                        <td className="py-3 px-3 font-medium text-ink whitespace-nowrap">
                          {lang === 'bn' ? `${toBanglaNumerals(app.applyingClass)} শ্রেণি` : `Class ${app.applyingClass}`}
                        </td>
                        <td className="py-3 px-3 font-mono text-muted whitespace-nowrap">
                          {lang === 'bn' ? app.guardianPhone : toEnglishNumerals(app.guardianPhone)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                            app.status === 'Approved' ? 'bg-soft text-deep border border-soft-border' : 'bg-warning-soft text-warning border border-accent'
                          }`}>
                            {app.status === 'Approved' ? (lang === 'bn' ? 'অনুমোদিত' : 'Approved') : (lang === 'bn' ? 'অপেক্ষমাণ' : 'Pending')}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          {app.status === 'Pending' ? (
                            <button
                              onClick={() => handleApprove(app)}
                              className="btn-accent px-2.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer shadow-xs whitespace-nowrap"
                              title={lang === 'bn' ? 'অনুমোদন ও শিক্ষার্থী তৈরি করুন' : 'Approve and enroll student'}
                            >
                              {lang === 'bn' ? 'অনুমোদন ও ভর্তি' : 'Approve & Enroll'}
                            </button>
                          ) : (
                            <span className="text-[10px] text-success font-bold flex items-center justify-center gap-0.5 whitespace-nowrap">
                              <CheckCircle2 className="w-3 h-3 text-success" />
                              <span>{lang === 'bn' ? 'ভর্তি সম্পন্ন' : 'Enrolled'}</span>
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
                    <Bell className="w-4 h-4 text-primary shrink-0" />
                    <span>{lang === 'bn' ? 'সাম্প্রতিক নোটিশ ও সার্কুলার' : 'Recent Notices & Circulars'}</span>
                  </h3>
                  <p className="text-[11px] text-muted font-bangla">
                    {lang === 'bn' ? 'শিক্ষক ও কর্মকর্তা ড্যাশবোর্ড আপডেট' : 'Staff & Faculty Portal Updates'}
                  </p>
                </div>
                {hasPermission('notices') && (
                  <button
                    onClick={() => onNavigate('notices')}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 font-bangla cursor-pointer whitespace-nowrap"
                  >
                    <span>{lang === 'bn' ? 'সকল নোটিশ' : 'All Notices'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="overflow-x-auto rounded-xl border border-line">
                <table className="w-full text-left text-xs font-bangla">
                  <thead className="bg-bg text-ink font-bold border-b border-line">
                    <tr>
                      <th className="py-3 px-3">{lang === 'bn' ? 'শিরোনাম / বিষয়' : 'Notice Title'}</th>
                      <th className="py-3 px-3">{lang === 'bn' ? 'বিভাগ' : 'Category'}</th>
                      <th className="py-3 px-3">{lang === 'bn' ? 'প্রকাশের তারিখ' : 'Date'}</th>
                      <th className="py-3 px-3 text-center">{lang === 'bn' ? 'কার্যক্রম' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {(notices || []).slice(0, 5).map((n) => (
                      <tr key={n.id} className="hover:bg-bg transition-colors">
                        <td className="py-3 px-3 font-semibold text-ink">
                          {lang === 'bn' ? (n.titleBn || n.titleEn) : (n.titleEn || n.titleBn)}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bg text-ink whitespace-nowrap">
                            {n.category === 'exam'
                              ? (lang === 'bn' ? 'পরীক্ষা' : 'Exam')
                              : n.category === 'academic'
                                ? (lang === 'bn' ? 'একাডেমিক' : 'Academic')
                                : (lang === 'bn' ? 'সাধারণ' : 'General')}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-muted whitespace-nowrap">{n.date}</td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          {hasPermission('notices') ? (
                            <button
                              onClick={() => onNavigate('notices')}
                              className="text-primary hover:underline font-bold text-xs cursor-pointer"
                            >
                              {lang === 'bn' ? 'সম্পাদনা' : 'Edit'}
                            </button>
                          ) : (
                            <span className="text-muted">{lang === 'bn' ? 'পর্যবেক্ষণ' : 'View'}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Visitor Messages Section */}
          <div className="pt-5 border-t border-line">
            <div className="flex items-center justify-between pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold font-bangla text-ink flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span>{lang === 'bn' ? 'ওয়েবসাইট থেকে আসা বার্তা ও অনুসন্ধান (Visitor Messages)' : 'Website Inquiries & Visitor Messages'}</span>
                </h3>
                <p className="text-[11px] text-muted font-bangla mt-0.5">
                  {lang === 'bn'
                    ? `অভিভাবক ও দর্শনার্থীদের পাঠানো সাম্প্রতিক বার্তা (${contactMessages ? toBanglaNumerals(contactMessages.length) : 0}টি)`
                    : `Recent messages from guardians & visitors (${contactMessages ? contactMessages.length : 0})`}
                </p>
              </div>
            </div>

            {(!contactMessages || contactMessages.length === 0) ? (
              <div className="p-6 text-center bg-bg rounded-2xl border border-line">
                <MessageSquare className="w-8 h-8 text-muted/40 mx-auto mb-2" />
                <p className="text-xs font-semibold text-muted font-bangla">
                  {lang === 'bn'
                    ? 'বর্তমানে কোনো নতুন বার্তা নেই। ওয়েবসাইট থেকে কেউ বার্তা পাঠালে এখানে প্রদর্শিত হবে।'
                    : 'No new visitor messages at this time. Messages submitted on the website will appear here.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {contactMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className="p-4 bg-bg hover:bg-white rounded-2xl border border-line hover:border-primary/40 transition shadow-2xs font-bangla flex flex-col gap-2.5 relative"
                  >
                    {/* Top Row: User Avatar, Name, Subject Badge & Delete */}
                    <div className="flex items-start justify-between gap-2 border-b border-line/60 pb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0 uppercase font-sans border border-primary/20">
                          {msg.name ? msg.name.charAt(0) : 'U'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs text-muted font-medium">{lang === 'bn' ? 'name :' : 'Name:'}</span>
                            <span className="font-bold text-ink text-sm truncate">{msg.name}</span>
                          </div>
                          {msg.submittedAt && (
                            <span className="text-[10px] text-muted font-mono block mt-0.5">
                              {lang === 'bn' ? msg.submittedAt : toEnglishNumerals(msg.submittedAt)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {msg.subject && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                            <span className="text-muted text-[10px]">{lang === 'bn' ? 'message sub :' : 'Subject:'}</span>
                            <span>{msg.subject}</span>
                          </span>
                        )}
                        {deleteContactMessage && (
                          <button
                            type="button"
                            onClick={() => {
                              const confirmDelete = lang === 'bn'
                                ? `আপনি কি "${msg.name}"-এর এই বার্তাটি মুছে ফেলতে চান?`
                                : `Are you sure you want to delete this message from "${msg.name}"?`;
                              if (window.confirm(confirmDelete)) {
                                deleteContactMessage(msg.id);
                              }
                            }}
                            className="p-1 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition cursor-pointer"
                            title={lang === 'bn' ? 'বার্তাটি মুছে ফেলুন' : 'Delete message'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Middle Row: Phone and Optional Email Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Phone - Always Shown */}
                      {msg.phone && (
                        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-line text-ink">
                          <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="text-muted text-[10px]">{lang === 'bn' ? 'phone :' : 'Phone:'}</span>
                          <a 
                            href={`tel:${msg.phone}`} 
                            className="font-mono font-bold text-primary hover:underline text-xs"
                            title={lang === 'bn' ? 'কল করতে ক্লিক করুন' : 'Click to call'}
                          >
                            {msg.phone}
                          </a>
                        </div>
                      )}

                      {/* Email - Strictly Optional: Only rendered if present */}
                      {msg.email && msg.email.trim() !== '' && (
                        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-line text-ink">
                          <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="text-muted text-[10px]">{lang === 'bn' ? 'mail :' : 'Email:'}</span>
                          <a 
                            href={`mailto:${msg.email}`} 
                            className="font-mono font-bold text-ink hover:text-primary hover:underline text-xs"
                            title={lang === 'bn' ? 'ইমেইল পাঠাতে ক্লিক করুন' : 'Click to email'}
                          >
                            {msg.email}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Bottom Row: Message / Description */}
                    <div className="bg-white p-3 rounded-xl border border-line/70 space-y-1">
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                        {lang === 'bn' ? 'description :' : 'Message:'}
                      </span>
                      <p className="text-ink text-xs leading-relaxed whitespace-pre-wrap font-sans">
                        {msg.message || '—'}
                      </p>
                    </div>
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
              <span>{lang === 'bn' ? 'দ্রুত কার্যক্রম' : 'Quick Actions'}</span>
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
                      <span>{lang === 'bn' ? action.labelBn : action.labelEn}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* School Contact Card */}
          <div className="card-base rounded-2xl p-5 text-xs space-y-2 border border-line shadow-xs bg-white">
            <span className="text-deep font-bold block">{lang === 'bn' ? 'প্রাতিষ্ঠানিক হেল্পডেস্ক' : 'Institutional Helpdesk'}</span>
            <p className="text-muted font-bangla leading-relaxed">
              {lang === 'bn'
                ? 'কারিগরি সহায়তা ও সার্ভার রক্ষণাবেক্ষণ সংক্রান্ত তথ্যের জন্য বিদ্যালয়ের আইসিটি ল্যাবে যোগাযোগ করুন।'
                : 'For technical support and server maintenance queries, please contact the school ICT Lab.'}
            </p>
            <p className="font-mono text-primary font-bold">
              {lang === 'bn'
                ? `হটলাইন: ${schoolInfo?.phone || '+880 1819-204561'}`
                : `Hotline: ${toEnglishNumerals(schoolInfo?.phone || '+880 1819-204561')}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
