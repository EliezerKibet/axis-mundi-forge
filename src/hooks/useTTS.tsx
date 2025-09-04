import { useState, useEffect, useCallback, useRef } from 'react';

interface TTSState {
  isPlaying: boolean;
  isPaused: boolean;
  currentPosition: number;
  selectedVoice: SpeechSynthesisVoice | null;
  speed: number;
  availableVoices: SpeechSynthesisVoice[];
  progress: number;
}

interface TTSOptions {
  voice?: SpeechSynthesisVoice | null;
  speed?: number;
  onProgress?: (position: number) => void;
  onEnd?: () => void;
}

export const useTTS = () => {
  const [state, setState] = useState<TTSState>({
    isPlaying: false,
    isPaused: false,
    currentPosition: 0,
    selectedVoice: null,
    speed: 1,
    availableVoices: [],
    progress: 0
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textRef = useRef<string>('');
  const positionRef = useRef<number>(0);

  // Check if browser supports speech synthesis
  const isSupported = useCallback(() => {
    return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }, []);

  // Load available voices and select most realistic one
  useEffect(() => {
    if (!isSupported()) return;

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        const getRealisticVoice = () => {
          // Priority order for realistic voices
          const preferredVoices = [
            'Google UK English Female',
            'Google US English',
            'Microsoft Aria Online (Natural)',
            'Microsoft Zira Desktop',
            'Alex',
            'Samantha'
          ];
          
          // Find the best available voice
          let selectedVoice = null;
          for (const preferred of preferredVoices) {
            selectedVoice = voices.find(voice => 
              voice.name.includes(preferred) || 
              voice.name.toLowerCase().includes('neural') ||
              voice.name.toLowerCase().includes('natural')
            );
            if (selectedVoice) break;
          }
          
          // Filter for high-quality voices if no preferred found
          if (!selectedVoice) {
            const qualityVoices = voices.filter(voice => 
              voice.name.toLowerCase().includes('neural') ||
              voice.name.toLowerCase().includes('natural') ||
              voice.name.toLowerCase().includes('premium') ||
              voice.name.includes('Google') ||
              voice.name.includes('Microsoft')
            );
            
            // Prefer female voices as they tend to sound more natural
            const femaleVoices = qualityVoices.filter(voice => 
              voice.name.toLowerCase().includes('female') ||
              voice.name.toLowerCase().includes('aria') ||
              voice.name.toLowerCase().includes('jenny') ||
              voice.name.toLowerCase().includes('joanna')
            );
            
            selectedVoice = femaleVoices.length > 0 ? femaleVoices[0] : qualityVoices[0];
          }
          
          // Final fallback to first English voice
          return selectedVoice || voices.find(voice => voice.lang.startsWith('en-')) || voices[0];
        };
        
        const realisticVoice = getRealisticVoice();
        
        setState(prev => ({
          ...prev,
          availableVoices: voices,
          selectedVoice: prev.selectedVoice || realisticVoice,
          speed: prev.speed || 1
        }));
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported]);

  // Clean text for TTS
  const cleanTextForTTS = useCallback((text: string): string => {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/#{1,6}\s/g, '') // Remove markdown headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/`([^`]*)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }, []);

  // Start speaking
  const speak = useCallback((text: string, options: TTSOptions = {}) => {
    if (!isSupported() || !text.trim()) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const cleanText = cleanTextForTTS(text);
    textRef.current = cleanText;
    positionRef.current = 0;

    // Add natural pauses and intonation
    const naturalText = cleanText.replace(/\./g, '. ').replace(/,/g, ', ');
    
    const utterance = new SpeechSynthesisUtterance(naturalText);
    utteranceRef.current = utterance;

    // Configure utterance with current speed
    utterance.voice = options.voice || state.selectedVoice;
    utterance.rate = options.speed || state.speed;
    utterance.pitch = 1.0; // Natural pitch
    utterance.volume = 1.0; // Full volume

    // Event handlers
    utterance.onstart = () => {
      setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    };

    utterance.onend = () => {
      setState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        isPaused: false, 
        currentPosition: 0,
        progress: 0
      }));
      positionRef.current = 0;
      options.onEnd?.();
    };

    utterance.onerror = () => {
      setState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        isPaused: false 
      }));
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        positionRef.current = event.charIndex;
        const progress = (event.charIndex / cleanText.length) * 100;
        setState(prev => ({ 
          ...prev, 
          currentPosition: event.charIndex,
          progress 
        }));
        options.onProgress?.(event.charIndex);
      }
    };

    // Start speaking
    speechSynthesis.speak(utterance);
  }, [isSupported, cleanTextForTTS, state.selectedVoice, state.speed]);

  // Pause speaking
  const pause = useCallback(() => {
    if (!isSupported()) return;
    speechSynthesis.pause();
    setState(prev => ({ ...prev, isPaused: true, isPlaying: false }));
  }, [isSupported]);

  // Resume speaking
  const resume = useCallback(() => {
    if (!isSupported()) return;
    speechSynthesis.resume();
    setState(prev => ({ ...prev, isPaused: false, isPlaying: true }));
  }, [isSupported]);

  // Stop speaking
  const stop = useCallback(() => {
    if (!isSupported()) return;
    speechSynthesis.cancel();
    setState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      isPaused: false, 
      currentPosition: 0,
      progress: 0
    }));
    positionRef.current = 0;
  }, [isSupported]);

  // Toggle play/pause
  const toggle = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else if (state.isPaused) {
      resume();
    }
  }, [state.isPlaying, state.isPaused, pause, resume]);

  // Set voice
  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setState(prev => ({ ...prev, selectedVoice: voice }));
  }, []);

  // Set speed
  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed }));
    
    // If currently speaking, restart with new speed
    if (state.isPlaying && utteranceRef.current) {
      const remainingText = textRef.current.slice(positionRef.current);
      speechSynthesis.cancel();
      
      setTimeout(() => {
        speak(remainingText, { speed });
      }, 100);
    }
  }, [state.isPlaying, speak]);

  return {
    ...state,
    speak,
    pause,
    resume,
    stop,
    toggle,
    setVoice,
    setSpeed,
    isSupported: isSupported()
  };
};