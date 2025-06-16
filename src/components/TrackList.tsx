import { Track } from "../interfaces/Track"
import TrackRow from "./TrackRow"
import { useState } from "react"
import EditTrackForm from "./EditTrackForm"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"
import { useDeleteTracksMutation } from "@/hooks/useTracksApi"
import { Checkbox } from "@/components/ui/checkbox"
import ConfirmationModal from "./widgets/ConfirmationModal"
import { ButtonSpinner } from "./ui/button-spinner"

interface TrackListProps {
  tracks: Track[]
}

const TrackList = ({ tracks }: TrackListProps) => {
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showBulkDeleteConfirmation, setShowBulkDeleteConfirmation] = useState(false);
  
  const deleteTracksMutation = useDeleteTracksMutation();

  const handleEditTrack = (track: Track) => {
    setEditingTrack(track);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingTrack(null);
  };

  const handleSelectTrack = (track: Track) => {
    setSelectedTracks([...selectedTracks, track]);
  };

  const handleTrackSelection = (track: Track, isSelected: boolean) => {
    if (isSelected) {
      setSelectedTracks(prev => [...prev, track]);
    } else {
      setSelectedTracks(prev => prev.filter(t => t.id !== track.id));
    }
  };

  const handleSelectAll = () => {
    if (selectedTracks.length === tracks.length) {
      setSelectedTracks([]);
    } else {
      setSelectedTracks([...tracks]);
    }
  };

  const handleDeleteClick = () => {
    setShowBulkDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTracks.length === 0) return;
    
    const trackIds = selectedTracks.map(track => track.id);
    
    deleteTracksMutation.mutate(trackIds, {
      onSuccess: () => {
        setSelectedTracks([]);
        setShowBulkDeleteConfirmation(false);
      }
    });
  };

  const handleCancelDelete = () => {
    setShowBulkDeleteConfirmation(false);
  };

  const areAllSelected = tracks.length > 0 && selectedTracks.length === tracks.length;
  const areSomeSelected = selectedTracks.length > 0 && selectedTracks.length < tracks.length;

  if (!tracks || tracks.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">No tracks found</div>;
  }


  const getConfirmationText = () => {
    const trackNames = selectedTracks.map(track => `"${track.title}"`);
    
    if (trackNames.length <= 3) {
      return (
        <div className="space-y-2">
          <p>Are you sure you want to delete the following {trackNames.length} track{trackNames.length !== 1 ? 's' : ''}?</p>
          <ul className="list-disc pl-5">
            {trackNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
          <p className="text-sm text-red-500 font-medium mt-2">This action cannot be undone.</p>
        </div>
      );
    } else {
      return (
        <div className="space-y-2">
          <p>
            Are you sure you want to delete {trackNames.length} tracks, including:
          </p>
          <ul className="list-disc pl-5">
            {trackNames.slice(0, 3).map((name, index) => (
              <li key={index}>{name}</li>
            ))}
            <li className="font-medium">And {trackNames.length - 3} more...</li>
          </ul>
          <p className="text-sm text-red-500 font-medium mt-2">This action cannot be undone.</p>
        </div>
      );
    }
  };

  return (
    <>
      {selectedTracks.length > 0 && (
        <div className="flex justify-between items-center bg-muted p-3 rounded-md mb-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{selectedTracks.length} track{selectedTracks.length !== 1 ? 's' : ''} selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDeleteClick}
              disabled={deleteTracksMutation.isPending}
              className="flex items-center space-x-1"
              data-testid="bulk-delete-button"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              <span>Delete Selected</span>
            </Button>
          </div>
        </div>
      )}

      <div className="border rounded-md overflow-hidden">
        <div className="flex flex-row justify-between items-center p-3 bg-muted font-medium text-sm">
          <div className="flex-1 flex items-center">
            <Checkbox 
              checked={areAllSelected}
              className="mr-2 border-black"
              onCheckedChange={() => handleSelectAll()}
              aria-label={areAllSelected ? "Deselect all tracks" : "Select all tracks"}
              data-state={areAllSelected ? "checked" : areSomeSelected ? "indeterminate" : "unchecked"}
              data-testid="select-all"
            />
            <span className="ml-14">TITLE</span>
          </div>
          <div className="hidden md:block flex-1">ALBUM</div>
          <div className="w-24 text-right">ACTIONS</div>
        </div>

        <div>
          {tracks.map((track) => (
            <TrackRow 
              key={track.id} 
              track={track} 
              handleClickEdit={handleEditTrack} 
              handleClickSelect={handleSelectTrack}
              isSelected={selectedTracks.some(t => t.id === track.id)}
              onSelectChange={handleTrackSelection}
            />
          ))}
        </div>
      </div>

      <EditTrackForm 
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        track={editingTrack}
      />

      <ConfirmationModal
        open={showBulkDeleteConfirmation}
        setOpen={setShowBulkDeleteConfirmation}
        title={`Delete ${selectedTracks.length} Track${selectedTracks.length !== 1 ? 's' : ''}`}
        text={getConfirmationText()}
        handleClickConfirm={handleConfirmDelete}
        handleClickCancel={handleCancelDelete}
        confirmText={
          deleteTracksMutation.isPending ? (
            <>
              <ButtonSpinner loading={true} className="mr-1" />
              Deleting...
            </>
          ) : (
            "Delete All"
          )
        }
        confirmVariant="destructive"
        showWarningIcon={true}
        isLoading={deleteTracksMutation.isPending}
      />
    </>
  )
}

export default TrackList
