
import { Brick, ScoringResult, GameMode } from './types';

export const BOARD_ROWS = 7;
export const MAP_ROWS = 8;
export const GRID_COLS = 14;

// Simple seeded random generator
export function createPRNG(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return function() {
    h = (h + 0x6D2B79F5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) | 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(array: T[], random: () => number = Math.random): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function checkConnectivity(slots: boolean[], rows: number, cols: number): boolean {
  const firstBrick = slots.findIndex(s => !s);
  if (firstBrick === -1) return true;

  const visited = new Set<number>();
  const stack = [firstBrick];
  const totalBricks = slots.filter(s => !s).length;

  while (stack.length > 0) {
    const curr = stack.pop()!;
    if (visited.has(curr)) continue;
    visited.add(curr);

    const r = Math.floor(curr / cols);
    const c = curr % cols;
    const neighbors = [];
    if (r > 0) neighbors.push(curr - cols);
    if (r < rows - 1) neighbors.push(curr + cols);
    if (c > 0) neighbors.push(curr - 1);
    if (c < cols - 1) neighbors.push(curr + 1);

    for (const n of neighbors) {
      if (!slots[n] && !visited.has(n)) {
        stack.push(n);
      }
    }
  }

  return visited.size === totalBricks;
}

export function generateInitialBricks(mode: GameMode, seed: string): { bricks: Brick[], rows: number } {
  const random = createPRNG(seed || Math.random().toString());
  const rows = mode === 'MAP' ? MAP_ROWS : BOARD_ROWS;
  const totalSlots = rows * GRID_COLS;
  const numGaps = mode === 'MAP' ? 14 : 0;
  
  let gapIndices: number[] = [];
  if (numGaps > 0) {
    let attempts = 0;
    while (attempts < 1000) {
      const slots = new Array(totalSlots).fill(false);
      const candidates = Array.from({ length: totalSlots }, (_, i) => i);
      const shuffledCandidates = shuffle(candidates, random);
      const testGaps = shuffledCandidates.slice(0, numGaps);
      testGaps.forEach(idx => slots[idx] = true);
      
      if (checkConnectivity(slots, rows, GRID_COLS)) {
        gapIndices = testGaps;
        break;
      }
      attempts++;
    }
  }

  const values: number[] = [];
  for (let val = 1; val <= 7; val++) {
    for (let count = 0; count < 14; count++) {
      values.push(val);
    }
  }
  const shuffledValues = shuffle(values, random);

  const bricks: Brick[] = [];
  let valIdx = 0;
  for (let i = 0; i < totalSlots; i++) {
    const isGap = gapIndices.includes(i);
    bricks.push({
      id: i,
      value: isGap ? -1 : shuffledValues[valIdx++],
      isFlipped: isGap, // Gaps are "flipped" by default but effectively invisible
      isGap
    });
  }

  return { bricks, rows };
}

function getNeighbors(idx: number, rows: number, cols: number): number[] {
  const neighbors: number[] = [];
  const r = Math.floor(idx / cols);
  const c = idx % cols;

  if (r > 0) neighbors.push(idx - cols);
  if (r < rows - 1) neighbors.push(idx + cols);
  if (c > 0) neighbors.push(idx - 1);
  if (c < cols - 1) neighbors.push(idx + 1);

  return neighbors;
}

function isNextInSequence(v1: number, v2: number): boolean {
  if (v1 === 7) return v2 === 1;
  return v2 === v1 + 1;
}

function isPrevInSequence(v1: number, v2: number): boolean {
  if (v1 === 1) return v2 === 7;
  return v2 === v1 - 1;
}

export function calculateScores(bricks: Brick[], newIndices: number[], rows: number, cols: number = GRID_COLS): ScoringResult {
  const results: ScoringResult = { pairs: [], twins: [], sequences: [], totalPoints: 0 };
  const pairKeys = new Set<string>();
  const twinKeys = new Set<string>();

  for (const idx of newIndices) {
    const brick = bricks[idx];
    if (!brick || brick.isGap || !brick.isFlipped) continue;

    const neighbors = getNeighbors(idx, rows, cols);
    for (const nIdx of neighbors) {
      const neighbor = bricks[nIdx];
      if (neighbor && !neighbor.isGap && neighbor.isFlipped) {
        if (brick.value + neighbor.value === 8) {
          const pairKey = [idx, nIdx].sort((a, b) => a - b).join('-');
          if (!pairKeys.has(pairKey)) {
            results.pairs.push({ coords: [idx, nIdx], points: 1 });
            results.totalPoints += 1;
            pairKeys.add(pairKey);
          }
        }
        if (brick.value === neighbor.value) {
          const twinKey = [idx, nIdx].sort((a, b) => a - b).join('-');
          if (!twinKeys.has(twinKey)) {
            results.twins.push({ coords: [idx, nIdx], points: 1 });
            results.totalPoints += 1;
            twinKeys.add(twinKey);
          }
        }
      }
    }
  }

  const seenPathKeys = new Set<string>();
  for (const startIdx of newIndices) {
    const startBrick = bricks[startIdx];
    if (!startBrick || startBrick.isGap || !startBrick.isFlipped) continue;

    const upBranches = getMonotonePaths(bricks, startIdx, isNextInSequence, rows, cols);
    const downBranches = getMonotonePaths(bricks, startIdx, isPrevInSequence, rows, cols);

    for (const upPath of upBranches) {
      for (const downPath of downBranches) {
        const combined = [...[...downPath].reverse(), startIdx, ...upPath];
        if (combined.length >= 3) {
          const sortedCoords = [...combined].sort((a, b) => a - b).join(',');
          if (!seenPathKeys.has(sortedCoords)) {
            results.sequences.push({ coords: combined, points: combined.length });
            results.totalPoints += combined.length;
            seenPathKeys.add(sortedCoords);
          }
        }
      }
    }
  }

  return results;
}

function getMonotonePaths(
  bricks: Brick[], 
  currIdx: number, 
  checkFn: (v1: number, v2: number) => boolean, 
  rows: number,
  cols: number = GRID_COLS,
  visited: Set<number> = new Set()
): number[][] {
  const neighbors = getNeighbors(currIdx, rows, cols);
  const currentVal = bricks[currIdx].value;
  const nextVisited = new Set(visited).add(currIdx);
  
  let branches: number[][] = [];
  let foundAny = false;

  for (const nIdx of neighbors) {
    if (nextVisited.has(nIdx)) continue;
    const neighbor = bricks[nIdx];
    if (neighbor && !neighbor.isGap && neighbor.isFlipped && checkFn(currentVal, neighbor.value)) {
      foundAny = true;
      const subPaths = getMonotonePaths(bricks, nIdx, checkFn, rows, cols, nextVisited);
      for (const sub of subPaths) {
        branches.push([nIdx, ...sub]);
      }
    }
  }

  if (!foundAny) return [[]];
  return branches;
}
