
import React, { useState } from 'react';
import { UserPlus, GitCompareArrows, Info, Map as MapIcon, Grid3X3, Dna, Bot } from 'lucide-react';
import { GameMode } from '../types';

export interface PlayerConfig {
  name: string;
  isBot: boolean;
  botDifficulty?: 'easy' | 'medium' | 'hard';
}

interface LobbyProps {
  onStart: (playerConfigs: PlayerConfig[], mode: GameMode, seed: string) => void;
}

const Lobby: React.FC<LobbyProps> = ({ onStart }) => {
  const [players, setPlayers] = useState<PlayerConfig[]>([
    { name: 'Player 1', isBot: false },
    { name: 'Bot', isBot: true, botDifficulty: 'medium' },
  ]);
  const [mode, setMode] = useState<GameMode>('BOARD');
  const [seed, setSeed] = useState(String(Date.now()));

  const addPlayer = () => {
    if (players.length < 4) {
      setPlayers([...players, { name: `Player ${players.length + 1}`, isBot: false }]);
    }
  };

  const removePlayer = (idx: number) => {
    if (players.length > 2) {
      setPlayers(players.filter((_, i) => i !== idx));
    }
  };

  const updatePlayer = (idx: number, updates: Partial<PlayerConfig>) => {
    const newPlayers = [...players];
    newPlayers[idx] = { ...newPlayers[idx], ...updates };
    setPlayers(newPlayers);
  };

  const toggleBot = (idx: number) => {
    const player = players[idx];
    updatePlayer(idx, {
      isBot: !player.isBot,
      name: !player.isBot ? 'Bot' : `Player ${idx + 1}`,
      botDifficulty: !player.isBot ? 'medium' : undefined,
    });
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
              {players.map((player, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex gap-2">
                    {player.isBot ? (
                      <div className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 flex items-center gap-2">
                        <Bot size={18} className="text-indigo-400" />
                        <span className="font-bold">{player.name}</span>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => updatePlayer(i, { name: e.target.value })}
                        className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder={`Player ${i + 1}`}
                      />
                    )}
                    <button
                      onClick={() => toggleBot(i)}
                      className={`p-3 rounded-xl transition-colors ${
                        player.isBot
                          ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                      title={player.isBot ? 'Switch to Human' : 'Switch to Bot'}
                    >
                      <Bot size={20} />
                    </button>
                    {players.length > 2 && (
                      <button onClick={() => removePlayer(i)} className="bg-slate-800 text-rose-400 p-3 rounded-xl hover:bg-rose-500/10 transition-colors">&times;</button>
                    )}
                  </div>
                  {player.isBot && (
                    <div className="flex gap-2 pl-2">
                      {(['easy', 'medium', 'hard'] as const).map((diff) => (
                        <button
                          key={diff}
                          onClick={() => updatePlayer(i, { botDifficulty: diff })}
                          className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                            player.botDifficulty === diff
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {players.length < 4 && (
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
          onClick={() => onStart(players, mode, seed)}
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
