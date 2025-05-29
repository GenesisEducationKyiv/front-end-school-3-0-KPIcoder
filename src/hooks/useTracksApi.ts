import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {tracksHttp} from "../services/TracksHttp.ts";
import {TrackDto} from "@/interfaces/dto/TrackDto.ts";
import {TracksFilterOptions} from "@/interfaces/TracksFilterOptions.ts";

const TRACKS_QUERY_KEY = 'tracks';

export const useTracksQuery = (filterOptions: TracksFilterOptions) => useQuery({
    queryKey: [TRACKS_QUERY_KEY, filterOptions],
    queryFn: () => tracksHttp.getTracks(filterOptions),
});

export const useAddTrackMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (trackData: TrackDto) => tracksHttp.addTrack(trackData),
        onSuccess: () =>
            queryClient.invalidateQueries({queryKey: [TRACKS_QUERY_KEY]})
    });
};

export const useUpdateTrackMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, trackData}: { id: string, trackData: TrackDto }) =>
            tracksHttp.updateTrack(id, trackData),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [TRACKS_QUERY_KEY]});
        },

    });
};

export const useDeleteTrackMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => tracksHttp.deleteTrack(id),
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: [TRACKS_QUERY_KEY]});
        }
    });
};

export const useDeleteTracksMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ids: string[]) => tracksHttp.deleteTracks(ids),
        onSuccess: () =>
            queryClient.invalidateQueries({queryKey: [TRACKS_QUERY_KEY]})
    });
};

export const useUploadTrackFileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, file}: { id: string, file: File }) =>
            tracksHttp.uploadTrackFile(id, file),
        onSuccess: () =>
            queryClient.invalidateQueries({queryKey: [TRACKS_QUERY_KEY]})
    });
};

export const useDeleteTrackFileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => tracksHttp.deleteTrackFile(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [TRACKS_QUERY_KEY]});
        }
    });
};
