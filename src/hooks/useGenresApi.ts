import {useQuery} from "@tanstack/react-query";
import {genresHttp} from "@/services/GenresHttp.ts";

const GENRES_QUERY_KEY = 'genres';

export const useGenresQuery = () => {

    const {data: response, isLoading} = useQuery({
        queryKey: [GENRES_QUERY_KEY],
        queryFn: genresHttp.getGenres.bind(genresHttp),
        retry: false,
        throwOnError: false,
        // cache for ten minutes
        gcTime: 10 * 60 * 1000,
    });

    const resultObject = response?.getResultObject()
    const {data, error} = resultObject?.ok
        ? {data: resultObject.value}
        : {error: resultObject?.error}

    return {data, error, isLoading};
}
