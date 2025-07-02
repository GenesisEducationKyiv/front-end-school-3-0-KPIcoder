import {useQuery} from "@tanstack/react-query";
import {genresService} from "@/services";

const GENRES_QUERY_KEY = 'genres';

export const useGenresQuery = () => {

    const {data: response, isLoading} = useQuery({
        queryKey: [GENRES_QUERY_KEY],
        queryFn: genresService.getGenres.bind(genresService),
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
