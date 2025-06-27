import { create } from "zustand";
import { Track } from "@/interfaces/Track";

type State = {
    selectedIds: Set<string>;
    toggle: (id: string) => void;
    clear: () => void;
    selectAll: (tracks: Track[]) => void;
};

export const useTrackSelectionStore = create<State>((set, get) => ({
    selectedIds: new Set(),

    toggle: (id: string) => {
        const selected = new Set(get().selectedIds);
        if (selected.has(id)) selected.delete(id);
        else selected.add(id);
        set({ selectedIds: selected });
    },

    clear: () => set({ selectedIds: new Set() }),

    selectAll: (tracks: Track[]) => {
        const all = new Set(tracks.map((t) => t.id));
        set({ selectedIds: all });
    },
}));

export const getSelectedIds = (selectedIds: Set<string>): string[] =>
    Array.from(selectedIds);

export const isSelected = (selectedIds: Set<string>, id: string): boolean =>
    selectedIds.has(id);

export const areAllSelected = (selectedIds: Set<string>, tracks: Track[]): boolean =>
    tracks.length > 0 && tracks.every((t) => selectedIds.has(t.id));

export const getSelectedCount = (selectedIds: Set<string>): number =>
    selectedIds.size;
