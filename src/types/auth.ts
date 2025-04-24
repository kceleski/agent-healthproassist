
import { Session, User } from "@supabase/supabase-js";

export type AuthUser = {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  subscription?: string;
  role?: string;
};

export type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  showAvatar: boolean;
  toggleAvatar: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string, 
    email: string, 
    password: string, 
    profileData?: {
      bio?: string;
      default_location?: string;
      notification_preferences?: {
        email: boolean;
        sms: boolean;
        inApp: boolean;
      };
      communication_preferences?: {
        receiveUpdates: boolean;
        receiveReferrals: boolean;
        allowContactSharing: boolean;
      };
      company?: string;
      job_title?: string;
      headline?: string;
      years_experience?: string;
      phone?: string;
      specializations?: string;
      work_type?: 'agency' | 'independent';
      agency_details?: {
        name: string;
        address?: string;
        phone?: string;
        website?: string;
      };
      subscription_tier?: 'standard' | 'premium';
      profile_image?: string;
    }
  ) => Promise<void>;
  logout: () => Promise<void>;
};
