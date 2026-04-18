import { create } from 'zustand';
import type { FeatureCollection } from 'geojson';

export interface MapLayer {
  id: string;
  geojson: FeatureCollection;
  label: string;
}

interface MapState {
  layers: MapLayer[];
  shouldFit: boolean;
  addLayer: (layer: MapLayer) => void;
  clearLayers: () => void;
  triggerFit: () => void;
  fitHandled: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  layers: [],
  shouldFit: false,
  // MVP: her sorguda tek katman — öncekini siler
  addLayer: (layer) => set({ layers: [layer], shouldFit: true }),
  clearLayers: () => set({ layers: [], shouldFit: false }),
  triggerFit: () => set({ shouldFit: true }),
  fitHandled: () => set({ shouldFit: false }),
}));
