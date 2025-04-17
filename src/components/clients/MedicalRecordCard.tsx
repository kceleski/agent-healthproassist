
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  FileText, 
  Heart, 
  Activity, 
  AlertCircle,
  Pill,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export interface MedicalCondition {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
  dateIdentified?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy?: string;
  startDate?: string;
  endDate?: string;
}

export interface MedicalRecordCardProps {
  clientName: string;
  dateOfBirth: string;
  conditions: MedicalCondition[];
  medications: Medication[];
  allergies: string[];
  mobilityStatus?: string;
  cognitiveStatus?: string;
  lastAssessment?: string;
  careNotes?: string;
}

export const MedicalRecordCard = ({
  clientName,
  dateOfBirth,
  conditions,
  medications,
  allergies,
  mobilityStatus,
  cognitiveStatus,
  lastAssessment,
  careNotes
}: MedicalRecordCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showFullRecord, setShowFullRecord] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'moderate':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'severe':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  const calculateAge = (dobString: string) => {
    const dob = new Date(dobString);
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs); 
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <>
      <Card className="w-full shadow-md">
        <CardHeader className="bg-healthcare-50 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-healthcare-800">{clientName}</CardTitle>
              <CardDescription>
                {dateOfBirth} ({calculateAge(dateOfBirth)} years old)
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline" className="bg-healthcare-100/50">
              <Activity className="h-3 w-3 mr-1" />
              Mobility: {mobilityStatus || 'Not specified'}
            </Badge>
            <Badge variant="outline" className="bg-healthcare-100/50">
              <Heart className="h-3 w-3 mr-1" />
              Cognitive: {cognitiveStatus || 'Not specified'}
            </Badge>
            {lastAssessment && (
              <Badge variant="outline" className="bg-healthcare-100/50">
                <Calendar className="h-3 w-3 mr-1" />
                Last Assessment: {lastAssessment}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium flex items-center mb-2">
                <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                Allergies
              </h4>
              <div className="flex flex-wrap gap-1">
                {allergies.length > 0 ? (
                  allergies.map((allergy, i) => (
                    <Badge key={i} variant="outline" className="bg-red-50 text-red-600 border-red-200">
                      {allergy}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No known allergies</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium flex items-center mb-2">
                <Heart className="h-4 w-4 mr-1 text-healthcare-600" />
                Key Conditions
              </h4>
              <div className="flex flex-wrap gap-1">
                {conditions.slice(0, showDetails ? conditions.length : 3).map((condition, i) => (
                  <Badge 
                    key={i} 
                    variant="outline" 
                    className={cn("border", getSeverityColor(condition.severity))}
                  >
                    {condition.name}
                  </Badge>
                ))}
                {!showDetails && conditions.length > 3 && (
                  <Badge variant="outline">+{conditions.length - 3} more</Badge>
                )}
              </div>
            </div>
          </div>

          {showDetails && (
            <div className="mt-4 space-y-4">
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium flex items-center mb-2">
                  <Pill className="h-4 w-4 mr-1 text-healthcare-600" />
                  Medications
                </h4>
                <ScrollArea className="h-[120px]">
                  <div className="space-y-2">
                    {medications.map((med, i) => (
                      <div key={i} className="text-sm p-2 bg-gray-50 rounded-md">
                        <div className="font-medium">{med.name}</div>
                        <div className="text-muted-foreground">{med.dosage}, {med.frequency}</div>
                        {med.prescribedBy && <div className="text-xs text-muted-foreground">Dr. {med.prescribedBy}</div>}
                      </div>
                    ))}
                    {medications.length === 0 && (
                      <div className="text-sm text-muted-foreground">No medications recorded</div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {careNotes && (
                <div>
                  <h4 className="text-sm font-medium flex items-center mb-2">
                    <FileText className="h-4 w-4 mr-1 text-healthcare-600" />
                    Care Notes
                  </h4>
                  <div className="text-sm bg-gray-50 p-3 rounded-md">
                    {careNotes}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-2 flex justify-end border-t">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-healthcare-600"
            onClick={() => setShowFullRecord(true)}
          >
            <FileText className="h-4 w-4 mr-1" />
            Full Record
          </Button>
        </CardFooter>
      </Card>

      {/* Full Record Dialog */}
      <Dialog open={showFullRecord} onOpenChange={setShowFullRecord}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Medical Record: {clientName}</DialogTitle>
            <DialogDescription>
              Complete medical information and history for {clientName} (DOB: {dateOfBirth})
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Date of Birth</h3>
                <p className="text-md">{dateOfBirth} (Age: {calculateAge(dateOfBirth)})</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Assessment</h3>
                <p className="text-md">{lastAssessment || 'Not available'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                <Heart className="h-5 w-5 text-healthcare-600" />
                Medical Conditions
              </h3>
              <div className="bg-muted/20 p-4 rounded-md space-y-3">
                {conditions.map((condition, i) => (
                  <div key={i} className="border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{condition.name}</h4>
                      <Badge className={getSeverityColor(condition.severity)}>
                        {condition.severity.charAt(0).toUpperCase() + condition.severity.slice(1)}
                      </Badge>
                    </div>
                    {condition.dateIdentified && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Identified: {condition.dateIdentified}
                      </p>
                    )}
                    {condition.notes && (
                      <p className="text-sm mt-2">{condition.notes}</p>
                    )}
                  </div>
                ))}
                {conditions.length === 0 && (
                  <p className="text-muted-foreground text-center py-2">No conditions recorded</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Allergies
              </h3>
              <div className="bg-muted/20 p-4 rounded-md">
                {allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {allergies.map((allergy, i) => (
                      <Badge key={i} variant="outline" className="bg-red-50 text-red-600 border-red-200 text-sm px-3 py-1">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-2">No known allergies</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                <Pill className="h-5 w-5 text-healthcare-600" />
                Medications
              </h3>
              <div className="bg-muted/20 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {medications.map((med, i) => (
                    <div key={i} className="border p-3 rounded-md">
                      <h4 className="font-medium">{med.name}</h4>
                      <div className="text-sm space-y-1 mt-1">
                        <p className="text-muted-foreground">Dosage: {med.dosage}</p>
                        <p className="text-muted-foreground">Frequency: {med.frequency}</p>
                        {med.prescribedBy && <p className="text-muted-foreground">Doctor: {med.prescribedBy}</p>}
                        {med.startDate && <p className="text-muted-foreground">Started: {med.startDate}</p>}
                        {med.endDate && <p className="text-muted-foreground">Ends: {med.endDate}</p>}
                      </div>
                    </div>
                  ))}
                  {medications.length === 0 && (
                    <p className="text-muted-foreground text-center py-2 col-span-2">No medications recorded</p>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-healthcare-600" />
                Status Assessments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border p-4 rounded-md">
                  <h4 className="text-healthcare-600 font-medium">Mobility Status</h4>
                  <p className="mt-2">{mobilityStatus || 'Not assessed'}</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h4 className="text-healthcare-600 font-medium">Cognitive Status</h4>
                  <p className="mt-2">{cognitiveStatus || 'Not assessed'}</p>
                </div>
              </div>
            </div>
            
            {careNotes && (
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-healthcare-600" />
                  Care Notes
                </h3>
                <div className="bg-muted/20 p-4 rounded-md">
                  <p className="whitespace-pre-line">{careNotes}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
