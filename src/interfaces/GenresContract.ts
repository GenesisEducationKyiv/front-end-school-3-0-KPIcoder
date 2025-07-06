import { Result } from '@/lib/monads/Result.ts';

export interface GenresContract {
  getGenres(): Promise<Result<string[], Error>>;
}
