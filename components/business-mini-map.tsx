'use client';

import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Plus, 
  Minus, 
  Layers, 
  Compass,
  Sparkles
} from 'lucide-react';
import { Business } from '@/types/business';

// Coordenadas geográficas de todos los sectores y avenidas de Cumaná, Edo. Sucre
export const CUMANA_SECTORS_COORDS: Record<string, { lat: number; lng: number; zoom: number }> = {
  'Sector Centro': { lat: 10.4536, lng: -64.1775, zoom: 16 },
  'Casco Histórico': { lat: 10.4590, lng: -64.1770, zoom: 16 },
  'Av. Bermúdez': { lat: 10.4520, lng: -64.1750, zoom: 16 },
  'Av. Perimetral': { lat: 10.4570, lng: -64.1700, zoom: 16 },
  'San Luis': { lat: 10.4480, lng: -64.1980, zoom: 15 },
  'Playa San Luis': { lat: 10.4480, lng: -64.1980, zoom: 15 },
  'Los Bordones': { lat: 10.4430, lng: -64.2050, zoom: 15 },
  'Puerto Sucre': { lat: 10.4650, lng: -64.1820, zoom: 16 },
  'Cantarrana': { lat: 10.4390, lng: -64.1710, zoom: 16 },
  'El Peñón': { lat: 10.4680, lng: -64.1480, zoom: 15 },
  'El Salado': { lat: 10.4460, lng: -64.1620, zoom: 15 },
  'Av. Universidad': { lat: 10.4410, lng: -64.1860, zoom: 16 },
  'Los Chaimas': { lat: 10.4450, lng: -64.1840, zoom: 16 },
  'CC Hipergalerías': { lat: 10.4475, lng: -64.1760, zoom: 16 },
  'Av. Andrés Eloy Blanco': { lat: 10.4490, lng: -64.1730, zoom: 16 },
  'Av. Santa Rosa': { lat: 10.4550, lng: -64.1660, zoom: 16 },
  'Av. Carúpano': { lat: 10.4620, lng: -64.1520, zoom: 16 },
  'Caigüire': { lat: 10.4530, lng: -64.1550, zoom: 15 },
  'Bebedero': { lat: 10.4350, lng: -64.1750, zoom: 15 },
  'La Llanada': { lat: 10.4280, lng: -64.1680, zoom: 15 },
};

export function parseCoordinates(raw?: string): { lat: number; lng: number } | null {
  if (!raw) return null;
  
  // Coordenadas con formato cardinal ej: 10.4536° N, 64.1775° W
  const cardinalMatch = raw.match(/([+-]?\d+(?:\.\d+)?)\s*°?\s*([NSns])?[,\s]+([+-]?\d+(?:\.\d+)?)\s*°?\s*([EWew])?/);
  if (cardinalMatch) {
    let lat = parseFloat(cardinalMatch[1]);
    if (cardinalMatch[2] && cardinalMatch[2].toUpperCase() === 'S') lat = -lat;
    let lng = parseFloat(cardinalMatch[3]);
    if (cardinalMatch[4] && cardinalMatch[4].toUpperCase() === 'W') lng = -Math.abs(lng);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  // Coordenadas decimales simples ej: 10.4536, -64.1775
  const decimalMatch = raw.match(/([+-]?\d+\.\d+)[,\s]+([+-]?\d+\.\d+)/);
  if (decimalMatch) {
    const lat = parseFloat(decimalMatch[1]);
    const lng = parseFloat(decimalMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  return null;
}

export function extractCoordsFromUrl(url?: string): { lat: number; lng: number } | null {
  if (!url) return null;

  // Patrón @lat,lng ej: google.com/maps/@10.4536,-64.1775,17z
  const atMatch = url.match(/@([+-]?\d+\.\d+),([+-]?\d+\.\d+)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  // Patrón ?q=lat,lng o &q=lat,lng
  const qMatch = url.match(/[?&]q=([+-]?\d+\.\d+),([+-]?\d+\.\d+)/);
  if (qMatch) {
    const lat = parseFloat(qMatch[1]);
    const lng = parseFloat(qMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  // Patrón ll=lat,lng
  const llMatch = url.match(/[?&]ll=([+-]?\d+\.\d+),([+-]?\d+\.\d+)/);
  if (llMatch) {
    const lat = parseFloat(llMatch[1]);
    const lng = parseFloat(llMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  return null;
}

interface BusinessMiniMapProps {
  business: Pick<Business, 'name' | 'address' | 'zone'> & {
    mapsUrl?: string;
    coordinates?: string;
  };
  heightClass?: string;
  showDirectionsButton?: boolean;
  className?: string;
}

export function BusinessMiniMap({
  business,
  heightClass = 'h-44 sm:h-52',
  showDirectionsButton = true,
  className = ''
}: BusinessMiniMapProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(16);
  const [mapProvider, setMapProvider] = useState<'google' | 'osm'>('google');
  const [isSatellite, setIsSatellite] = useState<boolean>(false);

  // 1. Resolver las coordenadas más precisas posibles
  const resolvedCoords = useMemo(() => {
    // A. Coordenadas explícitas en el campo coordinates
    const fromCoords = parseCoordinates(business.coordinates);
    if (fromCoords) return fromCoords;

    // B. Coordenadas extraídas del enlace de Google Maps
    const fromUrl = extractCoordsFromUrl(business.mapsUrl);
    if (fromUrl) return fromUrl;

    // C. Coordenadas por sector de Cumaná
    if (business.zone && CUMANA_SECTORS_COORDS[business.zone]) {
      return CUMANA_SECTORS_COORDS[business.zone];
    }

    // D. Búsqueda por texto dentro de la dirección
    for (const [sector, coords] of Object.entries(CUMANA_SECTORS_COORDS)) {
      if (business.address.toLowerCase().includes(sector.toLowerCase())) {
        return coords;
      }
    }

    // Fallback: Centro de Cumaná (Av. Bermúdez / Plaza Bolívar)
    return { lat: 10.4536, lng: -64.1775 };
  }, [business.coordinates, business.mapsUrl, business.zone, business.address]);

  // 2. URL de navegación directa a Google Maps
  const directMapsUrl = useMemo(() => {
    if (business.mapsUrl && business.mapsUrl.trim().startsWith('http')) {
      return business.mapsUrl.trim();
    }
    const dest = `${resolvedCoords.lat},${resolvedCoords.lng}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`;
  }, [business.mapsUrl, resolvedCoords]);

  // 3. Generar URL embebible para el iframe
  const embedUrl = useMemo(() => {
    if (mapProvider === 'google') {
      // Si el enlace ya es un embed de Google Maps
      if (business.mapsUrl && business.mapsUrl.includes('google.com/maps/embed')) {
        return business.mapsUrl;
      }
      
      const mapType = isSatellite ? 'k' : 'm';
      const query = `${resolvedCoords.lat},${resolvedCoords.lng}`;
      return `https://maps.google.com/maps?q=${query}&t=${mapType}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;
    }

    // Proveedor OpenStreetMap
    const latDelta = 0.008 / Math.pow(1.5, zoomLevel - 15);
    const lngDelta = 0.012 / Math.pow(1.5, zoomLevel - 15);
    const minLng = resolvedCoords.lng - lngDelta;
    const maxLng = resolvedCoords.lng + lngDelta;
    const minLat = resolvedCoords.lat - latDelta;
    const maxLat = resolvedCoords.lat + latDelta;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${resolvedCoords.lat}%2C${resolvedCoords.lng}`;
  }, [mapProvider, isSatellite, resolvedCoords, zoomLevel, business.mapsUrl]);

  return (
    <div className={`w-full space-y-2.5 ${className}`}>
      {/* Contenedor del Mapa Miniatura */}
      <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-slate-200 dark:border-[#252934] bg-[#0b0d11] shadow-md group select-none`}>
        {/* Iframe del mapa interactivo */}
        <iframe
          title={`Mapa de ${business.name}`}
          src={embedUrl}
          className="w-full h-full border-0 pointer-events-auto"
          loading="lazy"
        />

        {/* Indicador superior izquierdo: Sector en Cumaná */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <div className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 text-white text-[10px] font-mono-tabular font-bold flex items-center gap-1 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate max-w-[150px] sm:max-w-[200px]">
              {business.zone || 'Cumaná, Sucre'}
            </span>
          </div>
        </div>

        {/* Controles de mapa flotantes arriba a la derecha */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          {/* Alternar proveedor de mapa (Google / OSM) */}
          <button
            type="button"
            onClick={() => setMapProvider(prev => prev === 'google' ? 'osm' : 'google')}
            className="px-2 py-1 rounded-lg bg-black/80 hover:bg-black/95 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold transition-all shadow-sm cursor-pointer"
            title="Cambiar proveedor de mapa"
          >
            {mapProvider === 'google' ? 'Google' : 'OSM'}
          </button>

          {/* Alternar satélite si es Google Maps */}
          {mapProvider === 'google' && (
            <button
              type="button"
              onClick={() => setIsSatellite(prev => !prev)}
              className={`p-1.5 rounded-lg backdrop-blur-md border transition-all cursor-pointer shadow-sm ${
                isSatellite
                  ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                  : 'bg-black/80 hover:bg-black/95 text-white border-white/20'
              }`}
              title={isSatellite ? 'Cambiar a mapa regular' : 'Ver imagen satelital'}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Zoom In (+) */}
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.min(19, prev + 1))}
            className="p-1.5 rounded-lg bg-black/80 hover:bg-black/95 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Acercar mapa"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Out (-) */}
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.max(13, prev - 1))}
            className="p-1.5 rounded-lg bg-black/80 hover:bg-black/95 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Alejar mapa"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pin Flotante de Referencia en el Centro (Efecto de Radar Cumaná) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative -translate-y-3 flex flex-col items-center">
            {/* Onda expansiva de geolocalización */}
            <span className="absolute -bottom-1 w-6 h-6 rounded-full bg-[#FF6B4A]/30 animate-ping" />
            <span className="absolute -bottom-0.5 w-3 h-3 rounded-full bg-[#FF6B4A]/60" />
            
            {/* Pin de Mapa Estilo Cumaná Conecta */}
            <div className="relative z-10 px-2 py-0.5 rounded-md bg-[#FF6B4A] text-white shadow-lg text-[10px] font-mono-tabular font-extrabold flex items-center gap-1 border border-white/40">
              <MapPin className="w-3 h-3 fill-white text-white" />
              <span className="max-w-[130px] truncate">{business.name}</span>
            </div>
          </div>
        </div>

        {/* Barra inferior semi-transparente con botón de enlace directo */}
        <div className="absolute bottom-2 right-2 z-10">
          <a
            href={directMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-black/80 hover:bg-black backdrop-blur-md border border-white/20 text-white hover:text-amber-400 text-[10px] font-bold flex items-center gap-1 transition-all shadow-sm cursor-pointer"
            title="Abrir en pantalla completa en Google Maps"
          >
            <span>Ver Completo</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Botón Principal: Trazar Ruta en Google Maps */}
      {showDirectionsButton && (
        <a
          href={directMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#0b0d11] hover:bg-slate-100 dark:hover:bg-[#1a1f29] border border-slate-200 dark:border-[#252934] text-xs font-mono-tabular font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs hover:border-[#FF6B4A]/50 group"
        >
          <Navigation className="w-3.5 h-3.5 text-[#FF6B4A] group-hover:rotate-45 transition-transform" />
          <span>Abrir Ruta en Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
        </a>
      )}
    </div>
  );
}
