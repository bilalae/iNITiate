import React from 'react';
import { motion } from 'framer-motion';
import { Event } from './AdminDashboard'; 

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Events: React.FC<{ data?: Event[] }> = ({ data = [] }) => {
  return (
    <section id="events" className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
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
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2" 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {data.map((event) => (
              <motion.div
                key={event.id}
                className="group bg-slate-900/40 rounded-3xl overflow-hidden border border-slate-800 transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-900/80 flex flex-col shadow-lg"
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                {/* Image Container */}
                <div className="relative w-full aspect-video bg-slate-950 overflow-hidden">
                  {event.imageUrl ? (
                    <img 
                      src={event.imageUrl} 
                      alt={event.name} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    /* --- NEW: "Coming Soon" Animation --- */
                    <div className="h-full w-full flex items-center justify-center relative overflow-hidden bg-slate-900">
                      {/* Animated Glow Effect */}
                      <motion.div 
                        className="absolute inset-0 opacity-30"
                        animate={{ 
                          background: [
                            "radial-gradient(circle at 50% 50%, #06b6d4 0%, transparent 50%)",
                            "radial-gradient(circle at 50% 50%, #0891b2 0%, transparent 70%)",
                            "radial-gradient(circle at 50% 50%, #06b6d4 0%, transparent 50%)"
                          ] 
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      
                      {/* Animated Text */}
                      <motion.div
                        className="flex flex-col items-center z-10"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <span className="text-cyan-400 font-black tracking-[0.3em] text-xl uppercase italic drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                          Coming Soon
                        </span>
                        <div className="h-0.5 w-12 bg-cyan-500/50 mt-2 rounded-full" />
                      </motion.div>
                    </div>
                  )}
                  
                  {/* Status Overlay */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold backdrop-blur-md ${
                      event.status === 'Upcoming' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-900/60 text-slate-400 border border-slate-700'
                    }`}>
                      {event.status || "Scheduled"}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-cyan-400 text-xs font-bold tracking-wide uppercase">
                      <span>{event.date || "Date TBA"}</span>
                      {event.venue && (
                        <>
                          <span className="text-slate-700">•</span>
                          <span className="text-slate-300">{event.venue}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-white mt-2 group-hover:text-cyan-300 transition-colors leading-tight">
                      {event.name || "Untitled Event"}
                    </h3>
                  </div>
                  
                  <p className="text-slate-400 leading-relaxed text-sm line-clamp-4">
                    {event.description || "Join iNITiate for this upcoming session."}
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