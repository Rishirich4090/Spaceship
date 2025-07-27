import { GameState, Stone, SavedGame, Spaceship, Bullet, Explosion } from '@shared/types';
import { GAME_CONFIG, INITIAL_SPACESHIP, STONE_SIZES, STORAGE_KEY, BULLET_CONFIG, EXPLOSION_CONFIG } from './gameConstants';

export function generateRandomId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function createStone(gameLevel: number = 1): Stone {
  const size = STONE_SIZES[Math.floor(Math.random() * STONE_SIZES.length)];
  const speedMultiplier = 1 + (gameLevel - 1) * 0.3; // Increase speed by 30% each level
  const baseSpeed = GAME_CONFIG.stoneSpeed * speedMultiplier;

  return {
    id: generateRandomId(),
    x: Math.random() * (GAME_CONFIG.canvasWidth - size.width),
    y: -size.height,
    width: size.width,
    height: size.height,
    speed: baseSpeed + Math.random() * 1, // Add some variation
  };
}

export function createBullet(spaceship: Spaceship): Bullet {
  return {
    id: generateRandomId(),
    x: spaceship.x + spaceship.width / 2 - BULLET_CONFIG.width / 2,
    y: spaceship.y,
    width: BULLET_CONFIG.width,
    height: BULLET_CONFIG.height,
    speed: BULLET_CONFIG.speed,
  };
}

export function updateStonePositions(stones: Stone[]): Stone[] {
  return stones
    .map(stone => ({
      ...stone,
      y: stone.y + stone.speed,
    }))
    .filter(stone => stone.y < GAME_CONFIG.canvasHeight + stone.height);
}

export function generateStones(stones: Stone[], gameLevel: number = 1): Stone[] {
  if (stones.length >= GAME_CONFIG.maxStones) {
    return stones;
  }

  const spawnRateMultiplier = 1 + (gameLevel - 1) * 0.2; // Increase spawn rate by 20% each level
  const adjustedSpawnRate = GAME_CONFIG.stoneSpawnRate * spawnRateMultiplier;

  if (Math.random() < adjustedSpawnRate) {
    return [...stones, createStone(gameLevel)];
  }

  return stones;
}

export function checkCollision(spaceship: Spaceship, stone: Stone): boolean {
  return (
    spaceship.x < stone.x + stone.width &&
    spaceship.x + spaceship.width > stone.x &&
    spaceship.y < stone.y + stone.height &&
    spaceship.y + spaceship.height > stone.y
  );
}

export function checkCollisions(spaceship: Spaceship, stones: Stone[]): boolean {
  return stones.some(stone => checkCollision(spaceship, stone));
}

export function updateBulletPositions(bullets: Bullet[]): Bullet[] {
  return bullets
    .map(bullet => ({
      ...bullet,
      y: bullet.y - bullet.speed,
    }))
    .filter(bullet => bullet.y > -bullet.height);
}

export function checkBulletStoneCollisions(bullets: Bullet[], stones: Stone[]): {
  remainingBullets: Bullet[];
  remainingStones: Stone[];
  explosions: Explosion[];
  score: number;
} {
  let remainingBullets = [...bullets];
  let remainingStones = [...stones];
  let explosions: Explosion[] = [];
  let score = 0;

  remainingBullets = remainingBullets.filter(bullet => {
    const hitStoneIndex = remainingStones.findIndex(stone =>
      checkCollision(bullet, stone)
    );

    if (hitStoneIndex !== -1) {
      const hitStone = remainingStones[hitStoneIndex];
      // Create explosion at stone center
      explosions.push(createExplosion(
        hitStone.x + hitStone.width / 2,
        hitStone.y + hitStone.height / 2,
        Math.max(hitStone.width, hitStone.height)
      ));

      remainingStones.splice(hitStoneIndex, 1);
      score += 50; // Points for destroying a stone
      return false; // Remove bullet
    }
    return true; // Keep bullet
  });

  return {
    remainingBullets,
    remainingStones,
    explosions,
    score,
  };
}

export function canShoot(bullets: Bullet[]): boolean {
  return bullets.length < BULLET_CONFIG.maxBullets;
}

export function createExplosion(x: number, y: number, size: number): Explosion {
  return {
    id: generateRandomId(),
    x: x - size / 2,
    y: y - size / 2,
    size,
    duration: EXPLOSION_CONFIG.duration,
    startTime: Date.now(),
  };
}

export function updateExplosions(explosions: Explosion[]): Explosion[] {
  const now = Date.now();
  return explosions.filter(explosion =>
    now - explosion.startTime < explosion.duration
  );
}

export function moveSpaceship(spaceship: Spaceship, direction: 'left' | 'right'): Spaceship {
  const newX = direction === 'left' 
    ? Math.max(0, spaceship.x - spaceship.speed)
    : Math.min(GAME_CONFIG.canvasWidth - spaceship.width, spaceship.x + spaceship.speed);

  return {
    ...spaceship,
    x: newX,
  };
}

export function calculateScore(stones: Stone[]): number {
  // Score increases based on stones that have passed the spaceship
  return stones.filter(stone => stone.y > GAME_CONFIG.canvasHeight - 100).length * 10;
}

export function createInitialGameState(): GameState {
  return {
    spaceship: { ...INITIAL_SPACESHIP },
    stones: [],
    bullets: [],
    explosions: [],
    score: 0,
    isGameOver: false,
    isPaused: false,
    level: 1,
    lives: 3,
  };
}

export function saveGame(gameState: GameState): void {
  try {
    const savedGame: SavedGame = {
      gameState,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedGame));
  } catch (error) {
    console.error('Failed to save game:', error);
  }
}

export function loadGame(): GameState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const savedGame: SavedGame = JSON.parse(saved);
    return savedGame.gameState;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
}

export function clearSavedGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear saved game:', error);
  }
}

export function hasSavedGame(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
