import React, { useState } from 'react';
import { useSchool } from '../../context/useSchool';
import { toBanglaNumerals, toEnglishNumerals } from '../../utils/dateFormatter';
import { 
  Award, 
  CheckCircle,
  AlertCircle,
  UserCheck
} from 'lucide-react';

export default function ResultManager() {
  const { results, addResult, students, lang } = useSchool();
  const [examName, setExamName] = useState('SSC Test Examination 2026');
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedStudentRoll, setSelectedStudentRoll] = useState('');
  const [year] = useState('2026');
  const [formError, setFormError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Subject marks state initialized to empty (A4 fix)
  const initialMarks = {
    Bangla: '',
    English: '',
    Mathematics: '',
    Physics: '',
    Chemistry: '',
    Biology: '',
    ICT: '',
    Religion: ''
  };

  const [marks, setMarks] = useState(initialMarks);

  // Auto student preview
  const activeStudent = students.find(
    s => s.roll.toString() === toEnglishNumerals(selectedStudentRoll.trim()) && s.class === selectedClass
  );

  const calculateGradePoint = (mark, max = 100) => {
    const num = Number(mark) || 0;
    const percentage = (num / max) * 100;
    if (percentage >= 80) return { grade: 'A+', point: 5.0 };
    if (percentage >= 70) return { grade: 'A', point: 4.0 };
    if (percentage >= 60) return { grade: 'A-', point: 3.5 };
    if (percentage >= 50) return { grade: 'B', point: 3.0 };
    if (percentage >= 40) return { grade: 'C', point: 2.0 };
    if (percentage >= 33) return { grade: 'D', point: 1.0 };
    return { grade: 'F', point: 0.0 };
  };

  const handleMarkChange = (subject, val) => {
    setMarks(prev => ({ ...prev, [subject]: val }));
    setFormError('');
  };

  const handlePublish = (e) => {
    e.preventDefault();
    setFormError('');

    const cleanRoll = toEnglishNumerals(selectedStudentRoll.trim());
    if (!cleanRoll) {
      setFormError('অনুগ্রহ করে শিক্ষার্থীর রোল নম্বর লিখুন।');
      return;
    }

    // Student Lookup Validation (A3 Fix)
    const matchedStudent = students.find(
      s => s.roll.toString() === cleanRoll && s.class === selectedClass
    );

    if (!matchedStudent) {
      setFormError(`শ্রেণি ${toBanglaNumerals(selectedClass)} এবং রোল "${toBanglaNumerals(cleanRoll)}"-এ কোনো শিক্ষার্থী পাওয়া যায়নি! ফলাফল এন্ট্রি করার আগে শিক্ষার্থী ডাটাবেজে উপস্থিত থাকতে হবে।`);
      return;
    }

    // Validate Marks 0-100 / ICT 0-50 (A4 Fix)
    for (const [sub, val] of Object.entries(marks)) {
      if (val === '' || val === null || val === undefined) {
        setFormError(`অনুগ্রহ করে "${sub}" বিষয়ের নম্বর সঠিকভাবে পূরণ করুন।`);
        return;
      }
      const numVal = Number(val);
      const maxVal = sub === 'ICT' ? 50 : 100;
      if (isNaN(numVal) || numVal < 0 || numVal > maxVal) {
        setFormError(`"${sub}" বিষয়ের নম্বর ০ থেকে ${maxVal}-এর মধ্যে হতে হবে।`);
        return;
      }
    }

    const subjectsArray = [
      { code: '101', name: 'Bangla', marks: Number(marks.Bangla), ...calculateGradePoint(marks.Bangla) },
      { code: '107', name: 'English', marks: Number(marks.English), ...calculateGradePoint(marks.English) },
      { code: '109', name: 'Mathematics', marks: Number(marks.Mathematics), ...calculateGradePoint(marks.Mathematics) },
      { code: '136', name: 'Physics', marks: Number(marks.Physics), ...calculateGradePoint(marks.Physics) },
      { code: '137', name: 'Chemistry', marks: Number(marks.Chemistry), ...calculateGradePoint(marks.Chemistry) },
      { code: '138', name: 'Biology', marks: Number(marks.Biology), ...calculateGradePoint(marks.Biology) },
      { code: '154', name: 'ICT', marks: Number(marks.ICT), ...calculateGradePoint(marks.ICT, 50) },
      { code: '111', name: 'Religion', marks: Number(marks.Religion), ...calculateGradePoint(marks.Religion) }
    ];

    const totalPoints = subjectsArray.reduce((acc, curr) => acc + curr.point, 0);
    const hasFail = subjectsArray.some(s => s.grade === 'F');
    const gpaVal = hasFail ? '0.00' : (totalPoints / subjectsArray.length).toFixed(2);
    const letterGradeVal = hasFail ? 'F' : Number(gpaVal) >= 5.0 ? 'A+' : Number(gpaVal) >= 4.0 ? 'A' : 'A-';

    const resultRecord = {
      roll: cleanRoll,
      studentNameBn: matchedStudent.nameBn,
      studentNameEn: matchedStudent.nameEn,
      studentId: matchedStudent.studentId,
      class: selectedClass,
      group: matchedStudent.group || 'Science',
      section: matchedStudent.section || 'A',
      exam: examName,
      year: year,
      gpa: gpaVal,
      letterGrade: letterGradeVal,
      resultStatus: hasFail ? 'FAILED' : 'PASSED',
      subjects: subjectsArray
    };

    addResult(resultRecord);
    setSavedSuccess(true);
    setMarks(initialMarks);
    setSelectedStudentRoll('');
    setTimeout(() => setSavedSuccess(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-bangla text-[#1F2937]">
          ফলাফল ও নম্বর প্রদান ব্যবস্থাপনা (Marks Entry & Result Publishing)
        </h2>
        <p className="text-xs text-[#4B5563] font-bangla">
          পরীক্ষার নম্বর ইনপুট দিন; জিপিএ এবং লেটার গ্রেড স্বয়ংক্রিয়ভাবে হিসাব হয়ে পাবলিক পোর্টালে যুক্ত হবে
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Entry Form */}
        <div className="lg:col-span-7 card-base bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
          <form onSubmit={handlePublish} className="space-y-4 text-xs font-bangla">
            {/* Unified Exam List (A14) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">পরীক্ষার নাম</label>
                <select
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  className="w-full rounded-lg border border-[#D1D5DB] p-2.5 bg-[#F7F9F8] text-[#1F2937] focus:ring-2 focus:ring-[#166534] focus:outline-none"
                >
                  <option value="SSC Test Examination 2026">এসএসসি টেস্ট পরীক্ষা ২০২৬</option>
                  <option value="Annual Examination 2025">বার্ষিক পরীক্ষা ২০২৫</option>
                  <option value="Pre-Test Examination 2026">প্রাক-নির্বাচনী পরীক্ষা ২০২৬</option>
                  <option value="Half-Yearly Examination 2026">অর্ধবার্ষিক পরীক্ষা ২০২৬</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">শ্রেণি</label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setFormError('');
                  }}
                  className="w-full rounded-lg border border-[#D1D5DB] p-2.5 bg-[#F7F9F8] text-[#1F2937] focus:ring-2 focus:ring-[#166534] focus:outline-none"
                >
                  <option value="10">১০ম শ্রেণি</option>
                  <option value="9">৯ম শ্রেণি</option>
                  <option value="8">৮ম শ্রেণি</option>
                  <option value="7">৭ম শ্রেণি</option>
                  <option value="6">৬ষ্ঠ শ্রেণি</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">শিক্ষার্থীর রোল *</label>
                <input
                  type="text"
                  required
                  value={selectedStudentRoll}
                  onChange={(e) => {
                    setSelectedStudentRoll(e.target.value);
                    setFormError('');
                  }}
                  className="w-full rounded-lg border border-[#D1D5DB] p-2.5 font-mono font-bold bg-[#F7F9F8] text-[#1F2937] focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  placeholder="যেমন: 101"
                />
              </div>
            </div>

            {/* Live Student Match Confirmation Pill */}
            {activeStudent ? (
              <div className="p-3 bg-[#DCFCE7] text-[#14532D] rounded-xl text-xs flex items-center justify-between border border-emerald-300">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#166534]" />
                  <span className="font-bold">শিক্ষার্থী: {activeStudent.nameBn} ({activeStudent.studentId})</span>
                </div>
                <span className="font-semibold text-[11px] text-[#166534]">শাখা {activeStudent.section} • বিভাগ {activeStudent.group}</span>
              </div>
            ) : selectedStudentRoll ? (
              <div className="p-2.5 bg-[#FEE2E2] text-[#DC2626] rounded-xl text-xs flex items-center gap-1.5 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>শ্রেণি {selectedClass}-এ এই রোলের কোনো শিক্ষার্থী পাওয়া যায়নি।</span>
              </div>
            ) : null}

            {/* Subject Marks Table Inputs (0-100, ICT 0-50) */}
            <div>
              <span className="font-bold text-slate-700 block mb-2">বিষয়ভিত্তিক প্রাপ্ত নম্বর (পূর্ণমান ১০০, আইসিটি ৫০):</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.keys(marks).map((sub) => {
                  const maxMark = sub === 'ICT' ? 50 : 100;
                  return (
                    <div key={sub} className="bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E5E7EB]">
                      <div className="flex justify-between items-center mb-1">
                        <label className="block font-bold text-[#1F2937] text-[11px]">{sub}</label>
                        <span className="text-[10px] text-[#4B5563]">/{maxMark}</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max={maxMark}
                        required
                        placeholder="0"
                        value={marks[sub]}
                        onChange={(e) => handleMarkChange(sub, e.target.value)}
                        className="w-full rounded-lg border border-[#D1D5DB] p-2 font-mono text-xs font-bold text-[#1F2937] bg-white focus:ring-2 focus:ring-[#166534] focus:outline-none"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error Message Alert */}
            {formError && (
              <div className="p-3 bg-[#FEE2E2] text-[#DC2626] rounded-xl text-xs font-medium flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {savedSuccess && (
              <div className="p-3 bg-[#DCFCE7] text-[#14532D] rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-300">
                <CheckCircle className="w-4 h-4 text-[#166534]" />
                <span>ফলাফল সফলভাবে প্রকাশিত ও সংরক্ষিত হয়েছে! শিক্ষার্থী অনলাইনে তা দেখতে পারবে।</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary py-2.5 px-6 rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-white" />
              <span>ফলাফল সংরক্ষণ ও প্রকাশ করুন</span>
            </button>
          </form>
        </div>

        {/* Existing Results List */}
        <div className="lg:col-span-5 card-base bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3 font-bangla">
          <h3 className="font-bold text-[#1F2937] text-sm pb-2 border-b border-[#E5E7EB]">
            প্রকাশিত ফলাফল তালিকা ({lang === 'bn' ? toBanglaNumerals(results.length) : results.length} জন)
          </h3>

          <div className="space-y-2 max-h-[440px] overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className="p-3 bg-[#F7F9F8] rounded-xl border border-[#E5E7EB] text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#1F2937] block">{r.studentNameBn}</span>
                  <span className="text-[11px] text-[#4B5563] font-mono">
                    Roll: {r.roll} • Class: {r.class} ({r.exam})
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-[#166534] text-sm block">GPA {r.gpa}</span>
                  <span className="text-[10px] font-semibold text-[#15803D]">Grade: {r.letterGrade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
