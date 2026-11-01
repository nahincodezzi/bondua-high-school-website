import React, { useState } from 'react';
import { useSchool } from '../context/useSchool';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  GraduationCap, 
  BookOpen
} from 'lucide-react';

export default function FacultyDirectory() {
  const { lang, teachers } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch = 
      t.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subjectBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subjectEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <section className="py-12 bg-white min-h-[700px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'শিক্ষক ও কর্মচারী পরিষদ' : 'Faculty & Staff Directory'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-bangla text-slate-900">
            {lang === 'bn' ? 'আমাদের দক্ষ ও নিবেদিতপ্রাণ শিক্ষকমণ্ডলী' : 'Dedicated Faculty & Academic Mentors'}
          </h2>
          <p className="text-sm text-slate-600 font-bangla mt-1">
            {lang === 'bn'
              ? 'অভিজ্ঞ ও উচ্চশিক্ষিত শিক্ষকদের নিবিড় তত্ত্বাবধানে বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়ের পাঠদান কার্যক্রম পরিচালিত হয়।'
              : 'Our experienced educators are devoted to nurturing intellectual, moral, and technological excellence.'}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-semibold text-slate-700 font-bangla">
            {lang === 'bn' ? `মোট শিক্ষক সংখ্যা: ${teachers.length} জন` : `Total Faculty Members: ${teachers.length}`}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'bn' ? 'শিক্ষকের নাম বা বিষয় দিয়ে খুঁজুন...' : 'Search by name or subject...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className={`bg-white rounded-2xl overflow-hidden border shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${
                teacher.designationEn === 'Headmaster'
                  ? 'border-amber-400 ring-2 ring-amber-400/30'
                  : 'border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div>
                {/* Photo Container */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                  <img
                    src={teacher.image}
                    alt={teacher.nameEn}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Designation Badge */}
                  <span className={`absolute bottom-3 left-3 text-[11px] font-bold px-2.5 py-0.5 rounded-full font-bangla shadow ${
                    teacher.designationEn === 'Headmaster'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-emerald-800 text-white'
                  }`}>
                    {lang === 'bn' ? teacher.designationBn : teacher.designationEn}
                  </span>
                </div>

                {/* Info Content */}
                <div className="p-4 space-y-2">
                  <h3 className="text-base font-bold font-bangla text-slate-900 group-hover:text-emerald-800 transition">
                    {lang === 'bn' ? teacher.nameBn : teacher.nameEn}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold font-bangla">
                    <BookOpen className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span>{lang === 'bn' ? teacher.subjectBn : teacher.subjectEn}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                    <GraduationCap className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>{teacher.qualification}</span>
                  </div>
                </div>
              </div>

              {/* Contact Footer */}
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <a
                  href={`tel:${teacher.phone}`}
                  className="flex items-center gap-1 hover:text-emerald-700 transition font-mono font-medium"
                  title="Call Teacher"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[11px]">{teacher.phone}</span>
                </a>

                <a
                  href={`mailto:${teacher.email}`}
                  className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition"
                  title={teacher.email}
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
