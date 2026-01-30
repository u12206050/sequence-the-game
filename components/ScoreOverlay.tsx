
import React from 'react';

interface ScoreOverlayProps {
  activeItem: { type: 'pair' | 'sequence' | 'twin', coords: number[], points: number } | null;
  totalAccumulated: number;
  isSkipped: boolean;
}

const ScoreOverlay: React.FC<ScoreOverlayProps> = ({ activeItem, totalAccumulated, isSkipped }) => {
  if (!activeItem && totalAccumulated === 0) return null;

  const getLabelAndStyles = () => {
    if (!activeItem) return null;
    switch(activeItem.type) {
      case 'pair':
        return { label: 'SUM 8!', class: 'bg-rose-600 text-white ring-4 ring-rose-400' };
      case 'twin':
        return { label: 'TWINS!', class: 'bg-emerald-600 text-white ring-4 ring-emerald-400' };
      case 'sequence':
        return { label: 'SEQUENCE!', class: 'bg-amber-500 text-slate-900 ring-4 ring-amber-300' };
    }
  };

  const overlayData = getLabelAndStyles();

  return (
    <div className="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center gap-1 md:gap-2">
      <div className="h-8 md:h-12 flex items-center justify-center">
        {activeItem && !isSkipped && overlayData && (
          <div 
            key={`${activeItem.type}-${activeItem.coords.join('-')}`}
            className={`px-3 md:px-6 py-1 md:py-2 rounded-full font-black text-sm md:text-xl shadow-2xl animate-pop ${overlayData.class}`}
          >
            {overlayData.label} +{activeItem.points}
          </div>
        )}
      </div>

      <div className="bg-white text-slate-950 px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl font-black text-2xl md:text-4xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center animate-in zoom-in duration-300">
        <span className="text-[8px] md:text-[10px] uppercase tracking-[0.15em] md:tracking-[0.2em] text-slate-400">Total Gained</span>
        <span className="tabular-nums leading-none">+{totalAccumulated}</span>
      </div>
      
      {isSkipped && (
        <div className="bg-indigo-600 text-white px-2 md:px-3 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold tracking-widest uppercase animate-pulse">
          Skipped
        </div>
      )}
    </div>
  );
};

export default ScoreOverlay;
