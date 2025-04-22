
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { UserProfile } from '@/types/profile';

export function useUserProfile(userId?: string) {
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      // Ensure the returned data conforms to UserProfile type by setting defaults
      const userProfile: UserProfile = {
        id: data?.id || '',
        company: data?.company,
        job_title: data?.job_title,
        bio: data?.bio,
        avatar_url: data?.avatar_url,
        address: data?.address,
        city: data?.city,
        state: data?.state,
        zip_code: data?.zip_code,
        default_location: data?.default_location,
        preferred_contact_method: data?.preferred_contact_method,
        notification_preferences: data?.notification_preferences || {
          email: true,
          sms: false,
          inApp: true
        },
        communication_preferences: data?.communication_preferences || {
          receiveUpdates: true,
          receiveReferrals: true,
          allowContactSharing: false
        },
        created_at: data?.created_at,
        updated_at: data?.updated_at
      };
      
      return userProfile;
    },
    enabled: !!userId,
  });

  const { mutateAsync: updateProfile } = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!userId) throw new Error('No user ID provided');
      
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile,
  };
}
