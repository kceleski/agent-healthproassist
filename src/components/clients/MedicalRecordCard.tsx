
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
        <Button variant="outline" size="sm" className="text-healthcare-600">
          <FileText className="h-4 w-4 mr-1" />
          Full Record
        </Button>
      </CardFooter>
    </Card>
  );
};
