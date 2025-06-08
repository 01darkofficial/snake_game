import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Position, Direction } from '../types/game';
import { useLocalStorage } from './useLocalStorage';

const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION: Direction = { x: 1, y: 0 };
const GRID_SIZE = 25;

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useLocalStorage('snake-high-score', 0);
  
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const lastDirectionRef = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (currentSnake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y
    ));
    return newFood;
  }, []);

  const checkCollision = useCallback((head: Position, body: Position[]): boolean => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    
    // Self collision
    return body.some(segment => segment.x === head.x && segment.y === head.y);
  }, []);

  const moveSnake = useCallback(() => {
    if (gameState !== 'playing') return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      // Move head
      head.x += lastDirectionRef.current.x;
      head.y += lastDirectionRef.current.y;
      
      // Check collision
      if (checkCollision(head, newSnake)) {
        setGameState('gameOver');
        return currentSnake;
      }
      
      newSnake.unshift(head);
      
      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
          }
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }
      
      return newSnake;
    });
  }, [gameState, food, highScore, setHighScore, generateFood, checkCollision]);

  const changeDirection = useCallback((newDirection: Direction) => {
    // Prevent reverse direction
    if (newDirection.x === -lastDirectionRef.current.x && 
        newDirection.y === -lastDirectionRef.current.y) {
      return;
    }
    
    lastDirectionRef.current = newDirection;
    setDirection(newDirection);
  }, []);

  const startGame = useCallback(() => {
    setGameState('playing');
  }, []);

  const pauseGame = useCallback(() => {
    setGameState('paused');
  }, []);

  const restartGame = useCallback(() => {
    setGameState('idle');
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    lastDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
  }, [generateFood]);

  // Game loop
  useEffect(() => {
    if (gameState === 'playing') {
      const speed = Math.max(50, 200 - Math.floor(score / 50) * 10);
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, moveSnake, score]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          changeDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          e.preventDefault();
          changeDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          e.preventDefault();
          changeDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          e.preventDefault();
          changeDirection({ x: 1, y: 0 });
          break;
        case ' ':
          e.preventDefault();
          if (gameState === 'idle') {
            startGame();
          } else if (gameState === 'playing') {
            pauseGame();
          } else if (gameState === 'paused') {
            startGame();
          } else if (gameState === 'gameOver') {
            restartGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, changeDirection, startGame, pauseGame, restartGame]);

  return {
    gameState,
    snake,
    food,
    direction,
    score,
    highScore,
    gridSize: GRID_SIZE,
    startGame,
    pauseGame,
    restartGame,
    changeDirection
  };
};