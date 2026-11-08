import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useSchool } from '../../context/useSchool';
import { toBanglaNumerals, toEnglishNumerals } from '../../utils/dateFormatter';
import { calculateSubjectGrade, calculateOverallGrade } from '../../utils/gradeCalculator';
import { 
  Award, 
  CheckCircle,
  AlertCircle,
  UserCheck,
  Trash2,
  Edit,
  FileSpreadsheet,
  Info,
  Download,
  FileUp,
  X,
  FileCheck,
  Plus
} from 'lucide-react';

const SUBJECT_CONFIGS = {
  general: [
    { code: '101', name: 'Bangla', labelBn: 'বাংলা', max: 100 },
    { code: '107', name: 'English', labelBn: 'ইংরেজি', max: 100 },
    { code: '109', name: 'Mathematics', labelBn: 'গণিত', max: 100 },
    { code: '127', name: 'General Science', labelBn: 'সাধারণ বিজ্ঞান', max: 100 },
    { code: '150', name: 'BGS', labelBn: 'বাংলাদেশ ও বিশ্বপরিচয়', max: 100 },
    { code: '154', name: 'ICT', labelBn: 'তথ্য ও যোগাযোগ প্রযুক্তি', max: 50 },
    { code: '111', name: 'Religion', labelBn: 'ধর্ম ও নৈতিক শিক্ষা', max: 100 },
  ],
  secondary: {
    Science: [
      { code: '101', name: 'Bangla', labelBn: 'বাংলা', max: 100 },
      { code: '107', name: 'English', labelBn: 'ইংরেজি', max: 100 },
      { code: '109', name: 'Mathematics', labelBn: 'গণিত', max: 100 },
      { code: '136', name: 'Physics', labelBn: 'পদার্থবিজ্ঞান', max: 100 },
      { code: '137', name: 'Chemistry', labelBn: 'রসায়ন', max: 100 },
      { code: '138', name: 'Biology', labelBn: 'জীববিজ্ঞান', max: 100 },
      { code: '154', name: 'ICT', labelBn: 'তথ্য ও যোগাযোগ প্রযুক্তি', max: 50 },
      { code: '111', name: 'Religion', labelBn: 'ধর্ম ও নৈতিক শিক্ষা', max: 100 },
    ],
    'Business Studies': [
      { code: '101', name: 'Bangla', labelBn: 'বাংলা', max: 100 },
      { code: '107', name: 'English', labelBn: 'ইংরেজি', max: 100 },
      { code: '109', name: 'Mathematics', labelBn: 'গণিত', max: 100 },
      { code: '146', name: 'Accounting', labelBn: 'হিসাববিজ্ঞান', max: 100 },
      { code: '147', name: 'Business Ent.', labelBn: 'ব্যবসায় উদ্যোগ', max: 100 },
      { code: '148', name: 'Finance & Banking', labelBn: 'ফিন্যান্স ও ব্যাংকিং', max: 100 },
      { code: '154', name: 'ICT', labelBn: 'তথ্য ও যোগাযোগ প্রযুক্তি', max: 50 },
      { code: '111', name: 'Religion', labelBn: 'ধর্ম ও নৈতিক শিক্ষা', max: 100 },
    ],
    Humanities: [
      { code: '101', name: 'Bangla', labelBn: 'বাংলা', max: 100 },
      { code: '107', name: 'English', labelBn: 'ইংরেজি', max: 100 },
      { code: '109', name: 'Mathematics', labelBn: 'গণিত', max: 100 },
      { code: '153', name: 'History', labelBn: 'ইতিহাস', max: 100 },
      { code: '110', name: 'Geography', labelBn: 'ভূগোল', max: 100 },
      { code: '140', name: 'Civics', labelBn: 'পৌরনীতি ও নাগরিকতা', max: 100 },
      { code: '154', name: 'ICT', labelBn: 'তথ্য ও যোগাযোগ প্রযুক্তি', max: 50 },
      { code: '111', name: 'Religion', labelBn: 'ধর্ম ও নৈতিক শিক্ষা', max: 100 },
    ],
  },
};

const normalizeKey = (key = '') => {
  return String(key).trim().toLowerCase().replace(/[\s_\-()/\\.]+/g, '');
};

const findSubjectMark = (row, sub) => {
  const targetKeys = [
    normalizeKey(sub.name),
    normalizeKey(sub.labelBn),
    normalizeKey(sub.code),
    ...(sub.name === 'Mathematics' ? ['math', 'gonit', 'গণিত', 'সাধারণগণিত'] : []),
    ...(sub.name === 'Bangla' ? ['bangla', 'bengali', 'বাংলা', 'বাংলা১ম', 'বাংলা২য়'] : []),
    ...(sub.name === 'English' ? ['english', 'ইংরেজি', 'ইংরেজী', 'ইংরেজি১ম', 'ইংরেজি২য়'] : []),
    ...(sub.name === 'General Science' ? ['science', 'generalscience', 'বিজ্ঞান', 'সাধারণবিজ্ঞান'] : []),
    ...(sub.name === 'BGS' ? ['bgs', 'bangladeshandglobalstudies', 'বাংলাদেশওবিশ্বপরিচয়', 'সমাজ', 'সমাজবিজ্ঞান'] : []),
    ...(sub.name === 'ICT' ? ['ict', 'informationtechnology', 'তথ্যওযোগাযোগপ্রযুক্তি', 'তথ্যপ্রযুক্তি', 'কম্পিউটার'] : []),
    ...(sub.name === 'Religion' ? ['religion', 'islam', 'hindu', 'ধর্ম', 'ধর্মওনৈতিকশিক্ষা', 'ইসলাম', 'হিন্দুধর্ম'] : []),
    ...(sub.name === 'Physics' ? ['physics', 'পদার্থ', 'পদার্থবিজ্ঞান'] : []),
    ...(sub.name === 'Chemistry' ? ['chemistry', 'রসায়ন', 'রসায়ন'] : []),
    ...(sub.name === 'Biology' ? ['biology', 'জীববিজ্ঞান'] : []),
    ...(sub.name === 'Accounting' ? ['accounting', 'হিসাববিজ্ঞান'] : []),
    ...(sub.name === 'Business Ent.' ? ['business', 'businessent', 'businessentrepreneurship', 'ব্যবসায়উদ্যোগ', 'উদ্যোগ'] : []),
    ...(sub.name === 'Finance & Banking' ? ['finance', 'financeandbanking', 'ফিন্যান্সওব্যাংকিং', 'ফিন্যান্স'] : []),
    ...(sub.name === 'History' ? ['history', 'ইতিহাস'] : []),
    ...(sub.name === 'Geography' ? ['geography', 'ভূগোল'] : []),
    ...(sub.name === 'Civics' ? ['civics', 'পৌরনীতি', 'পৌরনীতিওনাগরিকতা'] : [])
  ];

  for (const [k, v] of Object.entries(row)) {
    if (v === '' || v === null || v === undefined) continue;
    const normK = normalizeKey(k);
    if (targetKeys.some(tk => normK === tk || normK.startsWith(tk) || tk.startsWith(normK))) {
      const num = Number(toEnglishNumerals(String(v).trim()));
      if (!isNaN(num)) return num;
    }
  }
  return null;
};

const findRoll = (row) => {
  for (const [k, v] of Object.entries(row)) {
    if (v === '' || v === null || v === undefined) continue;
    const normK = normalizeKey(k);
    if (['roll', 'rollno', 'studentroll', 'রোল', 'রোলনম্বর', 'রোলনং'].includes(normK)) {
      const clean = toEnglishNumerals(String(v).trim());
      if (clean) return clean;
    }
  }
  return null;
};

export default function ResultManager() {
  const { 
    results, 
    addResult, 
    bulkAddResults, 
    deleteResult, 
    students, 
    availableExams = [], 
    availableClasses = [], 
    addExam, 
    addClass, 
    customSubjects = [],
    addSubject,
    deleteSubject,
    lang 
  } = useSchool();
  const [entryMode, setEntryMode] = useState('single'); // 'single' | 'bulk'
  const [examName, setExamName] = useState('SSC Test Examination 2026');
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedGroup, setSelectedGroup] = useState('Science');
  const [selectedStudentRoll, setSelectedStudentRoll] = useState('');
  const [year] = useState('2026');
  const [formError, setFormError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState('');
  const [editingResultId, setEditingResultId] = useState(null);

  // Bulk Excel Upload States
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [parseErrors, setParseErrors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Add New Exam Modal State
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [newExamNameInput, setNewExamNameInput] = useState('');
  const [newExamLabelBnInput, setNewExamLabelBnInput] = useState('');

  // Add New Class Modal State
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassKeyInput, setNewClassKeyInput] = useState('');
  const [newClassLabelBnInput, setNewClassLabelBnInput] = useState('');

  // Add New Subject Modal State
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubNameInput, setNewSubNameInput] = useState('');
  const [newSubLabelBnInput, setNewSubLabelBnInput] = useState('');
  const [newSubCodeInput, setNewSubCodeInput] = useState('');
  const [newSubMaxInput, setNewSubMaxInput] = useState('100');
  const [newSubTargetClass, setNewSubTargetClass] = useState('all');
  const [newSubGroup, setNewSubGroup] = useState('all');

  const handleAddNewExamSubmit = (e) => {
    e.preventDefault();
    if (!newExamNameInput.trim()) return;
    if (addExam) {
      const created = addExam(newExamNameInput, newExamLabelBnInput);
      if (created) {
        setExamName(created.name);
      }
    }
    setNewExamNameInput('');
    setNewExamLabelBnInput('');
    setShowAddExamModal(false);
  };

  const handleAddNewClassSubmit = (e) => {
    e.preventDefault();
    if (!newClassKeyInput.trim()) return;
    if (addClass) {
      const created = addClass(newClassKeyInput, newClassLabelBnInput);
      if (created) {
        setSelectedClass(created.key);
      }
    }
    setNewClassKeyInput('');
    setNewClassLabelBnInput('');
    setShowAddClassModal(false);
  };

  const handleAddNewSubjectSubmit = (e) => {
    e.preventDefault();
    if (!newSubNameInput.trim()) return;
    if (addSubject) {
      addSubject({
        name: newSubNameInput.trim(),
        labelBn: newSubLabelBnInput.trim() || newSubNameInput.trim(),
        code: newSubCodeInput.trim(),
        max: Number(newSubMaxInput) || 100,
        targetClass: newSubTargetClass,
        group: newSubGroup
      });
    }
    setNewSubNameInput('');
    setNewSubLabelBnInput('');
    setNewSubCodeInput('');
    setNewSubMaxInput('100');
    setShowAddSubjectModal(false);
  };

  // Auto student preview
  const activeStudent = students.find(
    s => String(s.roll) === toEnglishNumerals(selectedStudentRoll.trim()) && String(s.class) === String(selectedClass)
  );

  // Determine active subjects list based on class, group, and custom subjects
  const isSecondary = selectedClass === '9' || selectedClass === '10';
  const effectiveGroup = isSecondary ? (activeStudent?.group || selectedGroup || 'Science') : 'General';
  
  const baseSubjectList = isSecondary 
    ? (SUBJECT_CONFIGS.secondary[effectiveGroup] || SUBJECT_CONFIGS.secondary.Science)
    : SUBJECT_CONFIGS.general;

  const currentSubjectList = React.useMemo(() => {
    const list = [...baseSubjectList];
    const existingNames = new Set(list.map(s => s.name.toLowerCase()));

    customSubjects.forEach(cs => {
      const classMatches = !cs.targetClass || cs.targetClass === 'all' || String(cs.targetClass) === String(selectedClass);
      const groupMatches = !isSecondary 
        ? (!cs.group || cs.group === 'all' || cs.group === 'General')
        : (!cs.group || cs.group === 'all' || cs.group === effectiveGroup);

      if (classMatches && groupMatches && !existingNames.has(cs.name.toLowerCase())) {
        existingNames.add(cs.name.toLowerCase());
        list.push({
          id: cs.id,
          code: cs.code || '',
          name: cs.name,
          labelBn: cs.labelBn || cs.name,
          max: Number(cs.max) || 100,
          isCustom: true
        });
      }
    });

    return list;
  }, [baseSubjectList, customSubjects, selectedClass, effectiveGroup, isSecondary]);

  const [marks, setMarks] = useState({});

  const handleMarkChange = (subjectName, val) => {
    setMarks(prev => ({ ...prev, [subjectName]: val }));
    setFormError('');
  };

  const handleEditResult = (r) => {
    setEntryMode('single');
    setEditingResultId(r.id);
    setSelectedClass(String(r.class));
    setSelectedStudentRoll(String(r.roll));
    setExamName(r.exam);
    if (r.group) setSelectedGroup(r.group);
    
    const loadedMarks = {};
    if (Array.isArray(r.subjects)) {
      r.subjects.forEach(s => {
        loadedMarks[s.name] = s.marks != null ? String(s.marks) : '';
      });
    }
    setMarks(loadedMarks);
    setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteResult = (id, studentName, roll) => {
    if (confirm(`আপনি কি রোল ${toBanglaNumerals(roll)} (${studentName})-এর এই পরীক্ষার ফলাফল মুছে ফেলতে চান?`)) {
      if (deleteResult) {
        deleteResult(id);
      }
      if (editingResultId === id) {
        setEditingResultId(null);
        setMarks({});
        setSelectedStudentRoll('');
      }
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    setFormError('');

    const cleanRoll = toEnglishNumerals(selectedStudentRoll.trim());
    if (!cleanRoll) {
      setFormError('অনুগ্রহ করে শিক্ষার্থীর রোল নম্বর লিখুন।');
      return;
    }

    // Student Lookup Validation
    const matchedStudent = students.find(
      s => String(s.roll) === cleanRoll && String(s.class) === String(selectedClass)
    );

    if (!matchedStudent) {
      setFormError(`শ্রেণি ${toBanglaNumerals(selectedClass)} এবং রোল "${toBanglaNumerals(cleanRoll)}"-এ কোনো শিক্ষার্থী পাওয়া যায়নি! ফলাফল এন্ট্রি করার আগে শিক্ষার্থী ডাটাবেজে উপস্থিত থাকতে হবে।`);
      return;
    }

    // Validate Marks for each subject
    for (const sub of currentSubjectList) {
      const val = marks[sub.name];
      if (val === '' || val === null || val === undefined) {
        setFormError(`অনুগ্রহ করে "${sub.labelBn || sub.name}" বিষয়ের নম্বর সঠিকভাবে পূরণ করুন।`);
        return;
      }
      const numVal = Number(val);
      if (isNaN(numVal) || numVal < 0 || numVal > sub.max) {
        setFormError(`"${sub.labelBn || sub.name}" বিষয়ের নম্বর ০ থেকে ${sub.max}-এর মধ্যে হতে হবে।`);
        return;
      }
    }

    const subjectsArray = currentSubjectList.map(sub => {
      const markVal = Number(marks[sub.name]) || 0;
      return {
        code: sub.code,
        name: sub.name,
        labelBn: sub.labelBn,
        marks: markVal,
        max: sub.max,
        ...calculateSubjectGrade(markVal, sub.max)
      };
    });

    const totalPoints = subjectsArray.reduce((acc, curr) => acc + curr.point, 0);
    const hasFail = subjectsArray.some(s => s.grade === 'F');
    const gpaVal = hasFail ? '0.00' : (totalPoints / subjectsArray.length).toFixed(2);
    const letterGradeVal = calculateOverallGrade(gpaVal, hasFail);

    // Unique ID: Class + Roll + Exam + Year (H1 fix)
    const resultRecord = {
      id: editingResultId || `${selectedClass}-${cleanRoll}-${examName}-${year}`,
      roll: cleanRoll,
      studentNameBn: matchedStudent.nameBn,
      studentNameEn: matchedStudent.nameEn,
      studentId: matchedStudent.studentId,
      class: selectedClass,
      group: effectiveGroup,
      section: matchedStudent.section || 'A',
      exam: examName,
      year: year,
      gpa: gpaVal,
      letterGrade: letterGradeVal,
      resultStatus: hasFail ? 'FAILED' : 'PASSED',
      subjects: subjectsArray
    };

    addResult(resultRecord);
    setSavedSuccess('ফলাফল সফলভাবে সংরক্ষিত ও প্রকাশিত হয়েছে! পাবলিক পোর্টালে দৃশ্যমান হবে।');
    setMarks({});
    setSelectedStudentRoll('');
    setEditingResultId(null);
    setTimeout(() => setSavedSuccess(''), 6000);
  };

  // Excel Sample Template Download
  const handleDownloadTemplate = () => {
    const targetStudents = students.filter(s => {
      const matchCls = String(s.class) === String(selectedClass);
      if (!isSecondary) return matchCls;
      return matchCls && (s.group === effectiveGroup || !s.group);
    }).sort((a, b) => (Number(a.roll) || 0) - (Number(b.roll) || 0));

    const sampleRows = (targetStudents.length > 0 ? targetStudents : [
      { roll: '1', nameBn: 'নমুনা শিক্ষার্থী ১' },
      { roll: '2', nameBn: 'নমুনা শিক্ষার্থী ২' },
      { roll: '3', nameBn: 'নমুনা শিক্ষার্থী ৩' }
    ]).map(s => {
      const row = {
        'Roll': s.roll,
        'Student Name (ঐচ্ছিক)': s.nameBn || s.nameEn || ''
      };
      currentSubjectList.forEach(sub => {
        row[sub.name] = '';
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(sampleRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Class_${selectedClass}_Marks`);
    XLSX.writeFile(wb, `Marks_Template_Class_${selectedClass}_${effectiveGroup}.xlsx`);
  };

  // Excel File Upload & Parse
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelFile(file);
    setIsProcessing(true);
    setParseErrors([]);
    setParsedRows([]);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        const firstSheetName = wb.SheetNames[0];
        const ws = wb.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(ws, { defval: '' });

        if (!jsonData || jsonData.length === 0) {
          setParseErrors(['এক্সেল ফাইলে কোনো ডাটা পাওয়া যায়নি!']);
          setIsProcessing(false);
          return;
        }

        const validResults = [];
        const errors = [];

        jsonData.forEach((row, index) => {
          const rowNum = index + 2;
          const roll = findRoll(row);

          if (!roll) {
            const hasAnyVal = Object.values(row).some(v => v !== '');
            if (hasAnyVal) {
              errors.push(`সারি ${rowNum}: শিক্ষার্থীর কোনো রোল নম্বর পাওয়া যায়নি।`);
            }
            return;
          }

          const student = students.find(s => 
            String(s.roll) === String(roll) && String(s.class) === String(selectedClass)
          );

          if (!student) {
            errors.push(`সারি ${rowNum} (রোল ${toBanglaNumerals(roll)}): শ্রেণি ${toBanglaNumerals(selectedClass)}-এ এই রোলের কোনো শিক্ষার্থী পাওয়া যায়নি।`);
            return;
          }

          let matchedSubjectsCount = 0;
          const subjectsArray = currentSubjectList.map(sub => {
            const markVal = findSubjectMark(row, sub);
            if (markVal !== null && markVal !== undefined) {
              matchedSubjectsCount += 1;
              const clampedMark = Math.min(Math.max(0, markVal), sub.max);
              return {
                code: sub.code,
                name: sub.name,
                labelBn: sub.labelBn,
                marks: clampedMark,
                max: sub.max,
                ...calculateSubjectGrade(clampedMark, sub.max)
              };
            }
            return {
              code: sub.code,
              name: sub.name,
              labelBn: sub.labelBn,
              marks: 0,
              max: sub.max,
              ...calculateSubjectGrade(0, sub.max)
            };
          });

          if (matchedSubjectsCount === 0) {
            errors.push(`সারি ${rowNum} (রোল ${toBanglaNumerals(roll)}): এক্সেলে কোনো বিষয়ের কলাম নামের সাথে মেলেনি।`);
            return;
          }

          const totalPoints = subjectsArray.reduce((acc, curr) => acc + curr.point, 0);
          const hasFail = subjectsArray.some(s => s.grade === 'F');
          const gpaVal = hasFail ? '0.00' : (totalPoints / subjectsArray.length).toFixed(2);
          const letterGradeVal = calculateOverallGrade(gpaVal, hasFail);

          const resultRecord = {
            id: `${selectedClass}-${roll}-${examName}-${year}`,
            roll: String(roll),
            studentNameBn: student.nameBn,
            studentNameEn: student.nameEn,
            studentId: student.studentId,
            class: selectedClass,
            group: effectiveGroup,
            section: student.section || 'A',
            exam: examName,
            year: year,
            gpa: gpaVal,
            letterGrade: letterGradeVal,
            resultStatus: hasFail ? 'FAILED' : 'PASSED',
            subjects: subjectsArray
          };

          validResults.push(resultRecord);
        });

        setParsedRows(validResults);
        setParseErrors(errors);
        setIsProcessing(false);
      } catch (err) {
        console.error('Excel parse error:', err);
        setParseErrors(['এক্সেল ফাইল পড়তে সমস্যা হয়েছে। অনুগ্রহ করে সঠিক .xlsx বা .csv ফাইল ব্যবহার করুন।']);
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSaveBulkResults = () => {
    if (parsedRows.length === 0) return;
    if (bulkAddResults) {
      bulkAddResults(parsedRows);
    } else {
      parsedRows.forEach(r => addResult(r));
    }
    setSavedSuccess(`একসাথে ${toBanglaNumerals(parsedRows.length)} জন শিক্ষার্থীর পরীক্ষার ফলাফল সফলভাবে সংরক্ষিত ও প্রকাশিত হয়েছে!`);
    setParsedRows([]);
    setExcelFile(null);
    setParseErrors([]);
    setTimeout(() => setSavedSuccess(''), 7000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-bangla text-ink">
            ফলাফল ও নম্বর প্রদান ব্যবস্থাপনা (Marks Entry & Result Publishing)
          </h2>
          <p className="text-xs text-muted font-bangla">
            পরীক্ষার নম্বর এককভাবে ইনপুট দিন অথবা এক্সেল ফাইল থেকে এক ক্লিকে বাল্ক আপলোড করুন।
          </p>
        </div>

        {/* Mode Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-line shadow-2xs font-bangla text-xs">
          <button
            type="button"
            onClick={() => setEntryMode('single')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              entryMode === 'single'
                ? 'bg-deep text-white shadow-xs'
                : 'text-muted hover:text-ink hover:bg-bg'
            }`}
          >
            <Edit className="w-3.5 h-3.5" />
            <span>একক এন্ট্রি (Single)</span>
          </button>
          <button
            type="button"
            onClick={() => setEntryMode('bulk')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              entryMode === 'bulk'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:text-ink hover:bg-bg'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>এক্সেল বাল্ক আপলোড</span>
            <span className="bg-accent text-ink text-[10px] px-1.5 py-0.2 rounded font-extrabold uppercase">
              Excel
            </span>
          </button>
        </div>
      </div>

      {/* Success Alert Banner */}
      {savedSuccess && (
        <div className="p-4 bg-soft text-deep rounded-2xl text-xs font-semibold flex items-center gap-2 border border-soft-border animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-primary shrink-0" />
          <span>{savedSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Entry Form or Bulk Upload Component */}
        <div className="lg:col-span-7 card-base bg-white p-6 rounded-2xl border border-line shadow-xs space-y-4">
          {entryMode === 'single' ? (
            <form onSubmit={handlePublish} className="space-y-4 text-xs font-bangla">
              {editingResultId && (
                <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-xs flex items-center justify-between border border-amber-200">
                  <span className="font-bold">ফলাফল সম্পাদনা মোড সক্রিয় (Edit Mode)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingResultId(null);
                      setMarks({});
                      setSelectedStudentRoll('');
                    }}
                    className="text-xs underline cursor-pointer hover:text-amber-950"
                  >
                    বাতিল করুন
                  </button>
                </div>
              )}

              {/* Exam and Class Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-ink">পরীক্ষার নাম</label>
                    <button
                      type="button"
                      onClick={() => setShowAddExamModal(true)}
                      className="text-xs text-primary hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                      title="নতুন পরীক্ষার নাম যোগ করুন"
                    >
                      <Plus className="w-3 h-3" />
                      <span>নতুন</span>
                    </button>
                  </div>
                  <select
                    value={examName}
                    onChange={(e) => {
                      if (e.target.value === '__ADD_NEW__') {
                        setShowAddExamModal(true);
                      } else {
                        setExamName(e.target.value);
                      }
                    }}
                    className="w-full rounded-lg border border-line p-2.5 bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    {availableExams.map((ex) => (
                      <option key={ex.name || ex.id} value={ex.name}>
                        {ex.labelBn || ex.name}
                      </option>
                    ))}
                    <option value="__ADD_NEW__">➕ নতুন পরীক্ষা যোগ করুন...</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-ink">শ্রেণি</label>
                    <button
                      type="button"
                      onClick={() => setShowAddClassModal(true)}
                      className="text-xs text-primary hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                      title="নতুন শ্রেণি যোগ করুন"
                    >
                      <Plus className="w-3 h-3" />
                      <span>নতুন</span>
                    </button>
                  </div>
                  <select
                    value={selectedClass}
                    onChange={(e) => {
                      if (e.target.value === '__ADD_NEW__') {
                        setShowAddClassModal(true);
                      } else {
                        setSelectedClass(e.target.value);
                        setFormError('');
                      }
                    }}
                    className="w-full rounded-lg border border-line p-2.5 bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    {availableClasses.map((cls) => (
                      <option key={cls.key || cls.id} value={cls.key}>
                        {cls.labelBn || `${toBanglaNumerals(cls.key)} শ্রেণি`}
                      </option>
                    ))}
                    <option value="__ADD_NEW__">➕ নতুন শ্রেণি যোগ করুন...</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">শিক্ষার্থীর রোল *</label>
                  <input
                    type="text"
                    required
                    value={selectedStudentRoll}
                    onChange={(e) => {
                      setSelectedStudentRoll(e.target.value);
                      setFormError('');
                    }}
                    className="w-full rounded-lg border border-line p-2.5 font-mono font-bold bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="যেমন: 101"
                  />
                </div>
              </div>

              {/* Group selector for Class 9/10 */}
              {isSecondary && (
                <div>
                  <label className="block font-bold text-ink mb-1">বিভাগ (Group)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Science', 'Business Studies', 'Humanities'].map(grp => (
                      <button
                        key={grp}
                        type="button"
                        onClick={() => setSelectedGroup(grp)}
                        className={`py-2 px-3 rounded-lg border text-xs font-semibold cursor-pointer transition ${
                          effectiveGroup === grp
                            ? 'bg-deep text-white border-deep'
                            : 'bg-bg text-ink border-line hover:border-primary'
                        }`}
                      >
                        {grp === 'Science' ? 'বিজ্ঞান' : grp === 'Business Studies' ? 'ব্যবসায় শিক্ষা' : 'মানবিক'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Student Match Confirmation Pill */}
              {activeStudent ? (
                <div className="p-3 bg-soft text-deep rounded-xl text-xs flex items-center justify-between border border-soft-border">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-primary" />
                    <span className="font-bold">শিক্ষার্থী: {activeStudent.nameBn} ({activeStudent.studentId})</span>
                  </div>
                  <span className="font-semibold text-[11px] text-primary">শাখা {activeStudent.section} • বিভাগ {activeStudent.group}</span>
                </div>
              ) : selectedStudentRoll ? (
                <div className="p-2.5 bg-danger-soft text-danger rounded-xl text-xs flex items-center gap-1.5 border border-danger-soft">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>শ্রেণি {selectedClass}-এ এই রোলের কোনো শিক্ষার্থী পাওয়া যায়নি।</span>
                </div>
              ) : null}

              {/* Subject Marks Inputs */}
              <div>
                <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink block">
                      {isSecondary ? `${effectiveGroup} বিভাগের নির্ধারিত বিষয়ভিত্তিক নম্বর:` : 'নির্ধারিত বিষয়ভিত্তিক নম্বর:'}
                    </span>
                    <span className="text-[11px] text-muted font-medium">
                      ({currentSubjectList.length}টি বিষয়)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddSubjectModal(true)}
                    className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer bg-primary/5 hover:bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন বিষয় যোগ করুন</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {currentSubjectList.map((sub) => (
                    <div key={sub.name} className="bg-bg p-2.5 rounded-xl border border-line">
                      <div className="flex justify-between items-center mb-1">
                        <label className="block font-bold text-ink text-[11px] truncate" title={sub.labelBn || sub.name}>
                          {sub.labelBn || sub.name}
                        </label>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-muted font-mono">/{sub.max}</span>
                          {sub.isCustom && deleteSubject && (
                            <button
                              type="button"
                              onClick={() => deleteSubject(sub.id)}
                              className="text-danger hover:text-danger/80 cursor-pointer p-0.5"
                              title="কাস্টম বিষয়টি মুছুন"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max={sub.max}
                        required
                        placeholder="0"
                        value={marks[sub.name] ?? ''}
                        onChange={(e) => handleMarkChange(sub.name, e.target.value)}
                        className="w-full rounded-lg border border-line p-2 font-mono text-xs font-bold text-ink bg-white focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Error Message Alert */}
              {formError && (
                <div className="p-3 bg-danger-soft text-danger rounded-xl text-xs font-medium flex items-center gap-2 border border-danger-soft">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn-primary py-2.5 px-6 rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4 text-white" />
                <span>{editingResultId ? 'ফলাফল আপডেট করুন' : 'ফলাফল সংরক্ষণ ও প্রকাশ করুন'}</span>
              </button>
            </form>
          ) : (
            /* Bulk Excel Upload Mode */
            <div className="space-y-5 text-xs font-bangla">
              {/* Top Guidance & Target Settings */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-soft/50 rounded-xl border border-soft-border">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-deep text-sm">এক্সেল শিট থেকে স্বয়ংক্রিয় নম্বর আপলোড</h4>
                    <p className="text-[11px] text-muted">এক্সেলে বিষয়ের কলামগুলো ফরমের সাথে হুবহু ম্যাচ করলেই স্বয়ংক্রিয়ভাবে ফলাফল যুক্ত হবে।</p>
                  </div>
                </div>

                {/* The "i" Info Button and Add Subject Button */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowAddSubjectModal(true)}
                    className="p-2 rounded-xl bg-white text-primary border border-primary/30 hover:bg-primary/5 transition flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
                    title="নতুন বিষয় যোগ করুন (এক্সেলে অন্তর্ভুক্ত হবে)"
                  >
                    <Plus className="w-3.5 h-3.5 text-primary" />
                    <span>নতুন বিষয়</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowInfoModal(true)}
                    className="p-2 rounded-xl bg-primary text-white hover:bg-deep transition flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer active:scale-95"
                    title="ক্লিক করে এক্সেল কলামের নিয়ম ও বিষয়ের তালিকা দেখুন"
                  >
                    <Info className="w-4 h-4 text-accent" />
                    <span>কলামের নিয়ম (i)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="p-2 rounded-xl bg-white text-ink border border-line hover:border-primary transition flex items-center gap-1.5 text-xs font-semibold shadow-xs cursor-pointer"
                    title="প্রস্তুতকৃত এক্সেল টেমপ্লেট নামিয়ে নিন"
                  >
                    <Download className="w-3.5 h-3.5 text-primary" />
                    <span>নমুনা টেমপ্লেট</span>
                  </button>
                </div>
              </div>

              {/* Target Class & Exam Selectors for Bulk Upload */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-ink">পরীক্ষার নাম</label>
                    <button
                      type="button"
                      onClick={() => setShowAddExamModal(true)}
                      className="text-xs text-primary hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                      title="নতুন পরীক্ষার নাম যোগ করুন"
                    >
                      <Plus className="w-3 h-3" />
                      <span>নতুন</span>
                    </button>
                  </div>
                  <select
                    value={examName}
                    onChange={(e) => {
                      if (e.target.value === '__ADD_NEW__') {
                        setShowAddExamModal(true);
                      } else {
                        setExamName(e.target.value);
                      }
                    }}
                    className="w-full rounded-lg border border-line p-2.5 bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    {availableExams.map((ex) => (
                      <option key={ex.name || ex.id} value={ex.name}>
                        {ex.labelBn || ex.name}
                      </option>
                    ))}
                    <option value="__ADD_NEW__">➕ নতুন পরীক্ষা যোগ করুন...</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-ink">শ্রেণি</label>
                    <button
                      type="button"
                      onClick={() => setShowAddClassModal(true)}
                      className="text-xs text-primary hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                      title="নতুন শ্রেণি যোগ করুন"
                    >
                      <Plus className="w-3 h-3" />
                      <span>নতুন</span>
                    </button>
                  </div>
                  <select
                    value={selectedClass}
                    onChange={(e) => {
                      if (e.target.value === '__ADD_NEW__') {
                        setShowAddClassModal(true);
                      } else {
                        setSelectedClass(e.target.value);
                        setParsedRows([]);
                        setParseErrors([]);
                      }
                    }}
                    className="w-full rounded-lg border border-line p-2.5 bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    {availableClasses.map((cls) => (
                      <option key={cls.key || cls.id} value={cls.key}>
                        {cls.labelBn || `${toBanglaNumerals(cls.key)} শ্রেণি`}
                      </option>
                    ))}
                    <option value="__ADD_NEW__">➕ নতুন শ্রেণি যোগ করুন...</option>
                  </select>
                </div>

                {isSecondary ? (
                  <div>
                    <label className="block font-bold text-ink mb-1">বিভাগ (Group)</label>
                    <select
                      value={selectedGroup}
                      onChange={(e) => {
                        setSelectedGroup(e.target.value);
                        setParsedRows([]);
                        setParseErrors([]);
                      }}
                      className="w-full rounded-lg border border-line p-2.5 bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="Science">বিজ্ঞান (Science)</option>
                      <option value="Business Studies">ব্যবসায় শিক্ষা (Business)</option>
                      <option value="Humanities">মানবিক (Humanities)</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block font-bold text-ink mb-1">শাখা/গ্রুপ</label>
                    <div className="p-2.5 bg-bg border border-line rounded-lg text-muted font-semibold">সাধারণ (General)</div>
                  </div>
                )}
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-primary/40 hover:border-primary rounded-2xl p-6 text-center bg-soft/20 transition relative">
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                />
                <div className="space-y-2 pointer-events-none">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-xs border border-soft-border text-primary">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-deep text-sm block">
                      {excelFile ? excelFile.name : 'এক্সেল (.xlsx, .xls) অথবা .csv ফাইল এখানে ড্রপ করুন বা ক্লিক করে সিলেক্ট করুন'}
                    </span>
                    <span className="text-[11px] text-muted">
                      শ্রেণি {toBanglaNumerals(selectedClass)} ({effectiveGroup})-এর জন্য ফাইল নির্বাচন করুন
                    </span>
                  </div>
                </div>
              </div>

              {/* Processing Loader */}
              {isProcessing && (
                <div className="py-4 text-center text-primary font-bold animate-pulse text-xs">
                  এক্সেল ফাইলের ডাটা যাচাই ও গ্রেড হিসাব করা হচ্ছে...
                </div>
              )}

              {/* Parse Errors if any */}
              {parseErrors.length > 0 && (
                <div className="p-3.5 bg-danger-soft text-danger rounded-xl border border-danger-soft space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>কিছু সারিতে সমস্যা পাওয়া গেছে ({toBanglaNumerals(parseErrors.length)}টি):</span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] space-y-0.5 max-h-32 overflow-y-auto pl-1">
                    {parseErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Parsed Preview Table */}
              {parsedRows.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-ink">
                        {toBanglaNumerals(parsedRows.length)} জন শিক্ষার্থীর ফলাফল প্রস্তুত
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveBulkResults}
                      className="btn-primary px-5 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
                    >
                      <Award className="w-4 h-4 text-white" />
                      <span>সকল ফলাফল ডাটাবেজে সংরক্ষণ করুন</span>
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto border border-line rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs font-bangla">
                      <thead className="bg-deep text-white text-[10px] uppercase font-bold sticky top-0">
                        <tr>
                          <th className="py-2 px-2.5 text-center">রোল</th>
                          <th className="py-2 px-3">শিক্ষার্থীর নাম</th>
                          <th className="py-2 px-2 text-center">বিষয়</th>
                          <th className="py-2 px-2 text-center">জিপিএ</th>
                          <th className="py-2 px-2 text-center">গ্রেড</th>
                          <th className="py-2 px-2 text-center">স্ট্যাটাস</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line bg-white">
                        {parsedRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-bg">
                            <td className="py-2 px-2.5 font-mono font-bold text-center text-ink">{toBanglaNumerals(row.roll)}</td>
                            <td className="py-2 px-3 font-semibold text-ink truncate max-w-[120px]">{row.studentNameBn}</td>
                            <td className="py-2 px-2 text-center font-mono text-muted">{row.subjects.length}</td>
                            <td className="py-2 px-2 text-center font-mono font-extrabold text-primary">{row.gpa}</td>
                            <td className="py-2 px-2 text-center font-bold text-emerald-700">{row.letterGrade}</td>
                            <td className="py-2 px-2 text-center">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                row.resultStatus === 'PASSED' ? 'bg-soft text-primary' : 'bg-danger-soft text-danger'
                              }`}>
                                {row.resultStatus === 'PASSED' ? 'উত্তীর্ণ' : 'ফেল'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Existing Results List with Delete / Edit Actions (M1 Fix) */}
        <div className="lg:col-span-5 card-base bg-white p-6 rounded-2xl border border-line shadow-xs space-y-3 font-bangla">
          <div className="flex justify-between items-center pb-2 border-b border-line">
            <h3 className="font-bold text-ink text-sm">
              প্রকাশিত ফলাফল তালিকা ({lang === 'bn' ? toBanglaNumerals(results.length) : results.length} জন)
            </h3>
            <span className="text-[11px] text-muted">
              সম্পাদনা ও মোছার সুবিধা
            </span>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {results.length === 0 ? (
              <p className="text-center py-8 text-muted text-xs">কোনো ফলাফল প্রকাশিত নেই</p>
            ) : (
              results.map((r, i) => (
                <div key={r.id || i} className="p-3 bg-bg rounded-xl border border-line text-xs flex items-center justify-between gap-2 hover:border-line-hover transition">
                  <div className="min-w-0">
                    <span className="font-bold text-ink block truncate">{r.studentNameBn || r.studentName}</span>
                    <span className="text-[11px] text-muted font-mono block">
                      Roll: {r.roll} • Class: {r.class} ({r.exam})
                    </span>
                    <span className="text-[10px] text-muted">
                      বিভাগ: {r.group || 'Science'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="text-right">
                      <span className="font-mono font-bold text-primary text-sm block">GPA {r.gpa}</span>
                      <span className="text-[10px] font-semibold text-success">Grade: {r.letterGrade || r.grade}</span>
                    </div>

                    <div className="flex items-center gap-1 border-l border-line pl-2">
                      <button
                        type="button"
                        onClick={() => handleEditResult(r)}
                        title="সম্পাদনা করুন"
                        className="p-1.5 rounded-lg text-primary hover:bg-soft transition cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteResult(r.id, r.studentNameBn || r.studentName, r.roll)}
                        title="মুছে ফেলুন"
                        className="p-1.5 rounded-lg text-danger hover:bg-danger-soft transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Info "i" Modal - Excel Column Guidelines as Requested */}
      {showInfoModal && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 -z-10" onClick={() => setShowInfoModal(false)} />
          <div className="bg-white max-w-xl w-full rounded-2xl shadow-2xl border border-line overflow-hidden font-bangla text-xs animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-deep text-white p-5 flex items-center justify-between border-b border-primary">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">এক্সেল কলাম নির্দেশিকা ও নিয়মাবলী</h3>
                  <p className="text-[11px] text-white/80">বাল্ক নম্বর আপলোড সফল করার উপায়</p>
                </div>
              </div>
              <button 
                onClick={() => setShowInfoModal(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Golden Rule Highlight */}
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 space-y-1.5">
                <span className="font-bold text-sm block flex items-center gap-1.5 text-amber-950">
                  <span>💡</span> মূল নিয়ম (কলাম ম্যাচিং):
                </span>
                <p className="leading-relaxed">
                  এক্সেলে কলামের নামগুলো নিচের ইনপুট ফরমের বিষয়ের নামের সাথে <strong>বরাবর হুবহু মিল (Match)</strong> থাকতে হবে। কলাম ম্যাচ করলেই সফটওয়্যার স্বয়ংক্রিয়ভাবে শিক্ষার্থীদের বিষয়ভিত্তিক প্রাপ্ত নম্বর, গ্রেড পয়েন্ট এবং জিপিএ হিসাব করে ডাটাবেজে যুক্ত করে দিবে।
                </p>
              </div>

              {/* Required Columns for Currently Selected Class/Group */}
              <div>
                <h4 className="font-bold text-ink text-sm mb-2">
                  শ্রেণি {toBanglaNumerals(selectedClass)} ({effectiveGroup})-এর জন্য প্রয়োজনীয় কলামসমূহ:
                </h4>
                <div className="bg-bg p-3.5 rounded-xl border border-line space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-line font-bold text-deep">
                    <span>১. রোল কলাম (আবশ্যক):</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-line text-primary">Roll</span> বা <span className="font-mono bg-white px-2 py-0.5 rounded border border-line text-primary">রোল</span>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink block">২. বিষয়ভিত্তিক নম্বরের কলামসমূহ (ইংরেজি বা বাংলা যেকোনো একটি):</span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowInfoModal(false);
                          setShowAddSubjectModal(true);
                        }}
                        className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        title="নতুন কোনো বিষয় যুক্ত করতে ক্লিক করুন"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>নতুন বিষয় যোগ</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 max-h-56 overflow-y-auto pr-1">
                      {currentSubjectList.map((sub) => (
                        <div key={sub.name} className="p-2 bg-white rounded-lg border border-line flex items-center justify-between">
                          <div>
                            <span className="font-bold text-ink block font-mono text-[11px]">{sub.name}</span>
                            <span className="text-[10px] text-muted">বা {sub.labelBn || sub.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-primary font-bold">Max {sub.max}</span>
                            {sub.isCustom && deleteSubject && (
                              <button
                                type="button"
                                onClick={() => deleteSubject(sub.id)}
                                className="text-danger hover:bg-danger/10 p-1 rounded transition cursor-pointer"
                                title="কাস্টম বিষয়টি মুছুন"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ready Template Callout */}
              <div className="p-3.5 bg-soft rounded-xl border border-soft-border flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-deep block">রেডিমেড এক্সেল ফাইল চান?</span>
                  <p className="text-[11px] text-muted">নিচের বাটনে ক্লিক করলেই এই শ্রেণির শিক্ষার্থীদের রোলসহ প্রস্তুতকৃত টেমপ্লেট ডাউনলোড হয়ে যাবে।</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleDownloadTemplate();
                    setShowInfoModal(false);
                  }}
                  className="btn-accent px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition"
                >
                  <Download className="w-4 h-4 text-ink" />
                  <span>টেমপ্লেট ডাউনলোড</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-bg border-t border-line flex justify-end">
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="btn-secondary px-6 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                বুঝেছি, বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Exam Modal */}
      {showAddExamModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-line">
            <div className="p-4 bg-deep text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-accent" />
                <h3 className="font-bold font-bangla">নতুন পরীক্ষা যোগ করুন</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddExamModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddNewExamSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">পরীক্ষার নাম (English / ID) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Model Test 2026 or First Term 2026"
                  value={newExamNameInput}
                  onChange={(e) => setNewExamNameInput(e.target.value)}
                  className="w-full rounded-lg border border-line p-2.5 bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ink mb-1">বাংলা নাম (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="e.g. মডেল টেস্ট পরীক্ষা ২০২৬"
                  value={newExamLabelBnInput}
                  onChange={(e) => setNewExamLabelBnInput(e.target.value)}
                  className="w-full rounded-lg border border-line p-2.5 bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowAddExamModal(false)}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-line">
            <div className="p-4 bg-deep text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-accent" />
                <h3 className="font-bold font-bangla">নতুন শ্রেণি যোগ করুন</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddClassModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddNewClassSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">শ্রেণির কোড / নম্বর (Class Key) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 or 11 or Pre-Primary"
                  value={newClassKeyInput}
                  onChange={(e) => setNewClassKeyInput(e.target.value)}
                  className="w-full rounded-lg border border-line p-2.5 bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ink mb-1">বাংলা লেবেল (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="e.g. ৫ম শ্রেণি বা একাদশ শ্রেণি"
                  value={newClassLabelBnInput}
                  onChange={(e) => setNewClassLabelBnInput(e.target.value)}
                  className="w-full rounded-lg border border-line p-2.5 bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-line">
            <div className="p-4 bg-deep text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-accent" />
                <h3 className="font-bold font-bangla text-base">নতুন বিষয় যোগ করুন (Add New Subject)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSubjectModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddNewSubjectSubmit} className="p-6 space-y-4 font-bangla">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">বিষয়ের ইংরেজি নাম (Excel Header) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Higher Math or Agriculture"
                    value={newSubNameInput}
                    onChange={(e) => setNewSubNameInput(e.target.value)}
                    className="w-full rounded-lg border border-line p-2.5 bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none text-xs"
                    autoFocus
                  />
                  <p className="text-[10px] text-muted mt-0.5">এক্সেলে এই কলাম নাম অনুযায়ী স্বয়ংক্রিয়ভাবে নম্বর যুক্ত হবে।</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">বিষয়ের বাংলা নাম (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    placeholder="e.g. উচ্চতর গণিত বা কৃষিশিক্ষা"
                    value={newSubLabelBnInput}
                    onChange={(e) => setNewSubLabelBnInput(e.target.value)}
                    className="w-full rounded-lg border border-line p-2.5 bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">বিষয় কোড (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    placeholder="e.g. 126"
                    value={newSubCodeInput}
                    onChange={(e) => setNewSubCodeInput(e.target.value)}
                    className="w-full rounded-lg border border-line p-2.5 bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">পূর্ণমান (Max Marks) *</label>
                  <select
                    value={newSubMaxInput}
                    onChange={(e) => setNewSubMaxInput(e.target.value)}
                    className="w-full rounded-lg border border-line p-2.5 bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none text-xs font-mono font-bold"
                  >
                    <option value="100">100</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="25">25</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">প্রযোজ্য শ্রেণি</label>
                  <select
                    value={newSubTargetClass}
                    onChange={(e) => setNewSubTargetClass(e.target.value)}
                    className="w-full rounded-lg border border-line p-2.5 bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none text-xs"
                  >
                    <option value="all">সকল শ্রেণি (All Classes)</option>
                    {availableClasses.map((cls) => (
                      <option key={cls.key} value={cls.key}>
                        {cls.labelBn || `${cls.key} শ্রেণি`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {isSecondary && (
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">প্রযোজ্য বিভাগ (Group)</label>
                  <select
                    value={newSubGroup}
                    onChange={(e) => setNewSubGroup(e.target.value)}
                    className="w-full rounded-lg border border-line p-2.5 bg-bg text-ink focus:ring-2 focus:ring-primary focus:outline-none text-xs"
                  >
                    <option value="all">সকল বিভাগ (All Groups)</option>
                    <option value="Science">বিজ্ঞান (Science)</option>
                    <option value="Business Studies">ব্যবসায় শিক্ষা (Business Studies)</option>
                    <option value="Humanities">মানবিক (Humanities)</option>
                  </select>
                </div>
              )}

              <div className="p-3 bg-soft rounded-xl border border-soft-border text-[11px] text-muted">
                <p className="font-semibold text-deep mb-0.5">💡 স্বয়ংক্রিয় এক্সেল ও ইনপুট সুবিধা:</p>
                নতুন বিষয়টি যোগ করার সাথে সাথে এক্সেল বাল্ক আপলোড কলামে এটি ম্যাচ হবে, "নমুনা টেমপ্লেট" ডাউনলোড করলে স্বয়ংক্রিয়ভাবে এই বিষয়ের কলাম তৈরি হবে এবং তথ্য নির্দেশিকা (i)-তে তাৎক্ষণিক দেখাবে।
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  বিষয় যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
