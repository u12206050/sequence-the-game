
import React from 'react';

interface BrickProps {
  value: number;
  isFlipped: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
  isTargetable?: boolean;
  highlightType?: 'pair' | 'sequence' | 'twin';
  onClick: () => void;
}

const BrickComponent: React.FC<BrickProps> = ({ 
  value, 
  isFlipped, 
  isSelected, 
  isHighlighted, 
  isTargetable,
  highlightType,
  onClick 
}) => {
  const getHighlightStyles = () => {
    if (isSelected) {
      return 'ring-4 ring-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.9)] animate-pulse z-40';
    }
    if (!isHighlighted) return '';
    if (highlightType === 'pair') {
      return 'ring-4 ring-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse z-20';
    }
    if (highlightType === 'twin') {
      return 'ring-4 ring-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)] animate-pulse z-20';
    }
    return 'ring-4 ring-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-pulse z-20';
  };

  const getNumberColor = (val: number) => {
    const colors = [
      'text-blue-400', 
      'text-emerald-400', 
      'text-amber-400', 
      'text-rose-400', 
      'text-indigo-400', 
      'text-fuchsia-400', 
      'text-cyan-400'
    ];
    return colors[val - 1] || 'text-white';
  };

  return (
    <div 
      onClick={onClick}
      className={`relative w-full aspect-square cursor-pointer transition-all duration-300 perspective-1000 ${isSelected ? 'scale-110 z-30' : ''}`}
    >
      <div 
        className={`w-full h-full relative transition-transform duration-700 preserve-3d rounded-xl ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{ 
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front (Hidden state) */}
        <div 
          className={`absolute inset-0 w-full h-full bg-slate-800 border-2 rounded-xl flex items-center justify-center shadow-inner backface-hidden transition-colors ${isTargetable ? 'border-indigo-400 bg-slate-700 ring-2 ring-indigo-500/20' : 'border-slate-700'}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {isTargetable && (
            <div className="absolute inset-0 animate-pulse bg-indigo-500/10 rounded-xl"></div>
          )}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
          <div className={`font-black text-2xl select-none transition-colors ${isTargetable ? 'text-indigo-300' : 'text-slate-600'}`}>?</div>
        </div>

        {/* Back (Number revealed) */}
        <div 
          className={`absolute inset-0 w-full h-full bg-slate-950 border-2 border-slate-800 rounded-xl flex items-center justify-center shadow-2xl backface-hidden ${getHighlightStyles()}`}
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)' 
          }}
        >
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%,transparent)] bg-[length:10px_10px]"></div>
          <span className={`text-3xl md:text-4xl font-black ${getNumberColor(value)} drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] select-none`}>
            {value}
          </span>
          {(isHighlighted || isSelected) && (
             <div className={`absolute inset-0 rounded-xl ${isSelected ? 'bg-cyan-500/10' : highlightType === 'pair' ? 'bg-rose-500/10' : highlightType === 'twin' ? 'bg-emerald-500/10' : 'bg-amber-400/10'}`}></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrickComponent;
