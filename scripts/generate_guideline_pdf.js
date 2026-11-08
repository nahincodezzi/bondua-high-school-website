import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_PDF_ROOT = path.resolve('USER_GUIDELINE_BDHS.pdf');
const OUTPUT_PDF_PUBLIC = path.resolve('public', 'USER_GUIDELINE_BDHS.pdf');

const htmlContent = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>ব্যবহারকারী নির্দেশিকা (User Manual) — বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 18mm 14mm 18mm 14mm;
      @bottom-right {
        content: counter(page);
      }
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Hind Siliguri', 'Noto Sans Bengali', -apple-system, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1e293b;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header-banner {
      border-bottom: 2.5px solid #047857;
      padding-bottom: 12px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .header-left h1 {
      font-size: 19pt;
      font-weight: 800;
      color: #064e3b;
      margin-bottom: 3px;
    }
    .header-left h2 {
      font-size: 13pt;
      font-weight: 700;
      color: #b45309;
      margin-bottom: 6px;
    }
    .meta-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      font-size: 8.5pt;
    }
    .badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-weight: 600;
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
    }
    .badge-primary {
      background: #ecfdf5;
      color: #047857;
      border-color: #a7f3d0;
    }
    .badge-amber {
      background: #fffbeb;
      color: #b45309;
      border-color: #fde68a;
    }
    .toc-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 22px;
      page-break-inside: avoid;
    }
    .toc-box h3 {
      font-size: 11pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 8px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }
    .toc-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px 16px;
      font-size: 9pt;
    }
    .toc-item {
      color: #334155;
    }
    .section {
      margin-bottom: 22px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 13pt;
      font-weight: 700;
      color: #064e3b;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 4px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .section-title::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 16px;
      background: #047857;
      border-radius: 2px;
    }
    .sub-title {
      font-size: 11pt;
      font-weight: 700;
      color: #0f172a;
      margin-top: 10px;
      margin-bottom: 6px;
    }
    p, ul, ol {
      margin-bottom: 8px;
      color: #334155;
    }
    ul, ol {
      padding-left: 20px;
    }
    li {
      margin-bottom: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 14px 0;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 7px 10px;
      text-align: left;
      vertical-align: middle;
    }
    th {
      background: #064e3b;
      color: #ffffff;
      font-weight: 700;
      font-size: 9pt;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    tr:nth-child(even) {
      background: #f8fafc;
    }
    .code-pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9pt;
      font-weight: 700;
      background: #e2e8f0;
      color: #0f172a;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
    }
    .alert-box {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 10px 14px;
      border-radius: 4px;
      margin: 10px 0;
      font-size: 9.5pt;
      color: #78350f;
    }
    .alert-box-info {
      background: #ecfdf5;
      border-left-color: #059669;
      color: #064e3b;
    }
    .footer-note {
      margin-top: 30px;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      font-size: 8.5pt;
      color: #64748b;
      text-align: center;
    }
  </style>
</head>
<body>

  <!-- Header Banner -->
  <div class="header-banner">
    <div class="header-left">
      <h1>বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়</h1>
      <h2>অফিসিয়াল ব্যবহারকারী নির্দেশিকা ও ইউজার ম্যানুয়াল</h2>
      <div class="meta-badges">
        <span class="badge badge-primary">EIIN: 106644</span>
        <span class="badge badge-primary">MPO: 0403061302</span>
        <span class="badge badge-amber">কুমিল্লা শিক্ষা বোর্ড</span>
        <span class="badge">স্থাপিত: ১৯৯০</span>
        <span class="badge">ফুলগাজী, ফেনী</span>
        <span class="badge badge-primary">লাইভ: https://bondua-high-school-website.vercel.app/</span>
      </div>
    </div>
  </div>

  <!-- Section 1: User Login Credentials (At the top as requested) -->
  <div class="section">
    <h2 class="section-title">১. লগইন ক্রেডেনশিয়ালস ও অ্যাক্সেস কন্ট্রোল (User Login Credentials)</h2>
    <p>
      অ্যাডমিন ও টিচার্স পোর্টালে (<code>/#admin</code>) লগইন করার জন্য সিস্টেমে পূর্বনির্ধারিত ৫টি রোল ভিত্তিক অ্যাকাউন্ট প্রস্তুত রয়েছে:
    </p>

    <table>
      <thead>
        <tr>
          <th style="width: 25%;">পদবী / ভূমিকা</th>
          <th style="width: 20%;">ইউজারনেম (Username)</th>
          <th style="width: 20%;">পাসওয়ার্ড (Password)</th>
          <th style="width: 35%;">অনুমোদিত কার্যপরিধি (Permissions)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>সুপার অ্যাডমিনিস্ট্রেটর</strong></td>
          <td><span class="code-pill">superadmin</span></td>
          <td><span class="code-pill">admin2026</span></td>
          <td>পূর্ণ সফটওয়্যার নিয়ন্ত্রণ, ইউজার তৈরি/পাসওয়ার্ড রিসেট, সেটিংস, সিএমএস, শিক্ষার্থী, ফি ও রেজাল্ট।</td>
        </tr>
        <tr>
          <td><strong>ভারপ্রাপ্ত প্রধান শিক্ষক</strong></td>
          <td><span class="code-pill">headmaster</span></td>
          <td><span class="code-pill">headmaster2026</span></td>
          <td>প্রতিষ্ঠান প্রধান হিসেবে সকল অ্যাকাডেমিক, নোটিশ, সিএমএস, শিক্ষার্থী, ফি কালেকশন ও রিপোর্ট অনুমোদন।</td>
        </tr>
        <tr>
          <td><strong>ভারপ্রাপ্ত সহ-প্রধান শিক্ষক</strong></td>
          <td><span class="code-pill">asst_headmaster</span></td>
          <td><span class="code-pill">assthead2026</span></td>
          <td>সিএমএস কনটেন্ট, নোটিশ প্রকাশ, ফলাফল যাচাই ও শিক্ষার্থী ভর্তি তদারকি।</td>
        </tr>
        <tr>
          <td><strong>সহকারী শিক্ষক (রেজাল্ট কন্ট্রোলার)</strong></td>
          <td><span class="code-pill">teacher</span></td>
          <td><span class="code-pill">teacher2026</span></td>
          <td>পরীক্ষার বিষয়ভিত্তিক নম্বর এন্ট্রি ও প্রাতিষ্ঠানিক নোটিশ দেখা।</td>
        </tr>
        <tr>
          <td><strong>অফিস সহকারী ও ডাটা এন্ট্রি</strong></td>
          <td><span class="code-pill">office_assistant</span></td>
          <td><span class="code-pill">office2026</span></td>
          <td>নতুন শিক্ষার্থী ভর্তি ও ডাটা এন্ট্রি, আইডি কার্ড প্রিন্ট, নোটিশ ড্রাফট ও ফি কালেকশন।</td>
        </tr>
      </tbody>
    </table>

    <div class="alert-box">
      <strong>🔒 নিরাপত্তা সতর্কতা:</strong> সুরক্ষার স্বার্থে টানা ৫ বার ভুল পাসওয়ার্ড দিলে অ্যাকাউন্টটি ১৫ মিনিটের জন্য সাময়িকভাবে লক হয়ে যাবে এবং ৩০ মিনিট নিষ্ক্রিয় থাকলে সেশনটি স্বয়ংক্রিয়ভাবে সমাপ্ত হবে।
    </div>
  </div>

  <!-- Table of Contents -->
  <div class="toc-box">
    <h3>সূচিপত্র (Table of Contents)</h3>
    <div class="toc-grid">
      <div class="toc-item">১. লগইন ক্রেডেনশিয়ালস ও অ্যাক্সেস কন্ট্রোল</div>
      <div class="toc-item">৮. নতুন পরীক্ষা, শ্রেণি ও বিষয় যুক্তকরণ</div>
      <div class="toc-item">২. সাধারণ পরিচিতি ও পাবলিক ওয়েবসাইট</div>
      <div class="toc-item">৯. শিক্ষার্থী ব্যবস্থাপনা ও আইডি কার্ড</div>
      <div class="toc-item">৩. অনলাইন ভর্তি আবেদন ও স্লিপ প্রিন্ট</div>
      <div class="toc-item">১০. ভর্তি আবেদন যাচাই ও বাল্ক অনুমোদন</div>
      <div class="toc-item">৪. অনলাইন রেজাল্ট ও ডিজিটাল মার্কশিট</div>
      <div class="toc-item">১১. ফি কালেকশন ও মানি রিসিট বাতিলকরণ</div>
      <div class="toc-item">৫. অফিসিয়াল নোটিশ বোর্ড ও ১-পৃষ্ঠার প্রিন্ট</div>
      <div class="toc-item">১২. বিদ্যালয় সেটিংস ও স্বাক্ষরকারী পরিবর্তন</div>
      <div class="toc-item">৬. ক্লাস ও পরীক্ষার রুটিন ডাউনলোড</div>
      <div class="toc-item">১৩. সিএমএস (CMS) বিভাগ ও বিষয়সমূহ পরিচালনা</div>
      <div class="toc-item">৭. ফলাফল ব্যবস্থাপনা ও এক্সেল বাল্ক আপলোড</div>
      <div class="toc-item">১৪. ওয়েবসাইট থেকে আসা বার্তা (Visitor Messages)</div>
    </div>
  </div>

  <!-- Section 2 -->
  <div class="section">
    <h2 class="section-title">২. সাধারণ পরিচিতি ও পাবলিক ওয়েবসাইট</h2>
    <ul>
      <li><strong>ভাষা পরিবর্তন:</strong> ওয়েবসাইটের উপরে ডানপাশে <code>বাংলা</code> ও <code>English</code> বাটন রয়েছে। এক ক্লিকেই সম্পূর্ণ ওয়েবসাইটের ভাষা পরিবর্তন করা যায়।</li>
      <li><strong>নোটিশ টিকার:</strong> ওয়েবসাইটের ব্যানারের ঠিক নিচেই লাল-হলুদ নোটিশ টিকারে সর্বশেষ জরুরি নোটিশগুলো স্ক্রল আকারে স্বয়ংক্রিয়ভাবে প্রদর্শিত হয়।</li>
      <li><strong>প্রধান শিক্ষকের বাণী ও ইতিহাস:</strong> প্রধান শিক্ষক ও সহকারী প্রধান শিক্ষকের বাণী, বিদ্যালয়ের ইতিহাস ও ক্যাম্পাসের পরিসংখ্যান হোমপেজে দেখা যাবে।</li>
    </ul>
  </div>

  <!-- Section 3 -->
  <div class="section">
    <h2 class="section-title">৩. অনলাইন ভর্তি আবেদন ও স্লিপ প্রিন্ট</h2>
    <ol>
      <li>মেনু থেকে <strong>"ভর্তি"</strong> ট্যাবে ক্লিক করুন।</li>
      <li>শিক্ষার্থীর বাংলা ও ইংরেজি নাম, জন্ম নিবন্ধন নম্বর, জন্মতারিখ, শ্রেণি, গ্রুপ, পিতা-মাতার নাম ও ১১ ডিজিটের সঠিক মোবাইল নম্বর লিখুন।</li>
      <li><strong>"আবেদন জমা দিন"</strong> বাটনে ক্লিক করলে তাৎক্ষণিক একটি ট্র্যাকিং নম্বর সহ ভেরিফায়েড <strong>ভর্তি আবেদন স্লিপ</strong> তৈরি হবে।</li>
      <li><strong>"স্লিপ প্রিন্ট করুন"</strong> বাটনে ক্লিক করলে স্বয়ংক্রিয়ভাবে প্রাতিষ্ঠানিক লোগো ও সিলসহ সুন্দর ১ পৃষ্ঠায় প্রিন্ট/PDF সেভ হবে।</li>
    </ol>
  </div>

  <!-- Section 4 -->
  <div class="section">
    <h2 class="section-title">৪. অনলাইন রেজাল্ট ও ডিজিটাল মার্কশিট অনুসন্ধান</h2>
    <ol>
      <li>মেনু থেকে <strong>"ফলাফল"</strong> ট্যাবে যান।</li>
      <li>ড্রপডাউন থেকে <strong>পরীক্ষার নাম</strong> ও <strong>শ্রেণি</strong> নির্বাচন করুন।</li>
      <li>শিক্ষার্থীর <strong>রোল নম্বর</strong> (বাংলা বা ইংরেজি সংখ্যায়) লিখে <strong>"অনুসন্ধান করুন"</strong> বাটনে ক্লিক করুন।</li>
      <li>তাৎক্ষণিক কুমিল্লা শিক্ষা বোর্ডের গ্রেডিং স্কেল অনুযায়ী বিষয়ভিত্তিক নম্বর, লেটার গ্রেড, গ্রেড পয়েন্ট এবং সামগ্রিক জিপিএ (GPA) সহ প্রাতিষ্ঠানিক ডিজিটাল মার্কশিট দেখতে পাবেন।</li>
      <li><strong>"মার্কশিট প্রিন্ট করুন"</strong> বাটনে ক্লিক করলে কোনো ইন্টারঅ্যাক্টিভ বাটন ছাড়া সরাসরি অফিসিয়াল ১-পৃষ্ঠার অফিশিয়াল মার্কশিট প্রিন্ট হবে।</li>
    </ol>
  </div>

  <!-- Section 5 -->
  <div class="section">
    <h2 class="section-title">৫. অফিসিয়াল নোটিশ বোর্ড ও ১-পৃষ্ঠার নোটিশ প্রিন্ট</h2>
    <ul>
      <li>সাধারণ নোটিশ, পরীক্ষা, ভর্তি বা ছুটির নোটিশ ফিল্টার করে দেখা যায়।</li>
      <li>যেকোনো নোটিশে ক্লিক করলে বিস্তারিত পপআপ ওপেন হবে।</li>
      <li><strong>"প্রিন্ট করুন"</strong> বাটনে ক্লিক করলে স্ক্রিনের সব বাটন লুকিয়ে যাবে এবং প্রতিষ্ঠানের লোগো, নাম, EIIN, স্মারক নম্বর, নোটিশের বিষয়বস্তু, অফিশিয়াল গোল সিল এবং প্রধান শিক্ষকের স্বাক্ষরসহ সম্পূর্ণ বিজ্ঞপ্তিটি নিখুঁতভাবে ১ম পৃষ্ঠায় প্রিন্ট হবে।</li>
    </ul>
  </div>

  <!-- Section 6 -->
  <div class="section">
    <h2 class="section-title">৬. ক্লাস ও পরীক্ষার রুটিন ডাউনলোড</h2>
    <p>
      <strong>"রুটিন"</strong> সেকশন থেকে ৬ষ্ঠ থেকে ১০ম শ্রেণির সাপ্তাহিক ক্লাস রুটিন এবং পরীক্ষার সময়সূচী সরাসরি ব্রাউজারে দেখা যায় অথবা ১-ক্লিকে প্রিন্ট ও PDF আকারে সংরক্ষণ করা যায়।
    </p>
  </div>

  <!-- Section 7 -->
  <div class="section">
    <h2 class="section-title">৭. ফলাফল ব্যবস্থাপনা (Result Manager)</h2>
    <h3 class="sub-title">ক. একক নম্বর এন্ট্রি (Single Entry)</h3>
    <ol>
      <li>অ্যাডমিন প্যানেল থেকে <strong>"ফলাফল"</strong> ট্যাবে যান।</li>
      <li>পরীক্ষার নাম, শ্রেণি এবং শিক্ষার্থীর রোল নম্বর লিখুন (সিস্টেম স্বয়ংক্রিয়ভাবে ডাটাবেজ থেকে শিক্ষার্থীর নাম যাচাই করবে)।</li>
      <li>প্রতিটি বিষয়ের প্রাপ্ত নম্বর ইনপুট দিন।</li>
      <li><strong>"ফলাফল সংরক্ষণ ও প্রকাশ করুন"</strong> বাটনে ক্লিক করুন। এটি সাথে সাথে ডাটাবেজে সেভ হয়ে পাবলিক রেজাল্ট সার্চে চলে যাবে।</li>
    </ol>

    <h3 class="sub-title">খ. এক্সেল শিট থেকে বাল্ক আপলোড (Excel Bulk Upload)</h3>
    <ol>
      <li><strong>"এক্সেল থেকে বাল্ক আপলোড"</strong> ট্যাবে ক্লিক করুন।</li>
      <li>পরীক্ষা, শ্রেণি ও বিভাগ নির্বাচন করুন।</li>
      <li><strong>"নমুনা টেমপ্লেট"</strong> বাটনে ক্লিক করুন। আপনার ওই শ্রেণির সকল শিক্ষার্থীর রোল ও বিষয়ের কলামসহ একটি প্রস্তুতকৃত <code>.xlsx</code> ফাইল ডাউনলোড হবে।</li>
      <li>এক্সেলে শিক্ষার্থীদের রোল বরাবর নম্বরগুলো বসিয়ে ফাইলটি সেভ করুন।</li>
      <li><strong>"এক্সেল ফাইল আপলোড করুন"</strong> বক্সে ফাইলটি ড্রপ করুন বা সিলেক্ট করুন। প্রিভিউ দেখে <strong>"সকল ফলাফল নিশ্চিত করুন"</strong> চাপুন।</li>
    </ol>
  </div>

  <!-- Section 8 -->
  <div class="section">
    <h2 class="section-title">৮. নতুন পরীক্ষা, শ্রেণি ও বিষয় যুক্ত করার নিয়ম</h2>
    <ul>
      <li><strong>নতুন পরীক্ষা যোগ করা:</strong> পরীক্ষার ড্রপডাউনের পাশে থাকা <code>+ নতুন</code> বাটনে ক্লিক করুন। পরীক্ষার নাম ও বাংলা নাম লিখে সেভ করুন।</li>
      <li><strong>নতুন শ্রেণি যোগ করা:</strong> শ্রেণির ড্রপডাউনের পাশে <code>+ নতুন</code> বাটনে ক্লিক করে শ্রেণি কোড ও নাম দিন।</li>
      <li><strong>নতুন বিষয় (Subject) যোগ করা:</strong> বিষয় তালিকার ওপরে থাকা <code>+ নতুন বিষয় যোগ করুন</code> বাটনে ক্লিক করে বিষয়ের ইংরেজি নাম, বাংলা নাম, কোড এবং পূর্ণমান (১০০ বা ৫০) নির্ধারণ করুন।
      <br><em>স্বয়ংক্রিয় সুবিধা:</em> সাথে সাথেই একক এন্ট্রি ফর্ম, এক্সেল নমুনা টেমপ্লেট এবং তথ্য নির্দেশিকা <code>(i)</code> পপআপে নতুন বিষয়টির নিয়ম অন্তর্ভুক্ত হয়ে যাবে।</li>
    </ul>
  </div>

  <!-- Section 9 -->
  <div class="section">
    <h2 class="section-title">৯. শিক্ষার্থী ব্যবস্থাপনা (Student Manager)</h2>
    <ul>
      <li><strong>শিক্ষার্থী সংযোজন:</strong> শিক্ষার্থীর নাম, শ্রেণি, রোল, বিভাগ, রক্তের গ্রুপ, জন্ম তারিখ ও মোবাইল নম্বর দিয়ে শিক্ষার্থী ভর্তি করা যায়। একই শ্রেণিতে ডুপ্লিকেট রোল গ্রহণযোগ্য নয়।</li>
      <li><strong>সিলেক্ট অল (Select All) ও বাল্ক অ্যাকশন:</strong> টেবিলের উপরের চেকবক্সে ক্লিক করে এক ক্লিকে সকল শিক্ষার্থী নির্বাচন করা যায় এবং নিচ থেকে ভেসে ওঠা ফ্লোটিং বার দিয়ে এক্সেলে এক্সপোর্ট বা একসাথে ডাটাবেজ থেকে ডিলিট করা যায়।</li>
      <li><strong>এক্সেল বাল্ক আপলোড:</strong> <code>[📄 এক্সেল বাল্ক আপলোড]</code> বাটনে ক্লিক করে প্রস্তুতকৃত এক্সেল ফাইল আপলোড করলেই এক সাথে শত শত শিক্ষার্থীর ডাটা যাচাই হয়ে যুক্ত হয়ে যাবে।</li>
      <li><strong>কলাম তথ্য নির্দেশিকা (i) ও টেমপ্লেট:</strong> পপআপে <code>(i)</code> বাটন চাপলে প্রয়োজনীয় কলামের বিবরণ দেখা যাবে এবং নমুনা টেমপ্লেট ডাউনলোড করা যাবে।</li>
      <li><strong>আইডি কার্ড প্রিন্ট:</strong> শিক্ষার্থীর নামের পাশে থাকা <strong>আইডি কার্ড</strong> বাটনে ক্লিক করলে ছবি, প্রাতিষ্ঠানিক লোগো ও কিউআর কোডসহ ১ পৃষ্ঠার আকর্ষণীয় স্টুডেন্ট আইডি কার্ড প্রিন্ট করা যাবে।</li>
    </ul>
  </div>

  <!-- Section 10 -->
  <div class="section">
    <h2 class="section-title">১০. ভর্তি আবেদন যাচাই ও বাল্ক অনুমোদন (Admission Manager)</h2>
    <ol>
      <li>অনলাইনে আসা নতুন আবেদনগুলোর স্ট্যাটাস প্রাথমিক অবস্থায় <strong>"Pending"</strong> থাকে।</li>
      <li>মাস্টার চেকবক্সে ক্লিক করে একসাথে সকল আবেদন সিলেক্ট করে <strong>"নির্বাচিত আবেদনগুলো অনুমোদন করুন"</strong> বাটনে ক্লিক করুন।</li>
      <li>সিস্টেম স্বয়ংক্রিয়ভাবে প্রতিটি শিক্ষার্থীর জন্য শ্রেণিতে খালি থাকা পরবর্তী রোল নম্বর নির্ধারণ করে সরাসরি মূল শিক্ষার্থী ডাটাবেজে যুক্ত করে দিবে।</li>
    </ol>
  </div>

  <!-- Section 11 -->
  <div class="section">
    <h2 class="section-title">১১. ফি কালেকশন, মানি রিসিট ও বাতিলকরণ (Fee Manager)</h2>
    <ol>
      <li>শিক্ষার্থীর শ্রেণি ও রোল লিখে ফি-এর ধরন ও টাকার পরিমাণ নির্ধারণ করুন (সর্বোচ্চ ১,০০,০০০ টাকার সফটওয়্যার লিমিট রয়েছে)।</li>
      <li>ফি জমা হওয়ার সাথে সাথেই ২-কপির (অফিস কপি ও শিক্ষার্থী কপি) প্রাতিষ্ঠানিক <strong>মানি রিসিট</strong> তৈরি হবে যাতে লোগো ও হিসাবরক্ষকের স্বাক্ষর থাকবে।</li>
      <li>ভুল রিসিট তৈরি হলে <strong>"রসিদ বাতিল (Void)"</strong> বাটনে ক্লিক করে কারণ লিখে রসিদটি বাতিল করা যাবে।</li>
    </ol>
  </div>

  <!-- Section 12 -->
  <div class="section">
    <h2 class="section-title">১২. বিদ্যালয় সেটিংস ও স্বাক্ষরকারী পরিবর্তন</h2>
    <ul>
      <li>অ্যাডমিন পোর্টাল > সেটিংস থেকে প্রতিষ্ঠানের নাম, EIIN, মোবাইল ও ইমেইল আপডেট করা যায়।</li>
      <li><strong>লোগো পরিবর্তন:</strong> নতুন লোগো আপলোড করলে ওয়েবসাইটের হেডার, নোটিশ, মার্কশিট ও মানি রিসিট—সব জায়গায় নতুন লোগো তাৎক্ষণিক কার্যকর হবে।</li>
      <li><strong>স্বাক্ষরকারী (Signatories):</strong> প্রধান শিক্ষক, পরীক্ষা নিয়ন্ত্রক কিংবা হিসাবরক্ষকের নাম ও স্বাক্ষর পরিবর্তন করলে সকল প্রিন্ট রিপোর্টে তা স্বয়ংক্রিয়ভাবে হালনাগাদ হবে।</li>
    </ul>
  </div>

  <!-- Section 13 -->
  <div class="section">
    <h2 class="section-title">১৩. সিএমএস (CMS) থেকে বিভাগ ও বিষয়সমূহ পরিচালনা</h2>
    <ul>
      <li><strong>অবস্থান:</strong> অ্যাডমিন পোর্টাল > <strong>"সিএমএস / কনটেন্ট"</strong> > <strong><code>[বিভাগ ও বিষয়সমূহ (Subjects CMS)]</code></strong> ট্যাব।</li>
      <li>বিজ্ঞান বিভাগ, ব্যবসায় শিক্ষা বা মানবিক বিভাগের যেকোনো বিষয়ের পাশে থাকা লাল ডিলিট (🗑️) বাটনে ক্লিক করে বিষয় তালিকা থেকে বাদ দেওয়া যায়।</li>
      <li>নতুন বিষয়ের নাম লিখে <strong><code>[+ বিষয় যোগ করুন]</code></strong> বাটনে ক্লিক করে যুক্ত করা যায়।</li>
      <li>বিভাগের পরিচিতি বিবরণ পরিবর্তন করে <strong>"পাঠ্যক্রমের পরিবর্তনসমূহ সংরক্ষণ করুন"</strong> বাটনে ক্লিক করলে তা পাবলিক ওয়েবসাইটে সরাসরি আপডেট হয়ে যাবে।</li>
    </ul>
  </div>

  <!-- Section 14 -->
  <div class="section">
    <h2 class="section-title">১৪. ওয়েবসাইট থেকে আসা বার্তা ও অনুসন্ধান (Visitor Messages)</h2>
    <p>
      অ্যাডমিন ড্যাশবোর্ডের হোম পেজে নিচের দিকে <strong>"ওয়েবসাইট থেকে আসা বার্তা ও অনুসন্ধান"</strong> সেকশনে দর্শনার্থীদের বার্তা প্রদর্শিত হয়:
    </p>
    <ul>
      <li><code>name : [প্রেরকের নাম]</code></li>
      <li><code>phone : [মোবাইল নম্বর]</code> (সরাসরি ক্লিক করে কল দেওয়ার সুবিধা)</li>
      <li><code>mail : [ইমেইল]</code> <em>(ঐচ্ছিক — দর্শনার্থী ইমেইল দিয়ে থাকলে প্রদর্শিত হবে, না দিলে এই ফিল্ডটি সম্পূর্ণ লুকিয়ে থাকবে)</em></li>
      <li><code>message sub : [বার্তার বিষয়]</code></li>
      <li><code>description : [মূল বার্তা]</code></li>
    </ul>
    <p>অপ্রয়োজনীয় বার্তা ডিলিট বাটনে (🗑️) চাপ দিয়ে সহজেই মুছে ফেলা যায়।</p>
  </div>

  <div class="footer-note">
    © ২০২৬ বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় (EIIN: 106644) • ফুলগাজী, ফেনী • সর্বস্বত্ব সংরক্ষিত।
  </div>

</body>
</html>
`;

async function generatePdf() {
  console.log('Generating PDF using Edge browser...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  console.log('Printing to:', OUTPUT_PDF_ROOT);
  await page.pdf({
    path: OUTPUT_PDF_ROOT,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '18mm',
      bottom: '18mm',
      left: '14mm',
      right: '14mm'
    }
  });

  console.log('Printing to public folder:', OUTPUT_PDF_PUBLIC);
  await page.pdf({
    path: OUTPUT_PDF_PUBLIC,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '18mm',
      bottom: '18mm',
      left: '14mm',
      right: '14mm'
    }
  });

  console.log('PDF generation completed successfully!');
  await browser.close();
}

generatePdf().catch(err => {
  console.error('PDF error:', err);
  process.exit(1);
});
