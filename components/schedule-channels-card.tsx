'use client';

import React from 'react';
import { 
  Clock, 
  ExternalLink, 
  MessageCircle, 
  Camera, 
  Users, 
  Video, 
  PlaySquare, 
  Globe 
} from 'lucide-react';
import { SocialLinks } from '@/types/business';
import { formatSocialHandle } from '@/components/official-channels-card';

export interface ScheduleRow {
  days: string;
  hours: string;
}

export function parseScheduleRows(openingHours?: string): ScheduleRow[] {
  if (!openingHours || !openingHours.trim()) {
    return [
      { days: 'Lunes a Viernes', hours: '8:00 AM - 6:00 PM' },
      { days: 'Sábado', hours: '8:00 AM - 2:00 PM' }
    ];
  }

  const clean = openingHours.trim();

  // Caso 24 Horas Continuas
  if (/24\s*(h|horas)/i.test(clean)) {
    return [
      { days: 'Lunes a Domingo', hours: '24 Horas Continuas' }
    ];
  }

  // Si contiene separador pipe |
  if (clean.includes('|')) {
    return clean.split('|').map(part => {
      const p = part.trim();
      if (p.includes(':')) {
        const colonIdx = p.indexOf(':');
        return {
          days: p.slice(0, colonIdx).trim(),
          hours: p.slice(colonIdx + 1).trim()
        };
      }
      return { days: 'Horario', hours: p };
    });
  }

  // Si contiene separador punto medio ·
  if (clean.includes('·')) {
    return clean.split('·').map(part => {
      const p = part.trim();
      if (p.includes(':')) {
        const colonIdx = p.indexOf(':');
        return {
          days: p.slice(0, colonIdx).trim(),
          hours: p.slice(colonIdx + 1).trim()
        };
      }
      return { days: 'Horario', hours: p };
    });
  }

  // Si tiene formato "Lunes a Sábado: ..."
  if (clean.includes(':') && (clean.toLowerCase().includes('lunes') || clean.toLowerCase().includes('domingo') || clean.toLowerCase().includes('sábado') || clean.toLowerCase().includes('sabado'))) {
    const colonIdx = clean.indexOf(':');
    return [
      { days: clean.slice(0, colonIdx).trim(), hours: clean.slice(colonIdx + 1).trim() }
    ];
  }

  // Si es un horario regular como "7:30 AM - 5:30 PM" (ejemplo AutoServicio Oriente Motors)
  return [
    { days: 'Lunes a Viernes', hours: clean },
    { days: 'Sábado', hours: '8:00 AM - 1:00 PM' }
  ];
}

interface ScheduleAndChannelsCardProps {
  openingHours?: string;
  socials?: SocialLinks;
  businessName?: string;
  phone?: string;
  className?: string;
}

export function ScheduleAndChannelsCard({
  openingHours,
  socials,
  businessName = 'el comercio',
  phone,
  className = ''
}: ScheduleAndChannelsCardProps) {
  const scheduleRows = parseScheduleRows(openingHours);

  // Canales oficiales habilitados en el orden exacto solicitado:
  // 1. WhatsApp, 2. Instagram, 3. Facebook, 4. TikTok, 5. YouTube, 6. Web
  const channels = [];

  // 1. WhatsApp Oficial
  const rawWhatsapp = socials?.whatsapp || phone;
  if (rawWhatsapp && rawWhatsapp.trim()) {
    const cleanNumber = rawWhatsapp.split('?')[0].replace(/[^0-9]/g, '');
    const fullUrl = rawWhatsapp.startsWith('http') 
      ? rawWhatsapp 
      : `https://wa.me/${cleanNumber}?text=${encodeURIComponent(`Hola ${businessName}, los encontré en CumanáConecta.`)}`;
    
    channels.push({
      id: 'whatsapp',
      name: 'WhatsApp',
      handle: formatSocialHandle(rawWhatsapp, 'whatsapp') || '+58 WhatsApp',
      url: fullUrl,
      icon: MessageCircle,
      iconColor: 'text-[#25D366]',
      borderColor: 'hover:border-[#25D366]/50'
    });
  }

  // 2. Instagram
  if (socials?.instagram && socials.instagram.trim()) {
    const raw = socials.instagram.trim();
    const fullUrl = raw.startsWith('http') ? raw : `https://instagram.com/${raw.replace(/^@/, '')}`;
    channels.push({
      id: 'instagram',
      name: 'Instagram',
      handle: formatSocialHandle(raw, 'instagram'),
      url: fullUrl,
      icon: Camera,
      iconColor: 'text-[#E1306C]',
      borderColor: 'hover:border-[#E1306C]/50'
    });
  }

  // 3. Facebook
  if (socials?.facebook && socials.facebook.trim()) {
    const raw = socials.facebook.trim();
    const fullUrl = raw.startsWith('http') ? raw : `https://facebook.com/${raw.replace(/^\//, '')}`;
    channels.push({
      id: 'facebook',
      name: 'Facebook',
      handle: formatSocialHandle(raw, 'facebook'),
      url: fullUrl,
      icon: Users,
      iconColor: 'text-[#1877F2]',
      borderColor: 'hover:border-[#1877F2]/50'
    });
  }

  // 4. TikTok
  if (socials?.tiktok && socials.tiktok.trim()) {
    const raw = socials.tiktok.trim();
    const fullUrl = raw.startsWith('http') ? raw : `https://tiktok.com/@${raw.replace(/^@/, '')}`;
    channels.push({
      id: 'tiktok',
      name: 'TikTok',
      handle: formatSocialHandle(raw, 'tiktok'),
      url: fullUrl,
      icon: Video,
      iconColor: 'text-[#00F2FE]',
      borderColor: 'hover:border-[#00F2FE]/50'
    });
  }

  // 5. YouTube
  if (socials?.youtube && socials.youtube.trim()) {
    const raw = socials.youtube.trim();
    const fullUrl = raw.startsWith('http') ? raw : `https://youtube.com/@${raw.replace(/^@/, '')}`;
    channels.push({
      id: 'youtube',
      name: 'YouTube',
      handle: formatSocialHandle(raw, 'youtube'),
      url: fullUrl,
      icon: PlaySquare,
      iconColor: 'text-[#FF0000]',
      borderColor: 'hover:border-[#FF0000]/50'
    });
  }

  // 6. Sitio Web / Menú Digital
  if (socials?.website && socials.website.trim()) {
    const raw = socials.website.trim();
    const fullUrl = raw.startsWith('http') ? raw : `https://${raw}`;
    channels.push({
      id: 'website',
      name: 'Sitio Web',
      handle: formatSocialHandle(raw, 'web'),
      url: fullUrl,
      icon: Globe,
      iconColor: 'text-[#F59E0B]',
      borderColor: 'hover:border-[#F59E0B]/50'
    });
  }

  const containerClass = className 
    ? `${className} space-y-3.5` 
    : 'rounded-2xl bg-slate-50 dark:bg-[#131924] border border-slate-200 dark:border-[#1E2536] p-4 sm:p-5 shadow-sm space-y-3.5';

  return (
    <div className={containerClass}>
      {/* Cabecera idéntica al archivo adjunto: Reloj Naranja + HORARIOS Y CANALES OFICIALES */}
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-amber-500 shrink-0" strokeWidth={2.2} />
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          HORARIOS Y CANALES OFICIALES
        </h3>
      </div>

      {/* Filas de Horario de Trabajo con divisor sutil tal cual en la captura */}
      <div className="space-y-2 text-xs sm:text-sm font-medium">
        {scheduleRows.map((row, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#252934]"
          >
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {row.days}
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {row.hours}
            </span>
          </div>
        ))}
      </div>

      {/* Canales Oficiales pegaditos abajo de Sábado, en fila horizontal uno al lado del otro */}
      {channels.length > 0 && (
        <div className="pt-1 flex flex-wrap items-center gap-2">
          {channels.map((ch) => {
            const IconComp = ch.icon;
            return (
              <a
                key={ch.id}
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`${ch.name} de ${businessName}: ${ch.handle}`}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0d1118] border border-slate-200 dark:border-[#252934] ${ch.borderColor} hover:bg-slate-50 dark:hover:bg-[#18202F] transition-all text-xs font-bold text-slate-900 dark:text-white cursor-pointer shadow-xs group`}
              >
                <IconComp className={`w-3.5 h-3.5 shrink-0 ${ch.iconColor}`} strokeWidth={2.2} />
                <span className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-amber-300 transition-colors">
                  {ch.name}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors opacity-70 group-hover:opacity-100 ml-0.5" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
