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

export interface WelcomeTabsProps {
  preferences: {
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
    bio?: string;
    default_location?: string;
  };
  loading: boolean;
  onInputChange: (field: string, value: string) => void;
  onNotificationChange: (field: "email" | "sms" | "inApp", value: boolean) => void;
  onCommunicationPrefChange: (field: "receiveUpdates" | "receiveReferrals" | "allowContactSharing", value: boolean) => void;
  onSave: () => void;
}
