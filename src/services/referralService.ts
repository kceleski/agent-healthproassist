
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ReferralData {
  client_id: string;
  facility_id: string;
  status: string; // 'new', 'pending', 'accepted', 'declined', 'completed'
  follow_up_date?: string;
  notes?: string;
  commission_amount?: number;
  commission_status?: string;
}

// Create a new referral
export async function createReferral(userId: string, referralData: ReferralData) {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .insert({
        user_id: userId,
        ...referralData,
        referral_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    
    // Create notification for the referral
    await createReferralNotification(userId, data[0].id, referralData.client_id, referralData.facility_id);
    
    toast.success('Referral created successfully');
    return data[0];
  } catch (error) {
    console.error('Error creating referral:', error);
    toast.error('Failed to create referral');
    return null;
  }
}

// Create notification for a new referral
async function createReferralNotification(
  userId: string, 
  referralId: string, 
  clientId: string, 
  facilityId: string
) {
  try {
    // Get client and facility details
    const [clientResponse, facilityResponse] = await Promise.all([
      supabase.from('senior_clients').select('first_name, last_name').eq('id', clientId).single(),
      supabase.from('facilities').select('name').eq('id', facilityId).single()
    ]);
    
    const clientName = clientResponse.data 
      ? `${clientResponse.data.first_name} ${clientResponse.data.last_name}` 
      : 'Client';
    
    const facilityName = facilityResponse.data ? facilityResponse.data.name : 'Facility';
    
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'referral',
        title: 'New Referral Created',
        content: `New referral for ${clientName} to ${facilityName} has been created.`,
        related_id: referralId,
        read: false,
        created_at: new Date().toISOString()
      });
      
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

// Get all referrals for a user
export async function getUserReferrals(userId: string) {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        *,
        senior_clients (first_name, last_name),
        facilities (name, address, city, state)
      `)
      .eq('user_id', userId)
      .order('referral_date', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return [];
  }
}

// Update a referral
export async function updateReferral(referralId: string, referralData: Partial<ReferralData>) {
  try {
    const { error } = await supabase
      .from('referrals')
      .update({
        ...referralData,
        updated_at: new Date().toISOString()
      })
      .eq('id', referralId);
    
    if (error) throw error;
    
    toast.success('Referral updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating referral:', error);
    toast.error('Failed to update referral');
    return false;
  }
}

// Get a specific referral with full details
export async function getReferralDetails(referralId: string) {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select(`
        *,
        senior_clients (*),
        facilities (*)
      `)
      .eq('id', referralId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching referral details:', error);
    return null;
  }
}

// Delete a referral
export async function deleteReferral(referralId: string) {
  try {
    const { error } = await supabase
      .from('referrals')
      .delete()
      .eq('id', referralId);
    
    if (error) throw error;
    
    toast.success('Referral deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting referral:', error);
    toast.error('Failed to delete referral');
    return false;
  }
}
