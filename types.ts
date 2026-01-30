
export type GameMode = 'BOARD' | 'MAP';

export interface Player {
  id: string;
  name: string;
  roundScore: number; // Reset every round
  roundWins: number;  // Rounds won in current game
  handicap: number;
}

export interface Brick {
  id: number;
  value: number;
  isFlipped: boolean;
  isGap: boolean;
  isNew?: boolean;
}

export type GameStatus = 'LOBBY' | 'PLAYING' | 'ROUND_OVER' | 'GAME_OVER';

export type TurnPhase = 'FIRST_FLIP' | 'CHOOSING_ACTION' | 'SECOND_FLIP' | 'SCORING';

export interface ScoringResult {
  pairs: Array<{ coords: number[]; points: number }>;
  twins: Array<{ coords: number[]; points: number }>;
  sequences: Array<{ coords: number[]; points: number }>;
  totalPoints: number;
}
