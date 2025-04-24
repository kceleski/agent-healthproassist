
import { useState, useEffect } from 'react';

type ScrollDirection = 'up' | 'down';

export const useScrollDirection = () => {
  const [direction, setDirection] = useState<ScrollDirection>('up');
  const [prevScroll, setPrevScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > prevScroll && currentScroll > 10) {
        setDirection('down');
      } else {
        setDirection('up');
      }
      
      setPrevScroll(currentScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScroll]);

  return direction;
};
