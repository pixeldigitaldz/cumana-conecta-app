/**
 * Utilidades para cálculo de horarios de atención y estado en tiempo real (Abierto / Cerrado)
 * de locales comerciales en Cumaná, Estado Sucre (Zona horaria: America/Caracas UTC-4).
 */

/**
 * Obtiene los minutos transcurridos desde la medianoche (0 - 1439) en la hora oficial de Venezuela.
 */
export function getCaracasCurrentMinutes(): number {
  if (typeof window === 'undefined') {
    // Evitar invocar new Date() durante el prerender/SSR de Next.js
    return 12 * 60; // 12:00 PM por defecto en prerender
  }
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Caracas',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    let hours = 0;
    let minutes = 0;
    for (const part of parts) {
      if (part.type === 'hour') hours = parseInt(part.value, 10);
      if (part.type === 'minute') minutes = parseInt(part.value, 10);
    }
    if (hours === 24) hours = 0;
    return hours * 60 + minutes;
  } catch {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }
}

/**
 * Convierte una cadena de hora (ej: "7:00", "07:00", "20:00", "8:00 AM", "6:00 PM") a minutos desde medianoche.
 */
export function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr) return null;
  const clean = timeStr.trim().toUpperCase();
  const match = clean.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const modifier = match[3];

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  return hours * 60 + minutes;
}

/**
 * Determina si el texto de horario corresponde a un local 24/7 (24 Horas).
 */
export function is24HoursSchedule(openingHours?: string | null): boolean {
  if (!openingHours) return false;
  const clean = openingHours.trim().toLowerCase();
  return (
    clean.includes('24 horas') ||
    clean.includes('24/7') ||
    clean.includes('24horas') ||
    clean.includes('24h') ||
    clean.includes('24 hrs') ||
    clean.includes('24 hr')
  );
}

/**
 * Determina si un local está abierto en el momento actual (o en unos minutos específicos dados).
 */
export function isBusinessOpen(openingHours?: string | null, customMinutes?: number): boolean {
  if (!openingHours) return true; // Si no tiene horario especificado, se asume disponible

  // Los que trabajan 24/7 siempre saldrán como abiertos
  if (is24HoursSchedule(openingHours)) {
    return true;
  }

  // Durante prerender / SSR pass en Next.js, devolver true de forma estable sin invocar new Date()
  if (customMinutes === undefined && typeof window === 'undefined') {
    return true;
  }

  // Limpiar prefijos habituales ("de lunes a domingo:", "de ", etc.)
  const stripped = openingHours
    .replace(/^(?:lunes a [a-z]+:?|de\s+)/i, '')
    .trim();

  // Separar hora inicial y final por guión o palabras de rango
  const parts = stripped.split(/\s*[-–—]|(?:\s+a\s+)|\s+to\s+|\s+hasta\s+/i);
  if (parts.length < 2) return true;

  const startMin = parseTimeToMinutes(parts[0]);
  const endMin = parseTimeToMinutes(parts[1]);

  if (startMin === null || endMin === null) return true;

  const currentMin = customMinutes !== undefined ? customMinutes : getCaracasCurrentMinutes();

  // Rango diurno habitual (ej: 07:00 a 20:00 -> 420 a 1200 minutos)
  if (startMin <= endMin) {
    return currentMin >= startMin && currentMin <= endMin;
  } else {
    // Rango nocturno cruzando medianoche (ej: 20:00 a 03:00 -> de noche hasta la madrugada)
    return currentMin >= startMin || currentMin <= endMin;
  }
}

/**
 * Retorna etiquetas y estilos descriptivos del estado actual del local.
 */
export function getBusinessStatusInfo(openingHours?: string | null, customMinutes?: number) {
  const is24h = is24HoursSchedule(openingHours);
  const isOpen = isBusinessOpen(openingHours, customMinutes);

  if (is24h) {
    return {
      isOpen: true,
      is24Hours: true,
      label: '24/7 Abierto',
      shortLabel: 'Abierto 24H',
      badgeClass: 'bg-emerald-600/90 text-white border-emerald-400/50',
      badgeDot: 'bg-emerald-400',
      statusText: 'Abierto las 24 Horas',
      cardBadge: '● 24/7 Abierto'
    };
  }

  if (isOpen) {
    return {
      isOpen: true,
      is24Hours: false,
      label: 'Abierto',
      shortLabel: 'Abierto',
      badgeClass: 'bg-emerald-600/90 text-white border-emerald-400/50',
      badgeDot: 'bg-emerald-400',
      statusText: 'Abierto y Operando',
      cardBadge: '● Abierto'
    };
  }

  return {
    isOpen: false,
    is24Hours: false,
    label: 'Cerrado',
    shortLabel: 'Cerrado',
    badgeClass: 'bg-red-600/90 text-white border-red-400/50',
    badgeDot: 'bg-red-400',
    statusText: 'Cerrado por ahora',
    cardBadge: '○ Cerrado'
  };
}

/**
 * Formatea una hora en formato militar/24h (ej: "07:00", "20:00", "13:30") a formato 12 horas con AM/PM (ej: "7:00 AM", "8:00 PM", "1:30 PM").
 * Si ya tiene AM o PM, lo limpia y unifica.
 */
export function formatTimeTo12h(timeStr: string): string {
  if (!timeStr) return '';
  const clean = timeStr.trim().toUpperCase();
  const match = clean.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/);
  if (!match) return timeStr;

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? match[2] : '00';
  const modifier = match[3];

  let period = 'AM';

  if (modifier) {
    period = modifier;
    if (hours === 0) hours = 12;
    if (hours > 12) hours = hours % 12 || 12;
  } else {
    // Es formato militar de 24 horas (ej. 20:00 -> 8:00 PM, 13:00 -> 1:00 PM, 00:00 -> 12:00 AM)
    if (hours >= 12) {
      period = 'PM';
      if (hours > 12) hours -= 12;
    } else {
      period = 'AM';
      if (hours === 0) hours = 12;
    }
  }

  return `${hours}:${minutes} ${period}`;
}

/**
 * Convierte cualquier horario almacenado (incluso de 24h como "07:00 a 20:00") a formato legible de 12 horas (ej: "7:00 AM a 8:00 PM").
 */
export function formatSchedule12h(openingHours?: string | null): string {
  if (!openingHours) return '';
  if (is24HoursSchedule(openingHours)) {
    return '24 Horas';
  }

  // Comprobar si tiene separadores de rango (" a ", " - ", " – ")
  const parts = openingHours.split(/\s*[-–—]|\s+a\s+|\s+hasta\s+/i);
  if (parts.length >= 2) {
    const formattedStart = formatTimeTo12h(parts[0].trim());
    const formattedEnd = formatTimeTo12h(parts[1].trim());
    if (formattedStart && formattedEnd) {
      return `${formattedStart} a ${formattedEnd}`;
    }
  }

  return openingHours;
}

/**
 * Formatea horario de apertura y cierre a una cadena uniforme legible en formato 12 horas AM/PM.
 */
export function formatOpeningHours(openTime: string, closeTime: string, is24h: boolean): string {
  if (is24h) {
    return '24 Horas';
  }
  const cleanOpen = formatTimeTo12h(openTime.trim() || '07:00');
  const cleanClose = formatTimeTo12h(closeTime.trim() || '20:00');
  return `${cleanOpen} a ${cleanClose}`;
}
