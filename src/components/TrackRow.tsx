import {useState} from "react";
import { Trash2, Edit, Play, Upload } from "lucide-react";

import { Track } from "../interfaces/Track";
import { useDeleteTrackMutation } from "@/hooks/useTracksApi";
import { useTrackSelectionStore, isSelected } from "@/stores/useTrackSelectionStore";
import { MenuDropdown, MenuDropdownItem } from "./ui/menu-dropdown";
import { cn } from "@/lib/utils";
import { DEFAULT_IMAGE_COVER } from "@/constants/default-image-url";
import { Checkbox } from "@/components/ui/checkbox";
import UploadAudioModal from "./UploadAudioModal";
import ConfirmationModal from "./widgets/ConfirmationModal";
import { ButtonSpinner } from "./ui/button-spinner";

interface TrackRowProps {
  track: Track;
  handleClickEdit: (track: Track) => void;
  handleClickSelect: (track: Track) => void;
}

const TrackRow = ({ track, handleClickEdit, handleClickSelect }: TrackRowProps) => {
  // Get store state and actions
  const { selectedIds, toggle } = useTrackSelectionStore();

  // Compute if this track is selected using helper function
  const trackIsSelected = isSelected(selectedIds, track.id);

  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const deleteTrackMutation = useDeleteTrackMutation();

  const handleDeleteClick = () => setShowDeleteConfirmation(true);
  const handleConfirmDelete = () => deleteTrackMutation.mutate(track.id);
  const handleCancelDelete = () => setShowDeleteConfirmation(false);

  const handleToggleSelection = () => toggle(track.id);

  const menuItems: MenuDropdownItem[] = [
    {
      icon: <Play className="h-4 w-4" />,
      label: "Play",
      onClick: () => handleClickSelect(track),
    },
    {
      icon: <Edit className="h-4 w-4" />,
      label: "Edit",
      onClick: () => handleClickEdit(track),
    },
    {
      icon: <Trash2 className="h-4 w-4" />,
      label: "Delete",
      onClick: handleDeleteClick,
      disabled: deleteTrackMutation.isPending,
      variant: "destructive",
    },
    {
      icon: <Upload className="h-4 w-4" />,
      label: "Upload Audio",
      onClick: () => setShowDialog(true),
    },
  ];

  return (
      <div
          className={cn(
              "flex flex-row justify-between items-center p-3 border-b hover:bg-muted/40 transition-colors group",
              trackIsSelected && "bg-muted/60"
          )}
      >
        <div className="flex items-center space-x-4 flex-1">
          <Checkbox
              checked={trackIsSelected}
              onCheckedChange={handleToggleSelection}
              className="mr-2 border-black"
              aria-label={`Select ${track.title}`}
              data-testid={`track-checkbox-${track.id}`}
          />

          <div className="relative min-w-[3rem] h-12 max-w-[3rem] rounded overflow-hidden">
            <img
                src={track.coverImage || DEFAULT_IMAGE_COVER}
                alt={`${track.title} cover`}
                className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex flex-col">
              <span className="font-medium">{track.title}</span>
              <span className="text-sm text-muted-foreground">{track.artist}</span>
            </div>
          </div>
        </div>

        <div className="hidden md:block flex-1">{track.album}</div>

        <div className="flex items-center">
          <MenuDropdown
              items={menuItems}
              align="right"
              triggerClassName="opacity-0 group-hover:opacity-100"
          />
        </div>

        <UploadAudioModal open={showDialog} setOpen={setShowDialog} trackId={track.id} />

        <ConfirmationModal
            open={showDeleteConfirmation}
            setOpen={setShowDeleteConfirmation}
            title="Delete Track"
            text={`Are you sure you want to delete "${track.title}"? This action cannot be undone.`}
            handleClickConfirm={handleConfirmDelete}
            handleClickCancel={handleCancelDelete}
            confirmText={
              deleteTrackMutation.isPending ? (
                  <>
                    <ButtonSpinner loading={true} className="mr-1" />
                    Deleting...
                  </>
              ) : (
                  "Delete"
              )
            }
            confirmVariant="destructive"
            showWarningIcon={true}
            isLoading={deleteTrackMutation.isPending}
        />
      </div>
  );
};

export default TrackRow;
