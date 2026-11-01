# বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয় (Bandua Daulatpur High School)
### Official Institutional Portal & School ERP Management System
**EIIN: 106644 • MPO: 105476301 • কুমিল্লা শিক্ষাবোর্ড • আনন্দপুর, ফুলগাজী, ফেনী**

---

## 🌟 Overview
A modern, bug-free, fully responsive, dual-language (Bangla & English) School Portal & ERP System built specifically for **Bandua Daulatpur High School** (বন্দুয়া দৌলতপুর উচ্চ বিদ্যালয়), Fulgazi, Feni, Bangladesh.

The platform integrates the school's public website with an administrative ERP suite, online admission workflow, interactive marksheet generator, and direct integration with their official Facebook community: [Official Facebook Group](https://www.facebook.com/groups/887015382052811/).

---

## 🚀 Key Modules & Capabilities

### 1. 🏛️ Public Institutional Website
- **School Crest & Brand Identity**: Custom SVG seal with motto ("জ্ঞানই আলো, শিক্ষাই শক্তি"), Comilla Education Board affiliation, EIIN (106644), and establishment year (1990).
- **Hero Slider**: High-impact campus life, morning assembly, Sheikh Russel Digital Lab, and sports championship banners.
- **Headmaster's Desk**: Authentic message from Acting Headmaster **জনাব বাহার উদ্দিন ভূঁইয়া** (Mr. Bahar Uddin Bhuiyan).
- **Managing Committee**: Message from the Chairman, Managing Committee.
- **Breaking Notice Ticker**: Interactive announcement marquee with pause/play.
- **Notice Board**: Official notices with category filters (Academic, Exam, Admission, Events) and printable letterhead document modal.
- **Academic Programs**: Class 6 to 10 structure, groups (Science, Business Studies, Humanities), labs, library, and facilities.
- **Faculty & Staff Directory**: Searchable educator roster with designations, qualifications, subjects, and direct contact options.
- **Class Routine & Syllabus**: Downloadable NCTB curricula, weekly schedule table, and examination calendars.
- **Campus Gallery**: Photo albums with lightbox viewer and video player.
- **Contact & Map**: Address details, GPS location map, and inquiry submission form.
- **Bilingual Interface**: Seamless 1-click toggle between **বাংলা** and **English**.

### 2. 🎓 Student Result Search & Marksheet Generator
- Search by **Exam Type** (SSC Test, Annual, Pre-Test), **Class** (6-10), and **Roll Number**.
- Generates verified **Academic Transcript & Grade Report**:
  - Subject-wise marks, letter grades (A+ to F), and grade points (5.0 scale).
  - Overall GPA calculation following Comilla Education Board standards.
  - Institute seal, Controller of Examinations & Headmaster digital signatures.
  - Dedicated **Print / Save as PDF** styling.
  - Pre-seeded with rolls `101`, `102`, `103` for immediate testing.

### 3. 📝 Online Admission System
- Multi-step online application form for classes 6, 7, 8, 9.
- Captures candidate bio, guardian details, previous school GPA, blood group, and address.
- Generates official **Admission Application Admit Slip** with unique Tracking ID (e.g., `BDHS-ADM-2026-XXXX`), barcode, test instructions, and 1-click printing.

### 4. 🌐 Facebook Group Media Hub
- Dedicated interface linked to: `https://www.facebook.com/groups/887015382052811/`.
- **Media Importer / Sync Tool**:
  - Allows pasting image URLs from Facebook group posts or selecting sample presets.
  - Tag photos with category (Campus, Sports, Cultural, Academic, Batch Reunion).
  - Immediately publishes to the public photo gallery with LocalStorage persistence.

### 5. 🛡️ Integrated ERP & School Management System
Access via the **"পোর্টাল লগইন"** button:
- **1-Click Demo Login** for Principal (Admin), Senior Teacher, or Student.
- **Dashboard Overview**: Metrics on enrolled students, active teachers, fee collections, and pending applications.
- **Student Management**: Add, search, filter students, and **Print Student ID Cards**.
- **Admission Review**: Review online applications, approve or revert status.
- **Marks Entry & Result Publisher**: Enter marks by subject, auto-compute GPA & letter grade, and publish live.
- **Notice Publisher**: Create urgent or general announcements with instant publishing.
- **Fee Collection & Accounts**: Record tuition or exam fees (bKash/Nagad/Cash) and print **Official Money Receipts**.
- **School Settings**: Update contact information, address, headmaster message, or reset data to default seeds.

---

## 💻 Tech Stack
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Google Fonts (*Hind Siliguri* & *Plus Jakarta Sans*)
- **Icons**: Lucide React
- **Persistence**: LocalStorage with realistic seed data
- **Linting**: Oxlint (0 errors, 0 warnings)

---

## 🏃 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build
```

Open your browser at `http://127.0.0.1:3000/`.
