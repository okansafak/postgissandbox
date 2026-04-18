import { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
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
    fill: new Fill({ color: '#ff3333' }),
    stroke: new Stroke({ color: '#fff', width: 1.5 }),
  }),
  fill: new Fill({ color: 'rgba(255, 51, 51, 0.25)' }),
  stroke: new Stroke({ color: '#ff3333', width: 2 }),
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
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            attributions: '© <a href="https://carto.com/">CARTO</a>',
          }),
        }),
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

    const ro = new ResizeObserver(() => mapInstance.current?.updateSize());
    ro.observe(mapRef.current);

    return () => {
      ro.disconnect();
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
