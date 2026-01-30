
import React from 'react';
import { Player } from '../types';
import { Trophy, ArrowRight, RotateCcw, Swords } from 'lucide-react';

interface RoundSummaryProps {
  players: Player[];
  round: number;
  isGameOver?: boolean;
  isTieBreaker?: boolean;
  onNext: () => void;
}

const RoundSummary: React.FC<RoundSummaryProps> = ({ players, round, isGameOver, isTieBreaker, onNext }) => {
  const sortedPlayers = [...players].sort((a, b) => {
    if (isGameOver) return b.roundWins - a.roundWins;
    return b.roundScore - a.roundScore;
  });

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl animate-scale-in">
        <div className="text-center mb-8">
          <div className={`inline-block p-4 rounded-2xl mb-4 shadow-xl ${isTieBreaker ? 'bg-rose-600 shadow-rose-500/20' : 'bg-amber-500 shadow-amber-500/20'}`}>
            {isTieBreaker ? <Swords className="text-white" size={40} /> : <Trophy className="text-white" size={40} />}
          </div>
          <h2 className="text-3xl font-black text-white mb-2">
            {isGameOver ? 'Game Over!' : isTieBreaker ? 'Sudden Death!' : `Round ${round} Complete`}
          </h2>
          <p className="text-slate-400">
            {isGameOver 
              ? 'Behold the Grand Champion!' 
              : isTieBreaker 
                ? 'It\'s a tie! One more round to decide it all.' 
                : 'Points reset next round. Stay focused!'}
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {sortedPlayers.map((p, i) => (
            <div 
              key={p.id}
              className={`flex items-center justify-between p-4 rounded-2xl ${
                i === 0 ? 'bg-indigo-600 shadow-lg' : 'bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-xl font-black opacity-50">#{i + 1}</span>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white">{p.name}</span>
                  {isGameOver && (
                    <span className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">
                      {p.roundWins} Round Wins
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-white block leading-none">
                  {isGameOver ? p.roundWins : p.roundScore}
                </span>
                <span className="text-[8px] text-slate-400 font-bold uppercase">
                  {isGameOver ? 'Wins' : 'Points'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onNext}
          className="w-full py-4 bg-white text-slate-900 font-bold text-xl rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {isGameOver ? (
            <><RotateCcw size={20} /> Play Again</>
          ) : isTieBreaker ? (
            <><Swords size={20} /> Start Tie Breaker</>
          ) : (
            <><ArrowRight size={20} /> Next Round</>
          )}
        </button>
      </div>
    </div>
  );
};

export default RoundSummary;
