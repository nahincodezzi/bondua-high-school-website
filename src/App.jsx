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
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        <AdminLayout />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Institutional Header & Navigation */}
      <Header />

      {/* Breaking / Latest Notice Marquee Ticker */}
      <NoticeTicker />

      {/* Main Page Content based on activeTab */}
      <main className="flex-1">
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
