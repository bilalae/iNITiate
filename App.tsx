import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from './components/AnimatedBackground';
import Header from './components/Header';
import Hero from './components/Hero';
import Goals from './components/Goals';
import Events from './components/Events';
import Team from './components/Team';
import JoinForm from './components/JoinForm';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import PasscodeModal from './components/PasscodeModal';

const SectionDivider: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        className="h-px max-w-3xl mx-auto bg-gradient-to-r from-cyan-400/0 via-cyan-400 to-purple-500/0"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'main' | 'admin'>('main');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);

  const navigateToAdmin = () => {
    if (isAdminAuthenticated) {
      setView('admin');
    } else {
      setIsPasscodeModalOpen(true);
    }
  };

  const navigateToMain = () => setView('main');

  const handlePasscodeSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsPasscodeModalOpen(false);
    setView('admin');
  };

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      <AnimatedBackground />

      <AnimatePresence>
        {isPasscodeModalOpen && (
          <PasscodeModal
            onClose={() => setIsPasscodeModalOpen(false)}
            onSuccess={handlePasscodeSuccess}
          />
        )}
      </AnimatePresence>
      
      {view === 'main' ? (
        <div className="relative z-10">
          <Header />
          <main>
            <Hero />
            <SectionDivider />
            <Goals />
            <SectionDivider />
            <Events />
            <SectionDivider />
            <Team />
            <SectionDivider />
            <FAQ />
            <SectionDivider />
            <JoinForm />
          </main>
          <Footer onNavigateToAdmin={navigateToAdmin} />
        </div>
      ) : (
        <AdminDashboard onBack={navigateToMain} />
      )}
    </div>
  );
};

export default App;