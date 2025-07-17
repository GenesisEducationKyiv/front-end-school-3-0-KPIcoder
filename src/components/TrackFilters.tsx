import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useGenresQuery } from '@/hooks/useGenresApi';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Slider } from './ui/slider';
import { SlidersHorizontal, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

const ALL_GENRES = 'all';

export default function TrackFilters() {
  const navigate = useNavigate();

  const { search = '', genre = '', artist = '', sort, order, limit } = useSearch({ from: '/tracks', strict: true });

  const [searchInput, setSearchInput] = useState(search);
  const [selectedGenre, setSelectedGenre] = useState(genre || ALL_GENRES);
  const [artistInput, setArtistInput] = useState(artist);
  const [selectedSort, setSelectedSort] = useState(sort);
  const [selectedOrder, setSelectedOrder] = useState(order);
  const [entriesPerPage, setEntriesPerPage] = useState(Number(limit));
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);
  const debouncedArtist = useDebounce(artistInput, 500);

  const { data: genres = [] } = useGenresQuery();

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value);
  };

  useEffect(() => {
    void navigate({
      to: '/tracks',
      search: {
        search: debouncedSearch || undefined,
        genre: selectedGenre === ALL_GENRES ? undefined : selectedGenre,
        artist: debouncedArtist || undefined,
        sort: selectedSort,
        order: selectedOrder,
        page: 1,
        limit: entriesPerPage,
      },
      replace: true,
    });
  }, [debouncedSearch, selectedGenre, debouncedArtist, selectedSort, selectedOrder, entriesPerPage, navigate]);

  const handleResetFilters = () => {
    setSearchInput('');
    setSelectedGenre(ALL_GENRES);
    setArtistInput('');
    setSelectedSort('title');
    setSelectedOrder('asc');
    setEntriesPerPage(10);

    void navigate({
      to: '/tracks',
      search: {
        page: 1,
        limit: 10,
      },
      replace: true,
    });
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const activeFilterCount = [
    debouncedSearch,
    selectedGenre !== ALL_GENRES,
    debouncedArtist,
    selectedSort !== 'title' || selectedOrder !== 'asc' || entriesPerPage !== 10,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search tracks..."
          className="pr-10"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          data-testid="search-input"
        />
        {searchInput && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
            onClick={() => setSearchInput('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={toggleFilters} className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Reset
          </Button>
        )}
      </div>

      {isFilterOpen && (
        <div className="bg-muted/50 p-4 rounded-md border animate-in slide-in-from-top-2 duration-150">
          <Accordion type="single" collapsible defaultValue="filters" className="w-full">
            <AccordionItem value="filters" className="border-none">
              <AccordionTrigger className="py-2">Filter Options</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <Label htmlFor="genre">Genre</Label>
                    <Select value={selectedGenre} onValueChange={handleGenreChange}>
                      <SelectTrigger id="genre" data-testid="filter-genre">
                        <SelectValue placeholder="All genres" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ALL_GENRES}>All genres</SelectItem>
                        {genres.map((genre: string) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="artist">Artist</Label>
                    <Input
                      id="artist"
                      placeholder="Filter by artist"
                      value={artistInput}
                      onChange={(e) => setArtistInput(e.target.value)}
                      data-testid="filter-artist"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sorting" className="border-none">
              <AccordionTrigger className="py-2">Sorting & Display</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <Label htmlFor="sort">Sort By</Label>
                    <Select value={selectedSort} onValueChange={(v: 'asc' | 'desc') => setSelectedOrder(v)}>
                      <SelectTrigger id="sort" data-testid="sort-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="artist">Artist</SelectItem>
                        <SelectItem value="album">Album</SelectItem>
                        <SelectItem value="createdAt">Date Added</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="order">Order</Label>
                    <Select value={selectedOrder} onValueChange={(v: 'asc' | 'desc') => setSelectedOrder(v)}>
                      <SelectTrigger id="order">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 col-span-full">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="limit">Items per page</Label>
                      <span className="text-sm text-muted-foreground">{entriesPerPage}</span>
                    </div>
                    <Slider
                      id="limit"
                      value={[entriesPerPage]}
                      min={5}
                      max={50}
                      step={5}
                      onValueChange={(values: number[]) => setEntriesPerPage(values[0])}
                      className="py-4"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
}
