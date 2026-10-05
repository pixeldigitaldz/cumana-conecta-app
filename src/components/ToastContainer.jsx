import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Check,
  Copy,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const TOAST_ICONS = {
  favorite: {
    icon: Heart,
    iconClass: 'text-rose-500 fill-rose-500',
    badgeClass: 'bg-rose-500/10 border-rose-500/20',
    barColor: '#f43f5e',
  },
  unfavorite: {
    icon: Heart,
    iconClass: 'text-slate-400',
    badgeClass: 'bg-slate-500/10 border-slate-500/20',
    barColor: '#94a3b8',
  },
  copy: {
    icon: Check,
    iconClass: 'text-emerald-400 stroke-[2.5]',
    badgeClass: 'bg-emerald-500/10 border-emerald-500/20',
    barColor: '#10b981',
  },
  success: {
    icon: CheckCircle2,
    iconClass: 'text-teal-400',
    badgeClass: 'bg-teal-500/10 border-teal-500/20',
    barColor: '#14b8a6',
  },
  info: {
    icon: Sparkles,
    iconClass: 'text-amber-400 fill-amber-400',
    badgeClass: 'bg-amber-500/10 border-amber-500/20',
    barColor: '#f59e0b',
  },
  error: {
    icon: AlertCircle,
    iconClass: 'text-rose-500',
    badgeClass: 'bg-rose-500/10 border-rose-500/20',
    barColor: '#ef4444',
  },
};

export default function ToastContainer({ toasts = [], onDismiss }) {
  const { isDark } = useTheme();

  return (
    <div
      className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-[calc(100vw-2rem)] w-[360px] pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const config = TOAST_ICONS[toast.type] || TOAST_ICONS.info;
          const IconComponent = config.icon;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -16, transition: { duration: 0.18 } }}
              transition={{ type: 'spring', damping: 26, stiffness: 360 }}
              className={`pointer-events-auto relative overflow-hidden rounded-2xl p-3.5 sm:p-4 border shadow-2xl backdrop-blur-md transition-colors ${
                isDark
                  ? 'bg-[#181a20]/95 border-[#2c2f3a] text-white shadow-black/60'
                  : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/60'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon Badge */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 mt-0.5 shadow-2xs ${config.badgeClass}`}
                >
                  <IconComponent size={18} className={config.iconClass} />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0 pr-1">
                  {toast.title && (
                    <h5
                      className={`font-['Outfit'] font-bold text-xs sm:text-sm leading-tight tracking-tight ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {toast.title}
                    </h5>
                  )}
                  {toast.message && (
                    <p
                      className={`font-['Inter'] text-[11px] sm:text-xs leading-relaxed mt-0.5 ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {toast.message}
                    </p>
                  )}
                </div>

                {/* Dismiss button */}
                <button
                  type="button"
                  onClick={() => onDismiss && onDismiss(toast.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${
                    isDark
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                  aria-label="Cerrar notificación"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Animated Progress bar */}
              {toast.duration > 0 && (
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                  className="absolute bottom-0 left-0 h-[2.5px] rounded-full opacity-80"
                  style={{ backgroundColor: config.barColor }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
