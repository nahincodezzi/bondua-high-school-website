import React, { useState } from 'react';
import { useSchool } from '../context/useSchool';
import { 
  Send, 
  CheckCircle2, 
  Printer, 
  RotateCcw, 
  School, 
  Phone, 
  User
} from 'lucide-react';

export default function OnlineAdmission() {
  const { lang, submitAdmission, schoolInfo } = useSchool();

  const [formData, setFormData] = useState({
    studentNameBn: '',
    studentNameEn: '',
    applyingClass: '6',
    group: 'General',
    gender: 'Male',
    dob: '',
    bloodGroup: 'B+',
    fatherName: '',
    fatherNid: '',
    motherName: '',
    guardianPhone: '',
    previousSchool: '',
    previousGpa: '',
    address: ''
  });

  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const created = submitAdmission(formData);
      setSubmittedApplication(created);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const handleNewApplication = () => {
    setSubmittedApplication(null);
    setFormData({
      studentNameBn: '',
      studentNameEn: '',
      applyingClass: '6',
      group: 'General',
      gender: 'Male',
      dob: '',
      bloodGroup: 'B+',
      fatherName: '',
      fatherNid: '',
      motherName: '',
      guardianPhone: '',
      previousSchool: '',
      previousGpa: '',
      address: ''
    });
  };

  return (
    <section className="py-12 bg-slate-50 min-h-[750px]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* If Application is submitted successfully, show the Official Printable Admit Slip */}
        {submittedApplication ? (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden" id="admission-slip">
            {/* Top Toolbar */}
            <div className="bg-emerald-950 text-white px-6 py-3 flex items-center justify-between no-print">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'bn' ? 'ভর্তি আবেদন সফলভাবে গৃহীত হয়েছে!' : 'Admission Application Submitted!'}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleNewApplication}
                  className="px-3 py-1 bg-emerald-900 hover:bg-emerald-800 rounded text-xs transition flex items-center gap-1 font-bangla"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{lang === 'bn' ? 'নতুন আবেদন' : 'New Form'}</span>
                </button>
                <button
                  onClick={handlePrintSlip}
                  className="px-3.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'স্লিপ প্রিন্ট করুন' : 'Print Slip'}</span>
                </button>
              </div>
            </div>

            {/* Printable Slip Container */}
            <div className="p-6 sm:p-10 bg-white space-y-6">
              {/* Slip Header */}
              <div className="text-center border-b-2 border-emerald-900 pb-4">
                <h3 className="text-2xl sm:text-3xl font-extrabold font-bangla text-emerald-950">
                  {lang === 'bn' ? schoolInfo.nameBn : schoolInfo.nameEn}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 font-semibold font-bangla">
                  {schoolInfo.addressBn}
                </p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  EIIN: {schoolInfo.eiin} • কুমিল্লা শিক্ষাবোর্ড • স্থাপিত: ১৯৯০
                </p>
                <div className="mt-2 inline-block bg-emerald-900 text-white px-4 py-1 rounded text-xs font-bold uppercase tracking-wider font-bangla">
                  {lang === 'bn' ? 'অনলাইন ভর্তি আবেদন পত্র ও প্রবেশপত্র (Admit Slip)' : 'ONLINE ADMISSION APPLICATION & ADMIT SLIP'}
                </div>
                <p className="text-xs font-bold text-amber-700 mt-1">শিক্ষাবর্ষ: ২০২৬ (Academic Session 2026)</p>
              </div>

              {/* Tracking ID & Barcode Visual Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 block font-bangla">{lang === 'bn' ? 'আবেদন ট্র্যাকিং নম্বর:' : 'Application Tracking ID:'}</span>
                  <span className="text-xl sm:text-2xl font-mono font-extrabold text-slate-950 tracking-wider">
                    {submittedApplication.trackingId}
                  </span>
                  <p className="text-[11px] text-slate-600 font-bangla mt-0.5">
                    {lang === 'bn' ? 'ভর্তির ফলাফল ও অ্যাডমিট কার্ড যাচাইয়ের জন্য এই নম্বরটি সংরক্ষণ করুন।' : 'Keep this tracking ID safe for future admission queries.'}
                  </p>
                </div>

                {/* Simulated Barcode */}
                <div className="text-center">
                  <div className="font-mono text-xl tracking-widest text-slate-800 font-bold select-none">
                    ||| | |||| | ||| |||| |
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{submittedApplication.trackingId}</span>
                </div>
              </div>

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bangla bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">{lang === 'bn' ? 'শিক্ষার্থীর নাম (বাংলা):' : 'Candidate Name (Bangla):'}</span>
                  <span className="font-bold text-slate-800 text-sm">{submittedApplication.studentNameBn || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{lang === 'bn' ? 'শিক্ষার্থীর নাম (ইংরেজি):' : 'Candidate Name (English):'}</span>
                  <span className="font-bold text-slate-800 text-sm uppercase">{submittedApplication.studentNameEn}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{lang === 'bn' ? 'আবেদনকৃত শ্রেণি:' : 'Applied Class:'}</span>
                  <span className="font-bold text-emerald-800">
                    {lang === 'bn' ? `${submittedApplication.applyingClass} শ্রেণি` : `Class ${submittedApplication.applyingClass}`}
                    {submittedApplication.group && submittedApplication.group !== 'General' && ` (${submittedApplication.group})`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">{lang === 'bn' ? 'লিঙ্গ ও রক্তগ্রুপ:' : 'Gender & Blood Group:'}</span>
                  <span className="font-semibold text-slate-800">{submittedApplication.gender} • {submittedApplication.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{lang === 'bn' ? 'পিতার নাম:' : "Father's Name:"}</span>
                  <span className="font-semibold text-slate-800">{submittedApplication.fatherName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{lang === 'bn' ? 'মাতার নাম:' : "Mother's Name:"}</span>
                  <span className="font-semibold text-slate-800">{submittedApplication.motherName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{lang === 'bn' ? 'অভিভাবকের মোবাইল:' : 'Guardian Mobile:'}</span>
                  <span className="font-mono font-bold text-slate-900">{submittedApplication.guardianPhone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{lang === 'bn' ? 'পূর্ববর্তী বিদ্যালয় ও জিপিএ:' : 'Previous School & GPA:'}</span>
                  <span className="font-semibold text-slate-800">{submittedApplication.previousSchool} (GPA: {submittedApplication.previousGpa || 'N/A'})</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block">{lang === 'bn' ? 'বর্তমান ঠিকানা:' : 'Present Address:'}</span>
                  <span className="text-slate-800 font-medium">{submittedApplication.address}</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-xs text-slate-700 font-bangla space-y-1">
                <span className="font-bold text-emerald-950 block">ভর্তি ও লিখিত পরীক্ষার নির্দেশনাবলী:</span>
                <p>১. এই প্রবেশপত্রটির প্রিন্ট কপি ভর্তি পরীক্ষার দিন সাথে আনতে হবে।</p>
                <p>২. প্রবেশপত্রের সাথে সদ্য তোলা ২ কপি পাসপোর্ট সাইজ ছবি ও জন্ম সনদের ফটোকপি জমা দিতে হবে।</p>
                <p>৩. পরীক্ষার তারিখ ও সময় এসএমএস এর মাধ্যমে এবং ওয়েবসাইটের নোটিশ বোর্ডে জানিয়ে দেওয়া হবে।</p>
              </div>

              {/* Signatures */}
              <div className="pt-8 flex justify-between items-end text-xs font-bangla">
                <div className="text-center space-y-1">
                  <div className="w-32 border-b border-slate-700 mx-auto pb-1 text-slate-400">
                    স্বাক্ষর
                  </div>
                  <p className="font-bold text-slate-700">অভিভাবকের স্বাক্ষর</p>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-32 border-b border-slate-700 mx-auto pb-1">
                    <span className="font-serif italic text-emerald-900 font-bold text-sm">Rabiul H.</span>
                  </div>
                  <p className="font-bold text-slate-900">{schoolInfo.headmasterNameBn}</p>
                  <p className="text-slate-600 text-[11px]">{schoolInfo.headmasterDesignationBn}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Admission Application Form */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Form Top Banner */}
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 sm:p-8">
              <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1 rounded-full mb-3">
                <School className="w-3.5 h-3.5" />
                <span>২০২৬ শিক্ষাবর্ষ ভর্তি ফরম</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-bangla text-white">
                {lang === 'bn' ? 'অনলাইন ভর্তি আবেদন ফরম' : 'Online Admission Application Form'}
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm font-bangla mt-1">
                {lang === 'bn' 
                  ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়ে ৬ষ্ঠ থেকে ৯ম শ্রেণিতে ভর্তির জন্য নিচের সঠিক তথ্য প্রদান করুন।'
                  : 'Please complete all required fields carefully for admission into Bandua Daulatpur High School.'}
              </p>
            </div>

            {/* Main Form Fields */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Step 1: Student Information */}
              <div>
                <h3 className="text-sm font-bold font-bangla text-emerald-950 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'bn' ? '১. শিক্ষার্থীর ব্যক্তিগত তথ্য' : '1. Student Personal Information'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bangla">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'শিক্ষার্থীর নাম (বাংলায়) *' : "Student's Name (Bangla) *"}
                    </label>
                    <input
                      type="text"
                      required
                      name="studentNameBn"
                      value={formData.studentNameBn}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'যেমন: মোহাম্মদ তানভীর ইসলাম' : 'e.g. তানভীর ইসলাম'}
                      className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'শিক্ষার্থীর নাম (ইংরেজিতে ক্যাপিটাল লেটারে) *' : "Student's Name (English Capital) *"}
                    </label>
                    <input
                      type="text"
                      required
                      name="studentNameEn"
                      value={formData.studentNameEn}
                      onChange={handleChange}
                      placeholder="e.g. MOHAMMED TANVIR ISLAM"
                      className="w-full uppercase rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'আবেদনকৃত শ্রেণি *' : 'Applying Class *'}
                    </label>
                    <select
                      name="applyingClass"
                      value={formData.applyingClass}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="6">ষষ্ঠ শ্রেণি (Class VI)</option>
                      <option value="7">সপ্তম শ্রেণি (Class VII)</option>
                      <option value="8">অষ্টম শ্রেণি (Class VIII)</option>
                      <option value="9">নবম শ্রেণি (Class IX)</option>
                    </select>
                  </div>

                  {formData.applyingClass === '9' && (
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {lang === 'bn' ? 'গ্রুপ / বিভাগ (৯ম শ্রেণির জন্য)' : 'Group (For Class 9)'}
                      </label>
                      <select
                        name="group"
                        value={formData.group}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 bg-white"
                      >
                        <option value="Science">বিজ্ঞান (Science)</option>
                        <option value="Business Studies">ব্যবসায় শিক্ষা (Business Studies)</option>
                        <option value="Humanities">মানবিক (Humanities)</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'লিঙ্গ *' : 'Gender *'}
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="Male">ছাত্র (Male)</option>
                      <option value="Female">ছাত্রী (Female)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'জন্ম তারিখ *' : 'Date of Birth *'}
                    </label>
                    <input
                      type="date"
                      required
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group'}
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="A+">A Positive (A+)</option>
                      <option value="B+">B Positive (B+)</option>
                      <option value="O+">O Positive (O+)</option>
                      <option value="AB+">AB Positive (AB+)</option>
                      <option value="A-">A Negative (A-)</option>
                      <option value="B-">B Negative (B-)</option>
                      <option value="O-">O Negative (O-)</option>
                      <option value="AB-">AB Negative (AB-)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Guardian Info */}
              <div>
                <h3 className="text-sm font-bold font-bangla text-emerald-950 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'bn' ? '২. পিতা, মাতা ও অভিভাবকের তথ্য' : '2. Guardian Information'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bangla">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'পিতার নাম *' : "Father's Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'পিতার নাম লিখুন' : "Enter father's name"}
                      className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'মাতার নাম *' : "Mother's Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'মাতার নাম লিখুন' : "Enter mother's name"}
                      className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'অভিভাবকের সক্রিয় মোবাইল নম্বর *' : 'Guardian Mobile Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      name="guardianPhone"
                      value={formData.guardianPhone}
                      onChange={handleChange}
                      placeholder="018XXXXXXXX"
                      className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'পিতার জাতীয় পরিচয়পত্র (NID) নম্বর' : 'Father NID Number (Optional)'}
                    </label>
                    <input
                      type="text"
                      name="fatherNid"
                      value={formData.fatherNid}
                      onChange={handleChange}
                      placeholder="NID Number"
                      className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Academic Background & Address */}
              <div>
                <h3 className="text-sm font-bold font-bangla text-emerald-950 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
                  <School className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'bn' ? '৩. পূর্ববর্তী শিক্ষা ও বর্তমান ঠিকানা' : '3. Previous Education & Address'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bangla">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'পূর্ববর্তী বিদ্যালয়ের নাম *' : 'Previous School Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      name="previousSchool"
                      value={formData.previousSchool}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'যেমন: বন্দুয়া সরকারি প্রাথমিক বিদ্যালয়' : 'e.g. Primary School Name'}
                      className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'পূর্ববর্তী ক্লাসের ফলাফল (GPA/Marks)' : 'Previous Class GPA/Grade'}
                    </label>
                    <input
                      type="text"
                      name="previousGpa"
                      value={formData.previousGpa}
                      onChange={handleChange}
                      placeholder="e.g. 5.00"
                      className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      {lang === 'bn' ? 'বর্তমান স্থায়ী ঠিকানা *' : 'Complete Address *'}
                    </label>
                    <textarea
                      required
                      rows="2"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'গ্রাম: বন্দুয়া দৌলতপুর, ডাকঘর: আনন্দপুর, উপজেলা: ফুলগাজী, জেলা: ফেনী' : 'Village, Union, Upazila, District'}
                      className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500 font-bangla">
                  * ফরম জমা দেওয়ার পর স্বয়ংক্রিয়ভাবে প্রবেশপত্র তৈরি হবে।
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 font-bangla"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>{isSubmitting ? 'প্রসেসিং হচ্ছে...' : (lang === 'bn' ? 'ভর্তি আবেদন জমা দিন' : 'Submit Application')}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
