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
  UserCheck
} from 'lucide-react';

export default function FeeManager() {
  const { fees, addFee, schoolInfo, students, lang, teachers, systemUsers } = useSchool();
  const signatories = getSignatories(schoolInfo, teachers, systemUsers);
  const [studentRoll, setStudentRoll] = useState('');
  const [targetClass, setTargetClass] = useState('10');
  const [feeType, setFeeType] = useState('Monthly Tuition Fee (November)');
  const [amount, setAmount] = useState('500');
  const [method, setMethod] = useState('bKash');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeReceipt, setActiveReceipt] = useState(null);

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

    // Amount Validation > 0 (A5)
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('ফি আদায়ের পরিমাণ অবশ্যই শূন্যের চেয়ে বেশি (ধনাত্মক সংখ্যা) হতে হবে।');
      return;
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

  const handlePrint = () => {
    document.body.classList.add('printing-modal');
    const cleanup = () => {
      document.body.classList.remove('printing-modal');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    window.print();
    setTimeout(cleanup, 1200);
  };

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
          <div className="text-center border-b-2 border-deep pb-3 print:pb-2">
            {/* Dynamic School Logo */}
            <div className="flex justify-center mb-1.5">
              <div className="w-12 h-12 rounded-full border border-slate-300 p-0.5 shadow-xs">
                <SchoolLogo logo={schoolInfo.logo} />
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
              <span>BANDUA DAULATPUR</span>
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

        {/* Existing Collections Table */}
        <div className="lg:col-span-7 card-base bg-white p-6 rounded-2xl border border-line shadow-xs space-y-4 font-bangla">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div>
              <h3 className="font-bold text-ink text-sm">
                ফি আদায় ও পেমেন্ট হিস্ট্রি ({lang === 'bn' ? toBanglaNumerals(fees.length) : fees.length} টি রেকর্ড)
              </h3>
              <p className="text-[11px] text-muted">সর্বশেষ সংরক্ষিত ফি ট্রানজেকশন</p>
            </div>
            <span className="font-mono font-bold text-xs bg-soft text-deep px-3 py-1 rounded-full border border-soft-border">
              মোট: ৳{toBanglaNumerals(fees.reduce((sum, f) => sum + Number(f.amount || 0), 0).toLocaleString())}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg text-ink font-bold border-b border-line">
                <tr>
                  <th className="py-3 px-3">রশিদ নং</th>
                  <th className="py-3 px-3">শিক্ষার্থী</th>
                  <th className="py-3 px-3">শ্রেণি ও রোল</th>
                  <th className="py-3 px-3">ফি এর ধরণ</th>
                  <th className="py-3 px-3 text-right">পরিমাণ</th>
                  <th className="py-3 px-3 text-center">রশিদ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {fees.map((f) => (
                  <tr key={f.id} className="hover:bg-bg transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-primary">{f.receiptNo}</td>
                    <td className="py-3 px-3 font-semibold text-ink">{f.studentName}</td>
                    <td className="py-3 px-3 text-muted">{f.class} শ্রেণি • রোল: {f.studentRoll}</td>
                    <td className="py-3 px-3 text-ink">{f.feeType}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-deep">৳{f.amount}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setActiveReceipt(f)}
                        className="bg-soft hover:bg-soft text-deep px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer border border-soft-border"
                      >
                        রশিদ দেখুন
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Portal-Rendered Receipt Modal */}
      {typeof document !== 'undefined' && receiptModal && createPortal(receiptModal, document.body)}
    </div>
  );
}
