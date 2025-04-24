
export type AuthUser = {
  id: string;
  email: string | undefined;
  name?: string;
  subscription?: string;
  role?: string;
  demoTier?: 'basic' | 'premium';
};
