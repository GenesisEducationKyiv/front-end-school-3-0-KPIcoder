import {TracksContract} from "@/interfaces/TracksContract.ts";
import {config} from "@/config.ts";
import { TrackDto } from "@/interfaces/dto/TrackDto";
import { TracksFilterOptions } from "@/interfaces/TracksFilterOptions";
import { tracksWithMetadataSchema } from "@/schemas/track/tracksWithMetadata";
import { trackSchema } from "@/schemas/track/track";

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
        const tracksWithMetadata: unknown = await response.json()

        const { data, error } = await tracksWithMetadataSchema.spa(tracksWithMetadata)

        if (error || !data) {
            // TODO: handle error
            console.error(error);
        }

        return data!;
    }

    async addTrack(track: TrackDto) {
        const response = await fetch(`${config.apiBaseUrl}/tracks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(track),
        })

        const trackResponse: unknown = await response.json()
        const { data, error } = await trackSchema.spa(trackResponse)

        if (error || !data) {
            // TODO: handle error
            console.error(error);
        }
        return data!;
    }

    async updateTrack(id: string, track: TrackDto) {
        const response = await fetch(`${config.apiBaseUrl}/tracks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(track),
        })

        const trackResponse: unknown = await response.json()
        const { data, error } = await trackSchema.spa(trackResponse)

        if (error || !data) {
            // TODO: handle error
            console.error(error);
        }

        return data!;
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