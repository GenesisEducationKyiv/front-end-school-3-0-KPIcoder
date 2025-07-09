import clsx from 'clsx';

interface WaveformProps {
  isPlaying: boolean;
  bars?: number;
  color?: string;
  height?: number;
  width?: number;
}

export default function WaveForm({ isPlaying, bars = 20, color = '#4f46e5', height = 40, width = 4 }: WaveformProps) {
  return (
    <div className="flex items-end gap-[2px] h-[60px] overflow-hidden">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={clsx('rounded-sm', isPlaying ? `animate-wave animate-delay-${i % 10}` : '')}
          style={{
            width,
            height: `${Math.random() * height}px`,
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
}
