import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_PDF_ROOT = path.resolve('USER_GUIDELINE_BDHS.pdf');
const OUTPUT_PDF_PUBLIC = path.resolve('public', 'USER_GUIDELINE_BDHS.pdf');
const ARTIFACT_PDF = 'C:\\Users\\Skytech\\.gemini\\antigravity\\brain\\48914a8f-5154-44f2-ad74-8e555830a8f4\\USER_GUIDELINE_BDHS.pdf';

const htmlContent = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>ব্যবহারকারী নির্দেশিকা (User Manual) — বিদ্যালয় ম্যানেজমেন্ট ও ওয়েবসাইট</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 16mm 14mm 16mm 14mm;
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
      font-size: 10.5pt;
      line-height: 1.55;
      color: #1e293b;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header-banner {
      border-bottom: 2.5px solid #047857;
      padding-bottom: 12px;
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .header-left h1 {
      font-size: 18pt;
      font-weight: 800;
      color: #064e3b;
      margin-bottom: 3px;
    }
    .header-left h2 {
      font-size: 12pt;
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
      padding: 10px 14px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .toc-box h3 {
      font-size: 10.5pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 6px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }
    .toc-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3px 14px;
      font-size: 8.5pt;
    }
    .toc-item {
      color: #334155;
    }
    .section {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 12pt;
      font-weight: 700;
      color: #064e3b;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 4px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .section-title::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 15px;
      background: #047857;
      border-radius: 2px;
    }
    .sub-title {
      font-size: 10.5pt;
      font-weight: 700;
      color: #0f172a;
      margin-top: 8px;
      margin-bottom: 5px;
    }
    p, ul, ol {
      margin-bottom: 6px;
      color: #334155;
    }
    ul, ol {
      padding-left: 18px;
    }
    li {
      margin-bottom: 3px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 12px 0;
      font-size: 9pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      text-align: left;
      vertical-align: middle;
    }
    th {
      background: #064e3b;
      color: #ffffff;
      font-weight: 700;
      font-size: 8.5pt;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    tr:nth-child(even) {
      background: #f8fafc;
    }
    .code-pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      font-weight: 700;
      background: #e2e8f0;
      color: #0f172a;
      padding: 1px 5px;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
    }
    .alert-box {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 8px 12px;
      border-radius: 4px;
      margin: 8px 0;
      font-size: 9pt;
      color: #78350f;
    }
    .highlight-card {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 10px;
    }
    .footer-note {
      margin-top: 25px;
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      font-size: 8pt;
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
      <h2>সফটওয়্যার ব্যবহারকারী নির্দেশিকা ও ইউজার ম্যানুয়াল (ERP & Website)</h2>
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

  <!-- Section 1: User Login Credentials -->
  <div class="section">
    <h2 class="section-title">১. লগইন ক্রেডেনশিয়ালস ও এক্সেস কন্ট্রোল (Login Credentials)</h2>
    <p>
      অ্যাডমিন ও টিচার্স পোর্টালে (<code>/#admin</code>) প্রবেশের জন্য সিস্টেমে প্রস্তুত থাকা অ্যাকাউন্টসমূহ:
    </p>

    <table>
      <thead>
        <tr>
          <th style="width: 25%;">পদবী / ভূমিকা</th>
          <th style="width: 18%;">ইউজারনেম</th>
          <th style="width: 18%;">পাসওয়ার্ড</th>
          <th style="width: 39%;">অনুমোদিত কার্যপরিধি (Permissions)</th>
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
          <td><strong>সহকারী শিক্ষক (রেজাল্ট)</strong></td>
          <td><span class="code-pill">teacher</span></td>
          <td><span class="code-pill">teacher2026</span></td>
          <td>পরীক্ষার বিষয়ভিত্তিক নম্বর এন্ট্রি ও প্রাতিষ্ঠানিক নোটিশ দেখা।</td>
        </tr>
        <tr>
          <td><strong>অফিস সহকারী / হিসাবরক্ষক</strong></td>
          <td><span class="code-pill">office_assistant</span></td>
          <td><span class="code-pill">office2026</span></td>
          <td>নতুন শিক্ষার্থী ভর্তি এন্ট্রি, মানি রসিদ ও ফি কালেকশন, আইডি কার্ড প্রিন্ট।</td>
        </tr>
      </tbody>
    </table>

    <div class="alert-box">
      <strong>🔒 নিরাপত্তা সতর্কতা:</strong> সুরক্ষার স্বার্থে টানা ৫ বার ভুল পাসওয়ার্ড দিলে অ্যাকাউন্টটি ১৫ মিনিটের জন্য সাময়িকভাবে লক হয়ে যাবে এবং ৩০ মিনিট নিষ্ক্রিয় থাকলে সেশন স্বয়ংক্রিয়ভাবে সমাপ্ত হবে।
    </div>
  </div>

  <!-- Table of Contents -->
  <div class="toc-box">
    <h3>সূচিপত্র (Table of Contents)</h3>
    <div class="toc-grid">
      <div class="toc-item">১. লগইন ক্রেডেনশিয়ালস ও এক্সেস কন্ট্রোল</div>
      <div class="toc-item">৯. শিক্ষার্থী ব্যবস্থাপনা ও আইডি কার্ড</div>
      <div class="toc-item">২. সাধারণ পরিচিতি ও পাবলিক ওয়েবসাইট</div>
      <div class="toc-item">১০. ভর্তি আবেদন যাচাই ও বাল্ক অনুমোদন</div>
      <div class="toc-item">৩. একক সার্বজনীন প্রাতিষ্ঠানিক লোগো</div>
      <div class="toc-item">১১. ফি কালেকশন ও মানি রিসিট বাতিলকরণ</div>
      <div class="toc-item">৪. সভাপতি ও পরিচালনা পর্ষদ CMS</div>
      <div class="toc-item">১২. বিদ্যালয় সেটিংস ও স্বাক্ষরকারী পরিবর্তন</div>
      <div class="toc-item">৫. অনলাইন ভর্তি আবেদন ও প্রবেশপত্র</div>
      <div class="toc-item">১৩. সিএমএস (CMS) বিভাগ ও বিষয়সমূহ</div>
      <div class="toc-item">৬. অনলাইন রেজাল্ট ও ডিজিটাল মার্কশিট</div>
      <div class="toc-item">১৪. ওয়েবসাইট থেকে আসা বার্তা (Messages)</div>
      <div class="toc-item">৭. অফিসিয়াল নোটিশ বোর্ড ও ১-পৃষ্ঠার প্রিন্ট</div>
      <div class="toc-item">১৫. সিএমএস (CMS) থেকে যা কিছু পরিবর্তন করা যায়</div>
      <div class="toc-item">৮. ফলাফল ব্যবস্থাপনা ও এক্সেল বাল্ক আপলোড</div>
      <div class="toc-item">১৬. অন্য স্কুলে ব্যবহারের সহজ গাইডলাইন</div>
    </div>
  </div>

  <!-- Section 2 -->
  <div class="section">
    <h2 class="section-title">২. সাধারণ পরিচিতি ও পাবলিক ওয়েবসাইট</h2>
    <ul>
      <li><strong>দ্বি-ভাষিক সাপোর্ট (Bilingual):</strong> উপরে ডানপাশে থাকা <code>বাংলা</code> ও <code>English</code> বাটনে ক্লিক করে তাৎক্ষণিক ভাষা পরিবর্তন করা যায়।</li>
      <li><strong>থিম পরিবর্তন:</strong> এমারেল্ড (Emerald) ও মার্জিত ইন্ডিগো (Indigo) থিম লাইভ টগল করা যায়।</li>
      <li><strong>জরুরি নোটিশ টিকার:</strong> ব্যানারের নিচেই লাল-হলুদ টিকারে সর্বশেষ নোটিশগুলো স্ক্রল আকারে প্রদর্শিত হয়।</li>
    </ul>
  </div>

  <!-- Section 3 -->
  <div class="section">
    <h2 class="section-title">৩. একক সার্বজনীন প্রাতিষ্ঠানিক লোগো (Single School Logo)</h2>
    <div class="highlight-card">
      <p>
        <strong>Change-Once, Change-Everywhere:</strong> প্রতিষ্ঠানে এখন একটিমাত্র অফিশিয়াল লোগো ব্যবহৃত হয়। সেটিংস থেকে লোগোটি পরিবর্তন করলে তা সাথে সাথে ওয়েবসাইটের হেডার, ফুটার, ব্রাউজার ট্যাব (ফেভিকন) এবং সকল প্রকার প্রিন্ট ডকুমেন্টে (নোটিশ, মার্কশিট, রসিদ, প্রবেশপত্র, আইডি কার্ড ও রুটিন) কার্যকর হয়। থিম পরিবর্তনে লোগোর কোনো বিকৃতি ঘটে না।
      </p>
    </div>
  </div>

  <!-- Section 4 -->
  <div class="section">
    <h2 class="section-title">৪. সভাপতি (President) ও পরিচালনা পর্ষদ (Managing Committee)</h2>
    <ul>
      <li><strong>সভাপতির কার্ড:</strong> আমাদের সম্পর্কে (About) পেজের উপরে সভাপতির ছবি, পরিচিতি, পদবি, মোবাইল নম্বর এবং প্রাতিষ্ঠানিক বাণী সর্বদা সুন্দরভাবে প্রদর্শিত হয়।</li>
      <li><strong>শর্তাধীন পরিচালনা পর্ষদ:</strong> অ্যাডমিন প্যানেল থেকে কমিটি সদস্য যুক্ত করা থাকলে সভাপতির নিচে সুন্দর গ্রিডে অন্যান্য সদস্যদের তালিকা দেখা যাবে। কমিটি তালিকা খালি থাকলে সেকশনটি স্বয়ংক্রিয়ভাবে অদৃশ্য থাকে।</li>
    </ul>
  </div>

  <!-- Section 5 -->
  <div class="section">
    <h2 class="section-title">৫. অনলাইন ভর্তি আবেদন ও প্রবেশপত্র (Admission Slip)</h2>
    <ol>
      <li>শিক্ষার্থীরা ভর্তি ফরম পূরণ করে <strong>"আবেদন জমা দিন"</strong> চাপলে ট্র্যাকিং নম্বর সহ ভেরিফায়েড <strong>ভর্তি প্রবেশপত্র (Admit Slip)</strong> তৈরি হয়।</li>
      <li><strong>"স্লিপ প্রিন্ট করুন"</strong> বাটনে ক্লিক করলে প্রাতিষ্ঠানিক লোগো ও সিলসহ ১ পৃষ্ঠায় প্রিন্ট বা PDF সেভ হয়।</li>
      <li>একই ছাত্র ও মোবাইলে ডুপ্লিকেট আবেদন স্বয়ংক্রিয়ভাবে সফটওয়্যার আটকে দেয়।</li>
    </ol>
  </div>

  <!-- Section 6 -->
  <div class="section">
    <h2 class="section-title">৬. অনলাইন রেজাল্ট ও ডিজিটাল মার্কশিট অনুসন্ধান</h2>
    <ol>
      <li>পরীক্ষার নাম, শ্রেণি এবং রোল নম্বর লিখে সার্চ করলে মুহূর্তেই বিষয়ভিত্তিক নম্বর, লেটার গ্রেড, গ্রেড পয়েন্ট ও জিপিএ সহ মার্কশিট প্রদর্শিত হয়।</li>
      <li><strong>"মার্কশিট প্রিন্ট করুন"</strong> চাপলে অফিশিয়াল গোল সিল, লোগো এবং প্রধান শিক্ষক ও পরীক্ষা নিয়ন্ত্রকের স্বাক্ষরসহ নিখুঁত ১-পৃষ্ঠার মার্কশিট প্রিন্ট হয়।</li>
    </ol>
  </div>

  <!-- Section 7 -->
  <div class="section">
    <h2 class="section-title">৭. অফিসিয়াল নোটিশ বোর্ড ও ১-পৃষ্ঠার প্রিন্ট</h2>
    <ul>
      <li>যেকোনো নোটিশে ক্লিক করে <strong>"প্রিন্ট করুন"</strong> চাপলে স্ক্রিনের অনাকাঙ্ক্ষিত বাটন লুকিয়ে প্রতিষ্ঠানের প্যাডের লেটারহেডে নোটিশ প্রিন্ট হয়।</li>
    </ul>
  </div>

  <!-- Section 8 -->
  <div class="section">
    <h2 class="section-title">৮. ফলাফল ব্যবস্থাপনা ও এক্সেল বাল্ক আপলোড (Result Manager)</h2>
    <h3 class="sub-title">ক. একক নম্বর এন্ট্রি (Single Entry)</h3>
    <p>রোল নম্বর দিলে শিক্ষার্থীর নাম চলে আসে; শুধু প্রাপ্ত নম্বর বসিয়ে সেভ করলেই রেজাল্ট লাইভ হয়ে যায়।</p>
    <h3 class="sub-title">খ. এক্সেল থেকে বাল্ক আপলোড (Excel Bulk Upload)</h3>
    <p>নমুনা এক্সেল টেমপ্লেট ডাউনলোড করে নম্বর বসিয়ে আপলোড করলেই এক ক্লিকে পুরো ক্লাসের ফলাফল ডাটাবেজে ও পাবলিক রেজাল্ট সার্চে চলে যায়। নতুন বিষয়, শ্রেণি বা পরীক্ষাও ড্রপডাউনের পাশ থেকে যোগ করা যায়।</p>
  </div>

  <!-- Section 9 -->
  <div class="section">
    <h2 class="section-title">৯. শিক্ষার্থী ব্যবস্থাপনা ও আইডি কার্ড (Student Manager)</h2>
    <ul>
      <li><strong>এক্সেলে বাল্ক আপলোড:</strong> এক ক্লিকে এক্সেল ফাইল থেকে শত শত শিক্ষার্থীর তথ্য একবারে যুক্ত করা যায়।</li>
      <li><strong>সিলেক্ট অল ও বাল্ক অ্যাকশন:</strong> টেবিলের মাস্টার চেকবক্স সিলেক্ট করে একসাথে একাধিক শিক্ষার্থী এক্সপোর্ট বা ডিলিট করা যায়।</li>
      <li><strong>স্টুডেন্ট আইডি কার্ড:</strong> নামের পাশে "আইডি কার্ড" বাটনে ক্লিক করলে ছবি, রোল ও লোগো সহ প্রফেশনাল আইডি কার্ড প্রিন্ট করা যায়।</li>
    </ul>
  </div>

  <!-- Section 10 -->
  <div class="section">
    <h2 class="section-title">১০. ভর্তি আবেদন যাচাই ও বাল্ক অনুমোদন (Admission Review)</h2>
    <p>অনলাইনে জমা হওয়া আবেদনগুলো এক ক্লিকে "অনুমোদন (Approve)" চাপলেই স্বয়ংক্রিয়ভাবে পরবর্তী ফাঁকা রোল নম্বর অ্যাসাইন হয়ে মূল শিক্ষার্থী তালিকায় যুক্ত হয়ে যায়।</p>
  </div>

  <!-- Section 11 -->
  <div class="section">
    <h2 class="section-title">১১. ফি কালেকশন, মানি রিসিট ও বাতিলকরণ (Fee Manager)</h2>
    <ul>
      <li>ফি গ্রহণ করলেই ইউনিক ভাউচার নম্বরসহ ২-কপির (অফিস ও ছাত্র কপি) মানি রিসিট তৈরি হয়।</li>
      <li>ভুল রিসিট তৈরি হলে যথাযথ কারণ লিখে <strong>"রসিদ বাতিল (Void)"</strong> করা যায়।</li>
    </ul>
  </div>

  <!-- Section 12 -->
  <div class="section">
    <h2 class="section-title">১২. বিদ্যালয় সেটিংস ও স্বাক্ষরকারী পরিবর্তন (School Settings)</h2>
    <ul>
      <li>প্রতিষ্ঠানের নাম, EIIN, কোড, মোবাইল, ইমেইল এবং প্রধান শিক্ষক ও পরীক্ষা নিয়ন্ত্রকের স্বাক্ষরকারীর নাম পরিবর্তন করা যায়।</li>
    </ul>
  </div>

  <!-- Section 13 -->
  <div class="section">
    <h2 class="section-title">১৩. সিএমএস (CMS) থেকে যা কিছু পরিবর্তন করা যায় (White-Label Power)</h2>
    <p>এই সফটওয়্যারটির সবচেয়ে বড় সুবিধা হলো <strong>কোডিং না জেনেও ওয়েবসাইটের ৯৯% কনটেন্ট অ্যাডমিন CMS থেকে পরিবর্তন করা সম্ভব:</strong></p>
    <ul>
      <li><strong>১. স্কুলের নাম ও কোড:</strong> বাংলা ও ইংরেজি নাম, EIIN, MPO ও স্কুল কোড।</li>
      <li><strong>২. প্রাতিষ্ঠানিক লোগো:</strong> যেকোনো স্কুলের লোগো আপলোড করলেই সর্বত্র স্বয়ংক্রিয়ভাবে বদলে যায়।</li>
      <li><strong>৩. সভাপতি ও প্রধান শিক্ষকের তথ্য:</strong> উভয়ের ছবি, মোবাইল, পদবি ও প্রাতিষ্ঠানিক বাণী।</li>
      <li><strong>৪. পরিচালনা পর্ষদ সদস্য:</strong> কমিটির সকল সদস্যের ছবি, নাম, পদবি ও মোবাইল নম্বর।</li>
      <li><strong>৫. শিক্ষক ও স্টাফ পরিষদ:</strong> শিক্ষকদের প্রোফাইল, ছবি, পদবি, শিক্ষাগত যোগ্যতা ও ফোন।</li>
      <li><strong>৬. হোমপেজ হিরো স্লাইডার ও ব্যানার:</strong> স্লাইডারের ছবি, শিরোনাম, সাব-শিরোনাম ও ট্যাগলাইন।</li>
      <li><strong>৭. স্কুল ইউনিফর্ম নীতিমালা:</strong> ছাত্র ও ছাত্রীদের নির্ধারিত ড্রেসকোড ও পোশাকের নিয়মাবলী।</li>
      <li><strong>৮. পাঠ্যক্রম ও বিভাগীয় বিষয় (Curriculum):</strong> বিজ্ঞান, বাণিজ্য ও মানবিক বিভাগের বিষয় ও সিলেবাস।</li>
      <li><strong>৯. নোটিশ ও বিজ্ঞপ্তি:</strong> নিয়মিত নোটিশ প্রকাশ ও পিডিএফ সংযুক্তি।</li>
      <li><strong>১০. ফটো গ্যালারি:</strong> স্কুলের বিভিন্ন অনুষ্ঠান ও ক্যাম্পাসের ফটো আপলোড।</li>
      <li><strong>১১. ভিডিও গ্যালারি:</strong> ইউটিউব বা ফেসবুক ভিডিওর লিংক যুক্তকরণ।</li>
      <li><strong>১২. বাৎসরিক তথ্য ও পরিসংখ্যান:</strong> মোট ছাত্র-ছাত্রী, শিক্ষক, পাশের হার ও জিপিএ-৫ পরিসংখ্যান।</li>
    </ul>
  </div>

  <!-- Section 14 -->
  <div class="section">
    <h2 class="section-title">১৪. অন্য স্কুলে ব্যবহারের সহজ ৩টি ধাপ</h2>
    <div class="highlight-card">
      <ol>
        <li>অ্যাডমিন প্যানেলের <strong>"প্রতিষ্ঠান সেটিংস"</strong>-এ গিয়ে নতুন স্কুলের নাম, EIIN, ঠিকানা ও লোগো আপলোড করুন।</li>
        <li><strong>"পরিচালনা পর্ষদ"</strong> ও <strong>"শিক্ষক পরিষদ"</strong>-এ নতুন স্কুলের শিক্ষক ও কমিটির তথ্য ইনপুট দিন।</li>
        <li><strong>"শিক্ষার্থী ব্যবস্থাপনা"</strong>-তে এক্সেল শিট আপলোড করে নতুন স্কুলের শিক্ষার্থীদের যুক্ত করে দিন — ব্যস, নতুন স্কুলের সফটওয়্যার রেডি!</li>
      </ol>
    </div>
  </div>

  <div class="footer-note">
    © ২০২৬ সর্বস্বত্ব সংরক্ষিত • তৈরি ও পরিচালিত: আধুনিক স্কুল ম্যানেজমেন্ট সিস্টেম ও ডিজিটাল ওয়েব পোর্টাল।
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

  console.log('Printing to root:', OUTPUT_PDF_ROOT);
  await page.pdf({
    path: OUTPUT_PDF_ROOT,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '16mm',
      bottom: '16mm',
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
      top: '16mm',
      bottom: '16mm',
      left: '14mm',
      right: '14mm'
    }
  });

  console.log('Printing to artifact directory:', ARTIFACT_PDF);
  await page.pdf({
    path: ARTIFACT_PDF,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '16mm',
      bottom: '16mm',
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
