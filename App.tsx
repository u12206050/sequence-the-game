
import React, { useState, useEffect, useRef } from 'react';
import { Player, Brick, GameStatus, TurnPhase, ScoringResult, GameMode } from './types';
import { generateInitialBricks, calculateScores, GRID_COLS } from './utils';
import BrickComponent from './components/Brick';
import PlayerStats from './components/PlayerStats';
import ScoreOverlay from './components/ScoreOverlay';
import Lobby from './components/Lobby';
import RoundSummary from './components/RoundSummary';
import HelpModal from './components/HelpModal';
import ConfirmationModal from './components/ConfirmationModal';
import { GitCompareArrows, CheckCircle, MousePointer2, HelpCircle, RotateCcw, Timer } from 'lucide-react';
import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('LOBBY');
  const [round, setRound] = useState(1);
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [rows, setRows] = useState(7);
  const [gameMode, setGameMode] = useState<GameMode>('BOARD');
  const [mapSeed, setMapSeed] = useState('');
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [turnPhase, setTurnPhase] = useState<TurnPhase>('FIRST_FLIP');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isTieBreaker, setIsTieBreaker] = useState(false);
  
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const timerRef = useRef<number | null>(null);
  
  const [lastScoring, setLastScoring] = useState<ScoringResult | null>(null);
  const [activeScoringItem, setActiveScoringItem] = useState<{ type: 'pair' | 'sequence' | 'twin', coords: number[], points: number } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [accumulatedTurnPoints, setAccumulatedTurnPoints] = useState(0);
  const skipRef = useRef(false);

  useEffect(() => {
    if (turnPhase === 'CHOOSING_ACTION' && !isAnimating && gameStatus === 'PLAYING') {
      setTimeLeft(20);
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleKeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [turnPhase, isAnimating, gameStatus]);

  const startGame = (names: string[], mode: GameMode, seed: string) => {
    const initialPlayers: Player[] = names.map((name) => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
      roundScore: 0,
      roundWins: 0,
      handicap: 0,
    }));
    setGameMode(mode);
    setMapSeed(seed || Math.random().toString(36).substring(7));
    startRound(initialPlayers, 1, mode, seed);
  };

  const startRound = (currentPlayers: Player[], roundNum: number, mode: GameMode = gameMode, seed: string = mapSeed) => {
    const startingPlayerIdx = Math.floor(Math.random() * currentPlayers.length);
    const updatedPlayers = currentPlayers.map((p, i) => {
      const order = (i - startingPlayerIdx + currentPlayers.length) % currentPlayers.length;
      const handicap = currentPlayers.length - 1 - order;
      return { ...p, roundScore: handicap, handicap: handicap };
    });

    const { bricks: initialBricks, rows: gridRows } = generateInitialBricks(mode, seed + roundNum);
    
    setPlayers(updatedPlayers);
    setBricks(initialBricks);
    setRows(gridRows);
    setRound(roundNum);
    setCurrentPlayerIdx(startingPlayerIdx);
    setTurnPhase('FIRST_FLIP');
    setGameStatus('PLAYING');
    setSelectedIdx(null);
    setLastScoring(null);
    setActiveScoringItem(null);
    setAccumulatedTurnPoints(0);
    setTimeLeft(20);
  };

  const handleBrickClick = (idx: number) => {
    if (isAnimating || gameStatus !== 'PLAYING') return;
    const brick = bricks[idx];
    if (brick.isGap) return;

    if (turnPhase === 'FIRST_FLIP') {
      if (brick.isFlipped) return;
      const newBricks = [...bricks];
      newBricks[idx] = { ...newBricks[idx], isFlipped: true };
      setBricks(newBricks);
      setSelectedIdx(idx);
      setTurnPhase('CHOOSING_ACTION');
    } else if (turnPhase === 'CHOOSING_ACTION') {
      if (brick.isFlipped || idx === selectedIdx) return;
      handleSwap(idx);
    }
  };

  const handleKeep = () => {
    if (selectedIdx === null) return;
    performScoring(bricks, [selectedIdx]);
  };

  const handleSwap = (secondIdx: number) => {
    if (selectedIdx === null) return;
    setIsAnimating(true);
    const newBricks = [...bricks];
    const firstBrick = { ...newBricks[selectedIdx] };
    const secondBrick = { ...newBricks[secondIdx] };
    
    newBricks[selectedIdx] = { ...firstBrick, value: secondBrick.value, id: secondBrick.id, isFlipped: true };
    newBricks[secondIdx] = { ...secondBrick, value: firstBrick.value, id: firstBrick.id, isFlipped: true };
    setBricks(newBricks);
    
    setTimeout(() => {
      performScoring(newBricks, [selectedIdx, secondIdx]);
    }, 800);
  };

  const performScoring = async (bricksToScore: Brick[], newIndices: number[]) => {
    setIsAnimating(true);
    skipRef.current = false;
    const result = calculateScores(bricksToScore, newIndices, rows);
    setLastScoring(result);
    setAccumulatedTurnPoints(0);

    const scoringItems = [
      ...result.pairs.map(p => ({ type: 'pair' as const, ...p })),
      ...result.twins.map(t => ({ type: 'twin' as const, ...t })),
      ...result.sequences.map(s => ({ type: 'sequence' as const, ...s }))
    ];

    if (scoringItems.length === 0) {
      setTimeout(() => {
        setIsAnimating(false);
        setLastScoring(null);
        checkTurnEnd(bricksToScore);
      }, 1000);
      return;
    }

    for (let i = 0; i < scoringItems.length; i++) {
      if (skipRef.current) break;
      const item = scoringItems[i];
      setActiveScoringItem(item);
      setAccumulatedTurnPoints(prev => prev + item.points);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    if (skipRef.current) setAccumulatedTurnPoints(result.totalPoints);
    setActiveScoringItem(null);

    setPlayers(prev => prev.map((p, i) => 
      i === currentPlayerIdx ? { ...p, roundScore: p.roundScore + result.totalPoints } : p
    ));

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLastScoring(null);
    setIsAnimating(false);
    checkTurnEnd(bricksToScore);
  };

  const handleScreenClick = () => {
    if (isAnimating && !skipRef.current) {
      skipRef.current = true;
    }
  };

  const checkTurnEnd = (currentBricks: Brick[]) => {
    const allFlipped = currentBricks.every(b => b.isFlipped);
    if (allFlipped) {
      handleRoundEnd();
    } else {
      setCurrentPlayerIdx((currentPlayerIdx + 1) % players.length);
      setTurnPhase('FIRST_FLIP');
      setSelectedIdx(null);
    }
  };

  const handleRoundEnd = () => {
    const maxScore = Math.max(...players.map(p => p.roundScore));
    setPlayers(prev => prev.map(p => {
      if (p.roundScore === maxScore) return { ...p, roundWins: p.roundWins + 1 };
      return p;
    }));

    if (round < 3) {
      setGameStatus('ROUND_OVER');
      setIsTieBreaker(false);
    } else {
      const projectedWins = players.map(p => p.roundWins + (p.roundScore === maxScore ? 1 : 0));
      const sessionMaxWins = Math.max(...projectedWins);
      const sessionWinnersCount = projectedWins.filter(w => w === sessionMaxWins).length;

      if (sessionWinnersCount > 1) {
        setIsTieBreaker(true);
        setGameStatus('ROUND_OVER');
      } else {
        setGameStatus('GAME_OVER');
        confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
      }
    }
  };

  const nextRound = () => startRound(players, round + 1);

  const performReset = () => {
    setPlayers([]);
    setGameStatus('LOBBY');
    setRound(1);
    setBricks([]);
    setCurrentPlayerIdx(0);
    setTurnPhase('FIRST_FLIP');
    setSelectedIdx(null);
    setLastScoring(null);
    setActiveScoringItem(null);
    setIsAnimating(false);
    setIsTieBreaker(false);
    setAccumulatedTurnPoints(0);
    setIsConfirmOpen(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  if (gameStatus === 'LOBBY') return <Lobby onStart={startGame} />;

  return (
    <div 
      className="min-h-screen p-4 md:p-8 flex flex-col items-center max-w-7xl mx-auto select-none"
      onClick={handleScreenClick}
    >
      <div className="w-full flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-slate-800/40 p-2 rounded-3xl border border-slate-700/50 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-4 px-4">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-500/20">
            <GitCompareArrows className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent leading-none">Sequence</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">by Gerard Lamusse</p>
            <div className="flex items-center gap-3">
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                {isTieBreaker ? 'Tie Breaker Round!' : `Round ${round} of 3`} • {gameMode} MODE
              </p>
              <div className="flex gap-2">
                <button onClick={(e) => { e.stopPropagation(); setIsHelpOpen(true); }} className="p-1 text-slate-500 hover:text-indigo-400 transition-colors"><HelpCircle size={16} /></button>
                <button onClick={(e) => { e.stopPropagation(); setIsConfirmOpen(true); }} className="p-1 text-slate-500 hover:text-rose-400 transition-colors"><RotateCcw size={16} /></button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto max-w-full p-4 no-scrollbar">
          {players.map((p, i) => (
            <PlayerStats key={p.id} player={p} isActive={i === currentPlayerIdx} isCurrentTurn={i === currentPlayerIdx && !isAnimating} />
          ))}
        </div>
      </div>

      <div className="h-32 w-full flex items-center justify-center relative mb-6">
        <ScoreOverlay activeItem={activeScoringItem} totalAccumulated={accumulatedTurnPoints} isSkipped={skipRef.current} />
      </div>

      <div className="relative w-full overflow-x-auto p-8 pb-12 no-scrollbar">
        <div className="brick-grid mx-auto min-w-[1000px] lg:min-w-0" style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
          {bricks.map((brick, idx) => {
            if (brick.isGap) return <div key={brick.id} className="w-full aspect-square bg-slate-900/10 rounded-xl" />;
            
            const isActivePart = activeScoringItem?.coords.includes(idx);
            const isHighlighted = isActivePart || (skipRef.current && (
               lastScoring?.pairs.some(p => p.coords.includes(idx)) || 
               lastScoring?.twins.some(t => t.coords.includes(idx)) || 
               lastScoring?.sequences.some(s => s.coords.includes(idx))
            ));

            let hType: 'pair' | 'sequence' | 'twin' | undefined = undefined;
            if (activeScoringItem && activeScoringItem.coords.includes(idx)) {
               hType = activeScoringItem.type;
            } else if (skipRef.current && lastScoring) {
               if (lastScoring.pairs.some(p => p.coords.includes(idx))) hType = 'pair';
               else if (lastScoring.twins.some(t => t.coords.includes(idx))) hType = 'twin';
               else if (lastScoring.sequences.some(s => s.coords.includes(idx))) hType = 'sequence';
            }

            return (
              <BrickComponent
                key={brick.id}
                value={brick.value}
                isFlipped={brick.isFlipped}
                isSelected={selectedIdx === idx}
                isHighlighted={isHighlighted}
                highlightType={hType}
                isTargetable={turnPhase === 'CHOOSING_ACTION' && !brick.isFlipped}
                onClick={() => handleBrickClick(idx)}
              />
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        {turnPhase === 'CHOOSING_ACTION' && !isAnimating && (
          <div className="flex flex-col items-center gap-4 pointer-events-auto">
             <div className="flex items-center gap-4 bg-slate-900/90 p-2 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-xl animate-in zoom-in duration-300">
                <div className={`flex items-center gap-2 px-6 py-4 rounded-xl font-black text-xl tabular-nums ${timeLeft <= 5 ? 'bg-rose-600 animate-pulse text-white' : 'bg-slate-800 text-indigo-400'}`}><Timer size={20} />{timeLeft}s</div>
                <button onClick={(e) => { e.stopPropagation(); handleKeep(); }} className="px-16 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition-all transform active:scale-95 flex items-center gap-2 shadow-lg shadow-emerald-600/20"><CheckCircle size={20} /> KEEP POSITION</button>
             </div>
             <div className="bg-indigo-600/90 px-6 py-2 rounded-full border border-indigo-400 flex items-center gap-2 shadow-xl animate-pulse">
               <MousePointer2 size={16} className="text-white" /><p className="text-white font-black text-sm uppercase tracking-wider">Click an unflipped tile to swap</p>
             </div>
          </div>
        )}
        {turnPhase === 'FIRST_FLIP' && !isAnimating && (
          <div className="bg-slate-800/80 px-8 py-3 rounded-full border border-slate-600 text-slate-300 font-bold uppercase tracking-widest text-xs">
            {players[currentPlayerIdx]?.name}'s Turn: Select a Brick
          </div>
        )}
        {isAnimating && (
          <div className="bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20 text-white/50 text-xs font-bold tracking-widest uppercase">
            Click to Skip Animation
          </div>
        )}
      </div>

      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
      <ConfirmationModal isOpen={isConfirmOpen} title="Restart Game?" message="This will reset all points and rounds. Are you sure you want to start over?" onConfirm={performReset} onCancel={() => setIsConfirmOpen(false)} />
      {gameStatus === 'ROUND_OVER' && <RoundSummary players={players} round={round} isTieBreaker={isTieBreaker} onNext={nextRound} />}
      {gameStatus === 'GAME_OVER' && <RoundSummary players={players} round={round} isGameOver onNext={performReset} />}
    </div>
  );
};

export default App;
