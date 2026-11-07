/**
 * Dynamic Signatory Provider for Bandua Daulatpur High School Reports
 * Automatically resolves current Headmaster, Exam Controller, Accountant, and Convener
 * Updates automatically when school settings, user management, or teachers change.
 */

export function getSignatories(schoolInfo = {}, teachers = [], systemUsers = []) {
  // 1. Headmaster / Principal
  const headmasterNameBn = schoolInfo?.headmasterNameBn || 'জনাব বাহার উদ্দিন ভূঁইয়া';
  const headmasterNameEn = schoolInfo?.headmasterNameEn || 'Bahar Uddin Bhuiyan';
  const headmasterDesignationBn = schoolInfo?.headmasterDesignationBn || 'ভারপ্রাপ্ত প্রধান শিক্ষক';
  
  // Clean cursive signature based on headmaster's English name
  const headParts = headmasterNameEn.replace(/^Mr\.?\s*/i, '').trim().split(/\s+/);
  const headmasterSignature = headParts.length > 1 
    ? `${headParts[0]} ${headParts[1][0]}.` 
    : (headParts[0] || 'Bahar U.');

  // 2. Exam Controller (Assistant Headmaster or senior faculty in charge of examinations)
  const controllerUser = systemUsers.find(u => u.role === 'asst_headmaster') ||
    teachers.find(t => 
      t.designationBn?.includes('সহকারী প্রধান') || 
      t.designationBn?.includes('সহ প্রধান') || 
      t.designationBn?.includes('পরীক্ষা')
    );
  const examControllerNameBn = controllerUser?.nameBn || 'জনাব সলিম উদ্দিন মজুমদার';
  const examControllerNameEn = controllerUser?.nameEn || 'Solim Uddin Majumder';
  const examControllerDesignationBn = 'পরীক্ষা নিয়ন্ত্রক ও সহ-প্রধান শিক্ষক';
  const examControllerDesignationEn = 'Controller of Examinations';
  
  const ctrlParts = examControllerNameEn.replace(/^Mr\.?\s*/i, '').trim().split(/\s+/);
  const examControllerSignature = ctrlParts.length > 1 
    ? `${ctrlParts[0]} ${ctrlParts[1][0]}.` 
    : (ctrlParts[0] || 'Solim U.');

  // 3. Accountant / Cashier (Office assistant in charge of accounts & fees)
  const accountantUser = systemUsers.find(u => u.role === 'office_assistant' || u.role === 'accountant') ||
    teachers.find(t => 
      t.category === 'staff' || 
      t.designationBn?.includes('অফিস সহকারী') || 
      t.designationBn?.includes('হিসাব')
    );
  const accountantNameBn = accountantUser?.nameBn || 'নুরুল কবির ভূঁইয়া';
  const accountantNameEn = accountantUser?.nameEn || 'Nurul Kabir Bhuiyan';
  const accountantDesignationBn = accountantUser?.designationBn || 'অফিস সহকারী (হিসাব শাখা)';
  const accountantDesignationEn = 'Office Assistant (Accounts)';
  
  const acctParts = accountantNameEn.replace(/^Mr\.?\s*/i, '').trim().split(/\s+/);
  const accountantSignature = acctParts.length > 1 
    ? `${acctParts[0][0]}. ${acctParts[acctParts.length - 1]}` 
    : (acctParts[0] || 'N. Kabir');

  // 4. Admission Convener (Admission Committee)
  const convenerNameBn = examControllerNameBn;
  const convenerDesignationBn = 'আহ্বায়ক, ভর্তি কমিটি';
  const convenerSignature = examControllerSignature;

  return {
    headmaster: {
      nameBn: headmasterNameBn,
      nameEn: headmasterNameEn,
      designationBn: headmasterDesignationBn,
      signature: headmasterSignature
    },
    examController: {
      nameBn: examControllerNameBn,
      nameEn: examControllerNameEn,
      designationBn: examControllerDesignationBn,
      designationEn: examControllerDesignationEn,
      signature: examControllerSignature
    },
    accountant: {
      nameBn: accountantNameBn,
      nameEn: accountantNameEn,
      designationBn: accountantDesignationBn,
      designationEn: accountantDesignationEn,
      signature: accountantSignature
    },
    admissionConvener: {
      nameBn: convenerNameBn,
      designationBn: convenerDesignationBn,
      signature: convenerSignature
    }
  };
}
