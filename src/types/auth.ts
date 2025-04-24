
export type AuthUser = {
  id: string;
  email: string | null;
  name?: string;
  subscription?: string;
  role?: 'user' | 'admin';
  demoTier?: string;
};
