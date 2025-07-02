import {GenresContract} from "@/interfaces/GenresContract.ts";
import {config} from "@/config.ts";
import { genreSchema } from "@/schemas/genre/genre.ts";
import {Result} from "@/lib/monads/Result.ts";

export class GenresHttp implements GenresContract {

    async getGenres(): Promise<Result<string[], Error>> {
        try {
            const response = await fetch(`${config.apiBaseUrl}/genres`);

            if (!response.ok) {
                return Result.setError(new Error(`HTTP ${response.status}: ${response.statusText}`));
            }

            const genres: unknown = await response.json();
            const { data, error } = await genreSchema.spa(genres);

            if (error || !data) {
                return Result.setError(error ?? new Error('Unknown schema error'));
            }

            return Result.setValue(data);
        } catch (err) {
            return Result.setError(err instanceof Error ? err : new Error('Unexpected error'));
        }
    }
}
