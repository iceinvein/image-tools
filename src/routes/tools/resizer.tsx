import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Slider } from "@heroui/slider";
import { Tabs, Tab } from "@heroui/tabs";
import { Maximize2, Download, RotateCcw, Ruler, Lock, Percent, Sliders, Grid3x3 } from "lucide-react";


import { ImageUpload } from "@/components/image-upload";
import { ImagePreview } from "@/components/image-preview";
import {
  resizeImage,
  getImageDimensions,
  downloadBlob,
  calculateDimensions,
} from "@/utils/image-processing";

const presets = [
  { key: "custom", label: "Custom Size", category: "custom" },
  { key: "1920x1080", label: "Full HD (1920×1080)", category: "screen" },
  { key: "1280x720", label: "HD (1280×720)", category: "screen" },
  { key: "800x600", label: "SVGA (800×600)", category: "screen" },
  { key: "640x480", label: "VGA (640×480)", category: "screen" },
  { key: "300x300", label: "Square Small (300×300)", category: "square" },
  { key: "500x500", label: "Square Medium (500×500)", category: "square" },
  { key: "1000x1000", label: "Square Large (1000×1000)", category: "square" },
];

const scalePresets = [
  { value: 25, label: "25%" },
  { value: 50, label: "50%" },
  { value: 75, label: "75%" },
  { value: 100, label: "100%" },
  { value: 150, label: "150%" },
  { value: 200, label: "200%" },
];

function ResizerPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [resizedUrl, setResizedUrl] = useState<string>("");
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [newDimensions, setNewDimensions] = useState<{ width: number; height: number } | null>(null);
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [selectedPreset, setSelectedPreset] = useState<string>("custom");
  const [isProcessing, setIsProcessing] = useState(false);
  const [resizeMode, setResizeMode] = useState<"percentage" | "dimensions" | "presets">("percentage");
  const [scalePercentage, setScalePercentage] = useState<number>(100);

  const handleImageSelect = async (file: File, imageUrl: string) => {
    setOriginalFile(file);
    setOriginalUrl(imageUrl);
    setResizedUrl("");
    setResizedBlob(null);
    
    try {
      const dims = await getImageDimensions(file);
      setOriginalDimensions(dims);
      setTargetWidth(dims.width);
      setTargetHeight(dims.height);
    } catch (error) {
      console.error("Failed to get image dimensions:", error);
    }
  };

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    if (preset !== "custom") {
      const [width, height] = preset.split("x").map(Number);
      setTargetWidth(width);
      setTargetHeight(height);
    }
  };

  const handleScaleChange = (percentage: number) => {
    if (!originalDimensions) return;
    setScalePercentage(percentage);
    const scale = percentage / 100;
    setTargetWidth(Math.round(originalDimensions.width * scale));
    setTargetHeight(Math.round(originalDimensions.height * scale));
  };

  const handleWidthChange = (width: number) => {
    setTargetWidth(width);
    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setTargetHeight(Math.round(width / aspectRatio));
    }
    // Update scale percentage
    if (originalDimensions) {
      setScalePercentage(Math.round((width / originalDimensions.width) * 100));
    }
  };

  const handleHeightChange = (height: number) => {
    setTargetHeight(height);
    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setTargetWidth(Math.round(height * aspectRatio));
    }
    // Update scale percentage
    if (originalDimensions) {
      setScalePercentage(Math.round((height / originalDimensions.height) * 100));
    }
  };

  const updatePreviewDimensions = () => {
    if (!originalDimensions) return;

    const calculated = calculateDimensions(
      originalDimensions.width,
      originalDimensions.height,
      targetWidth,
      targetHeight,
      maintainAspectRatio
    );
    setNewDimensions(calculated);
  };

  const handleResize = async () => {
    if (!originalFile) return;

    setIsProcessing(true);
    try {
      const blob = await resizeImage(
        originalFile,
        targetWidth,
        targetHeight,
        maintainAspectRatio
      );
      setResizedBlob(blob);
      
      const url = URL.createObjectURL(blob);
      setResizedUrl(url);
    } catch (error) {
      console.error("Resize failed:", error);
      alert("Failed to resize image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resizedBlob || !originalFile) return;

    const baseName = originalFile.name.replace(/\.[^/.]+$/, "");
    const extension = originalFile.name.split(".").pop() || "jpg";
    const filename = `${baseName}_resized_${targetWidth}x${targetHeight}.${extension}`;
    
    downloadBlob(resizedBlob, filename);
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl("");
    setResizedUrl("");
    setResizedBlob(null);
    setOriginalDimensions(null);
    setNewDimensions(null);
  };

  // Update preview dimensions when values change
  React.useEffect(() => {
    updatePreviewDimensions();
  }, [targetWidth, targetHeight, maintainAspectRatio, originalDimensions]);

  return (
    <section className="py-8 md:py-10 min-h-screen">
        <div className="max-w-4xl mx-auto px-4">
          {/* Hero Header */}
          <div className="text-center mb-12 relative">
            {/* Animated background gradient */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
                <div className="relative p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-2xl">
                  <Maximize2 className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight pb-1">
                Image Resizer
              </h1>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed">
              Scale your images to <span className="font-semibold text-green-600 dark:text-green-400">perfect dimensions</span>.
              Smart presets and custom sizing with aspect ratio lock.
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Chip
                color="success"
                variant="shadow"
                className="px-4 py-1"
                startContent={<Ruler className="w-4 h-4" />}
              >
                Precision control
              </Chip>
              <Chip
                color="primary"
                variant="shadow"
                className="px-4 py-1"
                startContent={<Lock className="w-4 h-4" />}
              >
                Aspect ratio lock
              </Chip>
            </div>
          </div>

          <div className="space-y-6">
            {!originalFile ? (
              <ImageUpload onImageSelect={handleImageSelect} />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ImagePreview
                  imageUrl={originalUrl}
                  title="Original Image"
                  fileName={originalFile.name}
                  fileSize={originalFile.size}
                  dimensions={originalDimensions}
                  onRemove={handleReset}
                />

                <Card className="border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent leading-tight pb-0.5">
                      📐 Resize Settings
                    </h3>
                  </CardHeader>
                  <CardBody className="p-6">
                    <Tabs
                      selectedKey={resizeMode}
                      onSelectionChange={(key) => setResizeMode(key as "percentage" | "dimensions" | "presets")}
                      aria-label="Resize mode"
                      classNames={{
                        tabList: "gap-2 w-full bg-gray-100 dark:bg-gray-900 p-1 rounded-xl mb-6",
                        cursor: "bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg",
                        tab: "px-3 py-2 font-semibold text-sm",
                        tabContent: "group-data-[selected=true]:text-white"
                      }}
                    >
                      {/* Percentage Mode */}
                      <Tab
                        key="percentage"
                        title={
                          <div className="flex items-center gap-2">
                            <Percent className="w-4 h-4" />
                            <span>Scale</span>
                          </div>
                        }
                      >
                        <div className="space-y-6 pt-4">
                          {/* Quick scale buttons */}
                          <div>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Quick Scale</p>
                            <div className="grid grid-cols-3 gap-2">
                              {scalePresets.map((preset) => (
                                <Button
                                  key={preset.value}
                                  size="sm"
                                  variant={scalePercentage === preset.value ? "solid" : "bordered"}
                                  color={scalePercentage === preset.value ? "success" : "default"}
                                  onPress={() => handleScaleChange(preset.value)}
                                  className="font-bold"
                                >
                                  {preset.label}
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Scale slider */}
                          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-800">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                Custom Scale
                              </span>
                              <span className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                {scalePercentage}%
                              </span>
                            </div>
                            <Slider
                              value={scalePercentage}
                              onChange={(value) => handleScaleChange(value as number)}
                              minValue={10}
                              maxValue={300}
                              step={5}
                              classNames={{
                                track: "bg-gradient-to-r from-green-200 to-emerald-200 dark:from-green-900 dark:to-emerald-900",
                                filler: "bg-gradient-to-r from-green-500 to-emerald-500",
                                thumb: "bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg",
                              }}
                            />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                              <span>10%</span>
                              <span>300%</span>
                            </div>
                          </div>

                          {/* Size preview with visual comparison */}
                          {originalDimensions && (
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Original:</span>
                                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                    {originalDimensions.width} × {originalDimensions.height}
                                  </span>
                                </div>

                                {/* Visual size comparison bars */}
                                <div className="space-y-2">
                                  <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                      className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                                      style={{ width: `${Math.min((targetWidth / originalDimensions.width) * 100, 100)}%` }}
                                    />
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500 dark:text-gray-400">Width: {scalePercentage}%</span>
                                    {scalePercentage !== 100 && (
                                      <span className={`font-bold ${scalePercentage > 100 ? 'text-orange-600' : 'text-green-600'}`}>
                                        {scalePercentage > 100 ? '↑' : '↓'} {Math.abs(100 - scalePercentage)}%
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-blue-200 dark:border-blue-800">
                                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">New size:</span>
                                  <span className="text-lg font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {targetWidth} × {targetHeight}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </Tab>

                      {/* Dimensions Mode */}
                      <Tab
                        key="dimensions"
                        title={
                          <div className="flex items-center gap-2">
                            <Sliders className="w-4 h-4" />
                            <span>Exact</span>
                          </div>
                        }
                      >
                        <div className="space-y-6 pt-4">
                          {/* Width slider */}
                          <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Width</span>
                              <Input
                                type="number"
                                value={targetWidth.toString()}
                                onChange={(e) => handleWidthChange(Number(e.target.value))}
                                min={1}
                                max={5000}
                                size="sm"
                                className="w-24"
                                endContent={<span className="text-xs text-gray-400">px</span>}
                                classNames={{
                                  input: "text-right font-bold",
                                }}
                              />
                            </div>
                            <Slider
                              value={targetWidth}
                              onChange={(value) => handleWidthChange(value as number)}
                              minValue={1}
                              maxValue={originalDimensions ? Math.max(originalDimensions.width * 2, 2000) : 2000}
                              step={1}
                              classNames={{
                                filler: "bg-gradient-to-r from-blue-500 to-cyan-500",
                                thumb: "bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg",
                              }}
                            />
                          </div>

                          {/* Height slider */}
                          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200 dark:border-purple-800">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Height</span>
                              <Input
                                type="number"
                                value={targetHeight.toString()}
                                onChange={(e) => handleHeightChange(Number(e.target.value))}
                                min={1}
                                max={5000}
                                size="sm"
                                className="w-24"
                                endContent={<span className="text-xs text-gray-400">px</span>}
                                classNames={{
                                  input: "text-right font-bold",
                                }}
                              />
                            </div>
                            <Slider
                              value={targetHeight}
                              onChange={(value) => handleHeightChange(value as number)}
                              minValue={1}
                              maxValue={originalDimensions ? Math.max(originalDimensions.height * 2, 2000) : 2000}
                              step={1}
                              classNames={{
                                filler: "bg-gradient-to-r from-purple-500 to-pink-500",
                                thumb: "bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg",
                              }}
                            />
                          </div>

                          {/* Aspect ratio lock */}
                          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-800">
                            <Switch
                              isSelected={maintainAspectRatio}
                              onValueChange={setMaintainAspectRatio}
                              classNames={{
                                wrapper: "group-data-[selected=true]:bg-gradient-to-r from-green-500 to-emerald-500",
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                <span className="font-semibold">Lock aspect ratio</span>
                              </div>
                            </Switch>
                          </div>
                        </div>
                      </Tab>

                      {/* Presets Mode */}
                      <Tab
                        key="presets"
                        title={
                          <div className="flex items-center gap-2">
                            <Grid3x3 className="w-4 h-4" />
                            <span>Presets</span>
                          </div>
                        }
                      >
                        <div className="space-y-6 pt-4">
                          <Select
                            label="Size Preset"
                            labelPlacement="outside"
                            placeholder="Select preset"
                            selectedKeys={[selectedPreset]}
                            onSelectionChange={(keys) => {
                              const selected = Array.from(keys)[0] as string;
                              handlePresetChange(selected);
                            }}
                            classNames={{
                              trigger: "border-2 hover:border-primary transition-colors",
                            }}
                          >
                            {presets.map((preset) => (
                              <SelectItem key={preset.key}>
                                {preset.label}
                              </SelectItem>
                            ))}
                          </Select>

                          {newDimensions && (
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Target size:</span>
                                  <span className="text-lg font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {newDimensions.width} × {newDimensions.height}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </Tab>
                    </Tabs>

                    <Button
                      color="primary"
                      size="lg"
                      onPress={handleResize}
                      isLoading={isProcessing}
                      className="w-full mt-6 font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      startContent={!isProcessing ? <Maximize2 className="w-5 h-5" /> : undefined}
                    >
                      {isProcessing ? "Resizing..." : "Resize Image"}
                    </Button>
                  </CardBody>
                </Card>
              </div>
            )}

            {resizedUrl && (
              <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-full">
                    <span className="text-2xl">✅</span>
                    <span className="font-bold text-green-700 dark:text-green-300">Resize Complete!</span>
                  </div>
                </div>

                <ImagePreview
                  imageUrl={resizedUrl}
                  title="📏 Resized Image"
                  fileName={`resized_${targetWidth}x${targetHeight}.jpg`}
                  fileSize={resizedBlob?.size}
                  dimensions={newDimensions ?? undefined}
                />

                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    color="success"
                    size="lg"
                    onPress={handleDownload}
                    className="font-bold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    startContent={<Download className="w-5 h-5" />}
                  >
                    Download Image
                  </Button>
                  <Button
                    variant="bordered"
                    size="lg"
                    onPress={handleReset}
                    className="font-semibold border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                    startContent={<RotateCcw className="w-5 h-5" />}
                  >
                    Resize Another
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
    </section>
  );
}

export const Route = createFileRoute("/tools/resizer")({
  component: ResizerPage,
});
