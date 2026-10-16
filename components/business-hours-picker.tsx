'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Calendar, Check, AlertCircle, Plus, Trash2, Sparkles } from 'lucide-react';
import { getBusinessStatusInfo } from '@/lib/business-hours';
import { parseScheduleRows } from '@/components/schedule-channels-card';

export interface BusinessHoursPickerProps {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
}

// Lista de horas comunes en formato 12H para apertura y cierre
const TIME_OPTIONS = [
  '5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM',
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
  '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM',
  '11:00 PM', '11:30 PM', '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM'
];

const COMMON_DAY_RANGES = [
  'Lunes a Viernes',
  'Martes a Viernes',
  'Lunes a Sábado',
  'Martes a Sábado',
  'Martes a Domingo',
  'Miércoles a Domingo',
  'Jueves a Domingo',
  'Lunes a Domingo',
  'Fines de Semana'
];

const PRESETS = [
  {
    label: 'Lun a Vie (7 AM a 8 PM) + Sáb (8 AM a 1 PM)',
    schedule: 'Lunes a Viernes: 7:00 AM a 8:00 PM | Sábado: 8:00 AM - 1:00 PM'
  },
  {
    label: 'Lun a Vie (8 AM a 7 PM)',
    schedule: 'Lunes a Viernes: 8:00 AM a 7:00 PM'
  },
  {
    label: 'Mar a Vie (8 AM a 7 PM) + Sáb (8 AM a 2 PM)',
    schedule: 'Martes a Viernes: 8:00 AM a 7:00 PM | Sábado: 8:00 AM a 2:00 PM'
  },
  {
    label: 'Lun a Sáb (8 AM a 6 PM)',
    schedule: 'Lunes a Sábado: 8:00 AM a 6:00 PM'
  },
  {
    label: 'Mar a Dom (8 AM a 10 PM)',
    schedule: 'Martes a Domingo: 8:00 AM a 10:00 PM'
  },
  {
    label: 'Lun a Dom (7 AM a 8 PM)',
    schedule: 'Lunes a Domingo: 7:00 AM a 8:00 PM'
  },
  {
    label: '24 Horas (Siempre Abierto)',
    schedule: '24 Horas'
  }
];

export function BusinessHoursPicker({
  value,
  onChange,
  className = ''
}: BusinessHoursPickerProps) {
  // Estados para el configurador interactivo
  const [primaryDays, setPrimaryDays] = useState('Lunes a Viernes');
  const [primaryOpen, setPrimaryOpen] = useState('8:00 AM');
  const [primaryClose, setPrimaryClose] = useState('7:00 PM');

  const [hasWeekendSegment, setHasWeekendSegment] = useState(false);
  const [weekendDays, setWeekendDays] = useState('Sábado');
  const [weekendOpen, setWeekendOpen] = useState('8:00 AM');
  const [weekendClose, setWeekendClose] = useState('1:00 PM');

  // Estado para modo de edición directa de texto
  const [isManualInput, setIsManualInput] = useState(false);

  // Inicializar estados a partir del valor existente si contiene pipes o días
  useEffect(() => {
    if (!value) return;
    if (value.toLowerCase().includes('24')) return;

    if (value.includes('|')) {
      const parts = value.split('|').map(p => p.trim());
      if (parts[0]) {
        const seg1 = parts[0];
        const colonIdx = seg1.indexOf(':');
        if (colonIdx > -1) {
          setPrimaryDays(seg1.slice(0, colonIdx).trim());
          const hours = seg1.slice(colonIdx + 1).trim();
          extractHours(hours, setPrimaryOpen, setPrimaryClose);
        }
      }
      if (parts[1]) {
        const seg2 = parts[1];
        setHasWeekendSegment(true);
        const colonIdx = seg2.indexOf(':');
        if (colonIdx > -1) {
          setWeekendDays(seg2.slice(0, colonIdx).trim());
          const hours = seg2.slice(colonIdx + 1).trim();
          extractHours(hours, setWeekendOpen, setWeekendClose);
        }
      }
    } else if (value.includes(':')) {
      const colonIdx = value.indexOf(':');
      setPrimaryDays(value.slice(0, colonIdx).trim());
      const hours = value.slice(colonIdx + 1).trim();
      extractHours(hours, setPrimaryOpen, setPrimaryClose);
    }
  }, []);

  function extractHours(hoursStr: string, setOpen: (s: string) => void, setClose: (s: string) => void) {
    const parts = hoursStr.split(/\s*[-–—]|(?:\s+a\s+)|\s+to\s+|\s+hasta\s+/i);
    if (parts.length >= 2) {
      const o = parts[0].trim().toUpperCase();
      const c = parts[1].trim().toUpperCase();
      if (TIME_OPTIONS.includes(o)) setOpen(o);
      if (TIME_OPTIONS.includes(c)) setClose(c);
    }
  }

  // Actualizar el valor compuesto cuando cambian los controles
  const handleUpdateBuilder = (
    pDays = primaryDays,
    pOpen = primaryOpen,
    pClose = primaryClose,
    hasWk = hasWeekendSegment,
    wDays = weekendDays,
    wOpen = weekendOpen,
    wClose = weekendClose
  ) => {
    let result = `${pDays}: ${pOpen} a ${pClose}`;
    if (hasWk) {
      result += ` | ${wDays}: ${wOpen} - ${wClose}`;
    }
    onChange(result);
  };

  // Información de estado en tiempo real (Cumaná)
  const statusInfo = useMemo(() => {
    return getBusinessStatusInfo(value);
  }, [value]);

  // Desglose de filas parseadas para vista previa idéntica a la pública
  const previewRows = useMemo(() => {
    return parseScheduleRows(value);
  }, [value]);

  return (
    <div className={`space-y-4 rounded-2xl bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#1e2533] p-4 sm:p-5 ${className}`}>
      {/* 1. Cabecera con Estatus de Apertura en Vivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-200 dark:border-[#1e2533]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-500 shrink-0">
            <Clock className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Configurador Flexible de Horarios</span>
              <span className="text-[10px] text-amber-500 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Lunes a Domingo
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Define días hábiles, fines de semana y franjas de apertura y cierre exactas
            </p>
          </div>
        </div>

        {/* Estatus en vivo según la hora de Cumaná */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-black border flex items-center gap-1.5 shadow-xs ${
              statusInfo.isOpen
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${statusInfo.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span>{statusInfo.cardBadge} en Cumaná</span>
          </span>
        </div>
      </div>

      {/* 2. Atajos Rápidos de 1 Clic (Presets) */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Plantillas Frecuentes en Cumaná (1 clic):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => {
            const isSelected = value.trim() === p.schedule.trim();
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  onChange(p.schedule);
                  // sincronizar builder si aplica
                  if (p.schedule.includes('|')) {
                    const parts = p.schedule.split('|');
                    const c1 = parts[0].indexOf(':');
                    if (c1 > -1) {
                      setPrimaryDays(parts[0].slice(0, c1).trim());
                      extractHours(parts[0].slice(c1 + 1), setPrimaryOpen, setPrimaryClose);
                    }
                    const c2 = parts[1].indexOf(':');
                    if (c2 > -1) {
                      setHasWeekendSegment(true);
                      setWeekendDays(parts[1].slice(0, c2).trim());
                      extractHours(parts[1].slice(c2 + 1), setWeekendOpen, setWeekendClose);
                    }
                  } else if (p.schedule.includes(':')) {
                    const c1 = p.schedule.indexOf(':');
                    setPrimaryDays(p.schedule.slice(0, c1).trim());
                    extractHours(p.schedule.slice(c1 + 1), setPrimaryOpen, setPrimaryClose);
                    setHasWeekendSegment(false);
                  }
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm scale-[1.02]'
                    : 'bg-white dark:bg-[#161c26] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#242c3d] hover:border-amber-400/50'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Selector Interactivo de Días y Horas */}
      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-[#1e2533]">
        {/* Franja Principal (ej: Lunes a Viernes o Martes a Viernes) */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#131924] border border-slate-200 dark:border-[#222a3b] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              1. Días Principales y Horario Regular
            </span>
            <span className="text-[10px] text-slate-400">Jornada habitual</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Días */}
            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Días de Operación:
              </label>
              <select
                value={primaryDays}
                onChange={(e) => {
                  setPrimaryDays(e.target.value);
                  handleUpdateBuilder(e.target.value, primaryOpen, primaryClose, hasWeekendSegment, weekendDays, weekendOpen, weekendClose);
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#242c3d] rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
              >
                {COMMON_DAY_RANGES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Hora de Apertura */}
            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Hora de Apertura:
              </label>
              <select
                value={primaryOpen}
                onChange={(e) => {
                  setPrimaryOpen(e.target.value);
                  handleUpdateBuilder(primaryDays, e.target.value, primaryClose, hasWeekendSegment, weekendDays, weekendOpen, weekendClose);
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#242c3d] rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 font-mono"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Hora de Cierre */}
            <div>
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Hora de Cierre:
              </label>
              <select
                value={primaryClose}
                onChange={(e) => {
                  setPrimaryClose(e.target.value);
                  handleUpdateBuilder(primaryDays, primaryOpen, e.target.value, hasWeekendSegment, weekendDays, weekendOpen, weekendClose);
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#242c3d] rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 font-mono"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Franja Adicional / Fines de Semana (Sábados y Domingos) */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#131924] border border-slate-200 dark:border-[#222a3b] space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasWeekendSegment}
                onChange={(e) => {
                  setHasWeekendSegment(e.target.checked);
                  handleUpdateBuilder(primaryDays, primaryOpen, primaryClose, e.target.checked, weekendDays, weekendOpen, weekendClose);
                }}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 focus:ring-offset-0 border-slate-300 dark:border-slate-600 cursor-pointer"
              />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                2. ¿Horario Diferente en Fin de Semana? (Sábado / Domingo)
              </span>
            </label>
            <span className="text-[10px] text-amber-500 font-bold">
              {hasWeekendSegment ? 'Activado' : 'Opcional'}
            </span>
          </div>

          {hasWeekendSegment && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 dark:border-[#1e2533] animate-in fade-in duration-150">
              {/* Días fin de semana */}
              <div>
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Día / Jornada:
                </label>
                <select
                  value={weekendDays}
                  onChange={(e) => {
                    setWeekendDays(e.target.value);
                    handleUpdateBuilder(primaryDays, primaryOpen, primaryClose, true, e.target.value, weekendOpen, weekendClose);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#242c3d] rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Sábado">Sábado</option>
                  <option value="Domingo">Domingo</option>
                  <option value="Sábado y Domingo">Sábado y Domingo</option>
                  <option value="Fines de Semana">Fines de Semana</option>
                </select>
              </div>

              {/* Hora Apertura */}
              <div>
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Apertura ({weekendDays}):
                </label>
                <select
                  value={weekendOpen}
                  onChange={(e) => {
                    setWeekendOpen(e.target.value);
                    handleUpdateBuilder(primaryDays, primaryOpen, primaryClose, true, weekendDays, e.target.value, weekendClose);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#242c3d] rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 font-mono"
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hora Cierre */}
              <div>
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Cierre ({weekendDays}):
                </label>
                <select
                  value={weekendClose}
                  onChange={(e) => {
                    setWeekendClose(e.target.value);
                    handleUpdateBuilder(primaryDays, primaryOpen, primaryClose, true, weekendDays, weekendOpen, e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0c1017] border border-slate-200 dark:border-[#242c3d] rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 font-mono"
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Campo de Texto Oficial y Modo Manual */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span>Horario Final Guardado (Formato Oficial):</span>
          </label>
          <button
            type="button"
            onClick={() => setIsManualInput(!isManualInput)}
            className="text-[10px] text-amber-500 hover:text-amber-400 font-bold underline cursor-pointer"
          >
            {isManualInput ? 'Ocultar edición manual' : 'Editar texto manualmente'}
          </button>
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ej: Lunes a Viernes: 7:00 AM a 8:00 PM | Sábado: 8:00 AM - 1:00 PM"
          className="w-full px-3.5 py-2.5 bg-white dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white font-mono font-bold focus:outline-none focus:border-amber-400"
        />
        <p className="text-[10px] text-slate-500 dark:text-slate-400">
          💡 Puedes separar varias jornadas con el caracter barra vertical <code className="text-amber-500 font-bold">|</code> (ej. <i>Lunes a Viernes: 8:00 AM a 7:00 PM | Sábado: 8:00 AM - 1:00 PM</i>).
        </p>
      </div>

      {/* 5. Vista Previa Idéntica a la Tarjeta Pública (Referencia del usuario) */}
      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-[#131924] border border-slate-200 dark:border-[#222a3b] space-y-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
          Vista Previa en Ficha Pública del Local:
        </span>
        <div className="bg-white dark:bg-[#0b0e14] rounded-lg p-3 border border-slate-200 dark:border-[#1e2533] space-y-1.5">
          <div className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>HORARIOS Y CANALES OFICIALES</span>
          </div>
          <div className="space-y-1 pl-5">
            {previewRows.map((row, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  • {row.days}
                </span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {row.hours}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
