
import React, { useState } from 'react';
import { UserPlus, GitCompareArrows, Info, Map as MapIcon, Grid3X3, Dna } from 'lucide-react';
import { GameMode } from '../types';

interface LobbyProps {
  onStart: (names: string[], mode: GameMode, seed: string) => void;
}

const Lobby: React.FC<LobbyProps> = ({ onStart }) => {
  const [names, setNames] = useState(['Player 1', 'Player 2']);
  const [mode, setMode] = useState<GameMode>('BOARD');
  const [seed, setSeed] = useState(String(Date.now()));

  const addPlayer = () => {
    if (names.length < 4) {
      setNames([...names, `Player ${names.length + 1}`]);
    }
  };

  const removePlayer = (idx: number) => {
    if (names.length > 2) {
      setNames(names.filter((_, i) => i !== idx));
    }
  };

  const updateName = (idx: number, name: string) => {
    const newNames = [...names];
    newNames[idx] = name;
    setNames(newNames);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-indigo-600 rounded-2xl mb-4 shadow-xl shadow-indigo-500/20">
            <GitCompareArrows className="text-white" size={40} stroke="currentColor" />
          </div>
          <h1 className="text-4xl font-black text-white mb-1 leading-none">Sequence</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4 italic">by Gerard Lamusse</p>
          <p className="text-slate-400">Sum to 8 and build sequences to win!</p>
        </div>

        <div className="space-y-6 mb-8">
          {/* Mode Selection */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Game Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('BOARD')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  mode === 'BOARD' 
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
              >
                <Grid3X3 size={24} />
                <span className="font-bold text-sm">Board</span>
              </button>
              <button
                onClick={() => setMode('MAP')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  mode === 'MAP' 
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
              >
                <MapIcon size={24} />
                <span className="font-bold text-sm">Map</span>
              </button>
            </div>
          </div>

          {/* Players */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Players</label>
            <div className="space-y-3">
              {names.map((name, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => updateName(i, e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder={`Player ${i + 1}`}
                  />
                  {names.length > 2 && (
                    <button onClick={() => removePlayer(i)} className="bg-slate-800 text-rose-400 p-3 rounded-xl hover:bg-rose-500/10 transition-colors">&times;</button>
                  )}
                </div>
              ))}
              {names.length < 4 && (
                <button onClick={addPlayer} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-700 text-slate-400 rounded-xl hover:bg-slate-800 transition-colors">
                  <UserPlus size={20} /> Add Player
                </button>
              )}
            </div>
          </div>

          {/* Seed Input */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1">
              <Dna size={12} /> Map Seed (Optional)
            </label>
            <input
              type="text"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
              placeholder="Leave blank for random"
            />
          </div>
        </div>

        <button
          onClick={() => onStart(names, mode, seed)}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xl rounded-2xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
        >
          Start Game
        </button>

        <div className="mt-8 pt-8 border-t border-slate-800 flex gap-4 text-xs text-slate-500 leading-relaxed">
          <Info size={24} className="shrink-0 text-slate-400" />
          <div>
            <p className="font-bold text-slate-300 mb-1">Quick Rules:</p>
            <p>1. Flip a brick. Keep it or Swap it with an unflipped one.</p>
            <p>2. Score pairs (sum 8) or sequences (length 3+).</p>
            <p>3. Map mode adds holes that challenge your sequences!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
