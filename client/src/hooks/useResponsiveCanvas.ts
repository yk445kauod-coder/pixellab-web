import { useState, useEffect } from 'react';

export interface CanvasSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
}

export const useResponsiveCanvas = (): CanvasSize => {
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({
    width: 800,
    height: 600,
    isMobile: false,
    isTablet: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;

      let canvasWidth = 800;
      let canvasHeight = 600;

      if (isMobile) {
        // Mobile: Full width minus padding
        canvasWidth = Math.min(width - 40, 600);
        canvasHeight = Math.min(height - 200, 400);
      } else if (isTablet) {
        // Tablet: Adjusted size
        canvasWidth = Math.min(width - 300, 700);
        canvasHeight = Math.min(height - 120, 500);
      } else {
        // Desktop: Default size
        canvasWidth = 800;
        canvasHeight = 600;
      }

      setCanvasSize({
        width: canvasWidth,
        height: canvasHeight,
        isMobile,
        isTablet,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return canvasSize;
};
