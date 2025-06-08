import React, { useRef } from 'react';
import { GameBoard } from './components/GameBoard';
import { GameUI } from './components/GameUI';
import { useGameLogic } from './hooks/useGameLogic';
import { useTouchControls } from './hooks/useTouchControls';

function App() {
  const gameRef = useRef<HTMLDivElement>(null);
  
  const {
    gameState,
    snake,
    food,
    score,
    highScore,
    gridSize,
    startGame,
    pauseGame,
    restartGame,
    changeDirection
  } = useGameLogic();

  useTouchControls({
    elementRef: gameRef,
    onDirectionChange: changeDirection,
    isActive: gameState === 'playing'
  });

  return (
    <div 
      ref={gameRef}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <GameUI
          score={score}
          highScore={highScore}
          gameState={gameState}
          onStart={startGame}
          onPause={pauseGame}
          onRestart={restartGame}
        />
        
        <GameBoard
          gameState={gameState}
          snake={snake}
          food={food}
          gridSize={gridSize}
        />
        
        {/* Mobile instructions */}
        <div className="mt-6 text-center md:hidden">
          <p className="text-gray-400 text-sm">
            Swipe to control the snake on mobile
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;