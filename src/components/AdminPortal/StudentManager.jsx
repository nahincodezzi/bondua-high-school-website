import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as XLSX from 'xlsx';
import SchoolLogo from '../common/SchoolLogo';
import { useSchool } from '../../context/useSchool';
import { getSignatories } from '../../utils/signatories';
import { toBanglaNumerals, toEnglishNumerals } from '../../utils/dateFormatter';
import { 
  Search, 
  Plus, 
  Trash2, 
  CreditCard, 
  Printer, 
  X,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Info,
  CheckCircle2,
  FileUp,
  FileCheck,
  Edit,
  Camera,
  Upload
} from 'lucide-react';

const normalizeKey = (key = '') => {
  return String(key).trim().toLowerCase().replace(/[\s_\-()/\\.]+/g, '');
};

const findVal = (row, targetKeys) => {
  for (const [k, v] of Object.entries(row)) {
    if (v === '' || v === null || v === undefined) continue;
    const normK = normalizeKey(k);
    if (targetKeys.some(tk => normK === tk || normK.startsWith(tk) || tk.startsWith(normK))) {
      return String(v).trim();
    }
  }
  return '';
};

export default function StudentManager({ initialOpenAdd = false }) {
  const { 
    students, 
    addStudent, 
    updateStudent,
    bulkAddStudents, 
    bulkDeleteStudents, 
    deleteStudent, 
    schoolInfo, 
    teachers, 
    systemUsers 
  } = useSchool();
  const signatories = getSignatories(schoolInfo, teachers, systemUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [showAddModal, setShowAddModal] = useState(initialOpenAdd);
  const [activeIdCardStudent, setActiveIdCardStudent] = useState(null);
  const [formError, setFormError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Edit Student State
  const [editingStudent, setEditingStudent] = useState(null);
  const [editError, setEditError] = useState('');

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Bulk Excel Upload States
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [parsedStudents, setParsedStudents] = useState([]);
  const [parseErrors, setParseErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const getNextRollForClass = (cls) => {
    const sameClass = students.filter(s => String(s.class) === String(cls));
    const max = sameClass.reduce((m, s) => Math.max(m, Number(s.roll) || 0), 0);
    return max > 0 ? String(max + 1) : '1';
  };

  const [newStudent, setNewStudent] = useState({
    roll: '1',
    nameBn: '',
    nameEn: '',
    class: '10',
    section: 'A',
    group: 'Science',
    gender: 'Male',
    dob: '2010-01-01',
    guardianName: '',
    guardianPhone: '',
    address: 'বন্দুয়া দৌলতপুর, ফুলগাজী',
    photo: ''
  });

  const handleOpenAddModal = () => {
    const nextRoll = getNextRollForClass(selectedClass === 'all' ? '10' : selectedClass);
    const targetCls = selectedClass === 'all' ? '10' : selectedClass;
    setNewStudent({
      roll: nextRoll,
      nameBn: '',
      nameEn: '',
      class: targetCls,
      section: 'A',
      group: ['9', '10'].includes(targetCls) ? 'Science' : 'General',
      gender: 'Male',
      dob: '2010-01-01',
      guardianName: '',
      guardianPhone: '',
      address: 'বন্দুয়া দৌলতপুর, ফুলগাজী',
      photo: ''
    });
    setFormError('');
    setShowAddModal(true);
  };

  const handlePhotoUpload = (e, target) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WebP) নির্বাচন করুন।');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('ছবির সাইজ সর্বোচ্চ ২ মেগাবাইট (2MB) হতে পারবে।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result;
      if (typeof dataUrl === 'string') {
        if (target === 'edit') {
          setEditingStudent(prev => prev ? ({ ...prev, photo: dataUrl }) : null);
        } else {
          setNewStudent(prev => ({ ...prev, photo: dataUrl }));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingStudent) return;
    setEditError('');

    if (!editingStudent.nameBn?.trim() && !editingStudent.nameEn?.trim()) {
      setEditError('শিক্ষার্থীর বাংলা বা ইংরেজি নাম দেওয়া আবশ্যক।');
      return;
    }

    const rollNum = parseInt(editingStudent.roll, 10);
    if (isNaN(rollNum) || rollNum <= 0 || rollNum > 9999) {
      setEditError('রোল নম্বর অবশ্যই ১ থেকে ৯৯৯৯-এর মধ্যে একটি ধনাত্মক সংখ্যা হতে হবে।');
      return;
    }

    // Duplicate roll check (excluding current student)
    const isDuplicate = students.some(
      s => s.id !== editingStudent.id && 
           String(s.class) === String(editingStudent.class) && 
           Number(s.roll) === rollNum
    );
    if (isDuplicate) {
      setEditError(`শ্রেণি ${editingStudent.class}-এ রোল ${rollNum} ইতোমধ্যেই অন্য শিক্ষার্থীর রয়েছে!`);
      return;
    }

    if (editingStudent.guardianPhone) {
      const cleanPhone = toEnglishNumerals(editingStudent.guardianPhone).replace(/\D/g, '');
      if (cleanPhone && !/^01[3-9]\d{8}$/.test(cleanPhone)) {
        setEditError('অভিভাবকের মোবাইল নম্বর ১১ ডিজিটের সঠিক নম্বর হতে হবে (যেমন: 01819204561)।');
        return;
      }
    }

    if (updateStudent) {
      updateStudent(editingStudent.id, {
        ...editingStudent,
        roll: rollNum
      });
    }

    // Live update active ID card if opened
    if (activeIdCardStudent && activeIdCardStudent.id === editingStudent.id) {
      setActiveIdCardStudent({
        ...editingStudent,
        roll: rollNum
      });
    }

    setActionSuccess(`"${editingStudent.nameBn || editingStudent.nameEn}"-এর তথ্য ও ছবি সফলভাবে হালনাগাদ করা হয়েছে!`);
    setTimeout(() => setActionSuccess(''), 5000);
    setEditingStudent(null);
  };

  const filteredStudents = students.filter(s => {
    const matchesClass = selectedClass === 'all' || s.class === selectedClass;
    const matchesSearch = 
      (s.nameBn && s.nameBn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.nameEn && s.nameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.roll && s.roll.toString().includes(searchQuery)) ||
      (s.studentId && s.studentId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesClass && matchesSearch;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    // 1. Roll Validation: positive integer between 1 and 9999 (Senior QA H3)
    const rollNum = parseInt(newStudent.roll, 10);
    if (isNaN(rollNum) || rollNum <= 0 || rollNum > 9999) {
      setFormError('রোল নম্বর অবশ্যই ১ থেকে ৯৯৯৯-এর মধ্যে একটি ধনাত্মক সংখ্যা হতে হবে।');
      return;
    }

    // 2. Duplicate Roll Validation: Same class cannot have duplicate roll (Senior QA H2)
    const isDuplicate = students.some(
      s => String(s.class) === String(newStudent.class) && Number(s.roll) === rollNum
    );
    if (isDuplicate) {
      setFormError(`${newStudent.class} শ্রেণিতে রোল নম্বর ${rollNum} ইতোমধ্যেই বিদ্যমান! একই শ্রেণিতে ডুপ্লিকেট রোল বরাদ্দ করা সম্ভব নয়।`);
      return;
    }

    // 3. Name Validation: Bangla Name must contain valid Bengali characters (Senior QA H3)
    const banglaPattern = /^[\u0980-\u09FF\s.'"-]+$/;
    if (!newStudent.nameBn.trim()) {
      setFormError('শিক্ষার্থীর বাংলা নাম প্রদান করুন।');
      return;
    }
    if (!banglaPattern.test(newStudent.nameBn.trim())) {
      setFormError('বাংলা নামের ঘরে শুধুমাত্র বাংলা অক্ষর ও যতিচিহ্ন ব্যবহার করুন (ইংরেজি নয়)।');
      return;
    }

    // 4. Phone Number Validation: Bangladeshi 11-digit mobile (013-019) (Senior QA H3)
    const phoneClean = (newStudent.guardianPhone || '').trim();
    const phonePattern = /^01[3-9]\d{8}$/;
    if (!phonePattern.test(phoneClean)) {
      setFormError('অভিভাবকের মোবাইল নম্বর সঠিক নয়। অনুগ্রহ করে ১১ ডিজিটের বৈধ নম্বর দিন (যেমন: 01712345678)।');
      return;
    }

    addStudent({
      ...newStudent,
      roll: rollNum,
      guardianPhone: phoneClean
    });

    setShowAddModal(false);
    setFormError('');
    setNewStudent({
      roll: '',
      nameBn: '',
      nameEn: '',
      class: '10',
      section: 'A',
      group: 'Science',
      gender: 'Male',
      dob: '2010-01-01',
      guardianName: '',
      guardianPhone: '',
      address: 'বন্দুয়া দৌলতপুর, ফুলগাজী'
    });
  };

  const handlePrintIdCard = () => {
    document.body.classList.add('printing-modal');
    document.body.classList.add('printing-idcard');
    const cleanup = () => {
      document.body.classList.remove('printing-modal');
      document.body.classList.remove('printing-idcard');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    window.print();
    setTimeout(cleanup, 1200);
  };

  // Selection Logic
  const allFilteredSelected = filteredStudents.length > 0 && filteredStudents.every(s => selectedIds.has(s.id));
  const someFilteredSelected = filteredStudents.some(s => selectedIds.has(s.id));

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(filteredStudents.map(s => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelectOne = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`আপনি কি নিশ্চিত যে নির্বাচিত ${toBanglaNumerals(selectedIds.size)} জন শিক্ষার্থীর তথ্য সম্পূর্ণ মুছে ফেলতে চান?`)) {
      if (bulkDeleteStudents) {
        bulkDeleteStudents(Array.from(selectedIds));
      } else {
        selectedIds.forEach(id => deleteStudent(id));
      }
      setSelectedIds(new Set());
      setActionSuccess('নির্বাচিত শিক্ষার্থীদের তথ্য সফলভাবে মুছে ফেলা হয়েছে!');
      setTimeout(() => setActionSuccess(''), 5000);
    }
  };

  // Bulk Export to Excel
  const handleExportSelected = () => {
    if (selectedIds.size === 0) return;
    const selectedStudents = students.filter(s => selectedIds.has(s.id));
    const exportRows = selectedStudents.map(s => ({
      'আইডি (Student ID)': s.studentId,
      'রোল (Roll)': s.roll,
      'নাম (বাংলা)': s.nameBn,
      'Name (English)': s.nameEn,
      'শ্রেণি (Class)': s.class,
      'শাখা (Section)': s.section,
      'বিভাগ (Group)': s.group,
      'লিঙ্গ (Gender)': s.gender,
      'অভিভাবকের মোবাইল': s.guardianPhone,
      'অভিভাবকের নাম': s.guardianName,
      'রক্তের গ্রুপ': s.bloodGroup || '',
      'জন্ম তারিখ': s.dob || '',
      'ঠিকানা': s.address || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students_List');
    XLSX.writeFile(wb, `BDHS_Selected_Students_${Date.now()}.xlsx`);
  };

  // Download Sample Template for Excel Upload
  const handleDownloadTemplate = () => {
    const headers = [
      'রোল (Roll) *',
      'শিক্ষার্থীর নাম বাংলা (Name Bn) *',
      'শিক্ষার্থীর নাম ইংরেজি (Name En)',
      'শ্রেণি (Class) *',
      'শাখা (Section)',
      'বিভাগ (Group)',
      'লিঙ্গ (Gender)',
      'অভিভাবকের মোবাইল (Phone) *',
      'অভিভাবকের নাম (Guardian)',
      'পিতার নাম (Father)',
      'মাতার নাম (Mother)',
      'রক্তের গ্রুপ (Blood Group)',
      'জন্ম তারিখ (YYYY-MM-DD)',
      'ঠিকানা (Address)'
    ];

    const targetClsNum = selectedClass === 'all' ? 10 : Number(selectedClass) || 10;
    const sampleRows = [
      {
        'রোল (Roll) *': 1,
        'শিক্ষার্থীর নাম বাংলা (Name Bn) *': 'তানভীর হোসেন',
        'শিক্ষার্থীর নাম ইংরেজি (Name En)': 'Tanvir Hossain',
        'শ্রেণি (Class) *': targetClsNum,
        'শাখা (Section)': 'A',
        'বিভাগ (Group)': targetClsNum >= 9 ? 'Science' : 'General',
        'লিঙ্গ (Gender)': 'Male',
        'অভিভাবকের মোবাইল (Phone) *': '01815112233',
        'অভিভাবকের নাম (Guardian)': 'আবুল কাশেম',
        'পিতার নাম (Father)': 'আবুল কাশেম',
        'মাতার নাম (Mother)': 'সালমা বেগম',
        'রক্তের গ্রুপ (Blood Group)': 'A+',
        'জন্ম তারিখ (YYYY-MM-DD)': '2010-02-15',
        'ঠিকানা (Address)': 'বন্দুয়া দৌলতপুর, ফুলগাজী'
      },
      {
        'রোল (Roll) *': 2,
        'শিক্ষার্থীর নাম বাংলা (Name Bn) *': 'সুমাইয়া আক্তার',
        'শিক্ষার্থীর নাম ইংরেজি (Name En)': 'Sumaiya Akter',
        'শ্রেণি (Class) *': targetClsNum,
        'শাখা (Section)': 'A',
        'বিভাগ (Group)': targetClsNum >= 9 ? 'Science' : 'General',
        'লিঙ্গ (Gender)': 'Female',
        'অভিভাবকের মোবাইল (Phone) *': '01712893042',
        'অভিভাবকের নাম (Guardian)': 'রফিকুল ইসলাম',
        'পিতার নাম (Father)': 'রফিকুল ইসলাম',
        'মাতার নাম (Mother)': 'নাজমা আক্তার',
        'রক্তের গ্রুপ (Blood Group)': 'B+',
        'জন্ম তারিখ (YYYY-MM-DD)': '2010-05-20',
        'ঠিকানা (Address)': 'আনন্দপুর, ফুলগাজী'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleRows, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students_Template');
    XLSX.writeFile(wb, `BDHS_Student_Registration_Template_Class_${targetClsNum}.xlsx`);
  };

  // Excel File Parsing Logic
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelFile(file);
    setIsProcessing(true);
    setParseErrors([]);
    setParsedStudents([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (rows.length === 0) {
          setParseErrors(['এক্সেল ফাইলটিতে কোনো শিক্ষার্থীর ডাটা পাওয়া যায়নি।']);
          setIsProcessing(false);
          return;
        }

        const validList = [];
        const errorList = [];
        const seenClassRoll = new Set();

        rows.forEach((row, idx) => {
          const rowNum = idx + 2;

          // 1. Roll
          const rawRoll = findVal(row, ['roll', 'rollno', 'studentroll', 'রোল', 'রোলনম্বর', 'রোলনং']);
          const cleanRoll = toEnglishNumerals(rawRoll);
          const rollNum = parseInt(cleanRoll, 10);
          if (isNaN(rollNum) || rollNum <= 0 || rollNum > 9999) {
            errorList.push(`সারি ${rowNum}: রোল নম্বর ১-৯৯৯৯-এর মধ্যে সঠিক সংখ্যা হতে হবে (পাওয়া গেছে: "${rawRoll || 'খালি'}").`);
            return;
          }

          // 2. Class
          const rawClass = findVal(row, ['class', 'classname', 'শ্রেণি', 'শ্রেণী']);
          const targetCls = rawClass ? toEnglishNumerals(rawClass).replace(/\D/g, '') : (selectedClass === 'all' ? '10' : selectedClass);
          if (!targetCls) {
            errorList.push(`সারি ${rowNum}: শ্রেণি নির্দিষ্ট করা নেই।`);
            return;
          }

          // 3. Duplicate Roll Check (within file & against DB)
          const classRollKey = `${targetCls}-${rollNum}`;
          if (seenClassRoll.has(classRollKey)) {
            errorList.push(`সারি ${rowNum}: একই শ্রেণিতে (${targetCls}) রোল ${rollNum} এক্সেল ফাইলেই একাধিকবার রয়েছে!`);
            return;
          }
          seenClassRoll.add(classRollKey);

          const isDuplicateInDb = students.some(
            s => String(s.class) === String(targetCls) && Number(s.roll) === rollNum
          );
          if (isDuplicateInDb) {
            errorList.push(`সারি ${rowNum}: শ্রেণি ${targetCls}-এ রোল ${rollNum} ইতোমধ্যেই ডাটাবেজে বিদ্যমান!`);
            return;
          }

          // 4. Name
          const nameBn = findVal(row, ['namebn', 'namebangla', 'banglaname', 'বাংলানাম', 'নামবাংলা', 'নাম']);
          const nameEn = findVal(row, ['nameen', 'nameenglish', 'englishname', 'ইংলেজিনাম', 'ইংরেজিনাম', 'name']);
          if (!nameBn && !nameEn) {
            errorList.push(`সারি ${rowNum}: শিক্ষার্থীর বাংলা অথবা ইংরেজি নাম দেওয়া আবশ্যক।`);
            return;
          }

          // 5. Phone
          const rawPhone = findVal(row, ['phone', 'guardianphone', 'mobile', 'মোবাইল', 'ফোন', 'অভিভাবকেরমোবাইল', 'contact']);
          const cleanPhone = toEnglishNumerals(rawPhone).replace(/\D/g, '');
          const phonePattern = /^01[3-9]\d{8}$/;
          if (cleanPhone && !phonePattern.test(cleanPhone)) {
            errorList.push(`সারি ${rowNum}: অভিভাবকের মোবাইল নম্বর সঠিক নয় (${rawPhone})। ১১ ডিজিটের সঠিক নম্বর হতে হবে।`);
            return;
          }

          const section = findVal(row, ['section', 'শাখা', 'sec']) || 'A';
          const isSec = ['9', '10'].includes(targetCls);
          const rawGroup = findVal(row, ['group', 'বিভাগ', 'discipline']);
          const group = isSec ? (rawGroup || 'Science') : 'General';
          const gender = findVal(row, ['gender', 'লিঙ্গ', 'sex']) || 'Male';
          const bloodGroup = findVal(row, ['bloodgroup', 'blood', 'রক্তেরগ্রুপ', 'রক্ত']) || '';
          const dob = findVal(row, ['dob', 'birthdate', 'dateofbirth', 'জন্মতারিখ']) || '2010-01-01';
          const guardianName = findVal(row, ['guardianname', 'guardian', 'অভিভাবকেরনাম', 'অভিভাবক', 'fathername', 'পিতারনাম']) || '';
          const fatherName = findVal(row, ['fathername', 'father', 'পিতারনাম', 'পিতা']) || guardianName;
          const motherName = findVal(row, ['mothername', 'mother', 'মাতারনাম', 'মাতা']) || '';
          const address = findVal(row, ['address', 'ঠিকানা', 'গ্রাম']) || 'বন্দুয়া দৌলতপুর, ফুলগাজী';

          validList.push({
            roll: rollNum,
            nameBn: nameBn || nameEn,
            nameEn: nameEn || nameBn,
            class: targetCls,
            section,
            group,
            gender,
            guardianPhone: cleanPhone || '01819204561',
            guardianName: guardianName || fatherName,
            fatherName,
            motherName,
            bloodGroup,
            dob,
            address
          });
        });

        setParsedStudents(validList);
        setParseErrors(errorList);
      } catch (err) {
        setParseErrors(['এক্সেল ফাইলটি পড়তে সমস্যা হয়েছে: ' + err.message]);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleConfirmBulkSave = () => {
    if (parsedStudents.length === 0) return;
    if (bulkAddStudents) {
      bulkAddStudents(parsedStudents);
    } else {
      parsedStudents.forEach(stu => addStudent(stu));
    }
    setActionSuccess(`একসাথে ${toBanglaNumerals(parsedStudents.length)} জন শিক্ষার্থী সফলভাবে ডাটাবেজে যুক্ত করা হয়েছে!`);
    setParsedStudents([]);
    setParseErrors([]);
    setExcelFile(null);
    setShowExcelModal(false);
    setTimeout(() => setActionSuccess(''), 6000);
  };

  useEffect(() => {
    if (!activeIdCardStudent) return;
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handlePrintIdCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdCardStudent]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-bangla text-ink">
            শিক্ষার্থী ব্যবস্থাপনা (Student Directory)
          </h2>
          <p className="text-xs text-muted font-bangla">
            সকল শ্রেণির শিক্ষার্থীদের তথ্য সংরক্ষণ, আইডি কার্ড প্রস্তুত ও পর্যালোচনা
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setShowExcelModal(true)}
            className="flex-1 sm:flex-none bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow font-bangla cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>এক্সেল বাল্ক আপলোড</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex-1 sm:flex-none bg-primary hover:bg-primary-hover text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow font-bangla cursor-pointer"
          >
            <Plus className="w-4 h-4 text-accent" />
            <span>নতুন শিক্ষার্থী ভর্তি করুন</span>
          </button>
        </div>
      </div>

      {/* Action Success Notification */}
      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bangla flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-line shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Class Filter */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto font-bangla text-xs">
          <span className="text-muted font-medium mr-1">শ্রেণি:</span>
          {['all', '10', '9', '8', '7', '6'].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedClass === cls
                  ? 'bg-primary text-white shadow'
                  : 'bg-bg text-muted hover:bg-line'
              }`}
            >
              {cls === 'all' ? 'সকল শ্রেণি' : `${cls} শ্রেণি`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="রোল, নাম বা আইডি খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-line text-xs focus:ring-2 focus:ring-primary font-bangla"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-line shadow-2xs overflow-hidden">
        {/* Desktop & Tablet Table (>= sm) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs font-bangla">
            <thead className="bg-deep text-white uppercase text-[11px] font-bold">
              <tr>
                <th className="py-3 px-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someFilteredSelected && !allFilteredSelected;
                    }}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-primary rounded border-line focus:ring-accent cursor-pointer accent-primary"
                    title="সকল শিক্ষার্থী নির্বাচন করুন"
                  />
                </th>
                <th className="py-3 px-3 text-center">রোল</th>
                <th className="py-3 px-3">আইডি</th>
                <th className="py-3 px-3">শিক্ষার্থীর নাম</th>
                <th className="py-3 px-3">শ্রেণি ও শাখা</th>
                <th className="py-3 px-3">বিভাগ</th>
                <th className="py-3 px-3">অভিভাবকের নাম ও মোবাইল</th>
                <th className="py-3 px-3 text-center">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((stu) => (
                  <tr key={stu.id} className={`hover:bg-bg transition ${selectedIds.has(stu.id) ? 'bg-primary/5' : ''}`}>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(stu.id)}
                        onChange={() => toggleSelectOne(stu.id)}
                        className="w-4 h-4 text-primary rounded border-line focus:ring-accent cursor-pointer accent-primary"
                      />
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-ink bg-bg">
                      {stu.roll}
                    </td>
                    <td className="py-3 px-3 font-mono text-muted">{stu.studentId}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-9 rounded-md border border-line bg-bg overflow-hidden shrink-0 flex items-center justify-center">
                          {stu.photo ? (
                            <img src={stu.photo} alt={stu.nameBn} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-bold text-muted font-sans uppercase">
                              {(stu.nameEn || stu.nameBn || 'S').charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-ink block">{stu.nameBn}</span>
                          <span className="text-[10px] text-muted uppercase font-mono">{stu.nameEn}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-ink">
                      {stu.class} শ্রেণি (শাখা {stu.section})
                    </td>
                    <td className="py-3 px-3 font-medium text-primary">{stu.group}</td>
                    <td className="py-3 px-3">
                      <span className="text-ink block">{stu.guardianName}</span>
                      <span className="text-muted font-mono text-[11px]">{stu.guardianPhone}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setActiveIdCardStudent(stu)}
                          className="p-1.5 bg-soft text-deep hover:bg-soft rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          title="Generate Student ID Card"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-primary" />
                          <span className="hidden sm:inline">আইডি কার্ড</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingStudent({ ...stu });
                            setEditError('');
                          }}
                          className="p-1.5 bg-bg hover:bg-line text-ink rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          title="তথ্য ও ছবি সম্পাদনা করুন"
                        >
                          <Edit className="w-3.5 h-3.5 text-primary" />
                          <span className="hidden sm:inline">এডিট</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`আপনি কি "${stu.nameBn}" এর তথ্য মুছে ফেলতে নিশ্চিত?`)) {
                              deleteStudent(stu.id);
                            }
                          }}
                          className="p-1.5 text-danger hover:bg-danger-soft rounded-lg transition cursor-pointer"
                          title="Delete Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-muted">
                    কোনো শিক্ষার্থী পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout (< sm) (N5) */}
        <div className="block sm:hidden divide-y divide-line">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((stu) => (
              <div key={stu.id} className={`p-4 space-y-2 hover:bg-bg transition ${selectedIds.has(stu.id) ? 'bg-primary/5' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(stu.id)}
                      onChange={() => toggleSelectOne(stu.id)}
                      className="w-4 h-4 text-primary rounded border-line focus:ring-accent cursor-pointer accent-primary"
                    />
                    <span className="font-mono font-bold text-xs bg-bg px-2.5 py-1 rounded-md text-ink">
                      রোল: {stu.roll}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-muted">
                    ID: {stu.studentId}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-11 rounded-lg border border-line bg-bg overflow-hidden shrink-0 flex items-center justify-center">
                    {stu.photo ? (
                      <img src={stu.photo} alt={stu.nameBn} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-muted font-sans uppercase">
                        {(stu.nameEn || stu.nameBn || 'S').charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-ink text-sm">{stu.nameBn}</h4>
                    <p className="text-[10px] text-muted uppercase font-mono">{stu.nameEn}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted bg-bg p-2.5 rounded-lg border border-line">
                  <span>{stu.class} শ্রেণি (শাখা {stu.section})</span>
                  <span className="font-semibold text-primary">{stu.group}</span>
                </div>

                <div className="text-xs text-muted">
                  <span className="block font-medium">অভিভাবক: {stu.guardianName}</span>
                  <span className="font-mono text-muted text-[11px]">{stu.guardianPhone}</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
                  <button
                    onClick={() => setActiveIdCardStudent(stu)}
                    className="px-2.5 py-1.5 bg-soft text-deep hover:bg-soft rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-primary" />
                    <span>আইডি কার্ড</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingStudent({ ...stu });
                      setEditError('');
                    }}
                    className="px-2.5 py-1.5 bg-bg hover:bg-line text-ink rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-primary" />
                    <span>এডিট</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`আপনি কি "${stu.nameBn}" এর তথ্য মুছে ফেলতে নিশ্চিত?`)) {
                        deleteStudent(stu.id);
                      }
                    }}
                    className="p-1.5 text-danger hover:bg-danger-soft rounded-lg transition cursor-pointer"
                    title="Delete Student"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-muted text-xs font-bangla">
              কোনো শিক্ষার্থী পাওয়া যায়নি।
            </div>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-2xl overflow-y-auto max-h-[92vh] shadow-2xl border border-line p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold font-bangla text-ink text-base">
                নতুন শিক্ষার্থী নিবন্ধন ফরম
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-muted hover:text-ink">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-bangla">
              {/* Photo Upload in Add Student Modal */}
              <div className="p-3 bg-bg rounded-xl border border-line flex items-center gap-3">
                <div className="w-16 h-20 rounded-lg border-2 border-dashed border-primary/40 bg-white overflow-hidden shrink-0 flex items-center justify-center">
                  {newStudent.photo ? (
                    <img src={newStudent.photo} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-1 text-muted">
                      <Camera className="w-5 h-5 mx-auto text-muted/60 mb-0.5" />
                      <span className="text-[9px] block">ছবি</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <span className="font-bold text-ink block text-xs">শিক্ষার্থীর পাসপোর্ট সাইজ ছবি (ঐচ্ছিক)</span>
                  <p className="text-[10px] text-muted">আপলোডকৃত ছবিটি স্বয়ংক্রিয়ভাবে শিক্ষার্থীর আইডি কার্ডে প্রদর্শিত হবে।</p>
                  <div className="pt-0.5 flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-line text-xs font-bold text-primary hover:bg-soft cursor-pointer shadow-2xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{newStudent.photo ? 'ছবি পরিবর্তন' : 'ছবি আপলোড'}</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={(e) => handlePhotoUpload(e, 'new')}
                        className="hidden"
                      />
                    </label>
                    {newStudent.photo && (
                      <button
                        type="button"
                        onClick={() => setNewStudent(prev => ({ ...prev, photo: '' }))}
                        className="text-danger hover:underline text-[11px] font-bold"
                      >
                        মুছে ফেলুন
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">শ্রেণি *</label>
                  <select
                    value={newStudent.class}
                    onChange={(e) => {
                      const cls = e.target.value;
                      const nextR = getNextRollForClass(cls);
                      const grp = ['9', '10'].includes(cls) ? (newStudent.group === 'General' ? 'Science' : newStudent.group) : 'General';
                      setNewStudent({ ...newStudent, class: cls, roll: nextR, group: grp });
                    }}
                    className="w-full rounded-lg border border-line p-2 bg-white"
                  >
                    <option value="10">১০ম শ্রেণি</option>
                    <option value="9">৯ম শ্রেণি</option>
                    <option value="8">৮ম শ্রেণি</option>
                    <option value="7">৭ম শ্রেণি</option>
                    <option value="6">৬ষ্ঠ শ্রেণি</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">রোল নম্বর *</label>
                  <input
                    type="number"
                    required
                    value={newStudent.roll}
                    onChange={(e) => setNewStudent({ ...newStudent, roll: e.target.value })}
                    placeholder="রোল নম্বর"
                    className="w-full rounded-lg border border-line p-2 font-mono"
                  />
                  <span className="text-[10px] text-muted block mt-0.5">এই শ্রেণির পরবর্তী সম্ভাব্য রোল: {getNextRollForClass(newStudent.class)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">শিক্ষার্থীর নাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.nameBn}
                    onChange={(e) => setNewStudent({ ...newStudent, nameBn: e.target.value })}
                    placeholder="নাম লিখুন (শুধুমাত্র বাংলা)"
                    className="w-full rounded-lg border border-line p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">শিক্ষার্থীর নাম (ইংরেজি) *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.nameEn}
                    onChange={(e) => setNewStudent({ ...newStudent, nameEn: e.target.value })}
                    placeholder="Student Name in English"
                    className="w-full uppercase rounded-lg border border-line p-2 font-mono"
                  />
                </div>
              </div>

              {/* শাখা, বিভাগ ও লিঙ্গ (Senior QA M5 fix) */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">শাখা *</label>
                  <select
                    value={newStudent.section}
                    onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                    className="w-full rounded-lg border border-line p-2 bg-white font-mono"
                  >
                    <option value="A">A শাখা</option>
                    <option value="B">B শাখা</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">বিভাগ (গ্রুপ) *</label>
                  {['9', '10'].includes(newStudent.class) ? (
                    <select
                      value={newStudent.group}
                      onChange={(e) => setNewStudent({ ...newStudent, group: e.target.value })}
                      className="w-full rounded-lg border border-line p-2 bg-white"
                    >
                      <option value="Science">বিজ্ঞান (Science)</option>
                      <option value="Business Studies">ব্যবসায় শিক্ষা (Commerce)</option>
                      <option value="Humanities">মানবিক (Humanities)</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      value="সাধারণ (General)"
                      className="w-full rounded-lg border border-line p-2 bg-slate-100 text-muted"
                    />
                  )}
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">লিঙ্গ *</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                    className="w-full rounded-lg border border-line p-2 bg-white"
                  >
                    <option value="Male">ছাত্র (Male)</option>
                    <option value="Female">ছাত্রী (Female)</option>
                  </select>
                </div>
              </div>

              {/* জন্মতারিখ ও অভিভাবকের তথ্য (Senior QA M5 fix) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">জন্মতারিখ</label>
                  <input
                    type="date"
                    value={newStudent.dob}
                    onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })}
                    className="w-full rounded-lg border border-line p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">অভিভাবকের নাম</label>
                  <input
                    type="text"
                    value={newStudent.guardianName}
                    onChange={(e) => setNewStudent({ ...newStudent, guardianName: e.target.value })}
                    placeholder="পিতা / মাতার নাম"
                    className="w-full rounded-lg border border-line p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">অভিভাবকের মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={newStudent.guardianPhone}
                    onChange={(e) => setNewStudent({ ...newStudent, guardianPhone: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="w-full rounded-lg border border-line p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">ঠিকানা / গ্রাম</label>
                  <input
                    type="text"
                    value={newStudent.address}
                    onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                    placeholder="গ্রাম ও পোস্ট অফিস"
                    className="w-full rounded-lg border border-line p-2"
                  />
                </div>
              </div>

              {formError && (
                <div className="p-3 bg-danger-soft text-danger rounded-xl text-xs font-semibold flex items-center gap-2 border border-danger-soft">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormError('');
                  }}
                  className="px-4 py-2 bg-line text-ink rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white font-bold rounded-lg shadow"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-2xl overflow-y-auto max-h-[92vh] shadow-2xl border border-line p-5 sm:p-6 space-y-4 font-bangla">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-ink text-base">
                  শিক্ষার্থীর তথ্য ও ছবি সম্পাদনা (Edit Profile)
                </h3>
                <p className="text-[11px] text-muted font-mono">
                  ID: {editingStudent.studentId}
                </p>
              </div>
              <button 
                onClick={() => {
                  setEditingStudent(null);
                  setEditError('');
                }} 
                className="text-muted hover:text-ink cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* Photo Upload & Preview in Edit Modal */}
              <div className="p-3.5 bg-bg rounded-xl border border-line flex items-center gap-4">
                <div className="w-16 h-20 rounded-xl border-2 border-primary/40 bg-white overflow-hidden shrink-0 shadow-xs flex items-center justify-center">
                  {editingStudent.photo ? (
                    <img 
                      src={editingStudent.photo} 
                      alt="Student" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="text-center p-1 text-muted">
                      <Camera className="w-6 h-6 mx-auto text-muted/60 mb-0.5" />
                      <span className="text-[9px] block">ছবি নেই</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <span className="font-bold text-ink block text-xs">শিক্ষার্থীর পাসপোর্ট সাইজ ছবি</span>
                  <p className="text-[11px] text-muted">
                    নতুন ছবি আপলোড করলে তা স্বয়ংক্রিয়ভাবে শিক্ষার্থীর আইডি কার্ডে প্রদর্শিত হবে।
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-line text-xs font-bold text-primary hover:bg-soft cursor-pointer shadow-2xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{editingStudent.photo ? 'নতুন ছবি আপলোড করুন' : 'ছবি আপলোড করুন'}</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={(e) => handlePhotoUpload(e, 'edit')}
                        className="hidden"
                      />
                    </label>
                    {editingStudent.photo && (
                      <button
                        type="button"
                        onClick={() => setEditingStudent(prev => prev ? ({ ...prev, photo: '' }) : null)}
                        className="text-danger hover:underline text-xs font-bold cursor-pointer"
                      >
                        ছবি সরান
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">শিক্ষার্থীর নাম (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.nameBn || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, nameBn: e.target.value })}
                    className="w-full rounded-lg border border-line p-2 bg-white text-ink"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">শিক্ষার্থীর নাম (English)</label>
                  <input
                    type="text"
                    value={editingStudent.nameEn || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, nameEn: e.target.value.toUpperCase() })}
                    className="w-full rounded-lg border border-line p-2 bg-white text-ink font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">শ্রেণি *</label>
                  <select
                    value={editingStudent.class}
                    onChange={(e) => {
                      const cls = e.target.value;
                      const grp = ['9', '10'].includes(cls) ? (editingStudent.group === 'General' ? 'Science' : editingStudent.group) : 'General';
                      setEditingStudent({ ...editingStudent, class: cls, group: grp });
                    }}
                    className="w-full rounded-lg border border-line p-2 bg-white"
                  >
                    <option value="10">১০ম শ্রেণি</option>
                    <option value="9">৯ম শ্রেণি</option>
                    <option value="8">৮ম শ্রেণি</option>
                    <option value="7">৭ম শ্রেণি</option>
                    <option value="6">৬ষ্ঠ শ্রেণি</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">রোল নম্বর *</label>
                  <input
                    type="number"
                    required
                    value={editingStudent.roll || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, roll: e.target.value })}
                    className="w-full rounded-lg border border-line p-2 font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">শাখা (Section)</label>
                  <input
                    type="text"
                    value={editingStudent.section || 'A'}
                    onChange={(e) => setEditingStudent({ ...editingStudent, section: e.target.value })}
                    className="w-full rounded-lg border border-line p-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">বিভাগ (Group)</label>
                  {['9', '10'].includes(editingStudent.class) ? (
                    <select
                      value={editingStudent.group || 'Science'}
                      onChange={(e) => setEditingStudent({ ...editingStudent, group: e.target.value })}
                      className="w-full rounded-lg border border-line p-2 bg-white"
                    >
                      <option value="Science">বিজ্ঞান (Science)</option>
                      <option value="Business Studies">ব্যবসায় শিক্ষা (Business Studies)</option>
                      <option value="Humanities">মানবিক (Humanities)</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      value="General"
                      className="w-full rounded-lg border border-line p-2 bg-bg text-muted cursor-not-allowed"
                    />
                  )}
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">লিঙ্গ</label>
                  <select
                    value={editingStudent.gender || 'Male'}
                    onChange={(e) => setEditingStudent({ ...editingStudent, gender: e.target.value })}
                    className="w-full rounded-lg border border-line p-2 bg-white"
                  >
                    <option value="Male">ছাত্র (Male)</option>
                    <option value="Female">ছাত্রী (Female)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">রক্তের গ্রুপ</label>
                  <input
                    type="text"
                    value={editingStudent.bloodGroup || ''}
                    placeholder="যেমন: B+, O+"
                    onChange={(e) => setEditingStudent({ ...editingStudent, bloodGroup: e.target.value })}
                    className="w-full rounded-lg border border-line p-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">অভিভাবকের নাম</label>
                  <input
                    type="text"
                    value={editingStudent.guardianName || editingStudent.fatherName || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, guardianName: e.target.value })}
                    className="w-full rounded-lg border border-line p-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">অভিভাবকের মোবাইল (১১ ডিজিট)</label>
                  <input
                    type="text"
                    value={editingStudent.guardianPhone || ''}
                    placeholder="01819204561"
                    onChange={(e) => setEditingStudent({ ...editingStudent, guardianPhone: e.target.value })}
                    className="w-full rounded-lg border border-line p-2 font-mono bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-ink mb-1">ঠিকানা</label>
                  <input
                    type="text"
                    value={editingStudent.address || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, address: e.target.value })}
                    className="w-full rounded-lg border border-line p-2 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setEditingStudent(null);
                    setEditError('');
                  }}
                  className="px-4 py-2 bg-line hover:bg-line/80 text-ink rounded-lg font-bold cursor-pointer transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg shadow cursor-pointer transition"
                >
                  পরিবর্তনসমূহ সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student ID Card Modal (Official & Printable via Portal - Senior QA H1) */}
      {typeof document !== 'undefined' && activeIdCardStudent && createPortal(
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 print:static print:inset-auto print:p-0 print:m-0 print:bg-transparent print:backdrop-blur-none print:block print:w-full print:h-auto"
        >
          <div className="bg-white max-w-sm w-full rounded-3xl overflow-y-auto max-h-[92vh] shadow-2xl border border-line print:max-w-full print:shadow-none print:border-none print:rounded-none print:m-0 print:max-h-none print:static">
            {/* Modal Controls */}
            <div className="bg-ink text-white p-3 flex justify-between items-center text-xs no-print print:hidden">
              <span className="font-semibold">ডিজিটাল স্টুডেন্ট আইডি কার্ড</span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrintIdCard}
                  className="bg-primary hover:bg-soft text-white px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট</span>
                </button>
                <button
                  onClick={() => setActiveIdCardStudent(null)}
                  className="text-muted hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Official ID Card Layout */}
            <div className="p-6 bg-gradient-to-b from-deep via-deep to-deep text-white text-center space-y-4 rounded-b-3xl relative overflow-hidden print:p-4 print:rounded-none print:block print:w-[320px] print:mx-auto" id="student-id-card">
              <div className="absolute top-0 left-0 right-0 h-2 bg-accent"></div>

              {/* School Emblem & Name */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow ring-1 ring-accent mb-1 shrink-0">
                  <SchoolLogo logo={schoolInfo.logo} />
                </div>
                <h3 className="text-base font-extrabold font-bangla text-white leading-tight">
                  {schoolInfo.nameBn}
                </h3>
                <p className="text-[10px] text-white/95 font-mono font-medium">
                  EIIN: {schoolInfo.eiin} • ফুলগাজী, ফেনী
                </p>
                <span className="inline-block bg-accent text-deep text-[9px] font-bold px-2 py-0.2 rounded-full uppercase mt-1">
                  STUDENT IDENTITY CARD
                </span>
              </div>

              {/* Student Photo */}
              <div className="w-24 h-24 mx-auto rounded-2xl bg-white p-1 shadow-lg ring-2 ring-accent/80 overflow-hidden flex items-center justify-center">
                <img
                  src={activeIdCardStudent.photo || activeIdCardStudent.studentPhoto || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80"}
                  alt={activeIdCardStudent.nameBn || "Student"}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Photo Change Option on ID card */}
              <div className="no-print print:hidden">
                <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-accent rounded-lg text-[10px] font-bangla font-bold border border-white/20 cursor-pointer transition">
                  <Camera className="w-3.5 h-3.5" />
                  <span>{activeIdCardStudent.photo ? 'আইডি কার্ডের ছবি পরিবর্তন করুন' : 'ছবি যুক্ত করুন'}</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (!file.type.startsWith('image/')) {
                        alert('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WebP) নির্বাচন করুন।');
                        return;
                      }
                      if (file.size > 2 * 1024 * 1024) {
                        alert('ছবির সাইজ সর্বোচ্চ ২ মেগাবাইট (2MB) হতে পারবে।');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const dataUrl = ev.target?.result;
                        if (typeof dataUrl === 'string') {
                          if (updateStudent) {
                            updateStudent(activeIdCardStudent.id, { photo: dataUrl });
                          }
                          setActiveIdCardStudent(prev => prev ? ({ ...prev, photo: dataUrl }) : null);
                          setActionSuccess('আইডি কার্ডের ছবি সফলভাবে আপডেট করা হয়েছে!');
                          setTimeout(() => setActionSuccess(''), 5000);
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>

              {/* Student Name & ID */}
              <div>
                <h4 className="text-sm font-bold font-bangla text-accent">
                  {activeIdCardStudent.nameBn}
                </h4>
                <p className="text-xs text-white uppercase font-mono font-bold tracking-wide">
                  {activeIdCardStudent.nameEn}
                </p>
                <p className="text-[11px] font-mono text-white/95 mt-0.5 font-medium">
                  ID: {activeIdCardStudent.studentId}
                </p>
              </div>

              {/* Metadata Table */}
              <div className="bg-deep/80 p-3 rounded-xl border border-primary text-left text-xs font-bangla space-y-1">
                <div className="flex justify-between">
                  <span className="text-white/90 font-medium">শ্রেণি:</span>
                  <span className="font-bold text-white">{activeIdCardStudent.class} শ্রেণি</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/90 font-medium">রোল নম্বর:</span>
                  <span className="font-mono font-bold text-accent">{activeIdCardStudent.roll}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/90 font-medium">বিভাগ (গ্রুপ):</span>
                  <span className="font-bold text-white">{activeIdCardStudent.group}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/90 font-medium">মোবাইল:</span>
                  <span className="font-mono text-soft text-[11px]">{activeIdCardStudent.guardianPhone}</span>
                </div>
              </div>

              {/* Principal Signature */}
              <div className="pt-2 flex justify-between items-end border-t border-primary text-[10px]">
                <span className="text-soft font-mono">Session: 2026</span>
                <div className="text-center">
                  <span className="font-serif italic text-accent font-bold text-xs block">
                    {signatories.headmaster.signature}
                  </span>
                  <span className="text-white/90 font-medium">{signatories.headmaster.designationBn}</span>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Sticky Floating Action Bar for Selected Students */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-deep/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 sm:gap-4 text-xs font-bangla animate-bounce-short">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold whitespace-nowrap">
              {toBanglaNumerals(selectedIds.size)} জন নির্বাচিত
            </span>
          </div>

          <div className="h-4 w-px bg-white/20" />

          <button
            onClick={handleExportSelected}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold transition cursor-pointer"
            title="নির্বাচিত শিক্ষার্থীদের এক্সেলে এক্সপোর্ট করুন"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">এক্সেলে ডাউনলোড</span>
            <span className="sm:hidden">এক্সেল</span>
          </button>

          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold transition cursor-pointer"
            title="নির্বাচিত শিক্ষার্থীদের মুছে ফেলুন"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">একসাথে মুছুন</span>
            <span className="sm:hidden">মুছুন</span>
          </button>

          <button
            onClick={() => setSelectedIds(new Set())}
            className="p-1 rounded-lg text-white/70 hover:text-white transition cursor-pointer"
            title="নির্বাচন বাতিল করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Excel Bulk Upload Modal */}
      {showExcelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl border border-line flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-line flex items-center justify-between bg-bg">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold font-bangla text-ink text-sm sm:text-base">
                    এক্সেল থেকে শিক্ষার্থী বাল্ক আপলোড (Excel Bulk Upload)
                  </h3>
                  <p className="text-[11px] text-muted font-bangla">
                    এক্সেলে তৈরি তালিকা সরাসরি সিস্টেমে আপলোড করে একসাথে একাধিক শিক্ষার্থী যুক্ত করুন
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowExcelModal(false);
                  setExcelFile(null);
                  setParsedStudents([]);
                  setParseErrors([]);
                }}
                className="text-muted hover:text-ink p-1 rounded-lg hover:bg-line/40 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 font-bangla text-xs">
              {/* Quick Action Buttons: Template & Info */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-soft/50 rounded-xl border border-line">
                <button
                  type="button"
                  onClick={() => setShowInfoModal(true)}
                  className="inline-flex items-center gap-1.5 text-primary hover:text-deep font-bold transition cursor-pointer"
                >
                  <Info className="w-4 h-4 text-primary" />
                  <span>কলামের নিয়ম ও তথ্য নির্দেশিকা (i)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-100" />
                  <span>নমুনা এক্সেল টেমপ্লেট ডাউনলোড</span>
                </button>
              </div>

              {/* Upload Drag & Drop Box */}
              <div className="border-2 border-dashed border-line hover:border-primary/50 rounded-2xl p-6 text-center bg-bg/50 transition">
                <input
                  type="file"
                  id="student-excel-file-input"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="student-excel-file-input"
                  className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                >
                  <div className="p-3 bg-primary/10 text-primary rounded-full">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-ink text-sm">
                    {excelFile ? excelFile.name : 'এক্সেল ফাইল নির্বাচন করতে ক্লিক করুন বা ড্র্যাগ করুন'}
                  </span>
                  <span className="text-[11px] text-muted">
                    শুধুমাত্র .xlsx বা .xls ফরম্যাটের ফাইল গ্রহণযোগ্য
                  </span>
                </label>
              </div>

              {/* Loading Indicator */}
              {isProcessing && (
                <div className="p-4 text-center text-primary font-bold animate-pulse">
                  এক্সেল ফাইলের ডেটা যাচাই করা হচ্ছে...
                </div>
              )}

              {/* Parse Errors Alert */}
              {parseErrors.length > 0 && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-900">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>ফাইলে কিছু অসঙ্গতি রয়েছে:</span>
                  </div>
                  <ul className="list-disc pl-5 text-[11px] space-y-0.5">
                    {parseErrors.slice(0, 5).map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                    {parseErrors.length > 5 && (
                      <li className="font-bold">... এবং আরও {toBanglaNumerals(parseErrors.length - 5)}টি ত্রুটি রয়েছে।</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Parsed Students Preview */}
              {parsedStudents.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-ink">
                    <span className="flex items-center gap-1.5 text-emerald-800">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      মোট {toBanglaNumerals(parsedStudents.length)} জন শিক্ষার্থী আপলোডের জন্য প্রস্তুত
                    </span>
                    <span className="text-[11px] text-muted">প্রথম ৫ জনের প্রিভিউ</span>
                  </div>

                  <div className="border border-line rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-bg text-muted font-bold">
                        <tr>
                          <th className="p-2 text-center">রোল</th>
                          <th className="p-2">নাম (বাংলা)</th>
                          <th className="p-2">শ্রেণি</th>
                          <th className="p-2">শাখা</th>
                          <th className="p-2">মোবাইল</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {parsedStudents.slice(0, 5).map((s, idx) => (
                          <tr key={idx} className="hover:bg-bg/50">
                            <td className="p-2 text-center font-mono font-bold">{s.roll}</td>
                            <td className="p-2 font-bold text-ink">{s.nameBn}</td>
                            <td className="p-2">{s.class} শ্রেণি</td>
                            <td className="p-2">{s.section}</td>
                            <td className="p-2 font-mono text-muted">{s.guardianPhone}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-line bg-bg flex items-center justify-end gap-2 font-bangla text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowExcelModal(false);
                  setExcelFile(null);
                  setParsedStudents([]);
                  setParseErrors([]);
                }}
                className="px-4 py-2 rounded-xl bg-white border border-line text-muted hover:text-ink font-bold transition cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                disabled={parsedStudents.length === 0 || isProcessing}
                onClick={handleConfirmBulkSave}
                className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold transition shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>
                  সকল শিক্ষার্থী ডাটাবেজে যুক্ত করুন ({toBanglaNumerals(parsedStudents.length)})
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Guide Modal (i) */}
      {showInfoModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl border border-line flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-line flex items-center justify-between bg-bg">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Info className="w-4 h-4" />
                </div>
                <h3 className="font-bold font-bangla text-ink text-sm sm:text-base">
                  এক্সেল কলাম নির্দেশিকা ও নিয়মাবলি
                </h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-muted hover:text-ink p-1 rounded-lg hover:bg-line/40 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 font-bangla text-xs text-ink leading-relaxed">
              <p className="text-muted">
                বাল্ক আপলোডের জন্য নিচের কলামগুলো আপনার এক্সেলে রাখুন। কলামের নাম বাংলা বা ইংরেজিতে হতে পারে:
              </p>

              <div className="space-y-2 border border-line rounded-xl p-3 bg-bg/50">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary min-w-[90px]">১. রোল (Roll):</span>
                  <span className="text-muted">আবশ্যক। ধনাত্মক পূর্ণসংখ্যা (যেমন: ১, ২, ১০)। একই শ্রেণির রোল পুনরাবৃত্তি করা যাবে না।</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary min-w-[90px]">২. নাম (Name):</span>
                  <span className="text-muted">আবশ্যক। বাংলা বা ইংরেজি নাম যেকোনো একটি থাকলেই চলবে।</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary min-w-[90px]">৩. শ্রেণি (Class):</span>
                  <span className="text-muted">৬, ৭, ৮, ৯ বা ১০। ফাইলে শ্রেণি উল্লেখ না থাকলে নির্বাচিত শ্রেণির ডিফল্ট মান বসবে।</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary min-w-[90px]">৪. শাখা (Section):</span>
                  <span className="text-muted">যেমন: A, B (না দিলে স্বয়ংক্রিয়ভাবে A নির্ধারিত হবে)।</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary min-w-[90px]">৫. বিভাগ (Group):</span>
                  <span className="text-muted">৯ম ও ১০ম শ্রেণির জন্য: Science, Business, বা Humanities।</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary min-w-[90px]">৬. মোবাইল:</span>
                  <span className="text-muted">অভিভাবকের ১১ ডিজিটের মোবাইল নম্বর (যেমন: 01819204561)।</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-primary min-w-[90px]">৭. অন্যান্য:</span>
                  <span className="text-muted">পিতার নাম, মাতার নাম, রক্তের গ্রুপ, জন্মতারিখ ও ঠিকানা (ঐচ্ছিক)।</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px]">
                💡 <strong>পরামর্শ:</strong> সহজে এবং ত্রুটিহীনভাবে আপলোড করতে সরাসরি আমাদের তৈরি নমুনা টেমপ্লেট ডাউনলোড করে পূরণ করুন।
              </div>
            </div>

            <div className="p-4 border-t border-line bg-bg flex items-center justify-between gap-2 font-bangla text-xs">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>নমুনা টেমপ্লেট ডাউনলোড</span>
              </button>
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 rounded-xl bg-white border border-line text-muted hover:text-ink font-bold transition cursor-pointer"
              >
                বুঝেছি
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
