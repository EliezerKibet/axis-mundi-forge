import { Play, Pause, Square, Volume2 } from 'lucide-react';
import { useTTS } from '../hooks/useTTS';
import { useEffect, useState } from 'react';

interface TTSControlsProps {
  content: string;
  title: string;
  className?: string;
}

const TTSControls = ({ content, title, className = '' }: TTSControlsProps) => {
  const {
    isPlaying,
    isPaused,
    progress,
    selectedVoice,
    speak,
    pause,
    resume,
    stop,
    toggle,
    isSupported
  } = useTTS();

  // Auto-scroll to highlight current text
  useEffect(() => {
    if (isPlaying && progress > 0) {
      // Scroll to current reading position
      const scrollPercent = progress / 100;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: maxScroll * scrollPercent,
        behavior: 'smooth'
      });
    }
  }, [isPlaying, progress]);

  if (!isSupported) {
    return (
      <div className={`bg-[#1a1f3a] border border-primary/20 p-4 rounded-lg ${className}`}>
        <div className="flex items-center gap-3 text-text-secondary">
          <Volume2 className="w-5 h-5" />
          <div>
            <p className="text-sm">Text-to-speech is not supported in your browser.</p>
            <p className="text-xs mt-1">Try Chrome, Firefox, Safari, or Edge for audio features.</p>
          </div>
        </div>
      </div>
    );
  }

  const handlePlay = () => {
    if (!isPlaying && !isPaused) {
      const fullText = `${title}. ${content}`;
      speak(fullText);
    } else {
      toggle();
    }
  };

  return (
    <div className={`bg-[#1a1f3a] border border-primary/20 rounded-lg transition-all duration-300 ${className}`}>
      {/* Main Controls Bar */}
      <div className="flex items-center gap-4 p-4">
        {/* Play/Pause Button */}
        <button
          onClick={handlePlay}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-accent text-background transition-colors font-medium tracking-wide"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'PAUSE READING' : 'LISTEN TO ARTICLE'}
        </button>

        {/* Stop Button */}
        {(isPlaying || isPaused) && (
          <button
            onClick={stop}
            className="flex items-center justify-center w-8 h-8 bg-text-secondary/20 hover:bg-text-secondary/30 text-text-secondary rounded transition-colors"
            aria-label="Stop"
          >
            <Square className="w-4 h-4" />
          </button>
        )}

        {/* Progress Bar */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-secondary">
              {isPlaying || isPaused ? 'Reading Article' : 'Ready to Read'}
            </span>
            <span className="text-xs text-primary">
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="w-full bg-background border border-primary/20 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Voice Info */}
      <div className="px-4 pb-4">
        <span className="text-xs text-text-secondary flex items-center gap-2">
          🎤 {selectedVoice?.name || 'Default Voice'} • 1x Speed
        </span>
      </div>
    </div>
  );
};

export default TTSControls;