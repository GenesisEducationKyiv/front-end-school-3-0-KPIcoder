import {getRouteApi, useNavigate} from "@tanstack/react-router";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {useTracksQuery} from "@/hooks/useTracksApi.ts";
import TrackList from "@/components/TrackList";
import AddTrackForm from "@/components/AddTrackForm";
import TrackFilters from "@/components/TrackFilters";
import {Button} from "@/components/ui/button";
import {TracksFilterOptions} from "@/interfaces/TracksFilterOptions";
import {LoadingSpinner} from "../ui/spinner";

const routeApi = getRouteApi('/tracks')

const TracksWidget = () => {
    const navigate = useNavigate();

    const {
        search,
        genre,
        artist,
        sort,
        order,
        page,
        limit
    } = routeApi.useSearch();


    const filterOptions: TracksFilterOptions = {
        page,
        limit,
        sort,
        order,
        search,
        genre,
        artist
    };

    const {data, error, isLoading} = useTracksQuery(filterOptions);

    const totalTracks = data?.meta?.total || 0;
    const totalPages = Math.ceil(totalTracks / limit);
    const showingFrom = totalTracks > 0 ? (page - 1) * limit + 1 : 0;
    const showingTo = Math.min(page * limit, totalTracks);

    const handlePreviousPage = () => {
        if (page > 1) {
            void navigate({
                to: '/tracks',
                search: (prev) => ({
                    ...prev,
                    page: (page - 1)
                }),
                replace: true
            });
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            void navigate({
                to: '/tracks',
                search: (prev) => ({
                    ...prev,
                    page: (page + 1)
                }),
                replace: true
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Your Music Library</h3>
            </div>

            <AddTrackForm/>

            <div className="mb-4">
                <TrackFilters/>
            </div>

            {isLoading ? (
                <LoadingSpinner message="Loading tracks..." data-testid="loading-tracks"/>
            ) : error ? (
                <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
                    Error: {error.message}
                </div>
            ) : (
                <>
                    <TrackList tracks={data?.data || []}/>

                    {totalTracks > 0 && (
                        <div className="flex flex-col items-center space-y-2 mt-6" data-testid="pagination">
                            <div className="text-sm text-muted-foreground">
                                Showing {showingFrom} to {showingTo} of {totalTracks} tracks
                            </div>

                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePreviousPage}
                                    disabled={page <= 1}
                                    data-testid="pagination-prev"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1"/>
                                    Previous
                                </Button>

                                <div className="text-sm">
                                    Page {page} of {totalPages || 1}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={page >= totalPages}
                                    data-testid="pagination-next"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1"/>
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TracksWidget;