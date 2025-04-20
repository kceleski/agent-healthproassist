import React, { useState } from 'react';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Edit, 
  Send,
  User,
  Building
} from 'lucide-react';

interface UrgentOrderRoutingProps {
  facilityName: string;
  facilityId: string;
  residentName: string;
  residentId: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const UrgentOrderRouting: React.FC<UrgentOrderRoutingProps> = ({
  facilityName,
  facilityId,
  residentName,
  residentId,
  onSubmit,
  onCancel
}) => {
  const [orderRequest, setOrderRequest] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<'routine' | 'urgent' | 'emergency'>('urgent');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!orderRequest.trim()) {
      alert("Please provide details about the order request.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        facilityId,
        facilityName,
        residentId,
        residentName,
        orderRequest,
        urgencyLevel,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error submitting order request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Urgent Order Request</h1>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-medium">Request Details</h2>
        
        <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-md">
          <Building className="h-5 w-5 text-healthcare-600" />
          <div>
            <p className="font-medium">{facilityName}</p>
            <p className="text-sm text-gray-500">Requesting Facility</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-md">
          <User className="h-5 w-5 text-healthcare-600" />
          <div>
            <p className="font-medium">{residentName}</p>
            <p className="text-sm text-gray-500">Resident</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Urgency Level</label>
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                urgencyLevel === 'routine' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              } transition-colors`}
              onClick={() => setUrgencyLevel('routine')}
            >
              <Clock className="h-4 w-4 mr-2 inline-block" />
              Routine
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                urgencyLevel === 'urgent' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              } transition-colors`}
              onClick={() => setUrgencyLevel('urgent')}
            >
              <AlertCircle className="h-4 w-4 mr-2 inline-block" />
              Urgent
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                urgencyLevel === 'emergency' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              } transition-colors`}
              onClick={() => setUrgencyLevel('emergency')}
            >
              <AlertCircle className="h-4 w-4 mr-2 inline-block" />
              Emergency
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Order Request</label>
          <textarea
            placeholder="Describe the situation and the specific order needed (e.g., 'Resident has fever, confusion, and strong-smelling urine. Requesting UTI panel.')"
            value={orderRequest}
            onChange={(e) => setOrderRequest(e.target.value)}
            rows={5}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500">
            Be specific about symptoms, observations, and what order you're requesting.
          </p>
        </div>
        
        <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Important Note</p>
              <p className="text-sm text-yellow-700">
                This request will be routed to the assigned provider. If no response is received within the expected timeframe based on urgency level, it will be escalated to the on-call provider.
              </p>
            </div>
          </div>
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
            disabled={isSubmitting}
          >
            <Send className="h-4 w-4 mr-2 inline-block" />
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  );
};