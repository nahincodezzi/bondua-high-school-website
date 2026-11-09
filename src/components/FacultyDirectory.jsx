import React, { useState } from 'react';
import { useSchool } from '../context/useSchool';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  GraduationCap, 
  BookOpen,
  Award,
  Briefcase,
  X,
  ShieldCheck,
  Star
} from 'lucide-react';

function isStaffRecord(member) {
  return member?.type === 'staff' || member?.category === 'staff';
}

function getRealPhoto(member) {
  const raw = member?.photo !== undefined ? member.photo : member?.image;
  if (!raw || typeof raw !== 'string') return '';
  if (raw.startsWith('data:image/svg+xml') || raw.includes('images.unsplash.com')) return '';
  return raw;
}

function MemberCard({ member, index, lang }) {
  const [imgError, setImgError] = useState(false);

  const isStaff = isStaffRecord(member);
  const isHead =
    !isStaff &&
    ((member.designationEn?.includes('Headmaster') && !member.designationEn?.includes('Assistant')) ||
      (member.designationBn?.includes('প্রধান শিক্ষক') && !member.designationBn?.includes('সহ')));
  const isAsstHead =
    !isStaff &&
    (member.designationEn?.includes('Assistant Headmaster') ||
      member.designationBn?.includes('সহ প্রধান শিক্ষক'));

  const photoSrc = getRealPhoto(member);
  const showPhoto = Boolean(photoSrc) && !imgError;

  const displayName = lang === 'bn' ? member.nameBn : (member.nameEn || member.nameBn);
  const displayDesignation = lang === 'bn'
    ? member.designationBn
    : (member.designationEn || member.designationBn);
  const rawSubject = lang === 'bn'
    ? (member.subjectBn || '')
    : (member.subjectEn || member.subjectBn || '');
  const subjectText = rawSubject.trim();
  const qualificationText = (member.qualification || member.education || '').trim();
  const cleanPhoneHref = (member.phone || '').replace(/[^\d+]/g, '');

  return (
    <article
      className={`bg-surface rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group shadow-xs hover:-translate-y-1 hover:shadow-xl ${
        isHead
          ? 'border-accent ring-2 ring-accent/30'
          : isAsstHead
            ? 'border-soft-border'
            : 'border-line hover:border-primary/40'
      }`}
    >
      <div>
        {/* Top Half: Deep-to-Primary Theme Gradient + Centered Photo/Placeholder inside Gold Ring */}
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-deep via-deep to-primary flex flex-col items-center justify-center pb-5">
          {/* Ambient radial glow using accent token */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              background: 'radial-gradient(circle at 50% 42%, var(--c-accent), transparent 68%)'
            }}
          />

          {/* Faint Concentric Academic Guilloche Circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[52%] w-52 h-52 rounded-full border border-dashed border-accent/20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[52%] w-40 h-40 rounded-full border border-accent/25 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[52%] w-32 h-32 rounded-full border border-surface/15 pointer-events-none" />

          {/* Small Dark Serial Number Badge Top-Left */}
          <span className="absolute top-3 left-3 z-20 bg-deep/90 text-surface border border-surface/15 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono backdrop-blur-xs shadow-xs">
            #{index + 1}
          </span>

          {/* Small Star Accent Above Center Frame */}
          <div className="relative z-10 mb-1.5 flex items-center justify-center opacity-80">
            <div className="w-5 h-5 rounded-full border border-accent/40 bg-deep/40 flex items-center justify-center">
              <Star className="w-2.5 h-2.5 text-accent fill-accent" />
            </div>
          </div>

          {/* Center Photo or Gold-Ringed Graduation Cap Placeholder */}
          {showPhoto ? (
            <div className="relative z-10 w-24 h-24 rounded-full p-[3px] bg-accent ring-4 ring-accent/25 shadow-lg overflow-hidden">
              <img
                src={photoSrc}
                alt={displayName}
                onError={() => setImgError(true)}
                className="w-full h-full rounded-full object-cover object-top bg-deep group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ) : (
            <div className="relative z-10 w-24 h-24 rounded-full border-[3px] border-accent ring-4 ring-accent/20 bg-deep/85 shadow-inner flex items-center justify-center">
              <div className="absolute inset-1.5 rounded-full border border-dashed border-accent/55 pointer-events-none" />
              <GraduationCap className="w-9 h-9 text-accent drop-shadow-xs" />
            </div>
          )}

          {/* Bottom-Left Designation Pill */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-start">
            <span
              className={`text-[11px] font-bold px-3 py-1 rounded-full font-bangla shadow-md inline-flex items-center gap-1.5 max-w-full truncate ${
                isHead
                  ? 'bg-accent text-accent-ink'
                  : isAsstHead
                    ? 'bg-primary text-surface border border-accent/40'
                    : isStaff
                      ? 'bg-deep/90 text-surface border border-surface/20 font-medium'
                      : 'bg-deep/90 text-surface border border-surface/15'
              }`}
            >
              {isHead && <ShieldCheck className="w-3 h-3 text-accent-ink shrink-0" />}
              {isAsstHead && <Award className="w-3 h-3 text-accent shrink-0" />}
              <span className="truncate">{displayDesignation}</span>
            </span>
          </div>
        </div>

        {/* Bottom White Body: Name + Subject Chip (Hidden if empty) */}
        <div className="p-5 space-y-2.5 font-bangla bg-surface">
          <h3 className="text-base font-bold font-bangla text-ink group-hover:text-primary transition line-clamp-1">
            {displayName}
          </h3>

          {subjectText && (
            <div className="flex items-start gap-2 bg-soft/70 p-2.5 rounded-xl border border-soft-border text-xs text-deep font-semibold">
              <BookOpen className="w-3.5 h-3.5 shrink-0 text-primary mt-0.5" />
              <span className="line-clamp-2 leading-snug">{subjectText}</span>
            </div>
          )}

          {qualificationText && (
            <div className="flex items-start gap-2 text-[11px] text-muted bg-bg px-2.5 py-1.5 rounded-lg border border-line">
              <GraduationCap className="w-3.5 h-3.5 shrink-0 text-primary mt-0.5" />
              <span className="font-medium line-clamp-2 leading-snug">{qualificationText}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Row: Phone tel: link + Optional Mail mailto: icon */}
      {(member.phone || member.email) && (
        <div className="px-5 py-3 bg-bg border-t border-line flex items-center justify-between text-xs text-muted font-mono min-h-[44px]">
          {member.phone ? (
            <a
              href={`tel:${cleanPhoneHref || member.phone}`}
              className="flex items-center gap-1.5 hover:text-primary transition font-semibold"
              title={member.phone}
            >
              <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-[11px]">{member.phone}</span>
            </a>
          ) : (
            <span />
          )}

          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="p-1.5 text-muted hover:text-primary hover:bg-soft rounded-full transition"
              title={member.email}
              aria-label={`Email ${displayName}`}
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}
    </article>
  );
}

export default function FacultyDirectory({ sectionId = 'teachers' }) {
  const { lang, teachers = [], schoolInfo = {} } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'teacher' | 'staff'

  const visibleMembers = [...teachers]
    .filter((t) => t && t.visible !== false)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  const facultyCount = visibleMembers.filter((t) => !isStaffRecord(t)).length;
  const staffCount = visibleMembers.filter((t) => isStaffRecord(t)).length;

  const filteredTeachers = visibleMembers.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.nameBn?.toLowerCase().includes(q) ||
      t.nameEn?.toLowerCase().includes(q) ||
      t.designationBn?.toLowerCase().includes(q) ||
      t.designationEn?.toLowerCase().includes(q) ||
      t.subjectBn?.toLowerCase().includes(q) ||
      t.subjectEn?.toLowerCase().includes(q) ||
      t.qualification?.toLowerCase().includes(q);

    const isStaff = isStaffRecord(t);
    const matchesCategory =
      activeCategory === 'all' ||
      (activeCategory === 'teacher' && !isStaff) ||
      (activeCategory === 'staff' && isStaff);

    return matchesSearch && matchesCategory;
  });

  const schoolNameBn = schoolInfo?.nameBn || 'আমাদের বিদ্যালয়';
  const schoolPossessiveBn =
    schoolNameBn.endsWith('বিদ্যালয়') || schoolNameBn.endsWith('বিদ্যালয়')
      ? `${schoolNameBn}ের`
      : `${schoolNameBn}-এর`;
  const schoolNameEn = schoolInfo?.nameEn || 'our school';

  return (
    <section
      id={sectionId}
      className="py-12 sm:py-16 text-ink relative z-10 font-sans min-h-[700px] scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-soft text-deep text-xs font-bold px-4 py-1.5 rounded-full mb-3 font-bangla border border-soft-border shadow-xs">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>
              {lang === 'bn' ? 'শিক্ষক ও কর্মচারী পরিষদ' : 'Teachers & Staff Council'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold font-bangla text-ink leading-tight">
            {lang === 'bn'
              ? 'আমাদের দক্ষ ও নিবেদিতপ্রাণ শিক্ষক ও কর্মকর্তা-কর্মচারী'
              : 'Our Skilled and Dedicated Teachers & Staff'}
          </h2>

          <p className="text-xs sm:text-sm text-muted font-bangla mt-2 max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? `অভিজ্ঞ, উচ্চশিক্ষিত ও স্নেহশীল শিক্ষকদের নিবিড় তত্ত্বাবধানে ${schoolPossessiveBn} পাঠদান ও প্রশাসনিক কার্যক্রম পরিচালিত হয়।`
              : `Experienced, highly educated, and caring teachers oversee academic instruction and administrative operations at ${schoolNameEn}.`}
          </p>
        </div>

        {/* White Rounded Filter & Search Toolbar Card */}
        <div className="bg-surface p-3 sm:p-4 rounded-3xl border border-line mb-8 flex flex-col md:flex-row items-center justify-between gap-4 font-bangla shadow-sm">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap sm:flex-nowrap bg-bg p-1 rounded-full border border-line text-xs font-bold w-full md:w-auto gap-1 sm:gap-0">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-full transition cursor-pointer whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-accent text-accent-ink shadow-md'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {lang === 'bn'
                ? `সকল সদস্য (${visibleMembers.length})`
                : `All Members (${visibleMembers.length})`}
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('teacher')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-full transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeCategory === 'teacher'
                  ? 'bg-accent text-accent-ink shadow-md'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>
                {lang === 'bn'
                  ? `শিক্ষক পরিষদ (${facultyCount})`
                  : `Teachers Council (${facultyCount})`}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('staff')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-full transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeCategory === 'staff'
                  ? 'bg-accent text-accent-ink shadow-md'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              <span>
                {lang === 'bn'
                  ? `কর্মচারীবৃন্দ (${staffCount})`
                  : `Staff (${staffCount})`}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                lang === 'bn'
                  ? 'নাম, পদবী বা বিষয় দিয়ে খুঁজুন...'
                  : 'Search by name, designation or subject...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-full border border-line bg-surface text-xs font-medium text-ink focus:ring-2 focus:ring-accent focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink p-0.5 cursor-pointer"
                title={lang === 'bn' ? 'মুছে ফেলুন' : 'Clear'}
                aria-label={lang === 'bn' ? 'খোঁজা মুছুন' : 'Clear search'}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredTeachers.length === 0 && (
          <div className="text-center py-16 bg-surface rounded-3xl border border-line font-bangla shadow-xs">
            <Users className="w-12 h-12 text-muted mx-auto mb-3" />
            <h4 className="text-base font-bold text-ink">
              {lang === 'bn' ? 'কোনো তথ্য পাওয়া যায়নি' : 'No Members Found'}
            </h4>
            <p className="text-xs text-muted mt-1">
              {lang === 'bn'
                ? 'অনুগ্রহ করে ভিন্ন কোনো নাম, পদবী বা বিষয় দিয়ে অনুসন্ধান করুন।'
                : 'Please try searching with another name, designation, or subject.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-4 px-5 py-2 bg-accent hover:bg-accent-hover text-accent-ink text-xs font-bold rounded-full cursor-pointer shadow-md transition"
            >
              {lang === 'bn' ? 'সবগুলো দেখুন' : 'Show All Members'}
            </button>
          </div>
        )}

        {/* Responsive Card Grid: 4 cols desktop, 2 cols tablet, 1 col mobile */}
        {filteredTeachers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTeachers.map((teacher, index) => (
              <MemberCard
                key={teacher.id || index}
                member={teacher}
                index={index}
                lang={lang}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
