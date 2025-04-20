import React, { useState } from 'react';
import { Location } from '../../types/location';
import { 
  Star, 
  MapPin, 
  Phone, 
  Globe, 
  Heart, 
  Calendar, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Clock,
  Users,
  Shield,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface FuturisticLocationCardProps {
  location: Location;
  onClick?: () => void;
  expanded?: boolean;
  isSelected?: boolean;
  userRole: 'provider' | 'specialist' | 'patient' | 'facility';
  onReferralAction?: (action: 'refer' | 'tour' | 'save' | 'contact', locationId: string) => void;
  matchScore?: number; // AI match score (0-100)
  matchReasons?: string[]; // Reasons for the match
}

export const FuturisticLocationCard: React.FC<FuturisticLocationCardProps> = ({
  location,
  onClick,
  expanded = false,
  isSelected = false,
  userRole,
  onReferralAction,
  matchScore,
  matchReasons = []
}) => {
  const [showDetails, setShowDetails] = useState(expanded);
  
  // Generate star rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  // Handle referral actions
  const handleAction = (action: 'refer' | 'tour' | 'save' | 'contact') => {
    if (onReferralAction) {
      onReferralAction(action, location.id);
    }
  };

  // Render match score indicator
  const renderMatchScore = () => {
    if (!matchScore) return null;
    
    let color = 'bg-gray-200';
    if (matchScore >= 90) color = 'bg-green-500';
    else if (matchScore >= 70) color = 'bg-blue-500';
    else if (matchScore >= 50) color = 'bg-yellow-500';
    else color = 'bg-red-500';
    
    return (
      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full p-2 flex items-center justify-center">
        <div className="flex items-center">
          <Sparkles className="h-3 w-3 text-yellow-400 mr-1" />
          <span className="text-white font-bold text-sm">{matchScore}%</span>
        </div>
      </div>
    );
  };

  // Render role-specific actions
  const renderRoleActions = () => {
    switch (userRole) {
      case 'provider':
        return (
          <div className="flex flex-wrap gap-2 mt-4">
            <button 
              className="flex-1 px-3 py-1.5 bg-healthcare-600 text-white rounded-md text-sm font-medium hover:bg-healthcare-700 transition-colors"
              onClick={() => handleAction('refer')}
            >
              <FileText className="h-3 w-3 mr-1 inline-block" />
              Create Referral
            </button>
            <button 
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              onClick={() => handleAction('save')}
            >
              <Heart className="h-3 w-3 mr-1 inline-block" />
              Save
            </button>
          </div>
        );
        
      case 'patient':
        return (
          <div className="flex flex-wrap gap-2 mt-4">
            <button 
              className="flex-1 px-3 py-1.5 bg-healthcare-600 text-white rounded-md text-sm font-medium hover:bg-healthcare-700 transition-colors"
              onClick={() => handleAction('tour')}
            >
              <Calendar className="h-3 w-3 mr-1 inline-block" />
              Schedule Tour
            </button>
            <button 
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              onClick={() => handleAction('save')}
            >
              <Heart className="h-3 w-3 mr-1 inline-block" />
              Save
            </button>
            <button 
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              onClick={() => handleAction('contact')}
            >
              <Phone className="h-3 w-3 mr-1 inline-block" />
              Contact
            </button>
          </div>
        );
        
      case 'specialist':
        return (
          <div className="flex flex-wrap gap-2 mt-4">
            <button 
              className="flex-1 px-3 py-1.5 bg-healthcare-600 text-white rounded-md text-sm font-medium hover:bg-healthcare-700 transition-colors"
              onClick={() => handleAction('refer')}
            >
              <FileText className="h-3 w-3 mr-1 inline-block" />
              Refer Client
            </button>
            <button 
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              onClick={() => handleAction('tour')}
            >
              <Calendar className="h-3 w-3 mr-1 inline-block" />
              Schedule Tour
            </button>
            <button 
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              onClick={() => handleAction('save')}
            >
              <Heart className="h-3 w-3 mr-1 inline-block" />
              Save
            </button>
          </div>
        );
        
      case 'facility':
        return (
          <div className="flex flex-wrap gap-2 mt-4">
            <Link 
              to={`/facilities/${location.id}/referrals`}
              className="flex-1 px-3 py-1.5 bg-healthcare-600 text-white rounded-md text-sm font-medium hover:bg-healthcare-700 transition-colors text-center"
            >
              <Users className="h-3 w-3 mr-1 inline-block" />
              View Referrals
            </Link>
            <Link 
              to={`/facilities/${location.id}/edit`}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-3 w-3 mr-1 inline-block" />
              Edit Profile
            </Link>
          </div>
        );
        
      default:
        return (
          <div className="flex items-center justify-between mt-2">
            <div className="text-sm">
              <span className="font-medium">{location.beds}</span> beds available
            </div>
            <Link 
              to={`/facilities/${location.id}`}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Details
              <ArrowRight className="h-3 w-3 ml-1 inline-block" />
            </Link>
          </div>
        );
    }
  };

  return (
    <div 
      className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-healthcare-600' : ''
      } bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg`}
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={location.imageUrl || '/placeholder-facility.jpg'} 
          alt={location.name} 
          className="h-48 w-full object-cover"
        />
        
        {/* Facility type badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {location.facilityType.map((type, index) => (
            <span 
              key={index} 
              className="bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm"
            >
              {type}
            </span>
          ))}
        </div>
        
        {/* Price range badge */}
        {location.priceRange && !matchScore && (
          <div className="absolute top-2 right-2">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              {location.priceRange}
            </span>
          </div>
        )}
        
        {/* AI Match score */}
        {renderMatchScore()}
        
        {/* Availability indicator */}
        {location.availability && (
          <div className="absolute bottom-2 left-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Available Now
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg mb-1">{location.name}</h3>
          <button 
            className="h-8 w-8 p-0 -mt-1 -mr-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <ChevronUp className="h-4 w-4 mx-auto" />
            ) : (
              <ChevronDown className="h-4 w-4 mx-auto" />
            )}
          </button>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="truncate">{location.address}, {location.city}, {location.state}</span>
        </div>
        
        <div className="flex items-center mb-3">
          {renderStars(location.rating)}
          <span className="ml-1 text-sm">{location.rating.toFixed(1)}</span>
        </div>
        
        {showDetails && (
          <>
            <p className="text-sm text-gray-500 mb-3">
              {location.description || 'No description available.'}
            </p>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="text-sm">
                <span className="font-medium">Care Levels:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {location.careLevel.map((level, index) => (
                    <span key={index} className="text-xs border border-gray-200 rounded px-1.5 py-0.5">
                      {level}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="text-sm">
                <span className="font-medium">Amenities:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {location.amenities.slice(0, 3).map((amenity, index) => (
                    <span key={index} className="text-xs border border-gray-200 rounded px-1.5 py-0.5">
                      {amenity}
                    </span>
                  ))}
                  {location.amenities.length > 3 && (
                    <span className="text-xs border border-gray-200 rounded px-1.5 py-0.5">
                      +{location.amenities.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Insurance information */}
            {location.insurance && (
              <div className="mb-3">
                <span className="text-sm font-medium">Accepted Insurance:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {location.insurance.map((ins, index) => (
                    <span key={index} className="text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-blue-50 flex items-center">
                      <Shield className="h-2 w-2 mr-1" />
                      {ins}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Contact information */}
            <div className="flex flex-wrap gap-2 mb-3">
              {location.phone && (
                <a 
                  href={`tel:${location.phone}`}
                  className="text-xs px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Phone className="h-3 w-3 mr-1" />
                  {location.phone}
                </a>
              )}
              
              {location.website && (
                <a 
                  href={location.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Globe className="h-3 w-3 mr-1" />
                  Website
                </a>
              )}
            </div>
            
            {/* Staff contact (if available) */}
            {location.contactPerson && (
              <div className="flex items-center space-x-2 mb-3 p-2 bg-gray-50 rounded-md">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  {location.contactPersonImage ? (
                    <img src={location.contactPersonImage} alt={location.contactPerson} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs font-medium">
                      {location.contactPerson.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{location.contactPerson}</p>
                  <p className="text-xs text-gray-500">{location.contactTitle || 'Admissions Coordinator'}</p>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Role-specific actions */}
        {renderRoleActions()}
      </div>
    </div>
  );
};