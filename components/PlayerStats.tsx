
import React from 'react';
import { Player } from '../types';
import { Award, Bot } from 'lucide-react';

interface PlayerStatsProps {
  player: Player;
  isActive: boolean;
  isCurrentTurn: boolean;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player, isActive, isCurrentTurn }) => {
  return (
    <div className={`flex flex-col items-center p-1 sm:p-2 md:p-3 rounded-xl md:rounded-2xl transition-all duration-300 min-w-[100px] md:min-w-[130px] ${
      isActive ? 'bg-indigo-600/20 ring-2 ring-indigo-500/50 scale-105 shadow-lg' : 'bg-slate-900/40'
    }`}>
      <div className="w-full flex justify-between items-center mb-0.5 md:mb-1">
        <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
          {isCurrentTurn ? 'Active' : 'Player'}
        </span>
        {player.roundWins > 0 && (
          <div className="flex items-center gap-0.5 md:gap-1 bg-amber-500/20 px-1 md:px-1.5 py-0.5 rounded-md">
            <Award size={8} className="text-amber-400 md:hidden" />
            <Award size={10} className="text-amber-400 hidden md:block" />
            <span className="text-[9px] md:text-[10px] font-bold text-amber-400">{player.roundWins}</span>
          </div>
        )}
      </div>
      <span className="text-sm md:text-lg font-bold text-white mb-0.5 md:mb-1 truncate max-w-[85px] md:max-w-[110px] flex items-center gap-1">
        {player.isBot && <Bot size={14} className="text-indigo-400 shrink-0" />}
        {player.name}
      </span>
      <div className="flex flex-col items-center">
        <span className="text-2xl md:text-3xl font-black text-white tabular-nums leading-none">
          {player.roundScore}
        </span>
        <span className="text-[8px] md:text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Points</span>
      </div>
    </div>
  );
};

export default PlayerStats;
