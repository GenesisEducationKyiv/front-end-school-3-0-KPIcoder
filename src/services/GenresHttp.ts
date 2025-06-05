import {GenresContract} from "@/interfaces/GenresContract.ts";
import {config} from "@/config.ts";
import { genreSchema } from "@/schemas/genre/genre.ts";
export class GenresHttp implements GenresContract {

    async getGenres(): Promise<string[]> {
        const response = await fetch(`${config.apiBaseUrl}/genres`)
        const genres: unknown = await response.json()
        const { data, error } = await genreSchema.spa(genres)

        if (error || !data) {
            // TODO: handle error
            console.error(error);
        }
        return data!;
    }
}

export const genresHttp = new GenresHttp();