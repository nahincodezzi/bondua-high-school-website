import React, { useState } from 'react';
import { useSchool } from '../../context/useSchool';
import { 
  Award, 
  CheckCircle
} from 'lucide-react';

export default function ResultManager() {
  const { results, addResult, students } = useSchool();
  const [examName, setExamName] = useState('SSC Test Examination 2026');
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedStudentRoll, setSelectedStudentRoll] = useState('101');
  const [year] = useState('2026');

  // Subject marks state
  const [marks, setMarks] = useState({
    Bangla: 80,
    English: 75,
    Mathematics: 85,
    Physics: 82,
    Chemistry: 78,
    Biology: 88,
    ICT: 45,
    Religion: 90
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const calculateGradePoint = (mark, max = 100) => {
    const percentage = (mark / max) * 100;
    if (percentage >= 80) return { grade: 'A+', point: 5.0 };
    if (percentage >= 70) return { grade: 'A', point: 4.0 };
    if (percentage >= 60) return { grade: 'A-', point: 3.5 };
    if (percentage >= 50) return { grade: 'B', point: 3.0 };
    if (percentage >= 40) return { grade: 'C', point: 2.0 };
    if (percentage >= 33) return { grade: 'D', point: 1.0 };
    return { grade: 'F', point: 0.0 };
  };

  const handleMarkChange = (subject, val) => {
    setMarks(prev => ({ ...prev, [subject]: Number(val) }));
  };

  const handlePublish = (e) => {
    e.preventDefault();
    const matchedStudent = students.find(s => s.roll.toString() === selectedStudentRoll) || {
      nameBn: 'তানভীর আহমেদ তানিম',
      nameEn: 'Tanvir Ahmed Tanim',
      studentId: `BDHS-2026-${selectedStudentRoll}`,
      group: 'Science',
      section: 'A'
    };

    const subjectsArray = [
      { code: '101', name: 'Bangla', marks: marks.Bangla, ...calculateGradePoint(marks.Bangla) },
      { code: '107', name: 'English', marks: marks.English, ...calculateGradePoint(marks.English) },
      { code: '109', name: 'Mathematics', marks: marks.Mathematics, ...calculateGradePoint(marks.Mathematics) },
      { code: '136', name: 'Physics', marks: marks.Physics, ...calculateGradePoint(marks.Physics) },
      { code: '137', name: 'Chemistry', marks: marks.Chemistry, ...calculateGradePoint(marks.Chemistry) },
      { code: '138', name: 'Biology', marks: marks.Biology, ...calculateGradePoint(marks.Biology) },
      { code: '154', name: 'ICT', marks: marks.ICT, ...calculateGradePoint(marks.ICT, 50) },
      { code: '111', name: 'Religion', marks: marks.Religion, ...calculateGradePoint(marks.Religion) }
    ];

    const totalPoints = subjectsArray.reduce((acc, curr) => acc + curr.point, 0);
    const hasFail = subjectsArray.some(s => s.grade === 'F');
    const gpaVal = hasFail ? '0.00' : (totalPoints / subjectsArray.length).toFixed(2);
    const letterGradeVal = hasFail ? 'F' : Number(gpaVal) >= 5.0 ? 'A+' : Number(gpaVal) >= 4.0 ? 'A' : 'A-';

    const resultRecord = {
      roll: selectedStudentRoll,
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
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-bangla text-slate-900">
          ফলাফল ও নম্বর প্রদান ব্যবস্থাপনা (Marks Entry & Result Publishing)
        </h2>
        <p className="text-xs text-slate-500 font-bangla">
          পরীক্ষার নম্বর ইনপুট দিন; জিপিএ এবং লেটার গ্রেড স্বয়ংক্রিয়ভাবে হিসাব হয়ে পাবলিক পোর্টালে যুক্ত হবে
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Entry Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <form onSubmit={handlePublish} className="space-y-4 text-xs font-bangla">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">পরীক্ষার নাম</label>
                <select
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 bg-white"
                >
                  <option value="SSC Test Examination 2026">এসএসসি টেস্ট পরীক্ষা ২০২৬</option>
                  <option value="Annual Examination 2025">বার্ষিক পরীক্ষা ২০২৫</option>
                  <option value="Pre-Test Examination 2026">প্রাক-নির্বাচনী পরীক্ষা ২০২৬</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">শ্রেণি</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 bg-white"
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
                  onChange={(e) => setSelectedStudentRoll(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 font-mono"
                  placeholder="যেমন: 101"
                />
              </div>
            </div>

            {/* Subject Marks Table Inputs */}
            <div>
              <span className="font-bold text-slate-700 block mb-2">বিষয়ভিত্তিক প্রাপ্ত নম্বর (পূর্ণমান ১০০, আইসিটি ৫০):</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.keys(marks).map((sub) => (
                  <div key={sub} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <label className="block font-bold text-slate-700 mb-1 text-[11px]">{sub}</label>
                    <input
                      type="number"
                      min="0"
                      max={sub === 'ICT' ? '50' : '100'}
                      value={marks[sub]}
                      onChange={(e) => handleMarkChange(sub, e.target.value)}
                      className="w-full rounded border border-slate-300 p-1.5 font-mono text-xs font-bold text-slate-800"
                    />
                  </div>
                ))}
              </div>
            </div>

            {savedSuccess && (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>ফলাফল সফলভাবে প্রকাশিত ও সংরক্ষিত হয়েছে! শিক্ষার্থী অনলাইনে তা দেখতে পারবে।</span>
              </div>
            )}

            <button
              type="submit"
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition shadow flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>ফলাফল সংরক্ষণ ও প্রকাশ করুন</span>
            </button>
          </form>
        </div>

        {/* Existing Results List */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 font-bangla">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b">
            প্রকাশিত ফলাফল তালিকা ({results.length} জন)
          </h3>

          <div className="space-y-2 max-h-[420px] overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{r.studentNameBn}</span>
                  <span className="text-[11px] text-slate-500 font-mono">Roll: {r.roll} • Class: {r.class}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-800 text-sm block">GPA {r.gpa}</span>
                  <span className="text-[10px] font-semibold text-emerald-700">Grade: {r.letterGrade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
