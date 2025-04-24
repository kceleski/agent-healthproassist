
export type AuthUser = {
  id: string;
  email: string | null;
  name?: string;
  subscription?: string;
  role?: 'user' | 'admin';
};

export type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  showAvatar: boolean;
  toggleAvatar: () => void;
};
