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
    speed,
    availableVoices,
    speak,
    pause,
    resume,
    stop,
    toggle,
    setVoice,
    setSpeed,
    isSupported
  } = useTTS();

  const [isExpanded, setIsExpanded] = useState(false);

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

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className={`bg-[#1a1f3a] border border-primary/20 rounded-lg transition-all duration-300 ${className}`}>
      {/* Main Controls Bar */}
      <div className="flex items-center gap-4 p-4">
        {/* Play/Pause Button */}
        <button
          onClick={handlePlay}
          className="flex items-center justify-center w-10 h-10 bg-primary hover:bg-primary-accent text-white rounded-full transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
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

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-text-secondary hover:text-primary transition-colors text-sm"
        >
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="border-t border-primary/20 p-4 space-y-4">
          {/* Speed Control */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-text-secondary w-16">Speed:</label>
            <div className="flex gap-1">
              {speedOptions.map((speedOption) => (
                <button
                  key={speedOption}
                  onClick={() => setSpeed(speedOption)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    speed === speedOption
                      ? 'bg-primary text-white'
                      : 'bg-background border border-primary/20 text-text-secondary hover:text-primary hover:border-primary/40'
                  }`}
                >
                  {speedOption}x
                </button>
              ))}
            </div>
          </div>

          {/* Voice Selection */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-text-secondary w-16">Voice:</label>
            <select
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const voice = availableVoices.find(v => v.name === e.target.value);
                if (voice) setVoice(voice);
              }}
              className="flex-1 bg-background border border-primary/20 text-text-secondary text-sm px-3 py-2 rounded focus:border-primary focus:outline-none"
            >
              {availableVoices
                .filter(voice => voice.lang.includes('en'))
                .map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
            </select>
          </div>

          {/* Instructions */}
          <div className="text-xs text-text-secondary/70 pt-2 border-t border-primary/10">
            <p>Keyboard shortcuts: Space to play/pause, Esc to stop</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TTSControls;