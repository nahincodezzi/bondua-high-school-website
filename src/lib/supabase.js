import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate that url and key are provided and properly formatted
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id') &&
  supabaseAnonKey &&
  supabaseAnonKey.length > 20
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// ============================================================================
// DATA MAPPERS (Translates between Postgres snake_case and React camelCase)
// ============================================================================

export const mappers = {
  notice: {
    fromDb: (row) => ({
      id: row.id,
      titleBn: row.title_bn,
      titleEn: row.title_en || '',
      category: row.category || 'academic',
      date: row.date,
      publishDate: row.date,
      urgent: Boolean(row.urgent),
      descriptionBn: row.description_bn || '',
      fileUrl: row.file_url || null,
      author: row.author || 'প্রধান শিক্ষক',
    }),
    toDb: (n) => ({
      id: String(n.id),
      title_bn: n.titleBn || '',
      title_en: n.titleEn || null,
      category: n.category || 'academic',
      date: n.date || new Date().toISOString().split('T')[0],
      urgent: Boolean(n.urgent),
      description_bn: n.descriptionBn || '',
      file_url: n.fileUrl || null,
      author: n.author || 'প্রধান শিক্ষক',
    }),
  },

  teacher: {
    fromDb: (row) => ({
      id: row.id,
      nameBn: row.name_bn,
      nameEn: row.name_en || '',
      designationBn: row.designation_bn,
      designationEn: row.designation_en || '',
      subjectBn: row.subject_bn || '',
      phone: row.phone || '',
      email: row.email || '',
      education: row.education || '',
      image: row.image || null,
      order: row.order ?? 10,
    }),
    toDb: (t) => ({
      id: String(t.id),
      name_bn: t.nameBn || '',
      name_en: t.nameEn || null,
      designation_bn: t.designationBn || '',
      subject_bn: t.subjectBn || '',
      phone: t.phone || '',
      email: t.email || '',
      education: t.education || '',
      image: t.image || null,
      order: Number(t.order) || 10,
    }),
  },

  student: {
    fromDb: (row) => ({
      id: row.id,
      roll: row.roll,
      nameBn: row.name_bn,
      nameEn: row.name_en || '',
      class: row.class,
      section: row.section || 'ক',
      shift: row.shift || 'দিবা',
      gender: row.gender || 'ছাত্র',
      fatherName: row.father_name || '',
      guardianPhone: row.guardian_phone || '',
      status: row.status || 'নিয়মিত',
    }),
    toDb: (s) => ({
      id: String(s.id),
      roll: String(s.roll || ''),
      name_bn: s.nameBn || '',
      name_en: s.nameEn || null,
      class: String(s.class || ''),
      section: s.section || 'ক',
      shift: s.shift || 'দিবা',
      gender: s.gender || 'ছাত্র',
      father_name: s.fatherName || s.guardianName || null,
      guardian_phone: s.guardianPhone || '',
      status: s.status || 'নিয়মিত',
    }),
  },

  admission: {
    fromDb: (row) => ({
      id: row.id,
      studentNameBn: row.applicant_name_bn,
      studentNameEn: row.applicant_name_en || '',
      applyingClass: row.desired_class,
      gender: row.gender || '',
      guardianName: row.guardian_name,
      guardianPhone: row.guardian_phone,
      previousSchool: row.previous_school || '',
      status: row.status || 'Pending',
      submissionDate: row.applied_date ? row.applied_date.split('T')[0] : '',
    }),
    toDb: (a) => ({
      id: String(a.id),
      applicant_name_bn: a.studentNameBn || a.applicantNameBn || '',
      applicant_name_en: a.studentNameEn || a.applicantNameEn || null,
      desired_class: String(a.applyingClass || a.desiredClass || '6'),
      gender: a.gender || null,
      guardian_name: a.guardianName || '',
      guardian_phone: a.guardianPhone || '',
      previous_school: a.previousSchool || null,
      status: a.status || 'pending',
    }),
  },

  result: {
    fromDb: (row) => ({
      id: row.id,
      exam: row.exam,
      year: row.year,
      class: row.class,
      roll: row.roll,
      studentName: row.student_name,
      gpa: Number(row.gpa) || 0,
      grade: row.grade || 'A',
      status: row.status || 'PASSED',
      marksheet: row.marksheet || {},
    }),
    toDb: (r) => ({
      id: String(r.id || `${r.roll}-${r.exam}-${r.year}`),
      exam: r.exam || '',
      year: String(r.year || '2026'),
      class: String(r.class || '10'),
      roll: String(r.roll || ''),
      student_name: r.studentName || '',
      gpa: Number(r.gpa) || 0,
      grade: r.grade || 'A',
      status: r.status || 'PASSED',
      marksheet: r.marksheet || {},
    }),
  },

  fee: {
    fromDb: (row) => ({
      id: row.id,
      receiptNo: row.receipt_no,
      studentId: row.student_id || '',
      studentName: row.student_name,
      class: row.class,
      roll: row.roll,
      feeType: row.fee_type,
      amount: Number(row.amount) || 0,
      paidDate: row.paid_date ? row.paid_date.split('T')[0] : '',
      status: 'Paid',
    }),
    toDb: (f) => ({
      id: String(f.id),
      receipt_no: f.receiptNo || `REC-${Date.now()}`,
      student_id: f.studentId || null,
      student_name: f.studentName || '',
      class: String(f.class || ''),
      roll: String(f.roll || ''),
      fee_type: f.feeType || 'বেতন',
      amount: Number(f.amount) || 0,
    }),
  },

  slide: {
    fromDb: (row) => ({
      id: row.id,
      titleBn: row.title_bn,
      subtitleBn: row.subtitle_bn || '',
      tagBn: row.tag_bn || '',
      image: row.image,
      order: row.order ?? 1,
      active: row.active ?? true,
    }),
    toDb: (s) => ({
      id: String(s.id),
      title_bn: s.titleBn || '',
      subtitle_bn: s.subtitleBn || '',
      tag_bn: s.tagBn || '',
      image: s.image || '',
      order: Number(s.order) || 1,
      active: s.active ?? true,
    }),
  },

  gallery: {
    fromDb: (row) => ({
      id: row.id,
      titleBn: row.title_bn,
      category: row.category || 'campus',
      url: row.url,
      type: row.type || 'photo',
    }),
    toDb: (g) => ({
      id: String(g.id),
      title_bn: g.titleBn || '',
      category: g.category || 'campus',
      url: g.url || '',
      type: g.type || 'photo',
    }),
  },
};

// ============================================================================
// HELPER CLOUD FUNCTIONS
// ============================================================================

export async function fetchAllCloudData() {
  if (!supabase) return null;

  try {
    const [
      noticesRes,
      teachersRes,
      studentsRes,
      admissionsRes,
      resultsRes,
      feesRes,
      slidesRes,
      galleryRes,
      schoolInfoRes,
    ] = await Promise.all([
      supabase.from('notices').select('*').order('date', { ascending: false }),
      supabase.from('teachers').select('*').order('order', { ascending: true }),
      supabase.from('students').select('*').order('roll', { ascending: true }),
      supabase.from('admissions').select('*').order('applied_date', { ascending: false }),
      supabase.from('results').select('*'),
      supabase.from('fee_receipts').select('*').order('paid_date', { ascending: false }),
      supabase.from('hero_slides').select('*').order('order', { ascending: true }),
      supabase.from('gallery').select('*'),
      supabase.from('school_info').select('*').eq('id', 'main').single(),
    ]);

    return {
      notices: noticesRes.data?.map(mappers.notice.fromDb) || null,
      teachers: teachersRes.data?.map(mappers.teacher.fromDb) || null,
      students: studentsRes.data?.map(mappers.student.fromDb) || null,
      admissions: admissionsRes.data?.map(mappers.admission.fromDb) || null,
      results: resultsRes.data?.map(mappers.result.fromDb) || null,
      fees: feesRes.data?.map(mappers.fee.fromDb) || null,
      heroSlides: slidesRes.data?.map(mappers.slide.fromDb) || null,
      gallery: galleryRes.data?.map(mappers.gallery.fromDb) || null,
      schoolInfo: schoolInfoRes.data?.data || null,
    };
  } catch (err) {
    console.warn('Supabase fetchAllCloudData caught error:', err);
    return null;
  }
}

/**
 * Automatically seeds the Supabase tables with initial data if they are empty
 */
export async function seedCloudIfEmpty(initialData) {
  if (!supabase) return;

  try {
    // 1. Check & Seed Notices
    const { count: noticeCount } = await supabase.from('notices').select('*', { count: 'exact', head: true });
    if (noticeCount === 0 && initialData.notices?.length) {
      await supabase.from('notices').insert(initialData.notices.map(mappers.notice.toDb));
    }

    // 2. Check & Seed Teachers
    const { count: teacherCount } = await supabase.from('teachers').select('*', { count: 'exact', head: true });
    if (teacherCount === 0 && initialData.teachers?.length) {
      await supabase.from('teachers').insert(initialData.teachers.map(mappers.teacher.toDb));
    }

    // 3. Check & Seed Students
    const { count: studentCount } = await supabase.from('students').select('*', { count: 'exact', head: true });
    if (studentCount === 0 && initialData.students?.length) {
      await supabase.from('students').insert(initialData.students.map(mappers.student.toDb));
    }

    // 4. Check & Seed Admissions
    const { count: admCount } = await supabase.from('admissions').select('*', { count: 'exact', head: true });
    if (admCount === 0 && initialData.admissions?.length) {
      await supabase.from('admissions').insert(initialData.admissions.map(mappers.admission.toDb));
    }

    // 5. Check & Seed Results
    const { count: resCount } = await supabase.from('results').select('*', { count: 'exact', head: true });
    if (resCount === 0 && initialData.results?.length) {
      await supabase.from('results').insert(initialData.results.map(mappers.result.toDb));
    }

    // 6. Check & Seed Fees
    const { count: feeCount } = await supabase.from('fee_receipts').select('*', { count: 'exact', head: true });
    if (feeCount === 0 && initialData.fees?.length) {
      await supabase.from('fee_receipts').insert(initialData.fees.map(mappers.fee.toDb));
    }

    // 7. Check & Seed Slides
    const { count: slideCount } = await supabase.from('hero_slides').select('*', { count: 'exact', head: true });
    if (slideCount === 0 && initialData.heroSlides?.length) {
      await supabase.from('hero_slides').insert(initialData.heroSlides.map(mappers.slide.toDb));
    }

    // 8. Check & Seed Gallery
    const { count: galCount } = await supabase.from('gallery').select('*', { count: 'exact', head: true });
    if (galCount === 0 && initialData.gallery?.length) {
      await supabase.from('gallery').insert(initialData.gallery.map(mappers.gallery.toDb));
    }

    // 9. Check & Seed School Info
    const { data: infoRow } = await supabase.from('school_info').select('*').eq('id', 'main').single();
    if (!infoRow && initialData.schoolInfo) {
      await supabase.from('school_info').upsert({ id: 'main', data: initialData.schoolInfo });
    }
  } catch (err) {
    console.warn('seedCloudIfEmpty caught error:', err);
  }
}
