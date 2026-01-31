import { Brick, ScoringResult } from './types';
import { calculateScores, GRID_COLS } from './utils';

export type BotDifficulty = 'easy' | 'medium' | 'hard';

interface MoveOption {
  type: 'keep' | 'swap';
  firstIdx: number;
  secondIdx?: number;
  score: number;
  evaluation: number;
}

/**
 * Evaluates the game board and returns the best move for the AI bot
 */
export function getBotMove(
  bricks: Brick[],
  rows: number,
  cols: number = GRID_COLS,
  difficulty: BotDifficulty = 'medium'
): { type: 'keep' | 'swap'; firstIdx: number; secondIdx?: number } {
  const unflippedIndices = bricks
    .map((brick, idx) => ({ brick, idx }))
    .filter(({ brick }) => !brick.isFlipped && !brick.isGap)
    .map(({ idx }) => idx);

  if (unflippedIndices.length === 0) {
    throw new Error('No unflipped bricks available');
  }

  // For easy difficulty, make somewhat random moves with basic evaluation
  if (difficulty === 'easy') {
    return getEasyMove(bricks, unflippedIndices, rows, cols);
  }

  // For medium and hard, evaluate all possible moves
  const moveOptions: MoveOption[] = [];

  // Evaluate each unflipped brick as a potential first flip
  for (const firstIdx of unflippedIndices) {
    // Option 1: Keep the brick at firstIdx
    const keepBricks = [...bricks];
    keepBricks[firstIdx] = { ...keepBricks[firstIdx], isFlipped: true };
    const keepScore = calculateScores(keepBricks, [firstIdx], rows, cols);
    const keepEvaluation = evaluatePosition(keepBricks, keepScore, difficulty);
    
    moveOptions.push({
      type: 'keep',
      firstIdx,
      score: keepScore.totalPoints,
      evaluation: keepEvaluation,
    });

    // Option 2: Swap with other unflipped bricks
    for (const secondIdx of unflippedIndices) {
      if (secondIdx === firstIdx) continue;

      const swapBricks = [...bricks];
      const temp = swapBricks[firstIdx].value;
      swapBricks[firstIdx] = { ...swapBricks[firstIdx], value: swapBricks[secondIdx].value, isFlipped: true };
      swapBricks[secondIdx] = { ...swapBricks[secondIdx], value: temp, isFlipped: true };
      
      const swapScore = calculateScores(swapBricks, [firstIdx, secondIdx], rows, cols);
      const swapEvaluation = evaluatePosition(swapBricks, swapScore, difficulty);

      moveOptions.push({
        type: 'swap',
        firstIdx,
        secondIdx,
        score: swapScore.totalPoints,
        evaluation: swapEvaluation,
      });
    }
  }

  // Sort by evaluation score (higher is better)
  moveOptions.sort((a, b) => b.evaluation - a.evaluation);

  // For hard difficulty, always pick the best move
  if (difficulty === 'hard') {
    const best = moveOptions[0];
    return {
      type: best.type,
      firstIdx: best.firstIdx,
      secondIdx: best.secondIdx,
    };
  }

  // For medium difficulty, pick from top 30% of moves with some randomness
  const topMoves = moveOptions.slice(0, Math.max(1, Math.ceil(moveOptions.length * 0.3)));
  const selected = topMoves[Math.floor(Math.random() * topMoves.length)];
  
  return {
    type: selected.type,
    firstIdx: selected.firstIdx,
    secondIdx: selected.secondIdx,
  };
}

/**
 * Easy mode: Make decisions with basic scoring and more randomness
 */
function getEasyMove(
  bricks: Brick[],
  unflippedIndices: number[],
  rows: number,
  cols: number
): { type: 'keep' | 'swap'; firstIdx: number; secondIdx?: number } {
  // 40% chance to make a completely random move
  if (Math.random() < 0.4) {
    const firstIdx = unflippedIndices[Math.floor(Math.random() * unflippedIndices.length)];
    
    // 50% chance to keep, 50% chance to swap
    if (Math.random() < 0.5) {
      return { type: 'keep', firstIdx };
    } else {
      const otherIndices = unflippedIndices.filter(idx => idx !== firstIdx);
      if (otherIndices.length > 0) {
        const secondIdx = otherIndices[Math.floor(Math.random() * otherIndices.length)];
        return { type: 'swap', firstIdx, secondIdx };
      }
      return { type: 'keep', firstIdx };
    }
  }

  // Otherwise, make a simple evaluation
  const moveOptions: MoveOption[] = [];

  // Sample a subset of possible moves to reduce computation
  const sampledFirst = unflippedIndices.slice(0, Math.min(5, unflippedIndices.length));

  for (const firstIdx of sampledFirst) {
    const keepBricks = [...bricks];
    keepBricks[firstIdx] = { ...keepBricks[firstIdx], isFlipped: true };
    const keepScore = calculateScores(keepBricks, [firstIdx], rows, cols);
    
    moveOptions.push({
      type: 'keep',
      firstIdx,
      score: keepScore.totalPoints,
      evaluation: keepScore.totalPoints, // Simple evaluation based only on immediate score
    });

    // Try swapping with a few random bricks
    const sampledSecond = unflippedIndices
      .filter(idx => idx !== firstIdx)
      .slice(0, Math.min(3, unflippedIndices.length - 1));

    for (const secondIdx of sampledSecond) {
      const swapBricks = [...bricks];
      const temp = swapBricks[firstIdx].value;
      swapBricks[firstIdx] = { ...swapBricks[firstIdx], value: swapBricks[secondIdx].value, isFlipped: true };
      swapBricks[secondIdx] = { ...swapBricks[secondIdx], value: temp, isFlipped: true };
      
      const swapScore = calculateScores(swapBricks, [firstIdx, secondIdx], rows, cols);

      moveOptions.push({
        type: 'swap',
        firstIdx,
        secondIdx,
        score: swapScore.totalPoints,
        evaluation: swapScore.totalPoints,
      });
    }
  }

  if (moveOptions.length === 0) {
    // Fallback
    const firstIdx = unflippedIndices[0];
    return { type: 'keep', firstIdx };
  }

  // Pick from top half of moves
  moveOptions.sort((a, b) => b.evaluation - a.evaluation);
  const topHalf = moveOptions.slice(0, Math.max(1, Math.ceil(moveOptions.length * 0.5)));
  const selected = topHalf[Math.floor(Math.random() * topHalf.length)];

  return {
    type: selected.type,
    firstIdx: selected.firstIdx,
    secondIdx: selected.secondIdx,
  };
}

/**
 * Evaluates a board position considering immediate score and future potential
 */
function evaluatePosition(
  bricks: Brick[],
  scoringResult: ScoringResult,
  difficulty: BotDifficulty
): number {
  let evaluation = scoringResult.totalPoints * 10; // Base score from immediate points

  if (difficulty === 'easy') {
    // Easy mode only considers immediate score
    return evaluation;
  }

  // Count potential future scoring opportunities for medium and hard
  const flippedIndices = bricks
    .map((brick, idx) => ({ brick, idx }))
    .filter(({ brick }) => brick.isFlipped && !brick.isGap)
    .map(({ idx }) => idx);

  let potentialPairs = 0;
  let potentialTwins = 0;
  let potentialSequences = 0;

  // Look for adjacent flipped bricks that could form scoring patterns
  for (const idx of flippedIndices) {
    const brick = bricks[idx];
    const row = Math.floor(idx / GRID_COLS);
    const col = idx % GRID_COLS;

    // Check neighbors
    const neighbors = [];
    if (row > 0) neighbors.push(idx - GRID_COLS);
    if (row < Math.ceil(bricks.length / GRID_COLS) - 1) neighbors.push(idx + GRID_COLS);
    if (col > 0) neighbors.push(idx - 1);
    if (col < GRID_COLS - 1) neighbors.push(idx + 1);

    for (const nIdx of neighbors) {
      const neighbor = bricks[nIdx];
      if (!neighbor || neighbor.isGap) continue;

      if (neighbor.isFlipped) {
        // Already flipped neighbors contribute to board connectivity
        continue;
      } else {
        // Unflipped neighbors are potential future scoring opportunities
        // We don't know their exact value, so we estimate
        potentialPairs += 0.3; // Some chance of forming a pair
        potentialTwins += 0.2; // Lower chance of forming twins
      }
    }
  }

  // Bonus for creating more potential scoring positions
  evaluation += potentialPairs * 2;
  evaluation += potentialTwins * 2;

  // Bonus for sequences (they're worth more points)
  evaluation += scoringResult.sequences.reduce((sum, seq) => sum + seq.points, 0) * 2;

  return evaluation;
}
