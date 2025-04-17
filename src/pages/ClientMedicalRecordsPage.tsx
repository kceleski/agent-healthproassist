
import { useState } from 'react';
import { MedicalRecordsList } from '@/components/clients/MedicalRecordsList';
import { MedicalRecordCardProps } from '@/components/clients/MedicalRecordCard';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';

// Demo data - in a real application this would come from an API
const demoClients: Omit<MedicalRecordCardProps, 'key'>[] = [
  {
    clientName: "Eleanor Johnson",
    dateOfBirth: "1945-05-10",
    conditions: [
      { name: "Hypertension", severity: "moderate", dateIdentified: "2018-03-15" },
      { name: "Type 2 Diabetes", severity: "moderate", dateIdentified: "2017-11-22" },
      { name: "Osteoarthritis", severity: "mild", dateIdentified: "2019-07-08" },
      { name: "Early Dementia", severity: "mild", dateIdentified: "2022-01-15" }
    ],
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily", prescribedBy: "Sarah Matthews" },
      { name: "Acetaminophen", dosage: "500mg", frequency: "As needed for pain" }
    ],
    allergies: ["Penicillin", "Sulfa drugs"],
    mobilityStatus: "Ambulatory with walker",
    cognitiveStatus: "Mild cognitive impairment",
    lastAssessment: "2023-01-15",
    careNotes: "Eleanor prefers morning care routines. She enjoys reading and classical music which helps with her anxiety. Family visits on weekends."
  },
  {
    clientName: "Robert Wilson",
    dateOfBirth: "1942-12-03",
    conditions: [
      { name: "Parkinson's Disease", severity: "moderate", dateIdentified: "2015-06-22" },
      { name: "Coronary Artery Disease", severity: "severe", dateIdentified: "2012-09-30" },
      { name: "Depression", severity: "mild", dateIdentified: "2018-11-14" }
    ],
    medications: [
      { name: "Levodopa", dosage: "100mg", frequency: "Three times daily", prescribedBy: "James Wilson" },
      { name: "Aspirin", dosage: "81mg", frequency: "Once daily" },
      { name: "Sertraline", dosage: "50mg", frequency: "Once daily", prescribedBy: "Patricia Rodriguez" }
    ],
    allergies: [],
    mobilityStatus: "Limited mobility, wheelchair",
    cognitiveStatus: "Generally alert and oriented",
    lastAssessment: "2023-03-20",
    careNotes: "Robert requires assistance with dressing and bathing. He enjoys watching sports on TV and playing chess. Speech therapy on Tuesdays."
  },
  {
    clientName: "Margaret Chen",
    dateOfBirth: "1938-09-17",
    conditions: [
      { name: "Macular Degeneration", severity: "severe", dateIdentified: "2016-04-11" },
      { name: "Hypothyroidism", severity: "mild", dateIdentified: "2010-08-23" },
      { name: "Osteoporosis", severity: "moderate", dateIdentified: "2017-12-05" }
    ],
    medications: [
      { name: "Levothyroxine", dosage: "75mcg", frequency: "Once daily in the morning", prescribedBy: "David Kim" },
      { name: "Calcium + Vitamin D", dosage: "500mg/800IU", frequency: "Twice daily with meals" },
      { name: "Alendronate", dosage: "70mg", frequency: "Once weekly" }
    ],
    allergies: ["Shellfish", "Iodine contrast"],
    mobilityStatus: "Ambulatory with cane",
    cognitiveStatus: "Fully alert and oriented",
    lastAssessment: "2023-02-28"
  },
  {
    clientName: "Thomas Garcia",
    dateOfBirth: "1940-07-22",
    conditions: [
      { name: "COPD", severity: "severe", dateIdentified: "2014-02-18" },
      { name: "Atrial Fibrillation", severity: "moderate", dateIdentified: "2016-11-30" },
      { name: "Chronic Kidney Disease", severity: "moderate", dateIdentified: "2019-05-17" }
    ],
    medications: [
      { name: "Albuterol", dosage: "90mcg", frequency: "2 puffs every 6 hours as needed" },
      { name: "Warfarin", dosage: "5mg", frequency: "Once daily", prescribedBy: "Linda Thompson" },
      { name: "Furosemide", dosage: "40mg", frequency: "Once daily in the morning" }
    ],
    allergies: ["Aspirin"],
    mobilityStatus: "Limited by dyspnea, needs frequent rest",
    cognitiveStatus: "Alert and oriented",
    lastAssessment: "2023-04-05",
    careNotes: "Thomas uses oxygen therapy at night. He prefers to be positioned upright when in bed. Monitor fluid intake and output."
  }
];

const ClientMedicalRecordsPage = () => {
  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-healthcare-800">Client Medical Records</h1>
          <p className="text-muted-foreground">Manage and review detailed client medical information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      <MedicalRecordsList clients={demoClients} />
    </div>
  );
};

export default ClientMedicalRecordsPage;
