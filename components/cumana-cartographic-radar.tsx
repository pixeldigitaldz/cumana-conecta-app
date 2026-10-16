'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Map, 
  Radio, 
  Anchor, 
  BookOpen, 
  Utensils, 
  HeartPulse, 
  ShoppingBag, 
  Clock, 
  MapPin, 
  DollarSign, 
  MessageSquare, 
  Navigation, 
  Award, 
  ArrowRight, 
  Plus, 
  Minus, 
  LocateFixed, 
  X
} from 'lucide-react';
import { Business } from '@/types/business';

interface CumanaCartographicRadarProps {
  businesses: Business[];
  onOpenDetail?: (business: Business) => void;
  onOpenVerification?: () => void;
}

interface RadarFeaturedBiz {
  id: string;
  name: string;
  category: string;
  zoneBadge: string;
  schedule: string;
  address: string;
  payment: string;
  color: string;
  icon: React.ElementType;
  pinLabel: string;
  cx: string; // Porcentaje X en el mapa (calibrado para no salirse)
  cy: string; // Porcentaje Y en el mapa
  lat: number;
  lng: number;
  whatsappPhone: string;
  mapsUrl: string;
}

// 5 Comercios geolocalizados en Cumaná con coordenadas centradas y compactas
const RADAR_FEATURED_LIST: RadarFeaturedBiz[] = [
  {
    id: 'el-marino',
    name: 'Ferretería & Repuestos Marinos El Marino',
    category: 'Comercio & Tiendas',
    zoneBadge: 'PUERTO SUCRE',
    schedule: 'Lunes a Sábado: 7:30 AM - 5:30 PM · Domingos Cerrado',
    address: 'Av. Puerto Sucre c/ calle Marina, a 50m del muelle pesquero artesanal, Cumaná.',
    payment: 'Pago Móvil, Efectivo USD sin vuelto falso, Biopago BDV.',
    color: '#ff5537', // Naranja/Coral
    icon: Anchor,
    pinLabel: 'EL MARINO · PUERTO SUCRE',
    cx: '62%',
    cy: '46%',
    lat: 10.4650,
    lng: -64.1820,
    whatsappPhone: '584140099876',
    mapsUrl: 'https://www.google.com/maps/search/Puerto+Sucre+Muelle+Cumana+Sucre'
  },
  {
    id: 'econoqueso',
    name: 'Econoqueso Cumaná',
    category: 'Comercio & Tiendas',
    zoneBadge: 'SECTOR CENTRO',
    schedule: 'Lunes a Sábado: 7:00 AM - 7:30 PM · Domingos: 8:00 AM - 2:00 PM',
    address: 'Calle Bermúdez c/c Mariño, frente a Plaza Bolívar, Cumaná.',
    payment: 'Pago Móvil, Punto de Venta, Efectivo USD, Biopago.',
    color: '#00e5aa', // Verde menta / cian
    icon: ShoppingBag,
    pinLabel: 'ECONOQUESO · CENTRO',
    cx: '68%',
    cy: '58%',
    lat: 10.4590,
    lng: -64.1770,
    whatsappPhone: '584127894411',
    mapsUrl: 'https://maps.google.com/?q=Calle+Bermudez+Cumana+Sucre'
  },
  {
    id: 'papeleria-bolivar',
    name: 'Librería & Papelería Bolívar',
    category: 'Comercio & Tiendas',
    zoneBadge: 'CASCO HISTÓRICO',
    schedule: 'Lunes a Sábado: 8:00 AM - 6:00 PM · Domingos Cerrado',
    address: 'Calle Mariño, entre Calle Sucre y Calle Carabobo, Edif. Bolívar PB, Cumaná.',
    payment: 'Pago Móvil, Efectivo USD, Punto de Venta, Biopago BDV.',
    color: '#38bdf8', // Azul celeste
    icon: BookOpen,
    pinLabel: 'PAPELERÍA BOLÍVAR · CENTRO',
    cx: '66%',
    cy: '52%',
    lat: 10.4600,
    lng: -64.1720,
    whatsappPhone: '584248765432',
    mapsUrl: 'https://www.google.com/maps/search/Libreria+Calle+Mariño+Centro+Cumana+Sucre'
  },
  {
    id: 'la-casona',
    name: 'Marisquería & Bohío La Casona de San Luis',
    category: 'Gastronomía & Asadores',
    zoneBadge: 'PLAYA SAN LUIS',
    schedule: 'Miércoles a Domingo: 11:00 AM - 8:30 PM · Lunes y Martes Cerrado',
    address: 'Av. Universidad, sector Los Bordones, frente a Playa San Luis, Cumaná.',
    payment: 'Pago Móvil, Efectivo USD sin vuelto falso, Zelle, Biopago.',
    color: '#fbbf24', // Amarillo oro
    icon: Utensils,
    pinLabel: 'LA CASONA · PLAYA SAN LUIS',
    cx: '47%',
    cy: '56%',
    lat: 10.4480,
    lng: -64.1980,
    whatsappPhone: '584148889900',
    mapsUrl: 'https://maps.google.com/?q=Playa+San+Luis+Cumana'
  },
  {
    id: 'san-antonio',
    name: 'Farmacia & Centro Médico San Antonio',
    category: 'Salud & Bienestar',
    zoneBadge: 'CANTARRANA',
    schedule: 'Atención 24 Horas · Los 365 días del año',
    address: 'Av. Rotaria c/ Av. Principal de Cantarrana, Cumaná.',
    payment: 'Pago Móvil, Punto de Venta, Efectivo USD, Biopago.',
    color: '#ff6b6b', // Coral rojizo
    icon: HeartPulse,
    pinLabel: 'SAN ANTONIO · 24 HORAS',
    cx: '64%',
    cy: '69%',
    lat: 10.4380,
    lng: -64.1600,
    whatsappPhone: '584149991122',
    mapsUrl: 'https://maps.google.com/?q=Cantarrana+Cumana'
  }
];

export function CumanaCartographicRadar({
  businesses,
  onOpenDetail,
  onOpenVerification
}: CumanaCartographicRadarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Comercio actualmente enfocado
  const currentItem = RADAR_FEATURED_LIST[currentIndex] || RADAR_FEATURED_LIST[0];

  // Buscar el objeto Business real correspondiente
  const matchedBusiness = useMemo(() => {
    if (!businesses || businesses.length === 0) return null;
    return businesses.find(b => 
      b.slug?.includes(currentItem.id) || 
      b.name?.toLowerCase().includes(currentItem.name.toLowerCase().split(' ')[0])
    ) || businesses[0];
  }, [businesses, currentItem]);

  // Rotación automática más pausada (12s por comercio)
  useEffect(() => {
    autoPlayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % RADAR_FEATURED_LIST.length);
    }, 12000);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, []);

  const handleSelectIndex = (idx: number) => {
    setCurrentIndex(idx);
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    autoPlayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % RADAR_FEATURED_LIST.length);
    }, 12000);
  };

  const handleNext = () => {
    handleSelectIndex((currentIndex + 1) % RADAR_FEATURED_LIST.length);
  };

  const ActiveIcon = currentItem.icon;
  const whatsappLink = `https://wa.me/${currentItem.whatsappPhone}?text=Hola%20${encodeURIComponent(currentItem.name)},%20los%20vi%20en%20Cumaná%20Conecta`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-12 scroll-mt-24" id="radar-cartografico">
      {/* Marco Oscuro Compacto Unificado (No cambia de tamaño) */}
      <div className="rounded-[22px] sm:rounded-[26px] bg-[#0c1017] border border-[#1a2330] p-3.5 sm:p-5 shadow-2xl text-white">
        
        {/* Cabecera Superior del Marco */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5 sm:mb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#092225] border border-[#144749] flex items-center justify-center text-[#00e5aa] shrink-0 shadow-inner">
              <Map className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] font-mono-tabular font-bold tracking-wider text-slate-400 uppercase block leading-none mb-0.5">
                TELEMETRÍA CARTOGRÁFICA EN TIEMPO REAL
              </span>
              <h2 className="text-base sm:text-xl font-black text-white tracking-tight leading-none">
                Ficha del Comercio y Mapa de Ubicación en Cumaná
              </h2>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#081f1b] text-[#00e5aa] border border-[#13493b] text-[10px] font-mono-tabular font-bold whitespace-nowrap shadow-xs self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e5aa] animate-pulse" />
            <span>RADAR ACTIVO · GOLFO DE CARIACO</span>
          </div>
        </div>

        {/* Grilla 2 Columnas de Altura Fija y Compacta (No cambia tamaño) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch lg:h-[370px]">
          
          {/* =========================================================================
              COLUMNA IZQUIERDA: FICHA DEL COMERCIO (Compacta, medidas fijas, sin hueco)
          ========================================================================= */}
          <div className="lg:col-span-5 rounded-2xl bg-[#131922] border border-[#1e2633] p-3.5 sm:p-4 shadow-xl relative overflow-hidden flex flex-col justify-between h-full text-white">
            {/* Resplandor sutil en esquina superior izquierda */}
            <div className="absolute -top-16 -left-16 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-between h-full gap-3">
              {/* Bloque Superior: Encabezado e Información Operativa que rellena el espacio */}
              <div className="space-y-3.5 sm:space-y-4">
                {/* Fila 1: Ícono de Comercio + Badges + Nombre + Botón [X] */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#162428] border border-[#1f4247] flex items-center justify-center text-[#00e5aa] shrink-0 shadow-inner">
                      <ActiveIcon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="px-2 py-0.5 rounded bg-[#18212d] text-slate-300 text-[9.5px] font-mono-tabular font-bold uppercase tracking-wider">
                          {currentItem.zoneBadge}
                        </span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0c2420] text-[#00e5aa] border border-[#134b3d] text-[9.5px] font-mono-tabular font-bold uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00e5aa] animate-pulse" />
                          ABIERTO HOY
                        </span>
                      </div>
                      <h3 
                        onClick={() => matchedBusiness && onOpenDetail?.(matchedBusiness)}
                        className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug hover:text-[#00e5aa] transition-colors cursor-pointer truncate"
                        title={currentItem.name}
                      >
                        {currentItem.name}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-7 h-7 rounded-lg bg-[#1a212c] text-slate-400 hover:text-white flex items-center justify-center border border-[#232d3b] transition-all cursor-pointer shrink-0"
                    title="Siguiente comercio en radar"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Fila 2: Horario de Operación (Letras más grandes y separadas) */}
                <div className="flex items-start gap-2.5 pt-0.5">
                  <div className="w-5 h-5 flex items-center justify-center text-[#ff6647] shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 stroke-[2.4]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[11px] font-mono-tabular font-bold tracking-wider text-[#ff7859] uppercase block leading-none mb-1">
                      HORARIO DE OPERACIÓN:
                    </span>
                    <p className="text-xs sm:text-[12.5px] text-slate-200 font-normal leading-snug line-clamp-2">
                      {currentItem.schedule}
                    </p>
                  </div>
                </div>

                {/* Fila 3: Dirección Física (Letras más grandes y separadas) */}
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 flex items-center justify-center text-[#00e5aa] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 stroke-[2.4]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[11px] font-mono-tabular font-bold tracking-wider text-[#00e5aa] uppercase block leading-none mb-1">
                      DIRECCIÓN FÍSICA:
                    </span>
                    <p className="text-xs sm:text-[12.5px] text-slate-200 font-normal leading-snug line-clamp-2">
                      {currentItem.address}
                    </p>
                  </div>
                </div>

                {/* Fila 4: Telemetría de Caja & Pagos (Rellena el espacio hacia los botones) */}
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 flex items-center justify-center text-[#f59e0b] shrink-0 mt-0.5">
                    <DollarSign className="w-4 h-4 stroke-[2.4]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[11px] font-mono-tabular font-bold tracking-wider text-[#fbbf24] uppercase block leading-none mb-1">
                      TELEMETRÍA DE CAJA & PAGOS:
                    </span>
                    <p className="text-xs sm:text-[12.5px] text-slate-200 font-normal leading-snug line-clamp-2">
                      Tasa BCV del día: <strong className="text-[#00e5aa] font-bold font-mono-tabular">876,80 Bs/USD</strong> · {currentItem.payment}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bloque Inferior: Botones + Banner Propietario (Juntos y Pegados) */}
              <div className="space-y-2 pt-2 border-t border-[#182330]">
                {/* Botones de Acción */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 px-3 bg-[#ff5537] hover:bg-[#ff4422] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-mono-tabular tracking-wider uppercase shadow-sm shadow-orange-950/20 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-white shrink-0" />
                    <span>CONTACTAR POR WHATSAPP</span>
                  </a>

                  <a
                    href={currentItem.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 px-3 bg-[#18202c] hover:bg-[#202b3b] text-slate-200 border border-[#273445] font-bold rounded-xl flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-mono-tabular tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Navigation className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    <span>VER EN GOOGLE MAPS</span>
                  </a>
                </div>

                {/* Banner Dorado para Propietarios Pegado a los Botones */}
                <div 
                  onClick={onOpenVerification}
                  className="bg-[#1a1b14] hover:bg-[#222319] border border-[#3e391b] rounded-xl p-2 flex items-center justify-between gap-2.5 text-amber-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#2e2b17] border border-[#52491f] flex items-center justify-center text-[#fbbf24] shrink-0">
                      <Award className="w-3.5 h-3.5 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-[#fbbf24] uppercase tracking-wider leading-none mb-0.5 truncate">
                        ¿ERES EL PROPIETARIO DE ESTE NEGOCIO?
                      </p>
                      <p className="text-[9.5px] text-[#d4c990] leading-tight truncate">
                        Activa tu Videoruta de 45s y gestión Multi-Sede verificada.
                      </p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-lg bg-[#3a3518] text-[#fbbf24] group-hover:bg-[#4d4620] flex items-center justify-center transition-all shrink-0">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              COLUMNA DERECHA: RADAR SATELITAL & MAPA COMPACTO (Sincronizado a la misma línea)
          ========================================================================= */}
          <div className="lg:col-span-7 rounded-2xl bg-[#131922] border border-[#1e2633] shadow-xl relative overflow-hidden flex flex-col justify-between h-full text-white">
            
            {/* Barra Superior en el Mapa: Radar Activo + Botones [+] [-] [🎯] */}
            <div className="absolute top-3 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111822]/95 border border-[#1f2b3b] text-[#00e5aa] text-[9.5px] font-mono-tabular font-bold shadow-md pointer-events-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e5aa] animate-pulse" />
                <span>RADAR SATELITAL ACTIVO</span>
              </div>

              <div className="flex items-center gap-1 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.35))}
                  className="w-7 h-7 rounded-lg bg-[#18212d] hover:bg-[#202c3c] text-slate-300 border border-[#232e3e] flex items-center justify-center transition-all cursor-pointer"
                  title="Acercar mapa"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.85))}
                  className="w-7 h-7 rounded-lg bg-[#18212d] hover:bg-[#202c3c] text-slate-300 border border-[#232e3e] flex items-center justify-center transition-all cursor-pointer"
                  title="Alejar mapa"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="w-7 h-7 rounded-lg bg-[#0f2a24] hover:bg-[#153a32] text-[#00e5aa] border border-[#135040] flex items-center justify-center transition-all cursor-pointer"
                  title="Centrar radar en Cumaná"
                >
                  <LocateFixed className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Canvas Cartográfico Compacto y Centrado (No se sale) */}
            <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden">
              <div 
                className="relative w-full h-full flex items-center justify-center transition-transform duration-500 ease-out"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* SVG Cartográfico de Cumaná Proporcional y Centrado */}
                <svg 
                  viewBox="0 0 900 520" 
                  className="w-full h-full select-none pointer-events-none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="mapWaterCompact" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#151d27" />
                      <stop offset="100%" stopColor="#182330" />
                    </linearGradient>

                    <linearGradient id="mapLandCompact" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#222c3b" />
                      <stop offset="100%" stopColor="#1c2431" />
                    </linearGradient>
                  </defs>

                  {/* Mar Caribe y Golfo de Cariaco */}
                  <rect width="900" height="520" fill="url(#mapWaterCompact)" />

                  {/* Silueta de Costa de Cumaná */}
                  <path 
                    d="M -30 550 
                       L -30 330 
                       C 50 330, 120 350, 180 310 
                       C 240 270, 270 230, 350 215 
                       C 390 205, 430 200, 480 210 
                       C 530 220, 600 215, 660 195 
                       C 730 175, 820 205, 950 180 
                       L 950 550 Z" 
                    fill="url(#mapLandCompact)" 
                    stroke="#2d3b4d" 
                    strokeWidth="2" 
                  />

                  {/* Línea costera */}
                  <path 
                    d="M -30 330 
                       C 50 330, 120 350, 180 310 
                       C 240 270, 270 230, 350 215 
                       C 390 205, 430 200, 480 210 
                       C 530 220, 600 215, 660 195 
                       C 730 175, 820 205, 950 180" 
                    fill="none" 
                    stroke="#38495f" 
                    strokeWidth="2.5" 
                  />

                  {/* Carreteras principales */}
                  <path d="M 100 380 C 190 330, 320 270, 460 245 C 570 235, 690 225, 840 210" fill="none" stroke="#2e3c4e" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 460 245 L 450 370 L 480 480" fill="none" stroke="#2a3749" strokeWidth="2" />
                  <path d="M 180 310 C 215 380, 250 430, 350 480" fill="none" stroke="#263242" strokeWidth="1.8" />
                  <path d="M 450 370 C 550 385, 620 345, 710 295" fill="none" stroke="#263242" strokeWidth="1.8" />

                  {/* Topónimos geográficos exactos */}
                  <text x="630" y="125" fill="#3b4d63" fontSize="11" fontWeight="bold" letterSpacing="1" fontFamily="sans-serif">Mar Caribe</text>
                  <text x="470" y="185" fill="#4d617a" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Centro Hipergalerías</text>
                  <text x="525" y="250" fill="#647b99" fontSize="9" fontWeight="bold" letterSpacing="1" fontFamily="sans-serif">DOWNTOWN</text>

                  <text x="160" y="350" fill="#546b85" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Playa San Luis</text>
                  <text x="125" y="400" fill="#44576d" fontSize="8" fontWeight="bold" fontFamily="sans-serif">LOS BORDONES</text>
                  <text x="90" y="460" fill="#364557" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">EL TACAL</text>

                  <text x="605" y="255" fill="#4a5f78" fontSize="8" fontWeight="bold" fontFamily="sans-serif">BARRIO CAIGÜIRE</text>
                  <text x="700" y="245" fill="#4a5f78" fontSize="8" fontWeight="bold" fontFamily="sans-serif">EL PEÑÓN</text>

                  <text x="560" y="390" fill="#445870" fontSize="8" fontWeight="bold" fontFamily="sans-serif">CANTARRANA</text>
                  <text x="600" y="460" fill="#364659" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">PANTANILLO</text>
                  <text x="460" y="485" fill="#364659" fontSize="8" fontWeight="bold" fontFamily="sans-serif">El Paveo · Ortiz</text>
                </svg>

                {/* =========================================================================
                    LOS 4 PINES INTERACTIVOS CALIBRADOS (No se salen ni estorban)
                ========================================================================= */}
                
                {/* PIN 1: EL MARINO (Puerto Sucre - Naranja / Ancla) */}
                <div 
                  onClick={() => handleSelectIndex(0)}
                  className="absolute cursor-pointer z-30 group -translate-x-1/2 -translate-y-1/2"
                  style={{ left: '62%', top: '46%' }}
                >
                  {currentIndex === 0 && (
                    <>
                      <span className="absolute -inset-2 rounded-full border border-[#ff5537] animate-ping opacity-60 pointer-events-none" />
                      <span className="absolute -inset-3 rounded-full bg-[#ff5537]/20 blur-xs pointer-events-none" />
                    </>
                  )}
                  
                  <div className={`relative w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-[#ff5537] text-white flex items-center justify-center shadow-md transition-transform duration-300 border border-white/40 ${currentIndex === 0 ? 'scale-115 ring-3 ring-[#ff5537]/30' : 'group-hover:scale-110'}`}>
                    <Anchor className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.4]" />
                  </div>

                  <div className={`absolute left-1/2 -translate-x-1/2 -top-6 whitespace-nowrap px-2 py-0.5 rounded-full bg-[#0e141d]/95 border border-[#232f3f] text-white text-[9px] font-mono-tabular font-bold tracking-tight shadow-md flex items-center gap-1 transition-opacity duration-200 ${currentIndex === 0 ? 'opacity-100 scale-100' : 'opacity-80 group-hover:opacity-100'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff5537] shrink-0" />
                    <span>EL MARINO · PUERTO SUCRE</span>
                  </div>
                </div>

                {/* PIN 2: ECONOQUESO / PAPELERÍA (Centro - Verde Menta / ShoppingBag / Book) */}
                <div 
                  onClick={() => handleSelectIndex(currentIndex === 1 ? 2 : 1)}
                  className="absolute cursor-pointer z-30 group -translate-x-1/2 -translate-y-1/2"
                  style={{ left: '68%', top: '58%' }}
                >
                  {(currentIndex === 1 || currentIndex === 2) && (
                    <>
                      <span className="absolute -inset-2 rounded-full border border-[#00e5aa] animate-ping opacity-60 pointer-events-none" />
                      <span className="absolute -inset-3 rounded-full bg-[#00e5aa]/20 blur-xs pointer-events-none" />
                    </>
                  )}

                  <div className={`relative w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-[#00e5aa] text-slate-950 flex items-center justify-center shadow-md transition-transform duration-300 border border-white/40 ${(currentIndex === 1 || currentIndex === 2) ? 'scale-115 ring-3 ring-[#00e5aa]/30' : 'group-hover:scale-110'}`}>
                    {currentIndex === 2 ? (
                      <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.4]" />
                    ) : (
                      <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.4]" />
                    )}
                  </div>

                  <div className={`absolute left-1/2 -translate-x-1/2 -top-6 whitespace-nowrap px-2 py-0.5 rounded-full bg-[#0e141d]/95 border border-[#232f3f] text-white text-[9px] font-mono-tabular font-bold tracking-tight shadow-md flex items-center gap-1 transition-opacity duration-200 ${(currentIndex === 1 || currentIndex === 2) ? 'opacity-100 scale-100' : 'opacity-80 group-hover:opacity-100'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e5aa] shrink-0" />
                    <span>{currentIndex === 2 ? 'PAPELERÍA BOLÍVAR' : 'ECONOQUESO · CENTRO'}</span>
                  </div>
                </div>

                {/* PIN 3: LA CASONA (Playa San Luis - Amarillo / Tenedor) */}
                <div 
                  onClick={() => handleSelectIndex(3)}
                  className="absolute cursor-pointer z-30 group -translate-x-1/2 -translate-y-1/2"
                  style={{ left: '47%', top: '56%' }}
                >
                  {currentIndex === 3 && (
                    <>
                      <span className="absolute -inset-2 rounded-full border border-[#fbbf24] animate-ping opacity-60 pointer-events-none" />
                      <span className="absolute -inset-3 rounded-full bg-[#fbbf24]/20 blur-xs pointer-events-none" />
                    </>
                  )}

                  <div className={`relative w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-[#fbbf24] text-slate-950 flex items-center justify-center shadow-md transition-transform duration-300 border border-white/40 ${currentIndex === 3 ? 'scale-115 ring-3 ring-[#fbbf24]/30' : 'group-hover:scale-110'}`}>
                    <Utensils className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.4]" />
                  </div>

                  {currentIndex === 3 && (
                    <div className="absolute left-1/2 -translate-x-1/2 -top-6 whitespace-nowrap px-2 py-0.5 rounded-full bg-[#0e141d]/95 border border-[#232f3f] text-white text-[9px] font-mono-tabular font-bold tracking-tight shadow-md flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] shrink-0" />
                      <span>LA CASONA · PLAYA SAN LUIS</span>
                    </div>
                  )}
                </div>

                {/* PIN 4: FARMACIA SAN ANTONIO (Cantarrana - Coral Rojo / Salud) */}
                <div 
                  onClick={() => handleSelectIndex(4)}
                  className="absolute cursor-pointer z-30 group -translate-x-1/2 -translate-y-1/2"
                  style={{ left: '64%', top: '69%' }}
                >
                  {currentIndex === 4 && (
                    <>
                      <span className="absolute -inset-2 rounded-full border border-[#ff6b6b] animate-ping opacity-60 pointer-events-none" />
                      <span className="absolute -inset-3 rounded-full bg-[#ff6b6b]/20 blur-xs pointer-events-none" />
                    </>
                  )}

                  <div className={`relative w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-[#ff6b6b] text-white flex items-center justify-center shadow-md transition-transform duration-300 border border-white/40 ${currentIndex === 4 ? 'scale-115 ring-3 ring-[#ff6b6b]/30' : 'group-hover:scale-110'}`}>
                    <HeartPulse className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.4]" />
                  </div>

                  {currentIndex === 4 && (
                    <div className="absolute left-1/2 -translate-x-1/2 -top-6 whitespace-nowrap px-2 py-0.5 rounded-full bg-[#0e141d]/95 border border-[#232f3f] text-white text-[9px] font-mono-tabular font-bold tracking-tight shadow-md flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b6b] shrink-0" />
                      <span>SAN ANTONIO · 24H</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Barra Inferior del Mapa: Cobertura + Coordenadas + Botón Pantalla Completa */}
            <div className="relative z-20 bg-[#10151f]/95 border-t border-[#1a2330] px-3.5 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[9.5px] sm:text-[10px] font-mono-tabular text-slate-400">
              <div className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-[#00e5aa] animate-pulse shrink-0" />
                <span>VISUALIZANDO <strong className="text-white font-bold">208 NODOS</strong> · COBERTURA SUCRE</span>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
                <span>
                  LAT <strong className="text-white">{currentItem.lat.toFixed(4)}° N</strong> · LON <strong className="text-white">{Math.abs(currentItem.lng).toFixed(4)}° W</strong>
                </span>

                <button
                  type="button"
                  onClick={() => matchedBusiness && onOpenDetail?.(matchedBusiness)}
                  className="px-2.5 py-0.5 rounded bg-[#0c2420] hover:bg-[#11332c] text-[#00e5aa] border border-[#134b3d] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer text-[9px]"
                  title="Abrir ficha en pantalla completa"
                >
                  <span>PANTALLA COMPLETA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
