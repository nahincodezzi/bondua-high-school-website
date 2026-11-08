import React, { useState, useEffect } from 'react';
import { SchoolContext } from './SchoolContextInstance';
import { deepSanitizeBondua } from '../utils/sanitizeData';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { runStorageMigration, getStoredItem, setStoredItem } from '../utils/storageAdapter';
import { storeVideoFile, getVideoFile, deleteVideoFile } from '../utils/mediaStorage';
import { getDhakaDateString } from '../utils/dateFormatter';
import { hashPassword, verifyPassword, hashPasswordPbkdf2 } from '../utils/security';
import {
  supabase,
  isSupabaseConfigured,
  fetchAllCloudData,
  seedCloudIfEmpty,
  mappers
} from '../lib/supabase';
import { DEFAULT_SCHOOL_LOGO } from '../utils/branding';
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
  initialAcademicGroups,
  initialCommittee,
  SYSTEM_MODULES,
  ROLE_DEFINITIONS
} from '../data/initialData';

export function SchoolProvider({ children }) {
  // Configurable Storage Prefix Migration & Cache Sanitization
  if (typeof window !== 'undefined') {
    try {
      runStorageMigration();

      // Purge all legacy "Bandua" spellings across localStorage (one-time idempotent)
      const keysToClean = [
        'info', 'slides', 'notices', 'teachers', 
        'students', 'admissions', 'results', 'fees', 
        'gallery', 'academic_groups', 'academic_config', 
        'uniform', 'system_users'
      ];
      for (const k of keysToClean) {
        const item = getStoredItem(k);
        if (item && (item.includes('Bandua') || item.includes('bandua') || item.includes('BANDUA'))) {
          try {
            const parsed = JSON.parse(item);
            const sanitized = deepSanitizeBondua(parsed);
            setStoredItem(k, sanitized);
          } catch {
            setStoredItem(k, item.replace(/Bandua/g, 'Bondua').replace(/bandua/g, 'bondua').replace(/BANDUA/g, 'BONDUA'));
          }
        }
      }

      const rawAuth = getStoredItem('auth');
      if (rawAuth && (rawAuth.includes('রবিউল') || rawAuth.includes('Rabiul') || rawAuth.includes('মজুমদার') || rawAuth.includes('মুজুমদার'))) {
        localStorage.removeItem('bdhs_auth');
        localStorage.removeItem('site_auth');
      }
      const rawUsers = getStoredItem('system_users');
      if (rawUsers && (rawUsers.includes('রবিউল') || rawUsers.includes('Rabiul') || !rawUsers.includes('বাহার'))) {
        setStoredItem('system_users', initialUsers);
      }
    } catch (e) {
      console.error('Cache migration cleanup error:', e);
    }
  }

  // Two-Theme System: 'emerald' (default) | 'indigo'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlTheme = urlParams.get('theme');
        if (urlTheme === 'indigo' || urlTheme === 'emerald') return urlTheme;
        const savedTheme = getStoredItem('theme');
        if (savedTheme === 'indigo' || savedTheme === 'emerald') return savedTheme;
      } catch (e) {
        console.error('Error reading theme from localStorage:', e);
      }
    }
    return initialSchoolInfo.defaultTheme || 'emerald';
  });

  const toggleTheme = () => {
    setTheme(prev => (prev === 'emerald' ? 'indigo' : 'emerald'));
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('theme-transition');
      const timer = setTimeout(() => {
        document.body.classList.remove('theme-transition');
      }, 300);

      document.documentElement.setAttribute('data-theme', theme);
      setStoredItem('theme', theme);

      return () => clearTimeout(timer);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('theme-transition');
      const timer = setTimeout(() => {
        document.body.classList.remove('theme-transition');
      }, 300);

      if (theme === 'indigo') {
        document.documentElement.setAttribute('data-theme', 'indigo');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }

      const meta = document.getElementById('meta-theme-color');
      if (meta) {
        meta.setAttribute('content', theme === 'indigo' ? '#1E1B4B' : '#0B3D2E');
      }

      try {
        localStorage.setItem('bdhs_theme', theme);
      } catch (e) {
        console.error('Error saving theme to localStorage:', e);
      }

      return () => clearTimeout(timer);
    }
  }, [theme]);

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
      if (hash && hash !== 'main-content') return hash;
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

        // Anti-Tampering Check (A1): Verify against system registry
        const uSaved = localStorage.getItem('bdhs_system_users');
        const authenticUsers = uSaved ? JSON.parse(uSaved) : initialUsers;
        const matched = Array.isArray(authenticUsers) && authenticUsers.find(
          u => u.username?.toLowerCase() === parsed.username?.toLowerCase()
        );

        if (!matched || matched.status === 'inactive') {
          localStorage.removeItem('bdhs_auth');
          return null;
        }

        // Enforce authentic role and permissions from system registry!
        parsed.role = matched.role;
        parsed.permissions = matched.permissions || [];
        parsed.nameBn = matched.nameBn;
        parsed.designationBn = matched.designationBn;
        parsed.designationEn = matched.designationEn;
        localStorage.setItem('bdhs_auth', JSON.stringify(parsed));

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
        const rawParsed = JSON.parse(saved);
        const parsed = deepSanitizeBondua(rawParsed);
        // Force official school identifiers & foundation date alignment (Official Notice 2025: MPO 0905171301)
        parsed.mpoCode = '0905171301';
        parsed.eiin = '106644';
        parsed.foundationDate = '৮ জানুয়ারি, ১৯৯০ (স্বীকৃতি: ১ জানুয়ারি, ১৯৯৪)';
        parsed.foundationDateEn = 'January 8, 1990 (Recognized: January 1, 1994)';
        parsed.roadBn = parsed.roadBn || 'ফেনী-পরশুরাম রোড সংলগ্ন';
        parsed.roadEn = parsed.roadEn || 'Along Feni-Parshuram Road';
        parsed.addressBn = parsed.addressBn || 'ফেনী-পরশুরাম রোড সংলগ্ন, বন্দুয়া দৌলতপুর, আনন্দপুর ইউনিয়ন, ফুলগাজী উপজেলা, ফেনী জেলা, বাংলাদেশ';
        parsed.addressEn = (parsed.addressEn || initialSchoolInfo.addressEn).replace(/Bandua/g, 'Bondua');
        parsed.nameBn = parsed.nameBn || 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়';
        parsed.nameEn = 'Bondua Daulatpur High School';
        parsed.nameAlt = 'Bondua Doulatpur High School';

        if (!parsed.email || parsed.email.includes('fulgazi')) {
          parsed.email = 'bonduas106644@gmail.com';
        }
        if (!parsed.headmasterNameBn || parsed.headmasterNameBn.includes('রবিউল')) {
          parsed.headmasterNameBn = 'জনাব বাহার উদ্দিন ভূঁইয়া';
          parsed.headmasterNameEn = 'Mr. Bahar Uddin Bhuiyan';
          parsed.headmasterDesignationBn = 'ভারপ্রাপ্ত প্রধান শিক্ষক';
          parsed.headmasterDesignationEn = 'Acting Headmaster';
        }
        if (!parsed.visionBn || parsed.visionBn.includes('নোয়াখালী') || parsed.visionBn.includes('নোয়াখালী') || parsed.visionBn.includes('বৃহত্তর')) {
          parsed.visionBn = initialSchoolInfo.visionBn;
          parsed.visionEn = initialSchoolInfo.visionEn;
          localStorage.setItem('bdhs_info', JSON.stringify(parsed));
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

        // Centralized Single School Logo & Migration
        if (!parsed.schoolLogo) {
          parsed.schoolLogo = parsed.logo || parsed.logos?.emerald?.onLight || parsed.logos?.emerald?.onDark || initialSchoolInfo.schoolLogo || DEFAULT_SCHOOL_LOGO;
        }
        parsed.logo = parsed.schoolLogo;
        parsed.logos = {
          emerald: { onDark: parsed.schoolLogo, onLight: parsed.schoolLogo },
          indigo: { onDark: parsed.schoolLogo, onLight: parsed.schoolLogo },
        };
        if (!parsed.hero || typeof parsed.hero !== 'object') {
          parsed.hero = initialSchoolInfo.hero;
        }
        if (!Array.isArray(parsed.stats) || parsed.stats.length === 0) {
          parsed.stats = initialSchoolInfo.stats;
        }
        if (!parsed.admissionYear) parsed.admissionYear = initialSchoolInfo.admissionYear || '২০২৭';
        if (!parsed.academicYear) parsed.academicYear = initialSchoolInfo.academicYear || '2026';
        if (parsed.headerSubtitleBn === undefined) parsed.headerSubtitleBn = '';
        if (parsed.headerSubtitleEn === undefined) parsed.headerSubtitleEn = '';
        if (!parsed.footerAboutBn) parsed.footerAboutBn = initialSchoolInfo.footerAboutBn;
        if (!parsed.footerAboutEn) parsed.footerAboutEn = initialSchoolInfo.footerAboutEn;

        return parsed;
      } catch {
        return initialSchoolInfo;
      }
    }
    return initialSchoolInfo;
  });

  // Keep browser tab title, favicon, meta description, and theme-color updated live
  useDocumentMeta(schoolInfo, theme, lang);

  const [uniformInfo, setUniformInfo] = useState(() => {
    const saved = localStorage.getItem('bdhs_uniform');
    return saved ? JSON.parse(saved) : initialUniformInfo;
  });

  const [academicConfig, setAcademicConfig] = useState(() => {
    const defaultExams = [
      { id: 'ex-1', name: 'SSC Test Examination 2026', labelBn: 'এসএসসি টেস্ট পরীক্ষা ২০২৬' },
      { id: 'ex-2', name: 'Annual Examination 2025', labelBn: 'বার্ষিক পরীক্ষা ২০২৫' },
      { id: 'ex-3', name: 'Pre-Test Examination 2026', labelBn: 'প্রাক-নির্বাচনী পরীক্ষা ২০২৬' },
      { id: 'ex-4', name: 'Half-Yearly Examination 2026', labelBn: 'অর্ধবার্ষিক পরীক্ষা ২০২৬' },
    ];
    const defaultClasses = [
      { id: 'cls-10', key: '10', labelBn: '১০ম শ্রেণি', labelEn: 'Class 10' },
      { id: 'cls-9', key: '9', labelBn: '৯ম শ্রেণি', labelEn: 'Class 9' },
      { id: 'cls-8', key: '8', labelBn: '৮ম শ্রেণি', labelEn: 'Class 8' },
      { id: 'cls-7', key: '7', labelBn: '৭ম শ্রেণি', labelEn: 'Class 7' },
      { id: 'cls-6', key: '6', labelBn: '৬ষ্ঠ শ্রেণি', labelEn: 'Class 6' },
    ];
    try {
      const saved = localStorage.getItem('bdhs_academic_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.exams) && Array.isArray(parsed.classes)) {
          return {
            exams: parsed.exams,
            classes: parsed.classes,
            subjects: Array.isArray(parsed.subjects) ? parsed.subjects : []
          };
        }
      }
    } catch {}
    return {
      exams: defaultExams,
      classes: defaultClasses,
      subjects: []
    };
  });

  const [academicGroups, setAcademicGroups] = useState(() => {
    try {
      const saved = localStorage.getItem('bdhs_academic_groups');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return initialAcademicGroups;
  });

  const [heroSlides, setHeroSlides] = useState(() => {
    const saved = localStorage.getItem('bdhs_slides');
    if (saved) {
      try {
        const parsed = deepSanitizeBondua(JSON.parse(saved));
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s, idx) => ({
            ...s,
            titleEn: s.titleEn || initialHeroSlides[idx]?.titleEn || s.titleBn,
            subtitleEn: s.subtitleEn || initialHeroSlides[idx]?.subtitleEn || s.subtitleBn || '',
            tagEn: s.tagEn || initialHeroSlides[idx]?.tagEn || s.tagBn || '',
          }));
        }
      } catch {}
    }
    return initialHeroSlides;
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

  const [committee, setCommittee] = useState(() => {
    const saved = localStorage.getItem('bdhs_committee') || localStorage.getItem('site_committee');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return initialCommittee || [];
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

  // Contact form persistence (C4 Fix: LocalStorage + Supabase cloud sync)
  const [contactMessages, setContactMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('bdhs_contact_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Idle Session Expiration after 30 minutes of inactivity (N8)
  useEffect(() => {
    if (!authUser) return;
    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        alert(lang === 'bn' ? 'নিরাপত্তার স্বার্থে ৩০ মিনিট নিষ্ক্রিয় থাকার পর সেশন সমাপ্ত হয়েছে।' : 'Session expired after 30 minutes of inactivity.');
        setAuthUser(null);
        setActiveTab('home');
      }, 30 * 60 * 1000); // 30 minutes
    };
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(ev => window.addEventListener(ev, resetTimer, { passive: true }));
    resetTimer();
    return () => {
      clearTimeout(timer);
      events.forEach(ev => window.removeEventListener(ev, resetTimer));
    };
  }, [authUser, lang]);

  // Sync to LocalStorage on updates & update html lang attribute (M3)
  useEffect(() => {
    localStorage.setItem('bdhs_lang', lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  // URL Hash routing synchronization with pushState & popstate (H1 / H4 / TC06)
  useEffect(() => {
    if (typeof window !== 'undefined' && activeTab) {
      const currentHash = window.location.hash.replace('#', '') || 'home';
      if (currentHash !== activeTab) {
        window.history.pushState({ tab: activeTab }, '', `#${activeTab}`);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      if (hash === 'main-content') return;
      setActiveTab(hash);
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Supabase Cloud Synchronization & Auto-Seed
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    let isMounted = true;
    async function initCloudSync() {
      try {
        // 1. Seed any empty tables with initial baseline data
        await seedCloudIfEmpty({
          notices: initialNotices,
          teachers: initialTeachers,
          students: initialStudents,
          admissions: initialAdmissions,
          results: initialResults,
          fees: initialFees,
          heroSlides: initialHeroSlides,
          gallery: initialGallery,
          schoolInfo: initialSchoolInfo,
          systemUsers: initialUsers,
        });

        // 2. Fetch live data from Supabase
        const cloud = await fetchAllCloudData();
        if (!isMounted || !cloud) return;

        if (cloud.notices && cloud.notices.length > 0) setNotices(cloud.notices);
        if (cloud.teachers && cloud.teachers.length > 0) setTeachers(cloud.teachers);
        if (cloud.students && cloud.students.length > 0) {
          const cleanStudents = cloud.students.filter(s => {
            const name = (s.nameBn || s.nameEn || '').trim().toLowerCase();
            return name !== 'ক' && name !== 'nn' && name !== 'hjhbbbb';
          });
          setStudents(cleanStudents);
        }
        if (cloud.admissions && cloud.admissions.length > 0) {
          const cleanAdmissions = cloud.admissions.filter(a => {
            const name = (a.studentNameBn || a.studentNameEn || '').trim().toLowerCase();
            return name !== 'ক' && name !== 'nn' && name !== 'hjhbbbb';
          });
          setAdmissions(cleanAdmissions);
        }
        if (cloud.results && cloud.results.length > 0) setResults(cloud.results);
        if (cloud.fees && cloud.fees.length > 0) setFees(cloud.fees);
        if (cloud.heroSlides && cloud.heroSlides.length > 0) {
          const cleanSlides = deepSanitizeBondua(cloud.heroSlides).map((s, idx) => ({
            ...s,
            titleEn: s.titleEn || initialHeroSlides[idx]?.titleEn || s.titleBn,
            subtitleEn: s.subtitleEn || initialHeroSlides[idx]?.subtitleEn || s.subtitleBn || '',
            tagEn: s.tagEn || initialHeroSlides[idx]?.tagEn || s.tagBn || '',
          }));
          setHeroSlides(cleanSlides);
          localStorage.setItem('bdhs_slides', JSON.stringify(cleanSlides));
        }
        if (cloud.gallery && cloud.gallery.length > 0) setGallery(cloud.gallery);
        if (cloud.schoolInfo) {
          const cleanInfo = deepSanitizeBondua(cloud.schoolInfo);
          cleanInfo.nameEn = cleanInfo.nameEn || 'Bondua Daulatpur High School';
          cleanInfo.nameAlt = cleanInfo.nameAlt || 'Bondua Doulatpur High School';
          if (cleanInfo.addressEn) cleanInfo.addressEn = cleanInfo.addressEn.replace(/Bandua/g, 'Bondua');

          // Centralized Single School Logo & Migration
          if (!cleanInfo.schoolLogo) {
            cleanInfo.schoolLogo = cleanInfo.logo || cleanInfo.logos?.emerald?.onLight || cleanInfo.logos?.emerald?.onDark || initialSchoolInfo.schoolLogo || DEFAULT_SCHOOL_LOGO;
          }
          cleanInfo.logo = cleanInfo.schoolLogo;
          cleanInfo.logos = {
            emerald: { onDark: cleanInfo.schoolLogo, onLight: cleanInfo.schoolLogo },
            indigo: { onDark: cleanInfo.schoolLogo, onLight: cleanInfo.schoolLogo },
          };
          if (!cleanInfo.hero || typeof cleanInfo.hero !== 'object') cleanInfo.hero = initialSchoolInfo.hero;
          if (!Array.isArray(cleanInfo.stats) || cleanInfo.stats.length === 0) cleanInfo.stats = initialSchoolInfo.stats;
          if (!cleanInfo.admissionYear) cleanInfo.admissionYear = initialSchoolInfo.admissionYear || '২০২৭';
          if (!cleanInfo.academicYear) cleanInfo.academicYear = initialSchoolInfo.academicYear || '2026';
          if (cleanInfo.headerSubtitleBn === undefined) cleanInfo.headerSubtitleBn = '';
          if (cleanInfo.headerSubtitleEn === undefined) cleanInfo.headerSubtitleEn = '';
          if (!cleanInfo.footerAboutBn) cleanInfo.footerAboutBn = initialSchoolInfo.footerAboutBn;
          if (!cleanInfo.footerAboutEn) cleanInfo.footerAboutEn = initialSchoolInfo.footerAboutEn;

          setSchoolInfo(cleanInfo);
          setStoredItem('info', cleanInfo);
          // Auto-migrate cloud Supabase row if it contains legacy Bandua or lacks logos
          if (supabase && (JSON.stringify(cloud.schoolInfo).includes('Bandua') || JSON.stringify(cloud.schoolInfo).includes('BANDUA') || !cloud.schoolInfo.logos)) {
            supabase.from('school_info').upsert({ id: 'main', data: cleanInfo }).then(() => {}).catch(() => {});
          }
        }
        if (cloud.uniformInfo) setUniformInfo(cloud.uniformInfo);
        if (cloud.academicConfig) {
          setAcademicConfig(cloud.academicConfig);
          localStorage.setItem('bdhs_academic_config', JSON.stringify(cloud.academicConfig));
        }
        if (cloud.academicGroups && Array.isArray(cloud.academicGroups) && cloud.academicGroups.length > 0) {
          setAcademicGroups(cloud.academicGroups);
          localStorage.setItem('bdhs_academic_groups', JSON.stringify(cloud.academicGroups));
        }
        if (cloud.contactMessages && cloud.contactMessages.length > 0) setContactMessages(cloud.contactMessages);
        if (cloud.videos && cloud.videos.length > 0) setVideos(cloud.videos);
        if (cloud.committee && Array.isArray(cloud.committee)) {
          setCommittee(cloud.committee);
          localStorage.setItem('bdhs_committee', JSON.stringify(cloud.committee));
        }
        if (cloud.systemUsers && cloud.systemUsers.length > 0) {
          setSystemUsers(prev => {
            return cloud.systemUsers.map(cu => {
              const localMatch = prev.find(p => p.username === cu.username || p.id === cu.id);
              const seedMatch = initialUsers.find(iu => iu.username === cu.username);
              return {
                ...cu,
                passwordHash: cu.passwordHash || localMatch?.passwordHash || seedMatch?.passwordHash || ''
              };
            });
          });
        }
      } catch (err) {
        console.warn('Supabase cloud synchronization error:', err);
      }
    }

    initCloudSync();
    return () => { isMounted = false; };
  }, []);

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

  // Authentication & Access Control (Hashed Credentials & Cloud-Synced Users)
  const syncSystemUsersToCloud = (usersList) => {
    if (!supabase) return;
    const sanitized = usersList.map(u => {
      const copy = { ...u };
      delete copy.password; // Never store plaintext password in cloud or storage
      delete copy.passwordHash; // Critical: Never expose password hashes in publicly readable school_info (BUG-C2 fix)
      return copy;
    });
    supabase.from('school_info').upsert({ id: 'system_users', data: sanitized }).then(({ error }) => {
      if (error) console.warn('Supabase sync system_users warning:', error.message);
    });
  };

  const authenticate = async (username, password) => {
    const cleanUser = username.trim().toLowerCase();

    // 1. Server-side Secure Authentication RPC (BUG 1 & BUG 5 fix)
    if (supabase) {
      try {
        const computedHash = await hashPassword(password);
        const { data: rpcRes, error: rpcErr } = await supabase.rpc('verify_login', {
          p_username: cleanUser,
          p_password_hash: computedHash
        });

        if (!rpcErr && Array.isArray(rpcRes) && rpcRes.length > 0) {
          const row = rpcRes[0];
          if (row.success) {
            localStorage.removeItem('bdhs_lockout');
            const authData = {
              id: `usr-${row.username}`,
              username: row.username,
              name: row.name_bn || row.name_en,
              nameBn: row.name_bn,
              nameEn: row.name_en,
              role: row.role,
              designation: row.designation_bn,
              designationBn: row.designation_bn,
              designationEn: row.designation_en,
              permissions: row.permissions || [],
              loginTime: new Date().toISOString()
            };
            setAuthUser(authData);
            setLang('bn');
            localStorage.setItem('bdhs_auth_user', JSON.stringify(authData));
            return { success: true };
          } else if (row.error_code === 'LOCKED') {
            return {
              success: false,
              message: `একাধিক ভুল পাসওয়ার্ড দেওয়ায় অ্যাকাউন্টটি সার্ভার-সাইডে সাময়িকভাবে লক করা হয়েছে। আরও ${row.remaining_minutes || 15} মিনিট পর চেষ্টা করুন।`
            };
          }
        }
      } catch {
        // RPC fallback to local verify if function not yet applied in Supabase
      }
    }

    // 2. Client-side Local Fallback with Rate Limiting (BUG 5 client UX layer)
    const lockDataRaw = localStorage.getItem('bdhs_lockout');
    if (lockDataRaw) {
      try {
        const lockData = JSON.parse(lockDataRaw);
        if (lockData.lockedUntil && Date.now() < lockData.lockedUntil) {
          const remainingMinutes = Math.ceil((lockData.lockedUntil - Date.now()) / 60000);
          return {
            success: false,
            message: `একাধিক ভুল পাসওয়ার্ড দেওয়ায় অ্যাকাউন্টটি সাময়িকভাবে ১৫ মিনিটের জন্য লক করা হয়েছে। আরও ${remainingMinutes} মিনিট পর চেষ্টা করুন।`
          };
        }
      } catch {}
    }

    const user = systemUsers.find(
      u => u.username?.toLowerCase() === cleanUser
    );

    let passwordMatches = false;
    if (user) {
      passwordMatches = await verifyPassword(password, user.passwordHash || user.password, cleanUser);
    }

    if (!user || !passwordMatches) {
      let attempts = 1;
      const prevRaw = localStorage.getItem('bdhs_lockout');
      if (prevRaw) {
        try {
          const prev = JSON.parse(prevRaw);
          if (prev.lockedUntil && Date.now() >= prev.lockedUntil) {
            attempts = 1;
          } else {
            attempts = (prev.attempts || 0) + 1;
          }
        } catch {}
      }

      if (attempts >= 5) {
        const lockedUntil = Date.now() + 15 * 60 * 1000; // 15 minutes lockout
        localStorage.setItem('bdhs_lockout', JSON.stringify({ attempts, lockedUntil }));
        return {
          success: false,
          message: 'টানা ৫ বার ভুল পাসওয়ার্ড দেওয়ায় অ্যাকাউন্টটি ১৫ মিনিটের জন্য লক করা হয়েছে।'
        };
      } else {
        localStorage.setItem('bdhs_lockout', JSON.stringify({ attempts, lockedUntil: 0 }));
        return {
          success: false,
          message: `ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়। (ভুল প্রচেষ্টা: ${attempts}/৫)`
        };
      }
    }

    if (user.status === 'inactive') {
      return { success: false, message: 'আপনার অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে। অনুগ্রহ করে প্রধান সিস্টেম প্রশাসকের সাথে যোগাযোগ করুন।' };
    }

    // Reset lockout counter upon successful login
    localStorage.removeItem('bdhs_lockout');
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

  // User Management Actions (Superadmin Controlled & Cloud Synced with PBKDF2 Hashing - BUG 4)
  const addUser = async (newUser) => {
    const rawPass = newUser.password || 'admin2026';
    const passHash = await hashPasswordPbkdf2(rawPass, newUser.username);
    const created = {
      ...newUser,
      id: `usr-${Date.now()}`,
      passwordHash: passHash,
      createdAt: getDhakaDateString(),
      status: newUser.status || 'active'
    };
    delete created.password;
    setSystemUsers(prev => {
      const updated = [created, ...prev];
      syncSystemUsersToCloud(updated);
      return updated;
    });
    return created;
  };

  const updateUser = async (updatedUserOrId, optionalData) => {
    const isIdFirst = typeof updatedUserOrId === 'string';
    const targetId = isIdFirst ? updatedUserOrId : updatedUserOrId.id;
    let data = isIdFirst ? optionalData : updatedUserOrId;

    if (data.password) {
      const targetUser = systemUsers.find(u => u.id === targetId);
      const uName = targetUser?.username || data.username;
      const passHash = await hashPasswordPbkdf2(data.password, uName);
      data = { ...data, passwordHash: passHash };
      delete data.password;
    }

    setSystemUsers(prev => {
      const updated = prev.map(u => (u.id === targetId ? { ...u, ...data } : u));
      syncSystemUsersToCloud(updated);
      return updated;
    });

    if (authUser && authUser.id === targetId) {
      setAuthUser(prev => ({
        ...prev,
        name: data.nameBn || prev.name,
        nameEn: data.nameEn || prev.nameEn,
        role: data.role || prev.role,
        designation: data.designationBn || prev.designation,
        permissions: data.permissions || prev.permissions
      }));
    }
  };

  const deleteUser = (userId) => {
    setSystemUsers(prev => {
      const updated = prev.filter(u => u.id !== userId);
      syncSystemUsersToCloud(updated);
      return updated;
    });
  };

  const toggleUserStatus = (userId) => {
    setSystemUsers(prev => {
      const updated = prev.map(u => {
        if (u.id === userId) {
          return { ...u, status: u.status === 'active' ? 'inactive' : 'active' };
        }
        return u;
      });
      syncSystemUsersToCloud(updated);
      return updated;
    });
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
    if (supabase) {
      supabase.from('notices').insert(mappers.notice.toDb(newNotice)).then(({ error }) => {
        if (error) {
          const base = {
            id: newNotice.id,
            title_bn: newNotice.titleBn || '',
            title_en: newNotice.titleEn || null,
            category: newNotice.category || 'সাধারণ',
            date: newNotice.date,
            urgent: Boolean(newNotice.isUrgent ?? newNotice.urgent),
            description_bn: newNotice.contentBn || newNotice.descriptionBn || '',
            file_url: newNotice.fileUrl || null,
            author: newNotice.author || 'ভারপ্রাপ্ত প্রধান শিক্ষক'
          };
          supabase.from('notices').insert(base).then(({ error: err2 }) => {
            if (err2) console.warn('Supabase fallback insert notice warning:', err2.message);
          });
        }
      });
    }
    return newNotice;
  };

  const updateNotice = (id, updatedNotice) => {
    setNotices(prev => prev.map(n => {
      if (n.id === id) {
        const dateVal = updatedNotice.date || n.date;
        const merged = {
          ...n,
          ...updatedNotice,
          date: dateVal,
          publishDate: updatedNotice.publishDate || dateVal
        };
        if (supabase) {
          supabase.from('notices').update(mappers.notice.toDb(merged)).eq('id', id).then(({ error }) => {
            if (error) {
              const base = {
                title_bn: merged.titleBn || '',
                title_en: merged.titleEn || null,
                category: merged.category || 'সাধারণ',
                date: merged.date,
                urgent: Boolean(merged.isUrgent ?? merged.urgent),
                description_bn: merged.contentBn || merged.descriptionBn || '',
                file_url: merged.fileUrl || null,
                author: merged.author || 'ভারপ্রাপ্ত প্রধান শিক্ষক'
              };
              supabase.from('notices').update(base).eq('id', id).then(({ error: err2 }) => {
                if (err2) console.warn('Supabase fallback update notice warning:', err2.message);
              });
            }
          });
        }
        return merged;
      }
      return n;
    }));
  };

  const deleteNotice = (id) => {
    setNotices(prev => prev.filter(n => n.id !== id));
    if (supabase) {
      supabase.from('notices').delete().eq('id', id).then(({ error }) => {
        if (error) console.warn('Supabase delete notice warning:', error.message);
      });
    }
  };

  const addStudent = (student) => {
    const classPad = String(student.class || '6').padStart(2, '0');
    const rollPad = String(student.roll || '1').padStart(2, '0');
    const prefix = schoolInfo.shortName || 'STU';
    const year = schoolInfo.academicYear || 2026;
    const studentId = student.studentId || `${prefix}-${year}-${classPad}${rollPad}`;
    const newStudent = {
      ...student,
      id: student.id || `stu-${Date.now()}`,
      studentId: studentId
    };
    setStudents(prev => [newStudent, ...prev]);
    if (supabase) {
      supabase.from('students').insert(mappers.student.toDb(newStudent)).then(({ error }) => {
        if (error) {
          const base = {
            id: newStudent.id,
            roll: String(newStudent.roll),
            name_bn: newStudent.nameBn,
            name_en: newStudent.nameEn,
            class: String(newStudent.class),
            section: newStudent.section || 'A',
            shift: 'দিবা',
            gender: newStudent.gender || 'Male',
            father_name: newStudent.fatherName || newStudent.guardianName || '',
            guardian_phone: newStudent.guardianPhone || '',
            status: 'নিয়মিত'
          };
          supabase.from('students').insert(base).then(({ error: err2 }) => {
            if (err2) console.warn('Supabase fallback insert student warning:', err2.message);
          });
        }
      });
    }
    return newStudent;
  };

  const updateStudent = (id, updatedData) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const merged = { ...s, ...updatedData };
        if (supabase) {
          supabase.from('students').update(mappers.student.toDb(merged)).eq('id', id).then(({ error }) => {
            if (error) {
              const base = {
                roll: String(merged.roll),
                name_bn: merged.nameBn,
                name_en: merged.nameEn,
                class: String(merged.class),
                section: merged.section || 'A',
                gender: merged.gender || 'Male',
                father_name: merged.fatherName || merged.guardianName || '',
                guardian_phone: merged.guardianPhone || ''
              };
              supabase.from('students').update(base).eq('id', id).then(({ error: err2 }) => {
                if (err2) console.warn('Supabase fallback update student warning:', err2.message);
              });
            }
          });
        }
        return merged;
      }
      return s;
    }));
  };

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    if (supabase) {
      supabase.from('students').delete().eq('id', id).then(({ error }) => {
        if (error) console.warn('Supabase delete student warning:', error.message);
      });
    }
  };

  const bulkAddStudents = (studentsList) => {
    if (!Array.isArray(studentsList) || studentsList.length === 0) return 0;
    const enrichedList = studentsList.map((student, idx) => {
      const classPad = String(student.class || '6').padStart(2, '0');
      const rollPad = String(student.roll || '1').padStart(2, '0');
      const prefix = schoolInfo.shortName || 'STU';
    const year = schoolInfo.academicYear || 2026;
    const studentId = student.studentId || `${prefix}-${year}-${classPad}${rollPad}`;
      return {
        ...student,
        id: student.id || `stu-${Date.now()}-${idx}`,
        studentId: studentId
      };
    });

    setStudents(prev => [...enrichedList, ...prev]);

    if (supabase) {
      supabase.from('students').upsert(enrichedList.map(mappers.student.toDb)).then(({ error }) => {
        if (error) {
          const fallback = enrichedList.map(s => ({
            id: s.id,
            roll: String(s.roll),
            class: String(s.class),
            name_bn: s.nameBn || '',
            name_en: s.nameEn || '',
            guardian_phone: s.guardianPhone || ''
          }));
          supabase.from('students').upsert(fallback).then(({ error: err2 }) => {
            if (err2) console.warn('Supabase fallback bulk upsert students warning:', err2.message);
          });
        }
      });
    }

    return enrichedList.length;
  };

  const bulkDeleteStudents = (studentIds) => {
    if (!Array.isArray(studentIds) || studentIds.length === 0) return;
    const idsSet = new Set(studentIds);
    setStudents(prev => prev.filter(s => !idsSet.has(s.id)));
    if (supabase) {
      supabase.from('students').delete().in('id', studentIds).then(({ error }) => {
        if (error) console.warn('Supabase bulk delete students warning:', error.message);
      });
    }
  };

  const addTeacher = (teacher) => {
    const newTeacher = {
      ...teacher,
      id: `tea-${Date.now()}`
    };
    setTeachers(prev => [...prev, newTeacher]);
    if (supabase) {
      supabase.from('teachers').insert(mappers.teacher.toDb(newTeacher)).then(({ error }) => {
        if (error) {
          const base = {
            id: newTeacher.id,
            name_bn: newTeacher.nameBn || '',
            name_en: newTeacher.nameEn || null,
            designation_bn: newTeacher.designationBn || '',
            subject_bn: newTeacher.subjectBn || '',
            phone: newTeacher.phone || '',
            email: newTeacher.email || '',
            education: newTeacher.qualification || newTeacher.education || '',
            order: Number(newTeacher.order) || 10,
            image: newTeacher.image || null
          };
          supabase.from('teachers').insert(base).then(({ error: err2 }) => {
            if (err2) console.warn('Supabase fallback insert teacher warning:', err2.message);
          });
        }
      });
    }
  };

  const updateTeacher = (id, updatedData) => {
    setTeachers(prev => prev.map(t => {
      if (t.id === id) {
        const merged = { ...t, ...updatedData };
        if (supabase) {
          supabase.from('teachers').update(mappers.teacher.toDb(merged)).eq('id', id).then(({ error }) => {
            if (error) {
              const base = {
                name_bn: merged.nameBn || '',
                name_en: merged.nameEn || null,
                designation_bn: merged.designationBn || '',
                subject_bn: merged.subjectBn || '',
                phone: merged.phone || '',
                email: merged.email || '',
                education: merged.qualification || merged.education || '',
                order: Number(merged.order) || 10,
                image: merged.image || null
              };
              supabase.from('teachers').update(base).eq('id', id).then(({ error: err2 }) => {
                if (err2) console.warn('Supabase fallback update teacher warning:', err2.message);
              });
            }
          });
        }
        return merged;
      }
      return t;
    }));
  };

  const deleteTeacher = (id) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    if (supabase) {
      supabase.from('teachers').delete().eq('id', id).then(({ error }) => {
        if (error) console.warn('Supabase delete teacher warning:', error.message);
      });
    }
  };

  // Managing Committee Cloud Sync & Actions (Option A: school_info 'committee' document)
  const syncCommitteeToCloud = (list) => {
    if (!supabase) return;
    supabase.from('school_info').upsert({ id: 'committee', data: list }).then(({ error }) => {
      if (error) console.warn('Supabase sync committee warning:', error.message);
    });
  };

  const addCommitteeMember = (member) => {
    const newMember = {
      ...member,
      id: member.id || `cm_${Date.now()}`,
      order: Number(member.order) || (committee.length + 1),
      status: member.status || 'active'
    };
    setCommittee(prev => {
      const updated = [...prev, newMember].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
      localStorage.setItem('bdhs_committee', JSON.stringify(updated));
      syncCommitteeToCloud(updated);
      return updated;
    });
    return newMember;
  };

  const updateCommitteeMember = (id, updatedData) => {
    setCommittee(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, ...updatedData } : m)
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
      localStorage.setItem('bdhs_committee', JSON.stringify(updated));
      syncCommitteeToCloud(updated);
      return updated;
    });
  };

  const deleteCommitteeMember = (id) => {
    setCommittee(prev => {
      const updated = prev.filter(m => m.id !== id);
      localStorage.setItem('bdhs_committee', JSON.stringify(updated));
      syncCommitteeToCloud(updated);
      return updated;
    });
  };

  const submitAdmission = (formData) => {
    const timestampPart = Date.now().toString().slice(-4);
    const randomPart = Math.floor(100 + Math.random() * 900);
    const prefix = schoolInfo.shortName || 'STU';
    const admYear = schoolInfo.admissionYear?.replace(/\D/g, '') || '2027';
    const trackingId = `${prefix}-ADM-${admYear}-${timestampPart}${randomPart}`;
    const newApplication = {
      ...formData,
      studentNameEn: (formData.studentNameEn || '').trim().toUpperCase(),
      id: trackingId,
      trackingId,
      submissionDate: getDhakaDateString(),
      status: 'Pending'
    };
    setAdmissions(prev => [newApplication, ...prev]);
    if (supabase) {
      supabase.from('admissions').insert(mappers.admission.toDb(newApplication)).then(({ error }) => {
        if (error) {
          // If extra columns do not exist yet, fallback to base columns
          const base = {
            id: newApplication.id,
            applicant_name_bn: newApplication.studentNameBn || newApplication.applicantNameBn || '',
            applicant_name_en: newApplication.studentNameEn || newApplication.applicantNameEn || null,
            desired_class: String(newApplication.applyingClass || '6'),
            gender: newApplication.gender || 'Male',
            guardian_name: newApplication.fatherName || newApplication.guardianName || '',
            guardian_phone: newApplication.guardianPhone || '',
            previous_school: newApplication.previousSchool || null,
            status: newApplication.status || 'Pending'
          };
          supabase.from('admissions').insert(base).then(({ error: err2 }) => {
            if (err2) console.warn('Supabase fallback insert admission warning:', err2.message);
          });
        }
      });
    }
    return newApplication;
  };

  const updateAdmissionStatus = (id, status) => {
    setAdmissions(prev => prev.map(a => {
      if (a.id === id || a.trackingId === id) {
        return { ...a, status };
      }
      return a;
    }));

    if (supabase) {
      // Direct updates with reliable fallback (Senior QA H4)
      supabase.from('admissions').update({ status }).eq('id', id).then(({ error }) => {
        if (error) {
          supabase.from('admissions').update({ status }).eq('tracking_id', id).catch(e => console.warn(e));
        }
      }).catch(e => console.warn(e));
    }
  };

  const approveAdmissionAndCreateStudent = (admissionApp) => {
    // 1. Prevent double approval race conditions (Senior QA H4)
    if (admissionApp.status === 'Approved') {
      const alreadyCreated = students.find(s => 
        (s.nameBn === admissionApp.studentNameBn || s.nameBn === admissionApp.applicantNameBn) && 
        String(s.class) === String(admissionApp.applyingClass || '6')
      );
      if (alreadyCreated) return alreadyCreated;
    }

    // Mark status as Approved in local state and cloud
    const targetId = admissionApp.id || admissionApp.trackingId;
    updateAdmissionStatus(targetId, 'Approved');
    if (admissionApp.trackingId && admissionApp.trackingId !== targetId) {
      updateAdmissionStatus(admissionApp.trackingId, 'Approved');
    }

    // 2. Find next roll in target class
    const targetClass = String(admissionApp.applyingClass || '6');
    const sameClassStudents = students.filter(s => String(s.class) === targetClass);
    const maxRoll = sameClassStudents.reduce((max, s) => {
      const r = Number(s.roll);
      return !isNaN(r) && r > max ? r : max;
    }, 0);
    const newRoll = maxRoll > 0 ? maxRoll + 1 : 1;

    // 3. Create student record with authentic preserved data (H3 & N5 fix)
    const classPad = targetClass.padStart(2, '0');
    const rollPad = String(newRoll).padStart(2, '0');
    const prefix = schoolInfo.shortName || 'STU';
    const year = schoolInfo.academicYear || 2026;
    const studentId = `${prefix}-${year}-${classPad}${rollPad}`;

    const createdStudent = {
      id: `stu-${Date.now()}`,
      studentId: studentId,
      roll: newRoll,
      nameBn: admissionApp.studentNameBn || admissionApp.applicantNameBn || admissionApp.studentNameEn || '',
      nameEn: (admissionApp.studentNameEn || admissionApp.applicantNameEn || '').toUpperCase(),
      class: targetClass,
      section: 'A',
      group: admissionApp.group || 'General',
      gender: admissionApp.gender || 'Male',
      dob: admissionApp.dob || '',
      bloodGroup: admissionApp.bloodGroup || '',
      fatherName: admissionApp.fatherName || admissionApp.guardianName || '',
      guardianName: admissionApp.fatherName || admissionApp.motherName || admissionApp.guardianName || '',
      guardianPhone: admissionApp.guardianPhone || '',
      address: admissionApp.address || '',
      photo: admissionApp.photo || admissionApp.studentPhoto || ''
    };

    setStudents(prev => [createdStudent, ...prev]);
    if (supabase) {
      supabase.from('students').insert(mappers.student.toDb(createdStudent)).then(({ error }) => {
        if (error) {
          const base = {
            id: createdStudent.id,
            roll: String(createdStudent.roll),
            student_id: createdStudent.studentId,
            name_bn: createdStudent.nameBn,
            name_en: createdStudent.nameEn,
            class: createdStudent.class,
            section: createdStudent.section,
            guardian_name: createdStudent.guardianName,
            guardian_phone: createdStudent.guardianPhone
          };
          supabase.from('students').insert(base).catch(err => console.warn('Supabase insert student fallback error:', err));
        }
      });
    }

    return createdStudent;
  };

  const bulkApproveAdmissions = (admissionApps) => {
    if (!Array.isArray(admissionApps) || admissionApps.length === 0) return [];
    
    const pendingApps = admissionApps.filter(app => app.status !== 'Approved');
    if (pendingApps.length === 0) return [];

    const approvedStudents = [];
    const classRollCounters = {};

    pendingApps.forEach(app => {
      const targetClass = String(app.applyingClass || '6');
      if (classRollCounters[targetClass] === undefined) {
        const sameClassStudents = students.filter(s => String(s.class) === targetClass);
        const maxRoll = sameClassStudents.reduce((max, s) => {
          const r = Number(s.roll);
          return !isNaN(r) && r > max ? r : max;
        }, 0);
        classRollCounters[targetClass] = maxRoll > 0 ? maxRoll + 1 : 1;
      } else {
        classRollCounters[targetClass] += 1;
      }

      const assignedRoll = classRollCounters[targetClass];
      const classPad = targetClass.padStart(2, '0');
      const rollPad = String(assignedRoll).padStart(2, '0');
      const prefix = schoolInfo.shortName || 'STU';
    const year = schoolInfo.academicYear || 2026;
    const studentId = `${prefix}-${year}-${classPad}${rollPad}`;

      const createdStudent = {
        id: `stu-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        studentId: studentId,
        roll: assignedRoll,
        nameBn: app.studentNameBn || app.applicantNameBn || app.studentNameEn || '',
        nameEn: (app.studentNameEn || app.applicantNameEn || '').toUpperCase(),
        class: targetClass,
        section: 'A',
        group: app.group || 'General',
        gender: app.gender || 'Male',
        dob: app.dob || '',
        bloodGroup: app.bloodGroup || '',
        fatherName: app.fatherName || app.guardianName || '',
        guardianName: app.fatherName || app.motherName || app.guardianName || '',
        guardianPhone: app.guardianPhone || '',
        address: app.address || '',
        photo: app.photo || app.studentPhoto || ''
      };

      approvedStudents.push(createdStudent);

      const targetId = app.id || app.trackingId;
      updateAdmissionStatus(targetId, 'Approved');
      if (app.trackingId && app.trackingId !== targetId) {
        updateAdmissionStatus(app.trackingId, 'Approved');
      }
    });

    if (approvedStudents.length > 0) {
      setStudents(prev => [...approvedStudents, ...prev]);
      if (supabase) {
        const dbRows = approvedStudents.map(s => mappers.student.toDb(s));
        supabase.from('students').insert(dbRows).then(({ error }) => {
          if (error) {
            console.warn('Supabase bulk insert students warning:', error.message);
          }
        });
      }
    }

    return approvedStudents;
  };

  const bulkSetAdmissionsPending = (admissionApps) => {
    if (!Array.isArray(admissionApps) || admissionApps.length === 0) return;
    admissionApps.forEach(app => {
      const targetId = app.id || app.trackingId;
      updateAdmissionStatus(targetId, 'Pending');
      if (app.trackingId && app.trackingId !== targetId) {
        updateAdmissionStatus(app.trackingId, 'Pending');
      }
    });
  };

  const addResult = (resultData) => {
    const classVal = String(resultData.class || '10');
    const rollVal = String(resultData.roll || '');
    const examVal = resultData.exam || 'SSC Test Examination 2026';
    const yearVal = String(resultData.year || '2026');
    const resultId = resultData.id || `${classVal}-${rollVal}-${examVal}-${yearVal}`;
    const enriched = { ...resultData, id: resultId, class: classVal, roll: rollVal, exam: examVal, year: yearVal };

    setResults(prev => {
      // H1 Fix: Filter by class + roll + exam + year to prevent cross-class overwriting
      const filtered = prev.filter(r => !(r.id === resultId || (String(r.roll) === rollVal && String(r.class) === classVal && r.exam === examVal && String(r.year) === yearVal)));
      return [enriched, ...filtered];
    });

    if (supabase) {
      supabase.from('results').upsert(mappers.result.toDb(enriched)).then(({ error }) => {
        if (error) console.warn('Supabase upsert result warning:', error.message);
      });
    }
  };

  const bulkAddResults = (resultsList) => {
    if (!Array.isArray(resultsList) || resultsList.length === 0) return 0;
    const enrichedList = resultsList.map(resultData => {
      const classVal = String(resultData.class || '10');
      const rollVal = String(resultData.roll || '');
      const examVal = resultData.exam || 'SSC Test Examination 2026';
      const yearVal = String(resultData.year || '2026');
      const resultId = resultData.id || `${classVal}-${rollVal}-${examVal}-${yearVal}`;
      return { ...resultData, id: resultId, class: classVal, roll: rollVal, exam: examVal, year: yearVal };
    });

    setResults(prev => {
      const idsToReplace = new Set(enrichedList.map(r => r.id));
      const filtered = prev.filter(r => !idsToReplace.has(r.id));
      return [...enrichedList, ...filtered];
    });

    if (supabase) {
      const dbRows = enrichedList.map(r => mappers.result.toDb(r));
      supabase.from('results').upsert(dbRows).then(({ error }) => {
        if (error) console.warn('Supabase bulk upsert results warning:', error.message);
      });
    }

    return enrichedList.length;
  };

  const deleteResult = (id) => {
    setResults(prev => prev.filter(r => r.id !== id));
    if (supabase) {
      supabase.from('results').delete().eq('id', id).then(({ error }) => {
        if (error) console.warn('Supabase delete result warning:', error.message);
      });
    }
  };

  const addFee = (feeData) => {
    // H4 Fix: Collision-proof receipt number
    const timestampPart = Date.now().toString().slice(-5);
    const randomPart = Math.floor(100 + Math.random() * 900);
    const receiptNo = `REC-${new Date().getFullYear()}-${timestampPart}-${randomPart}`;
    const newFee = {
      ...feeData,
      id: `fee-${Date.now()}`,
      receiptNo,
      paidDate: getDhakaDateString(),
      status: 'Paid',
      voidReason: null
    };
    setFees(prev => [newFee, ...prev]);

    if (supabase) {
      const fullDb = mappers.fee.toDb(newFee);
      supabase.from('fee_receipts').insert(fullDb).then(({ error }) => {
        if (error) {
          // NEW-1 Fix: PGRST204 fallback when cloud table lacks 'status' or 'void_reason' columns
          const coreDb = {
            id: String(newFee.id),
            receipt_no: newFee.receiptNo,
            student_id: newFee.studentId || null,
            student_name: newFee.studentName || '',
            class: String(newFee.class || ''),
            roll: String(newFee.studentRoll || newFee.roll || ''),
            fee_type: newFee.feeType || 'বেতন',
            amount: Number(newFee.amount) || 0,
            paid_date: newFee.paidDate,
            method: newFee.method || 'Cash'
          };
          supabase.from('fee_receipts').insert(coreDb).then(({ error: retryErr }) => {
            if (retryErr) {
              console.warn('Supabase fee insert retry warning:', retryErr.message);
            }
          });
        }
      });
    }
    return newFee;
  };

  const voidFeeReceipt = (feeId, reason = 'ভুল এন্ট্রি / বাতিল') => {
    setFees(prev => prev.map(f => f.id === feeId ? { ...f, status: 'Voided', voidReason: reason } : f));
    if (supabase) {
      supabase.from('fee_receipts').update({ status: 'Voided' }).eq('id', feeId).then(({ error }) => {
        if (error) console.warn('Supabase void fee warning:', error.message);
      });
    }
  };

  const deleteFeeReceipt = (feeId) => {
    setFees(prev => prev.filter(f => f.id !== feeId));
    if (supabase) {
      supabase.from('fee_receipts').delete().eq('id', feeId).then(({ error }) => {
        if (error) console.warn('Supabase delete fee warning:', error.message);
      });
    }
  };

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

      if (supabase) {
        supabase.from('contact_messages').insert({
          id: newMsg.id,
          name: newMsg.name,
          email: newMsg.email || null,
          phone: newMsg.phone || '',
          subject: newMsg.subject || null,
          message: newMsg.message,
          status: 'New'
        }).then(({ error }) => {
          if (error) {
            // Cloud fallback: store in school_info doc
            supabase.from('school_info').upsert({ id: 'contact_messages', data: updated }).then(() => {});
          }
        });
      }

      return updated;
    });
    return newMsg;
  };

  const deleteContactMessage = (id) => {
    setContactMessages(prev => {
      const updated = prev.filter(m => m.id !== id);
      localStorage.setItem('bdhs_contact_messages', JSON.stringify(updated));

      if (supabase) {
        supabase.from('contact_messages').delete().eq('id', id).then(({ error }) => {
          if (error) {
            supabase.from('school_info').upsert({ id: 'contact_messages', data: updated }).then(() => {});
          }
        });
      }
      return updated;
    });
  };

  const updateSchoolSettings = (newInfo) => {
    const updatedInfo = { ...newInfo };
    if (updatedInfo.schoolLogo) {
      updatedInfo.logo = updatedInfo.schoolLogo;
      updatedInfo.logos = {
        emerald: { onDark: updatedInfo.schoolLogo, onLight: updatedInfo.schoolLogo },
        indigo: { onDark: updatedInfo.schoolLogo, onLight: updatedInfo.schoolLogo },
      };
    }
    setSchoolInfo(updatedInfo);
    if (supabase) {
      supabase.from('school_info').upsert({ id: 'main', data: updatedInfo }).then(({ error }) => {
        if (error) console.warn('Supabase upsert school_info warning:', error.message);
      });
    }
  };

  const updateUniformSettings = (newUniform) => {
    setUniformInfo(newUniform);
    localStorage.setItem('bdhs_uniform', JSON.stringify(newUniform));
    if (supabase) {
      supabase.from('school_info').upsert({ id: 'uniform', data: newUniform }).then(({ error }) => {
        if (error) console.warn('Supabase upsert uniform warning:', error.message);
      });
    }
  };

  const updateAcademicGroups = (newGroups) => {
    setAcademicGroups(newGroups);
    localStorage.setItem('bdhs_academic_groups', JSON.stringify(newGroups));
    if (supabase) {
      supabase.from('school_info').upsert({ id: 'academic_groups', data: newGroups }).then(({ error }) => {
        if (error) console.warn('Supabase upsert academic_groups warning:', error.message);
      });
    }
  };

  const addSubjectToGroup = (groupId, subjectName) => {
    if (!subjectName || !subjectName.trim()) return;
    const cleanName = subjectName.trim();
    setAcademicGroups(prev => {
      const next = prev.map(g => {
        if (g.id === groupId) {
          const existing = g.subjectsBn || [];
          if (existing.includes(cleanName)) return g;
          return { ...g, subjectsBn: [...existing, cleanName] };
        }
        return g;
      });
      updateAcademicGroups(next);
      return next;
    });
  };

  const removeSubjectFromGroup = (groupId, subjectIndex) => {
    setAcademicGroups(prev => {
      const next = prev.map(g => {
        if (g.id === groupId) {
          const existing = g.subjectsBn || [];
          const filtered = existing.filter((_, idx) => idx !== subjectIndex);
          return { ...g, subjectsBn: filtered };
        }
        return g;
      });
      updateAcademicGroups(next);
      return next;
    });
  };

  const addExam = (name, labelBn = '') => {
    if (!name || !name.trim()) return null;
    const cleanName = name.trim();
    const cleanBn = (labelBn || cleanName).trim();
    const newExamObj = { id: `ex-${Date.now()}`, name: cleanName, labelBn: cleanBn };

    setAcademicConfig(prev => {
      const existing = prev?.exams || [];
      if (existing.some(e => e.name.toLowerCase() === cleanName.toLowerCase())) return prev;
      const nextConfig = {
        ...prev,
        exams: [...existing, newExamObj]
      };
      localStorage.setItem('bdhs_academic_config', JSON.stringify(nextConfig));
      if (supabase) {
        supabase.from('school_info').upsert({ id: 'academic_config', data: nextConfig }).then(({ error }) => {
          if (error) console.warn('Supabase upsert academic_config warning:', error.message);
        });
      }
      return nextConfig;
    });
    return newExamObj;
  };

  const addClass = (key, labelBn = '') => {
    if (!key || !key.trim()) return null;
    const cleanKey = key.trim();
    const cleanBn = (labelBn || `${toBanglaNumerals(cleanKey)} শ্রেণি`).trim();
    const newClassObj = { id: `cls-${cleanKey}`, key: cleanKey, labelBn: cleanBn, labelEn: `Class ${cleanKey}` };

    setAcademicConfig(prev => {
      const existing = prev?.classes || [];
      if (existing.some(c => String(c.key).toLowerCase() === cleanKey.toLowerCase())) return prev;
      const nextConfig = {
        ...prev,
        classes: [newClassObj, ...existing]
      };
      localStorage.setItem('bdhs_academic_config', JSON.stringify(nextConfig));
      if (supabase) {
        supabase.from('school_info').upsert({ id: 'academic_config', data: nextConfig }).then(({ error }) => {
          if (error) console.warn('Supabase upsert academic_config warning:', error.message);
        });
      }
      return nextConfig;
    });
    return newClassObj;
  };

  const addSubject = (subjectObj) => {
    if (!subjectObj || !subjectObj.name || !subjectObj.name.trim()) return null;
    const cleanName = subjectObj.name.trim();
    const cleanBn = (subjectObj.labelBn || cleanName).trim();
    const cleanCode = (subjectObj.code || '').trim();
    const maxMarks = Number(subjectObj.max) || 100;
    const targetClass = subjectObj.targetClass || 'all';
    const group = subjectObj.group || 'all';

    const newSub = {
      id: `sub-${Date.now()}`,
      name: cleanName,
      labelBn: cleanBn,
      code: cleanCode,
      max: maxMarks,
      targetClass,
      group
    };

    setAcademicConfig(prev => {
      const existing = prev?.subjects || [];
      if (existing.some(s => s.name.toLowerCase() === cleanName.toLowerCase() && (s.targetClass || 'all') === targetClass && (s.group || 'all') === group)) {
        return prev;
      }
      const nextConfig = {
        ...prev,
        subjects: [...existing, newSub]
      };
      localStorage.setItem('bdhs_academic_config', JSON.stringify(nextConfig));
      if (supabase) {
        supabase.from('school_info').upsert({ id: 'academic_config', data: nextConfig }).then(({ error }) => {
          if (error) console.warn('Supabase upsert academic_config warning:', error.message);
        });
      }
      return nextConfig;
    });
    return newSub;
  };

  const deleteSubject = (id) => {
    setAcademicConfig(prev => {
      const existing = prev?.subjects || [];
      const nextConfig = {
        ...prev,
        subjects: existing.filter(s => s.id !== id)
      };
      localStorage.setItem('bdhs_academic_config', JSON.stringify(nextConfig));
      if (supabase) {
        supabase.from('school_info').upsert({ id: 'academic_config', data: nextConfig }).then(({ error }) => {
          if (error) console.warn('Supabase upsert academic_config warning:', error.message);
        });
      }
      return nextConfig;
    });
  };

  const availableExams = React.useMemo(() => {
    const defaultExams = [
      { id: 'ex-1', name: 'SSC Test Examination 2026', labelBn: 'এসএসসি টেস্ট পরীক্ষা ২০২৬' },
      { id: 'ex-2', name: 'Annual Examination 2025', labelBn: 'বার্ষিক পরীক্ষা ২০২৫' },
      { id: 'ex-3', name: 'Pre-Test Examination 2026', labelBn: 'প্রাক-নির্বাচনী পরীক্ষা ২০২৬' },
      { id: 'ex-4', name: 'Half-Yearly Examination 2026', labelBn: 'অর্ধবার্ষিক পরীক্ষা ২০২৬' },
    ];
    const list = [...(academicConfig?.exams || defaultExams)];
    const existingNames = new Set(list.map(e => e.name.toLowerCase()));
    if (Array.isArray(results)) {
      results.forEach(r => {
        if (r.exam && !existingNames.has(r.exam.toLowerCase())) {
          existingNames.add(r.exam.toLowerCase());
          list.push({ id: `ex-res-${r.exam}`, name: r.exam, labelBn: r.exam });
        }
      });
    }
    return list;
  }, [academicConfig?.exams, results]);

  const availableClasses = React.useMemo(() => {
    const defaultClasses = [
      { id: 'cls-10', key: '10', labelBn: '১০ম শ্রেণি', labelEn: 'Class 10' },
      { id: 'cls-9', key: '9', labelBn: '৯ম শ্রেণি', labelEn: 'Class 9' },
      { id: 'cls-8', key: '8', labelBn: '৮ম শ্রেণি', labelEn: 'Class 8' },
      { id: 'cls-7', key: '7', labelBn: '৭ম শ্রেণি', labelEn: 'Class 7' },
      { id: 'cls-6', key: '6', labelBn: '৬ষ্ঠ শ্রেণি', labelEn: 'Class 6' },
    ];
    const list = [...(academicConfig?.classes || defaultClasses)];
    const existingKeys = new Set(list.map(c => String(c.key).toLowerCase()));
    if (Array.isArray(students)) {
      students.forEach(s => {
        if (s.class && !existingKeys.has(String(s.class).toLowerCase())) {
          existingKeys.add(String(s.class).toLowerCase());
          list.push({ id: `cls-${s.class}`, key: String(s.class), labelBn: `${toBanglaNumerals(s.class)} শ্রেণি`, labelEn: `Class ${s.class}` });
        }
      });
    }
    return list;
  }, [academicConfig?.classes, students]);

  const updateHeroSlides = (slides) => {
    setHeroSlides(slides);
    if (supabase) {
      supabase.from('hero_slides').upsert(slides.map(mappers.slide.toDb)).then(({ error }) => {
        if (error) console.warn('Supabase upsert hero_slides warning:', error.message);
      });
    }
  };

  const addGalleryItem = (item) => {
    const newItem = {
      ...item,
      id: `gal-${Date.now()}`,
      date: getDhakaDateString()
    };
    setGallery(prev => [newItem, ...prev]);
    if (supabase) {
      supabase.from('gallery').insert(mappers.gallery.toDb(newItem)).then(({ error }) => {
        if (error) console.warn('Supabase insert gallery warning:', error.message);
      });
    }
  };

  const deleteGalleryItem = (id) => {
    setGallery(prev => prev.filter(g => g.id !== id));
    if (supabase) {
      supabase.from('gallery').delete().eq('id', id).then(({ error }) => {
        if (error) console.warn('Supabase delete gallery warning:', error.message);
      });
    }
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
    setVideos(prev => {
      const updated = [newVid, ...prev];
      if (supabase) {
        supabase.from('videos').insert(mappers.video.toDb(newVid)).then(({ error }) => {
          if (error) {
            // Cloud fallback: store in school_info doc
            supabase.from('school_info').upsert({ id: 'videos', data: updated }).then(() => {});
          }
        });
      }
      return updated;
    });
  };

  const deleteVideoItem = (id) => {
    deleteVideoFile(id);
    setVideos(prev => {
      const updated = prev.filter(v => v.id !== id);
      if (supabase) {
        supabase.from('videos').delete().eq('id', id).then(({ error }) => {
          if (error) {
            supabase.from('school_info').upsert({ id: 'videos', data: updated }).then(() => {});
          }
        });
      }
      return updated;
    });
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
    const currentTheme = localStorage.getItem('bdhs_theme');
    localStorage.clear();
    if (currentTheme) {
      localStorage.setItem('bdhs_theme', currentTheme);
    }
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

  const resetToBlankTemplate = (wizardData) => {
    if (authUser?.role !== 'superadmin') {
      alert('অননুমোদিত এক্সেস: শুধুমাত্র সুপার অ্যাডমিন এই পরিবর্তন করতে পারবেন।');
      return false;
    }
    const targetTheme = wizardData.defaultTheme || 'emerald';
    const logoVal = wizardData.logo || null;
    const blankInfo = {
      ...initialSchoolInfo,
      nameBn: wizardData.nameBn || 'বিদ্যালয়ের নাম',
      nameEn: wizardData.nameEn || 'School Name',
      shortName: wizardData.shortName || 'SCH',
      eiin: wizardData.eiin || '000000',
      mpoCode: wizardData.mpoCode || '',
      established: wizardData.established || new Date().getFullYear(),
      addressBn: wizardData.addressBn || '',
      addressEn: wizardData.addressEn || '',
      phone: wizardData.phone || '',
      email: wizardData.email || '',
      defaultTheme: targetTheme,
      schoolLogo: logoVal,
      logo: logoVal,
      logos: wizardData.logos || {
        emerald: { onDark: logoVal, onLight: logoVal },
        indigo: { onDark: logoVal, onLight: logoVal },
      },
      hero: {
        ...initialSchoolInfo.hero,
        locationBadge: {
          visible: Boolean(wizardData.addressBn),
          textBn: wizardData.addressBn || '',
          textEn: wizardData.addressEn || '',
        },
      },
    };

    setSchoolInfo(blankInfo);
    setTheme(targetTheme);
    setStoredItem('info', blankInfo);
    setStoredItem('theme', targetTheme);

    if (supabase) {
      supabase.from('school_info').upsert({ id: 'main', data: blankInfo }).then(() => {});
    }
    return true;
  };

  return (
    <SchoolContext.Provider
      value={{
        theme,
        toggleTheme,
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
        updateSchoolSettings,
        uniformInfo,
        setUniformInfo,
        updateUniformSettings,
        academicGroups,
        setAcademicGroups,
        updateAcademicGroups,
        addSubjectToGroup,
        removeSubjectFromGroup,
        heroSlides,
        setHeroSlides,
        updateHeroSlides,
        notices,
        addNotice,
        updateNotice,
        deleteNotice,
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        committee,
        setCommittee,
        addCommitteeMember,
        updateCommitteeMember,
        deleteCommitteeMember,
        students,
        addStudent,
        bulkAddStudents,
        bulkDeleteStudents,
        updateStudent,
        deleteStudent,
        results,
        addResult,
        bulkAddResults,
        deleteResult,
        availableExams,
        availableClasses,
        addExam,
        addClass,
        customSubjects: academicConfig?.subjects || [],
        addSubject,
        deleteSubject,
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
        bulkApproveAdmissions,
        bulkSetAdmissionsPending,
        fees,
        addFee,
        voidFeeReceipt,
        deleteFeeReceipt,
        contactMessages,
        submitContactMessage,
        deleteContactMessage,
        routines,
        resetToDefaults,
        resetToBlankTemplate,
        isCloudSyncActive: isSupabaseConfigured
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
}
