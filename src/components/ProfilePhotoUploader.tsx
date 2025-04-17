
import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Camera, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface ProfilePhotoUploaderProps {
  className?: string;
}

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({ className }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadProfilePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      setUploading(true);

      const { error: uploadError } = await supabase.storage
        .from('profile_photos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from('profile_photos')
        .getPublicUrl(filePath);

      if (urlError) {
        throw new Error('Error getting public URL');
      }

      // Update user profile with new photo URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user?.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: 'Profile Photo Updated',
        description: 'Your profile photo has been successfully uploaded.',
        variant: 'default'
      });
      
      // Update local user state if needed through your auth context
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const removeProfilePhoto = async () => {
    try {
      // Remove avatar URL from user profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: null })
        .eq('user_id', user?.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: 'Profile Photo Removed',
        description: 'Your profile photo has been successfully removed.',
        variant: 'default'
      });
      
      // Update local user state if needed
    } catch (error) {
      toast({
        title: 'Remove Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    }
  };

  // Get avatar URL from user profile or use a default avatar
  const avatarUrl = user?.avatar_url || `https://avatar.vercel.sh/${user?.email}`;

  return (
    <div className={`flex items-center gap-6 ${className}`}>
      <Avatar className="h-20 w-20">
        <AvatarImage 
          src={avatarUrl} 
          alt="Profile Photo" 
        />
        <AvatarFallback>
          <User className="h-12 w-12" />
        </AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Camera className="mr-2 h-4 w-4" />
            {uploading ? 'Uploading...' : 'Change Photo'}
          </Button>
          {user?.avatar_url && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={removeProfilePhoto}
              disabled={uploading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={uploadProfilePhoto}
          accept="image/*"
          className="hidden"
        />
        <p className="text-sm text-muted-foreground">
          JPG or PNG. Max size 5MB.
        </p>
      </div>
    </div>
  );
};
