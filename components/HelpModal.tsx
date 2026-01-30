
import React from 'react';
import { X, Hash, Layers, ListOrdered, UserCircle } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-700 p-8 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-white">How to Play</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="text-slate-400" />
          </button>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-indigo-600 p-2 rounded-lg"><Hash size={20} className="text-white" /></div>
              <h3 className="text-xl font-bold text-slate-100">The Turn</h3>
            </div>
            {/* Fixed the typo from </pSection> to </p></section> */}
            <p className="text-slate-400 leading-relaxed pl-11">
              On your turn, flip any facedown brick. Once revealed, you can:
              <br /><br />
              <strong className="text-slate-200">1. Keep Position:</strong> Leave the brick where it is and score points.
              <br />
              <strong className="text-slate-200">2. Swap:</strong> Click another facedown brick to swap your revealed brick with it. Both bricks end up face-up.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-rose-600 p-2 rounded-lg"><Layers size={20} className="text-white" /></div>
              <h3 className="text-xl font-bold text-slate-100">Scoring: Pairs (1pt)</h3>
            </div>
            {/* Fixed the typo from </pSection> to </p></section> */}
            <p className="text-slate-400 leading-relaxed pl-11">
              Score 1 point for every pair of adjacent bricks that sum to <strong>8</strong>.
              <br /><br />
              <span className="bg-slate-800 px-2 py-1 rounded text-slate-200 text-sm">Example: [1] beside [7], [2] above [6], [4] beside [4].</span>
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-emerald-600 p-2 rounded-lg"><Layers size={20} className="text-white" /></div>
              <h3 className="text-xl font-bold text-slate-100">Scoring: Twins (1pt)</h3>
            </div>
            {/* Fixed the typo from </pSection> to </p></section> */}
            <p className="text-slate-400 leading-relaxed pl-11">
              Score 1 point for every pair of adjacent bricks with the <strong>same number</strong>.
              <br /><br />
              <span className="bg-slate-800 px-2 py-1 rounded text-slate-200 text-sm">Example: [3] beside [3], [5] above [5].</span>
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-amber-500 p-2 rounded-lg"><ListOrdered size={20} className="text-slate-900" /></div>
              <h3 className="text-xl font-bold text-slate-100">Scoring: Sequences (Length pts)</h3>
            </div>
            {/* Fixed the typo from </pSection> to </p></section> */}
            <p className="text-slate-400 leading-relaxed pl-11">
              Score 1 point <strong>per brick</strong> for sequences of 3 or more numbers (up or down).
              Sequences wrap around from <strong>7 to 1</strong>.
              <br /><br />
              <span className="bg-slate-800 px-2 py-1 rounded text-slate-200 text-sm italic">Example: [5, 6, 7, 1, 2] = 5 points.</span>
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-slate-700 p-2 rounded-lg"><UserCircle size={20} className="text-white" /></div>
              <h3 className="text-xl font-bold text-slate-100">Handicaps</h3>
            </div>
            {/* Fixed the typo from </pSection> to </p></section> */}
            <p className="text-slate-400 leading-relaxed pl-11">
              At the start of each round, a random player is chosen to go first. To balance the advantage, players going later receive starting bonus points:
              <br />
              1st: 0 bonus | 2nd: 1 bonus | 3rd: 2 bonus | 4th: 3 bonus.
            </p>
          </section>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-indigo-600/20"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default HelpModal;
