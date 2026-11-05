import React, { useState } from 'react';
import SchoolLogo from './common/SchoolLogo';
import { useSchool } from '../context/useSchool';
import { toEnglishNumerals, toBanglaNumerals } from '../utils/dateFormatter';
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
  const { lang, results, schoolInfo } = useSchool();
  const [examType, setExamType] = useState('SSC Test Examination 2026');
  const [targetClass, setTargetClass] = useState('10');
  const [rollInput, setRollInput] = useState('');
  const [searchedResult, setSearchedResult] = useState(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSearch = (e) => {
    e?.preventDefault();
    setValidationError('');

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

    setSearchAttempted(true);
    const found = results.find(
      r => r.roll.toString() === convertedRoll && (r.class === targetClass || !targetClass)
    );

    if (found) {
      setSearchedResult(found);
    } else {
      setSearchedResult(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setRollInput('');
    setSearchedResult(null);
    setSearchAttempted(false);
    setValidationError('');
  };

  return (
    <section className="py-12 sm:py-16 text-slate-800 relative z-10 font-sans min-h-[700px]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 no-print">
          <div className="inline-flex items-center gap-1.5 bg-[#DCFCE7] text-[#14532D] text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-xs border border-emerald-300">
            <GraduationCap className="w-4 h-4 text-[#166534]" />
            <span>{lang === 'bn' ? 'অনলাইন ফলাফল পোর্টাল' : 'Online Result Portal'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-bangla text-slate-900 leading-tight">
            {lang === 'bn' ? 'পরীক্ষার ফলাফল ও গ্রেডশিট অনুসন্ধান' : 'Examination Results & Official Marksheet'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-bangla mt-2">
            {lang === 'bn' 
              ? 'রোল নম্বর ও শ্রেণি নির্বাচন করে তাৎক্ষণিক ডিজিটাল মার্কশিট দেখুন ও প্রিন্ট করুন'
              : 'Enter student roll number and class to view and print the verified institutional marksheet.'}
          </p>
        </div>

        {/* Search Box - Hidden during print */}
        <div className="card-base p-6 sm:p-8 rounded-2xl shadow-sm border border-[#E5E7EB] mb-8 no-print bg-white">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            {/* Exam Select */}
            <div>
              <label htmlFor="exam-select" className="block text-xs font-bold text-slate-700 mb-1.5 font-bangla">
                {lang === 'bn' ? 'পরীক্ষার নাম' : 'Examination'}
              </label>
              <select
                id="exam-select"
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full text-xs font-bangla rounded-lg p-3 bg-[#F7F9F8] border border-[#D1D5DB] text-slate-900 focus:ring-2 focus:ring-[#166534] focus:outline-none"
              >
                <option value="SSC Test Examination 2026">এসএসসি টেস্ট পরীক্ষা ২০২৬</option>
                <option value="Annual Examination 2025">বার্ষিক পরীক্ষা ২০২৫</option>
                <option value="Pre-Test Examination 2026">প্রাক-নির্বাচনী পরীক্ষা ২০২৬</option>
                <option value="Half-Yearly Examination 2026">অর্ধবার্ষিক পরীক্ষা ২০২৬</option>
              </select>
            </div>

            {/* Class Select */}
            <div>
              <label htmlFor="class-select" className="block text-xs font-bold text-slate-700 mb-1.5 font-bangla">
                {lang === 'bn' ? 'শ্রেণি' : 'Class'}
              </label>
              <select
                id="class-select"
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full text-xs font-bangla rounded-lg p-3 bg-[#F7F9F8] border border-[#D1D5DB] text-slate-900 focus:ring-2 focus:ring-[#166534] focus:outline-none"
              >
                <option value="10">দশম শ্রেণি (Class 10)</option>
                <option value="9">নবম শ্রেণি (Class 9)</option>
                <option value="8">অষ্টম শ্রেণি (Class 8)</option>
                <option value="7">সপ্তম শ্রেণি (Class 7)</option>
                <option value="6">ষষ্ঠ শ্রেণি (Class 6)</option>
              </select>
            </div>

            {/* Roll Number Input (with numeric inputMode and Bangla digit support) */}
            <div>
              <label htmlFor="roll-input" className="block text-xs font-bold text-slate-700 mb-1.5 font-bangla">
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
                onChange={(e) => {
                  setRollInput(e.target.value);
                  setValidationError('');
                }}
                className="w-full text-xs font-mono font-bold rounded-lg p-3 border border-[#D1D5DB] bg-[#F7F9F8] text-slate-900 focus:ring-2 focus:ring-[#166534] focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full btn-accent py-3 px-4 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm font-bangla font-bold rounded-lg"
              >
                <Search className="w-4 h-4 text-slate-950" />
                <span>{lang === 'bn' ? 'ফলাফল দেখুন' : 'Get Result'}</span>
              </button>
            </div>
          </form>

          {/* Inline Validation Error Message (L1, L2) */}
          {validationError && (
            <div className="mt-3 p-3 bg-[#FEE2E2] text-[#DC2626] rounded-lg text-xs font-medium font-bangla flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Result Marksheet Display */}
        {searchedResult ? (
          <div className="bg-white rounded-2xl shadow-md border border-[#E5E7EB] overflow-hidden relative" id="official-marksheet">
            {/* Top Toolbar for Result */}
            <div className="bg-[#14532D] text-white px-6 py-3.5 flex items-center justify-between no-print border-b border-[#166534]">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <FileCheck className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-white font-bangla">{lang === 'bn' ? 'অনলাইন ট্রান্সক্রিপ্ট ও গ্রেড শিট' : 'Academic Grade Sheet'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleReset}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs transition flex items-center gap-1 font-bangla border border-white/20 cursor-pointer text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                  <span>{lang === 'bn' ? 'পুনরায় অনুসন্ধান' : 'Search Again'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="btn-accent px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#1F2937]" />
                  <span>{lang === 'bn' ? 'মার্কশিট প্রিন্ট করুন' : 'Print Marksheet'}</span>
                </button>
              </div>
            </div>

            {/* Official Marksheet Document Container */}
            <div className="p-6 sm:p-10 bg-white text-slate-900 space-y-6 relative">
              {/* Unofficial Copy Watermark Banner (Content 6) */}
              <div className="bg-[#FEF3C7] border border-[#F59E0B] text-[#92400E] px-4 py-2 rounded-lg text-xs font-bold text-center font-bangla">
                ⚠️ {lang === 'bn' 
                  ? 'অনানুষ্ঠানিক ডিজিটাল কপি — শুধুমাত্র অবগতির জন্য প্রযোজ্য (অফিসিয়াল স্বাক্ষরিত কপির জন্য বিদ্যালয় কার্যালয়ে যোগাযোগ করুন)' 
                  : 'UNOFFICIAL DIGITAL COPY — FOR INFORMATION ONLY (Contact school office for signed original certificate)'}
              </div>

              {/* Header Letterhead */}
              <div className="text-center border-b-2 border-[#14532D] pb-4">
                <div className="flex justify-center mb-2">
                  <div className="w-14 h-14 rounded-full bg-white p-0.5 shadow-sm ring-2 ring-[#166534]">
                    <SchoolLogo logo={schoolInfo.logo} />
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-bangla text-[#14532D]">
                  {lang === 'bn' ? schoolInfo.nameBn : (schoolInfo.nameEn || 'Bandua Daulatpur High School')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 font-semibold font-bangla">
                  {schoolInfo.addressBn}
                </p>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  EIIN: {schoolInfo.eiin} • MPO Code: {schoolInfo.mpoCode} • Comilla Board
                </p>
                <div className="mt-3 inline-block bg-[#14532D] text-white px-4 py-1 rounded text-xs font-bold uppercase tracking-wider font-bangla">
                  {lang === 'bn' ? 'একাডেমিক ট্রান্সক্রিপ্ট / গ্রেড শিট' : 'ACADEMIC TRANSCRIPT / GRADE REPORT'}
                </div>
                <p className="text-xs text-slate-600 mt-1 font-semibold">{searchedResult.exam}</p>
              </div>

              {/* Student Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 bg-[#F7F9F8] p-4 rounded-xl border border-[#E5E7EB] text-xs">
                <div>
                  <span className="text-slate-500 block font-bangla">{lang === 'bn' ? 'শিক্ষার্থীর নাম:' : 'Student Name:'}</span>
                  <span className="font-bold text-slate-900 font-bangla text-sm">
                    {lang === 'bn' ? searchedResult.studentNameBn : searchedResult.studentNameEn}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block font-bangla">{lang === 'bn' ? 'রোল নম্বর:' : 'Roll Number:'}</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {lang === 'bn' ? toBanglaNumerals(searchedResult.roll) : searchedResult.roll}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block font-bangla">{lang === 'bn' ? 'শ্রেণি ও বিভাগ:' : 'Class & Section:'}</span>
                  <span className="font-bold text-slate-900 font-bangla">
                    {lang === 'bn' 
                      ? `শ্রেণি: ${toBanglaNumerals(searchedResult.class)}, শাখা: ${searchedResult.section}` 
                      : `Class: ${searchedResult.class}, Sec: ${searchedResult.section}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block font-bangla">{lang === 'bn' ? 'বিভাগ (গ্রুপ):' : 'Group:'}</span>
                  <span className="font-bold text-[#166534] font-bangla">{searchedResult.group}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{lang === 'bn' ? 'আইডি নম্বর:' : 'Student ID:'}</span>
                  <span className="font-mono text-slate-700">{searchedResult.studentId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{lang === 'bn' ? 'শিক্ষাবর্ষ:' : 'Academic Year:'}</span>
                  <span className="font-mono text-slate-700">{lang === 'bn' ? toBanglaNumerals(searchedResult.year) : searchedResult.year}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{lang === 'bn' ? 'ফলাফল:' : 'Result Status:'}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-[#15803D]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                    <span>{searchedResult.resultStatus === 'PASSED' ? (lang === 'bn' ? 'উত্তীর্ণ' : 'PASSED') : (lang === 'bn' ? 'অনূত্তীর্ণ' : 'FAILED')}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">{lang === 'bn' ? 'জিপিএ (GPA):' : 'GPA Score:'}</span>
                  <span className="font-mono font-extrabold text-base text-[#166534]">
                    {lang === 'bn' ? toBanglaNumerals(searchedResult.gpa) : searchedResult.gpa} ({searchedResult.letterGrade})
                  </span>
                </div>
              </div>

              {/* Subject Marks & Grades Table with Full Marks Column (M11) */}
              <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#F3F4F6] text-slate-800 border-b border-[#E5E7EB] font-bold uppercase text-[11px]">
                    <tr>
                      <th className="py-3 px-3 w-16 text-center font-mono">Code</th>
                      <th className="py-3 px-4">{lang === 'bn' ? 'বিষয়ের নাম' : 'Subject Name'}</th>
                      <th className="py-3 px-3 text-center">{lang === 'bn' ? 'পূর্ণমান' : 'Total'}</th>
                      <th className="py-3 px-4 text-center font-mono">{lang === 'bn' ? 'প্রাপ্ত নম্বর' : 'Marks'}</th>
                      <th className="py-3 px-4 text-center">{lang === 'bn' ? 'লেটার গ্রেড' : 'Grade'}</th>
                      <th className="py-3 px-4 text-center font-mono">{lang === 'bn' ? 'গ্রেড পয়েন্ট' : 'Point'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {searchedResult.subjects.map((sub, i) => {
                      const isICT = sub.code === '154' || sub.name?.toLowerCase().includes('ict');
                      const fullMark = isICT ? 50 : 100;
                      return (
                        <tr key={i} className="hover:bg-[#F7F9F8] transition-colors">
                          <td className="py-3 px-3 text-center font-mono text-slate-600">{sub.code}</td>
                          <td className="py-3 px-4 font-medium text-slate-900 font-bangla">{sub.name}</td>
                          <td className="py-3 px-3 text-center font-mono text-slate-600">
                            {lang === 'bn' ? toBanglaNumerals(fullMark) : fullMark}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                            {lang === 'bn' ? toBanglaNumerals(sub.marks) : sub.marks}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-[#166534]">{sub.grade}</td>
                          <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700">
                            {lang === 'bn' ? toBanglaNumerals(sub.point.toFixed(2)) : sub.point.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-[#DCFCE7]/40 border-t-2 border-[#166534] font-bold text-xs sm:text-sm">
                    <tr>
                      <td colSpan="4" className="py-3.5 px-4 text-right font-bangla text-[#14532D]">
                        {lang === 'bn' ? 'সর্বমোট গ্রেড পয়েন্ট গড় (GPA):' : 'Grade Point Average (GPA):'}
                      </td>
                      <td className="py-3.5 px-4 text-center text-[#14532D] font-extrabold text-base">
                        {searchedResult.letterGrade}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-[#14532D] font-extrabold text-base">
                        {lang === 'bn' ? toBanglaNumerals(searchedResult.gpa) : searchedResult.gpa}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Bangladesh Secondary Grading Scale Reference */}
              <div className="bg-[#F7F9F8] p-3.5 rounded-xl border border-[#E5E7EB] text-[10px] text-slate-600">
                <span className="font-bold text-slate-700 block mb-1">Grading Scale (Comilla Education Board):</span>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span>80-100: <strong className="text-[#166534]">A+ (5.00)</strong></span>
                  <span>70-79: <strong className="text-[#166534]">A (4.00)</strong></span>
                  <span>60-69: <strong className="text-[#166534]">A- (3.50)</strong></span>
                  <span>50-59: <strong className="text-[#166534]">B (3.00)</strong></span>
                  <span>40-49: <strong className="text-[#166534]">C (2.00)</strong></span>
                  <span>33-39: <strong className="text-[#166534]">D (1.00)</strong></span>
                  <span>0-32: <strong className="text-[#DC2626]">F (0.00) Fail</strong></span>
                </div>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-8 flex justify-between items-end text-xs">
                <div className="text-center space-y-1">
                  <div className="w-28 border-b border-slate-600 mx-auto pb-1 text-slate-400 font-serif italic text-xs">
                    Exam Controller
                  </div>
                  <p className="font-bold text-slate-800 font-bangla">{lang === 'bn' ? 'পরীক্ষা নিয়ন্ত্রক' : 'Controller of Exam'}</p>
                  <p className="text-slate-500 text-[10px]">বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়</p>
                </div>

                {/* Institute Seal Stamp */}
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#166534] text-[#166534] flex flex-col items-center justify-center p-1 text-[8px] text-center font-bold">
                  <span>BANDUA DAULATPUR</span>
                  <span>HIGH SCHOOL</span>
                  <span>SEAL</span>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-28 border-b border-slate-600 mx-auto pb-1">
                    <span className="font-serif italic text-[#166534] font-bold text-sm">Bahar U.</span>
                  </div>
                  <p className="font-bold text-slate-900 font-bangla">{schoolInfo.headmasterNameBn}</p>
                  <p className="text-slate-600 font-bangla">{schoolInfo.headmasterDesignationBn}</p>
                  <p className="text-slate-500 text-[10px]">EIIN: {schoolInfo.eiin}</p>
                </div>
              </div>
            </div>
          </div>
        ) : searchAttempted ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-200 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 bg-red-50 text-[#DC2626] rounded-full flex items-center justify-center mx-auto mb-3 border border-red-200">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-bangla text-slate-900">
              {lang === 'bn' ? 'ফলাফল পাওয়া যায়নি' : 'No Result Record Found'}
            </h3>
            <p className="text-xs text-slate-600 font-bangla mt-1">
              {lang === 'bn' 
                ? `রোল নং "${rollInput}" এবং শ্রেণি ${toBanglaNumerals(targetClass)}-এর কোনো ফলাফল রেকর্ড পাওয়া যায়নি। অনুগ্রহ করে রোল নম্বর ও শ্রেণি যাচাই করুন অথবা বিদ্যালয় অফিসে যোগাযোগ করুন।`
                : `No academic record found matching Roll "${rollInput}" for Class ${targetClass}. Please verify the roll number or contact the school office.`}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
