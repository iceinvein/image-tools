import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { Switch } from "@heroui/switch";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Download, Maximize2, RotateCcw } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
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
      <div className="relative flex min-h-[500px] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-gray-300 border-dashed bg-gradient-to-br from-gray-50 to-gray-100 dark:border-gray-600 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          layout
          className="relative overflow-hidden rounded-xl border-4 border-white shadow-2xl dark:border-gray-800"
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
            className="h-full w-full object-cover"
          />

          {/* Overlay with dimensions */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 hover:opacity-100">
            <div className="rounded-lg bg-black/90 px-4 py-2 font-bold text-lg text-white backdrop-blur-sm">
              {debouncedWidth} × {debouncedHeight}
            </div>
          </div>

          {/* Corner dimension labels */}
          <div className="absolute top-2 left-2 rounded bg-green-500 px-2 py-1 font-bold text-white text-xs">
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:border-blue-800 dark:from-blue-950/30 dark:to-blue-900/30">
          <CardBody className="p-4 text-center">
            <div className="mb-1 font-medium text-blue-600 text-sm dark:text-blue-400">
              Original
            </div>
            <div className="font-bold text-blue-800 text-lg dark:text-blue-200">
              {originalDimensions.width} × {originalDimensions.height}
            </div>
          </CardBody>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:border-green-800 dark:from-green-950/30 dark:to-green-900/30">
          <CardBody className="p-4 text-center">
            <div className="mb-1 font-medium text-green-600 text-sm dark:text-green-400">
              Target
            </div>
            <div className="font-bold text-green-800 text-lg dark:text-green-200">
              {debouncedWidth} × {debouncedHeight}
            </div>
          </CardBody>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 dark:border-purple-800 dark:from-purple-950/30 dark:to-purple-900/30">
          <CardBody className="p-4 text-center">
            <div className="mb-1 font-medium text-purple-600 text-sm dark:text-purple-400">
              Scale
            </div>
            <div className="font-bold text-lg text-purple-800 dark:text-purple-200">
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
    <section className="min-h-screen py-8 md:py-10">
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
      <div className="mx-auto max-w-7xl px-4">
        {/* Hero Header */}
        <div className="relative mb-12 text-center">
          {/* Animated background gradient */}
          <div className="-z-10 absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-green-500/10 blur-3xl" />
            <div className="absolute top-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-emerald-500/10 blur-3xl delay-1000" />
          </div>

          <div className="mb-6 inline-flex h-20 w-20 animate-float items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30 shadow-lg">
            <Maximize2 className="h-10 w-10 text-white" />
          </div>

          <h1 className="mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text pb-2 font-black text-4xl text-transparent leading-tight md:text-5xl dark:from-green-400 dark:to-emerald-400">
            Image Resizer
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-gray-600 text-lg dark:text-gray-400">
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
          <div className="mx-auto max-w-2xl">
            <ImageUpload onImageSelect={handleImageSelect} />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto max-w-7xl space-y-6"
          >
            {/* Compact Side-by-Side Layout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardBody className="p-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Left: Live Preview */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-700 text-sm dark:text-gray-300">
                          Live Preview
                        </h3>
                        <div className="flex items-center gap-2">
                          <Chip size="sm" variant="flat" color="success">
                            {targetWidth} × {targetHeight}
                          </Chip>
                          {originalDimensions && (
                            <Chip size="sm" variant="flat" color="default">
                              {Math.round(
                                (targetWidth / originalDimensions.width) * 100,
                              )}
                              %
                            </Chip>
                          )}
                        </div>
                      </div>
                      <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                        {originalDimensions && (
                          <AnimatedPreview
                            imageUrl={originalUrl}
                            originalDimensions={originalDimensions}
                            targetWidth={targetWidth}
                            targetHeight={targetHeight}
                          />
                        )}
                      </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-700 text-sm dark:text-gray-300">
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
                        <p className="mb-2 font-medium text-gray-600 text-xs dark:text-gray-400">
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
                              className="text-xs"
                            >
                              {preset.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Scale Slider */}
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium text-gray-600 text-xs dark:text-gray-400">
                            Custom Scale
                          </span>
                          <span className="font-bold text-green-600 text-sm dark:text-green-400">
                            {scalePercentage}%
                          </span>
                        </div>
                        <Slider
                          size="sm"
                          value={scalePercentage}
                          onChange={(value) =>
                            handleScaleChange(value as number)
                          }
                          minValue={10}
                          maxValue={300}
                          step={5}
                          aria-label="Scale percentage"
                          classNames={{
                            track: "bg-gray-200 dark:bg-gray-700",
                            filler:
                              "bg-gradient-to-r from-green-500 to-emerald-500",
                            thumb: "bg-green-600",
                          }}
                        />
                        <div className="mt-1 flex justify-between text-gray-400 text-xs">
                          <span>10%</span>
                          <span>300%</span>
                        </div>
                      </div>

                      {/* Dimension Inputs */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1 block font-medium text-gray-600 text-xs dark:text-gray-400">
                            Width (px)
                          </label>
                          <Input
                            type="number"
                            size="sm"
                            value={targetWidth.toString()}
                            onChange={(e) =>
                              handleWidthChange(Number(e.target.value))
                            }
                            min={1}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block font-medium text-gray-600 text-xs dark:text-gray-400">
                            Height (px)
                          </label>
                          <Input
                            type="number"
                            size="sm"
                            value={targetHeight.toString()}
                            onChange={(e) =>
                              handleHeightChange(Number(e.target.value))
                            }
                            min={1}
                          />
                        </div>
                      </div>

                      {/* Presets */}
                      <div>
                        <label className="mb-2 block font-medium text-gray-600 text-xs dark:text-gray-400">
                          Common Presets
                        </label>
                        <Select
                          size="sm"
                          selectedKeys={[selectedPreset]}
                          onChange={(e) => handlePresetChange(e.target.value)}
                          aria-label="Preset sizes"
                        >
                          {presets.map((preset) => (
                            <SelectItem key={preset.key}>
                              {preset.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>

                      {/* Target Size Display */}
                      {newDimensions && originalDimensions && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">
                              {originalDimensions.width} ×{" "}
                              {originalDimensions.height}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                              {newDimensions.width} × {newDimensions.height}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Compact Action Bar */}
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardBody className="p-4">
                  <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                    <div className="flex-1 text-gray-600 text-sm dark:text-gray-400">
                      {resizedUrl ? (
                        <span className="font-medium text-green-600 dark:text-green-400">
                          ✓ Image resized successfully
                        </span>
                      ) : (
                        <span>Adjust settings and click resize</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="lg"
                        variant="bordered"
                        onPress={handleReset}
                        startContent={<RotateCcw className="h-4 w-4" />}
                        className="flex-1 sm:flex-initial"
                      >
                        New
                      </Button>
                      <Button
                        size="lg"
                        color="primary"
                        onPress={handleResize}
                        isLoading={isProcessing}
                        className="flex-1 font-bold sm:flex-initial"
                        startContent={
                          !isProcessing ? (
                            <Maximize2 className="h-4 w-4" />
                          ) : undefined
                        }
                      >
                        {isProcessing ? "Resizing..." : "Resize"}
                      </Button>
                      {resizedUrl && (
                        <Button
                          size="lg"
                          color="success"
                          onPress={handleDownload}
                          startContent={<Download className="h-4 w-4" />}
                          className="flex-1 font-bold sm:flex-initial"
                        >
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export const Route = createFileRoute("/tools/resizer")({
  component: ResizerPage,
});
