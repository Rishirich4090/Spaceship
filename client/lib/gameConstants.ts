import { GameConfig, Spaceship } from '@shared/types';

export const GAME_CONFIG: GameConfig = {
  canvasWidth: 800,
  canvasHeight: 600,
  spaceshipSpeed: 8,
  stoneSpeed: 1.5, // Starting speed - will increase progressively
  stoneSpawnRate: 0.015, // Starting spawn rate - will increase
  maxStones: 15,
};

export const INITIAL_SPACESHIP: Spaceship = {
  x: GAME_CONFIG.canvasWidth / 2 - 25,
  y: GAME_CONFIG.canvasHeight - 80,
  width: 50,
  height: 40,
  speed: GAME_CONFIG.spaceshipSpeed,
};

export const STONE_SIZES = [
  { width: 20, height: 20 }, // Small
  { width: 25, height: 30 }, // Small-medium
  { width: 30, height: 30 }, // Medium
  { width: 35, height: 40 }, // Medium-large
  { width: 40, height: 35 }, // Large
  { width: 45, height: 50 }, // Extra large
  { width: 25, height: 45 }, // Tall
  { width: 50, height: 25 }, // Wide
];

export const EXPLOSION_CONFIG = {
  duration: 500, // milliseconds
  maxSize: 60,
};

export const KEYS = {
  MOVE_LEFT: 'a',
  MOVE_RIGHT: 'd',
  MOVE_UP: 'w',
  MOVE_DOWN: 's',
  SPACE: ' ',
  ESCAPE: 'Escape',
} as const;

export const BULLET_CONFIG = {
  width: 4,
  height: 12,
  speed: 10,
  maxBullets: 5,
};

export const STORAGE_KEY = 'retro-spaceship-game';
