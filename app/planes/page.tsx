'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Check, 
  Sparkles, 
  ChevronDown, 
  MessageCircle, 
  Eye, 
  Navigation, 
  DollarSign, 
  Star, 
  Video, 
  Plane, 
  Car, 
  Play, 
  CreditCard, 
  Calendar, 
  Lock, 
  X, 
  ShieldCheck, 
  MapPin, 
  TrendingUp, 
  MessageSquare,
  Compass,
  ExternalLink,
  Wallet,
  Headset,
  Phone
} from 'lucide-react';

import { useAppData } from '@/lib/app-data-context';
import { VerifiedBadge } from '@/components/verified-badge';
import { VerificationRequestModal } from '@/components/verification-request-modal';

export default function PlansPage() {
  const { plans, plansPageConfig, structure } = useAppData();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'semestral'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Control del reproductor oficial de Video-Ruta
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeMilestone, setActiveMilestone] = useState(0);

  const videoMilestones = [
    { time: 0, label: '0:00 Punto de Partida', title: 'Redoma de El Peñón' },
    { time: 13, label: '0:13 Tramo Costero', title: 'Av. Carúpano' },
    { time: 26, label: '0:26 Cruce Balneario', title: 'Faro Marino' },
    { time: 39, label: '0:39 Llegada', title: 'La Terraza del Golfo' }
  ];

  const handleSeekMilestone = (seconds: number, idx: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play().catch(() => {});
    }
    setActiveMilestone(idx);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const whatsappNumber = structure.platformSettings?.contactWhatsapp || 'https://wa.me/584147778899';
  const cleanWhatsappLink = (text: string) => {
    const base = whatsappNumber.startsWith('http') ? whatsappNumber : `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`;
    return `${base}?text=${encodeURIComponent(text)}`;
  };

  // Filtrar testimonios y FAQs activas
  const activeTestimonials = plansPageConfig.testimonials.filter(t => t.isActive !== false);
  const activeFaqs = plansPageConfig.faqs.filter(f => f.isActive !== false);

  const getFaqIcon = (icon: string) => {
    switch (icon) {
      case 'payment':
        return <CreditCard className="w-5 h-5 text-[#00C292]" />;
      case 'video':
        return <Video className="w-5 h-5 text-[#FF6B4A]" />;
      case 'refresh':
        return <Calendar className="w-5 h-5 text-[#00C292]" />;
      case 'lock':
        return <Lock className="w-5 h-5 text-[#FF6B4A]" />;
      default:
        return <CreditCard className="w-5 h-5 text-[#00C292]" />;
    }
  };

  const getMetricIcon = (icon: string) => {
    switch (icon) {
      case 'eye':
        return <Eye className="w-4 h-4 text-[#FF6B4A]" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-[#00C292]" />;
      case 'navigation':
        return <Navigation className="w-4 h-4 text-[#FFA384]" />;
      case 'dollar':
        return <DollarSign className="w-4 h-4 text-amber-400" />;
      default:
        return <TrendingUp className="w-4 h-4 text-[#00C292]" />;
    }
  };

  return (
    <div className="w-full pb-24 transition-colors duration-200">
      {/* ============================================================== */}
      {/* 1. HERO SECTION & ENCABEZADO */}
      {/* ============================================================== */}
      <section className="px-4 sm:px-6 lg:px-8 pt-14 pb-10 text-center relative overflow-hidden">
        {/* Resplandor de fondo decorativo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[340px] bg-gradient-to-r from-[#FF6B4A]/15 via-[#00C292]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          {/* Pill superior */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] text-[11px] font-black uppercase tracking-wider text-[#008966] dark:text-[#00C292] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#00C292] animate-pulse"></span>
            <span>{plansPageConfig.badgeText}</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
            {plansPageConfig.headlinePart1}{' '}
            <span className="text-[#FF6B4A]">{plansPageConfig.headlineHighlight}</span>
          </h1>

          {/* Subtítulo descriptivo */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-[#A0AEC0] max-w-3xl mx-auto font-medium leading-relaxed">
            {plansPageConfig.subtitle}
          </p>
        </div>

        {/* ============================================================== */}
        {/* 2. TARJETAS DE MÉTRICAS / IMPACTO */}
        {/* ============================================================== */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 text-left relative z-10">
          {plansPageConfig.metrics.map((m) => (
            <div
              key={m.id}
              className="bg-white dark:bg-[#131F33] rounded-2xl border border-slate-200 dark:border-[#1E2D45] p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#080E18] flex items-center justify-center border border-slate-200 dark:border-[#1E2D45]">
                  {getMetricIcon(m.icon)}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  m.tagColor === 'green'
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                    : m.tagColor === 'orange'
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                    : 'bg-[#FF6B4A]/15 text-[#FF6B4A] border border-[#FF6B4A]/30'
                }`}>
                  {m.tag}
                </span>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                  {m.value}
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0] mt-0.5">
                  {m.label}
                </div>
              </div>

              {m.subtext ? (
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold pt-1 border-t border-slate-100 dark:border-[#1E2D45]/60">
                  {m.subtext}
                </div>
              ) : (
                /* Mini chispa / sparkline visual para la primera tarjeta */
                <div className="pt-1">
                  <svg className="w-full h-4 text-[#FF6B4A]" viewBox="0 0 100 20" fill="none">
                    <path d="M0 15 Q 25 18, 45 8 T 75 12 T 100 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. SECCIÓN DE PLANES DE AFILIACIÓN */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        {/* Cabecera de la sección de planes */}
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-[#FF6B4A]">
            PLANES DE AFILIACIÓN
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white">
            Escoge el impulso que necesita tu marca
          </h2>

          {/* Selector de facturación Mensual vs Semestral */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex items-center bg-slate-100 dark:bg-[#131F33] p-1.5 rounded-2xl border border-slate-200 dark:border-[#1E2D45] gap-1 shadow-xs">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-slate-950 text-white dark:bg-[#080E18] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-[#A0AEC0] hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                Facturación Mensual
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle('semestral')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                  billingCycle === 'semestral'
                    ? 'bg-slate-950 text-white dark:bg-[#080E18] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-[#A0AEC0] hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <span>Plan Semestral</span>
                <span className="px-2 py-0.5 rounded-full bg-[#00C292]/20 text-[#008966] dark:text-[#00C292] text-[10px] font-black border border-[#00C292]/30">
                  {plansPageConfig.billingDiscountText}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Las 3 Tarjetas de Planes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
          {plans.map((plan) => {
            const isFree = plan.tier === 'free';
            const isPro = plan.tier === 'pro';
            const isVip = plan.tier === 'vip';

            // Cálculo de precio según periodo
            let displayedPrice = plan.priceMonthly;
            let billingNote = '/ mes (facturado mensual)';
            if (isFree) {
              billingNote = '/ Gratis para siempre';
            } else if (billingCycle === 'semestral') {
              displayedPrice = Math.round(plan.priceMonthly * 0.8);
              billingNote = '/ mes (facturado semestral)';
            }

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative shadow-sm ${
                  isPro
                    ? 'bg-white dark:bg-[#131F33] border-2 border-[#FF6B4A] shadow-xl lg:-translate-y-2'
                    : 'bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Banner superior especial para el plan más popular */}
                {isPro && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#FF8C66] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                    {plan.badge || 'MÁS POPULAR ENTRE COMERCIOS'}
                  </div>
                )}

                <div>
                  {/* Encabezado de la tarjeta */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                      {plan.name}
                    </h3>

                    {isPro ? (
                      <div className="w-8 h-8 rounded-xl bg-[#FF6B4A]/15 border border-[#FF6B4A]/30 flex items-center justify-center text-[#FF6B4A]">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    ) : plan.badge ? (
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-black border ${
                        isVip 
                          ? 'bg-[#00C292]/15 text-[#008966] dark:text-[#00C292] border-[#00C292]/30'
                          : 'bg-slate-100 dark:bg-[#080E18] text-slate-700 dark:text-[#A0AEC0] border-slate-200 dark:border-[#1E2D45]'
                      }`}>
                        {plan.badge}
                      </span>
                    ) : null}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-[#A0AEC0] font-medium leading-relaxed min-h-[36px] mb-6">
                    {plan.tagline}
                  </p>

                  {/* Bloque de Precio */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] mb-8">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className={`text-4xl sm:text-5xl font-black ${
                        isVip 
                          ? 'text-[#00C292]' 
                          : isPro 
                          ? 'text-[#FF6B4A]' 
                          : 'text-slate-950 dark:text-white'
                      }`}>
                        ${displayedPrice}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-[#A0AEC0]">
                        {billingNote}
                      </span>
                    </div>
                  </div>

                  {/* Lista de Beneficios */}
                  <div className="space-y-3.5 mb-8">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      {plan.featuresHeader || (isFree ? 'BENEFICIOS INCLUIDOS:' : 'TODO LO DEL PLAN ANTERIOR, MÁS:')}
                    </div>

                    {plan.features.map((feat, idx) => {
                      const isVerifiedMention = feat.toLowerCase().includes('verificado');
                      return (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-[#DDE2F1] font-semibold leading-snug">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isVip ? 'text-[#00C292]' : isPro ? 'text-[#FF6B4A]' : 'text-slate-500'
                          }`} />
                          <div>
                            <span>{feat} </span>
                            {isVerifiedMention && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0095F6]/15 text-[#0095F6] text-[10px] font-black border border-[#0095F6]/30 align-middle ml-1">
                                <VerifiedBadge size="sm" />
                                <span>Verificado Cumaná Conecta</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Botón de Acción */}
                <div className="pt-4 border-t border-slate-100 dark:border-[#1E2D45]">
                  {isFree ? (
                    <button
                      type="button"
                      onClick={() => setIsRegisterModalOpen(true)}
                      className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-black dark:bg-[#080E18] dark:hover:bg-[#1E2D45] text-white text-xs font-black transition-all cursor-pointer shadow-sm text-center border border-slate-800 dark:border-[#1E2D45]"
                    >
                      {plan.buttonText || 'Registrar Local Gratis'}
                    </button>
                  ) : isPro ? (
                    <a
                      href={cleanWhatsappLink(`¡Hola Cumaná Conecta! Deseo activar el Plan Destacado Pro ($${displayedPrice}) para mi comercio.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#FF8C66] hover:opacity-95 text-white text-xs font-black transition-all cursor-pointer shadow-md text-center block"
                    >
                      {plan.buttonText || 'Activar Destacado Pro'}
                    </a>
                  ) : (
                    <a
                      href={cleanWhatsappLink(`¡Hola Cumaná Conecta! Deseo contratar el Plan Destacado ($${displayedPrice}) con producción de Video-Ruta para mi negocio.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 rounded-2xl bg-[#00C292] hover:bg-[#00C292]/90 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-md text-center block"
                    >
                      {plan.buttonText || 'Contactar Asesor'}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. SPOTLIGHT: ¿POR QUÉ LA VIDEO-RUTA EN 60s DUPLICA TUS VISITAS? */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-white dark:bg-[#131F33] rounded-3xl border border-slate-200 dark:border-[#1E2D45] p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Columna Izquierda: Explicación y Referencias de Cumaná */}
            <div className="space-y-6">
              <span className="px-3 py-1 rounded-full bg-[#FF6B4A]/15 text-[#FF6B4A] text-[10px] font-black uppercase tracking-wider border border-[#FF6B4A]/30">
                {plansPageConfig.spotlight.tag}
              </span>

              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white leading-tight">
                {plansPageConfig.spotlight.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A0AEC0] leading-relaxed font-medium">
                {plansPageConfig.spotlight.description}
              </p>

              {/* Las 2 pastillas de características */}
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#00C292]/15 text-[#008966] dark:text-[#00C292] border border-[#00C292]/30 flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-950 dark:text-white">
                      {plansPageConfig.spotlight.droneTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-[#A0AEC0]">
                      {plansPageConfig.spotlight.droneDesc}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6B4A]/15 text-[#FF6B4A] border border-[#FF6B4A]/30 flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-950 dark:text-white">
                      {plansPageConfig.spotlight.carTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-[#A0AEC0]">
                      {plansPageConfig.spotlight.carDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Tarjeta de Muestra Interactiva de la Video-Ruta */}
            <div 
              onClick={() => setIsVideoModalOpen(true)}
              className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-[#1E2D45] shadow-xl group cursor-pointer"
            >
              <div className="relative h-72 sm:h-96 w-full">
                <img
                  src={plansPageConfig.spotlight.demoImage}
                  alt={plansPageConfig.spotlight.demoRoute}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Badge de Ruta Verificada */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-black text-[#00C292] border border-[#00C292]/40 flex items-center gap-1.5 shadow-sm">
                    <VerifiedBadge size="sm" />
                    <span>{plansPageConfig.spotlight.demoBadge}</span>
                  </span>
                </div>

                {/* Botón Central Grande de Reproducción con Animación */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#FF8C66] transition-all duration-300 ring-4 ring-white/20">
                    <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current translate-x-0.5" />
                  </div>
                </div>

                {/* Contenido en la parte inferior */}
                <div className="absolute bottom-4 left-4 right-4 space-y-2">
                  <h3 className="text-lg sm:text-xl font-black text-white drop-shadow-sm">
                    {plansPageConfig.spotlight.demoRoute}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">
                    {plansPageConfig.spotlight.demoDuration}
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsVideoModalOpen(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#FF6B4A] hover:bg-[#FF6B4A]/90 text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-md transition-all self-start sm:self-auto"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Ver Demo</span>
                    </button>
                    <span className="text-[11px] text-slate-300 font-medium">
                      {plansPageConfig.spotlight.demoCredit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. PREGUNTAS CLARAS SOBRE LA MEMBRESÍA (ESTILO STITCH)        */}
      {/* ============================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-left mb-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-400 block mb-1.5">
            DUDAS FRECUENTES
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold text-slate-950 dark:text-white tracking-tight">
            Preguntas Claras sobre la Membresía
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeFaqs.map((faq) => {
            const getIcon = () => {
              switch (faq.icon) {
                case 'payment':
                  return <Wallet className="w-5 h-5 text-[#FFA384] shrink-0" />;
                case 'video':
                  return <Video className="w-5 h-5 text-[#FFA384] shrink-0" />;
                case 'refresh':
                  return <Calendar className="w-5 h-5 text-[#FFA384] shrink-0" />;
                case 'lock':
                  return <ShieldCheck className="w-5 h-5 text-[#FFA384] shrink-0" />;
                default:
                  return <Wallet className="w-5 h-5 text-[#FFA384] shrink-0" />;
              }
            };

            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] p-6 sm:p-7 shadow-sm space-y-3"
              >
                <div className="flex items-center gap-3">
                  {getIcon()}
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-snug">
                    {faq.question}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm font-normal text-slate-600 dark:text-slate-400 leading-relaxed pl-8">
                  {faq.answer}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. MESA DE ASISTENCIA LOCAL - CUMANÁ (ESTILO STITCH)          */}
      {/* ============================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E293B] p-6 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-lg">
          {/* Lado izquierdo */}
          <div className="flex items-start sm:items-center gap-5 max-w-2xl">
            <div className="w-14 h-14 rounded-2xl bg-[#00C292] text-slate-950 flex items-center justify-center shrink-0 shadow-md">
              <Headset className="w-7 h-7 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#00C292] mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00C292] animate-pulse" />
                <span>MESA DE ASISTENCIA LOCAL - CUMANÁ</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-950 dark:text-white leading-snug">
                ¿Tienes dudas sobre la cobertura de tu zona?
              </h3>
              <p className="text-xs sm:text-sm font-normal text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Habla directamente con nuestro equipo en Cumaná. Revisamos la ubicación de tu negocio y te recomendamos la mejor estrategia sin compromiso.
              </p>
            </div>
          </div>

          {/* Lado derecho: 2 Botones en fila */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
            <a
              href={cleanWhatsappLink('¡Hola! Tengo dudas sobre la cobertura de mi zona en Cumaná Conecta y quiero orientación.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-6 py-3.5 rounded-xl bg-[#00C292] hover:bg-[#00C292]/90 text-slate-950 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>HABLAR POR WHATSAPP AHORA</span>
            </a>

            <a
              href={cleanWhatsappLink('¡Hola! Me gustaría agendar una llamada con el equipo de Cumaná Conecta para evaluar mi negocio.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1E293B] dark:hover:bg-[#283548] text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>AGENDAR LLAMADA</span>
            </a>
          </div>
        </div>
      </section>

      {/* Modal para ver Video Demo Oficial Completo */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col my-auto">
            {/* Cabecera del Reproductor */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#008966]/20 text-[#00C292] border border-[#00C292]/30">
                  <VerifiedBadge size="sm" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#00C292]">
                      MUESTRA OFICIAL VERIFICADA
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">52 SEG</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {plansPageConfig.spotlight.demoRoute}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Cerrar video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenedor del Video en Formato Vertical 9:16 */}
            <div className="relative w-full aspect-[9/16] max-h-[62vh] sm:max-h-[66vh] bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                src={plansPageConfig.spotlight.demoVideoUrl}
                controls
                autoPlay
                playsInline
                loop
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    const t = videoRef.current.currentTime;
                    if (t < 13) setActiveMilestone(0);
                    else if (t < 26) setActiveMilestone(1);
                    else if (t < 39) setActiveMilestone(2);
                    else setActiveMilestone(3);
                  }
                }}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Navegador Interactivo de Hitos (Clic para saltar en el video) */}
            <div className="p-4 bg-slate-900/80 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#FF6B4A]" />
                  <span>Hitos de la ruta (Clic para saltar):</span>
                </span>
                <span className="text-[10px] font-mono text-[#00C292] font-bold">
                  Hito {activeMilestone + 1} de 4
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {videoMilestones.map((ms, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSeekMilestone(ms.time, idx)}
                    className={`p-2 rounded-xl text-left transition-all border cursor-pointer ${
                      activeMilestone === idx
                        ? 'bg-[#FF6B4A]/15 border-[#FF6B4A] text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] font-black text-[#FF6B4A]">{ms.label}</div>
                    <div className="text-xs font-bold truncate text-slate-200">{ms.title}</div>
                  </button>
                ))}
              </div>

              {/* Botones de Acción Rápida */}
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={cleanWhatsappLink('¡Hola! Vi el demo de Video-Ruta en la web y quiero cotizar la producción para mi comercio.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#00C292] hover:bg-[#00C292]/90 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>Pedir Video-Ruta para mi Negocio</span>
                </a>

                <a
                  href="https://maps.google.com/?q=El+Penon+Cumana+Venezuela"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-slate-700"
                  title="Abrir punto en Google Maps"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Solicitud de Registro de Negocio */}
      <VerificationRequestModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
}
