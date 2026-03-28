import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import HeatmapLayer from './HeatmapLayer';
import { useTheme } from '../../context/ThemeContext';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MAP_TILES = {
  dark: {
    url:         'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
  },
  light: {
    url:         'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
  },
};

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13, { animate: true });
  }, [lat, lng, map]);
  return null;
}

export default function MineMap({ result, lat, lng }) {
  const { isDark } = useTheme();
  const tiles    = isDark ? MAP_TILES.dark : MAP_TILES.light;
  const validLat = isNaN(lat) ? 23.7749 : lat;
  const validLng = isNaN(lng) ? 86.4344 : lng;

  return (
    <MapContainer
      center={[validLat, validLng]}
      zoom={13}
      style={{ height: '100%', width: '100%', minHeight: '480px' }}
      className="z-0"
    >
      {/* key prop forces tile layer to re-render on theme toggle */}
      <TileLayer
        key={isDark ? 'dark' : 'light'}
        url={tiles.url}
        attribution={tiles.attribution}
      />

      <RecenterMap lat={validLat} lng={validLng} />

      <Marker position={[validLat, validLng]}>
        <Popup>
          <div className="text-sm font-medium">
            <p className="font-bold">📍 Mine Location</p>
            <p>Lat: {validLat.toFixed(4)}</p>
            <p>Lng: {validLng.toFixed(4)}</p>
            {result && (
              <>
                <hr className="my-1"/>
                <p>CO₂: {(result.future_co2 / 1_000_000).toFixed(2)} M kg</p>
                <p style={{ color: result.risk_color }}>
                  Risk: {result.risk_score} — {result.risk_label}
                </p>
              </>
            )}
          </div>
        </Popup>
      </Marker>

      {result && result.heatmap_points?.length > 0 && (
        <HeatmapLayer points={result.heatmap_points} riskScore={result.risk_score} />
      )}
    </MapContainer>
  );
}