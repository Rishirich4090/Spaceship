import { useEffect, useRef, useCallback } from 'react';
import { GameState, Stone, Spaceship, Bullet, Explosion } from '@shared/types';
import { GAME_CONFIG, KEYS } from '../lib/gameConstants';
import {
  updateStonePositions,
  generateStones,
  checkCollisions,
  moveSpaceship,
  saveGame,
  createBullet,
  updateBulletPositions,
  checkBulletStoneCollisions,
  canShoot,
  updateExplosions
} from '../lib/gameLogic';

interface GameScreenProps {
  gameState: GameState;
  onGameStateChange: (gameState: GameState) => void;
  onGameOver: () => void;
}

export function GameScreen({ gameState, onGameStateChange, onGameOver }: GameScreenProps) {
  const gameLoopRef = useRef<number>();
  const keysPressed = useRef<Set<string>>(new Set());

  const updateGame = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    let newGameState = { ...gameState };

    // Handle spaceship movement with WASD
    if (keysPressed.current.has(KEYS.MOVE_LEFT)) {
      newGameState.spaceship = moveSpaceship(newGameState.spaceship, 'left');
    }
    if (keysPressed.current.has(KEYS.MOVE_RIGHT)) {
      newGameState.spaceship = moveSpaceship(newGameState.spaceship, 'right');
    }

    // Update bullets
    newGameState.bullets = updateBulletPositions(newGameState.bullets);

    // Update explosions
    newGameState.explosions = updateExplosions(newGameState.explosions);

    // Update stones with progressive difficulty
    newGameState.stones = updateStonePositions(newGameState.stones);
    newGameState.stones = generateStones(newGameState.stones, newGameState.level);

    // Check bullet-stone collisions
    const collisionResult = checkBulletStoneCollisions(newGameState.bullets, newGameState.stones);
    newGameState.bullets = collisionResult.remainingBullets;
    newGameState.stones = collisionResult.remainingStones;
    newGameState.explosions = [...newGameState.explosions, ...collisionResult.explosions];
    newGameState.score += collisionResult.score;

    // Calculate score based on stones that passed
    const passedStones = newGameState.stones.filter(
      stone => stone.y > GAME_CONFIG.canvasHeight - 100
    ).length;
    newGameState.score += passedStones;

    // Level progression based on score
    newGameState.level = Math.floor(newGameState.score / 500) + 1;

    // Check spaceship-stone collisions
    if (checkCollisions(newGameState.spaceship, newGameState.stones)) {
      newGameState.isGameOver = true;
      onGameOver();
    }

    // Save game state periodically
    if (!newGameState.isGameOver) {
      saveGame(newGameState);
    }

    onGameStateChange(newGameState);
  }, [gameState, onGameStateChange, onGameOver]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    keysPressed.current.add(event.key);

    // Handle shooting (space bar)
    if (event.key === KEYS.SPACE && canShoot(gameState.bullets) && !gameState.isGameOver && !gameState.isPaused) {
      const newBullet = createBullet(gameState.spaceship);
      const newGameState = {
        ...gameState,
        bullets: [...gameState.bullets, newBullet],
      };
      onGameStateChange(newGameState);
    }
  }, [gameState, onGameStateChange]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    keysPressed.current.delete(event.key);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    const gameLoop = () => {
      updateGame();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    if (!gameState.isGameOver && !gameState.isPaused) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [updateGame, gameState.isGameOver, gameState.isPaused]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-retro-space-dark via-retro-space-blue to-retro-space-dark relative overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 1}s`,
            }}
          />
        ))}
      </div>

      {/* Game HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="flex justify-between items-center font-pixel text-retro-neon-green">
          <div className="text-xl">
            SCORE: <span className="text-retro-neon-yellow">{gameState.score.toString().padStart(6, '0')}</span>
          </div>
          <div className="text-xl">
            LEVEL: <span className="text-retro-neon-cyan">{gameState.level}</span>
          </div>
          <div className="text-xl">
            LIVES: <span className="text-retro-neon-pink">{'♥'.repeat(gameState.lives)}</span>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div 
        className="relative mx-auto"
        style={{ 
          width: `${GAME_CONFIG.canvasWidth}px`, 
          height: `${GAME_CONFIG.canvasHeight}px`,
          maxWidth: '100vw',
          transform: 'scale(min(1, 100vw / 800px))',
          transformOrigin: 'top center',
        }}
      >
        {/* Spaceship */}
        <SpaceshipComponent spaceship={gameState.spaceship} />

        {/* Bullets */}
        {gameState.bullets.map(bullet => (
          <BulletComponent key={bullet.id} bullet={bullet} />
        ))}

        {/* Explosions */}
        {gameState.explosions.map(explosion => (
          <ExplosionComponent key={explosion.id} explosion={explosion} />
        ))}

        {/* Stones */}
        {gameState.stones.map(stone => (
          <StoneComponent key={stone.id} stone={stone} />
        ))}
      </div>

      {/* Game Instructions */}
      <div className="absolute bottom-4 left-4 right-4 text-center font-pixel text-retro-pixel-gray text-sm">
        <p>A D KEYS TO MOVE • SPACE TO SHOOT • ESC TO PAUSE</p>
      </div>
    </div>
  );
}

function SpaceshipComponent({ spaceship }: { spaceship: Spaceship }) {
  return (
    <div
      className="absolute transition-all duration-75 ease-linear"
      style={{
        left: `${spaceship.x}px`,
        top: `${spaceship.y}px`,
        width: `${spaceship.width}px`,
        height: `${spaceship.height}px`,
      }}
    >
      <div className="font-pixel text-retro-neon-cyan text-2xl leading-none select-none">
        <div className="text-center">▲</div>
        <div className="text-center">███</div>
        <div className="text-center">█████</div>
        <div className="text-center">██ ██</div>
      </div>
    </div>
  );
}

function BulletComponent({ bullet }: { bullet: Bullet }) {
  return (
    <div
      className="absolute transition-none"
      style={{
        left: `${bullet.x}px`,
        top: `${bullet.y}px`,
        width: `${bullet.width}px`,
        height: `${bullet.height}px`,
      }}
    >
      <div className="font-pixel text-retro-neon-cyan text-center leading-none select-none text-lg">
        |
      </div>
    </div>
  );
}

function ExplosionComponent({ explosion }: { explosion: Explosion }) {
  const age = Date.now() - explosion.startTime;
  const progress = age / explosion.duration;
  const scale = 1 + progress * 0.5; // Expand during explosion
  const opacity = 1 - progress; // Fade out

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${explosion.x}px`,
        top: `${explosion.y}px`,
        width: `${explosion.size}px`,
        height: `${explosion.size}px`,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <div className="font-pixel text-retro-neon-yellow text-center leading-none select-none text-4xl animate-pulse">
        💥
      </div>
    </div>
  );
}

function StoneComponent({ stone }: { stone: Stone }) {
  const stoneChars = ['●', '◆', '▲', '■'];
  const stoneChar = stoneChars[Math.floor(Math.random() * stoneChars.length)];

  return (
    <div
      className="absolute transition-none"
      style={{
        left: `${stone.x}px`,
        top: `${stone.y}px`,
        width: `${stone.width}px`,
        height: `${stone.height}px`,
      }}
    >
      <div
        className="font-pixel text-retro-pixel-gray text-center leading-none select-none"
        style={{ fontSize: `${Math.min(stone.width, stone.height)}px` }}
      >
        {stoneChar}
      </div>
    </div>
  );
}
