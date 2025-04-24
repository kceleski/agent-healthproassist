
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export const useAdmin = () => {
  const { user } = useAuth();
  
  // Check if user exists in admins table instead of relying on a role property
  const checkIsAdmin = async () => {
    if (!user) return false;
    
    const { data } = await supabase
      .from('admins')
      .select()
      .eq('user_id', user.id)
      .single();
      
    return !!data;
  };
  
  return checkIsAdmin();
};
