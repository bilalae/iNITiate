import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ModalProps {
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const Modal: React.FC<ModalProps> = ({ onClose, title, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal Panel */}
      <motion.div
        className="relative z-10 w-full max-w-lg bg-slate-900 rounded-lg shadow-xl border border-slate-700"
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 rounded-full hover:bg-slate-700 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
