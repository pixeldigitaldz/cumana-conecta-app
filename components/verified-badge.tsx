'use client';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  color?: 'blue' | 'emerald';
  className?: string;
}

export function VerifiedBadge({
  size = 'md',
  showText = false,
  color = 'blue',
  className = ''
}: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const colorFill = color === 'blue' ? 'text-[#0095F6]' : 'text-[#00C292]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 align-middle select-none group cursor-pointer ${className}`}
      title="Comercio Verificado Oficial · Cumaná Conecta (Autenticidad y fidelidad garantizada)"
    >
      {/* Icono de insignia tipo Instagram / Canales Oficiales (Roseta de 12 puntas con check blanco) */}
      <svg
        viewBox="-1 -1 26 26"
        fill="currentColor"
        className={`${sizeClasses[size]} ${colorFill} shrink-0 overflow-visible drop-shadow-xs transition-transform group-hover:scale-110`}
        aria-label="Verificado Oficial"
      >
        {/* Roseta exterior */}
        <path d="M10.52 1.48a2 2 0 0 1 2.96 0l1.24 1.34a2 2 0 0 0 1.77.62l1.8-.3a2 2 0 0 1 2.3 1.87l.13 1.82a2 2 0 0 0 1.09 1.54l1.63.85a2 2 0 0 1 .92 2.78l-.9 1.6a2 2 0 0 0 0 1.89l.9 1.6a2 2 0 0 1-.92 2.78l-1.63.85a2 2 0 0 0-1.09 1.54l-.13 1.82a2 2 0 0 1-2.3 1.87l-1.8-.3a2 2 0 0 0-1.77.62l-1.24 1.34a2 2 0 0 1-2.96 0l-1.24-1.34a2 2 0 0 0-1.77-.62l-1.8.3a2 2 0 0 1-2.3-1.87l-.13-1.82a2 2 0 0 0-1.09-1.54l-1.63-.85a2 2 0 0 1-.92-2.78l.9-1.6a2 2 0 0 0 0-1.89l-.9-1.6a2 2 0 0 1 .92-2.78l1.63-.85a2 2 0 0 0 1.09-1.54l.13-1.82a2 2 0 0 1 2.3-1.87l1.8.3a2 2 0 0 0 1.77-.62l1.24-1.34z" />
        {/* Checkmark blanco interior */}
        <path
          fill="#ffffff"
          d="M10.02 14.88L6.85 11.7a.85.85 0 0 1 1.2-1.2l2.57 2.58 5.37-5.38a.85.85 0 0 1 1.2 1.2l-5.97 5.98a.85.85 0 0 1-1.2 0z"
        />
      </svg>

      {showText && (
        <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0095F6]/15 text-[#0095F6] border border-[#0095F6]/30 shadow-sm">
          Verificado Oficial
        </span>
      )}
    </span>
  );
}
