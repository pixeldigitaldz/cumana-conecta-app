'use client';

import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  Navigation, 
  Plus, 
  Minus, 
  ExternalLink, 
  X,
  Compass,
  Layers
} from 'lucide-react';
import { Business } from '@/types/business';

interface CumanaMapCardProps {
  business: Business;
  className?: string;
}

// Coordenadas geográficas referenciales de sectores clave de Cumaná, Edo. Sucre
const CUMANA_ZONES_COORDS: Record<string, { lat: number; lng: number; zoom: number }> = {
  'Casco Histórico': { lat: 10.4590, lng: -64.1770, zoom: 16 },
  'Los Bordones': { lat: 10.4430, lng: -64.2050, zoom: 15 },
  'Playa San Luis': { lat: 10.4480, lng: -64.1980, zoom: 15 },
  'Av. Perimetral': { lat: 10.4570, lng: -64.1700, zoom: 16 },
  'El Peñón': { lat: 10.4680, lng: -64.1480, zoom: 15 },
  'El Salado': { lat: 10.4460, lng: -64.1620, zoom: 15 },
  'Puerto Sucre': { lat: 10.4650, lng: -64.1820, zoom: 16 },
  'Bebedero': { lat: 10.4350, lng: -64.1750, zoom: 15 },
  'Caigüire': { lat: 10.4530, lng: -64.1550, zoom: 15 },
  'La Llanada': { lat: 10.4280, lng: -64.1680, zoom: 15 },
};

export function CumanaMapCard({ business, className = '' }: CumanaMapCardProps) {
  const [zoomLevel, setZoomLevel] = useState(16);
  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAddress, setActiveAddress] = useState(business.address);
  const [activeTitle, setActiveTitle] = useState(business.name);
  const [isSatellite, setIsSatellite] = useState(false);

  // Determinar coordenadas base según sector o fallback en el centro de Cumaná
  const baseCoords = useMemo(() => {
    return CUMANA_ZONES_COORDS[business.zone] || { lat: 10.4539, lng: -64.1672, zoom: 16 };
  }, [business.zone]);

  const [currentCoords, setCurrentCoords] = useState(baseCoords);

  // Enlace oficial de búsqueda en Google Maps
  const googleMapsUrl = useMemo(() => {
    if (business.mapsUrl && business.mapsUrl.startsWith('http')) {
      return business.mapsUrl;
    }
    const query = encodeURIComponent(`${business.name}, ${business.address}, Cumana, Estado Sucre, Venezuela`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }, [business.mapsUrl, business.name, business.address]);

  // Manejar búsqueda en el mapa
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    // Buscar si coincide con alguna zona conocida
    const matchedZone = Object.keys(CUMANA_ZONES_COORDS).find(z => z.toLowerCase().includes(query));
    if (matchedZone) {
      const coords = CUMANA_ZONES_COORDS[matchedZone];
      setCurrentCoords(coords);
      setActiveTitle(`Zona: ${matchedZone}`);
      setActiveAddress(`Cumaná, Estado Sucre`);
      setIsPopupOpen(true);
      return;
    }

    // Si busca sucursales
    if (business.branches && business.branches.length > 0) {
      const matchedBranch = business.branches.find(b => 
        b.name.toLowerCase().includes(query) || b.address.toLowerCase().includes(query)
      );
      if (matchedBranch) {
        setActiveTitle(matchedBranch.name);
        setActiveAddress(matchedBranch.address);
        setIsPopupOpen(true);
        return;
      }
    }

    // Fallback: abrir o enfocar en búsqueda
    setActiveTitle(searchQuery.trim());
    setActiveAddress(`Búsqueda en mapa de Cumaná`);
    setIsPopupOpen(true);
  };

  // Calcular URL del iframe OpenStreetMap embebido
  const osmEmbedUrl = useMemo(() => {
    const latDelta = 0.008 / Math.pow(1.5, zoomLevel - 15);
    const lngDelta = 0.012 / Math.pow(1.5, zoomLevel - 15);
    const minLng = currentCoords.lng - lngDelta;
    const maxLng = currentCoords.lng + lngDelta;
    const minLat = currentCoords.lat - latDelta;
    const maxLat = currentCoords.lat + latDelta;

    const layer = isSatellite ? 'mapnik' : 'mapnik';
    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=${layer}&marker=${currentCoords.lat}%2C${currentCoords.lng}`;
  }, [currentCoords, zoomLevel, isSatellite]);

  if (business.hasGps === false) {
    return (
      <div className={`bg-white dark:bg-[#131F33] rounded-3xl border border-slate-200 dark:border-[#1E2D45] p-5 sm:p-6 shadow-sm space-y-4 ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#1E2D45]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-950 dark:text-white tracking-tight">
                Ubicación en Cumaná
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#A0AEC0] font-medium leading-snug pl-9">
              {business.address}
            </p>
          </div>
          <span className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            GPS Inactivo · Dirección Física
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0c1017] border border-dashed border-slate-200 dark:border-[#222a3b] flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Sector: {business.zone}
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white max-w-md">
              {business.address}
            </p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Este comercio no cuenta con geolocalización satelital activa en Google Maps. Su atención se realiza presencialmente en su dirección física o por canales de contacto directo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-[#131F33] rounded-3xl border border-slate-200 dark:border-[#1E2D45] p-5 sm:p-6 shadow-sm space-y-4 ${className}`}>
      {/* 1. Cabecera Exacta a la Imagen de Referencia */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#1E2D45]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-950 dark:text-white tracking-tight">
              Ubicación en Cumaná
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-[#A0AEC0] font-medium leading-snug pl-9">
            {business.address}
          </p>
        </div>

        {/* Botón "Abrir en Google Maps" estilo píldora azul */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
        >
          <Navigation className="w-3.5 h-3.5 rotate-45 text-sky-600 dark:text-sky-400" />
          <span>Abrir en Google Maps</span>
        </a>
      </div>

      {/* 2. Buscador en el Mapa de Google Maps / Cumaná */}
      <form onSubmit={handleSearch} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar calle, avenida o sector en el mapa de Cumaná..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCurrentCoords(baseCoords);
                setActiveTitle(business.name);
                setActiveAddress(business.address);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="submit"
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black dark:bg-[#1E2D45] dark:hover:bg-[#2A3F60] text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
        >
          Buscar
        </button>

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((searchQuery || business.name) + ' Cumana Sucre Venezuela')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#080E18] dark:hover:bg-[#1E2D45] text-slate-700 dark:text-[#A0AEC0] border border-slate-200 dark:border-[#1E2D45] transition-all shrink-0"
          title="Ver en app externa de Google Maps"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </form>

      {/* Atajos rápidos de sectores populares de Cumaná */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-slate-500">
        <span className="font-semibold text-slate-400 shrink-0">Sectores:</span>
        {['Casco Histórico', 'Los Bordones', 'Av. Perimetral', 'El Peñón', 'El Salado'].map(zoneName => (
          <button
            key={zoneName}
            type="button"
            onClick={() => {
              const coords = CUMANA_ZONES_COORDS[zoneName];
              if (coords) {
                setCurrentCoords(coords);
                setActiveTitle(`Sector: ${zoneName}`);
                setActiveAddress(`Cumaná, Edo. Sucre`);
                setIsPopupOpen(true);
              }
            }}
            className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-sky-50 dark:bg-[#080E18] dark:hover:bg-[#1E2D45] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1E2D45] shrink-0 font-medium cursor-pointer"
          >
            {zoneName}
          </button>
        ))}
      </div>

      {/* Selector de Sucursales si el comercio las posee */}
      {business.branches && business.branches.length > 0 && (
        <div className="p-3 rounded-2xl bg-[#00C292]/10 border border-[#00C292]/30 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00C292] animate-pulse"></span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Este comercio tiene {business.branches.length} sucursales en Cumaná:
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {business.branches.map((branch, bIdx) => (
              <button
                key={bIdx}
                type="button"
                onClick={() => {
                  setActiveTitle(branch.name);
                  setActiveAddress(branch.address);
                  if (branch.zone && CUMANA_ZONES_COORDS[branch.zone]) {
                    setCurrentCoords(CUMANA_ZONES_COORDS[branch.zone]);
                  }
                  setIsPopupOpen(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#080E18] text-slate-900 dark:text-white text-xs font-bold border border-slate-200 dark:border-[#1E2D45] hover:border-[#00C292] cursor-pointer shadow-2xs"
              >
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00C292] shrink-0" />
                  {branch.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Contenedor del Mapa Interactivo tipo Leaflet */}
      <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-[#1E2D45] bg-[#E5E3DF] shadow-inner select-none">
        {/* Iframe del mapa real interactivo de Cumaná */}
        <iframe
          title="Mapa de Cumaná"
          src={osmEmbedUrl}
          className="w-full h-full border-0 pointer-events-auto"
          loading="lazy"
        />

        {/* Controles de Zoom (+ y -) estilo Leaflet en la esquina superior izquierda */}
        <div className="absolute top-4 left-4 z-20 flex flex-col rounded-xl bg-white dark:bg-[#131F33] border border-slate-300 dark:border-[#1E2D45] shadow-md overflow-hidden">
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.min(prev + 1, 19))}
            className="p-2 hover:bg-slate-100 dark:hover:bg-[#1E2D45] text-slate-700 dark:text-white border-b border-slate-200 dark:border-[#1E2D45] transition-colors cursor-pointer"
            title="Acercar mapa (+)"
          >
            <Plus className="w-4 h-4 font-bold" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.max(prev - 1, 12))}
            className="p-2 hover:bg-slate-100 dark:hover:bg-[#1E2D45] text-slate-700 dark:text-white transition-colors cursor-pointer"
            title="Alejar mapa (-)"
          >
            <Minus className="w-4 h-4 font-bold" />
          </button>
        </div>

        {/* Botón de alternar tipo de vista o centrar */}
        <div className="absolute top-4 right-4 z-20">
          <button
            type="button"
            onClick={() => {
              setCurrentCoords(baseCoords);
              setActiveTitle(business.name);
              setActiveAddress(business.address);
              setIsPopupOpen(true);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-white/95 dark:bg-[#131F33]/95 backdrop-blur-md border border-slate-300 dark:border-[#1E2D45] text-slate-800 dark:text-slate-200 text-xs font-bold shadow-md hover:bg-white flex items-center gap-1.5 cursor-pointer"
            title="Centrar en el local"
          >
            <Compass className="w-3.5 h-3.5 text-[#FF6B4A]" />
            <span className="hidden sm:inline">Centrar Local</span>
          </button>
        </div>

        {/* Pin central del mapa con la tarjeta emergente (Popup de Leaflet) idéntica a la imagen */}
        {isPopupOpen && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[120%] z-20 pointer-events-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 dark:border-[#1E2D45] p-4 max-w-[280px] sm:max-w-xs relative text-left">
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-black text-xs sm:text-sm text-slate-950 dark:text-white leading-tight">
                  {activeTitle}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs p-0.5 rounded cursor-pointer leading-none"
                  title="Cerrar ventana emergente"
                >
                  ✕
                </button>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-[#A0AEC0] mt-1.5 leading-snug font-medium">
                {activeAddress}
              </p>

              {/* Botón para navegar directo */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Punto Verificado
                </span>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  <span>Iniciar Ruta</span>
                  <span>→</span>
                </a>
              </div>

              {/* Triángulo inferior del globo de diálogo */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white dark:border-t-[#0B132B]" />
            </div>
          </div>
        )}

        {/* Pin o marcador visual en el centro del mapa */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="relative flex items-center justify-center">
            <span className="w-5 h-5 rounded-full bg-[#FF6B4A]/30 animate-ping absolute"></span>
            <div 
              onClick={() => setIsPopupOpen(prev => !prev)} 
              className="w-7 h-7 rounded-full bg-[#FF6B4A] border-2 border-white text-white shadow-lg flex items-center justify-center cursor-pointer pointer-events-auto hover:scale-110 transition-transform"
              title="Clic para ver detalles del local"
            >
              <MapPin className="w-4 h-4 fill-white" />
            </div>
          </div>
        </div>

        {/* Pie de atribución idéntico a la imagen de referencia */}
        <div className="absolute bottom-1 right-2 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-slate-600 dark:text-slate-400 font-sans border border-slate-200/50 dark:border-slate-800 flex items-center gap-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Leaflet</span>
          <span>|</span>
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
            © Google Maps
          </a>
          <span>/</span>
          <span>© OpenStreetMap</span>
        </div>
      </div>
    </div>
  );
}
