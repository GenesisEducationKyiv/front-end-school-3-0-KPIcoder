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
  private rpcJsonClient;

  constructor() {
    const transport = createConnectTransport({
      baseUrl: config.apiBaseUrl,
      useBinaryFormat: true,
    });
    const jsonTransport = createConnectTransport({
      baseUrl: config.apiBaseUrl,
      useBinaryFormat: false,
    });
    this.rpcClient = createClient(TrackService, transport);
    this.rpcJsonClient = createClient(TrackService, jsonTransport);
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
    const buffer = await file.arrayBuffer();
    const binary = new Uint8Array(buffer);
    await this.rpcJsonClient.uploadTrackFile({ id, fileName: file.name, chunk: binary });
  }

  async streamAudio(id: string) {
    const chunks: Uint8Array[] = [];
    const iter = this.rpcClient.streamTrackAudio({ trackId: id });

    for await (const res of iter) {
      chunks.push(res.chunk);
    }

    const audio = new Blob(chunks, { type: 'audio/mpeg' });
    return URL.createObjectURL(audio);
  }

  async deleteTrackFile(id: string) {
    await new Promise((r) => setTimeout(() => r(id)));
    throw new Error('Not implemented');
  }
}
