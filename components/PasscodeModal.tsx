import React, { useState } from 'react';
import Modal from './Modal';

interface PasscodeModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_PASSCODE = 'trim2024'; // Hardcoded passcode

const PasscodeModal: React.FC<PasscodeModalProps> = ({ onClose, onSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Simulate a slight delay for user feedback
    setTimeout(() => {
      if (passcode === ADMIN_PASSCODE) {
        onSuccess();
      } else {
        setError('Incorrect passcode. Please try again.');
        setPasscode('');
      }
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <Modal onClose={onClose} title="Admin Access">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-400">Please enter the passcode to access the dashboard.</p>
        <div>
          <label htmlFor="passcode" className="sr-only">Passcode</label>
          <input
            id="passcode"
            name="passcode"
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            required
            className="block w-full px-4 py-2 text-base text-white placeholder-slate-400 bg-slate-800 border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
            placeholder="Enter passcode"
            autoFocus
          />
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Verifying...' : 'Enter'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PasscodeModal;
