import React from 'react';
import { useSchool } from '../context/useSchool';
import { createEducatorAvatar } from '../utils/avatarGenerator';
import FacultyDirectory from './FacultyDirectory';
import { 
  Target, 
  Eye, 
  History, 
  CheckCircle2, 
  Compass,
  UserCheck,
  Phone,
  Users
} from 'lucide-react';

export default function AboutSection() {
  const { lang, schoolInfo, setActiveTab, committee = [] } = useSchool();

  const activeCommittee = Array.isArray(committee)
    ? committee.filter(m => m.status !== 'inactive').sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
    : [];

  const presidentInitials = (schoolInfo.chairmanNameEn || 'MR')
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'MR';

  const presidentAvatar = schoolInfo.chairmanImage || createEducatorAvatar({
    initials: presidentInitials,
    role: 'chairman',
    designation: 'President',
    gender: 'male'
  });

  return (
    <>
    <section className="py-12 sm:py-16 text-ink relative z-10 font-sans min-h-[700px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-soft text-deep text-xs font-bold px-4 py-1.5 rounded-full mb-3 shadow-xs border border-soft-border">
            <History className="w-3.5 h-3.5 text-primary" />
            <span>{lang === 'bn' ? 'আমাদের ইতিহাস ও ঐতিহ্য' : 'Heritage & History'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-bangla text-ink leading-tight">
            {lang === 'bn' ? 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় পরিচিতি' : 'About Bondua Daulatpur High School'}
          </h2>
          <p className="text-xs sm:text-sm text-muted font-bangla mt-2">
            {lang === 'bn' 
              ? '১৯৯০ সাল থেকে ফেনী জেলার ফুলগাজীতে গুণগত শিক্ষার আলোকবর্তিকা'
              : 'Serving with dedication in Anandapur, Fulgazi, Feni since January 8, 1990.'}
          </p>
        </div>

        {/* Story & Background Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 lg:p-12 border border-line shadow-md mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-4 text-ink font-bangla leading-relaxed text-sm sm:text-base">
              <h3 className="text-xl sm:text-3xl font-extrabold text-ink flex items-center gap-2">
                <span className="text-accent">❖</span>
                <span>{lang === 'bn' ? 'একটি আদর্শ শিক্ষাপ্রতিষ্ঠানের সৃষ্টি ও অভিযাত্রা' : 'Origins and Noble Journey'}</span>
              </h3>

              <p>
                {lang === 'bn' 
                  ? 'ফেনী জেলার ফুলগাজী উপজেলার ঐতিহ্যবাহী আনন্দপুর ইউনিয়নের বন্দুয়া দৌলতপুর গ্রামে ১৯৯০ সালের ৮ জানুয়ারি বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় প্রতিষ্ঠিত হয়। এলাকার শিক্ষানুরাগী, সমাজসেবক ও গুণীজনদের নিরলস প্রচেষ্টায় অবহেলিত গ্রামীণ জনপদে শিক্ষার আলো প্রজ্বলন করাই ছিল এই প্রতিষ্ঠানের মূল লক্ষ্য।'
                  : 'Bondua Daulatpur High School was established on January 8, 1990, in the scenic village of Bondua Daulatpur under Anandapur Union, Fulgazi Upazila, Feni District.'}
              </p>

              <p>
                {lang === 'bn'
                  ? `কুমিল্লা শিক্ষাবোর্ডের আওতাধীন এবং শিক্ষা মন্ত্রণালয় কর্তৃক ১৯৯৪ সালে পূর্ণাঙ্গ স্বীকৃতি লাভ করে প্রতিষ্ঠানটি (EIIN: ${schoolInfo.eiin || '১০৬৬৪৪'}, MPO: ${schoolInfo.mpoCode || '০৯০৫১৭১৩০১'})। প্রতিষ্ঠার পর থেকে অদ্যাবধি এসএসসি পরীক্ষায় শতভাগ সাফল্য ও উপজেলার শীর্ষস্থানীয় ফলাফলের সুনাম অক্ষুণ্ন রেখেছে বিদ্যালয়টি।`
                  : `Formally recognized under the Comilla Education Board in 1994 (EIIN: ${schoolInfo.eiin || '106644'}, MPO Code: ${schoolInfo.mpoCode || '0905171301'}), the school consistently secures outstanding success in secondary school certificate examinations.`}
              </p>

              <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                <div className="flex items-center gap-2.5 bg-bg p-3 rounded-xl border border-line text-ink">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>{lang === 'bn' ? 'প্রতিষ্ঠাকাল: ৮ জানুয়ারি, ১৯৯০' : 'Founded: January 8, 1990'}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-bg p-3 rounded-xl border border-line text-ink">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>{lang === 'bn' ? `EIIN কোড: ${schoolInfo.eiin || '১০৬৬৪৪'}` : `EIIN Code: ${schoolInfo.eiin || '106644'}`}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-bg p-3 rounded-xl border border-line text-ink">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>{lang === 'bn' ? `এমপিও কোড: ${schoolInfo.mpoCode || '০৯০৫১৭১৩০১'}` : `MPO Code: ${schoolInfo.mpoCode || '0905171301'}`}</span>
                </div>
                <div className="flex items-center gap-2.5 bg-bg p-3 rounded-xl border border-line text-ink">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>{lang === 'bn' ? 'শিক্ষা বোর্ড: কুমিল্লা শিক্ষাবোর্ড' : 'Education Board: Comilla Board'}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-bg group">
                <img
                  src={schoolInfo.campusImage || "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80"}
                  alt="School Campus"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="btn-gold text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase inline-block mb-1 shadow-sm">Campus View</span>
                    <h4 className="text-lg font-bold font-bangla text-white drop-shadow-sm">
                      {lang === 'bn' ? 'মনোরম সবুজ ক্যাম্পাস ও সুবিশাল খেলার মাঠ' : 'Lush Green Campus & Spacious Playground'}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card glass-card-hover p-6 sm:p-8 rounded-3xl border border-line space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-deep text-accent flex items-center justify-center font-bold shadow-sm">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-bangla text-ink">
              {lang === 'bn' ? 'আমাদের লক্ষ্য (Mission)' : 'Our Mission'}
            </h3>
            <p className="text-xs sm:text-sm text-muted font-bangla leading-relaxed">
              {lang === 'bn'
                ? (schoolInfo.missionBn || 'মানসম্মত শিক্ষা, নৈতিক মূল্যবোধ ও ডিজিটাল প্রযুক্তির সমন্বয়ে প্রতিটি শিক্ষার্থীকে আধুনিক বিজ্ঞানমনস্ক, দেশপ্রেমিক ও দক্ষ মানবসম্পদ হিসেবে গড়ে তোলা।')
                : (schoolInfo.missionEn || 'To deliver quality secondary education emphasizing moral character, scientific literacy, and 21st-century technological proficiency.')}
            </p>
          </div>

          <div className="glass-card glass-card-hover p-6 sm:p-8 rounded-3xl border border-line space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold shadow-sm">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-bangla text-ink">
              {lang === 'bn' ? 'আমাদের রূপকল্প (Vision)' : 'Our Vision'}
            </h3>
            <p className="text-xs sm:text-sm text-muted font-bangla leading-relaxed">
              {lang === 'bn'
                ? (schoolInfo.visionBn || 'একটি বৈষম্যহীন, আধুনিক প্রযুক্তি-নির্ভর ও আদর্শ বিদ্যাপীঠ হিসেবে কুমিল্লা শিক্ষা বোর্ডের অন্যতম শ্রেষ্ঠ ও মডেল বিদ্যালয়ে রূপান্তরিত হওয়া।')
                : (schoolInfo.visionEn || 'To emerge as one of the premier model institutions under the Comilla Education Board, fostering discrimination-free, technology-driven, and holistic moral education.')}
            </p>
          </div>

          <div className="glass-card glass-card-hover p-6 sm:p-8 rounded-3xl border border-accent space-y-4 shadow-sm bg-gradient-to-br from-soft/40 via-white to-white">
            <div className="w-12 h-12 rounded-2xl bg-accent text-ink flex items-center justify-center font-bold shadow-sm">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-bangla text-ink">
              {lang === 'bn' ? 'মূল আদর্শ (Core Values)' : 'Core Values'}
            </h3>
            <p className="text-xs sm:text-sm text-muted font-bangla leading-relaxed">
              {lang === 'bn'
                ? (schoolInfo.coreValuesBn || 'শৃঙ্খলা, সততা, সহমর্মিতা, বিজ্ঞানচেতনা এবং মাতৃভূমির সার্বিক উন্নয়নে অবদান রাখার চিরন্তন ব্রত।')
                : (schoolInfo.coreValuesEn || 'Discipline, integrity, empathy, inquiry-based learning, and selfless service to the nation.')}
            </p>
          </div>
        </div>

        {/* President (সভাপতি) Message Card — ALWAYS RENDERED (§7.1) */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-line shadow-sm bg-white">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* President Photo & Identity */}
            <div className="md:col-span-4 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-line pb-6 md:pb-0 md:pr-6 space-y-3">
              <div className="w-32 h-36 sm:w-36 sm:h-44 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-md bg-bg relative">
                <img
                  src={presidentAvatar}
                  alt={schoolInfo.chairmanNameEn || schoolInfo.chairmanNameBn || 'President'}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block font-mono bg-soft text-deep px-3 py-0.5 rounded-full mb-1">
                  {lang === 'bn' ? (schoolInfo.chairmanDesignationBn || 'সভাপতি, পরিচালনা পর্ষদ') : (schoolInfo.chairmanDesignationEn || 'President, Managing Committee')}
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-bangla text-ink">
                  {lang === 'bn' ? schoolInfo.chairmanNameBn : (schoolInfo.chairmanNameEn || schoolInfo.chairmanNameBn)}
                </h3>
                {schoolInfo.chairmanPhone && (
                  <a
                    href={`tel:${schoolInfo.chairmanPhone}`}
                    className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-primary font-mono mt-1"
                  >
                    <Phone className="w-3 h-3 text-primary" />
                    <span>{schoolInfo.chairmanPhone}</span>
                  </a>
                )}
              </div>
            </div>

            {/* President Message & Quick CTAs */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <span className="text-xs font-bold text-accent-ink uppercase tracking-wider block mb-1 font-mono">
                  {lang === 'bn' ? '— সভাপতির বাণী' : "— President's Message"}
                </span>
                <p className="text-xs sm:text-sm text-ink/90 font-bangla leading-relaxed whitespace-pre-line">
                  {lang === 'bn' ? schoolInfo.chairmanMessageBn : (schoolInfo.chairmanMessageEn || schoolInfo.chairmanMessageBn)}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setActiveTab('teachers');
                    document.getElementById('teachers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="flex-1 btn-gold py-2.5 px-4 rounded-xl text-xs font-bangla transition text-center cursor-pointer shadow-sm font-bold min-h-[44px] flex items-center justify-center gap-1.5"
                >
                  <Users className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'শিক্ষক ও কর্মচারীদের তালিকা দেখুন' : 'View Faculty & Staff List'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="flex-1 bg-white hover:bg-bg text-ink border border-line py-2.5 px-4 rounded-xl text-xs font-bangla transition text-center cursor-pointer shadow-xs font-semibold min-h-[44px] flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4 text-primary" />
                  <span>{lang === 'bn' ? 'যোগাযোগের তথ্য ও ঠিকানা' : 'Contact Information & Location'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Committee Members Grid — Rendered ONLY if committee has >= 1 active member (§7.2) */}
        {activeCommittee.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-widest font-mono bg-soft text-deep px-3 py-1 rounded-full border border-soft-border inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>{lang === 'bn' ? 'পরিচালনা পর্ষদ' : 'Managing Committee'}</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-bangla text-ink">
                {lang === 'bn' ? 'বিদ্যালয় পরিচালনা কমিটির সদস্যবৃন্দ' : 'Respected Members of Managing Committee'}
              </h3>
              <p className="text-xs sm:text-sm text-muted font-bangla">
                {lang === 'bn'
                  ? 'বিদ্যালয়ের সার্বিক উন্নয়ন, সুশাসন ও মানসম্মত শিক্ষা নিশ্চিতকরণে নিবেদিত পরিচালনা পরিষদ।'
                  : 'Distinguished members dedicated to governance, academic excellence, and continuous development.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
              {activeCommittee.map(member => {
                const memberInitials = (member.nameEn || 'CM')
                  .split(' ')
                  .filter(Boolean)
                  .map(p => p[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase() || 'CM';

                const memberAvatar = member.image || createEducatorAvatar({
                  initials: memberInitials,
                  role: 'committee',
                  designation: member.designationEn || 'Member',
                  gender: 'male'
                });

                return (
                  <div
                    key={member.id}
                    className="glass-card glass-card-hover p-5 rounded-2xl border border-line bg-white shadow-xs flex flex-col items-center text-center space-y-3 transition-transform hover:-translate-y-1"
                  >
                    <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden border border-line shadow-xs bg-bg shrink-0">
                      <img
                        src={memberAvatar}
                        alt={member.nameEn || member.nameBn}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-1 w-full">
                      {(member.categoryBn || member.categoryEn) && (
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider font-mono bg-soft text-deep px-2 py-0.5 rounded-full inline-block">
                          {lang === 'bn' ? member.categoryBn : (member.categoryEn || member.categoryBn)}
                        </span>
                      )}
                      <h4 className="text-base font-bold font-bangla text-ink">
                        {lang === 'bn' ? member.nameBn : (member.nameEn || member.nameBn)}
                      </h4>
                      <p className="text-xs font-semibold text-muted font-bangla">
                        {lang === 'bn' ? member.designationBn : (member.designationEn || member.designationBn)}
                      </p>
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-primary font-mono mt-1 pt-1 border-t border-line/60 w-full justify-center"
                        >
                          <Phone className="w-3 h-3 text-primary" />
                          <span>{member.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>

    {/* Teachers & Staff Council Section under About (#about -> #teachers) */}
    <FacultyDirectory sectionId="teachers" />
    </>
  );
}
