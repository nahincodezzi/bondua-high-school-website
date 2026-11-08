import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import SchoolLogo from './common/SchoolLogo';
import { useSchool } from '../context/useSchool';
import { toEnglishNumerals, toBanglaNumerals } from '../utils/dateFormatter';
import { calculateOverallGrade } from '../utils/gradeCalculator';
import { getSignatories } from '../utils/signatories';
import { 
  GraduationCap, 
  Search, 
  Printer, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  FileCheck
} from 'lucide-react';

export default function ResultSearch() {
  const { lang, results, schoolInfo, teachers, systemUsers, availableExams = [], availableClasses = [] } = useSchool();
  const signatories = getSignatories(schoolInfo, teachers, systemUsers);
  const [examType, setExamType] = useState('SSC Test Examination 2026');
  const [targetClass, setTargetClass] = useState('10');
  const [rollInput, setRollInput] = useState('');
  const [regInput, setRegInput] = useState('');
  const [searchedResult, setSearchedResult] = useState(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSearch = (e) => {
    e?.preventDefault();
    setValidationError('');
    setSearchAttempted(false);
    setSearchedResult(null);

    const rawRoll = rollInput.trim();
    if (!rawRoll) {
      setValidationError(lang === 'bn' ? 'অনুগ্রহ করে শিক্ষার্থীর রোল নম্বর লিখুন।' : 'Please enter student roll number.');
      return;
    }

    // Convert Bangla digits [০-৯] to English [0-9] (H5)
    const convertedRoll = toEnglishNumerals(rawRoll);

    // Validate that it consists only of numeric digits (L2)
    if (!/^\d+$/.test(convertedRoll)) {
      setValidationError(lang === 'bn' ? 'রোল নম্বর শুধুমাত্র সংখ্যায় (যেমন: ১০১ বা 101) হতে হবে।' : 'Roll number must contain digits only.');
      return;
    }

    const rawReg = regInput.trim().toUpperCase();
    const convertedReg = toEnglishNumerals(rawReg);

    setSearchAttempted(true);
    const found = results.find(
      r => {
        const matchExam = !examType || r.exam === examType;
        const matchRoll = r.roll.toString() === convertedRoll;
        const matchClass = !targetClass || r.class === targetClass;
        const matchReg = !convertedReg || 
          r.studentId?.toUpperCase().includes(convertedReg) || 
          (r.regNo && r.regNo.toString().includes(convertedReg));
        return matchExam && matchRoll && matchClass && matchReg;
      }
    );

    if (found) {
      setSearchedResult(found);
    } else {
      setSearchedResult(null);
    }
  };

  const handlePrint = () => {
    document.body.classList.add('printing-marksheet');
    const cleanup = () => {
      document.body.classList.remove('printing-marksheet');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    window.print();
    setTimeout(cleanup, 1200);
  };

  const handleReset = () => {
    setRollInput('');
    setRegInput('');
    setSearchedResult(null);
    setSearchAttempted(false);
    setValidationError('');
  };

  useEffect(() => {
    if (!searchedResult) return;
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchedResult]);

  return (
    <section className="py-12 sm:py-16 text-ink relative z-10 font-sans min-h-[700px] print:py-0 print:min-h-0 print:m-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 print:max-w-full print:p-0 print:m-0">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 no-print">
          <div className="inline-flex items-center gap-1.5 bg-soft text-deep text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-xs border border-soft-border">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span>{lang === 'bn' ? 'অনলাইন ফলাফল পোর্টাল' : 'Online Result Portal'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-bangla text-ink leading-tight">
            {lang === 'bn' ? 'পরীক্ষার ফলাফল ও গ্রেডশিট অনুসন্ধান' : 'Examination Results & Official Marksheet'}
          </h2>
          <p className="text-xs sm:text-sm text-muted font-bangla mt-2">
            {lang === 'bn' 
              ? 'রোল নম্বর ও শ্রেণি নির্বাচন করে তাৎক্ষণিক ডিজিটাল মার্কশিট দেখুন ও প্রিন্ট করুন'
              : 'Enter student roll number and class to view and print the verified institutional marksheet.'}
          </p>
        </div>

        {/* Search Box - Hidden during print */}
        <div className="card-base p-6 sm:p-8 rounded-2xl shadow-sm border border-line mb-8 no-print bg-white">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
            {/* Exam Select */}
            <div>
              <label htmlFor="exam-select" className="block text-xs font-bold text-ink mb-1.5 font-bangla">
                {lang === 'bn' ? 'পরীক্ষার নাম' : 'Examination'}
              </label>
              <select
                id="exam-select"
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full text-xs font-bangla rounded-lg p-3 bg-bg border border-line text-ink focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {availableExams.map((ex) => (
                  <option key={ex.name || ex.id} value={ex.name}>
                    {lang === 'bn' ? (ex.labelBn || ex.name) : ex.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Select */}
            <div>
              <label htmlFor="class-select" className="block text-xs font-bold text-ink mb-1.5 font-bangla">
                {lang === 'bn' ? 'শ্রেণি' : 'Class'}
              </label>
              <select
                id="class-select"
                value={targetClass}
                onChange={(e) => {
                  const val = e.target.value;
                  setTargetClass(val);
                }}
                className="w-full text-xs font-bangla rounded-lg p-3 bg-bg border border-line text-ink focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {availableClasses.map((cls) => (
                  <option key={cls.key || cls.id} value={cls.key}>
                    {cls.labelBn || `${toBanglaNumerals(cls.key)} শ্রেণি`} ({cls.labelEn || `Class ${cls.key}`})
                  </option>
                ))}
              </select>
            </div>

            {/* Roll Number Input (with numeric inputMode, Bangla digit support and custom validity - L2) */}
            <div>
              <label htmlFor="roll-input" className="block text-xs font-bold text-ink mb-1.5 font-bangla">
                {lang === 'bn' ? 'রোল নম্বর *' : 'Roll Number *'}
              </label>
              <input
                id="roll-input"
                name="roll"
                type="text"
                inputMode="numeric"
                pattern="[0-9০-৯]+"
                required
                placeholder={lang === 'bn' ? 'যেমন: ১০১ বা 101' : 'e.g. 101'}
                value={rollInput}
                onInvalid={(e) => e.target.setCustomValidity(lang === 'bn' ? 'অনুগ্রহ করে সঠিক রোল নম্বর দিন' : 'Please enter a valid roll number')}
                onInput={(e) => e.target.setCustomValidity('')}
                onChange={(e) => {
                  setRollInput(e.target.value);
                  setValidationError('');
                }}
                className="w-full text-xs font-mono font-bold rounded-lg p-3 border border-line bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Student ID / Registration Number Verification (C6 Privacy Fix) */}
            <div>
              <label htmlFor="reg-input" className="block text-xs font-bold text-ink mb-1.5 font-bangla">
                {lang === 'bn' ? 'রেজিস্ট্রেশন / আইডি' : 'Student ID / Reg'}
              </label>
              <input
                id="reg-input"
                name="regNo"
                type="text"
                placeholder={lang === 'bn' ? 'যেমন: 601 (ঐচ্ছিক)' : 'e.g. 601 (optional)'}
                value={regInput}
                onChange={(e) => {
                  setRegInput(e.target.value);
                  setValidationError('');
                }}
                className="w-full text-xs font-mono rounded-lg p-3 border border-line bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full btn-accent py-3 px-4 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm font-bangla font-bold rounded-lg"
              >
                <Search className="w-4 h-4 text-ink" />
                <span>{lang === 'bn' ? 'ফলাফল দেখুন' : 'Get Result'}</span>
              </button>
            </div>
          </form>

          {/* Inline Validation Error Message (L1, L2) */}
          {validationError && (
            <div className="mt-3 p-3 bg-danger-soft text-danger rounded-lg text-xs font-medium font-bangla flex items-center gap-2 border border-danger-soft">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Result Marksheet Display */}
        {searchedResult ? (
          <div className="bg-white rounded-2xl shadow-md border border-line overflow-hidden relative" id="official-marksheet-screen">
            {/* Top Toolbar for Result */}
            <div className="bg-deep text-white px-6 py-3.5 flex items-center justify-between no-print border-b border-primary">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <FileCheck className="w-4 h-4 text-accent" />
                <span className="text-white font-bangla">{lang === 'bn' ? 'অনলাইন ট্রান্সক্রিপ্ট ও গ্রেড শিট' : 'Academic Grade Sheet'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleReset}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs transition flex items-center gap-1 font-bangla border border-white/20 cursor-pointer text-white no-print print:hidden"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-accent" />
                  <span>{lang === 'bn' ? 'পুনরায় অনুসন্ধান' : 'Search Again'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="btn-accent px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer no-print print:hidden"
                >
                  <Printer className="w-3.5 h-3.5 text-ink" />
                  <span>{lang === 'bn' ? 'মার্কশিট প্রিন্ট করুন' : 'Print Marksheet'}</span>
                </button>
              </div>
            </div>

            {/* Official Marksheet Document Container */}
            <div className="p-6 sm:p-10 bg-white text-ink space-y-6 relative print:p-2 print:space-y-1">
              {/* Unofficial Copy Watermark Banner (Content 6) */}
              <div className="bg-warning-soft border border-accent text-warning px-4 py-2 rounded-lg text-xs font-bold text-center font-bangla print:py-0.5 print:px-2 print:text-[7pt] print:rounded print:mb-0.5">
                ⚠️ {lang === 'bn' 
                  ? 'অনানুষ্ঠানিক ডিজিটাল কপি — শুধুমাত্র অবগতির জন্য প্রযোজ্য (অফিসিয়াল স্বাক্ষরিত কপির জন্য বিদ্যালয় কার্যালয়ে যোগাযোগ করুন)' 
                  : 'UNOFFICIAL DIGITAL COPY — FOR INFORMATION ONLY (Contact school office for signed original certificate)'}
              </div>

              {/* Header Letterhead */}
              <div className="text-center border-b-2 border-deep pb-4 print:pb-1 print:border-b print:border-deep">
                <div className="flex justify-center mb-2 print:mb-0.5">
                  <div className="w-14 h-14 print:w-8 print:h-8 rounded-full bg-white p-0.5 shadow-sm ring-2 ring-primary">
                    <SchoolLogo logo={schoolInfo.logo} />
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl print:text-[12pt] font-extrabold font-bangla text-deep leading-tight">
                  {lang === 'bn' ? schoolInfo.nameBn : (schoolInfo.nameEn || 'Bandua Daulatpur High School')}
                </h3>
                <p className="text-xs sm:text-sm print:text-[7.5pt] text-ink font-semibold font-bangla print:leading-none print:mt-0.5">
                  {schoolInfo.addressBn}
                </p>
                <p className="text-xs print:text-[6.5pt] text-muted font-mono mt-1 print:mt-0.5 print:leading-none">
                  EIIN: {schoolInfo.eiin} • MPO Code: {schoolInfo.mpoCode} • Comilla Board
                </p>
                <div className="mt-3 print:mt-0.5 inline-block bg-deep text-white px-4 py-1 print:px-2 print:py-0.2 rounded text-xs print:text-[7pt] font-bold uppercase tracking-wider font-bangla">
                  {lang === 'bn' ? 'একাডেমিক ট্রান্সক্রিপ্ট / গ্রেড শিট' : 'ACADEMIC TRANSCRIPT / GRADE REPORT'}
                </div>
                <p className="text-xs print:text-[7.5pt] text-muted mt-1 print:mt-0.5 font-bold">{searchedResult.exam}</p>
              </div>

              {/* Student Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 print:gap-1 bg-bg p-4 print:p-1.5 rounded-xl print:rounded-md border border-line text-xs print:text-[7.5pt]">
                <div>
                  <span className="text-muted block font-bangla print:text-[6.5pt]">{lang === 'bn' ? 'শিক্ষার্থীর নাম:' : 'Student Name:'}</span>
                  <span className="font-bold text-ink font-bangla text-sm print:text-[8pt] block truncate">
                    {lang === 'bn' ? searchedResult.studentNameBn : searchedResult.studentNameEn}
                  </span>
                </div>
                <div>
                  <span className="text-muted block font-bangla print:text-[6.5pt]">{lang === 'bn' ? 'রোল নম্বর:' : 'Roll Number:'}</span>
                  <span className="font-mono font-bold text-ink text-sm print:text-[8pt]">
                    {lang === 'bn' ? toBanglaNumerals(searchedResult.roll) : searchedResult.roll}
                  </span>
                </div>
                <div>
                  <span className="text-muted block font-bangla print:text-[6.5pt]">{lang === 'bn' ? 'শ্রেণি ও বিভাগ:' : 'Class & Section:'}</span>
                  <span className="font-bold text-ink font-bangla print:text-[8pt]">
                    {lang === 'bn' 
                      ? `শ্রেণি: ${toBanglaNumerals(searchedResult.class)}, শাখা: ${searchedResult.section}` 
                      : `Class: ${searchedResult.class}, Sec: ${searchedResult.section}`}
                  </span>
                </div>
                <div>
                  <span className="text-muted block font-bangla print:text-[6.5pt]">{lang === 'bn' ? 'বিভাগ (গ্রুপ):' : 'Group:'}</span>
                  <span className="font-bold text-primary font-bangla print:text-[8pt]">{searchedResult.group}</span>
                </div>
                <div>
                  <span className="text-muted block print:text-[6.5pt]">{lang === 'bn' ? 'আইডি নম্বর:' : 'Student ID:'}</span>
                  <span className="font-mono text-ink print:text-[8pt]">{searchedResult.studentId}</span>
                </div>
                <div>
                  <span className="text-muted block print:text-[6.5pt]">{lang === 'bn' ? 'শিক্ষাবর্ষ:' : 'Academic Year:'}</span>
                  <span className="font-mono text-ink print:text-[8pt]">{lang === 'bn' ? toBanglaNumerals(searchedResult.year) : searchedResult.year}</span>
                </div>
                <div>
                  <span className="text-muted block print:text-[6.5pt]">{lang === 'bn' ? 'ফলাফল:' : 'Result Status:'}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-success print:text-[8pt]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success print:w-2.5 print:h-2.5" />
                    <span>{searchedResult.resultStatus === 'PASSED' ? (lang === 'bn' ? 'উত্তীর্ণ' : 'PASSED') : (lang === 'bn' ? 'অনূত্তীর্ণ' : 'FAILED')}</span>
                  </span>
                </div>
                <div>
                  <span className="text-muted block print:text-[6.5pt]">{lang === 'bn' ? 'জিপিএ (GPA):' : 'GPA Score:'}</span>
                  <span className="font-mono font-extrabold text-base print:text-[8.5pt] text-primary">
                    {lang === 'bn' ? toBanglaNumerals(searchedResult.gpa ?? '0.00') : (searchedResult.gpa ?? '0.00')} ({calculateOverallGrade(searchedResult.gpa, searchedResult.resultStatus === 'FAILED') || searchedResult.letterGrade || searchedResult.grade})
                  </span>
                </div>
              </div>

              {/* Subject Marks & Grades Table with Full Marks Column (M11) */}
              <div className="border border-line rounded-xl print:rounded-md overflow-hidden print:border-slate-300">
                <table className="w-full text-left text-xs sm:text-sm print:text-[7.5pt]">
                  <thead className="bg-bg text-ink border-b border-line font-bold uppercase text-[11px] print:text-[7pt]">
                    <tr>
                      <th className="py-3 px-3 print:py-0.5 print:px-1.5 w-16 text-center font-mono">Code</th>
                      <th className="py-3 px-4 print:py-0.5 print:px-1.5">{lang === 'bn' ? 'বিষয়ের নাম' : 'Subject Name'}</th>
                      <th className="py-3 px-3 print:py-0.5 print:px-1.5 text-center">{lang === 'bn' ? 'পূর্ণমান' : 'Total'}</th>
                      <th className="py-3 px-4 print:py-0.5 print:px-1.5 text-center font-mono">{lang === 'bn' ? 'প্রাপ্ত নম্বর' : 'Marks'}</th>
                      <th className="py-3 px-4 print:py-0.5 print:px-1.5 text-center">{lang === 'bn' ? 'লেটার গ্রেড' : 'Grade'}</th>
                      <th className="py-3 px-4 print:py-0.5 print:px-1.5 text-center font-mono">{lang === 'bn' ? 'গ্রেড পয়েন্ট' : 'Point'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line print:divide-slate-200">
                    {(searchedResult.subjects && searchedResult.subjects.length > 0) ? (
                      searchedResult.subjects.map((sub, i) => {
                        const isICT = sub.code === '154' || sub.name?.toLowerCase().includes('ict');
                        const fullMark = isICT ? 50 : 100;
                        const subPoint = Number(sub.point) || 0;
                        return (
                          <tr key={i} className="hover:bg-bg transition-colors">
                            <td className="py-3 px-3 print:py-0.5 print:px-1.5 text-center font-mono text-muted">{sub.code || '-'}</td>
                            <td className="py-3 px-4 print:py-0.5 print:px-1.5 font-medium text-ink font-bangla">{sub.name}</td>
                            <td className="py-3 px-3 print:py-0.5 print:px-1.5 text-center font-mono text-muted">
                              {lang === 'bn' ? toBanglaNumerals(fullMark) : fullMark}
                            </td>
                            <td className="py-3 px-4 print:py-0.5 print:px-1.5 text-center font-mono font-bold text-ink">
                              {lang === 'bn' ? toBanglaNumerals(sub.marks) : sub.marks}
                            </td>
                            <td className="py-3 px-4 print:py-0.5 print:px-1.5 text-center font-bold text-primary">{sub.grade || 'A'}</td>
                            <td className="py-3 px-4 print:py-0.5 print:px-1.5 text-center font-mono font-semibold text-ink">
                              {lang === 'bn' ? toBanglaNumerals(subPoint.toFixed(2)) : subPoint.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-6 print:py-1 text-muted font-bangla">
                          {lang === 'bn' ? 'বিষয়ভিত্তিক প্রাপ্ত নম্বরের বিবরণী প্রক্রিয়াধীন।' : 'Detailed subject marksheet is being processed.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-soft/40 border-t-2 border-primary font-bold text-xs sm:text-sm print:text-[8pt]">
                    <tr>
                      <td colSpan="4" className="py-3.5 px-4 print:py-0.5 print:px-1.5 text-right font-bangla text-deep">
                        {lang === 'bn' ? 'সর্বমোট গ্রেড পয়েন্ট গড় (GPA):' : 'Grade Point Average (GPA):'}
                      </td>
                      <td className="py-3.5 px-4 print:py-0.5 print:px-1.5 text-center text-deep font-extrabold text-base print:text-[8.5pt]">
                        {calculateOverallGrade(searchedResult.gpa, searchedResult.resultStatus === 'FAILED') || searchedResult.letterGrade || searchedResult.grade}
                      </td>
                      <td className="py-3.5 px-4 print:py-0.5 print:px-1.5 text-center font-mono text-deep font-extrabold text-base print:text-[8.5pt]">
                        {lang === 'bn' ? toBanglaNumerals(searchedResult.gpa ?? '0.00') : (searchedResult.gpa ?? '0.00')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Bangladesh Secondary Grading Scale Reference */}
              <div className="bg-bg p-3.5 print:p-1 rounded-xl print:rounded-md border border-line text-[10px] print:text-[6.5pt] text-muted">
                <span className="font-bold text-ink block mb-1 print:mb-0.2">Grading Scale (Comilla Education Board):</span>
                <div className="flex flex-wrap gap-x-4 print:gap-x-2 gap-y-1 print:gap-y-0.2">
                  <span>80-100: <strong className="text-primary">A+ (5.00)</strong></span>
                  <span>70-79: <strong className="text-primary">A (4.00)</strong></span>
                  <span>60-69: <strong className="text-primary">A- (3.50)</strong></span>
                  <span>50-59: <strong className="text-primary">B (3.00)</strong></span>
                  <span>40-49: <strong className="text-primary">C (2.00)</strong></span>
                  <span>33-39: <strong className="text-primary">D (1.00)</strong></span>
                  <span>0-32: <strong className="text-danger">F (0.00) Fail</strong></span>
                </div>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-8 print:pt-1.5 flex justify-between items-end text-xs print:text-[7.5pt]">
                {/* Dynamic Exam Controller (Left) */}
                <div className="text-center space-y-0.5 min-w-[110px]">
                  <div className="w-28 print:w-20 border-b border-line mx-auto pb-0.5">
                    <span className="font-serif italic text-primary font-bold text-sm print:text-[9.5pt]">
                      {signatories.examController.signature}
                    </span>
                  </div>
                  <p className="font-bold text-ink font-bangla print:text-[7.5pt]">{signatories.examController.nameBn}</p>
                  <p className="text-muted print:text-[6.5pt] font-bangla">{signatories.examController.designationBn}</p>
                </div>

                {/* Institute Seal Stamp (Center) */}
                <div className="w-16 h-16 print:w-9 print:h-9 rounded-full border-2 border-dashed border-primary text-primary flex flex-col items-center justify-center p-0.5 text-[7px] print:text-[4.5pt] text-center font-bold">
                  <span>BANDUA DAULATPUR</span>
                  <span>HIGH SCHOOL</span>
                  <span>SEAL</span>
                </div>

                {/* Dynamic Headmaster (Right) */}
                <div className="text-center space-y-0.5 min-w-[110px]">
                  <div className="w-28 print:w-20 border-b border-line mx-auto pb-0.5">
                    <span className="font-serif italic text-primary font-bold text-sm print:text-[9.5pt]">
                      {signatories.headmaster.signature}
                    </span>
                  </div>
                  <p className="font-bold text-ink font-bangla print:text-[7.5pt]">{signatories.headmaster.nameBn}</p>
                  <p className="text-muted font-bangla print:text-[6.5pt]">{signatories.headmaster.designationBn}</p>
                </div>
              </div>
            </div>
          </div>
        ) : searchAttempted ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-danger-soft text-center max-w-lg mx-auto">
            <div className="w-12 h-12 bg-danger-soft text-danger rounded-full flex items-center justify-center mx-auto mb-3 border border-danger-soft">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-bangla text-ink">
              {lang === 'bn' ? 'ফলাফল পাওয়া যায়নি' : 'No Result Record Found'}
            </h3>
            <p className="text-xs text-muted font-bangla mt-1">
              {lang === 'bn' 
                ? `রোল নং "${toBanglaNumerals(rollInput)}" এবং শ্রেণি ${toBanglaNumerals(targetClass)}-এর কোনো ফলাফল রেকর্ড পাওয়া যায়নি। অনুগ্রহ করে রোল নম্বর ও শ্রেণি যাচাই করুন অথবা বিদ্যালয় অফিসে যোগাযোগ করুন।`
                : `No academic record found matching Roll "${rollInput}" for Class ${targetClass}. Please verify the roll number or contact the school office.`}
            </p>
          </div>
        ) : null}

        {/* Dedicated Single-Page Printable Marksheet Root (Portaled directly to document.body) */}
        {typeof document !== 'undefined' && searchedResult && createPortal(
          <div id="printable-marksheet-root" className="bg-white text-ink font-bangla p-3 space-y-2">
            {/* Unofficial Copy Watermark Banner */}
            <div className="bg-amber-50 border border-amber-300 text-amber-800 px-2 py-0.5 rounded text-[6.5pt] font-bold text-center font-bangla leading-tight">
              ⚠️ {lang === 'bn' 
                ? 'অনানুষ্ঠানিক ডিজিটাল কপি — শুধুমাত্র অবগতির জন্য প্রযোজ্য (অফিসিয়াল স্বাক্ষরিত কপির জন্য বিদ্যালয় কার্যালয়ে যোগাযোগ করুন)' 
                : 'UNOFFICIAL DIGITAL COPY — FOR INFORMATION ONLY (Contact school office for signed original certificate)'}
            </div>

            {/* Header Letterhead */}
            <div className="text-center border-b border-slate-900 pb-1">
              <div className="flex justify-center mb-0.5">
                <div className="w-8 h-8 rounded-full bg-white p-0.5 ring-1 ring-emerald-600">
                  <SchoolLogo logo={schoolInfo.logo} />
                </div>
              </div>
              <h3 className="text-[12pt] font-extrabold font-bangla text-slate-900 leading-tight">
                {schoolInfo.nameBn}
              </h3>
              <p className="text-[7.5pt] text-slate-700 font-semibold font-bangla leading-tight mt-0.5">
                {schoolInfo.addressBn} • কুমিল্লা শিক্ষা বোর্ড
              </p>
              <p className="text-[6.5pt] text-slate-500 font-mono leading-tight mt-0.5">
                EIIN: {schoolInfo.eiin} • MPO Code: {schoolInfo.mpoCode} • স্থাপিত: ১৯৯০
              </p>
              <div className="mt-1 inline-block bg-slate-900 text-white px-2 py-0.5 rounded text-[7pt] font-bold uppercase tracking-wider font-bangla">
                {lang === 'bn' ? 'একাডেমিক ট্রান্সক্রিপ্ট / গ্রেড শিট' : 'ACADEMIC TRANSCRIPT / GRADE REPORT'}
              </div>
              <p className="text-[7.5pt] text-slate-600 mt-0.5 font-bold">{searchedResult.exam}</p>
            </div>

            {/* Student Metadata Grid */}
            <div className="grid grid-cols-4 gap-1 bg-slate-50 p-1.5 rounded border border-slate-200 text-[7.5pt]">
              <div>
                <span className="text-slate-500 block text-[6.5pt]">শিক্ষার্থীর নাম:</span>
                <span className="font-bold text-slate-900 block truncate">{searchedResult.studentNameBn}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[6.5pt]">রোল নম্বর:</span>
                <span className="font-mono font-bold text-slate-900">{toBanglaNumerals(searchedResult.roll)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[6.5pt]">শ্রেণি ও বিভাগ:</span>
                <span className="font-bold text-slate-900">শ্রেণি: {toBanglaNumerals(searchedResult.class)}, শাখা: {searchedResult.section}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[6.5pt]">বিভাগ (গ্রুপ):</span>
                <span className="font-bold text-emerald-700">{searchedResult.group}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[6.5pt]">আইডি নম্বর:</span>
                <span className="font-mono text-slate-800">{searchedResult.studentId}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[6.5pt]">শিক্ষাবর্ষ:</span>
                <span className="font-mono text-slate-800">{toBanglaNumerals(searchedResult.year)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[6.5pt]">ফলাফল:</span>
                <span className="font-bold text-emerald-700">
                  {searchedResult.resultStatus === 'PASSED' ? 'উত্তীর্ণ' : 'অনূত্তীর্ণ'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[6.5pt]">জিপিএ (GPA):</span>
                <span className="font-mono font-extrabold text-emerald-700">
                  {toBanglaNumerals(searchedResult.gpa ?? '0.00')} ({calculateOverallGrade(searchedResult.gpa, searchedResult.resultStatus === 'FAILED') || searchedResult.letterGrade || searchedResult.grade})
                </span>
              </div>
            </div>

            {/* Subject Marks Table */}
            <table className="w-full text-left text-[7.5pt] border border-slate-300">
              <thead className="bg-slate-100 text-slate-900 border-b border-slate-300 font-bold uppercase text-[7pt]">
                <tr>
                  <th className="py-1 px-1.5 text-center font-mono w-12">Code</th>
                  <th className="py-1 px-2">বিষয়ের নাম</th>
                  <th className="py-1 px-1.5 text-center w-14">পূর্ণমান</th>
                  <th className="py-1 px-2 text-center font-mono w-16">প্রাপ্ত নম্বর</th>
                  <th className="py-1 px-2 text-center w-16">লেটার গ্রেড</th>
                  <th className="py-1 px-2 text-center font-mono w-16">গ্রেড পয়েন্ট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {searchedResult.subjects?.map((sub, i) => {
                  const isICT = sub.code === '154' || sub.name?.toLowerCase().includes('ict');
                  const fullMark = isICT ? 50 : 100;
                  const subPoint = Number(sub.point) || 0;
                  return (
                    <tr key={i}>
                      <td className="py-0.5 px-1.5 text-center font-mono text-slate-500">{sub.code || '-'}</td>
                      <td className="py-0.5 px-2 font-medium text-slate-900">{sub.name}</td>
                      <td className="py-0.5 px-1.5 text-center font-mono text-slate-600">{toBanglaNumerals(fullMark)}</td>
                      <td className="py-0.5 px-2 text-center font-mono font-bold text-slate-900">{toBanglaNumerals(sub.marks)}</td>
                      <td className="py-0.5 px-2 text-center font-bold text-emerald-700">{sub.grade || 'A'}</td>
                      <td className="py-0.5 px-2 text-center font-mono font-semibold text-slate-900">{toBanglaNumerals(subPoint.toFixed(2))}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-emerald-600 font-bold text-[7.5pt]">
                <tr>
                  <td colSpan="4" className="py-1 px-2 text-right text-slate-900">
                    সর্বমোট গ্রেড পয়েন্ট গড় (GPA):
                  </td>
                  <td className="py-1 px-2 text-center text-slate-900 font-extrabold text-[8pt]">
                    {calculateOverallGrade(searchedResult.gpa, searchedResult.resultStatus === 'FAILED') || searchedResult.letterGrade || searchedResult.grade}
                  </td>
                  <td className="py-1 px-2 text-center font-mono text-slate-900 font-extrabold text-[8pt]">
                    {toBanglaNumerals(searchedResult.gpa ?? '0.00')}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Bangladesh Secondary Grading Scale Reference */}
            <div className="bg-slate-50 p-1 rounded border border-slate-200 text-[6.5pt] text-slate-600">
              <span className="font-bold text-slate-800 block mb-0.5">Grading Scale (Comilla Education Board):</span>
              <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                <span>80-100: <strong className="text-emerald-700">A+ (5.00)</strong></span>
                <span>70-79: <strong className="text-emerald-700">A (4.00)</strong></span>
                <span>60-69: <strong className="text-emerald-700">A- (3.50)</strong></span>
                <span>50-59: <strong className="text-emerald-700">B (3.00)</strong></span>
                <span>40-49: <strong className="text-emerald-700">C (2.00)</strong></span>
                <span>33-39: <strong className="text-emerald-700">D (1.00)</strong></span>
                <span>0-32: <strong className="text-red-600">F (0.00) Fail</strong></span>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-2 flex justify-between items-end text-[7pt]">
              <div className="text-center space-y-0.5 min-w-[100px]">
                <div className="w-20 border-b border-slate-400 mx-auto pb-0.5">
                  <span className="font-serif italic text-emerald-800 font-bold text-[9pt]">{signatories.examController.signature}</span>
                </div>
                <p className="font-bold text-slate-900">{signatories.examController.nameBn}</p>
                <p className="text-slate-500 text-[6pt]">{signatories.examController.designationBn}</p>
              </div>

              <div className="w-10 h-10 rounded-full border-2 border-dashed border-emerald-600 text-emerald-700 flex flex-col items-center justify-center p-0.5 text-[5pt] text-center font-bold">
                <span>BANDUA</span>
                <span>SEAL</span>
              </div>

              <div className="text-center space-y-0.5 min-w-[100px]">
                <div className="w-20 border-b border-slate-400 mx-auto pb-0.5">
                  <span className="font-serif italic text-emerald-800 font-bold text-[9pt]">{signatories.headmaster.signature}</span>
                </div>
                <p className="font-bold text-slate-900">{signatories.headmaster.nameBn}</p>
                <p className="text-slate-500 text-[6pt]">{signatories.headmaster.designationBn}</p>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </section>
  );
}
