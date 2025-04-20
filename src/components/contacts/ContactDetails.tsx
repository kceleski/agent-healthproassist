
import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface ContactDetailsProps {
  contact: any;
  isOpen: boolean;
  onClose: () => void;
}

export const ContactDetails = ({ contact, isOpen, onClose }: ContactDetailsProps) => {
  if (!contact) return null;
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Contact Details</SheetTitle>
          <SheetDescription>
            View detailed information about this contact
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={contact.image} />
              <AvatarFallback>{contact.name?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-semibold">{contact.name}</h3>
              
              {contact.facility ? (
                <div className="mt-1">
                  <span className="text-muted-foreground">{contact.title}</span>
                  <Badge className="ml-2 bg-healthcare-50 text-healthcare-700">
                    {contact.facilityType}
                  </Badge>
                </div>
              ) : (
                <div className="mt-1 flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="text-muted-foreground">{contact.age} years old</span>
                  <Badge className={
                    contact.status === "Active" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-blue-100 text-blue-700"
                  }>
                    {contact.status}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          {contact.facility ? (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground mb-1 block">Facility</Label>
                <p className="font-medium">{contact.facility}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground mb-1 block">Care Needs</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {contact.careNeeds?.map((need: string, i: number) => (
                    <Badge key={i} variant="outline" className="bg-healthcare-50 text-healthcare-700">
                      {need}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-muted-foreground mb-1 block">Budget</Label>
                <p>{contact.budget}</p>
              </div>
            </div>
          )}
          
          <div>
            <Label className="text-muted-foreground mb-1 block">Contact Information</Label>
            <div className="space-y-3 mt-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{contact.location}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`mailto:${contact.email}`}
                  className="text-healthcare-600 hover:underline"
                >
                  {contact.email}
                </a>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`tel:${contact.phone}`}
                  className="text-healthcare-600 hover:underline"
                >
                  {contact.phone}
                </a>
              </div>
            </div>
          </div>
          
          {contact.familyContacts && (
            <div>
              <Label className="text-muted-foreground mb-1 block">Family Contacts</Label>
              <div className="space-y-4 mt-2">
                {contact.familyContacts.map((familyContact: any, index: number) => (
                  <div key={index} className="bg-muted/50 p-3 rounded-md">
                    <div className="font-medium">{familyContact.name}</div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {familyContact.relationship}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <a 
                          href={`mailto:${familyContact.email}`}
                          className="text-healthcare-600 hover:underline"
                        >
                          {familyContact.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <a 
                          href={`tel:${familyContact.phone}`}
                          className="text-healthcare-600 hover:underline"
                        >
                          {familyContact.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {contact.notes && (
            <div>
              <Label className="text-muted-foreground mb-1 block">Notes</Label>
              <div className="bg-muted/50 p-3 rounded-md mt-1">
                <p className="text-sm">{contact.notes}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 mr-1" />
            Last contact: {contact.lastContact}
          </div>
        </div>
        
        <SheetFooter className="mt-6">
          <Button className="w-full" variant="outline" onClick={onClose}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
