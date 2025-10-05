/**
 * Asset Generator for Web and Mobile App Development
 * Generates all required image assets from a single source image
 */

import { convertFileToIco } from "./ico-converter";

export interface AssetSize {
  width: number;
  height: number;
  name: string;
  description?: string;
}

export interface AssetPack {
  id: string;
  name: string;
  description: string;
  sizes: AssetSize[];
  includeIco?: boolean;
}

// Web Development Assets
export const WEB_PACK: AssetPack = {
  id: "web",
  name: "Web Development Pack",
  description: "Complete set of favicons, PWA icons, and social media images",
  includeIco: true,
  sizes: [
    // Apple Touch Icons
    {
      width: 180,
      height: 180,
      name: "apple-touch-icon.png",
      description: "Apple Touch Icon",
    },
    {
      width: 152,
      height: 152,
      name: "apple-touch-icon-152x152.png",
      description: "iPad Retina",
    },
    {
      width: 120,
      height: 120,
      name: "apple-touch-icon-120x120.png",
      description: "iPhone Retina",
    },
    {
      width: 76,
      height: 76,
      name: "apple-touch-icon-76x76.png",
      description: "iPad",
    },

    // Android Chrome
    {
      width: 192,
      height: 192,
      name: "android-chrome-192x192.png",
      description: "Android Chrome",
    },
    {
      width: 512,
      height: 512,
      name: "android-chrome-512x512.png",
      description: "Android Chrome Large",
    },

    // Standard Favicons
    {
      width: 32,
      height: 32,
      name: "favicon-32x32.png",
      description: "Standard Favicon",
    },
    {
      width: 16,
      height: 16,
      name: "favicon-16x16.png",
      description: "Small Favicon",
    },

    // Microsoft Tiles
    {
      width: 150,
      height: 150,
      name: "mstile-150x150.png",
      description: "Microsoft Tile",
    },
    {
      width: 310,
      height: 310,
      name: "mstile-310x310.png",
      description: "Microsoft Large Tile",
    },
    {
      width: 310,
      height: 150,
      name: "mstile-310x150.png",
      description: "Microsoft Wide Tile",
    },

    // Social Media
    {
      width: 1200,
      height: 630,
      name: "og-image.png",
      description: "Open Graph (Facebook, LinkedIn)",
    },
    {
      width: 1200,
      height: 675,
      name: "twitter-card.png",
      description: "Twitter Card",
    },

    // PWA Icons
    { width: 72, height: 72, name: "icon-72x72.png", description: "PWA Icon" },
    { width: 96, height: 96, name: "icon-96x96.png", description: "PWA Icon" },
    {
      width: 128,
      height: 128,
      name: "icon-128x128.png",
      description: "PWA Icon",
    },
    {
      width: 144,
      height: 144,
      name: "icon-144x144.png",
      description: "PWA Icon",
    },
    {
      width: 384,
      height: 384,
      name: "icon-384x384.png",
      description: "PWA Icon",
    },
  ],
};

// iOS App Development Assets
export const IOS_PACK: AssetPack = {
  id: "ios",
  name: "iOS App Development Pack",
  description: "All required iOS app icons for iPhone, iPad, and App Store",
  sizes: [
    // App Store
    {
      width: 1024,
      height: 1024,
      name: "AppIcon-1024.png",
      description: "App Store",
    },

    // iPhone
    {
      width: 180,
      height: 180,
      name: "AppIcon-60@3x.png",
      description: "iPhone (@3x)",
    },
    {
      width: 120,
      height: 120,
      name: "AppIcon-60@2x.png",
      description: "iPhone (@2x)",
    },

    // iPad
    {
      width: 167,
      height: 167,
      name: "AppIcon-83.5@2x.png",
      description: "iPad Pro (@2x)",
    },
    {
      width: 152,
      height: 152,
      name: "AppIcon-76@2x.png",
      description: "iPad (@2x)",
    },
    { width: 76, height: 76, name: "AppIcon-76.png", description: "iPad" },

    // Spotlight
    {
      width: 120,
      height: 120,
      name: "AppIcon-40@3x.png",
      description: "Spotlight (@3x)",
    },
    {
      width: 80,
      height: 80,
      name: "AppIcon-40@2x.png",
      description: "Spotlight (@2x)",
    },
    { width: 40, height: 40, name: "AppIcon-40.png", description: "Spotlight" },

    // Settings
    {
      width: 87,
      height: 87,
      name: "AppIcon-29@3x.png",
      description: "Settings (@3x)",
    },
    {
      width: 58,
      height: 58,
      name: "AppIcon-29@2x.png",
      description: "Settings (@2x)",
    },
    { width: 29, height: 29, name: "AppIcon-29.png", description: "Settings" },

    // Notification
    {
      width: 60,
      height: 60,
      name: "AppIcon-20@3x.png",
      description: "Notification (@3x)",
    },
    {
      width: 40,
      height: 40,
      name: "AppIcon-20@2x.png",
      description: "Notification (@2x)",
    },
    {
      width: 20,
      height: 20,
      name: "AppIcon-20.png",
      description: "Notification",
    },
  ],
};

// Android App Development Assets
export const ANDROID_PACK: AssetPack = {
  id: "android",
  name: "Android App Development Pack",
  description: "All required Android app icons for different screen densities",
  sizes: [
    // Play Store
    {
      width: 512,
      height: 512,
      name: "ic_launcher-512.png",
      description: "Play Store",
    },

    // Launcher Icons
    {
      width: 192,
      height: 192,
      name: "ic_launcher-xxxhdpi.png",
      description: "XXXHDPI (640dpi)",
    },
    {
      width: 144,
      height: 144,
      name: "ic_launcher-xxhdpi.png",
      description: "XXHDPI (480dpi)",
    },
    {
      width: 96,
      height: 96,
      name: "ic_launcher-xhdpi.png",
      description: "XHDPI (320dpi)",
    },
    {
      width: 72,
      height: 72,
      name: "ic_launcher-hdpi.png",
      description: "HDPI (240dpi)",
    },
    {
      width: 48,
      height: 48,
      name: "ic_launcher-mdpi.png",
      description: "MDPI (160dpi)",
    },
    {
      width: 36,
      height: 36,
      name: "ic_launcher-ldpi.png",
      description: "LDPI (120dpi)",
    },

    // Adaptive Icons (Foreground)
    {
      width: 432,
      height: 432,
      name: "ic_launcher_foreground-xxxhdpi.png",
      description: "Adaptive XXXHDPI",
    },
    {
      width: 324,
      height: 324,
      name: "ic_launcher_foreground-xxhdpi.png",
      description: "Adaptive XXHDPI",
    },
    {
      width: 216,
      height: 216,
      name: "ic_launcher_foreground-xhdpi.png",
      description: "Adaptive XHDPI",
    },
    {
      width: 162,
      height: 162,
      name: "ic_launcher_foreground-hdpi.png",
      description: "Adaptive HDPI",
    },
    {
      width: 108,
      height: 108,
      name: "ic_launcher_foreground-mdpi.png",
      description: "Adaptive MDPI",
    },
  ],
};

// Complete Pack (All Assets)
export const COMPLETE_PACK: AssetPack = {
  id: "complete",
  name: "Complete Pack (Web + iOS + Android)",
  description: "Everything you need for web, iOS, and Android development",
  includeIco: true,
  sizes: [...WEB_PACK.sizes, ...IOS_PACK.sizes, ...ANDROID_PACK.sizes],
};

export const ASSET_PACKS = [WEB_PACK, IOS_PACK, ANDROID_PACK, COMPLETE_PACK];

export interface GeneratedAsset {
  name: string;
  description?: string;
  blob: Blob;
  url: string;
  size: string;
}

/**
 * Generate all assets for a given pack
 */
export async function generateAssetPack(
  file: File,
  pack: AssetPack,
  onProgress?: (current: number, total: number) => void,
): Promise<GeneratedAsset[]> {
  const img = await loadImage(file);
  const assets: GeneratedAsset[] = [];

  let current = 0;
  const total = pack.sizes.length + (pack.includeIco ? 1 : 0);

  // Generate each size
  for (const size of pack.sizes) {
    const blob = await generateAsset(img, size.width, size.height);
    const url = URL.createObjectURL(blob);
    const sizeKB = (blob.size / 1024).toFixed(1);

    assets.push({
      name: size.name,
      description: size.description,
      blob,
      url,
      size: `${sizeKB} KB`,
    });

    current++;
    onProgress?.(current, total);
  }

  // Generate ICO if needed
  if (pack.includeIco) {
    const icoBlob = await convertFileToIco(file);
    const url = URL.createObjectURL(icoBlob);
    const sizeKB = (icoBlob.size / 1024).toFixed(1);

    assets.push({
      name: "favicon.ico",
      description: "Multi-size ICO file",
      blob: icoBlob,
      url,
      size: `${sizeKB} KB`,
    });

    current++;
    onProgress?.(current, total);
  }

  return assets;
}

/**
 * Generate a single asset at specified dimensions
 */
async function generateAsset(
  img: HTMLImageElement,
  width: number,
  height: number,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  canvas.width = width;
  canvas.height = height;

  // Use high-quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Check if this is a social media image (non-square aspect ratio)
  const isSocialMedia = width !== height;

  if (isSocialMedia) {
    // For social media images, use left-aligned composition with gradient on right
    // This creates a professional card-like appearance

    // Fill with a gradient background (left to right: blue to purple)
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#3b82f6"); // Blue-500
    gradient.addColorStop(1, "#a855f7"); // Purple-500
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Calculate size for the icon (use height as reference, with padding)
    const padding = height * 0.1; // 10% padding
    const iconSize = height - padding * 2;

    // Scale the image to fit the icon size while maintaining aspect ratio
    const scale = iconSize / Math.max(img.naturalWidth, img.naturalHeight);
    const scaledWidth = img.naturalWidth * scale;
    const scaledHeight = img.naturalHeight * scale;

    // Draw a white rounded rectangle background for the icon
    const iconBgSize = iconSize;
    const iconBgX = padding;
    const iconBgY = padding;
    const borderRadius = iconSize * 0.15; // 15% border radius

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(iconBgX, iconBgY, iconBgSize, iconBgSize, borderRadius);
    ctx.fill();

    // Draw the icon centered in the white background
    const iconX = iconBgX + (iconBgSize - scaledWidth) / 2;
    const iconY = iconBgY + (iconBgSize - scaledHeight) / 2;
    ctx.drawImage(img, iconX, iconY, scaledWidth, scaledHeight);

    // Add subtle shadow to the white background for depth
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;
  } else {
    // For square images (icons, favicons), scale to fill
    ctx.drawImage(img, 0, 0, width, height);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to generate asset"));
        }
      },
      "image/png",
      1.0,
    );
  });
}

/**
 * Load image from file
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
 * Download all assets as a ZIP file
 */
export async function downloadAssetsAsZip(
  assets: GeneratedAsset[],
  _packName: string,
): Promise<void> {
  // Note: This would require a ZIP library like JSZip
  // For now, we'll download individually
  console.log("ZIP download would include:", assets.length, "files");
  alert(
    `ZIP download feature coming soon! For now, download files individually.`,
  );
}
