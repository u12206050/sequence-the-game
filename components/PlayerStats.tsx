
import React from 'react';
import { Player } from '../types';
import { Award } from 'lucide-react';

interface PlayerStatsProps {
  player: Player;
  isActive: boolean;
  isCurrentTurn: boolean;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player, isActive, isCurrentTurn }) => {
  return (
    <div className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 min-w-[130px] ${
      isActive ? 'bg-indigo-600/20 ring-2 ring-indigo-500/50 scale-105 shadow-lg' : 'bg-slate-900/40'
    }`}>
      <div className="w-full flex justify-between items-center mb-1">
        <span className={`text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
          {isCurrentTurn ? 'Thinking...' : 'Player'}
        </span>
        {player.roundWins > 0 && (
          <div className="flex items-center gap-1 bg-amber-500/20 px-1.5 py-0.5 rounded-md">
            <Award size={10} className="text-amber-400" />
            <span className="text-[10px] font-bold text-amber-400">{player.roundWins}</span>
          </div>
        )}
      </div>
      <span className="text-lg font-bold text-white mb-1 truncate max-w-[110px]">
        {player.name}
      </span>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-black text-white tabular-nums">
          {player.roundScore}
        </span>
        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Round Points</span>
      </div>
    </div>
  );
};

export default PlayerStats;
