import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TwitterIcon, LinkedInIcon, GithubIcon } from './icons/SocialIcons';
import { getTeam, TeamMember } from '../services/api';
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
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const Team: React.FC = () => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const data = await getTeam();
                setTeamMembers(data);
            } catch (error) {
                console.error("Failed to fetch team:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeam();
    }, []);

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

        {isLoading ? (
             <div className="flex justify-center mt-16"><Loader /></div>
        ) : (
            <motion.div
                className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
            {teamMembers.map((person) => (
                <motion.div
                key={person.id}
                className="space-y-4 text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                >
                <img
                    className="mx-auto h-32 w-32 rounded-full object-cover ring-4 ring-slate-800"
                    src={person.imageUrl}
                    alt={person.name}
                />
                <div className="space-y-2">
                    <div className="text-lg font-medium space-y-1">
                    <h3 className="text-white">{person.name}</h3>
                    <p className="text-cyan-400">{person.role}</p>
                    </div>
                    <div className="flex justify-center space-x-5">
                    {person.twitterUrl && (
                      <motion.a whileHover={{ scale: 1.2, color: '#FFFFFF' }} href={person.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500">
                        <span className="sr-only">Twitter</span>
                        <TwitterIcon className="h-6 w-6" />
                      </motion.a>
                    )}
                    {person.linkedinUrl && (
                      <motion.a whileHover={{ scale: 1.2, color: '#FFFFFF' }} href={person.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500">
                        <span className="sr-only">LinkedIn</span>
                        <LinkedInIcon className="h-6 w-6" />
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