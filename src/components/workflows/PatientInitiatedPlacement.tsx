import React, { useState } from 'react';
import { 
  User, 
  FileText, 
  Send, 
  Calendar, 
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface PatientInitiatedPlacementProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export const PatientInitiatedPlacement: React.FC<PatientInitiatedPlacementProps> = ({
  onComplete,
  onCancel
}) => {
  const [step, setStep] = useState<'intro' | 'choice' | 'self' | 'provider' | 'waiting'>('intro');
  const [formData, setFormData] = useState({
    patientName: '',
    patientDOB: '',
    patientPhone: '',
    patientEmail: '',
    providerName: '',
    providerClinic: '',
    providerPhone: '',
    providerEmail: '',
    preferredContact: 'email',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data
  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (step === 'self' && (!formData.patientName || !formData.patientDOB)) {
      alert("Please provide at least your name and date of birth.");
      return;
    }
    
    if (step === 'provider' && (!formData.providerName || !formData.providerClinic)) {
      alert("Please provide at least your provider's name and clinic.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This would be an API call in a real implementation
      // For demo purposes, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (step === 'provider') {
        setStep('waiting');
      } else {
        onComplete({
          ...formData,
          completionMethod: step
        });
      }
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render intro step
  const renderIntro = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-medium">Senior Living Placement Request</h2>
      
      <p>
        Welcome to the senior living placement process. We're here to help you find the right care facility for yourself or your loved one.
      </p>
      
      <div className="p-3 border border-blue-200 bg-blue-50 rounded-md">
        <div className="flex items-start">
          <HelpCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">How This Works</p>
            <p className="text-sm text-blue-700">
              This process requires both medical information and personal preferences. In the next step, you'll choose how to provide the medical information.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          className="px-4 py-2 bg-healthcare-600 text-white rounded-md hover:bg-healthcare-700 transition-colors"
          onClick={() => setStep('choice')}
        >
          Get Started
        </button>
      </div>
    </div>
  );

  // Render choice step
  const renderChoice = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-medium">How Would You Like to Proceed?</h2>
      
      <p className="text-sm text-gray-500">
        We need medical information to ensure proper placement. Please choose how you'd like to provide this information:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-healthcare-600 transition-colors"
          onClick={() => setStep('self')}
        >
          <div className="flex flex-col items-center text-center p-4">
            <User className="h-12 w-12 text-healthcare-600 mb-4" />
            <h3 className="font-medium mb-2">I'll Complete the Form Myself</h3>
            <p className="text-sm text-gray-500">
              You'll answer questions about medical needs, medications, and care requirements.
            </p>
          </div>
        </div>
        
        <div 
          className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-healthcare-600 transition-colors"
          onClick={() => setStep('provider')}
        >
          <div className="flex flex-col items-center text-center p-4">
            <FileText className="h-12 w-12 text-healthcare-600 mb-4" />
            <h3 className="font-medium mb-2">Send Form to My Provider</h3>
            <p className="text-sm text-gray-500">
              We'll send a secure form to your healthcare provider to complete.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button 
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          onClick={() => setStep('intro')}
        >
          Back
        </button>
      </div>
    </div>
  );

  // Render self-completion step
  const renderSelfCompletion = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-medium">Complete Medical Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Name</label>
          <input
            type="text"
            placeholder="Full name"
            value={formData.patientName}
            onChange={(e) => updateFormData('patientName', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Date of Birth</label>
          <input
            type="date"
            value={formData.patientDOB}
            onChange={(e) => updateFormData('patientDOB', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <input
            type="tel"
            placeholder="Phone number"
            value={formData.patientPhone}
            onChange={(e) => updateFormData('patientPhone', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Email Address</label>
          <input
            type="email"
            placeholder="Email address"
            value={formData.patientEmail}
            onChange={(e) => updateFormData('patientEmail', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* This would be expanded with medical questions in a real implementation */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Additional Notes</label>
        <textarea
          placeholder="Any additional information or special considerations"
          value={formData.notes}
          onChange={(e) => updateFormData('notes', e.target.value)}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent resize-none"
        />
      </div>
      
      <div className="flex justify-between">
        <button 
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          onClick={() => setStep('choice')}
        >
          Back
        </button>
        <button 
          className="px-4 py-2 bg-healthcare-600 text-white rounded-md hover:bg-healthcare-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          <Send className="h-4 w-4 mr-2 inline-block" />
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </div>
  );

  // Render provider form step
  const renderProviderForm = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-medium">Provider Information</h2>
      
      <div className="p-3 border border-blue-200 bg-blue-50 rounded-md">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">Important Note</p>
            <p className="text-sm text-blue-700">
              We'll send a secure form to your healthcare provider. They may need to schedule an appointment with you before completing the form.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Name</label>
          <input
            type="text"
            placeholder="Full name"
            value={formData.patientName}
            onChange={(e) => updateFormData('patientName', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Date of Birth</label>
          <input
            type="date"
            value={formData.patientDOB}
            onChange={(e) => updateFormData('patientDOB', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Phone Number</label>
          <input
            type="tel"
            placeholder="Phone number"
            value={formData.patientPhone}
            onChange={(e) => updateFormData('patientPhone', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Email Address</label>
          <input
            type="email"
            placeholder="Email address"
            value={formData.patientEmail}
            onChange={(e) => updateFormData('patientEmail', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Provider's Name</label>
        <input
          type="text"
          placeholder="Provider's full name"
          value={formData.providerName}
          onChange={(e) => updateFormData('providerName', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Clinic/Practice Name</label>
        <input
          type="text"
          placeholder="Clinic or practice name"
          value={formData.providerClinic}
          onChange={(e) => updateFormData('providerClinic', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Provider's Phone</label>
          <input
            type="tel"
            placeholder="Provider's phone number"
            value={formData.providerPhone}
            onChange={(e) => updateFormData('providerPhone', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Provider's Email (if known)</label>
          <input
            type="email"
            placeholder="Provider's email address"
            value={formData.providerEmail}
            onChange={(e) => updateFormData('providerEmail', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Preferred Contact Method</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
          value={formData.preferredContact}
          onChange={(e) => updateFormData('preferredContact', e.target.value)}
        >
          <option value="email">Email</option>
          <option value="phone">Phone</option>
        </select>
      </div>
      
      <div className="flex justify-between">
        <button 
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          onClick={() => setStep('choice')}
        >
          Back
        </button>
        <button 
          className="px-4 py-2 bg-healthcare-600 text-white rounded-md hover:bg-healthcare-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          <Send className="h-4 w-4 mr-2 inline-block" />
          {isSubmitting ? 'Submitting...' : 'Send to Provider'}
        </button>
      </div>
    </div>
  );

  // Render waiting step
  const renderWaiting = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-medium">Request Sent to Provider</h2>
      
      <div className="flex flex-col items-center text-center p-6">
        <CheckCircle2 className="h-16 w-16 text-green-600 mb-4" />
        <h3 className="text-xl font-medium mb-2">Form Sent Successfully</h3>
        <p className="text-gray-500 mb-4">
          We've sent a secure form to {formData.providerName} at {formData.providerClinic}.
        </p>
        
        <div className="w-full max-w-md p-4 border border-gray-200 rounded-md bg-gray-50 mt-4">
          <h4 className="font-medium mb-2">What happens next?</h4>
          <ul className="text-sm space-y-2 text-left">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>Your provider will receive the form to complete with your medical information.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>They may contact you to schedule an appointment if needed.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>Once they submit the form, you'll be notified to continue the process.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4.</span>
              <span>You'll then complete your preferences for location, budget, and amenities.</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button 
          className="px-4 py-2 bg-healthcare-600 text-white rounded-md hover:bg-healthcare-700 transition-colors"
          onClick={() => onComplete({
            ...formData,
            completionMethod: 'provider'
          })}
        >
          <Calendar className="h-4 w-4 mr-2 inline-block" />
          Continue to Dashboard
        </button>
      </div>
    </div>
  );

  // Render the appropriate step
  switch (step) {
    case 'intro':
      return renderIntro();
    case 'choice':
      return renderChoice();
    case 'self':
      return renderSelfCompletion();
    case 'provider':
      return renderProviderForm();
    case 'waiting':
      return renderWaiting();
    default:
      return renderIntro();
  }
};