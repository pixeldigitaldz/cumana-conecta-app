import React, { useState, useMemo } from 'react';
import { Calculator, CheckCircle2, Sparkles, ArrowRight, Flame } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * Niveles oficiales de Cashea Venezuela (Club Cashea Más)
 * Cada nivel define el porcentaje de inicial base y el beneficio promocional o cuotas extendidas.
 */
export const CASHEA_LEVELS = [
  { level: 1, name: 'Semilla', initialPercent: 60, promoPercent: 50, maxInstallments: 3, label: 'Nivel 1' },
  { level: 2, name: 'Raíz', initialPercent: 50, promoPercent: 40, maxInstallments: 3, label: 'Nivel 2' },
  { level: 3, name: 'Hoja', initialPercent: 40, promoPercent: 30, maxInstallments: 6, label: 'Nivel 3' },
  { level: 4, name: 'Tronco', initialPercent: 40, promoPercent: 25, maxInstallments: 6, label: 'Nivel 4' },
  { level: 5, name: 'Árbol', initialPercent: 30, promoPercent: 20, maxInstallments: 9, label: 'Nivel 5' },
  { level: 6, name: 'Araguaney', initialPercent: 20, promoPercent: 15, maxInstallments: 12, label: 'Nivel 6' },
];

/**
 * CasheaCalculatorWidget
 * Módulo oficial interactivo y calculadora de cuotas de Cashea.
 * Se adapta a las promociones de Cashea configuradas desde el Panel Admin.
 */
export default function CasheaCalculatorWidget({
  businessName = 'este comercio',
  products = [],
  settings = {},
  initialAmount = 45,
  compact = false,
  onOpenFull = null,
}) {
  const { isDark } = useTheme();

  // Estados de cálculo
  const [amount, setAmount] = useState(initialAmount);
  const [selectedLevel, setSelectedLevel] = useState(2); // Nivel 2 como default popular (50% inicial)
  const [installmentMode, setInstallmentMode] = useState(3); // 3 cuotas estándar por defecto

  // Configuración de promociones proveniente de Admin Settings
  const isPromoActive = Boolean(settings?.casheaPromoActive);
  const promoTitle = settings?.casheaPromoTitle || 'Promo Especial Cashea';
  const promoBadge = settings?.casheaPromoBadge || 'Inicial Reducida';
  const allowExtended = settings?.casheaAllowExtendedCuotas !== false;

  // Nivel actual
  const currentLevelObj = useMemo(() => {
    return CASHEA_LEVELS.find((l) => l.level === selectedLevel) || CASHEA_LEVELS[1];
  }, [selectedLevel]);

  // Porcentaje de inicial según si hay promoción activa
  const activeInitialPercent = useMemo(() => {
    if (isPromoActive) {
      return currentLevelObj.promoPercent;
    }
    return currentLevelObj.initialPercent;
  }, [isPromoActive, currentLevelObj]);

  // Cálculo financiero exacto de Cashea (0% Interés)
  const calculation = useMemo(() => {
    const validAmount = Math.max(1, Number(amount) || 0);
    const initialPayment = (validAmount * activeInitialPercent) / 100;
    const remainingAmount = validAmount - initialPayment;

    // Número de cuotas activas
    const numInstallments = installmentMode > 1 ? installmentMode : 3;
    const installmentPayment = remainingAmount / numInstallments;

    // Generar lista de cuotas con días estimados
    const installments = [];
    for (let i = 1; i <= numInstallments; i++) {
      installments.push({
        number: i,
        amount: installmentPayment.toFixed(2),
        days: i * 14,
      });
    }

    return {
      total: validAmount.toFixed(2),
      initialPayment: initialPayment.toFixed(2),
      installmentPayment: installmentPayment.toFixed(2),
      numInstallments,
      installments,
    };
  }, [amount, activeInitialPercent, installmentMode]);

  // Opciones rápidas de montos
  const quickPrices = useMemo(() => {
    if (products && products.length > 0) {
      const sample = products.slice(0, 3).map((p) => ({
        label: p.name || 'Producto',
        price: p.price || 30,
      }));
      return sample;
    }
    return [
      { label: 'Zapatos', price: 45 },
      { label: 'Ropa / Accesorios', price: 25 },
      { label: 'Tecnología', price: 80 },
    ];
  }, [products]);

  // Render para modo compacto (en Tarjeta de Locales)
  if (compact) {
    return (
      <div
        onClick={onOpenFull}
        className="w-full mt-2.5 p-2.5 rounded-xl border border-amber-300/80 bg-linear-to-r from-[#fffbeb] to-[#fef9c3] dark:from-[#2a2408] dark:to-[#221c04] dark:border-amber-500/40 flex items-center justify-between gap-2 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-2 min-w-0">
          <img
            src="/images/cashea-icon.png"
            alt="Cashea"
            className="w-6 h-6 rounded-lg object-contain shrink-0 group-hover:scale-105 transition-transform shadow-2xs"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-['Outfit'] text-xs font-black text-slate-950 dark:text-amber-200 tracking-tight">
                Paga con Cashea
              </span>
              {isPromoActive ? (
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-rose-500 text-white animate-pulse">
                  {promoBadge}
                </span>
              ) : (
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full bg-slate-900 text-amber-300 dark:bg-amber-400 dark:text-slate-950">
                  Niveles 1 al 6
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">
              Inicial desde {isPromoActive ? '15%' : '20%'} + 3 cuotas cada 14 días sin interés
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-900 dark:text-amber-300 shrink-0 group-hover:translate-x-0.5 transition-transform">
          <span className="hidden xs:inline">Calculadora</span>
          <ArrowRight size={13} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-amber-300 dark:border-amber-500/30 bg-white dark:bg-[#15171c] shadow-md transition-colors font-['Inter']">
      
      {/* ─── 1. Header Oficial Cashea ─── */}
      <div className="bg-[#FFE600] px-4 sm:px-6 py-4 text-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
        {/* Glow sutil */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/20 pointer-events-none blur-xl" />

        <div className="flex items-start sm:items-center gap-3 min-w-0">
          {/* Logo Oficial Cashea PNG sin fondo */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <img
                src="/images/cashea-logo.png"
                alt="Cashea"
                className="h-6 sm:h-7 object-contain shrink-0"
              />
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-white shadow-2xs">
                COMERCIO AFILIADO
              </span>
              {isPromoActive && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-600 text-white flex items-center gap-1 shadow-2xs animate-bounce">
                  <Flame size={11} className="text-amber-300" />
                  {promoTitle}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-slate-900 mt-0.5 leading-snug">
              Compra ahora y paga después • Sin Intereses ni comisiones ocultas
            </p>
          </div>
        </div>

        {/* Pill Informativa de Cuotas */}
        <div className="shrink-0 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-slate-900 text-xs font-extrabold shadow-xs border border-amber-200">
            <Sparkles size={13} className="text-amber-500" />
            <span>Inicial + 3 Cuotas cada 14 días</span>
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        
        {/* ─── 2. Los 3 Pasos de Cashea ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Paso 1 */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#1a1c23] flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#FFE600] text-slate-950 flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
              1
            </div>
            <div>
              <h4 className="font-['Outfit'] font-bold text-sm text-slate-900 dark:text-white leading-tight">
                Pagas la Inicial
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Pagas entre el {isPromoActive ? '15%' : '20%'} y {isPromoActive ? '50%' : '60%'} en caja en <strong className="text-slate-900 dark:text-slate-200">{businessName}</strong> (Pago Móvil, tarjeta o divisas).
              </p>
            </div>
          </div>

          {/* Paso 2 */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#1a1c23] flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#FFE600] text-slate-950 flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
              2
            </div>
            <div>
              <h4 className="font-['Outfit'] font-bold text-sm text-slate-900 dark:text-white leading-tight">
                Te llevas tu compra
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Te entregamos tu producto o servicio inmediatamente en el local sin trámites complicados.
              </p>
            </div>
          </div>

          {/* Paso 3 */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#1a1c23] flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#FFE600] text-slate-950 flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
              3
            </div>
            <div>
              <h4 className="font-['Outfit'] font-bold text-sm text-slate-900 dark:text-white leading-tight">
                Cuotas sin interés
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Pagas cada 14 días directo en tu app de Cashea a la tasa oficial BCV.
              </p>
            </div>
          </div>
        </div>

        {/* ─── 3. Contenedor de la Calculadora ─── */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-[#16181f] space-y-4">
          
          {/* Título de la Calculadora */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧮</span>
              <h3 className="font-['Outfit'] font-bold text-base text-slate-900 dark:text-white">
                Calculadora de Cuotas con Cashea
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Monto referencial en USD (Tasa oficial BCV)
            </span>
          </div>

          {/* Grid de Inputs: Monto + Nivel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Columna Izquierda: Monto de Compra (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Monto de la compra (Ref. $ USD):
              </label>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-black text-lg">
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="45"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1f222b] text-slate-950 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#FFE600] focus:border-amber-400 transition"
                />
              </div>

              {/* Botones de montos sugeridos / productos */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mr-1">
                  Productos:
                </span>
                {quickPrices.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAmount(item.price)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-[#20232c] hover:bg-[#FFE600] hover:text-slate-950 dark:hover:bg-[#FFE600] dark:hover:text-slate-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition cursor-pointer active:scale-95 shadow-2xs"
                  >
                    {item.label} (${item.price}.00)
                  </button>
                ))}
              </div>
            </div>

            {/* Columna Derecha: Selector de Niveles 1 al 6 (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tu Nivel en Cashea:
                </label>
                <div className="flex items-center gap-1.5">
                  {isPromoActive && (
                    <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-rose-500 text-white">
                      {promoBadge}
                    </span>
                  )}
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-['Outfit']">
                    Inicial {activeInitialPercent}%
                  </span>
                </div>
              </div>

              {/* Grid con los 6 niveles oficiales de Cashea */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {CASHEA_LEVELS.map((lvl) => {
                  const isSelected = selectedLevel === lvl.level;
                  const percent = isPromoActive ? lvl.promoPercent : lvl.initialPercent;
                  return (
                    <button
                      key={lvl.level}
                      type="button"
                      onClick={() => {
                        setSelectedLevel(lvl.level);
                        // Si el nivel no soporta cuotas extendidas, reset a 3
                        if (lvl.maxInstallments < installmentMode) {
                          setInstallmentMode(3);
                        }
                      }}
                      className={`p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-[#FFE600] border-amber-400 text-slate-950 font-black shadow-sm scale-105 ring-2 ring-amber-400/40'
                          : 'bg-white dark:bg-[#1e2026] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-300 dark:hover:border-amber-500/50'
                      }`}
                    >
                      <span className="text-xs font-bold leading-tight">{lvl.label}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                        {percent}% inicial
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Opciones de Modo Más Cuotas para Niveles 3 al 6 */}
              {allowExtended && currentLevelObj.maxInstallments > 3 && Number(amount) >= 50 && (
                <div className="pt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    Modo Cuotas:
                  </span>
                  <button
                    type="button"
                    onClick={() => setInstallmentMode(3)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                      installmentMode === 3
                        ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 border-transparent shadow-xs'
                        : 'bg-white dark:bg-[#1e2026] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    3 Cuotas (Estándar)
                  </button>

                  {currentLevelObj.maxInstallments >= 6 && (
                    <button
                      type="button"
                      onClick={() => setInstallmentMode(6)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                        installmentMode === 6
                          ? 'bg-[#FFE600] text-slate-950 border-amber-400 shadow-xs'
                          : 'bg-white dark:bg-[#1e2026] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Modo 6 Cuotas
                    </button>
                  )}

                  {currentLevelObj.maxInstallments >= 9 && (
                    <button
                      type="button"
                      onClick={() => setInstallmentMode(9)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                        installmentMode === 9
                          ? 'bg-[#FFE600] text-slate-950 border-amber-400 shadow-xs'
                          : 'bg-white dark:bg-[#1e2026] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Modo 9 Cuotas
                    </button>
                  )}

                  {currentLevelObj.maxInstallments >= 12 && (
                    <button
                      type="button"
                      onClick={() => setInstallmentMode(12)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                        installmentMode === 12
                          ? 'bg-[#FFE600] text-slate-950 border-amber-400 shadow-xs'
                          : 'bg-white dark:bg-[#1e2026] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Modo 12 Cuotas
                    </button>
                  )}
                </div>
              )}

            </div>

          </div>

          {/* ─── 4. Desglose del Plan de Pagos Estimado ─── */}
          <div className="pt-2 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              PLAN DE PAGOS ESTIMADO CON CASHEA:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Tarjeta 1: PAGAS HOY */}
              <div className="p-3.5 rounded-xl border-2 border-[#FFE600] bg-[#fffdf0] dark:bg-amber-950/20 text-center flex flex-col justify-center shadow-xs">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-950 dark:text-amber-300">
                  PAGAS HOY
                </span>
                <span className="font-['Outfit'] font-black text-xl sm:text-2xl text-slate-950 dark:text-white my-0.5">
                  ${calculation.initialPayment}
                </span>
                <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-400">
                  En caja ({activeInitialPercent}%)
                </span>
              </div>

              {/* Cuotas restantes */}
              {calculation.installments.map((cuota) => (
                <div
                  key={cuota.number}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1c24] text-center flex flex-col justify-center shadow-2xs"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    CUOTA {cuota.number}
                  </span>
                  <span className="font-['Outfit'] font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white my-0.5">
                    ${cuota.amount}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    En {cuota.days} días
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── 5. Footer con Condiciones Oficiales ─── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-xs border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <CheckCircle2 size={15} />
              <span>0% Interés • Pagas exactamente el precio de contado</span>
            </div>
            <span className="text-[11px] italic text-slate-500 dark:text-slate-400">
              Sujeto a línea de compra disponible en la app de Cashea
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
