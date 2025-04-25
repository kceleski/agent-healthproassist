
export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  subscription?: string;
  role?: string;
  isDemo?: boolean;
  demoType?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, metadata?: any) => Promise<void>;
  loginDemo: (type: 'basic' | 'premium') => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  showAvatar: boolean;
  toggleAvatar: () => void;
}
