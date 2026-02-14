import React from 'react';
import { TwitterIcon, LinkedInIcon, GithubIcon, InstagramIcon, DiscordIcon } from './icons/SocialIcons';

const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/initiate.nit', icon: InstagramIcon },
  // { name: 'Twitter', href: 'https://twitter.com/initiate_nit', icon: TwitterIcon },
  // { name: 'LinkedIn', href: 'https://www.linkedin.com/company/initiate-nit', icon: LinkedInIcon },
  // { name: 'GitHub', href: 'https://github.com/initiate-nit', icon: GithubIcon },
  // { name: 'Discord', href: 'https://discord.gg/initiate-nit', icon: DiscordIcon },
];

const footerLinks = [
    { name: 'Goals', href: '#goals' },
    { name: 'Events', href: '#events' },
    { name: 'Team', href: '#team' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Join', href: '#join' },
];

const Footer: React.FC<{ onNavigateToAdmin: () => void }> = ({ onNavigateToAdmin }) => {
    
    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        // Only prevent default and scroll if the link is an internal hash (#)
        if (href.startsWith('#')) {
            e.preventDefault();
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
        // If it's a full URL (external), we do NOT call preventDefault,
        // allowing the target="_blank" to work.
    };

  return (
    <footer className="bg-slate-950/60 border-t border-slate-800">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-center justify-center md:justify-start">
                 <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-2xl font-bold text-white">
                    I<span className="text-red-800">nit</span>iate
                </a>
            </div>

            {/* Main Navigation Links */}
            <div className="flex flex-wrap justify-center my-6 md:my-0">
                {footerLinks.map((link) => (
                    <a 
                        key={link.name} 
                        href={link.href} 
                        // Only use _blank for external links. 
                        // Note: Opening internal sections in a new tab is usually avoided in UX.
                        target={link.href.startsWith('#') ? "_self" : "_blank"} 
                        rel="noopener noreferrer" 
                        onClick={(e) => scrollToSection(e, link.href)} 
                        className="px-4 py-2 text-slate-300 hover:text-cyan-400 transition-colors"
                    >
                        {link.name}
                    </a>
                ))}
            </div>

            {/* Social Media Links */}
            <div className="flex justify-center space-x-6 md:justify-end">
                {socialLinks.map((item) => (
                    <a 
                        key={item.name} 
                        href={item.href} 
                        target="_blank"           // Correctly opens Instagram in a new tab
                        rel="noopener noreferrer" // Security standard for new tabs
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        <span className="sr-only">{item.name}</span>
                        <item.icon className="h-6 w-6" aria-hidden="true" />
                    </a>
                ))}
            </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-8 text-center">
          <p 
            className="text-base text-slate-400 cursor-pointer hover:text-slate-300"
            onClick={onNavigateToAdmin}
          >
            &copy; {new Date().getFullYear()} Initiate Science Society. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;