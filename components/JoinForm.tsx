import { motion } from "framer-motion";

const JoinForm = () => {
  return (
    <section id="join" className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-xl mx-auto bg-slate-900/50 backdrop-blur-lg rounded-2xl p-8 sm:p-12 shadow-2xl border border-slate-800 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Join i<span className="text-red-800">NIT</span>iate
          </motion.h2>
          <motion.p className="mt-4 text-lg text-slate-400">
            Become a part of our community and start your journey of innovation.
          </motion.p>

          <div className="mt-8">
            <motion.a
              href="https://chat.whatsapp.com/GxqDBd54qrzKdWlpd0amA5?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full py-3 px-5 rounded-md text-white bg-cyan-600 hover:bg-cyan-700 transition-all duration-300 font-medium text-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Join now!
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JoinForm;