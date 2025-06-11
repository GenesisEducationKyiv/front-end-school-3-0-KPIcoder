import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { useUploadTrackFileMutation } from "@/hooks/useTracksApi";
import { Button } from "./ui/button";
import { FileUpload } from "./ui/file-upload";
import AudioTrack from "./AudioTrack";
import { AlertCircle } from "lucide-react";

interface UploadAudioModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  trackId: string;
}

const ACCEPTED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-wav'];

export default function UploadAudioModal({ open, setOpen, trackId }: UploadAudioModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const uploadTrackFileMutation = useUploadTrackFileMutation();

  useEffect(() => {
    if (file) {
      if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
        setFile(null);
        console.warn('Invalid file type', file.type);
        return;
      }

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      const objectURL = URL.createObjectURL(file);
      setAudioUrl(objectURL);
    }

    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [file, audioUrl]);

  const handleUpload = () => {
    if (file) {
      uploadTrackFileMutation.mutate(
        { id: trackId, file },
        {
          onSuccess: () => {
            setOpen(false);
            setFile(null);
          },
        }
      );
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFile(null);
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-xl font-semibold mb-4">Upload Audio File</DialogTitle>        

        <FileUpload
          value={file}
          onChange={setFile}
          accept={ACCEPTED_AUDIO_TYPES}
          maxSize={10}
        >
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground font-medium">
              Drag & drop audio file here or click to browse
            </p>
            <p className="text-xs text-muted-foreground/70">
              Supports MP3, WAV, FLAC and other audio formats
            </p>
          </div>
        </FileUpload>

        {file && audioUrl && (
          <AudioTrack file={file} audioSrc={audioUrl} data-testid={`audio-player-${trackId}`} />
        )}
        
        <div className="flex justify-end gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          
          <Button 
            disabled={!file || uploadTrackFileMutation.isPending}
            onClick={handleUpload}
          >
            {uploadTrackFileMutation.isPending ? 'Uploading...' : 'Upload'}
          </Button>

          {uploadTrackFileMutation.error && (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-red-500">{uploadTrackFileMutation.error.message}</p>
            </div>
           )}
        </div>
      </DialogContent>
    </Dialog>
  );
}