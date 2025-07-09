import { useEffect, useRef, useState, useCallback } from 'react';
import { Howl } from 'howler';
import { Button } from '@/components/ui/button';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import WaveForm from '@/components/widgets/Player/WaveForm';

interface AudioPlayerProps {
  audioSrc: string;
}

export default function AudioPlayer({ audioSrc }: AudioPlayerProps) {
  const soundRef = useRef<Howl | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [state, setState] = useState({
    isLoading: true,
    progress: 0,
    duration: 0,
    volume: 1,
  });

  const updateProgress = () => {
    const sound = soundRef.current;
    if (sound && sound.playing()) {
      setState((prev) => ({ ...prev, progress: sound.seek() }));
    }
  };

  useEffect(() => {
    const sound = new Howl({
      src: [audioSrc],
      format: ['mp3'],
      html5: true,
      volume: state.volume,
    });

    sound.once('load', () => {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        duration: sound.duration(),
      }));
    });

    sound.once('end', () => {
      setIsPlaying(false);
      setState((prev) => ({ ...prev, progress: 0 }));
      clearInterval(intervalRef.current!);
    });

    soundRef.current = sound;

    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
        soundRef.current = null;
      }

      clearInterval(intervalRef.current!);

      if (audioSrc.startsWith('blob:')) {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [audioSrc]);

  const togglePlayback = useCallback(() => {
    const sound = soundRef.current;
    if (!sound) return;

    if (sound.playing()) {
      sound.pause();
      setIsPlaying(false);
      clearInterval(intervalRef.current!);
    } else {
      sound.play();
      setIsPlaying(true);
      intervalRef.current = setInterval(updateProgress, 500);
    }
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    const sound = soundRef.current;
    if (sound) {
      sound.seek(newTime);
      setState((prev) => ({ ...prev, progress: newTime }));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setState((prev) => ({ ...prev, volume: newVolume }));
    soundRef.current?.volume(newVolume);
  };

  return (
    <div className="relative flex flex-col gap-4 p-4 bg-zinc-900 rounded-xl shadow-lg">
      <div className="flex justify-center">
        <WaveForm isPlaying={isPlaying} width={12} />
      </div>

      <div className="relative z-10 mt-[70px] flex items-center gap-3">
        <Button
          onClick={togglePlayback}
          variant="outline"
          size="icon"
          aria-label={isPlaying ? 'Pause track' : 'Play track'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </Button>

        <span className="text-sm text-muted-foreground w-20">
          {state.isLoading ? 'Loading...' : `${Math.floor(state.progress)} / ${Math.floor(state.duration)}s`}
        </span>

        <input
          type="range"
          min="0"
          max={state.duration || 1}
          step="0.1"
          value={state.progress}
          onChange={handleSeek}
          className="w-full h-2 bg-zinc-600 rounded-lg accent-blue-400"
        />
        <div className="flex items-center gap-2">
          {state.volume > 0 ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={state.volume}
            onChange={handleVolumeChange}
            className="w-24 h-2 accent-blue-400"
          />
        </div>
      </div>
    </div>
  );
}
