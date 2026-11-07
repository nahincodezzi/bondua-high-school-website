import React, { useState } from 'react';
import { useSchool } from '../../context/useSchool';
import { toBanglaNumerals, toEnglishNumerals } from '../../utils/dateFormatter';
import { calculateSubjectGrade, calculateOverallGrade } from '../../utils/gradeCalculator';
import { 
  Award, 
  CheckCircle,
  AlertCircle,
  UserCheck,
  Trash2,
  Edit
} from 'lucide-react';

const SUBJECT_CONFIGS = {
  general: [
    { code: '101', name: 'Bangla', labelBn: 'বাংলা', max: 100 },
    { code: '107', name: 'English', labelBn: 'ইংরেজি', max: 100 },
    { code: '109', name: 'Mathematics', labelBn: 'গণিত', max: 100 },
    { code: '127', name: 'General Science', labelBn: 'সাধারণ বিজ্ঞান', max: 100 },
    { code: '150', name: 'BGS', labelBn: 'বাংলাদেশ ও বিশ্বপরিচয়', max: 100 },
    { code: '154', name: 'ICT', labelBn: 'তথ্য ও যোগাযোগ প্রযুক্তি', max: 50 },
    { code: '111', name: 'Religion', labelBn: 'ধর্ম ও নৈতিক শিক্ষা', max: 100 },
  ],
  secondary: {
    Science: [
      { code: '101', name: 'Bangla', labelBn: 'বাংলা', max: 100 },
      { code: '107', name: 'English', labelBn: 'ইংরেজি', max: 100 },
      { code: '109', name: 'Mathematics', labelBn: 'গণিত', max: 100 },
      { code: '136', name: 'Physics', labelBn: 'পদার্থবিজ্ঞান', max: 100 },
      { code: '137', name: 'Chemistry', labelBn: 'রসায়ন', max: 100 },
      { code: '138', name: 'Biology', labelBn: 'জীববিজ্ঞান', max: 100 },
      { code: '154', name: 'ICT', labelBn: 'তথ্য ও যোগাযোগ প্রযুক্তি', max: 50 },
      { code: '111', name: 'Religion', labelBn: 'ধর্ম ও নৈতিক শিক্ষা', max: 100 },
    ],
    'Business Studies': [
      { code: '101', name: 'Bangla', labelBn: 'বাংলা', max: 100 },
      { code: '107', name: 'English', labelBn: 'ইংরেজি', max: 100 },
      { code: '109', name: 'Mathematics', labelBn: 'গণিত', max: 100 },
      { code: '146', name: 'Accounting', labelBn: 'হিসাববিজ্ঞান', max: 100 },
      { code: '147', name: 'Business Ent.', labelBn: 'ব্যবসায় উদ্যোগ', max: 100 },
      { code: '148', name: 'Finance & Banking', labelBn: 'ফিন্যান্স ও ব্যাংকিং', max: 100 },
      { code: '154', name: 'ICT', labelBn: 'তথ্য ও যোগাযোগ প্রযুক্তি', max: 50 },
      { code: '111', name: 'Religion', labelBn: 'ধর্ম ও নৈতিক শিক্ষা', max: 100 },
    ],
    Humanities: [
      { code: '101', name: 'Bangla', labelBn: 'বাংলা', max: 100 },
      { code: '107', name: 'English', labelBn: 'ইংরেজি', max: 100 },
      { code: '109', name: 'Mathematics', labelBn: 'গণিত', max: 100 },
      { code: '153', name: 'History', labelBn: 'ইতিহাস', max: 100 },
      { code: '110', name: 'Geography', labelBn: 'ভূগোল', max: 100 },
      { code: '140', name: 'Civics', labelBn: 'পৌরনীতি ও নাগরিকতা', max: 100 },
      { code: '154', name: 'ICT', labelBn: 'তথ্য ও যোগাযোগ প্রযুক্তি', max: 50 },
      { code: '111', name: 'Religion', labelBn: 'ধর্ম ও নৈতিক শিক্ষা', max: 100 },
    ],
  },
};

export default function ResultManager() {
  const { results, addResult, deleteResult, students, lang } = useSchool();
  const [examName, setExamName] = useState('SSC Test Examination 2026');
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedGroup, setSelectedGroup] = useState('Science');
  const [selectedStudentRoll, setSelectedStudentRoll] = useState('');
  const [year] = useState('2026');
  const [formError, setFormError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [editingResultId, setEditingResultId] = useState(null);

  // Auto student preview
  const activeStudent = students.find(
    s => String(s.roll) === toEnglishNumerals(selectedStudentRoll.trim()) && String(s.class) === String(selectedClass)
  );

  // Determine active subjects list based on class and group (M2 / H7 Fix)
  const isSecondary = selectedClass === '9' || selectedClass === '10';
  const effectiveGroup = isSecondary ? (activeStudent?.group || selectedGroup || 'Science') : 'General';
  const currentSubjectList = isSecondary 
    ? (SUBJECT_CONFIGS.secondary[effectiveGroup] || SUBJECT_CONFIGS.secondary.Science)
    : SUBJECT_CONFIGS.general;

  const [marks, setMarks] = useState({});

  const handleMarkChange = (subjectName, val) => {
    setMarks(prev => ({ ...prev, [subjectName]: val }));
    setFormError('');
  };

  const handleEditResult = (r) => {
    setEditingResultId(r.id);
    setSelectedClass(String(r.class));
    setSelectedStudentRoll(String(r.roll));
    setExamName(r.exam);
    if (r.group) setSelectedGroup(r.group);
    
    const loadedMarks = {};
    if (Array.isArray(r.subjects)) {
      r.subjects.forEach(s => {
        loadedMarks[s.name] = s.marks != null ? String(s.marks) : '';
      });
    }
    setMarks(loadedMarks);
    setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteResult = (id, studentName, roll) => {
    if (confirm(`আপনি কি রোল ${toBanglaNumerals(roll)} (${studentName})-এর এই পরীক্ষার ফলাফল মুছে ফেলতে চান?`)) {
      if (deleteResult) {
        deleteResult(id);
      }
      if (editingResultId === id) {
        setEditingResultId(null);
        setMarks({});
        setSelectedStudentRoll('');
      }
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    setFormError('');

    const cleanRoll = toEnglishNumerals(selectedStudentRoll.trim());
    if (!cleanRoll) {
      setFormError('অনুগ্রহ করে শিক্ষার্থীর রোল নম্বর লিখুন।');
      return;
    }

    // Student Lookup Validation
    const matchedStudent = students.find(
      s => String(s.roll) === cleanRoll && String(s.class) === String(selectedClass)
    );

    if (!matchedStudent) {
      setFormError(`শ্রেণি ${toBanglaNumerals(selectedClass)} এবং রোল "${toBanglaNumerals(cleanRoll)}"-এ কোনো শিক্ষার্থী পাওয়া যায়নি! ফলাফল এন্ট্রি করার আগে শিক্ষার্থী ডাটাবেজে উপস্থিত থাকতে হবে।`);
      return;
    }

    // Validate Marks for each subject
    for (const sub of currentSubjectList) {
      const val = marks[sub.name];
      if (val === '' || val === null || val === undefined) {
        setFormError(`অনুগ্রহ করে "${sub.labelBn || sub.name}" বিষয়ের নম্বর সঠিকভাবে পূরণ করুন।`);
        return;
      }
      const numVal = Number(val);
      if (isNaN(numVal) || numVal < 0 || numVal > sub.max) {
        setFormError(`"${sub.labelBn || sub.name}" বিষয়ের নম্বর ০ থেকে ${sub.max}-এর মধ্যে হতে হবে।`);
        return;
      }
    }

    const subjectsArray = currentSubjectList.map(sub => {
      const markVal = Number(marks[sub.name]) || 0;
      return {
        code: sub.code,
        name: sub.name,
        labelBn: sub.labelBn,
        marks: markVal,
        ...calculateSubjectGrade(markVal, sub.max)
      };
    });

    const totalPoints = subjectsArray.reduce((acc, curr) => acc + curr.point, 0);
    const hasFail = subjectsArray.some(s => s.grade === 'F');
    const gpaVal = hasFail ? '0.00' : (totalPoints / subjectsArray.length).toFixed(2);
    const letterGradeVal = calculateOverallGrade(gpaVal, hasFail);

    // Unique ID: Class + Roll + Exam + Year (H1 fix)
    const resultRecord = {
      id: editingResultId || `${selectedClass}-${cleanRoll}-${examName}-${year}`,
      roll: cleanRoll,
      studentNameBn: matchedStudent.nameBn,
      studentNameEn: matchedStudent.nameEn,
      studentId: matchedStudent.studentId,
      class: selectedClass,
      group: effectiveGroup,
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
    setMarks({});
    setSelectedStudentRoll('');
    setEditingResultId(null);
    setTimeout(() => setSavedSuccess(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-bangla text-ink">
          ফলাফল ও নম্বর প্রদান ব্যবস্থাপনা (Marks Entry & Result Publishing)
        </h2>
        <p className="text-xs text-muted font-bangla">
          পরীক্ষার নম্বর ইনপুট দিন; শ্রেণি ও বিভাগ অনুযায়ী বিষয়সমূহ স্বয়ংক্রিয়ভাবে সাজানো হবে এবং পাবলিক পোর্টালে যুক্ত হবে।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Entry Form */}
        <div className="lg:col-span-7 card-base bg-white p-6 rounded-2xl border border-line shadow-xs space-y-4">
          <form onSubmit={handlePublish} className="space-y-4 text-xs font-bangla">
            {editingResultId && (
              <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-xs flex items-center justify-between border border-amber-200">
                <span className="font-bold">ফলাফল সম্পাদনা মোড সক্রিয় (Edit Mode)</span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingResultId(null);
                    setMarks({});
                    setSelectedStudentRoll('');
                  }}
                  className="text-xs underline cursor-pointer hover:text-amber-950"
                >
                  বাতিল করুন
                </button>
              </div>
            )}

            {/* Exam and Class Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-ink mb-1">পরীক্ষার নাম</label>
                <select
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  className="w-full rounded-lg border border-line p-2.5 bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="SSC Test Examination 2026">এসএসসি টেস্ট পরীক্ষা ২০২৬</option>
                  <option value="Annual Examination 2025">বার্ষিক পরীক্ষা ২০২৫</option>
                  <option value="Pre-Test Examination 2026">প্রাক-নির্বাচনী পরীক্ষা ২০২৬</option>
                  <option value="Half-Yearly Examination 2026">অর্ধবার্ষিক পরীক্ষা ২০২৬</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">শ্রেণি</label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setFormError('');
                  }}
                  className="w-full rounded-lg border border-line p-2.5 bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="10">১০ম শ্রেণি</option>
                  <option value="9">৯ম শ্রেণি</option>
                  <option value="8">৮ম শ্রেণি</option>
                  <option value="7">৭ম শ্রেণি</option>
                  <option value="6">৬ষ্ঠ শ্রেণি</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">শিক্ষার্থীর রোল *</label>
                <input
                  type="text"
                  required
                  value={selectedStudentRoll}
                  onChange={(e) => {
                    setSelectedStudentRoll(e.target.value);
                    setFormError('');
                  }}
                  className="w-full rounded-lg border border-line p-2.5 font-mono font-bold bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="যেমন: 101"
                />
              </div>
            </div>

            {/* Group selector for Class 9/10 (M2 fix) */}
            {isSecondary && (
              <div>
                <label className="block font-bold text-ink mb-1">বিভাগ (Group)</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Science', 'Business Studies', 'Humanities'].map(grp => (
                    <button
                      key={grp}
                      type="button"
                      onClick={() => setSelectedGroup(grp)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold cursor-pointer transition ${
                        effectiveGroup === grp
                          ? 'bg-deep text-white border-deep'
                          : 'bg-bg text-ink border-line hover:border-primary'
                      }`}
                    >
                      {grp === 'Science' ? 'বিজ্ঞান' : grp === 'Business Studies' ? 'ব্যবসায় শিক্ষা' : 'মানবিক'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Student Match Confirmation Pill */}
            {activeStudent ? (
              <div className="p-3 bg-soft text-deep rounded-xl text-xs flex items-center justify-between border border-soft-border">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-primary" />
                  <span className="font-bold">শিক্ষার্থী: {activeStudent.nameBn} ({activeStudent.studentId})</span>
                </div>
                <span className="font-semibold text-[11px] text-primary">শাখা {activeStudent.section} • বিভাগ {activeStudent.group}</span>
              </div>
            ) : selectedStudentRoll ? (
              <div className="p-2.5 bg-danger-soft text-danger rounded-xl text-xs flex items-center gap-1.5 border border-danger-soft">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>শ্রেণি {selectedClass}-এ এই রোলের কোনো শিক্ষার্থী পাওয়া যায়নি।</span>
              </div>
            ) : null}

            {/* Subject Marks Inputs Dynamically Rendered (M2 / H7 Fix) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-ink block">
                  {isSecondary ? `${effectiveGroup} বিভাগের নির্ধারিত বিষয়ভিত্তিক নম্বর:` : '৬ষ্ঠ-৮ম শ্রেণির নির্ধারিত বিষয়ভিত্তিক নম্বর:'}
                </span>
                <span className="text-[11px] text-muted font-medium">
                  {currentSubjectList.length}টি বিষয়
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentSubjectList.map((sub) => {
                  return (
                    <div key={sub.name} className="bg-bg p-2.5 rounded-xl border border-line">
                      <div className="flex justify-between items-center mb-1">
                        <label className="block font-bold text-ink text-[11px] truncate" title={sub.labelBn}>
                          {sub.labelBn || sub.name}
                        </label>
                        <span className="text-[10px] text-muted">/{sub.max}</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max={sub.max}
                        required
                        placeholder="0"
                        value={marks[sub.name] ?? ''}
                        onChange={(e) => handleMarkChange(sub.name, e.target.value)}
                        className="w-full rounded-lg border border-line p-2 font-mono text-xs font-bold text-ink bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error Message Alert */}
            {formError && (
              <div className="p-3 bg-danger-soft text-danger rounded-xl text-xs font-medium flex items-center gap-2 border border-danger-soft">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {savedSuccess && (
              <div className="p-3 bg-soft text-deep rounded-xl text-xs font-semibold flex items-center gap-2 border border-soft-border">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>ফলাফল সফলভাবে সংরক্ষিত ও প্রকাশিত হয়েছে! পাবলিক পোর্টালে দৃশ্যমান হবে।</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary py-2.5 px-6 rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-white" />
              <span>{editingResultId ? 'ফলাফল আপডেট করুন' : 'ফলাফল সংরক্ষণ ও প্রকাশ করুন'}</span>
            </button>
          </form>
        </div>

        {/* Existing Results List with Delete / Edit Actions (M1 Fix) */}
        <div className="lg:col-span-5 card-base bg-white p-6 rounded-2xl border border-line shadow-xs space-y-3 font-bangla">
          <div className="flex justify-between items-center pb-2 border-b border-line">
            <h3 className="font-bold text-ink text-sm">
              প্রকাশিত ফলাফল তালিকা ({lang === 'bn' ? toBanglaNumerals(results.length) : results.length} জন)
            </h3>
            <span className="text-[11px] text-muted">
              সম্পাদনা ও মোছার সুবিধা
            </span>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {results.length === 0 ? (
              <p className="text-center py-8 text-muted text-xs">কোনো ফলাফল প্রকাশিত নেই</p>
            ) : (
              results.map((r, i) => (
                <div key={r.id || i} className="p-3 bg-bg rounded-xl border border-line text-xs flex items-center justify-between gap-2 hover:border-line-hover transition">
                  <div className="min-w-0">
                    <span className="font-bold text-ink block truncate">{r.studentNameBn || r.studentName}</span>
                    <span className="text-[11px] text-muted font-mono block">
                      Roll: {r.roll} • Class: {r.class} ({r.exam})
                    </span>
                    <span className="text-[10px] text-muted">
                      বিভাগ: {r.group || 'Science'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="text-right">
                      <span className="font-mono font-bold text-primary text-sm block">GPA {r.gpa}</span>
                      <span className="text-[10px] font-semibold text-success">Grade: {r.letterGrade || r.grade}</span>
                    </div>

                    <div className="flex items-center gap-1 border-l border-line pl-2">
                      <button
                        type="button"
                        onClick={() => handleEditResult(r)}
                        title="সম্পাদনা করুন"
                        className="p-1.5 rounded-lg text-primary hover:bg-soft transition cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteResult(r.id, r.studentNameBn || r.studentName, r.roll)}
                        title="মুছে ফেলুন"
                        className="p-1.5 rounded-lg text-danger hover:bg-danger-soft transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
