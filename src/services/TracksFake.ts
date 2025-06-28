import {TrackDto} from "@/interfaces/dto/TrackDto";
import {Track} from "@/interfaces/Track";
import {TracksContract} from "@/interfaces/TracksContract.ts";
import {TracksFilterOptions} from "@/interfaces/TracksFilterOptions";
import {WithMetaData} from "@/interfaces/withMetaData.ts";
import {promisifyValue} from "@/lib/utils.ts";
import {DEFAULT_IMAGE_COVER} from "@/constants/default-image-url.ts";

export class TracksFake implements TracksContract {
    private _tracks: Track[] = [];

    getTracks(filterOptions: TracksFilterOptions): Promise<WithMetaData<Track[], { total: number, limit: number }>> {
        const {limit, page} = filterOptions;
        const filtered = this.applyFilters(filterOptions);
        const tracks = filtered.slice((page - 1) * limit, page * limit);
        const withMeta = {
            data: tracks,
            meta: {
                total: filtered.length,
                limit,
            }

        }

        return promisifyValue(withMeta);
    };

    addTrack(track: TrackDto) {
        const newTrack: Track = {
            id: (this._tracks.length + 1).toString(),
            slug: track.title,
            createdAt: new Date().toISOString(),
            coverImage: track.coverImage ?? DEFAULT_IMAGE_COVER,
            ...track,
        }
        this._tracks.push(newTrack);

        return promisifyValue(newTrack);
    };

    updateTrack(id: string, track: TrackDto) {
        const idx = this._tracks.findIndex(track => track.id === id);
        const updatedTrack = {
            ...this._tracks[idx],
            ...track
        }
        this._tracks[idx] = updatedTrack;

        return promisifyValue(updatedTrack);
    };

    deleteTrack(id: string) {
        this._tracks = this._tracks.filter(track => track.id !== id);
        return promisifyValue(void 0);
    }

    async deleteTracks (ids: string[]) {
        return void await Promise.all(ids.map((id) => this.deleteTrack(id)));
    }

    uploadTrackFile (id: string, file: File) {
        const idx = this._tracks.findIndex(track => track.id === id);
        this._tracks[idx] = {
            ...this._tracks[idx],
            audioFile: file.name
        }
        return promisifyValue(void 0);
    }
    deleteTrackFile (id: string) {
        const idx = this._tracks.findIndex(track => track.id === id);
        this._tracks[idx] = {
            ...this._tracks[idx],
            audioFile: undefined
        }
        return promisifyValue(void 0);
    }

    private applyFilters(filterOptions: TracksFilterOptions) {
        let filtered: Track[] = [];
        const {artist, search, sort, order, genre} = filterOptions;

        if (artist) filtered = this._tracks.filter(track => track.artist.includes(artist));
        if (search) filtered = this._tracks.filter(track => track.title.includes(search));
        if (genre) filtered = this._tracks.filter(track => track.genres.includes(genre));
        if (sort) filtered = this._tracks.sort((a, b) => order === 'asc' ? a[sort].localeCompare(b[sort]) : b[sort].localeCompare(a[sort]));

        return filtered;
    }

}
