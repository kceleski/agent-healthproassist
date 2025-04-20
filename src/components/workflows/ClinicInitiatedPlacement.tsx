import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Send, 
  User, 
  Clipboard, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { generateNeedsSummary } from '../../services/aiService';

interface ClinicInitiatedPlacementProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export const ClinicInitiatedPlacement: React.FC<ClinicInitiatedPlacementProps> = ({
  onComplete,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsSummary, setNeedsSummary] = useState('');
  const [formData, setFormData] = useState({
    patientName: '',
    patientDOB: '',
    patientGender: '',
    patientPhone: '',
    patientEmail: '',
    adls: {
      bathing: false,
      dressing: false,
      toileting: false,
      transferring: false,
      continence: false,
      feeding: false
    },
    cognitiveStatus: '',
    mobilityStatus: '',
    medications: '',
    diagnoses: '',
    equipmentNeeds: '',
    insuranceType: '',
    insuranceNumber: '',
    notes: ''
  });

  // Update form data
  const updateFormData = (key: string, value: any) => {
    setFormData(prev => {
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof typeof prev],
            [child]: value
          }
        };
      }
      return { ...prev, [key]: value };
    });
  };

  // Generate needs summary with AI
  const handleGenerateNeedsSummary = async () => {
    setIsGenerating(true);
    
    try {
      const summary = await generateNeedsSummary(formData);
      setNeedsSummary(summary);
    } catch (error) {
      console.error('Error generating needs summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Submit referral
  const handleSubmit = async () => {
    if (!formData.patientName || !formData.patientDOB) {
      alert("Please provide at least the patient's name and date of birth.");
      return;
    }
    
    if (!needsSummary) {
      alert("Please generate a needs summary before submitting.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This would be an API call in a real implementation
      // For demo purposes, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onComplete({
        ...formData,
        needsSummary
      });
    } catch (error) {
      console.error('Error submitting referral:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create Patient Placement Referral</h1>
      </div>
      
      <div>
        <div className="flex border-b mb-6">
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'basic' ? 'border-b-2 border-healthcare-600 text-healthcare-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('basic')}
          >
            Patient Info
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'medical' ? 'border-b-2 border-healthcare-600 text-healthcare-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('medical')}
          >
            Medical Needs
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'insurance' ? 'border-b-2 border-healthcare-600 text-healthcare-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('insurance')}
          >
            Insurance
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'summary' ? 'border-b-2 border-healthcare-600 text-healthcare-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
        </div>
        
        {activeTab === 'basic' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-medium">Patient Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Patient Name</label>
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
                <label className="text-sm font-medium">Gender</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
                  value={formData.patientGender}
                  onChange={(e) => updateFormData('patientGender', e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
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
            
            <div className="flex justify-end">
              <button 
                className="px-4 py-2 bg-healthcare-600 text-white rounded-md hover:bg-healthcare-700 transition-colors"
                onClick={() => setActiveTab('medical')}
              >
                Next: Medical Needs
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'medical' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-medium">Activities of Daily Living (ADLs)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(formData.adls).map(adl => (
                  <div key={adl} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`adl-${adl}`}
                      checked={formData.adls[adl as keyof typeof formData.adls]}
                      onChange={(e) => 
                        updateFormData(`adls.${adl}`, e.target.checked)
                      }
                      className="h-4 w-4 text-healthcare-600 focus:ring-healthcare-600 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`adl-${adl}`}
                      className="text-sm font-medium"
                    >
                      Needs assistance with {adl.charAt(0).toUpperCase() + adl.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-medium">Medical Status</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Cognitive Status</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
                  value={formData.cognitiveStatus}
                  onChange={(e) => updateFormData('cognitiveStatus', e.target.value)}
                >
                  <option value="">Select cognitive status</option>
                  <option value="No impairment">No impairment</option>
                  <option value="Mild impairment">Mild impairment</option>
                  <option value="Moderate impairment">Moderate impairment</option>
                  <option value="Severe impairment">Severe impairment</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Mobility Status</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
                  value={formData.mobilityStatus}
                  onChange={(e) => updateFormData('mobilityStatus', e.target.value)}
                >
                  <option value="">Select mobility status</option>
                  <option value="Independent">Independent</option>
                  <option value="Cane">Uses cane</option>
                  <option value="Walker">Uses walker</option>
                  <option value="Wheelchair">Uses wheelchair</option>
                  <option value="Bed-bound">Bed-bound</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Medications</label>
                <textarea
                  placeholder="List current medications"
                  value={formData.medications}
                  onChange={(e) => updateFormData('medications', e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Diagnoses</label>
                <textarea
                  placeholder="List relevant diagnoses"
                  value={formData.diagnoses}
                  onChange={(e) => updateFormData('diagnoses', e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Equipment Needs</label>
                <textarea
                  placeholder="List any special equipment needs"
                  value={formData.equipmentNeeds}
                  onChange={(e) => updateFormData('equipmentNeeds', e.target.value)}
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
                />
              </div>
              
              <div className="flex justify-between">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveTab('basic')}
                >
                  Back
                </button>
                <button 
                  className="px-4 py-2 bg-healthcare-600 text-white rounded-md hover:bg-healthcare-700 transition-colors"
                  onClick={() => setActiveTab('insurance')}
                >
                  Next: Insurance
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'insurance' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-medium">Insurance Information</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Insurance Type</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
                value={formData.insuranceType}
                onChange={(e) => updateFormData('insuranceType', e.target.value)}
              >
                <option value="">Select insurance type</option>
                <option value="Medicare">Medicare</option>
                <option value="Medicaid">Medicaid</option>
                <option value="Private">Private Insurance</option>
                <option value="VA">VA Benefits</option>
                <option value="Self-pay">Self-pay</option>
                <option value="Long-term Care">Long-term Care Insurance</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Insurance ID/Policy Number</label>
              <input
                type="text"
                placeholder="Insurance ID or policy number"
                value={formData.insuranceNumber}
                onChange={(e) => updateFormData('insuranceNumber', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Notes</label>
              <textarea
                placeholder="Any additional information or special considerations"
                value={formData.notes}
                onChange={(e) => updateFormData('notes', e.target.value)}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
              />
            </div>
            
            <div className="flex justify-between">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                onClick={() => setActiveTab('medical')}
              >
                Back
              </button>
              <button 
                className="px-4 py-2 bg-healthcare-600 text-white rounded-md hover:bg-healthcare-700 transition-colors"
                onClick={() => setActiveTab('summary')}
              >
                Next: Summary
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'summary' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-medium flex items-center">
              <Clipboard className="h-5 w-5 mr-2" />
              Referral Summary
            </h2>
            
            <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-md">
              <User className="h-5 w-5 text-healthcare-600" />
              <div>
                <p className="font-medium">{formData.patientName || 'Patient Name'}</p>
                <p className="text-sm text-gray-500">
                  {formData.patientDOB ? `DOB: ${formData.patientDOB}` : 'Date of Birth'} 
                  {formData.patientGender ? ` • ${formData.patientGender}` : ''}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">AI-Generated Needs Summary</label>
                <button 
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center"
                  onClick={handleGenerateNeedsSummary}
                  disabled={isGenerating}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating...' : needsSummary ? 'Regenerate' : 'Generate Summary'}
                </button>
              </div>
              
              {isGenerating ? (
                <div className="h-40 border border-gray-300 rounded-md p-3 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healthcare-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Analyzing patient data...</p>
                  </div>
                </div>
              ) : needsSummary ? (
                <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
                  <pre className="text-sm whitespace-pre-wrap font-sans">{needsSummary}</pre>
                </div>
              ) : (
                <div className="h-40 border border-gray-300 rounded-md p-3 flex items-center justify-center">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Click "Generate Summary" to create an AI-powered needs assessment
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Next Steps</label>
              <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
                <p className="text-sm">
                  After submitting this referral:
                </p>
                <ol className="text-sm mt-2 space-y-1 list-decimal list-inside">
                  <li>A secure invite will be sent to the patient/family</li>
                  <li>They will complete personal preferences (location, budget, amenities)</li>
                  <li>They can choose to self-navigate or select a placement specialist</li>
                  <li>You'll receive updates on the referral status</li>
                </ol>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                onClick={() => setActiveTab('insurance')}
              >
                Back
              </button>
              <div className="space-x-2">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-healthcare-600 text-white rounded-md hover:bg-healthcare-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !needsSummary}
                >
                  <Send className="h-4 w-4 mr-2 inline-block" />
                  {isSubmitting ? 'Submitting...' : 'Submit Referral'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};