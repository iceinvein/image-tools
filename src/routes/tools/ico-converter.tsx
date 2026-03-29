import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Download, FileImage, Info, RotateCcw } from "lucide-react";
import { useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import {
  createBreadcrumbSchema,
  createSoftwareApplicationSchema,
  SEO,
} from "@/components/seo";
import { convertFileToIco } from "@/utils/ico-converter";
import { downloadBlob, getImageDimensions } from "@/utils/image-processing";

export const Route = createFileRoute("/tools/ico-converter")({
  component: IcoConverterPage,
});

interface IcoSize {
  width: number;
  height: number;
  label: string;
}

const ALL_SIZES: IcoSize[] = [
  { width: 16, height: 16, label: "16×16" },
  { width: 24, height: 24, label: "24×24" },
  { width: 32, height: 32, label: "32×32" },
  { width: 48, height: 48, label: "48×48" },
  { width: 64, height: 64, label: "64×64" },
  { width: 128, height: 128, label: "128×128" },
  { width: 256, height: 256, label: "256×256" },
];

const PRESETS = {
  favicon: {
    name: "Favicon",
    description: "Standard website favicon sizes",
    sizes: ["16×16", "32×32", "48×48"],
  },
  windows: {
    name: "Windows Icons",
    description: "Windows desktop and taskbar icons",
    sizes: ["16×16", "32×32", "48×48", "256×256"],
  },
  comprehensive: {
    name: "Comprehensive",
    description: "All sizes for maximum compatibility",
    sizes: ALL_SIZES.map((s) => s.label),
  },
  custom: {
    name: "Custom",
    description: "Select your own sizes",
    sizes: [],
  },
};

function IcoConverterPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [originalDimensions, setOriginalDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    PRESETS.favicon.sizes,
  );
  const [selectedPreset, setSelectedPreset] = useState<string>("favicon");
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = async (file: File, imageUrl: string) => {
    setOriginalFile(file);
    setOriginalUrl(imageUrl);
    setConvertedBlob(null);
    setError(null);

    const dimensions = await getImageDimensions(file);
    setOriginalDimensions(dimensions);
  };

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    if (preset !== "custom") {
      setSelectedSizes(PRESETS[preset as keyof typeof PRESETS].sizes);
    }
  };

  const handleConvert = async () => {
    if (!originalFile || selectedSizes.length === 0) return;

    setIsProcessing(true);
    setError(null);
    try {
      const sizesToConvert = ALL_SIZES.filter((size) =>
        selectedSizes.includes(size.label),
      );

      const blob = await convertFileToIco(originalFile, sizesToConvert);
      setConvertedBlob(blob);
    } catch (err) {
      console.error("Conversion failed:", err);
      setError("Failed to convert image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!convertedBlob || !originalFile) return;

    const baseName = originalFile.name.replace(/\.[^/.]+$/, "");
    downloadBlob(convertedBlob, `${baseName}.ico`);
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl("");
    setOriginalDimensions(null);
    setConvertedBlob(null);
    setSelectedSizes(PRESETS.favicon.sizes);
    setSelectedPreset("favicon");
    setError(null);
  };

  const getAvailableSizes = () => {
    if (originalFile?.type === "image/svg+xml") return ALL_SIZES;
    if (!originalDimensions) return ALL_SIZES;

    const maxDim = Math.max(
      originalDimensions.width,
      originalDimensions.height,
    );
    return ALL_SIZES.filter((size) => size.width <= maxDim);
  };

  const availableSizes = getAvailableSizes();

  return (
    <section className="py-8 md:py-10">
      <SEO
        title="ICO Converter - Create Favicon & Windows Icons | Image Tools"
        description="Convert images to ICO format with custom size selection. Create favicons, Windows icons, and app icons with multiple resolutions in one file. Free browser-based ICO converter."
        keywords="ico converter, favicon generator, create favicon, windows icon, app icon, ico file, multi-size icon, favicon maker, icon converter, svg to ico, svg favicon"
        canonicalUrl="https://image-utilities.netlify.app/tools/ico-converter"
        structuredData={{
          ...createSoftwareApplicationSchema(
            "ICO Converter",
            "Convert images to ICO format with custom size selection for favicons and icons",
          ),
          ...createBreadcrumbSchema([
            { name: "Home", url: "https://image-utilities.netlify.app/" },
            {
              name: "ICO Converter",
              url: "https://image-utilities.netlify.app/tools/ico-converter",
            },
          ]),
        }}
      />
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              <FileImage className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-zinc-900 dark:text-zinc-50">
                ICO Converter
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Create multi-resolution ICO files for favicons and Windows icons
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {!originalFile ? (
          <div>
            <ImageUpload
              onImageSelect={handleImageSelect}
              acceptedFormats={[
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/gif",
                "image/svg+xml",
              ]}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Image Preview + Size Selection */}
            <Card className="border border-zinc-200 dark:border-zinc-800">
              <CardBody className="p-6">
                <div className="flex flex-col gap-6 lg:flex-row">
                  {/* Image Preview */}
                  <div className="flex-shrink-0 lg:w-64">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">
                          Original Image
                        </h3>
                        {originalDimensions && (
                          <Chip size="sm" variant="flat" color="default">
                            {originalDimensions.width} ×{" "}
                            {originalDimensions.height}
                          </Chip>
                        )}
                      </div>
                      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                        <img
                          src={originalUrl}
                          alt="Original"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div className="flex-1 space-y-4">
                    {/* Presets */}
                    <div>
                      <div className="mb-2 font-semibold text-sm text-zinc-700 dark:text-zinc-300">
                        Quick Presets
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {Object.entries(PRESETS).map(([key, preset]) => (
                          <Button
                            key={key}
                            size="sm"
                            variant={
                              selectedPreset === key ? "solid" : "bordered"
                            }
                            color={
                              selectedPreset === key ? "primary" : "default"
                            }
                            onPress={() => handlePresetChange(key)}
                            className="h-auto justify-start py-2"
                          >
                            <div className="text-left">
                              <div className="font-semibold text-xs">
                                {preset.name}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Size Selection */}
                    <div>
                      <div className="mb-2 font-semibold text-sm text-zinc-700 dark:text-zinc-300">
                        Select Sizes ({selectedSizes.length} selected)
                      </div>
                      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
                        {availableSizes.map((size) => {
                          const isSelected = selectedSizes.includes(size.label);
                          return (
                            <Button
                              key={size.label}
                              size="sm"
                              variant={isSelected ? "solid" : "bordered"}
                              color={isSelected ? "success" : "default"}
                              onPress={() => {
                                if (isSelected) {
                                  setSelectedSizes(
                                    selectedSizes.filter(
                                      (s) => s !== size.label,
                                    ),
                                  );
                                } else {
                                  setSelectedSizes([
                                    ...selectedSizes,
                                    size.label,
                                  ]);
                                }
                                setSelectedPreset("custom");
                              }}
                              startContent={
                                isSelected ? (
                                  <Check className="h-3 w-3" />
                                ) : undefined
                              }
                              className="text-xs"
                            >
                              {size.label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    {originalDimensions &&
                      availableSizes.length < ALL_SIZES.length && (
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-2 dark:border-yellow-800 dark:bg-yellow-950/30">
                          <div className="flex items-start gap-2">
                            <Info className="mt-0.5 h-3 w-3 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
                            <p className="text-xs text-yellow-700 dark:text-yellow-300">
                              Some sizes unavailable. Upload larger image for
                              more options.
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Error message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
                <p className="font-medium text-red-600 text-sm dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Action Bar */}
            <Card className="border border-zinc-200 dark:border-zinc-800">
              <CardBody className="p-4">
                <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <div className="flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {selectedSizes.length > 0 ? (
                      <span>
                        <strong className="text-zinc-900 dark:text-zinc-100">
                          {selectedSizes.length} size
                          {selectedSizes.length !== 1 ? "s" : ""}
                        </strong>{" "}
                        selected for ICO file
                      </span>
                    ) : (
                      <span>Select at least one size to create ICO file</span>
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
                      onPress={handleConvert}
                      isLoading={isProcessing}
                      isDisabled={selectedSizes.length === 0}
                      className="flex-1 font-bold sm:flex-initial"
                      startContent={
                        !isProcessing ? (
                          <FileImage className="h-4 w-4" />
                        ) : undefined
                      }
                    >
                      {isProcessing ? "Converting..." : "Create ICO"}
                    </Button>
                    {convertedBlob && (
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
          </div>
        )}
      </div>
    </section>
  );
}
