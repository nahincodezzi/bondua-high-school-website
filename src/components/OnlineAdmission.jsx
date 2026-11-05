import React, { useState } from 'react';
import SchoolLogo from './common/SchoolLogo';
import { useSchool } from '../context/useSchool';
import { 
  Send, 
  CheckCircle2, 
  Printer, 
  RotateCcw, 
  School, 
  Phone, 
  User,
  GraduationCap
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
    <section className="py-14 text-white relative z-10 font-sans min-h-[750px]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* If Application is submitted successfully, show the Official Printable Admit Slip */}
        {submittedApplication ? (
          <div className="glass-card rounded-3xl shadow-2xl border border-white/20 overflow-hidden backdrop-blur-xl" id="admission-slip">
            {/* Top Toolbar */}
            <div className="glass-capsule text-white px-6 py-3.5 flex items-center justify-between no-print border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 font-bangla">{lang === 'bn' ? 'ভর্তি আবেদন সফলভাবে গৃহীত হয়েছে!' : 'Admission Application Submitted!'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleNewApplication}
                  className="px-3.5 py-1.5 glass-pill hover:bg-white/15 rounded-full text-xs transition flex items-center gap-1.5 font-bangla border border-white/10 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                  <span>{lang === 'bn' ? 'নতুন আবেদন' : 'New Form'}</span>
                </button>
                <button
                  onClick={handlePrintSlip}
                  className="btn-gold px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'স্লিপ প্রিন্ট করুন' : 'Print Slip'}</span>
                </button>
              </div>
            </div>

            {/* Printable Slip Container */}
            <div className="p-6 sm:p-10 bg-slate-900/90 text-slate-100 space-y-6">
              {/* Slip Header */}
              <div className="text-center border-b border-white/15 pb-4">
                <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-white p-0.5 shadow-lg ring-2 ring-amber-400">
                  <SchoolLogo logo={schoolInfo.logo} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-bangla text-white">
                  {lang === 'bn' ? schoolInfo.nameBn : schoolInfo.nameEn}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-semibold font-bangla">
                  {schoolInfo.addressBn}
                </p>
                <p className="text-xs text-amber-300 font-mono mt-0.5">
                  EIIN: {schoolInfo.eiin} • কুমিল্লা শিক্ষাবোর্ড • স্থাপিত: ১৯৯০
                </p>
                <div className="mt-3 inline-block btn-gold px-4 py-1 text-xs font-bold uppercase tracking-wider font-bangla shadow-sm">
                  {lang === 'bn' ? 'অনলাইন ভর্তি আবেদন পত্র ও প্রবেশপত্র (Admit Slip)' : 'ONLINE ADMISSION APPLICATION & ADMIT SLIP'}
                </div>
                <p className="text-xs font-bold text-amber-300 mt-1.5">শিক্ষাবর্ষ: ২০২৬ (Academic Session 2026)</p>
              </div>

              {/* Tracking ID & Barcode Visual Banner */}
              <div className="glass-pill border border-amber-400/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 block font-bangla">{lang === 'bn' ? 'আবেদন ট্র্যাকিং নম্বর:' : 'Application Tracking ID:'}</span>
                  <span className="text-xl sm:text-2xl font-mono font-extrabold text-amber-300 tracking-wider">
                    {submittedApplication.trackingId}
                  </span>
                  <p className="text-[11px] text-slate-300 font-bangla mt-0.5">
                    {lang === 'bn' ? 'ভর্তির ফলাফল ও অ্যাডমিট কার্ড যাচাইয়ের জন্য এই নম্বরটি সংরক্ষণ করুন।' : 'Keep this tracking ID safe for future admission queries.'}
                  </p>
                </div>

                {/* Simulated Barcode */}
                <div className="text-center">
                  <div className="font-mono text-xl tracking-widest text-amber-300 font-bold select-none">
                    ||| | |||| | ||| |||| |
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{submittedApplication.trackingId}</span>
                </div>
              </div>

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bangla glass-card p-5 rounded-2xl border border-white/10">
                <div>
                  <span className="text-slate-400 block">{lang === 'bn' ? 'শিক্ষার্থীর নাম (বাংলা):' : 'Candidate Name (Bangla):'}</span>
                  <span className="font-bold text-white text-sm">{submittedApplication.studentNameBn || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{lang === 'bn' ? 'শিক্ষার্থীর নাম (ইংরেজি):' : 'Candidate Name (English):'}</span>
                  <span className="font-bold text-white text-sm uppercase font-mono">{submittedApplication.studentNameEn}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{lang === 'bn' ? 'আবেদনকৃত শ্রেণি:' : 'Applied Class:'}</span>
                  <span className="font-bold text-amber-300">
                    {lang === 'bn' ? `${submittedApplication.applyingClass} শ্রেণি` : `Class ${submittedApplication.applyingClass}`}
                    {submittedApplication.group && submittedApplication.group !== 'General' && ` (${submittedApplication.group})`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">{lang === 'bn' ? 'লিঙ্গ ও রক্তগ্রুপ:' : 'Gender & Blood Group:'}</span>
                  <span className="font-semibold text-slate-200">{submittedApplication.gender} • {submittedApplication.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{lang === 'bn' ? 'পিতার নাম:' : "Father's Name:"}</span>
                  <span className="font-semibold text-slate-200">{submittedApplication.fatherName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{lang === 'bn' ? 'মাতার নাম:' : "Mother's Name:"}</span>
                  <span className="font-semibold text-slate-200">{submittedApplication.motherName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{lang === 'bn' ? 'অভিভাবকের মোবাইল নম্বর:' : 'Guardian Phone:'}</span>
                  <span className="font-mono font-bold text-amber-300">{submittedApplication.guardianPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{lang === 'bn' ? 'পূর্ববর্তী প্রতিষ্ঠান ও জিপিএ:' : 'Previous School & GPA:'}</span>
                  <span className="font-semibold text-slate-200">{submittedApplication.previousSchool || 'N/A'} (GPA: {submittedApplication.previousGpa || 'N/A'})</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block">{lang === 'bn' ? 'স্থায়ী ঠিকানা:' : 'Address:'}</span>
                  <span className="font-medium text-slate-200">{submittedApplication.address}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Admission Application Form */
          <div className="glass-card rounded-3xl shadow-2xl border border-white/20 overflow-hidden backdrop-blur-xl">
            {/* Header */}
            <div className="glass-capsule p-6 sm:p-8 text-center border-b border-white/10">
              <div className="inline-flex items-center gap-1.5 glass-pill text-amber-300 text-xs font-bold px-4 py-1.5 rounded-full mb-3 font-bangla border border-amber-400/20">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>২০২৬ শিক্ষাবর্ষে নতুন শিক্ষার্থী ভর্তি কার্যক্রম</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-bangla text-white drop-shadow-md">
                {lang === 'bn' ? 'অনলাইন ভর্তি আবেদন ফরম' : 'Online Admission Application Form'}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm font-bangla mt-1 max-w-xl mx-auto">
                {lang === 'bn' 
                  ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়ে ৬ষ্ঠ থেকে ৯ম শ্রেণিতে ভর্তির জন্য নিচের সঠিক তথ্য প্রদান করুন।'
                  : 'Please complete all required fields carefully for admission into Bandua Daulatpur High School.'}
              </p>
            </div>

            {/* Main Form Fields */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
              {/* Step 1: Student Information */}
              <div>
                <h3 className="text-sm font-bold font-bangla text-amber-300 border-b border-white/10 pb-2.5 mb-5 flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'bn' ? '১. শিক্ষার্থীর ব্যক্তিগত তথ্য' : '1. Student Personal Information'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bangla">
                  <div>
                    <label className="block font-bold text-slate-200 mb-1.5">
                      {lang === 'bn' ? 'শিক্ষার্থীর নাম (বাংলায়) *' : "Student's Name (Bangla) *"}
                    </label>
                    <input
                      type="text"
                      required
                      name="studentNameBn"
                      value={formData.studentNameBn}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'যেমন: মোহাম্মদ তানভীর ইসলাম' : 'e.g. তানভীর ইসলাম'}
                      className="glass-input w-full rounded-xl p-3 text-white placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-200 mb-1.5">
                      {lang === 'bn' ? 'শিক্ষার্থীর নাম (ইংরেজিতে ক্যাপিটাল লেটারে) *' : "Student's Name (English Capital) *"}
                    </label>
                    <input
                      type="text"
                      required
                      name="studentNameEn"
                      value={formData.studentNameEn}
                      onChange={handleChange}
                      placeholder="e.g. MOHAMMED TANVIR ISLAM"
                      className="glass-input w-full uppercase rounded-xl p-3 text-white placeholder-slate-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-200 mb-1.5">
                      {lang === 'bn' ? 'আবেদনকৃত শ্রেণি *' : 'Applying Class *'}
                    </label>
                    <select
                      name="applyingClass"
                      value={formData.applyingClass}
                      onChange={handleChange}
                      className="glass-input w-full rounded-xl p-3 text-white bg-slate-900"
                    >
                      <option value="6" className="bg-slate-900 text-white">ষষ্ঠ শ্রেণি (Class VI)</option>
                      <option value="7" className="bg-slate-900 text-white">সপ্তম শ্রেণি (Class VII)</option>
                      <option value="8" className="bg-slate-900 text-white">অষ্টম শ্রেণি (Class VIII)</option>
                      <option value="9" className="bg-slate-900 text-white">নবম শ্রেণি (Class IX)</option>
                    </select>
                  </div>

                  {formData.applyingClass === '9' && (
                    <div>
                      <label className="block font-bold text-slate-200 mb-1.5">
                        {lang === 'bn' ? 'গ্রুপ / বিভাগ (৯ম শ্রেণির জন্য)' : 'Group (For Class 9)'}
                      </label>
                      <select
                        name="group"
                        value={formData.group}
                        onChange={handleChange}
                        className="glass-input w-full rounded-xl p-3 text-white bg-slate-900"
                      >
                        <option value="Science" className="bg-slate-900 text-white">বিজ্ঞান (Science)</option>
                        <option value="Business Studies" className="bg-slate-900 text-white">ব্যবসায় শিক্ষা (Business Studies)</option>
                        <option value="Humanities" className="bg-slate-900 text-white">মানবিক (Humanities)</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-200 mb-1.5">
                      {lang === 'bn' ? 'লিঙ্গ *' : 'Gender *'}
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="glass-input w-full rounded-xl p-3 text-white bg-slate-900"
                    >
                      <option value="Male" className="bg-slate-900 text-white">ছাত্র (Male)</option>
                      <option value="Female" className="bg-slate-900 text-white">ছাত্রী (Female)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-200 mb-1.5">
                      {lang === 'bn' ? 'জন্ম তারিখ *' : 'Date of Birth *'}
                    </label>
                    <input
                      type="date"
                      required
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="glass-input w-full rounded-xl p-3 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-200 mb-1.5">
                      {lang === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group'}
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="glass-input w-full rounded-xl p-3 text-white bg-slate-900"
                    >
                      <option value="A+" className="bg-slate-900 text-white">A Positive (A+)</option>
                      <option value="B+" className="bg-slate-900 text-white">B Positive (B+)</option>
                      <option value="O+" className="bg-slate-900 text-white">O Positive (O+)</option>
                      <option value="AB+" className="bg-slate-900 text-white">AB Positive (AB+)</option>
                      <option value="A-" className="bg-slate-900 text-white">A Negative (A-)</option>
                      <option value="B-" className="bg-slate-900 text-white">B Negative (B-)</option>
                      <option value="O-" className="bg-slate-900 text-white">O Negative (O-)</option>
                      <option value="AB-" className="bg-slate-900 text-white">AB Negative (AB-)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Guardian Info */}
              <div>
                <h3 className="text-sm font-bold font-bangla text-amber-300 border-b border-white/10 pb-2.5 mb-5 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'bn' ? '২. পিতা, মাতা ও অভিভাবকের তথ্য' : '2. Guardian Information'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bangla">
                  <div>
                    <label className="block font-bold text-slate-200 mb-1.5">
                      {lang === 'bn' ? 'পিতার নাম *' : "Father's Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'পিতার নাম লিখুন' : "Enter father's name"}
                      className="glass-input w-full rounded-xl p-3 text-white placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-200 mb-1.5">
                      {lang === 'bn' ? 'মাতার নাম *' : "Mother's Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'মাতার নাম লিখুন' : "Enter mother's name"}
                      className="glass-input w-full rounded-xl p-3 text-white placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-200 mb-1.5">
                      {lang === 'bn' ? 'অভিভাবকের সক্রিয় মোবাইল নম্বর *' : 'Guardian Mobile Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      name="guardianPhone"
                      value={formData.guardianPhone}
                      onChange={handleChange}
                      placeholder="018XXXXXXXX"
                      className="glass-input w-full rounded-xl p-3 text-white placeholder-slate-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-200 mb-1.5">
                      {lang === 'bn' ? 'পিতার জাতীয় পরিচয়পত্র (NID) নম্বর' : 'Father NID Number (Optional)'}
                    </label>
                    <input
                      type="text"
                      name="fatherNid"
                      value={formData.fatherNid}
                      onChange={handleChange}
                      placeholder="NID Number"
                      className="glass-input w-full rounded-xl p-3 text-white placeholder-slate-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Academic Background & Address */}
              <div>
                <h3 className="text-sm font-bold font-bangla text-amber-300 border-b border-white/10 pb-2.5 mb-5 flex items-center gap-2">
                  <School className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'bn' ? '৩. পূর্ববর্তী শিক্ষা ও বর্তমান ঠিকানা' : '3. Previous Education & Address'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bangla">
                  <div>
                    <label className="block font-bold text-slate-200 mb-1.5">
                      {lang === 'bn' ? 'পূর্ববর্তী বিদ্যালয়ের নাম *' : 'Previous School Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      name="previousSchool"
                      value={formData.previousSchool}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'যেমন: বন্দুয়া সরকারি প্রাথমিক বিদ্যালয়' : 'e.g. Primary School Name'}
                      className="glass-input w-full rounded-xl p-3 text-white placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-200 mb-1.5">
                      {lang === 'bn' ? 'পূর্ববর্তী ক্লাসের ফলাফল (GPA/Marks)' : 'Previous Class GPA/Grade'}
                    </label>
                    <input
                      type="text"
                      name="previousGpa"
                      value={formData.previousGpa}
                      onChange={handleChange}
                      placeholder="e.g. 5.00"
                      className="glass-input w-full rounded-xl p-3 text-white placeholder-slate-500 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-200 mb-1.5">
                      {lang === 'bn' ? 'বর্তমান স্থায়ী ঠিকানা *' : 'Complete Address *'}
                    </label>
                    <textarea
                      required
                      rows="2"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'গ্রাম: বন্দুয়া দৌলতপুর, ডাকঘর: আনন্দপুর, উপজেলা: ফুলগাজী, জেলা: ফেনী' : 'Village, Union, Upazila, District'}
                      className="glass-input w-full rounded-xl p-3 text-white placeholder-slate-500"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-300 font-bangla">
                  * ফরম জমা দেওয়ার পর স্বয়ংক্রিয়ভাবে প্রবেশপত্র তৈরি হবে।
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto btn-gold py-3 px-8 text-sm transition shadow-xl flex items-center justify-center gap-2 font-bangla cursor-pointer"
                >
                  <Send className="w-4 h-4 text-slate-950" />
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
