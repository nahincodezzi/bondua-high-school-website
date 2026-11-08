import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = path.resolve('screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,960']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 1.5 });

  // 1. Public Homepage Hero & Stats
  console.log('1. Capturing 01_homepage_hero.png...');
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_homepage_hero.png') });

  // 2. Academic Disciplines & Subjects
  console.log('2. Capturing 02_academic_curriculum.png...');
  await page.evaluate(() => {
    const el = document.getElementById('curriculum');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02_academic_curriculum.png') });

  // 3. Online Admission Form
  console.log('3. Capturing 03_online_admission.png...');
  await page.goto('http://127.0.0.1:3000/#admission', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03_online_admission.png') });

  // 4. Online Result Search
  console.log('4. Capturing 04_result_search.png...');
  await page.goto('http://127.0.0.1:3000/#results', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04_result_search.png') });

  // Inject Superadmin Authentication into localStorage
  await page.evaluate(() => {
    const authPayload = {
      id: 'usr-superadmin',
      username: 'admin',
      nameBn: 'সিস্টেম অ্যাডমিনিস্ট্রেটর',
      role: 'superadmin',
      permissions: ['all']
    };
    localStorage.setItem('bdhs_auth', JSON.stringify(authPayload));
  });

  // 5. Admin Dashboard Overview & Visitor Messages
  console.log('5. Capturing 05_admin_dashboard.png...');
  await page.goto('http://127.0.0.1:3000/?module=overview#admin', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05_admin_dashboard.png') });

  // 6. Student Manager (With Select All & Floating Bar)
  console.log('6. Capturing 06_student_manager.png...');
  await page.goto('http://127.0.0.1:3000/?module=students#admin', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  // Check the first two checkboxes to activate sticky bulk action bar
  await page.evaluate(() => {
    const boxes = document.querySelectorAll('tbody input[type="checkbox"]');
    if (boxes[0]) boxes[0].click();
    if (boxes[1]) boxes[1].click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '06_student_manager_bulk.png') });

  // 7. Student Manager Excel Bulk Upload Modal & Info Guide
  console.log('7. Capturing 07_student_excel_modal.png...');
  await page.evaluate(() => {
    const excelBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('এক্সেল বাল্ক আপলোড'));
    if (excelBtn) excelBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '07_student_excel_modal.png') });

  // 8. Result Manager (Marks Entry & Excel Bulk)
  console.log('8. Capturing 08_result_manager.png...');
  await page.goto('http://127.0.0.1:3000/?module=results#admin', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '08_result_manager.png') });

  // 9. CMS Content Manager (Subjects CMS)
  console.log('9. Capturing 09_cms_subject_manager.png...');
  await page.goto('http://127.0.0.1:3000/?module=cms#admin', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  // Click on "বিভাগ ও বিষয়সমূহ (Subjects CMS)"
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const subTab = tabs.find(t => t.textContent.includes('বিভাগ ও বিষয়সমূহ'));
    if (subTab) subTab.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '09_cms_subject_manager.png') });

  // 10. Fee Collection & Voidable Money Receipts
  console.log('10. Capturing 10_fee_manager.png...');
  await page.goto('http://127.0.0.1:3000/?module=fees#admin', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '10_fee_manager.png') });

  console.log('All 10 screenshots captured successfully!');
  await browser.close();
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
