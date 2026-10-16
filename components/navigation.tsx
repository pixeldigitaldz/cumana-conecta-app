'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sun, 
  Moon,
  Sparkles,
  MapPin,
  ChevronRight,
  Phone,
  PhoneCall,
  ShieldAlert,
  HeartPulse,
  Flame,
  Siren,
  X,
  ExternalLink,
  Compass,
  Tag,
  Clock,
  PlusCircle,
  Home,
  Store
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useAppData } from '@/lib/app-data-context';

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { structure, businesses } = useAppData();
  const [bcvRate, setBcvRate] = useState<string>('876,80');
  const [timeStr, setTimeStr] = useState<string>('');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  useEffect(() => {
    // Consultar la tasa oficial diaria del Banco Central de Venezuela
    fetch('https://ve.dolarapi.com/v1/dolares/oficial')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.promedio === 'number') {
          setBcvRate(data.promedio.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        }
      })
      .catch(() => {
        setBcvRate('876,80');
      });

    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('es-VE', {
          timeZone: 'America/Caracas',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  if (pathname === '/censo' || pathname === '/tablet') {
    return null;
  }

  const EMERGENCY_NUMBERS = [
    {
      name: 'VEN 911 (Emergencias Sucre)',
      phone: '911',
      direct: '0293-431-0911',
      desc: 'Central unificada para ambulancias, rescate y seguridad ciudadana 24/7',
      icon: Siren,
      badge: 'Línea Gratuita Nacional'
    },
    {
      name: 'Cuerpo de Bomberos de Cumaná',
      phone: '0293-431-2222',
      direct: '0293-431-1555',
      desc: 'Combate de incendios, rescate acuático, traslados y emergencias',
      icon: Flame,
      badge: 'Estación Central Caigüire'
    },
    {
      name: 'Protección Civil Estado Sucre',
      phone: '0293-431-3333',
      direct: '0293-451-4040',
      desc: 'Gestión de riesgos, lluvias, contingencias costeras y primeros auxilios',
      icon: ShieldAlert,
      badge: 'Sede Principal Cumaná'
    },
    {
      name: 'Hospital Universitario HUAPA',
      phone: '0293-467-1111',
      direct: '0293-467-1122',
      desc: 'Sala de Emergencias de Adultos y Pediatría del Hospital Antonio Patricio de Alcalá',
      icon: HeartPulse,
      badge: 'Emergencias 24 Horas'
    }
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-40">
        {/* 1. TOPBAR SUPERIOR (Architectural Carbon) */}
        <div className="w-full bg-[#08090c] text-slate-300 border-b border-[#181b22] text-xs transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between min-h-[32px] sm:min-h-[36px] py-1 gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
            {/* Lado izquierdo: Ubicación + Badge VE */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <span className="flex items-center gap-1 text-slate-100 text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                <span>Cumaná, Sucre</span>
              </span>
              <span className="font-mono-tabular text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded bg-[#161920] border border-[#252934] text-slate-400 font-bold tracking-wider">
                VE
              </span>
            </div>

            {/* Lado derecho: Botón Emergencias 171 | Reloj VET | Contador ACTIVOS */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
              {/* Botón Emergencias 171 con punto rojo + icono de teléfono */}
              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-200 hover:text-white hover:bg-rose-900/60 text-[10px] sm:text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <PhoneCall className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-300" />
                <span>171 SOS</span>
              </button>

              <span className="text-slate-700/80 hidden xs:inline">|</span>

              {/* Reloj VET */}
              <div className="hidden xs:flex items-center gap-1.5 text-slate-300 text-[10px] sm:text-xs font-mono-tabular whitespace-nowrap">
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                <span>{timeStr || '12:00 m.'} VET</span>
              </div>

              <span className="text-slate-700/80">|</span>

              {/* Contador ACTIVOS en monoespaciado */}
              <div className="inline-flex items-center text-[10px] sm:text-xs font-mono-tabular text-slate-300 font-bold tracking-wider whitespace-nowrap">
                <span>{businesses.length} ACTIVOS</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. BARRA PRINCIPAL DE NAVEGACIÓN */}
        <div className="w-full bg-[#08090c] text-white border-b border-[#181b22] transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-4">
            
            {/* LADO IZQUIERDO: Logo Oficial + CumanáConecta */}
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden flex items-center justify-center shadow-md ring-2 ring-amber-400/40 bg-slate-900 shrink-0 group-hover:scale-105 transition-transform duration-200">
                <img 
                  src="/logo.png?v=3" 
                  alt="Logo Oficial CumanáConecta" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg sm:text-xl font-black text-white font-display tracking-tight leading-none">
                Cumaná<span className="text-amber-400">Conecta</span>
              </span>
            </Link>

            {/* Menú Central de Navegación para pantallas Medianas y Grandes */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  pathname === '/'
                    ? 'bg-[#161920] text-amber-400 border border-[#252934]'
                    : 'text-slate-400 hover:text-white hover:bg-[#161920]'
                }`}
              >
                Descubrir
              </Link>
              <Link
                href="/locales"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === '/locales'
                    ? 'bg-[#161920] text-amber-400 border border-[#252934]'
                    : 'text-slate-400 hover:text-white hover:bg-[#161920]'
                }`}
              >
                <span>Locales en Cumaná</span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[8px] font-mono-tabular font-black">
                  NUEVO
                </span>
              </Link>
              <Link
                href="/planes"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  pathname === '/planes'
                    ? 'bg-[#161920] text-amber-400 border border-[#252934]'
                    : 'text-slate-400 hover:text-white hover:bg-[#161920]'
                }`}
              >
                Planes
              </Link>
            </nav>

            {/* LADO DERECHO: Conmutador Tema + Botón Ámbar "Sumar mi Negocio" */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Conmutador Tema (Sol/Luna) */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-xl border border-[#252934] bg-[#161920] hover:bg-[#1e232d] text-amber-400 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
                )}
              </button>

              {/* Botón Amarillo/Ámbar Sólido: Sumar mi Negocio */}
              <Link
                href="/planes"
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 whitespace-nowrap cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-slate-950 stroke-[2.5] shrink-0" />
                <span className="hidden xs:inline">Sumar mi Negocio</span>
                <span className="xs:hidden">Sumar</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 3. DOCK MÓVIL INFERIOR FIJO: EXPERIENCIA NATIVA PARA TELÉFONOS (MD:HIDDEN) */}
      <div 
        style={{ zIndex: 99990 }}
        className="md:hidden fixed bottom-0 left-0 right-0 bg-[#08090c]/95 backdrop-blur-xl border-t border-[#1e222b] px-2 py-1.5 flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.7)] select-none"
      >
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer active:scale-95 ${
            pathname === '/'
              ? 'text-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-white font-medium'
          }`}
        >
          <Home className={`w-4 h-4 ${pathname === '/' ? 'stroke-[2.6] text-amber-400' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Inicio</span>
        </Link>

        <Link
          href="/locales"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative cursor-pointer active:scale-95 ${
            pathname === '/locales'
              ? 'text-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-white font-medium'
          }`}
        >
          <Store className={`w-4 h-4 ${pathname === '/locales' ? 'stroke-[2.6] text-amber-400' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Locales</span>
          <span className="absolute -top-0.5 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </Link>

        <Link
          href="/planes"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer active:scale-95 ${
            pathname === '/planes'
              ? 'text-amber-400 font-extrabold'
              : 'text-slate-400 hover:text-white font-medium'
          }`}
        >
          <Sparkles className={`w-4 h-4 ${pathname === '/planes' ? 'stroke-[2.6] text-amber-400' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Planes</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsEmergencyModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-rose-400 hover:text-rose-300 transition-all cursor-pointer active:scale-95"
        >
          <ShieldAlert className="w-4 h-4 stroke-[2.2] text-rose-400 animate-pulse" />
          <span className="text-[10px] mt-0.5 tracking-tight font-extrabold text-rose-400">171 SOS</span>
        </button>
      </div>

      {/* Modal de Emergencias */}
      {isEmergencyModalOpen && (
        <div 
          style={{ zIndex: 99999 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-lg bg-[#11141a] border border-[#222630] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#161920] p-4 border-b border-[#252934] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                  <ShieldAlert className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    Directorio de Emergencias • Cumaná
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Líneas de auxilio y seguridad ciudadana en el Estado Sucre
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#11141a] hover:bg-[#222630] text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 divide-y divide-[#222630]">
              {EMERGENCY_NUMBERS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#161920] border border-[#252934] flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    <a
                      href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm shrink-0"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>{item.phone}</span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Footer() {
  const pathname = usePathname();
  const { structure } = useAppData();
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  if (
    pathname === '/censo' || 
    pathname === '/tablet' || 
    pathname?.startsWith('/administracion')
  ) {
    return null;
  }

  const EMERGENCY_NUMBERS = [
    {
      name: 'VEN 911 (Emergencias Sucre)',
      phone: '911',
      direct: '0293-431-0911',
      desc: 'Central unificada para ambulancias, rescate y seguridad ciudadana 24/7',
      icon: Siren,
      badge: 'Línea Gratuita Nacional'
    },
    {
      name: 'Cuerpo de Bomberos de Cumaná',
      phone: '0293-431-2222',
      direct: '0293-431-1555',
      desc: 'Combate de incendios, rescate acuático, traslados y emergencias',
      icon: Flame,
      badge: 'Estación Central Caigüire'
    },
    {
      name: 'Protección Civil Estado Sucre',
      phone: '0293-431-3333',
      direct: '0293-451-4040',
      desc: 'Gestión de riesgos, lluvias, contingencias costeras y primeros auxilios',
      icon: ShieldAlert,
      badge: 'Sede Principal Cumaná'
    },
    {
      name: 'Hospital Universitario HUAPA',
      phone: '0293-467-1111',
      direct: '0293-467-1122',
      desc: 'Sala de Emergencias de Adultos y Pediatría del Hospital Antonio Patricio de Alcalá',
      icon: HeartPulse,
      badge: 'Emergencias 24 Horas'
    },
    {
      name: 'Policía del Estado Sucre (IAPES)',
      phone: '0293-431-5555',
      direct: '0293-431-6111',
      desc: 'Comandancia General de Policía y Patrullaje Cuadrantes de Paz',
      icon: Siren,
      badge: 'Seguridad Estadal'
    },
    {
      name: 'Policía Municipal de Sucre',
      phone: '0293-432-1111',
      direct: '0293-432-1122',
      desc: 'Vigilancia y patrullaje en el Casco Central, Av. Bermúdez y comunidades',
      icon: Siren,
      badge: 'Seguridad Municipal'
    },
    {
      name: 'Cruz Roja Seccional Sucre',
      phone: '0293-431-4444',
      direct: '0293-431-4445',
      desc: 'Atención prehospitalaria, primeros auxilios y banco de sangre',
      icon: HeartPulse,
      badge: 'Sede Cumaná'
    },
    {
      name: 'CICPC Delegación Cumaná',
      phone: '0293-432-2222',
      direct: '0293-432-2111',
      desc: 'Cuerpo de Investigaciones Científicas, Penales y Criminalísticas',
      icon: ShieldAlert,
      badge: 'Denuncias y Delitos'
    }
  ];

  return (
    <footer className="w-full bg-[#081220] dark:bg-[#050C16] border-t border-slate-200 dark:border-[#1E2D45] pt-12 pb-10 text-slate-300 dark:text-[#A0AEC0] text-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BANNER CTA: ¿Tienes un comercio o servicio en Cumaná? */}
        <div className="mb-12 rounded-3xl bg-gradient-to-r from-[#033036] via-[#05434B] to-[#02282D] border border-teal-500/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="space-y-1.5 text-center sm:text-left z-10">
            <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <span>¿Tienes un comercio o servicio en Cumaná?</span>
            </h3>
            <p className="text-xs sm:text-sm text-teal-100/90 font-medium max-w-xl">
              Aparece en los primeros resultados de la ciudad con tu plan VIP y capta más clientes.
            </p>
          </div>

          <Link
            href="/planes"
            className="z-10 px-6 py-3 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-black text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 whitespace-nowrap cursor-pointer"
          >
            Sumar mi Negocio
          </Link>
        </div>

        {/* 3 COLUMNAS DEL FOOTER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* COLUMNA 1: IDENTIDAD */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shadow-md ring-2 ring-[#FF6B4A]/50 bg-white shrink-0">
                <img 
                  src="/logo.png?v=3" 
                  alt="Logo Cumaná Conecta" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-black text-white text-xl tracking-tight">
                Cumaná<span className="text-[#00E5AA]">Conecta</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Plataforma digital de conexión comercial, turística y de servicios para la ciudad de <strong className="text-white">Cumaná, Estado Sucre, Venezuela</strong>. Apoyando el comercio local con pagos en Pago Móvil, divisas y contacto directo.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D1829] border border-slate-700/80 text-[11px] font-semibold text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-[#FF6B4A]" />
              <span>Primogénita del Continente Americano • Fundada en 1515</span>
            </div>
          </div>

          {/* COLUMNA 2: SECTORES POPULARES */}
          <div className="space-y-3">
            <h4 className="text-amber-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 mb-3">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>SECTORES POPULARES</span>
            </h4>

            <div className="space-y-2 text-xs">
              {[
                { name: 'Av. Bermúdez & Centro', zone: 'Av. Bermúdez' },
                { name: 'San Luis & Zona Playera', zone: 'San Luis' },
                { name: 'Casco Histórico Colonial', zone: 'Casco Histórico' },
                { name: 'Marina Plaza & Muelle', zone: 'Puerto Sucre' },
                { name: 'Av. Universidad & Chaimas', zone: 'Av. Universidad' },
              ].map((sector) => (
                <Link
                  key={sector.name}
                  href={`/locales?sector=${encodeURIComponent(sector.zone)}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D1829] hover:bg-[#132238] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all group"
                >
                  <span className="font-semibold">{sector.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* COLUMNA 3: COMERCIOS & SOPORTE + DIRECTORIO DE EMERGENCIAS */}
          <div className="space-y-3">
            <h4 className="text-amber-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 mb-3">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>COMERCIOS & SOPORTE</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              {/* Botón Sumar mi Negocio */}
              <Link
                href="/planes"
                className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:text-amber-300 font-bold transition-all group"
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-sm font-black">+</span>
                  <span>Sumar mi Negocio</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Botón Directorio de Emergencias */}
              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-red-950/40 hover:bg-red-950/60 border border-red-500/30 text-red-400 hover:text-red-300 font-bold transition-all group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-red-400 group-hover:animate-bounce" />
                  <span>Directorio de Emergencias</span>
                </span>
                <PhoneCall className="w-3.5 h-3.5 opacity-80" />
              </button>

              {/* Ficha Informativa Cumaná */}
              <div className="p-3 rounded-xl bg-[#0D1829] border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6B4A]" />
                  <span>Cumaná, Estado Sucre • Venezuela</span>
                </div>
                <p>Plataforma de catálogo comercial independiente.</p>
              </div>
            </div>
          </div>
        </div>

        {/* BARRA INFERIOR CON CRÉDITO A PIXEL DIGITAL DZ */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            © 2026 <strong className="text-slate-400">CumanáConecta</strong> • Hecho con orgullo para la Primogénita del Continente Americano.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-slate-400 font-medium">Creado por</span>
            <a
              href="https://www.pixeldigitaldz.online/links"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00E5AA] hover:text-emerald-300 font-black underline underline-offset-4 decoration-[#00E5AA]/50 hover:decoration-[#00E5AA] transition-all flex items-center gap-1 group"
            >
              <span>Pixel Digital Dz</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400 font-semibold">Estado Sucre • Venezuela</span>
          </div>
        </div>

      </div>

      {/* MODAL DE NÚMEROS DE EMERGENCIA DE CUMANÁ, ESTADO SUCRE */}
      {isEmergencyModalOpen && (
        <div 
          style={{ zIndex: 99999 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-2xl bg-[#08121E] border border-red-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-red-950 via-[#150A0E] to-[#08121E] p-5 border-b border-red-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Directorio de Emergencias • Cumaná
                  </h3>
                  <p className="text-xs text-red-300/90 font-medium">
                    Líneas de auxilio inmediato y seguridad ciudadana en el Estado Sucre
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Listado de Números */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3 divide-y divide-slate-800/80">
              {EMERGENCY_NUMBERS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-white">{item.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-950/60 border border-red-500/30 text-red-300 font-bold">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{item.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <a
                        href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                        className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{item.phone}</span>
                      </a>
                      {item.direct && (
                        <a
                          href={`tel:${item.direct.replace(/[^0-9]/g, '')}`}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                          title="Línea alterna"
                        >
                          {item.direct}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer del Modal */}
            <div className="p-4 bg-[#050C16] border-t border-slate-800 text-center">
              <p className="text-[11px] text-slate-400">
                Ante cualquier contingencia en Cumaná, marca prioritariamente el <strong className="text-red-400 font-black">911</strong> (VEN 911 Sucre) o comunícate con el cuerpo respectivo.
              </p>
            </div>

          </div>
        </div>
      )}
    </footer>
  );
}
