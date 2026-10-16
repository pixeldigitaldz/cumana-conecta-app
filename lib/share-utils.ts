import { Business } from '@/types/business';

/**
 * Retorna la URL canónica limpia de la ficha del comercio
 */
export function getCleanBusinessUrl(slug: string): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/local/${slug}`;
  }
  return `https://cumanaconecta.com/local/${slug}`;
}

/**
 * Formatea los métodos de pago destacando Cashea si aplica
 */
export function formatExecutivePaymentMethods(business: Business): string {
  const methods: string[] = [];
  
  if (business.acceptsCashea || business.paymentMethods?.includes('cashea')) {
    methods.push('Cashea (Cuotas sin interés)');
  }
  
  const paymentLabels: Record<string, string> = {
    pago_movil: 'Pago Móvil',
    tarjeta_debito: 'Punto de Venta / Débito',
    punto_de_venta: 'Punto de Venta',
    efectivo_usd: 'Dólares en Efectivo',
    efectivo_bs: 'Bolívares en Efectivo',
    zelle: 'Zelle',
    binance: 'Binance USDT',
  };

  if (Array.isArray(business.paymentMethods)) {
    for (const m of business.paymentMethods) {
      if (m !== 'cashea' && paymentLabels[m] && !methods.includes(paymentLabels[m])) {
        methods.push(paymentLabels[m]);
      }
    }
  }

  if (methods.length === 0) {
    methods.push('Pago Móvil', 'Punto de Venta', 'Efectivo');
  }

  return methods.join(', ');
}

/**
 * Formatea la ficha para compartir en formato ejecutivo y profesional
 */
export function formatExecutiveShareText(business: Business): string {
  const nameUpper = (business.name || 'COMERCIO').trim();
  const cleanUrl = getCleanBusinessUrl(business.slug);
  return `${nameUpper} en CumanáConecta — ${cleanUrl}`;
}

/**
 * Ejecuta el compartir nativo de dispositivo o copia la URL limpia directa al portapapeles
 */
export async function shareBusinessExecutive(
  business: Business
): Promise<{ success: boolean; method: 'share' | 'clipboard' }> {
  const url = getCleanBusinessUrl(business.slug);

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: `${business.name} — CumanáConecta`,
        text: `Ficha oficial de ${business.name} en CumanáConecta:`,
        url: url,
      });
      return { success: true, method: 'share' };
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return { success: false, method: 'share' };
      }
    }
  }

  // Fallback seguro a Clipboard: COPIAR SOLO LA URL DIRECTA
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      return { success: true, method: 'clipboard' };
    } else if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return { success: true, method: 'clipboard' };
    }
  } catch {
    return { success: false, method: 'clipboard' };
  }

  return { success: false, method: 'clipboard' };
}
