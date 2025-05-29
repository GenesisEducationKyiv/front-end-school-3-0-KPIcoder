import {useQuery} from "@tanstack/react-query";
import {genresHttp} from "@/services/GenresHttp.ts";

const GENRES_QUERY_KEY = 'genres';

export const useGenresQuery = () => useQuery({
    queryKey: [GENRES_QUERY_KEY],
    queryFn: genresHttp.getGenres,
    // cache for ten minutes
    gcTime: 10 * 60 * 1000,
});

// For backward compatibility
export const useGenresApi = useGenresQuery;