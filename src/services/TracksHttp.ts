import {TracksContract} from "@/interfaces/TracksContract.ts";
import {config} from "@/config.ts";
import {Track} from "@/interfaces/Track.ts";
import { WithMetaData } from "@/interfaces/withMetaData.ts";
import { TrackDto } from "@/interfaces/dto/TrackDto";
import { TracksFilterOptions } from "@/interfaces/TracksFilterOptions";

export class TracksHttp implements TracksContract {

    async getTracks(filterOptions: TracksFilterOptions) {
        const queryParams = new URLSearchParams();
        if (filterOptions.page) queryParams.set('page', filterOptions.page.toString());
        if (filterOptions.limit) queryParams.set('limit', filterOptions.limit.toString());
        if (filterOptions.sort) queryParams.set('sort', filterOptions.sort);
        if (filterOptions.order) queryParams.set('order', filterOptions.order);
        if (filterOptions.search) queryParams.set('search', filterOptions.search);
        if (filterOptions.genre) queryParams.set('genre', filterOptions.genre);
        if (filterOptions.artist) queryParams.set('artist', filterOptions.artist);
        
        const response = await fetch(`${config.apiBaseUrl}/tracks?${queryParams.toString()}`)
        return await response.json() as Promise<WithMetaData<Track[], {total: number, limit: number}>>;
    }

    async addTrack(track: TrackDto) {
        console.log(track);
        const response = await fetch(`${config.apiBaseUrl}/tracks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(track),
        })
        return await response.json() as Promise<Track>;
    }

    async updateTrack(id: string, track: TrackDto) {
        const response = await fetch(`${config.apiBaseUrl}/tracks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(track),
        })
        return await response.json() as Promise<Track>;
    }

    async deleteTrack(id: string) {
        const response = await fetch(`${config.apiBaseUrl}/tracks/${id}`, {
            method: 'DELETE',
        })
        return await response.json() as Promise<void>;
    }

    async deleteTracks(ids: string[]) {
        const response = await fetch(`${config.apiBaseUrl}/tracks/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids }),
        })
        return await response.json() as Promise<void>;
    }

    async uploadTrackFile(id: string, file: File) {
        const response = await fetch(`${config.apiBaseUrl}/tracks/${id}/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': `audio/mp3`,
            },
            body: file,
        })
        return await response.json() as Promise<void>;
    }

    async deleteTrackFile(id: string) {
        const response = await fetch(`${config.apiBaseUrl}/tracks/${id}/file`, {
            method: 'DELETE',
        })  
        return await response.json() as Promise<void>;
    }
    
    
}

export const tracksHttp = new TracksHttp();