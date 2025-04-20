
import React from "react";
import { Calendar, MapPin, Phone, Mail, ArrowRight, Star, Building, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HolographicCard, HolographicCardContent } from "@/components/ui/holographic-card";
import { HolographicButton } from "@/components/ui/holographic-button";

interface ContactCardProps {
  contact: any;
  onViewDetails: (contact: any) => void;
  isPro?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const ContactCard = ({ contact, onViewDetails, isPro = false, style, className }: ContactCardProps) => {
  // Determine if this is a senior client or facility contact
  const isSenior = !contact.facility;
  
  return (
    <HolographicCard
      variant="interactive"
      className={`swipeable-card overflow-hidden animate-zoom-in ${className || ""}`}
      onClick={() => onViewDetails(contact)}
      style={style}
      glowColor={isSenior ? "blue" : "purple"}
    >
      <HolographicCardContent className="p-0">
        <div className="relative pb-1">
          <div className="absolute top-4 right-4 z-10">
            {isPro && (
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 neon-border">
                <Star className={`h-4 w-4 ${contact.favorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
              </Button>
            )}
          </div>
          
          <div className="p-4 flex gap-4">
            <Avatar className="h-14 w-14 rounded-xl border-2 border-white/30 bg-gradient-to-br from-holo-blue/20 to-holo-purple/20 backdrop-blur-sm neon-glow">
              <AvatarImage src={contact.avatar} alt={contact.name} className="object-cover" />
              <AvatarFallback className="text-lg">
                {isSenior ? (
                  <UserRound className="h-6 w-6 text-holo-blue" />
                ) : (
                  <Building className="h-6 w-6 text-holo-purple" />
                )}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{contact.name}</h3>
              
              {isSenior ? (
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="outline" className="bg-holo-blue/10 border-holo-blue/30 text-xs font-normal">
                    Senior Client
                  </Badge>
                  <Badge variant="outline" className="bg-white/10 border-white/30 text-xs font-normal">
                    {contact.age} years
                  </Badge>
                </div>
              ) : (
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="outline" className="bg-holo-purple/10 border-holo-purple/30 text-xs font-normal">
                    {contact.facilityType}
                  </Badge>
                </div>
              )}
              
              {!isSenior && (
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {contact.facility}
                </p>
              )}
            </div>
          </div>
          
          <div className="px-4 pb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground truncate">{contact.location}</span>
              </div>
              
              {contact.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">{contact.phone}</span>
                </div>
              )}
              
              {contact.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">{contact.email}</span>
                </div>
              )}
              
              {isSenior && contact.careNeeds && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {contact.careNeeds.map((need: string, i: number) => (
                    <Badge key={i} variant="outline" className="bg-holo-blue/10 border-holo-blue/30 text-xs">
                      {need}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Last updated {contact.lastUpdated || "recently"}</span>
              </div>
              
              <HolographicButton 
                size="sm" 
                variant="outline" 
                className="h-8 px-3"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(contact);
                }}
              >
                <span className="mr-1">Details</span>
                <ArrowRight className="h-3 w-3" />
              </HolographicButton>
            </div>
          </div>
          
          {/* Holographic effect elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 pointer-events-none" />
        </div>
      </HolographicCardContent>
    </HolographicCard>
  );
};
