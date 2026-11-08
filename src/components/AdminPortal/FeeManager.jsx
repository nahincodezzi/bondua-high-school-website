import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import SchoolLogo from '../common/SchoolLogo';
import { useSchool } from '../../context/useSchool';
import { toBanglaNumerals, toEnglishNumerals } from '../../utils/dateFormatter';
import { getSignatories } from '../../utils/signatories';
import { 
  DollarSign, 
  Printer, 
  Receipt, 
  X,
  AlertCircle,
  AlertTriangle,
  UserCheck,
  Search
} from 'lucide-react';

export default function FeeManager() {
  const { fees, addFee, voidFeeReceipt, schoolInfo, students, lang, teachers, systemUsers } = useSchool();
  const signatories = getSignatories(schoolInfo, teachers, systemUsers);
  const [studentRoll, setStudentRoll] = useState('');
  const [targetClass, setTargetClass] = useState('10');
  const [feeType, setFeeType] = useState('Monthly Tuition Fee (November)');
  const [amount, setAmount] = useState('500');
  const [method, setMethod] = useState('bKash');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [feeSearch, setFeeSearch] = useState('');
  const [feeClassFilter, setFeeClassFilter] = useState('all');

  // In-App Void Modal States (BUG 10 fix: eliminates window.prompt)
  const [voidModalFee, setVoidModalFee] = useState(null);
  const [voidReasonInput, setVoidReasonInput] = useState('ভুল এন্ট্রি সংশোধন');
  const [voidError, setVoidError] = useState('');

  const filteredFees = fees.filter(f => {
    const matchClass = feeClassFilter === 'all' || String(f.class) === String(feeClassFilter);
    const q = feeSearch.trim().toLowerCase();
    const matchSearch = !q || 
      f.studentName?.toLowerCase().includes(q) || 
      String(f.studentRoll).includes(q) || 
      f.receiptNo?.toLowerCase().includes(q) ||
      f.feeType?.toLowerCase().includes(q);
    return matchClass && matchSearch;
  });

  // Auto student match
  const matchedStudent = students.find(
    s => s.roll.toString() === toEnglishNumerals(studentRoll.trim()) && s.class === targetClass
  );

  // Close receipt on Escape
  useEffect(() => {
    if (!activeReceipt) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveReceipt(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReceipt]);

  const handleCollectSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanRoll = toEnglishNumerals(studentRoll.trim());
    if (!cleanRoll) {
      setErrorMessage('অনুগ্রহ করে শিক্ষার্থীর রোল নম্বর প্রদান করুন।');
      return;
    }

    // Student Lookup Validation (A5)
    if (!matchedStudent) {
      setErrorMessage(`শ্রেণি ${toBanglaNumerals(targetClass)} এবং রোল "${toBanglaNumerals(cleanRoll)}"-এ কোনো শিক্ষার্থী পাওয়া যায়নি! শুধুমাত্র নিবন্ধিত শিক্ষার্থীর ফি আদায় সম্ভব।`);
      return;
    }

    // Amount Validation > 0 & Maximum Cap (Senior QA H6)
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('ফি আদায়ের পরিমাণ অবশ্যই শূন্যের চেয়ে বেশি (ধনাত্মক সংখ্যা) হতে হবে।');
      return;
    }

    const MAX_FEE_LIMIT = 50000; // সর্বোচ্চ ৫০,০০০ টাকা
    if (numAmount > MAX_FEE_LIMIT) {
      setErrorMessage(`একক রসিদে ফি আদায়ের পরিমাণ সর্বোচ্চ ৳${toBanglaNumerals(MAX_FEE_LIMIT.toLocaleString())} হতে পারে। অনুগ্রহ করে সঠিক অঙ্ক লিখুন।`);
      return;
    }

    if (numAmount >= 10000) {
      if (!confirm(`আপনি কি নিশ্চিত যে ৳${numAmount.toLocaleString()}-এর বড় অঙ্কের ফি রসিদ তৈরি করতে চান?`)) {
        return;
      }
    }

    const createdReceipt = addFee({
      studentRoll: cleanRoll,
      studentName: matchedStudent.nameBn,
      class: targetClass,
      feeType,
      amount: numAmount,
      method
    });

    setActiveReceipt(createdReceipt);
    setStudentRoll('');
    setAmount('500');
  };

  const handleOpenVoidModal = (fee) => {
    if (fee.status === 'Voided') return;
    setVoidModalFee(fee);
    setVoidReasonInput('ভুল এন্ট্রি সংশোধন');
    setVoidError('');
  };

  const handleConfirmVoid = (e) => {
    e.preventDefault();
    const cleanReason = voidReasonInput.trim();
    if (!cleanReason) {
      setVoidError('বাতিল করার সুনির্দিষ্ট কারণ লেখা আবশ্যক।');
      return;
    }
    if (voidModalFee) {
      voidFeeReceipt(voidModalFee.id, cleanReason);
      setVoidModalFee(null);
      setVoidReasonInput('');
      setVoidError('');
    }
  };

  const handlePrint = () => {
    document.body.classList.add('printing-modal');
    document.body.classList.add('printing-receipt');
    const cleanup = () => {
      document.body.classList.remove('printing-modal');
      document.body.classList.remove('printing-receipt');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    window.print();
    setTimeout(cleanup, 1200);
  };

  useEffect(() => {
    if (!activeReceipt) return;
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReceipt]);

  const receiptModal = activeReceipt ? (
    <div 
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 print:static print:inset-auto print:p-0 print:m-0 print:bg-transparent print:backdrop-blur-none print:block print:w-full print:h-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="money-receipt-title"
    >
      <div className="fixed inset-0 -z-10 no-print print:hidden" onClick={() => setActiveReceipt(null)} aria-hidden="true" />
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden border border-line shadow-2xl relative print:shadow-none print:border-none print:m-0">
        {/* Top Toolbar */}
        <div className="bg-deep text-white px-4 py-2.5 flex justify-between items-center text-xs no-print print:hidden border-b border-primary">
          <span className="font-bold flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-accent" />
            <span id="money-receipt-title">অফিসিয়াল মানি রিসিট</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="btn-accent px-3 py-1 rounded text-xs font-bold flex items-center gap-1 cursor-pointer no-print print:hidden"
            >
              <Printer className="w-3.5 h-3.5 text-ink" />
              <span>প্রিন্ট করুন</span>
            </button>
            <button onClick={() => setActiveReceipt(null)} className="text-white/80 hover:text-white cursor-pointer no-print print:hidden" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-6 sm:p-8 bg-white space-y-4 font-bangla print:p-4 print:space-y-3" id="official-money-receipt">
          {activeReceipt.status === 'Voided' && (
            <div className="bg-danger-soft text-danger border-2 border-danger font-bold text-center py-1.5 px-3 rounded-lg text-xs tracking-wider uppercase">
              ⚠️ বাতিলকৃত রসিদ (VOID / CANCELLED) — হিসাবভুক্ত নয়
            </div>
          )}
          <div className="text-center border-b-2 border-deep pb-3 print:pb-2">
            {/* Dynamic School Logo */}
            <div className="flex justify-center mb-1.5">
              <div className="w-12 h-12 rounded-full border border-slate-300 p-0.5 shadow-xs">
                <SchoolLogo surface="light" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-deep print:text-lg">
              {schoolInfo.nameBn}
            </h3>
            <p className="text-xs text-muted print:text-[9.5pt]">{schoolInfo.addressBn}</p>
            <p className="text-[10px] text-muted font-mono print:text-[8pt]">EIIN: {schoolInfo.eiin} • কুমিল্লা শিক্ষা বোর্ড • স্থাপিত: ১৯৯০</p>
            <span className="inline-block bg-deep text-white text-[10px] font-bold px-3 py-0.5 rounded uppercase mt-1.5 print:text-[8.5pt]">
              MONEY RECEIPT / ফি আদায়ের রশিদ
            </span>
          </div>

          <div className="flex justify-between items-center text-xs text-muted border-b border-line pb-2 print:text-[9pt]">
            <span>রশিদ নং: <strong className="font-mono text-ink font-bold">{activeReceipt.receiptNo}</strong></span>
            <span>তারিখ: <strong className="font-mono text-ink font-bold">{activeReceipt.paidDate}</strong></span>
          </div>

          <div className="space-y-2 text-xs print:text-[9.5pt] print:space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted">শিক্ষার্থীর নাম:</span>
              <span className="font-bold text-ink">{activeReceipt.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">শ্রেণি ও রোল নম্বর:</span>
              <span>{activeReceipt.class} শ্রেণি • রোল: <strong className="font-mono font-bold">{activeReceipt.studentRoll}</strong></span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">ফি এর বিবরণ:</span>
              <span className="font-medium text-ink">{activeReceipt.feeType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">পরিশোধের মাধ্যম:</span>
              <span className="font-bold text-primary">{activeReceipt.method}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-soft rounded-lg border border-soft-border text-sm print:p-2 print:text-xs">
              <span className="font-bold text-deep">সর্বমোট পরিশোধিত টাকা:</span>
              <span className="font-mono font-extrabold text-deep">৳{activeReceipt.amount} /-</span>
            </div>
          </div>

          {/* Dynamic Signatures & Official Seal */}
          <div className="pt-6 border-t border-line flex justify-between items-end text-xs print:pt-4 print:text-[8.5pt]">
            {/* Accountant (Left) */}
            <div className="text-center space-y-0.5 min-w-[100px]">
              <div className="w-24 border-b border-slate-400 mx-auto pb-0.5">
                <span className="font-serif italic text-primary font-bold text-sm">
                  {signatories.accountant.signature}
                </span>
              </div>
              <p className="font-bold text-ink text-[9.5pt]">{signatories.accountant.nameBn}</p>
              <p className="text-muted text-[8pt]">{signatories.accountant.designationBn}</p>
            </div>

            {/* School Seal (Center) */}
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-primary text-primary flex flex-col items-center justify-center p-0.5 text-[6px] text-center font-bold">
              <span>BONDUA DAULATPUR</span>
              <span>SEAL</span>
            </div>

            {/* Headmaster (Right) */}
            <div className="text-center space-y-0.5 min-w-[100px]">
              <div className="w-24 border-b border-slate-400 mx-auto pb-0.5">
                <span className="font-serif italic text-primary font-bold text-sm">
                  {signatories.headmaster.signature}
                </span>
              </div>
              <p className="font-bold text-ink text-[9.5pt]">{signatories.headmaster.nameBn}</p>
              <p className="text-muted text-[8pt]">{signatories.headmaster.designationBn}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className={`space-y-6 ${activeReceipt ? 'no-print' : ''}`}>
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-bangla text-ink">
          ফি কালেকশন ও হিসাব ব্যবস্থাপনা (Fee Collection & Receipts)
        </h2>
        <p className="text-xs text-muted font-bangla">
          শিক্ষার্থীদের মাসিক বেতন, পরীক্ষা ফি গ্রহণ এবং প্রাতিষ্ঠানিক মানি রিসিট প্রস্তুতকরণ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Collection Form */}
        <div className="lg:col-span-5 card-base bg-white p-6 rounded-2xl border border-line shadow-xs space-y-4">
          <h3 className="font-bold font-bangla text-ink text-sm pb-2 border-b border-line flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span>নতুন ফি আদায় ও রশিদ প্রস্তুতকরণ</span>
          </h3>

          <form onSubmit={handleCollectSubmit} className="space-y-3 text-xs font-bangla">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-ink mb-1">শ্রেণি *</label>
                <select
                  value={targetClass}
                  onChange={(e) => {
                    setTargetClass(e.target.value);
                    setErrorMessage('');
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
                  value={studentRoll}
                  onChange={(e) => {
                    setStudentRoll(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full rounded-lg border border-line p-2.5 font-mono font-bold bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="যেমন: 101"
                />
              </div>
            </div>

            {/* Live Student Match Confirmation Pill */}
            {matchedStudent ? (
              <div className="p-3 bg-soft text-deep rounded-xl text-xs flex items-center justify-between border border-soft-border">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-primary" />
                  <span className="font-bold">শিক্ষার্থী: {matchedStudent.nameBn}</span>
                </div>
                <span className="font-mono text-[11px] font-semibold">{matchedStudent.studentId}</span>
              </div>
            ) : studentRoll ? (
              <div className="p-2.5 bg-danger-soft text-danger rounded-xl text-xs flex items-center gap-1.5 border border-danger-soft">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>শ্রেণি {targetClass}-এ এই রোলের কোনো শিক্ষার্থী পাওয়া যায়নি।</span>
              </div>
            ) : null}

            <div>
              <label className="block font-bold text-ink mb-1">ফি এর বিবরণ *</label>
              <select
                value={feeType}
                onChange={(e) => setFeeType(e.target.value)}
                className="w-full rounded-lg border border-line p-2.5 bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Monthly Tuition Fee (November)">মাসিক বেতন (নভেম্বর)</option>
                <option value="SSC Test Examination Fee">এসএসসি টেস্ট পরীক্ষা ফি</option>
                <option value="Annual Examination Fee">বার্ষিক পরীক্ষা ফি</option>
                <option value="Session & Admission Charge">সেশন ও ভর্তি ফি</option>
                <option value="ICT & Lab Charge">কম্পিউটার ও ল্যাব ফি</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-ink mb-1">টাকার পরিমাণ (৳) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full rounded-lg border border-line p-2.5 font-mono font-bold bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="block font-bold text-ink mb-1">পরিশোধের মাধ্যম</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full rounded-lg border border-line p-2.5 bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none font-semibold"
                >
                  <option value="Cash">নগদ (Cash Counter)</option>
                  <option value="bKash">বিকাশ (bKash)</option>
                  <option value="Nagad">নগদ (Nagad)</option>
                  <option value="Bank">ব্যাংক ডিপোজিট</option>
                </select>
              </div>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3 bg-danger-soft text-danger rounded-xl text-xs font-medium flex items-center gap-2 border border-danger-soft">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full btn-primary py-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-2"
            >
              <Receipt className="w-4 h-4 text-white" />
              <span>ফি গ্রহণ ও মানি রিসিট প্রস্তুত করুন</span>
            </button>
          </form>
        </div>

        {/* Existing Collections Table (Senior QA M6 fix: search, class filter & summary) */}
        <div className="lg:col-span-7 card-base bg-white p-6 rounded-2xl border border-line shadow-xs space-y-4 font-bangla">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-line">
            <div>
              <h3 className="font-bold text-ink text-sm">
                ফি আদায় ও পেমেন্ট হিস্ট্রি ({lang === 'bn' ? toBanglaNumerals(filteredFees.length) : filteredFees.length} টি রেকর্ড)
              </h3>
              <p className="text-[11px] text-muted">সর্বশেষ সংরক্ষিত ফি ট্রানজেকশন</p>
            </div>
            <span className="font-mono font-bold text-xs bg-soft text-deep px-3 py-1 rounded-full border border-soft-border">
              কার্যকর আদায়: ৳{toBanglaNumerals(filteredFees.filter(f => f.status !== 'Voided').reduce((sum, f) => sum + Number(f.amount || 0), 0).toLocaleString())}
            </span>
          </div>

          {/* Search and Class Filter Bar (M6) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-1 text-[11px]">
              {['all', '10', '9', '8', '7', '6'].map(cls => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setFeeClassFilter(cls)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    feeClassFilter === cls ? 'bg-primary text-white shadow-xs' : 'bg-bg text-muted hover:bg-line'
                  }`}
                >
                  {cls === 'all' ? 'সকল' : `${cls} শ্রেণি`}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="রশিদ, নাম বা রোল খুঁজুন..."
                value={feeSearch}
                onChange={(e) => setFeeSearch(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-line text-[11px] focus:ring-1 focus:ring-primary bg-bg"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-line max-h-[500px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg text-ink font-bold border-b border-line sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-3">রশিদ নং</th>
                  <th className="py-2.5 px-3">শিক্ষার্থী</th>
                  <th className="py-2.5 px-3">শ্রেণি ও রোল</th>
                  <th className="py-2.5 px-3">ফি এর ধরণ</th>
                  <th className="py-2.5 px-3 text-right">পরিমাণ</th>
                  <th className="py-2.5 px-3 text-center">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredFees.map((f) => {
                  const isVoided = f.status === 'Voided';
                  return (
                    <tr key={f.id} className={`hover:bg-bg transition-colors ${isVoided ? 'opacity-60 bg-slate-50' : ''}`}>
                      <td className="py-3 px-3 font-mono font-bold">
                        <span className={isVoided ? 'line-through text-muted' : 'text-primary'}>
                          {f.receiptNo}
                        </span>
                        {isVoided && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-danger-soft text-danger uppercase">
                            বাতিল
                          </span>
                        )}
                      </td>
                      <td className={`py-3 px-3 font-semibold ${isVoided ? 'line-through text-muted' : 'text-ink'}`}>
                        {f.studentName}
                      </td>
                      <td className="py-3 px-3 text-muted">{f.class} শ্রেণি • রোল: {f.studentRoll}</td>
                      <td className="py-3 px-3 text-ink">{f.feeType}</td>
                      <td className={`py-3 px-3 text-right font-mono font-bold ${isVoided ? 'line-through text-muted' : 'text-deep'}`}>
                        ৳{f.amount}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setActiveReceipt(f)}
                            className="bg-soft hover:bg-soft text-deep px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer border border-soft-border"
                          >
                            রশিদ
                          </button>
                          {!isVoided && (
                            <button
                              type="button"
                              onClick={() => handleOpenVoidModal(f)}
                              className="px-2 py-1 rounded text-[10px] font-bold text-danger hover:bg-danger-soft transition cursor-pointer border border-danger-soft"
                              title="ভুল রসিদ বাতিল করুন"
                            >
                              বাতিল
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Portal-Rendered Receipt Modal (Direct to body for clean 1-page print) */}
      {typeof document !== 'undefined' && receiptModal && createPortal(receiptModal, document.body)}

      {/* In-App Void Modal (BUG 10 fix: Zero window.prompt, 100% works in webviews) */}
      {typeof document !== 'undefined' && voidModalFee && createPortal(
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-line p-6 space-y-4 font-bangla">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-bold text-ink text-base flex items-center gap-2 text-danger">
                <AlertTriangle className="w-5 h-5 text-danger" />
                <span>ফি রসিদ বাতিলকরণ (Void Receipt)</span>
              </h3>
              <button
                type="button"
                onClick={() => setVoidModalFee(null)}
                className="text-muted hover:text-ink p-1 rounded-lg hover:bg-bg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-bg p-3.5 rounded-xl border border-line space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted">রসিদ নম্বর:</span>
                <span className="font-mono font-bold text-ink">{voidModalFee.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">শিক্ষার্থীর নাম:</span>
                <span className="font-bold text-ink">{voidModalFee.studentName} ({voidModalFee.class} শ্রেণি • রোল {voidModalFee.studentRoll})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">টাকার পরিমাণ:</span>
                <span className="font-bold text-danger font-mono">৳{voidModalFee.amount}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmVoid} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5">
                  বাতিলের সুনির্দিষ্ট কারণ লিখুন *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={voidReasonInput}
                  onChange={(e) => setVoidReasonInput(e.target.value)}
                  placeholder="যেমন: ভুল এন্ট্রি সংশোধন / শিক্ষার্থী পরিবর্তন"
                  className="w-full rounded-xl border border-line p-2.5 text-xs bg-bg focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                />
                {voidError && (
                  <p className="text-danger text-[11px] mt-1 font-semibold">{voidError}</p>
                )}
                <p className="text-muted text-[11px] mt-1">
                  এই কারণটি রসিদটির অডিট হিস্টোরি এবং প্রিন্ট ভিউতে সংরক্ষিত থাকবে।
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setVoidModalFee(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-muted hover:bg-bg border border-line cursor-pointer"
                >
                  ফিরে যান
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-danger hover:bg-red-700 text-white shadow-xs cursor-pointer"
                >
                  রসিদ বাতিল নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
