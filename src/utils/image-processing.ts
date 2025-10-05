export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ProcessingOptions {
  quality?: number; // 0-1 for JPEG/WebP
  format?: string;
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
}

/**
 * Load an image from a file and return it as an HTMLImageElement
 */
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Get image dimensions from a file
 */
export async function getImageDimensions(file: File): Promise<ImageDimensions> {
  const img = await loadImage(file);
  return { width: img.naturalWidth, height: img.naturalHeight };
}

/**
 * Convert image to different format
 */
export async function convertImage(
  file: File,
  targetFormat: string,
  quality: number = 0.9,
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to convert image"));
        }
      },
      targetFormat,
      quality,
    );
  });
}

/**
 * Resize image while maintaining aspect ratio
 */
export async function resizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  maintainAspectRatio: boolean = true,
  quality: number = 0.9,
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  const { width, height } = calculateDimensions(
    img.naturalWidth,
    img.naturalHeight,
    targetWidth,
    targetHeight,
    maintainAspectRatio,
  );

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(img, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to resize image"));
        }
      },
      file.type,
      quality,
    );
  });
}

/**
 * Calculate new dimensions while maintaining aspect ratio
 */
export function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  targetWidth: number,
  targetHeight: number,
  maintainAspectRatio: boolean = true,
): ImageDimensions {
  if (!maintainAspectRatio) {
    return { width: targetWidth, height: targetHeight };
  }

  const aspectRatio = originalWidth / originalHeight;

  if (targetWidth / targetHeight > aspectRatio) {
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight,
    };
  } else {
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio),
    };
  }
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Get file extension from MIME type
 */
export function getFileExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/bmp": "bmp",
    "image/tiff": "tiff",
  };

  return extensions[mimeType] || "jpg";
}
