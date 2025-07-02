import {GenresContract} from "@/interfaces/GenresContract.ts";
import {Result} from "@/lib/monads/Result";
import {createConnectTransport} from "@connectrpc/connect-web";
import {config} from "@/config.ts";
import {createClient} from "@connectrpc/connect";
import {GenreService} from "@/gen/app/genres/v1/genres_pb.ts";
import {genreSchema} from "@/schemas/genre/genre.ts";

export class GenresRpc implements GenresContract {
    private rpcClient

    constructor() {
        const transport = createConnectTransport({
            baseUrl: config.apiBaseUrl,
            useBinaryFormat: false, // json for testing purpose
        })
        this.rpcClient = createClient(GenreService, transport)
    }

    async getGenres(): Promise<Result<string[], Error>> {
        try {
            const {genres} = await this.rpcClient.getGenres({})
            const {data, error} = await genreSchema.spa(genres);

            if (error || !data) {
                return Result.setError(error ?? new Error('Unknown schema error'));
            }

            return Result.setValue(data);
        } catch (e) {
            return Result.setError(e instanceof Error ? e : new Error('Unexpected error'));
        }

    }
}
