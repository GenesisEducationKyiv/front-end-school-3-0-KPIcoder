import {z as zsu} from "zod";

export const genreSchema = zsu.array(zsu.string().min(1).max(255));
