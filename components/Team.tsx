import React from 'react';
import { motion } from 'framer-motion';
import { LinkedInIcon, GithubIcon, InstagramIcon } from './icons/SocialIcons'; 
import { TeamMember } from './AdminDashboard'; 

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const Team: React.FC<{ data?: TeamMember[] }> = ({ data = [] }) => {
  return (
    <section id="team" className="py-20 sm:py-24 bg-slate-950/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Heading */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-black text-white sm:text-4xl tracking-tight">
            Meet the Team
          </h2>
          <p className="mt-4 text-base text-slate-400">
            The passionate individuals leading our society towards a future of innovation and discovery.
          </p>
        </motion.div>

        {data.length === 0 ? (
          <div className="text-center mt-12 text-slate-500 italic">No team members added yet.</div>
        ) : (
          /* Updated Grid: justify-center ensures the row itself is centered if it's not full */
          <motion.div
            className="flex flex-wrap justify-center gap-x-8 gap-y-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {data.map((person) => (
              <motion.div
                key={person.id}
                className="group flex flex-col items-center w-full max-w-[260px]"
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                {/* Square Container - Perfectly Centered */}
                <div className="relative mb-6 w-full aspect-square">
                  <motion.img
                    className="w-full h-full rounded-[1.75rem] object-cover ring-2 ring-slate-800 transition-all duration-500 group-hover:ring-cyan-500 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                    src={person.imageUrl || `https://ui-avatars.com/api/?name=${person.name || 'User'}&background=0D1117&color=cyan&size=512`}
                    alt={person.name || "Team Member"}
                  />
                  <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-t from-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content Stack - Perfectly Centered */}
                <div className="text-center flex flex-col items-center space-y-3">
                  <div className="space-y-0.5">
                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                      {person.name || "Member Name"}
                    </h3>
                    <p className="text-cyan-500 text-[10px] font-black tracking-[0.25em] uppercase">
                      {person.role || "Society Member"}
                    </p>
                  </div>

                  {/* Social Icons - Centered Flex */}
                  <div className="flex justify-center items-center space-x-5 pt-1">
                    {person.instagramUrl && (
                      <motion.a 
                        whileHover={{ scale: 1.2, y: -2 }} 
                        href={person.instagramUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-slate-500 hover:text-white transition-all"
                      >
                        <span className="sr-only">Instagram</span>
                        <InstagramIcon className="h-6 w-6" />
                      </motion.a>
                    )}
                    {person.githubUrl && (
                      <motion.a 
                        whileHover={{ scale: 1.2, y: -2 }} 
                        href={person.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-slate-500 hover:text-white transition-all"
                      >
                        <span className="sr-only">GitHub</span>
                        <GithubIcon className="h-6 w-6" />
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Team;