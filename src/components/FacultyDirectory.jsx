import React, { useState } from 'react';
import { useSchool } from '../context/useSchool';
import { createEducatorAvatar } from '../utils/avatarGenerator';
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
  ShieldCheck
} from 'lucide-react';

export default function FacultyDirectory() {
  const { lang, teachers } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'faculty' | 'staff'

  const filteredTeachers = teachers.filter((t) => {
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

    const matchesCategory = 
      activeCategory === 'all' || 
      (t.category ? t.category === activeCategory : (activeCategory === 'faculty' ? !t.designationEn?.includes('Peon') && !t.designationEn?.includes('Guard') && !t.designationEn?.includes('Aya') : true));

    return matchesSearch && matchesCategory;
  });

  const facultyCount = teachers.filter(t => t.category === 'faculty' || (!t.category && !t.designationEn?.includes('Peon') && !t.designationEn?.includes('Guard') && !t.designationEn?.includes('Aya'))).length;
  const staffCount = teachers.filter(t => t.category === 'staff' || (t.category ? false : (t.designationEn?.includes('Peon') || t.designationEn?.includes('Guard') || t.designationEn?.includes('Aya') || t.designationEn?.includes('Assistant')))).length;

  return (
    <section className="py-12 sm:py-16 text-ink relative z-10 font-sans min-h-[700px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-soft text-deep text-xs font-bold px-4 py-1.5 rounded-full mb-3 font-bangla border border-soft-border shadow-xs">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>{lang === 'bn' ? 'শিক্ষক ও কর্মচারী পরিষদ' : 'Faculty & Staff Directory'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-bangla text-ink leading-tight">
            {lang === 'bn' ? 'আমাদের দক্ষ ও নিবেদিতপ্রাণ শিক্ষক ও কর্মকর্তা-কর্মচারী' : 'Dedicated Faculty, Teachers & Staff'}
          </h2>
          <p className="text-xs sm:text-sm text-muted font-bangla mt-2 max-w-2xl mx-auto leading-relaxed">
            {lang === 'bn'
              ? 'অভিজ্ঞ, উচ্চশিক্ষিত ও স্নেহশীল শিক্ষকদের নিবিড় তত্ত্বাবধানে বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়ের পাঠদান ও প্রশাসনিক কার্যক্রম পরিচালিত হয়।'
              : 'Our experienced and compassionate educators and administrative staff are dedicated to academic, moral, and institutional excellence.'}
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="glass-card p-3 sm:p-4 rounded-3xl border border-line mb-8 flex flex-col md:flex-row items-center justify-between gap-4 font-bangla shadow-sm">
          {/* Category Tabs */}
          <div className="flex bg-bg p-1 rounded-full border border-line text-xs font-bold w-full md:w-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-full transition cursor-pointer ${
                activeCategory === 'all' 
                  ? 'btn-gold shadow-md' 
                  : 'text-muted hover:text-ink'
              }`}
            >
              {lang === 'bn' ? `সকল সদস্য (${teachers.length})` : `All Members (${teachers.length})`}
            </button>
            <button
              onClick={() => setActiveCategory('faculty')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-full transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeCategory === 'faculty' 
                  ? 'btn-gold shadow-md' 
                  : 'text-muted hover:text-ink'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? `শিক্ষক পরিষদ (${facultyCount})` : `Faculty (${facultyCount})`}</span>
            </button>
            <button
              onClick={() => setActiveCategory('staff')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-full transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeCategory === 'staff' 
                  ? 'btn-gold shadow-md' 
                  : 'text-muted hover:text-ink'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? `কর্মচারীবৃন্দ (${staffCount})` : `Staff (${staffCount})`}</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'bn' ? 'নাম, পদবী বা বিষয় দিয়ে খুঁজুন...' : 'Search by name, subject, designation...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-full border border-line bg-white text-xs font-medium text-ink focus:ring-2 focus:ring-accent focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-muted p-0.5"
                title="Clear"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredTeachers.length === 0 && (
          <div className="text-center py-16 glass-card rounded-3xl border border-line font-bangla">
            <Users className="w-12 h-12 text-muted mx-auto mb-3" />
            <h4 className="text-base font-bold text-ink">কোনো তথ্য পাওয়া যায়নি</h4>
            <p className="text-xs text-muted mt-1">অনুগ্রহ করে ভিন্ন কোনো নাম বা পদবী দিয়ে অনুসন্ধান করুন।</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-4 px-5 py-2 btn-gold text-xs font-bold rounded-full cursor-pointer shadow-md"
            >
              সবগুলো দেখুন
            </button>
          </div>
        )}

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeachers.map((teacher, index) => {
            const isHead = teacher.designationEn?.includes('Headmaster') && !teacher.designationEn?.includes('Assistant');
            const isAsstHead = teacher.designationEn?.includes('Assistant Headmaster');
            const isStaff = teacher.category === 'staff';

            return (
              <div
                key={teacher.id || index}
                className={`glass-card glass-card-hover rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group shadow-xs hover:shadow-xl ${
                  isHead 
                    ? 'border-accent ring-2 ring-accent/30' 
                    : isAsstHead 
                      ? 'border-soft-border' 
                      : 'border-line hover:border-soft-border'
                }`}
              >
                <div>
                  {/* Photo & Badge Container */}
                  <div className="relative h-60 w-full overflow-hidden bg-bg">
                    <img
                      src={teacher.image}
                      alt={teacher.nameEn}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = createEducatorAvatar({
                          initials: (teacher.nameEn || 'BD').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
                          role: isHead ? 'headmaster' : isStaff ? 'staff' : 'faculty',
                          designation: teacher.designationEn || 'Faculty Member'
                        });
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"></div>

                    {/* Serial Number */}
                    <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono backdrop-blur-xs">
                      #{index + 1}
                    </span>

                    {/* Designation Badge */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full font-bangla shadow-md flex items-center gap-1.5 ${
                        isHead
                          ? 'btn-gold'
                          : isAsstHead
                            ? 'bg-primary text-accent'
                            : isStaff
                              ? 'bg-ink text-muted'
                              : 'bg-deep text-white'
                      }`}>
                        {isHead && <ShieldCheck className="w-3 h-3 text-ink" />}
                        {isAsstHead && <Award className="w-3 h-3 text-accent" />}
                        <span>{lang === 'bn' ? teacher.designationBn : teacher.designationEn}</span>
                      </span>
                    </div>
                  </div>

                  {/* Info Content */}
                  <div className="p-5 space-y-3 font-bangla">
                    <div>
                      <h3 className="text-base font-bold font-bangla text-ink group-hover:text-primary transition line-clamp-1">
                        {lang === 'bn' ? teacher.nameBn : teacher.nameEn}
                      </h3>
                    </div>

                    {/* Subject / Department */}
                    <div className="flex items-start gap-2 bg-soft/70 p-2.5 rounded-xl border border-soft-border text-xs text-deep font-semibold">
                      <BookOpen className="w-3.5 h-3.5 shrink-0 text-primary mt-0.5" />
                      <span className="line-clamp-2 leading-snug">
                        {lang === 'bn' ? teacher.subjectBn : teacher.subjectEn}
                      </span>
                    </div>

                    {/* Qualification */}
                    {teacher.qualification && (
                      <div className="flex items-center gap-2 text-[11px] text-muted bg-bg p-2 rounded-lg border border-line">
                        <GraduationCap className="w-3.5 h-3.5 shrink-0 text-muted" />
                        <span className="font-medium line-clamp-1">{teacher.qualification}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Footer */}
                <div className="px-5 py-3 bg-bg border-t border-line flex items-center justify-between text-xs text-muted font-mono">
                  <a
                    href={`tel:${teacher.phone}`}
                    className="flex items-center gap-1.5 hover:text-primary transition font-semibold"
                    title="Call"
                  >
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px]">{teacher.phone}</span>
                  </a>

                  {teacher.email && (
                    <a
                      href={`mailto:${teacher.email}`}
                      className="p-1.5 text-muted hover:text-primary hover:bg-soft rounded-full transition"
                      title={teacher.email}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
