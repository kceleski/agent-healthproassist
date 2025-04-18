
import { Star } from "lucide-react";
import React from "react";

export const getRatingStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center">
      {Array(fullStars).fill(0).map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 fill-healthcare-400 text-healthcare-400" />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className="w-4 h-4 text-healthcare-400" />
          <Star className="w-4 h-4 fill-healthcare-400 text-healthcare-400 absolute top-0 left-0" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />
        </div>
      )}
      {Array(5 - fullStars - (hasHalfStar ? 1 : 0)).fill(0).map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-healthcare-400" />
      ))}
      <span className="ml-1 text-sm">{rating}</span>
    </div>
  );
};
