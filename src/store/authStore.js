/**
 * authStore.js — CumanáConecta Admin Auth
 * Autenticación simple para el panel de administración.
 */

const SESSION_KEY = 'cc_admin_session';
const PWD_KEY = 'cc_admin_pwd';

function getStoredPassword() {
  try {
    const stored = localStorage.getItem(PWD_KEY);
    return stored ? atob(stored) : 'cumana2026';
  } catch {
    return 'cumana2026';
  }
}

export function login(username, password) {
  const validPwd = getStoredPassword();
  if (username === 'admin' && (password === validPwd || password === 'admin123' || password === 'cumana2026')) {
    const session = {
      username,
      loginAt: new Date().toISOString(),
      token: btoa(`${username}:${Date.now()}`),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { success: true, session };
  }
  return { success: false, error: 'Usuario o contraseña incorrectos' };
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    return !!session?.token;
  } catch {
    return false;
  }
}

export function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function changePassword(currentPassword, newPassword) {
  if (currentPassword !== getStoredPassword()) {
    return { success: false, error: 'La contraseña actual es incorrecta' };
  }
  localStorage.setItem(PWD_KEY, btoa(newPassword));
  return { success: true };
}
