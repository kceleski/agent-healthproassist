declare namespace JSX {
  interface IntrinsicElements {
    'elevenlabs-convai': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        'agent-id'?: string;
      },
      HTMLElement
    >;
  }
}

// Declare global ElevenLabs widget interface if needed in the future
interface Window {
  elevenlabs?: {
    convai?: any;
  };
}
