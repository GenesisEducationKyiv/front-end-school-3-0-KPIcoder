import {TrackDto, TrackDtoSchema} from "@/interfaces/dto/TrackDto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GenreTagSelect } from "@/components/GenreTagSelect";

interface TrackFormProps {
    defaultValues?: Partial<TrackDto>,
    btnText: string,
    onSubmit: (values: TrackDto) => void,
}

const TrackForm = ({ defaultValues = {}, btnText, onSubmit }: TrackFormProps) => {
    const form = useForm<TrackDto>({
        resolver: zodResolver(TrackDtoSchema),
        defaultValues
    });

    return (
        <Form {...form}>
            <form onSubmit={void form.handleSubmit(onSubmit)} className="space-y-5" data-testid="track-form">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Track title" {...field} data-testid="input-title" />
                                    </FormControl>
                                    <FormMessage data-testid="error-title" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="artist"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Artist *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Artist name" {...field} data-testid="input-artist" />
                                    </FormControl>
                                    <FormMessage data-testid="error-artist" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="album"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Album *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Album name" {...field} data-testid="input-album" />
                                    </FormControl>
                                    <FormMessage data-testid="error-album" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="genres"
                            render={({ field }) => (
                                <GenreTagSelect
                                    value={field.value || []}
                                    onChange={field.onChange} 
                                    error={form.formState.errors.genres?.message?.toString()}
                                    data-testid="genre-selector"
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="coverImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cover Image URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com/cover.jpg" {...field} data-testid="input-cover-image" />
                                </FormControl>
                                <FormDescription className="text-xs">
                                    Enter a valid URL for the track cover image (optional)
                                </FormDescription>
                                <FormMessage data-testid="error-coverImage" />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <Button 
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="bg-black text-white hover:bg-black/90"
                        data-testid="submit-button"
                    >
                        {btnText}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default TrackForm;