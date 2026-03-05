import JSZip from "jszip";

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
  fitMethod?: "scale" | "contain" | "cover" | "stretch";
  backgroundColor?: string;
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
 * Resize image with various fit methods
 */
export async function resizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  maintainAspectRatio: boolean = true,
  quality: number = 0.9,
  fitMethod: "scale" | "contain" | "cover" | "stretch" = "scale",
  backgroundColor: string = "transparent",
  format?: string,
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  const outputFormat = format || file.type;

  let drawWidth = targetWidth;
  let drawHeight = targetHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (fitMethod === "scale") {
    const dims = calculateDimensions(
      img.naturalWidth,
      img.naturalHeight,
      targetWidth,
      targetHeight,
      maintainAspectRatio,
    );
    canvas.width = dims.width;
    canvas.height = dims.height;
    drawWidth = dims.width;
    drawHeight = dims.height;
  } else if (fitMethod === "stretch") {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  } else if (fitMethod === "contain") {
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const aspectRatio = img.naturalWidth / img.naturalHeight;
    const targetRatio = targetWidth / targetHeight;

    if (aspectRatio > targetRatio) {
      drawWidth = targetWidth;
      drawHeight = targetWidth / aspectRatio;
    } else {
      drawWidth = targetHeight * aspectRatio;
      drawHeight = targetHeight;
    }

    offsetX = (targetWidth - drawWidth) / 2;
    offsetY = (targetHeight - drawHeight) / 2;

    if (backgroundColor !== "transparent") {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }
  } else if (fitMethod === "cover") {
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const aspectRatio = img.naturalWidth / img.naturalHeight;
    const targetRatio = targetWidth / targetHeight;

    if (aspectRatio > targetRatio) {
      drawWidth = targetHeight * aspectRatio;
      drawHeight = targetHeight;
    } else {
      drawWidth = targetWidth;
      drawHeight = targetWidth / aspectRatio;
    }

    offsetX = (targetWidth - drawWidth) / 2;
    offsetY = (targetHeight - drawHeight) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to resize image"));
        }
      },
      outputFormat,
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
  // Delay revoking the URL to ensure download starts
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Download multiple files as a ZIP archive
 */
export async function downloadAsZip(
  files: Array<{ blob: Blob; name: string }>,
  zipFilename: string,
): Promise<void> {
  const zip = new JSZip();

  // Add all files to the ZIP
  for (const file of files) {
    zip.file(file.name, file.blob);
  }

  // Generate the ZIP file
  const zipBlob = await zip.generateAsync({ type: "blob" });

  // Download the ZIP
  downloadBlob(zipBlob, zipFilename);
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
    "image/x-icon": "ico",
    "image/svg+xml": "svg",
    "image/avif": "avif",
  };

  return extensions[mimeType] || "jpg";
}

/**
 * Crop image to a specific region
 */
export async function cropImage(
  file: File,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  canvas.width = sw;
  canvas.height = sh;

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to crop image"));
        }
      },
      file.type,
      0.95,
    );
  });
}
