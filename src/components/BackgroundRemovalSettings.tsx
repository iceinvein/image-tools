import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import { useId, useState } from "react";
import {
  type BackgroundRemovalSettings,
  defaultSettings,
  getOutputTypeDescription,
  modelPresets,
} from "../utils/background-remover";

interface BackgroundRemovalSettingsProps {
  settings: BackgroundRemovalSettings;
  onSettingsChange: (settings: BackgroundRemovalSettings) => void;
  isProcessing?: boolean;
}

export function BackgroundRemovalSettingsComponent({
  settings,
  onSettingsChange,
  isProcessing = false,
}: BackgroundRemovalSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const outputFormatId = useId();
  const outputTypeId = useId();
  const qualityId = useId();
  const deviceId = useId();

  const handlePresetChange = (preset: keyof typeof modelPresets) => {
    onSettingsChange({
      ...settings,
      model: modelPresets[preset].model,
    });
  };

  const resetToDefaults = () => {
    onSettingsChange(defaultSettings);
  };

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Advanced Settings
            </span>
          </div>
          <Button
            size="sm"
            variant="light"
            onPress={() => setIsExpanded(!isExpanded)}
            isDisabled={isProcessing}
            className="min-w-0 px-2"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardBody className="pt-0 space-y-4">
          {/* Quality Presets */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Quality Preset
            </div>
            <div className="flex gap-2">
              {Object.entries(modelPresets).map(([key, preset]) => (
                <Button
                  key={key}
                  size="sm"
                  variant={
                    settings.model === preset.model ? "solid" : "bordered"
                  }
                  color={
                    settings.model === preset.model ? "primary" : "default"
                  }
                  onPress={() =>
                    handlePresetChange(key as keyof typeof modelPresets)
                  }
                  isDisabled={isProcessing}
                  className="flex-1"
                >
                  {key === "fast" && <Zap className="w-3 h-3 mr-1" />}
                  {key === "balanced" && <Clock className="w-3 h-3 mr-1" />}
                  {key === "quality" && <Sparkles className="w-3 h-3 mr-1" />}
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {
                modelPresets[
                  (Object.keys(modelPresets).find(
                    (key) =>
                      modelPresets[key as keyof typeof modelPresets].model ===
                      settings.model,
                  ) as keyof typeof modelPresets) || "balanced"
                ].description
              }
            </p>
          </div>

          <Divider />

          {/* Output Format */}
          <div className="space-y-2">
            <label
              htmlFor={outputFormatId}
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Output Format
            </label>
            <Select
              id={outputFormatId}
              selectedKeys={[settings.outputFormat]}
              onSelectionChange={(keys) => {
                const format = Array.from(
                  keys,
                )[0] as BackgroundRemovalSettings["outputFormat"];
                onSettingsChange({ ...settings, outputFormat: format });
              }}
              isDisabled={isProcessing}
              size="sm"
            >
              <SelectItem key="image/png">
                PNG (Transparent background)
              </SelectItem>
              <SelectItem key="image/jpeg">JPEG (Solid background)</SelectItem>
              <SelectItem key="image/webp">WebP (Modern format)</SelectItem>
            </Select>
          </div>

          {/* Output Type */}
          <div className="space-y-2">
            <label
              htmlFor={outputTypeId}
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Output Type
            </label>
            <Select
              id={outputTypeId}
              selectedKeys={[settings.outputType]}
              onSelectionChange={(keys) => {
                const type = Array.from(
                  keys,
                )[0] as BackgroundRemovalSettings["outputType"];
                onSettingsChange({ ...settings, outputType: type });
              }}
              isDisabled={isProcessing}
              size="sm"
            >
              <SelectItem key="foreground">
                Foreground - Subject only
              </SelectItem>
              <SelectItem key="background">
                Background - Background only
              </SelectItem>
              <SelectItem key="mask">Mask - Black and white mask</SelectItem>
            </Select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {getOutputTypeDescription(settings.outputType)}
            </p>
          </div>

          {/* Quality Slider (for JPEG/WebP) */}
          {(settings.outputFormat === "image/jpeg" ||
            settings.outputFormat === "image/webp") && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={qualityId}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Quality
                </label>
                <Chip size="sm" variant="flat">
                  {Math.round(settings.quality * 100)}%
                </Chip>
              </div>
              <Slider
                id={qualityId}
                value={settings.quality}
                onChange={(value) => {
                  onSettingsChange({
                    ...settings,
                    quality: Array.isArray(value) ? value[0] : value,
                  });
                }}
                minValue={0.1}
                maxValue={1.0}
                step={0.1}
                isDisabled={isProcessing}
                size="sm"
                color="primary"
              />
            </div>
          )}

          {/* Processing Device */}
          <div className="space-y-2">
            <label
              htmlFor={deviceId}
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Processing Device
            </label>
            <Select
              id={deviceId}
              selectedKeys={[settings.device]}
              onSelectionChange={(keys) => {
                const device = Array.from(
                  keys,
                )[0] as BackgroundRemovalSettings["device"];
                onSettingsChange({ ...settings, device });
              }}
              isDisabled={isProcessing}
              size="sm"
            >
              <SelectItem key="auto">Auto (GPU if available)</SelectItem>
              <SelectItem key="gpu">GPU (WebGPU)</SelectItem>
              <SelectItem key="cpu">CPU (More compatible)</SelectItem>
            </Select>
          </div>

          <Divider />

          {/* Reset Button */}
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="flat"
              onPress={resetToDefaults}
              isDisabled={isProcessing}
            >
              Reset to Defaults
            </Button>
          </div>
        </CardBody>
      )}
    </Card>
  );
}

// Export with the original name for backward compatibility
export { BackgroundRemovalSettingsComponent as BackgroundRemovalSettings };
