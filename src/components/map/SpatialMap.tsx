import { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { fromLonLat } from 'ol/proj';
import { Style, Circle, Fill, Stroke } from 'ol/style';
import { useMapStore } from '@/store/mapStore';
import 'ol/ol.css';

const DEFAULT_FEATURE_STYLE = new Style({
  image: new Circle({
    radius: 7,
    fill: new Fill({ color: '#AED6F1' }),
    stroke: new Stroke({ color: '#1B3A5C', width: 2 }),
  }),
  fill: new Fill({ color: 'rgba(174, 214, 241, 0.3)' }),
  stroke: new Stroke({ color: '#AED6F1', width: 2 }),
});

export default function SpatialMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const vectorSource = useRef<VectorSource>(new VectorSource());
  const { layers, shouldFit, fitHandled } = useMapStore();

  // Haritayı bir kez oluştur
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({
          source: vectorSource.current,
          style: DEFAULT_FEATURE_STYLE,
        }),
      ],
      view: new View({
        center: fromLonLat([35, 39]), // Türkiye merkezi
        zoom: 5,
      }),
    });

    return () => {
      mapInstance.current?.setTarget(undefined);
      mapInstance.current = null;
    };
  }, []);

  // Yeni layer geldiğinde haritaya ekle
  useEffect(() => {
    const source = vectorSource.current;
    source.clear();

    for (const layer of layers) {
      const format = new GeoJSON();
      const features = format.readFeatures(layer.geojson, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      });
      source.addFeatures(features);
    }
  }, [layers]);

  // Auto-fit: tüm feature'ları görünür yap
  useEffect(() => {
    if (!shouldFit || !mapInstance.current) return;
    const extent = vectorSource.current.getExtent();
    if (extent && extent.every(isFinite)) {
      mapInstance.current.getView().fit(extent as [number, number, number, number], { padding: [40, 40, 40, 40], maxZoom: 16, duration: 500 });
    }
    fitHandled();
  }, [shouldFit, fitHandled]);

  return (
    <div className="h-full relative bg-surface">
      <div ref={mapRef} className="absolute inset-0" />
      {layers.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-text-muted text-sm">Haritada görmek için geometry döndüren bir sorgu çalıştır</p>
        </div>
      )}
    </div>
  );
}
