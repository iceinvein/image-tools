import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Slider } from "@heroui/slider";
import { createFileRoute } from "@tanstack/react-router";
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
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    setDownloadError(null);

    try {
      const dims = await getImageDimensions(file);
      setDimensions(dims);
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
    setDownloadError(null);
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
      setDownloadError("Failed to download image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setOriginalFile(null);
    setDimensions(null);
    setDownloadError(null);
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
    <section className="py-8 md:py-10">
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
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-zinc-900 dark:text-zinc-50">
                Image Editor
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Rotate, flip, and apply filters with live preview.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {!originalFile ? (
          <div>
            <ImageUpload onImageSelect={handleImageSelect} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Live Preview Canvas with Toolbar */}
            <Card className="overflow-hidden border border-zinc-200 dark:border-zinc-800">
              <CardHeader className="border-zinc-200 border-b bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex w-full items-center justify-between gap-4">
                  {/* Left: Image info */}
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <ImageIcon className="h-5 w-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
                    {dimensions && (
                      <div className="flex items-center gap-3 truncate text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="truncate font-medium">
                          {originalFile.name}
                        </span>
                        <span className="text-zinc-400 dark:text-zinc-600">•</span>
                        <span className="whitespace-nowrap">
                          {getCurrentDimensions()?.width} &times;{" "}
                          {getCurrentDimensions()?.height}
                          {rotation !== 0 && (
                            <span className="ml-1 font-semibold text-zinc-700 dark:text-zinc-300">
                              ({rotation}&deg;)
                            </span>
                          )}
                        </span>
                        {hasAnyAdjustments() && (
                          <>
                            <span className="text-zinc-400 dark:text-zinc-600">•</span>
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
                  <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-950">
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
                    <div className="mx-1 h-6 w-px bg-zinc-200 dark:bg-zinc-700" />
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
                        <div className="mx-1 h-6 w-px bg-zinc-200 dark:bg-zinc-700" />
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
                      color="primary"
                      onPress={handleDownload}
                      isLoading={isProcessing}
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
                {downloadError && (
                  <div className="border-zinc-200 border-b bg-red-50 px-4 py-2 text-red-700 text-sm dark:border-zinc-800 dark:bg-red-950/30 dark:text-red-400">
                    {downloadError}
                  </div>
                )}
                <div className="relative flex min-h-[400px] items-center justify-center overflow-auto bg-zinc-100 p-6 dark:bg-zinc-900">
                  {/* Checkerboard pattern for transparency */}
                  <div className="checkerboard absolute inset-0 opacity-10" />

                  <div className="relative z-10 flex max-h-[600px] max-w-full items-center justify-center">
                    <canvas
                      ref={canvasRef}
                      className="rounded-lg shadow-lg"
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

            {/* Filters - Compact Single Card */}
            <Card className="border border-zinc-200 dark:border-zinc-800">
              <CardHeader className="border-zinc-200 border-b bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="w-full space-y-3">
                  <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-50">
                    Filters &amp; Adjustments
                  </h3>

                  {/* Filter Presets */}
                  <div className="flex flex-wrap gap-2">
                    {filterPresets.map((preset) => (
                      <Chip
                        key={preset.key}
                        variant={
                          selectedPreset === preset.key ? "solid" : "bordered"
                        }
                        color={
                          selectedPreset === preset.key ? "primary" : "default"
                        }
                        className="cursor-pointer"
                        onClick={() => applyPreset(preset.key)}
                      >
                        {preset.label}
                      </Chip>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardBody className="space-y-4 p-4">
                {/* Brightness */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                      <span className="font-medium text-xs text-zinc-700 dark:text-zinc-300">
                        Brightness
                      </span>
                    </div>
                    <span className="font-semibold text-sm text-zinc-600 dark:text-zinc-400">
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
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ContrastIcon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                      <span className="font-medium text-xs text-zinc-700 dark:text-zinc-300">
                        Contrast
                      </span>
                    </div>
                    <span className="font-semibold text-sm text-zinc-600 dark:text-zinc-400">
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
                  />
                </div>

                {/* Saturation */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                      <span className="font-medium text-xs text-zinc-700 dark:text-zinc-300">
                        Saturation
                      </span>
                    </div>
                    <span className="font-semibold text-sm text-zinc-600 dark:text-zinc-400">
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
                  />
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}

export const Route = createFileRoute("/tools/editor")({
  component: EditorPage,
});
