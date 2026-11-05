import React, { useState, useEffect } from 'react';
import { SchoolContext } from './SchoolContextInstance';
import { storeVideoFile, getVideoFile, deleteVideoFile } from '../utils/mediaStorage';
import { getDhakaDateString } from '../utils/dateFormatter';
import {
  initialSchoolInfo,
  initialUniformInfo,
  initialHeroSlides,
  initialNotices,
  initialTeachers,
  initialStudents,
  initialResults,
  initialGallery,
  initialVideos,
  initialAdmissions,
  initialFees,
  initialRoutines,
  initialUsers,
  SYSTEM_MODULES,
  ROLE_DEFINITIONS
} from '../data/initialData';

export function SchoolProvider({ children }) {
  // Auto-select Bangla ('bn') on first load / new session; user can toggle to English anytime
  const [lang, setLang] = useState(() => {
    const sessionActive = sessionStorage.getItem('bdhs_session_active');
    if (!sessionActive) {
      sessionStorage.setItem('bdhs_session_active', 'true');
      localStorage.setItem('bdhs_lang', 'bn');
      return 'bn';
    }
    return localStorage.getItem('bdhs_lang') || 'bn';
  });

  // Active navigation tab with query/hash support
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) return tabParam;
      const hash = window.location.hash.replace('#', '');
      if (hash) return hash;
    }
    return 'home';
  });

  // Auth User with query support for demo previews
  const [authUser, setAuthUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('demo') === 'admin') {
        return {
          id: 'u-1',
          nameBn: 'প্রধান সিস্টেম অ্যাডমিনিস্ট্রেটর',
          nameEn: 'Super Administrator',
          username: 'superadmin',
          role: 'superadmin',
          designationBn: 'সুপার অ্যাডমিন',
          designationEn: 'Super Admin',
          permissions: ['*']
        };
      }
    }
    const saved = localStorage.getItem('bdhs_auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (saved.includes('রবিউল') || saved.includes('Rabiul') || (parsed.name && parsed.name.includes('রবিউল')) || (parsed.nameBn && parsed.nameBn.includes('রবিউল'))) {
          parsed.name = 'জনাব বাহার উদ্দিন ভূঁইয়া';
          parsed.nameBn = 'জনাব বাহার উদ্দিন ভূঁইয়া';
          parsed.nameEn = 'Mr. Bahar Uddin Bhuiyan';
          parsed.designation = 'ভারপ্রাপ্ত প্রধান শিক্ষক';
          parsed.designationBn = 'ভারপ্রাপ্ত প্রধান শিক্ষক';
          parsed.designationEn = 'Acting Headmaster';
          localStorage.setItem('bdhs_auth', JSON.stringify(parsed));
        }
        return parsed;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Core Data States with LocalStorage Persistence
  const [schoolInfo, setSchoolInfo] = useState(() => {
    const saved = localStorage.getItem('bdhs_info');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Force official school identifiers & foundation date alignment
        parsed.mpoCode = '105476301';
        parsed.eiin = '106644';
        parsed.foundationDate = '৮ জানুয়ারি, ১৯৯০ (স্বীকৃতি: ১ জানুয়ারি, ১৯৯৪)';
        parsed.foundationDateEn = 'January 8, 1990 (Recognized: January 1, 1994)';
        parsed.roadBn = parsed.roadBn || 'ফেনী-পরশুরাম রোড সংলগ্ন';
        parsed.roadEn = parsed.roadEn || 'Along Feni-Parshuram Road';
        parsed.addressBn = parsed.addressBn || 'ফেনী-পরশুরাম রোড সংলগ্ন, বন্দুয়া দৌলতপুর, আনন্দপুর ইউনিয়ন, ফুলগাজী উপজেলা, ফেনী জেলা, বাংলাদেশ';
        parsed.addressEn = parsed.addressEn || 'Along Feni-Parshuram Road, Bandua Daulatpur, Anandapur Union, Fulgazi, Feni, Bangladesh';
        parsed.nameBn = parsed.nameBn || 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়';
        parsed.nameEn = parsed.nameEn || 'Bandua Daulatpur High School';

        if (!parsed.email || parsed.email.includes('fulgazi')) {
          parsed.email = 'bonduas106644@gmail.com';
        }
        if (!parsed.headmasterNameBn || parsed.headmasterNameBn.includes('রবিউল')) {
          parsed.headmasterNameBn = 'জনাব বাহার উদ্দিন ভূঁইয়া';
          parsed.headmasterNameEn = 'Mr. Bahar Uddin Bhuiyan';
          parsed.headmasterDesignationBn = 'ভারপ্রাপ্ত প্রধান শিক্ষক';
          parsed.headmasterDesignationEn = 'Acting Headmaster';
        }
        if (!parsed.visionBn || parsed.visionBn.includes('নোয়াখালী') || parsed.visionBn.includes('বৃহত্তর')) {
          parsed.visionBn = initialSchoolInfo.visionBn;
          parsed.visionEn = initialSchoolInfo.visionEn;
        }
        if (!parsed.missionBn) {
          parsed.missionBn = initialSchoolInfo.missionBn;
          parsed.missionEn = initialSchoolInfo.missionEn;
        }
        if (!parsed.coreValuesBn) {
          parsed.coreValuesBn = initialSchoolInfo.coreValuesBn;
          parsed.coreValuesEn = initialSchoolInfo.coreValuesEn;
        }
        if (!parsed.campusImage) {
          parsed.campusImage = initialSchoolInfo.campusImage;
        }
        return parsed;
      } catch {
        return initialSchoolInfo;
      }
    }
    return initialSchoolInfo;
  });

  const [uniformInfo, setUniformInfo] = useState(() => {
    const saved = localStorage.getItem('bdhs_uniform');
    return saved ? JSON.parse(saved) : initialUniformInfo;
  });

  const [heroSlides, setHeroSlides] = useState(() => {
    const saved = localStorage.getItem('bdhs_slides');
    return saved ? JSON.parse(saved) : initialHeroSlides;
  });

  const [notices, setNotices] = useState(() => {
    const saved = localStorage.getItem('bdhs_notices');
    return saved ? JSON.parse(saved) : initialNotices;
  });

  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('bdhs_teachers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed) || parsed.length < 16 || !parsed[0].nameBn.includes('বাহার')) {
          return initialTeachers;
        }
        // If cached teachers contain old stock unsplash fashion model images, upgrade to executive avatars while keeping user-uploaded custom photos
        const hasStockModel = parsed.some(t => t.image && t.image.includes('images.unsplash.com'));
        if (hasStockModel) {
          return parsed.map((t, idx) => {
            if (t.image && t.image.startsWith('data:image/') && !t.image.includes('svg')) {
              return t; // Keep custom photo uploaded by user in CMS!
            }
            return {
              ...t,
              image: initialTeachers[idx]?.image || t.image
            };
          });
        }
        return parsed;
      } catch {
        return initialTeachers;
      }
    }
    return initialTeachers;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('bdhs_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem('bdhs_results');
    return saved ? JSON.parse(saved) : initialResults;
  });

  const [gallery, setGallery] = useState(() => {
    const saved = localStorage.getItem('bdhs_gallery');
    return saved ? JSON.parse(saved) : initialGallery;
  });

  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem('bdhs_videos');
    return saved ? JSON.parse(saved) : initialVideos;
  });

  const [admissions, setAdmissions] = useState(() => {
    const saved = localStorage.getItem('bdhs_admissions');
    return saved ? JSON.parse(saved) : initialAdmissions;
  });

  const [fees, setFees] = useState(() => {
    const saved = localStorage.getItem('bdhs_fees');
    return saved ? JSON.parse(saved) : initialFees;
  });

  const [systemUsers, setSystemUsers] = useState(() => {
    const saved = localStorage.getItem('bdhs_system_users');
    if (saved) {
      try {
        if (saved.includes('রবিউল') || saved.includes('Rabiul')) {
          localStorage.setItem('bdhs_system_users', JSON.stringify(initialUsers));
          return initialUsers;
        }
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed) || !parsed.some(u => u.nameBn && u.nameBn.includes('বাহার'))) {
          return initialUsers;
        }
        return parsed;
      } catch {
        return initialUsers;
      }
    }
    return initialUsers;
  });

  const [routines] = useState(initialRoutines);

  // Sync to LocalStorage on updates & update html lang attribute (M3)
  useEffect(() => {
    localStorage.setItem('bdhs_lang', lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  // URL Hash routing synchronization (H4)
  useEffect(() => {
    if (typeof window !== 'undefined' && activeTab) {
      const currentHash = window.location.hash.replace('#', '');
      if (currentHash !== activeTab) {
        window.history.replaceState(null, '', `#${activeTab}`);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== activeTab) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem('bdhs_auth', JSON.stringify(authUser));
    } else {
      localStorage.removeItem('bdhs_auth');
    }
  }, [authUser]);

  useEffect(() => {
    localStorage.setItem('bdhs_info', JSON.stringify(schoolInfo));
  }, [schoolInfo]);

  useEffect(() => {
    localStorage.setItem('bdhs_uniform', JSON.stringify(uniformInfo));
  }, [uniformInfo]);

  useEffect(() => {
    localStorage.setItem('bdhs_slides', JSON.stringify(heroSlides));
  }, [heroSlides]);

  useEffect(() => {
    localStorage.setItem('bdhs_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('bdhs_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('bdhs_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('bdhs_results', JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem('bdhs_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    try {
      localStorage.setItem('bdhs_videos', JSON.stringify(videos));
    } catch (e) {
      console.warn('LocalStorage limit for videos reached, storing light references:', e);
      try {
        const lightweight = videos.map(v => {
          if (v.videoUrl && v.videoUrl.length > 150000) {
            return { ...v, videoUrl: `idb://${v.id}`, isIndexedDb: true };
          }
          return v;
        });
        localStorage.setItem('bdhs_videos', JSON.stringify(lightweight));
      } catch (err2) {
        console.error('Critical quota error:', err2);
      }
    }
  }, [videos]);

  // Rehydrate IndexedDB stored videos into object URLs if needed
  useEffect(() => {
    let isMounted = true;
    const rehydrateVideos = () => {
      try {
        setVideos(prevVideos => {
          Promise.all(
            prevVideos.map(async (vid) => {
              if (vid.isIndexedDb || vid.videoUrl?.startsWith('idb://') || !vid.videoUrl) {
                const fileBlob = await getVideoFile(vid.id);
                if (fileBlob) {
                  return { ...vid, videoUrl: URL.createObjectURL(fileBlob) };
                }
              }
              return vid;
            })
          ).then(updated => {
            if (isMounted) {
              const hasDiff = updated.some((v, idx) => v.videoUrl !== prevVideos[idx]?.videoUrl);
              if (hasDiff) {
                setVideos(updated);
              }
            }
          }).catch(err => console.warn('Error in video rehydration promise:', err));
          return prevVideos;
        });
      } catch (err) {
        console.warn('Error rehydrating videos from IndexedDB:', err);
      }
    };
    rehydrateVideos();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem('bdhs_admissions', JSON.stringify(admissions));
  }, [admissions]);

  useEffect(() => {
    localStorage.setItem('bdhs_fees', JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem('bdhs_system_users', JSON.stringify(systemUsers));
  }, [systemUsers]);

  // Actions
  const toggleLanguage = () => {
    setLang(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  // Authentication & Access Control (RBAC)
  const authenticate = (username, password) => {
    const user = systemUsers.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );
    if (!user) {
      return { success: false, message: 'ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়।' };
    }
    if (user.status === 'inactive') {
      return { success: false, message: 'আপনার অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে। অনুগ্রহ করে প্রধান সিস্টেম প্রশাসকের সাথে যোগাযোগ করুন।' };
    }
    const authData = {
      id: user.id,
      username: user.username,
      name: user.nameBn,
      nameBn: user.nameBn,
      nameEn: user.nameEn,
      role: user.role,
      designation: user.designationBn,
      designationBn: user.designationBn,
      designationEn: user.designationEn,
      permissions: user.permissions || [],
      loginTime: new Date().toISOString()
    };
    setAuthUser(authData);
    setLang('bn');
    localStorage.setItem('bdhs_lang', 'bn');
    setAuthModalOpen(false);
    setActiveTab('admin');
    return { success: true, user: authData };
  };

  const login = (role, username) => {
    // Check if matching user exists in systemUsers
    const matched = systemUsers.find(u => u.role === role || u.username === username);
    if (matched) {
      setAuthUser({
        id: matched.id,
        username: matched.username,
        name: matched.nameBn,
        nameBn: matched.nameBn,
        nameEn: matched.nameEn,
        role: matched.role,
        designation: matched.designationBn,
        designationBn: matched.designationBn,
        designationEn: matched.designationEn,
        permissions: matched.permissions || [],
        loginTime: new Date().toISOString()
      });
    } else {
      const roleDef = ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS.headmaster;
      setAuthUser({
        id: `usr-${role || 'admin'}`,
        username: username || role || 'admin',
        name: role === 'superadmin' ? 'প্রধান সিস্টেম অ্যাডমিনিস্ট্রেটর' : 'বিদ্যালয় পরিচালক',
        nameBn: role === 'superadmin' ? 'প্রধান সিস্টেম অ্যাডমিনিস্ট্রেটর' : 'বিদ্যালয় পরিচালক',
        nameEn: role === 'superadmin' ? 'Super Administrator' : 'Administrator',
        role: role || 'superadmin',
        designation: roleDef?.nameBn || 'Administrator',
        designationBn: roleDef?.nameBn || 'Administrator',
        designationEn: roleDef?.nameEn || 'Administrator',
        permissions: roleDef?.defaultPermissions || ['cms', 'teachers', 'students', 'admissions', 'results', 'notices', 'fees', 'settings', 'users'],
        loginTime: new Date().toISOString()
      });
    }
    setAuthModalOpen(false);
    setLang('bn');
    localStorage.setItem('bdhs_lang', 'bn');
    setActiveTab('admin');
  };

  const logout = () => {
    setAuthUser(null);
    setActiveTab('home');
  };

  const hasPermission = (moduleKey) => {
    if (!authUser) return false;
    if (authUser.role === 'superadmin') return true;
    return Array.isArray(authUser.permissions) && authUser.permissions.includes(moduleKey);
  };

  // User Management Actions (Superadmin Controlled)
  const addUser = (newUser) => {
    const created = {
      ...newUser,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: newUser.status || 'active'
    };
    setSystemUsers(prev => [created, ...prev]);
    return created;
  };

  const updateUser = (updatedUser) => {
    setSystemUsers(prev => prev.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
    if (authUser && authUser.id === updatedUser.id) {
      setAuthUser(prev => ({
        ...prev,
        name: updatedUser.nameBn || prev.name,
        nameEn: updatedUser.nameEn || prev.nameEn,
        role: updatedUser.role || prev.role,
        designation: updatedUser.designationBn || prev.designation,
        permissions: updatedUser.permissions || prev.permissions
      }));
    }
  };

  const deleteUser = (userId) => {
    setSystemUsers(prev => prev.filter(u => u.id !== userId));
  };

  const toggleUserStatus = (userId) => {
    setSystemUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'inactive' : 'active' };
      }
      return u;
    }));
  };

  const addNotice = (notice) => {
    const today = getDhakaDateString();
    const newNotice = {
      ...notice,
      id: `not-${Date.now()}`,
      date: notice.date || today,
      publishDate: notice.publishDate || notice.date || today
    };
    setNotices(prev => [newNotice, ...prev]);
    return newNotice;
  };

  const updateNotice = (id, updatedNotice) => {
    setNotices(prev => prev.map(n => {
      if (n.id === id) {
        const dateVal = updatedNotice.date || n.date;
        return {
          ...n,
          ...updatedNotice,
          date: dateVal,
          publishDate: updatedNotice.publishDate || dateVal
        };
      }
      return n;
    }));
  };

  const deleteNotice = (id) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  const addStudent = (student) => {
    const newStudent = {
      ...student,
      id: `stu-${Date.now()}`,
      studentId: `BDHS-2026-${Math.floor(100 + Math.random() * 900)}`
    };
    setStudents(prev => [newStudent, ...prev]);
    return newStudent;
  };

  const updateStudent = (id, updatedData) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const addTeacher = (teacher) => {
    const newTeacher = {
      ...teacher,
      id: `tea-${Date.now()}`
    };
    setTeachers(prev => [...prev, newTeacher]);
  };

  const updateTeacher = (id, updatedData) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
  };

  const deleteTeacher = (id) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  const submitAdmission = (formData) => {
    const nextSeq = admissions.length + 1;
    const trackingId = `BDHS-ADM-2027-${String(nextSeq).padStart(3, '0')}`;
    const newApplication = {
      ...formData,
      studentNameEn: (formData.studentNameEn || '').trim().toUpperCase(),
      id: `adm-${Date.now()}`,
      trackingId,
      submissionDate: getDhakaDateString(),
      status: 'Pending'
    };
    setAdmissions(prev => [newApplication, ...prev]);
    return newApplication;
  };

  const updateAdmissionStatus = (id, status) => {
    setAdmissions(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const approveAdmissionAndCreateStudent = (admissionApp) => {
    // 1. Mark status as Approved
    setAdmissions(prev => prev.map(a => a.id === admissionApp.id ? { ...a, status: 'Approved' } : a));

    // 2. Find next roll in target class
    const targetClass = admissionApp.applyingClass || '6';
    const sameClassStudents = students.filter(s => s.class === targetClass);
    const maxRoll = sameClassStudents.reduce((max, s) => {
      const r = Number(s.roll);
      return !isNaN(r) && r > max ? r : max;
    }, 100);
    const newRoll = maxRoll + 1;

    // 3. Create student record
    const createdStudent = {
      id: `stu-${Date.now()}`,
      studentId: `BDHS-2027-${newRoll}`,
      roll: newRoll,
      nameBn: admissionApp.studentNameBn || admissionApp.studentNameEn,
      nameEn: (admissionApp.studentNameEn || '').toUpperCase(),
      class: targetClass,
      section: 'A',
      group: admissionApp.group || 'General',
      gender: admissionApp.gender || 'Male',
      dob: admissionApp.dob || '2012-01-01',
      bloodGroup: admissionApp.bloodGroup || '',
      guardianName: admissionApp.fatherName || admissionApp.motherName || '',
      guardianPhone: admissionApp.guardianPhone || '',
      address: admissionApp.address || ''
    };

    setStudents(prev => [createdStudent, ...prev]);
    return createdStudent;
  };

  const addResult = (resultData) => {
    setResults(prev => {
      const filtered = prev.filter(r => !(r.roll === resultData.roll && r.exam === resultData.exam));
      return [resultData, ...filtered];
    });
  };

  const addFee = (feeData) => {
    const newFee = {
      ...feeData,
      id: `fee-${Date.now()}`,
      receiptNo: `REC-2027-${Math.floor(1000 + Math.random() * 9000)}`,
      paidDate: getDhakaDateString(),
      status: 'Paid'
    };
    setFees(prev => [newFee, ...prev]);
    return newFee;
  };

  // Contact form persistence (C4)
  const [contactMessages, setContactMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('bdhs_contact_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const submitContactMessage = (msg) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      ...msg,
      submittedAt: getDhakaDateString(),
      status: 'New'
    };
    setContactMessages(prev => {
      const updated = [newMsg, ...prev];
      localStorage.setItem('bdhs_contact_messages', JSON.stringify(updated));
      return updated;
    });
    return newMsg;
  };

  const addGalleryItem = (item) => {
    const newItem = {
      ...item,
      id: `gal-${Date.now()}`,
      date: getDhakaDateString()
    };
    setGallery(prev => [newItem, ...prev]);
  };

  const deleteGalleryItem = (id) => {
    setGallery(prev => prev.filter(g => g.id !== id));
  };

  const addVideoItem = async (video) => {
    const newVidId = `vid-${Date.now()}`;
    if (video.videoFile) {
      await storeVideoFile(newVidId, video.videoFile);
    }
    const newVid = {
      ...video,
      id: newVidId
    };
    delete newVid.videoFile;
    setVideos(prev => [newVid, ...prev]);
  };

  const deleteVideoItem = (id) => {
    deleteVideoFile(id);
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  const resetToDefaults = (confirmCode) => {
    if (authUser?.role !== 'superadmin') {
      alert('অননুমোদিত এক্সেস: শুধুমাত্র সুপার অ্যাডমিন ফ্যাক্টরি রিসেট করতে পারবেন।');
      return false;
    }
    if (confirmCode !== 'RESET') {
      alert('ফ্যাক্টরি রিসেট নিশ্চিত করতে বক্সে "RESET" টাইপ করুন।');
      return false;
    }
    localStorage.clear();
    setSchoolInfo(initialSchoolInfo);
    setUniformInfo(initialUniformInfo);
    setHeroSlides(initialHeroSlides);
    setNotices(initialNotices);
    setTeachers(initialTeachers);
    setStudents(initialStudents);
    setResults(initialResults);
    setGallery(initialGallery);
    setVideos(initialVideos);
    setAdmissions(initialAdmissions);
    setFees(initialFees);
    setSystemUsers(initialUsers);
    setContactMessages([]);
    alert('সকল তথ্য সফলভাবে ফ্যাক্টরি ডিফল্ট অবস্থায় ফিরিয়ে আনা হয়েছে!');
    return true;
  };

  return (
    <SchoolContext.Provider
      value={{
        lang,
        setLang,
        toggleLanguage,
        activeTab,
        setActiveTab,
        authUser,
        authModalOpen,
        setAuthModalOpen,
        login,
        authenticate,
        logout,
        hasPermission,
        systemUsers,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        SYSTEM_MODULES,
        ROLE_DEFINITIONS,
        schoolInfo,
        setSchoolInfo,
        uniformInfo,
        setUniformInfo,
        heroSlides,
        setHeroSlides,
        notices,
        addNotice,
        updateNotice,
        deleteNotice,
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        results,
        addResult,
        gallery,
        addGalleryItem,
        deleteGalleryItem,
        videos,
        addVideoItem,
        deleteVideoItem,
        admissions,
        submitAdmission,
        updateAdmissionStatus,
        approveAdmissionAndCreateStudent,
        fees,
        addFee,
        contactMessages,
        submitContactMessage,
        routines,
        resetToDefaults
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
}
