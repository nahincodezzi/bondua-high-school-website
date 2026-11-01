import React, { useState } from 'react';
import { useSchool } from '../../context/useSchool';
import { 
  Search, 
  CheckCircle2, 
  Eye, 
  X
} from 'lucide-react';

export default function AdmissionManager() {
  const { admissions, updateAdmissionStatus } = useSchool();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewModalApp, setViewModalApp] = useState(null);

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
        <h2 className="text-xl sm:text-2xl font-bold font-bangla text-slate-900">
          ভর্তি আবেদন যাচাই ও অনুমোদন (Admission Review)
        </h2>
        <p className="text-xs text-slate-500 font-bangla">
          ২০২৬ শিক্ষাবর্ষে ৬ষ্ঠ থেকে ৯ম শ্রেণিতে ভর্তির আবেদনসমূহ পর্যবেক্ষণ ও অনুমোদন
        </p>
      </div>

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
                            onClick={() => updateAdmissionStatus(app.id, 'Approved')}
                            className="p-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold"
                            title="Approve"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => updateAdmissionStatus(app.id, 'Pending')}
                            className="p-1.5 bg-amber-100 text-amber-800 hover:bg-amber-200 rounded-lg text-[10px] font-bold"
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

      {/* View Application Modal */}
      {viewModalApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4 font-bangla">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                ভর্তি আবেদন পত্র বিস্তারিত
              </h3>
              <button onClick={() => setViewModalApp(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">ট্র্যাকিং আইডি:</span>
                  <span className="font-mono font-bold text-slate-900">{viewModalApp.trackingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">শিক্ষার্থীর নাম:</span>
                  <span className="font-bold text-slate-900">{viewModalApp.studentNameBn} ({viewModalApp.studentNameEn})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">আবেদনকৃত শ্রেণি:</span>
                  <span className="font-bold text-emerald-800">{viewModalApp.applyingClass} শ্রেণি</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">লিঙ্গ ও রক্তের গ্রুপ:</span>
                  <span>{viewModalApp.gender} • {viewModalApp.bloodGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">পিতার নাম:</span>
                  <span>{viewModalApp.fatherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">মাতার নাম:</span>
                  <span>{viewModalApp.motherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">অভিভাবকের মোবাইল:</span>
                  <span className="font-mono font-bold text-slate-900">{viewModalApp.guardianPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">পূর্ববর্তী বিদ্যালয়:</span>
                  <span>{viewModalApp.previousSchool} (GPA: {viewModalApp.previousGpa})</span>
                </div>
                <div className="pt-1">
                  <span className="text-slate-500 block">ঠিকানা:</span>
                  <span className="text-slate-700">{viewModalApp.address}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-semibold text-slate-700">বর্তমান স্ট্যাটাস: {viewModalApp.status}</span>
                {viewModalApp.status === 'Pending' ? (
                  <button
                    onClick={() => {
                      updateAdmissionStatus(viewModalApp.id, 'Approved');
                      setViewModalApp(null);
                    }}
                    className="bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    আবেদন অনুমোদন করুন
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      updateAdmissionStatus(viewModalApp.id, 'Pending');
                      setViewModalApp(null);
                    }}
                    className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    অপেক্ষমাণ রাখুন
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
