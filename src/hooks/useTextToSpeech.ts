
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useTextToSpeech = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const speak = async (text: string, voiceId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: { text, voiceId }
      });

      if (error) throw error;

      if (data?.audio) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        await audio.play();
      }
    } catch (err) {
      console.error('Text to speech error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate speech');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    speak,
    isLoading,
    error
  };
};
