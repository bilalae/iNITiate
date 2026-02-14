import React from 'react';
import { motion } from 'framer-motion';
// Import the Event type from your dashboard to keep things consistent
import { Event } from './AdminDashboard'; 

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

// Added = [] as a safety default
const Events: React.FC<{ data?: Event[] }> = ({ data = [] }) => {
  return (
    <section id="events" className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Our Events</h2>
          <p className="mt-4 text-lg text-slate-400">
            Join our workshops, seminars, and competitions to learn, create, and innovate.
          </p>
        </motion.div>

        {data.length === 0 ? (
          <div className="text-center mt-16 text-slate-500 italic">No events scheduled yet.</div>
        ) : (
          <motion.div
            className="mt-16 grid gap-8 md:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {data.map((event) => (
              <motion.div
                key={event.id}
                className="bg-slate-900/50 p-6 rounded-2xl shadow-lg border border-slate-800 flex space-x-6 items-start transition-all duration-300 hover:border-cyan-700 hover:bg-slate-900"
                variants={itemVariants}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-slate-800 text-cyan-400 overflow-hidden">
                    {/* Switched from dangerouslySetInnerHTML to <img> for URL support */}
                    {event.imageUrl ? (
                      <img 
                        src={event.imageUrl} 
                        alt="" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      // Fallback icon if no URL is provided
                      <div className="h-8 w-8 bg-slate-700 rounded-md animate-pulse" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-white">
                      {event.name || "Special Event"}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                      event.status === 'Upcoming' ? 'bg-cyan-900/80 text-cyan-300' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {event.status || "Scheduled"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-400">
                    {event.date || "TBA"}
                  </p>
                  <p className="mt-3 text-base text-slate-300">
                    {event.description || "Join us for an exciting society session."}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Events;