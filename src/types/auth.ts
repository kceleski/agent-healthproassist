
import { Session } from "@supabase/supabase-js";

export type AuthUser = {
  id: string;
  email?: string | null;
  name?: string;
  subscription?: 'basic' | 'premium';
  role?: string;
  isDemo?: boolean;
};

export type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  showAvatar: boolean;
  toggleAvatar: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginDemo: (type: 'basic' | 'premium') => void;
};
