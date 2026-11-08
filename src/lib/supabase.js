import { createClient } from '@supabase/supabase-js';
import { initialNotices } from '../data/initialData';

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
      titleBn: row.title_bn || '',
      titleEn: row.title_en || '',
      category: row.category || 'academic',
      date: row.date || (row.created_at ? row.created_at.split('T')[0] : ''),
      publishDate: row.date || (row.created_at ? row.created_at.split('T')[0] : ''),
      urgent: Boolean(row.is_urgent ?? row.urgent),
      isUrgent: Boolean(row.is_urgent ?? row.urgent),
      contentBn: row.content_bn || row.description_bn || initialNotices.find(n => n.id === row.id)?.contentBn || '',
      descriptionBn: row.description_bn || row.content_bn || initialNotices.find(n => n.id === row.id)?.contentBn || '',
      contentEn: row.content_en || '',
      fileUrl: row.file_url || null,
      author: row.author || 'ভারপ্রাপ্ত প্রধান শিক্ষক',
    }),
    toDb: (n) => ({
      id: String(n.id),
      title_bn: n.titleBn || '',
      title_en: n.titleEn || null,
      category: n.category || 'academic',
      date: n.publishDate || n.date || new Date().toISOString().split('T')[0],
      urgent: Boolean(n.isUrgent ?? n.urgent),
      is_urgent: Boolean(n.isUrgent ?? n.urgent),
      description_bn: n.contentBn || n.descriptionBn || '',
      content_bn: n.contentBn || n.descriptionBn || '',
      content_en: n.contentEn || null,
      file_url: n.fileUrl || null,
      author: n.author || 'ভারপ্রাপ্ত প্রধান শিক্ষক',
    }),
  },

  teacher: {
    fromDb: (row) => {
      const isStaff = row.category === 'staff' ||
        row.designation_bn?.includes('অফিস সহকারী') ||
        row.designation_bn?.includes('পিয়ন') ||
        row.designation_bn?.includes('আয়া') ||
        row.designation_en?.includes('Staff') ||
        row.designation_en?.includes('Peon') ||
        row.designation_en?.includes('Aya');

      return {
        id: row.id,
        nameBn: row.name_bn || '',
        nameEn: row.name_en || '',
        designationBn: row.designation_bn || '',
        designationEn: row.designation_en || '',
        subjectBn: row.subject_bn || '',
        subjectEn: row.subject_en || '',
        qualification: row.qualification || row.education || '',
        category: row.category || (isStaff ? 'staff' : 'faculty'),
        phone: row.phone || '',
        email: row.email || '',
        education: row.qualification || row.education || '',
        image: row.image || null,
        order: row.order ?? 10,
      };
    },
    toDb: (t) => ({
      id: String(t.id),
      name_bn: t.nameBn || '',
      name_en: t.nameEn || null,
      designation_bn: t.designationBn || '',
      designation_en: t.designationEn || null,
      subject_bn: t.subjectBn || '',
      subject_en: t.subjectEn || null,
      phone: t.phone || '',
      email: t.email || '',
      education: t.qualification || t.education || '',
      qualification: t.qualification || t.education || '',
      category: t.category || 'faculty',
      image: t.image || null,
      order: Number(t.order) || 10,
    }),
  },

  student: {
    fromDb: (row) => ({
      id: row.id,
      roll: row.roll,
      studentId: row.student_id || row.studentId || `BDHS-2026-${row.roll}`,
      nameBn: row.name_bn || '',
      nameEn: row.name_en || '',
      class: String(row.class || '10'),
      section: row.section || 'A',
      shift: row.shift || 'দিবা',
      group: row.group || 'General',
      gender: row.gender || 'Male',
      dob: row.dob || '',
      bloodGroup: row.blood_group || row.bloodGroup || '',
      fatherName: row.father_name || row.guardian_name || '',
      guardianName: row.guardian_name || row.father_name || '',
      guardianPhone: row.guardian_phone || '',
      address: row.address || '',
      status: row.status || 'নিয়মিত',
      photo: row.photo || row.image || null,
    }),
    toDb: (s) => ({
      id: String(s.id),
      roll: String(s.roll || ''),
      student_id: s.studentId || null,
      name_bn: s.nameBn || '',
      name_en: s.nameEn || null,
      class: String(s.class || ''),
      section: s.section || 'A',
      shift: s.shift || 'দিবা',
      gender: s.gender || 'Male',
      group: s.group || 'General',
      dob: s.dob || null,
      blood_group: s.bloodGroup || null,
      father_name: s.fatherName || s.guardianName || null,
      guardian_name: s.guardianName || s.fatherName || null,
      guardian_phone: s.guardianPhone || '',
      address: s.address || null,
      status: s.status || 'নিয়মিত',
      photo: s.photo || s.image || null,
    }),
  },

  admission: {
    fromDb: (row) => ({
      id: row.id,
      trackingId: row.tracking_id || row.id,
      studentNameBn: row.applicant_name_bn || '',
      applicantNameBn: row.applicant_name_bn || '',
      studentNameEn: row.applicant_name_en || '',
      applicantNameEn: row.applicant_name_en || '',
      applyingClass: String(row.desired_class || '6'),
      group: row.group_name || row.group || 'General',
      gender: row.gender || 'Male',
      dob: row.dob || '',
      bloodGroup: row.blood_group || '',
      fatherName: row.father_name || row.guardian_name || '',
      motherName: row.mother_name || '',
      guardianName: row.guardian_name || row.father_name || '',
      guardianPhone: row.guardian_phone || '',
      previousSchool: row.previous_school || '',
      previousGpa: row.previous_gpa || '',
      address: row.address || '',
      status: row.status || 'Pending',
      submissionDate: row.applied_date ? row.applied_date.split('T')[0] : '',
      photo: row.photo || row.image || null,
    }),
    toDb: (a) => ({
      id: String(a.id || a.trackingId),
      tracking_id: a.trackingId || a.id || null,
      applicant_name_bn: a.studentNameBn || a.applicantNameBn || '',
      applicant_name_en: a.studentNameEn || a.applicantNameEn || null,
      desired_class: String(a.applyingClass || a.desiredClass || '6'),
      gender: a.gender || 'Male',
      guardian_name: a.guardianName || a.fatherName || '',
      guardian_phone: a.guardianPhone || '',
      previous_school: a.previousSchool || null,
      status: a.status || 'Pending',
      dob: a.dob || null,
      blood_group: a.bloodGroup || null,
      father_name: a.fatherName || a.guardianName || null,
      mother_name: a.motherName || null,
      previous_gpa: a.previousGpa ? String(a.previousGpa) : null,
      address: a.address || null,
      photo: a.photo || a.image || null,
    }),
  },

  result: {
    fromDb: (row) => {
      const marksheet = (row.marksheet && typeof row.marksheet === 'object') ? row.marksheet : {};
      const subjects = Array.isArray(marksheet.subjects) ? marksheet.subjects : [];
      return {
        id: row.id,
        exam: row.exam || '',
        year: String(row.year || '2026'),
        class: String(row.class || '10'),
        roll: String(row.roll || ''),
        studentNameBn: row.student_name || marksheet.studentNameBn || '',
        studentNameEn: marksheet.studentNameEn || '',
        studentName: row.student_name || '',
        studentId: marksheet.studentId || `BDHS-2026-${row.roll}`,
        group: marksheet.group || 'Science',
        section: marksheet.section || 'A',
        gpa: row.gpa != null ? Number(row.gpa).toFixed(2) : (marksheet.gpa || '0.00'),
        letterGrade: row.grade || marksheet.letterGrade || 'A',
        grade: row.grade || 'A',
        resultStatus: row.status || marksheet.resultStatus || 'PASSED',
        status: row.status || 'PASSED',
        subjects,
        marksheet,
      };
    },
    toDb: (r) => {
      const classVal = String(r.class || '10');
      const rollVal = String(r.roll || '');
      const examVal = r.exam || 'SSC Test Examination 2026';
      const yearVal = String(r.year || '2026');
      const resultId = String(r.id || `${classVal}-${rollVal}-${examVal}-${yearVal}`);
      const subjectsArray = Array.isArray(r.subjects) ? r.subjects : (r.marksheet?.subjects || []);
      return {
        id: resultId,
        exam: examVal,
        year: yearVal,
        class: classVal,
        roll: rollVal,
        student_name: r.studentNameBn || r.studentName || r.studentNameEn || '',
        gpa: Number(r.gpa) || 0,
        grade: r.letterGrade || r.grade || 'A',
        status: r.resultStatus || r.status || 'PASSED',
        marksheet: {
          subjects: subjectsArray,
          studentNameBn: r.studentNameBn || r.studentName || '',
          studentNameEn: r.studentNameEn || '',
          studentId: r.studentId || '',
          group: r.group || 'Science',
          section: r.section || 'A',
          letterGrade: r.letterGrade || r.grade || 'A',
          gpa: r.gpa || '0.00'
        },
      };
    },
  },

  fee: {
    fromDb: (row) => ({
      id: row.id,
      receiptNo: row.receipt_no,
      studentId: row.student_id || '',
      studentRoll: String(row.roll || ''),
      roll: String(row.roll || ''),
      studentName: row.student_name || '',
      class: String(row.class || ''),
      feeType: row.fee_type || 'বেতন',
      amount: Number(row.amount) || 0,
      paidDate: row.paid_date ? row.paid_date.split('T')[0] : '',
      method: row.method || 'Cash',
      status: row.status || 'Paid',
      voidReason: row.void_reason || null,
    }),
    toDb: (f) => ({
      id: String(f.id),
      receipt_no: f.receiptNo || `REC-${Date.now()}`,
      student_id: f.studentId || null,
      student_name: f.studentName || '',
      class: String(f.class || ''),
      roll: String(f.studentRoll || f.roll || ''),
      fee_type: f.feeType || 'বেতন',
      amount: Number(f.amount) || 0,
      paid_date: f.paidDate || new Date().toISOString().split('T')[0],
      method: f.method || 'Cash',
      status: f.status || 'Paid',
      void_reason: f.voidReason || null,
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
      titleEn: row.title_en || '',
      category: row.category || 'campus',
      image: row.url || row.image || '',
      url: row.url || row.image || '',
      type: row.type || 'photo',
      date: row.date || (row.created_at ? row.created_at.split('T')[0] : ''),
      description: row.description || '',
    }),
    toDb: (g) => ({
      id: String(g.id),
      title_bn: g.titleBn || '',
      category: g.category || 'campus',
      url: g.image || g.url || '',
      type: g.type || 'photo',
    }),
  },

  contact: {
    fromDb: (row) => ({
      id: row.id,
      name: row.name,
      email: row.email || '',
      phone: row.phone || '',
      subject: row.subject || '',
      message: row.message || '',
      status: row.status || 'New',
      submittedAt: row.created_at ? row.created_at.split('T')[0] : '',
    }),
    toDb: (c) => ({
      id: String(c.id),
      name: c.name || '',
      email: c.email || null,
      phone: c.phone || '',
      subject: c.subject || null,
      message: c.message || '',
      status: c.status || 'New',
    }),
  },

  video: {
    fromDb: (row) => ({
      id: row.id,
      titleBn: row.title_bn || '',
      titleEn: row.title_en || '',
      videoUrl: row.video_url || '',
      duration: row.duration || '05:00',
      thumbnail: row.thumbnail || '',
    }),
    toDb: (v) => ({
      id: String(v.id),
      title_bn: v.titleBn || '',
      title_en: v.titleEn || null,
      video_url: v.videoUrl || '',
      duration: v.duration || '05:00',
      thumbnail: v.thumbnail || null,
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

    // Optional tables (if created by migration)
    let contactMessages = null;
    try {
      const contactsRes = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (!contactsRes.error && contactsRes.data) {
        contactMessages = contactsRes.data.map(mappers.contact.fromDb);
      }
    } catch {}

    // Fallback for contactMessages from school_info if dedicated table not created yet
    if (!contactMessages) {
      try {
        const contactDoc = await supabase.from('school_info').select('*').eq('id', 'contact_messages').single();
        if (contactDoc.data?.data && Array.isArray(contactDoc.data.data)) {
          contactMessages = contactDoc.data.data;
        }
      } catch {}
    }

    let videos = null;
    try {
      const videosRes = await supabase.from('videos').select('*').order('created_at', { ascending: true });
      if (!videosRes.error && videosRes.data && videosRes.data.length > 0) {
        videos = videosRes.data.map(mappers.video.fromDb);
      }
    } catch {}

    // Fallback for videos from school_info if dedicated table not created yet
    if (!videos) {
      try {
        const videosDoc = await supabase.from('school_info').select('*').eq('id', 'videos').single();
        if (videosDoc.data?.data && Array.isArray(videosDoc.data.data)) {
          videos = videosDoc.data.data;
        }
      } catch {}
    }

    // System Users cloud load (school_info 'system_users' document)
    let systemUsers = null;
    try {
      const usersDoc = await supabase.from('school_info').select('*').eq('id', 'system_users').single();
      if (usersDoc.data?.data && Array.isArray(usersDoc.data.data) && usersDoc.data.data.length > 0) {
        systemUsers = usersDoc.data.data;
      }
    } catch {}

    // Uniform Info cloud load (Senior QA M2)
    let uniformInfo = null;
    try {
      const uniformDoc = await supabase.from('school_info').select('*').eq('id', 'uniform').single();
      if (uniformDoc.data?.data) {
        uniformInfo = uniformDoc.data.data;
      }
    } catch {}

    // Academic Config cloud load (Exams & Classes)
    let academicConfig = null;
    try {
      const academicDoc = await supabase.from('school_info').select('*').eq('id', 'academic_config').single();
      if (academicDoc.data?.data) {
        academicConfig = academicDoc.data.data;
      }
    } catch {}

    // Academic Groups & Subjects (Science, Business, Humanities)
    let academicGroups = null;
    try {
      const groupsDoc = await supabase.from('school_info').select('*').eq('id', 'academic_groups').single();
      if (groupsDoc.data?.data) {
        academicGroups = groupsDoc.data.data;
      }
    } catch {}

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
      uniformInfo,
      academicConfig,
      academicGroups,
      contactMessages,
      videos,
      systemUsers,
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

    // 10. Check & Seed System Users (Cloud Sync - strictly without plaintext passwords)
    const { data: usersRow } = await supabase.from('school_info').select('*').eq('id', 'system_users').single();
    if (!usersRow && initialData.systemUsers?.length) {
      const sanitized = initialData.systemUsers.map(u => {
        const c = { ...u };
        delete c.password;
        return c;
      });
      await supabase.from('school_info').upsert({ id: 'system_users', data: sanitized });
    }
  } catch (err) {
    console.warn('seedCloudIfEmpty caught error:', err);
  }
}
