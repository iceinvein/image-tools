import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Slider } from "@heroui/slider";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Contrast as ContrastIcon,
  Download,
  Droplets,
  Edit3,
  FlipHorizontal,
  FlipVertical,
  Image as ImageIcon,
  RotateCcw,
  RotateCcw as RotateCcwIcon,
  RotateCw,
  Sun,
  Undo2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import {
  createBreadcrumbSchema,
  createSoftwareApplicationSchema,
  SEO,
} from "@/components/seo";
import {
  downloadBlob,
  getImageDimensions,
  loadImage,
} from "@/utils/image-processing";

// Filter presets for quick application
const filterPresets = [
  {
    key: "none",
    label: "Original",
    brightness: 100,
    contrast: 100,
    saturation: 100,
  },
  {
    key: "vivid",
    label: "Vivid",
    brightness: 105,
    contrast: 115,
    saturation: 130,
  },
  {
    key: "warm",
    label: "Warm",
    brightness: 110,
    contrast: 105,
    saturation: 115,
  },
  { key: "cool", label: "Cool", brightness: 95, contrast: 110, saturation: 90 },
  { key: "bw", label: "B&W", brightness: 100, contrast: 110, saturation: 0 },
  {
    key: "vintage",
    label: "Vintage",
    brightness: 95,
    contrast: 90,
    saturation: 80,
  },
];

function EditorPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  // removed unused originalUrl for cohesive branding cleanup
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // removed unused previewUrl for cohesive branding cleanup

  // Transform settings
  const [rotation, setRotation] = useState<number>(0);
  const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false);
  const [flipVertical, setFlipVertical] = useState<boolean>(false);

  // Filter settings
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [selectedPreset, setSelectedPreset] = useState<string>("none");

  const handleImageSelect = async (file: File, _imageUrl: string) => {
    setOriginalFile(file);
    // originalUrl removed

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
    const preset = filterPresets.find((p) => p.key === presetKey);
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
        const canvasWidth = isRotated ? dimensions.height : dimensions.width;
        const canvasHeight = isRotated ? dimensions.width : dimensions.height;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

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

        // Draw image centered (use original dimensions for drawing)
        ctx.drawImage(
          img,
          -dimensions.width / 2,
          -dimensions.height / 2,
          dimensions.width,
          dimensions.height,
        );

        ctx.restore();

        // Preview URL removed for branding cleanup
      } catch (error) {
        console.error("Preview update failed:", error);
      }
    };

    updatePreview();
  }, [
    originalFile,
    dimensions,
    rotation,
    flipHorizontal,
    flipVertical,
    brightness,
    contrast,
    saturation,
  ]);

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
          0.95,
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
    // originalUrl removed
    setDimensions(null);
    // previewUrl removed
    resetAllAdjustments();
  };

  const hasAnyAdjustments = () => {
    return (
      rotation !== 0 ||
      flipHorizontal ||
      flipVertical ||
      brightness !== 100 ||
      contrast !== 100 ||
      saturation !== 100
    );
  };

  return (
    <section className="min-h-screen py-8 md:py-10">
      <SEO
        title="Image Editor - Crop, Rotate, Filter & Enhance Images | Image Tools"
        description="Free online image editor. Crop, rotate, flip, and apply filters to your images. Adjust brightness, contrast, and saturation. 100% browser-based editing."
        keywords="image editor, crop image, rotate image, flip image, image filters, brightness, contrast, saturation, online photo editor"
        canonicalUrl="https://image-utilities.netlify.app/tools/editor"
        structuredData={{
          ...createSoftwareApplicationSchema(
            "Image Editor",
            "Crop, rotate, flip, and apply filters to images with adjustable brightness, contrast, and saturation",
          ),
          ...createBreadcrumbSchema([
            { name: "Home", url: "https://image-utilities.netlify.app/" },
            {
              name: "Image Editor",
              url: "https://image-utilities.netlify.app/tools/editor",
            },
          ]),
        }}
      />
      <div className="mx-auto max-w-7xl px-4">
        {/* Hero Header */}
        <div className="relative mb-12 text-center">
          {/* Animated background gradient */}
          <div className="-z-10 absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl" />
            <div className="absolute top-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-pink-500/10 blur-3xl delay-1000" />
          </div>

          <div className="mb-6 inline-flex h-20 w-20 animate-float items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30">
            <Edit3 className="h-10 w-10 text-white" />
          </div>

          <h1 className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text pb-2 font-black text-4xl text-transparent leading-tight md:text-5xl dark:from-purple-400 dark:to-pink-400">
            Image Editor
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-gray-600 text-lg dark:text-gray-400">
            Edit with live preview. Rotate, flip, and apply filters with instant
            visual feedback.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Chip color="secondary" variant="flat" size="sm">
              Live Preview
            </Chip>
            <Chip color="warning" variant="flat" size="sm">
              Transform
            </Chip>
            <Chip color="success" variant="flat" size="sm">
              Filters
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
            className="space-y-6"
          >
            {/* Live Preview Canvas with Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="overflow-hidden border border-gray-200 shadow-xl dark:border-gray-700">
                <CardHeader className="border-gray-200 border-b bg-gradient-to-r from-blue-50 to-purple-50 p-3 dark:border-gray-700 dark:from-blue-950/30 dark:to-purple-950/30">
                  <div className="flex w-full items-center justify-between gap-4">
                    {/* Left: Image info */}
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <ImageIcon className="h-5 w-5 flex-shrink-0 text-purple-600 dark:text-purple-400" />
                      {dimensions && (
                        <div className="flex items-center gap-3 truncate text-gray-600 text-xs dark:text-gray-400">
                          <span className="truncate font-medium">
                            {originalFile.name}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="whitespace-nowrap">
                            {getCurrentDimensions()?.width} ×{" "}
                            {getCurrentDimensions()?.height}
                            {rotation !== 0 && (
                              <span className="ml-1 font-semibold text-purple-600 dark:text-purple-400">
                                ({rotation}°)
                              </span>
                            )}
                          </span>
                          {hasAnyAdjustments() && (
                            <>
                              <span className="text-gray-400">•</span>
                              <Chip
                                size="sm"
                                color="warning"
                                variant="flat"
                                className="h-5"
                              >
                                Modified
                              </Chip>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Center: Quick action toolbar */}
                    <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
                      <Button
                        size="sm"
                        variant="light"
                        isIconOnly
                        onPress={() => rotateImage(-90)}
                        className="h-8 min-w-8"
                        title="Rotate 90° Left"
                      >
                        <RotateCcwIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        isIconOnly
                        onPress={() => rotateImage(90)}
                        className="h-8 min-w-8"
                        title="Rotate 90° Right"
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                      <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />
                      <Button
                        size="sm"
                        variant="light"
                        isIconOnly
                        color={flipHorizontal ? "primary" : "default"}
                        onPress={() => setFlipHorizontal(!flipHorizontal)}
                        className="h-8 min-w-8"
                        title="Flip Horizontal"
                      >
                        <FlipHorizontal className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        isIconOnly
                        color={flipVertical ? "primary" : "default"}
                        onPress={() => setFlipVertical(!flipVertical)}
                        className="h-8 min-w-8"
                        title="Flip Vertical"
                      >
                        <FlipVertical className="h-4 w-4" />
                      </Button>
                      {hasAnyAdjustments() && (
                        <>
                          <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />
                          <Button
                            size="sm"
                            variant="light"
                            isIconOnly
                            color="warning"
                            onPress={resetAllAdjustments}
                            className="h-8 min-w-8"
                            title="Reset All"
                          >
                            <Undo2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onPress={handleDownload}
                        isLoading={isProcessing}
                        className="overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-white shadow-lg transition-all duration-300 hover:scale-102"
                        startContent={
                          !isProcessing ? (
                            <Download className="h-4 w-4" />
                          ) : undefined
                        }
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
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="p-0">
                  <div className="relative flex min-h-[400px] items-center justify-center overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 p-6 dark:from-gray-900 dark:to-gray-800">
                    {/* Checkerboard pattern for transparency */}
                    <div className="checkerboard absolute inset-0 opacity-10" />

                    <div className="relative z-10 flex max-h-[600px] max-w-full items-center justify-center">
                      <canvas
                        ref={canvasRef}
                        className="rounded-lg shadow-2xl"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "600px",
                          width: "auto",
                          height: "auto",
                        }}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Filters - Compact Single Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="border border-gray-200 shadow-xl dark:border-gray-700">
                <CardHeader className="border-gray-200 border-b bg-gradient-to-r from-blue-50 to-purple-50 p-4 dark:border-gray-700 dark:from-blue-950/30 dark:to-purple-950/30">
                  <div className="w-full space-y-3">
                    <h3 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text pb-0.5 font-bold text-lg text-transparent leading-tight">
                      🎨 Filters & Adjustments
                    </h3>

                    {/* Filter Presets - Compact chips */}
                    <div className="flex flex-wrap gap-2">
                      {filterPresets.map((preset) => (
                        <Chip
                          key={preset.key}
                          variant={
                            selectedPreset === preset.key ? "solid" : "bordered"
                          }
                          color={
                            selectedPreset === preset.key
                              ? "secondary"
                              : "default"
                          }
                          className="cursor-pointer font-semibold"
                          onClick={() => applyPreset(preset.key)}
                        >
                          {preset.label}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="space-y-3 p-4">
                  {/* Brightness - Compact */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold text-gray-700 text-xs dark:text-gray-300">
                          Brightness
                        </span>
                      </div>
                      <span className="font-bold text-sm text-yellow-600 dark:text-yellow-400">
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
                        track:
                          "bg-gradient-to-r from-yellow-200 to-orange-200 dark:from-yellow-900 dark:to-orange-900",
                        filler:
                          "bg-gradient-to-r from-yellow-500 to-orange-500",
                        thumb: "bg-gradient-to-r from-yellow-600 to-orange-600",
                      }}
                    />
                  </div>

                  {/* Contrast - Compact */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ContrastIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <span className="font-semibold text-gray-700 text-xs dark:text-gray-300">
                          Contrast
                        </span>
                      </div>
                      <span className="font-bold text-gray-600 text-sm dark:text-gray-400">
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
                        track:
                          "bg-gradient-to-r from-gray-200 to-slate-200 dark:from-gray-900 dark:to-slate-900",
                        filler: "bg-gradient-to-r from-gray-500 to-slate-500",
                        thumb: "bg-gradient-to-r from-gray-600 to-slate-600",
                      }}
                    />
                  </div>

                  {/* Saturation - Compact */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold text-gray-700 text-xs dark:text-gray-300">
                          Saturation
                        </span>
                      </div>
                      <span className="font-bold text-blue-600 text-sm dark:text-blue-400">
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
                        track:
                          "bg-gradient-to-r from-blue-200 to-cyan-200 dark:from-blue-900 dark:to-cyan-900",
                        filler: "bg-gradient-to-r from-blue-500 to-cyan-500",
                        thumb: "bg-gradient-to-r from-blue-600 to-cyan-600",
                      }}
                    />
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

export const Route = createFileRoute("/tools/editor")({
  component: EditorPage,
});
