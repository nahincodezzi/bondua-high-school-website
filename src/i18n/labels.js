/**
 * Central Bilingual UI Dictionary for Generic Interface Labels
 * Ensures the codebase remains completely white-label and free of school-specific hardcoded strings.
 */
export const uiLabels = {
  home: { bn: 'হোম', en: 'Home' },
  about: { bn: 'পরিচিতি', en: 'About' },
  notices: { bn: 'নোটিশ', en: 'Notices' },
  academic: { bn: 'একাডেমিক', en: 'Academic' },
  admission: { bn: 'ভর্তি', en: 'Admission' },
  results: { bn: 'ফলাফল', en: 'Results' },
  contact: { bn: 'যোগাযোগ', en: 'Contact' },
  portalLogin: { bn: 'পোর্টাল লগইন', en: 'Portal Login' },
  logout: { bn: 'লগআউট', en: 'Logout' },
  dressCode: { bn: 'পোশাক নীতিমালা', en: 'Dress Code' },
  checkResults: { bn: 'ফলাফল অনুসন্ধান', en: 'Check Results' },
  applyAdmission: { bn: 'অনলাইন ভর্তি আবেদন', en: 'Apply for Admission' },
  viewAll: { bn: 'সকল দেখুন', en: 'View All' },
  search: { bn: 'অনুসন্ধান করুন...', en: 'Search...' },
  print: { bn: 'প্রিন্ট করুন', en: 'Print' },
  download: { bn: 'ডাউনলোড', en: 'Download' },
  save: { bn: 'সংরক্ষণ করুন', en: 'Save' },
  cancel: { bn: 'বাতিল', en: 'Cancel' },
  confirm: { bn: 'নিশ্চিত করুন', en: 'Confirm' },
  close: { bn: 'বন্ধ করুন', en: 'Close' },
  edit: { bn: 'সম্পাদনা', en: 'Edit' },
  delete: { bn: 'মুছে ফেলুন', en: 'Delete' },
  success: { bn: 'সফল হয়েছে', en: 'Success' },
  loading: { bn: 'লোড হচ্ছে...', en: 'Loading...' },
  noticeBoard: { bn: 'ডিজিটাল নোটিশ বোর্ড', en: 'Digital Notice Board' },
  facultyList: { bn: 'শিক্ষক ও কর্মচারী পরিষদ', en: 'Faculty & Staff' },
  gallery: { bn: 'ফটো ও ভিডিও গ্যালারি', en: 'Media Gallery' },
  uniform: { bn: 'ইউনিফর্ম ও শৃঙ্খলা', en: 'Uniform & Discipline' },
  routines: { bn: 'ক্লাস ও পরীক্ষার রুটিন', en: 'Class & Exam Routines' },
};

export function getUiLabel(key, lang = 'bn', fallback = '') {
  return uiLabels[key]?.[lang] || fallback || uiLabels[key]?.bn || '';
}

