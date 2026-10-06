import { useState, useEffect } from 'react';
import {
  Building2, LayoutDashboard, Store, LayoutGrid, DollarSign,
  MapPin, Phone, Hash, Image, CreditCard, Settings,
  LogOut, Menu, X, ChevronRight, Bell, ExternalLink
} from 'lucide-react';
import { logout, getSession } from '../../store/authStore.js';
import AdminDashboard from './modules/AdminDashboard.jsx';
import AdminBusinesses from './modules/AdminBusinesses.jsx';
import AdminCategories from './modules/AdminCategories.jsx';
import AdminPlans from './modules/AdminPlans.jsx';
import AdminZones from './modules/AdminZones.jsx';
import AdminEmergencies from './modules/AdminEmergencies.jsx';
import AdminSearches from './modules/AdminSearches.jsx';
import AdminBanners from './modules/AdminBanners.jsx';
import AdminPaymentMethods from './modules/AdminPaymentMethods.jsx';
import AdminSettings from './modules/AdminSettings.jsx';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'principal' },
  { id: 'businesses', label: 'Comercios', icon: Store, group: 'contenido' },
  { id: 'categories', label: 'Categorías', icon: LayoutGrid, group: 'contenido' },
  { id: 'zones', label: 'Zonas', icon: MapPin, group: 'contenido' },
  { id: 'plans', label: 'Planes & Precios', icon: DollarSign, group: 'configuracion' },
  { id: 'payment_methods', label: 'Métodos de Pago', icon: CreditCard, group: 'configuracion' },
  { id: 'emergencies', label: 'Emergencias 24h', icon: Phone, group: 'configuracion' },
  { id: 'searches', label: 'Búsquedas Frecuentes', icon: Hash, group: 'configuracion' },
  { id: 'banners', label: 'Banners & Eventos', icon: Image, group: 'configuracion' },
  { id: 'settings', label: 'Configuración', icon: Settings, group: 'sistema' },
];

const GROUP_LABELS = {
  principal: 'Principal',
  contenido: 'Contenido',
  configuracion: 'Configuración',
  sistema: 'Sistema',
};

function SidebarNav({ active, onChange, onLogout, collapsed, onCollapse }) {
  const groups = [...new Set(NAV_ITEMS.map(i => i.group))];

  return (
    <aside
      className="flex flex-col h-full transition-all"
      style={{ backgroundColor: '#0f1623', width: collapsed ? '64px' : '240px' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)', minHeight: '65px' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center p-1 bg-white flex-shrink-0 shadow-xs">
          <img src="/images/cumana-conecta-logo.png" alt="CumanáConecta" className="w-full h-full object-contain" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-['Outfit'] font-bold text-sm text-white truncate">CumanáConecta</p>
            <p className="text-[10px] text-slate-500 font-['Inter']">Panel Admin</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        {groups.map(group => {
          const items = NAV_ITEMS.filter(i => i.group === group);
          return (
            <div key={group}>
              {!collapsed && (
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 mb-1.5 font-['Inter']">
                  {GROUP_LABELS[group]}
                </p>
              )}
              <div className="space-y-0.5">
                {items.map(item => {
                  const Icon = item.icon;
                  const isActive = active === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onChange(item.id)}
                      title={collapsed ? item.label : undefined}
                      className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all cursor-pointer font-['Inter'] text-sm font-medium text-left"
                      style={{
                        backgroundColor: isActive ? 'rgba(0,168,150,0.15)' : 'transparent',
                        color: isActive ? '#00a896' : '#94a3b8',
                      }}
                    >
                      <Icon size={17} className="flex-shrink-0" style={{ color: isActive ? '#00a896' : '#64748b' }} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {!collapsed && isActive && <ChevronRight size={13} className="ml-auto flex-shrink-0" style={{ color: '#00a896' }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <button
          onClick={onLogout}
          title="Cerrar sesión"
          className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition cursor-pointer text-sm font-medium font-['Inter']"
        >
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}

const MODULE_MAP = {
  dashboard: AdminDashboard,
  businesses: AdminBusinesses,
  categories: AdminCategories,
  zones: AdminZones,
  plans: AdminPlans,
  payment_methods: AdminPaymentMethods,
  emergencies: AdminEmergencies,
  searches: AdminSearches,
  banners: AdminBanners,
  settings: AdminSettings,
};

export default function AdminLayout({ onLogout }) {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const session = getSession();

  const ActiveComponent = MODULE_MAP[activeModule] || AdminDashboard;

  const handleNavigate = (moduleId) => {
    setActiveModule(moduleId);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — Desktop */}
      <div className="hidden lg:flex flex-col flex-shrink-0 transition-all" style={{ width: collapsed ? '64px' : '240px' }}>
        <SidebarNav
          active={activeModule}
          onChange={handleNavigate}
          onLogout={handleLogout}
          collapsed={collapsed}
          onCollapse={() => setCollapsed(c => !c)}
        />
      </div>

      {/* Sidebar — Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden flex flex-col transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '240px' }}
      >
        <SidebarNav
          active={activeModule}
          onChange={handleNavigate}
          onLogout={handleLogout}
          collapsed={false}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b bg-white flex-shrink-0" style={{ borderColor: '#e2e8f0', minHeight: '65px' }}>
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition cursor-pointer"
            >
              <Menu size={20} />
            </button>

            {/* Collapse sidebar on desktop */}
            <button
              onClick={() => setCollapsed(c => !c)}
              className="hidden lg:flex p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition cursor-pointer"
              title="Colapsar sidebar"
            >
              {collapsed ? <Menu size={18} /> : <X size={18} />}
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm font-['Inter']">
              <span className="text-slate-400">Admin</span>
              <ChevronRight size={14} className="text-slate-300" />
              <span className="font-semibold text-slate-700">
                {NAV_ITEMS.find(i => i.id === activeModule)?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View site */}
            <a
              href="/"
              onClick={e => {
                e.preventDefault();
                window.history.pushState(null, '', '/' + window.location.search);
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 border border-slate-200 hover:bg-slate-50 transition cursor-pointer font-['Inter']"
            >
              <ExternalLink size={13} /> Ver Sitio
            </a>

            {/* Admin badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#00a896' }}>
                {(session?.username || 'A')[0].toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-slate-700 font-['Inter'] hidden sm:block">
                {session?.username || 'admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Module Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <ActiveComponent
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        </main>
      </div>
    </div>
  );
}
