import { useEffect, useState, useCallback } from 'react';
import {
  X,
  PhoneCall,
  Flame,
  Shield,
  HeartPulse,
  Zap,
  Car,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const EMERGENCY_SERVICES = [
  {
    id: 'bomberos',
    name: 'Cuerpo de Bomberos de Cumaná',
    number: '171',
    altNumber: '0293-4312222',
    category: 'Incendios, Rescate & Siniestros',
    icon: Flame,
    colorClass: 'text-rose-500',
    bgClass: 'bg-rose-50',
    darkBgClass: 'bg-[#261316]',
    borderClass: 'border-rose-200',
    darkBorderClass: 'border-[#4c1d24]',
  },
  {
    id: 'proteccion_civil',
    name: 'Protección Civil Edo. Sucre',
    number: '0293-4321234',
    altNumber: '0800-7248450',
    category: 'Desastres Naturales & Lluvias',
    icon: AlertTriangle,
    colorClass: 'text-amber-500',
    bgClass: 'bg-amber-50',
    darkBgClass: 'bg-[#261d0f]',
    borderClass: 'border-amber-200',
    darkBorderClass: 'border-[#5e380e]',
  },
  {
    id: 'ambulancias',
    name: 'SAMU / Central de Ambulancias',
    number: '0800-4287268',
    altNumber: '171',
    category: 'Emergencias Médicas & Traslados',
    icon: HeartPulse,
    colorClass: 'text-emerald-500',
    bgClass: 'bg-emerald-50',
    darkBgClass: 'bg-[#0f261c]',
    borderClass: 'border-emerald-200',
    darkBorderClass: 'border-[#134e35]',
  },
  {
    id: 'policia',
    name: 'Policía del Estado Sucre / Cuadrantes',
    number: '0800-7654242',
    altNumber: '171',
    category: 'Seguridad Ciudadana & Patrullaje',
    icon: Shield,
    colorClass: 'text-sky-400',
    bgClass: 'bg-blue-50',
    darkBgClass: 'bg-[#101e2e]',
    borderClass: 'border-blue-200',
    darkBorderClass: 'border-[#1e3a5f]',
  },
  {
    id: 'corpoelec',
    name: 'CORPOELEC Cumaná / Averías',
    number: '0800-2677635',
    altNumber: '0293-4301111',
    category: 'Fallas Eléctricas & Transformadores',
    icon: Zap,
    colorClass: 'text-yellow-400',
    bgClass: 'bg-yellow-50',
    darkBgClass: 'bg-[#26220f]',
    borderClass: 'border-yellow-200',
    darkBorderClass: 'border-[#5e4e0e]',
  },
  {
    id: 'transito',
    name: 'Tránsito Terrestre & Accidentes',
    number: '0293-4320000',
    altNumber: '171',
    category: 'Vialidad, Choques & Remolques',
    icon: Car,
    colorClass: 'text-indigo-400',
    bgClass: 'bg-indigo-50',
    darkBgClass: 'bg-[#18152b]',
    borderClass: 'border-indigo-200',
    darkBorderClass: 'border-[#312a59]',
  },
];

/**
 * Módulo de Números de Emergencia de Cumaná
 * Botón Flotante Inferior Derecho y Modal de Llamadas de Emergencia.
 */
export default function EmergencyFooter({ isOpen, onClose }) {
  const { isDark } = useTheme();
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    if (isClosing || !onClose) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 240);
  }, [isClosing, onClose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity ${
          isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`relative w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border z-10 transition-colors duration-300 ${
          isDark
            ? 'bg-[#18191d] border-[#2b2d35] text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        } ${isClosing ? 'animate-modal-out' : 'animate-modal-in'}`}
      >
        {/* Header del Modal */}
        <div className="bg-[#ba1a1a] text-white p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
              <Radio size={22} className="animate-pulse" />
            </div>
            <div>
              <h2 id="emergency-modal-title" className="font-['Outfit'] font-bold text-lg leading-tight">
                Directorio de Emergencias
              </h2>
              <p className="text-xs text-red-100 mt-0.5 font-['Inter']">
                Cumaná · Estado Sucre, Venezuela
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Cerrar ventana de emergencias"
          >
            <X size={19} />
          </button>
        </div>

        {/* Alerta Institucional */}
        <div className={`p-4 border-b text-xs flex items-start gap-2.5 font-['Inter'] ${
          isDark
            ? 'bg-[#261d0f] border-[#5e380e] text-amber-200'
            : 'bg-amber-50 border-amber-200 text-amber-950'
        }`}>
          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Toca cualquier botón para <strong>llamar de inmediato</strong> desde tu dispositivo móvil. Mantén la calma y proporciona tu dirección exacta en Cumaná al operador.
          </p>
        </div>

        {/* Lista de Servicios */}
        <div className="p-4 sm:p-5 overflow-y-auto custom-scrollbar space-y-3 flex-1 font-['Inter']">
          {EMERGENCY_SERVICES.map((srv) => {
            const IconComponent = srv.icon;
            const cleanPhone = srv.number.replace(/[^0-9]/g, '');

            return (
              <div
                key={srv.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                  isDark
                    ? `${srv.darkBgClass} ${srv.darkBorderClass}`
                    : `${srv.bgClass} ${srv.borderClass}`
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg shadow-sm flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-[#18191d]' : 'bg-white'
                  } ${srv.colorClass}`}>
                    <IconComponent size={20} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {srv.name}
                    </h3>
                    <p className={`text-xs font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {srv.category}
                    </p>
                    {srv.altNumber && (
                      <span className="text-[11px] text-slate-500 block">
                        Alt: {srv.altNumber}
                      </span>
                    )}
                  </div>
                </div>

                <a
                  href={`tel:${cleanPhone}`}
                  className="h-10 px-3.5 rounded-lg bg-[#ba1a1a] hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm active:scale-95 flex-shrink-0"
                  aria-label={`Llamar a ${srv.name}`}
                >
                  <PhoneCall size={14} />
                  <span>{srv.number}</span>
                </a>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t text-center text-xs font-['Inter'] ${
          isDark
            ? 'bg-[#121316] border-[#252830] text-slate-400'
            : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          Servicio público y comunitario provisto por <strong>CumanáConecta</strong>.
        </div>

      </div>
    </div>
  );
}

