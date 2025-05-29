import { TrackDto } from "./dto/TrackDto.ts";
import {Track} from "./Track.ts";
import { WithMetaData } from "./withMetaData.ts";
import { TracksFilterOptions } from "./TracksFilterOptions.ts";
export interface TracksContract {
    getTracks: (filterOptions: TracksFilterOptions) => Promise<WithMetaData<Track[], {total: number, limit: number}>>

    addTrack: (track: TrackDto) => Promise<Track>

    updateTrack: (id: string, track: TrackDto) => Promise<Track>

    deleteTrack: (id: string) => Promise<void>

    deleteTracks: (ids: string[]) => Promise<void>

    uploadTrackFile: (id: string, file: File) => Promise<void>

    deleteTrackFile: (id: string) => Promise<void>
}