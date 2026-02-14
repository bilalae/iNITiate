import React from 'react';
// FIX: Import Variants type from framer-motion to explicitly type the variant objects.
import { motion, Variants } from 'framer-motion';

// FIX: Explicitly type containerVariants with Variants.
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

// FIX: Explicitly type itemVariants with Variants. This resolves the type error for the `ease` property.
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Hero: React.FC = () => {
  const scrollToJoin = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.querySelector('#join')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative flex items-center justify-center min-h-screen text-center text-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 py-40">
        <motion.div
          className="max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            variants={itemVariants} 
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Welcome to i<span className="text-red-800">NIT</span>iate
          </motion.h1>
          
          <motion.p 
            variants={itemVariants} 
            className="mt-4 max-w-xl mx-auto text-lg text-slate-300 sm:text-xl md:text-2xl"
          >
            <strong className="font-semibold text-red-800">NIT's</strong> Science and Tech Society
          </motion.p>
          
          <motion.p
            variants={itemVariants}
            className="mt-8 text-2xl md:text-3xl font-medium italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
          >
            "Shoot for the stars, aim for the moon"
          </motion.p>

          <motion.div variants={itemVariants} className="mt-10">
            <a
              href="#join"
              onClick={scrollToJoin}
              className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 px-10 rounded-lg text-lg transition-all transform hover:scale-105 duration-300 hover:shadow-lg hover:shadow-cyan-500/40"
            >
              Join the Society
            </a>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="mt-40 text-3xl font-bold text-white"
          >
            Our Mission
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl mx-auto text-base text-slate-300 md:text-lg"
          >
            To be a dynamic hub for scientific inquiry and technological innovation at NIT. We are dedicated to fostering a robust 'culture of discovery' by encouraging collaboration, pioneering research, and executing hands-on projects.
          </motion.p>

        </motion.div>
      </div>
    </section>
  );
};

export default Hero;