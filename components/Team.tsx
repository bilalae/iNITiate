import React from 'react';
import { motion } from 'framer-motion';
import { LinkedInIcon, GithubIcon, InstagramIcon } from './icons/SocialIcons'; 
import { TeamMember } from './AdminDashboard'; 

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

// Add = [] to default the prop to an empty array
const Team: React.FC<{ data?: TeamMember[] }> = ({ data = [] }) => {
  return (
    <section id="team" className="py-16 sm:py-24 bg-slate-950/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Meet the Team</h2>
          <p className="mt-4 text-lg text-slate-400">
            The passionate individuals leading our society towards a future of innovation and discovery.
          </p>
        </motion.div>

        {data.length === 0 ? (
          <div className="text-center mt-16 text-slate-500 italic">No team members added yet.</div>
        ) : (
          <motion.div
            className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {data.map((person) => (
              <motion.div
                key={person.id}
                className="space-y-4 text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {/* Fallback to a UI Avatar if no URL is provided */}
                <img
                  className="mx-auto h-32 w-32 rounded-full object-cover ring-4 ring-slate-800 bg-slate-800"
                  src={person.imageUrl || `https://ui-avatars.com/api/?name=${person.name || 'User'}&background=0D1117&color=cyan`}
                  alt={person.name || "Team Member"}
                />
                <div className="space-y-2">
                  <div className="text-lg font-medium space-y-1">
                    <h3 className="text-white">{person.name || "Member Name"}</h3>
                    <p className="text-cyan-400 text-sm font-semibold">{person.role || "Society Member"}</p>
                  </div>
                  <div className="flex justify-center space-x-5">
                    {person.instagramUrl && (
                      <motion.a whileHover={{ scale: 1.2, color: '#FFFFFF' }} href={person.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500">
                        <span className="sr-only">Instagram</span>
                        <InstagramIcon className="h-6 w-6" />
                      </motion.a>
                    )}
                    {person.githubUrl && (
                      <motion.a whileHover={{ scale: 1.2, color: '#FFFFFF' }} href={person.githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500">
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