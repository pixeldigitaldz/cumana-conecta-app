'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ShieldCheck, CheckCircle2, Search } from 'lucide-react';
import { Business } from '@/types/business';
import { useAppData } from '@/lib/app-data-context';
import { HeroSearch } from '@/components/hero-search';
import { SearchAndFilters } from '@/components/search-and-filters';
import { FeaturedSpotlightCarousel } from '@/components/featured-spotlight-carousel';
import { BusinessCard } from '@/components/business-card';
import { CasheaBanner } from '@/components/cashea-banner';
import { BusinessDetailModal } from '@/components/business-detail-modal';
import { VerificationRequestModal } from '@/components/verification-request-modal';
import { CumanaLiveStories } from '@/components/cumana-live-stories';
import { CumanaVerticalsSection } from '@/components/cumana-verticals-section';
import { AdBannerStrip } from '@/components/ad-banner-strip';

export default function DiscoveryHubPage() {
  const router = useRouter();
  const { businesses, structure, liveSectionConfig, verticalsSectionConfig, adBanners } = useAppData();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('Todas');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [filterOnlyOpen, setFilterOnlyOpen] = useState(false);
  const [filterCashea, setFilterCashea] = useState(false);
  const [filterPromotions, setFilterPromotions] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [onlyVip, setOnlyVip] = useState(false);
  const [sortBy, setSortBy] = useState<'priority' | 'rating' | 'reviews' | 'name'>('priority');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Modals state
  const [modalBusiness, setModalBusiness] = useState<Business | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // Load and sync favorites & URL parameters and deep-linking to business ficha
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cumana_favorites');
      if (saved) setFavorites(JSON.parse(saved));
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('cashea') === 'true') {
          setFilterCashea(true);
        }

        // Deep-linking: Si la URL contiene ficha, local, o si se reescribió /local/[slug] a /index.html
        let targetSlug = params.get('ficha') || params.get('local') || params.get('negocio');
        if (!targetSlug && window.location.pathname.startsWith('/local/')) {
          const parts = window.location.pathname.replace(/^\/local\//, '').split('/');
          if (parts[0]) {
            targetSlug = decodeURIComponent(parts[0]);
          }
        }

        if (targetSlug && businesses.length > 0) {
          const cleanSlug = targetSlug.toLowerCase().trim();
          const targetBiz = businesses.find(
            b => b.slug.toLowerCase() === cleanSlug || b.id.toLowerCase() === cleanSlug
          );
          if (targetBiz) {
            handleOpenListing(targetBiz);
          }
        }
      }
    } catch (e) {}
  }, [businesses]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('cumana_favorites', JSON.stringify(next));
      } catch (err) {}
      return next;
    });
  };

  const handleOpenListing = (biz: Business) => {
    const isDestacado = biz.tier === 'vip' || Boolean(biz.isFeatured);
    const isMultiBranch = Boolean(biz.hasBranches && ((biz.branches && biz.branches.length > 1) || biz.hasBranches));
    if (isDestacado || isMultiBranch) {
      if (typeof window !== 'undefined' && window.location.pathname === `/local/${biz.slug}`) {
        setModalBusiness(biz);
        setIsModalOpen(true);
      } else {
        router.push(`/local/${biz.slug}`);
      }
    } else {
      setModalBusiness(biz);
      setIsModalOpen(true);
    }
  };

  const zones = useMemo(() => {
    return ['Todas', ...structure.zones];
  }, [structure.zones]);

  // Main business filtering logic
  const filteredBusinesses = useMemo(() => {
    const list = businesses.filter(b => {
      if (b.status === 'suspended') return false;

      // Search term match
      const term = searchTerm.toLowerCase().trim();
      const matchSearch = !term ||
        b.name.toLowerCase().includes(term) ||
        b.tagline.toLowerCase().includes(term) ||
        b.description.toLowerCase().includes(term) ||
        b.category.toLowerCase().includes(term) ||
        Boolean(b.categories?.some(c => c.toLowerCase().includes(term))) ||
        b.zone.toLowerCase().includes(term);

      // Zone match
      const matchZone = selectedZone === 'Todas' || b.zone === selectedZone;

      // Category match
      let matchCategory = true;
      if (selectedCategory !== 'Todos' && selectedCategory !== 'Todas') {
        const catLower = b.category.toLowerCase();
        const selLower = selectedCategory.toLowerCase();
        const mainMatch = catLower.includes(selLower) || selLower.includes(catLower);
        const multiMatch = Boolean(b.categories?.some(c => {
          const cl = c.toLowerCase();
          return cl.includes(selLower) || selLower.includes(cl);
        }));
        matchCategory = mainMatch || multiMatch;
      }

      // Payment method match
      const matchPay = paymentFilter === 'all' || b.paymentMethods.includes(paymentFilter as any);

      // Quick filter: Only Open
      const matchOpen = !filterOnlyOpen || b.isOpenNow;

      // Quick filter: Cashea
      const matchCashea = !filterCashea || b.acceptsCashea || b.paymentMethods.includes('cashea');

      // Quick filter: Promotions
      const matchPromotions = !filterPromotions || Boolean(b.promotion?.isActive);

      // Filter favorites
      const matchFav = !onlyFavorites || favorites.includes(b.id);

      // Filter VIP
      const matchVip = !onlyVip || b.tier === 'vip' || b.tier === 'pro';

      return matchSearch && matchZone && matchCategory && matchPay && matchOpen && matchCashea && matchPromotions && matchFav && matchVip;
    });

    return list.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'reviews') {
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }

      // Default: priority
      const tierPriority: Record<string, number> = {
        vip: 3,
        pro: 2,
        free: 1
      };
      const weightA = tierPriority[a.tier] || 0;
      const weightB = tierPriority[b.tier] || 0;
      if (weightB !== weightA) {
        return weightB - weightA;
      }
      if (a.isVerified !== b.isVerified) {
        return a.isVerified ? -1 : 1;
      }
      return b.rating - a.rating;
    });
  }, [
    businesses,
    searchTerm,
    selectedZone,
    selectedCategory,
    paymentFilter,
    filterOnlyOpen,
    filterCashea,
    filterPromotions,
    onlyFavorites,
    onlyVip,
    sortBy,
    favorites
  ]);

  // Separation into two distinct blocks
  const vipBusinesses = useMemo(() => {
    return filteredBusinesses.filter(b => b.tier === 'vip' || b.tier === 'pro');
  }, [filteredBusinesses]);

  const regularBusinesses = useMemo(() => {
    return filteredBusinesses.filter(b => b.tier !== 'vip' && b.tier !== 'pro');
  }, [filteredBusinesses]);

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] dark:bg-[#0b0d11] text-slate-900 dark:text-slate-100 pb-20 selection:bg-[#004655] dark:selection:bg-amber-400 selection:text-white dark:selection:text-slate-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 1. HERO PRINCIPAL & CONSOLA DE BÚSQUEDA (Imagen 1) */}
        <HeroSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedZone={selectedZone}
          onZoneChange={setSelectedZone}
          zones={zones}
          filterOnlyOpen={filterOnlyOpen}
          onToggleOnlyOpen={() => setFilterOnlyOpen(prev => !prev)}
          filterCashea={filterCashea}
          onToggleCashea={() => setFilterCashea(prev => !prev)}
          filterPromotions={filterPromotions}
          onTogglePromotions={() => setFilterPromotions(prev => !prev)}
          totalResults={filteredBusinesses.length}
          totalBusinesses={businesses.length}
        />

        {/* Historias en Vivo (si están activas) */}
        {liveSectionConfig && liveSectionConfig.isEnabled && (
          <CumanaLiveStories config={liveSectionConfig} />
        )}

        {/* Explora por Verticales (si está activa desde administración) */}
        {verticalsSectionConfig && verticalsSectionConfig.isEnabled && (
          <CumanaVerticalsSection
            config={verticalsSectionConfig}
            onSelectCategory={(categoryName) => setSelectedCategory(categoryName)}
          />
        )}

        {/* 2. SECCIÓN "EXPLORAR POR RUBRO" (Imagen 1) */}
        <SearchAndFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          businesses={businesses}
          paymentFilter={paymentFilter}
          onPaymentFilterChange={setPaymentFilter}
          onlyFavorites={onlyFavorites}
          onToggleOnlyFavorites={() => setOnlyFavorites(prev => !prev)}
          favoritesCount={favorites.length}
          onlyVip={onlyVip}
          onToggleOnlyVip={() => setOnlyVip(prev => !prev)}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* 3. CARRUSEL "VITRINA PATROCINADA" (Imagen 2) */}
        <FeaturedSpotlightCarousel
          businesses={businesses}
          onOpenListing={handleOpenListing}
        />

        {/* 4. BLOQUE 1: SOCIOS VERIFICADOS & VIP (Imágenes 2 y 6) */}
        {vipBusinesses.length > 0 && (
          <section className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1e222b]">
              <div>
                <span className="text-[11px] font-mono-tabular uppercase tracking-[0.14em] text-[#004655] dark:text-amber-400 font-bold block mb-1">
                  COMERCIOS DESTACADOS
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Establecimientos Destacados en Cumaná
                </h2>
              </div>
              <span className="font-mono-tabular text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] text-[#004655] dark:text-amber-400">
                {vipBusinesses.length} {vipBusinesses.length === 1 ? 'ACTIVO' : 'ACTIVOS'}
              </span>
            </div>

            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                : "flex flex-col gap-4"
            }>
              {vipBusinesses.map(biz => (
                <BusinessCard
                  key={biz.id}
                  business={biz}
                  onOpenListing={handleOpenListing}
                  isFavorite={favorites.includes(biz.id)}
                  onToggleFavorite={toggleFavorite}
                  onOpenCasheaModal={(b) => {
                    setModalBusiness(b);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Separador de Publicidad y Patrocinio Premium (Mid-Page Ad Slot) */}
        <AdBannerStrip adBanner={adBanners?.[0]} />

        {/* 5. BLOQUE 2: ÍNDICE GENERAL (Imágenes 2 y 6) */}
        {regularBusinesses.length > 0 && (
          <section className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1e222b]">
              <div>
                <span className="text-[11px] font-mono-tabular uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  ÍNDICE GENERAL
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Directorio Comercial y de Servicios
                </h2>
              </div>
              <span className="font-mono-tabular text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] text-slate-700 dark:text-slate-300">
                {regularBusinesses.length} {regularBusinesses.length === 1 ? 'REGISTRO' : 'REGISTROS'}
              </span>
            </div>

            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                : "flex flex-col gap-4"
            }>
              {regularBusinesses.map(biz => (
                <BusinessCard
                  key={biz.id}
                  business={biz}
                  onOpenListing={handleOpenListing}
                  isFavorite={favorites.includes(biz.id)}
                  onToggleFavorite={toggleFavorite}
                  onOpenCasheaModal={(b) => {
                    setModalBusiness(b);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Mensaje de no resultados */}
        {filteredBusinesses.length === 0 && (
          <div className="py-16 text-center bg-white dark:bg-[#11141a] rounded-2xl border border-slate-200 dark:border-[#222630] p-8 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#004655]/10 dark:bg-amber-400/10 border border-[#004655]/20 dark:border-amber-400/20 text-[#004655] dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No se encontraron comercios</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Intenta ajustar el término de búsqueda, cambiar la zona o restablecer los filtros.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedZone('Todas');
                setSelectedCategory('Todos');
                setPaymentFilter('all');
                setFilterOnlyOpen(false);
                setFilterCashea(false);
                setFilterPromotions(false);
                setOnlyFavorites(false);
                setOnlyVip(false);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#004655] hover:bg-[#003844] text-white dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-slate-950 font-bold text-xs transition-all shadow-sm cursor-pointer"
            >
              Restablecer todos los filtros
            </button>
          </div>
        )}

        {/* 6. BANNER CASHEA AMARILLO OFICIAL (Imágenes 2 y 6) */}
        <CasheaBanner onFilterCashea={() => setFilterCashea(true)} />
      </div>

      {/* 7. MODAL DETALLE DE NEGOCIO (Imágenes 5 y 6) */}
      <BusinessDetailModal
        business={modalBusiness}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            if (url.searchParams.has('ficha') || url.searchParams.has('local') || url.pathname.startsWith('/local/')) {
              window.history.replaceState({}, '', '/');
            }
          }
        }}
      />

      {/* Modal de Solicitud de Registro y Verificación */}
      <VerificationRequestModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
      />
    </div>
  );
}
