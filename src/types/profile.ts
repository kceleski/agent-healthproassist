
export interface UserProfile {
  id: string;
  company?: string;
  job_title?: string;
  bio?: string;
  avatar_url?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  default_location?: string;
  preferred_contact_method?: string;
  notification_preferences: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  communication_preferences: {
    receiveUpdates: boolean;
    receiveReferrals: boolean;
    allowContactSharing: boolean;
  };
  created_at?: string;
  updated_at?: string;
}
