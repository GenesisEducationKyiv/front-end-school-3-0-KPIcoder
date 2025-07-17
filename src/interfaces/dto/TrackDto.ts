import { z as zsu } from 'zod';

export const TrackDtoSchema = zsu.object({
  title: zsu.string().min(1, 'Title is required'),
  artist: zsu.string().min(1, 'Artist is required'),
  album: zsu.string().min(1, 'Album is required'),
  genres: zsu.array(zsu.string().min(1, 'Genre cannot be empty')).min(1, 'At least one genre is required'),
  coverImage: zsu
    .union([zsu.string().url('Invalid cover image URL format'), zsu.string().length(0), zsu.undefined()])
    .optional(),
});

export type TrackDto = zsu.infer<typeof TrackDtoSchema>;
