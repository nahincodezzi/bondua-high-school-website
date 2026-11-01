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
  Building
} from 'lucide-react';

export default function ContactSection() {
  const { lang, schoolInfo } = useSchool();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    }, 400);
  };

  return (
    <section className="py-12 bg-white min-h-[700px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'যোগাযোগ ও অবস্থান' : 'Contact & Location'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-bangla text-slate-900">
            {lang === 'bn' ? 'বিদ্যালয় কার্যালয় ও যোগাযোগের মাধ্যম' : 'Get in Touch with School Office'}
          </h2>
          <p className="text-sm text-slate-600 font-bangla mt-1">
            {lang === 'bn' 
              ? 'ভর্তি, প্রশাসনিক তথ্য বা যেকোনো প্রয়োজনে সরাসরি যোগাযোগ করুন'
              : 'Feel free to visit during office hours or leave us an electronic message.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
              <h3 className="text-lg font-bold font-bangla text-emerald-950 flex items-center gap-2">
                <Building className="w-5 h-5 text-emerald-700" />
                <span>{lang === 'bn' ? 'প্রাতিষ্ঠানিক ঠিকানা' : 'Official Address'}</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm font-bangla text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{lang === 'bn' ? 'অবস্থান:' : 'Address:'}</span>
                    <p className="text-slate-600 mt-0.5">{schoolInfo.addressBn}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">EIIN: {schoolInfo.eiin} • MPO: {schoolInfo.mpoCode}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{lang === 'bn' ? 'হটলাইন / মোবাইল:' : 'Phone Numbers:'}</span>
                    <p className="text-slate-700 font-mono font-semibold mt-0.5">{schoolInfo.phone}</p>
                    <p className="text-slate-500 font-mono text-xs">{schoolInfo.phoneAlt} (অফিস সহকারী)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{lang === 'bn' ? 'ইমেইল ঠিকানা:' : 'Email Address:'}</span>
                    <p className="text-slate-700 font-mono text-xs mt-0.5">{schoolInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{lang === 'bn' ? 'অফিস সময়সূচি:' : 'Office Hours:'}</span>
                    <p className="text-slate-600 mt-0.5">রবিবার হতে বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৪:০০</p>
                    <p className="text-rose-600 text-[11px] font-semibold">শুক্রবার ও শনিবার: সাপ্তাহিক ছুটি</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Facebook Group Community Callout */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-2xl shadow-sm border border-blue-800">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold mb-2">
                <Share2 className="w-4 h-4" />
                <span>অফিসিয়াল ফেসবুক গ্রুপ</span>
              </div>
              <h4 className="text-base font-bold font-bangla mb-1">
                বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় পরিবার
              </h4>
              <p className="text-xs text-blue-200 font-bangla mb-4">
                আমাদের গ্রুপে যুক্ত হয়ে নিয়মিত বিদ্যালয়ের কার্যক্রমের ভিডিও ও ছবি দেখুন।
              </p>
              <a
                href={schoolInfo.facebookGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow"
              >
                <span>গ্রুপে যুক্ত হোন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Inquiry / Message Form Column */}
          <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
            <h3 className="text-lg font-bold font-bangla text-slate-900 mb-2">
              {lang === 'bn' ? 'আমাদের বার্তা বা প্রশ্ন পাঠান' : 'Send an Inquiry / Feedback'}
            </h3>
            <p className="text-xs text-slate-500 font-bangla mb-6">
              আপনার মতামত, প্রশ্ন বা অনুসন্ধানের বিস্তারিত লিখে পাঠান। দ্রুত উত্তর দেওয়া হবে।
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bangla">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'bn' ? 'আপনার নাম *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={lang === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your name'}
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'bn' ? 'ইমেইল (যদি থাকে)' : 'Email (Optional)'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'bn' ? 'বার্তার বিষয় *' : 'Subject *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={lang === 'bn' ? 'যেমন: ভর্তি সংক্রান্ত তথ্য' : 'e.g. Admission Query'}
                    className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'বিস্তারিত বার্তা *' : 'Your Message *'}
                </label>
                <textarea
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={lang === 'bn' ? 'এখানে আপনার বার্তা লিখুন...' : 'Write your inquiry here...'}
                  className="w-full rounded-lg border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 bg-white"
                ></textarea>
              </div>

              {submitted && (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'bn' ? 'আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! বিদ্যালয় অফিস থেকে শীঘ্রই যোগাযোগ করা হবে।' : 'Thank you! Your message has been sent successfully.'}</span>
                </div>
              )}

              <button
                type="submit"
                className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-xs transition shadow flex items-center gap-2 font-bangla"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>{lang === 'bn' ? 'বার্তা প্রেরণ করুন' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Map Representation Card */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block font-bangla">
              মানচিত্রে আমাদের অবস্থান (Map Location)
            </span>
            <h4 className="text-lg font-bold font-bangla text-slate-900">
              বন্দুয়া দৌলতপুর, আনন্দপুর ইউনিয়ন, ফুলগাজী, ফেনী
            </h4>
            <p className="text-xs text-slate-600 font-bangla leading-relaxed">
              ফেনী জেলা শহর হতে পরশুরাম/ফুলগাজী আঞ্চলিক সড়ক দিয়ে আনন্দপুর বাজার হয়ে বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়ে খুব সহজেই যাতায়াত করা যায়।
            </p>
          </div>

          <a
            href="https://maps.google.com/?q=Bandua+Daulatpur+High+School+Fulgazi+Feni"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 transition shadow-md shrink-0 font-bangla"
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>গুগল ম্যাপে দিকনির্দেশনা দেখুন (Google Maps)</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
          </a>
        </div>
      </div>
    </section>
  );
}
