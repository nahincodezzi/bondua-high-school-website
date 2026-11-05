import React, { useState } from 'react';
import SchoolLogo from './common/SchoolLogo';
import { useSchool } from '../context/useSchool';
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

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!rollInput.trim()) return;

    setSearchAttempted(true);
    const cleanRoll = rollInput.trim();
    const found = results.find(
      r => r.roll === cleanRoll && (r.class === targetClass || !targetClass)
    );

    if (found) {
      setSearchedResult(found);
    } else {
      setSearchedResult(null);
    }
  };

  const handleQuickDemo = (roll) => {
    setRollInput(roll);
    setTargetClass('10');
    setExamType('SSC Test Examination 2026');
    const found = results.find(r => r.roll === roll);
    setSearchAttempted(true);
    setSearchedResult(found || null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setRollInput('');
    setSearchedResult(null);
    setSearchAttempted(false);
  };

  return (
    <section className="py-14 text-white relative z-10 font-sans min-h-[700px]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 no-print">
          <div className="inline-flex items-center gap-1.5 glass-pill text-amber-300 text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-md border border-amber-400/20">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>{lang === 'bn' ? 'অনলাইন ফলাফল পোর্টাল' : 'Online Result Portal'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-bangla text-white drop-shadow-md">
            {lang === 'bn' ? 'পরীক্ষার ফলাফল ও গ্রেডশিট অনুসন্ধান' : 'Examination Results & Official Marksheet'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-bangla mt-2">
            {lang === 'bn' 
              ? 'রোল নম্বর ও শ্রেণি নির্বাচন করে তাৎক্ষণিক ডিজিটাল মার্কশিট দেখুন ও প্রিন্ট করুন'
              : 'Enter student roll number and class to view and print the verified institutional marksheet.'}
          </p>
        </div>

        {/* Search Box - Hidden during print */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/15 mb-8 no-print backdrop-blur-xl">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            {/* Exam Select */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 font-bangla">
                {lang === 'bn' ? 'পরীক্ষার নাম' : 'Examination'}
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="glass-input w-full text-xs font-bangla rounded-xl p-3 bg-slate-900 text-white"
              >
                <option value="SSC Test Examination 2026" className="bg-slate-900 text-white">এসএসসি টেস্ট পরীক্ষা ২০২৬</option>
                <option value="Annual Examination 2025" className="bg-slate-900 text-white">বার্ষিক পরীক্ষা ২০২৫</option>
                <option value="Pre-Test Examination 2026" className="bg-slate-900 text-white">প্রাক-নির্বাচনী পরীক্ষা ২০২৬</option>
                <option value="Half-Yearly Examination 2026" className="bg-slate-900 text-white">অর্ধবার্ষিক পরীক্ষা ২০২৬</option>
              </select>
            </div>

            {/* Class Select */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 font-bangla">
                {lang === 'bn' ? 'শ্রেণি' : 'Class'}
              </label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="glass-input w-full text-xs font-bangla rounded-xl p-3 bg-slate-900 text-white"
              >
                <option value="10" className="bg-slate-900 text-white">দশম শ্রেণি (Class 10)</option>
                <option value="9" className="bg-slate-900 text-white">নবম শ্রেণি (Class 9)</option>
                <option value="8" className="bg-slate-900 text-white">অষ্টম শ্রেণি (Class 8)</option>
                <option value="7" className="bg-slate-900 text-white">সপ্তম শ্রেণি (Class 7)</option>
                <option value="6" className="bg-slate-900 text-white">ষষ্ঠ শ্রেণি (Class 6)</option>
              </select>
            </div>

            {/* Roll Number Input */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 font-bangla">
                {lang === 'bn' ? 'রোল নম্বর *' : 'Roll Number *'}
              </label>
              <input
                type="text"
                required
                placeholder={lang === 'bn' ? 'যেমন: 101' : 'e.g. 101'}
                value={rollInput}
                onChange={(e) => setRollInput(e.target.value)}
                className="glass-input w-full text-xs font-mono font-bold rounded-xl p-3 text-white placeholder-slate-500"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full btn-gold py-3 px-4 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg font-bangla"
              >
                <Search className="w-4 h-4 text-slate-950" />
                <span>{lang === 'bn' ? 'ফলাফল দেখুন' : 'Get Result'}</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Roll Pill Shortcuts */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium font-bangla">
              {lang === 'bn' ? 'ডেমো রোল দিয়ে দেখুন:' : 'Sample Rolls for testing:'}
            </span>
            <button
              type="button"
              onClick={() => handleQuickDemo('101')}
              className="glass-pill hover:bg-white/15 text-amber-300 px-3 py-1.5 rounded-full border border-white/10 font-mono font-semibold transition cursor-pointer"
            >
              Roll 101 (GPA 5.00)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('102')}
              className="glass-pill hover:bg-white/15 text-amber-300 px-3 py-1.5 rounded-full border border-white/10 font-mono font-semibold transition cursor-pointer"
            >
              Roll 102 (GPA 4.89)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('103')}
              className="glass-pill hover:bg-white/15 text-amber-300 px-3 py-1.5 rounded-full border border-white/10 font-mono font-semibold transition cursor-pointer"
            >
              Roll 103 (Commerce)
            </button>
          </div>
        </div>

        {/* Result Marksheet Display */}
        {searchedResult ? (
          <div className="glass-card rounded-3xl shadow-2xl border border-white/20 overflow-hidden backdrop-blur-xl" id="official-marksheet">
            {/* Top Toolbar for Result */}
            <div className="glass-capsule text-white px-6 py-3.5 flex items-center justify-between no-print border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 font-bangla">{lang === 'bn' ? 'অনলাইন ট্রান্সক্রিপ্ট ও গ্রেড শিট' : 'Academic Grade Sheet'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleReset}
                  className="px-3.5 py-1.5 glass-pill hover:bg-white/15 rounded-full text-xs transition flex items-center gap-1 font-bangla border border-white/10 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                  <span>{lang === 'bn' ? 'পুনরায় অনুসন্ধান' : 'Search Again'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="btn-gold px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'মার্কশিট প্রিন্ট করুন' : 'Print Marksheet'}</span>
                </button>
              </div>
            </div>

            {/* Official Marksheet Document Container */}
            <div className="p-6 sm:p-10 bg-slate-900/90 text-slate-100 space-y-6">
              {/* Header Letterhead */}
              <div className="text-center border-b border-white/15 pb-4">
                <div className="flex justify-center mb-2">
                  <div className="w-14 h-14 rounded-full bg-white p-0.5 shadow-lg ring-2 ring-amber-400">
                    <SchoolLogo logo={schoolInfo.logo} />
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-bangla text-white">
                  {lang === 'bn' ? schoolInfo.nameBn : schoolInfo.nameEn}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-semibold font-bangla">
                  {schoolInfo.addressBn}
                </p>
                <p className="text-xs text-amber-300 font-mono mt-1">
                  EIIN: {schoolInfo.eiin} • MPO Code: {schoolInfo.mpoCode} • Comilla Board
                </p>
                <div className="mt-3 inline-block btn-gold px-4 py-1 text-xs font-bold uppercase tracking-wider font-bangla shadow-sm">
                  {lang === 'bn' ? 'একাডেমিক ট্রান্সক্রিপ্ট / গ্রেড শিট' : 'ACADEMIC TRANSCRIPT / GRADE REPORT'}
                </div>
                <p className="text-xs text-amber-200 mt-1 font-semibold">{searchedResult.exam}</p>
              </div>

              {/* Student Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 glass-card p-4 rounded-2xl border border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 block font-bangla">{lang === 'bn' ? 'শিক্ষার্থীর নাম:' : 'Student Name:'}</span>
                  <span className="font-bold text-white font-bangla text-sm">
                    {lang === 'bn' ? searchedResult.studentNameBn : searchedResult.studentNameEn}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bangla">{lang === 'bn' ? 'রোল নম্বর:' : 'Roll Number:'}</span>
                  <span className="font-mono font-bold text-amber-300 text-sm">{searchedResult.roll}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bangla">{lang === 'bn' ? 'শ্রেণি ও বিভাগ:' : 'Class & Section:'}</span>
                  <span className="font-bold text-white font-bangla">
                    {lang === 'bn' ? `শ্রেণি: ${searchedResult.class}, শাখা: ${searchedResult.section}` : `Class: ${searchedResult.class}, Sec: ${searchedResult.section}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bangla">{lang === 'bn' ? 'বিভাগ (গ্রুপ):' : 'Group:'}</span>
                  <span className="font-bold text-amber-300 font-bangla">{searchedResult.group}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{lang === 'bn' ? 'আইডি নম্বর:' : 'Student ID:'}</span>
                  <span className="font-mono text-slate-300">{searchedResult.studentId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{lang === 'bn' ? 'শিক্ষাবর্ষ:' : 'Academic Year:'}</span>
                  <span className="font-mono text-slate-300">{searchedResult.year}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{lang === 'bn' ? 'ফলাফল:' : 'Result Status:'}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{searchedResult.resultStatus}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{lang === 'bn' ? 'জিপিএ (GPA):' : 'GPA Score:'}</span>
                  <span className="font-mono font-extrabold text-base text-amber-300">
                    {searchedResult.gpa} ({searchedResult.letterGrade})
                  </span>
                </div>
              </div>

              {/* Subject Marks & Grades Table */}
              <div className="border border-white/15 rounded-2xl overflow-hidden glass-card">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-950/80 text-amber-300 border-b border-white/10 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="py-3 px-3 w-16 text-center font-mono">Code</th>
                      <th className="py-3 px-4">{lang === 'bn' ? 'বিষয়ের নাম' : 'Subject Name'}</th>
                      <th className="py-3 px-4 text-center font-mono">{lang === 'bn' ? 'প্রাপ্ত নম্বর' : 'Marks'}</th>
                      <th className="py-3 px-4 text-center">{lang === 'bn' ? 'লেটার গ্রেড' : 'Letter Grade'}</th>
                      <th className="py-3 px-4 text-center font-mono">{lang === 'bn' ? 'গ্রেড পয়েন্ট' : 'Grade Point'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {searchedResult.subjects.map((sub, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 text-center font-mono text-slate-400">{sub.code}</td>
                        <td className="py-3 px-4 font-medium text-slate-200 font-bangla">{sub.name}</td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-white">{sub.marks}</td>
                        <td className="py-3 px-4 text-center font-bold text-amber-300">{sub.grade}</td>
                        <td className="py-3 px-4 text-center font-mono font-semibold text-slate-300">{sub.point.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-950/90 border-t-2 border-amber-400/40 font-bold text-xs sm:text-sm">
                    <tr>
                      <td colSpan="3" className="py-3.5 px-4 text-right font-bangla text-white">
                        {lang === 'bn' ? 'সর্বমোট গ্রেড পয়েন্ট গড় (GPA):' : 'Grade Point Average (GPA):'}
                      </td>
                      <td className="py-3.5 px-4 text-center text-amber-300 font-extrabold text-base">
                        {searchedResult.letterGrade}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-amber-300 font-extrabold text-base">
                        {searchedResult.gpa}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Bangladesh Secondary Grading Scale Reference */}
              <div className="glass-pill p-3.5 rounded-xl border border-white/10 text-[10px] text-slate-300">
                <span className="font-bold text-amber-300 block mb-1">Grading Scale (Comilla Education Board):</span>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span>80-100: <strong className="text-amber-300">A+ (5.00)</strong></span>
                  <span>70-79: <strong className="text-amber-300">A (4.00)</strong></span>
                  <span>60-69: <strong className="text-amber-300">A- (3.50)</strong></span>
                  <span>50-59: <strong className="text-amber-300">B (3.00)</strong></span>
                  <span>40-49: <strong className="text-amber-300">C (2.00)</strong></span>
                  <span>33-39: <strong className="text-amber-300">D (1.00)</strong></span>
                  <span>0-32: <strong className="text-rose-400">F (0.00) Fail</strong></span>
                </div>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-8 flex justify-between items-end text-xs">
                <div className="text-center space-y-1">
                  <div className="w-28 border-b border-white/20 mx-auto pb-1 text-slate-400 font-serif italic text-xs">
                    Exam Controller
                  </div>
                  <p className="font-bold text-slate-200 font-bangla">{lang === 'bn' ? 'পরীক্ষা নিয়ন্ত্রক' : 'Controller of Exam'}</p>
                  <p className="text-slate-400 text-[10px]">বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়</p>
                </div>

                {/* Institute Seal Stamp */}
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-400/60 text-amber-300 flex flex-col items-center justify-center p-1 text-[8px] text-center font-bold">
                  <span>BANDUA DAULATPUR</span>
                  <span>HIGH SCHOOL</span>
                  <span>SEAL</span>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-28 border-b border-white/20 mx-auto pb-1">
                    <span className="font-serif italic text-amber-300 font-bold text-sm">Bahar U.</span>
                  </div>
                  <p className="font-bold text-white font-bangla">{schoolInfo.headmasterNameBn}</p>
                  <p className="text-slate-300 font-bangla">{schoolInfo.headmasterDesignationBn}</p>
                  <p className="text-amber-300 text-[10px]">EIIN: {schoolInfo.eiin}</p>
                </div>
              </div>
            </div>
          </div>
        ) : searchAttempted ? (
          <div className="glass-card p-8 rounded-3xl shadow-xl border border-rose-500/30 text-center max-w-lg mx-auto backdrop-blur-xl">
            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-rose-500/30">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-bangla text-white">
              {lang === 'bn' ? 'ফলাফল পাওয়া যায়নি' : 'No Result Record Found'}
            </h3>
            <p className="text-xs text-slate-300 font-bangla mt-1">
              {lang === 'bn' 
                ? `রোল নং "${rollInput}" এবং শ্রেণি ${targetClass}-এর কোনো ফলাফল রেকর্ড খুঁজে পাওয়া যায়নি। অনুগ্রহ করে রোল নম্বর যাচাই করুন অথবা বিদ্যালয় অফিসে যোগাযোগ করুন।`
                : `No academic record found matching Roll "${rollInput}" for Class ${targetClass}. Please verify the roll number or contact the school office.`}
            </p>
            <button
              onClick={() => handleQuickDemo('101')}
              className="mt-4 btn-gold text-xs font-bold px-5 py-2 rounded-full font-bangla cursor-pointer"
            >
              {lang === 'bn' ? 'নমুনা হিসেবে রোল ১০১ এর ফলাফল দেখুন' : 'View Sample Roll 101 Result'}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
