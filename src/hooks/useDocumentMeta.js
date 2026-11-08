import { useEffect } from 'react';
import { resolveLogo } from '../utils/resolveLogo';

/**
 * Dynamically keeps browser tab title, favicon, meta description, and theme-color in sync with CMS and active theme.
 */
export function useDocumentMeta(schoolInfo, theme = 'emerald', lang = 'bn') {
  useEffect(() => {
    if (!schoolInfo) return;

    // 1. Browser Tab Title
    const schoolName = lang === 'bn' 
      ? (schoolInfo.nameBn || 'বিদ্যালয়ের ওয়েবসাইট') 
      : (schoolInfo.nameEn || 'School Official Web Portal');
    const motto = lang === 'bn' ? schoolInfo.mottoBn : schoolInfo.mottoEn;
    document.title = motto ? `${schoolName} | ${motto}` : schoolName;

    // 2. Meta Description & Social Graph
    const descText = lang === 'bn' 
      ? (schoolInfo.visionBn || schoolInfo.missionBn || `${schoolName}-এর অফিসিয়াল ওয়েব পোর্টাল ও ম্যানেজমেন্ট সিস্টেম।`)
      : (schoolInfo.visionEn || schoolInfo.missionEn || `Official web portal and management ERP for ${schoolName}.`);

    const updateMeta = (selector, attr, value) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        const [attrName, attrVal] = selector.replace(/[[\]']/g, '').split('=');
        tag.setAttribute(attrName, attrVal);
        document.head.appendChild(tag);
      }
      tag.setAttribute(attr, value);
    };

    updateMeta('meta[name="description"]', 'content', descText);
    updateMeta('meta[property="og:title"]', 'content', document.title);
    updateMeta('meta[property="og:description"]', 'content', descText);
    updateMeta('meta[name="twitter:title"]', 'content', document.title);
    updateMeta('meta[name="twitter:description"]', 'content', descText);

    // 3. Theme Color Meta
    const themeColor = theme === 'indigo' ? '#1E1B4B' : '#0B3D2E';
    updateMeta('meta[name="theme-color"]', 'content', themeColor);

    // 4. Dynamic Favicon & Apple Touch Icon
    const activeFavicon = resolveLogo(schoolInfo, theme, 'light') || resolveLogo(schoolInfo, theme, 'dark');
    if (activeFavicon) {
      let iconLink = document.querySelector('link[rel="icon"]');
      if (!iconLink) {
        iconLink = document.createElement('link');
        iconLink.rel = 'icon';
        document.head.appendChild(iconLink);
      }
      iconLink.href = activeFavicon;

      let appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
      if (!appleIcon) {
        appleIcon = document.createElement('link');
        appleIcon.rel = 'apple-touch-icon';
        document.head.appendChild(appleIcon);
      }
      appleIcon.href = activeFavicon;
    }
  }, [schoolInfo, theme, lang]);
}
