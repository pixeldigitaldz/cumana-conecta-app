'use client';

import React from 'react';
import { 
  Globe, 
  ExternalLink, 
  MessageCircle, 
  Camera, 
  Users, 
  Video, 
  PlaySquare
} from 'lucide-react';
import { SocialLinks } from '@/types/business';

interface OfficialChannelsCardProps {
  socials?: SocialLinks;
  businessName?: string;
  phone?: string;
  className?: string;
  variant?: 'modal' | 'page';
}

// Limpiar y formatear enlaces a nombres de usuario legibles (ej: @eltimoncostero)
export function formatSocialHandle(
  url?: string, 
  type: 'instagram' | 'tiktok' | 'facebook' | 'youtube' | 'whatsapp' | 'web' = 'instagram'
): string {
  if (!url) return '';
  const clean = url.trim();

  if (type === 'whatsapp') {
    // Extraer solo la parte numérica antes de cualquier parámetro (?text=...)
    let cleanPhone = clean;
    if (cleanPhone.includes('?')) {
      cleanPhone = cleanPhone.split('?')[0];
    }
    if (cleanPhone.includes('&')) {
      cleanPhone = cleanPhone.split('&')[0];
    }
    // Remover protocolo, dominio y rutas de wa.me
    cleanPhone = cleanPhone.replace(/^https?:\/\/(www\.)?(wa\.me|api\.whatsapp\.com\/send(\?phone=)?)\/?/i, '');
    
    const digits = cleanPhone.replace(/[^0-9]/g, '');
    if (digits.startsWith('58') && digits.length >= 12) {
      // 584121234567 -> +58 412-1234567
      return `+58 ${digits.slice(2, 5)}-${digits.slice(5, 12)}`;
    } else if (digits.startsWith('0') && digits.length === 11) {
      // 04121234567 -> +58 412-1234567
      return `+58 ${digits.slice(1, 4)}-${digits.slice(4)}`;
    } else if (digits.length === 10) {
      // 4121234567 -> +58 412-1234567
      return `+58 ${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else if (digits.length > 5) {
      return `+${digits.slice(0, 13)}`;
    }
    return clean;
  }

  if (type === 'instagram') {
    const handle = clean
      .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
      .replace(/\/.*$/, '')
      .replace(/^@/, '');
    return handle ? `@${handle}` : '@instagram';
  }

  if (type === 'tiktok') {
    const handle = clean
      .replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/i, '')
      .replace(/\/.*$/, '')
      .replace(/^@/, '');
    return handle ? `@${handle}` : '@tiktok';
  }

  if (type === 'facebook') {
    const handle = clean
      .replace(/^https?:\/\/(www\.)?facebook\.com\//i, '')
      .replace(/\/.*$/, '')
      .replace(/^\//, '');
    return handle ? `/${handle}` : '/facebook';
  }

  if (type === 'youtube') {
    const handle = clean
      .replace(/^https?:\/\/(www\.)?youtube\.com\/(@|c\/|user\/)?/i, '')
      .replace(/\/.*$/, '')
      .replace(/^@/, '');
    return handle ? `@${handle}` : '@youtube';
  }

  return clean.replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '');
}

export function OfficialChannelsCard({
  socials,
  businessName = 'el comercio',
  phone,
  className = '',
  variant = 'modal'
}: OfficialChannelsCardProps) {
  // Construir lista dinámica: SOLO aparecen las que se hayan configurado en la administración
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
      borderColor: 'hover:border-[#25D366]/40'
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
      borderColor: 'hover:border-[#E1306C]/40'
    });
  }

  // 3. TikTok
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
      borderColor: 'hover:border-[#00F2FE]/40'
    });
  }

  // 4. YouTube (si tienen)
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
      borderColor: 'hover:border-[#FF0000]/40'
    });
  }

  // 5. Facebook
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
      borderColor: 'hover:border-[#1877F2]/40'
    });
  }

  // 6. Sitio Web / Menú Digital (Opcional)
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
      borderColor: 'hover:border-[#F59E0B]/40'
    });
  }

  if (channels.length === 0) return null;

  return (
    <div className={`rounded-2xl transition-all ${
      variant === 'page'
        ? 'bg-white dark:bg-[#131924] border border-slate-200 dark:border-[#1E2536] p-5 sm:p-6 shadow-sm space-y-4'
        : 'bg-slate-50 dark:bg-[#131924] border border-slate-200 dark:border-[#1E2536] p-4 sm:p-5 space-y-3 shadow-sm'
    } ${className}`}>
      {/* Cabecera idéntica al diseño de referencia proporcionado por el usuario */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-[#00E5AA]" strokeWidth={2.2} />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Canales Oficiales
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
          {channels.length} {channels.length === 1 ? 'CANAL DIRECTO' : 'CANALES DIRECTOS'}
        </span>
      </div>

      {/* Lista de Filas de Redes Sociales con Enlaces Directos */}
      <div className="space-y-2.5">
        {channels.map((ch) => {
          const IconComp = ch.icon;
          return (
            <a
              key={ch.id}
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between px-3.5 sm:px-4 py-3 rounded-xl bg-white dark:bg-[#0E121A] hover:bg-slate-100 dark:hover:bg-[#18202F] border border-slate-200 dark:border-[#1c2333] ${ch.borderColor} transition-all group cursor-pointer shadow-xs`}
            >
              {/* Izquierda: Icono oficial en color y Nombre de la red */}
              <div className="flex items-center gap-3 min-w-0">
                <IconComp className={`w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 ${ch.iconColor}`} strokeWidth={2.2} />
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-amber-300 transition-colors truncate">
                  {ch.name}
                </span>
              </div>

              {/* Derecha: Handle en tono melocotón y flecha de apertura */}
              <div className="flex items-center gap-2 shrink-0 pl-2">
                <span className="font-mono text-xs sm:text-sm font-medium text-[#FF7A59] dark:text-[#FFA384] group-hover:underline transition-colors truncate max-w-[170px] sm:max-w-[240px]">
                  {ch.handle}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
