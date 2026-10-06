import { useState } from 'react';
import { Building2, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { login } from '../../store/authStore.js';

export default function AdminLogin({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(username.trim(), password.trim());
    setLoading(false);
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#0a1120', backgroundImage: 'radial-gradient(ellipse at 30% 20%, rgba(0,168,150,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(0,87,115,0.1) 0%, transparent 60%)' }}
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <div
          className="rounded-3xl border p-8 shadow-2xl"
          style={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.07)' }}
        >
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg p-2 bg-white border border-slate-700/60">
              <img src="/images/cumana-conecta-logo.png" alt="CumanáConecta" className="w-full h-full object-contain" />
            </div>
            <h1 className="font-['Outfit'] font-bold text-2xl text-white mb-1">
              CumanáConecta
            </h1>
            <p className="text-sm text-slate-400 font-['Inter']">Panel de Administración</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-['Inter'] uppercase tracking-wide">
                Usuario
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm font-['Inter'] text-white placeholder-slate-600 border outline-none transition focus:border-[#00a896]"
                  style={{ backgroundColor: '#1a2232', borderColor: 'rgba(255,255,255,0.1)' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-['Inter'] uppercase tracking-wide">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm font-['Inter'] text-white placeholder-slate-600 border outline-none transition focus:border-[#00a896]"
                  style={{ backgroundColor: '#1a2232', borderColor: 'rgba(255,255,255,0.1)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-rose-950/50 border border-rose-800/50 text-rose-400 text-sm font-['Inter']">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-['Inter'] font-bold text-sm text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60 cursor-pointer mt-2 shadow-lg"
              style={{ backgroundColor: '#00a896' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                'Ingresar al Panel'
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-600 mt-6 font-['Inter']">
            Acceso exclusivo para administradores de CumanáConecta
          </p>
        </div>

        {/* Back to site */}
        <div className="text-center mt-4">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState(null, '', '/' + window.location.search);
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="text-xs text-slate-500 hover:text-slate-300 transition font-['Inter']"
          >
            ← Volver al directorio público
          </a>
        </div>
      </div>
    </div>
  );
}
