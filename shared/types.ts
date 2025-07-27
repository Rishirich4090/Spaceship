export interface Stone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export interface Explosion {
  id: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  startTime: number;
}

export interface Spaceship {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export interface GameState {
  spaceship: Spaceship;
  stones: Stone[];
  bullets: Bullet[];
  explosions: Explosion[];
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  level: number;
  lives: number;
}

export type GameScreen = 'home' | 'playing' | 'gameOver' | 'paused';

export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  spaceshipSpeed: number;
  stoneSpeed: number;
  stoneSpawnRate: number;
  maxStones: number;
}

export interface SavedGame {
  gameState: GameState;
  timestamp: number;
}
