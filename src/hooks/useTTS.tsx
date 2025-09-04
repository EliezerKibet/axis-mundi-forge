import { useState, useEffect, useCallback, useRef } from "react";

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
    progress: 0,
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textRef = useRef<string>("");
  const positionRef = useRef<number>(0);

  // Check if browser supports speech synthesis
  const isSupported = useCallback(() => {
    return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  }, []);

  // Load available voices and select most realistic one
  useEffect(() => {
    if (!isSupported()) return;

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        const getRealisticVoice = () => {
          console.log("All available voices:");
          voices.forEach((voice, index) => {
            console.log(
              `${index}: ${voice.name} (${voice.lang}) - ${
                voice.localService ? "Local" : "Network"
              }`
            );
          });

          // FIRST: Filter for English voices only
          const englishVoices = voices.filter((voice) => {
            const lang = voice.lang.toLowerCase();
            return lang.startsWith("en-") || lang.includes("english");
          });

          console.log("English voices found:", englishVoices.length);

          if (englishVoices.length === 0) {
            console.warn("No English voices available, using default");
            return voices[0] || null;
          }

          // Priority order for realistic English voices
          const preferredVoices = [
            "Microsoft Aria Online (Natural)",
            "Microsoft Emma Online (Natural)",
            "Microsoft Ava Online (Natural)",
            "Microsoft Jenny Online (Natural)",
            "Microsoft Michelle Online (Natural)",
            "Microsoft Ana Online (Natural)",
            "Microsoft Natasha Online (Natural)",
            "Microsoft Clara Online (Natural)",
            "Microsoft Emily Online (Natural)",
            "Microsoft Libby Online (Natural)",
            "Microsoft Maisie Online (Natural)",
            "Microsoft Sonia Online (Natural)",
          ];

          // Find exact matches in English voices
          for (const preferred of preferredVoices) {
            const exactMatch = englishVoices.find(
              (voice) => voice.name === preferred
            );
            if (exactMatch) {
              console.log("Selected voice:", exactMatch.name, exactMatch.lang);
              return exactMatch;
            }
          }

          // Find partial matches in English voices
          for (const preferred of preferredVoices) {
            const partialMatch = englishVoices.find((voice) =>
              voice.name.toLowerCase().includes(preferred.toLowerCase())
            );
            if (partialMatch) {
              console.log(
                "Selected voice (partial match):",
                partialMatch.name,
                partialMatch.lang
              );
              return partialMatch;
            }
          }

          // Look for quality English voices
          const qualityEnglishVoices = englishVoices.filter(
            (voice) =>
              voice.name.toLowerCase().includes("neural") ||
              voice.name.toLowerCase().includes("natural") ||
              voice.name.toLowerCase().includes("premium")
          );

          if (qualityEnglishVoices.length > 0) {
            console.log(
              "Selected quality English voice:",
              qualityEnglishVoices[0].name,
              qualityEnglishVoices[0].lang
            );
            return qualityEnglishVoices[0];
          }

          // Default to first English voice
          console.log(
            "Selected default English voice:",
            englishVoices[0].name,
            englishVoices[0].lang
          );
          return englishVoices[0];
        };

        const realisticVoice = getRealisticVoice();

        setState((prev) => ({
          ...prev,
          availableVoices: voices,
          selectedVoice: prev.selectedVoice || realisticVoice,
          speed: prev.speed || 1,
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
    return (
      text
        // Clean HTML first
        .replace(/<[^>]*>/g, "")
        .replace(/`([^`]*)`/g, "$1") // Remove inline code
        .replace(/```[\s\S]*?```/g, "") // Remove code blocks
        .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markdown
        .replace(/\*(.*?)\*/g, "$1") // Remove italic markdown

        // Fix number pronunciation
        .replace(/\b(\d{1,3}),(\d{3}),(\d{3})\b/g, (match, p1, p2, p3) => {
          const num = parseInt(p1 + p2 + p3);
          if (num === 5000000) return "five million";
          if (num === 1000000) return "one million";
          return match;
        })
        .replace(/\b(\d{1,3}),(\d{3})\b/g, (match, p1, p2) => {
          const thousands = parseInt(p1);
          if (thousands === 1) return "one thousand";
          if (thousands === 2) return "two thousand";
          if (thousands === 3) return "three thousand";
          if (thousands === 4) return "four thousand";
          if (thousands === 5) return "five thousand";
          if (thousands === 10) return "ten thousand";
          if (thousands === 20) return "twenty thousand";
          if (thousands === 50) return "fifty thousand";
          if (thousands === 100) return "one hundred thousand";
          if (thousands === 500) return "five hundred thousand";
          return match;
        })
        .replace(/\b1,287\b/g, "twelve eighty-seven")
        .replace(/\b502\b/g, "five hundred and two")
        .replace(/\b112\b/g, "one hundred and twelve")
        .replace(/\b433\b/g, "four hundred and thirty-three")
        .replace(/\b86\b/g, "eighty-six")
        .replace(/\b20\b/g, "twenty")
        .replace(/\b2030\b/g, "twenty thirty")
        .replace(/\b2025\b/g, "twenty twenty-five")
        .replace(/\b2024\b/g, "twenty twenty-four")
        .replace(/\b2022\b/g, "twenty twenty-two")

        // Mark different content types for processing
        .replace(/^# (.+)$/gm, "MAIN_TITLE:$1") // Main titles
        .replace(/^## (.+)$/gm, "SUB_TITLE:$1") // Subtitles
        .replace(/^### (.+)$/gm, "SUB_TITLE:$1") // Sub-subtitles

        // Clean up spacing
        .replace(/\n\n+/g, "\n\n") // Normalize paragraph breaks
        .replace(/[ \t]+/g, " ") // Normalize spaces
        .trim()
    );
  }, []);

  // Start speaking
  const speak = useCallback(
    (text: string, options: TTSOptions = {}) => {
      if (!isSupported() || !text.trim()) return;

      speechSynthesis.cancel();

      const cleanText = cleanTextForTTS(text);
      textRef.current = cleanText;
      positionRef.current = 0;

      // Process text with different speeds for different content types
      const processTextWithSpeeds = (text: string) => {
        const segments = [];
        const lines = text.split("\n");

        console.log("DEBUG: Total lines after split:", lines.length);
        console.log("DEBUG: First 10 lines:", lines.slice(0, 10));

        for (const line of lines) {
          if (!line.trim()) continue;

          console.log(
            "DEBUG: Processing line:",
            line.substring(0, 100) + "..."
          );

          if (line.startsWith("MAIN_TITLE:")) {
            // Main titles - faster speed, clear pronunciation
            const titleText = line.replace("MAIN_TITLE:", "").trim();
            segments.push({
              text: titleText,
              speed: (options.speed || state.speed) * 1.15, // 15% faster
              pause: "long", // Long pause after main titles
            });
          } else if (line.startsWith("SUB_TITLE:")) {
            // Subtitles - slightly faster, medium pause
            const subtitleText = line.replace("SUB_TITLE:", "").trim();
            segments.push({
              text: subtitleText,
              speed: (options.speed || state.speed) * 1.1, // 10% faster
              pause: "medium", // Medium pause after subtitles
            });
          } else {
            // Body text - normal speed with longer pause after subtitles
            const previousSegment = segments[segments.length - 1];

            const pauseType =
              previousSegment && previousSegment.pause === "medium"
                ? "long"
                : "short";

            segments.push({
              text: line,
              speed: options.speed || state.speed,
              pause: pauseType, // Longer pause if following a subtitle
            });
          }
        }

        for (const segment of segments) {
          segment.text = segment.text
            .replace(/SUB_TITLE:/g, "")
            .replace(/MAIN_TITLE:/g, "");
        }

        return segments;
      };

      const textSegments = processTextWithSpeeds(cleanText);
      let currentSegmentIndex = 0;

      const speakSegment = (segmentIndex: number) => {
        if (segmentIndex >= textSegments.length) {
          // All segments complete
          setState((prev) => ({
            ...prev,
            isPlaying: false,
            isPaused: false,
            currentPosition: 0,
            progress: 0,
          }));
          positionRef.current = 0;
          options.onEnd?.();
          return;
        }

        const segment = textSegments[segmentIndex];
        let segmentText = segment.text;

        // Add appropriate pauses
        if (segment.pause === "long") {
          segmentText += ". . . . . . ."; // Extra long pause after main titles or after subtitles
        } else if (segment.pause === "medium") {
          segmentText += ". . . ."; // Medium pause after subtitles
        } else {
          segmentText += ". . . ."; // Short pause after body text
        }

        // Ensure proper punctuation spacing
        segmentText = segmentText
          .replace(/\s*([.!?])\s*/g, "$1 ")
          .replace(/\s*,\s*/g, ", ")
          .replace(/\s*:\s*/g, ": ")
          .replace(/\s*;\s*/g, "; ")
          .replace(/\s+/g, " ")
          .trim();

        const utterance = new SpeechSynthesisUtterance(segmentText);
        utteranceRef.current = utterance;

        // Voice selection
        const currentVoices = speechSynthesis.getVoices();
        const englishVoices = currentVoices.filter(
          (voice) =>
            voice.lang.toLowerCase().startsWith("en-") ||
            voice.lang.toLowerCase() === "en"
        );

        let voiceToUse = null;
        if (
          state.selectedVoice &&
          englishVoices.includes(state.selectedVoice)
        ) {
          voiceToUse = state.selectedVoice;
        } else if (englishVoices.length > 0) {
          voiceToUse = englishVoices[0];
        }

        if (voiceToUse) {
          utterance.voice = voiceToUse;
        }

        if (voiceToUse) {
          utterance.voice = voiceToUse;
          console.log("Using voice for segment:", voiceToUse.name);
        }

        // Configure speech parameters
        utterance.lang = "en-US";
        utterance.rate = segment.speed; // Use segment-specific speed
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Event handlers
        utterance.onstart = () => {
          setState((prev) => ({ ...prev, isPlaying: true, isPaused: false }));
        };

        utterance.onend = () => {
          // Move to next segment
          setTimeout(() => {
            speakSegment(segmentIndex + 1);
          }, 100);
        };

        utterance.onerror = () => {
          setState((prev) => ({
            ...prev,
            isPlaying: false,
            isPaused: false,
          }));
        };

        utterance.onboundary = (event) => {
          if (event.name === "word") {
            // Calculate overall progress across all segments
            const totalText = textSegments.map((s) => s.text).join(" ");
            const completedText = textSegments
              .slice(0, segmentIndex)
              .map((s) => s.text)
              .join(" ");
            const currentSegmentProgress =
              (event.charIndex / segmentText.length) * segment.text.length;
            const overallProgress =
              ((completedText.length + currentSegmentProgress) /
                totalText.length) *
              100;

            setState((prev) => ({
              ...prev,
              currentPosition: completedText.length + event.charIndex,
              progress: Math.min(overallProgress, 100),
            }));
            options.onProgress?.(completedText.length + event.charIndex);
          }
        };

        speechSynthesis.speak(utterance);
      };

      // Start speaking from first segment
      currentSegmentIndex = 0;
      speakSegment(0);
    },
    [isSupported, cleanTextForTTS, state.selectedVoice, state.speed]
  );

  // Pause speaking
  const pause = useCallback(() => {
    if (!isSupported()) return;
    speechSynthesis.pause();
    setState((prev) => ({ ...prev, isPaused: true, isPlaying: false }));
  }, [isSupported]);

  // Resume speaking
  const resume = useCallback(() => {
    if (!isSupported()) return;
    speechSynthesis.resume();
    setState((prev) => ({ ...prev, isPaused: false, isPlaying: true }));
  }, [isSupported]);

  // Stop speaking
  const stop = useCallback(() => {
    if (!isSupported()) return;
    speechSynthesis.cancel();
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentPosition: 0,
      progress: 0,
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
    setState((prev) => ({ ...prev, selectedVoice: voice }));
  }, []);

  // Set speed
  const setSpeed = useCallback(
    (speed: number) => {
      setState((prev) => ({ ...prev, speed }));

      // If currently speaking, restart with new speed
      if (state.isPlaying && utteranceRef.current) {
        const remainingText = textRef.current.slice(positionRef.current);
        speechSynthesis.cancel();

        setTimeout(() => {
          speak(remainingText, { speed });
        }, 100);
      }
    },
    [state.isPlaying, speak]
  );

  return {
    ...state,
    speak,
    pause,
    resume,
    stop,
    toggle,
    setVoice,
    setSpeed,
    isSupported: isSupported(),
  };
};
