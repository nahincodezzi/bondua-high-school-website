import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useSchool } from '../../context/useSchool';
import { uploadMemberPhoto, deletePhotoFile } from '../../utils/mediaStorage';
import { 
  Plus, 
  Trash2, 
  Edit, 
  X,
  Search,
  Award,
  Briefcase,
  Upload,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  GripVertical,
  GraduationCap,
  Star,
  FileSpreadsheet,
  Download,
  Info,
  FileUp,
  FileCheck,
  AlertCircle,
  ImageOff
} from 'lucide-react';

function isStaffRecord(t) {
  return t?.type === 'staff' || t?.category === 'staff';
}

function getRealPhoto(t) {
  const raw = t?.photo !== undefined ? t.photo : t?.image;
  if (!raw || typeof raw !== 'string') return '';
  if (raw.startsWith('data:image/svg+xml') || raw.includes('images.unsplash.com')) return '';
  return raw;
}

const normalizeKey = (key = '') =>
  String(key).trim().toLowerCase().replace(/[\s_\-()/\\.]+/g, '');

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

export default function TeacherManager() {
  const { 
    lang,
    teachers = [], 
    addTeacher, 
    updateTeacher, 
    deleteTeacher,
    reorderTeachers,
    bulkAddTeachers
  } = useSchool();

  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [draggedId, setDraggedId] = useState(null);

  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [actionToast, setActionToast] = useState('');
  const [formError, setFormError] = useState('');

  // Excel Bulk Upload States (matches StudentManager pattern)
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [parsedMembers, setParsedMembers] = useState([]);
  const [parseErrors, setParseErrors] = useState([]);
  const [isProcessingExcel, setIsProcessingExcel] = useState(false);

  const getDefaultForm = (type = 'teacher', orderVal = (teachers.length || 0) + 1) => ({
    id: `tea-${Date.now()}`,
    type,
    category: type === 'staff' ? 'staff' : 'faculty',
    nameBn: '',
    nameEn: '',
    designationBn: type === 'staff' ? 'অফিস সহকারী' : 'সহকারী শিক্ষক',
    designationEn: type === 'staff' ? 'Office Assistant' : 'Assistant Teacher',
    subjectBn: '',
    subjectEn: '',
    qualification: '',
    phone: '',
    email: '',
    photo: '',
    image: '',
    order: orderVal,
    visible: true,
  });

  const [formData, setFormData] = useState(() => getDefaultForm());

  const showToast = (msg) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(''), 4500);
  };

  const handleOpenAdd = () => {
    const nextOrder = teachers.reduce((m, t) => Math.max(m, Number(t.order) || 0), 0) + 1;
    setEditingTeacher(null);
    setFormData(getDefaultForm('teacher', nextOrder));
    setFormError('');
    setUploadStatus('');
    setShowModal(true);
  };

  const handleOpenEdit = (t) => {
    const isStaff = isStaffRecord(t);
    setEditingTeacher(t);
    setFormData({
      ...getDefaultForm(isStaff ? 'staff' : 'teacher', t.order || 1),
      ...t,
      type: isStaff ? 'staff' : 'teacher',
      category: isStaff ? 'staff' : 'faculty',
      photo: getRealPhoto(t),
      visible: t.visible !== false,
    });
    setFormError('');
    setUploadStatus('');
    setShowModal(true);
  };

  const handleTypeChange = (nextType) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        type: nextType,
        category: nextType === 'staff' ? 'staff' : 'faculty',
      };
      if (!editingTeacher) {
        if (nextType === 'staff' && prev.designationBn === 'সহকারী শিক্ষক') {
          updated.designationBn = 'অফিস সহকারী';
          updated.designationEn = 'Office Assistant';
        } else if (nextType === 'teacher' && prev.designationBn === 'অফিস সহকারী') {
          updated.designationBn = 'সহকারী শিক্ষক';
          updated.designationEn = 'Assistant Teacher';
        }
      }
      return updated;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus(lang === 'bn' ? 'প্রসেসিং ও স্কয়ার ক্রপ হচ্ছে...' : 'Cropping square & optimizing...');
    try {
      const targetId = editingTeacher?.id || formData.id || `tea-${Date.now()}`;
      const dataUrl = await uploadMemberPhoto(targetId, file, 400);
      setFormData(prev => ({
        ...prev,
        id: prev.id || targetId,
        photo: dataUrl,
        image: dataUrl,
      }));
      setUploadStatus(lang === 'bn' ? 'ছবি সফলভাবে যুক্ত হয়েছে!' : 'Photo uploaded cleanly!');
      setTimeout(() => setUploadStatus(''), 3000);
    } catch (err) {
      setUploadStatus('');
      setFormError(err.message || 'ছবি আপলোড ব্যর্থ হয়েছে।');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    const targetId = editingTeacher?.id || formData.id;
    if (targetId) {
      await deletePhotoFile(targetId);
    }
    setFormData(prev => ({
      ...prev,
      photo: '',
      image: '',
    }));
    setUploadStatus(
      lang === 'bn'
        ? 'ছবি সরানো হয়েছে (ডিফল্ট প্লেসহোল্ডার প্রদর্শিত হবে)'
        : 'Photo removed (placeholder will show)'
    );
    setTimeout(() => setUploadStatus(''), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.nameBn.trim() && !formData.nameEn.trim()) {
      setFormError(lang === 'bn' ? 'সদস্যের নাম প্রদান করুন।' : 'Member name is required.');
      return;
    }

    // Flexible phone validation (supports Bangladeshi 11-digit mobile or office extension/landline)
    const rawPhone = (formData.phone || '').trim().replace(/[-\s()]/g, '');
    if (rawPhone) {
      const normalizedPhone = rawPhone.replace(/^(\+?88)/, '');
      const isValidBdMobile = /^01[3-9]\d{8}$/.test(normalizedPhone);
      const isValidGeneralPhone = /^\+?\d{6,15}$/.test(rawPhone);
      if (!isValidBdMobile && !isValidGeneralPhone) {
        setFormError(
          lang === 'bn'
            ? 'অনুগ্রহ করে সঠিক মোবাইল বা ফোন নম্বর প্রদান করুন (যেমন: 01819204561)।'
            : 'Please enter a valid phone number (e.g. 01819204561).'
        );
        return;
      }
    }

    const payload = {
      ...formData,
      nameBn: formData.nameBn.trim() || formData.nameEn.trim(),
      nameEn: formData.nameEn.trim() || formData.nameBn.trim(),
      category: formData.type === 'staff' ? 'staff' : 'faculty',
      photo: formData.photo || '',
      image: formData.photo || '',
      order: Number(formData.order) || 1,
      visible: formData.visible !== false,
    };

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, payload);
      showToast(
        lang === 'bn'
          ? `"${payload.nameBn}"-এর তথ্য সফলভাবে হালনাগাদ করা হয়েছে!`
          : `Updated "${payload.nameEn}" successfully!`
      );
    } else {
      addTeacher(payload);
      showToast(
        lang === 'bn'
          ? `"${payload.nameBn}" সফলভাবে তালিকায় যুক্ত হয়েছেন!`
          : `Added "${payload.nameEn}" successfully!`
      );
    }
    setShowModal(false);
  };

  const sortedTeachers = [...teachers].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  const handleMove = (id, direction) => {
    const idx = sortedTeachers.findIndex(t => t.id === id);
    if (idx === -1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sortedTeachers.length) return;
    const reordered = [...sortedTeachers];
    const [item] = reordered.splice(idx, 1);
    reordered.splice(swapIdx, 0, item);
    if (reorderTeachers) {
      reorderTeachers(reordered);
    }
  };

  const handleDropOnCard = (targetId) => {
    if (!draggedId || draggedId === targetId) return;
    const fromIdx = sortedTeachers.findIndex(t => t.id === draggedId);
    const toIdx = sortedTeachers.findIndex(t => t.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;
    const reordered = [...sortedTeachers];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    setDraggedId(null);
    if (reorderTeachers) {
      reorderTeachers(reordered);
      showToast(lang === 'bn' ? 'ক্রম পরিবর্তন সংরক্ষিত হয়েছে!' : 'Member order updated!');
    }
  };

  const handleToggleVisibility = (t) => {
    const nextVisible = t.visible === false;
    updateTeacher(t.id, { visible: nextVisible });
    showToast(
      nextVisible
        ? (lang === 'bn' ? `"${t.nameBn}" এখন ওয়েবসাইটে দৃশ্যমান।` : `"${t.nameEn}" is now visible.`)
        : (lang === 'bn' ? `"${t.nameBn}"-কে পাবলিক তালিকা থেকে লুকানো হয়েছে।` : `"${t.nameEn}" is now hidden.`)
    );
  };

  // Excel Bulk Upload Handlers
  const handleDownloadTemplate = () => {
    const sampleData = [
      {
        type: 'teacher',
        nameBn: 'মোঃ কামাল উদ্দিন',
        nameEn: 'Md. Kamal Uddin',
        designationBn: 'সহকারী শিক্ষক',
        designationEn: 'Assistant Teacher',
        subjectBn: 'বাংলা',
        subjectEn: 'Bangla',
        qualification: 'বি.এ (অনার্স), এম.এ',
        phone: '01812345678',
        email: 'kamal@bdhs.edu.bd',
        visible: 'true',
      },
      {
        type: 'staff',
        nameBn: 'মোঃ রফিকুল ইসলাম',
        nameEn: 'Md. Rafiqul Islam',
        designationBn: 'অফিস সহকারী',
        designationEn: 'Office Assistant',
        subjectBn: '',
        subjectEn: '',
        qualification: 'এইচ.এস.সি',
        phone: '01712345678',
        email: '',
        visible: 'true',
      },
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Teachers_Staff');
    XLSX.writeFile(wb, 'BDHS_Teachers_Staff_Template.xlsx');
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelFile(file);
    setIsProcessingExcel(true);
    setParseErrors([]);
    setParsedMembers([]);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

        if (!rows.length) {
          setParseErrors([lang === 'bn' ? 'ফাইলটিতে কোনো তথ্য পাওয়া যায়নি।' : 'No rows found in Excel file.']);
          setIsProcessingExcel(false);
          return;
        }

        const validList = [];
        const errors = [];

        rows.forEach((row, idx) => {
          const rowNum = idx + 2;
          const nameBn = findVal(row, ['namebn', 'banglaname', 'বাংলানাম', 'নামবাংলা', 'নাম']);
          const nameEn = findVal(row, ['nameen', 'englishname', 'ইংরেজিনাম', 'name']);

          if (!nameBn && !nameEn) {
            errors.push(`সারি ${rowNum}: নাম (বাংলা বা ইংরেজি) দেওয়া আবশ্যক।`);
            return;
          }

          const rawType = findVal(row, ['type', 'category', 'ধরন', 'ক্যাটাগরি']).toLowerCase();
          const type =
            rawType.includes('staff') || rawType.includes('কর্মচারী') || rawType.includes('অফিস')
              ? 'staff'
              : 'teacher';

          const designationBn =
            findVal(row, ['designationbn', 'designation', 'পদবী', 'পদবি']) ||
            (type === 'staff' ? 'অফিস সহকারী' : 'সহকারী শিক্ষক');
          const designationEn =
            findVal(row, ['designationen']) ||
            (type === 'staff' ? 'Office Assistant' : 'Assistant Teacher');
          const subjectBn = findVal(row, ['subjectbn', 'subject', 'বিষয়', 'বিষয়']);
          const subjectEn = findVal(row, ['subjecten']);
          const qualification = findVal(row, ['qualification', 'education', 'যোগ্যতা']);
          const phone = findVal(row, ['phone', 'mobile', 'মোবাইল', 'ফোন']);
          const email = findVal(row, ['email', 'ইমেইল']);
          const rawVis = findVal(row, ['visible', 'status', 'দৃশ্যমান']).toLowerCase();
          const visible = rawVis === 'false' || rawVis === '0' || rawVis === 'hidden' || rawVis === 'লুকানো' ? false : true;

          validList.push({
            type,
            category: type === 'staff' ? 'staff' : 'faculty',
            nameBn: nameBn || nameEn,
            nameEn: nameEn || nameBn,
            designationBn,
            designationEn,
            subjectBn,
            subjectEn: subjectEn || subjectBn,
            qualification,
            phone,
            email,
            photo: '',
            image: '',
            visible,
          });
        });

        setParsedMembers(validList);
        setParseErrors(errors);
      } catch (err) {
        setParseErrors([`এক্সেল ফাইল পড়তে সমস্যা: ${err.message}`]);
      } finally {
        setIsProcessingExcel(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleConfirmBulkSave = () => {
    if (!parsedMembers.length) return;
    if (bulkAddTeachers) {
      bulkAddTeachers(parsedMembers);
    } else {
      parsedMembers.forEach(m => addTeacher(m));
    }
    showToast(
      lang === 'bn'
        ? `একসাথে ${parsedMembers.length} জন শিক্ষক ও কর্মচারী যুক্ত করা হয়েছে!`
        : `Added ${parsedMembers.length} members successfully!`
    );
    setShowExcelModal(false);
    setExcelFile(null);
    setParsedMembers([]);
    setParseErrors([]);
  };

  const filteredTeachers = sortedTeachers.filter(t => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.nameBn?.toLowerCase().includes(q) ||
      t.nameEn?.toLowerCase().includes(q) ||
      t.designationBn?.toLowerCase().includes(q) ||
      t.designationEn?.toLowerCase().includes(q) ||
      t.subjectBn?.toLowerCase().includes(q) ||
      t.subjectEn?.toLowerCase().includes(q);

    const isStaff = isStaffRecord(t);
    const matchesCategory =
      activeCategory === 'all' ||
      (activeCategory === 'staff' && isStaff) ||
      (activeCategory === 'teacher' && !isStaff);

    return matchesSearch && matchesCategory;
  });

  const staffCount = sortedTeachers.filter(isStaffRecord).length;
  const facultyCount = sortedTeachers.length - staffCount;
  const canDragReorder = activeCategory === 'all' && !searchQuery.trim();

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-bangla">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-ink">
            {lang === 'bn'
              ? 'শিক্ষক ও কর্মচারী পরিষদ ব্যবস্থাপনা'
              : 'Teachers & Staff Manager'}
          </h2>
          <p className="text-xs text-muted">
            {lang === 'bn'
              ? 'শিক্ষক ও কর্মকর্তা-কর্মচারী সংযোজন, ছবি ক্রপ আপলোড, ক্রম সাজানো (Drag/Up-Down) ও দৃশ্যমানতা নিয়ন্ত্রণ'
              : 'Manage members, crop square photos, reorder rows, toggle visibility, and bulk import from Excel'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowExcelModal(true)}
            className="flex-1 sm:flex-none bg-deep hover:bg-primary text-surface font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-accent" />
            <span>{lang === 'bn' ? 'এক্সেল আপলোড' : 'Excel Bulk'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-none bg-primary hover:bg-primary-hover text-surface font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow cursor-pointer"
          >
            <Plus className="w-4 h-4 text-accent" />
            <span>{lang === 'bn' ? 'নতুন সদস্য যোগ' : 'Add Member'}</span>
          </button>
        </div>
      </div>

      {/* Action Success Banner */}
      {actionToast && (
        <div className="p-3.5 rounded-2xl bg-success-soft border border-soft-border text-success text-xs font-bangla font-bold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionToast}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-surface p-4 rounded-2xl border border-line flex flex-col sm:flex-row items-center justify-between gap-3 font-bangla text-xs shadow-2xs">
        <div className="flex bg-bg p-1 rounded-xl text-xs font-bold w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition text-center cursor-pointer ${
              activeCategory === 'all' ? 'bg-deep text-surface shadow' : 'text-muted hover:text-ink'
            }`}
          >
            {lang === 'bn' ? `সকল (${sortedTeachers.length})` : `All (${sortedTeachers.length})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('teacher')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer ${
              activeCategory === 'teacher' ? 'bg-deep text-surface shadow' : 'text-muted hover:text-ink'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="truncate">
              {lang === 'bn' ? `শিক্ষক পরিষদ (${facultyCount})` : `Teachers (${facultyCount})`}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('staff')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer ${
              activeCategory === 'staff' ? 'bg-deep text-surface shadow' : 'text-muted hover:text-ink'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="truncate">
              {lang === 'bn' ? `কর্মচারীবৃন্দ (${staffCount})` : `Staff (${staffCount})`}
            </span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              lang === 'bn'
                ? 'নাম, পদবী বা বিষয় দিয়ে খুঁজুন...'
                : 'Search name, designation, subject...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-lg border border-line focus:ring-2 focus:ring-primary bg-surface text-ink"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Roster Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((t) => {
          const globalIndex = sortedTeachers.findIndex(item => item.id === t.id);
          const isHead = !isStaffRecord(t) && (t.designationEn?.includes('Headmaster') && !t.designationEn?.includes('Assistant'));
          const isStaff = isStaffRecord(t);
          const photoSrc = getRealPhoto(t);
          const isVisible = t.visible !== false;

          return (
            <div
              key={t.id}
              draggable={canDragReorder}
              onDragStart={() => canDragReorder && setDraggedId(t.id)}
              onDragOver={(e) => canDragReorder && e.preventDefault()}
              onDrop={() => canDragReorder && handleDropOnCard(t.id)}
              className={`bg-surface rounded-2xl p-4 border transition flex flex-col justify-between shadow-2xs hover:shadow-md ${
                !isVisible ? 'opacity-65 border-dashed border-muted/50' : isHead ? 'border-accent ring-2 ring-accent/20' : 'border-line'
              } ${draggedId === t.id ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="flex items-start gap-3">
                {/* Thumbnail: Real square photo OR theme placeholder */}
                <div className="relative shrink-0">
                  {photoSrc ? (
                    <img
                      src={photoSrc}
                      alt={t.nameEn || t.nameBn}
                      className="w-16 h-16 rounded-full object-cover object-top border-2 border-accent bg-deep"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-deep to-primary border-2 border-accent flex items-center justify-center relative">
                      <GraduationCap className="w-6 h-6 text-accent" />
                    </div>
                  )}
                  <span className="absolute -top-1.5 -left-1.5 bg-deep text-surface text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border border-surface/20">
                    #{globalIndex + 1}
                  </span>
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-bangla inline-block ${
                      isHead
                        ? 'bg-accent text-accent-ink font-extrabold'
                        : isStaff
                          ? 'bg-bg text-ink border border-line'
                          : 'bg-soft text-primary border border-soft-border'
                    }`}>
                      {lang === 'bn' ? t.designationBn : (t.designationEn || t.designationBn)}
                    </span>

                    {!isVisible && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-danger-soft text-danger font-bangla">
                        {lang === 'bn' ? 'লুকানো' : 'Hidden'}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold font-bangla text-ink truncate">
                    {lang === 'bn' ? t.nameBn : (t.nameEn || t.nameBn)}
                  </h4>

                  {(t.subjectBn || t.subjectEn) && (
                    <p className="text-xs text-primary font-semibold font-bangla truncate">
                      {lang === 'bn' ? t.subjectBn : (t.subjectEn || t.subjectBn)}
                    </p>
                  )}

                  {t.qualification && (
                    <p className="text-[11px] text-muted font-bangla truncate">
                      {t.qualification}
                    </p>
                  )}
                </div>

                {canDragReorder && (
                  <span
                    className="text-muted cursor-grab active:cursor-grabbing p-1"
                    title={lang === 'bn' ? 'টেনে ক্রম পরিবর্তন করুন' : 'Drag to reorder'}
                  >
                    <GripVertical className="w-4 h-4" />
                  </span>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-xs font-bangla gap-2">
                <span className="font-mono text-muted text-[11px] truncate">{t.phone || '—'}</span>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={globalIndex <= 0}
                    onClick={() => handleMove(t.id, 'up')}
                    className="p-1.5 text-muted hover:text-ink hover:bg-bg rounded-lg transition disabled:opacity-30 cursor-pointer"
                    title={lang === 'bn' ? 'উপরে নিন' : 'Move Up'}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={globalIndex >= sortedTeachers.length - 1}
                    onClick={() => handleMove(t.id, 'down')}
                    className="p-1.5 text-muted hover:text-ink hover:bg-bg rounded-lg transition disabled:opacity-30 cursor-pointer"
                    title={lang === 'bn' ? 'নিচে নিন' : 'Move Down'}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(t)}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      isVisible ? 'text-primary hover:bg-soft' : 'text-danger bg-danger-soft'
                    }`}
                    title={isVisible ? (lang === 'bn' ? 'লুকান' : 'Hide from website') : (lang === 'bn' ? 'প্রদর্শন করুন' : 'Show on website')}
                  >
                    {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 text-muted hover:text-ink hover:bg-bg rounded-lg transition cursor-pointer"
                    title={lang === 'bn' ? 'সম্পাদনা' : 'Edit'}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(t)}
                    className="p-1.5 text-danger hover:bg-danger-soft rounded-lg transition cursor-pointer"
                    title={lang === 'bn' ? 'মুছুন' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-surface max-w-xl w-full rounded-2xl overflow-y-auto max-h-[92vh] shadow-2xl border border-line p-5 sm:p-6 space-y-4 font-bangla text-xs">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-bold text-ink text-base">
                {editingTeacher
                  ? (lang === 'bn' ? 'শিক্ষক / কর্মচারীর তথ্য সম্পাদনা' : 'Edit Teacher / Staff Member')
                  : (lang === 'bn' ? 'নতুন শিক্ষক / কর্মচারী সংযোজন ফরম' : 'Add New Teacher / Staff Member')}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-muted hover:text-ink cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-danger-soft border border-danger/30 text-danger font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">
                    {lang === 'bn' ? 'নাম (বাংলা) *' : 'Name (Bangla) *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: জনাব মোঃ জাহাঙ্গীর আলম"
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    className="w-full rounded-lg border border-line p-2 bg-surface text-ink"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">
                    {lang === 'bn' ? 'নাম (ইংরেজি)' : 'Name (English)'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Md. Jahangir Alam"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full rounded-lg border border-line p-2 bg-surface text-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">
                    {lang === 'bn' ? 'ধরন (Type)' : 'Member Type'}
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="w-full rounded-lg border border-line p-2 font-semibold bg-surface text-ink"
                  >
                    <option value="teacher">{lang === 'bn' ? 'শিক্ষক পরিষদ (Teacher)' : 'Teacher'}</option>
                    <option value="staff">{lang === 'bn' ? 'কর্মচারীবৃন্দ (Staff)' : 'Staff'}</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">
                    {lang === 'bn' ? 'ক্রম নম্বর (Order)' : 'Sort Order'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full rounded-lg border border-line p-2 font-mono bg-surface text-ink"
                  />
                </div>
                <div className="flex items-end">
                  <label className="w-full flex items-center gap-2 p-2 rounded-lg border border-line bg-bg cursor-pointer font-bold text-ink">
                    <input
                      type="checkbox"
                      checked={formData.visible !== false}
                      onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                    />
                    <span>{lang === 'bn' ? 'পাবলিক পেজে দেখান' : 'Visible publicly'}</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">
                    {lang === 'bn' ? 'পদবী (বাংলা) *' : 'Designation (Bangla) *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ভারপ্রাপ্ত প্রধান শিক্ষক / সহকারী শিক্ষক"
                    value={formData.designationBn}
                    onChange={(e) => setFormData({ ...formData, designationBn: e.target.value })}
                    className="w-full rounded-lg border border-line p-2 bg-surface text-ink"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">
                    {lang === 'bn' ? 'পদবী (ইংরেজি)' : 'Designation (English)'}
                  </label>
                  <input
                    type="text"
                    placeholder="Acting Headmaster / Assistant Teacher"
                    value={formData.designationEn}
                    onChange={(e) => setFormData({ ...formData, designationEn: e.target.value })}
                    className="w-full rounded-lg border border-line p-2 bg-surface text-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">
                    {lang === 'bn' ? 'বিষয় / দায়িত্ব (বাংলা)' : 'Subject (Bangla)'}
                  </label>
                  <input
                    type="text"
                    placeholder={formData.type === 'staff' ? 'ঐচ্ছিক (খালি রাখা যাবে)' : 'যেমন: ইংরেজি / গণিত'}
                    value={formData.subjectBn}
                    onChange={(e) => setFormData({ ...formData, subjectBn: e.target.value })}
                    className="w-full rounded-lg border border-line p-2 bg-surface text-ink"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">
                    {lang === 'bn' ? 'বিষয় / দায়িত্ব (ইংরেজি)' : 'Subject (English)'}
                  </label>
                  <input
                    type="text"
                    placeholder={formData.type === 'staff' ? 'Optional for staff' : 'e.g. Mathematics / English'}
                    value={formData.subjectEn}
                    onChange={(e) => setFormData({ ...formData, subjectEn: e.target.value })}
                    className="w-full rounded-lg border border-line p-2 bg-surface text-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-ink mb-1">
                    {lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone'}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01819204561"
                    className="w-full rounded-lg border border-line p-2 font-mono bg-surface text-ink"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">
                    {lang === 'bn' ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="teacher@bdhs.edu.bd"
                    className="w-full rounded-lg border border-line p-2 font-mono bg-surface text-ink"
                  />
                </div>
                <div>
                  <label className="block font-bold text-ink mb-1">
                    {lang === 'bn' ? 'শিক্ষাগত যোগ্যতা' : 'Qualification'}
                  </label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="বি.এ, বি.এড"
                    className="w-full rounded-lg border border-line p-2 bg-surface text-ink"
                  />
                </div>
              </div>

              {/* Photo Upload via mediaStorage (crop/resize square + Remove → placeholder) */}
              <div className="bg-bg p-3.5 rounded-xl border border-line space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-ink text-xs">
                    {lang === 'bn' ? 'প্রোফাইল ছবি (স্বয়ংক্রিয় স্কয়ার ক্রপ)' : 'Profile Photo (Auto Square Crop)'}
                  </label>
                  {uploadStatus && (
                    <span className="text-[11px] text-primary font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {uploadStatus}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Live Gold-Ring Preview (Photo or Placeholder) */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-deep to-primary border-[3px] border-accent flex items-center justify-center shrink-0 overflow-hidden shadow-md relative">
                    {formData.photo ? (
                      <img
                        src={formData.photo}
                        alt="Preview"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center relative">
                        <div className="w-16 h-16 rounded-full border border-dashed border-accent/50 absolute" />
                        <Star className="w-2.5 h-2.5 text-accent fill-accent mb-0.5" />
                        <GraduationCap className="w-7 h-7 text-accent" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      className="hidden"
                      onChange={handleImageUpload}
                    />

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-primary hover:bg-primary-hover text-surface font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-accent" />
                        <span>{lang === 'bn' ? 'ছবি আপলোড' : 'Upload Photo'}</span>
                      </button>

                      {formData.photo && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="bg-danger-soft hover:bg-danger text-danger hover:text-surface border border-danger/30 font-semibold px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 transition cursor-pointer"
                        >
                          <ImageOff className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'ছবি সরান (প্লেসহোল্ডার)' : 'Remove Photo'}</span>
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-muted">
                      {lang === 'bn'
                        ? 'JPG / PNG / WebP নির্বাচন করলে স্বয়ংক্রিয়ভাবে বর্গাকার (৪০০×৪০০) ক্রপ হয়ে সংরক্ষিত হবে।'
                        : 'Uploaded images are cropped to a 400×400 square and saved via mediaStorage.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-muted hover:bg-bg font-bold cursor-pointer"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-surface font-bold transition shadow cursor-pointer"
                >
                  {editingTeacher
                    ? (lang === 'bn' ? 'হালনাগাদ সংরক্ষণ' : 'Save Changes')
                    : (lang === 'bn' ? 'যোগ নিশ্চিত করুন' : 'Add Member')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface max-w-md w-full rounded-2xl p-6 border border-line shadow-2xl space-y-4 font-bangla text-xs">
            <div className="flex items-center gap-3 text-danger">
              <div className="w-10 h-10 rounded-full bg-danger-soft flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base text-ink">
                  {lang === 'bn' ? 'সদস্য মুছে ফেলার নিশ্চিতকরণ' : 'Confirm Member Deletion'}
                </h4>
                <p className="text-muted text-[11px]">
                  {lang === 'bn'
                    ? `আপনি কি "${deleteTarget.nameBn}"-কে তালিকা থেকে মুছে ফেলতে চান?`
                    : `Remove "${deleteTarget.nameEn || deleteTarget.nameBn}" from the directory?`}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg bg-bg text-ink font-bold cursor-pointer"
              >
                {lang === 'bn' ? 'না, থাকুক' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={async () => {
                  const id = deleteTarget.id;
                  const name = lang === 'bn' ? deleteTarget.nameBn : deleteTarget.nameEn;
                  setDeleteTarget(null);
                  await deletePhotoFile(id);
                  deleteTeacher(id);
                  showToast(lang === 'bn' ? `"${name}" তালিকা থেকে মুছে ফেলা হয়েছে।` : `Deleted "${name}".`);
                }}
                className="px-4 py-2 rounded-lg bg-danger text-surface font-bold cursor-pointer"
              >
                {lang === 'bn' ? 'হ্যাঁ, মুছে ফেলুন' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excel Bulk Upload Modal (matches StudentManager pattern) */}
      {showExcelModal && (
        <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl border border-line flex flex-col max-h-[92vh]">
            <div className="p-4 sm:p-5 border-b border-line flex items-center justify-between bg-bg">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-soft text-primary">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold font-bangla text-ink text-sm sm:text-base">
                    {lang === 'bn'
                      ? 'এক্সেল থেকে শিক্ষক ও কর্মচারী বাল্ক আপলোড'
                      : 'Excel Bulk Upload (Teachers & Staff)'}
                  </h3>
                  <p className="text-[11px] text-muted font-bangla">
                    {lang === 'bn'
                      ? 'এক্সেল শিট থেকে একসাথে একাধিক শিক্ষক বা কর্মচারী যুক্ত করুন'
                      : 'Import multiple teachers and staff rows from an Excel spreadsheet'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowExcelModal(false);
                  setExcelFile(null);
                  setParsedMembers([]);
                  setParseErrors([]);
                }}
                className="text-muted hover:text-ink p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 font-bangla text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-soft/60 rounded-xl border border-soft-border">
                <button
                  type="button"
                  onClick={() => setShowInfoModal(true)}
                  className="inline-flex items-center gap-1.5 text-primary hover:text-deep font-bold cursor-pointer"
                >
                  <Info className="w-4 h-4 text-primary" />
                  <span>{lang === 'bn' ? 'কলামের নিয়ম ও তথ্য নির্দেশিকা (i)' : 'Column Guidelines (i)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-surface font-bold transition shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'নমুনা এক্সেল টেমপ্লেট' : 'Download Template'}</span>
                </button>
              </div>

              <div className="border-2 border-dashed border-line hover:border-primary/50 rounded-2xl p-6 text-center bg-bg/50 transition">
                <input
                  type="file"
                  id="teacher-excel-file-input"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleExcelUpload}
                  className="hidden"
                />
                <label
                  htmlFor="teacher-excel-file-input"
                  className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                >
                  <div className="p-3 bg-soft text-primary rounded-full">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-ink text-sm">
                    {excelFile
                      ? excelFile.name
                      : (lang === 'bn' ? 'এক্সেল ফাইল নির্বাচন করতে ক্লিক করুন' : 'Click to select .xlsx / .xls file')}
                  </span>
                  <span className="text-[11px] text-muted">
                    .xlsx, .xls, .csv
                  </span>
                </label>
              </div>

              {isProcessingExcel && (
                <div className="p-4 text-center text-primary font-bold">
                  {lang === 'bn' ? 'ফাইল যাচাই করা হচ্ছে...' : 'Processing spreadsheet...'}
                </div>
              )}

              {parseErrors.length > 0 && (
                <div className="p-3.5 bg-danger-soft border border-danger/30 text-danger rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{lang === 'bn' ? 'কিছু সারিতে ত্রুটি রয়েছে:' : 'Issues found:'}</span>
                  </div>
                  <ul className="list-disc pl-5 text-[11px] space-y-0.5">
                    {parseErrors.slice(0, 5).map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              )}

              {parsedMembers.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-ink">
                    <span className="flex items-center gap-1.5 text-success">
                      <FileCheck className="w-4 h-4" />
                      {lang === 'bn'
                        ? `মোট ${parsedMembers.length} জন সদস্য আপলোডের জন্য প্রস্তুত`
                        : `${parsedMembers.length} rows ready to import`}
                    </span>
                  </div>
                  <div className="border border-line rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-bg text-muted font-bold">
                        <tr>
                          <th className="p-2">{lang === 'bn' ? 'ধরন' : 'Type'}</th>
                          <th className="p-2">{lang === 'bn' ? 'নাম (বাংলা)' : 'Name'}</th>
                          <th className="p-2">{lang === 'bn' ? 'পদবী' : 'Designation'}</th>
                          <th className="p-2">{lang === 'bn' ? 'বিষয়' : 'Subject'}</th>
                          <th className="p-2">{lang === 'bn' ? 'মোবাইল' : 'Phone'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {parsedMembers.slice(0, 5).map((m, idx) => (
                          <tr key={idx}>
                            <td className="p-2 font-bold">{m.type === 'staff' ? 'কর্মচারী' : 'শিক্ষক'}</td>
                            <td className="p-2 font-bold text-ink">{m.nameBn}</td>
                            <td className="p-2">{m.designationBn}</td>
                            <td className="p-2">{m.subjectBn || '—'}</td>
                            <td className="p-2 font-mono">{m.phone || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-line bg-bg flex items-center justify-end gap-2 font-bangla text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowExcelModal(false);
                  setExcelFile(null);
                  setParsedMembers([]);
                  setParseErrors([]);
                }}
                className="px-4 py-2 rounded-xl bg-surface border border-line text-muted hover:text-ink font-bold cursor-pointer"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={parsedMembers.length === 0 || isProcessingExcel}
                onClick={handleConfirmBulkSave}
                className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-surface font-bold shadow disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>
                  {lang === 'bn'
                    ? `ডাটাবেজে যুক্ত করুন (${parsedMembers.length})`
                    : `Import Members (${parsedMembers.length})`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Column Guidelines Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface max-w-md w-full rounded-2xl p-5 border border-line shadow-2xl space-y-3 font-bangla text-xs">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <h4 className="font-bold text-sm text-ink">
                {lang === 'bn' ? 'এক্সেল কলাম নির্দেশিকা' : 'Excel Column Guide'}
              </h4>
              <button type="button" onClick={() => setShowInfoModal(false)} className="text-muted hover:text-ink cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-1.5 text-muted list-disc pl-4">
              <li><strong>type:</strong> <code>teacher</code> অথবা <code>staff</code></li>
              <li><strong>nameBn / নাম (বাংলা):</strong> আবশ্যক</li>
              <li><strong>nameEn:</strong> ইংরেজি নাম</li>
              <li><strong>designationBn / designationEn:</strong> পদবী (বাংলা ও ইংরেজি)</li>
              <li><strong>subjectBn / subjectEn:</strong> বিষয় (স্টাফদের জন্য খালি রাখা যাবে)</li>
              <li><strong>phone / email / visible:</strong> যোগাযোগ ও <code>true</code>/<code>false</code></li>
            </ul>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-1.5 rounded-lg bg-primary text-surface font-bold cursor-pointer"
              >
                {lang === 'bn' ? 'বুঝেছি' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
