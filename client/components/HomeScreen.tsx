import { Button } from './ui/button';
import { hasSavedGame } from '../lib/gameLogic';

interface HomeScreenProps {
  onNewGame: () => void;
  onResumeGame: () => void;
}

export function HomeScreen({ onNewGame, onResumeGame }: HomeScreenProps) {
  const canResume = hasSavedGame();

  return (
    <div className="min-h-screen bg-gradient-to-b from-retro-space-dark via-retro-space-blue to-retro-space-dark flex items-center justify-center relative overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 1}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8 p-8">
        {/* Game Title */}
        <div className="space-y-4">
          <h1 className="font-pixel text-6xl md:text-8xl font-bold text-retro-neon-cyan drop-shadow-lg tracking-wider">
            RETRO
          </h1>
          <h2 className="font-pixel text-4xl md:text-6xl font-bold text-retro-neon-pink drop-shadow-lg tracking-wider">
            SPACESHIP
          </h2>
          <div className="w-32 h-1 bg-retro-neon-green mx-auto animate-pulse"></div>
        </div>

        {/* Spaceship ASCII Art */}
        <div className="font-pixel text-retro-neon-yellow text-2xl leading-tight select-none">
          <div>    ▲</div>
          <div>   ��██</div>
          <div>  █████</div>
          <div> ███████</div>
          <div>█████████</div>
          <div> ██  █  ██</div>
        </div>

        {/* Game Instructions */}
        <div className="space-y-2 text-retro-neon-green font-pixel text-lg">
          <p>A D KEYS TO MOVE</p>
          <p>SPACE BAR TO SHOOT</p>
          <p>DESTROY OR AVOID FALLING STONES</p>
          <p>SURVIVE AS LONG AS YOU CAN</p>
        </div>

        {/* Game Buttons */}
        <div className="space-y-4 max-w-md mx-auto">
          <Button
            onClick={onNewGame}
            className="w-full bg-retro-neon-pink hover:bg-retro-neon-pink/80 text-retro-space-dark font-pixel text-xl py-6 border-2 border-retro-neon-pink transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-retro-neon-pink/50"
          >
            START NEW GAME
          </Button>
          
          {canResume && (
            <Button
              onClick={onResumeGame}
              className="w-full bg-retro-neon-cyan hover:bg-retro-neon-cyan/80 text-retro-space-dark font-pixel text-xl py-6 border-2 border-retro-neon-cyan transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-retro-neon-cyan/50"
            >
              RESUME GAME
            </Button>
          )}
        </div>

        {/* Footer */}
        <div className="text-retro-pixel-gray font-pixel text-sm space-y-1">
          <p>BUILT WITH REACT + TYPESCRIPT</p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-retro-neon-green animate-pulse"></div>
            <span>RETRO GAMING EXPERIENCE</span>
            <div className="w-2 h-2 bg-retro-neon-green animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
