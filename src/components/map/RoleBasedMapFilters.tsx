import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, X, Search, Stethoscope, User, Building } from 'lucide-react';

interface RoleBasedMapFiltersProps {
  onFilterChange: (filters: any) => void;
  userRole: 'provider' | 'specialist' | 'patient' | 'facility';
  clientData?: any; // Optional client data for pre-filling filters
}

export const RoleBasedMapFilters: React.FC<RoleBasedMapFiltersProps> = ({ 
  onFilterChange, 
  userRole,
  clientData
}) => {
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: '',
    facilityType: [] as string[],
    careLevel: [] as string[],
    priceRange: null as string | null,
    rating: 0,
    availability: false,
    insurance: [] as string[],
    medicalNeeds: [] as string[],
    distance: 25, // miles
    amenities: [] as string[]
  });

  // Facility type options
  const facilityTypes = [
    'Assisted Living',
    'Memory Care',
    'Skilled Nursing',
    'Independent Living'
  ];

  // Care level options
  const careLevels = [
    'Low Care',
    'Medium Care',
    'High Care',
    'Specialized Care'
  ];

  // Insurance options
  const insuranceOptions = [
    'Medicare',
    'Medicaid',
    'Private Insurance',
    'Long-term Care Insurance',
    'VA Benefits',
    'Self-pay'
  ];

  // Medical needs options
  const medicalNeedsOptions = [
    'Medication Management',
    'Wound Care',
    'Diabetes Management',
    'Mobility Assistance',
    'Cognitive Support',
    'Respiratory Care',
    'Feeding Assistance'
  ];

  // Amenities options
  const amenitiesOptions = [
    'Private Rooms',
    'Shared Rooms',
    'Dining Services',
    'Transportation',
    'Activities Program',
    'Fitness Center',
    'Beauty Salon',
    'Outdoor Spaces',
    'Pet Friendly'
  ];

  // Pre-fill filters if client data is provided
  useEffect(() => {
    if (clientData) {
      const updatedFilters = { ...filters };
      
      if (clientData.careLevel) {
        updatedFilters.careLevel = Array.isArray(clientData.careLevel) 
          ? clientData.careLevel 
          : [clientData.careLevel];
      }
      
      if (clientData.medicalNeeds) {
        updatedFilters.medicalNeeds = clientData.medicalNeeds;
      }
      
      if (clientData.insurance) {
        updatedFilters.insurance = Array.isArray(clientData.insurance)
          ? clientData.insurance
          : [clientData.insurance];
      }
      
      if (clientData.budget) {
        // Convert budget to price range
        const budget = Number(clientData.budget);
        if (budget < 3000) updatedFilters.priceRange = '$';
        else if (budget < 5000) updatedFilters.priceRange = '$$';
        else if (budget < 7000) updatedFilters.priceRange = '$$$';
        else updatedFilters.priceRange = '$$$$';
      }
      
      setFilters(updatedFilters);
    }
  }, [clientData]);

  // Update filters
  const updateFilter = (key: string, value: any) => {
    setFilters(prev => {
      const updated = { ...prev, [key]: value };
      onFilterChange(updated);
      return updated;
    });
  };

  // Toggle array-based filters (facility type, care level, etc.)
  const toggleArrayFilter = (key: string, value: string) => {
    setFilters(prev => {
      const currentValues = prev[key as keyof typeof prev] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      const updated = { ...prev, [key]: newValues };
      onFilterChange(updated);
      return updated;
    });
  };

  // Reset filters
  const resetFilters = () => {
    const defaultFilters = {
      searchTerm: '',
      facilityType: [],
      careLevel: [],
      priceRange: null,
      rating: 0,
      availability: false,
      insurance: [],
      medicalNeeds: [],
      distance: 25,
      amenities: []
    };
    
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  // Determine which filter tabs to show based on user role
  const renderFilterTabs = () => {
    switch (userRole) {
      case 'provider':
        return (
          <div>
            <div className="flex border-b mb-4">
              <button 
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'basic' ? 'border-b-2 border-healthcare-600 text-healthcare-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('basic')}
              >
                Basic
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'medical' ? 'border-b-2 border-healthcare-600 text-healthcare-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('medical')}
              >
                Medical
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'insurance' ? 'border-b-2 border-healthcare-600 text-healthcare-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('insurance')}
              >
                Insurance
              </button>
            </div>
            
            {activeTab === 'basic' && renderBasicFilters()}
            {activeTab === 'medical' && renderMedicalFilters()}
            {activeTab === 'insurance' && renderInsuranceFilters()}
          </div>
        );
        
      case 'patient':
        return (
          <div>
            <div className="flex border-b mb-4">
              <button 
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'basic' ? 'border-b-2 border-healthcare-600 text-healthcare-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('basic')}
              >
                Location
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'budget' ? 'border-b-2 border-healthcare-600 text-healthcare-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('budget')}
              >
                Budget
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'amenities' ? 'border-b-2 border-healthcare-600 text-healthcare-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('amenities')}
              >
                Amenities
              </button>
            </div>
            
            {activeTab === 'basic' && renderBasicFilters()}
            {activeTab === 'budget' && renderBudgetFilters()}
            {activeTab === 'amenities' && renderAmenityFilters()}
          </div>
        );
        
      case 'specialist':
        return (
          <div>
            <div className="flex border-b mb-4 flex-wrap">
              <button 
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'basic' ? 'border-b-2 border-healthcare-600 text-healthcare-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('basic')}
              >
                Basic
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'medical' ? 'border-b-2 border-healthcare-600 text-healthcare-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('medical')}
              >
                Medical
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'insurance' ? 'border-b-2 border-healthcare-600 text-healthcare-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('insurance')}
              >
                Insurance
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'amenities' ? 'border-b-2 border-healthcare-600 text-healthcare-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('amenities')}
              >
                Amenities
              </button>
            </div>
            
            {activeTab === 'basic' && renderBasicFilters()}
            {activeTab === 'medical' && renderMedicalFilters()}
            {activeTab === 'insurance' && renderInsuranceFilters()}
            {activeTab === 'amenities' && renderAmenityFilters()}
          </div>
        );
        
      case 'facility':
        return (
          <div>
            <div className="flex border-b mb-4">
              <button 
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'basic' ? 'border-b-2 border-healthcare-600 text-healthcare-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('basic')}
              >
                Basic
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'referrals' ? 'border-b-2 border-healthcare-600 text-healthcare-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('referrals')}
              >
                Referrals
              </button>
            </div>
            
            {activeTab === 'basic' && renderBasicFilters()}
            {activeTab === 'referrals' && renderReferralFilters()}
          </div>
        );
        
      default:
        return renderBasicFilters();
    }
  };

  // Basic filters (location, facility type)
  const renderBasicFilters = () => (
    <>
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search facilities..."
          value={filters.searchTerm}
          onChange={(e) => updateFilter('searchTerm', e.target.value)}
          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-healthcare-600 focus:border-transparent"
        />
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Facility Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {facilityTypes.map(type => (
            <div key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`type-${type}`}
                checked={filters.facilityType.includes(type)}
                onChange={() => toggleArrayFilter('facilityType', type)}
                className="h-4 w-4 text-healthcare-600 focus:ring-healthcare-600 border-gray-300 rounded"
              />
              <label
                htmlFor={`type-${type}`}
                className="text-sm leading-none"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Distance</h3>
        <div className="space-y-2">
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={filters.distance}
            onChange={(e) => updateFilter('distance', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>5 miles</span>
            <span>{filters.distance} miles</span>
            <span>100 miles</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          id="availability"
          checked={filters.availability}
          onChange={(e) => updateFilter('availability', e.target.checked)}
          className="h-4 w-4 text-healthcare-600 focus:ring-healthcare-600 border-gray-300 rounded"
        />
        <label
          htmlFor="availability"
          className="text-sm font-medium"
        >
          Show only facilities with availability
        </label>
      </div>
    </>
  );

  // Medical filters (care level, medical needs)
  const renderMedicalFilters = () => (
    <>
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Care Level</h3>
        <div className="grid grid-cols-2 gap-2">
          {careLevels.map(level => (
            <div key={level} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`level-${level}`}
                checked={filters.careLevel.includes(level)}
                onChange={() => toggleArrayFilter('careLevel', level)}
                className="h-4 w-4 text-healthcare-600 focus:ring-healthcare-600 border-gray-300 rounded"
              />
              <label
                htmlFor={`level-${level}`}
                className="text-sm leading-none"
              >
                {level}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Medical Needs</h3>
        <div className="grid grid-cols-1 gap-2">
          {medicalNeedsOptions.map(need => (
            <div key={need} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`need-${need}`}
                checked={filters.medicalNeeds.includes(need)}
                onChange={() => toggleArrayFilter('medicalNeeds', need)}
                className="h-4 w-4 text-healthcare-600 focus:ring-healthcare-600 border-gray-300 rounded"
              />
              <label
                htmlFor={`need-${need}`}
                className="text-sm leading-none"
              >
                {need}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // Insurance filters
  const renderInsuranceFilters = () => (
    <>
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Accepted Insurance</h3>
        <div className="grid grid-cols-1 gap-2">
          {insuranceOptions.map(option => (
            <div key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`insurance-${option}`}
                checked={filters.insurance.includes(option)}
                onChange={() => toggleArrayFilter('insurance', option)}
                className="h-4 w-4 text-healthcare-600 focus:ring-healthcare-600 border-gray-300 rounded"
              />
              <label
                htmlFor={`insurance-${option}`}
                className="text-sm leading-none"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Price Range</h3>
        <div className="flex flex-wrap gap-2">
          {['$', '$$', '$$$', '$$$$'].map(price => (
            <button
              key={price}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filters.priceRange === price 
                  ? 'bg-healthcare-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => updateFilter('priceRange', filters.priceRange === price ? null : price)}
            >
              {price}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  // Budget filters
  const renderBudgetFilters = () => (
    <>
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Price Range</h3>
        <div className="flex flex-wrap gap-2">
          {['$', '$$', '$$$', '$$$$'].map(price => (
            <button
              key={price}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filters.priceRange === price 
                  ? 'bg-healthcare-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => updateFilter('priceRange', filters.priceRange === price ? null : price)}
            >
              {price}
            </button>
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <p>$ = Under $3,000/month</p>
          <p>$$ = $3,000-$5,000/month</p>
          <p>$$$ = $5,000-$7,000/month</p>
          <p>$$$$ = $7,000+/month</p>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Accepted Insurance</h3>
        <div className="grid grid-cols-1 gap-2">
          {insuranceOptions.map(option => (
            <div key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`insurance-${option}`}
                checked={filters.insurance.includes(option)}
                onChange={() => toggleArrayFilter('insurance', option)}
                className="h-4 w-4 text-healthcare-600 focus:ring-healthcare-600 border-gray-300 rounded"
              />
              <label
                htmlFor={`insurance-${option}`}
                className="text-sm leading-none"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // Amenity filters
  const renderAmenityFilters = () => (
    <>
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Amenities</h3>
        <div className="grid grid-cols-1 gap-2">
          {amenitiesOptions.map(amenity => (
            <div key={amenity} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`amenity-${amenity}`}
                checked={filters.amenities.includes(amenity)}
                onChange={() => toggleArrayFilter('amenities', amenity)}
                className="h-4 w-4 text-healthcare-600 focus:ring-healthcare-600 border-gray-300 rounded"
              />
              <label
                htmlFor={`amenity-${amenity}`}
                className="text-sm leading-none"
              >
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Minimum Rating</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">{filters.rating} ★</span>
        </div>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={filters.rating}
          onChange={(e) => updateFilter('rating', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </>
  );

  // Referral filters (for facilities)
  const renderReferralFilters = () => (
    <>
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Referral Status</h3>
        <div className="grid grid-cols-1 gap-2">
          {['New', 'In Progress', 'Accepted', 'Declined'].map(status => (
            <div key={status} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`status-${status}`}
                checked={false} // This would be connected to a different state
                onChange={() => {}} // This would filter referrals, not facilities
                className="h-4 w-4 text-healthcare-600 focus:ring-healthcare-600 border-gray-300 rounded"
              />
              <label
                htmlFor={`status-${status}`}
                className="text-sm leading-none"
              >
                {status}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Referral Source</h3>
        <div className="grid grid-cols-1 gap-2">
          {['Provider', 'Specialist', 'Patient', 'Other'].map(source => (
            <div key={source} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`source-${source}`}
                checked={false} // This would be connected to a different state
                onChange={() => {}} // This would filter referrals, not facilities
                className="h-4 w-4 text-healthcare-600 focus:ring-healthcare-600 border-gray-300 rounded"
              />
              <label
                htmlFor={`source-${source}`}
                className="text-sm leading-none"
              >
                {source}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="text-lg font-medium flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {userRole === 'provider' && <Stethoscope className="h-4 w-4 ml-2 text-healthcare-600" />}
          {userRole === 'patient' && <User className="h-4 w-4 ml-2 text-healthcare-600" />}
          {userRole === 'specialist' && <Building className="h-4 w-4 ml-2 text-healthcare-600" />}
        </div>
        <button 
          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
        </button>
      </div>
      
      {isOpen && (
        <div className="p-4 space-y-4">
          {renderFilterTabs()}
          
          <button 
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};