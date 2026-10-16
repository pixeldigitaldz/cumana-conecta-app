'use client';

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  Share2, 
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { Business } from '@/types/business';
import { is24HoursSchedule } from '@/lib/business-hours';
import { formatExecutiveShareText, shareBusinessExecutive, getCleanBusinessUrl } from '@/lib/share-utils';
import { BusinessMiniMap } from '@/components/business-mini-map';
import { OfficialChannelsCard } from '@/components/official-channels-card';
import { ScheduleAndChannelsCard } from '@/components/schedule-channels-card';

interface BusinessDetailModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BusinessDetailModal({
  business,
  isOpen,
  onClose
}: BusinessDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [casheaAmount, setCasheaAmount] = useState<number>(50);
  const [casheaLevel, setCasheaLevel] = useState<number>(3); // Nivel 3 por defecto (40% inicial)
  const [showQrModal, setShowQrModal] = useState(false);

  if (!isOpen || !business) return null;

  // Monograma de 2 letras (CERO emojis)
  const monogram = business.monogram || 
    business.name
      .split(' ')
      .filter(w => w.length > 2 && !['del', 'los', 'las', 'por', 'con', 'para'].includes(w.toLowerCase()))
      .map(w => w[0])
      .filter(c => /[A-Za-z]/.test(c))
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'CC';

  const is24h = is24HoursSchedule(business.openingHours);
  const acceptsCashea = Boolean(
    business.acceptsCashea || 
    business.paymentMethods?.includes('cashea') ||
    business.name.toLowerCase().includes('econoquesos') ||
    business.name.toLowerCase().includes('farmacia')
  );

  // Niveles de Cashea:
  // Nivel 1: 60% inicial / Nivel 2: 50% / Nivel 3: 40% / Nivel 4: 30% / Nivel 5: 25% / Nivel 6: 20%
  const levelDownpaymentPercents: Record<number, number> = {
    1: 0.60,
    2: 0.50,
    3: 0.40,
    4: 0.30,
    5: 0.25,
    6: 0.20
  };

  const initialPercent = levelDownpaymentPercents[casheaLevel] || 0.40;
  const initialPayment = casheaAmount * initialPercent;
  const remaining = Math.max(0, casheaAmount - initialPayment);
  const installment = remaining / 3;

  const handleCopyFicha = async () => {
    const url = getCleanBusinessUrl(business.slug);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    const result = await shareBusinessExecutive(business);
    if (result.method === 'clipboard' && result.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const phoneDisplay = business.phone || '+58 293-4327788';
  const coordsDisplay = business.coordinates || '10.4536° N, 64.1775° W';

  return (
    <div 
      style={{ zIndex: 999999 }}
      className="fixed inset-0 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-[#11141a] rounded-2xl border border-slate-200 dark:border-[#252934] shadow-2xl overflow-hidden my-auto transition-all text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Cabecera Fotográfica (h-56 sm:h-64) */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-900">
          <img
            src={business.heroImage}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

          {/* Arriba a la izquierda: Badges oficiales */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
            {business.isVerified && (
              <span className="px-3 py-1 rounded-md bg-blue-950/70 backdrop-blur-md text-blue-300 border border-blue-600/40 text-[10px] font-mono-tabular font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" strokeWidth={2} />
                <span>Comercio Verificado</span>
              </span>
            )}

            {business.tier === 'vip' && (
              <span className="px-3 py-1 rounded-md bg-[#004655] text-white dark:bg-[#fbbf24] dark:text-slate-950 text-[10px] font-mono-tabular font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-white dark:text-slate-950" strokeWidth={2.5} />
                <span>COMERCIO DESTACADO</span>
              </span>
            )}
          </div>

          {/* Arriba a la derecha: Botones Standee QR, Compartir, X */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              type="button"
              onClick={() => setShowQrModal(!showQrModal)}
              className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white hover:text-amber-400 hover:border-amber-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Generar cartel con QR oficial"
            >
              <QrCode className="w-4 h-4" strokeWidth={2} />
              <span className="hidden sm:inline">Standee QR</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className={`px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                copied 
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-950/70' 
                  : 'border-white/20 text-white hover:text-amber-400 hover:border-amber-400'
              }`}
              title={copied ? "¡Enlace copiado!" : "Compartir ficha"}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" strokeWidth={2} />
                  <span className="hidden sm:inline">Compartir</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-red-600 transition-all flex items-center justify-center cursor-pointer shadow-sm"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Modal Standee QR Flotante (si está activo) */}
        {showQrModal && (
          <div className="p-4 bg-slate-950 border-b border-[#252934] text-center space-y-2 animate-in fade-in duration-150">
            <h4 className="text-xs font-mono-tabular font-bold uppercase tracking-wider text-amber-400">
              Cartel QR de Mostrador Imprimible
            </h4>
            <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border border-amber-400 flex items-center justify-center">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + '/local/' + business.slug : 'https://cumanaconecta.com')}`}
                alt="QR Code"
                className="w-full h-full"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Escanea para abrir la ficha verificada de {business.name} en CumanáConecta.
            </p>
          </div>
        )}

        {/* Contenido Interior del Modal */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[calc(88vh-14rem)] overflow-y-auto">
          
          {/* 2. Tarjeta Principal de Identidad */}
          <div className="rounded-xl bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] p-5 flex items-start justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <span className="text-[10px] font-mono-tabular uppercase font-bold text-[#004655] dark:text-[#fbbf24] tracking-wider block">
                {(business.categories && business.categories.length > 0 ? business.categories : [business.category]).join(' • ').toUpperCase()} • {business.zone}
              </span>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                {business.name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {business.description || business.tagline}
              </p>
            </div>

            {/* Monograma de 2 letras en teal/ámbar (CERO emojis) */}
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#11141a] border border-slate-200 dark:border-[#252934] text-[#004655] dark:text-[#fbbf24] flex items-center justify-center font-mono-tabular font-extrabold text-lg shrink-0 shadow-sm">
              {monogram}
            </div>
          </div>

          {/* 3. Fila de 4 Tarjetas Técnicas de Resumen */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* HORARIO ACTIVO */}
            <div className="rounded-xl bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] p-3.5 space-y-1">
              <span className="text-[10px] font-mono-tabular uppercase font-bold text-slate-400 block tracking-wider">
                HORARIO ACTIVO
              </span>
              <p className="text-xs font-bold text-emerald-500 dark:text-emerald-400">
                {is24h ? '24 Horas Continuas' : 'Abierto Ahora'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono-tabular">
                {is24h ? '24 Horas (Lunes a Domingo)' : business.openingHours}
              </p>
            </div>

            {/* SECTOR URBANO */}
            <div className="rounded-xl bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] p-3.5 space-y-1">
              <span className="text-[10px] font-mono-tabular uppercase font-bold text-slate-400 block tracking-wider">
                SECTOR URBANO
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {business.zone}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {business.address}
              </p>
            </div>

            {/* FINANCIAMIENTO */}
            <div className="rounded-xl bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] p-3.5 space-y-1">
              <span className="text-[10px] font-mono-tabular uppercase font-bold text-slate-400 block tracking-wider">
                FINANCIAMIENTO
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {acceptsCashea ? 'Acepta Cashea' : 'Pago de Contado'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono-tabular">
                Tasa Oficial BCV
              </p>
            </div>

            {/* ATENCIÓN DIRECTA */}
            <div className="rounded-xl bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] p-3.5 space-y-1">
              <span className="text-[10px] font-mono-tabular uppercase font-bold text-slate-400 block tracking-wider">
                ATENCIÓN DIRECTA
              </span>
              <p className="text-xs font-bold text-emerald-500 dark:text-emerald-400 font-mono-tabular truncate">
                {phoneDisplay}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Canal Verificado
              </p>
            </div>
          </div>

          {/* 4. Calculadora Interactiva de Cashea (Si acepta) */}
          {acceptsCashea && (
            <div className="rounded-xl bg-slate-50 dark:bg-[#161920] border border-amber-500/30 p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#FFE600] text-slate-950 text-xs font-mono-tabular font-black">
                    c=
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      Calculadora de Financiamiento Cashea
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Calcula tu cuota inicial y 3 pagos quincenales sin interés a tasa BCV.
                    </p>
                  </div>
                </div>

                {/* Input de monto */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Monto $:</span>
                  <div className="relative">
                    <DollarSign className="w-3.5 h-3.5 text-amber-500 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="number"
                      min={10}
                      max={1000}
                      step={5}
                      value={casheaAmount}
                      onChange={(e) => setCasheaAmount(Math.max(1, Number(e.target.value) || 0))}
                      className="w-24 pl-6 pr-2 py-1 bg-white dark:bg-[#0b0d11] border border-slate-200 dark:border-[#252934] rounded-lg text-xs font-mono-tabular font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Selector de Niveles (1 al 6) */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono-tabular font-bold text-slate-400 uppercase tracking-wider block">
                  Tu Nivel Cashea (Porcentaje Inicial Requerido):
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((lvl) => {
                    const isSelected = casheaLevel === lvl;
                    const percent = levelDownpaymentPercents[lvl] * 100;
                    return (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => setCasheaLevel(lvl)}
                        className={`py-1.5 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FFE600] border-[#FFE600] text-slate-950 font-bold shadow-sm'
                            : 'bg-white dark:bg-[#0b0d11] border-slate-200 dark:border-[#252934] text-slate-600 dark:text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <div className="text-[10px] font-mono-tabular font-black">NIVEL {lvl}</div>
                        <div className="text-[9px] font-mono-tabular font-medium">{percent}%</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4 Cajas de Resultado */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-white dark:bg-[#0b0d11] border-2 border-[#FFE600] space-y-0.5">
                  <span className="text-[9px] font-mono-tabular font-extrabold text-[#FFE600] uppercase tracking-wider block">
                    PAGAS HOY EN CAJA
                  </span>
                  <div className="text-base font-mono-tabular font-extrabold text-slate-900 dark:text-white">
                    ${initialPayment.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono-tabular">
                    Inicial {initialPercent * 100}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#0b0d11] border border-slate-200 dark:border-[#252934] space-y-0.5">
                  <span className="text-[9px] font-mono-tabular font-bold text-slate-400 uppercase tracking-wider block">
                    CUOTA 1 (14 DÍAS)
                  </span>
                  <div className="text-base font-mono-tabular font-bold text-slate-800 dark:text-slate-200">
                    ${installment.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-500 block font-mono-tabular">Sin interés</span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#0b0d11] border border-slate-200 dark:border-[#252934] space-y-0.5">
                  <span className="text-[9px] font-mono-tabular font-bold text-slate-400 uppercase tracking-wider block">
                    CUOTA 2 (28 DÍAS)
                  </span>
                  <div className="text-base font-mono-tabular font-bold text-slate-800 dark:text-slate-200">
                    ${installment.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-500 block font-mono-tabular">Sin interés</span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#0b0d11] border border-slate-200 dark:border-[#252934] space-y-0.5">
                  <span className="text-[9px] font-mono-tabular font-bold text-slate-400 uppercase tracking-wider block">
                    CUOTA 3 (42 DÍAS)
                  </span>
                  <div className="text-base font-mono-tabular font-bold text-slate-800 dark:text-slate-200">
                    ${installment.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-500 block font-mono-tabular">Sin interés</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. Bloque Doble: Horarios y Canales Oficiales con Mini-Mapa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            {/* Izquierda: HORARIOS Y CANALES OFICIALES (Exacto al adjunto del usuario) */}
            <ScheduleAndChannelsCard 
              openingHours={business.openingHours}
              socials={business.socials} 
              businessName={business.name} 
              phone={business.phone}
              className="h-full" 
            />

            {/* Derecha: GEOLOCALIZACIÓN EN CUMANÁ CON MINI-MAPA */}
            <div className="rounded-2xl bg-slate-50 dark:bg-[#131924] border border-slate-200 dark:border-[#1E2536] p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#FF6B4A] dark:text-[#fbbf24]" strokeWidth={2} />
                    <span className="text-xs font-mono-tabular font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      GEOLOCALIZACIÓN EN CUMANÁ
                    </span>
                  </div>
                  {business.hasGps !== false ? (
                    <span className="text-[10px] font-mono-tabular font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      GPS ACTIVO
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono-tabular font-bold text-slate-500 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-300 dark:border-slate-700">
                      GPS INACTIVO
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {business.address}
                </p>

                {/* Versión Pequeña del Mapa (Mini-Map) de la Ruta */}
                {business.hasGps !== false ? (
                  <BusinessMiniMap
                    business={business}
                    heightClass="h-44 sm:h-52"
                    showDirectionsButton={true}
                  />
                ) : (
                  <div className="h-44 sm:h-52 rounded-xl border border-dashed border-slate-200 dark:border-[#1E2536] bg-slate-100/60 dark:bg-[#0b0e14] flex flex-col items-center justify-center p-5 text-center space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-500">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Ubicación por Dirección Física
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                      Este comercio atiende de forma directa en su dirección física o mediante pedidos y despacho por WhatsApp.
                    </p>
                  </div>
                )}

                {/* Caja con coordenadas oficiales si GPS está activo */}
                {business.hasGps !== false && (
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#0b0d11] border border-slate-200 dark:border-[#252934] flex items-center justify-between text-xs">
                    <span className="font-mono-tabular text-[11px] text-slate-700 dark:text-slate-300">
                      {coordsDisplay}
                    </span>
                    <span className="text-[10px] font-mono-tabular font-bold text-slate-500">
                      CUMANÁ • EDO. SUCRE
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 6. Barra Inferior de Acción del Modal */}
        <div className="p-4 sm:p-5 pb-6 sm:pb-5 border-t border-slate-200 dark:border-[#252934] bg-slate-50 dark:bg-[#0e1017] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <a
            href={business.socials?.whatsapp || `https://wa.me/584120000000?text=Hola%20${encodeURIComponent(business.name)},%20los%20encontré%20en%20CumanáConecta`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <MessageCircle className="w-4 h-4" strokeWidth={2} />
            <span>Contactar por WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={handleCopyFicha}
            className="px-5 h-11 rounded-xl border border-slate-200 dark:border-[#252934] hover:bg-white dark:hover:bg-[#161920] text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" strokeWidth={2} />
                <span>Ficha Copiada</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#004655] dark:text-[#fbbf24]" strokeWidth={2} />
                <span>Copiar Ficha</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
