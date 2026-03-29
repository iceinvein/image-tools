import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import { memo } from "react";

export const formats = [
  { key: "image/png", label: "PNG", extension: "png" },
  { key: "image/jpeg", label: "JPEG", extension: "jpg" },
  { key: "image/webp", label: "WebP", extension: "webp" },
];

export const presets = [
  { key: "custom", label: "Custom Size", category: "custom" },
  { key: "1920x1080", label: "Full HD (1920×1080)", category: "screen" },
  { key: "1280x720", label: "HD (1280×720)", category: "screen" },
  { key: "800x600", label: "SVGA (800×600)", category: "screen" },
  { key: "640x480", label: "VGA (640×480)", category: "screen" },
  { key: "300x300", label: "Square Small (300×300)", category: "square" },
  { key: "500x500", label: "Square Medium (500×500)", category: "square" },
  { key: "1000x1000", label: "Square Large (1000×1000)", category: "square" },
];

export const scalePresets = [
  { value: 25, label: "25%" },
  { value: 50, label: "50%" },
  { value: 75, label: "75%" },
  { value: 100, label: "100%" },
  { value: 150, label: "150%" },
  { value: 200, label: "200%" },
];

export const fitMethods = [
  {
    key: "scale",
    label: "Scale to Fit",
    description: "Maintain aspect ratio, canvas shrinks",
  },
  {
    key: "contain",
    label: "Contain (Padding)",
    description: "Fit inside target with padding",
  },
  {
    key: "cover",
    label: "Cover (Crop)",
    description: "Fill target, crop edges if needed",
  },
  {
    key: "stretch",
    label: "Stretch",
    description: "Fill target by stretching image",
  },
];

export type FitMethod = "scale" | "contain" | "cover" | "stretch";

interface ResizerControlsProps {
  maintainAspectRatio: boolean;
  setMaintainAspectRatio: (value: boolean) => void;
  scalePercentage: number;
  handleScaleChange: (percentage: number) => void;
  fitMethod: FitMethod;
  setFitMethod: (value: FitMethod) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  targetWidth: number;
  handleWidthChange: (width: number) => void;
  targetHeight: number;
  handleHeightChange: (height: number) => void;
  selectedPreset: string;
  handlePresetChange: (preset: string) => void;
  targetFormat: string;
  setTargetFormat: (format: string) => void;
  originalDimensions: { width: number; height: number };
  newDimensions: { width: number; height: number } | null;
}

export const ResizerControls = memo(function ResizerControls({
  maintainAspectRatio,
  setMaintainAspectRatio,
  scalePercentage,
  handleScaleChange,
  fitMethod,
  setFitMethod,
  backgroundColor,
  setBackgroundColor,
  targetWidth,
  handleWidthChange,
  targetHeight,
  handleHeightChange,
  selectedPreset,
  handlePresetChange,
  targetFormat,
  setTargetFormat,
  originalDimensions,
  newDimensions,
}: ResizerControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">
          Resize Settings
        </h3>
        <Switch
          size="sm"
          isSelected={maintainAspectRatio}
          onValueChange={setMaintainAspectRatio}
        >
          <span className="text-xs">Lock Aspect</span>
        </Switch>
      </div>

      {/* Quick Scale Buttons */}
      <div>
        <p className="mb-2 font-medium text-xs text-zinc-500 dark:text-zinc-400">
          Quick Scale
        </p>
        <div className="grid grid-cols-3 gap-2">
          {scalePresets.map((preset) => (
            <Button
              key={preset.value}
              size="sm"
              variant={scalePercentage === preset.value ? "solid" : "bordered"}
              color={scalePercentage === preset.value ? "primary" : "default"}
              onPress={() => handleScaleChange(preset.value)}
              className="text-xs"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Fit Method Selection */}
      <div>
        <label className="mb-2 block font-medium text-xs text-zinc-500 dark:text-zinc-400">
          Fit Method
        </label>
        <Select
          size="sm"
          selectedKeys={[fitMethod]}
          onChange={(e) => setFitMethod(e.target.value as FitMethod)}
          aria-label="Fit method"
        >
          {fitMethods.map((method) => (
            <SelectItem key={method.key} description={method.description}>
              {method.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Background Color Selection (only for Contain) */}
      {fitMethod === "contain" && (
        <div>
          <label className="mb-2 block font-medium text-xs text-zinc-500 dark:text-zinc-400">
            Background Color
          </label>
          <div className="flex flex-wrap gap-2">
            {["transparent", "#ffffff", "#000000", "#f3f4f6"].map((color) => (
              <button
                key={color}
                type="button"
                className={`h-8 w-8 rounded-full border ${backgroundColor === color ? "border-zinc-500 dark:border-zinc-400" : "border-zinc-200 dark:border-zinc-700"}`}
                style={{
                  backgroundColor: color === "transparent" ? "white" : color,
                  backgroundImage:
                    color === "transparent"
                      ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                      : "none",
                  backgroundSize: "8px 8px",
                }}
                onClick={() => setBackgroundColor(color)}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Dimension Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block font-medium text-xs text-zinc-500 dark:text-zinc-400">
            Width (px)
          </label>
          <Input
            type="number"
            size="sm"
            value={targetWidth.toString()}
            onChange={(e) => handleWidthChange(Number(e.target.value))}
            min={1}
          />
        </div>
        <div>
          <label className="mb-1 block font-medium text-xs text-zinc-500 dark:text-zinc-400">
            Height (px)
          </label>
          <Input
            type="number"
            size="sm"
            value={targetHeight.toString()}
            onChange={(e) => handleHeightChange(Number(e.target.value))}
            min={1}
          />
        </div>
      </div>

      {/* Presets */}
      <div>
        <label className="mb-2 block font-medium text-xs text-zinc-500 dark:text-zinc-400">
          Common Presets
        </label>
        <Select
          size="sm"
          selectedKeys={[selectedPreset]}
          onChange={(e) => handlePresetChange(e.target.value)}
          aria-label="Preset sizes"
        >
          {presets.map((preset) => (
            <SelectItem key={preset.key}>{preset.label}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Target Format selection (useful for SVGs) */}
      <div>
        <label className="mb-2 block font-medium text-xs text-zinc-500 dark:text-zinc-400">
          Output Format
        </label>
        <Select
          size="sm"
          selectedKeys={[targetFormat]}
          onChange={(e) => setTargetFormat(e.target.value)}
          aria-label="Output format"
        >
          {formats.map((f) => (
            <SelectItem key={f.key}>{f.label}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Target Size Display */}
      {newDimensions && originalDimensions && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">
              {originalDimensions.width} x {originalDimensions.height}
            </span>
            <span className="text-zinc-400">→</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-50">
              {Math.round(newDimensions.width)} x{" "}
              {Math.round(newDimensions.height)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});
