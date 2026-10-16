'use client';

import React, { useState } from 'react';
import { 
  Share2, 
  QrCode, 
  Copy, 
  Check, 
  Printer, 
  Download, 
  X
} from 'lucide-react';
import { Business } from '@/types/business';
import { WhatsAppIcon } from '@/components/social-icons';
import { VerifiedBadge } from '@/components/verified-badge';
import { getCleanBusinessUrl, formatExecutiveShareText, shareBusinessExecutive } from '@/lib/share-utils';

interface BusinessShareCardProps {
  business: Business;
  className?: string;
  compact?: boolean;
}

export function BusinessShareCard({ business, className = '', compact = false }: BusinessShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [includeBcv, setIncludeBcv] = useState(true);

  // Obtener URL canónica limpia de la ficha oficial
  const shareUrl = getCleanBusinessUrl(business.slug);
  const shareText = formatExecutiveShareText(business);
  const shareWhatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Ficha oficial de ${business.name} en CumanáConecta: ${shareUrl}`)}`;

  // Función Copiar Enlace Directo
  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('textarea');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Función Compartir Nativo (Mobile & Desktop compatible)
  const handleNativeShare = async () => {
    const res = await shareBusinessExecutive(business);
    if (res.method === 'clipboard' && res.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // URL del código QR en alta definición
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(shareUrl)}&margin=10`;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <>
      {/* ============================================================== */}
      {/* BANNER RECOMENDAR FLUIDO Y SIN DESBORDAMIENTOS */}
      {/* ============================================================== */}
      <div 
        className={`rounded-3xl bg-[#E8F8F5] dark:bg-[#042A2C]/90 border border-[#BCE8DE] dark:border-[#0E5153] p-4 sm:p-5 shadow-2xs ${
          compact 
            ? 'flex flex-col gap-3.5' 
            : 'flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4'
        } ${className}`}
      >
        {/* Lado Superior / Izquierdo: Icono + Textos */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#065A60] flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
            <Share2 className="w-5 h-5 text-white" />
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <h3 className="text-sm sm:text-base font-black text-[#043E44] dark:text-[#5EEAD4] leading-snug">
              ¿Quieres recomendar este negocio?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Envía este perfil con dirección, teléfonos y promociones por WhatsApp o redes sociales.
            </p>
          </div>
        </div>

        {/* Grupo de 4 Botones de Acción */}
        <div 
          className={
            compact
              ? 'grid grid-cols-2 sm:grid-cols-4 gap-2 w-full pt-1'
              : 'grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full xl:w-auto shrink-0 justify-start xl:justify-end'
          }
        >
          {/* Botón 1: Código QR / Imprimir */}
          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            className="w-full sm:w-auto px-3 sm:px-3.5 py-2.5 rounded-2xl bg-[#FFF9E6] hover:bg-[#FFF3CD] dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-[#855B00] dark:text-amber-300 border border-[#FFE28A] dark:border-amber-500/40 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-95 transition-all text-center"
            title="Generar e Imprimir Código QR para este comercio"
          >
            <QrCode className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="truncate">Código QR</span>
          </button>

          {/* Botón 2: Compartir */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full sm:w-auto px-3 sm:px-3.5 py-2.5 rounded-2xl bg-[#065A60] hover:bg-[#05484D] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-95 transition-all text-center"
            title="Compartir en redes o dispositivo"
          >
            <Share2 className="w-4 h-4 shrink-0" />
            <span>Compartir</span>
          </button>

          {/* Botón 3: WhatsApp */}
          <a
            href={shareWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-3 sm:px-3.5 py-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-95 transition-all text-center"
            title="Enviar recomendación por WhatsApp"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white shrink-0" />
            <span>WhatsApp</span>
          </a>

          {/* Botón 4: Copiar Enlace */}
          <button
            type="button"
            onClick={handleCopyLink}
            className={`w-full sm:w-auto px-3 sm:px-3.5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 dark:bg-[#131F33] dark:hover:bg-[#1E2D45] text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-[#1E2D45] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-95 transition-all text-center ${
              copied ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' : ''
            }`}
            title="Copiar URL directa al portapapeles"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-600 dark:text-slate-300 shrink-0" />
                <span className="truncate">Copiar Enlace</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL DE CÓDIGO QR / HABLADOR DE MOSTRADOR (POP) code5.html     */}
      {/* ============================================================== */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-md bg-surface-container rounded-3xl border border-outline-variant/30 shadow-2xl p-5 sm:p-6 space-y-5 text-center text-on-surface"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón Cerrar */}
            <button
              type="button"
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header del Generador */}
            <div className="space-y-1 text-left pt-1 pr-8">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-tertiary" />
                <span className="font-label-telemetry text-label-telemetry text-tertiary uppercase tracking-wider font-semibold">
                  MATERIAL DE PUNTO DE VENTA (POP)
                </span>
              </div>
              <h3 className="font-headline-sm text-base sm:text-lg text-on-surface font-semibold">
                Hablador QR Oficial de Mostrador
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Ficha física para vitrinas, cajas registradoras y mostradores de Cumaná.
              </p>
            </div>

            {/* Acrylic Stand Mockup Container */}
            <div id="print-area" className="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden shadow-2xl border border-outline-variant/20">
              <div className="w-full bg-surface-container-high rounded-xl p-4 sm:p-5 flex flex-col items-center text-center space-y-3.5 shadow-xl relative border border-outline-variant/30">
                {/* Stand Header Strip */}
                <div className="w-full flex items-center justify-between pb-1 bg-surface-container-highest/40 px-2 py-1 rounded-md text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded bg-primary-container flex items-center justify-center">
                      <QrCode className="w-2.5 h-2.5 text-on-primary-container" />
                    </div>
                    <span className="font-headline-sm text-[11px] text-on-surface font-semibold tracking-tight">CumanáConecta</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span className="font-label-telemetry text-[9px] text-on-surface-variant font-mono">
                      RIF: {business.rif || 'J-VIGENTE'}
                    </span>
                  </div>
                </div>

                {/* Brand Name on Stand */}
                <div>
                  <h3 className="font-headline-md text-lg sm:text-xl text-on-surface font-bold leading-tight">
                    {business.name}
                  </h3>
                  <span className="font-label-telemetry text-label-telemetry text-secondary uppercase font-semibold tracking-wider block mt-0.5">
                    {business.hasBranches && business.branches && business.branches.length > 1
                      ? `RED DE ${business.branches.length} SEDES ACTIVAS EN SUCRE`
                      : 'COMERCIO VERIFICADO EN CUMANÁ · SUCRE'}
                  </span>
                </div>

                {/* QR Code Container */}
                <div className="w-44 h-44 bg-white p-2.5 rounded-xl flex items-center justify-center relative shadow-inner border border-slate-100">
                  <img 
                    src={qrImageUrl} 
                    alt={`Código QR de ${business.name}`}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Tagline on Stand */}
                <p className="font-body-sm text-[11px] text-on-surface-variant max-w-xs leading-relaxed">
                  {business.hasBranches && business.branches && business.branches.length > 1
                    ? `Escanea para ver nuestras ${business.branches.length} Sedes, fotos de cómo llegar y WhatsApp directo. Tel: ${(business as any).phone || business.branches[0]?.phone || business.socials?.whatsapp || ''}`
                    : `Escanea para ver nuestro menú, cómo llegar y WhatsApp directo. Tel: ${(business as any).phone || business.socials?.whatsapp || ''}`}
                </p>

                {/* Micro badges on stand footer */}
                <div className="pt-1 flex flex-wrap items-center justify-center gap-1.5 text-[9px] text-on-surface-variant font-mono">
                  <span className="bg-surface-container-lowest px-1.5 py-0.5 rounded border border-outline-variant/20">TASA BCV EN VIVO</span>
                  <span className="bg-surface-container-lowest px-1.5 py-0.5 rounded border border-outline-variant/20">PAGO MÓVIL</span>
                  <span className="bg-surface-container-lowest px-1.5 py-0.5 rounded border border-outline-variant/20">ZELLE</span>
                  <span className="bg-surface-container-lowest px-1.5 py-0.5 rounded border border-outline-variant/20">ENVÍOS SUCRE</span>
                </div>
              </div>
            </div>

            {/* Action buttons & Toggle */}
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full py-2.5 px-3 rounded-xl bg-primary-container text-on-primary-container font-headline-sm text-xs uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Cartel (PDF)</span>
                </button>

                <a
                  href={qrImageUrl}
                  download={`Hablador-QR-${business.slug}.png`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-headline-sm text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar PNG HD</span>
                </a>
              </div>

              <div 
                onClick={() => setIncludeBcv(!includeBcv)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest text-xs text-on-surface-variant border border-outline-variant/20 cursor-pointer"
              >
                <span>Incluir cálculo de conversión BCV al escanear</span>
                <div className={`w-8 h-4 rounded-full relative flex items-center px-0.5 transition-colors ${includeBcv ? 'bg-secondary' : 'bg-surface-container-high'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white shadow transition-transform ${includeBcv ? 'translate-x-3.5' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
