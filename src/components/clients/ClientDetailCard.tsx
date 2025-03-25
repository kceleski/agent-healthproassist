
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Printer,
  Mail,
  FileText,
  AlertCircle,
  Heart,
  ReceiptText,
  Activity,
  Calendar,
  Phone,
  Users,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

// Types
type Contact = {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
};

type ClientDocument = {
  id: string;
  name: string;
  dateUploaded: string;
  type: string;
  size: string;
};

type ClientVisit = {
  date: string;
  facility: string;
  notes: string;
};

type ClientNote = {
  date: string;
  author: string;
  content: string;
};

type ClientMedicalRecord = {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  phone: string;
  email: string;
  emergencyContacts: Contact[];
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    coverageDetails: string;
  };
  medicalConditions: string[];
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    purpose: string;
  }>;
  allergies: string[];
  primaryPhysician: {
    name: string;
    facility: string;
    phone: string;
    email: string;
  };
  careLevel: 'independent' | 'assisted' | 'memory' | 'skilled';
  mobilityStatus: 'independent' | 'walker' | 'wheelchair' | 'bedridden';
  documents: ClientDocument[];
  visitHistory: ClientVisit[];
  notes: ClientNote[];
};

// Sample data
const sampleClientRecord: ClientMedicalRecord = {
  id: "CLT-001",
  clientId: "12345",
  firstName: "Robert",
  lastName: "Johnson",
  dateOfBirth: "1945-03-15",
  gender: "male",
  address: "123 Oak Street, San Francisco, CA 94102",
  phone: "(415) 555-3890",
  email: "robert.johnson@example.com",
  emergencyContacts: [
    {
      name: "Sarah Johnson",
      relationship: "Daughter",
      phone: "(415) 555-4567",
      email: "sarah.j@example.com",
      isPrimary: true
    },
    {
      name: "Michael Johnson",
      relationship: "Son",
      phone: "(415) 555-7890",
      email: "michael.j@example.com",
      isPrimary: false
    }
  ],
  insurance: {
    provider: "Medicare",
    policyNumber: "123456789A",
    groupNumber: "G-12345",
    coverageDetails: "Part A and Part B, supplemental coverage through AARP"
  },
  medicalConditions: [
    "Type 2 Diabetes",
    "Hypertension",
    "Mild Cognitive Impairment",
    "Osteoarthritis"
  ],
  medications: [
    {
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      purpose: "Diabetes management"
    },
    {
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      purpose: "Blood pressure management"
    },
    {
      name: "Acetaminophen",
      dosage: "500mg",
      frequency: "As needed",
      purpose: "Pain relief"
    }
  ],
  allergies: ["Penicillin", "Shellfish"],
  primaryPhysician: {
    name: "Dr. James Wilson",
    facility: "Golden Gate Medical Group",
    phone: "(415) 555-1234",
    email: "jwilson@ggmedical.com"
  },
  careLevel: "assisted",
  mobilityStatus: "walker",
  documents: [
    {
      id: "DOC-001",
      name: "Medical History Report",
      dateUploaded: "2023-01-15",
      type: "PDF",
      size: "2.4 MB"
    },
    {
      id: "DOC-002",
      name: "Insurance Card - Medicare",
      dateUploaded: "2023-01-15",
      type: "JPG",
      size: "1.1 MB"
    },
    {
      id: "DOC-003",
      name: "Power of Attorney",
      dateUploaded: "2023-02-03",
      type: "PDF",
      size: "3.2 MB"
    },
    {
      id: "DOC-004",
      name: "Recent Blood Work Results",
      dateUploaded: "2023-03-20",
      type: "PDF",
      size: "1.8 MB"
    }
  ],
  visitHistory: [
    {
      date: "2023-04-10",
      facility: "Sunset Senior Living",
      notes: "Client toured facility with daughter. Expressed interest in 1-bedroom apartment with garden view."
    },
    {
      date: "2023-04-15",
      facility: "Golden Years Home",
      notes: "Facility tour. Client found common areas too noisy. Preferred Sunset Senior Living."
    },
    {
      date: "2023-04-25",
      facility: "Sunset Senior Living",
      notes: "Follow-up visit. Discussed pricing and move-in timeline. Client requested additional information on meal plans."
    }
  ],
  notes: [
    {
      date: "2023-04-05",
      author: "Jennifer Adams",
      content: "Initial consultation with client and daughter. Client prefers to stay in the San Francisco area. Budget is $4,000-$5,500 per month."
    },
    {
      date: "2023-04-12",
      author: "Jennifer Adams",
      content: "Follow-up call with Sarah (daughter). Family is leaning toward Sunset Senior Living. Requested financial assistance information."
    },
    {
      date: "2023-04-28",
      author: "Jennifer Adams",
      content: "Client has decided on Sunset Senior Living. Will need assistance with paperwork and move planning. Target move date is May 15."
    }
  ]
};

interface ClientDetailCardProps {
  clientId?: string;
}

export const ClientDetailCard = ({ clientId = "CLT-001" }: ClientDetailCardProps) => {
  const { toast } = useToast();
  const [client] = useState<ClientMedicalRecord>(sampleClientRecord);
  
  // Handler for printing client record
  const handlePrintRecord = () => {
    toast({
      title: "Preparing PDF",
      description: "The client record is being prepared for printing.",
    });
    // In a real implementation, this would generate a PDF
    setTimeout(() => {
      window.print();
    }, 1000);
  };
  
  // Handler for emailing client record
  const handleEmailRecord = () => {
    toast({
      title: "Email Sent",
      description: "The client record has been securely emailed to authorized recipients.",
    });
  };
  
  // Handler for faxing client record
  const handleFaxRecord = () => {
    toast({
      title: "Fax Initiated",
      description: "The client record is being prepared for fax transmission.",
    });
  };
  
  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-healthcare-200">
              <AvatarImage src={`https://avatar.vercel.sh/${client.firstName.toLowerCase()}`} />
              <AvatarFallback className="text-xl">{client.firstName.charAt(0)}{client.lastName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{client.firstName} {client.lastName}</CardTitle>
              <CardDescription>
                Client ID: {client.clientId} • DOB: {new Date(client.dateOfBirth).toLocaleDateString()}
              </CardDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="bg-healthcare-50">
                  {client.careLevel.charAt(0).toUpperCase() + client.careLevel.slice(1)} Care
                </Badge>
                <Badge variant="outline" className="bg-healthcare-50">
                  {client.gender.charAt(0).toUpperCase() + client.gender.slice(1)}
                </Badge>
                <Badge variant="outline" className="bg-healthcare-50">
                  {client.mobilityStatus.charAt(0).toUpperCase() + client.mobilityStatus.slice(1)} Mobility
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handlePrintRecord}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleEmailRecord}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="outline" onClick={handleFaxRecord}>
              <FileText className="h-4 w-4 mr-2" />
              Fax
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="pt-6">
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{client.firstName} {client.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date of Birth</span>
                    <span className="font-medium">{new Date(client.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Age</span>
                    <span className="font-medium">
                      {new Date().getFullYear() - new Date(client.dateOfBirth).getFullYear()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gender</span>
                    <span className="font-medium">{client.gender.charAt(0).toUpperCase() + client.gender.slice(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">{client.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{client.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address</span>
                    <span className="font-medium text-right">{client.address}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Care Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Care Level</span>
                    <span className="font-medium">{client.careLevel.charAt(0).toUpperCase() + client.careLevel.slice(1)} Living</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mobility</span>
                    <span className="font-medium">{client.mobilityStatus.charAt(0).toUpperCase() + client.mobilityStatus.slice(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Primary Physician</span>
                    <span className="font-medium">{client.primaryPhysician.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Insurance</span>
                    <span className="font-medium">{client.insurance.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Policy Number</span>
                    <span className="font-medium">{client.insurance.policyNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Primary Contact</span>
                    <span className="font-medium">
                      {client.emergencyContacts.find(contact => contact.isPrimary)?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-medium">Current Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-100 p-2 rounded-full">
                        <AlertCircle className="h-5 w-5 text-yellow-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Placement Status</p>
                        <p className="text-lg font-bold">Placement in Process</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Heart className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Preferred Facilities</p>
                        <p className="text-lg font-bold">3 Selected</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <ReceiptText className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Budget Range</p>
                        <p className="text-lg font-bold">$4,000 - $5,500</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Recent Activity</h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="space-y-3">
                {client.notes.map((note, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{note.author}</span>
                      <span className="text-sm text-muted-foreground">{note.date}</span>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="medical" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Medical Conditions</h3>
                <div className="space-y-2">
                  {client.medicalConditions.map((condition, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                      <Activity className="h-4 w-4 text-healthcare-600" />
                      <span>{condition}</span>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-lg font-medium mt-6 mb-4">Allergies</h3>
                <div className="space-y-2">
                  {client.allergies.map((allergy, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span>{allergy}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Medications</h3>
                <div className="space-y-3">
                  {client.medications.map((medication, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{medication.name}</span>
                        <Badge variant="outline">{medication.dosage}</Badge>
                      </div>
                      <p className="text-sm mt-1">Frequency: {medication.frequency}</p>
                      <p className="text-sm text-muted-foreground mt-1">Purpose: {medication.purpose}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-medium">Primary Care Provider</h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h4 className="font-medium">{client.primaryPhysician.name}</h4>
                      <p className="text-sm text-muted-foreground">{client.primaryPhysician.facility}</p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>{client.primaryPhysician.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{client.primaryPhysician.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="contacts" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Emergency Contacts</h3>
              <div className="space-y-4">
                {client.emergencyContacts.map((contact, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`https://avatar.vercel.sh/${contact.name.toLowerCase().replace(' ', '_')}`} />
                            <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{contact.name}</h4>
                            <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                            {contact.isPrimary && (
                              <Badge className="mt-1 bg-healthcare-100 text-healthcare-700">Primary Contact</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p>{contact.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p>{contact.email}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Client Documents</h3>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-xs font-medium text-muted-foreground text-left p-3">Document Name</th>
                    <th className="text-xs font-medium text-muted-foreground text-left p-3">Type</th>
                    <th className="text-xs font-medium text-muted-foreground text-left p-3 hidden md:table-cell">Date Uploaded</th>
                    <th className="text-xs font-medium text-muted-foreground text-left p-3 hidden md:table-cell">Size</th>
                    <th className="text-xs font-medium text-muted-foreground text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {client.documents.map((document) => (
                    <tr key={document.id} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-healthcare-600" />
                          {document.name}
                        </div>
                      </td>
                      <td className="p-3">{document.type}</td>
                      <td className="p-3 hidden md:table-cell">{document.dateUploaded}</td>
                      <td className="p-3 hidden md:table-cell">{document.size}</td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Facility Visit History</h3>
              <div className="space-y-4">
                {client.visitHistory.map((visit, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-healthcare-100 text-healthcare-700 h-12 w-12 rounded-full flex flex-col items-center justify-center shrink-0">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">{visit.facility}</h4>
                            <p className="text-sm text-muted-foreground">{visit.date}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground">Notes</p>
                        <p className="text-sm mt-1">{visit.notes}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Case Notes</h3>
                <Button variant="outline" size="sm">Add Note</Button>
              </div>
              <div className="border rounded-lg">
                <ScrollArea className="h-[300px] p-4">
                  <div className="space-y-4">
                    {client.notes.concat(client.notes).map((note, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{note.author}</span>
                          <span className="text-sm text-muted-foreground">{note.date}</span>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline">
          <Users className="h-4 w-4 mr-2" />
          Family Portal
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">Edit Record</Button>
          <Button>Care Coordination</Button>
        </div>
      </CardFooter>
    </Card>
  );
};
