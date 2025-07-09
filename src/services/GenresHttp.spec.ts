import { describe, expect, it, vi } from 'vitest';
import { GenresHttp } from '@/services/GenresHttp.ts';

describe('GenresHttp', () => {
  it('Should return an array of Genres', async () => {
    const presetGenres = {
      data: ['genre 1', 'genre 2'],
      getResultObject: vi.fn(),
      getValueOrError: vi.fn(),
    };
    const genresHttp = new GenresHttp();
    genresHttp.getGenres = vi.fn<() => Promise<typeof presetGenres>>(() => Promise.resolve(presetGenres));

    const genres = await genresHttp.getGenres();
    expect(genres).toBe(presetGenres);
  });
});
