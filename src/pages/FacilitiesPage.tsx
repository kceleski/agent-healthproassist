import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shell } from "@/components/ui/shell"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from 'react-router-dom';

// Define the FacilityType enum
enum FacilityType {
  assisted_living = 'assisted_living',
  independent_living = 'independent_living',
  nursing_home = 'nursing_home',
  memory_care = 'memory_care',
}

// Define the Facility interface
interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  rating: number;
  location: string;
  price: string;
  image: string;
  amenities: string[];
  availableBeds: number;
  description: string;
}

// Inside the component, update the mockData array to use proper FacilityType values
const mockData: Facility[] = [
  {
    id: '1',
    name: 'Golden Horizons Care Center',
    type: FacilityType.assisted_living, // Changed from string to enum value
    rating: 4.8,
    location: 'San Francisco, CA',
    price: '$3,500 - $5,200/month',
    image: '/placeholder.svg',
    amenities: ['24/7 Care', 'Private Rooms', 'Memory Care', 'Physical Therapy'],
    availableBeds: 5,
    description: 'Luxury assisted living facility with comprehensive care services and a focus on resident comfort and well-being.',
  },
  {
    id: '2',
    name: 'Serene Gardens Retirement',
    type: FacilityType.independent_living, // Changed from string to enum value
    rating: 4.5,
    location: 'Oakland, CA',
    price: '$2,800 - $4,000/month',
    image: '/placeholder.svg',
    amenities: ['Restaurant-Style Dining', 'Fitness Center', 'Library', 'Garden'],
    availableBeds: 3,
    description: 'Independent living community designed for active seniors with amenities that promote a fulfilling and engaging lifestyle.',
  },
  {
    id: '3',
    name: 'Tranquil Pines Nursing Home',
    type: FacilityType.nursing_home, // Changed from string to enum value
    rating: 4.2,
    location: 'San Jose, CA',
    price: '$5,500 - $7,500/month',
    image: '/placeholder.svg',
    amenities: ['24/7 Medical Staff', 'Rehabilitation Services', 'Private Rooms', 'Social Activities'],
    availableBeds: 0,
    description: 'Skilled nursing facility providing comprehensive medical care and rehabilitation services for seniors with complex health needs.',
  },
  {
    id: '4',
    name: 'Horizon Memory Care',
    type: FacilityType.memory_care, // Changed from string to enum value
    rating: 4.7,
    location: 'Palo Alto, CA',
    price: '$6,000 - $8,500/month',
    image: '/placeholder.svg',
    amenities: ['Specialized Memory Programs', 'Secure Environment', 'Therapy Services', 'Private Suites'],
    availableBeds: 2,
    description: 'Specialized memory care facility designed for individuals with Alzheimer\'s and other forms of dementia, offering a secure and supportive environment.',
  }
];

const FacilitiesPage = () => {
  return (
    <Shell>
      <div className="grid gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Care Facilities</h2>
          <p className="text-muted-foreground">
            Browse available care facilities and find the best option for your needs.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockData.map((facility) => (
            <Card key={facility.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <Link to={`/facilities/${facility.id}`}>
                <div className="relative">
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-48 object-cover"
                  />
                  {facility.availableBeds === 0 && (
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                      No Beds Available
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{facility.name}</CardTitle>
                  <CardDescription>
                    {facility.location} - Rating: {facility.rating}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 pb-4">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Ava Smith</p>
                      <p className="text-sm text-muted-foreground">Care Advisor</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {facility.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </Shell>
  );
};

export default FacilitiesPage;
