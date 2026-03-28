import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

export default function HeatmapLayer({ points, riskScore }) {
  const map        = useMap();
  const layerRef   = useRef(null);

  useEffect(() => {
    // Dynamically import leaflet.heat (not ESM compatible, needs script injection)
    const loadHeat = async () => {
      if (!window.L.heatLayer) {
        await import('leaflet.heat');
      }

      // Remove old layer
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }

      // Intensity and radius scale with risk score
      const radius  = 25 + (riskScore / 100) * 35;   // 25–60
      const blur    = 20 + (riskScore / 100) * 20;   // 20–40
      const maxZoom = 16;

      layerRef.current = window.L.heatLayer(points, {
        radius,
        blur,
        maxZoom,
        max: 1.0,
        gradient: {
          0.0: '#22c55e',   // green  — low
          0.3: '#84cc16',   // lime
          0.5: '#eab308',   // yellow — moderate
          0.7: '#f97316',   // orange — high
          1.0: '#ef4444',   // red    — critical
        },
      }).addTo(map);
    };

    if (points?.length > 0) {
      loadHeat();
    }

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [points, riskScore, map]);

  return null;
}