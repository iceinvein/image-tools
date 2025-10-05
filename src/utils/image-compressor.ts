export interface CompressionResult {
  blob: Blob;
  url: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  width: number;
  height: number;
}

export interface CompressionOptions {
  quality: number; // 0-1 for JPEG/WebP
  format: "image/jpeg" | "image/png" | "image/webp";
  maxWidth?: number;
  maxHeight?: number;
  maintainAspectRatio?: boolean;
}

/**
 * Compress an image file with specified options
 */
export async function compressImage(
  file: File,
  options: CompressionOptions,
): Promise<CompressionResult> {
  const img = await loadImage(file);
  const originalSize = file.size;

  // Calculate dimensions
  let { width, height } = img;

  if (options.maxWidth || options.maxHeight) {
    const dimensions = calculateDimensions(
      width,
      height,
      options.maxWidth,
      options.maxHeight,
      options.maintainAspectRatio ?? true,
    );
    width = dimensions.width;
    height = dimensions.height;
  }

  // Create canvas and draw image
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Use high-quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(img, 0, 0, width, height);

  // Convert to blob with compression
  const blob = await canvasToBlob(canvas, options.format, options.quality);
  const url = URL.createObjectURL(blob);
  const compressedSize = blob.size;
  const compressionRatio =
    ((originalSize - compressedSize) / originalSize) * 100;

  return {
    blob,
    url,
    originalSize,
    compressedSize,
    compressionRatio,
    width,
    height,
  };
}

/**
 * Load an image from a file
 */
function loadImage(file: File): Promise<HTMLImageElement> {
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
 * Convert canvas to blob
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create blob"));
        }
      },
      format,
      quality,
    );
  });
}

/**
 * Calculate dimensions maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth?: number,
  maxHeight?: number,
  maintainAspectRatio = true,
): { width: number; height: number } {
  if (!maxWidth && !maxHeight) {
    return { width: originalWidth, height: originalHeight };
  }

  if (!maintainAspectRatio) {
    return {
      width: maxWidth || originalWidth,
      height: maxHeight || originalHeight,
    };
  }

  const aspectRatio = originalWidth / originalHeight;

  let width = originalWidth;
  let height = originalHeight;

  if (maxWidth && width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }

  if (maxHeight && height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get recommended quality based on format
 */
export function getRecommendedQuality(format: string): number {
  switch (format) {
    case "image/jpeg":
      return 0.85;
    case "image/webp":
      return 0.85;
    case "image/png":
      return 1.0; // PNG doesn't use quality, but we keep it at 1.0
    default:
      return 0.85;
  }
}

/**
 * Get format display name
 */
export function getFormatName(format: string): string {
  switch (format) {
    case "image/jpeg":
      return "JPEG";
    case "image/png":
      return "PNG";
    case "image/webp":
      return "WebP";
    default:
      return "Unknown";
  }
}

/**
 * Get file extension from format
 */
export function getFileExtension(format: string): string {
  switch (format) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}
