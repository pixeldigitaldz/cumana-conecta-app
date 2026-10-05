import React from 'react';

/**
 * Componente del logo original oficial de Cashea (PNG transparente sin fondo)
 */
export function CasheaIcon({ className = 'w-4 h-4', size, ...props }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <img
      src="/images/cashea-icon.png"
      alt="Cashea"
      className={`object-contain rounded-xs inline-block ${className}`}
      style={style}
      loading="lazy"
      {...props}
    />
  );
}

export function CasheaLogo({ className = 'h-8', isDark = false, ...props }) {
  return (
    <img
      src={isDark ? '/images/cashea-logo-white.png' : '/images/cashea-logo.png'}
      alt="Cashea"
      className={`object-contain inline-block ${className}`}
      loading="lazy"
      {...props}
    />
  );
}

export default CasheaLogo;
