/**
 * Comprehensive SQA Automated Test Suite
 * Validates:
 * 1. Seed data integrity (zero instances of "Bandua" / "bandua" / "BANDUA")
 * 2. Dual-language fallbacks (all BN and EN texts non-empty)
 * 3. Deep sanitization on legacy payload simulation
 * 4. Academic curriculum groups & subjects
 * 5. Signatories & Seals
 */

import { 
  initialSchoolInfo, 
  initialHeroSlides, 
  initialNotices, 
  initialTeachers, 
  initialStudents, 
  initialAcademicGroups, 
  initialUniformInfo 
} from '../src/data/initialData.js';
import { deepSanitizeBondua, sanitizeBonduaString } from '../src/utils/sanitizeData.js';
import { mappers } from '../src/lib/supabase.js';

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName}`);
  }
}

console.log('--- SQA SUITE 1: Seed Data Spelling Audit ---');
const seedString = JSON.stringify({
  initialSchoolInfo,
  initialHeroSlides,
  initialNotices,
  initialTeachers,
  initialStudents,
  initialAcademicGroups,
  initialUniformInfo
});

assert(!seedString.includes('Bandua'), 'Seed data contains no "Bandua"');
assert(!seedString.includes('bandua'), 'Seed data contains no "bandua"');
assert(!seedString.includes('BANDUA'), 'Seed data contains no "BANDUA"');
assert(initialSchoolInfo.nameEn === 'Bondua Daulatpur High School', 'School nameEn is Bondua Daulatpur High School');

console.log('\n--- SQA SUITE 2: Hero Slides Dual-Language & Fallback Audit ---');
initialHeroSlides.forEach((slide, idx) => {
  assert(Boolean(slide.titleBn && slide.titleBn.trim()), `Slide ${idx + 1} has non-empty titleBn`);
  assert(Boolean(slide.titleEn && slide.titleEn.trim()), `Slide ${idx + 1} has non-empty titleEn`);
  assert(Boolean(slide.subtitleBn && slide.subtitleBn.trim()), `Slide ${idx + 1} has non-empty subtitleBn`);
  assert(Boolean(slide.subtitleEn && slide.subtitleEn.trim()), `Slide ${idx + 1} has non-empty subtitleEn`);
  assert(Boolean(slide.tagBn && slide.tagBn.trim()), `Slide ${idx + 1} has non-empty tagBn`);
  assert(Boolean(slide.tagEn && slide.tagEn.trim()), `Slide ${idx + 1} has non-empty tagEn`);
  assert(!slide.titleEn.includes('Bandua'), `Slide ${idx + 1} titleEn has no Bandua`);
});

console.log('\n--- SQA SUITE 3: Supabase Slide Mapper Fallback Audit ---');
const legacySupabaseRow = {
  id: '1',
  title_bn: 'বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়ে স্বাগতম',
  subtitle_bn: 'ফেনী-পরশুরাম রোড সংলগ্ন',
  tag_bn: 'ঐতিহ্য ও আধুনিকতা',
  image: 'https://example.com/photo.jpg',
  order: 1,
  active: true
  // Note: title_en, subtitle_en, tag_en are intentionally missing as in legacy DB
};
const mappedSlide = mappers.slide.fromDb(legacySupabaseRow);
assert(Boolean(mappedSlide.titleEn), 'Mapped slide automatically populated titleEn from fallback');
assert(Boolean(mappedSlide.subtitleEn), 'Mapped slide automatically populated subtitleEn from fallback');
assert(Boolean(mappedSlide.tagEn), 'Mapped slide automatically populated tagEn from fallback');
assert(mappedSlide.titleEn.includes('Bondua'), 'Mapped slide fallback uses "Bondua"');

console.log('\n--- SQA SUITE 4: Deep Sanitization Function Audit ---');
const legacyPayload = {
  school: {
    nameEn: 'Bandua Daulatpur High School',
    addressEn: 'Along Feni-Parshuram Road, Bandua Daulatpur, Fulgazi, Feni',
    sealText: 'BANDUA DAULATPUR HIGH SCHOOL SEAL',
    url: 'https://bandua-school.vercel.app'
  },
  slides: [
    { titleEn: 'Welcome to Bandua High School', note: 'bandua legacy note' }
  ]
};
const sanitizedPayload = deepSanitizeBondua(legacyPayload);
assert(sanitizedPayload.school.nameEn === 'Bondua Daulatpur High School', 'Sanitized nameEn correctly replaced');
assert(sanitizedPayload.school.sealText === 'BONDUA DAULATPUR HIGH SCHOOL SEAL', 'Sanitized uppercase seal correctly replaced');
assert(sanitizedPayload.slides[0].titleEn === 'Welcome to Bondua High School', 'Sanitized slide titleEn correctly replaced');
assert(sanitizedPayload.slides[0].note === 'bondua legacy note', 'Sanitized lowercase correctly replaced');

console.log('\n--- SQA SUITE 5: Academic Disciplines & Subjects Audit ---');
assert(initialAcademicGroups.length === 3, 'Found 3 academic groups (Science, Business, Humanities)');
initialAcademicGroups.forEach(grp => {
  assert(Boolean(grp.titleBn && grp.titleEn), `Group ${grp.id} has both titleBn and titleEn`);
  assert(Array.isArray(grp.subjectsBn) && grp.subjectsBn.length >= 6, `Group ${grp.id} has at least 6 core/elective subjects`);
});

console.log(`\n========================================`);
console.log(`TOTAL SQA TESTS: ${passedTests + failedTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log(`========================================`);

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
