import { TrackDto } from '@/interfaces/dto/TrackDto';
import { TracksContract } from '@/interfaces/TracksContract.ts';
import { TracksFilterOptions } from '@/interfaces/TracksFilterOptions';
import { createConnectTransport } from '@connectrpc/connect-web';
import { config } from '@/config.ts';
import { createClient } from '@connectrpc/connect';
import { TrackService } from '@/gen/app/tracks/v1/tracks_pb.ts';
import { trackSchema } from '@/schemas/track/track.ts';
import { tracksWithMetadataSchema } from '@/schemas/track/tracksWithMetadata.ts';

export class TracksRpc implements TracksContract {
  private rpcClient;

  constructor() {
    const transport = createConnectTransport({
      baseUrl: config.apiBaseUrl,
      useBinaryFormat: true,
    });
    this.rpcClient = createClient(TrackService, transport);
  }

  async getTracks(filterOptions: TracksFilterOptions) {
    const trackResponse = await this.rpcClient.listTracks(filterOptions);
    const { data } = await tracksWithMetadataSchema.spa(trackResponse);

    return data!;
  }

  async addTrack(track: TrackDto) {
    const trackResponse = await this.rpcClient.createTrack(track);
    const { data, error } = await trackSchema.spa(trackResponse);

    if (error || !data) {
      // TODO: handle error
      console.error(error);
    }
    return data!;
  }

  async updateTrack(id: string, track: TrackDto) {
    const trackResponse = await this.rpcClient.updateTrack({ id, ...track });
    const { data, error } = await trackSchema.spa(trackResponse);

    if (error || !data) {
      // TODO: handle error
      console.error(error);
    }

    return data!;
  }

  async deleteTrack(id: string) {
    await this.rpcClient.deleteTrack({ id });
    return;
  }

  async deleteTracks(ids: string[]) {
    await this.rpcClient.deleteTracks({ ids });
    return;
  }

  async uploadTrackFile(id: string, file: File) {
    await this.rpcClient.uploadTrackFile(this.prepareStream(id, file));
  }

  async deleteTrackFile(id: string) {
    await new Promise((r) => setTimeout(() => r(id)));
    throw new Error('Not implemented');
  }

  private async *prepareStream(trackId: string, file: File) {
    yield {
      id: trackId,
      fileName: file.name,
    };

    const reader = file.stream().getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield { chunk: value };
    }
  }
}
