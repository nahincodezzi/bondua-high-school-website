import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSchool } from '../../context/useSchool';
import { toBanglaNumerals, toEnglishNumerals } from '../../utils/dateFormatter';
import { 
  DollarSign, 
  Printer, 
  Receipt, 
  X,
  AlertCircle,
  UserCheck
} from 'lucide-react';

export default function FeeManager() {
  const { fees, addFee, schoolInfo, students, lang } = useSchool();
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
    window.print();
  };

  const receiptModal = activeReceipt ? (
    <div 
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="money-receipt-title"
    >
      <div className="fixed inset-0 -z-10" onClick={() => setActiveReceipt(null)} aria-hidden="true" />
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden border border-[#E5E7EB] shadow-2xl relative">
        {/* Top Toolbar */}
        <div className="bg-[#14532D] text-white px-4 py-2.5 flex justify-between items-center text-xs no-print border-b border-[#166534]">
          <span className="font-bold flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-[#F59E0B]" />
            <span id="money-receipt-title">অফিসিয়াল মানি রিসিট</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="btn-accent px-3 py-1 rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#1F2937]" />
              <span>প্রিন্ট করুন</span>
            </button>
            <button onClick={() => setActiveReceipt(null)} className="text-white/80 hover:text-white cursor-pointer" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-6 sm:p-8 bg-white space-y-4 font-bangla" id="official-money-receipt">
          <div className="text-center border-b-2 border-[#14532D] pb-3">
            <h3 className="text-xl font-extrabold text-[#14532D]">
              {schoolInfo.nameBn}
            </h3>
            <p className="text-xs text-slate-600">{schoolInfo.addressBn}</p>
            <p className="text-[10px] text-slate-400 font-mono">EIIN: {schoolInfo.eiin} • ফুলগাজী, ফেনী</p>
            <span className="inline-block bg-[#14532D] text-white text-[10px] font-bold px-3 py-0.5 rounded uppercase mt-2">
              MONEY RECEIPT / ফি আদায়ের রশিদ
            </span>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-600 border-b border-[#E5E7EB] pb-2">
            <span>রশিদ নং: <strong className="font-mono text-slate-900">{activeReceipt.receiptNo}</strong></span>
            <span>তারিখ: <strong className="font-mono text-slate-900">{activeReceipt.paidDate}</strong></span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">শিক্ষার্থীর নাম:</span>
              <span className="font-bold text-slate-900">{activeReceipt.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">শ্রেণি ও রোল নম্বর:</span>
              <span>{activeReceipt.class} শ্রেণি • রোল: <strong className="font-mono">{activeReceipt.studentRoll}</strong></span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ফি এর বিবরণ:</span>
              <span className="font-medium text-slate-800">{activeReceipt.feeType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">পরিশোধের মাধ্যম:</span>
              <span className="font-bold text-[#166534]">{activeReceipt.method}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-[#DCFCE7] rounded-lg border border-emerald-300 text-sm">
              <span className="font-bold text-[#14532D]">সর্বমোট পরিশোধিত টাকা:</span>
              <span className="font-mono font-extrabold text-[#14532D]">৳{activeReceipt.amount} /-</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 flex justify-between items-end text-xs">
            <div className="text-center space-y-1">
              <div className="w-24 border-b border-slate-600 mx-auto pb-1 text-slate-400">
                স্বাক্ষর
              </div>
              <p className="font-bold text-slate-700">হিসাবরক্ষক</p>
            </div>

            <div className="text-center space-y-1">
              <div className="w-24 border-b border-slate-600 mx-auto pb-1">
                <span className="font-serif italic text-[#166534] font-bold">Bahar U.</span>
              </div>
              <p className="font-bold text-slate-900">{schoolInfo.headmasterNameBn}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-bangla text-[#1F2937]">
          ফি কালেকশন ও হিসাব ব্যবস্থাপনা (Fee Collection & Receipts)
        </h2>
        <p className="text-xs text-[#4B5563] font-bangla">
          শিক্ষার্থীদের মাসিক বেতন, পরীক্ষা ফি গ্রহণ এবং প্রাতিষ্ঠানিক মানি রিসিট প্রস্তুতকরণ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Collection Form */}
        <div className="lg:col-span-5 card-base bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
          <h3 className="font-bold font-bangla text-[#1F2937] text-sm pb-2 border-b border-[#E5E7EB] flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#166534]" />
            <span>নতুন ফি আদায় ও রশিদ প্রস্তুতকরণ</span>
          </h3>

          <form onSubmit={handleCollectSubmit} className="space-y-3 text-xs font-bangla">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">শ্রেণি *</label>
                <select
                  value={targetClass}
                  onChange={(e) => {
                    setTargetClass(e.target.value);
                    setErrorMessage('');
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
                  value={studentRoll}
                  onChange={(e) => {
                    setStudentRoll(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full rounded-lg border border-[#D1D5DB] p-2.5 font-mono font-bold bg-[#F7F9F8] text-[#1F2937] focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  placeholder="যেমন: 101"
                />
              </div>
            </div>

            {/* Live Student Match Confirmation Pill */}
            {matchedStudent ? (
              <div className="p-3 bg-[#DCFCE7] text-[#14532D] rounded-xl text-xs flex items-center justify-between border border-emerald-300">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#166534]" />
                  <span className="font-bold">শিক্ষার্থী: {matchedStudent.nameBn}</span>
                </div>
                <span className="font-mono text-[11px] font-semibold">{matchedStudent.studentId}</span>
              </div>
            ) : studentRoll ? (
              <div className="p-2.5 bg-[#FEE2E2] text-[#DC2626] rounded-xl text-xs flex items-center gap-1.5 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>শ্রেণি {targetClass}-এ এই রোলের কোনো শিক্ষার্থী পাওয়া যায়নি।</span>
              </div>
            ) : null}

            <div>
              <label className="block font-bold text-slate-700 mb-1">ফি এর বিবরণ *</label>
              <select
                value={feeType}
                onChange={(e) => setFeeType(e.target.value)}
                className="w-full rounded-lg border border-[#D1D5DB] p-2.5 bg-[#F7F9F8] text-[#1F2937] focus:ring-2 focus:ring-[#166534] focus:outline-none"
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
                <label className="block font-bold text-slate-700 mb-1">টাকার পরিমাণ (৳) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full rounded-lg border border-[#D1D5DB] p-2.5 font-mono font-bold bg-[#F7F9F8] text-[#1F2937] focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">পরিশোধের মাধ্যম</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full rounded-lg border border-[#D1D5DB] p-2.5 bg-[#F7F9F8] text-[#1F2937] focus:ring-2 focus:ring-[#166534] focus:outline-none font-semibold"
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
              <div className="p-3 bg-[#FEE2E2] text-[#DC2626] rounded-xl text-xs font-medium flex items-center gap-2 border border-red-200">
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
        <div className="lg:col-span-7 card-base bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4 font-bangla">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <div>
              <h3 className="font-bold text-[#1F2937] text-sm">
                ফি আদায় ও পেমেন্ট হিস্ট্রি ({lang === 'bn' ? toBanglaNumerals(fees.length) : fees.length} টি রেকর্ড)
              </h3>
              <p className="text-[11px] text-[#4B5563]">সর্বশেষ সংরক্ষিত ফি ট্রানজেকশন</p>
            </div>
            <span className="font-mono font-bold text-xs bg-[#DCFCE7] text-[#14532D] px-3 py-1 rounded-full border border-emerald-300">
              মোট: ৳{toBanglaNumerals(fees.reduce((sum, f) => sum + Number(f.amount || 0), 0).toLocaleString())}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#E5E7EB]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F3F4F6] text-[#1F2937] font-bold border-b border-[#E5E7EB]">
                <tr>
                  <th className="py-3 px-3">রশিদ নং</th>
                  <th className="py-3 px-3">শিক্ষার্থী</th>
                  <th className="py-3 px-3">শ্রেণি ও রোল</th>
                  <th className="py-3 px-3">ফি এর ধরণ</th>
                  <th className="py-3 px-3 text-right">পরিমাণ</th>
                  <th className="py-3 px-3 text-center">রশিদ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {fees.map((f) => (
                  <tr key={f.id} className="hover:bg-[#F7F9F8] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#166534]">{f.receiptNo}</td>
                    <td className="py-3 px-3 font-semibold text-[#1F2937]">{f.studentName}</td>
                    <td className="py-3 px-3 text-[#4B5563]">{f.class} শ্রেণি • রোল: {f.studentRoll}</td>
                    <td className="py-3 px-3 text-slate-700">{f.feeType}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#14532D]">৳{f.amount}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setActiveReceipt(f)}
                        className="bg-[#DCFCE7] hover:bg-[#bbf7d0] text-[#14532D] px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer border border-emerald-300"
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
