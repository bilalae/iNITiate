
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulate API call
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section id="newsletter" className="py-16 sm:py-24 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Stay Updated</h2>
          <p className="mt-4 text-lg text-slate-400">
            Subscribe to our newsletter to get the latest updates on events, projects, and opportunities.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 sm:flex sm:justify-center">
            <div className="min-w-0 flex-1">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-5 py-3 text-base text-white placeholder-slate-400 bg-slate-800 border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <button
                type="submit"
                className="block w-full py-3 px-5 rounded-md shadow bg-cyan-500 text-white font-medium hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </form>
          {subscribed && <p className="mt-4 text-green-400">Thank you for subscribing!</p>}
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
