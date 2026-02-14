import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 1. Import Firestore listeners and your database connection
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from './firebase'; 

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
import Loader from './components/Loader';

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
  
  // Persistence: Stay logged in even if the page refreshes
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('initiate_admin_auth') === 'true';
  });
  
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);

  // 2. States to store our live Firestore data
  const [events, setEvents] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Setup Real-time Listeners
  useEffect(() => {
    // Listen to 'events'
    const unsubEvents = onSnapshot(collection(db, "events"), (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listen to 'goals'
    const unsubGoals = onSnapshot(collection(db, "goals"), (snapshot) => {
      setGoals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listen to 'team'
    const unsubTeam = onSnapshot(collection(db, "team"), (snapshot) => {
      setTeam(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listen to 'faqs'
    const unsubFaqs = onSnapshot(collection(db, "faqs"), (snapshot) => {
      setFaqs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false); // Stop loading once data starts arriving
    });

    // Clean up listeners when the app closes
    return () => {
      unsubEvents(); unsubGoals(); unsubTeam(); unsubFaqs();
    };
  }, []);

  const navigateToAdmin = () => {
    if (isAdminAuthenticated) {
      setView('admin');
    } else {
      setIsPasscodeModalOpen(true);
    }
  };

  const navigateToMain = () => setView('main');

  const handlePasscodeSuccess = () => {
    localStorage.setItem('initiate_admin_auth', 'true');
    setIsAdminAuthenticated(true);
    setIsPasscodeModalOpen(false);
    setView('admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('initiate_admin_auth');
    setIsAdminAuthenticated(false);
    setView('main');
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
            
            {/* 4. We pass the data into our components as props */}
            {isLoading ? (
              <div className="flex justify-center py-20"><Loader /></div>
            ) : (
              <>
                <Goals data={goals} />
                <SectionDivider />
                <Events data={events} />
                <SectionDivider />
                <Team data={team} />
                <SectionDivider />
                <FAQ data={faqs} />
              </>
            )}
            
            <SectionDivider />
            <JoinForm />
          </main>
          <Footer onNavigateToAdmin={navigateToAdmin} />
        </div>
      ) : (
        <AdminDashboard onBack={navigateToMain} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;