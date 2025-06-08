import React from 'react';
import { GameState, Position } from '../types/game';

interface GameBoardProps {
  gameState: GameState;
  snake: Position[];
  food: Position;
  gridSize: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({ 
  gameState, 
  snake, 
  food, 
  gridSize 
}) => {
  const cellSize = 20;
  const boardSize = gridSize * cellSize;

  const renderCell = (position: Position, type: 'snake' | 'food' | 'head') => {
    const style = {
      left: position.x * cellSize,
      top: position.y * cellSize,
      width: cellSize - 1,
      height: cellSize - 1,
    };

    const baseClasses = "absolute rounded-sm transition-all duration-100";
    
    if (type === 'head') {
      return (
        <div
          key={`${position.x}-${position.y}`}
          className={`${baseClasses} bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/50`}
          style={style}
        />
      );
    } else if (type === 'snake') {
      return (
        <div
          key={`${position.x}-${position.y}`}
          className={`${baseClasses} bg-gradient-to-br from-emerald-500 to-emerald-600`}
          style={style}
        />
      );
    } else {
      return (
        <div
          key={`food-${position.x}-${position.y}`}
          className={`${baseClasses} bg-gradient-to-br from-red-400 to-red-500 shadow-lg shadow-red-500/50 animate-pulse`}
          style={style}
        />
      );
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div 
        className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl"
        style={{ 
          width: boardSize + 20, 
          height: boardSize + 20,
          padding: '10px'
        }}
      >
        <div
          className="relative bg-gray-800/30 rounded-lg"
          style={{ width: boardSize, height: boardSize }}
        >
          {/* Snake body */}
          {snake.slice(1).map((segment, index) => 
            renderCell(segment, 'snake')
          )}
          
          {/* Snake head */}
          {snake.length > 0 && renderCell(snake[0], 'head')}
          
          {/* Food */}
          {renderCell(food, 'food')}
          
          {/* Game over overlay */}
          {gameState === 'gameOver' && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold mb-2 text-red-400">Game Over!</h2>
                <p className="text-gray-300">Press Space to restart</p>
              </div>
            </div>
          )}
          
          {/* Pause overlay */}
          {gameState === 'paused' && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold text-yellow-400">Paused</h2>
                <p className="text-gray-300">Press Space to continue</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};