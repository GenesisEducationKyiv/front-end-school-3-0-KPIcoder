import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useGenresQuery } from "@/hooks/useGenresApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tag } from "@/components/ui/tag";

interface GenreTagSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}


export function GenreTagSelect({ value, onChange, error }: GenreTagSelectProps) {

  const { data: availableGenres = [] } = useGenresQuery();
  
  const remainingGenres = availableGenres.filter(genre => !value.includes(genre));

  const handleSelectGenre = (selectedGenre: string) => {
    if (selectedGenre && !value.includes(selectedGenre)) {
      onChange([...value, selectedGenre]);
    }
  };

  const removeGenre = (genreToRemove: string) => {
    onChange(value.filter(genre => genre !== genreToRemove));
  };

  return (
    <FormItem>
      <FormLabel>Genres *</FormLabel>
      
      <Select
        onValueChange={handleSelectGenre}
        disabled={remainingGenres.length === 0}
      >
        <SelectTrigger>
          <SelectValue placeholder={
            remainingGenres.length 
              ? "Select a genre" 
              : "All available genres selected"
          } />
        </SelectTrigger>
        <SelectContent>
          {remainingGenres.map(genre => (
            <SelectItem key={genre} value={genre}>
              {genre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {value.length > 0 ? (
          value.map((genre) => (
            <Tag
              key={genre}
              variant="default"
              onRemove={() => removeGenre(genre)}
              removeAriaLabel="Remove genre"
            >
              {genre}
            </Tag>
          ))
        ) : (
          <span className="text-muted-foreground text-sm">No genres selected</span>
        )}
      </div>
      
      {error && <FormMessage data-testid="error-genre">{error}</FormMessage>}
    </FormItem>
  );
} 