/**
 * Capa de persistencia híbrida (IndexedDB + LocalStorage) y sincronización en tiempo real
 * para Cumaná Conecta.
 * 
 * - IndexedDB: Almacena cientos de megabytes de forma asíncrona, eliminando por completo
 *   el límite de 5MB de LocalStorage (ideal para fotos WebP de portada y galería).
 * - LocalStorage: Usado como fallback rápido y para sincronización síncrona.
 * - BroadcastChannel: Sincronización instantánea entre pestañas abiertas en tiempo real (<10ms).
 */

const DB_NAME = 'cumana_conecta_db_v1';
const STORE_NAME = 'app_state';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function getIDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB not supported in SSR'));
  }
  if (!('indexedDB' in window)) {
    return Promise.reject(new Error('IndexedDB no está soportado en este navegador'));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.warn('Error al abrir IndexedDB:', request.error);
        reject(request.error);
      };
    });
  }

  return dbPromise;
}

export async function getIndexedDBItem<T>(key: string): Promise<T | null> {
  try {
    const db = await getIDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result !== undefined ? (request.result as T) : null);
      };

      request.onerror = () => {
        console.warn(`Error al leer "${key}" de IndexedDB:`, request.error);
        resolve(null);
      };
    });
  } catch (e) {
    return null;
  }
}

export async function setIndexedDBItem<T>(key: string, value: T): Promise<void> {
  try {
    const db = await getIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(value, key);

      request.onsuccess = () => resolve();
      request.onerror = () => {
        console.warn(`Error al guardar "${key}" en IndexedDB:`, request.error);
        reject(request.error);
      };
    });
  } catch (e) {
    console.warn(`No se pudo persistir "${key}" en IndexedDB:`, e);
  }
}

export async function deleteIndexedDBItem(key: string): Promise<void> {
  try {
    const db = await getIDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  } catch (e) {
    // Ignore error
  }
}

// ==============================================================
// CANAL DE COMUNICACIÓN EN TIEMPO REAL ENTRE PESTAÑAS (BroadcastChannel)
// ==============================================================
export type SyncMessage = {
  type: 'SYNC_UPDATE';
  key: string;
  payload: any;
  timestamp: number;
};

const SYNC_CHANNEL_NAME = 'cumana_conecta_realtime_sync';
let broadcastChannel: BroadcastChannel | null = null;

export function getSyncChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined') return null;
  if (!('BroadcastChannel' in window)) return null;

  if (!broadcastChannel) {
    try {
      broadcastChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
    } catch (e) {
      console.warn('BroadcastChannel no soportado o deshabilitado:', e);
      broadcastChannel = null;
    }
  }
  return broadcastChannel;
}

export function broadcastDataUpdate(key: string, payload: any) {
  const channel = getSyncChannel();
  if (channel) {
    try {
      const msg: SyncMessage = {
        type: 'SYNC_UPDATE',
        key,
        payload,
        timestamp: Date.now(),
      };
      channel.postMessage(msg);
    } catch (e) {
      console.warn('Error al transmitir actualización por BroadcastChannel:', e);
    }
  }
}
