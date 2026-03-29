import type { LucideIcon } from "lucide-react";
import {
  Crop,
  Edit3,
  Eraser,
  FileArchive,
  FileImage,
  Maximize2,
  Package,
  Palette,
  RefreshCw,
  Smartphone,
} from "lucide-react";

export type ToolDef = {
  key: string;
  label: string;
  hint: string;
  description?: string;
  icon: LucideIcon;
  path: string;
};

export type ToolGroup = {
  label: string;
  tools: ToolDef[];
};

export const toolGroups: ToolGroup[] = [
  {
    label: "Convert & Export",
    tools: [
      { key: "converter", label: "Converter", hint: "JPEG, PNG, WebP", description: "Convert between JPEG, PNG, and WebP with quality control and real-time before/after comparison.", icon: RefreshCw, path: "/tools/converter" },
      { key: "ico-converter", label: "ICO Converter", hint: "Favicons & icons", description: "Create multi-resolution ICO files for favicons and Windows icons from any image.", icon: FileImage, path: "/tools/ico-converter" },
      { key: "asset-generator", label: "Asset Generator", hint: "App icons & splash", description: "Generate platform-ready icon sets and splash screens for iOS, Android, and web.", icon: Package, path: "/tools/asset-generator" },
    ],
  },
  {
    label: "Edit & Transform",
    tools: [
      { key: "compressor", label: "Compressor", hint: "Reduce file size", description: "Reduce file sizes for web-optimized images while preserving visual quality.", icon: FileArchive, path: "/tools/compressor" },
      { key: "resizer", label: "Resizer", hint: "Dimensions & scale", description: "Scale images by pixel dimensions, percentage, or preset sizes. Aspect ratio lock and multiple fit methods.", icon: Maximize2, path: "/tools/resizer" },
      { key: "cropper", label: "Cropper", hint: "Trim & reframe", description: "Crop and reframe images with interactive selection and preset aspect ratios.", icon: Crop, path: "/tools/cropper" },
      { key: "editor", label: "Editor", hint: "Rotate, flip, adjust", description: "Rotate, flip, and apply filters to your images with real-time preview.", icon: Edit3, path: "/tools/editor" },
      { key: "background-remover", label: "BG Remover", hint: "AI-powered removal", description: "Remove image backgrounds automatically with AI, entirely in your browser.", icon: Eraser, path: "/tools/background-remover" },
    ],
  },
  {
    label: "Design",
    tools: [
      { key: "og-designer", label: "OG Designer", hint: "Open Graph images", description: "Design Open Graph images for social media with templates and customization.", icon: Palette, path: "/tools/og-designer" },
      { key: "playstore-designer", label: "Play Store", hint: "Feature graphics", description: "Create Google Play Store feature graphics (1024x500) with professional templates.", icon: Smartphone, path: "/tools/playstore-designer" },
    ],
  },
];

export const allTools: ToolDef[] = toolGroups.flatMap((g) => g.tools);

export const featuredToolKeys = ["converter", "compressor", "resizer"];

export const featuredTools = allTools.filter((t) =>
  featuredToolKeys.includes(t.key),
);
