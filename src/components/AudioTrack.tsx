import { Play } from 'lucide-react';

const getFileSizeInMB = (file: File) => (file.size / (1024 * 1024)).toFixed(2);

export default function AudioTrack({ file, audioSrc }: { file: File; audioSrc: string }) {
  return (
    <div className="mt-4 space-y-3 animate-in fade-in-50 duration-200">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-1">
          <Play className="h-4 w-4" /> Audio Preview
        </h3>
      </div>

      <audio src={audioSrc} controls className="w-full h-10 rounded" />

      <div className="text-xs text-muted-foreground">
        Type: {file.type} | Size: {getFileSizeInMB(file)} MB
      </div>
    </div>
  );
}
