import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSchool } from '../../context/useSchool';
import { toBanglaNumerals } from '../../utils/dateFormatter';
import { 
  Search, 
  CheckCircle2, 
  Eye, 
  X,
  UserCheck
} from 'lucide-react';

export default function AdmissionManager() {
  const { admissions, updateAdmissionStatus, approveAdmissionAndCreateStudent } = useSchool();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewModalApp, setViewModalApp] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  // Close modal on Escape
  useEffect(() => {
    if (!viewModalApp) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setViewModalApp(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewModalApp]);

  const handleApprove = (app) => {
    if (confirm(`আপনি কি "${app.studentNameBn || app.studentNameEn}"-এর ভর্তি আবেদন অনুমোদন করে শিক্ষার্থী ডাটাবেজে রেকর্ড তৈরি করতে চান?`)) {
      const createdStudent = approveAdmissionAndCreateStudent(app);
      setActionSuccess(`আবেদন সফলভাবে অনুমোদিত হয়েছে! ${createdStudent.nameBn}-কে শ্রেণি ${createdStudent.class}, রোল ${createdStudent.roll} ও স্টুডেন্ট আইডি ${createdStudent.studentId} বরাদ্দ করা হয়েছে।`);
      setTimeout(() => setActionSuccess(''), 6000);
    }
  };

  const filtered = admissions.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = 
      (app.studentNameBn && app.studentNameBn.includes(searchQuery)) ||
      (app.studentNameEn && app.studentNameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      app.trackingId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-bangla text-[#1F2937]">
          ভর্তি আবেদন যাচাই ও অনুমোদন (Admission Review)
        </h2>
        <p className="text-xs text-[#4B5563] font-bangla">
          ২০২৭ শিক্ষাবর্ষে ৬ষ্ঠ থেকে ৯ম শ্রেণিতে ভর্তির আবেদনসমূহ পর্যবেক্ষণ ও অনুমোদন
        </p>
      </div>

      {/* Success Alert Banner (A10) */}
      {actionSuccess && (
        <div className="p-4 bg-[#DCFCE7] text-[#14532D] rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-300">
          <UserCheck className="w-5 h-5 text-[#166534] shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 font-bangla text-xs">
          {['all', 'Pending', 'Approved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filterStatus === status
                  ? 'bg-emerald-800 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? 'সকল আবেদন' : status === 'Pending' ? 'অপেক্ষমাণ (Pending)' : 'অনুমোদিত (Approved)'}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ট্র্যাকিং আইডি বা নাম খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 font-bangla"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bangla">
            <thead className="bg-emerald-950 text-white uppercase text-[11px] font-bold">
              <tr>
                <th className="py-3 px-3">ট্র্যাকিং আইডি</th>
                <th className="py-3 px-3">শিক্ষার্থীর নাম</th>
                <th className="py-3 px-3">আবেদনকৃত শ্রেণি</th>
                <th className="py-3 px-3">পিতার নাম</th>
                <th className="py-3 px-3">মোবাইল নম্বর</th>
                <th className="py-3 px-3 text-center">আবেদনের তারিখ</th>
                <th className="py-3 px-3 text-center">স্ট্যাটাস</th>
                <th className="py-3 px-3 text-center">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{app.trackingId}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {app.studentNameBn || app.studentNameEn}
                    </td>
                    <td className="py-3 px-3 font-medium text-emerald-800">{app.applyingClass} শ্রেণি</td>
                    <td className="py-3 px-3 text-slate-600">{app.fatherName}</td>
                    <td className="py-3 px-3 font-mono text-slate-700">{app.guardianPhone}</td>
                    <td className="py-3 px-3 font-mono text-center text-slate-500">{app.submissionDate}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status === 'Approved' ? 'অনুমোদিত' : 'অপেক্ষমাণ'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewModalApp(app)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {app.status === 'Pending' ? (
                          <button
                            onClick={() => handleApprove(app)}
                            className="p-1.5 bg-[#166534] hover:bg-[#14532D] text-white rounded-lg text-xs font-bold cursor-pointer"
                            title="অনুমোদন ও শিক্ষার্থী তৈরি করুন"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          </button>
                        ) : (
                          <button
                            onClick={() => updateAdmissionStatus(app.id, 'Pending')}
                            className="p-1.5 bg-[#FEF3C7] text-[#92400E] hover:bg-amber-200 rounded-lg text-[10px] font-bold cursor-pointer"
                            title="Set Pending"
                          >
                            রিভার্ট
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-500">
                    কোনো ভর্তি আবেদন পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Application Modal (M6 - createPortal) */}
      {viewModalApp && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl border border-[#E5E7EB] p-6 space-y-4 font-bangla">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 className="font-bold text-[#1F2937] text-base">
                ভর্তি আবেদন পত্র বিস্তারিত
              </h3>
              <button 
                onClick={() => setViewModalApp(null)} 
                className="text-[#4B5563] hover:text-[#1F2937] p-1 rounded-lg hover:bg-[#F3F4F6] cursor-pointer"
                aria-label="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F7F9F8] rounded-xl space-y-1.5 border border-[#E5E7EB]">
                <div className="flex justify-between">
                  <span className="text-[#4B5563]">ট্র্যাকিং আইডি:</span>
                  <span className="font-mono font-bold text-[#1F2937]">{viewModalApp.trackingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B5563]">শিক্ষার্থীর নাম:</span>
                  <span className="font-bold text-[#1F2937]">{viewModalApp.studentNameBn} ({viewModalApp.studentNameEn})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B5563]">আবেদনকৃত শ্রেণি:</span>
                  <span className="font-bold text-[#14532D]">{toBanglaNumerals(viewModalApp.applyingClass)} শ্রেণি</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B5563]">লিঙ্গ ও রক্তের গ্রুপ:</span>
                  <span>{viewModalApp.gender} • {viewModalApp.bloodGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B5563]">পিতার নাম:</span>
                  <span>{viewModalApp.fatherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B5563]">মাতার নাম:</span>
                  <span>{viewModalApp.motherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B5563]">অভিভাবকের মোবাইল:</span>
                  <span className="font-mono font-bold text-[#1F2937]">{viewModalApp.guardianPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B5563]">পূর্ববর্তী বিদ্যালয়:</span>
                  <span>{viewModalApp.previousSchool} (GPA: {viewModalApp.previousGpa})</span>
                </div>
                <div className="pt-1">
                  <span className="text-[#4B5563] block">ঠিকানা:</span>
                  <span className="text-[#1F2937]">{viewModalApp.address}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-semibold text-[#1F2937]">বর্তমান স্ট্যাটাস: {viewModalApp.status}</span>
                {viewModalApp.status === 'Pending' ? (
                  <button
                    onClick={() => {
                      approveAdmissionAndCreateStudent(viewModalApp);
                      setViewModalApp(null);
                    }}
                    className="bg-[#14532D] hover:bg-[#166534] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    অনুমোদন ও শিক্ষার্থী হিসেবে ভর্তি
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      updateAdmissionStatus(viewModalApp.id, 'Pending');
                      setViewModalApp(null);
                    }}
                    className="bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    অপেক্ষমাণ রাখুন
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
