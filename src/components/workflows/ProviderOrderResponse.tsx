import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Edit, 
  Clock, 
  AlertCircle,
  User,
  Building,
  FileText
} from 'lucide-react';

interface ProviderOrderResponseProps {
  orderRequest: {
    id: string;
    facilityName: string;
    facilityId: string;
    residentName: string;
    residentId: string;
    orderRequest: string;
    urgencyLevel: 'routine' | 'urgent' | 'emergency';
    timestamp: string;
  };
  onRespond: (response: { action: 'approve' | 'edit' | 'deny'; notes: string; orderId: string }) => Promise<void>;
  onCancel: () => void;
}

export const ProviderOrderResponse: React.FC<ProviderOrderResponseProps> = ({
  orderRequest,
  onRespond,
  onCancel
}) => {
  const [response, setResponse] = useState('');
  const [action, setAction] = useState<'approve' | 'edit' | 'deny' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!action) {
      alert("Please select an action (Approve, Edit, or Deny).");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onRespond({
        action,
        notes: response,
        orderId: orderRequest.id
      });
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get urgency indicator
  const getUrgencyIndicator = () => {
    switch (orderRequest.urgencyLevel) {
      case 'routine':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'urgent':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'emergency':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order Request</h1>
        <div className="flex items-center space-x-2">
          {getUrgencyIndicator()}
          <span className="font-medium capitalize">{orderRequest.urgencyLevel}</span>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-medium">Request Details</h2>
        
        <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-md">
          <Building className="h-5 w-5 text-healthcare-600" />
          <div>
            <p className="font-medium">{orderRequest.facilityName}</p>
            <p className="text-sm text-gray-500">Requesting Facility</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-md">
          <User className="h-5 w-5 text-healthcare-600" />
          <div>
            <p className="font-medium">{orderRequest.residentName}</p>
            <p className="text-sm text-gray-500">Resident</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Request</label>
          <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
            <p className="whitespace-pre-wrap">{orderRequest.orderRequest}</p>
            <p className="text-xs text-gray-500 mt-2">
              Submitted: {formatTime(orderRequest.timestamp)}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Response</label>
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                action === 'approve' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              } transition-colors`}
              onClick={() => setAction('approve')}
            >
              <CheckCircle2 className="h-4 w-4 mr-2 inline-block" />
              Approve
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                action === 'edit' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              } transition-colors`}
              onClick={() => setAction('edit')}
            >
              <Edit className="h-4 w-4 mr-2 inline-block" />
              Edit
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                action === 'deny' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              } transition-colors`}
              onClick={() => setAction('deny')}
            >
              <XCircle className="h-4 w-4 mr-2 inline-block" />
              Deny
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <textarea
            placeholder={
              action === 'approve' ? "Add any additional instructions..." :
              action === 'edit' ? "Specify your modifications to the order..." :
              action === 'deny' ? "Explain why the order is being denied..." :
              "Select an action above first"
            }
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent resize-none"
          />
        </div>
        
        <div className="p-3 border border-blue-200 bg-blue-50 rounded-md">
          <div className="flex items-start">
            <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Documentation Note</p>
              <p className="text-sm text-blue-700">
                A timestamped record of your response will be generated for both your records and the facility's documentation.
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
            disabled={isSubmitting || !action}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Response'}
          </button>
        </div>
      </div>
    </div>
  );
};