import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_PDF_ROOT = path.resolve('TECHNICAL_GUIDELINE_BDHS.pdf');
const OUTPUT_PDF_PUBLIC = path.resolve('public', 'TECHNICAL_GUIDELINE_BDHS.pdf');
const ARTIFACT_PDF = 'C:\\Users\\Skytech\\.gemini\\antigravity\\brain\\48914a8f-5154-44f2-ad74-8e555830a8f4\\TECHNICAL_GUIDELINE_BDHS.pdf';

const htmlContent = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>টেকনিক্যাল গাইডলাইন ও সিস্টেম আর্কিটেকচার — বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 16mm 14mm 16mm 14mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Hind Siliguri', 'Noto Sans Bengali', -apple-system, sans-serif;
      font-size: 10pt;
      line-height: 1.55;
      color: #1e293b;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header-banner {
      border-bottom: 2.5px solid #0f766e;
      padding-bottom: 12px;
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .header-left h1 {
      font-size: 17pt;
      font-weight: 800;
      color: #115e59;
      margin-bottom: 3px;
    }
    .header-left h2 {
      font-size: 11.5pt;
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
      background: #ccfbf1;
      color: #0f766e;
      border-color: #99f6e4;
    }
    .badge-amber {
      background: #fef3c7;
      color: #b45309;
      border-color: #fde68a;
    }
    .section-title {
      font-size: 13pt;
      font-weight: 700;
      color: #0f766e;
      border-left: 4.5px solid #0f766e;
      padding-left: 10px;
      margin: 18px 0 10px 0;
      page-break-after: avoid;
    }
    .subsection-title {
      font-size: 11pt;
      font-weight: 700;
      color: #1e293b;
      margin: 14px 0 6px 0;
      page-break-after: avoid;
    }
    p, li {
      margin-bottom: 6px;
      text-align: justify;
    }
    ul, ol {
      margin-left: 20px;
      margin-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 14px 0;
      font-size: 9pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 6px 9px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background-color: #f8fafc;
      font-weight: 700;
      color: #0f766e;
    }
    tr:nth-child(even) td {
      background-color: #fcfcfc;
    }
    code, .code-pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      background: #f1f5f9;
      color: #0f766e;
      padding: 1.5px 5px;
      border-radius: 3px;
      border: 1px solid #e2e8f0;
      word-break: break-all;
    }
    pre {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      background: #0f172a;
      color: #f8fafc;
      padding: 10px 14px;
      border-radius: 6px;
      margin: 8px 0 12px 0;
      overflow-x: auto;
      line-height: 1.45;
    }
    .callout {
      background-color: #f0fdfa;
      border-left: 4px solid #0f766e;
      padding: 10px 14px;
      margin: 10px 0 14px 0;
      border-radius: 0 6px 6px 0;
      font-size: 9pt;
    }
    .diagram-box {
      background: #f8fafc;
      border: 1.5px dashed #94a3b8;
      border-radius: 8px;
      padding: 12px 16px;
      margin: 12px 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      line-height: 1.5;
    }
    .footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 8px;
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Header Banner -->
  <div class="header-banner">
    <div class="header-left">
      <h1>বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়</h1>
      <h2>সফটওয়্যার টেকনিক্যাল গাইডলাইন ও সিস্টেম আর্কিটেকচার ম্যানুয়াল</h2>
      <div class="meta-badges">
        <span class="badge badge-primary">EIIN: 106644</span>
        <span class="badge badge-amber">MPO: 0905171301</span>
        <span class="badge">React 19 + Vite</span>
        <span class="badge">Supabase Cloud</span>
        <span class="badge">Tailwind CSS</span>
        <span class="badge">Vercel Edge</span>
      </div>
    </div>
  </div>

  <!-- Section 1 -->
  <div class="section-title">১. সিস্টেম আর্কিটেকচার ও মূল প্রযুক্তি (System Architecture)</div>
  <p>
    বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়ের ওয়েবসাইট ও ইআরপি সিস্টেমটি একটি <strong>Cloud-First, High-Resilience Hybrid Architecture</strong> নীতিতে প্রণীত। এটি একই সাথে ক্লাউড সার্ভারের গতিশীলতা এবং লোকাল ব্রাউজারের তাৎক্ষণিক ক্যাশ কার্যকারিতা নিশ্চিত করে।
  </p>

  <div class="diagram-box">
[ ব্যবহারকারীর ডিভাইস (মোবাইল / কম্পিউটার) ]
         │
         ├──► [ Vercel Edge CDN ] ────► রিয়্যাক্ট ১৯ SPA বান্ডেল বিতরণ (HTML/CSS/JS)
         │
         └──► [ Supabase Cloud ] ────► PostgreSQL ডাটাবেজ (PostgREST API + RLS)
                   │
                   ├── school_info (ডকুমেন্ট স্টোর: প্রোফাইল, স্লাইডস, কমিটি, কনফিগ)
                   └── রিলেশনাল টেবিলসমূহ: notices, teachers, students, results, fees
  </div>

  <ul>
    <li><strong>ফ্রন্টএন্ড স্ট্যাক:</strong> React 19, Vite 8.3, Tailwind CSS (Dual theme: emerald & indigo), Lucide-react আইকন লাইব্রেরি।</li>
    <li><strong>ব্যাকএন্ড ও ডাটাবেজ:</strong> Supabase PostgreSQL (Project ID: <code>xpzzffxukeisfvuxxyut</code>)।</li>
    <li><strong>ক্লায়েন্ট স্টেট ম্যানেজমেন্ট:</strong> <code>SchoolContext</code> সমন্বিত গ্লোবাল স্টেট ও ব্রাউজার লোকালস্টোরেজ ফলব্যাক।</li>
    <li><strong>হোস্টিং ও সিডিএন:</strong> Vercel Automated Edge Deployment।</li>
  </ul>

  <!-- Section 2 -->
  <div class="section-title">২. ডাটাবেজ স্কিমা ও টেবিল বিবরণী (Database Schema)</div>
  <p>সিস্টেমের কেন্দ্রীয় তথ্য সংরক্ষণে ৯টি মূল রিলেশনাল টেবিল এবং ১টি এক্সটেনসিবল ডকুমেন্ট স্টোর ব্যবহূত হয়:</p>

  <table>
    <thead>
      <tr>
        <th style="width: 20%;">টেবিলের নাম</th>
        <th style="width: 25%;">প্রাইমারি কি ও কলামসমূহ</th>
        <th style="width: 55%;">উদ্দেশ্য ও সংরক্ষিত ডেটা</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>school_info</code></td>
        <td><code>id (text)</code>, <code>data (jsonb)</code></td>
        <td>বিদ্যালয় প্রোফাইল (main), পরিচালনা পর্ষদ (committee), ব্যানার (hero_slides), অ্যাকাডেমিক রুটিন (academic_config)।</td>
      </tr>
      <tr>
        <td><code>notices</code></td>
        <td><code>id</code>, <code>title_bn</code>, <code>category</code>, <code>file_url</code></td>
        <td>সাধারণ, অ্যাকাডেমিক, ভর্তি ও ছুটির ক্যাটাগরিভিত্তিক নোটিশ ও স্ক্যান কপি।</td>
      </tr>
      <tr>
        <td><code>teachers</code></td>
        <td><code>id</code>, <code>name_bn</code>, <code>designation_bn</code>, <code>phone</code></td>
        <td>শিক্ষকমণ্ডলী ও স্টাফ পরিচিতি, শিক্ষাগত যোগ্যতা ও ছবি।</td>
      </tr>
      <tr>
        <td><code>students</code></td>
        <td><code>student_id</code>, <code>name_bn</code>, <code>class</code>, <code>roll</code></td>
        <td>সকল নিয়মিত ছাত্র-ছাত্রীর রেজিস্ট্রি, শ্রেণি, শাখা ও যোগাযোগ তথ্য।</td>
      </tr>
      <tr>
        <td><code>admissions</code></td>
        <td><code>id</code>, <code>applicant_name</code>, <code>class</code>, <code>status</code></td>
        <td>ওয়েবসাইট থেকে প্রেরিত অনলাইন ভর্তি আবেদন ও অনুমোদন রেকর্ড।</td>
      </tr>
      <tr>
        <td><code>results</code></td>
        <td><code>id</code>, <code>exam</code>, <code>class</code>, <code>roll</code>, <code>marksheet</code></td>
        <td>পরীক্ষার বিষয়ভিত্তিক নম্বর, জিপিএ, লেটার গ্রেড ও পূর্ণাঙ্গ মার্কশিট।</td>
      </tr>
      <tr>
        <td><code>fee_receipts</code></td>
        <td><code>receipt_no</code>, <code>student_id</code>, <code>amount</code></td>
        <td>কিউআর কোডযুক্ত বেতন ও ফি আদায়ের অফিশিয়াল ২-কপি মানি রসিদ।</td>
      </tr>
      <tr>
        <td><code>hero_slides</code></td>
        <td><code>id</code>, <code>title_bn</code>, <code>image</code>, <code>order</code></td>
        <td>হোমপেজের স্লাইডার ব্যানার ও ট্যাগলাইন।</td>
      </tr>
      <tr>
        <td><code>gallery</code></td>
        <td><code>id</code>, <code>title_bn</code>, <code>category</code>, <code>image</code></td>
        <td>ক্যাম্পাস ও অনুষ্ঠানের স্থিরচিত্র ও ভিডিও লিংক।</td>
      </tr>
    </tbody>
  </table>

  <!-- Section 3 -->
  <div class="section-title">৩. ক্রস-ডিভাইস রিয়েলটাইম সিঙ্ক মেকানিজম (Cross-Device Sync)</div>
  <p>
    এক ডিভাইস (যেমন: পিসি) থেকে সিএমএস-এ যেকোনো কিছু আপডেট করলে অন্য সব ডিভাইসে (যেমন: মোবাইল) তাৎক্ষণিক লাইভ প্রদর্শন নিশ্চিত করতে ৩ স্তরের প্রযুক্তি কাজ করে:
  </p>

  <ol>
    <li><strong>Cloud-First Hydration:</strong> সাইট ওপেন হওয়া মাত্রই <code>initCloudSync()</code> মেথড ক্লাউড ডাটাবেজ থেকে সর্বশেষ ফ্রেশ ডাটা নামিয়ে এনে স্ক্রিনে প্রদর্শন করে এবং পুরোনো লোকাল ক্যাশ থাকলে তা ওভাররাইড করে।</li>
    <li><strong>ট্যাব ভিজিবিলিটি রি-সিঙ্ক (<code>visibilitychange</code>):</strong> ব্যবহারকারী যখনই ব্যাকগ্রাউন্ড থেকে সাইটের ট্যাবে ফিরে আসেন বা ফোন আনলক করেন, সাথে সাথে স্বয়ংক্রিয় রি-সিঙ্ক কার্যকর হয়ে নতুন ডাটা লোড করে।</li>
    <li><strong>৬০ সেকেন্ড ব্যাকগ্রাউন্ড পোলিং:</strong> কোনো পেজ রিলোড ছাড়াই প্রতি ৬০ সেকেন্ডে ক্লাউড থেকে নতুন নোটিশ বা পরিবর্তনের খোঁজ নেওয়া হয়।</li>
    <li><strong>সমান্তরাল সেভ (<code>Promise.all</code>):</strong> সিএমএস-এ সেভ বাটন চাপলে রিলেশনাল টেবিল ও ডকুমেন্ট স্টোরে একসাথে প্যারালালি রিকোয়েস্ট যায়, ফলে সেভ হতে সময় লাগে ১ সেকেন্ডেরও কম।</li>
  </ol>

  <!-- Section 4 -->
  <div class="section-title">৪. হাই-স্পিড ইমেজ অপ্টিমাইজেশন পাইপলাইন (Image Optimization)</div>
  <p>
    মোবাইল বা ক্যামেরা থেকে ৫-১৫ মেগাবাইটের ছবি আপলোড করলেও ক্লাউডে পাঠানোর পূর্বে ব্রাউজারেই HTML5 Canvas প্রযুক্তির মাধ্যমে ছবি অপ্টিমাইজ করা হয়:
  </p>

  <table>
    <thead>
      <tr>
        <th>ইমেজের ধরণ</th>
        <th>সর্বোচ্চ ক্যানভাস সাইজ</th>
        <th>আউটপুট কোয়ালিটি</th>
        <th>অপ্টিমাইজড ফাইল সাইজ</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>ব্যানার স্লাইডার (Hero)</strong></td>
        <td>1280 × 720 px (16:9)</td>
        <td>JPEG / 0.78</td>
        <td><strong>১২০ – ১৬০ KB</strong> *(পূর্বে ছিল ২ MB)*</td>
      </tr>
      <tr>
        <td><strong>সভাপতি ও প্রধান শিক্ষক ছবি</strong></td>
        <td>440 × 550 px (Portrait)</td>
        <td>JPEG / 0.80</td>
        <td><strong>৪০ – ৬০ KB</strong></td>
      </tr>
      <tr>
        <td><strong>শিক্ষক ও কমিটি সদস্য</strong></td>
        <td>400 × 500 px (Portrait)</td>
        <td>JPEG / 0.80</td>
        <td><strong>৩৫ – ৫০ KB</strong></td>
      </tr>
      <tr>
        <td><strong>নোটিশ ও ডকুমেন্টস স্ক্যান</strong></td>
        <td>1000 × 1400 px</td>
        <td>JPEG / 0.76</td>
        <td><strong>৯০ – ১৩০ KB</strong></td>
      </tr>
      <tr>
        <td><strong>স্কুল লোগো ও মনোগ্রাম</strong></td>
        <td>512 × 512 px</td>
        <td>PNG / 0.92</td>
        <td><strong>৬০ – ১০০ KB</strong></td>
      </tr>
    </tbody>
  </table>

  <!-- Section 5 -->
  <div class="section-title">৫. রেজিলিয়েন্ট এনভায়রনমেন্ট ও ফলব্যাক আর্কিটেকচার</div>
  <p>
    সার্ভার ডেপ্লয়মেন্টে এনভায়রনমেন্ট ভেরিয়েবল কোনো কারণে মিস হলেও সিস্টেম স্বয়ংক্রিয়ভাবে ইন-বিল্ট প্রোডাকশন ফলব্যাক সক্রিয় করে:
  </p>
  <pre><code>// src/lib/supabase.js
const SUPABASE_FALLBACK_URL = 'https://xpzzffxukeisfvuxxyut.supabase.co';
const SUPABASE_FALLBACK_KEY = 'sb_publishable_PJ_2Riv1q8WIMasbvJMggQ_bKmG7pys';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_FALLBACK_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_FALLBACK_KEY;</code></pre>

  <!-- Section 6 -->
  <div class="section-title">৬. লোকাল ডেভেলপমেন্ট ও বিল্ড কমান্ডস (CLI Reference)</div>
  <pre><code># ডিপেন্ডেন্সি ইনস্টলেশন
npm install

# লোকাল ডেভেলপমেন্ট সার্ভার (http://localhost:3000)
npm run dev

# দ্রুততম কোড লিন্টিং অডিট
npx oxlint

# অপ্টিমাইজড প্রোডাকশন বিল্ড
npm run build</code></pre>

  <!-- Footer -->
  <div class="footer">
    <div>কারিগরি সহায়তায়: সফটওয়্যার ডেভেলপমেন্ট টিম, বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়</div>
    <div>তারিখ: নভেম্বর ২০২৬ • EIIN: ১০৬৬৪৪ • ফুলগাজী, ফেনী</div>
  </div>

</body>
</html>`;

async function generatePdf() {
  console.log('Generating Technical Guideline PDF using Edge browser...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  console.log('Printing Technical Guideline to root:', OUTPUT_PDF_ROOT);
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

  console.log('Technical Guideline PDF generated successfully!');
  await browser.close();
}

generatePdf().catch(err => {
  console.error('PDF error:', err);
  process.exit(1);
});
