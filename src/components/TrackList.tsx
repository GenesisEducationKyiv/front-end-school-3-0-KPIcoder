import { Track } from "../interfaces/Track";
import TrackRow from "./TrackRow";
import { useState } from "react";
import EditTrackForm from "./EditTrackForm";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { useDeleteTracksMutation } from "@/hooks/useTracksApi";
import { Checkbox } from "@/components/ui/checkbox";
import ConfirmationModal from "./widgets/ConfirmationModal";
import { ButtonSpinner } from "./ui/button-spinner";
import {
    useTrackSelectionStore,
    getSelectedIds,
    areAllSelected,
    getSelectedCount
} from "@/stores/useTrackSelectionStore";

interface TrackListProps {
    tracks: Track[];
}

const TrackList = ({ tracks }: TrackListProps) => {
    const [editingTrack, setEditingTrack] = useState<Track | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [showBulkDeleteConfirmation, setShowBulkDeleteConfirmation] = useState(false);

    const deleteTracksMutation = useDeleteTracksMutation();

    const { selectedIds, clear, selectAll } = useTrackSelectionStore();

    const selectedIdsArray = getSelectedIds(selectedIds);
    const selectedCount = getSelectedCount(selectedIds);
    const allSelected = areAllSelected(selectedIds, tracks);

    const handleClickSelect = (track: Track) => {
        console.log("Playing track:", track.title);
    };

    const handleEditTrack = (track: Track) => {
        setEditingTrack(track);
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setEditingTrack(null);
    };

    const handleSelectAll = () => {
        if (allSelected) {
            clear();
        } else {
            selectAll(tracks);
        }
    };

    const handleDeleteClick = () => {
        setShowBulkDeleteConfirmation(true);
    };

    const handleConfirmDelete = () => {
        if (selectedIdsArray.length === 0) return;
        deleteTracksMutation.mutate(selectedIdsArray, {
            onSuccess: () => {
                clear();
                setShowBulkDeleteConfirmation(false);
            },
        });
    };

    const handleCancelDelete = () => {
        setShowBulkDeleteConfirmation(false);
    };

    if (!tracks || tracks.length === 0) {
        return <div className="text-center py-6 text-muted-foreground">No tracks found</div>;
    }

    const getConfirmationText = () => {
        const trackNames = tracks
            .filter((t) => selectedIds.has(t.id))
            .map((track) => `"${track.title}"`);

        if (trackNames.length <= 3) {
            return (
                <div className="space-y-2">
                    <p>
                        Are you sure you want to delete the following {trackNames.length} track
                        {trackNames.length !== 1 ? "s" : ""}?
                    </p>
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
                    <p>Are you sure you want to delete {trackNames.length} tracks, including:</p>
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
            {selectedCount > 0 && (
                <div className="flex justify-between items-center bg-muted p-3 rounded-md mb-4 animate-in slide-in-from-top-4 duration-200">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                            {selectedCount} track{selectedCount !== 1 ? "s" : ""} selected
                        </span>
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
                            checked={allSelected}
                            className="mr-2 border-black"
                            onCheckedChange={handleSelectAll}
                            aria-label={allSelected ? "Deselect all tracks" : "Select all tracks"}
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
                            handleClickSelect={handleClickSelect}
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
                title={`Delete ${selectedCount} Track${selectedCount !== 1 ? "s" : ""}`}
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
    );
};

export default TrackList;
