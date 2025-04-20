import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  FileText, 
  User,
  Calendar,
  Upload,
  Clock,
  Send
} from 'lucide-react';

interface FacilityReferralHandlingProps {
  referral: {
    id: string;
    patientName: string;
    patientDOB: string;
    referralSource: string;
    referralDate: string;
    needsSummary: string;
    documents: { name: string; url: string; type: string }[];
  };
  onAction: (action: 'proceed' | 'decline' | 'request-info', data: any) => Promise<void>;
  onCancel: () => void;
}

export const FacilityReferralHandling: React.FC<FacilityReferralHandlingProps> = ({
  referral,
  onAction,
  onCancel
}) => {
  const [action, setAction] = useState<'proceed' | 'decline' | 'request-info' | null>(null);
  const [notes, setNotes] = useState('');
  const [missingDocuments, setMissingDocuments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'review' | 'documents' | 'schedule'>('review');

  // Handle document selection
  const toggleDocument = (doc: string) => {
    setMissingDocuments(prev => 
      prev.includes(doc) 
        ? prev.filter(d => d !== doc) 
        : [...prev, doc]
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!action && step === 'review') {
      alert("Please select an action (Proceed, Decline, or Request More Info).");
      return;
    }
    
    if (step === 'review' && action === 'proceed') {
      setStep('documents');
      return;
    }
    
    if (step === 'documents' && missingDocuments.length > 0) {
      setAction('request-info');
    }
    
    if (step === 'documents' && missingDocuments.length === 0) {
      setStep('schedule');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onAction(action!, {
        notes,
        missingDocuments,
        referralId: referral.id
      });
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render review step
  const renderReview = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-medium">Review Referral</h2>
      
      <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-md">
        <User className="h-5 w-5 text-healthcare-600" />
        <div>
          <p className="font-medium">{referral.patientName}</p>
          <p className="text-sm text-gray-500">
            DOB: {referral.patientDOB} • Referred by: {referral.referralSource}
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Needs Summary</label>
        <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
          <pre className="text-sm whitespace-pre-wrap font-sans">{referral.needsSummary}</pre>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Available Documents</label>
        <div className="p-3 border border-gray-300 rounded-md">
          {referral.documents.length > 0 ? (
            <ul className="space-y-2">
              {referral.documents.map((doc, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-healthcare-600" />
                    <span className="text-sm">{doc.name}</span>
                    <span className="text-xs text-gray-500 ml-2">({doc.type})</span>
                  </div>
                  <a 
                    href={doc.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-1 border border-gray-300 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors"
                  >
                    View
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No documents available</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Your Decision</label>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              action === 'proceed' 
                ? 'bg-green-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            } transition-colors`}
            onClick={() => setAction('proceed')}
          >
            <CheckCircle2 className="h-4 w-4 mr-2 inline-block" />
            Proceed with Referral
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              action === 'request-info' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            } transition-colors`}
            onClick={() => setAction('request-info')}
          >
            <HelpCircle className="h-4 w-4 mr-2 inline-block" />
            Request More Info
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              action === 'decline' 
                ? 'bg-red-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            } transition-colors`}
            onClick={() => setAction('decline')}
          >
            <XCircle className="h-4 w-4 mr-2 inline-block" />
            Decline Referral
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Notes</label>
        <textarea
          placeholder={
            action === 'proceed' ? "Add any notes about proceeding with this referral..." :
            action === 'request-info' ? "Specify what additional information you need..." :
            action === 'decline' ? "Please explain why this referral is being declined..." :
            "Select an action above first"
          }
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent resize-none"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <button 
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          className="px-4 py-2 bg-healthcare-600 text-white rounded-md hover:bg-healthcare-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={isSubmitting || !action}
        >
          {isSubmitting ? 'Submitting...' : action === 'proceed' ? 'Continue to Documents' : 'Submit Response'}
        </button>
      </div>
    </div>
  );

  // Render documents step
  const renderDocuments = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-medium">Required Documents</h2>
      
      <p className="text-sm text-gray-500">
        Please indicate which documents are still needed from the patient/family:
      </p>
      
      <div className="space-y-2">
        {['Medication List', 'DNR/POLST Form', 'Power of Attorney', 'Vaccination Records', 'TB Test Results', 'Insurance Card', 'ID/Driver\'s License'].map(doc => (
          <div key={doc} className="flex items-center space-x-2 p-2 border border-gray-300 rounded-md">
            <input
              type="checkbox"
              id={`doc-${doc}`}
              checked={missingDocuments.includes(doc)}
              onChange={() => toggleDocument(doc)}
              className="h-4 w-4 text-healthcare-600 focus:ring-healthcare-600 border-gray-300 rounded"
            />
            <label htmlFor={`doc-${doc}`} className="text-sm font-medium flex-grow">
              {doc}
            </label>
            <button className="px-2 py-1 border border-gray-300 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors flex items-center">
              <Upload className="h-3 w-3 mr-1" />
              <span>Upload</span>
            </button>
          </div>
        ))}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Additional Notes</label>
        <textarea
          placeholder="Any specific requirements for these documents..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent resize-none"
        />
      </div>
      
      <div className="flex justify-between">
        <button 
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          onClick={() => setStep('review')}
        >
          Back
        </button>
        <button 
          className="px-4 py-2 bg-healthcare-600 text-white rounded-md hover:bg-healthcare-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : missingDocuments.length > 0 ? 'Request Documents' : 'Continue to Scheduling'}
        </button>
      </div>
    </div>
  );

  // Render schedule step
  const renderSchedule = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-medium">Schedule Move-In</h2>
      
      <div className="p-3 border border-green-200 bg-green-50 rounded-md">
        <div className="flex items-start">
          <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800">Referral Ready for Finalization</p>
            <p className="text-sm text-green-700">
              All required information and documents have been received. You can now schedule the move-in process.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Tentative Move-In Date</label>
        <input
          type="date"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Assigned Room/Unit</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
          placeholder="Room or unit number"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Special Instructions</label>
        <textarea
          placeholder="Any special instructions for move-in day..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent resize-none"
        />
      </div>
      
      <div className="flex justify-between">
        <button 
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          onClick={() => setStep('documents')}
        >
          Back
        </button>
        <button 
          className="px-4 py-2 bg-healthcare-600 text-white rounded-md hover:bg-healthcare-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          <Clock className="h-4 w-4 mr-2 inline-block" />
          {isSubmitting ? 'Finalizing...' : 'Finalize Placement'}
        </button>
      </div>
    </div>
  );

  // Render the appropriate step
  switch (step) {
    case 'review':
      return renderReview();
    case 'documents':
      return renderDocuments();
    case 'schedule':
      return renderSchedule();
    default:
      return renderReview();
  }
};