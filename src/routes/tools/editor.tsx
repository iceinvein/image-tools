import { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Slider } from "@heroui/slider";
import { Chip } from "@heroui/chip";
import { ButtonGroup } from "@heroui/button";
import {
  Edit3,
  RotateCw,
  RotateCcw as RotateCcwIcon,
  Download,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Sun,
  Contrast as ContrastIcon,
  Droplets,
  Undo2,
  Sparkles,
  Image as ImageIcon
} from "lucide-react";


import { ImageUpload } from "@/components/image-upload";
import {
  loadImage,
  getImageDimensions,
  downloadBlob,
} from "@/utils/image-processing";

// Filter presets for quick application
const filterPresets = [
  { key: "none", label: "Original", brightness: 100, contrast: 100, saturation: 100 },
  { key: "vivid", label: "Vivid", brightness: 105, contrast: 115, saturation: 130 },
  { key: "warm", label: "Warm", brightness: 110, contrast: 105, saturation: 115 },
  { key: "cool", label: "Cool", brightness: 95, contrast: 110, saturation: 90 },
  { key: "bw", label: "B&W", brightness: 100, contrast: 110, saturation: 0 },
  { key: "vintage", label: "Vintage", brightness: 95, contrast: 90, saturation: 80 },
];

function EditorPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Transform settings
  const [rotation, setRotation] = useState<number>(0);
  const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false);
  const [flipVertical, setFlipVertical] = useState<boolean>(false);

  // Filter settings
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [selectedPreset, setSelectedPreset] = useState<string>("none");

  const handleImageSelect = async (file: File, imageUrl: string) => {
    setOriginalFile(file);
    setOriginalUrl(imageUrl);

    try {
      const dims = await getImageDimensions(file);
      setDimensions(dims);
      // Reset all adjustments
      resetAllAdjustments();
    } catch (error) {
      console.error("Failed to get image dimensions:", error);
    }
  };

  const resetAllAdjustments = () => {
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setSelectedPreset("none");
  };

  const applyPreset = (presetKey: string) => {
    const preset = filterPresets.find(p => p.key === presetKey);
    if (preset) {
      setBrightness(preset.brightness);
      setContrast(preset.contrast);
      setSaturation(preset.saturation);
      setSelectedPreset(presetKey);
    }
  };

  const rotateImage = (degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360);
  };

  // Get current dimensions accounting for rotation
  const getCurrentDimensions = () => {
    if (!dimensions) return null;
    const isRotated = rotation === 90 || rotation === 270;
    return {
      width: isRotated ? dimensions.height : dimensions.width,
      height: isRotated ? dimensions.width : dimensions.height,
    };
  };

  // Live preview effect - updates whenever any setting changes
  useEffect(() => {
    if (!originalFile || !dimensions || !canvasRef.current) return;

    const updatePreview = async () => {
      try {
        const img = await loadImage(originalFile);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Calculate canvas size based on rotation
        const isRotated = rotation === 90 || rotation === 270;
        canvas.width = isRotated ? dimensions.height : dimensions.width;
        canvas.height = isRotated ? dimensions.width : dimensions.height;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply transformations
        ctx.save();

        // Move to center for transformations
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // Apply rotation
        ctx.rotate((rotation * Math.PI) / 180);

        // Apply flips
        ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);

        // Apply filters
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

        // Draw image
        ctx.drawImage(
          img,
          -dimensions.width / 2,
          -dimensions.height / 2,
          dimensions.width,
          dimensions.height
        );

        ctx.restore();

        // Update preview URL
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
          }
        });
      } catch (error) {
        console.error("Preview update failed:", error);
      }
    };

    updatePreview();
  }, [originalFile, dimensions, rotation, flipHorizontal, flipVertical, brightness, contrast, saturation]);

  const handleDownload = async () => {
    if (!canvasRef.current || !originalFile) return;

    setIsProcessing(true);
    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvasRef.current?.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to process image"));
            }
          },
          originalFile.type,
          0.95
        );
      });

      const baseName = originalFile.name.replace(/\.[^/.]+$/, "");
      const extension = originalFile.name.split(".").pop() || "jpg";
      const filename = `${baseName}_edited.${extension}`;

      downloadBlob(blob, filename);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl("");
    setDimensions(null);
    setPreviewUrl("");
    resetAllAdjustments();
  };

  const hasAnyAdjustments = () => {
    return rotation !== 0 ||
           flipHorizontal ||
           flipVertical ||
           brightness !== 100 ||
           contrast !== 100 ||
           saturation !== 100;
  };

  return (
    <section className="py-8 md:py-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Header */}
          <div className="text-center mb-12 relative">
            {/* Animated background gradient */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
                <div className="relative p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-2xl">
                  <Edit3 className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent leading-tight pb-1">
                Image Editor
              </h1>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed">
              Edit with <span className="font-semibold text-purple-600 dark:text-purple-400">live preview</span>.
              Rotate, flip, and apply filters with instant visual feedback.
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Chip
                color="secondary"
                variant="shadow"
                className="px-4 py-1"
                startContent={<Sparkles className="w-4 h-4" />}
              >
                Live Preview
              </Chip>
              <Chip
                color="warning"
                variant="shadow"
                className="px-4 py-1"
                startContent={<RotateCw className="w-4 h-4" />}
              >
                Transform
              </Chip>
              <Chip
                color="success"
                variant="shadow"
                className="px-4 py-1"
                startContent={<Sun className="w-4 h-4" />}
              >
                Filters
              </Chip>
            </div>
          </div>

          <div className="space-y-6">
            {!originalFile ? (
              <ImageUpload onImageSelect={handleImageSelect} />
            ) : (
              <div className="space-y-4">
                {/* Live Preview Canvas with Toolbar */}
                <Card className="border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-b border-gray-200 dark:border-gray-700 p-3">
                    <div className="flex items-center justify-between w-full gap-4">
                      {/* Left: Image info */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <ImageIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        {dimensions && (
                          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 truncate">
                            <span className="truncate font-medium">{originalFile.name}</span>
                            <span className="text-gray-400">•</span>
                            <span className="whitespace-nowrap">
                              {getCurrentDimensions()?.width} × {getCurrentDimensions()?.height}
                              {rotation !== 0 && (
                                <span className="ml-1 text-purple-600 dark:text-purple-400 font-semibold">
                                  ({rotation}°)
                                </span>
                              )}
                            </span>
                            {hasAnyAdjustments() && (
                              <>
                                <span className="text-gray-400">•</span>
                                <Chip size="sm" color="warning" variant="flat" className="h-5">Modified</Chip>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Center: Quick action toolbar */}
                      <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                        <Button
                          size="sm"
                          variant="light"
                          isIconOnly
                          onPress={() => rotateImage(-90)}
                          className="min-w-8 h-8"
                          title="Rotate 90° Left"
                        >
                          <RotateCcwIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          isIconOnly
                          onPress={() => rotateImage(90)}
                          className="min-w-8 h-8"
                          title="Rotate 90° Right"
                        >
                          <RotateCw className="w-4 h-4" />
                        </Button>
                        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                        <Button
                          size="sm"
                          variant="light"
                          isIconOnly
                          color={flipHorizontal ? "primary" : "default"}
                          onPress={() => setFlipHorizontal(!flipHorizontal)}
                          className="min-w-8 h-8"
                          title="Flip Horizontal"
                        >
                          <FlipHorizontal className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="light"
                          isIconOnly
                          color={flipVertical ? "primary" : "default"}
                          onPress={() => setFlipVertical(!flipVertical)}
                          className="min-w-8 h-8"
                          title="Flip Vertical"
                        >
                          <FlipVertical className="w-4 h-4" />
                        </Button>
                        {hasAnyAdjustments() && (
                          <>
                            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                            <Button
                              size="sm"
                              variant="light"
                              isIconOnly
                              color="warning"
                              onPress={resetAllAdjustments}
                              className="min-w-8 h-8"
                              title="Reset All"
                            >
                              <Undo2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          color="success"
                          onPress={handleDownload}
                          isLoading={isProcessing}
                          className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          startContent={!isProcessing ? <Download className="w-4 h-4" /> : undefined}
                        >
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          color="danger"
                          onPress={handleReset}
                          isIconOnly
                          title="New Image"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="p-0">
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center min-h-[400px]">
                      {/* Checkerboard pattern for transparency */}
                      <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px'
                      }} />

                      <canvas
                        ref={canvasRef}
                        className="max-w-full max-h-[600px] object-contain rounded-lg shadow-2xl relative z-10"
                      />
                    </div>
                  </CardBody>
                </Card>

                {/* Filters - Compact Single Card */}
                <Card className="border border-gray-200 dark:border-gray-700 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-b border-gray-200 dark:border-gray-700 p-4">
                    <div className="w-full space-y-3">
                      <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-tight pb-0.5">
                        🎨 Filters & Adjustments
                      </h3>

                      {/* Filter Presets - Compact chips */}
                      <div className="flex flex-wrap gap-2">
                        {filterPresets.map((preset) => (
                          <Chip
                            key={preset.key}
                            variant={selectedPreset === preset.key ? "solid" : "bordered"}
                            color={selectedPreset === preset.key ? "secondary" : "default"}
                            className="cursor-pointer font-semibold"
                            onClick={() => applyPreset(preset.key)}
                          >
                            {preset.label}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="p-4 space-y-3">
                    {/* Brightness - Compact */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4 text-yellow-500" />
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Brightness</span>
                        </div>
                        <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                          {brightness}%
                        </span>
                      </div>
                      <Slider
                        value={brightness}
                        onChange={(value) => {
                          setBrightness(value as number);
                          setSelectedPreset("none");
                        }}
                        minValue={0}
                        maxValue={200}
                        step={1}
                        size="sm"
                        classNames={{
                          track: "bg-gradient-to-r from-yellow-200 to-orange-200 dark:from-yellow-900 dark:to-orange-900",
                          filler: "bg-gradient-to-r from-yellow-500 to-orange-500",
                          thumb: "bg-gradient-to-r from-yellow-600 to-orange-600",
                        }}
                      />
                    </div>

                    {/* Contrast - Compact */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ContrastIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Contrast</span>
                        </div>
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                          {contrast}%
                        </span>
                      </div>
                      <Slider
                        value={contrast}
                        onChange={(value) => {
                          setContrast(value as number);
                          setSelectedPreset("none");
                        }}
                        minValue={0}
                        maxValue={200}
                        step={1}
                        size="sm"
                        classNames={{
                          track: "bg-gradient-to-r from-gray-200 to-slate-200 dark:from-gray-900 dark:to-slate-900",
                          filler: "bg-gradient-to-r from-gray-500 to-slate-500",
                          thumb: "bg-gradient-to-r from-gray-600 to-slate-600",
                        }}
                      />
                    </div>

                    {/* Saturation - Compact */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-blue-500" />
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Saturation</span>
                        </div>
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {saturation}%
                        </span>
                      </div>
                      <Slider
                        value={saturation}
                        onChange={(value) => {
                          setSaturation(value as number);
                          setSelectedPreset("none");
                        }}
                        minValue={0}
                        maxValue={200}
                        step={1}
                        size="sm"
                        classNames={{
                          track: "bg-gradient-to-r from-blue-200 to-cyan-200 dark:from-blue-900 dark:to-cyan-900",
                          filler: "bg-gradient-to-r from-blue-500 to-cyan-500",
                          thumb: "bg-gradient-to-r from-blue-600 to-cyan-600",
                        }}
                      />
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        </div>
    </section>
  );
}

export const Route = createFileRoute("/tools/editor")({
  component: EditorPage,
});
