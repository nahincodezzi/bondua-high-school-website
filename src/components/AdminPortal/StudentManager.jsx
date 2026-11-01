import React, { useState } from 'react';
import SchoolLogo from '../common/SchoolLogo';
import { useSchool } from '../../context/useSchool';
import { 
  Search, 
  Plus, 
  Trash2, 
  CreditCard, 
  Printer, 
  X
} from 'lucide-react';

export default function StudentManager() {
  const { students, addStudent, deleteStudent, schoolInfo } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeIdCardStudent, setActiveIdCardStudent] = useState(null);

  const [newStudent, setNewStudent] = useState({
    roll: '',
    nameBn: '',
    nameEn: '',
    class: '10',
    section: 'A',
    group: 'Science',
    gender: 'Male',
    dob: '2010-01-01',
    guardianName: '',
    guardianPhone: '',
    address: 'বন্দুয়া দৌলতপুর, ফুলগাজী'
  });

  const filteredStudents = students.filter(s => {
    const matchesClass = selectedClass === 'all' || s.class === selectedClass;
    const matchesSearch = 
      s.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roll.toString().includes(searchQuery) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newStudent.nameBn || !newStudent.roll) return;
    addStudent({
      ...newStudent,
      roll: Number(newStudent.roll)
    });
    setShowAddModal(false);
    setNewStudent({
      roll: '',
      nameBn: '',
      nameEn: '',
      class: '10',
      section: 'A',
      group: 'Science',
      gender: 'Male',
      dob: '2010-01-01',
      guardianName: '',
      guardianPhone: '',
      address: 'বন্দুয়া দৌলতপুর, ফুলগাজী'
    });
  };

  const handlePrintIdCard = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-bangla text-slate-900">
            শিক্ষার্থী ব্যবস্থাপনা (Student Directory)
          </h2>
          <p className="text-xs text-slate-500 font-bangla">
            সকল শ্রেণির শিক্ষার্থীদের তথ্য সংরক্ষণ, আইডি কার্ড প্রস্তুত ও পর্যালোচনা
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition shadow font-bangla"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>নতুন শিক্ষার্থী ভর্তি করুন</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Class Filter */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto font-bangla text-xs">
          <span className="text-slate-500 font-medium mr-1">শ্রেণি:</span>
          {['all', '10', '9', '8', '7', '6'].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedClass === cls
                  ? 'bg-emerald-800 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cls === 'all' ? 'সকল শ্রেণি' : `${cls} শ্রেণি`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="রোল, নাম বা আইডি খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 font-bangla"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bangla">
            <thead className="bg-emerald-950 text-white uppercase text-[11px] font-bold">
              <tr>
                <th className="py-3 px-3 text-center">রোল</th>
                <th className="py-3 px-3">আইডি</th>
                <th className="py-3 px-3">শিক্ষার্থীর নাম</th>
                <th className="py-3 px-3">শ্রেণি ও শাখা</th>
                <th className="py-3 px-3">বিভাগ</th>
                <th className="py-3 px-3">অভিভাবকের নাম ও মোবাইল</th>
                <th className="py-3 px-3 text-center">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 bg-slate-50/50">
                      {stu.roll}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{stu.studentId}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{stu.nameBn}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">{stu.nameEn}</span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {stu.class} শ্রেণি (শাখা {stu.section})
                    </td>
                    <td className="py-3 px-3 font-medium text-emerald-800">{stu.group}</td>
                    <td className="py-3 px-3">
                      <span className="text-slate-800 block">{stu.guardianName}</span>
                      <span className="text-slate-500 font-mono text-[11px]">{stu.guardianPhone}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setActiveIdCardStudent(stu)}
                          className="p-1.5 bg-emerald-100 text-emerald-900 hover:bg-emerald-200 rounded-lg text-xs font-bold transition flex items-center gap-1"
                          title="Generate Student ID Card"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                          <span className="hidden sm:inline">আইডি কার্ড</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`আপনি কি "${stu.nameBn}" এর তথ্য মুছে ফেলতে নিশ্চিত?`)) {
                              deleteStudent(stu.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    কোনো শিক্ষার্থী পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-2xl overflow-y-auto max-h-[92vh] shadow-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold font-bangla text-slate-900 text-base">
                নতুন শিক্ষার্থী নিবন্ধন ফরম
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-bangla">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">রোল নম্বর *</label>
                  <input
                    type="number"
                    required
                    value={newStudent.roll}
                    onChange={(e) => setNewStudent({ ...newStudent, roll: e.target.value })}
                    placeholder="107"
                    className="w-full rounded-lg border border-slate-300 p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">শ্রেণি *</label>
                  <select
                    value={newStudent.class}
                    onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 bg-white"
                  >
                    <option value="10">১০ম শ্রেণি</option>
                    <option value="9">৯ম শ্রেণি</option>
                    <option value="8">৮ম শ্রেণি</option>
                    <option value="7">৭ম শ্রেণি</option>
                    <option value="6">৬ষ্ঠ শ্রেণি</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">শিক্ষার্থীর নাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.nameBn}
                    onChange={(e) => setNewStudent({ ...newStudent, nameBn: e.target.value })}
                    placeholder="নাম লিখুন"
                    className="w-full rounded-lg border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">শিক্ষার্থীর নাম (ইংরেজি) *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.nameEn}
                    onChange={(e) => setNewStudent({ ...newStudent, nameEn: e.target.value })}
                    placeholder="Student Name in English"
                    className="w-full uppercase rounded-lg border border-slate-300 p-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">অভিভাবকের নাম</label>
                  <input
                    type="text"
                    value={newStudent.guardianName}
                    onChange={(e) => setNewStudent({ ...newStudent, guardianName: e.target.value })}
                    placeholder="অভিভাবকের নাম"
                    className="w-full rounded-lg border border-slate-300 p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">অভিভাবকের মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={newStudent.guardianPhone}
                    onChange={(e) => setNewStudent({ ...newStudent, guardianPhone: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="w-full rounded-lg border border-slate-300 p-2 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 text-white font-bold rounded-lg shadow"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student ID Card Modal (Official & Printable) */}
      {activeIdCardStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-3xl overflow-y-auto max-h-[92vh] shadow-2xl border border-slate-200">
            {/* Modal Controls */}
            <div className="bg-slate-900 text-white p-3 flex justify-between items-center text-xs no-print">
              <span className="font-semibold">ডিজিটাল স্টুডেন্ট আইডি কার্ড</span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrintIdCard}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট</span>
                </button>
                <button
                  onClick={() => setActiveIdCardStudent(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Official ID Card Layout */}
            <div className="p-6 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white text-center space-y-4 rounded-b-3xl relative overflow-hidden" id="student-id-card">
              <div className="absolute top-0 left-0 right-0 h-2 bg-amber-400"></div>

              {/* School Emblem & Name */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow ring-1 ring-amber-400 mb-1 shrink-0">
                  <SchoolLogo logo={schoolInfo.logo} />
                </div>
                <h3 className="text-base font-extrabold font-bangla text-white leading-tight">
                  {schoolInfo.nameBn}
                </h3>
                <p className="text-[10px] text-emerald-200 font-mono">
                  EIIN: {schoolInfo.eiin} • ফুলগাজী, ফেনী
                </p>
                <span className="inline-block bg-amber-400 text-emerald-950 text-[9px] font-bold px-2 py-0.2 rounded-full uppercase mt-1">
                  STUDENT IDENTITY CARD
                </span>
              </div>

              {/* Student Photo Placeholder */}
              <div className="w-24 h-24 mx-auto rounded-2xl bg-white p-1 shadow-lg ring-2 ring-amber-400/80 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80"
                  alt="Student"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Student Name & ID */}
              <div>
                <h4 className="text-sm font-bold font-bangla text-amber-300">
                  {activeIdCardStudent.nameBn}
                </h4>
                <p className="text-xs text-white uppercase font-mono font-bold tracking-wide">
                  {activeIdCardStudent.nameEn}
                </p>
                <p className="text-[11px] font-mono text-emerald-200 mt-0.5">
                  ID: {activeIdCardStudent.studentId}
                </p>
              </div>

              {/* Metadata Table */}
              <div className="bg-emerald-900/80 p-3 rounded-xl border border-emerald-800 text-left text-xs font-bangla space-y-1">
                <div className="flex justify-between">
                  <span className="text-emerald-300">শ্রেণি:</span>
                  <span className="font-bold text-white">{activeIdCardStudent.class} শ্রেণি</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300">রোল নম্বর:</span>
                  <span className="font-mono font-bold text-amber-300">{activeIdCardStudent.roll}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300">বিভাগ (গ্রুপ):</span>
                  <span className="font-bold text-white">{activeIdCardStudent.group}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300">মোবাইল:</span>
                  <span className="font-mono text-emerald-200 text-[11px]">{activeIdCardStudent.guardianPhone}</span>
                </div>
              </div>

              {/* Principal Signature */}
              <div className="pt-2 flex justify-between items-end border-t border-emerald-800/80 text-[10px]">
                <span className="text-emerald-300 font-mono">Session: 2026</span>
                <div className="text-center">
                  <span className="font-serif italic text-amber-300 font-bold text-xs block">Bahar U.</span>
                  <span className="text-emerald-300">ভারপ্রাপ্ত প্রধান শিক্ষক</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
