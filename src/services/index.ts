import {GenresHttp} from "@/services/GenresHttp.ts";
import {config} from "@/config.ts";
import {GenresRpc} from "@/services/GenresRpc.ts";
import {GenresContract} from "@/interfaces/GenresContract.ts";
import {TracksContract} from "@/interfaces/TracksContract.ts";
import {TracksHttp} from "@/services/TracksHttp.ts";
import {TracksRpc} from "@/services/TracksRpc.ts";

export const genresService: GenresContract = config.adapter === 'rpc' ? new GenresRpc() : new GenresHttp()
export const tracksService: TracksContract = config.adapter === 'rpc' ? new TracksRpc() : new TracksHttp()
