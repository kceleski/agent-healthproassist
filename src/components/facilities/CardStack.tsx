
import { useState } from 'react';
import { Card as UICard, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Globe, Star, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface FacilityCard {
  id: string;
  name: string;
  address: string;
  rating?: number;
  type: string;
  amenities?: string[];
  phone?: string;
  website?: string;
}

interface CardProps {
  card: FacilityCard;
  index: number;
  removeCard: (id: string) => void;
  getIconComponent: (iconName: string) => React.ComponentType<any>;
  totalCards: number;
}

const Card = ({ card, index, removeCard, getIconComponent, totalCards }: CardProps): JSX.Element => {
  return (
    <UICard 
      className={`absolute w-full transition-all duration-300 ${
        index === 0 ? 'z-10 scale-100' : 
        index === 1 ? 'z-9 scale-95 translate-y-2' : 
        'z-8 scale-90 translate-y-4 opacity-50'
      }`}
      style={{
        transform: `translateY(${index * 8}px) scale(${1 - index * 0.05})`,
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{card.name}</CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span>{card.address}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeCard(card.id)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{card.type}</Badge>
          {card.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{card.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        {card.amenities && card.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {card.amenities.slice(0, 3).map((amenity, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {card.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{card.amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          {card.phone && (
            <Button variant="outline" size="sm" className="flex-1">
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
          )}
          {card.website && (
            <Button variant="outline" size="sm" className="flex-1">
              <Globe className="h-4 w-4 mr-1" />
              Website
            </Button>
          )}
        </div>
      </CardContent>
    </UICard>
  );
};

interface CardStackProps {
  cards: FacilityCard[];
  onRemoveCard: (id: string) => void;
}

const CardStack = ({ cards, onRemoveCard }: CardStackProps) => {
  const getIconComponent = (iconName: string): React.ComponentType<any> => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.HelpCircle;
  };

  if (cards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No facilities to display</p>
      </div>
    );
  }

  return (
    <div className="relative h-96 w-full max-w-md mx-auto">
      {cards.slice(0, 3).map((card, index) => (
        <Card
          key={card.id}
          card={card}
          index={index}
          removeCard={onRemoveCard}
          getIconComponent={getIconComponent}
          totalCards={cards.length}
        />
      ))}
    </div>
  );
};

export default CardStack;
