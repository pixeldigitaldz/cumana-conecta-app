import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * Helper para extraer coordenadas de Cumaná a partir del negocio o zona
 */
export function getBusinessCoordinates(business) {
  if (business?.coordinates && business.coordinates.lat && business.coordinates.lng) {
    return [business.coordinates.lat, business.coordinates.lng];
  }
  if (business?.googleMapsUrl) {
    const match = business.googleMapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      return [parseFloat(match[1]), parseFloat(match[2])];
    }
  }

  // Coordenadas conocidas por sector en Cumaná
  const zone = (business?.zone || '').toLowerCase();
  if (zone.includes('bermúdez') || zone.includes('bermudez') || zone.includes('plaza')) {
    return [10.4568, -64.1730];
  }
  if (zone.includes('centro') || zone.includes('santa inés') || zone.includes('santa ines')) {
    return [10.4614, -64.1698];
  }
  if (zone.includes('san luis') || zone.includes('playa')) {
    return [10.4350, -64.2050];
  }
  if (zone.includes('universidad') || zone.includes('udo')) {
    return [10.4485, -64.1680];
  }
  if (zone.includes('perimetral')) {
    return [10.4618, -64.1789];
  }
  if (zone.includes('cantarrana')) {
    return [10.4350, -64.1580];
  }
  if (zone.includes('arismendi')) {
    return [10.4580, -64.1740];
  }
  if (zone.includes('andrés eloy') || zone.includes('andres eloy')) {
    return [10.4520, -64.1710];
  }
  if (zone.includes('los chaimas')) {
    return [10.4580, -64.1820];
  }
  // Coordenadas centrales de Cumaná, Estado Sucre
  return [10.4536, -64.1775];
}

/**
 * Icono personalizado de chincheta azul idéntico al de la captura
 */
const customPinIcon = L.divIcon({
  className: 'custom-leaflet-pin',
  html: `
    <div style="position: relative; width: 34px; height: 42px; transform: translate(-50%, -100%);">
      <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 0C7.61116 0 0 7.61116 0 17C0 27.5 17 42 17 42C17 42 34 27.5 34 17C34 7.61116 26.3888 0 17 0Z" fill="#0284c7" />
        <circle cx="17" cy="16" r="6.5" fill="white" />
        <circle cx="17" cy="16" r="3.5" fill="#0369a1" />
      </svg>
    </div>
  `,
  iconSize: [34, 42],
  iconAnchor: [17, 42],
  popupAnchor: [0, -38],
});

export default function BusinessLocationMap({ business }) {
  const { isDark } = useTheme();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const {
    name = 'Comercio en Cumaná',
    address = 'Cumaná, Estado Sucre, Venezuela',
    googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' Cumaná Sucre')}`,
  } = business || {};

  const coordinates = getBusinessCoordinates(business);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destruir mapa previo si existe
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Inicializar mapa de Leaflet
    const map = L.map(mapContainerRef.current, {
      center: coordinates,
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // Capa de Carto Voyager (estética idéntica a la captura con calles y río Manzanares)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Marcador de chincheta azul
    const marker = L.marker(coordinates, { icon: customPinIcon }).addTo(map);

    // Popup estilizado
    const popupContent = `
      <div style="font-family: 'Inter', sans-serif; min-width: 220px; max-width: 290px; padding: 2px 4px;">
        <h4 style="font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 13.5px; color: #004655; margin: 0 0 4px 0; line-height: 1.25;">
          ${name}
        </h4>
        <p style="font-size: 11.5px; color: #475569; margin: 0; line-height: 1.35;">
          ${address}
        </p>
      </div>
    `;

    marker.bindPopup(popupContent, {
      autoClose: false,
      closeOnClick: false,
      className: 'cumana-map-popup',
    }).openPopup();

    // Redimensionar automáticamente cuando se completa la apertura del modal
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates[0], coordinates[1], name, address]);

  return (
    <section className={`w-full rounded-2xl border p-5 sm:p-6 flex flex-col gap-4 shadow-2xs transition-colors font-['Inter'] ${
      isDark ? 'bg-[#121316] border-[#282a32]' : 'bg-white border-slate-200'
    }`}>
      
      {/* ─── Encabezado de Ubicación ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <MapPin size={18} className="shrink-0" />
            <h3 className={`font-['Outfit'] font-bold text-base sm:text-lg ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Ubicación en Cumaná
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
            {address}
          </p>
        </div>

        {/* Botón Abrir en Google Maps */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-xs font-bold border border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-sky-300 bg-sky-50/70 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/40 transition-all shrink-0 cursor-pointer self-start sm:self-center shadow-2xs"
          aria-label={`Abrir ubicación de ${name} en Google Maps`}
        >
          <Navigation size={13} className="text-sky-600 dark:text-sky-400" />
          <span>Abrir en Google Maps</span>
        </a>
      </div>

      {/* ─── Contenedor del Mapa Interactivo ─── */}
      <div className="relative w-full h-[280px] sm:h-[320px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner z-0">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

    </section>
  );
}
