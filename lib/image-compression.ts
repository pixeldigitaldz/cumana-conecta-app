/**
 * Utilidad de compresión y optimización de imágenes en el cliente (PC, Móvil, Tablet).
 * Reduce fotos de cámaras de 5MB-20MB a ~70KB-180KB en formato WebP de alta fidelidad visual (HD).
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.82 es óptimo para WebP sin artefactos visuales
  preferWebp?: boolean;
}

export interface CompressedImageResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  originalWidth: number;
  originalHeight: number;
  width: number;
  height: number;
  savedPercent: number;
  formattedOriginalSize: string;
  formattedCompressedSize: string;
  format: 'webp' | 'jpeg';
  name: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export async function compressImageFile(
  file: File,
  options: CompressOptions = {}
): Promise<CompressedImageResult> {
  const {
    maxWidth = 1280,
    maxHeight = 900,
    quality = 0.78,
    preferWebp = true
  } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('El archivo seleccionado no es una imagen válida.'));
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('No se pudo leer el archivo de imagen.'));
    };

    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        try {
          const originalWidth = img.naturalWidth || img.width;
          const originalHeight = img.naturalHeight || img.height;

          // Proporción manteniendo relación de aspecto
          let targetWidth = originalWidth;
          let targetHeight = originalHeight;

          if (targetWidth > maxWidth || targetHeight > maxHeight) {
            const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
            targetWidth = Math.max(1, Math.round(targetWidth * ratio));
            targetHeight = Math.max(1, Math.round(targetHeight * ratio));
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d', { alpha: true });

          if (!ctx) {
            return resolve({
              dataUrl: reader.result as string,
              originalSize: file.size,
              compressedSize: file.size,
              originalWidth,
              originalHeight,
              width: originalWidth,
              height: originalHeight,
              savedPercent: 0,
              formattedOriginalSize: formatFileSize(file.size),
              formattedCompressedSize: formatFileSize(file.size),
              format: 'jpeg',
              name: file.name
            });
          }

          // Suavizado de alta fidelidad
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          let outputFormat: 'webp' | 'jpeg' = 'webp';
          let dataUrl = '';

          if (preferWebp) {
            dataUrl = canvas.toDataURL('image/webp', quality);
            if (!dataUrl.startsWith('data:image/webp')) {
              dataUrl = canvas.toDataURL('image/jpeg', quality);
              outputFormat = 'jpeg';
            }
          } else {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
            outputFormat = 'jpeg';
          }

          const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
          const compressedBytes = Math.round((base64Length * 3) / 4);
          const originalBytes = file.size;
          const savedBytes = Math.max(0, originalBytes - compressedBytes);
          const savedPercent = originalBytes > 0 ? Math.round((savedBytes / originalBytes) * 100) : 0;

          resolve({
            dataUrl,
            originalSize: originalBytes,
            compressedSize: compressedBytes,
            originalWidth,
            originalHeight,
            width: targetWidth,
            height: targetHeight,
            savedPercent,
            formattedOriginalSize: formatFileSize(originalBytes),
            formattedCompressedSize: formatFileSize(compressedBytes),
            format: outputFormat,
            name: file.name
          });
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => {
        reject(new Error('Error al procesar la imagen seleccionada.'));
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}

export async function compressMultipleImageFiles(
  files: FileList | File[],
  options: CompressOptions = {},
  onProgress?: (current: number, total: number, latestResult?: CompressedImageResult) => void
): Promise<CompressedImageResult[]> {
  const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
  const results: CompressedImageResult[] = [];

  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];
    try {
      const res = await compressImageFile(file, options);
      results.push(res);
      if (onProgress) {
        onProgress(i + 1, fileArray.length, res);
      }
    } catch (err) {
      console.error(`Error comprimiendo imagen ${file.name}:`, err);
    }
  }

  return results;
}
