import "./global.css";

import { useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameState, GameScreen as GameScreenType } from "@shared/types";
import { HomeScreen } from "./components/HomeScreen";
import { GameScreen } from "./components/GameScreen";
import { GameOverScreen } from "./components/GameOverScreen";
import { createInitialGameState, loadGame, clearSavedGame } from "./lib/gameLogic";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function SpaceshipGame() {
  const [currentScreen, setCurrentScreen] = useState<GameScreenType>('home');
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());

  const handleNewGame = useCallback(() => {
    clearSavedGame();
    setGameState(createInitialGameState());
    setCurrentScreen('playing');
  }, []);

  const handleResumeGame = useCallback(() => {
    const savedState = loadGame();
    if (savedState) {
      setGameState(savedState);
      setCurrentScreen('playing');
    }
  }, []);

  const handleGameOver = useCallback(() => {
    setCurrentScreen('gameOver');
  }, []);

  const handleRestart = useCallback(() => {
    clearSavedGame();
    setGameState(createInitialGameState());
    setCurrentScreen('playing');
  }, []);

  const handleBackToHome = useCallback(() => {
    setCurrentScreen('home');
  }, []);

  const handleGameStateChange = useCallback((newGameState: GameState) => {
    setGameState(newGameState);
  }, []);

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onNewGame={handleNewGame}
            onResumeGame={handleResumeGame}
          />
        );
      case 'playing':
        return (
          <GameScreen
            gameState={gameState}
            onGameStateChange={handleGameStateChange}
            onGameOver={handleGameOver}
          />
        );
      case 'gameOver':
        return (
          <GameOverScreen
            score={gameState.score}
            onRestart={handleRestart}
            onHome={handleBackToHome}
          />
        );
      default:
        return (
          <HomeScreen
            onNewGame={handleNewGame}
            onResumeGame={handleResumeGame}
          />
        );
    }
  };

  return renderCurrentScreen();
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SpaceshipGame />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
