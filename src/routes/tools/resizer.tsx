import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { Switch } from "@heroui/switch";
import { Tab, Tabs } from "@heroui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Download,
  Grid3x3,
  Lock,
  Maximize2,
  Percent,
  RotateCcw,
  Sliders,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { ImagePreview } from "@/components/image-preview";
import { ImageUpload } from "@/components/image-upload";
import {
  createBreadcrumbSchema,
  createSoftwareApplicationSchema,
  SEO,
} from "@/components/seo";
import {
  calculateDimensions,
  downloadBlob,
  getImageDimensions,
  resizeImage,
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

// Custom hook for debounced state
function useDebouncedState<T>(value: T, duration: number = 0.3): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [value, duration]);

  return debouncedValue;
}

// Animated Preview Component
interface AnimatedPreviewProps {
  imageUrl: string;
  originalDimensions: { width: number; height: number };
  targetWidth: number;
  targetHeight: number;
}

function AnimatedPreview({
  imageUrl,
  originalDimensions,
  targetWidth,
  targetHeight,
}: AnimatedPreviewProps) {
  const debouncedWidth = useDebouncedState(targetWidth);
  const debouncedHeight = useDebouncedState(targetHeight);

  // Calculate aspect ratio for the preview container
  const aspectRatio = debouncedWidth / debouncedHeight;

  // Calculate scale for display with more generous space (max 600px width)
  const maxPreviewWidth = 600;
  const maxPreviewHeight = 400;
  const scaleByWidth = maxPreviewWidth / debouncedWidth;
  const scaleByHeight = maxPreviewHeight / debouncedHeight;
  const scale = Math.min(scaleByWidth, scaleByHeight, 1);
  const displayWidth = debouncedWidth * scale;
  const displayHeight = debouncedHeight * scale;

  return (
    <div className="space-y-6">
      {/* Large animated preview container */}
      <div className="relative flex items-center justify-center min-h-[500px] w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
        <motion.div
          layout
          className="relative overflow-hidden rounded-xl shadow-2xl border-4 border-white dark:border-gray-800"
          style={{
            width: displayWidth,
            height: displayHeight,
            aspectRatio: aspectRatio,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <img
            src={imageUrl}
            alt="Live Preview"
            className="w-full h-full object-cover"
          />

          {/* Overlay with dimensions */}
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="bg-black/90 text-white px-4 py-2 rounded-lg text-lg font-bold backdrop-blur-sm">
              {debouncedWidth} × {debouncedHeight}
            </div>
          </div>

          {/* Corner dimension labels */}
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
            {Math.round((debouncedWidth / originalDimensions.width) * 100)}%
          </div>
        </motion.div>

        {/* Background grid pattern for better visual reference */}
        <div
          className="absolute inset-0 opacity-10 dark:opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle, #666 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      {/* Info cards below preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
          <CardBody className="p-4 text-center">
            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
              Original
            </div>
            <div className="text-lg font-bold text-blue-800 dark:text-blue-200">
              {originalDimensions.width} × {originalDimensions.height}
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800">
          <CardBody className="p-4 text-center">
            <div className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">
              Target
            </div>
            <div className="text-lg font-bold text-green-800 dark:text-green-200">
              {debouncedWidth} × {debouncedHeight}
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
          <CardBody className="p-4 text-center">
            <div className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">
              Scale
            </div>
            <div className="text-lg font-bold text-purple-800 dark:text-purple-200">
              {Math.round((debouncedWidth / originalDimensions.width) * 100)}%
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function ResizerPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [resizedUrl, setResizedUrl] = useState<string>("");
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [newDimensions, setNewDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [selectedPreset, setSelectedPreset] = useState<string>("custom");
  const [isProcessing, setIsProcessing] = useState(false);
  const [resizeMode, setResizeMode] = useState<
    "percentage" | "dimensions" | "presets"
  >("percentage");
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
      setScalePercentage(
        Math.round((height / originalDimensions.height) * 100),
      );
    }
  };

  const updatePreviewDimensions = useCallback(() => {
    if (!originalDimensions) return;

    const calculated = calculateDimensions(
      originalDimensions.width,
      originalDimensions.height,
      targetWidth,
      targetHeight,
      maintainAspectRatio,
    );
    setNewDimensions(calculated);
  }, [originalDimensions, targetWidth, targetHeight, maintainAspectRatio]);

  const handleResize = async () => {
    if (!originalFile) return;

    setIsProcessing(true);
    try {
      const blob = await resizeImage(
        originalFile,
        targetWidth,
        targetHeight,
        maintainAspectRatio,
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
  }, [updatePreviewDimensions]);

  return (
    <section className="py-8 md:py-10 min-h-screen">
      <SEO
        title="Image Resizer - Resize Images Online with Smart Presets | Image Tools"
        description="Free online image resizer. Resize images by pixels, percentage, or use smart presets. Maintain aspect ratio or customize dimensions. 100% browser-based."
        keywords="image resizer, image, scale image, image dimensions, resize photo, image size, aspect ratio, online image resizer"
        canonicalUrl="https://image-utilities.netlify.app/tools/resizer"
        structuredData={{
          ...createSoftwareApplicationSchema(
            "Image Resizer",
            "Resize images by pixels, percentage, or use smart presets with aspect ratio control",
          ),
          ...createBreadcrumbSchema([
            { name: "Home", url: "https://image-utilities.netlify.app/" },
            {
              name: "Image Resizer",
              url: "https://image-utilities.netlify.app/tools/resizer",
            },
          ]),
        }}
      />
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Header */}
        <div className="text-center mb-12 relative">
          {/* Animated background gradient */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-lg shadow-green-500/30 animate-float">
            <Maximize2 className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight pb-2 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
            Image Resizer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            Scale your images to perfect dimensions. Smart presets and custom
            sizing with aspect ratio lock.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Chip color="success" variant="flat" size="sm">
              Precision control
            </Chip>
            <Chip color="primary" variant="flat" size="sm">
              Aspect ratio lock
            </Chip>
          </div>
        </div>

        {/* Main Content */}
        {!originalFile ? (
          <div className="max-w-2xl mx-auto">
            <ImageUpload onImageSelect={handleImageSelect} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top section - Live Preview with more space */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  🎯 Live Preview
                </h2>
                <Button
                  variant="bordered"
                  size="sm"
                  onPress={handleReset}
                  startContent={<RotateCcw className="w-4 h-4" />}
                >
                  New Image
                </Button>
              </div>

              {/* Animated preview */}
              {originalDimensions && (
                <div className="w-full">
                  <Card className="border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent leading-tight pb-0.5">
                            Live Preview
                          </h3>
                          <Chip color="success" variant="flat" size="sm">
                            {targetWidth} × {targetHeight}
                          </Chip>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Scale:{" "}
                          {Math.round(
                            (targetWidth / originalDimensions.width) * 100,
                          )}
                          %
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody className="p-8">
                      <AnimatedPreview
                        imageUrl={originalUrl}
                        originalDimensions={originalDimensions}
                        targetWidth={targetWidth}
                        targetHeight={targetHeight}
                      />
                    </CardBody>
                  </Card>
                </div>
              )}
            </div>

            {/* Bottom section - Controls */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  📐 Resize Controls
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Adjust the settings below to see the preview update in
                  real-time
                </p>
              </div>

              <Card className="border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight pb-0.5">
                    📐 Resize Settings
                  </h3>
                </CardHeader>
                <CardBody className="p-6">
                  <Tabs
                    selectedKey={resizeMode}
                    onSelectionChange={(key) =>
                      setResizeMode(
                        key as "percentage" | "dimensions" | "presets",
                      )
                    }
                    aria-label="Resize mode"
                    classNames={{
                      tabList:
                        "gap-2 w-full bg-gray-100 dark:bg-gray-900 p-1 rounded-xl mb-6",
                      cursor:
                        "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg",
                      tab: "px-3 py-2 font-semibold text-sm",
                      tabContent: "group-data-[selected=true]:text-white",
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
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Quick Scale
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {scalePresets.map((preset) => (
                              <Button
                                key={preset.value}
                                size="sm"
                                variant={
                                  scalePercentage === preset.value
                                    ? "solid"
                                    : "bordered"
                                }
                                color={
                                  scalePercentage === preset.value
                                    ? "success"
                                    : "default"
                                }
                                onPress={() => handleScaleChange(preset.value)}
                                className="font-bold"
                              >
                                {preset.label}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Scale slider */}
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                              Custom Scale
                            </span>
                            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {scalePercentage}%
                            </span>
                          </div>
                          <Slider
                            value={scalePercentage}
                            onChange={(value) =>
                              handleScaleChange(value as number)
                            }
                            minValue={10}
                            maxValue={300}
                            step={5}
                            classNames={{
                              track:
                                "bg-gradient-to-r from-green-200 to-emerald-200 dark:from-green-900 dark:to-emerald-900",
                              filler:
                                "bg-gradient-to-r from-green-500 to-emerald-500",
                              thumb:
                                "bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg",
                            }}
                          />
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                            <span>10%</span>
                            <span>300%</span>
                          </div>
                        </div>

                        {/* Size preview with visual comparison */}
                        {originalDimensions && (
                          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                  Original:
                                </span>
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                  {originalDimensions.width} ×{" "}
                                  {originalDimensions.height}
                                </span>
                              </div>

                              {/* Visual size comparison bars */}
                              <div className="space-y-2">
                                <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${Math.min((targetWidth / originalDimensions.width) * 100, 100)}%`,
                                    }}
                                  />
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    Width: {scalePercentage}%
                                  </span>
                                  {scalePercentage !== 100 && (
                                    <span
                                      className={`font-bold ${scalePercentage > 100 ? "text-orange-600" : "text-green-600"}`}
                                    >
                                      {scalePercentage > 100 ? "↑" : "↓"}{" "}
                                      {Math.abs(100 - scalePercentage)}%
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-blue-200 dark:border-blue-800">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                  New size:
                                </span>
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
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                              Width
                            </span>
                            <Input
                              type="number"
                              value={targetWidth.toString()}
                              onChange={(e) =>
                                handleWidthChange(Number(e.target.value))
                              }
                              min={1}
                              max={5000}
                              size="sm"
                              className="w-24"
                              endContent={
                                <span className="text-xs text-gray-400">
                                  px
                                </span>
                              }
                              classNames={{
                                input: "text-right font-bold",
                              }}
                            />
                          </div>
                          <Slider
                            value={targetWidth}
                            onChange={(value) =>
                              handleWidthChange(value as number)
                            }
                            minValue={1}
                            maxValue={
                              originalDimensions
                                ? Math.max(originalDimensions.width * 2, 2000)
                                : 2000
                            }
                            step={1}
                            classNames={{
                              filler:
                                "bg-gradient-to-r from-blue-500 to-cyan-500",
                              thumb:
                                "bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg",
                            }}
                          />
                        </div>

                        {/* Height slider */}
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                              Height
                            </span>
                            <Input
                              type="number"
                              value={targetHeight.toString()}
                              onChange={(e) =>
                                handleHeightChange(Number(e.target.value))
                              }
                              min={1}
                              max={5000}
                              size="sm"
                              className="w-24"
                              endContent={
                                <span className="text-xs text-gray-400">
                                  px
                                </span>
                              }
                              classNames={{
                                input: "text-right font-bold",
                              }}
                            />
                          </div>
                          <Slider
                            value={targetHeight}
                            onChange={(value) =>
                              handleHeightChange(value as number)
                            }
                            minValue={1}
                            maxValue={
                              originalDimensions
                                ? Math.max(originalDimensions.height * 2, 2000)
                                : 2000
                            }
                            step={1}
                            classNames={{
                              filler:
                                "bg-gradient-to-r from-purple-500 to-pink-500",
                              thumb:
                                "bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg",
                            }}
                          />
                        </div>

                        {/* Aspect ratio lock */}
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                          <Switch
                            isSelected={maintainAspectRatio}
                            onValueChange={setMaintainAspectRatio}
                            classNames={{
                              wrapper:
                                "group-data-[selected=true]:bg-gradient-to-r from-green-500 to-emerald-500",
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              <span className="font-semibold">
                                Lock aspect ratio
                              </span>
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
                            trigger:
                              "border-2 hover:border-primary transition-colors",
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
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                  Target size:
                                </span>
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
                    size="lg"
                    onPress={handleResize}
                    isLoading={isProcessing}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:scale-102 transition-all duration-300 w-full mt-6 font-bold text-base overflow-hidden"
                    startContent={
                      !isProcessing ? (
                        <Maximize2 className="w-5 h-5" />
                      ) : undefined
                    }
                  >
                    {isProcessing ? "Resizing..." : "Resize Image"}
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* Results section - shown below the main layout */}
        {resizedUrl && (
          <div className="mt-12 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-full">
                <span className="text-2xl">✅</span>
                <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Resize Complete!
                </span>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <ImagePreview
                imageUrl={resizedUrl}
                title="📏 Resized Image"
                fileName={`resized_${targetWidth}x${targetHeight}.jpg`}
                fileSize={resizedBlob?.size}
                dimensions={newDimensions ?? undefined}
              />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onPress={handleDownload}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:scale-102 transition-all duration-300 font-bold overflow-hidden"
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
    </section>
  );
}

export const Route = createFileRoute("/tools/resizer")({
  component: ResizerPage,
});
