import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getGoals, Goal } from '../services/api';
import Loader from './Loader';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const Goals: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const data = await getGoals();
                setGoals(data);
            } catch (error) {
                console.error("Failed to fetch goals:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGoals();
    }, []);

  return (
    <section id="goals" className="py-16 sm:py-24 bg-slate-950/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Our Core Goals</h2>
          <p className="mt-4 text-lg text-slate-400">
            We are dedicated to building a community that thrives on curiosity, collaboration, and cutting-edge innovation.
          </p>
        </motion.div>
        
        {isLoading ? (
            <div className="flex justify-center mt-16"><Loader /></div>
        ) : (
            <motion.div
            className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            >
            {goals.map((goal) => {
                return (
                    <motion.div
                    key={goal.id}
                    className="bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-800 text-center flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 hover:border-slate-700"
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    >
                    <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cyan-900/50 text-cyan-400">
                          <div className="h-8 w-8" dangerouslySetInnerHTML={{ __html: goal.icon }} aria-hidden="true" />
                        </div>
                    </div>
                    <div className="mt-5">
                        <h3 className="text-xl font-semibold text-white">{goal.name}</h3>
                        <p className="mt-2 text-base text-slate-400">{goal.description}</p>
                    </div>
                    </motion.div>
                )
            })}
            </motion.div>
        )}
      </div>
    </section>
  );
};

export default Goals;