import { type Config, removeBackground } from "@imgly/background-removal";

// Extended config type to include all documented options
interface ExtendedConfig extends Omit<Config, 'output'> {
  output?: {
    format?: 'image/png' | 'image/jpeg' | 'image/webp';
    quality?: number;
    type?: 'foreground' | 'background' | 'mask';
  };
}

export interface RemovalResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

export interface RemovalProgress {
  stage: "loading" | "processing" | "complete";
  progress: number;
  message: string;
}

export interface BackgroundRemovalSettings {
  model: 'isnet' | 'isnet_fp16' | 'isnet_quint8';
  outputFormat: 'image/png' | 'image/jpeg' | 'image/webp';
  outputType: 'foreground' | 'background' | 'mask';
  quality: number; // 0.0 - 1.0
  device: 'auto' | 'gpu' | 'cpu';
}

export const defaultSettings: BackgroundRemovalSettings = {
  model: 'isnet_fp16', // Good balance of speed/quality
  outputFormat: 'image/png',
  outputType: 'foreground',
  quality: 0.9,
  device: 'auto'
};

export const modelPresets = {
  fast: { model: 'isnet_quint8' as const, description: 'Fastest processing, good quality' },
  balanced: { model: 'isnet_fp16' as const, description: 'Balanced speed and quality (recommended)' },
  quality: { model: 'isnet' as const, description: 'Best quality, slower processing' }
};

/**
 * Remove background from an image
 */
export async function removeBg(
  file: File,
  settings: BackgroundRemovalSettings = defaultSettings,
  onProgress?: (progress: RemovalProgress) => void,
): Promise<RemovalResult> {
  try {
    // Report loading stage
    onProgress?.({
      stage: "loading",
      progress: 10,
      message: "Loading AI model...",
    });

    // Configure background removal
    const config: ExtendedConfig = {
      progress: (_key, current, total) => {
        const progressPercent = Math.round((current / total) * 100);
        onProgress?.({
          stage: "processing",
          progress: progressPercent,
          message: `Processing image... ${progressPercent}%`,
        });
      },
      model: settings.model,
      device: settings.device === 'auto' ? 'gpu' : settings.device,
      output: {
        format: settings.outputFormat,
        quality: settings.quality,
        type: settings.outputType,
      },
    };

    // Remove background
    const blob = await removeBackground(file, config);

    // Create URL for preview
    const url = URL.createObjectURL(blob);

    // Get image dimensions
    const img = await loadImage(url);
    const { width, height } = img;

    // Report completion
    onProgress?.({
      stage: "complete",
      progress: 100,
      message: "Background removed successfully!",
    });

    return {
      blob,
      url,
      width,
      height,
    };
  } catch (error) {
    console.error("Background removal failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to remove background",
    );
  }
}

/**
 * Load an image from a URL
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve(img);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Get file name without extension
 */
export function getFileNameWithoutExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "");
}

/**
 * Get file extension based on output format
 */
export function getFileExtension(format: BackgroundRemovalSettings['outputFormat']): string {
  switch (format) {
    case 'image/png':
      return 'png';
    case 'image/jpeg':
      return 'jpg';
    case 'image/webp':
      return 'webp';
    default:
      return 'png';
  }
}

/**
 * Get output type description
 */
export function getOutputTypeDescription(type: BackgroundRemovalSettings['outputType']): string {
  switch (type) {
    case 'foreground':
      return 'Subject only (transparent background)';
    case 'background':
      return 'Background only';
    case 'mask':
      return 'Black and white mask';
    default:
      return 'Subject only';
  }
}

/**
 * Replace background with solid color
 */
export async function replaceBackground(
  imageUrl: string,
  backgroundColor: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Fill background color
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw image on top
      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = imageUrl;
  });
}
