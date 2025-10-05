/**
 * ICO file format converter
 * Converts images to ICO format with multiple sizes
 */

interface IcoSize {
  width: number;
  height: number;
}

// Standard ICO sizes
export const ICO_SIZES: IcoSize[] = [
  { width: 16, height: 16 },
  { width: 32, height: 32 },
  { width: 48, height: 48 },
  { width: 64, height: 64 },
  { width: 128, height: 128 },
  { width: 256, height: 256 },
];

/**
 * Convert an image to ICO format
 * @param img - HTMLImageElement to convert
 * @param sizes - Array of sizes to include in the ICO file
 * @returns Blob containing the ICO file
 */
export async function convertToIco(
  img: HTMLImageElement,
  sizes: IcoSize[] = ICO_SIZES,
): Promise<Blob> {
  // Generate PNG data for each size
  const pngDataArray: Uint8Array[] = [];

  for (const size of sizes) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    canvas.width = size.width;
    canvas.height = size.height;

    // Draw image scaled to size
    ctx.drawImage(img, 0, 0, size.width, size.height);

    // Convert to PNG blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create PNG blob"));
          }
        },
        "image/png",
        1.0,
      );
    });

    // Convert blob to Uint8Array
    const arrayBuffer = await blob.arrayBuffer();
    const pngData = new Uint8Array(arrayBuffer);
    pngDataArray.push(pngData);
  }

  // Build ICO file
  const icoData = buildIcoFile(pngDataArray, sizes);
  return new Blob([icoData.buffer as ArrayBuffer], { type: "image/x-icon" });
}

/**
 * Build ICO file structure from PNG data
 */
function buildIcoFile(
  pngDataArray: Uint8Array[],
  sizes: IcoSize[],
): Uint8Array {
  const numImages = pngDataArray.length;

  // Calculate total file size
  const headerSize = 6; // ICONDIR header
  const dirEntrySize = 16; // ICONDIRENTRY per image
  const dirSize = headerSize + dirEntrySize * numImages;

  let totalSize = dirSize;
  for (const pngData of pngDataArray) {
    totalSize += pngData.length;
  }

  // Create buffer for ICO file
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const uint8View = new Uint8Array(buffer);

  let offset = 0;

  // Write ICONDIR header
  view.setUint16(offset, 0, true); // Reserved (must be 0)
  offset += 2;
  view.setUint16(offset, 1, true); // Type (1 = ICO)
  offset += 2;
  view.setUint16(offset, numImages, true); // Number of images
  offset += 2;

  // Write ICONDIRENTRY for each image
  let imageOffset = dirSize;
  for (let i = 0; i < numImages; i++) {
    const size = sizes[i];
    const pngData = pngDataArray[i];

    // Width (0 means 256)
    view.setUint8(offset, size.width === 256 ? 0 : size.width);
    offset += 1;

    // Height (0 means 256)
    view.setUint8(offset, size.height === 256 ? 0 : size.height);
    offset += 1;

    // Color palette (0 = no palette)
    view.setUint8(offset, 0);
    offset += 1;

    // Reserved (must be 0)
    view.setUint8(offset, 0);
    offset += 1;

    // Color planes (0 or 1)
    view.setUint16(offset, 1, true);
    offset += 2;

    // Bits per pixel (32 for PNG)
    view.setUint16(offset, 32, true);
    offset += 2;

    // Size of image data
    view.setUint32(offset, pngData.length, true);
    offset += 4;

    // Offset to image data
    view.setUint32(offset, imageOffset, true);
    offset += 4;

    imageOffset += pngData.length;
  }

  // Write PNG data for each image
  for (const pngData of pngDataArray) {
    uint8View.set(pngData, offset);
    offset += pngData.length;
  }

  return uint8View;
}

/**
 * Get recommended ICO sizes based on image dimensions
 */
export function getRecommendedIcoSizes(
  width: number,
  height: number,
): IcoSize[] {
  const maxDimension = Math.max(width, height);

  // Filter sizes that are smaller than or equal to the original image
  return ICO_SIZES.filter(
    (size) => size.width <= maxDimension && size.height <= maxDimension,
  );
}

/**
 * Convert a File to ICO format
 */
export async function convertFileToIco(
  file: File,
  sizes?: IcoSize[],
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(url);

      try {
        // Use recommended sizes if not specified
        const icoSizes =
          sizes || getRecommendedIcoSizes(img.naturalWidth, img.naturalHeight);

        // Ensure at least one size
        if (icoSizes.length === 0) {
          icoSizes.push({ width: 32, height: 32 });
        }

        const icoBlob = await convertToIco(img, icoSizes);
        resolve(icoBlob);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}
