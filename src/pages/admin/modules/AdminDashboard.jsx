import { useEffect, useState, useRef } from 'react';
import {
  Building2, Star, Clock, CheckCircle2, XCircle, LayoutGrid,
  MapPin, TrendingUp, ChevronRight, ThumbsUp, ThumbsDown
} from 'lucide-react';
import adminStore from '../../../store/adminStore.js';
import CommercialRadiography from './CommercialRadiography.jsx';

/* ─── Animated counter ─── */
function useCountUp(target, duration = 800) {
  const [count, setCount] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return count;
}

/* ─── Stat Card — light theme ─── */
function StatCard({ icon: Icon, label, value, color, bg }) {
  const animated = useCountUp(value);
  return (
    <div
      className="rounded-2xl border p-5 flex items-center gap-4 transition-all duration-200 hover:shadow-md hover:-translate-y-px cursor-default"
      style={{ backgroundColor: '#fff', borderColor: '#e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: bg }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-['Outfit'] font-black text-slate-900 leading-none">{animated}</p>
        <p className="text-xs text-slate-500 font-['Inter'] mt-1 font-medium">{label}</p>
      </div>
    </div>
  );
}

/* ─── Pending Row — light theme ─── */
function PendingRow({ biz, onApprove, onReject }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-slate-50 border border-transparent hover:border-slate-100">
      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
        {biz.logoUrl && (biz.logoUrl.startsWith('http') || biz.logoUrl.startsWith('/')) ? (
          <img src={biz.logoUrl} alt="" className="w-full h-full object-cover" />
        ) : biz.logoUrl ? (
          biz.logoUrl
        ) : (
          <span className="text-xs font-bold text-slate-500">{biz.name ? biz.name.slice(0, 2).toUpperCase() : 'CC'}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate font-['Inter']">{biz.name}</p>
        <p className="text-[11px] text-slate-400 font-['Inter'] mt-0.5 truncate">
          {biz.zone} · {biz.categoryLabel || biz.category}
        </p>
      </div>
      <div className="flex gap-1.5 flex-shrink-0">
        <button
          onClick={() => onApprove(biz.id)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-white cursor-pointer transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: '#16a34a' }}
        >
          <ThumbsUp size={10} /> Aprobar
        </button>
        <button
          onClick={() => onReject(biz.id)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-white cursor-pointer transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: '#dc2626' }}
        >
          <ThumbsDown size={10} /> Rechazar
        </button>
      </div>
    </div>
  );
}

/* ─── Stat definitions ─── */
function buildStatCards(stats, searchCount) {
  return [
    { icon: Building2,    label: 'Total Comercios',   value: stats.total,      color: '#005f73', bg: '#e0f2f1' },
    { icon: Star,         label: 'Comercios VIP',     value: stats.vip,        color: '#d97706', bg: '#fef3c7' },
    { icon: Clock,        label: 'Pendientes',        value: stats.pending,    color: '#7c3aed', bg: '#ede9fe' },
    { icon: CheckCircle2, label: 'Activos',           value: stats.active,     color: '#16a34a', bg: '#dcfce7' },
    { icon: LayoutGrid,   label: 'Categorías',        value: stats.categories, color: '#0284c7', bg: '#e0f2fe' },
    { icon: MapPin,       label: 'Zonas',             value: stats.zones,      color: '#db2777', bg: '#fce7f3' },
    { icon: XCircle,      label: 'Rechazados',        value: stats.rejected,   color: '#dc2626', bg: '#fee2e2' },
    { icon: TrendingUp,   label: 'Búsquedas Config.', value: searchCount,      color: '#059669', bg: '#d1fae5' },
  ];
}

/* ─── Main Dashboard ─── */
export default function AdminDashboard({ onNavigate }) {
  const [stats, setStats] = useState({ total: 0, active: 0, vip: 0, pending: 0, rejected: 0, categories: 0, zones: 0 });
  const [pending, setPending] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchCount, setSearchCount] = useState(0);

  const loadData = () => {
    setStats(adminStore.getStats());
    const bizList = adminStore.getBusinesses();
    setBusinesses(bizList);
    setPending(bizList.filter((b) => b.status === 'pending').slice(0, 5));
    setCategories(adminStore.getCategories());
    setSearchCount(adminStore.getSearches().length);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = (id) => {
    adminStore.approveBusiness(id);
    loadData();
  };

  const handleReject = (id) => {
    adminStore.rejectBusiness(id);
    loadData();
  };

  const statCards = buildStatCards(stats, searchCount);

  return (
    <div className="space-y-6 font-['Inter']">

      {/* ── Header ── */}
      <div>
        <h2 className="font-['Outfit'] font-bold text-2xl text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-500 mt-0.5">Vista general de CumanáConecta</p>
      </div>

      {/* ── 8 Overview KPI Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* ── Radiografía Comercial de Cumaná (Recharts Analytics) ── */}
      <CommercialRadiography
        businesses={businesses}
        categories={categories}
        onNavigate={onNavigate}
      />

      {/* ── Solicitudes Pendientes de Aprobación ── */}
      <div
        className="rounded-3xl border bg-white p-6"
        style={{ borderColor: '#e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#ede9fe' }}>
              <Clock size={16} style={{ color: '#7c3aed' }} />
            </div>
            <div>
              <h3 className="font-['Outfit'] font-bold text-base text-slate-900">
                Pendientes de Aprobación
              </h3>
              <p className="text-xs text-slate-400 font-['Inter']">Solicitudes de registro de comercios nuevos</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('businesses')}
            className="text-xs font-semibold flex items-center gap-1 hover:gap-1.5 transition-all cursor-pointer text-[#00a896]"
          >
            Ver todos los comercios <ChevronRight size={13} />
          </button>
        </div>

        {pending.length === 0 ? (
          <div className="text-center py-8 bg-slate-50/60 rounded-2xl border border-slate-100/80">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center mx-auto mb-2"
              style={{ backgroundColor: '#dcfce7' }}
            >
              <CheckCircle2 size={20} style={{ color: '#16a34a' }} />
            </div>
            <p className="text-sm font-semibold text-slate-700 font-['Outfit']">Sin solicitudes pendientes</p>
            <p className="text-xs text-slate-400 mt-0.5">Todo al día ✓</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {pending.map((biz) => (
              <PendingRow key={biz.id} biz={biz} onApprove={handleApprove} onReject={handleReject} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
