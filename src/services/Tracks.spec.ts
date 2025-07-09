import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { TracksHttp } from '@/services/TracksHttp.ts';
import { config } from '@/config.ts';
import { tracksWithMetadataSchema } from '@/schemas/track/tracksWithMetadata';
import { Track } from '@/interfaces/Track.ts';
import { WithMetaData } from '@/interfaces/withMetaData.ts';
import { DEFAULT_IMAGE_COVER } from '@/constants/default-image-url.ts';
import { TracksFilterOptions } from '@/interfaces/TracksFilterOptions.ts';

// Mock the dependencies
vi.mock('@/config.ts', () => ({
  config: {
    apiBaseUrl: 'https://api.example.com',
  },
}));

vi.mock('@/schemas/track/tracksWithMetadata', () => ({
  tracksWithMetadataSchema: {
    spa: vi.fn(),
  },
}));

describe('TracksHttp - getTracks', () => {
  let tracksHttp: TracksHttp;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    tracksHttp = new TracksHttp();
    mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch tracks with correct URL, validate schema, and return data', async () => {
    // Arrange - Test data variables
    const trackId = '1';
    const trackTitle = 'Test Track';
    const trackGenres = ['Genre1'];
    const trackSlug = 'test-track';
    const trackArtist = 'Test Artist';
    const trackAlbum = 'Test Album';
    const totalTracks = 1;
    const limitTracks = 10;
    const createdAt = new Date().toISOString();

    const mockTrack: Track = {
      id: trackId,
      title: trackTitle,
      genres: trackGenres,
      slug: trackSlug,
      artist: trackArtist,
      album: trackAlbum,
      createdAt,
      coverImage: DEFAULT_IMAGE_COVER,
    };

    const mockApiResponse = {
      data: [{ id: trackId, title: trackTitle }],
      meta: { total: totalTracks, limit: limitTracks },
    };

    const mockResponse = {
      json: vi.fn().mockResolvedValue(mockApiResponse),
    };

    const mockSchemaResult: { data: WithMetaData<Track[], { total: number; limit: number }>; success: true } = {
      data: {
        data: [mockTrack],
        meta: { total: totalTracks, limit: limitTracks },
      },
      success: true,
    };

    mockFetch.mockResolvedValue(mockResponse);
    vi.mocked(tracksWithMetadataSchema.spa).mockResolvedValue(mockSchemaResult);

    const filterOptions: TracksFilterOptions = {
      artist: 'Test Artist',
      search: 'test song',
      page: 1,
      limit: 10,
      genre: 'rock',
      sort: 'artist',
      order: 'desc',
    };

    // Act
    const result = await tracksHttp.getTracks(filterOptions);

    expect(mockFetch).toHaveBeenCalledWith(
      `${config.apiBaseUrl}/tracks?artist=Test+Artist&search=test+song&page=1&limit=10&genre=rock&sort=artist&order=desc`
    );
    expect(mockFetch).toHaveBeenCalledTimes(1);

    expect(mockResponse.json).toHaveBeenCalledTimes(1);

    expect(tracksWithMetadataSchema.spa).toHaveBeenCalledWith(mockApiResponse);
    expect(tracksWithMetadataSchema.spa).toHaveBeenCalledTimes(1);

    expect(result).toEqual(mockSchemaResult.data);
  });
});
