import { useState, useEffect } from 'react';
import {
  Save,
  Check,
  AlertTriangle,
  Eye,
  EyeOff,
  RotateCcw,
  Globe,
  Lock,
  Share2,
  Phone,
  Sparkles,
  ShieldAlert,
  Sliders,
  LogOut,
} from 'lucide-react';
import {
  WhatsAppIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
  XIcon,
  CasheaIcon,
} from '../../../components/SocialIcons';
import adminStore from '../../../store/adminStore.js';
import { changePassword } from '../../../store/authStore.js';

export default function AdminSettings({ onLogout }) {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({});
  const [settingsSaved, setSettingsSaved] = useState(false);

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState(null);

  const [resetConfirm, setResetConfirm] = useState(false);

  useEffect(() => {
    const s = adminStore.getSettings();
    setSettings(s);
    setForm({ ...s });
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    adminStore.saveSettings(form);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleChangePwd = () => {
    if (!currentPwd || !newPwd) {
      setPwdMsg({ type: 'error', text: 'Completa todos los campos' });
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }
    if (newPwd.length < 6) {
      setPwdMsg({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }
    const result = changePassword(currentPwd, newPwd);
    if (result.success) {
      setPwdMsg({ type: 'success', text: 'Contraseña actualizada correctamente' });
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } else {
      setPwdMsg({ type: 'error', text: result.error });
    }
    setTimeout(() => setPwdMsg(null), 4000);
  };

  const handleReset = () => {
    adminStore.resetToDefaults();
    setResetConfirm(false);
    window.location.reload();
  };

  if (!settings) return null;

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none transition focus:border-[#00a896] bg-slate-50/50 focus:bg-white";

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
      {/* ─── Encabezado Principal ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="font-['Outfit'] font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Configuración del Sistema
          </h1>
          <p className="text-sm text-slate-500 font-['Inter'] mt-1">
            Control de identidad del sitio web, posicionamiento SEO, seguridad del panel y parámetros generales.
          </p>
        </div>

        <button
          onClick={handleSave}
          type="button"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm hover:brightness-110 active:scale-95 transition cursor-pointer font-['Inter'] self-start sm:self-auto"
          style={{ backgroundColor: '#00a896' }}
        >
          {settingsSaved ? (
            <>
              <Check size={16} />
              <span>¡Cambios Guardados!</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Guardar Todo</span>
            </>
          )}
        </button>
      </div>

      {/* ─── Grid de 2 Columnas para Cubrir Todo el Espacio Horizontal ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ══════════════ COLUMNA IZQUIERDA (8 COLUMNAS) ══════════════ */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Tarjeta: Información del Sitio & SEO */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#00a896] flex items-center justify-center font-bold">
                  <Globe size={20} />
                </div>
                <div>
                  <h3 className="font-['Outfit'] font-bold text-lg text-slate-800">
                    Información del Sitio & Metadatos SEO
                  </h3>
                  <p className="text-xs text-slate-500 font-['Inter']">
                    Datos visibles en los motores de búsqueda (Google) y redes sociales.
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 font-['Inter']">
                Público
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 font-['Inter'] uppercase tracking-wider">
                  Título de la Página (SEO Title)
                </label>
                <input
                  className={inputClass}
                  value={form.siteTitle || ''}
                  onChange={e => set('siteTitle', e.target.value)}
                  placeholder="CumanáConecta — Directorio Comercial y de Servicios..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 font-['Inter'] uppercase tracking-wider">
                  Meta Descripción (SEO Description)
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none transition focus:border-[#00a896] bg-slate-50/50 focus:bg-white resize-none"
                  value={form.siteDescription || ''}
                  onChange={e => set('siteDescription', e.target.value)}
                  placeholder="Breve resumen del directorio que aparece en resultados de Google..."
                />
              </div>

              {/* Redes Sociales en Grid de 2 Columnas */}
              <div className="pt-2">
                <h4 className="font-['Outfit'] font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Share2 size={13} />
                  <span>Redes Sociales Oficiales del Directorio</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 font-['Inter'] flex items-center gap-1.5">
                      <InstagramIcon size={14} className="text-[#E4405F]" />
                      <span>Instagram Oficial</span>
                    </label>
                    <input
                      className={inputClass}
                      value={form.instagramHandle || ''}
                      onChange={e => set('instagramHandle', e.target.value)}
                      placeholder="@cumanaconecta"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 font-['Inter'] flex items-center gap-1.5">
                      <TikTokIcon size={14} className="text-slate-900" />
                      <span>TikTok Oficial</span>
                    </label>
                    <input
                      className={inputClass}
                      value={form.tiktokHandle || ''}
                      onChange={e => set('tiktokHandle', e.target.value)}
                      placeholder="@cumanaconecta"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 font-['Inter'] flex items-center gap-1.5">
                      <XIcon size={14} className="text-slate-900" />
                      <span>Twitter / X</span>
                    </label>
                    <input
                      className={inputClass}
                      value={form.twitterHandle || ''}
                      onChange={e => set('twitterHandle', e.target.value)}
                      placeholder="@cumanaconecta"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 font-['Inter'] flex items-center gap-1.5">
                      <YouTubeIcon size={14} className="text-[#FF0000]" />
                      <span>Canal de YouTube</span>
                    </label>
                    <input
                      className={inputClass}
                      value={form.youtubeHandle || ''}
                      onChange={e => set('youtubeHandle', e.target.value)}
                      placeholder="https://youtube.com/@cumanaconecta"
                    />
                  </div>
                </div>
              </div>

              {/* WhatsApp Administrador */}
              <div className="pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 mb-1 font-['Inter'] uppercase tracking-wider flex items-center gap-1.5">
                  <WhatsAppIcon size={14} className="text-[#25D366]" />
                  <span>WhatsApp Central del Administrador</span>
                </label>
                <div className="relative">
                  <input
                    className={inputClass}
                    value={form.adminWhatsapp || ''}
                    onChange={e => set('adminWhatsapp', e.target.value)}
                    placeholder="584120000000"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1 font-['Inter']">
                  Número para recibir solicitudes de comercios, soporte y consultas. Formato internacional sin símbolos: <code>584121234567</code>.
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta: Carrusel de Anuncios Destacados */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  <Sparkles size={20} className="fill-current" />
                </div>
                <div>
                  <h3 className="font-['Outfit'] font-bold text-lg text-slate-800">
                    Carrusel de Comercios Destacados (Anuncios)
                  </h3>
                  <p className="text-xs text-slate-500 font-['Inter']">
                    Ajustes de visualización de la vitrina superior en la portada del directorio.
                  </p>
                </div>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.spotlightEnabled !== false}
                  onChange={e => set('spotlightEnabled', e.target.checked)}
                  className="w-5 h-5 rounded text-[#00a896] accent-[#00a896] cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-700 font-['Inter']">
                  {form.spotlightEnabled !== false ? 'Carrusel Activo' : 'Carrusel Oculto'}
                </span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-['Inter'] uppercase tracking-wide">
                Título de la Sección en Portada
              </label>
              <input
                className={inputClass}
                value={form.spotlightTitle || 'Comercios Destacados de Cumaná'}
                onChange={e => set('spotlightTitle', e.target.value)}
                placeholder="Comercios Destacados de Cumaná"
              />
            </div>
          </div>

          {/* Tarjeta: Módulo Oficial y Calculadora de Cashea (Niveles 1 al 6) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFE600] border border-amber-300 flex items-center justify-center font-black text-base shadow-xs p-1.5 shrink-0">
                  <img src="/images/cashea-icon.png" alt="Cashea" className="w-7 h-7 object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
                      Módulo y Calculadora Oficial de Cashea
                    </h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 font-['Inter']">
                      Niveles 1 al 6
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-['Inter']">
                    Enciende o apaga la calculadora de cuotas, pasos explicativos y promociones en los locales con Cashea.
                  </p>
                </div>
              </div>

              {/* Switch Maestro Global */}
              <label className="inline-flex items-center gap-2.5 cursor-pointer select-none px-3.5 py-2 rounded-2xl bg-amber-50/70 border border-amber-200 hover:bg-amber-100/60 transition">
                <input
                  type="checkbox"
                  checked={form.casheaCalculatorEnabled !== false}
                  onChange={e => set('casheaCalculatorEnabled', e.target.checked)}
                  className="w-5 h-5 rounded text-amber-500 accent-amber-500 cursor-pointer"
                />
                <span className="text-xs font-black text-amber-950 font-['Inter']">
                  {form.casheaCalculatorEnabled !== false ? 'Cashea Activo' : 'Cashea Desactivado'}
                </span>
              </label>
            </div>

            {/* Opciones Avanzadas de Cashea */}
            <div className="space-y-4">
              
              {/* Opciones de Visualización */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition">
                  <input
                    type="checkbox"
                    checked={form.casheaCardPreviewEnabled !== false}
                    onChange={e => set('casheaCardPreviewEnabled', e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-amber-500 accent-amber-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block font-['Inter']">
                      Acceso Rápido en Tarjetas de Negocios
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5 font-['Inter']">
                      Muestra el botón "Paga con Cashea" con cálculo rápido en el catálogo y directorio.
                    </span>
                  </div>
                </label>

                <label className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition">
                  <input
                    type="checkbox"
                    checked={form.casheaAllowExtendedCuotas !== false}
                    onChange={e => set('casheaAllowExtendedCuotas', e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-amber-500 accent-amber-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block font-['Inter']">
                      Permitir "Modo Más Cuotas" (6 a 12 cuotas)
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5 font-['Inter']">
                      Permite a usuarios Nivel 3 a 6 calcular planes de 6, 9 o 12 cuotas para montos mayores.
                    </span>
                  </div>
                </label>
              </div>

              {/* Adaptabilidad a Promociones de Cashea */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🔥</span>
                    <span className="text-xs font-black text-slate-900 font-['Outfit'] uppercase tracking-wide">
                      Campaña / Promoción Especial de Cashea
                    </span>
                  </div>

                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(form.casheaPromoActive)}
                      onChange={e => set('casheaPromoActive', e.target.checked)}
                      className="w-4 h-4 rounded text-rose-600 accent-rose-600 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-rose-700 font-['Inter']">
                      {form.casheaPromoActive ? 'Promo Cashea ACTIVA' : 'Activar Modo Promo'}
                    </span>
                  </label>
                </div>

                {form.casheaPromoActive && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-['Inter']">
                        Nombre de la Campaña Promo
                      </label>
                      <input
                        className={inputClass}
                        value={form.casheaPromoTitle || 'Promo Especial Cashea'}
                        onChange={e => set('casheaPromoTitle', e.target.value)}
                        placeholder="Ej. Aniversario Cashea / Semana de Ofertas"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-['Inter']">
                        Etiqueta / Badge de la Promoción
                      </label>
                      <input
                        className={inputClass}
                        value={form.casheaPromoBadge || 'Inicial Reducida desde 15%'}
                        onChange={e => set('casheaPromoBadge', e.target.value)}
                        placeholder="Ej. Inicial Reducida desde 15%"
                      />
                    </div>
                  </div>
                )}
                <p className="text-[11px] text-slate-500 font-['Inter']">
                  Cuando la promoción está activa, la calculadora aplica automáticamente porcentajes reducidos de pago inicial y resalta la insignia de oferta en los comercios afiliados.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* ══════════════ COLUMNA DERECHA (4-5 COLUMNAS) ══════════════ */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Tarjeta: Cambiar Contraseña del Panel */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Lock size={18} />
              </div>
              <div>
                <h3 className="font-['Outfit'] font-bold text-base text-slate-800">
                  Seguridad del Panel
                </h3>
                <p className="text-xs text-slate-500 font-['Inter']">
                  Actualiza tu contraseña de acceso administrativo.
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 font-['Inter'] uppercase tracking-wider">
                  Contraseña Actual
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className={inputClass + ' pr-10'}
                    value={currentPwd}
                    onChange={e => setCurrentPwd(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 font-['Inter'] uppercase tracking-wider">
                  Nueva Contraseña
                </label>
                <input
                  type={showPwd ? 'text' : 'password'}
                  className={inputClass}
                  value={newPwd}
                  onChange={e => setNewPwd(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 font-['Inter'] uppercase tracking-wider">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type={showPwd ? 'text' : 'password'}
                  className={inputClass}
                  value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)}
                  placeholder="Repite la contraseña"
                />
              </div>

              {pwdMsg && (
                <div
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold font-['Inter'] ${
                    pwdMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {pwdMsg.type === 'success' ? <Check size={15} /> : <AlertTriangle size={15} />}
                  <span>{pwdMsg.text}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleChangePwd}
                className="w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer hover:brightness-110 active:scale-98 transition font-['Inter'] text-white shadow-xs"
                style={{ backgroundColor: '#005f73' }}
              >
                Actualizar Contraseña
              </button>
            </div>
          </div>

          {/* Tarjeta: Estado del Sistema & Zona de Peligro */}
          <div className="bg-white rounded-3xl border border-rose-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-rose-100 pb-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="font-['Outfit'] font-bold text-base text-rose-700">
                  Zona de Peligro & Sesión
                </h3>
                <p className="text-xs text-slate-500 font-['Inter']">
                  Opciones avanzadas de mantenimiento del sistema.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setResetConfirm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-rose-200 text-rose-600 bg-rose-50/50 hover:bg-rose-50 transition cursor-pointer font-['Inter']"
              >
                <RotateCcw size={15} />
                <span>Restablecer Datos de Demostración</span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer font-['Inter']"
              >
                <LogOut size={15} />
                <span>Cerrar Sesión Administrativa</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Modal de Confirmación de Reset ─── */}
      {resetConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0 text-rose-600">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h4 className="font-['Outfit'] font-bold text-base text-slate-900">
                  ¿Restablecer todo el sistema?
                </h4>
                <p className="text-xs text-slate-500 font-['Inter']">
                  Se restablecerán los comercios, métodos de pago y configuraciones a su estado inicial.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer font-['Inter']"
              >
                Cancelar
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer hover:brightness-110 transition font-['Inter'] shadow-sm"
                style={{ backgroundColor: '#dc2626' }}
              >
                Restablecer Todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
