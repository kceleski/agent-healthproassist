/**
 * Speech synthesis service
 */

/**
 * Options for text-to-speech
 */
export interface SpeechOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

/**
 * Speaks text using the Web Speech API
 * @param text Text to speak
 * @param options Speech options
 * @returns Promise that resolves when speech is complete
 */
export const speak = (text: string, options: SpeechOptions = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set options
    if (options.voice) {
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === options.voice);
      if (voice) {
        utterance.voice = voice;
      }
    }
    
    if (options.rate !== undefined) utterance.rate = options.rate;
    if (options.pitch !== undefined) utterance.pitch = options.pitch;
    if (options.volume !== undefined) utterance.volume = options.volume;
    
    // Handle events
    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
  });
};

/**
 * Gets available voices for speech synthesis
 * @returns Array of available voices
 */
export const getVoices = (): SpeechSynthesisVoice[] => {
  if (!window.speechSynthesis) {
    console.error('Speech synthesis not supported');
    return [];
  }
  
  return window.speechSynthesis.getVoices();
};

/**
 * Stops any ongoing speech
 */
export const stopSpeaking = (): void => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};