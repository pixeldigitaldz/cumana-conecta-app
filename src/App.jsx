import { useState, useMemo, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import SearchAndFilters from './components/SearchAndFilters';
import BusinessCard from './components/BusinessCard';
import BusinessCardSkeleton from './components/BusinessCardSkeleton';
import BusinessDetailModal from './components/BusinessDetailModal';
import FeaturedSpotlightCarousel from './components/FeaturedSpotlightCarousel';
import DirectoryPage from './pages/DirectoryPage';
import EmergencyFooter from './components/EmergencyFooter';
import PricingSection from './components/PricingSection';
import CasheaBanner from './components/CasheaBanner';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import PromoTicker from './components/PromoTicker';
import CumanaBot from './components/CumanaBot';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import MultiBranchBrandPage from './pages/MultiBranchBrandPage.jsx';
import {
  businesses as rawBusinesses,
  isBusinessOpen,
} from './data/mockBusinessData';
import { adminStore } from './store/adminStore.js';
import { isAuthenticated } from './store/authStore.js';
import { generateDirectoryItemListSchema } from './utils/seoHelpers';
import { useTheme } from './context/ThemeContext';
import { useToast } from './context/ToastContext';
import {
  SearchX,
  Crown,
} from 'lucide-react';

// Merge admin overrides with mock data
function getBusinesses() {
  try {
    const stored = adminStore.getBusinesses();
    if (Array.isArray(stored) && stored.length > 0) {
      return stored.filter((b) => !b.status || b.status === 'active' || b.status === 'aprobado');
    }
  } catch {}
  return rawBusinesses;
}

function getPageFromUrl() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const hash = (window.location.hash || '').toLowerCase();

  if (
    path === '/panel-admin' ||
    path === '/admin' ||
    hash === '#panel-admin' ||
    hash === '#admin'
  ) {
    return 'admin';
  }
  if (path === '/directorio' || hash === '#directorio') {
    return 'directorio';
  }
  if (
    path.startsWith('/marca') ||
    path.startsWith('/cadena') ||
    hash.startsWith('#marca') ||
    hash.startsWith('#cadena')
  ) {
    return 'marca';
  }
  return 'home';
}

/**
 * CumanáConecta — Directorio Comercial y de Servicios de Cumaná, Sucre
 * Aplicación principal con soporte para modo claro y modo oscuro exacto.
 */
export default function App() {
  const { isDark } = useTheme();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(() => getPageFromUrl());
  const [adminAuthenticated, setAdminAuthenticated] = useState(() => isAuthenticated());

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeZone, setActiveZone] = useState('Todas las zonas');
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [filterCashea, setFilterCashea] = useState(false);
  const [filterDiscount, setFilterDiscount] = useState(false);
  const [filterPayment, setFilterPayment] = useState('all');
  const [filterOnlyVIP, setFilterOnlyVIP] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('cumana_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');

  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(() => {
    try {
      const path = window.location.pathname.toLowerCase();
      if (path.startsWith('/marca') || path.startsWith('/cadena')) {
        const slug = path.replace(/^\/(marca|cadena)\//, '').replace(/\/+$/, '');
        const allBiz = getBusinesses();
        return (
          allBiz.find((b) => b.slug === slug || b.id === slug) ||
          allBiz.find((b) => b.isMultiBranch) ||
          null
        );
      }
    } catch {}
    return null;
  });
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sincronización con navegación limpia (HTML5 History API) sin ningún carácter '#'
  useEffect(() => {
    // Si la URL contiene '#', convertirlo de inmediato a ruta limpia
    const cleanHashFromUrl = () => {
      if (window.location.hash || window.location.href.includes('#')) {
        const page = getPageFromUrl();
        const targetPath =
          page === 'admin'
            ? '/panel-admin'
            : page === 'directorio'
            ? '/directorio'
            : page === 'marca'
            ? `/marca/${selectedBrand?.slug || 'econoquesos-cumana'}`
            : '/';
        const cleanUrl = `${targetPath}${window.location.search}`;
        window.history.replaceState(null, '', cleanUrl);
        return page;
      }
      return getPageFromUrl();
    };

    cleanHashFromUrl();

    const handleLocationChange = () => {
      const page = cleanHashFromUrl();
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [selectedBrand]);

  const handleNavigate = (page, data = null) => {
    setCurrentPage(page);
    let targetPath = '/';
    if (page === 'directorio') {
      targetPath = '/directorio';
    } else if (page === 'admin') {
      targetPath = '/panel-admin';
    } else if (page === 'marca') {
      const brand = data || selectedBrand || getBusinesses().find((b) => b.isMultiBranch);
      targetPath = `/marca/${brand?.slug || 'econoquesos-cumana'}`;
    }
    const cleanUrl = `${targetPath}${window.location.search}`;
    window.history.pushState(null, '', cleanUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBusiness = useCallback((biz) => {
    if (biz?.isMultiBranch) {
      setSelectedBrand(biz);
      handleNavigate('marca', biz);
      return;
    }
    setSelectedBusiness(biz);
  }, [selectedBrand]);

  // Simula la carga inicial de datos con efecto de Skeleton Screen y resolución de Deep Links
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);

      // Resolver páginas directas de marca
      try {
        const pathname = window.location.pathname.toLowerCase();
        if (pathname.startsWith('/marca') || pathname.startsWith('/cadena')) {
          const slug = pathname.replace(/^\/(marca|cadena)\//, '').replace(/\/+$/, '');
          const allList = getBusinesses();
          const foundBrand =
            allList.find((b) => b.slug === slug || b.id === slug) ||
            allList.find((b) => b.isMultiBranch);
          if (foundBrand) {
            setSelectedBrand(foundBrand);
            setCurrentPage('marca');
          }
        }
      } catch (err) {
        console.error('Error resolving brand URL:', err);
      }

      // Resolver negocio compartido por URL (WhatsApp / Redes)
      try {
        const fullUrl = window.location.href;
        const match = fullUrl.match(/[?&]negocio=([^&#]+)/i);
        if (match && match[1]) {
          const targetName = decodeURIComponent(match[1]).toLowerCase().trim();
          const allList = getBusinesses();
          const matchedBusiness = allList.find(
            (b) => b.name.toLowerCase().trim() === targetName ||
                   b.name.toLowerCase().includes(targetName) ||
                   b.id === targetName ||
                   b.slug === targetName
          );
          if (matchedBusiness) {
            if (matchedBusiness.isMultiBranch) {
              setSelectedBrand(matchedBusiness);
              setCurrentPage('marca');
            } else {
              setSelectedBusiness(matchedBusiness);
            }
          }
        }
      } catch (err) {
        console.error('Error resolving shared business deep-link:', err);
      }
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Filtrado reactivo completo
  const filteredBusinesses = useMemo(() => {
    const businesses = getBusinesses();
    const q = query.toLowerCase().trim();

    const filtered = businesses.filter((b) => {
      // 1. Categoría
      if (activeCategory !== 'all') {
        const catObj = adminStore.getCategories().find((c) => c.id === activeCategory);
        const catLabel = catObj?.label?.toLowerCase();
        const matchesId = b.category === activeCategory;
        const matchesLabel = catLabel && b.categoryLabel && b.categoryLabel.toLowerCase() === catLabel;
        const matchesDirectLabel = b.categoryLabel && b.categoryLabel.toLowerCase() === activeCategory.toLowerCase();
        const matchesCatName = catLabel && b.category && b.category.toLowerCase() === catLabel;
        if (!matchesId && !matchesLabel && !matchesDirectLabel && !matchesCatName) {
          return false;
        }
      }

      // 2. Zona
      if (activeZone !== 'Todas las zonas' && b.zone !== activeZone) {
        return false;
      }

      // 3. Abierto ahora
      if (filterOpenNow && !isBusinessOpen(b)) {
        return false;
      }

      // 4. Acepta Cashea
      if (filterCashea && (!b.paymentMethods || !b.paymentMethods.includes('cashea'))) {
        return false;
      }

      // 5. Con Descuento / Oferta
      if (filterDiscount && !b.activePromotion) {
        return false;
      }

      // 6. Método de pago específico
      if (filterPayment !== 'all') {
        if (!b.paymentMethods || !b.paymentMethods.includes(filterPayment)) {
          return false;
        }
      }

      // 7. Solo VIP
      if (filterOnlyVIP && !b.isFeatured) {
        return false;
      }

      // 7.5. Solo Favoritos
      if (filterFavorites && !favorites.includes(b.id)) {
        return false;
      }

      // 8. Término de búsqueda
      if (q) {
        const matchText =
          b.name.toLowerCase().includes(q) ||
          b.categoryLabel.toLowerCase().includes(q) ||
          b.zone.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          (b.activePromotion && b.activePromotion.toLowerCase().includes(q)) ||
          (b.tags && b.tags.some((t) => t.toLowerCase().includes(q)));
        if (!matchText) return false;
      }

      return true;
    });

    // Ordenamiento
    return [...filtered].sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating * b.reviewCount) - (a.rating * a.reviewCount);
      }
      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      // Por defecto: 'featured' (VIP primero, luego Verificados, luego rating)
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      if (a.isVerified && !b.isVerified) return -1;
      if (!a.isVerified && b.isVerified) return 1;
      return (b.rating * b.reviewCount) - (a.rating * a.reviewCount);
    });
  }, [
    query,
    activeCategory,
    activeZone,
    filterOpenNow,
    filterCashea,
    filterDiscount,
    filterPayment,
    filterOnlyVIP,
    filterFavorites,
    favorites,
    sortBy,
  ]);

  // Manejo de Favoritos con persistencia y notificación Toast
  const toggleFavorite = useCallback((id) => {
    const allBiz = getBusinesses();
    const target = allBiz.find((b) => b.id === id);
    const targetName = target ? target.name : null;

    setFavorites((prev) => {
      const isFav = prev.includes(id);
      const next = isFav ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('cumana_favorites', JSON.stringify(next));
      } catch {}

      if (isFav) {
        toast.unfavorite(targetName);
      } else {
        toast.favorite(targetName);
      }

      return next;
    });
  }, [toast]);

  // Comercios VIP y Estándar para organización visual
  const businessesList = getBusinesses();
  const spotlightBusinesses = useMemo(() => {
    try {
      const settings = adminStore.getSettings();
      if (settings.spotlightEnabled === false) return [];
      const explicitlySpotlight = businessesList.filter((b) => b.isSpotlight);
      if (explicitlySpotlight.length > 0) return explicitlySpotlight;
      return businessesList.filter((b) => b.isFeatured).slice(0, 5);
    } catch {
      return businessesList.filter((b) => b.isSpotlight || b.isFeatured).slice(0, 5);
    }
  }, [businessesList]);

  const featuredBusinesses = useMemo(
    () => filteredBusinesses.filter((b) => b.isFeatured),
    [filteredBusinesses]
  );
  const standardBusinesses = useMemo(
    () => filteredBusinesses.filter((b) => !b.isFeatured),
    [filteredBusinesses]
  );

  const handleResetFilters = useCallback(() => {
    setQuery('');
    setActiveCategory('all');
    setActiveZone('Todas las zonas');
    setFilterOpenNow(false);
    setFilterCashea(false);
    setFilterDiscount(false);
    setFilterPayment('all');
    setFilterOnlyVIP(false);
    setFilterFavorites(false);
    setSortBy('featured');
  }, []);

  const handleFilterCashea = useCallback(() => {
    setFilterCashea(true);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const directorySchema = useMemo(() => {
    return generateDirectoryItemListSchema(filteredBusinesses);
  }, [filteredBusinesses]);

  // Routing
  if (currentPage === 'admin') {
    if (!adminAuthenticated) {
      return <AdminLogin onSuccess={() => setAdminAuthenticated(true)} />;
    }
    return <AdminLayout onLogout={() => { setAdminAuthenticated(false); handleNavigate('home'); }} />;
  }

  if (currentPage === 'directorio') {
    return (
      <>
        <DirectoryPage
          onNavigateHome={() => handleNavigate('home')}
          onOpenPricing={() => setPricingModalOpen(true)}
          onOpenEmergency={() => setEmergencyModalOpen(true)}
          onSelectBusiness={(biz) => handleSelectBusiness(biz)}
        />

        {/* ─── Barra Fija de Emergencias ─── */}
        <EmergencyFooter
          isOpen={emergencyModalOpen}
          onClose={() => setEmergencyModalOpen(false)}
          onOpen={() => setEmergencyModalOpen(true)}
        />

        {/* ─── Modal de Detalle de Comercio ─── */}
        <AnimatePresence>
          {selectedBusiness && (
            <BusinessDetailModal
              key={`business-detail-${selectedBusiness.id}`}
              business={selectedBusiness}
              onClose={() => setSelectedBusiness(null)}
              onOpenEmergency={() => {
                setSelectedBusiness(null);
                setEmergencyModalOpen(true);
              }}
            />
          )}
        </AnimatePresence>

        {/* ─── Modal de Planes y Precios ─── */}
        <PricingSection
          isModal={true}
          isOpen={pricingModalOpen}
          onClose={() => setPricingModalOpen(false)}
        />

        {/* ─── Barra Fija de Navegación Móvil ─── */}
        <MobileBottomNav
          isCasheaActive={filterCashea}
          onSearchClick={() => {
            handleNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onRubrosClick={() => {
            handleNavigate('home');
            setTimeout(() => {
              document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
            }, 120);
          }}
          onCasheaClick={() => {
            handleNavigate('home');
            setFilterCashea(true);
            setTimeout(() => {
              document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
            }, 120);
          }}
          onEmergencyClick={() => setEmergencyModalOpen(true)}
          onPricingClick={() => setPricingModalOpen(true)}
        />
      </>
    );
  }

  if (currentPage === 'marca') {
    const allBiz = getBusinesses();
    const brandBusiness =
      selectedBrand ||
      allBiz.find((b) => b.isMultiBranch) ||
      allBiz[0];
    return (
      <>
        <MultiBranchBrandPage
          business={brandBusiness}
          onBack={() => {
            setSelectedBrand(null);
            handleNavigate('home');
          }}
          onOpenPricing={() => setPricingModalOpen(true)}
        />
        <PricingSection
          isModal={true}
          isOpen={pricingModalOpen}
          onClose={() => setPricingModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col antialiased transition-colors duration-300 ${
        isDark ? 'bg-[#121316] text-slate-100' : 'bg-[#f7f9fb] text-[#191c1e]'
      }`}
    >
      
      {/* ─── Inyección de Schema.org ItemList para SEO ─── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(directorySchema) }}
      />

      {/* ─── Encabezado Principal y Hero ─── */}
      <Header
        onNavigate={handleNavigate}
        onOpenPricing={() => setPricingModalOpen(true)}
        onOpenEmergency={() => setEmergencyModalOpen(true)}
        totalBusinesses={businessesList.length}
        featuredCount={businessesList.filter((b) => b.isFeatured).length}
        filteredCount={filteredBusinesses.length}
        query={query}
        setQuery={setQuery}
        activeZone={activeZone}
        setActiveZone={setActiveZone}
        filterOpenNow={filterOpenNow}
        setFilterOpenNow={setFilterOpenNow}
        filterCashea={filterCashea}
        setFilterCashea={setFilterCashea}
        filterDiscount={filterDiscount}
        setFilterDiscount={setFilterDiscount}
        onSelectCategory={(catId) => setActiveCategory(catId)}
      />

      {/* ─── Categorías y Barra de Herramientas ─── */}
      <SearchAndFilters
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        filterPayment={filterPayment}
        setFilterPayment={setFilterPayment}
        filterOnlyVIP={filterOnlyVIP}
        setFilterOnlyVIP={setFilterOnlyVIP}
        filterFavorites={filterFavorites}
        setFilterFavorites={setFilterFavorites}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* ─── Contenedor Principal del Directorio ─── */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-12 flex-1 w-full py-6" id="catalogo">

        {/* ─── Estado de Carga (Skeleton Screens) ─── */}
        {isLoading ? (
          <section className="mb-12" aria-label="Cargando comercios de Cumaná...">
            <div className={`flex items-center justify-between gap-3 mb-4 pb-2 border-b ${
              isDark ? 'border-[#252830]' : 'border-slate-200/80'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
                <div className={`w-48 h-5 rounded shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
              </div>
              <div className={`w-20 h-5 rounded-full shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            </div>

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6' : 'flex flex-col gap-4'}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <BusinessCardSkeleton key={`skeleton-${idx}`} viewMode={viewMode} />
              ))}
            </div>
          </section>
        ) : (
          <>
            {/* ── Estado Vacío (Sin Resultados) ── */}
            {filteredBusinesses.length === 0 && (
              <div className={`rounded-2xl border p-8 sm:p-12 text-center max-w-lg mx-auto my-10 shadow-sm ${
                isDark
                  ? 'bg-[#18191d] border-[#2b2d35] text-slate-200'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  isDark ? 'bg-[#22242c] text-amber-400' : 'bg-slate-100 text-slate-400'
                }`}>
                  <SearchX size={32} />
                </div>
                <h2 className="font-['Outfit'] text-lg font-bold mb-2">
                  No encontramos negocios con esos criterios
                </h2>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed font-['Inter']">
                  No se hallaron resultados para los filtros seleccionados en Cumaná. Intenta restablecer los filtros o buscar con otro término.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="h-11 px-6 rounded-xl font-bold text-xs inline-flex items-center gap-2 transition cursor-pointer shadow-sm hover:opacity-90"
                  style={{
                    backgroundColor: isDark ? '#eab308' : '#005f73',
                    color: isDark ? '#0f172a' : '#ffffff',
                  }}
                >
                  <span>Restablecer Filtros</span>
                </button>
              </div>
            )}

            {/* ─── Vitrina de Anuncios: Comercios Destacados de Cumaná (Carrusel) ─── */}
            {spotlightBusinesses.length > 0 && (
              <FeaturedSpotlightCarousel
                businesses={spotlightBusinesses}
                onSelect={(biz) => handleSelectBusiness(biz)}
              />
            )}

            {/* ─── Sección: Comercios Destacados / Patrocinados (VIP) ─── */}
            {featuredBusinesses.length > 0 && (
          <section className="mb-10" aria-label="Comercios destacados de Cumaná">
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b ${
              isDark ? 'border-[#252830]' : 'border-slate-200/80'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide ${
                    isDark
                      ? 'bg-[#221f15] text-[#f59e0b] border border-[#45371c]'
                      : 'bg-amber-100 text-amber-900 border border-amber-200'
                  }`}>
                    <Crown size={11} className="fill-current" />
                    <span>MONETIZADOS & VIP</span>
                  </span>
                </div>
                <h2 className={`font-['Outfit'] font-bold text-lg sm:text-xl tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Destacados en <span className={isDark ? 'text-amber-400' : 'text-[#005f73]'}>Cumaná</span>
                </h2>
                <p className="text-xs text-slate-400 font-['Inter']">
                  Los comercios con mayor valoración, verificación oficial y promociones exclusivas en la ciudad.
                </p>
              </div>

              <span className={`text-xs font-bold px-3 py-1 rounded-full border self-start sm:self-center ${
                isDark
                  ? 'bg-[#221f15] text-amber-300 border-[#45371c]'
                  : 'text-amber-900 bg-amber-100/90 border-amber-200'
              }`}>
                ✨ {featuredBusinesses.length} Comercios Premium
              </span>
            </div>

            <div
              key={`featured-grid-${activeCategory}-${activeZone}-${sortBy}-${filterCashea}-${filterOpenNow}`}
              className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6' : 'flex flex-col gap-4'}
            >
              {featuredBusinesses.map((biz) => (
                <BusinessCard
                  key={biz.id}
                  business={biz}
                  viewMode={viewMode}
                  isFavorite={favorites.includes(biz.id)}
                  onToggleFavorite={toggleFavorite}
                  onSelect={(b) => handleSelectBusiness(b)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ─── Sección: Directorio General / Catálogo Estándar ─── */}
        {standardBusinesses.length > 0 && (
          <section className="mb-12" aria-label="Directorio general de comercios">
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b ${
              isDark ? 'border-[#252830]' : 'border-slate-200/80'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className={`font-['Outfit'] font-bold text-lg sm:text-xl tracking-tight flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    <span>Explorar Directorio y Recientes</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isDark ? 'bg-[#252830] text-amber-400' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {standardBusinesses.length}
                    </span>
                  </h2>
                </div>
                <p className="text-xs text-slate-400 font-['Inter']">
                  Catálogo completo ordenado por prioridad oficial y relevancia
                </p>
              </div>

              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border self-start sm:self-center ${
                isDark
                  ? 'bg-[#18191d] text-slate-300 border-[#282a32]'
                  : 'text-slate-600 bg-slate-100 border-slate-200'
              }`}>
                {standardBusinesses.length} {standardBusinesses.length === 1 ? 'local' : 'locales'}
              </span>
            </div>

            <div
              key={`standard-grid-${activeCategory}-${activeZone}-${sortBy}-${filterCashea}-${filterOpenNow}`}
              className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6' : 'flex flex-col gap-4'}
            >
              {standardBusinesses.map((biz) => (
                <BusinessCard
                  key={biz.id}
                  business={biz}
                  viewMode={viewMode}
                  isFavorite={favorites.includes(biz.id)}
                  onToggleFavorite={toggleFavorite}
                  onSelect={(b) => handleSelectBusiness(b)}
                />
              ))}
            </div>
          </section>
        )}
          </>
        )}

      </main>

      {/* ─── Banner Oficial de Cashea ─── */}
      <CasheaBanner
        onFilterCashea={handleFilterCashea}
        onOpenPricing={() => setPricingModalOpen(true)}
      />

      {/* ─── Tira de Promociones en Vivo (Estilo Noticiero) ─── */}
      <PromoTicker
        onSelectBusiness={(biz) => setSelectedBusiness(biz)}
      />

      {/* ─── Footer Institucional ─── */}
      <Footer
        onOpenPricing={() => setPricingModalOpen(true)}
        onSelectCategory={(catId) => setActiveCategory(catId)}
        onSelectQuery={(term) => setQuery(term)}
        onOpenEmergency={() => setEmergencyModalOpen(true)}
        onNavigateAdmin={() => handleNavigate('admin')}
      />

      {/* ─── Asistente Inteligente CumanáBot IA ─── */}
      <CumanaBot
        onSelectBusiness={(biz) => setSelectedBusiness(biz)}
        onOpenPricing={() => setPricingModalOpen(true)}
        onOpenEmergency={() => setEmergencyModalOpen(true)}
      />


      {/* ─── Barra Fija de Emergencias ─── */}
      <EmergencyFooter
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        onOpen={() => setEmergencyModalOpen(true)}
      />

      {/* ─── Modal de Detalle de Comercio ─── */}
      <AnimatePresence>
        {selectedBusiness && (
          <BusinessDetailModal
            key={`business-detail-${selectedBusiness.id}`}
            business={selectedBusiness}
            onClose={() => setSelectedBusiness(null)}
            onOpenEmergency={() => {
              setSelectedBusiness(null);
              setEmergencyModalOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* ─── Modal de Planes y Precios ─── */}
      <PricingSection
        isModal={true}
        isOpen={pricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
      />

      {/* ─── Barra Fija de Navegación Móvil (Según Referencia) ─── */}
      <MobileBottomNav
        isCasheaActive={filterCashea}
        onSearchClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const searchInput = document.querySelector('input[placeholder*="Farmacia"]');
          searchInput?.focus();
        }}
        onRubrosClick={() => {
          document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onCasheaClick={() => {
          setFilterCashea((prev) => !prev);
          document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onEmergencyClick={() => setEmergencyModalOpen(true)}
        onPricingClick={() => setPricingModalOpen(true)}
      />

    </div>
  );
}
