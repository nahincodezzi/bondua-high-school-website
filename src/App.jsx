import React from 'react';
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
import AdminLayout from './components/AdminPortal/AdminLayout';

function MainApp() {
  const { activeTab, authUser } = useSchool();

  // If in admin mode, show CMS & ERP management workspace
  if (authUser && activeTab === 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative selection:bg-amber-400 selection:text-slate-950">
        <AdminLayout />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans relative selection:bg-amber-400 selection:text-slate-950">
      {/* Ambient Mesh Lighting for Glassmorphism */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-emerald-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute top-2/3 right-10 w-[600px] h-[500px] bg-amber-500/10 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-1/4 left-10 w-[700px] h-[600px] bg-teal-600/10 blur-[150px] rounded-full"></div>
      </div>

      {/* Institutional Header & Navigation */}
      <Header />

      {/* Breaking / Latest Notice Marquee Ticker */}
      <NoticeTicker />

      {/* Main Page Content based on activeTab */}
      <main className={`flex-1 relative z-10 ${activeTab === 'home' ? '' : 'pt-28 sm:pt-32'}`}>
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
