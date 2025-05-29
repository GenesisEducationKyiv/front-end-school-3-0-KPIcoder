export interface GenresContract {
    getGenres(): Promise<string[]>;
}