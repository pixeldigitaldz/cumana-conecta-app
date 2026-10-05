/**
 * adminStore.js — CumanáConecta Admin Store
 * Estado global del panel de administración con persistencia en localStorage.
 * Todos los módulos del panel leen y escriben a través de este store.
 */

import { businesses as initialBusinesses, CATEGORIES as initialCategories, CUMANA_ZONES as initialZones } from '../data/mockBusinessData.js';

// ── Claves de localStorage ────────────────────────────────────────────────────
const KEYS = {
  businesses: 'cc_admin_businesses',
  categories: 'cc_admin_categories',
  zones: 'cc_admin_zones',
  emergencies: 'cc_admin_emergencies',
  searches: 'cc_admin_searches',
  plans: 'cc_admin_plans',
  settings: 'cc_admin_settings',
  paymentMethods: 'cc_admin_payment_methods',
  events: 'cc_admin_events',
  bannerUrl: 'cc_admin_banner_url',
};

// ── Datos por defecto ─────────────────────────────────────────────────────────
const DEFAULT_EMERGENCIES = [
  { id: 'bomberos', name: 'Cuerpo de Bomberos de Cumaná', number: '171', altNumber: '0293-4312222', category: 'Incendios, Rescate & Siniestros', color: 'rose' },
  { id: 'proteccion_civil', name: 'Protección Civil Edo. Sucre', number: '0293-4321234', altNumber: '0800-7248450', category: 'Desastres Naturales & Lluvias', color: 'amber' },
  { id: 'ambulancias', name: 'SAMU / Central de Ambulancias', number: '0800-4287268', altNumber: '171', category: 'Emergencias Médicas & Traslados', color: 'emerald' },
  { id: 'policia', name: 'Policía del Estado Sucre / Cuadrantes', number: '0800-7654242', altNumber: '171', category: 'Seguridad Ciudadana & Patrullaje', color: 'blue' },
  { id: 'corpoelec', name: 'Corpoelec – Cumaná', number: '0800-2677000', altNumber: '0293-4319900', category: 'Fallas Eléctricas & Emergencias', color: 'yellow' },
  { id: 'hidrosucre', name: 'Hidrosucre – Emergencias', number: '0293-4318800', altNumber: '0800-4447833', category: 'Agua Potable & Cloacas', color: 'cyan' },
  { id: 'transito', name: 'Tránsito Municipal Cumaná', number: '0293-4310000', altNumber: '171', category: 'Accidentes Viales & Control', color: 'violet' },
];

const DEFAULT_SEARCHES = [
  'Farmacias 24 horas', 'Restaurantes', 'Tiendas con Cashea', 'Talleres Mecánicos',
  'Clínicas y Emergencias', 'Cafeterías & Repostería', 'Arepas de Cazón', 'Tours a Mochima',
];

const DEFAULT_PLANS = [
  {
    id: 'standard',
    name: 'Plan Estándar',
    price: 0,
    currency: 'USD',
    period: 'mes',
    activeCount: 142,
    active: true,
    priority: 1,
    photoLimit: '3 fotos',
    badge: '',
    color: '#64748b',
    description: 'Para pequeños negocios y oficios que desean tener presencia en el directorio digital de Cumaná',
    features: [
      { id: 'search', text: 'Aparece en búsquedas destacadas', enabled: false },
      { id: 'badge', text: 'Insignia verificada en perfil', enabled: false },
      { id: 'support', text: 'Soporte prioritario', enabled: false },
    ],
    benefits: [
      'Presencia en el listado general del directorio',
      'Datos de contacto básicos (Dirección, Teléfono y Zona)',
      'Botón de enlace a WhatsApp directo',
      'Ubicación en Google Maps',
    ],
    ctaText: 'Comenzar Gratis',
    ctaColor: '#64748b',
  },
  {
    id: 'vip',
    name: 'Plan Destacado VIP',
    price: 10.00,
    currency: 'USD',
    period: 'mes',
    activeCount: 42,
    active: true,
    priority: 10,
    photoLimit: '15 fotos',
    badge: 'TOP',
    color: '#ea580c',
    description: 'Máxima exposición, primeros resultados en búsquedas de toda Cumaná e insignia verificada',
    features: [
      { id: 'search', text: 'Aparece en búsquedas destacadas', enabled: true },
      { id: 'badge', text: 'Insignia verificada en perfil', enabled: true },
      { id: 'support', text: 'Soporte prioritario', enabled: false },
    ],
    benefits: [
      'Posicionamiento fijo en Primera Portada y primeros resultados',
      'Insignia oficial de Verificado ✔️ y VIP con marco dorado',
      'Inclusión y reproducción de Video Guía "Cómo Llegar" (Shorts/Reels/YT)',
      'Conexión multicanal directa (Instagram, TikTok y YouTube)',
      'Badge destacado de Cashea y Métodos de Pago prioritarios',
      'Publicación de promociones y ofertas activas en la tira superior',
      'Galería de fotos extendida y menú completo de servicios',
    ],
    ctaText: 'Activar Plan VIP Portada',
    ctaColor: '#ea580c',
  },
];

const DEFAULT_SETTINGS = {
  adminWhatsapp: '584120000000',
  siteTitle: 'CumanáConecta — Directorio Comercial y de Servicios de Cumaná, Sucre',
  siteDescription: 'La guía comercial, de salud y servicios de Cumaná, Estado Sucre, Venezuela. Encuentra farmacias 24h, restaurantes, clínicas, talleres y más.',
  instagramHandle: '@cumanaconecta',
  tiktokHandle: '@cumanaconecta',
  youtubeHandle: 'https://youtube.com/@cumanaconecta',
  twitterHandle: '@cumanaconecta',
  bannerImageUrl: '/images/cumana_banner_negocio.png',
  spotlightEnabled: true,
  spotlightTitle: 'Comercios Destacados de Cumaná',
  // Configuración oficial de Cashea y Calculadora de Cuotas
  casheaCalculatorEnabled: true,
  casheaCardPreviewEnabled: true,
  casheaPromoActive: false,
  casheaPromoTitle: 'Promo Especial Cashea',
  casheaPromoBadge: 'Inicial Reducida desde 20%',
  casheaPromoDiscount: 10, // porcentaje de rebaja o ajuste promocional
  casheaAllowExtendedCuotas: true,
};

const DEFAULT_PAYMENT_METHODS = [
  { id: 'cashea', name: 'Cashea', shortLabel: 'Cashea', badgeText: 'Cashea Aceptado', active: true, color: 'yellow' },
  { id: 'pago_movil', name: 'Pago Móvil', shortLabel: 'Pago Móvil', badgeText: 'Pago Móvil', active: true, color: 'blue' },
  { id: 'binance', name: 'Binance Pay / USDT', shortLabel: 'Binance', badgeText: 'Binance / USDT', active: true, color: 'amber' },
  { id: 'usd_cash', name: 'Divisas USD / Zelle', shortLabel: 'USD / Zelle', badgeText: 'USD / Zelle', active: true, color: 'emerald' },
  { id: 'punto_de_venta', name: 'Punto de Venta / Biopago', shortLabel: 'Punto / Débito', badgeText: 'Punto de Venta', active: true, color: 'slate' },
];

// ── Helpers de serialización ──────────────────────────────────────────────────
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cumana_store_updated', { detail: { key, value } }));
    }
    return true;
  } catch {
    return false;
  }
}

// ── Inicializar negocios con status si no tienen ──────────────────────────────
function initBusinesses() {
  const stored = load(KEYS.businesses, null);

  const storedMap = new Map((stored || []).map((b) => [b.id, b]));
  const merged = initialBusinesses.map((baseBiz) => {
    const existing = storedMap.get(baseBiz.id);
    return {
      ...baseBiz,
      ...(existing || {}),
      // Si el usuario guardó isSpotlight explícitamente en el admin se respeta, sino usa el de baseBiz
      isSpotlight: existing && existing.isSpotlight !== undefined ? existing.isSpotlight : !!baseBiz.isSpotlight,
      spotlightTagline: (existing && existing.spotlightTagline) || baseBiz.spotlightTagline || '',
      spotlightPromoTitle: (existing && existing.spotlightPromoTitle) || baseBiz.spotlightPromoTitle || '',
      spotlightPromoBadge: (existing && existing.spotlightPromoBadge) || baseBiz.spotlightPromoBadge || 'RECOMENDADO',
      spotlightPromoDesc: (existing && existing.spotlightPromoDesc) || baseBiz.spotlightPromoDesc || '',
      status: (existing && existing.status) ? existing.status : 'active',
      createdAt: (existing && existing.createdAt) ? existing.createdAt : new Date().toISOString(),
      // Propiedades de cadenas y comercios multi-sede actualizadas desde Firebase
      isMultiBranch: existing && existing.isMultiBranch !== undefined ? existing.isMultiBranch : !!baseBiz.isMultiBranch,
      branchCount: existing && existing.branchCount !== undefined ? existing.branchCount : baseBiz.branchCount || baseBiz.branches?.length || 1,
      branches: existing && Array.isArray(existing.branches) && existing.branches.length > 0 ? existing.branches : baseBiz.branches || [],
      promotionalFlyers: existing && Array.isArray(existing.promotionalFlyers) && existing.promotionalFlyers.length > 0 ? existing.promotionalFlyers : baseBiz.promotionalFlyers || [],
      products: existing && Array.isArray(existing.products) && existing.products.length > 0 ? existing.products : baseBiz.products || [],
      casheaEnabled: existing && existing.casheaEnabled !== undefined ? existing.casheaEnabled : baseBiz.casheaEnabled,
      casheaModalities: existing && Array.isArray(existing.casheaModalities) ? existing.casheaModalities : baseBiz.casheaModalities || [],
      // Sección de Productos, Servicios & Especialidades y Ficha Enriquecida
      showFeaturedProducts: existing && existing.showFeaturedProducts !== undefined ? existing.showFeaturedProducts : (baseBiz.showFeaturedProducts !== false),
      featuredProducts: existing && Array.isArray(existing.featuredProducts) ? existing.featuredProducts : baseBiz.featuredProducts || null,
      highlights: existing && Array.isArray(existing.highlights) ? existing.highlights : baseBiz.highlights || null,
      referencePoint: (existing && existing.referencePoint) || baseBiz.referencePoint || '',
    };
  });

  // Agregar cualquier comercio extra creado manualmente en el admin
  if (Array.isArray(stored)) {
    stored.forEach((b) => {
      if (!initialBusinesses.some((base) => base.id === b.id)) {
        merged.push({
          ...b,
          isSpotlight: !!b.isSpotlight,
          status: b.status || 'active',
        });
      }
    });
  }

  save(KEYS.businesses, merged);
  return merged;
}

function initCategories() {
  const stored = load(KEYS.categories, null);
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    const seeded = initialCategories.map((c) => ({ ...c, active: true }));
    save(KEYS.categories, seeded);
    return seeded;
  }

  const storedIds = new Set(stored.map((c) => c.id));
  let modified = false;
  const list = [...stored];

  // Asegurar que 'all' esté presente
  if (!storedIds.has('all')) {
    list.unshift({ id: 'all', label: 'Todas', icon: 'Layers', emoji: '🗺️', active: true });
    modified = true;
  }

  // Asegurar que las categorías por defecto existan si no están en stored
  initialCategories.forEach((ic) => {
    if (!storedIds.has(ic.id)) {
      list.push({ ...ic, active: true });
      modified = true;
    }
  });

  if (modified) {
    save(KEYS.categories, list);
  }
  return list;
}

function initZones() {
  const stored = load(KEYS.zones, null);
  if (stored) return stored;
  const seeded = initialZones.filter(z => z !== 'Todas las zonas');
  save(KEYS.zones, seeded);
  return seeded;
}

// ── API Pública del Store ─────────────────────────────────────────────────────

// BUSINESSES
export const adminStore = {
  // --- Businesses ---
  getBusinesses() { return initBusinesses(); },
  saveBusinesses(list) { save(KEYS.businesses, list); },
  getSpotlightBusinesses() {
    return this.getBusinesses().filter(b => b.isSpotlight && b.status !== 'rejected');
  },
  toggleSpotlight(id, isSpotlight) {
    const list = this.getBusinesses();
    const idx = list.findIndex(b => b.id === id);
    if (idx === -1) return null;
    const newVal = isSpotlight !== undefined ? isSpotlight : !list[idx].isSpotlight;
    list[idx] = { ...list[idx], isSpotlight: newVal, updatedAt: new Date().toISOString() };
    save(KEYS.businesses, list);
    return list[idx];
  },
  addBusiness(biz) {
    const list = this.getBusinesses();
    const newBiz = {
      ...biz,
      id: `biz-${Date.now()}`,
      slug: biz.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      createdAt: new Date().toISOString(),
      status: biz.status || 'pending',
      isVerified: biz.isVerified || false,
      isFeatured: biz.plan === 'vip',
      isSpotlight: biz.isSpotlight || false,
      spotlightTagline: biz.spotlightTagline || '',
      spotlightPromoTitle: biz.spotlightPromoTitle || '',
      spotlightPromoBadge: biz.spotlightPromoBadge || 'RECOMENDADO',
      spotlightPromoDesc: biz.spotlightPromoDesc || '',
      rating: biz.rating || 4.5,
      reviewCount: biz.reviewCount || 0,
    };
    list.push(newBiz);
    save(KEYS.businesses, list);
    return newBiz;
  },
  updateBusiness(id, updates) {
    const list = this.getBusinesses();
    const idx = list.findIndex(b => b.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
    if (updates.plan !== undefined && updates.isFeatured === undefined) {
      list[idx].isFeatured = updates.plan === 'vip';
    }
    save(KEYS.businesses, list);
    return list[idx];
  },
  deleteBusiness(id) {
    const list = this.getBusinesses().filter(b => b.id !== id);
    save(KEYS.businesses, list);
  },
  approveBusiness(id) { return this.updateBusiness(id, { status: 'active' }); },
  rejectBusiness(id) { return this.updateBusiness(id, { status: 'rejected' }); },
  verifyBusiness(id, verified) { return this.updateBusiness(id, { isVerified: verified }); },

  // --- Multi-Branch & Products (Firebase Sync) ---
  toggleMultiBranch(id, isMultiBranch) {
    const list = this.getBusinesses();
    const idx = list.findIndex(b => b.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], isMultiBranch: !!isMultiBranch, updatedAt: new Date().toISOString() };
    save(KEYS.businesses, list);
    return list[idx];
  },
  addBranch(id, branch) {
    const list = this.getBusinesses();
    const idx = list.findIndex(b => b.id === id);
    if (idx === -1) return null;
    const biz = list[idx];
    const branches = Array.isArray(biz.branches) ? [...biz.branches] : [];
    const newBranch = { ...branch, id: branch.id || `branch-${Date.now()}-${Math.floor(Math.random() * 1000)}` };
    branches.push(newBranch);
    list[idx] = { ...biz, isMultiBranch: true, branchCount: branches.length, branches, updatedAt: new Date().toISOString() };
    save(KEYS.businesses, list);
    return list[idx];
  },
  updateBranch(id, branchId, branchUpdates) {
    const list = this.getBusinesses();
    const idx = list.findIndex(b => b.id === id);
    if (idx === -1) return null;
    const biz = list[idx];
    const branches = (biz.branches || []).map(b => b.id === branchId ? { ...b, ...branchUpdates } : b);
    list[idx] = { ...biz, branches, branchCount: branches.length, updatedAt: new Date().toISOString() };
    save(KEYS.businesses, list);
    return list[idx];
  },
  deleteBranch(id, branchId) {
    const list = this.getBusinesses();
    const idx = list.findIndex(b => b.id === id);
    if (idx === -1) return null;
    const biz = list[idx];
    const branches = (biz.branches || []).filter(b => b.id !== branchId);
    list[idx] = { ...biz, branches, branchCount: branches.length, updatedAt: new Date().toISOString() };
    save(KEYS.businesses, list);
    return list[idx];
  },
  updateBusinessFlyers(id, flyers) {
    const list = this.getBusinesses();
    const idx = list.findIndex(b => b.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], promotionalFlyers: flyers, updatedAt: new Date().toISOString() };
    save(KEYS.businesses, list);
    return list[idx];
  },
  updateBusinessProducts(id, products) {
    const list = this.getBusinesses();
    const idx = list.findIndex(b => b.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], products, updatedAt: new Date().toISOString() };
    save(KEYS.businesses, list);
    return list[idx];
  },

  // --- Categories ---
  getCategories() { return initCategories(); },
  saveCategories(list) { save(KEYS.categories, list); },
  addCategory(cat) {
    const list = this.getCategories();
    const cleanLabel = (cat.label || '').trim();
    const slug = cleanLabel.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    let id = cat.id || slug || `cat-${Date.now()}`;
    if (list.some((c) => c.id === id)) {
      id = `${id}-${Date.now()}`;
    }
    const newCat = {
      ...cat,
      id,
      label: cleanLabel,
      emoji: cat.emoji || '🏪',
      icon: cat.icon || 'Store',
      active: true,
    };
    list.push(newCat);
    save(KEYS.categories, list);
    return newCat;
  },
  updateCategory(id, updates) {
    const list = this.getCategories();
    const idx = list.findIndex(c => c.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    save(KEYS.categories, list);
    return list[idx];
  },
  deleteCategory(id) {
    const list = this.getCategories().filter(c => c.id !== id);
    save(KEYS.categories, list);
  },

  // --- Zones ---
  getZones() { return initZones(); },
  saveZones(list) { save(KEYS.zones, list); },
  addZone(name) {
    const list = this.getZones();
    if (!list.includes(name)) { list.push(name); save(KEYS.zones, list); }
    return list;
  },
  deleteZone(name) {
    const list = this.getZones().filter(z => z !== name);
    save(KEYS.zones, list);
    return list;
  },

  // --- Emergencies ---
  getEmergencies() { return load(KEYS.emergencies, DEFAULT_EMERGENCIES); },
  saveEmergencies(list) { save(KEYS.emergencies, list); },
  updateEmergency(id, updates) {
    const list = this.getEmergencies();
    const idx = list.findIndex(e => e.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    save(KEYS.emergencies, list);
    return list[idx];
  },
  addEmergency(item) {
    const list = this.getEmergencies();
    const newItem = { ...item, id: `emg-${Date.now()}` };
    list.push(newItem);
    save(KEYS.emergencies, list);
    return newItem;
  },
  deleteEmergency(id) {
    const list = this.getEmergencies().filter(e => e.id !== id);
    save(KEYS.emergencies, list);
  },

  // --- Frequent Searches ---
  getSearches() { return load(KEYS.searches, DEFAULT_SEARCHES); },
  saveSearches(list) { save(KEYS.searches, list); },
  addSearch(term) {
    const list = this.getSearches();
    if (!list.includes(term)) { list.push(term); save(KEYS.searches, list); }
    return list;
  },
  deleteSearch(term) {
    const list = this.getSearches().filter(s => s !== term);
    save(KEYS.searches, list);
    return list;
  },
  updateSearch(oldTerm, newTerm) {
    const list = this.getSearches().map(s => s === oldTerm ? newTerm : s);
    save(KEYS.searches, list);
    return list;
  },

  // --- Plans ---
  getPlans() {
    const raw = load(KEYS.plans, null);
    if (Array.isArray(raw) && raw.length > 0) {
      const hasLegacyDummy = raw.some(p => p.id === 'basic' || p.id === 'premium');
      if (!hasLegacyDummy) return raw;
    }
    if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
      return DEFAULT_PLANS.map(def => ({
        ...def,
        ...(raw[def.id] || {}),
      }));
    }
    save(KEYS.plans, DEFAULT_PLANS);
    return DEFAULT_PLANS;
  },
  savePlans(plans) {
    save(KEYS.plans, plans);
    return plans;
  },
  updatePlan(id, updates) {
    const plans = this.getPlans();
    const idx = plans.findIndex(p => p.id === id);
    if (idx !== -1) {
      plans[idx] = { ...plans[idx], ...updates };
    } else {
      plans.push({ id, ...updates });
    }
    save(KEYS.plans, plans);
    return plans;
  },
  addPlan(plan) {
    const plans = this.getPlans();
    const newPlan = {
      ...plan,
      id: plan.id || `plan_${Date.now()}`,
      activeCount: plan.activeCount ?? 0,
      active: plan.active ?? true,
    };
    plans.push(newPlan);
    save(KEYS.plans, plans);
    return plans;
  },
  deletePlan(id) {
    const plans = this.getPlans().filter(p => p.id !== id);
    save(KEYS.plans, plans);
    return plans;
  },

  // --- Settings ---
  getSettings() {
    const stored = load(KEYS.settings, DEFAULT_SETTINGS);
    return { ...DEFAULT_SETTINGS, ...(stored || {}) };
  },
  saveSettings(settings) { save(KEYS.settings, settings); },
  updateSettings(updates) {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    save(KEYS.settings, updated);
    return updated;
  },

  // --- Payment Methods ---
  getPaymentMethods() { return load(KEYS.paymentMethods, DEFAULT_PAYMENT_METHODS); },
  savePaymentMethods(list) { save(KEYS.paymentMethods, list); },
  updatePaymentMethod(id, updates) {
    const list = this.getPaymentMethods();
    const idx = list.findIndex(m => m.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    save(KEYS.paymentMethods, list);
    return list[idx];
  },

  // --- Events / Banners ---
  getEvents() { return load(KEYS.events, []); },
  saveEvents(list) { save(KEYS.events, list); },
  addEvent(event) {
    const list = this.getEvents();
    const newEvent = { ...event, id: `evt-${Date.now()}`, createdAt: new Date().toISOString() };
    list.push(newEvent);
    save(KEYS.events, list);
    return newEvent;
  },
  updateEvent(id, updates) {
    const list = this.getEvents();
    const idx = list.findIndex(e => e.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    save(KEYS.events, list);
    return list[idx];
  },
  deleteEvent(id) {
    const list = this.getEvents().filter(e => e.id !== id);
    save(KEYS.events, list);
  },

  // --- Stats ---
  getStats() {
    const businesses = this.getBusinesses();
    return {
      total: businesses.length,
      active: businesses.filter(b => b.status === 'active').length,
      vip: businesses.filter(b => b.isFeatured && b.status === 'active').length,
      pending: businesses.filter(b => b.status === 'pending').length,
      rejected: businesses.filter(b => b.status === 'rejected').length,
      categories: this.getCategories().filter(c => c.active).length,
      zones: this.getZones().length,
    };
  },

  // --- Reset ---
  resetToDefaults() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  },
};

export default adminStore;
