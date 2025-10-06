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

  const handleImageSelect = async (file: File, imageUrl: string) => {
    setOriginalFile(file);
    setOriginalUrl(imageUrl);
    setConvertedBlob(null);

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
    try {
      // Convert selected size labels to size objects
      const sizesToConvert = ALL_SIZES.filter((size) =>
        selectedSizes.includes(size.label),
      );

      const blob = await convertFileToIco(originalFile, sizesToConvert);
      setConvertedBlob(blob);
    } catch (error) {
      console.error("Conversion failed:", error);
      alert("Failed to convert image. Please try again.");
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
  };

  const getAvailableSizes = () => {
    if (!originalDimensions) return ALL_SIZES;

    const maxDim = Math.max(
      originalDimensions.width,
      originalDimensions.height,
    );
    return ALL_SIZES.filter((size) => size.width <= maxDim);
  };

  const availableSizes = getAvailableSizes();

  return (
    <section className="py-8 md:py-10 min-h-screen">
      <SEO
        title="ICO Converter - Create Favicon & Windows Icons | Image Tools"
        description="Convert images to ICO format with custom size selection. Create favicons, Windows icons, and app icons with multiple resolutions in one file. Free browser-based ICO converter."
        keywords="ico converter, favicon generator, create favicon, windows icon, app icon, ico file, multi-size icon, favicon maker, icon converter"
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
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight pb-2 bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
            ICO Converter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            Create multi-resolution ICO files for favicons, Windows icons, and
            app icons. Select exactly which sizes you need.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Chip color="primary" variant="flat" size="sm">
              Multi-Resolution
            </Chip>
            <Chip color="secondary" variant="flat" size="sm">
              Custom Sizes
            </Chip>
            <Chip color="success" variant="flat" size="sm">
              Favicon Ready
            </Chip>
          </div>
        </div>

        {/* Main Content */}
        {!originalFile ? (
          <div className="max-w-2xl mx-auto">
            <ImageUpload onImageSelect={handleImageSelect} />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Compact Image Preview */}
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardBody className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Image Preview */}
                  <div className="lg:w-64 flex-shrink-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Original Image
                        </h3>
                        {originalDimensions && (
                          <Chip size="sm" variant="flat" color="default">
                            {originalDimensions.width} ×{" "}
                            {originalDimensions.height}
                          </Chip>
                        )}
                      </div>
                      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg overflow-hidden flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                        <img
                          src={originalUrl}
                          alt="Original"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Size Selection - Compact */}
                  <div className="flex-1 space-y-4">
                    {/* Presets */}
                    <div>
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Quick Presets
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                            className="justify-start h-auto py-2"
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
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Select Sizes ({selectedSizes.length} selected)
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
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
                                  <Check className="w-3 h-3" />
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
                        <div className="p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <div className="flex items-start gap-2">
                            <Info className="w-3 h-3 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
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

            {/* Compact Action Bar */}
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardBody className="p-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 text-sm text-gray-600 dark:text-gray-400">
                    {selectedSizes.length > 0 ? (
                      <span>
                        <strong className="text-gray-900 dark:text-gray-100">
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
                      startContent={<RotateCcw className="w-4 h-4" />}
                      className="flex-1 sm:flex-initial"
                    >
                      New
                    </Button>
                    <Button
                      size="lg"
                      onPress={handleConvert}
                      isLoading={isProcessing}
                      isDisabled={selectedSizes.length === 0}
                      className="flex-1 sm:flex-initial bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg hover:scale-102 transition-all duration-300 font-bold overflow-hidden"
                      startContent={
                        !isProcessing ? (
                          <FileImage className="w-4 h-4" />
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
                        startContent={<Download className="w-4 h-4" />}
                        className="flex-1 sm:flex-initial font-bold"
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
