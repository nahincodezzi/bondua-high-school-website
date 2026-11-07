import React, { Suspense, lazy } from 'react';
import { SchoolProvider } from './context/SchoolContext';
import { useSchool } from './context/useSchool';
import Header from './components/Header';
import NoticeTicker from './components/NoticeTicker';
import HeroSlider from './components/HeroSlider';
import HeadmasterMessage from './components/HeadmasterMessage';
import UniformSection from './components/UniformSection';
import NoticeBoard from './components/NoticeBoard';
import AcademicPrograms from './components/AcademicPrograms';
import FacultyDirectory from './components/FacultyDirectory';
import ResultSearch from './components/ResultSearch';
import OnlineAdmission from './components/OnlineAdmission';
import Gallery from './components/Gallery';
import FacebookMediaHub from './components/FacebookMediaHub';
import RoutinesDownload from './components/RoutinesDownload';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

// Lazy-load Admin Portal so public visitors don't load admin chunks (H2)
const AdminLayout = lazy(() => import('./components/AdminPortal/AdminLayout'));

function MainApp() {
  const { activeTab, authUser } = useSchool();

  // If in admin mode, show CMS & ERP management workspace
  if (authUser && activeTab === 'admin') {
    return (
      <div className="min-h-screen bg-bg text-ink flex flex-col font-sans relative selection:bg-accent selection:text-ink">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-bg font-bangla text-deep font-bold text-sm">
            সফটওয়্যার ড্যাশবোর্ড লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...
          </div>
        }>
          <AdminLayout />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink font-sans relative selection:bg-accent selection:text-ink">
      {/* Skip to Main Content Link for Keyboard & Screen Reader Accessibility (L4) */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2 focus:bg-deep focus:text-white focus:rounded-xl focus:shadow-2xl focus:font-bold focus:font-bangla focus:outline-2 focus:outline-accent"
      >
        মূল কনটেন্টে চলে যান (Skip to content)
      </a>

      {/* Soft Ambient Light Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-soft0/[0.04] blur-[150px] rounded-full"></div>
        <div className="absolute top-1/2 right-10 w-[600px] h-[500px] bg-accent/[0.04] blur-[140px] rounded-full"></div>
      </div>

      {/* Institutional Header & Navigation */}
      <Header />

      {/* Breaking / Latest Notice Marquee Ticker */}
      <NoticeTicker />

      {/* Main Page Content based on activeTab */}
      <main id="main-content" className={`flex-1 relative z-10 ${activeTab === 'home' ? '' : 'pt-24 sm:pt-28'}`}>
        {activeTab === 'home' && (
          <>
            <HeroSlider />
            <HeadmasterMessage />
            <UniformSection />
            <NoticeBoard />
            <AcademicPrograms />
            <Gallery />
            <ContactSection />
          </>
        )}

        {activeTab === 'uniform' && <UniformSection />}
        {activeTab === 'about' && <AboutSection />}
        {activeTab === 'notices' && <NoticeBoard />}
        {activeTab === 'academics' && <AcademicPrograms />}
        {activeTab === 'faculty' && <FacultyDirectory />}
        {activeTab === 'admission' && <OnlineAdmission />}
        {activeTab === 'results' && <ResultSearch />}
        {activeTab === 'gallery' && <Gallery />}
        {activeTab === 'facebookHub' && <FacebookMediaHub />}
        {activeTab === 'routines' && <RoutinesDownload />}
        {activeTab === 'contact' && <ContactSection />}
      </main>

      {/* Institutional Footer */}
      <Footer />

      {/* Auth Modal for Principal / Teacher / Student */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <SchoolProvider>
      <MainApp />
    </SchoolProvider>
  );
}
