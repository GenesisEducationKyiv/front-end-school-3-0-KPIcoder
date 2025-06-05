import { useUpdateTrackMutation } from "@/hooks/useTracksApi";
import { TrackDto } from "@/interfaces/dto/TrackDto";
import { Track } from "@/interfaces/Track";
import TrackForm from "@/components/TrackForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditTrackFormProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
}

const EditTrackForm = ({ isOpen, onClose, track }: EditTrackFormProps) => {
  const updateTrackMutation = useUpdateTrackMutation();
  
  const handleUpdateTrack = (trackData: TrackDto) => {
    if (!track) return;
    
    updateTrackMutation.mutate(
      { id: track.id, trackData },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };


  const trackFormData: Partial<TrackDto> = track ? {
    title: track.title,
    artist: track.artist,
    album: track.album,
    genres: track.genres,
    coverImage: track.coverImage
  } : {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="p-6 w-full max-w-md rounded-md bg-background border shadow-md z-50"
        onInteractOutside={(e) => {
          if (e.target && (e.target as HTMLElement).tagName === 'BUTTON') {
            e.preventDefault();
          }
        }}
      >
        <DialogTitle className="text-lg font-semibold mb-4">Edit Track</DialogTitle>
        
        <DialogDescription className="text-sm text-muted-foreground mb-4">
          Update the details for this track
        </DialogDescription>
        
        <div className="mt-2">
          {track && (
            <TrackForm
              defaultValues={trackFormData}
              btnText={updateTrackMutation.isPending ? "Saving..." : "Save Changes"}
              onSubmit={handleUpdateTrack}
            />
          )}
        </div>

        {updateTrackMutation.isError && (
          <p className="text-destructive text-sm mt-2" role="alert">
            Error: {updateTrackMutation.error.message}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditTrackForm;
