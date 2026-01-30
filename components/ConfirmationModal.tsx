
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[300] flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-slate-900 border border-slate-700 p-8 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="bg-rose-500/20 p-4 rounded-full mb-4">
            <AlertCircle size={40} className="text-rose-500" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">{title}</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            {message}
          </p>
          <div className="flex flex-col w-full gap-3">
            <button
              onClick={onConfirm}
              className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-rose-600/20 active:scale-95"
            >
              Yes, Restart
            </button>
            <button
              onClick={onCancel}
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
