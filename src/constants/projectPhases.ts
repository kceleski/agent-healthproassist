
export interface ProjectTask {
  id: number;
  phase: string;
  task: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  files: string[];
  dependencies: number[];
  notes: string;
}

export const projectPhases: ProjectTask[] = [
  {
    id: 1,
    phase: "Public Directory",
    task: "Build Public Directory Page",
    status: "in-progress", 
    files: ["src/pages/DirectoryPage.tsx", "src/components/directory/BusinessDirectoryCard.tsx"],
    dependencies: [2],
    notes: "Main public directory with facility cards"
  },
  {
    id: 2,
    phase: "Public Directory",
    task: "Create Business Directory Card Component",
    status: "in-progress",
    files: ["src/components/directory/BusinessDirectoryCard.tsx"],
    dependencies: [],
    notes: "Reusable card component for facility listings"
  },
  {
    id: 3,
    phase: "UI Implementation", 
    task: "Build Hero Section with Journey Selection",
    status: "in-progress",
    files: ["src/components/directory/HeroSection.tsx"],
    dependencies: [4, 5],
    notes: "Hero with Veteran/General care option buttons"
  },
  {
    id: 4,
    phase: "AI Integration",
    task: "Implement Ava AI Assistant",
    status: "completed",
    files: ["src/pages/AvaMapPage.tsx", "src/components/search/AvaButton.tsx"],
    dependencies: [],
    notes: "Ava map assistant is working"
  },
  {
    id: 5,
    phase: "AI Integration",
    task: "Implement Ranger AI Assistant",
    status: "pending",
    files: ["src/components/ai/RangerAssistant.tsx"],
    dependencies: [],
    notes: "Veteran-focused AI assistant not yet implemented"
  },
  {
    id: 6,
    phase: "Backend Integration",
    task: "Facility Data Preloading",
    status: "pending",
    files: ["src/services/facilityService.ts"],
    dependencies: [],
    notes: "Need to populate facilities table with initial data"
  },
  {
    id: 7,
    phase: "Dashboard Features",
    task: "Role-Based Dashboard Rendering",
    status: "in-progress",
    files: ["src/pages/DashboardPage.tsx", "src/constants/roleFeatures.ts"],
    dependencies: [],
    notes: "Dashboard exists but needs role-based feature control"
  }
];
