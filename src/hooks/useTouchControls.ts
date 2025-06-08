import { useEffect, RefObject } from 'react';
import { Direction } from '../types/game';

interface UseTouchControlsProps {
  elementRef: RefObject<HTMLElement>;
  onDirectionChange: (direction: Direction) => void;
  isActive: boolean;
}

export const useTouchControls = ({ 
  elementRef, 
  onDirectionChange, 
  isActive 
}: UseTouchControlsProps) => {
  useEffect(() => {
    if (!elementRef.current || !isActive) return;

    let touchStartX = 0;
    let touchStartY = 0;
    const minSwipeDistance = 30;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartX || !touchStartY) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (Math.max(absDeltaX, absDeltaY) < minSwipeDistance) return;

      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        onDirectionChange({ x: deltaX > 0 ? 1 : -1, y: 0 });
      } else {
        // Vertical swipe
        onDirectionChange({ x: 0, y: deltaY > 0 ? 1 : -1 });
      }

      touchStartX = 0;
      touchStartY = 0;
    };

    const element = elementRef.current;
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, onDirectionChange, isActive]);
};