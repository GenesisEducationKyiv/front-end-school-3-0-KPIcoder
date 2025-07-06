import {Dialog, DialogContent, DialogTitle} from '@/components/ui/dialog';
import AudioPlayer from './AudioPlayer';
import {useTrackAudio} from "@/hooks/useTracksApi.ts";
import {AlertCircle} from "lucide-react";
import {Spinner} from "@/components/ui/spinner.tsx";

interface AudioPlayerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trackId: string;
    title?: string;
}

export default function AudioPlayerModal({
    open,
    onOpenChange,
    trackId,
    title = 'Now Playing',
    }: AudioPlayerModalProps) {

    const {data: src, error, isLoading} = useTrackAudio(trackId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogTitle className="text-xl font-semibold mb-4">
                    {title}
                </DialogTitle>
                {isLoading && <Spinner />}
                {error && <AlertCircle/> }
                {src && <AudioPlayer audioSrc={src}/>}
            </DialogContent>
        </Dialog>
    );
}
