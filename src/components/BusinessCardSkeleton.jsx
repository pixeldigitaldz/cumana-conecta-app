/**
 * BusinessCardSkeleton — Skeleton screen con efecto shimmer y pulso suave
 * Replica exactamente la morfología de las tarjetas de negocio de CumanáConecta
 * para mejorar la percepción de velocidad en conexiones lentas o móviles.
 */
export default function BusinessCardSkeleton({ viewMode = 'grid' }) {
  if (viewMode === 'list') {
    return (
      <div
        className="relative flex flex-col md:flex-row overflow-hidden bg-white rounded-2xl border border-slate-200/80 shadow-xs animate-pulse"
        aria-hidden="true"
      >
        {/* Banner horizontal */}
        <div className="relative h-48 md:h-auto md:w-72 flex-shrink-0 bg-slate-200 shimmer">
          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-2">
            <div className="w-32 h-5 rounded-md bg-slate-300/80" />
            <div className="w-20 h-5 rounded-md bg-slate-300/80" />
          </div>
          <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between gap-2">
            <div className="w-24 h-4 rounded-md bg-slate-300/80" />
            <div className="w-14 h-4 rounded-md bg-slate-300/80 ml-auto" />
          </div>
        </div>

        {/* Contenido en Lista */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
          <div className="space-y-3">
            {/* Header: Thumbnail + Nombre + Descripción */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-200 shimmer flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-3/5 rounded bg-slate-200 shimmer" />
                <div className="h-3.5 w-4/5 rounded bg-slate-100 shimmer" />
              </div>
            </div>

            {/* Barra de Ubicación */}
            <div className="h-7 w-full rounded-lg bg-slate-100 shimmer" />
          </div>

          {/* Formas de Pago & Botones */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <div className="w-14 h-5 rounded bg-slate-100 shimmer" />
              <div className="w-16 h-5 rounded bg-slate-100 shimmer" />
              <div className="w-12 h-5 rounded bg-slate-100 shimmer" />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-24 h-9 rounded-xl bg-slate-200 shimmer" />
              <div className="w-24 h-9 rounded-xl bg-slate-100 shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Modo Cuadrícula (Grid) ───
  return (
    <div
      className="relative flex flex-col overflow-hidden bg-white rounded-2xl border border-slate-200/80 shadow-xs animate-pulse"
      aria-hidden="true"
    >
      {/* Banner Superior con Badges en las 4 esquinas */}
      <div className="relative h-48 w-full bg-slate-200 shimmer overflow-hidden">
        {/* Badges Superiores */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-2">
          <div className="w-36 h-5 rounded-md bg-slate-300/80" />
          <div className="w-20 h-5 rounded-md bg-slate-300/80" />
        </div>

        {/* Badges Inferiores */}
        <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between gap-2">
          <div className="w-28 h-5 rounded-md bg-slate-300/80" />
          <div className="w-14 h-5 rounded-md bg-slate-300/80 ml-auto" />
        </div>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-3">
          
          {/* Fila Header: Thumbnail + Nombre + Tagline */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-200 shimmer flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-0.5">
              <div className="h-5 w-4/6 rounded bg-slate-200 shimmer" />
              <div className="h-3.5 w-5/6 rounded bg-slate-100 shimmer" />
            </div>
          </div>

          {/* Barra de Ubicación */}
          <div className="h-7 w-full rounded-lg bg-slate-100 shimmer" />

          {/* Chips de Pago */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="w-14 h-5 rounded bg-slate-100 shimmer" />
            <div className="w-16 h-5 rounded bg-slate-100 shimmer" />
            <div className="w-12 h-5 rounded bg-slate-100 shimmer" />
            <div className="w-10 h-5 rounded bg-slate-100 shimmer" />
          </div>

        </div>

        {/* Botones Inferiores */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="h-10 rounded-xl bg-slate-200 shimmer" />
          <div className="h-10 rounded-xl bg-slate-100 shimmer" />
        </div>
      </div>
    </div>
  );
}
