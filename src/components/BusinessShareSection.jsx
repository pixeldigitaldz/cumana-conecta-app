import React, { useState } from 'react';
import { Share2, Send, Copy, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

/**
 * Icono SVG oficial de X (Twitter)
 */
function XIcon({ className = 'w-4 h-4', size = 15 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function BusinessShareSection({ business, isOpen = true }) {
  const { isDark } = useTheme();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const {
    name = 'Comercio en Cumaná',
    description = '',
    activePromotion = '',
    zone = 'Cumaná, Sucre',
    whatsapp = '',
    slug,
    id,
  } = business || {};

  // Formato del enlace sin '#' residual
  const shareIdentifier = slug || id || encodeURIComponent(name);
  const cleanUrl = `${window.location.origin}/?negocio=${shareIdentifier}`;

  // Eslogan o texto representativo
  const slogan = activePromotion
    ? activePromotion
    : description
    ? description.slice(0, 95) + (description.length > 95 ? '...' : '')
    : 'Comercio verificado de Cumaná, Estado Sucre';

  // Mensaje estructurado exacto al de la captura
  const line1 = `🏪 ${name} — "${slogan}"`;
  const line2 = `📍 ${zone} • 🕒 ${isOpen ? 'Abierto ahora' : 'Horario comercial'} • 📞 +${whatsapp}`;
  const line3 = `🔗 ${cleanUrl}`;
  const fullShareText = `${line1}\n${line2}\n${line3}`;

  // Copiar al portapapeles
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      toast.copy('¡Mensaje formateado copiado al portapapeles!');
    } catch {
      // Fallback
    }
  };

  // Compartir en Telegram
  const handleTelegramShare = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(cleanUrl)}&text=${encodeURIComponent(line1 + '\n' + line2)}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  // Compartir en X (Twitter)
  const handleXShare = () => {
    const tweetText = `${line1}\n${line2}\n${cleanUrl}`;
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className={`w-full rounded-2xl border p-5 sm:p-6 space-y-4 shadow-2xs transition-colors font-['Inter'] ${
      isDark ? 'bg-[#121316] border-[#282a32]' : 'bg-white border-slate-200'
    }`}>
      
      {/* ─── Encabezado de Compartir ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Share2 size={19} />
          </div>
          <div>
            <h3 className={`font-['Outfit'] font-bold text-base sm:text-lg leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Compartir Ficha del Comercio
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Envía directamente a Telegram o X con formato optimizado y enlace directo
            </p>
          </div>
        </div>

        <div className="shrink-0 self-start sm:self-auto">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
            FORMATO PREDEFINIDO
          </span>
        </div>
      </div>

      {/* ─── Caja de Previsualización del Mensaje Auto-generado ─── */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#16181f] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600 dark:text-slate-400">
            Mensaje que se enviará:
          </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
            Auto-generado
          </span>
        </div>

        <div className="text-xs leading-relaxed space-y-1 font-medium text-slate-800 dark:text-slate-200 font-['Inter'] select-text">
          <p className="font-semibold text-slate-900 dark:text-white">
            {line1}
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            {line2}
          </p>
          <p className="text-sky-600 dark:text-sky-400 break-all font-mono text-[11px]">
            {line3}
          </p>
        </div>
      </div>

      {/* ─── Botones de Acción ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        
        {/* 1. Botón Telegram */}
        <button
          type="button"
          onClick={handleTelegramShare}
          className="h-11 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Send size={15} />
          <span>Enviar a Telegram</span>
        </button>

        {/* 2. Botón X (Twitter) */}
        <button
          type="button"
          onClick={handleXShare}
          className="h-11 px-4 rounded-xl bg-[#0f1419] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer border border-slate-800"
        >
          <XIcon size={14} className="text-white" />
          <span>Compartir en X</span>
        </button>

        {/* 3. Botón Copiar Texto Listo */}
        <button
          type="button"
          onClick={handleCopy}
          className={`h-11 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all active:scale-95 cursor-pointer shadow-2xs ${
            copied
              ? 'bg-emerald-500 text-white border-emerald-600'
              : isDark
              ? 'bg-[#1e2026] hover:bg-[#252830] text-slate-200 border-slate-700'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
          }`}
        >
          {copied ? <Check size={15} className="text-white" /> : <Copy size={15} />}
          <span>{copied ? '¡Copiado!' : 'Copiar Texto Listo'}</span>
        </button>

      </div>

    </section>
  );
}
