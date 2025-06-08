export type GameState = 'idle' | 'playing' | 'paused' | 'gameOver';

export interface Position {
  x: number;
  y: number;
}

export interface Direction {
  x: number;
  y: number;
}