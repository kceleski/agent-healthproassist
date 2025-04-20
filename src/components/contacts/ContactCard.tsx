
import { Building, CalendarDays, Mail, MapPin, MoreHorizontal, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContactCardProps {
  contact: any;
  onViewDetails: (contact: any) => void;
  isPro?: boolean;
}

export const ContactCard = ({ contact, onViewDetails, isPro = false }: ContactCardProps) => {
  const isFacilityContact = !!contact.facility;
  
  return (
    <Card className="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg animate-zoom-in">
      <CardContent className="p-0">
        <div className="p-3 sm:p-4 flex items-center gap-3">
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
            <AvatarImage src={contact.image} />
            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-base sm:text-lg truncate">
                {contact.name}
              </h3>
              {!isFacilityContact && (
                <Badge 
                  className={
                    contact.status === "Active" 
                      ? "bg-green-100 text-green-700 text-xs" 
                      : "bg-blue-100 text-blue-700 text-xs"
                  }
                >
                  {contact.status}
                </Badge>
              )}
            </div>
            <div className="flex items-center text-xs sm:text-sm text-muted-foreground mt-1">
              {isFacilityContact ? (
                <span className="truncate">{contact.title}</span>
              ) : (
                <>
                  <User className="h-3 w-3 mr-1" />
                  <span>{contact.age} years old</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="px-3 sm:px-4 pb-3">
          {isFacilityContact ? (
            <Badge variant="outline" className="bg-healthcare-50 text-healthcare-700 text-xs font-normal mb-3">
              {contact.facilityType}
            </Badge>
          ) : (
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
              {contact.careNeeds?.map((need: string, i: number) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className="bg-healthcare-50 text-healthcare-700 text-xs font-normal"
                >
                  {need}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="space-y-2 text-xs sm:text-sm mb-4">
            {isFacilityContact && (
              <div className="flex items-start">
                <Building className="h-4 w-4 text-muted-foreground mr-2 shrink-0 mt-0.5" />
                <span className="font-medium">{contact.facility}</span>
              </div>
            )}
            <div className="flex items-start">
              <MapPin className="h-4 w-4 text-muted-foreground mr-2 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{contact.location}</span>
            </div>
            <div className="flex items-start">
              <Mail className="h-4 w-4 text-muted-foreground mr-2 shrink-0 mt-0.5" />
              <a 
                href={`mailto:${contact.email}`} 
                className="truncate hover:text-healthcare-600 transition-colors"
              >
                {contact.email}
              </a>
            </div>
            <div className="flex items-start">
              <Phone className="h-4 w-4 text-muted-foreground mr-2 shrink-0 mt-0.5" />
              <a 
                href={`tel:${contact.phone}`} 
                className="hover:text-healthcare-600 transition-colors"
              >
                {contact.phone}
              </a>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3 mr-1" />
              <span className="line-clamp-1">
                Last: {contact.lastContact}
              </span>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onViewDetails(contact)}>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>Edit Contact</DropdownMenuItem>
                  <DropdownMenuItem>Log Interaction</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={() => onViewDetails(contact)}
              >
                View
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
