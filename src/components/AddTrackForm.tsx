import { useState } from "react";
import { useAddTrackMutation } from "@/hooks/useTracksApi";
import { Button } from "@/components/ui/button";
import { TrackDto } from "@/interfaces/dto/TrackDto";
import TrackForm from "@/components/TrackForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { DEFAULT_IMAGE_COVER } from "@/constants/default-image-url";


export default function AddTrackForm() {
  const [open, setOpen] = useState(false);
  const addTrackMutation = useAddTrackMutation();

  const defaultValues: Partial<TrackDto> = {
    title: "",
    artist: "",
    album: "",
    genres: [],
    coverImage: ""
  };

  const handleAddTrack = (trackData: TrackDto) => {
    let dto = trackData;
    if(!trackData.coverImage) dto = {...trackData,coverImage: DEFAULT_IMAGE_COVER};
    addTrackMutation.mutate(dto, {
      onSuccess: () => {
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black text-white hover:bg-black/90" data-testid="create-track-button">
          <PlusCircle className="h-4 w-4 mr-2" />
          <span>Add Track</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 w-full max-w-md rounded-md bg-background border shadow-md z-50"
        onInteractOutside={(e) => {
          if (e.target && (e.target as HTMLElement).tagName === 'BUTTON') {
            e.preventDefault();
          }
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <DialogTitle className="text-lg font-semibold">Add New Track</DialogTitle>
      
        </div>
        
        <DialogDescription className="text-sm text-muted-foreground mb-4">
          Fill in the details below to add a new track to the library
        </DialogDescription>
        
        <div className="mt-2">
          <TrackForm 
            defaultValues={defaultValues} 
            btnText={addTrackMutation.isPending ? "Adding..." : "Add Track"} 
            onSubmit={handleAddTrack} 
          />
        </div>

        {addTrackMutation.isError && (
          <p className="text-destructive text-sm mt-2" role="alert">
            Error: {addTrackMutation.error.message}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
