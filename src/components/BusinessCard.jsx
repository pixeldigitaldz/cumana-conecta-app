import React from "react";
import {
  MapPin,
  Star,
  Sparkles,
  ChevronRight,
  Share2,
  Heart,
  Phone,
  Truck,
  ShieldCheck,
  Film,
  Tag,
} from "lucide-react";
import { motion } from "framer-motion";
import { buildWhatsAppUrl, PAYMENT_METHODS_CONFIG, isBusinessOpen } from "../data/mockBusinessData";
import { generateBusinessShareText } from "../utils/seoHelpers";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { WhatsAppIcon, CasheaIcon } from "./SocialIcons";

/**
 * BusinessCard — Reconstruido con fidelidad 100% al diseño online de cumanaconecta.com
 * Soporta vistas "grid" y "list", modo Claro/Oscuro y soporte nativo para cadenas Multi-Sede.
 */
export default function BusinessCard({
  business,
  onSelect,
  viewMode = "grid",
  isFavorite = false,
  onToggleFavorite,
}) {
  const { isDark } = useTheme();
  const { toast } = useToast();

  const {
    name,
    category,
    categoryLabel,
    isFeatured,
    isVerified,
    isOpen24h,
    zone,
    address,
    whatsapp,
    videoTourUrl,
    paymentMethods = [],
    activePromotion,
    bannerUrl,
    logoUrl,
    description,
    photos = [],
    tags = [],
    rating = 4.8,
    reviewCount = 50,
    isMultiBranch,
    branchCount,
    branches = [],
  } = business;

  const openNow = isBusinessOpen(business);
  const waUrl = buildWhatsAppUrl(whatsapp, name, activePromotion);

  // Etiqueta destacada en el banner de la foto
  const getBadgeLabel = () => {
    if (isMultiBranch) {
      return `CADENA • ${branchCount || branches.length || 3} SEDES EN CUMANÁ`;
    }
    if (isFeatured) return "RECOMENDADO";
    if (isOpen24h && category === "farmacias_24h") return "FARMACIA DE GUARDIA 24H";
    if (category === "emprendedores") {
      return tags.some((t) =>
        t.toLowerCase().includes("turismo") ||
        t.toLowerCase().includes("lancha") ||
        t.toLowerCase().includes("paseo")
      )
        ? "TURISMO & MOCHIMA"
        : "EMPRENDIMIENTO LOCAL";
    }
    if (category === "reposteria") return "REPOSTERÍA & CAFÉ";
    if (category === "salud") return "CLÍNICA & SALUD";
    if (category === "restaurantes") return "GASTRONOMÍA LOCAL";
    if (category === "talleres") return "TALLER MECÁNICO";
    if (isVerified) return "VERIFICADO";
    if (categoryLabel) return categoryLabel.toUpperCase();
    return "COMERCIO LOCAL";
  };

  // Badge de estado (Abierto 24h, Abierto Ahora o Cerrado)
  const renderStatusBadge = () => {
    if (isOpen24h) {
      return (
        <span
          className={`px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-bold shadow-xs flex items-center gap-1 ${
            isDark
              ? "bg-[#0f3c30]/90 text-[#34d399] border border-[#059669]/40"
              : "bg-[#ccfbf1] text-[#0f766e]"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Abierto 24h</span>
        </span>
      );
    }
    if (openNow) {
      return (
        <span
          className={`px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-bold shadow-xs flex items-center gap-1 ${
            isDark
              ? "bg-[#0f3c30]/90 text-[#34d399] border border-[#059669]/40"
              : "bg-[#dcfce7] text-[#15803d]"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Abierto Ahora</span>
        </span>
      );
    }
    return (
      <span
        className={`px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-semibold shadow-xs border ${
          isDark
            ? "bg-black/80 text-slate-300 border-slate-700/60"
            : "bg-white text-slate-700 border-slate-200/60"
        }`}
      >
        Cerrado
      </span>
    );
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/directorio?negocio=${encodeURIComponent(name)}`
        : `https://cumanaconecta.com/directorio?negocio=${encodeURIComponent(name)}`;
    const shareText = generateBusinessShareText(business);
    if (navigator.share) {
      navigator
        .share({
          title: `${name} — CumanáConecta (Cumaná, Sucre)`,
          text: shareText,
          url: shareUrl,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      toast.copy(`¡Ficha y enlace de ${name} copiados! Listo para compartir.`);
    }
  };

  /* ────────────────────────────────────────────────────────────────
     VISTA LISTA (viewMode === "list")
  ──────────────────────────────────────────────────────────────── */
  if (viewMode === "list") {
    return (
      <motion.article
        onClick={() => onSelect(business)}
        whileHover={{
          scale: 1.03,
          y: -3,
          transition: { type: "spring", stiffness: 350, damping: 25 },
        }}
        whileTap={{ scale: 0.985 }}
        className={`group relative flex flex-col md:flex-row overflow-hidden cursor-pointer business-card rounded-2xl transition-all duration-300 ${
          isDark
            ? isFeatured
              ? "bg-[#18191d] border border-amber-400/40 hover:border-amber-400/80 shadow-md"
              : "bg-[#18191d] border border-[#282a32] shadow-sm hover:border-[#f59e0b]/50 hover:shadow-lg"
            : isFeatured
              ? "bg-white border border-amber-400/55 hover:border-amber-500 shadow-sm"
              : "bg-white border border-slate-200/90 shadow-xs hover:border-[#008b8b]/60 hover:shadow-lg"
        }`}
        aria-label={`Ficha de ${name}`}
      >
        <div className="relative h-48 md:h-auto md:w-72 flex-shrink-0 overflow-hidden bg-slate-900">
          <img
            src={bannerUrl}
            alt={`Local de ${name} en ${zone}, Cumaná`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-2 z-10">
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wide shadow-xs ${
                isFeatured
                  ? isDark
                    ? "bg-[#181a20]/90 text-amber-300 border border-amber-400/40 backdrop-blur-md"
                    : "bg-white/95 text-amber-800 border border-amber-300/80 backdrop-blur-md"
                  : isDark
                    ? "bg-[#0f766e] text-white"
                    : "bg-[#005f73] text-white"
              }`}
            >
              <Sparkles
                size={11}
                className={isFeatured ? "text-amber-400 fill-amber-400 flex-shrink-0" : "fill-white flex-shrink-0"}
              />
              <span className="truncate max-w-[170px]">{getBadgeLabel()}</span>
            </div>
            {renderStatusBadge()}
          </div>

          <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between gap-2 z-10">
            {activePromotion ? (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#e11d48] text-white shadow-xs truncate max-w-[140px]">
                <Tag size={10} className="fill-white/20 flex-shrink-0" />
                <span className="truncate">{activePromotion}</span>
              </div>
            ) : (
              <div />
            )}
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/80 backdrop-blur-xs text-white shadow-xs ml-auto">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-slate-300 font-normal text-[9px]">({reviewCount})</span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-2.5">
            <div className="flex items-start gap-3">
              <div
                className={`w-12 h-12 rounded-xl overflow-hidden border shadow-xs flex-shrink-0 flex items-center justify-center ${
                  isDark ? "bg-[#22242c] border-[#323640]" : "bg-white border-slate-200/90"
                }`}
              >
                {logoUrl && (logoUrl.startsWith("http") || logoUrl.startsWith("/")) ? (
                  <img src={logoUrl} alt={`Logo de ${name}`} className="w-full h-full object-cover" />
                ) : photos && photos.length > 0 ? (
                  <img src={photos[0]} alt={`Foto de ${name}`} className="w-full h-full object-cover" />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center text-lg font-bold ${
                      isDark ? "bg-[#22242c] text-amber-400" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {logoUrl || name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <h3
                    className={`font-[Outfit] font-bold text-base leading-snug truncate transition-colors flex-1 min-w-0 ${
                      isDark ? "text-white group-hover:text-amber-400" : "text-slate-900 group-hover:text-[#005f73]"
                    }`}
                    title={name}
                  >
                    {name}
                  </h3>
                  {isFeatured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300/40 dark:border-amber-700/40 flex-shrink-0">
                      <span>Recomendado</span>
                    </span>
                  )}
                  {isVerified && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-extrabold shadow-2xs flex-shrink-0 ${
                        isDark
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      <ShieldCheck size={11} className="stroke-[2.5]" />
                      <span>Verificado</span>
                    </span>
                  )}
                  {videoTourUrl && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-amber-500 text-slate-950 shadow-xs flex-shrink-0">
                      <Film size={10} className="fill-slate-950" />
                      <span>Video Guía</span>
                    </span>
                  )}
                </div>
                <p className={`text-xs font-[Inter] line-clamp-1 mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {description}
                </p>
              </div>
            </div>

            <div
              className={`rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-xs ${
                isDark ? "bg-[#141518] text-slate-300" : "bg-[#f1f5f9]/80 text-slate-600"
              }`}
            >
              <MapPin size={13} className={isDark ? "text-amber-400 flex-shrink-0" : "text-[#008b8b] flex-shrink-0"} />
              {isMultiBranch ? (
                <span className="truncate font-semibold">
                  <strong className={isDark ? "text-amber-400" : "text-[#006e70]"}>3 Sedes en Cumaná:</strong> Blanco
                  Fombona • Cancamure • Santa Rosa
                </span>
              ) : (
                <>
                  <span className={`font-bold flex-shrink-0 ${isDark ? "text-amber-400" : "text-[#006e70]"}`}>{zone}</span>
                  <span className="text-slate-500">•</span>
                  <span className="truncate">{address}</span>
                </>
              )}
            </div>
          </div>

          <div
            className={`flex flex-wrap items-center justify-between gap-3 pt-2 border-t ${
              isDark ? "border-[#252830]" : "border-slate-100"
            }`}
          >
            <div className="flex flex-wrap items-center gap-1.5">
              {paymentMethods.slice(0, 4).map((pmKey) => {
                if (pmKey === "cashea") {
                  return (
                    <span
                      key={pmKey}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-black rounded-md bg-[#FFE600] text-slate-950 border border-amber-300 shadow-2xs"
                    >
                      <img src="/images/cashea-icon.png" alt="" className="w-3.5 h-3.5 object-contain" />
                      <span>Cashea</span>
                    </span>
                  );
                }
                const conf = PAYMENT_METHODS_CONFIG[pmKey];
                return conf ? (
                  <span
                    key={pmKey}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold border rounded ${
                      isDark ? "bg-[#1e2026] text-slate-400 border-[#2d3038]" : conf.bgClass
                    }`}
                  >
                    <span>{conf.shortLabel}</span>
                  </span>
                ) : null;
              })}
              {paymentMethods.length > 4 && (
                <span className="text-[10px] text-slate-500 font-medium pl-0.5">
                  +{paymentMethods.length - 4} más
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="h-9 px-3.5 rounded-xl text-white font-[Inter] font-bold text-xs flex items-center gap-1.5 shadow-xs transition hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: "#22c55e" }}
                aria-label={`Contactar a ${name} por WhatsApp`}
              >
                <WhatsAppIcon size={14} className="flex-shrink-0" />
                <span>WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(business);
                }}
                className={`h-9 px-3.5 rounded-xl font-[Inter] font-semibold text-xs flex items-center gap-1.5 transition active:scale-[0.98] ${
                  isMultiBranch
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md hover:from-amber-400 hover:to-orange-400"
                    : isDark
                      ? "bg-[#221f15] hover:bg-[#2d281a] border border-[#45371c] text-[#f59e0b]"
                      : "bg-[#f1f5f9] hover:bg-[#e2e8f0] text-slate-800"
                }`}
                aria-label={`Ver ficha de ${name}`}
              >
                <span>{isMultiBranch ? `Ver ${branchCount || 3} Sedes & Ofertas` : "Ver Ficha"}</span>
                <ChevronRight
                  size={14}
                  className={isMultiBranch ? "text-slate-950" : isDark ? "text-amber-400" : "text-slate-600"}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  /* ────────────────────────────────────────────────────────────────
     VISTA CUADRÍCULA (viewMode === "grid") — EXACTO A LA FOTO ONLINE
  ──────────────────────────────────────────────────────────────── */
  return (
    <motion.article
      onClick={() => onSelect(business)}
      whileHover={{
        scale: 1.05,
        y: -5,
        transition: { type: "spring", stiffness: 350, damping: 25 },
      }}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex flex-col overflow-hidden cursor-pointer business-card rounded-2xl transition-all duration-300 ${
        isDark
          ? isFeatured
            ? "bg-[#18191d] border border-amber-400/40 hover:border-amber-400/80 shadow-md"
            : "bg-[#18191d] border border-[#282a32] shadow-sm hover:border-[#f59e0b]/50 hover:shadow-lg"
          : isFeatured
            ? "bg-white border border-amber-400/55 hover:border-amber-500 shadow-sm"
            : "bg-white border border-slate-200/90 shadow-xs hover:border-[#008b8b]/60 hover:shadow-lg"
      }`}
      aria-label={`Ficha de ${name}`}
    >
      {/* ─── A. Header Visual con Imagen y Badges Superpuestos ─── */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <img
          src={bannerUrl}
          alt={`Local de ${name} en ${zone}, Cumaná`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none" />

        {/* Fila Superior: Badge Oficial + Compartir / Favorito */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-2 z-10">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-xs ${
              isFeatured
                ? isDark
                  ? "bg-[#181a20]/90 text-amber-300 border border-amber-400/40 backdrop-blur-md"
                  : "bg-white/95 text-amber-800 border border-amber-300/80 backdrop-blur-md"
                : isDark
                  ? "bg-[#0f766e] text-white"
                  : "bg-[#005f73] text-white"
            }`}
          >
            <Sparkles
              size={11}
              className={isFeatured ? "text-amber-400 fill-amber-400 flex-shrink-0" : "fill-white flex-shrink-0"}
            />
            <span className="truncate max-w-[180px] sm:max-w-[210px]">{getBadgeLabel()}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleShare}
              className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white/90 hover:text-white hover:bg-black/80 transition cursor-pointer active:scale-90"
              aria-label={`Compartir ${name}`}
            >
              <Share2 size={12} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite && onToggleFavorite(business.id);
              }}
              className={`w-7 h-7 rounded-full backdrop-blur-xs flex items-center justify-center transition active:scale-90 cursor-pointer ${
                isFavorite
                  ? "bg-rose-500 text-white shadow-xs"
                  : "bg-black/60 text-white/90 hover:text-rose-400 hover:bg-black/80"
              }`}
              aria-label={isFavorite ? `Quitar ${name} de favoritos` : `Guardar ${name} en favoritos`}
            >
              <Heart size={12} className={isFavorite ? "fill-current" : ""} />
            </button>
          </div>
        </div>

        {/* Fila Inferior: Horario + Video Guía / Delivery + Rating */}
        <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between gap-1.5 z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            {renderStatusBadge()}
            {videoTourUrl && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-amber-500 text-slate-950 shadow-xs">
                <Film size={10} className="fill-slate-950" />
                <span>Video Guía</span>
              </span>
            )}
            <span className="hidden xs:inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold bg-black/75 backdrop-blur-xs text-white">
              <Truck size={10} className="text-amber-400" />
              <span>Delivery</span>
            </span>
          </div>

          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] sm:text-[11px] font-bold bg-black/80 backdrop-blur-xs text-white shadow-xs ml-auto">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span>{rating.toFixed(1)}</span>
            <span className="text-slate-400 font-normal text-[10px]">({reviewCount})</span>
          </div>
        </div>
      </div>

      {/* ─── B. Contenido y Metadatos de la Tarjeta ─── */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-2.5">
          {/* Categoría & Zona / Sedes */}
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className={`font-bold uppercase tracking-wider ${isDark ? "text-amber-400" : "text-[#005f73]"}`}>
              {categoryLabel || "COMERCIO LOCAL"}
            </span>
            <span className={`flex items-center gap-1 truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              <MapPin size={11} className={isDark ? "text-amber-400 flex-shrink-0" : "text-[#008b8b] flex-shrink-0"} />
              <span className="truncate">{isMultiBranch ? `${branchCount || 3} Sedes en Cumaná` : zone}</span>
            </span>
          </div>

          {/* Título & Badges & Descripción */}
          <div>
            <div className="flex items-center gap-1.5 min-w-0">
              <h3
                className={`font-[Outfit] font-bold text-sm sm:text-base leading-snug truncate transition-colors flex-1 min-w-0 ${
                  isDark ? "text-white group-hover:text-amber-400" : "text-slate-900 group-hover:text-[#005f73]"
                }`}
                title={name}
              >
                {name}
              </h3>
              {isFeatured && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300/40 dark:border-amber-700/40 flex-shrink-0">
                  <span>Recomendado</span>
                </span>
              )}
              {isVerified && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-extrabold shadow-2xs flex-shrink-0 ${
                    isDark
                      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  <ShieldCheck size={11} className="stroke-[2.5]" />
                  <span>Verificado</span>
                </span>
              )}
            </div>
            <p className={`text-xs font-[Inter] line-clamp-1 mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              {description}
            </p>
          </div>

          {/* Bloque VIP de Atención Prioritaria Verificada */}
          {isFeatured && (
            <div
              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-medium flex items-center justify-between border ${
                isDark
                  ? "bg-gradient-to-r from-amber-950/40 to-[#1e1c18] border-amber-500/20 text-amber-300"
                  : "bg-gradient-to-r from-amber-50/90 to-yellow-50/40 border-amber-200 text-amber-950"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles size={11} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                <span className="font-semibold">Atención Prioritaria Verificada</span>
              </span>
              <span className="text-[9px] uppercase font-black tracking-wider bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded shadow-2xs">
                VIP
              </span>
            </div>
          )}

          {/* Bloque de Promoción / Oferta Activa */}
          {activePromotion && (
            <div
              className={`p-2 rounded-xl flex items-center gap-2 border text-xs ${
                isDark ? "bg-[#221d14] border-[#45371c] text-amber-200" : "bg-amber-50/90 border-amber-200 text-amber-950"
              }`}
            >
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase flex-shrink-0 shadow-2xs ${
                  activePromotion.toLowerCase().includes("cashea")
                    ? "bg-[#FFE600] text-slate-950 border border-amber-400"
                    : "bg-[#f59e0b] text-slate-950"
                }`}
              >
                {activePromotion.toLowerCase().includes("cashea") ? "CASHEA CUOTAS" : "ESPECIAL"}
              </span>
              <span className="truncate text-[11px] font-medium">{activePromotion}</span>
            </div>
          )}

          {/* Fila de Métodos de Pago */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {paymentMethods.slice(0, 4).map((pmKey) => {
              if (pmKey === "cashea") {
                return (
                  <span
                    key={pmKey}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black rounded bg-[#FFE600] text-slate-950 border border-amber-300 shadow-2xs"
                  >
                    <CasheaIcon className="w-3.5 h-3.5 object-contain" />
                    <span>Cashea</span>
                  </span>
                );
              }
              const conf = PAYMENT_METHODS_CONFIG[pmKey];
              return conf ? (
                <span
                  key={pmKey}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold border rounded ${
                    isDark ? "bg-[#1e2026] text-slate-400 border-[#2d3038]" : conf.bgClass
                  }`}
                >
                  <span>{conf.shortLabel}</span>
                </span>
              ) : null;
            })}
            {paymentMethods.length > 4 && (
              <span className="text-[10px] text-slate-500 font-medium pl-0.5">
                +{paymentMethods.length - 4} más
              </span>
            )}
          </div>
        </div>

        {/* ─── C. Footer: Rating + Botón WhatsApp Redondo + Botón Ver Ficha / Sedes ─── */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-700/20">
          <div className="flex items-center gap-1 text-xs">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{rating.toFixed(1)}</span>
            <span className="text-slate-500 text-[11px]">({reviewCount})</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Botón WhatsApp redondo verde con borde */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-emerald-500/60 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition cursor-pointer"
              aria-label={`Llamar o WhatsApp a ${name}`}
              title="WhatsApp / Llamar"
            >
              <Phone size={13} />
            </a>

            {/* Botón Ver Ficha / Ver Sedes */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(business);
              }}
              className={`h-8 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                isMultiBranch
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md hover:from-amber-400 hover:to-orange-400"
                  : isDark
                    ? "bg-[#221f15] hover:bg-[#2d281a] border border-[#45371c] text-[#f59e0b]"
                    : "bg-[#f1f5f9] hover:bg-[#e2e8f0] text-slate-800"
              }`}
              aria-label={`Ver ficha de ${name}`}
            >
              <span>{isMultiBranch ? `Ver ${branchCount || 3} Sedes & Ofertas` : "Ver Ficha"}</span>
              <ChevronRight size={13} className={isMultiBranch ? "text-slate-950" : ""} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
