export const initialSeniorsData = [
  {
    id: "1",
    name: "Eleanor Johnson",
    age: 78,
    careNeeds: ["Memory Care", "Medication Management"],
    budget: "$3,500 - $4,500",
    location: "San Francisco, CA",
    phone: "(415) 555-1234",
    email: "eleanor.johnson@example.com",
    status: "Active",
    notes: "Prefers a facility with garden access. Daughter is primary decision maker.",
    lastContact: "2 days ago",
    image: "https://images.unsplash.com/photo-1581579438747-e5b6bdc752df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    familyContacts: [
      {
        name: "Sarah Thompson",
        relationship: "Daughter",
        phone: "(415) 555-5678",
        email: "sarah.thompson@example.com"
      }
    ]
  },
  {
    id: "2",
    name: "Robert Wilson",
    age: 82,
    careNeeds: ["Assisted Living", "Physical Therapy"],
    budget: "$4,000 - $5,000",
    location: "Oakland, CA",
    phone: "(510) 555-9876",
    email: "robert.wilson@example.com",
    status: "Active",
    notes: "Veteran, interested in facilities with veteran programs. Uses a walker.",
    lastContact: "1 week ago",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    familyContacts: [
      {
        name: "Michael Wilson",
        relationship: "Son",
        phone: "(510) 555-4321",
        email: "michael.wilson@example.com"
      }
    ]
  },
  {
    id: "3",
    name: "Maria Garcia",
    age: 75,
    careNeeds: ["Independent Living", "Meal Preparation"],
    budget: "$3,000 - $4,000",
    location: "San Jose, CA",
    phone: "(408) 555-7890",
    email: "maria.garcia@example.com",
    status: "Placed",
    notes: "Spanish-speaking, prefers a facility with bilingual staff. Enjoys community activities.",
    lastContact: "3 weeks ago",
    image: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    familyContacts: [
      {
        name: "Carlos Garcia",
        relationship: "Son",
        phone: "(408) 555-4567",
        email: "carlos.garcia@example.com"
      },
      {
        name: "Sofia Martinez",
        relationship: "Daughter",
        phone: "(408) 555-2345",
        email: "sofia.martinez@example.com"
      }
    ]
  },
  {
    id: "4",
    name: "James Smith",
    age: 85,
    careNeeds: ["Skilled Nursing", "Wound Care"],
    budget: "$5,000 - $6,500",
    location: "Palo Alto, CA",
    phone: "(650) 555-6543",
    email: "james.smith@example.com",
    status: "Active",
    notes: "Recently hospitalized, needs a facility with strong medical care. Prefers private room.",
    lastContact: "Yesterday",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    familyContacts: [
      {
        name: "John Smith",
        relationship: "Nephew",
        phone: "(650) 555-7890",
        email: "john.smith@example.com"
      }
    ]
  }
];

export const facilityContactsData = [
  {
    id: "1",
    name: "Sarah Johnson",
    title: "Admissions Director",
    facility: "Sunset Senior Living",
    facilityType: "Assisted Living",
    location: "San Francisco, CA",
    phone: "(415) 555-1234",
    email: "sarah.johnson@sunsetseniorliving.com",
    lastContact: "2 days ago",
    notes: "Prefers email communication. Quick to respond to placement inquiries.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
  },
  {
    id: "2",
    name: "James Wilson",
    title: "Memory Care Director",
    facility: "Golden Years Home",
    facilityType: "Memory Care",
    location: "Oakland, CA",
    phone: "(510) 555-5678",
    email: "james.wilson@goldenyearshome.com",
    lastContact: "1 week ago",
    notes: "Excellent resource for memory care placements. Conducts thorough assessments.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    title: "Community Relations Manager",
    facility: "Serenity Care Center",
    facilityType: "Skilled Nursing",
    location: "San Jose, CA",
    phone: "(408) 555-9012",
    email: "maria.rodriguez@serenitycare.com",
    lastContact: "3 days ago",
    notes: "Bilingual (Spanish/English). Good follow-up on placement status.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
  },
  {
    id: "4",
    name: "Robert Chen",
    title: "Executive Director",
    facility: "Riverside Retirement",
    facilityType: "Independent Living",
    location: "Palo Alto, CA",
    phone: "(650) 555-3456",
    email: "robert.chen@riversideretirement.com",
    lastContact: "2 weeks ago",
    notes: "Best to schedule appointments. Offers competitive commission rates.",
    image: "https://images.unsplash.com/photo-1500648733761-caae3b5f2e50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
  },
  {
    id: "5",
    name: "Jennifer Williams",
    title: "Marketing Director",
    facility: "Oakwood Senior Community",
    facilityType: "Assisted Living",
    location: "San Francisco, CA",
    phone: "(415) 555-7890",
    email: "jennifer.williams@oakwoodsenior.com",
    lastContact: "5 days ago",
    notes: "Hosts regular facility tours. Responsive to urgent placement needs.",
    image: "https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
  }
];
