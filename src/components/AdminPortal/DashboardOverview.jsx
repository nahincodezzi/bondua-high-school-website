import React from 'react';
import { useSchool } from '../../context/useSchool';
import { 
  Users, 
  FileCheck, 
  DollarSign, 
  ChevronRight,
  School
} from 'lucide-react';

export default function DashboardOverview({ onNavigate }) {
  const { lang, students, teachers, admissions, fees, authUser } = useSchool();

  const pendingAdmissions = admissions.filter(a => a.status === 'Pending');
  const totalFeeCollected = fees.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const [greeting] = React.useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { bn: 'শুভ সকাল 🌅', en: 'Good Morning 🌅' };
    if (hour < 17) return { bn: 'শুভ অপরাহ্ন ☀️', en: 'Good Afternoon ☀️' };
    return { bn: 'শুভ সন্ধ্যা 🌙', en: 'Good Evening 🌙' };
  });

  const kpis = [
    {
      titleBn: 'মোট শিক্ষার্থী',
      titleEn: 'Total Students',
      value: students.length + 845,
      subtextBn: '৬ষ্ঠ থেকে ১০ম শ্রেণি',
      icon: Users,
      action: 'students'
    },
    {
      titleBn: 'শিক্ষক ও কর্মচারী',
      titleEn: 'Faculty Members',
      value: teachers.length,
      subtextBn: 'নিয়মিত ও অভিজ্ঞ শিক্ষক-কর্মচারী',
      icon: School,
      action: 'students'
    },
    {
      titleBn: 'অপেক্ষমাণ ভর্তি আবেদন',
      titleEn: 'Pending Admissions',
      value: pendingAdmissions.length,
      subtextBn: '২০২৬ শিক্ষাবর্ষ',
      icon: FileCheck,
      action: 'admissions'
    },
    {
      titleBn: 'চলতি মাসে ফি আদায়',
      titleEn: 'Fee Collection',
      value: `৳${(totalFeeCollected + 45000).toLocaleString()}`,
      subtextBn: 'মাসিক ও পরীক্ষা ফি',
      icon: DollarSign,
      action: 'fees'
    }
  ];

  return (
    <div className="space-y-6">
            {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-xs font-bold font-mono">SYSTEM DASHBOARD</span>
            <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30 font-bangla">
              {lang === 'bn' ? greeting.bn : greeting.en}
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold font-bangla text-white mt-1">
            {lang === 'bn' 
              ? `স্বাগতম, ${authUser?.nameBn || authUser?.name || 'সম্মানিত ব্যবহারকারী'} (${authUser?.designationBn || authUser?.designation || authUser?.role || 'প্রশাসক'})` 
              : `Welcome, ${authUser?.nameEn || authUser?.name || 'Authorized User'} (${authUser?.designationEn || authUser?.designation || authUser?.role || 'Administrator'})`
            }
          </h2>
          <p className="text-xs text-emerald-200 font-bangla mt-0.5">
            {lang === 'bn'
              ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় ডিজিটাল ম্যানেজমেন্ট সফটওয়্যারে আপনাকে স্বাগতম।'
              : 'Welcome to Bandua Daulatpur High School Digital Management ERP.'
            }
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('admissions')}
            className="flex-1 sm:flex-initial bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold px-4 py-2 rounded-xl text-xs font-bangla transition shadow-sm text-center active:scale-95 cursor-pointer"
          >
            ভর্তি আবেদন যাচাই ({pendingAdmissions.length})
          </button>
          <button
            onClick={() => onNavigate('notices')}
            className="flex-1 sm:flex-initial bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs font-bangla transition border border-emerald-600 text-center"
          >
            নতুন নোটিশ দিন
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(kpi.action)}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 font-bangla">
                  {lang === 'bn' ? kpi.titleBn : kpi.titleEn}
                </span>
                <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                  {kpi.value}
                </span>
                <p className="text-[11px] text-slate-400 font-bangla mt-1">{kpi.subtextBn}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Recent Admission Applications & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Online Admission Applications */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm sm:text-base font-bold font-bangla text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-700" />
                <span>সাম্প্রতিক অনলাইন ভর্তি আবেদন সমূহ</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-bangla">ওয়েবসাইটের মাধ্যমে শিক্ষার্থীদের পাঠানো আবেদন</p>
            </div>
            <button
              onClick={() => onNavigate('admissions')}
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 font-bangla"
            >
              <span>সকল দেখুন</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bangla">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">ট্র্যাকিং আইডি</th>
                  <th className="py-2.5 px-3">শিক্ষার্থীর নাম</th>
                  <th className="py-2.5 px-3">শ্রেণি</th>
                  <th className="py-2.5 px-3">অভিভাবকের মোবাইল</th>
                  <th className="py-2.5 px-3 text-center">স্ট্যাটাস</th>
                  <th className="py-2.5 px-3 text-center">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admissions.slice(0, 5).map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{app.trackingId}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{app.studentNameBn || app.studentNameEn}</td>
                    <td className="py-2.5 px-3 font-medium text-emerald-800">{app.applyingClass} শ্রেণি</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{app.guardianPhone}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {app.status === 'Pending' ? (
                        <button
                          onClick={() => updateAdmissionStatus(app.id, 'Approved')}
                          className="bg-emerald-700 hover:bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-bold transition"
                        >
                          অনুমোদন
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400">সম্পন্ন</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Quick ERP Navigation Tiles */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold font-bangla text-slate-900 pb-2 border-b border-slate-100">
              ⚡ দ্রুত কার্যক্রম
            </h3>

            <div className="space-y-2 text-xs font-bangla">
              <button
                onClick={() => onNavigate('students')}
                className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50 rounded-xl text-left font-semibold text-slate-700 hover:text-emerald-900 transition flex items-center justify-between border border-slate-100"
              >
                <span>➕ নতুন শিক্ষার্থী ভর্তি করুন</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('results')}
                className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50 rounded-xl text-left font-semibold text-slate-700 hover:text-emerald-900 transition flex items-center justify-between border border-slate-100"
              >
                <span>📝 পরীক্ষার মার্কস এন্ট্রি ও প্রকাশ</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('fees')}
                className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50 rounded-xl text-left font-semibold text-slate-700 hover:text-emerald-900 transition flex items-center justify-between border border-slate-100"
              >
                <span>💳 ফি কালেকশন ও মানি রিসিট</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('notices')}
                className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50 rounded-xl text-left font-semibold text-slate-700 hover:text-emerald-900 transition flex items-center justify-between border border-slate-100"
              >
                <span>📢 নোটিশ ও সার্কুলার তৈরি</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* School Contact Card */}
          <div className="bg-emerald-950 text-white rounded-2xl p-5 text-xs space-y-2">
            <span className="text-amber-400 font-bold block">প্রাতিষ্ঠানিক হেল্পডেস্ক</span>
            <p className="text-emerald-200 font-bangla">
              কারিগরি সহায়তা ও সার্ভার রক্ষণাবেক্ষণ সংক্রান্ত তথ্যের জন্য বিদ্যালয়ের আইসিটি ল্যাবে যোগাযোগ করুন।
            </p>
            <p className="font-mono text-emerald-300">হটলাইন: +880 1819-204561</p>
          </div>
        </div>
      </div>
    </div>
  );
}
