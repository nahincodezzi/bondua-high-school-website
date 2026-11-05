import React, { useState } from 'react';
import { useSchool } from '../context/useSchool';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  Share2, 
  ExternalLink, 
  CheckCircle,
  Building,
  AlertCircle
} from 'lucide-react';

export default function ContactSection() {
  const { lang, schoolInfo, submitContactMessage } = useSchool();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [phoneError, setPhoneError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPhoneError('');

    const cleanName = formData.name.trim();
    if (!cleanName) return;

    // Mobile Phone Validation (BD Mobile ^01[3-9]\d{8}$) (TC19 / C4)
    const phoneClean = formData.phone.trim().replace(/[-\s]/g, '');
    if (!/^01[3-9]\d{8}$/.test(phoneClean)) {
      setPhoneError(lang === 'bn' 
        ? 'অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 01819204561)।' 
        : 'Please enter a valid 11-digit Bangladeshi mobile number.');
      return;
    }

    // Persist to localStorage / context database (C4)
    if (submitContactMessage) {
      submitContactMessage({
        ...formData,
        name: cleanName,
        phone: phoneClean
      });
    }

    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 400);
  };

  return (
    <section className="py-12 sm:py-16 text-slate-800 relative z-10 font-sans min-h-[700px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-[#DCFCE7] text-[#14532D] text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-xs border border-emerald-300">
            <MapPin className="w-3.5 h-3.5 text-[#166534]" />
            <span>{lang === 'bn' ? 'যোগাযোগ ও অবস্থান' : 'Contact & Location'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-bangla text-slate-900 leading-tight">
            {lang === 'bn' ? 'বিদ্যালয় কার্যালয় ও যোগাযোগের মাধ্যম' : 'Get in Touch with School Office'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-bangla mt-2">
            {lang === 'bn' 
              ? 'ভর্তি, প্রশাসনিক তথ্য বা যেকোনো প্রয়োজনে সরাসরি যোগাযোগ করুন'
              : 'Feel free to visit during office hours or leave us an electronic message.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card-base p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] space-y-5 shadow-xs bg-white">
              <h3 className="text-lg font-bold font-bangla text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-[#166534]" />
                <span>{lang === 'bn' ? 'প্রাতিষ্ঠানিক ঠিকানা' : 'Official Address'}</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm font-bangla text-slate-700">
                <div className="flex items-start gap-3 bg-[#F7F9F8] p-3.5 rounded-xl border border-[#E5E7EB]">
                  <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#14532D] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#166534]" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{lang === 'bn' ? 'অবস্থান:' : 'Address:'}</span>
                    <p className="text-slate-600 mt-0.5">{lang === 'bn' ? schoolInfo.addressBn : (schoolInfo.addressEn || 'Along Feni-Parshuram Road, Bandua Daulatpur, Anandapur Union, Fulgazi, Feni, Bangladesh')}</p>
                    <p className="text-[11px] text-[#166534] font-mono mt-0.5 font-bold">EIIN: {schoolInfo.eiin} • MPO: {schoolInfo.mpoCode}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#F7F9F8] p-3.5 rounded-xl border border-[#E5E7EB]">
                  <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#14532D] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-[#166534]" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{lang === 'bn' ? 'হটলাইন / মোবাইল:' : 'Phone Numbers:'}</span>
                    <p className="text-slate-900 font-mono font-bold mt-0.5">{schoolInfo.phone}</p>
                    <p className="text-slate-500 font-mono text-xs">{schoolInfo.phoneAlt} ({lang === 'bn' ? 'অফিস সহকারী' : 'Office Assistant'})</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#F7F9F8] p-3.5 rounded-xl border border-[#E5E7EB]">
                  <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#14532D] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-[#166534]" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{lang === 'bn' ? 'ইমেইল ঠিকানা:' : 'Email Address:'}</span>
                    <p className="text-slate-700 font-mono text-xs mt-0.5">{schoolInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-[#F7F9F8] p-3.5 rounded-xl border border-[#E5E7EB]">
                  <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#14532D] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-[#166534]" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{lang === 'bn' ? 'অফিস সময়সূচি:' : 'Office Hours:'}</span>
                    <p className="text-slate-600 mt-0.5">{lang === 'bn' ? 'রবিবার হতে বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৪:০০' : 'Sunday to Thursday: 9:00 AM - 4:00 PM'}</p>
                    <p className="text-[#DC2626] text-[11px] font-semibold">{lang === 'bn' ? 'শুক্রবার ও শনিবার: সাপ্তাহিক ছুটি' : 'Friday & Saturday: Weekly Holiday'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Facebook Group Community Callout (Flat Forest Green Theme) */}
            <div className="bg-[#14532D] text-white p-6 sm:p-7 rounded-2xl shadow-sm border border-[#166534]">
              <div className="inline-flex items-center gap-2 text-[#F59E0B] text-xs font-bold mb-2 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                <Share2 className="w-4 h-4 text-[#F59E0B]" />
                <span>{lang === 'bn' ? 'অফিসিয়াল ফেসবুক গ্রুপ' : 'Official Facebook Group'}</span>
              </div>
              <h4 className="text-base font-bold font-bangla mb-1 text-white">
                {lang === 'bn' ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় পরিবার' : 'Bandua Daulatpur High School Family'}
              </h4>
              <p className="text-xs text-emerald-100 font-bangla mb-4">
                {lang === 'bn' ? 'আমাদের গ্রুপে যুক্ত হয়ে নিয়মিত বিদ্যালয়ের কার্যক্রমের ভিডিও ও ছবি দেখুন।' : 'Join our group to connect and view latest school events.'}
              </p>
              <a
                href={schoolInfo.facebookGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold shadow-xs cursor-pointer"
              >
                <span>{lang === 'bn' ? 'গ্রুপে যুক্ত হোন' : 'Join FB Group'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#1F2937]" />
              </a>
            </div>
          </div>

          {/* Inquiry / Message Form Column */}
          <div className="lg:col-span-7 card-base p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-xs bg-white">
            <h3 className="text-lg font-bold font-bangla text-slate-900 mb-2">
              {lang === 'bn' ? 'আমাদের বার্তা বা প্রশ্ন পাঠান' : 'Send an Inquiry / Feedback'}
            </h3>
            <p className="text-xs text-slate-500 font-bangla mb-6">
              {lang === 'bn' 
                ? 'আপনার মতামত, প্রশ্ন বা অনুসন্ধানের বিস্তারিত লিখে পাঠান। দ্রুত উত্তর দেওয়া হবে।' 
                : 'Send your query or message. Our office will respond promptly.'}
            </p>

            {submitted && (
              <div className="mb-6 p-4 bg-[#DCFCE7] text-[#14532D] rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-300">
                <CheckCircle className="w-5 h-5 text-[#166534] shrink-0" />
                <span>{lang === 'bn' ? 'আপনার বার্তা সফলভাবে বিদ্যালয় কার্যালয়ে পাঠানো হয়েছে! ধন্যবাদ।' : 'Your inquiry has been successfully sent to the school office. Thank you!'}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bangla">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block font-bold text-slate-700 mb-1.5">
                    {lang === 'bn' ? 'আপনার নাম *' : 'Full Name *'}
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={lang === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your name'}
                    className="w-full rounded-lg border border-[#D1D5DB] p-3 text-slate-900 bg-[#F7F9F8] focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block font-bold text-slate-700 mb-1.5">
                    {lang === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      setPhoneError('');
                    }}
                    placeholder="01819204561"
                    className={`w-full rounded-lg border p-3 text-slate-900 bg-[#F7F9F8] focus:ring-2 focus:ring-[#166534] focus:outline-none font-mono ${
                      phoneError ? 'border-red-400 bg-red-50/30' : 'border-[#D1D5DB]'
                    }`}
                  />
                  {phoneError && (
                    <p className="text-[#DC2626] text-[11px] mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{phoneError}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-email" className="block font-bold text-slate-700 mb-1.5">
                    {lang === 'bn' ? 'ইমেইল (যদি থাকে)' : 'Email (Optional)'}
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full rounded-lg border border-[#D1D5DB] p-3 text-slate-900 bg-[#F7F9F8] focus:ring-2 focus:ring-[#166534] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block font-bold text-slate-700 mb-1.5">
                    {lang === 'bn' ? 'বার্তার বিষয় *' : 'Subject *'}
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={lang === 'bn' ? 'যেমন: ভর্তি সংক্রান্ত তথ্য' : 'e.g. Admission Query'}
                    className="w-full rounded-lg border border-[#D1D5DB] p-3 text-slate-900 bg-[#F7F9F8] focus:ring-2 focus:ring-[#166534] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block font-bold text-slate-700 mb-1.5">
                  {lang === 'bn' ? 'বিস্তারিত বার্তা লিখুন *' : 'Message Details *'}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={lang === 'bn' ? 'আপনার বক্তব্য বিস্তারিতভাবে লিখুন...' : 'Write your detailed message here...'}
                  className="w-full rounded-lg border border-[#D1D5DB] p-3 text-slate-900 bg-[#F7F9F8] focus:ring-2 focus:ring-[#166534] focus:outline-none leading-relaxed"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto btn-primary py-3 px-8 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs rounded-lg"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>{lang === 'bn' ? 'বার্তা পাঠান' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
