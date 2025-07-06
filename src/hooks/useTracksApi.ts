import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tracksService } from '@/services';
import { TrackDto } from '@/interfaces/dto/TrackDto.ts';
import { TracksFilterOptions } from '@/interfaces/TracksFilterOptions.ts';

const TRACKS_QUERY_KEY = 'tracks';

export const useTracksQuery = (filterOptions: TracksFilterOptions) =>
  useQuery({
    queryKey: [TRACKS_QUERY_KEY, filterOptions],
    queryFn: () => tracksService.getTracks(filterOptions),
  });

export const useAddTrackMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (trackData: TrackDto) => tracksService.addTrack(trackData),
    onSuccess: () =>
      queryClient
        .invalidateQueries({ queryKey: [TRACKS_QUERY_KEY] })
        .catch((err) =>
          err instanceof Error
            ? console.error(err)
            : console.error(new Error(`Unknown error during query ${TRACKS_QUERY_KEY} invalidation`))
        ),
  });
};

export const useUpdateTrackMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, trackData }: { id: string; trackData: TrackDto }) => tracksService.updateTrack(id, trackData),
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: [TRACKS_QUERY_KEY] })
        .catch((err) =>
          err instanceof Error
            ? console.error(err)
            : console.error(new Error(`Unknown error during query ${TRACKS_QUERY_KEY} invalidation`))
        );
    },
  });
};

export const useDeleteTrackMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tracksService.deleteTrack(id),
    onSettled: () => {
      queryClient
        .invalidateQueries({ queryKey: [TRACKS_QUERY_KEY] })
        .catch((err) =>
          err instanceof Error
            ? console.error(err)
            : console.error(new Error(`Unknown error during query ${TRACKS_QUERY_KEY} invalidation`))
        );
    },
  });
};

export const useDeleteTracksMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => tracksService.deleteTracks(ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TRACKS_QUERY_KEY] }),
  });
};

export const useUploadTrackFileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => tracksService.uploadTrackFile(id, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TRACKS_QUERY_KEY] }),
  });
};

export const useTrackAudio = (trackId: string) =>
  useQuery({
    queryKey: [TRACKS_QUERY_KEY, trackId],
    queryFn: () => tracksService.streamAudio(trackId),
    enabled: !!trackId,
  });

export const useDeleteTrackFileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tracksService.deleteTrackFile(id),
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: [TRACKS_QUERY_KEY] })
        .catch((err) =>
          err instanceof Error
            ? console.error(err)
            : console.error(new Error(`Unknown error during query ${TRACKS_QUERY_KEY} invalidation`))
        );
    },
  });
};
