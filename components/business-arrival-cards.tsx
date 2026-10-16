'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Map as MapIcon, 
  Video, 
  ChevronRight, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Share2,
  Sparkles,
  Play
} from 'lucide-react';
import { Business } from '@/types/business';
import { WhatsAppIcon, InstagramIcon, TikTokIcon } from '@/components/social-icons';
import { is24HoursSchedule } from '@/lib/business-hours';
import { OfficialChannelsCard } from '@/components/official-channels-card';
import { ScheduleAndChannelsCard } from '@/components/schedule-channels-card';

interface BusinessArrivalCardsProps {
  business: Business;
  onOpenVideoRoute?: () => void;
  className?: string;
}

export function BusinessArrivalCards({ 
  business, 
  onOpenVideoRoute,
  className = '' 
}: BusinessArrivalCardsProps) {
  const [isPlayingVideoModal, setIsPlayingVideoModal] = useState(false);

  // Determinar URLs de GPS
  const googleMapsUrl = business.mapsUrl && business.mapsUrl.startsWith('http')
    ? business.mapsUrl
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name}, ${business.address}, Cumana, Venezuela`)}`;

  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(`${business.name}, ${business.address}, Cumana`)}&navigate=yes`;

  // Datos de la ruta
  const routeOrigin = business.videoRoute?.originName || 'El Indio / Av. Perimetral';
  const routeDuration = business.videoRoute?.duration || '4 min';

  // Punto clave de entrada (extraído de hitos o generado con la dirección y zona)
  const landmarkText = business.videoRoute?.milestones && business.videoRoute.milestones.length > 0
    ? business.videoRoute.milestones[business.videoRoute.milestones.length - 1]?.description || 
      `A 200 metros del muelle artesanal de pescadores. Ubicarás un portón blanco distintivo con tres palmeras iluminadas en ámbar y rótulo de madera marina tallada.`
    : `A pocos metros de la vía principal de ${business.zone}. Ubicarás fachada identificada con rótulo comercial iluminado frente a la avenida principal.`;

  // Día de la semana actual (0 = Domingo, 1 = Lunes... 5 = Viernes por defecto)
  const [todayIndex, setTodayIndex] = useState<number>(5);

  React.useEffect(() => {
    setTodayIndex(new Date().getDay());
  }, []);

  // Horario por días de la semana
  const is24_7 = is24HoursSchedule(business.openingHours);

  // Formato de estado hoy
  const getTodayStatusText = () => {
    if (is24_7) return '24/7 ABIERTO PERMANENTE';
    if (!business.isOpenNow) return 'CERRADO POR EL MOMENTO';
    return 'HOY ABIERTO HASTA 11:00 PM';
  };

  const scheduleDays = [
    {
      id: 1,
      day: 'Lunes',
      hours: is24_7 ? 'Abierto 24 Horas' : 'Cerrado (Mantenimiento Marino)',
      isSpecial: false,
      isClosed: !is24_7 && true,
      dayIndex: 1
    },
    {
      id: 2,
      day: 'Martes – Jueves',
      hours: is24_7 ? 'Abierto 24 Horas' : '11:30 AM – 10:00 PM',
      isSpecial: false,
      isClosed: false,
      dayIndex: [2, 3, 4]
    },
    {
      id: 3,
      day: 'Viernes',
      hours: is24_7 ? 'Abierto 24 Horas' : '11:30 AM – 11:00 PM',
      isSpecial: true,
      isClosed: false,
      dayIndex: 5
    },
    {
      id: 4,
      day: 'Sábado (Música en Vivo)',
      hours: is24_7 ? 'Abierto 24 Horas' : '11:00 AM – 11:30 PM',
      isSpecial: false,
      isClosed: false,
      dayIndex: 6
    },
    {
      id: 5,
      day: 'Domingo Familiar',
      hours: is24_7 ? 'Abierto 24 Horas' : '11:00 AM – 09:30 PM',
      isSpecial: false,
      isClosed: false,
      dayIndex: 0
    }
  ];

  // Comprobar si el item es el día de hoy
  const isItemToday = (dayIdx: number | number[]) => {
    if (Array.isArray(dayIdx)) {
      return dayIdx.includes(todayIndex);
    }
    return dayIdx === todayIndex;
  };

  // Enlace Instagram
  const instagramHandle = business.socials.instagram 
    ? business.socials.instagram.replace(/.*instagram\.com\//, '@').replace(/\/$/, '')
    : `@${business.slug.replace(/-/g, '')}`;

  const instagramUrl = business.socials.instagram || `https://instagram.com/${business.slug}`;

  // Enlace TikTok
  const tiktokUrl = business.socials.tiktok || `https://tiktok.com/@${business.slug}`;

  // Enlace WhatsApp VIP
  const whatsappVipUrl = business.socials.whatsapp.startsWith('http') 
    ? business.socials.whatsapp 
    : `https://wa.me/${business.socials.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, vengo de Cumaná Conecta para consultar sobre ${business.name}`)}`;

  const handleVideoClick = () => {
    if (onOpenVideoRoute) {
      onOpenVideoRoute();
    } else {
      setIsPlayingVideoModal(true);
    }
  };

  return (
    <div className={`space-y-4.5 ${className}`}>
      {/* ============================================================== */}
      {/* TARJETA 1: RUTA DIRECTA & PUNTO CLAVE DE ENTRADA */}
      {/* ============================================================== */}
      <div className="rounded-3xl bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] text-slate-900 dark:text-white p-5 sm:p-6 space-y-4.5 shadow-sm dark:shadow-xl relative overflow-hidden transition-colors">
        {/* Cabecera con Vista Previa de Ruta */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-xs dark:shadow-inner">
          {/* Fondo sutil de mapa estilizado */}
          <div 
            className="absolute inset-0 opacity-15 dark:opacity-20 bg-cover bg-center pointer-events-none"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-100/95 to-slate-100/40 dark:from-slate-950 dark:via-slate-950/90 dark:to-transparent pointer-events-none" />

          {/* Izquierda: Icono de Ruta + Textos */}
          <div className="relative z-10 flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-[#FF6B4A] flex items-center justify-center shrink-0 shadow-xs text-white">
              <Navigation className="w-4 h-4 -rotate-45" />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <h4 className="text-xs font-black text-slate-900 dark:text-white truncate leading-tight">
                Ruta Directa desde {routeOrigin}
              </h4>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 font-medium truncate leading-tight">
                Perimetral Este → {business.zone}
              </p>
            </div>
          </div>

          {/* Derecha: Tiempo Estimado */}
          <div className="relative z-10 shrink-0">
            <span className="px-2.5 py-1 rounded-full bg-white/90 dark:bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-[#008966] dark:text-teal-300 border border-emerald-300/60 dark:border-teal-500/40 shadow-2xs">
              {routeDuration}
            </span>
          </div>
        </div>

        {/* Punto Clave de Entrada */}
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-[#F59E0B]">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-amber-600 dark:text-[#F59E0B]">
              PUNTO CLAVE DE ENTRADA
            </span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {landmarkText}
          </p>
        </div>

        {/* Dos Botones de GPS en Horizontal */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-[#1E2D45] transition-all shadow-2xs dark:shadow-xs cursor-pointer active:scale-98 group text-center"
          >
            <MapIcon className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white shrink-0" />
            <span>Google Maps</span>
          </a>

          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-[#1E2D45] transition-all shadow-2xs dark:shadow-xs cursor-pointer active:scale-98 group text-center"
          >
            <Navigation className="w-4 h-4 text-[#008966] dark:text-[#00C292] group-hover:text-emerald-600 dark:group-hover:text-teal-300 shrink-0" />
            <span>Waze GPS</span>
          </a>
        </div>

        {/* Botón Destacado: Video Ruta en 45 Segundos */}
        <button
          type="button"
          onClick={handleVideoClick}
          className="w-full p-3 sm:p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/90 dark:bg-[#0E1726] dark:hover:bg-[#162235] border border-slate-200 dark:border-[#1E2D45] flex items-center justify-between transition-all cursor-pointer group shadow-2xs dark:shadow-xs active:scale-99 text-left"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
              <Video className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <h5 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-[#FF6B4A] dark:group-hover:text-teal-200 transition-colors leading-tight">
                Video Ruta en {routeDuration}
              </h5>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate leading-tight">
                Cómo entrar desde la Perimetral paso a paso
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
        </button>
      </div>

      {/* ============================================================== */}
      {/* TARJETA 2: HORARIOS Y CANALES OFICIALES UNIFICADOS */}
      {/* ============================================================== */}
      <ScheduleAndChannelsCard 
        openingHours={business.openingHours}
        socials={business.socials}
        businessName={business.name}
        phone={business.phone}
        className="rounded-3xl bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] text-slate-900 dark:text-white p-5 sm:p-6 shadow-sm dark:shadow-xl relative transition-colors"
      />

      {/* Modal para ver video-ruta si se presiona el botón */}
      {isPlayingVideoModal && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsPlayingVideoModal(false)}
        >
          <div 
            className="relative w-full max-w-sm bg-white dark:bg-[#131F33] rounded-3xl border border-slate-200 dark:border-[#1E2D45] overflow-hidden shadow-2xl p-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-slate-900 dark:text-white border-b border-slate-200 dark:border-[#1E2D45] pb-2">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Video className="w-4 h-4 text-amber-500" />
                <span>Video-Ruta: {business.name}</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsPlayingVideoModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>
            <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              {business.videoRoute?.videoUrl ? (
                <video
                  src={business.videoRoute.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <Play className="w-10 h-10 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400 font-medium">Video-ruta demostrativa de Cumaná Conecta</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
