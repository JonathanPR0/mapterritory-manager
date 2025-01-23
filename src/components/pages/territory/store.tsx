import { TerritoryProps } from "@/types/TerritoryProps";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CoordinatesProps = [number, number][][];

export interface State {
  id: string | null;
  sideInfoOpen: boolean;
  coordinates: CoordinatesProps;
  territories: TerritoryProps[];
}

export interface Actions {
  openSideInfo: (props: { id: string; coordinates: CoordinatesProps }) => void;
  closeSideInfo: () => void;
  setTerritories: (territory: TerritoryProps) => void;
}

export const useStoreTerritory = create<State & Actions>()(
  persist(
    (set) => ({
      id: null,
      sideInfoOpen: false,
      coordinates: [],
      territories: [],
      openSideInfo: ({ id, coordinates }) => {
        set({ id, coordinates, sideInfoOpen: true });
      },
      closeSideInfo: () => {
        set({ id: null, sideInfoOpen: false, coordinates: [] });
      },
      setTerritories: (territory) => {
        set((state) => ({
          territories: [...state.territories, territory],
        }));
      },
    }),
    {
      name: "territory-storage", // Nome da chave no localStorage
      partialize: (state) => ({ territories: state.territories }), // Persiste apenas 'territories'
    }
  )
);
