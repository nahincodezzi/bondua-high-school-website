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
    if (app.status === 'Approved') {
      alert('এই আবেদনটি ইতোমধ্যেই অনুমোদিত হয়েছে!');
      return;
    }
    if (confirm(`আপনি কি "${app.studentNameBn || app.studentNameEn}"-এর ভর্তি আবেদন অনুমোদন করে শিক্ষার্থী ডাটাবেজে রেকর্ড তৈরি করতে চান?`)) {
      const createdStudent = approveAdmissionAndCreateStudent(app);
      if (createdStudent) {
        setActionSuccess(`আবেদন সফলভাবে অনুমোদিত হয়েছে! ${createdStudent.nameBn}-কে শ্রেণি ${createdStudent.class}, রোল ${createdStudent.roll} ও স্টুডেন্ট আইডি ${createdStudent.studentId} বরাদ্দ করা হয়েছে।`);
        setTimeout(() => setActionSuccess(''), 6000);
      }
    }
  };

  const filtered = admissions.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = 
      (app.studentNameBn && app.studentNameBn.includes(searchQuery)) ||
      (app.studentNameEn && app.studentNameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.trackingId && app.trackingId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.id && app.id.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-bangla text-ink">
          ভর্তি আবেদন যাচাই ও অনুমোদন (Admission Review)
        </h2>
        <p className="text-xs text-muted font-bangla">
          ২০২৭ শিক্ষাবর্ষে ৬ষ্ঠ থেকে ৯ম শ্রেণিতে ভর্তির আবেদনসমূহ পর্যবেক্ষণ ও অনুমোদন
        </p>
      </div>

      {/* Success Alert Banner (A10) */}
      {actionSuccess && (
        <div className="p-4 bg-soft text-deep rounded-xl text-xs font-bold flex items-center gap-2 border border-soft-border">
          <UserCheck className="w-5 h-5 text-primary shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-line shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 font-bangla text-xs">
          {['all', 'Pending', 'Approved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filterStatus === status
                  ? 'bg-primary text-white shadow'
                  : 'bg-bg text-muted hover:bg-line'
              }`}
            >
              {status === 'all' ? 'সকল আবেদন' : status === 'Pending' ? 'অপেক্ষমাণ (Pending)' : 'অনুমোদিত (Approved)'}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ট্র্যাকিং আইডি বা নাম খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-line text-xs focus:ring-2 focus:ring-primary font-bangla"
          />
        </div>
      </div>

      {/* Table & Mobile Cards */}
      <div className="bg-white rounded-2xl border border-line shadow-2xs overflow-hidden">
        {/* Desktop & Tablet Table (>= sm) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs font-bangla">
            <thead className="bg-deep text-white uppercase text-[11px] font-bold">
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
            <tbody className="divide-y divide-line">
              {filtered.length > 0 ? (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-bg">
                    <td className="py-3 px-3 font-mono font-bold text-ink">{app.trackingId}</td>
                    <td className="py-3 px-3 font-semibold text-ink">
                      {app.studentNameBn || app.studentNameEn}
                    </td>
                    <td className="py-3 px-3 font-medium text-primary">{app.applyingClass} শ্রেণি</td>
                    <td className="py-3 px-3 text-muted">{app.fatherName}</td>
                    <td className="py-3 px-3 font-mono text-ink">{app.guardianPhone}</td>
                    <td className="py-3 px-3 font-mono text-center text-muted">{app.submissionDate}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === 'Approved'
                          ? 'bg-soft text-primary'
                          : 'bg-warning-soft text-warning'
                      }`}>
                        {app.status === 'Approved' ? 'অনুমোদিত' : 'অপেক্ষমাণ'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewModalApp(app)}
                          className="p-1.5 bg-bg hover:bg-line text-ink rounded-lg text-xs"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {app.status === 'Pending' ? (
                          <button
                            onClick={() => handleApprove(app)}
                            className="p-1.5 bg-primary hover:bg-deep text-white rounded-lg text-xs font-bold cursor-pointer"
                            title="অনুমোদন ও শিক্ষার্থী তৈরি করুন"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          </button>
                        ) : (
                          <button
                            onClick={() => updateAdmissionStatus(app.id, 'Pending')}
                            className="p-1.5 bg-warning-soft text-warning hover:bg-warning-soft rounded-lg text-[10px] font-bold cursor-pointer"
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
                  <td colSpan="8" className="py-8 text-center text-muted">
                    কোনো ভর্তি আবেদন পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout (< sm) (N5) */}
        <div className="block sm:hidden divide-y divide-line font-bangla">
          {filtered.length > 0 ? (
            filtered.map((app) => (
              <div key={app.id} className="p-4 space-y-2.5 hover:bg-bg transition">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-primary">
                    {app.trackingId}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    app.status === 'Approved'
                      ? 'bg-soft text-primary'
                      : 'bg-warning-soft text-warning'
                  }`}>
                    {app.status === 'Approved' ? 'অনুমোদিত' : 'অপেক্ষমাণ'}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-ink text-sm">{app.studentNameBn || app.studentNameEn}</h4>
                  <p className="text-xs text-muted">পিতা: {app.fatherName}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-muted bg-bg p-2.5 rounded-lg border border-line">
                  <span className="font-semibold text-primary">{app.applyingClass} শ্রেণি</span>
                  <span className="font-mono text-muted text-[11px]">{app.guardianPhone}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-line">
                  <span className="text-[11px] font-mono text-muted">
                    তারিখ: {app.submissionDate}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setViewModalApp(app)}
                      className="px-2.5 py-1 bg-bg hover:bg-line text-ink rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>বিস্তারিত</span>
                    </button>

                    {app.status === 'Pending' ? (
                      <button
                        onClick={() => handleApprove(app)}
                        className="px-2.5 py-1 bg-primary hover:bg-deep text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1"
                        title="অনুমোদন ও শিক্ষার্থী তৈরি করুন"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>অনুমোদন</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => updateAdmissionStatus(app.id, 'Pending')}
                        className="px-2 py-1 bg-warning-soft text-warning hover:bg-warning-soft rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        রিভার্ট
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-muted text-xs font-bangla">
              কোনো ভর্তি আবেদন পাওয়া যায়নি।
            </div>
          )}
        </div>
      </div>

      {/* View Application Modal (M6 - createPortal) */}
      {viewModalApp && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl border border-line p-6 space-y-4 font-bangla">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-bold text-ink text-base">
                ভর্তি আবেদন পত্র বিস্তারিত
              </h3>
              <button 
                onClick={() => setViewModalApp(null)} 
                className="text-muted hover:text-ink p-1 rounded-lg hover:bg-bg cursor-pointer"
                aria-label="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-bg rounded-xl space-y-1.5 border border-line">
                <div className="flex justify-between">
                  <span className="text-muted">ট্র্যাকিং আইডি:</span>
                  <span className="font-mono font-bold text-ink">{viewModalApp.trackingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">শিক্ষার্থীর নাম:</span>
                  <span className="font-bold text-ink">{viewModalApp.studentNameBn} ({viewModalApp.studentNameEn})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">আবেদনকৃত শ্রেণি:</span>
                  <span className="font-bold text-deep">{toBanglaNumerals(viewModalApp.applyingClass)} শ্রেণি</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">লিঙ্গ ও রক্তের গ্রুপ:</span>
                  <span>{viewModalApp.gender} • {viewModalApp.bloodGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">পিতার নাম:</span>
                  <span>{viewModalApp.fatherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">মাতার নাম:</span>
                  <span>{viewModalApp.motherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">অভিভাবকের মোবাইল:</span>
                  <span className="font-mono font-bold text-ink">{viewModalApp.guardianPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">পূর্ববর্তী বিদ্যালয়:</span>
                  <span>{viewModalApp.previousSchool} (GPA: {viewModalApp.previousGpa})</span>
                </div>
                <div className="pt-1">
                  <span className="text-muted block">ঠিকানা:</span>
                  <span className="text-ink">{viewModalApp.address}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-semibold text-ink">বর্তমান স্ট্যাটাস: {viewModalApp.status}</span>
                {viewModalApp.status === 'Pending' ? (
                  <button
                    onClick={() => {
                      approveAdmissionAndCreateStudent(viewModalApp);
                      setViewModalApp(null);
                    }}
                    className="bg-deep hover:bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    অনুমোদন ও শিক্ষার্থী হিসেবে ভর্তি
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      updateAdmissionStatus(viewModalApp.id, 'Pending');
                      setViewModalApp(null);
                    }}
                    className="bg-bg hover:bg-soft text-ink px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
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
