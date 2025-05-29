import {GenresContract} from "@/interfaces/GenresContract.ts";
import {config} from "@/config.ts";

export class GenresHttp implements GenresContract {

    async getGenres(): Promise<string[]> {
        const response = await fetch(`${config.apiBaseUrl}/genres`)
        return await response.json() as Promise<string[]>;
    }
}

export const genresHttp = new GenresHttp();