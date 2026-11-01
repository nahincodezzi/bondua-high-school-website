import React, { useState } from 'react';
import { useSchool } from '../../context/useSchool';
import { 
  DollarSign, 
  Printer, 
  Receipt, 
  X
} from 'lucide-react';

export default function FeeManager() {
  const { fees, addFee, schoolInfo, students } = useSchool();
  const [studentRoll, setStudentRoll] = useState('101');
  const [studentName, setStudentName] = useState('তানভীর আহমেদ তানিম');
  const [targetClass, setTargetClass] = useState('10');
  const [feeType, setFeeType] = useState('Monthly Tuition Fee (November)');
  const [amount, setAmount] = useState('500');
  const [method, setMethod] = useState('bKash');
  const [activeReceipt, setActiveReceipt] = useState(null);

  const handleRollChange = (val) => {
    setStudentRoll(val);
    const stu = students.find(s => s.roll.toString() === val);
    if (stu) {
      setStudentName(stu.nameBn);
      setTargetClass(stu.class);
    }
  };

  const handleCollectSubmit = (e) => {
    e.preventDefault();
    const createdReceipt = addFee({
      studentRoll,
      studentName,
      class: targetClass,
      feeType,
      amount: Number(amount),
      method
    });
    setActiveReceipt(createdReceipt);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-bangla text-slate-900">
          ফি কালেকশন ও হিসাব ব্যবস্থাপনা (Fee Collection & Receipts)
        </h2>
        <p className="text-xs text-slate-500 font-bangla">
          শিক্ষার্থীদের মাসিক বেতন, পরীক্ষা ফি গ্রহণ এবং প্রাতিষ্ঠানিক মানি রিসিট প্রস্তুতকরণ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Collection Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold font-bangla text-slate-900 text-sm pb-2 border-b flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-700" />
            <span>নতুন ফি আদায় ও রশিদ প্রস্তুতকরণ</span>
          </h3>

          <form onSubmit={handleCollectSubmit} className="space-y-3 text-xs font-bangla">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">শিক্ষার্থীর রোল *</label>
                <input
                  type="text"
                  required
                  value={studentRoll}
                  onChange={(e) => handleRollChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 font-mono font-bold"
                  placeholder="101"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">শ্রেণি</label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
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

            <div>
              <label className="block font-bold text-slate-700 mb-1">শিক্ষার্থীর নাম *</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ফি এর বিবরণ *</label>
              <select
                value={feeType}
                onChange={(e) => setFeeType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 bg-white"
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
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">পরিশোধের মাধ্যম</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 bg-white"
                >
                  <option value="bKash">বিকাশ (bKash)</option>
                  <option value="Nagad">নগদ (Nagad)</option>
                  <option value="Cash">নগদ ক্যাশ (School Counter)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4 text-amber-300" />
              <span>ফি গ্রহণ ও রশিদ প্রিন্ট করুন</span>
            </button>
          </form>
        </div>

        {/* Recent Transactions List */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 font-bangla">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b flex justify-between items-center">
            <span>আদায়কৃত ফি তালিকা ({fees.length} টি)</span>
          </h3>

          <div className="space-y-2 max-h-[460px] overflow-y-auto">
            {fees.map((f) => (
              <div
                key={f.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{f.studentName}</span>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-emerald-800 font-bold">{f.receiptNo}</span>
                    <span>• রোল: {f.studentRoll}</span>
                    <span>• {f.feeType}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-extrabold text-slate-900 text-sm block">
                    ৳{f.amount}
                  </span>
                  <button
                    onClick={() => setActiveReceipt(f)}
                    className="text-[10px] text-emerald-800 hover:underline font-bold"
                  >
                    রশিদ দেখুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Official Printable Money Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
            {/* Top Toolbar */}
            <div className="bg-slate-900 text-white px-4 py-2.5 flex justify-between items-center text-xs no-print">
              <span>অফিসিয়াল মানি রিসিট</span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট করুন</span>
                </button>
                <button onClick={() => setActiveReceipt(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Paper */}
            <div className="p-6 sm:p-8 bg-white space-y-4 font-bangla" id="official-money-receipt">
              <div className="text-center border-b-2 border-emerald-950 pb-3">
                <h3 className="text-xl font-extrabold text-emerald-950">
                  {schoolInfo.nameBn}
                </h3>
                <p className="text-xs text-slate-600">{schoolInfo.addressBn}</p>
                <p className="text-[10px] text-slate-400 font-mono">EIIN: {schoolInfo.eiin} • ফুলগাজী, ফেনী</p>
                <span className="inline-block bg-emerald-900 text-white text-[10px] font-bold px-3 py-0.5 rounded uppercase mt-2">
                  MONEY RECEIPT / ফি আদায়ের রশিদ
                </span>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-600 border-b pb-2">
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
                  <span className="font-bold text-emerald-800">{activeReceipt.method}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-sm">
                  <span className="font-bold text-emerald-950">সর্বমোট পরিশোধিত টাকা:</span>
                  <span className="font-mono font-extrabold text-emerald-950">৳{activeReceipt.amount} /-</span>
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
                    <span className="font-serif italic text-emerald-900 font-bold">Rabiul H.</span>
                  </div>
                  <p className="font-bold text-slate-900">প্রধান শিক্ষক</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
