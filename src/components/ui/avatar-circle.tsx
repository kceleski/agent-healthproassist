
import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarCircleProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  pulse?: boolean;
  image?: string;
  alt?: string;
  className?: string;
}

export const AvatarCircle = ({
  size = 'md',
  glow = false,
  pulse = false,
  image,
  alt = "Avatar",
  className,
}: AvatarCircleProps) => {
  // Map size to dimensions
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };
  
  return (
    <div 
      className={cn(
        'relative rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700',
        sizeMap[size],
        glow && 'ring-2 ring-blue-400 ring-opacity-50',
        pulse && 'animate-pulse',
        className
      )}
    >
      {image ? (
        <img 
          src={image} 
          alt={alt} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white font-semibold">
          {alt ? alt[0].toUpperCase() : 'A'}
        </div>
      )}
      {glow && (
        <div className="absolute inset-0 bg-blue-500 opacity-20 animate-pulse"></div>
      )}
    </div>
  );
};
