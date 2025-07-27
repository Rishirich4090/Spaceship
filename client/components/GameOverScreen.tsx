import { Button } from './ui/button';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
  onHome: () => void;
}

export function GameOverScreen({ score, onRestart, onHome }: GameOverScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-retro-space-dark via-retro-space-blue to-retro-space-dark flex items-center justify-center relative overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
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

      <div className="relative z-10 text-center space-y-8 p-8 max-w-md mx-auto">
        {/* Game Over Title */}
        <div className="space-y-4">
          <h1 className="font-pixel text-5xl md:text-7xl font-bold text-red-500 drop-shadow-lg tracking-wider animate-pulse">
            GAME OVER
          </h1>
          <div className="w-24 h-1 bg-red-500 mx-auto animate-pulse"></div>
        </div>

        {/* Crashed Spaceship ASCII Art */}
        <div className="font-pixel text-red-400 text-xl leading-tight select-none">
          <div>   💥💥💥</div>
          <div>  ███░░███</div>
          <div> ████░░████</div>
          <div>███████████</div>
          <div> ██  ░  ██</div>
          <div>   💥💥💥</div>
        </div>

        {/* Score Display */}
        <div className="space-y-4 border-2 border-retro-neon-cyan p-6 bg-retro-space-dark/50 rounded-lg">
          <h2 className="font-pixel text-2xl text-retro-neon-cyan">FINAL SCORE</h2>
          <div className="text-6xl font-pixel font-bold text-retro-neon-yellow">
            {score.toString().padStart(6, '0')}
          </div>
          <p className="font-pixel text-retro-neon-green">POINTS</p>
        </div>

        {/* Game Stats */}
        <div className="space-y-2 text-retro-pixel-gray font-pixel text-sm">
          <p>YOU FOUGHT BRAVELY, PILOT</p>
          <p>THANK YOU FOR PLAYING</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={onRestart}
            className="w-full bg-retro-neon-green hover:bg-retro-neon-green/80 text-retro-space-dark font-pixel text-xl py-6 border-2 border-retro-neon-green transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-retro-neon-green/50"
          >
            PLAY AGAIN
          </Button>
          
          <Button
            onClick={onHome}
            className="w-full bg-retro-neon-cyan hover:bg-retro-neon-cyan/80 text-retro-space-dark font-pixel text-xl py-6 border-2 border-retro-neon-cyan transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-retro-neon-cyan/50"
          >
            MAIN MENU
          </Button>
        </div>

        {/* Achievement Messages */}
        <div className="space-y-2 text-retro-neon-pink font-pixel text-sm">
          {score >= 1000 && <p>🏆 SCORE MASTER!</p>}
          {score >= 500 && <p>⭐ EXCELLENT PILOT!</p>}
          {score >= 100 && <p>✨ GOOD JOB!</p>}
          {score < 100 && <p>💪 KEEP PRACTICING!</p>}
        </div>
      </div>
    </div>
  );
}
