import React, { useState, useRef } from 'react';
import SchoolLogo from './common/SchoolLogo';
import { useSchool } from '../context/useSchool';
import { getSignatories } from '../utils/signatories';
import { 
  Send, 
  CheckCircle2, 
  Printer, 
  RotateCcw, 
  School, 
  Phone, 
  User,
  GraduationCap,
  AlertCircle
} from 'lucide-react';

export default function OnlineAdmission() {
  const { lang, submitAdmission, schoolInfo, teachers, systemUsers } = useSchool();
  const signatories = getSignatories(schoolInfo, teachers, systemUsers);

  const [formData, setFormData] = useState({
    studentNameBn: '',
    studentNameEn: '',
    applyingClass: '6',
    group: 'General',
    gender: 'Male',
    dob: '',
    bloodGroup: '', // M5 fix: empty by default
    fatherName: '',
    fatherNid: '',
    motherName: '',
    guardianPhone: '',
    previousSchool: '',
    previousGpa: '',
    address: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // 1. Student Name (Bangla - M2 / TC13 / Senior QA M7)
    if (!formData.studentNameBn.trim()) {
      errors.studentNameBn = lang === 'bn' ? 'শিক্ষার্থীর বাংলা নাম আবশ্যক।' : 'Bangla name is required.';
    } else if (formData.studentNameBn.trim().length < 3) {
      errors.studentNameBn = lang === 'bn' ? 'বাংলা নাম কমপক্ষে ৩ অক্ষরের হতে হবে (এক বা দুই অক্ষর গ্রহণযোগ্য নয়)।' : 'Name must be at least 3 characters.';
    } else if (!/^[\u0980-\u09FF\s.]+$/.test(formData.studentNameBn.trim())) {
      errors.studentNameBn = lang === 'bn' 
        ? 'বাংলা নামের ঘরে শুধুমাত্র বাংলা অক্ষর লিখুন (ইংরেজি বা সংখ্যা গ্রহণযোগ্য নয়)।' 
        : 'Student name in Bangla must contain only Bengali characters.';
    }

    // 2. Student Name (English)
    if (!formData.studentNameEn.trim()) {
      errors.studentNameEn = lang === 'bn' ? 'শিক্ষার্থীর ইংরেজি নাম আবশ্যক।' : 'English name is required.';
    }

    // 3. Father Name (cannot be only whitespace - TC14)
    if (!formData.fatherName.trim()) {
      errors.fatherName = lang === 'bn' ? 'পিতার নাম সঠিক নিয়মে লিখুন।' : 'Father name is required.';
    }

    // 4. Mother Name
    if (!formData.motherName.trim()) {
      errors.motherName = lang === 'bn' ? 'মাতার নাম সঠিক নিয়মে লিখুন।' : 'Mother name is required.';
    }

    // 5. Guardian Mobile Number (TC15: BD Mobile ^01[3-9]\d{8}$)
    const phoneClean = formData.guardianPhone.trim().replace(/[-\s]/g, '');
    const normalizedPhone = phoneClean.replace(/^(\+88|88)/, '');
    if (!/^01[3-9]\d{8}$/.test(normalizedPhone)) {
      errors.guardianPhone = lang === 'bn' 
        ? 'সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 01819204561)' 
        : 'Enter a valid 11-digit BD mobile number (e.g. 01819204561)';
    }

    // 6. Date of Birth in sensible range (2006 - 2016) (TC16)
    if (!formData.dob) {
      errors.dob = lang === 'bn' ? 'জন্ম তারিখ নির্বাচন করুন।' : 'Date of birth is required.';
    } else {
      const birthYear = new Date(formData.dob).getFullYear();
      if (isNaN(birthYear) || birthYear < 2005 || birthYear > 2017) {
        errors.dob = lang === 'bn' 
          ? 'জন্ম তারিখ মাধ্যমিক শিক্ষার্থীদের বয়সসীমার মধ্যে (২০০৫–২০১৭) হতে হবে।' 
          : 'DOB must fall in secondary school age range (2005–2017).';
      }
    }

    // 7. Previous GPA validation (1.00 - 5.00) (TC17)
    if (formData.previousGpa && formData.previousGpa.trim()) {
      const gpaNum = parseFloat(formData.previousGpa.trim());
      if (isNaN(gpaNum) || gpaNum < 1.0 || gpaNum > 5.0) {
        errors.previousGpa = lang === 'bn' 
          ? 'জিপিএ ১.০০ থেকে ৫.০০ এর মধ্যে হতে হবে।' 
          : 'GPA must be between 1.00 and 5.00.';
      }
    }

    // 8. Father NID (optional, but if provided must be 10, 13, or 17 digits)
    if (formData.fatherNid && formData.fatherNid.trim()) {
      const nidClean = formData.fatherNid.trim();
      if (!/^\d{10}$|^\d{13}$|^\d{17}$/.test(nidClean)) {
        errors.fatherNid = lang === 'bn' 
          ? 'এনআইডি নম্বর ১০, ১৩ অথবা ১৭ ডিজিটের হতে হবে।' 
          : 'NID must be 10, 13, or 17 digits.';
      }
    }

    // 9. Address (M2 / TC13: minimum 10 characters)
    if (!formData.address.trim()) {
      errors.address = lang === 'bn' ? 'স্থায়ী ঠিকানা লিখুন।' : 'Address is required.';
    } else if (formData.address.trim().length < 10) {
      errors.address = lang === 'bn' 
        ? 'পূর্ণাঙ্গ স্থায়ী ঠিকানা অন্তত ১০ অক্ষরে লিখুন (গ্রাম, ডাকঘর, উপজেলা, জেলা)।' 
        : 'Please enter a complete address (minimum 10 characters).';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmittingRef.current || isSubmitting) return;

    if (!validateForm()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setTimeout(() => {
      const created = submitAdmission({
        ...formData,
        studentNameEn: formData.studentNameEn.trim().toUpperCase(),
        fatherName: formData.fatherName.trim(),
        motherName: formData.motherName.trim(),
        guardianPhone: formData.guardianPhone.trim()
      });
      setSubmittedApplication(created);
      setIsSubmitting(false);
      isSubmittingRef.current = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const handleNewApplication = () => {
    setSubmittedApplication(null);
    setFormErrors({});
    setFormData({
      studentNameBn: '',
      studentNameEn: '',
      applyingClass: '6',
      group: 'General',
      gender: 'Male',
      dob: '',
      bloodGroup: '',
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
    <section className="py-12 sm:py-16 text-ink relative z-10 font-sans min-h-[750px] print:py-0 print:min-h-0 print:m-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 print:max-w-full print:p-0 print:m-0">
        {/* If Application is submitted successfully, show the Official Printable Admit Slip */}
        {submittedApplication ? (
          <div className="bg-white rounded-2xl shadow-xl border border-line overflow-hidden print:rounded-none print:shadow-none print:border-none print:m-0 print:p-0" id="admission-slip">
            {/* Top Toolbar */}
            <div className="bg-deep text-white px-6 py-3.5 flex items-center justify-between no-print print:hidden border-b border-primary">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span className="text-white font-bangla">{lang === 'bn' ? 'ভর্তি আবেদন সফলভাবে গৃহীত হয়েছে!' : 'Admission Application Submitted!'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleNewApplication}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs transition flex items-center gap-1.5 font-bangla border border-white/20 cursor-pointer text-white no-print print:hidden"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-accent" />
                  <span>{lang === 'bn' ? 'নতুন আবেদন' : 'New Form'}</span>
                </button>
                <button
                  onClick={handlePrintSlip}
                  className="btn-accent px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer no-print print:hidden"
                >
                  <Printer className="w-3.5 h-3.5 text-ink" />
                  <span>{lang === 'bn' ? 'স্লিপ প্রিন্ট করুন' : 'Print Slip'}</span>
                </button>
              </div>
            </div>

            {/* Printable Slip Container */}
            <div className="p-6 sm:p-10 bg-white text-ink space-y-6 print:p-3 print:space-y-2">
              {/* Slip Header */}
              <div className="text-center border-b-2 border-deep pb-4 print:pb-2">
                <div className="w-14 h-14 print:w-10 print:h-10 mx-auto mb-2 print:mb-1 rounded-full bg-white p-0.5 shadow-sm ring-2 ring-primary">
                  <SchoolLogo logo={schoolInfo.logo} />
                </div>
                <h3 className="text-2xl sm:text-3xl print:text-lg font-extrabold font-bangla text-deep">
                  {lang === 'bn' ? schoolInfo.nameBn : (schoolInfo.nameEn || 'Bandua Daulatpur High School')}
                </h3>
                <p className="text-xs sm:text-sm print:text-[9pt] text-ink font-semibold font-bangla">
                  {schoolInfo.addressBn}
                </p>
                <p className="text-xs print:text-[8pt] text-muted font-mono mt-0.5">
                  EIIN: {schoolInfo.eiin} • কুমিল্লা শিক্ষাবোর্ড • স্থাপিত: ১৯৯০
                </p>
                <div className="mt-3 print:mt-1 inline-block bg-deep text-white px-4 py-1 print:px-2.5 print:py-0.5 rounded text-xs print:text-[8.5pt] font-bold uppercase tracking-wider font-bangla">
                  {lang === 'bn' ? 'অনলাইন ভর্তি আবেদন পত্র ও প্রবেশপত্র (Admit Slip)' : 'ONLINE ADMISSION APPLICATION & ADMIT SLIP'}
                </div>
                <p className="text-xs print:text-[8.5pt] font-bold text-warning mt-1.5 print:mt-0.5">শিক্ষাবর্ষ: ২০২৭ (Academic Session 2027)</p>
              </div>

              {/* Tracking ID Banner */}
              <div className="bg-warning-soft border border-accent rounded-xl p-4 print:p-2 flex flex-col sm:flex-row items-center justify-between gap-4 print:gap-2">
                <div>
                  <span className="text-xs print:text-[8pt] text-warning block font-bangla font-semibold">
                    {lang === 'bn' ? 'আবেদন ট্র্যাকিং নম্বর:' : 'Application Tracking ID:'}
                  </span>
                  <span className="text-xl sm:text-2xl print:text-base font-mono font-extrabold text-ink tracking-wider">
                    {submittedApplication.trackingId}
                  </span>
                  <p className="text-[11px] print:text-[7.5pt] text-muted font-bangla mt-0.5">
                    {lang === 'bn' ? 'ভর্তির ফলাফল ও অ্যাডমিট কার্ড যাচাইয়ের জন্য এই নম্বরটি সংরক্ষণ করুন।' : 'Keep this tracking ID safe for future admission queries.'}
                  </p>
                </div>

                {/* Simulated Barcode */}
                <div className="text-center">
                  <div className="font-mono text-xl print:text-base tracking-widest text-ink font-bold select-none">
                    ||| | |||| | ||| |||| |
                  </div>
                  <span className="text-[10px] print:text-[7pt] font-mono text-muted">{submittedApplication.trackingId}</span>
                </div>
              </div>

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-1.5 text-xs print:text-[8.5pt] font-bangla bg-bg print:bg-white p-5 print:p-2 rounded-xl print:rounded-md border border-line print:border-slate-300">
                <div>
                  <span className="text-muted block print:text-[7pt]">{lang === 'bn' ? 'শিক্ষার্থীর নাম (বাংলা):' : 'Candidate Name (Bangla):'}</span>
                  <span className="font-bold text-ink text-sm print:text-[9pt]">{submittedApplication.studentNameBn || '-'}</span>
                </div>
                <div>
                  <span className="text-muted block print:text-[7pt]">{lang === 'bn' ? 'শিক্ষার্থীর নাম (ইংরেজি):' : 'Candidate Name (English):'}</span>
                  <span className="font-bold text-ink text-sm uppercase font-mono print:text-[9pt]">{submittedApplication.studentNameEn}</span>
                </div>
                <div>
                  <span className="text-muted block print:text-[7pt]">{lang === 'bn' ? 'আবেদনকৃত শ্রেণি:' : 'Applied Class:'}</span>
                  <span className="font-bold text-primary print:text-[9pt]">
                    {lang === 'bn' 
                      ? `${{ '6': '৬ষ্ঠ', '7': '৭ম', '8': '৮ম', '9': '৯ম', '10': '১০ম' }[submittedApplication.applyingClass] || submittedApplication.applyingClass} শ্রেণি` 
                      : `Class ${submittedApplication.applyingClass}`}
                    {submittedApplication.group && submittedApplication.group !== 'General' && ` (${submittedApplication.group})`}
                  </span>
                </div>
                <div>
                  <span className="text-muted block print:text-[7pt]">{lang === 'bn' ? 'লিঙ্গ ও রক্তগ্রুপ:' : 'Gender & Blood Group:'}</span>
                  <span className="font-semibold text-ink">
                    {lang === 'bn'
                      ? ({ 'Male': 'ছাত্র', 'Female': 'ছাত্রী' }[submittedApplication.gender] || submittedApplication.gender)
                      : submittedApplication.gender
                    } {submittedApplication.bloodGroup && `• ${submittedApplication.bloodGroup}`}
                  </span>
                </div>
                <div>
                  <span className="text-muted block print:text-[7pt]">{lang === 'bn' ? 'পিতার নাম:' : "Father's Name:"}</span>
                  <span className="font-semibold text-ink">{submittedApplication.fatherName}</span>
                </div>
                <div>
                  <span className="text-muted block print:text-[7pt]">{lang === 'bn' ? 'মাতার নাম:' : "Mother's Name:"}</span>
                  <span className="font-semibold text-ink">{submittedApplication.motherName}</span>
                </div>
                <div>
                  <span className="text-muted block print:text-[7pt]">{lang === 'bn' ? 'অভিভাবকের মোবাইল নম্বর:' : 'Guardian Phone:'}</span>
                  <span className="font-mono font-bold text-primary">{submittedApplication.guardianPhone}</span>
                </div>
                <div>
                  <span className="text-muted block print:text-[7pt]">{lang === 'bn' ? 'পূর্ববর্তী প্রতিষ্ঠান ও জিপিএ:' : 'Previous School & GPA:'}</span>
                  <span className="font-semibold text-ink">{submittedApplication.previousSchool || 'N/A'} (GPA: {submittedApplication.previousGpa || 'N/A'})</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-muted block print:text-[7pt]">{lang === 'bn' ? 'স্থায়ী ঠিকানা:' : 'Address:'}</span>
                  <span className="font-medium text-ink">{submittedApplication.address}</span>
                </div>
              </div>

              {/* Dynamic Signatures & Official Seal */}
              <div className="pt-6 print:pt-3 border-t border-line flex justify-between items-end text-xs print:text-[8.5pt]">
                {/* Admission Convener (Left) */}
                <div className="text-center space-y-0.5 min-w-[120px]">
                  <div className="w-28 border-b border-slate-400 mx-auto pb-0.5">
                    <span className="font-serif italic text-primary font-bold text-sm print:text-xs">
                      {signatories.admissionConvener.signature}
                    </span>
                  </div>
                  <p className="font-bold text-ink text-[9.5pt] print:text-[8.5pt]">{signatories.admissionConvener.nameBn}</p>
                  <p className="text-muted text-[8pt] print:text-[7pt]">{signatories.admissionConvener.designationBn}</p>
                </div>

                {/* Institute Seal Stamp (Center) */}
                <div className="w-14 h-14 print:w-11 print:h-11 rounded-full border-2 border-dashed border-primary text-primary flex flex-col items-center justify-center p-0.5 text-[6px] text-center font-bold">
                  <span>BANDUA DAULATPUR</span>
                  <span>HIGH SCHOOL</span>
                  <span>SEAL</span>
                </div>

                {/* Headmaster (Right) */}
                <div className="text-center space-y-0.5 min-w-[120px]">
                  <div className="w-28 border-b border-slate-400 mx-auto pb-0.5">
                    <span className="font-serif italic text-primary font-bold text-sm print:text-xs">
                      {signatories.headmaster.signature}
                    </span>
                  </div>
                  <p className="font-bold text-ink text-[9.5pt] print:text-[8.5pt]">{signatories.headmaster.nameBn}</p>
                  <p className="text-muted text-[8pt] print:text-[7pt]">{signatories.headmaster.designationBn}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Admission Application Form */
          <div className="card-base rounded-2xl shadow-md border border-line overflow-hidden bg-white">
            {/* Header */}
            <div className="bg-deep p-6 sm:p-8 text-center text-white border-b border-primary">
              <div className="inline-flex items-center gap-1.5 bg-soft text-deep text-xs font-bold px-4 py-1.5 rounded-full mb-3 font-bangla border border-soft-border">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span>২০২৭ শিক্ষাবর্ষে নতুন শিক্ষার্থী ভর্তি কার্যক্রম</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-bangla text-white">
                {lang === 'bn' ? 'অনলাইন ভর্তি আবেদন ফরম' : 'Online Admission Application Form'}
              </h2>
              <p className="text-soft text-xs sm:text-sm font-bangla mt-1 max-w-xl mx-auto">
                {lang === 'bn' 
                  ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়ে ৬ষ্ঠ থেকে ৯ম শ্রেণিতে ভর্তির জন্য নিচের সঠিক তথ্য প্রদান করুন।'
                  : 'Please complete all required fields carefully for admission into Bandua Daulatpur High School.'}
              </p>
            </div>

            {/* Main Form Fields */}
            <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-10 space-y-8 bg-white">
              {/* Step 1: Student Information */}
              <div>
                <h3 className="text-sm font-bold font-bangla text-deep border-b border-line pb-2.5 mb-5 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <span>{lang === 'bn' ? '১. শিক্ষার্থীর ব্যক্তিগত তথ্য' : '1. Student Personal Information'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bangla">
                  <div>
                    <label htmlFor="studentNameBn" className="block font-bold text-ink mb-1.5">
                      {lang === 'bn' ? 'শিক্ষার্থীর নাম (বাংলায়) *' : "Student's Name (Bangla) *"}
                    </label>
                    <input
                      id="studentNameBn"
                      type="text"
                      required
                      name="studentNameBn"
                      value={formData.studentNameBn}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'যেমন: তানভীর আহমেদ তানিম' : 'e.g. তানভীর আহমেদ'}
                      className={`w-full rounded-lg border p-3 text-ink bg-bg focus:ring-2 focus:ring-primary focus:outline-none ${
                        formErrors.studentNameBn ? 'border-danger-soft bg-danger-soft' : 'border-line'
                      }`}
                    />
                    {formErrors.studentNameBn && (
                      <p className="text-danger text-[11px] mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.studentNameBn}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="studentNameEn" className="block font-bold text-ink mb-1.5">
                      {lang === 'bn' ? 'শিক্ষার্থীর নাম (ইংরেজিতে ক্যাপিটাল লেটারে) *' : "Student's Name (English Capital) *"}
                    </label>
                    <input
                      id="studentNameEn"
                      type="text"
                      required
                      name="studentNameEn"
                      value={formData.studentNameEn}
                      onChange={handleChange}
                      placeholder="e.g. TANVIR AHMED TANIM"
                      className={`w-full uppercase rounded-lg border p-3 text-ink bg-bg focus:ring-2 focus:ring-primary focus:outline-none font-mono ${
                        formErrors.studentNameEn ? 'border-danger-soft bg-danger-soft' : 'border-line'
                      }`}
                    />
                    {formErrors.studentNameEn && (
                      <p className="text-danger text-[11px] mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.studentNameEn}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="applyingClass" className="block font-bold text-ink mb-1.5">
                      {lang === 'bn' ? 'আবেদনকৃত শ্রেণি *' : 'Applying Class *'}
                    </label>
                    <select
                      id="applyingClass"
                      name="applyingClass"
                      value={formData.applyingClass}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-line p-3 text-ink bg-bg focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="6">ষষ্ঠ শ্রেণি (Class VI)</option>
                      <option value="7">সপ্তম শ্রেণি (Class VII)</option>
                      <option value="8">অষ্টম শ্রেণি (Class VIII)</option>
                      <option value="9">নবম শ্রেণি (Class IX)</option>
                    </select>
                  </div>

                  {formData.applyingClass === '9' && (
                    <div>
                      <label htmlFor="group" className="block font-bold text-ink mb-1.5">
                        {lang === 'bn' ? 'গ্রুপ / বিভাগ (৯ম শ্রেণির জন্য)' : 'Group (For Class 9)'}
                      </label>
                      <select
                        id="group"
                        name="group"
                        value={formData.group}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-line p-3 text-ink bg-bg focus:ring-2 focus:ring-primary focus:outline-none"
                      >
                        <option value="Science">বিজ্ঞান (Science)</option>
                        <option value="Business Studies">ব্যবসায় শিক্ষা (Business Studies)</option>
                        <option value="Humanities">মানবিক (Humanities)</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label htmlFor="gender" className="block font-bold text-ink mb-1.5">
                      {lang === 'bn' ? 'লিঙ্গ *' : 'Gender *'}
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-line p-3 text-ink bg-bg focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="Male">ছাত্র (Male)</option>
                      <option value="Female">ছাত্রী (Female)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="dob" className="block font-bold text-ink mb-1.5">
                      {lang === 'bn' ? 'জন্ম তারিখ *' : 'Date of Birth *'}
                    </label>
                    <input
                      id="dob"
                      type="date"
                      required
                      name="dob"
                      min="2005-01-01"
                      max="2017-12-31"
                      value={formData.dob}
                      onChange={handleChange}
                      className={`w-full rounded-lg border p-3 text-ink bg-bg focus:ring-2 focus:ring-primary focus:outline-none ${
                        formErrors.dob ? 'border-danger-soft bg-danger-soft' : 'border-line'
                      }`}
                    />
                    {formErrors.dob && (
                      <p className="text-danger text-[11px] mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.dob}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="bloodGroup" className="block font-bold text-ink mb-1.5">
                      {lang === 'bn' ? 'রক্তের গ্রুপ (ঐচ্ছিক)' : 'Blood Group (Optional)'}
                    </label>
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-line p-3 text-ink bg-bg focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="">{lang === 'bn' ? '-- নির্বাচন করুন --' : '-- Select --'}</option>
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
                <h3 className="text-sm font-bold font-bangla text-deep border-b border-line pb-2.5 mb-5 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{lang === 'bn' ? '২. পিতা, মাতা ও অভিভাবকের তথ্য' : '2. Guardian Information'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bangla">
                  <div>
                    <label htmlFor="fatherName" className="block font-bold text-ink mb-1.5">
                      {lang === 'bn' ? 'পিতার নাম *' : "Father's Name *"}
                    </label>
                    <input
                      id="fatherName"
                      type="text"
                      required
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'পিতার নাম লিখুন' : "Enter father's name"}
                      className={`w-full rounded-lg border p-3 text-ink bg-bg focus:ring-2 focus:ring-primary focus:outline-none ${
                        formErrors.fatherName ? 'border-danger-soft bg-danger-soft' : 'border-line'
                      }`}
                    />
                    {formErrors.fatherName && (
                      <p className="text-danger text-[11px] mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.fatherName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="motherName" className="block font-bold text-ink mb-1.5">
                      {lang === 'bn' ? 'মাতার নাম *' : "Mother's Name *"}
                    </label>
                    <input
                      id="motherName"
                      type="text"
                      required
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'মাতার নাম লিখুন' : "Enter mother's name"}
                      className={`w-full rounded-lg border p-3 text-ink bg-bg focus:ring-2 focus:ring-primary focus:outline-none ${
                        formErrors.motherName ? 'border-danger-soft bg-danger-soft' : 'border-line'
                      }`}
                    />
                    {formErrors.motherName && (
                      <p className="text-danger text-[11px] mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.motherName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="guardianPhone" className="block font-bold text-ink mb-1.5">
                      {lang === 'bn' ? 'অভিভাবকের সক্রিয় মোবাইল নম্বর *' : 'Guardian Mobile Number *'}
                    </label>
                    <input
                      id="guardianPhone"
                      type="tel"
                      required
                      name="guardianPhone"
                      value={formData.guardianPhone}
                      onChange={handleChange}
                      placeholder="01819204561"
                      className={`w-full rounded-lg border p-3 text-ink bg-bg focus:ring-2 focus:ring-primary focus:outline-none font-mono ${
                        formErrors.guardianPhone ? 'border-danger-soft bg-danger-soft' : 'border-line'
                      }`}
                    />
                    {formErrors.guardianPhone && (
                      <p className="text-danger text-[11px] mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.guardianPhone}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="fatherNid" className="block font-bold text-ink mb-1.5">
                      {lang === 'bn' ? 'পিতার জাতীয় পরিচয়পত্র (NID) নম্বর' : 'Father NID Number (Optional)'}
                    </label>
                    <input
                      id="fatherNid"
                      type="text"
                      name="fatherNid"
                      value={formData.fatherNid}
                      onChange={handleChange}
                      placeholder="১০ বা ১৭ ডিজিটের এনআইডি"
                      className={`w-full rounded-lg border p-3 text-ink bg-bg focus:ring-2 focus:ring-primary focus:outline-none font-mono ${
                        formErrors.fatherNid ? 'border-danger-soft bg-danger-soft' : 'border-line'
                      }`}
                    />
                    {formErrors.fatherNid && (
                      <p className="text-danger text-[11px] mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.fatherNid}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3: Academic Background & Address */}
              <div>
                <h3 className="text-sm font-bold font-bangla text-deep border-b border-line pb-2.5 mb-5 flex items-center gap-2">
                  <School className="w-4 h-4 text-primary" />
                  <span>{lang === 'bn' ? '৩. পূর্ববর্তী শিক্ষা ও বর্তমান ঠিকানা' : '3. Previous Education & Address'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bangla">
                  <div>
                    <label htmlFor="previousSchool" className="block font-bold text-ink mb-1.5">
                      {lang === 'bn' ? 'পূর্ববর্তী বিদ্যালয়ের নাম *' : 'Previous School Name *'}
                    </label>
                    <input
                      id="previousSchool"
                      type="text"
                      required
                      name="previousSchool"
                      value={formData.previousSchool}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'যেমন: বন্দুয়া সরকারি প্রাথমিক বিদ্যালয়' : 'e.g. Primary School Name'}
                      className="w-full rounded-lg border border-line p-3 text-ink bg-bg focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="previousGpa" className="block font-bold text-ink mb-1.5">
                      {lang === 'bn' ? 'পূর্ববর্তী ক্লাসের ফলাফল (GPA/Marks)' : 'Previous Class GPA/Grade'}
                    </label>
                    <input
                      id="previousGpa"
                      type="text"
                      name="previousGpa"
                      value={formData.previousGpa}
                      onChange={handleChange}
                      placeholder="যেমন: 4.85"
                      className={`w-full rounded-lg border p-3 text-ink bg-bg focus:ring-2 focus:ring-primary focus:outline-none font-mono ${
                        formErrors.previousGpa ? 'border-danger-soft bg-danger-soft' : 'border-line'
                      }`}
                    />
                    {formErrors.previousGpa && (
                      <p className="text-danger text-[11px] mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.previousGpa}</span>
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block font-bold text-ink mb-1.5">
                      {lang === 'bn' ? 'বর্তমান স্থায়ী ঠিকানা *' : 'Complete Address *'}
                    </label>
                    <textarea
                      id="address"
                      required
                      rows="2"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'গ্রাম: বন্দুয়া দৌলতপুর, ডাকঘর: আনন্দপুর, উপজেলা: ফুলগাজী, জেলা: ফেনী' : 'Village, Union, Upazila, District'}
                      className={`w-full rounded-lg border p-3 text-ink bg-bg focus:ring-2 focus:ring-primary focus:outline-none ${
                        formErrors.address ? 'border-danger-soft bg-danger-soft' : 'border-line'
                      }`}
                    ></textarea>
                    {formErrors.address && (
                      <p className="text-danger text-[11px] mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.address}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-muted font-bangla">
                  * ফরম জমা দেওয়ার পর স্বয়ংক্রিয়ভাবে প্রবেশপত্র তৈরি হবে।
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto btn-accent py-3 px-8 text-sm transition shadow-sm flex items-center justify-center gap-2 font-bangla cursor-pointer font-bold rounded-lg"
                >
                  <Send className="w-4 h-4 text-ink" />
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
