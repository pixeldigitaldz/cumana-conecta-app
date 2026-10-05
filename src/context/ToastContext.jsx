import { createContext, useContext, useState, useCallback } from 'react';
import ToastContainer from '../components/ToastContainer';

const ToastContext = createContext({
  showToast: () => {},
  toast: {
    favorite: () => {},
    unfavorite: () => {},
    copy: () => {},
    success: () => {},
    info: () => {},
    error: () => {},
  },
  removeToast: () => {},
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      type = 'info', // 'favorite', 'unfavorite', 'copy', 'success', 'error', 'info'
      title,
      message,
      duration = 3000,
      icon,
    }) => {
      const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
      const newToast = { id, type, title, message, duration, icon };

      setToasts((prev) => {
        // Limit to max 3 toasts on screen simultaneously
        const next = [...prev, newToast];
        return next.slice(-3);
      });

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const toast = {
    favorite: (businessName) =>
      showToast({
        type: 'favorite',
        title: '¡Guardado en Favoritos!',
        message: businessName
          ? `${businessName} se añadió a tus comercios guardados.`
          : 'Comercio añadido a tus favoritos.',
        duration: 3200,
      }),
    unfavorite: (businessName) =>
      showToast({
        type: 'unfavorite',
        title: 'Eliminado de Favoritos',
        message: businessName
          ? `${businessName} se quitó de tus favoritos.`
          : 'Comercio eliminado de tus favoritos.',
        duration: 2800,
      }),
    copy: (customMessage = 'Enlace copiado al portapapeles listo para compartir.', title = '¡Enlace Copiado!') =>
      showToast({
        type: 'copy',
        title,
        message: customMessage,
        duration: 3000,
      }),
    success: (message, title = 'Operación Exitosa') =>
      showToast({
        type: 'success',
        title,
        message,
        duration: 3200,
      }),
    info: (message, title = 'Notificación') =>
      showToast({
        type: 'info',
        title,
        message,
        duration: 3000,
      }),
    error: (message, title = 'Atención') =>
      showToast({
        type: 'error',
        title,
        message,
        duration: 4000,
      }),
  };

  return (
    <ToastContext.Provider value={{ showToast, toast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastContext;
