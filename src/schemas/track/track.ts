import {z as zsu} from "zod";

export const trackSchema = zsu.object({
    id: zsu.string(),
    title: zsu.string(),
    artist: zsu.string(),
    album: zsu.string(),
    genres: zsu.array(zsu.string()),
    slug: zsu.string(),
    coverImage: zsu.string(),
    audioFile: zsu.string()
});
