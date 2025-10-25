import {
  type Config,
  removeBackground,
  segmentForeground,
} from "@imgly/background-removal";

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
  model: "isnet" | "isnet_fp16" | "isnet_quint8";
  outputFormat: "image/png" | "image/jpeg" | "image/webp";
  outputType: "foreground" | "background" | "mask";
  quality: number; // 0.0 - 1.0
  device: "auto" | "gpu" | "cpu";
}

export const defaultSettings: BackgroundRemovalSettings = {
  model: "isnet_fp16", // Good balance of speed/quality
  outputFormat: "image/png",
  outputType: "foreground",
  quality: 0.9,
  device: "auto",
};

export const modelPresets = {
  fast: {
    model: "isnet_quint8" as const,
    description: "Fastest processing, good quality",
  },
  balanced: {
    model: "isnet_fp16" as const,
    description: "Balanced speed and quality (recommended)",
  },
  quality: {
    model: "isnet" as const,
    description: "Best quality, slower processing",
  },
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
    const config: Config = {
      progress: (_key, current, total) => {
        const progressPercent = Math.round((current / total) * 100);
        onProgress?.({
          stage: "processing",
          progress: progressPercent,
          message: `Processing image... ${progressPercent}%`,
        });
      },
      model: settings.model,
      device: settings.device === "auto" ? "gpu" : settings.device,
      output: {
        format: settings.outputFormat,
        quality: settings.quality,
      },
    };

    console.log("Background removal config:", {
      model: settings.model,
      device: settings.device,
      outputType: settings.outputType,
      outputFormat: settings.outputFormat,
      quality: settings.quality,
    });

    // Use the appropriate function based on output type
    let blob: Blob;
    if (settings.outputType === "mask") {
      console.log("Processing mask output...");
      // For mask, use segmentForeground which returns the alpha mask
      // We need to convert it to a visible grayscale image
      const maskBlob = await segmentForeground(file, config);
      console.log("Mask blob received:", maskBlob.size, "bytes");
      blob = await convertMaskToGrayscale(maskBlob, settings);
      console.log("Grayscale mask created:", blob.size, "bytes");
    } else if (settings.outputType === "background") {
      console.log("Processing background output...");
      // For background only, we need to invert the mask and apply it
      // First get the mask
      const maskBlob = await segmentForeground(file, config);
      console.log("Mask blob received:", maskBlob.size, "bytes");
      // Then we need to apply the inverted mask to get background only
      blob = await applyInvertedMask(file, maskBlob, settings);
      console.log("Background blob created:", blob.size, "bytes");
    } else {
      console.log("Processing foreground output...");
      // For foreground (default), use removeBackground
      blob = await removeBackground(file, config);
      console.log("Foreground blob created:", blob.size, "bytes");
    }

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
export function getFileExtension(
  format: BackgroundRemovalSettings["outputFormat"],
): string {
  switch (format) {
    case "image/png":
      return "png";
    case "image/jpeg":
      return "jpg";
    case "image/webp":
      return "webp";
    default:
      return "png";
  }
}

/**
 * Convert alpha mask to visible grayscale image
 */
async function convertMaskToGrayscale(
  maskBlob: Blob,
  settings: BackgroundRemovalSettings,
): Promise<Blob> {
  // Load mask image
  const maskUrl = URL.createObjectURL(maskBlob);
  const maskImg = await loadImageFromUrl(maskUrl);
  URL.revokeObjectURL(maskUrl);

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = maskImg.width;
  canvas.height = maskImg.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Draw mask image
  ctx.drawImage(maskImg, 0, 0);

  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Convert alpha channel to grayscale
  // The mask from segmentForeground has the alpha in the alpha channel
  // We need to copy it to RGB channels to make it visible
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3]; // Get alpha value
    data[i] = alpha; // R
    data[i + 1] = alpha; // G
    data[i + 2] = alpha; // B
    data[i + 3] = 255; // Make fully opaque
  }

  // Put modified image data back
  ctx.putImageData(imageData, 0, 0);

  // Convert to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create mask blob"));
        }
      },
      settings.outputFormat,
      settings.quality,
    );
  });
}

/**
 * Apply inverted mask to get background only
 */
async function applyInvertedMask(
  originalFile: File,
  maskBlob: Blob,
  settings: BackgroundRemovalSettings,
): Promise<Blob> {
  // Load original image
  const originalImg = await loadImageFromFile(originalFile);

  // Load mask image
  const maskUrl = URL.createObjectURL(maskBlob);
  const maskImg = await loadImageFromUrl(maskUrl);
  URL.revokeObjectURL(maskUrl);

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = originalImg.width;
  canvas.height = originalImg.height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Draw original image
  ctx.drawImage(originalImg, 0, 0);

  // Get image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Create a temporary canvas for the mask
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = maskImg.width;
  maskCanvas.height = maskImg.height;
  const maskCtx = maskCanvas.getContext("2d");

  if (!maskCtx) {
    throw new Error("Could not get mask canvas context");
  }

  maskCtx.drawImage(maskImg, 0, 0);
  const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
  const mask = maskData.data;

  // Apply inverted mask (keep background, remove foreground)
  for (let i = 0; i < data.length; i += 4) {
    // Get mask alpha value (assuming grayscale mask)
    const maskAlpha = mask[i + 3] / 255;

    // Invert the mask: where mask is opaque (foreground), make transparent
    // where mask is transparent (background), keep opaque
    data[i + 3] = Math.round((1 - maskAlpha) * 255);
  }

  // Put modified image data back
  ctx.putImageData(imageData, 0, 0);

  // Convert to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create background blob"));
        }
      },
      settings.outputFormat,
      settings.quality,
    );
  });
}

/**
 * Load image from File
 */
function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image from file"));
    };

    img.src = url;
  });
}

/**
 * Load image from URL
 */
function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve(img);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image from URL"));
    };

    img.src = url;
  });
}

/**
 * Get output type description
 */
export function getOutputTypeDescription(
  type: BackgroundRemovalSettings["outputType"],
): string {
  switch (type) {
    case "foreground":
      return "Subject only (transparent background)";
    case "background":
      return "Background only";
    case "mask":
      return "Black and white mask";
    default:
      return "Subject only";
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
