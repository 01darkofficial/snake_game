import React from 'react';
import { Trophy, Play, Pause, RotateCcw } from 'lucide-react';
import { GameState } from '../types/game';

interface GameUIProps {
  score: number;
  highScore: number;
  gameState: GameState;
  onStart: () => void;
  onPause: () => void;
  onRestart: () => void;
}

export const GameUI: React.FC<GameUIProps> = ({
  score,
  highScore,
  gameState,
  onStart,
  onPause,
  onRestart
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-2">
          Snake Game
        </h1>
        <p className="text-gray-400">Use arrow keys or swipe to move</p>
      </div>

      {/* Score Panel */}
      <div className="flex justify-center gap-6 mb-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center min-w-[120px]">
          <p className="text-gray-400 text-sm mb-1">Score</p>
          <p className="text-2xl font-bold text-white">{score}</p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center min-w-[120px]">
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-1">
            <Trophy size={16} />
            <span>High Score</span>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{highScore}</p>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        {gameState === 'idle' && (
          <button
            onClick={onStart}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
          >
            <Play size={20} />
            Start Game
          </button>
        )}
        
        {gameState === 'playing' && (
          <button
            onClick={onPause}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-yellow-500/25"
          >
            <Pause size={20} />
            Pause
          </button>
        )}
        
        {gameState === 'paused' && (
          <button
            onClick={onStart}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
          >
            <Play size={20} />
            Resume
          </button>
        )}
        
        {(gameState === 'gameOver' || gameState === 'playing' || gameState === 'paused') && (
          <button
            onClick={onRestart}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-red-500/25"
          >
            <RotateCcw size={20} />
            Restart
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
        <h3 className="text-white font-semibold mb-2">How to Play</h3>
        <div className="text-gray-400 text-sm space-y-1">
          <p>🎮 Use arrow keys or swipe to control the snake</p>
          <p>🍎 Eat red food to grow and increase your score</p>
          <p>⚠️ Don't hit the walls or your own tail</p>
          <p>⏸️ Press Space to pause/resume the game</p>
        </div>
      </div>
    </div>
  );
};